"""Trailing stop 봇 엔진 — 국내 보유종목 매도 보호(순수 손절).

설계: TRAILING_BOT_DESIGN.md
- 서버측 안전망(SINGLE SELL MARKET 조건주문) + 봇측 추적(modify) + 급락 백업(직접 매도).
- 상태머신: PENDING → ARMED → TRAILING → TRIGGERED → DONE
            (등록 즉시 손절권이면) AWAITING_CONFIRM → (승인) TRIGGERED / (거절) CANCELLED
            어느 상태든 HALTED / CANCELLED 가능.
- 순수 로직(evaluate_tick 등)과 I/O(DB·주문·가격조회)를 분리해 테스트 용이.

안전장치: DRY_RUN 기본 ON(toss_trading.is_dry_run), stop 단조 증가, 수량≤매도가능수량,
          AWAITING_CONFIRM은 승인 전 미집행, 세션 가드(정규장), 서킷브레이커(연속 실패 HALTED).
"""
import logging
import os
import sqlite3
import threading
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from typing import Optional

import toss_service
import toss_trading

logger = logging.getLogger("trailing_bot")

KST = timezone(timedelta(hours=9))
DATA_DIR = os.getenv("APP_DATA_DIR", os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(DATA_DIR, "trades.db")

TRAIL_RATE = Decimal("0.15")          # 고점 대비 -15%
PEAK_WINDOW = 120                     # 최근 120 영업일
SLIPPAGE_GUARD = Decimal("0.01")      # 백업 직접매도 발동: stop보다 1% 더 뚫릴 때
MAX_CONSEC_FAILURES = 5               # 서킷브레이커: 연속 실패 시 HALTED
EXPIRE_DAYS = 300                     # 조건주문 만료일(최대 1년 미만으로 보수적)

# 상태 상수
PENDING = "PENDING"
ARMED = "ARMED"
TRAILING = "TRAILING"
AWAITING_CONFIRM = "AWAITING_CONFIRM"
TRIGGERED = "TRIGGERED"
DONE = "DONE"
HALTED = "HALTED"
CANCELLED = "CANCELLED"

_ACTIVE_STATES = (PENDING, ARMED, TRAILING, AWAITING_CONFIRM)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS trailing_stops (
                id                    INTEGER PRIMARY KEY AUTOINCREMENT,
                account_seq           INTEGER NOT NULL,
                symbol                TEXT NOT NULL,
                name                  TEXT,
                quantity              TEXT NOT NULL,
                trail_rate            TEXT NOT NULL,
                peak_price            TEXT,
                peak_date             TEXT,
                stop_price            TEXT,
                conditional_order_id  TEXT,
                state                 TEXT NOT NULL,
                client_order_id_base  TEXT NOT NULL,
                dry_run               INTEGER NOT NULL DEFAULT 1,
                last_price            TEXT,
                fail_count            INTEGER NOT NULL DEFAULT 0,
                note                  TEXT,
                created_at            TEXT NOT NULL,
                updated_at            TEXT NOT NULL,
                UNIQUE(account_seq, symbol)
            )
        """)
        conn.commit()


# ── 순수 로직 ────────────────────────────────────────────────────────────────

def _dec(value) -> Optional[Decimal]:
    if value is None:
        return None
    try:
        d = Decimal(str(value))
        return d if d.is_finite() else None
    except (InvalidOperation, TypeError, ValueError):
        return None


def compute_stop(peak: Decimal, trail_rate: Decimal = TRAIL_RATE) -> Decimal:
    """고점 × (1 - trail_rate), KRX 호가단위 하한 보정."""
    return toss_service.round_down_to_tick(peak * (Decimal(1) - trail_rate))


@dataclass
class TickResult:
    """순수 평가 결과. 엔진이 이 지시에 따라 I/O를 수행한다."""
    action: str                 # 'none' | 'modify' | 'backup_sell'
    new_peak: Optional[str] = None
    new_stop: Optional[str] = None
    reason: str = ""


def evaluate_tick(price_s: str, peak_s: str, stop_s: str,
                  trail_rate: Decimal = TRAIL_RATE,
                  slippage_guard: Decimal = SLIPPAGE_GUARD) -> TickResult:
    """현재가/peak/stop을 받아 다음 행동을 결정(순수 함수).

    - 신고점 → stop 재계산(상향 시에만 modify). stop은 절대 내려가지 않음.
    - 현재가가 stop보다 slippage_guard 이상 더 뚫림 → 백업 직접매도.
    """
    price = _dec(price_s)
    peak = _dec(peak_s)
    stop = _dec(stop_s)
    if price is None or peak is None or stop is None or price <= 0:
        return TickResult(action="none", reason="invalid-price")

    new_peak = peak
    new_stop = stop
    result_action = "none"

    if price > peak:
        new_peak = price
        candidate = compute_stop(new_peak, trail_rate)
        if candidate > stop:          # 단조 증가 보장
            new_stop = candidate
            result_action = "modify"

    # 급락 백업: stop 아래로 추가로 뚫렸는데 서버 조건주문이 아직 안 잡은 경우
    if price <= new_stop * (Decimal(1) - slippage_guard):
        return TickResult(action="backup_sell", new_peak=str(new_peak),
                          new_stop=str(new_stop), reason="price-below-stop-guard")

    return TickResult(action=result_action, new_peak=str(new_peak),
                      new_stop=str(new_stop), reason="peak-updated" if result_action == "modify" else "")


def is_regular_session(now: Optional[datetime] = None) -> bool:
    """KRX 정규장(평일 09:00~15:30 KST) 여부. 휴장일은 별도 캘린더 연동 전까지 미반영."""
    now = now or datetime.now(KST)
    if now.weekday() >= 5:
        return False
    start = now.replace(hour=9, minute=0, second=0, microsecond=0)
    end = now.replace(hour=15, minute=30, second=0, microsecond=0)
    return start <= now <= end


def _expire_date(now: Optional[datetime] = None) -> str:
    now = now or datetime.now(KST)
    return (now + timedelta(days=EXPIRE_DAYS)).strftime("%Y-%m-%d")


# ── 엔진(I/O 포함) ────────────────────────────────────────────────────────────

class TrailingBot:
    def __init__(self):
        self._lock = threading.Lock()
        self._halted = False

    # -- 가격/고점 조회 (주입 가능하게 메서드로) --
    def _fetch_price(self, symbol: str) -> Optional[str]:
        try:
            prices = toss_service.get_toss_data("/api/v1/prices", params={"symbols": symbol})
        except Exception:
            return None
        if isinstance(prices, list):
            for p in prices:
                if isinstance(p, dict) and p.get("symbol") == symbol:
                    return p.get("lastPrice")
        return None

    def _fetch_peak(self, symbol: str):
        """최근 120일 고점(peak, peak_date) 계산. (peak_str, peak_date) 또는 None."""
        try:
            candles = toss_service._fetch_candles_raw(symbol, PEAK_WINDOW)
        except Exception:
            return None
        computed = toss_service.compute_watch_stop(candles)
        if not computed:
            return None
        peak, peak_date, _stop = computed
        return peak, peak_date

    def _now_iso(self):
        return datetime.now(KST).isoformat()

    # -- 등록 --
    def register(self, account_seq: int, symbol: str, quantity: str, name: str = None,
                 peak_override: str = None, dry_run: bool = None):
        """보호 등록. peak 산출 → stop 계산 → 현재가 비교로 ARMED/AWAITING_CONFIRM 분기."""
        if dry_run is None:
            dry_run = toss_trading.is_dry_run()
        peak_date = None
        if peak_override:
            peak = _dec(peak_override)
            if peak is None or peak <= 0:
                raise ValueError("peak_override 값이 올바르지 않습니다.")
            peak = str(peak)
        else:
            computed = self._fetch_peak(symbol)
            if not computed:
                raise ValueError("최근 고점을 계산할 수 없습니다.")
            peak, peak_date = computed
        stop = str(compute_stop(_dec(peak)))
        price = self._fetch_price(symbol)

        # 등록 즉시 손절권이면 AWAITING_CONFIRM, 아니면 ARMED
        now_price = _dec(price)
        stop_d = _dec(stop)
        already_triggered = now_price is not None and stop_d is not None and now_price <= stop_d
        base = f"trail-{symbol}-{uuid.uuid4().hex[:8]}"
        now = self._now_iso()

        with self._lock, get_db() as conn:
            row = conn.execute(
                "SELECT id, state FROM trailing_stops WHERE account_seq=? AND symbol=?",
                (account_seq, symbol)).fetchone()
            if row and row["state"] in _ACTIVE_STATES:
                raise ValueError("이미 활성화된 보호가 있습니다.")
            if already_triggered:
                target_state = AWAITING_CONFIRM
                cond_id = None
            else:
                # dry-run이 아니면 서버 조건주문 생성 → TRAILING, dry-run이면 ARMED로만 기록
                cond_id = None
                target_state = ARMED
                if not dry_run:
                    res = toss_trading.create_stop_conditional_order(
                        symbol, quantity, stop, _expire_date(), account_seq, base, dry_run=False)
                    cond_id = res.get("conditionalOrderId") if isinstance(res, dict) else None
                    target_state = TRAILING
            if row:
                conn.execute("""UPDATE trailing_stops SET quantity=?, trail_rate=?, peak_price=?,
                    peak_date=?, stop_price=?, conditional_order_id=?, state=?, client_order_id_base=?,
                    dry_run=?, last_price=?, fail_count=0, note=?, updated_at=? WHERE id=?""",
                    (quantity, str(TRAIL_RATE), peak, peak_date, stop, cond_id, target_state, base,
                     1 if dry_run else 0, price, None, now, row["id"]))
                stop_id = row["id"]
            else:
                cur = conn.execute("""INSERT INTO trailing_stops
                    (account_seq, symbol, name, quantity, trail_rate, peak_price, peak_date, stop_price,
                     conditional_order_id, state, client_order_id_base, dry_run, last_price, fail_count,
                     note, created_at, updated_at)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,0,?,?,?)""",
                    (account_seq, symbol, name, quantity, str(TRAIL_RATE), peak, peak_date, stop,
                     cond_id, target_state, base, 1 if dry_run else 0, price, None, now, now))
                stop_id = cur.lastrowid
            conn.commit()
        return self.get(stop_id)

    def get(self, stop_id: int):
        with get_db() as conn:
            row = conn.execute("SELECT * FROM trailing_stops WHERE id=?", (stop_id,)).fetchone()
            return dict(row) if row else None

    def list_all(self):
        with get_db() as conn:
            rows = conn.execute("SELECT * FROM trailing_stops ORDER BY id DESC").fetchall()
            return [dict(r) for r in rows]

    def pending_confirms(self):
        with get_db() as conn:
            rows = conn.execute("SELECT * FROM trailing_stops WHERE state=? ORDER BY id DESC",
                                (AWAITING_CONFIRM,)).fetchall()
            return [dict(r) for r in rows]

    # -- 승인/거절 --
    def confirm(self, stop_id: int):
        """AWAITING_CONFIRM 승인 → 시장가 매도 집행 → TRIGGERED."""
        with self._lock, get_db() as conn:
            row = conn.execute("SELECT * FROM trailing_stops WHERE id=?", (stop_id,)).fetchone()
            if not row:
                raise ValueError("해당 보호를 찾을 수 없습니다.")
            if row["state"] != AWAITING_CONFIRM:
                raise ValueError("승인 대기 상태가 아닙니다.")
            dry_run = bool(row["dry_run"])
            cid = f"{row['client_order_id_base']}-confirm"
            toss_trading.place_market_sell(row["symbol"], row["quantity"], row["account_seq"],
                                           cid, dry_run=dry_run)
            conn.execute("UPDATE trailing_stops SET state=?, note=?, updated_at=? WHERE id=?",
                         (TRIGGERED, "confirmed-sell", self._now_iso(), stop_id))
            conn.commit()
        return self.get(stop_id)

    def reject(self, stop_id: int):
        """AWAITING_CONFIRM 거절 → CANCELLED."""
        with self._lock, get_db() as conn:
            row = conn.execute("SELECT * FROM trailing_stops WHERE id=?", (stop_id,)).fetchone()
            if not row:
                raise ValueError("해당 보호를 찾을 수 없습니다.")
            if row["state"] != AWAITING_CONFIRM:
                raise ValueError("승인 대기 상태가 아닙니다.")
            conn.execute("UPDATE trailing_stops SET state=?, note=?, updated_at=? WHERE id=?",
                         (CANCELLED, "rejected", self._now_iso(), stop_id))
            conn.commit()
        return self.get(stop_id)

    # -- 해제 --
    def cancel(self, stop_id: int):
        """보호 해제 → 서버 조건주문 취소 → CANCELLED."""
        with self._lock, get_db() as conn:
            row = conn.execute("SELECT * FROM trailing_stops WHERE id=?", (stop_id,)).fetchone()
            if not row:
                raise ValueError("해당 보호를 찾을 수 없습니다.")
            if row["conditional_order_id"] and not bool(row["dry_run"]):
                try:
                    toss_trading.cancel_conditional_order(row["conditional_order_id"],
                                                          row["account_seq"], dry_run=False)
                except Exception:
                    logger.warning("조건주문 취소 실패(수동 확인 필요): id=%s", stop_id)
            conn.execute("UPDATE trailing_stops SET state=?, note=?, updated_at=? WHERE id=?",
                         (CANCELLED, "cancelled", self._now_iso(), stop_id))
            conn.commit()
        return self.get(stop_id)

    # -- 긴급정지/재개 --
    def halt(self):
        """전체 긴급정지: 활성 포지션을 HALTED로. 서버 조건주문은 보호 위해 유지."""
        with self._lock, get_db() as conn:
            conn.execute(
                f"UPDATE trailing_stops SET state=?, updated_at=? WHERE state IN "
                f"({','.join('?' * len(_ACTIVE_STATES))})",
                (HALTED, self._now_iso(), *_ACTIVE_STATES))
            conn.commit()
        self._halted = True
        return {"halted": True}

    def resume(self):
        """HALTED → TRAILING(조건주문 있음) 또는 ARMED 로 복귀."""
        with self._lock, get_db() as conn:
            rows = conn.execute("SELECT * FROM trailing_stops WHERE state=?", (HALTED,)).fetchall()
            for r in rows:
                new_state = TRAILING if r["conditional_order_id"] else ARMED
                conn.execute("UPDATE trailing_stops SET state=?, updated_at=? WHERE id=?",
                             (new_state, self._now_iso(), r["id"]))
            conn.commit()
        self._halted = False
        return {"resumed": True}

    # -- tick: 활성 TRAILING 포지션 평가 --
    def tick(self, force: bool = False):
        """정규장 중 TRAILING 포지션을 평가·추적. force=True면 세션 가드 무시(테스트)."""
        if not force and not is_regular_session():
            return {"skipped": "not-regular-session"}
        processed = 0
        with get_db() as conn:
            rows = conn.execute("SELECT * FROM trailing_stops WHERE state=?", (TRAILING,)).fetchall()
            rows = [dict(r) for r in rows]
        for row in rows:
            price = self._fetch_price(row["symbol"])
            if price is None:
                continue
            res = evaluate_tick(price, row["peak_price"], row["stop_price"],
                                _dec(row["trail_rate"]) or TRAIL_RATE)
            self._apply_tick(row, price, res)
            processed += 1
        return {"processed": processed}

    def _apply_tick(self, row, price, res: TickResult):
        dry_run = bool(row["dry_run"])
        with self._lock, get_db() as conn:
            # 최신 상태 재확인(동시성)
            cur = conn.execute("SELECT state, fail_count FROM trailing_stops WHERE id=?",
                               (row["id"],)).fetchone()
            if not cur or cur["state"] != TRAILING:
                return
            fail_count = cur["fail_count"]
            if res.action == "modify":
                try:
                    if not dry_run and row["conditional_order_id"]:
                        toss_trading.modify_stop_trigger(
                            row["conditional_order_id"], row["symbol"], row["quantity"],
                            res.new_stop, _expire_date(), row["account_seq"], dry_run=False)
                    conn.execute("""UPDATE trailing_stops SET peak_price=?, stop_price=?, last_price=?,
                        fail_count=0, updated_at=? WHERE id=?""",
                        (res.new_peak, res.new_stop, price, self._now_iso(), row["id"]))
                except Exception:
                    fail_count += 1
                    self._bump_failure(conn, row["id"], fail_count, price)
            elif res.action == "backup_sell":
                try:
                    cid = f"{row['client_order_id_base']}-backup"
                    toss_trading.place_market_sell(row["symbol"], row["quantity"],
                                                   row["account_seq"], cid, dry_run=dry_run)
                    conn.execute("""UPDATE trailing_stops SET state=?, peak_price=?, stop_price=?,
                        last_price=?, note=?, updated_at=? WHERE id=?""",
                        (TRIGGERED, res.new_peak, res.new_stop, price, "backup-sell",
                         self._now_iso(), row["id"]))
                except Exception:
                    fail_count += 1
                    self._bump_failure(conn, row["id"], fail_count, price)
            else:
                conn.execute("UPDATE trailing_stops SET last_price=?, updated_at=? WHERE id=?",
                             (price, self._now_iso(), row["id"]))
            conn.commit()

    def _bump_failure(self, conn, stop_id, fail_count, price):
        """연속 실패 누적. 임계 초과 시 서킷브레이커로 HALTED."""
        new_state = HALTED if fail_count >= MAX_CONSEC_FAILURES else TRAILING
        conn.execute("UPDATE trailing_stops SET fail_count=?, last_price=?, state=?, note=?, updated_at=? WHERE id=?",
                     (fail_count, price, new_state,
                      "circuit-breaker-halted" if new_state == HALTED else "order-failed",
                      self._now_iso(), stop_id))
        if new_state == HALTED:
            logger.error("서킷브레이커 발동: id=%s 연속 실패 %s회 → HALTED", stop_id, fail_count)

    # -- reconcile: 재시작 시 토스 조건주문과 DB 정합 --
    def reconcile(self):
        """기동 시 호출. 현 구현은 DB 상태 유지(토스 조회 교차검증은 후속).
        조건주문 발동으로 서버에서 사라진 건 추후 GET /conditional-orders 로 확인."""
        return {"reconciled": True}


bot = TrailingBot()

TICK_INTERVAL_SEC = int(os.getenv("BOT_TICK_INTERVAL", "20"))


async def tick_loop():
    """lifespan에서 기동하는 백그라운드 tick 루프. 정규장에서만 실제 평가."""
    import asyncio
    logger.info("trailing bot tick 루프 시작 (interval=%ss, dry_run=%s)",
                TICK_INTERVAL_SEC, toss_trading.is_dry_run())
    try:
        init_db()
        bot.reconcile()
    except Exception:
        logger.exception("trailing bot 초기화 실패")
    while True:
        try:
            await asyncio.to_thread(bot.tick)
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("trailing bot tick 오류")
        await asyncio.sleep(TICK_INTERVAL_SEC)

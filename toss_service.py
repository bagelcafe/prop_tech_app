import json
import os
import threading
import time
from decimal import Decimal, InvalidOperation

import requests
from fastapi import APIRouter, HTTPException, Path, Query, Response


router = APIRouter(prefix="/api/toss", tags=["toss"])
BASE_URL = "https://openapi.tossinvest.com"
_token_lock = threading.Lock()
_token = None
_token_expires_at = 0.0


def get_token(previous_token=None):
    global _token, _token_expires_at
    with _token_lock:
        if _token and _token_expires_at > time.monotonic() and _token != previous_token:
            return _token
        client_id = os.getenv("Toss_client_id", "").strip().strip("\"'")
        client_secret = os.getenv("Toss_secret_key", "").strip().strip("\"'")
        if not client_id or not client_secret:
            raise HTTPException(status_code=503, detail="토스 API 인증 정보가 설정되지 않았습니다.")
        try:
            response = requests.post(
                f"{BASE_URL}/oauth2/token",
                data={"grant_type": "client_credentials", "client_id": client_id, "client_secret": client_secret},
                timeout=15,
            )
            if not response.ok:
                detail = "토스 인증에 실패했습니다. 인증 정보와 허용 IP를 확인하세요."
                raise HTTPException(status_code=502, detail=detail)
            data = response.json()
            token = data.get("access_token")
            expires_in = int(data.get("expires_in", 0))
            if not token or expires_in <= 0:
                raise ValueError("Invalid token response")
            _token = token
            _token_expires_at = time.monotonic() + max(0, expires_in - 60)
            return _token
        except (requests.RequestException, ValueError, TypeError):
            raise HTTPException(status_code=502, detail="토스 인증 서버에 연결할 수 없습니다.") from None


RATE_LIMIT_RETRIES = 3


def get_toss_data(path, params=None, account_seq=None):
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    if account_seq is not None:
        headers["X-Tossinvest-Account"] = str(account_seq)
    try:
        response = None
        for attempt in range(RATE_LIMIT_RETRIES + 1):
            response = requests.get(
                f"{BASE_URL}{path}", params=params, headers=headers, timeout=15,
            )
            if response.status_code == 401:
                token = get_token(previous_token=token)
                headers["Authorization"] = f"Bearer {token}"
                response = requests.get(
                    f"{BASE_URL}{path}", params=params, headers=headers, timeout=15,
                )
            if response.status_code != 429 or attempt == RATE_LIMIT_RETRIES:
                break
            # 계좌 API 는 초당 1회 제한이므로 Retry-After 만큼 대기 후 재시도
            try:
                wait = float(response.headers.get("Retry-After", 1))
            except (TypeError, ValueError):
                wait = 1.0
            time.sleep(min(max(wait, 0.5), 5) + 0.1)
        if not response.ok:
            status = response.status_code if response.status_code in (400, 403, 404, 429) else 502
            raise HTTPException(status_code=status, detail=f"토스 조회에 실패했습니다. (HTTP {response.status_code})")
        data = response.json()
        if "result" not in data:
            raise ValueError("Invalid response")
        return data["result"]
    except (requests.RequestException, ValueError, TypeError, AttributeError):
        raise HTTPException(status_code=502, detail="토스 시세 서버에 연결할 수 없습니다.") from None


def get_market_data(path, symbol):
    result = get_toss_data(path, params={"symbols": symbol})
    if not isinstance(result, list):
        raise HTTPException(status_code=502, detail="토스 응답 형식이 올바르지 않습니다.")
    return result


@router.get("/holdings")
def get_holdings(response: Response):
    response.headers["Cache-Control"] = "no-store"
    accounts = get_toss_data("/api/v1/accounts")
    if not isinstance(accounts, list):
        raise HTTPException(status_code=502, detail="토스 계좌 응답 형식이 올바르지 않습니다.")
    holdings = []
    for account in accounts:
        if not isinstance(account, dict) or account.get("accountSeq") is None:
            raise HTTPException(status_code=502, detail="토스 계좌 응답 형식이 올바르지 않습니다.")
        overview = get_toss_data("/api/v1/holdings", account_seq=account["accountSeq"])
        if not isinstance(overview, dict) or not isinstance(overview.get("items"), list):
            raise HTTPException(status_code=502, detail="토스 보유종목 응답 형식이 올바르지 않습니다.")
        holdings.append({"account_seq": account["accountSeq"], "items": overview["items"]})
    items = [item for account in holdings for item in account["items"]]
    if any(not isinstance(item, dict) for item in items):
        raise HTTPException(status_code=502, detail="토스 보유종목 응답 형식이 올바르지 않습니다.")
    currencies = {item.get("currency") for item in items}
    if currencies - {"KRW", "USD"}:
        raise HTTPException(status_code=502, detail="지원하지 않는 토스 자산 통화가 있습니다.")
    rate = None
    if "USD" in currencies:
        exchange = get_toss_data("/api/v1/exchange-rate", params={"baseCurrency": "USD", "quoteCurrency": "KRW"})
        try:
            rate = Decimal(str(exchange["rate"]))
            if not rate.is_finite() or rate <= 0:
                raise ValueError
        except (KeyError, TypeError, InvalidOperation, ValueError):
            raise HTTPException(status_code=502, detail="토스 환율 정보가 올바르지 않습니다.") from None
    buy = Decimal(0)
    value = Decimal(0)
    try:
        for item in items:
            factor = rate if item["currency"] == "USD" else Decimal(1)
            purchase = Decimal(str(item["marketValue"]["purchaseAmount"]))
            amount = Decimal(str(item["marketValue"]["amount"]))
            if not purchase.is_finite() or not amount.is_finite() or purchase < 0 or amount < 0:
                raise ValueError
            buy += purchase * factor
            value += amount * factor
    except (KeyError, TypeError, InvalidOperation, ValueError):
        raise HTTPException(status_code=502, detail="토스 보유자산 금액이 올바르지 않습니다.") from None
    return {"accounts": holdings, "exchange_rate": str(rate) if rate else None,
            "total_buy_krw": str(buy), "total_eval_krw": str(value)}


@router.get("/stocks/{symbol}")
def get_stock(symbol: str = Path(..., min_length=1, max_length=30, regex=r"^[A-Za-z0-9.\-]+$")):
    stocks = get_market_data("/api/v1/stocks", symbol)
    if not stocks:
        raise HTTPException(status_code=404, detail="종목을 찾을 수 없습니다.")
    prices = get_market_data("/api/v1/prices", symbol)
    return {"stock": stocks[0], "price": prices[0] if prices else None}


MARKETS = ("KOSPI", "KOSDAQ", "KR_ETC", "NASDAQ", "NYSE", "AMEX", "US_ETC")
UNIVERSE_TTL = 24 * 3600
_universe_lock = threading.Lock()
_universe = {}
_universe_path = os.path.join(os.getenv("APP_DATA_DIR") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "data"), "toss_stocks.json")


def _load_universe():
    """마켓별 종목 목록을 하루 1회만 조회하고 파일에 캐시 (조회 제한 대비)"""
    if not _universe and os.path.exists(_universe_path):
        try:
            with open(_universe_path, encoding="utf-8") as f:
                _universe.update(json.load(f))
        except (OSError, ValueError):
            pass
    changed = False
    for market in MARKETS:
        entry = _universe.get(market)
        if entry and time.time() - entry["at"] < UNIVERSE_TTL:
            continue
        items = None
        for attempt in range(4):
            try:
                items = get_toss_data("/api/v1/stocks/all", params={"market": market})
                break
            except HTTPException as e:
                if e.status_code != 429:
                    break
                time.sleep(3 * (attempt + 1))
        if items is None:
            continue
        if not isinstance(items, list):
            continue
        _universe[market] = {"at": time.time(), "items": [
            {"symbol": i["symbol"], "name": i.get("name", ""), "market": market}
            for i in items if isinstance(i, dict) and "symbol" in i]}
        changed = True
        time.sleep(1)
    if changed:
        try:
            os.makedirs(os.path.dirname(_universe_path), exist_ok=True)
            with open(_universe_path, "w", encoding="utf-8") as f:
                json.dump(_universe, f, ensure_ascii=False)
        except OSError:
            pass


@router.get("/search")
def search_stocks(q: str = Query(..., min_length=1, max_length=30), limit: int = Query(20, ge=1, le=50),
                  scope: str = Query("all", regex=r"^(all|kr)$")):
    """종목명(또는 코드)으로 검색. 이름이 앞부분부터 일치하는 종목을 우선 정렬"""
    with _universe_lock:
        _load_universe()
        markets = MARKETS[:3] if scope == "kr" else MARKETS
        stocks = [i for m in markets for i in _universe.get(m, {}).get("items", [])]
    if not stocks:
        raise HTTPException(status_code=502, detail="종목 목록을 불러올 수 없습니다. 잠시 후 다시 시도하세요.")
    needle = q.strip().lower().replace(" ", "")
    scored = []
    for item in stocks:
        name = item["name"].lower().replace(" ", "")
        symbol = item["symbol"].lower()
        if name == needle or symbol == needle:
            rank = 0
        elif name.startswith(needle) or symbol.startswith(needle):
            rank = 1
        elif needle in name:
            rank = 2
        else:
            continue
        scored.append((rank, len(name), item))
    scored.sort(key=lambda x: (x[0], x[1]))
    return [item for _, _, item in scored[:limit]]


# ── 캔들 리샘플 (토스는 1m/1d만 제공 → 30분/주/월봉은 집계) ────────────────────
def _agg_bucket(rows):
    """같은 버킷의 1m/1d 캔들 리스트를 OHLCV 하나로 집계. rows는 시간 오름차순."""
    o = rows[0]["openPrice"]
    c = rows[-1]["closePrice"]
    high = max((r["highPrice"] for r in rows), key=lambda x: Decimal(str(x)))
    low = min((r["lowPrice"] for r in rows), key=lambda x: Decimal(str(x)))
    vol = 0
    for r in rows:
        try:
            vol += int(float(r.get("volume") or 0))
        except (TypeError, ValueError):
            pass
    return o, high, low, c, str(vol)


def _iso_dt(ts):
    """ISO8601 timestamp 문자열을 naive datetime 으로 파싱."""
    from datetime import datetime as _dt
    return _dt.fromisoformat(ts.replace("Z", "+00:00").split("+")[0])


def resample_candles(raw, interval):
    """raw(토스 원본, 최신→과거 순 가정)를 interval 로 집계해 과거→최근 순 dict 리스트 반환.

    interval: '30m'(1m 입력), '1d'(1d 입력, 집계 없음), '1w'/'1M'(1d 입력 집계).
    key 함수로 버킷을 묶는다.
    """
    from datetime import timedelta
    ordered = list(reversed(raw))  # 과거→최근
    if interval == "1d":
        return [{"date": c["timestamp"][:10], "open": c["openPrice"], "high": c["highPrice"],
                 "low": c["lowPrice"], "close": c["closePrice"], "volume": c["volume"]} for c in ordered]

    if interval == "30m":
        def bucket_key(c):
            dt = _iso_dt(c["timestamp"])
            half = 0 if dt.minute < 30 else 30
            b = dt.replace(minute=half, second=0, microsecond=0)
            return b.strftime("%Y-%m-%d %H:%M")
        label = lambda k, rows: k  # noqa: E731
    elif interval == "1w":
        def bucket_key(c):
            dt = _iso_dt(c["timestamp"]).date()
            monday = dt - timedelta(days=dt.weekday())
            return monday.isoformat()
        label = lambda k, rows: k  # noqa: E731
    elif interval == "1M":
        def bucket_key(c):
            return c["timestamp"][:7]  # YYYY-MM
        label = lambda k, rows: k  # noqa: E731
    else:
        raise HTTPException(status_code=400, detail="지원하지 않는 봉 단위입니다.")

    buckets = {}
    order = []
    for c in ordered:
        k = bucket_key(c)
        if k not in buckets:
            buckets[k] = []
            order.append(k)
        buckets[k].append(c)
    out = []
    for k in order:
        o, h, l, cl, v = _agg_bucket(buckets[k])
        out.append({"date": label(k, buckets[k]), "open": o, "high": h, "low": l, "close": cl, "volume": v})
    return out


# 사용자 interval → 토스 원본 interval 매핑
_SOURCE_INTERVAL = {"30m": "1m", "1d": "1d", "1w": "1d", "1M": "1d"}
INTRADAY_DAYS = 5          # 30분봉 조회 기간: 최근 5일
_MAX_PAGES = 12            # 페이지네이션 안전 상한(1m 최대 200개 × 12 = 2400개 ≈ 6거래일)


def _fetch_candles_pages(symbol, source_interval, max_pages, stop_before_date=None):
    """candles API를 nextBefore로 페이지네이션하며 최신→과거 순으로 수집.

    stop_before_date: 'YYYY-MM-DD'. 이 날짜보다 과거 봉까지 모으면 중단(기간 제한용).
    반환: 토스 원본 캔들(최신→과거 순) 누적 리스트.
    """
    collected = []
    before = None
    for _ in range(max_pages):
        params = {"symbol": symbol, "interval": source_interval, "count": 200}
        if before:
            params["before"] = before
        result = get_toss_data("/api/v1/candles", params=params)
        if not isinstance(result, dict):
            raise HTTPException(status_code=502, detail="토스 응답 형식이 올바르지 않습니다.")
        page = result.get("candles")
        if not isinstance(page, list):
            raise HTTPException(status_code=502, detail="토스 응답 형식이 올바르지 않습니다.")
        collected.extend(page)
        before = result.get("nextBefore")
        # 기간 제한: 가장 오래된(=마지막) 봉이 목표 날짜보다 과거면 중단
        if stop_before_date and page:
            oldest = page[-1].get("timestamp", "")[:10]
            if oldest and oldest <= stop_before_date:
                break
        if not before:
            break
    return collected


@router.get("/stocks/{symbol}/candles")
def get_candles(symbol: str = Path(..., min_length=1, max_length=30, regex=r"^[A-Za-z0-9.\-]+$"),
                count: int = Query(200, ge=1, le=200),
                interval: str = Query("1d", regex=r"^(30m|1d|1w|1M)$")):
    """봉 데이터(과거→최근 순). 토스는 1m/1d만 제공하므로 30분/주/월봉은 서버에서 집계.

    30분봉: 토스 1m 은 1회 200개 제한이라, 최근 5일치 1분봉을 페이지네이션으로 모아 집계한다.
    주봉/월봉: 1d 를 집계. 일봉: 그대로.
    """
    source = _SOURCE_INTERVAL[interval]

    if interval == "30m":
        from datetime import datetime, timedelta, timezone
        kst = timezone(timedelta(hours=9))
        # 최근 5거래일을 포함하도록 달력일 기준 넉넉히(주말 포함) 과거까지 수집
        stop_date = (datetime.now(kst) - timedelta(days=INTRADAY_DAYS + 3)).strftime("%Y-%m-%d")
        raw = _fetch_candles_pages(symbol, source, _MAX_PAGES, stop_before_date=stop_date)
        try:
            aggregated = resample_candles(raw, "30m")
        except (KeyError, ValueError, TypeError):
            raise HTTPException(status_code=502, detail="토스 응답 형식이 올바르지 않습니다.") from None
        # 최근 N거래일만 남긴다(데이터에 존재하는 고유 날짜 기준 → 주말/휴장 자동 제외)
        trading_days = sorted({c["date"][:10] for c in aggregated})
        keep = set(trading_days[-INTRADAY_DAYS:])
        aggregated = [c for c in aggregated if c["date"][:10] in keep]
        return aggregated

    # 주/월봉, 일봉: 단일 페이지(최대 200개) 집계
    factor = {"1w": 5, "1M": 22, "1d": 1}[interval]
    raw_count = min(200, count * factor) if interval != "1d" else count
    result = get_toss_data("/api/v1/candles", params={"symbol": symbol, "interval": source, "count": raw_count})
    candles = result.get("candles") if isinstance(result, dict) else None
    if not isinstance(candles, list):
        raise HTTPException(status_code=502, detail="토스 응답 형식이 올바르지 않습니다.")
    try:
        aggregated = resample_candles(candles, interval)
    except (KeyError, ValueError, TypeError):
        raise HTTPException(status_code=502, detail="토스 응답 형식이 올바르지 않습니다.") from None
    return aggregated[-count:]


# ── 매도 보호(trailing stop) 감시 계산 ────────────────────────────────────────
# 설계: TRAILING_BOT_DESIGN.md (국내 순수 손절, 고점 대비 -15%, MARKET)
TRAIL_RATE = Decimal("0.15")          # 고점 대비 -15%
PEAK_WINDOW = 120                     # 최근 120 영업일 고점
DEFAULT_WATCH = [{"symbol": "053800", "name": "안랩", "market": "KOSPI"}]


def krx_tick_size(price: Decimal) -> Decimal:
    """KRX 가격대별 호가단위. 출시 전 최신 기준 재확인 필요."""
    if price < 2000:
        return Decimal("1")
    if price < 5000:
        return Decimal("5")
    if price < 20000:
        return Decimal("10")
    if price < 50000:
        return Decimal("50")
    if price < 200000:
        return Decimal("100")
    if price < 500000:
        return Decimal("500")
    return Decimal("1000")


def round_down_to_tick(price: Decimal) -> Decimal:
    """매도 trigger는 하한(내림) 방향으로 호가단위 보정."""
    tick = krx_tick_size(price)
    return (price // tick) * tick


def compute_watch_stop(candles, trail_rate=TRAIL_RATE, window=PEAK_WINDOW):
    """candles(과거→최근 순 dict 리스트)로 120일 고점·손절가 계산.

    반환: (peak_price:str, peak_date:str, stop_price:str) 또는 데이터 없으면 None.
    """
    recent = candles[-window:] if len(candles) > window else candles
    peak = None
    peak_date = None
    for c in recent:
        try:
            high = Decimal(str(c["high"]))
        except (KeyError, TypeError, InvalidOperation):
            continue
        if not high.is_finite() or high <= 0:
            continue
        if peak is None or high > peak:
            peak = high
            peak_date = c.get("date")
    if peak is None:
        return None
    stop = round_down_to_tick(peak * (Decimal(1) - trail_rate))
    return str(peak), peak_date, str(stop)


def _fetch_candles_raw(symbol, count):
    result = get_toss_data("/api/v1/candles", params={"symbol": symbol, "interval": "1d", "count": count})
    candles = result.get("candles") if isinstance(result, dict) else None
    if not isinstance(candles, list):
        raise HTTPException(status_code=502, detail="토스 응답 형식이 올바르지 않습니다.")
    return [{"date": c["timestamp"][:10], "high": c["highPrice"], "close": c["closePrice"]}
            for c in reversed(candles)]


@router.get("/watchlist")
def get_watch_stops(response: Response):
    """매도 보호 감시종목 리스트. 각 종목의 현재가·120일 고점(peak)·손절 감시가(stop)."""
    response.headers["Cache-Control"] = "no-store"
    items = []
    symbols = ",".join(w["symbol"] for w in DEFAULT_WATCH)
    prices = {}
    try:
        price_list = get_toss_data("/api/v1/prices", params={"symbols": symbols})
        if isinstance(price_list, list):
            for p in price_list:
                if isinstance(p, dict) and p.get("symbol"):
                    prices[p["symbol"]] = p
    except HTTPException:
        prices = {}
    for w in DEFAULT_WATCH:
        entry = {"symbol": w["symbol"], "name": w["name"], "market": w["market"],
                 "lastPrice": None, "currency": "KRW", "peak": None, "peakDate": None,
                 "stop": None, "trailRate": str(TRAIL_RATE), "error": None}
        price = prices.get(w["symbol"])
        if price:
            entry["lastPrice"] = price.get("lastPrice")
            entry["currency"] = price.get("currency") or "KRW"
        try:
            candles = _fetch_candles_raw(w["symbol"], PEAK_WINDOW)
            computed = compute_watch_stop(candles)
            if computed:
                entry["peak"], entry["peakDate"], entry["stop"] = computed
            else:
                entry["error"] = "고점 데이터를 계산할 수 없습니다."
        except HTTPException:
            entry["error"] = "감시가 계산에 실패했습니다."
        items.append(entry)
    return {"items": items}

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import requests
import uvicorn
import os
import logging
import json
import sqlite3
import asyncio
import time
import websockets
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Optional

logger = logging.getLogger("kiwoom")


@asynccontextmanager
async def lifespan(application: FastAPI):
    if getattr(application.state, "lifecycle_active", False):
        raise RuntimeError("Kiwoom lifespan is already active")

    application.state.lifecycle_active = True
    application.state.snapshot_task = None
    snapshot_task = None
    try:
        try:
            init_db()
        except Exception:
            logger.exception("DB 초기화 실패: %s", DB_PATH)
            raise
        logger.info("DB 초기화 완료: %s", DB_PATH)

        try:
            token = await fetch_access_token()
        except (httpx.HTTPError, ValueError):
            logger.warning("토큰 초기화 실패: 앱 기동을 계속합니다.", exc_info=True)
        else:
            if token:
                logger.info("Token 준비 완료")
            else:
                logger.warning("Token 발급 실패: 앱 기동을 계속합니다.")

        snapshot_task = asyncio.create_task(snapshot_scheduler(), name="kiwoom-snapshot")
        application.state.snapshot_task = snapshot_task
        logger.info("자산 스냅샷 스케줄러 기동됨")
        yield
    finally:
        try:
            if snapshot_task is not None:
                snapshot_task.cancel()
                try:
                    await snapshot_task
                except asyncio.CancelledError:
                    pass
                except Exception:
                    logger.exception("자산 스냅샷 스케줄러 종료 중 오류")
                logger.info("자산 스냅샷 스케줄러 종료됨")
        finally:
            application.state.snapshot_task = None
            application.state.lifecycle_active = False


app = FastAPI(lifespan=lifespan)

# ── 경로 설정 ──────────────────────────────────────────────────────────
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)          # prop_tech_app
ENV_PATH = os.path.join(BASE_DIR, ".env")
DATA_DIR = os.getenv("APP_DATA_DIR", BASE_DIR)

# ── .env 로드 ────────────────────────────────────────────────────────
load_dotenv(ENV_PATH)

APP_KEY = os.getenv("APP_KEY", "")
SECRET_KEY = os.getenv("SECRET_KEY", "")

if not APP_KEY or not SECRET_KEY:
    logger.error(f".env 파일에 APP_KEY / SECRET_KEY 가 없습니다. ({ENV_PATH})")

# ── 키움 API 설정 ─────────────────────────────────────────────────────
KIWOOM_HOST = "https://api.kiwoom.com"
TOKEN_URL   = f"{KIWOOM_HOST}/oauth2/token"
KIWOOM_WEBSOCKET_URL = "wss://api.kiwoom.com:10000/api/dostk/websocket"

# ── SQLite DB ─────────────────────────────────────────────────────────
DB_PATH = os.path.join(DATA_DIR, "trades.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS trades (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                stock_code  TEXT NOT NULL,
                stock_name  TEXT NOT NULL,
                trade_type  TEXT NOT NULL,
                quantity    INTEGER NOT NULL,
                price       INTEGER NOT NULL,
                amount      INTEGER NOT NULL,
                order_no    TEXT,
                account_no  TEXT,
                account_name TEXT,
                trade_date  TEXT NOT NULL,
                memo        TEXT,
                created_at  TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS watchlist (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                stock_code  TEXT NOT NULL UNIQUE,
                stock_name  TEXT NOT NULL,
                added_at    TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS holdings (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                broker         TEXT NOT NULL,
                stock_code     TEXT NOT NULL,
                stock_name     TEXT NOT NULL,
                quantity       INTEGER NOT NULL,
                avg_buy_price  REAL NOT NULL,
                updated_at     TEXT NOT NULL,
                UNIQUE(broker, stock_code)
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS asset_snapshots (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                snapshot_date   TEXT NOT NULL,
                broker          TEXT NOT NULL,
                eval_amount     INTEGER NOT NULL,
                buy_amount      INTEGER NOT NULL,
                created_at      TEXT NOT NULL,
                UNIQUE(snapshot_date, broker)
            )
        """)
        conn.commit()

# ── Pydantic 모델 ─────────────────────────────────────────────────────
class TradeInput(BaseModel):
    stock_code:   str
    stock_name:   str
    trade_type:   str            # 매수 | 매도
    quantity:     int
    price:        int
    amount:       int
    order_no:     Optional[str] = None
    account_no:   Optional[str] = None
    account_name: Optional[str] = None
    trade_date:   str            # YYYYMMDD
    memo:         Optional[str] = None

class TradeUpdateInput(BaseModel):
    quantity: int
    price: int
    amount: int
    trade_date: str

class WatchlistInput(BaseModel):
    stock_code: str
    stock_name: str

# ── 증권사 상수 ───────────────────────────────────────────────────────
BROKERS = {
    "mirae": "미래에셋증권",
    "namuh": "나무증권",
    "toss":  "토스증권",
}

class HoldingInput(BaseModel):
    broker:        str            # mirae | namuh | toss
    stock_code:    str
    stock_name:    str
    quantity:      int
    avg_buy_price: float

class HoldingUpdateInput(BaseModel):
    quantity:      int
    avg_buy_price: float

# 런타임에 보관할 토큰 상태
_token_store: dict = {
    "access_token": "",
    "expires_dt": "",
}


# ── 토큰 발급 함수 ────────────────────────────────────────────────────
async def fetch_access_token() -> str:
    """
    키움 REST API에서 Access Token을 발급받아 _token_store에 저장하고 반환합니다.
    API: POST /oauth2/token  (au10001)
    """
    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "api-id": "au10001",
    }
    body = {
        "grant_type": "client_credentials",
        "appkey": APP_KEY,
        "secretkey": SECRET_KEY,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.post(TOKEN_URL, headers=headers, json=body)

    res_json = res.json()
    return_code = res_json.get("return_code", -1)
    return_msg  = res_json.get("return_msg", "")
    token       = res_json.get("token", "")
    expires_dt  = res_json.get("expires_dt", "")

    if return_code == 0 and token:
        _token_store["access_token"] = token
        _token_store["expires_dt"]   = expires_dt
        logger.info(f"Access Token 발급 성공 (만료: {expires_dt})")
    else:
        logger.error(f"Access Token 발급 실패: [{return_code}] {return_msg}")

    return token


async def get_access_token() -> str:
    """
    현재 보관 중인 토큰을 반환합니다.
    토큰이 없으면 자동으로 발급을 시도합니다.
    """
    if not _token_store["access_token"]:
        await fetch_access_token()
    return _token_store["access_token"]


# ── 라우터 ────────────────────────────────────────────────────────────
@app.get("/")
async def read_root():
    """키움 서브앱 상태 확인 (API only)"""
    return {"status": "ok", "service": "kiwoom-api"}


@app.get("/token/status")
async def token_status():
    """현재 토큰 상태를 반환합니다."""
    token = _token_store["access_token"]
    return {
        "has_token": bool(token),
        "expires_dt": _token_store["expires_dt"],
        "token_preview": f"{token[:15]}..." if token else None,
    }


@app.post("/token/refresh")
async def token_refresh():
    """토큰을 수동으로 재발급합니다."""
    token = await fetch_access_token()
    if token:
        return {
            "success": True,
            "expires_dt": _token_store["expires_dt"],
            "token_preview": f"{token[:15]}...",
        }
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Token 발급 실패. 서버 로그를 확인하세요."},
    )


async def request_condition_websocket(
    body: dict,
) -> dict:
    """키움 WebSocket 로그인 후 조건검색 전문을 요청하고 응답 본문을 반환합니다."""
    access_token = await get_access_token()
    if not access_token:
        raise HTTPException(status_code=401, detail="Access Token이 없습니다.")

    try:
        async with websockets.connect(KIWOOM_WEBSOCKET_URL, open_timeout=10, close_timeout=10) as websocket:
            await websocket.send(json.dumps({"trnm": "LOGIN", "token": access_token}))
            login_response = json.loads(await asyncio.wait_for(websocket.recv(), timeout=15))
            if str(login_response.get("return_code", "0")) != "0":
                raise HTTPException(status_code=401, detail=login_response.get("return_msg", "키움 WebSocket 로그인 실패"))

            await websocket.send(json.dumps(body))
            response = json.loads(await asyncio.wait_for(websocket.recv(), timeout=15))
    except (OSError, asyncio.TimeoutError, websockets.WebSocketException) as error:
        logger.exception("조건검색 WebSocket 요청 실패")
        raise HTTPException(status_code=502, detail=f"조건검색 서버 연결 실패: {error}") from error

    return response.get("body", response)


def normalize_conditions(records: list) -> list[dict]:
    """조건식 목록의 객체형 및 목록형 응답을 동일한 형식으로 변환한다."""
    conditions = []
    for record in records:
        if isinstance(record, dict):
            seq, name = record.get("seq"), record.get("name", "")
        elif isinstance(record, (list, tuple)) and len(record) >= 2:
            seq, name = record[0], record[1]
        else:
            continue
        if seq is not None:
            conditions.append({"seq": str(seq), "name": str(name)})
    return conditions


def normalize_stock_code(value: object) -> str:
    """조건검색 응답의 A005930 형식 코드를 종목조회용 005930으로 변환한다."""
    code = str(value or "")
    return code[1:] if len(code) == 7 and code[0].isalpha() else code


@app.get("/api/conditions")
async def list_conditions():
    """영웅문에서 저장한 사용자 조건검색식 목록을 반환합니다."""
    response = await request_condition_websocket({"trnm": "CNSRLST"})
    if str(response.get("return_code", "0")) != "0":
        raise HTTPException(status_code=400, detail=response.get("return_msg", "조건식 목록 조회 실패"))
    return {"conditions": normalize_conditions(response.get("data", []))}


@app.post("/api/conditions/{seq}/search")
async def search_condition(seq: str):
    """저장된 조건검색식을 일반조회로 실행하고 현재 편입 종목을 반환합니다."""
    if not seq.isdigit():
        raise HTTPException(status_code=422, detail="조건식 번호는 숫자여야 합니다.")

    request_body = {"trnm": "CNSRREQ", "seq": seq, "search_type": "0", "stex_tp": "K"}
    response = await request_condition_websocket(request_body)
    results = []

    while True:
        if str(response.get("return_code", "0")) != "0":
            raise HTTPException(status_code=400, detail=response.get("return_msg", "조건검색 조회 실패"))
        results.extend(response.get("data", []))
        if response.get("cont_yn") != "Y" or not response.get("next_key"):
            break
        response = await request_condition_websocket(
            {**request_body, "cont_yn": "Y", "next_key": response["next_key"]},
        )

    return {
        "seq": seq,
        "items": [
            {
                "stock_code": normalize_stock_code(item.get("9001", "")),
                "stock_name": item.get("302", ""),
                "current_price": item.get("10", ""),
                "change": item.get("11", ""),
                "change_rate": item.get("12", ""),
                "volume": item.get("13", ""),
            }
            for item in results
        ],
    }


# 메모리에 종목 리스트 캐싱
_stock_list_cache: list = []
CACHE_FILE_PATH = os.path.join(CURRENT_DIR, "stock_list_cache.json")

async def fetch_market_list(access_token: str, mrkt_tp: str) -> list:
    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": f"Bearer {access_token}",
        "api-id": "ka10099",
    }
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.post(
            f"{KIWOOM_HOST}/api/dostk/stkinfo",
            headers=headers,
            json={"mrkt_tp": mrkt_tp},
        )
    data = res.json()
    return data.get("list", [])

@app.get("/api/search/{query}")
async def search_stock_by_name(query: str):
    """
    종목명으로 종목코드를 검색합니다.
    API: ka10099 (종목정보 리스트)를 통해 코스피/코스닥 전체를 가져와 필터링.
    """
    access_token = await get_access_token()
    if not access_token:
        return JSONResponse(status_code=401, content={"error": "Access Token이 없습니다."})

    try:
        # 캐시가 비어있으면 우선 로컬 JSON 파일에서 읽기를 시도
        if not _stock_list_cache:
            if os.path.exists(CACHE_FILE_PATH):
                with open(CACHE_FILE_PATH, "r", encoding="utf-8") as f:
                    _stock_list_cache.extend(json.load(f))
                logger.info(f"Loaded {len(_stock_list_cache)} stocks from local JSON file.")
            else:
                # 파일이 없으면 API에서 조회 후 캐싱 및 파일 저장
                kospi_list = await fetch_market_list(access_token, "0")
                kosdaq_list = await fetch_market_list(access_token, "10")
                _stock_list_cache.extend(kospi_list)
                _stock_list_cache.extend(kosdaq_list)
                logger.info(f"Loaded {len(_stock_list_cache)} stocks from API.")
                
                # 파일로 저장
                with open(CACHE_FILE_PATH, "w", encoding="utf-8") as f:
                    json.dump(_stock_list_cache, f, ensure_ascii=False, indent=2)
                logger.info("Saved stock list to local JSON file.")

        # 메모리 캐시에서 검색어(query)가 포함된 종목만 필터링
        query_upper = query.upper()
        results = [
            {"stk_cd": item.get("code", ""), "stk_nm": item.get("name", "")}
            for item in _stock_list_cache
            if item.get("name") and query_upper in item.get("name").upper()
        ]
        
        return {"results": results}

    except Exception as e:
        logger.exception(f"Exception in search_stock_by_name: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/stock/{code}")
async def get_stock_data(code: str):
    access_token = await get_access_token()

    if not access_token:
        return JSONResponse(
            status_code=401,
            content={"error": "Access Token이 없습니다. /token/refresh 를 호출하거나 지정단말기 IP를 확인하세요."},
        )

    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": f"Bearer {access_token}",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            # 1. 주식기본정보요청 (ka10001)
            info_res = await client.post(
                f"{KIWOOM_HOST}/api/dostk/stkinfo",
                headers={**headers, "api-id": "ka10001"},
                json={"stk_cd": code},
            )
            info_data = info_res.json()

            # 토큰 만료 시 재발급 후 1회 재시도
            if info_data.get("return_code") != 0 and info_data.get("return_code") in (8005, 8003, 3):
                logger.warning("Token 만료 감지 – 재발급 시도")
                access_token = await fetch_access_token()
                headers["Authorization"] = f"Bearer {access_token}"
                info_res = await client.post(
                    f"{KIWOOM_HOST}/api/dostk/stkinfo",
                    headers={**headers, "api-id": "ka10001"},
                    json={"stk_cd": code},
                )
                info_data = info_res.json()

            if info_data.get("return_code") != 0:
                logger.error(f"Info API Error: {info_data}")
                return JSONResponse(
                    status_code=400,
                    content={"error": info_data.get("return_msg", "주식 정보 조회 실패")},
                )

            # 2. 주식일봉차트 (ka10081)
            today_str = datetime.today().strftime("%Y%m%d")
            chart_res = await client.post(
                f"{KIWOOM_HOST}/api/dostk/chart",
                headers={**headers, "api-id": "ka10081"},
                json={"stk_cd": code, "base_dt": today_str, "upd_stkpc_tp": "1"},
            )
            chart_data = chart_res.json()
            chart_list = chart_data.get("stk_dt_pole_chart_qry", [])

            return {"info": info_data, "chart": chart_list}

    except Exception as e:
        logger.exception(f"Exception in get_stock_data: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})


# ── 매매이력 API ──────────────────────────────────────────────────────

@app.post("/api/trades")
async def add_trade(trade: TradeInput):
    """매매 이력 추가"""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with get_db() as conn:
        cur = conn.execute(
            """INSERT INTO trades
               (stock_code, stock_name, trade_type, quantity, price, amount,
                order_no, account_no, account_name, trade_date, memo, created_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                trade.stock_code, trade.stock_name, trade.trade_type,
                trade.quantity, trade.price, trade.amount,
                trade.order_no, trade.account_no, trade.account_name,
                trade.trade_date, trade.memo, now,
            ),
        )
        conn.commit()
        new_id = cur.lastrowid
    # 매매이력 변경 시 관심종목 summary 캐시 무효화
    _summary_cache["data"] = None
    _summary_cache["timestamp"] = 0
    return {"success": True, "id": new_id}


@app.get("/api/trades/{stock_code}")
async def get_trades(stock_code: str):
    """특정 종목의 매매 이력 조회"""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM trades WHERE stock_code = ? ORDER BY trade_date DESC, id DESC",
            (stock_code,),
        ).fetchall()
    return {"trades": [dict(r) for r in rows]}


@app.delete("/api/trades/{trade_id}")
async def delete_trade(trade_id: int):
    """매매 이력 삭제"""
    with get_db() as conn:
        affected = conn.execute("DELETE FROM trades WHERE id = ?", (trade_id,)).rowcount
        conn.commit()
    if not affected:
        raise HTTPException(status_code=404, detail="이력을 찾을 수 없습니다.")
    # 매매이력 변경 시 관심종목 summary 캐시 무효화
    _summary_cache["data"] = None
    _summary_cache["timestamp"] = 0
    return {"success": True}


@app.put("/api/trades/{trade_id}")
async def update_trade(trade_id: int, payload: TradeUpdateInput):
    """매매 이력 수정(수량, 단가, 금액, 체결일)"""
    if payload.quantity <= 0 or payload.price <= 0 or payload.amount <= 0:
        raise HTTPException(status_code=400, detail="수량/단가/금액은 0보다 커야 합니다.")
    if len(payload.trade_date) != 8 or not payload.trade_date.isdigit():
        raise HTTPException(status_code=400, detail="체결일은 YYYYMMDD 형식이어야 합니다.")

    with get_db() as conn:
        affected = conn.execute(
            """UPDATE trades
               SET quantity = ?, price = ?, amount = ?, trade_date = ?
               WHERE id = ?""",
            (payload.quantity, payload.price, payload.amount, payload.trade_date, trade_id),
        ).rowcount
        conn.commit()

    if not affected:
        raise HTTPException(status_code=404, detail="이력을 찾을 수 없습니다.")

    # 매매이력 변경 시 관심종목 summary 캐시 무효화
    _summary_cache["data"] = None
    _summary_cache["timestamp"] = 0
    return {"success": True}


# ── Watchlist API ──────────────────────────────────────────────────────────────

@app.get("/api/watchlist")
async def get_watchlist():
    """관심종목 목록 조회"""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT stock_code, stock_name, added_at FROM watchlist ORDER BY added_at DESC"
        ).fetchall()
    return {"items": [dict(r) for r in rows]}


@app.post("/api/watchlist")
async def add_watchlist(item: WatchlistInput):
    """관심종목 추가"""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with get_db() as conn:
        try:
            conn.execute(
                "INSERT INTO watchlist (stock_code, stock_name, added_at) VALUES (?, ?, ?)",
                (item.stock_code, item.stock_name, now),
            )
            conn.commit()
        except sqlite3.IntegrityError:
            return {"success": True, "message": "이미 관심종목에 등록됨"}
    # 캐시 무효화
    _summary_cache["data"] = None
    _summary_cache["timestamp"] = 0
    return {"success": True}


@app.delete("/api/watchlist/{stock_code}")
async def delete_watchlist(stock_code: str):
    """관심종목 삭제"""
    with get_db() as conn:
        affected = conn.execute(
            "DELETE FROM watchlist WHERE stock_code = ?", (stock_code,)
        ).rowcount
        conn.commit()
    if not affected:
        raise HTTPException(status_code=404, detail="관심종목을 찾을 수 없습니다.")
    # 캐시 무효화
    _summary_cache["data"] = None
    _summary_cache["timestamp"] = 0
    return {"success": True}


# ── Watchlist Summary 캐시 ────────────────────────────────────────────────────
_summary_cache: dict = {"data": None, "timestamp": 0}
SUMMARY_CACHE_TTL = 300  # 5분


def calculate_open_position(trades):
    holding_qty = 0
    holding_cost = 0.0
    buy_qty = 0
    buy_amount = 0
    sell_qty = 0
    sell_amount = 0

    for trade in trades:
        quantity = trade["quantity"]
        amount = trade["amount"]

        if trade["trade_type"] == "매수":
            buy_qty += quantity
            buy_amount += amount
            holding_qty += quantity
            holding_cost += amount
        elif trade["trade_type"] == "매도":
            sell_qty += quantity
            sell_amount += amount
            if holding_qty > 0:
                sold_qty = min(quantity, holding_qty)
                holding_cost -= holding_cost / holding_qty * sold_qty
                holding_qty -= sold_qty
                if holding_qty == 0:
                    holding_cost = 0.0

    avg_buy_price = round(buy_amount / buy_qty) if buy_qty else None
    avg_sell_price = round(sell_amount / sell_qty) if sell_qty else None
    avg_holding_buy_price = round(holding_cost / holding_qty) if holding_qty else None
    return avg_buy_price, avg_sell_price, holding_qty, avg_holding_buy_price, sell_qty


@app.get("/api/watchlist/summary")
async def get_watchlist_summary():
    """
    관심종목 요약 조회: 현재가, 3개월 고저, 매수/매도 평균가, 수익률, 하락률, 상승률
    """
    # 캐시 확인
    now = time.time()
    if _summary_cache["data"] and (now - _summary_cache["timestamp"]) < SUMMARY_CACHE_TTL:
        return _summary_cache["data"]

    # 종목 목록 가져오기
    with get_db() as conn:
        rows = conn.execute(
            "SELECT stock_code, stock_name FROM watchlist ORDER BY added_at DESC"
        ).fetchall()

    if not rows:
        result = {"items": []}
        _summary_cache["data"] = result
        _summary_cache["timestamp"] = now
        return result

    access_token = await get_access_token()
    if not access_token:
        return JSONResponse(
            status_code=401,
            content={"error": "Access Token이 없습니다."},
        )

    items = []
    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": f"Bearer {access_token}",
    }

    async with httpx.AsyncClient(timeout=15) as client:
        for row in rows:
            stock_code = row["stock_code"]
            stock_name = row["stock_name"]

            try:
                # 1. 현재가 조회 (ka10001)
                info_res = await client.post(
                    f"{KIWOOM_HOST}/api/dostk/stkinfo",
                    headers={**headers, "api-id": "ka10001"},
                    json={"stk_cd": stock_code},
                )
                info_data = info_res.json()

                # 토큰 만료 시 재발급
                if info_data.get("return_code") in (8005, 8003, 3):
                    access_token = await fetch_access_token()
                    headers["Authorization"] = f"Bearer {access_token}"
                    info_res = await client.post(
                        f"{KIWOOM_HOST}/api/dostk/stkinfo",
                        headers={**headers, "api-id": "ka10001"},
                        json={"stk_cd": stock_code},
                    )
                    info_data = info_res.json()

                cur_prc = abs(int(info_data.get("cur_prc", "0")))
                change_rate = info_data.get("flu_rt", "0")

                # 2. 일봉 차트 조회 (ka10081) - 3개월
                today_str = datetime.today().strftime("%Y%m%d")
                chart_res = await client.post(
                    f"{KIWOOM_HOST}/api/dostk/chart",
                    headers={**headers, "api-id": "ka10081"},
                    json={"stk_cd": stock_code, "base_dt": today_str, "upd_stkpc_tp": "1"},
                )
                chart_data = chart_res.json()
                chart_list = chart_data.get("stk_dt_pole_chart_qry", [])

                # 최근 65영업일(약 3개월) 데이터만 사용
                recent_chart = chart_list[:65] if len(chart_list) > 65 else chart_list

                if recent_chart:
                    high_3m = max(abs(int(c.get("high_pric", "0"))) for c in recent_chart)
                    low_3m = min(abs(int(c.get("low_pric", "0"))) for c in recent_chart if int(c.get("low_pric", "0")) != 0)
                else:
                    high_3m = cur_prc
                    low_3m = cur_prc

                # 3. 매매 이력에서 현재 보유 포지션의 평균 매수가 계산
                with get_db() as conn:
                    trade_rows = conn.execute(
                        """SELECT trade_type, quantity, amount
                           FROM trades
                           WHERE stock_code = ?
                           ORDER BY trade_date ASC, id ASC""",
                        (stock_code,),
                    ).fetchall()

                avg_buy_price, avg_sell_price, holding_qty, avg_holding_buy_price, sell_qty = calculate_open_position(trade_rows)

                # 4. 비율 계산
                profit_rate = None
                profit_amount = None
                evaluation_amount = None
                if avg_holding_buy_price and avg_holding_buy_price > 0:
                    profit_rate = round((cur_prc - avg_holding_buy_price) / avg_holding_buy_price * 100, 2)
                    profit_amount = (cur_prc - avg_holding_buy_price) * holding_qty
                    evaluation_amount = cur_prc * holding_qty

                high_drop_rate = None
                if high_3m and high_3m > 0:
                    high_drop_rate = round((cur_prc - high_3m) / high_3m * 100, 2)

                low_rise_rate = None
                if low_3m and low_3m > 0:
                    low_rise_rate = round((cur_prc - low_3m) / low_3m * 100, 2)

                items.append({
                    "stock_code": stock_code,
                    "stock_name": stock_name,
                    "cur_prc": cur_prc,
                    "change_rate": change_rate,
                    "high_3m": high_3m,
                    "low_3m": low_3m,
                    "avg_buy_price": avg_buy_price,
                    "avg_sell_price": avg_sell_price,
                    "holding_qty": holding_qty,
                    "avg_holding_buy_price": avg_holding_buy_price,
                    "sell_qty": sell_qty,
                    "evaluation_amount": evaluation_amount,
                    "profit_rate": profit_rate,
                    "profit_amount": profit_amount,
                    "high_drop_rate": high_drop_rate,
                    "low_rise_rate": low_rise_rate,
                })

            except Exception as e:
                logger.error(f"Watchlist summary error for {stock_code}: {e}")
                items.append({
                    "stock_code": stock_code,
                    "stock_name": stock_name,
                    "cur_prc": 0,
                    "change_rate": "0",
                    "high_3m": 0,
                    "low_3m": 0,
                    "avg_buy_price": None,
                    "avg_sell_price": None,
                    "holding_qty": 0,
                    "avg_holding_buy_price": None,
                    "sell_qty": 0,
                    "evaluation_amount": None,
                    "profit_rate": None,
                    "profit_amount": None,
                    "high_drop_rate": None,
                    "low_rise_rate": None,
                })

            # Rate Limit 대응: 종목 간 0.3초 딜레이
            await asyncio.sleep(0.3)

    result = {"items": items}
    _summary_cache["data"] = result
    _summary_cache["timestamp"] = time.time()
    return result


# ══════════════════════════════════════════════════════════════════════
# 자산 조회 대시보드 (Asset Dashboard)
# ══════════════════════════════════════════════════════════════════════

# 현재가 캐시 (code -> (price, timestamp))
_price_cache: dict = {}
PRICE_CACHE_TTL = 300  # 5분


async def _fetch_current_price(client: httpx.AsyncClient, code: str) -> int:
    """
    키움 ka10001 로 단일 종목 현재가를 조회한다. 5분 메모리 캐시 사용.
    실패 시 0 을 반환한다.
    """
    now = time.time()
    cached = _price_cache.get(code)
    if cached and (now - cached[1]) < PRICE_CACHE_TTL:
        return cached[0]

    access_token = await get_access_token()
    if not access_token:
        return 0

    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": f"Bearer {access_token}",
        "api-id": "ka10001",
    }
    try:
        res = await client.post(
            f"{KIWOOM_HOST}/api/dostk/stkinfo",
            headers=headers,
            json={"stk_cd": code},
        )
        data = res.json()
        # 토큰 만료 시 1회 재발급 후 재시도
        if data.get("return_code") in (8005, 8003, 3):
            token = await fetch_access_token()
            headers["Authorization"] = f"Bearer {token}"
            res = await client.post(
                f"{KIWOOM_HOST}/api/dostk/stkinfo",
                headers=headers,
                json={"stk_cd": code},
            )
            data = res.json()

        cur_prc = abs(int(data.get("cur_prc", "0") or "0"))
        _price_cache[code] = (cur_prc, now)
        return cur_prc
    except Exception as e:
        logger.error(f"현재가 조회 실패({code}): {e}")
        return 0


# ── 보유 종목 CRUD ─────────────────────────────────────────────────────

@app.get("/api/holdings")
async def get_holdings(broker: Optional[str] = None):
    """보유 종목 목록 조회 (옵션: broker 필터)"""
    with get_db() as conn:
        if broker:
            rows = conn.execute(
                "SELECT * FROM holdings WHERE broker = ? ORDER BY id ASC", (broker,)
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM holdings ORDER BY broker ASC, id ASC"
            ).fetchall()
    return {"items": [dict(r) for r in rows]}


@app.post("/api/holdings")
async def upsert_holding(item: HoldingInput):
    """보유 종목 추가/수정 (broker + stock_code 기준 upsert)"""
    if item.broker not in BROKERS:
        raise HTTPException(status_code=400, detail=f"알 수 없는 증권사: {item.broker}")
    if item.quantity <= 0 or item.avg_buy_price <= 0:
        raise HTTPException(status_code=400, detail="수량/매수가는 0보다 커야 합니다.")

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with get_db() as conn:
        conn.execute(
            """INSERT INTO holdings (broker, stock_code, stock_name, quantity, avg_buy_price, updated_at)
               VALUES (?,?,?,?,?,?)
               ON CONFLICT(broker, stock_code)
               DO UPDATE SET stock_name=excluded.stock_name,
                             quantity=excluded.quantity,
                             avg_buy_price=excluded.avg_buy_price,
                             updated_at=excluded.updated_at""",
            (item.broker, item.stock_code, item.stock_name,
             item.quantity, item.avg_buy_price, now),
        )
        conn.commit()
    return {"success": True}


@app.put("/api/holdings/{holding_id}")
async def update_holding(holding_id: int, payload: HoldingUpdateInput):
    """보유 종목 수량/매수가 수정"""
    if payload.quantity <= 0 or payload.avg_buy_price <= 0:
        raise HTTPException(status_code=400, detail="수량/매수가는 0보다 커야 합니다.")
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with get_db() as conn:
        affected = conn.execute(
            "UPDATE holdings SET quantity=?, avg_buy_price=?, updated_at=? WHERE id=?",
            (payload.quantity, payload.avg_buy_price, now, holding_id),
        ).rowcount
        conn.commit()
    if not affected:
        raise HTTPException(status_code=404, detail="보유 종목을 찾을 수 없습니다.")
    return {"success": True}


@app.delete("/api/holdings/{holding_id}")
async def delete_holding(holding_id: int):
    """보유 종목 삭제"""
    with get_db() as conn:
        affected = conn.execute(
            "DELETE FROM holdings WHERE id = ?", (holding_id,)
        ).rowcount
        conn.commit()
    if not affected:
        raise HTTPException(status_code=404, detail="보유 종목을 찾을 수 없습니다.")
    return {"success": True}


# ── 자산 요약 ──────────────────────────────────────────────────────────

@app.get("/api/assets/summary")
async def get_assets_summary():
    """
    증권사별 보유 종목 + 현재가 + 파생지표 + 증권사별/전체 요약 반환.
    """
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM holdings ORDER BY broker ASC, id ASC").fetchall()

    # 증권사별 구조 초기화
    brokers: dict = {
        key: {
            "label": label,
            "total_buy_amount": 0,
            "total_eval_amount": 0,
            "total_profit_amount": 0,
            "total_profit_rate": 0.0,
            "holdings": [],
        }
        for key, label in BROKERS.items()
    }

    # 고유 종목 현재가 조회
    unique_codes = {r["stock_code"] for r in rows}
    prices: dict = {}
    async with httpx.AsyncClient(timeout=15) as client:
        for code in unique_codes:
            prices[code] = await _fetch_current_price(client, code)
            await asyncio.sleep(0.3)  # Rate Limit 대응

    for r in rows:
        broker = r["broker"]
        if broker not in brokers:
            continue
        cur_prc = prices.get(r["stock_code"], 0)
        qty = r["quantity"]
        avg_buy = r["avg_buy_price"]
        buy_amount = round(avg_buy * qty)
        eval_amount = cur_prc * qty
        profit_amount = eval_amount - buy_amount
        profit_rate = round((cur_prc - avg_buy) / avg_buy * 100, 2) if avg_buy > 0 else 0.0

        brokers[broker]["holdings"].append({
            "id": r["id"],
            "broker": broker,
            "stock_code": r["stock_code"],
            "stock_name": r["stock_name"],
            "quantity": qty,
            "avg_buy_price": avg_buy,
            "cur_prc": cur_prc,
            "eval_amount": eval_amount,
            "profit_amount": profit_amount,
            "profit_rate": profit_rate,
        })
        brokers[broker]["total_buy_amount"] += buy_amount
        brokers[broker]["total_eval_amount"] += eval_amount

    # 증권사별 요약 계산
    total = {"total_buy_amount": 0, "total_eval_amount": 0, "total_profit_amount": 0, "total_profit_rate": 0.0}
    for b in brokers.values():
        b["total_profit_amount"] = b["total_eval_amount"] - b["total_buy_amount"]
        b["total_profit_rate"] = (
            round(b["total_profit_amount"] / b["total_buy_amount"] * 100, 2)
            if b["total_buy_amount"] > 0 else 0.0
        )
        total["total_buy_amount"] += b["total_buy_amount"]
        total["total_eval_amount"] += b["total_eval_amount"]

    total["total_profit_amount"] = total["total_eval_amount"] - total["total_buy_amount"]
    total["total_profit_rate"] = (
        round(total["total_profit_amount"] / total["total_buy_amount"] * 100, 2)
        if total["total_buy_amount"] > 0 else 0.0
    )

    return {"brokers": brokers, "total": total}


# ── 자산 추이 ──────────────────────────────────────────────────────────

@app.get("/api/assets/trend")
async def get_assets_trend(days: int = 30):
    """일별 증권사별 평가금액 + 합산 추이 (asset_snapshots 기반)"""
    if days <= 0:
        days = 30
    with get_db() as conn:
        rows = conn.execute(
            """SELECT snapshot_date, broker, eval_amount
               FROM asset_snapshots
               ORDER BY snapshot_date ASC""",
        ).fetchall()

    # 날짜별로 집계
    by_date: dict = {}
    for r in rows:
        d = r["snapshot_date"]
        if d not in by_date:
            by_date[d] = {"date": d, "mirae": 0, "namuh": 0, "toss": 0, "total": 0}
        if r["broker"] in BROKERS:
            by_date[d][r["broker"]] = r["eval_amount"]

    # total 계산 및 최근 days 개로 제한
    series = []
    for d in sorted(by_date.keys()):
        point = by_date[d]
        point["total"] = point["mirae"] + point["namuh"] + point["toss"]
        series.append(point)
    series = series[-days:]

    return {"series": series}


# ── 일별 스냅샷 기록 ────────────────────────────────────────────────────

async def record_daily_snapshot():
    """holdings 전 종목 현재가 조회 → 증권사별 평가/매수금액 계산 → asset_snapshots upsert"""
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM holdings").fetchall()

    if not rows:
        logger.info("스냅샷: 보유 종목이 없어 기록을 건너뜁니다.")
        return

    unique_codes = {r["stock_code"] for r in rows}
    prices: dict = {}
    async with httpx.AsyncClient(timeout=15) as client:
        for code in unique_codes:
            prices[code] = await _fetch_current_price(client, code)
            await asyncio.sleep(0.3)

    agg: dict = {key: {"eval": 0, "buy": 0} for key in BROKERS}
    for r in rows:
        broker = r["broker"]
        if broker not in agg:
            continue
        cur_prc = prices.get(r["stock_code"], 0)
        agg[broker]["eval"] += cur_prc * r["quantity"]
        agg[broker]["buy"] += round(r["avg_buy_price"] * r["quantity"])

    # 토스는 실계좌 조회 값을 우선 사용하고, 실패 시 수동 등록 내역으로 대체
    try:
        from toss_service import get_holdings as get_toss_holdings
        from fastapi import Response
        toss = await asyncio.to_thread(get_toss_holdings, Response())
        agg["toss"] = {
            "eval": round(float(toss["total_eval_krw"])),
            "buy": round(float(toss["total_buy_krw"])),
        }
    except Exception as e:
        logger.warning(f"스냅샷: 토스 실계좌 조회 실패, 수동 등록 내역 사용: {e}")

    today = datetime.now().strftime("%Y-%m-%d")
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with get_db() as conn:
        for broker, v in agg.items():
            conn.execute(
                """INSERT INTO asset_snapshots (snapshot_date, broker, eval_amount, buy_amount, created_at)
                   VALUES (?,?,?,?,?)
                   ON CONFLICT(snapshot_date, broker)
                   DO UPDATE SET eval_amount=excluded.eval_amount,
                                 buy_amount=excluded.buy_amount,
                                 created_at=excluded.created_at""",
                (today, broker, v["eval"], v["buy"], now),
            )
        conn.commit()
    logger.info(f"스냅샷 기록 완료: {today}")


def _toss_daily_closes(symbol: str, count: int) -> dict:
    """토스 일봉 조회 → {KST 날짜: 종가}"""
    from toss_service import get_toss_data
    result = get_toss_data("/api/v1/candles", params={"symbol": symbol, "interval": "1d", "count": count})
    closes = {}
    for c in result.get("candles", []):
        closes[c["timestamp"][:10]] = float(c["closePrice"])
    return closes


def _collect_positions():
    """현재 보유종목 → ([(broker, symbol, quantity, is_usd, buy_krw)], 환율)"""
    from toss_service import get_holdings as get_toss_holdings
    from fastapi import Response

    positions = []
    rate = 1.0
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM holdings").fetchall()
    for r in rows:
        if r["broker"] in ("mirae", "namuh"):
            positions.append((r["broker"], r["stock_code"], r["quantity"], False, r["avg_buy_price"] * r["quantity"]))
    try:
        toss = get_toss_holdings(Response())
        rate = float(toss["exchange_rate"]) if toss["exchange_rate"] else 1.0
        for account in toss["accounts"]:
            for item in account["items"]:
                usd = item["currency"] == "USD"
                buy = float(item["marketValue"]["purchaseAmount"]) * (rate if usd else 1)
                positions.append(("toss", item["symbol"], float(item["quantity"]), usd, buy))
    except Exception as e:
        logger.warning(f"토스 실계좌 조회 실패, 수동 등록 내역 사용: {e}")
        for r in rows:
            if r["broker"] == "toss":
                positions.append(("toss", r["stock_code"], r["quantity"], False, r["avg_buy_price"] * r["quantity"]))
    return positions, rate


def _rebuild_history_sync(days: int) -> dict:
    """현재 보유종목 기준 과거 종가로 증권사별 일별 자산(asset_snapshots)을 재계산"""
    positions, rate = _collect_positions()

    start = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
    count = min(200, days + 10)
    closes: dict = {}
    for _, symbol, _, _, _ in positions:
        if symbol in closes:
            continue
        try:
            closes[symbol] = _toss_daily_closes(symbol, count)
        except Exception as e:
            logger.warning(f"자산 이력 재계산: {symbol} 일봉 조회 실패: {e}")
            closes[symbol] = {}
        time.sleep(0.2)

    # 국내 종목 거래일을 기준 날짜로 사용 (미국 종목은 해당일 이전 최근 종가 사용)
    kr_dates = set()
    for _, symbol, _, usd, _ in positions:
        if not usd:
            kr_dates.update(d for d in closes[symbol] if d >= start)
    dates = sorted(kr_dates)
    if not dates:
        return {"dates": 0}

    def close_on(symbol: str, d: str):
        series = closes[symbol]
        if d in series:
            return series[d]
        earlier = [k for k in series if k < d]
        return series[max(earlier)] if earlier else None

    agg = {d: {b: {"eval": 0.0, "buy": 0.0} for b in BROKERS} for d in dates}
    for broker, symbol, qty, usd, buy in positions:
        if broker not in BROKERS:
            continue
        for d in dates:
            price = close_on(symbol, d)
            if price is None:
                continue
            agg[d][broker]["eval"] += price * qty * (rate if usd else 1)
            agg[d][broker]["buy"] += buy

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with get_db() as conn:
        conn.execute("DELETE FROM asset_snapshots WHERE snapshot_date >= ?", (dates[0],))
        for d in dates:
            for broker, v in agg[d].items():
                conn.execute(
                    "INSERT INTO asset_snapshots (snapshot_date, broker, eval_amount, buy_amount, created_at) VALUES (?,?,?,?,?)",
                    (d, broker, round(v["eval"]), round(v["buy"]), now),
                )
        conn.commit()
    logger.info(f"자산 이력 재계산 완료: {dates[0]} ~ {dates[-1]} ({len(dates)}일)")
    return {"dates": len(dates), "from": dates[0], "to": dates[-1]}


def _value_at_date_sync(target: str) -> dict:
    """현재 보유종목을 target 날짜(이전 최근 거래일) 종가로 평가한 증권사별 금액"""
    positions, rate = _collect_positions()
    closes: dict = {}
    brokers = {b: 0.0 for b in BROKERS}
    missing = []
    for broker, symbol, qty, usd, _ in positions:
        if symbol not in closes:
            try:
                closes[symbol] = _toss_closes_since(symbol, target)
            except Exception as e:
                logger.warning(f"{symbol} 일봉 조회 실패: {e}")
                closes[symbol] = {}
            time.sleep(0.2)
        earlier = [k for k in closes[symbol] if k <= target]
        if not earlier or broker not in brokers:
            missing.append(symbol)
            continue
        brokers[broker] += closes[symbol][max(earlier)] * qty * (rate if usd else 1)
    return {
        "date": target,
        "brokers": {b: round(v) for b, v in brokers.items()},
        "total": round(sum(brokers.values())),
        "missing": missing,
    }


INDEX_SYMBOLS = {"kospi": "^KS11", "sp500": "^GSPC", "nasdaq": "^IXIC"}
_monthly_cache: dict = {}


def _toss_closes_since(symbol: str, since: str) -> dict:
    """토스 일봉을 since(YYYY-MM-DD) 이전까지 페이지네이션하며 {날짜: 종가} 로 반환"""
    from toss_service import get_toss_data
    closes: dict = {}
    before = None
    for _ in range(4):
        params = {"symbol": symbol, "interval": "1d", "count": 200}
        if before:
            params["before"] = before
        result = get_toss_data("/api/v1/candles", params=params)
        candles = result.get("candles", [])
        for c in candles:
            closes[c["timestamp"][:10]] = float(c["closePrice"])
        before = result.get("nextBefore")
        if not candles or not before or min(closes) <= since:
            break
        time.sleep(0.2)
    return closes


def _index_prices(symbol: str):
    """Yahoo Finance 일봉 ({날짜: 시가}, {날짜: 종가}) (최근 2년)"""
    res = requests.get(
        f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}",
        params={"range": "2y", "interval": "1d"}, headers={"User-Agent": "Mozilla/5.0"}, timeout=15,
    )
    res.raise_for_status()
    result = res.json()["chart"]["result"][0]
    offset = result["meta"].get("gmtoffset", 0)
    quote = result["indicators"]["quote"][0]
    opens: dict = {}
    closes: dict = {}
    for ts, o, c in zip(result["timestamp"], quote["open"], quote["close"]):
        day = datetime.utcfromtimestamp(ts + offset).strftime("%Y-%m-%d")
        if o is not None:
            opens[day] = float(o)
        if c is not None:
            closes[day] = float(c)
    return opens, closes


def _monthly_returns_sync(year: int) -> dict:
    """1/2 종가 기준 대비, 매월 1일 현재 보유종목 평가금액 수익률 + 지수 수익률 (1/2 = 0%)"""
    today = datetime.now()
    # 기준일은 연초 첫 거래일(1/2), 이후는 매월 1일
    dates = [f"{year}-01-02"] + [f"{year}-{m:02d}-01" for m in range(2, 13) if datetime(year, m, 1) <= today]
    dates.append(today.strftime("%Y-%m-%d"))
    positions, rate = _collect_positions()

    def close_on(series: dict, d: str):
        earlier = [k for k in series if k <= d]
        return series[max(earlier)] if earlier else None

    closes: dict = {}
    for _, symbol, _, _, _ in positions:
        if symbol not in closes:
            try:
                closes[symbol] = _toss_closes_since(symbol, dates[0])
            except Exception as e:
                logger.warning(f"월별 수익률: {symbol} 일봉 조회 실패: {e}")
                closes[symbol] = {}
            time.sleep(0.2)

    # 기준일(1/2)에 시세가 없는 종목은 모든 날짜에서 제외해 비교 기준을 맞춘다
    excluded = sorted({sym for _, sym, _, _, _ in positions if close_on(closes[sym], dates[0]) is None})
    values = []
    for d in dates:
        total = 0.0
        for _, symbol, qty, usd, _ in positions:
            if symbol in excluded:
                continue
            price = close_on(closes[symbol], d)
            if price is not None:
                total += price * qty * (rate if usd else 1)
        values.append(total)

    index_values = {}
    for key, sym in INDEX_SYMBOLS.items():
        try:
            opens, closes_ = _index_prices(sym)
            # 지수는 해당일 시가 기준: 1일이 휴장이면 다음 거래일 시가, 마지막(현재)은 최신 종가
            index_values[key] = [
                close_on(closes_, d) if d == dates[-1] else
                next((opens[k] for k in sorted(opens) if k >= d), close_on(closes_, d))
                for d in dates
            ]
        except Exception as e:
            logger.warning(f"월별 수익률: 지수 {sym} 조회 실패: {e}")
            index_values[key] = [None] * len(dates)

    def pct(vals):
        base = vals[0]
        return [None if (v is None or not base) else round((v / base - 1) * 100, 2) for v in vals]

    series = []
    p, k, sp, nq = pct(values), pct(index_values["kospi"]), pct(index_values["sp500"]), pct(index_values["nasdaq"])
    for i, d in enumerate(dates):
        series.append({"date": d, "value": round(values[i]), "portfolio": p[i], "kospi": k[i], "sp500": sp[i], "nasdaq": nq[i]})
    return {"series": series, "excluded": excluded}


@app.get("/api/assets/monthly-returns")
async def monthly_returns(year: int = 0):
    """매월 1일 기준 포트폴리오(현재 보유종목) vs KOSPI/S&P500/NASDAQ 수익률. 1시간 캐시"""
    year = year or datetime.now().year
    cached = _monthly_cache.get(year)
    if cached and time.time() - cached[0] < 3600:
        return cached[1]
    data = await asyncio.to_thread(_monthly_returns_sync, year)
    _monthly_cache[year] = (time.time(), data)
    return data


@app.get("/api/assets/value-at")
async def value_at_date(date: str = "2026-06-19"):
    """현재 보유종목을 특정 과거 날짜 종가로 평가한 금액 (최대 약 1년 전까지)"""
    try:
        d = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="date 형식은 YYYY-MM-DD 입니다.")
    if (datetime.now() - d).days > 700 or d > datetime.now():
        raise HTTPException(status_code=400, detail="date 는 오늘 기준 700일 이내의 과거여야 합니다.")
    return await asyncio.to_thread(_value_at_date_sync, date)


@app.post("/api/assets/rebuild-history")
async def rebuild_history(days: int = 30):
    """현재 보유종목 기준, 과거 종가로 일별 자산 추이를 재계산 (days: 1~190)"""
    days = max(1, min(days, 190))
    return {"success": True, **await asyncio.to_thread(_rebuild_history_sync, days)}


@app.post("/api/assets/snapshot")
async def trigger_snapshot():
    """관리/테스트용 즉시 스냅샷 기록"""
    await record_daily_snapshot()
    return {"success": True}


# ── 장 마감 후 스냅샷 스케줄러 (평일 15:40 KST) ─────────────────────────
from datetime import timezone

KST = timezone(timedelta(hours=9))
SNAPSHOT_HOUR = 15
SNAPSHOT_MINUTE = 40


def _next_snapshot_time(now: datetime) -> datetime:
    """now 이후 가장 가까운 평일 15:40 KST 를 반환"""
    candidate = now.replace(hour=SNAPSHOT_HOUR, minute=SNAPSHOT_MINUTE, second=0, microsecond=0)
    if candidate <= now:
        candidate += timedelta(days=1)
    # 주말(토=5, 일=6) 스킵
    while candidate.weekday() >= 5:
        candidate += timedelta(days=1)
    return candidate


def _has_today_snapshot() -> bool:
    today = datetime.now(KST).strftime("%Y-%m-%d")
    with get_db() as conn:
        row = conn.execute(
            "SELECT 1 FROM asset_snapshots WHERE snapshot_date = ? LIMIT 1", (today,)
        ).fetchone()
    return row is not None


async def snapshot_scheduler():
    """매 평일 15:40 KST 에 자산 스냅샷을 기록하는 백그라운드 루프"""
    # 서버 기동 시 누락 보정: 평일 && 15:40 지남 && 당일 스냅샷 없음
    try:
        now = datetime.now(KST)
        is_weekday = now.weekday() < 5
        past_close = (now.hour, now.minute) >= (SNAPSHOT_HOUR, SNAPSHOT_MINUTE)
        if is_weekday and past_close and not _has_today_snapshot():
            logger.info("스냅샷 누락 보정 기록 시도")
            await record_daily_snapshot()
    except Exception as e:
        logger.error(f"스냅샷 보정 실패: {e}")

    while True:
        now = datetime.now(KST)
        next_run = _next_snapshot_time(now)
        sleep_sec = (next_run - now).total_seconds()
        logger.info(f"다음 스냅샷 예정: {next_run.isoformat()} ({sleep_sec:.0f}s 후)")
        await asyncio.sleep(sleep_sec)
        try:
            await record_daily_snapshot()
        except Exception as e:
            logger.error(f"스냅샷 기록 실패: {e}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

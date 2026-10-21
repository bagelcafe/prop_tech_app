from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import uvicorn
import os
import logging
import json
import sqlite3
import asyncio
import time
import websockets
from datetime import datetime
from typing import Optional

logger = logging.getLogger("kiwoom")

app = FastAPI()

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


# ── 앱 시작 시 토큰 자동 발급 ─────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    init_db()
    logger.info("서버 시작: Access Token 발급 시도...")
    token = await fetch_access_token()
    if token:
        logger.info(f"Token 준비 완료: {token[:15]}...")
    else:
        logger.warning("Token 발급에 실패했습니다. 지정단말기 IP 등록 여부를 확인하세요.")


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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

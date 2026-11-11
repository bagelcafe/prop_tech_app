"""토스 주문 모듈 — 매도 보호(trailing stop) 봇의 쓰기 경로.

설계: TRAILING_BOT_DESIGN.md
- 국내(KRX) 보유종목, 순수 손절 전용, MARKET 발동, 고점 대비 -15%.
- 서버측 안전망: SINGLE SELL 조건주문(생성/수정/취소).
- 봇측 백업: 직접 시장가 매도 주문.
- 조회: 매도가능수량.

안전 원칙:
- `BOT_DRY_RUN` 환경변수가 "0"이 아니면 기본적으로 실주문을 보내지 않고 계획만 반환(dry_run).
- 모든 주문/조건주문 생성에 clientOrderId(멱등키) 필수.
- 토큰/계좌 헤더는 toss_service 재사용. 토큰·계좌번호는 로그/반환에 노출하지 않는다.
"""
import os
import re

import requests
from fastapi import HTTPException

import toss_service

BASE_URL = toss_service.BASE_URL
_CLIENT_ORDER_ID_RE = re.compile(r"^[a-zA-Z0-9\-_]{1,36}$")


def is_dry_run() -> bool:
    """BOT_DRY_RUN 미설정 또는 '0' 이외의 값이면 dry-run(안전). '0'일 때만 실주문."""
    return os.getenv("BOT_DRY_RUN", "1").strip() != "0"


def _validate_client_order_id(client_order_id: str) -> None:
    if not client_order_id or not _CLIENT_ORDER_ID_RE.match(client_order_id):
        raise HTTPException(status_code=400, detail="clientOrderId 형식이 올바르지 않습니다. (영숫자/-/_ 최대 36자)")


def _post(path, body, account_seq, dry_run):
    """계좌 단위 POST. dry_run이면 실제 호출 없이 계획만 반환."""
    if dry_run:
        return {"dry_run": True, "path": path, "body": body}
    token = toss_service.get_token()
    headers = {"Authorization": f"Bearer {token}", "X-Tossinvest-Account": str(account_seq)}
    try:
        response = requests.post(f"{BASE_URL}{path}", json=body, headers=headers, timeout=15)
        if response.status_code == 401:
            token = toss_service.get_token(previous_token=token)
            headers["Authorization"] = f"Bearer {token}"
            response = requests.post(f"{BASE_URL}{path}", json=body, headers=headers, timeout=15)
        if not response.ok:
            status = response.status_code if response.status_code in (400, 403, 404, 409, 422, 429) else 502
            raise HTTPException(status_code=status, detail=f"토스 주문 요청에 실패했습니다. (HTTP {response.status_code})")
        data = response.json()
        if "result" not in data:
            raise ValueError("Invalid response")
        return data["result"]
    except (requests.RequestException, ValueError, TypeError, AttributeError):
        raise HTTPException(status_code=502, detail="토스 주문 서버에 연결할 수 없습니다.") from None


def _delete(path, account_seq, dry_run):
    if dry_run:
        return {"dry_run": True, "path": path, "method": "DELETE"}
    token = toss_service.get_token()
    headers = {"Authorization": f"Bearer {token}", "X-Tossinvest-Account": str(account_seq)}
    try:
        response = requests.delete(f"{BASE_URL}{path}", headers=headers, timeout=15)
        if response.status_code == 401:
            token = toss_service.get_token(previous_token=token)
            headers["Authorization"] = f"Bearer {token}"
            response = requests.delete(f"{BASE_URL}{path}", headers=headers, timeout=15)
        if not response.ok:
            status = response.status_code if response.status_code in (400, 403, 404, 409, 429) else 502
            raise HTTPException(status_code=status, detail=f"토스 취소 요청에 실패했습니다. (HTTP {response.status_code})")
        if response.content:
            data = response.json()
            return data.get("result", data)
        return {"ok": True}
    except (requests.RequestException, ValueError, TypeError, AttributeError):
        raise HTTPException(status_code=502, detail="토스 주문 서버에 연결할 수 없습니다.") from None


def get_sellable_quantity(symbol: str, account_seq) -> str:
    """판매 가능 수량 조회. 주문 수량 상한 검증용."""
    result = toss_service.get_toss_data("/api/v1/sellable-quantity",
                                        params={"symbol": symbol}, account_seq=account_seq)
    if not isinstance(result, dict) or result.get("sellableQuantity") is None:
        raise HTTPException(status_code=502, detail="매도 가능 수량 응답 형식이 올바르지 않습니다.")
    return str(result["sellableQuantity"])


def place_market_sell(symbol: str, quantity: str, account_seq, client_order_id: str, dry_run=None):
    """백업 직접 시장가 매도 (POST /api/v1/orders). 급락 시 조건주문을 못 잡을 때 사용."""
    if dry_run is None:
        dry_run = is_dry_run()
    _validate_client_order_id(client_order_id)
    body = {
        "symbol": symbol,
        "side": "SELL",
        "orderType": "MARKET",
        "quantity": str(quantity),
        "timeInForce": "DAY",
        "clientOrderId": client_order_id,
    }
    return _post("/api/v1/orders", body, account_seq, dry_run)


def create_stop_conditional_order(symbol: str, quantity: str, trigger_price: str,
                                  expire_date: str, account_seq, client_order_id: str, dry_run=None):
    """SINGLE SELL 시장가 조건주문 생성 (서버측 손절 안전망).

    trigger_price: 손절 감시가(호가단위 보정된 값). 현재가가 이 값에 닿으면 시장가 매도.
    expire_date: YYYY-MM-DD (최대 1년).
    """
    if dry_run is None:
        dry_run = is_dry_run()
    _validate_client_order_id(client_order_id)
    body = {
        "symbol": symbol,
        "type": "SINGLE",
        "quantity": str(quantity),
        "orderType": "MARKET",            # 확실한 청산. MARKET이면 orderPrice 미전달.
        "clientOrderId": client_order_id,
        "expireDate": expire_date,
        "first": {"orderSide": "SELL", "triggerPrice": str(trigger_price)},
    }
    return _post("/api/v1/conditional-orders", body, account_seq, dry_run)


def modify_stop_trigger(conditional_order_id: str, symbol: str, quantity: str,
                        trigger_price: str, expire_date: str, account_seq, dry_run=None):
    """조건주문 감시가 상향(trailing). 고점 갱신 시 trigger_price를 올린다.

    주의: modify는 그룹 공통값(type/quantity/orderType/expireDate)을 함께 전송한다.
    """
    if dry_run is None:
        dry_run = is_dry_run()
    body = {
        "type": "SINGLE",
        "quantity": str(quantity),
        "orderType": "MARKET",
        "expireDate": expire_date,
        "first": {"orderSide": "SELL", "triggerPrice": str(trigger_price)},
    }
    return _post(f"/api/v1/conditional-orders/{conditional_order_id}/modify", body, account_seq, dry_run)


def cancel_conditional_order(conditional_order_id: str, account_seq, dry_run=None):
    """조건주문 취소 (보호 해제)."""
    if dry_run is None:
        dry_run = is_dry_run()
    return _delete(f"/api/v1/conditional-orders/{conditional_order_id}", account_seq, dry_run)

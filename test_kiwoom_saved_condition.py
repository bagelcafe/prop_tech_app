"""영웅문에 수동 저장한 조건검색식이 키움 REST WebSocket에서 조회되는지 확인한다."""

import asyncio
import json
import os
import sys

import httpx
import websockets
from dotenv import load_dotenv


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

APP_KEY = os.getenv("APP_KEY", "")
SECRET_KEY = os.getenv("SECRET_KEY", "")
EXPECTED_CONDITION_NAME = "5일20일선이평선돌파"
TOKEN_URL = "https://api.kiwoom.com/oauth2/token"
WEBSOCKET_URL = "wss://api.kiwoom.com:10000/api/dostk/websocket"


async def fetch_access_token() -> str:
    if not APP_KEY or not SECRET_KEY:
        raise RuntimeError(".env 파일에 APP_KEY와 SECRET_KEY를 설정하세요.")

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            TOKEN_URL,
            headers={"Content-Type": "application/json;charset=UTF-8", "api-id": "au10001"},
            json={"grant_type": "client_credentials", "appkey": APP_KEY, "secretkey": SECRET_KEY},
        )
    response.raise_for_status()
    payload = response.json()
    if payload.get("return_code") != 0 or not payload.get("token"):
        raise RuntimeError(f"토큰 발급 실패: {payload.get('return_msg', '알 수 없는 오류')}")
    return payload["token"]


async def fetch_saved_conditions(access_token: str) -> list[dict]:
    async with websockets.connect(WEBSOCKET_URL, open_timeout=10, close_timeout=10) as websocket:
        await websocket.send(json.dumps({"trnm": "LOGIN", "token": access_token}))
        login_response = json.loads(await asyncio.wait_for(websocket.recv(), timeout=15))
        if str(login_response.get("return_code", "0")) != "0":
            raise RuntimeError(f"WebSocket 로그인 실패: {login_response.get('return_msg', '알 수 없는 오류')}")

        await websocket.send(json.dumps({"trnm": "CNSRLST"}))
        response = json.loads(await asyncio.wait_for(websocket.recv(), timeout=15))
        body = response.get("body", response)
        if str(body.get("return_code", "0")) != "0":
            raise RuntimeError(f"조건식 목록 조회 실패: {body.get('return_msg', '알 수 없는 오류')}")
        conditions = []
        for record in body.get("data", []):
            if isinstance(record, dict):
                seq, name = record.get("seq"), record.get("name", "")
            elif isinstance(record, (list, tuple)) and len(record) >= 2:
                seq, name = record[0], record[1]
            else:
                continue
            if seq is not None:
                conditions.append({"seq": str(seq), "name": str(name)})
        return conditions


async def main() -> None:
    conditions = await fetch_saved_conditions(await fetch_access_token())
    print(f"저장된 조건식 수: {len(conditions)}")
    for condition in conditions:
        print(f"- [{condition.get('seq', '')}] {condition.get('name', '')}")

    saved_condition = next((item for item in conditions if item.get("name") == EXPECTED_CONDITION_NAME), None)
    if saved_condition is None:
        raise RuntimeError(
            f"'{EXPECTED_CONDITION_NAME}' 조건식이 없습니다. 영웅문에서 일봉/종가/5일/20일/상향돌파 조건으로 저장하세요."
        )
    print(f"검증 성공: 조건식 번호는 {saved_condition.get('seq')}입니다.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as error:
        print(f"검증 실패: {error}", file=sys.stderr)
        sys.exit(1)
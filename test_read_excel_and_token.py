#!/usr/bin/env python3
"""
키움 REST API 엑셀 문서 읽기 + Access Token 발급 테스트
======================================================
1) 엑셀 문서 (키움 REST API 문서.xlsx) 를 읽어 모든 시트의 API 정보를 출력합니다.
2) .env 파일에서 APP_KEY, SECRET_KEY 를 읽어 Access Token 발급을 테스트합니다.
"""

import os
import sys
import json
import requests
import openpyxl
from dotenv import load_dotenv
from pathlib import Path

# ──────────────────────────────────────────────
# 설정
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
EXCEL_FILE = BASE_DIR / "키움 REST API 문서.xlsx"
ENV_FILE = BASE_DIR / ".env"

# 운영 도메인 / 모의투자 도메인 (모의투자는 KRX만 지원)
PROD_BASE_URL = "https://api.kiwoom.com"
MOCK_BASE_URL = "https://mockapi.kiwoom.com"

# True이면 모의투자 도메인 사용
USE_MOCK = False

TOKEN_ENDPOINT = "/oauth2/token"
TOKEN_API_ID = "au10001"


# ──────────────────────────────────────────────
# Part 1: 엑셀 문서 읽기
# ──────────────────────────────────────────────
def read_excel_api_info():
    """엑셀 파일의 모든 시트에서 API 정보를 파싱하여 출력합니다."""
    if not EXCEL_FILE.exists():
        print(f"[ERROR] 엑셀 파일을 찾을 수 없습니다: {EXCEL_FILE}")
        return []

    print("=" * 70)
    print(f" 📄 엑셀 파일 읽기: {EXCEL_FILE.name}")
    print("=" * 70)

    wb = openpyxl.load_workbook(str(EXCEL_FILE), data_only=True)
    print(f"\n총 {len(wb.sheetnames)}개의 시트를 발견했습니다.\n")

    api_list = []

    for idx, sheet_name in enumerate(wb.sheetnames):
        ws = wb[sheet_name]
        api_info = parse_sheet_api_info(ws, sheet_name)
        if api_info:
            api_list.append(api_info)
            print(f"  [{idx + 1:3d}] {sheet_name}")
            print(f"        API 명: {api_info.get('api_name', 'N/A')}")
            print(f"        API ID: {api_info.get('api_id', 'N/A')}")
            print(f"        Method: {api_info.get('method', 'N/A')}")
            print(f"        운영 도메인: {api_info.get('prod_domain', 'N/A')}")
            print(f"        모의투자 도메인: {api_info.get('mock_domain', 'N/A')}")
            print()

    print(f"\n총 {len(api_list)}개의 API 정보를 파싱했습니다.")
    print("=" * 70)

    return api_list


def parse_sheet_api_info(ws, sheet_name):
    """시트에서 API 기본 정보를 추출합니다."""
    info = {"sheet_name": sheet_name}

    for row in ws.iter_rows(min_row=1, max_row=min(30, ws.max_row), values_only=False):
        cells = {c.column: c.value for c in row if c.value is not None}

        # 키(column 1) - 값(column 3) 매핑 패턴
        key = cells.get(1, "")
        val = cells.get(3, "")

        if key and val:
            key_str = str(key).strip()
            val_str = str(val).strip()

            if key_str == "API 명":
                info["api_name"] = val_str
            elif key_str == "API ID":
                info["api_id"] = val_str
            elif key_str == "Method":
                info["method"] = val_str
            elif key_str == "운영 도메인":
                info["prod_domain"] = val_str
            elif key_str == "모의투자 도메인":
                info["mock_domain"] = val_str
            elif key_str == "URL":
                info["url"] = val_str
            elif key_str == "Content-Type":
                info["content_type"] = val_str
            elif key_str == "Format":
                info["format"] = val_str
            elif key_str == "메뉴 위치":
                info["menu_path"] = val_str

    # API 명이 없으면 유효한 API 시트가 아닌 것으로 판단
    if "api_name" not in info:
        return None

    return info


# ──────────────────────────────────────────────
# Part 2: .env 에서 키 로드
# ──────────────────────────────────────────────
def load_env_keys():
    """
    .env 파일에서 APP_KEY, SECRET_KEY 를 로드합니다.
    python-dotenv 를 사용합니다.
    """
    if not ENV_FILE.exists():
        print(f"[ERROR] .env 파일을 찾을 수 없습니다: {ENV_FILE}")
        sys.exit(1)

    load_dotenv(ENV_FILE)

    app_key = os.getenv("APP_KEY")
    secret_key = os.getenv("SECRET_KEY")

    if not app_key or not secret_key:
        print("[ERROR] .env 파일에 APP_KEY 또는 SECRET_KEY 가 설정되어 있지 않습니다.")
        print("  .env 파일 형식:")
        print("    APP_KEY=your_app_key_here")
        print("    SECRET_KEY=your_secret_key_here")
        sys.exit(1)

    print(f"\n✅ .env 로드 완료")
    print(f"   APP_KEY    : {app_key[:10]}{'*' * (len(app_key) - 10)}")
    print(f"   SECRET_KEY : {secret_key[:10]}{'*' * (len(secret_key) - 10)}")

    return app_key, secret_key


# ──────────────────────────────────────────────
# Part 3: Access Token 발급
# ──────────────────────────────────────────────
def request_access_token(app_key, secret_key):
    """
    키움 REST API - 접근토큰 발급 (au10001)
    
    [요청]
    POST /oauth2/token
    Header:
      Content-Type: application/json;charset=UTF-8
      api-id: au10001
    Body:
      grant_type: client_credentials
      appkey: <APP_KEY>
      secretkey: <SECRET_KEY>
    
    [응답]
      expires_dt: 만료일시
      token_type: bearer
      token: 접근토큰
      return_code: 0 (성공)
      return_msg: 메시지
    """
    base_url = MOCK_BASE_URL if USE_MOCK else PROD_BASE_URL
    url = base_url + TOKEN_ENDPOINT

    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "api-id": TOKEN_API_ID,
    }

    body = {
        "grant_type": "client_credentials",
        "appkey": app_key,
        "secretkey": secret_key,
    }

    print("\n" + "=" * 70)
    print(" 🔑 Access Token 발급 테스트")
    print("=" * 70)
    print(f"  URL     : {url}")
    print(f"  Method  : POST")
    print(f"  API ID  : {TOKEN_API_ID}")
    print(f"  도메인   : {'모의투자' if USE_MOCK else '운영'}")
    print(f"  Request Body:")
    print(f"    grant_type : {body['grant_type']}")
    print(f"    appkey     : {body['appkey'][:10]}...")
    print(f"    secretkey  : {body['secretkey'][:10]}...")
    print("-" * 70)

    try:
        response = requests.post(url, headers=headers, json=body, timeout=10)
        print(f"\n  HTTP Status Code: {response.status_code}")

        if response.status_code == 200:
            res_json = response.json()
            return_code = res_json.get("return_code", -1)
            return_msg = res_json.get("return_msg", "")
            token = res_json.get("token", "")
            token_type = res_json.get("token_type", "")
            expires_dt = res_json.get("expires_dt", "")

            print(f"\n  [응답 결과]")
            print(f"    return_code : {return_code}")
            print(f"    return_msg  : {return_msg}")
            print(f"    token_type  : {token_type}")
            print(f"    expires_dt  : {expires_dt}")

            if return_code == 0 and token:
                print(f"    token       : {token[:20]}...{token[-10:]}")
                print(f"\n  ✅ Access Token 발급 성공!")

                # 토큰을 .env에 저장할지 여부 확인
                save_token_to_env(token, expires_dt)
                return token
            else:
                print(f"\n  ❌ Access Token 발급 실패: {return_msg}")
                return None
        else:
            print(f"\n  ❌ HTTP 오류 발생")
            try:
                error_json = response.json()
                print(f"    Response: {json.dumps(error_json, ensure_ascii=False, indent=2)}")
            except Exception:
                print(f"    Response: {response.text[:500]}")
            return None

    except requests.exceptions.Timeout:
        print(f"\n  ❌ 요청 타임아웃 (10초)")
        return None
    except requests.exceptions.ConnectionError as e:
        print(f"\n  ❌ 연결 오류: {e}")
        return None
    except Exception as e:
        print(f"\n  ❌ 예외 발생: {e}")
        return None


def save_token_to_env(token, expires_dt):
    """발급받은 토큰을 .env 파일에 ACCESS_TOKEN 으로 저장합니다."""
    env_lines = []
    token_exists = False

    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            env_lines = f.readlines()

    new_lines = []
    for line in env_lines:
        if line.strip().startswith("ACCESS_TOKEN="):
            new_lines.append(f'ACCESS_TOKEN={token}\n')
            token_exists = True
        elif line.strip().startswith("TOKEN_EXPIRES="):
            new_lines.append(f'TOKEN_EXPIRES={expires_dt}\n')
        else:
            new_lines.append(line)

    if not token_exists:
        new_lines.append(f'ACCESS_TOKEN={token}\n')
        new_lines.append(f'TOKEN_EXPIRES={expires_dt}\n')

    with open(ENV_FILE, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

    print(f"\n  💾 토큰이 .env 파일에 저장되었습니다.")
    print(f"     ACCESS_TOKEN={token[:20]}...")
    print(f"     TOKEN_EXPIRES={expires_dt}")


# ──────────────────────────────────────────────
# Part 4: 토큰으로 간단한 API 테스트 호출
# ──────────────────────────────────────────────
def test_api_with_token(token):
    """발급받은 토큰으로 간단한 API 호출 테스트를 수행합니다."""
    if not token:
        print("\n⚠️  토큰이 없어 API 테스트를 건너뜁니다.")
        return

    base_url = MOCK_BASE_URL if USE_MOCK else PROD_BASE_URL

    print("\n" + "=" * 70)
    print(" 🧪 토큰 유효성 테스트 (종목 기본정보 조회)")
    print("=" * 70)

    # 삼성전자(005930) 기본정보 조회 시도
    url = base_url + "/api/dostk/stkinfo"
    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": f"Bearer {token}",
        "api-id": "ka10001",
    }
    body = {
        "stk_cd": "005930"
    }

    try:
        response = requests.post(url, headers=headers, json=body, timeout=10)
        print(f"  HTTP Status: {response.status_code}")

        if response.status_code == 200:
            res_json = response.json()
            return_code = res_json.get("return_code", -1)
            return_msg = res_json.get("return_msg", "")
            print(f"  return_code: {return_code}")
            print(f"  return_msg : {return_msg}")

            if return_code == 0:
                print(f"\n  ✅ 토큰이 정상적으로 동작합니다!")
                # 주요 응답 데이터 일부 출력
                for key, val in list(res_json.items())[:10]:
                    if key not in ("return_code", "return_msg"):
                        print(f"    {key}: {val}")
            else:
                print(f"\n  ⚠️  API 응답 코드: {return_code} - {return_msg}")
        else:
            print(f"  응답: {response.text[:300]}")

    except Exception as e:
        print(f"  ❌ 테스트 중 오류: {e}")


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
def main():
    print("╔" + "═" * 68 + "╗")
    print("║  키움 REST API 엑셀 문서 읽기 + Access Token 발급 테스트      ║")
    print("╚" + "═" * 68 + "╝")

    # 1. 엑셀 문서 읽기
    api_list = read_excel_api_info()

    # 2. .env에서 키 로드
    app_key, secret_key = load_env_keys()

    # 3. Access Token 발급
    token = request_access_token(app_key, secret_key)

    # 4. 토큰으로 API 테스트 (토큰 발급 성공 시에만)
    if token:
        test_api_with_token(token)

    print("\n" + "=" * 70)
    print(" 🏁 테스트 완료")
    print("=" * 70)


if __name__ == "__main__":
    main()

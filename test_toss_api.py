import argparse
import json
import os
from pathlib import Path
import sys

import requests


BASE_URL = "https://openapi.tossinvest.com"
ENV_PATH = Path(__file__).resolve().parent / ".env"


def load_credentials():
    values = {}
    if ENV_PATH.exists():
        for line in ENV_PATH.read_text(encoding="utf-8-sig").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip().removeprefix("export ").strip()
            if key in ("Toss_client_id", "Toss_secret_key"):
                values[key] = value.strip().strip("\"'")

    for key in ("Toss_client_id", "Toss_secret_key"):
        values[key] = os.environ.get(key, values.get(key, ""))
        if not values[key]:
            raise ValueError(f"Missing {key} in environment or .env")
    return values


def check_response(response, operation):
    if not response.ok:
        print(f"{operation} failed: HTTP {response.status_code}", file=sys.stderr)
        if response.status_code == 403:
            print("Check the allowed IP list in Toss Securities WTS Open API settings.", file=sys.stderr)
        elif response.status_code == 401:
            print("Check the client credentials and their active status.", file=sys.stderr)
        raise SystemExit(1)
    try:
        return response.json()
    except requests.exceptions.JSONDecodeError:
        raise ValueError(f"{operation} returned invalid JSON") from None


def main():
    parser = argparse.ArgumentParser(description="Test Toss Securities authentication and stock lookup.")
    parser.add_argument("--symbol", default="005930", help="Stock symbol (default: 005930)")
    args = parser.parse_args()
    credentials = load_credentials()

    with requests.Session() as session:
        token_response = session.post(
            f"{BASE_URL}/oauth2/token",
            data={
                "grant_type": "client_credentials",
                "client_id": credentials["Toss_client_id"],
                "client_secret": credentials["Toss_secret_key"],
            },
            timeout=15,
        )
        token_data = check_response(token_response, "Token request")
        token = token_data.get("access_token")
        if not token:
            raise ValueError("Token response did not contain an access token")
        print(f"Token issued successfully (expires in {token_data.get('expires_in', 'unknown')} seconds).")

        stock_response = session.get(
            f"{BASE_URL}/api/v1/stocks",
            params={"symbols": args.symbol},
            headers={"Authorization": f"Bearer {token}"},
            timeout=15,
        )
        stock_data = check_response(stock_response, "Stock lookup")
        if not stock_data.get("result"):
            raise ValueError("Stock lookup returned no results")
        print("Stock lookup succeeded:")
        print(json.dumps(stock_data["result"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
    except requests.RequestException as exc:
        print(f"Network error: {type(exc).__name__}", file=sys.stderr)
        sys.exit(1)
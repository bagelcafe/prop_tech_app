import requests
import json
import time
import os

# Load Token from .env
ENV_PATH = ".env"
access_token = ""
if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, _, value = line.partition("=")
                if key.strip() == "ACCESS_TOKEN":
                    val = value.strip()
                    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                        val = val[1:-1]
                    access_token = val
                    break

print(f"Loaded Token: {access_token[:10]}...")

def test_api(api_id, endpoint, data):
    host = 'https://api.kiwoom.com'
    url = host + endpoint
    headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': f'Bearer {access_token}',
        'api-id': api_id
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=3)
        if response.status_code == 200:
            res_json = response.json()
            code = res_json.get('return_code', -1)
            msg = res_json.get('return_msg', '')
            if code == 0:
                print(f"[OK] {api_id} @ {endpoint}")
                return True
            else:
                print(f"[FAIL] {api_id} @ {endpoint} -> {msg}")
        else:
            print(f"[HTTP {response.status_code}] {api_id} @ {endpoint}")
    except Exception as e:
        print(f"[ERROR] {api_id} @ {endpoint} -> {e}")
    return False

# Test Params
stk_cd = '005930'
endpoints = ['/api/dostk/stkinfo', '/api/dostk/rkinfo', '/api/dostk/chart', '/api/dostk/stock/price']

print("=== CHECKING ENDPOINTS ===")
# 1. Info
for ep in endpoints:
    if test_api('ka10001', ep, {'stk_cd': stk_cd}):
        # print(f"Basic Info found at {ep}")
        pass

# 2. Chart
trial_data = {'stk_cd': stk_cd, 'tic_scope': '1', 'upd_stkpc_tp': '1'}
for ep in endpoints:
    if test_api('ka10080', ep, trial_data):
        # print(f"Chart found at {ep}")
        pass
print("=== DONE ===")

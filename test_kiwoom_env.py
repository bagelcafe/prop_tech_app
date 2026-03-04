import requests
import json
import time
import os

# Load Token from .env
ENV_PATH = "/home/bagelcafe/01_source/prop_tech_app/.env"
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

print(f"Loaded Token from .env: {access_token[:10]}... (Len: {len(access_token)})")

if not access_token:
    print("ERROR: ACCESS_TOKEN not found in .env")
    exit(1)

def test_api(api_id, endpoint, data):
    host = 'https://api.kiwoom.com'
    url = host + endpoint
    headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': f'Bearer {access_token}', # Try with Bearer
        'api-id': api_id
    }
    
    # Try with Bearer
    print(f"Testing {api_id} @ {endpoint} (Bearer)...")
    try:
        response = requests.post(url, headers=headers, json=data, timeout=5)
        if response.status_code == 200:
            res_json = response.json()
            code = res_json.get('return_code', -1)
            msg = res_json.get('return_msg', '')
            if code == 0:
                print(f"[OK] {api_id} @ {endpoint}")
                return True
            else:
                if "Token" in msg:
                    # Retry without Bearer
                    print(f"Token Error with Bearer. Retrying without Bearer...")
                    headers['Authorization'] = access_token
                    response = requests.post(url, headers=headers, json=data, timeout=5)
                    res_json = response.json()
                    code = res_json.get('return_code', -1)
                    msg = res_json.get('return_msg', '')
                    if code == 0:
                        print(f"[OK] {api_id} @ {endpoint} (No Bearer)")
                        return True
                    else:
                        print(f"[FAIL] {api_id} @ {endpoint} (No Bearer) -> {msg}")
                else:
                    print(f"[FAIL] {api_id} @ {endpoint} -> {msg}")
        else:
            print(f"[HTTP {response.status_code}] {api_id} @ {endpoint}")
    except Exception as e:
        print(f"[ERROR] {api_id} @ {endpoint} -> {e}")
    return False

# Test Params
stk_cd = '005930'
endpoints = ['/api/dostk/stkinfo', '/api/dostk/rkinfo']

print("=== STARTING ENV TOKEN TEST ===")
for ep in endpoints:
    if test_api('ka10001', ep, {'stk_cd': stk_cd}):
        print(f"SUCCESS on {ep}")
        break  
print("=== END TEST ===")

import requests
import json
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

def test_chart(scope_val, scope_name):
    url = 'https://api.kiwoom.com/api/dostk/chart'
    headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': f'Bearer {access_token}',
        'api-id': 'ka10080'
    }
    
    # 005930 Samsung Electronics
    data = {
        'stk_cd': '005930', 
        'tic_scope': str(scope_val), 
        'upd_stkpc_tp': '1'
    }
    
    print(f"Testing Scope {scope_val} ({scope_name})...")
    try:
        response = requests.post(url, headers=headers, json=data, timeout=3)
        if response.status_code == 200:
            res_json = response.json()
            code = res_json.get('return_code', -1)
            msg = res_json.get('return_msg', '')
            chart_data = res_json.get('stk_min_pole_chart_qry', [])
            
            # Note: The key 'stk_min_pole_chart_qry' might change for Day/Week/Month?
            # Or it might be a generic key. Let's check keys available.
            
            if code == 0:
                print(f"[OK] Scope {scope_val}: Got {len(chart_data)} records")
                if len(chart_data) > 0:
                    print(f"   Sample: {chart_data[0]}")
                else:
                    # Check if data is in another key
                    print(f"   Keys returned: {list(res_json.keys())}")
                return True
            else:
                print(f"[FAIL] Scope {scope_val} -> {msg}")
        else:
            print(f"[HTTP {response.status_code}]")
            print(response.text[:200])
    except Exception as e:
        print(f"[ERROR] {e}")
    return False

print("=== TIC SCOPE TEST ===")
# 1: Minute (Verified)
# Test 2: Day?
test_chart(2, "Day - Hypothesized")
# Test 3: Week?
test_chart(3, "Week - Hypothesized")
# Test 4: Month?
test_chart(4, "Month - Hypothesized")
# Test D, W, M just in case
test_chart("D", "Day - Char")

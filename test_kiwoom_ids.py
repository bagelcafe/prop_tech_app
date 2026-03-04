import requests
import json
import os

ENV_PATH = "/home/bagelcafe/01_source/prop_tech_app/.env"
access_token = ""
if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, _, value = line.partition("=")
                if key.strip() == "ACCESS_TOKEN":
                    val = value.strip()
                    val = val.strip('"').strip("'")
                    access_token = val
                    break

def test_id(api_id, name):
    url = 'https://api.kiwoom.com/api/dostk/chart'
    headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': f'Bearer {access_token}',
        'api-id': api_id
    }
    data = {'stk_cd': '005930', 'upd_stkpc_tp': '1'} 
    # Try removing tic_scope as daily might not need it
    
    # Try with tic_scope just in case
    # data['tic_scope'] = '1' 
    
    print(f"Testing API ID {api_id} ({name})...")
    try:
        response = requests.post(url, headers=headers, json=data, timeout=3)
        if response.status_code == 200:
            res_json = response.json()
            code = res_json.get('return_code', -1)
            msg = res_json.get('return_msg', '')
            
            if code == 0:
                print(f"[OK] {api_id}: Success")
                # Look for data keys
                keys = list(res_json.keys())
                print(f"   Keys: {keys}")
                # Print first item of the list if exists
                for k in keys:
                    if isinstance(res_json[k], list) and len(res_json[k]) > 0:
                         print(f"   Sample ({k}): {res_json[k][0]}")
                         break
                return True
            else:
                print(f"[FAIL] {api_id} -> {msg}")
        else:
            print(f"[HTTP {response.status_code}]")
    except Exception as e:
        print(f"[ERROR] {e}")
    return False

# Test potential IDs for Day/Week/Month
test_id("ka10081", "Day?")
test_id("ka10082", "Week?")
test_id("ka10083", "Month?")

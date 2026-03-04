import requests
import json
import time

access_token = "S7HJ_jmCb3yLESVjyz-OXPAHWltyfsBA-nZcxxshkA6zcqSlChxgJRl3oN5eZKppjyKese9lr4knJi86-fIMww"

def test_api(api_id, endpoint, use_bearer):
    host = 'https://api.kiwoom.com'
    url = host + endpoint
    
    auth_val = f'Bearer {access_token}' if use_bearer else access_token
    
    headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'authorization': auth_val, # Lowercase key
        'Authorization': auth_val, # Try both cases just in case? No, requests handles case insensitive but let's stick to one
        'api-id': api_id
    }
    # Clean up headers, use one Authorization key
    del headers['authorization']
    headers['Authorization'] = auth_val
    
    print(f"Testing {url} (Bearer={use_bearer}) with api-id: {api_id}...")
    try:
        response = requests.post(url, headers=headers, json={'stk_cd': '005930'})
        if response.status_code == 200:
            res_json = response.json()
            msg = res_json.get('return_msg', '')
            code = res_json.get('return_code', -1)
            print(f"Response: Code={code}, Msg={msg}")
            if code == 0:
                print(f"[OK] SUCCESS!")
                return True
            else:
                 print(f"[FAIL] Code {code}: {msg}")
        else:
            print(f"[HTTP {response.status_code}]")
            print(response.text[:200])
    except Exception as e:
        print(f"[ERROR] {e}")
    return False

# Test Cases
print("=== STARTING PHASE 2 TEST ===")
endpoints = ["/api/dostk/stkinfo", "/api/dostk/rkinfo"]

api_ids = ["ka10001"]

for ep in endpoints:
    for aid in api_ids:
        # Try with Bearer
        if test_api(aid, ep, True): break
        time.sleep(0.5)
        # Try without Bearer
        if test_api(aid, ep, False): break
        time.sleep(0.5)

print("=== TEST COMPLETED ===")

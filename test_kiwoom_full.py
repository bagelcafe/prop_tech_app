import requests
import json
import time

access_token = "S7HJ_jmCb3yLESVjyz-OXPAHWltyfsBA-nZcxxshkA6zcqSlChxgJRl3oN5eZKppjyKese9lr4knJi86-fIMww"

def test_api(api_id, endpoint, data):
    host = 'https://api.kiwoom.com'
    url = host + endpoint
    headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'authorization': f'Bearer {access_token}',
        'api-id': api_id
    }
    try:
        print(f"Testing {api_id} @ {url}...")
        response = requests.post(url, headers=headers, json=data, timeout=5)
        if response.status_code == 200:
            res_json = response.json()
            msg = res_json.get('return_msg', '')
            code = res_json.get('return_code', -1)
            if code == 0:
                print(f"[OK] {api_id} @ {endpoint}")
                return True
            else:
                # print(f"[FAIL] {api_id} @ {endpoint} -> {msg}")
                if "잘못된 요청입니다" not in msg:
                    print(f"[INTERESTING] {api_id} @ {endpoint} -> {msg}")
        else:
            print(f"[HTTP {response.status_code}] {api_id} @ {endpoint}")
            # pass
    except Exception as e:
        print(f"[ERROR] {api_id} @ {endpoint} -> {e}")
    return False

if __name__ == '__main__':
    stk_cd = '005930'
    endpoints = [
        '/api/dostk/mrkcond',
        '/api/dostk/stkinfo',
        '/api/dostk/stockinfo',
        '/api/dostk/rkinfo',
        '/api/dostk/chart'
    ]
    # TRs we want to find
    # ka10001: basic info
    # ka10080: chart
    # ka10004: hoga (already found ok at mrkcond)
    
    print("Testing ka10001 (Basic Info)...")
    for ep in endpoints:
        if test_api('ka10001', ep, {'stk_cd': stk_cd}):
            print(f"FOUND ka10001 at {ep}")
        
    print("\nTesting ka10080 (Chart)...")
    # chart needs more params: tic_scope, upd_stkpc_tp
    trial_data = {'stk_cd': stk_cd, 'tic_scope': '1', 'upd_stkpc_tp': '1'}
    for ep in endpoints:
         if test_api('ka10080', ep, trial_data):
            print(f"FOUND ka10080 at {ep}")

    print("\nTesting ka10004 (Hoga - Verify)...")
    test_api('ka10004', '/api/dostk/mrkcond', {'stk_cd': stk_cd})

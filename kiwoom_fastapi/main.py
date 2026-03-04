from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import httpx
import uvicorn
import os

app = FastAPI()

# Absolute paths for sub-app
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(CURRENT_DIR, "static")
TEMPLATES_DIR = os.path.join(CURRENT_DIR, "templates")

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

templates = Jinja2Templates(directory=TEMPLATES_DIR)

# Token from user's kiwoom.py
# Token load from parent .env

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # prop_tech_app
ENV_PATH = os.path.join(BASE_DIR, ".env")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")

if os.path.exists(ENV_PATH):
    print(f"DEBUG: Found .env at {ENV_PATH}")
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, _, value = line.partition("=")
                if key.strip() == "ACCESS_TOKEN":
                    val = value.strip()
                    # Remove surrounding quotes if present
                    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                        val = val[1:-1]
                    ACCESS_TOKEN = val
                    print(f"DEBUG: Loaded ACCESS_TOKEN from .env (Length: {len(ACCESS_TOKEN)}) => {ACCESS_TOKEN[:10]}...")
                    break
else:
    print(f"DEBUG: .env NOT found at {ENV_PATH}")

if not ACCESS_TOKEN:
    print("Warning: ACCESS_TOKEN not found in .env")

HOST = "https://api.kiwoom.com"

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    try:
        return templates.TemplateResponse("index.html", {"request": request})
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(f"Kiwoom Template Error: {error_msg}")
        return HTMLResponse(content=f"<h1>Error loading template</h1><pre>{error_msg}</pre>", status_code=500)

@app.get("/api/stock/{code}")
@app.get("/api/stock/{code}")
async def get_stock_data(code: str):
    headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        # Authorization will be set dynamically
    }

    try:
        # Try with Bearer first
        auth_header = f'Bearer {ACCESS_TOKEN}'
        headers['Authorization'] = auth_header
        
        async with httpx.AsyncClient() as client:
            print(f"DEBUG: Try 1 - Calling API with {auth_header[:15]}...")
            # 1. Fetch Basic Info (ka10001) via stkinfo
            info_res = await client.post(
                f"{HOST}/api/dostk/stkinfo",
                headers={**headers, 'api-id': 'ka10001'},
                json={'stk_cd': code}
            )
            info_data = info_res.json()
            
            # Check for Token Error (8005) or similar
            # If error, try without Bearer
            # Note: Test showed Bearer works fine with stkinfo, but we keep fallback just in case
            if info_data.get('return_code') != 0 and "Token" in info_data.get('return_msg', ''):
                 print(f"DEBUG: Attempt 1 Failed with {info_data.get('return_msg')}. Retrying without Bearer...")
                 auth_header = ACCESS_TOKEN # Try raw token
                 headers['Authorization'] = auth_header
                 
                 info_res = await client.post(
                    f"{HOST}/api/dostk/stkinfo",
                    headers={**headers, 'api-id': 'ka10001'},
                    json={'stk_cd': code}
                 )
                 info_data = info_res.json()
                 print(f"DEBUG: Attempt 2 Result: {info_data.get('return_code')}")

            if info_data.get('return_code') != 0:
                print(f"DEBUG: Info API Error: {info_data}")
                return JSONResponse(status_code=400, content={"error": info_data.get('return_msg', 'Failed to fetch basic info')})
                
            # 2. Fetch Chart Data (ka10080) via chart endpoint
            # Use the successful auth_header
            chart_res = await client.post(
                f"{HOST}/api/dostk/chart",
                headers={**headers, 'Authorization': auth_header, 'api-id': 'ka10080'},
                json={'stk_cd': code, 'tic_scope': '1', 'upd_stkpc_tp': '1'}
            )
            chart_data = chart_res.json()

            # We return output
            # ka10080 returns a list in 'stk_min_pole_chart_qry'
            chart_list = chart_data.get('stk_min_pole_chart_qry', [])
            
            return {
                "info": info_data,
                "chart": chart_list
            }

    except Exception as e:
        print(f"DEBUG: Exception in get_stock_data: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from services import service
from typing import Optional, List
from pydantic import BaseModel
import logging
import os
from datetime import datetime
from dateutil.relativedelta import relativedelta
from datetime import datetime
from dateutil.relativedelta import relativedelta
from stats_service import stats_service

# Kiwoom App Integration
from kiwoom_fastapi.main import app as kiwoom_app

# --- 로깅 설정 ---
LOG_DIR = "log"
os.makedirs(LOG_DIR, exist_ok=True)

# --- 환경변수 수동 로드 ---
ENV_PATH = ".env"
if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, _, value = line.partition("=")
                os.environ[key.strip()] = value.strip()

ENABLE_ADSENSE = os.environ.get("ENABLE_ADSENSE", "false").lower() == "true"



def get_today_logger():
    """오늘 날짜에 해당하는 로거를 반환"""
    today_str = datetime.now().strftime("%Y%m%d")
    log_filename = f"service_log_{today_str}.log"
    log_path = os.path.join(LOG_DIR, log_filename)
    
    logger = logging.getLogger("service_logger")
    logger.setLevel(logging.INFO)
    
    # 중복 핸들러 방지
    if not logger.handlers:
        file_handler = logging.FileHandler(log_path, encoding="utf-8")
        formatter = logging.Formatter("%(asctime)s - %(client_ip)s - %(message)s")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        
    return logger

app = FastAPI()

# 미들웨어: 접속 기록 로깅
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # 요청 정보 추출
    client_ip = request.client.host if request.client else "unknown"
    method = request.method
    url = request.url.path
    query = str(request.url.query)
    
    # 처리 수행
    response = await call_next(request)
    
    # 로깅 (응답 상태 포함)
    status_code = response.status_code
    
    # 정적 파일 외의 API 호출만 기록하거나, 전체 기록하거나. 
    # 요구사항: 접속 기록 정보 -> 전체 기록이 안전.
    if not url.startswith("/static") and url != "/favicon.ico":
        # 1. 기존 파일 로깅 (디버깅용 유지)
        logger = get_today_logger()
        log_msg = f"{method} {url} ?{query} => Status: {status_code}"
        logger.info(log_msg, extra={"client_ip": client_ip})
        
        # 2. 통계 서비스 집계 (JSON 저장)
        stats_service.record_request(client_ip)
        
    return response

# Serve static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Mount Kiwoom Sub-App
app.mount("/kiwoom", kiwoom_app)

class RegionOption(BaseModel):
    code: str
    label: str
    dong_name: str

class TradeItem(BaseModel):
    type: str # 매매, 전세, 월세
    apt_name: str
    dong: str
    price: str
    price_num: int
    area: str
    pyung: float
    floor: str
    build_year: str
    date: str

@app.get("/api/config")
def get_config():
    return {"enable_adsense": ENABLE_ADSENSE}

@app.get("/")
def read_root():
    return RedirectResponse(url="/static/index.html")

@app.get("/api/regions", response_model=List[RegionOption])
def search_regions(query: str = Query(..., min_length=1)):
    """
    Search for legal dong codes by name.
    """
    results = service.search_lawd_codes(query)
    return results

@app.get("/api/search", response_model=List[TradeItem])
def search_apt_data(
    code: str = Query(...), 
    dong: Optional[str] = Query(None), 
    type: str = Query("all", enum=["all", "sale", "jeonse"]),
    start_month: Optional[str] = Query(None, min_length=6, max_length=6),
    end_month: Optional[str] = Query(None, min_length=6, max_length=6)
):
    """
    Fetch real estate data based on Lawd Code and Dong Name.
    Code: 5-digit region code
    Dong: Specific dong name for filtering (Optional, if empty returns whole district)
    Type: Transaction type (all, sale, jeonse)
    StartMonth, EndMonth: YYYYMM format (optional)
    """
    # handle empty string explicitly if frontend sends it
    if dong == "": 
        dong = None
        
    data = service.get_real_estate_data(code, dong, type, start_month, end_month)
    return data

@app.get("/api/stats")
def get_stats(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)")
):
    """통계 서비스(JSON)를 통해 접속 통계 반환"""
    
    # 1. 오늘 날짜 로그 (실시간 모니터링용 - 기존 로직 유지)
    today_str = datetime.now().strftime("%Y%m%d")
    log_filename = f"service_log_{today_str}.log"
    log_path = os.path.join(LOG_DIR, log_filename)
    
    logs = []
    if os.path.exists(log_path):
        try:
            with open(log_path, "r", encoding="utf-8") as f:
                for line in f:
                    try:
                        parts = line.split(" - ", 2)
                        if len(parts) >= 3:
                            time_part = parts[0].split(",")[0]
                            ip_part = parts[1]
                            msg_part = parts[2]
                            
                            if "=> Status:" in msg_part:
                                req_info, status_str = msg_part.split("=> Status:")
                                status = int(status_str.strip())
                                url = req_info.strip()
                            else:
                                url = msg_part.strip()
                                status = 0
                                
                            logs.append({
                                "time": time_part,
                                "ip": ip_part,
                                "url": url,
                                "status": status
                            })
                    except: continue
        except: pass

    # 2. 통계 정보 (JSON 기반)
    # 기본값 설정: 최근 7일
    today_date = datetime.now().date()
    
    target_end_str = end_date if end_date else today_date.strftime("%Y-%m-%d")
    
    if start_date:
        target_start_str = start_date
    else:
        # End date 기준 6일 전
        end_dt = datetime.strptime(target_end_str, "%Y-%m-%d").date()
        target_start_str = (end_dt - relativedelta(days=6)).strftime("%Y-%m-%d")

    # JSON 서비스 호출
    stats_data = stats_service.get_stats(target_start_str, target_end_str)

    return {
        "today_logs": logs,
        "history": stats_data["history"],
        "summary": stats_data["summary"],
        "period": {
            "start": target_start_str,
            "end": target_end_str
        }
    }

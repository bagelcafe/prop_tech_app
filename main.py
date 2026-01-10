from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from services import service
from typing import Optional, List
from pydantic import BaseModel
import logging
import os
from datetime import datetime

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
        logger = get_today_logger()
        log_msg = f"{method} {url} ?{query} => Status: {status_code}"
        # Extra dict를 사용하여 format string의 client_ip를 채움
        logger.info(log_msg, extra={"client_ip": client_ip})
        
    return response

# Serve static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

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
def get_stats():
    """오늘 로그와 최근 7일간의 일별 접속 통계를 반환"""
    
    # 1. 오늘 로그 (기존 로직 유지)
    today_str = datetime.now().strftime("%Y%m%d")
    log_filename = f"service_log_{today_str}.log"
    log_path = os.path.join(LOG_DIR, log_filename)
    
    logs = []
    
    # 공통 파싱 로직 함수
    def parse_log_file(path):
        parsed_data = []
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
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
                                    
                                parsed_data.append({
                                    "time": time_part,
                                    "ip": ip_part,
                                    "url": url,
                                    "status": status
                                })
                        except:
                            continue
            except Exception as e:
                print(f"Error reading log {path}: {e}")
        return parsed_data

    logs = parse_log_file(log_path)
    
    # 2. 일별 히스토리 (전체 계산)
    history = []
    total_visitors = 0
    total_requests = 0
    
    try:
        # log 디렉토리의 모든 파일 조회 및 정렬
        all_files = sorted([f for f in os.listdir(LOG_DIR) if f.startswith("service_log_") and f.endswith(".log")])
        
        for fname in all_files:
            # 파일명에서 날짜 추출 (service_log_YYYYMMDD.log)
            date_str = fname.replace("service_log_", "").replace(".log", "")
            # 포맷 변경 YYYYMMDD -> YYYY-MM-DD
            formatted_date = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}"
            
            fpath = os.path.join(LOG_DIR, fname)
            day_logs = parse_log_file(fpath)
            
            if day_logs:
                # 통계 계산
                unique_ips = set(l['ip'] for l in day_logs)
                day_reqs = len(day_logs)
                
                day_visitors = len(unique_ips)
                
                total_visitors += day_visitors
                total_requests += day_reqs
                
                history.append({
                    "date": formatted_date,
                    "visitors": day_visitors,
                    "requests": day_reqs
                })
                
    except Exception as e:
        print(f"Error processing history: {e}")

    return {
        "today_logs": logs,
        "history": history[-7:], # 최근 7일만 그래프용으로 반환
        "summary": {
            "total_visitors": total_visitors,
            "total_requests": total_requests
        }
    }

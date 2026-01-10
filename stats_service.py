import json
import os
from datetime import datetime
from threading import Lock

STATS_FILE = "stats.json"

class StatsService:
    def __init__(self):
        self.lock = Lock()
        self._ensure_file()

    def _ensure_file(self):
        """통계 파일이 없으면 초기화"""
        if not os.path.exists(STATS_FILE):
            initial_data = {
                "summary": {
                    "total_visitors": 0,
                    "total_requests": 0
                },
                "daily": {} 
                # 구조: "YYYY-MM-DD": {"requests": 0, "visitors": ["ip1", "ip2"]}
            }
            with open(STATS_FILE, 'w', encoding='utf-8') as f:
                json.dump(initial_data, f, indent=4)

    def _load_data(self):
        try:
            with open(STATS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {"summary": {"total_visitors": 0, "total_requests": 0}, "daily": {}}

    def _save_data(self, data):
        with open(STATS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    def record_request(self, ip: str):
        """요청 발생 시 통계 업데이트"""
        today = datetime.now().strftime("%Y-%m-%d")
        
        with self.lock:
            data = self._load_data()
            
            # 데이터 무결성 체크
            if "daily" not in data: data["daily"] = {}
            if "summary" not in data: data["summary"] = {"total_visitors": 0, "total_requests": 0}

            # 오늘 날짜 초기화
            if today not in data["daily"]:
                data["daily"][today] = {"requests": 0, "visitors": []}
            
            stats = data["daily"][today]
            
            # API 호출 수 증가
            stats["requests"] += 1
            data["summary"]["total_requests"] += 1
            
            # 방문자 수 (Unique IP) 체크
            if ip not in stats["visitors"]:
                stats["visitors"].append(ip)
                # 일별 방문자 수가 곧 누적 방문자 수에 기여
                data["summary"]["total_visitors"] += 1
                
            self._save_data(data)

    def get_stats(self, start_date=None, end_date=None):
        """통계 조회 (기간 내 빈 날짜 0으로 채움)"""
        data = self._load_data()
        daily_records = data.get("daily", {})
        
        if not start_date or not end_date:
            return {
                "summary": data.get("summary", {"total_visitors": 0, "total_requests": 0}),
                "history": []
            }
            
        try:
            curr = datetime.strptime(start_date, "%Y-%m-%d").date()
            end = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
             return {
                "summary": data.get("summary", {"total_visitors": 0, "total_requests": 0}),
                "history": []
            }

        history = []
        from datetime import timedelta
        
        while curr <= end:
            s_date = curr.strftime("%Y-%m-%d")
            
            if s_date in daily_records:
                record = daily_records[s_date]
                visitors = len(record["visitors"])
                requests = record["requests"]
            else:
                visitors = 0
                requests = 0
            
            history.append({
                "date": s_date,
                "requests": requests,
                "visitors": visitors
            })
            
            curr += timedelta(days=1)
            
        return {
            "summary": data.get("summary", {"total_visitors": 0, "total_requests": 0}),
            "history": history
        }

# Singleton Instance
stats_service = StatsService()

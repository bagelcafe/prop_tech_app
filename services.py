import requests
import xml.etree.ElementTree as ET
import pandas as pd
import urllib3
from datetime import datetime
from dateutil.relativedelta import relativedelta
import os
import sys

# 공공데이터포털 인증서 에러 무시 설정
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --- 설정 정보 ---
TRADE_URL = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade"
RENT_URL = "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent"

API_KEY = "1abba94f25e9512aee3de56bb99d16a314960d4f3971ab2703cc82ba90268b2f"
CSV_FILE_PATH = "국토교통부_전국 법정동_20250807.csv"

class RealEstateService:
    def __init__(self):
        self.lawd_df = None
        self.load_lawd_finder()

    def get_previous_month(self):
        """현재 기준 전월 (YYYYMM) 반환"""
        today = datetime.now()
        prev_month = today - relativedelta(months=1)
        return prev_month.strftime("%Y%m")

    def load_lawd_finder(self):
        """CSV 파일을 읽어 법정동 검색을 위한 데이터프레임 로드"""
        if self.lawd_df is not None:
            return

        try:
            # 절대 경로로 변환 시도
            base_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(base_dir, CSV_FILE_PATH)
            
            # UTF-8 시도
            try:
                df = pd.read_csv(file_path, encoding='utf-8')
            except UnicodeDecodeError:
                df = pd.read_csv(file_path, encoding='cp949')

            # 삭제일자 없는(활성) 데이터만 필터링
            df = df[df['삭제일자'].isna()]
            df['법정동코드'] = df['법정동코드'].astype(str)
            self.lawd_df = df
            print("✅ 법정동 데이터 로드 완료", flush=True)
        except Exception as e:
            print(f"❌ 법정동 데이터 로드 실패: {e}", flush=True)
            self.lawd_df = pd.DataFrame()

    def search_lawd_codes(self, query):
        """동 이름 또는 구 이름으로 법정동 코드 검색"""
        if self.lawd_df.empty:
            return []

        # 1. 시군구명 검색 (구 단위 검색)
        gu_mask = self.lawd_df['시군구명'].str.contains(query, na=False)
        gu_results = self.lawd_df[gu_mask].drop_duplicates(subset=['시군구명'])
        
        # 2. 읍면동명 검색 (동 단위 검색)
        dong_mask = self.lawd_df['읍면동명'].str.contains(query, na=False)
        dong_results = self.lawd_df[dong_mask]

        found_list = []

        # 구 검색 결과 추가 (전체 검색용)
        for _, row in gu_results.iterrows():
            code_full = row['법정동코드']
            code_5 = code_full[:5]
            
            full_addr = f"{row['시도명']} {row['시군구명']} (전체)"
            
            found_list.append({
                "code": code_5,
                "label": full_addr, 
                "dong_name": "" # 동 이름 비워둠 -> 전체 검색
            })

        # 동 검색 결과 추가
        for _, row in dong_results.iterrows():
            code_full = row['법정동코드']
            code_5 = code_full[:5]
            
            addr_parts = [
                x for x in [row['시도명'], row['시군구명'], row['읍면동명']] 
                if pd.notna(x) and x != ""
            ]
            full_addr = " ".join(addr_parts)
            
            found_list.append({
                "code": code_5,
                "label": full_addr,
                "dong_name": row['읍면동명']
            })
            
        return found_list

    def fetch_api_data(self, url, lawd_cd, deal_ymd, num_of_rows=500):
        try:
            # User-Agent 추가 및 쿼리 파라미터 직접 구성 (403 해결)
            # requests param 대신 URL을 직접 만들어 403 Forbidden 문제(User-Agent, Encoding 이슈)를 방지
            request_url = f"{url}?LAWD_CD={lawd_cd}&DEAL_YMD={deal_ymd}&serviceKey={API_KEY}&numOfRows={num_of_rows}&pageNo=1"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'accept': '*/*'
            }
            
            # Force print to stdout
            print(f"DEBUG: Fetching {request_url}", flush=True)
            
            response = requests.get(request_url, headers=headers, verify=False, timeout=10)
            
            if response.status_code == 502:
                print(f"⚠️ API Server Error (502): 공공데이터포털 게이트웨이 오류/불안정. 잠시 후 시도하세요. ({url})", flush=True)
                return []
            
            if response.status_code == 403:
                print(f"⚠️ API Permission Error (403): 접근이 거부되었습니다. User-Agent 또는 IP 차단 확인 필요. Key: {API_KEY[:10]}...", flush=True)
                return []
                
            if response.status_code != 200:
                print(f"API Error {response.status_code}: {url}", flush=True)
                print(f"Response Body: {response.text[:200]}", flush=True)
                return []

            content = response.content.decode('utf-8')
            try:
                root = ET.fromstring(content)
            except ET.ParseError:
                 print(f"XML Parse Error. Content: {content[:100]}", flush=True)
                 return []
            
            result_code = root.findtext(".//header/resultCode")
            
            # Allow "00", "000", "OK"
            if result_code not in ["00", "000", "OK"]:
                result_msg = root.findtext(".//header/resultMsg")
                print(f"API Logic Error: {result_code} - {result_msg}", flush=True)
                return []

            items = root.findall(".//item")
            print(f"DEBUG: Found {len(items)} items", flush=True)
            return items
        except Exception as e:
            print(f"Error fetching API: {e}", flush=True)
            import traceback
            traceback.print_exc()
            return []

    def parse_items(self, items, txn_type):
        data_list = []
        for item in items:
            def get_val(tags):
                if isinstance(tags, str): tags = [tags]
                for t in tags:
                    v = item.findtext(t)
                    if v: return v.strip()
                return ""

            apt_name = get_val(["aptNm", "아파트"])
            dong = get_val(["umdNm", "법정동"])
            area = get_val(["excluUseAr", "전용면적"])
            floor = get_val(["floor", "층"])
            build_year = get_val(["buildYear", "건축년도"])
            
            # 날짜 처리 (두 자리 패딩 적용)
            y = get_val(["dealYear", "년"])
            m = get_val(["dealMonth", "월"]).zfill(2)
            d = get_val(["dealDay", "일"]).zfill(2)
            
            # 금액 처리
            if txn_type == "매매":
                price = get_val(["dealAmount", "거래금액"])
                deposit = "-"
                monthly = "-"
                price_num = int(price.replace(",", "")) if price.replace(",", "").isdigit() else 0
            else: # 전월세
                deposit = get_val(["depositAmount", "deposit", "보증금액"])
                monthly = get_val(["monthlyRent", "monthly", "월세금액"])
                price = f"보증금 {deposit}"
                if monthly and monthly != "0":
                    price += f" / 월 {monthly}"
                
                # 정렬용 가격 (보증금 기준)
                price_num = int(deposit.replace(",", "")) if deposit.replace(",", "").isdigit() else 0

            # 면적을 평으로 변환 (1평 = 3.305785 m2)
            pyung = 0
            try:
                pyung = round(float(area) / 3.305785, 1)
            except:
                pass

            row = {
                "type": txn_type,
                "apt_name": apt_name,
                "dong": dong,
                "price": price,
                "price_num": price_num,
                "area": area,
                "pyung": pyung,
                "floor": floor,
                "build_year": build_year,
                "date": f"{y}.{m}.{d}"
            }
            data_list.append(row)
        return data_list

    def get_real_estate_data(self, lawd_cd, dong_name, txn_filter="all", start_date=None, end_date=None):
        print(f"DEBUG: Search Request - Code:{lawd_cd}, Filter:{txn_filter}, Dong:{dong_name}, Date:{start_date or 'Auto'}~{end_date or 'Auto'}", flush=True)

        # 날짜 기본값 설정
        if not start_date:
            start_date = self.get_previous_month()
        if not end_date:
            end_date = start_date

        # 월별 순회
        target_months = []
        try:
            curr = datetime.strptime(start_date, "%Y%m")
            end = datetime.strptime(end_date, "%Y%m")
            
            while curr <= end:
                target_months.append(curr.strftime("%Y%m"))
                curr += relativedelta(months=1)
        except:
             target_months = [start_date]

        all_data = []

        for ym in target_months:
            # 매매 조회
            if txn_filter in ["all", "sale"]:
                items = self.fetch_api_data(TRADE_URL, lawd_cd, ym)
                parsed = self.parse_items(items, "매매")
                all_data.extend(parsed)

            # 전월세 조회
            if txn_filter in ["all", "jeonse"]:
                items = self.fetch_api_data(RENT_URL, lawd_cd, ym)
                parsed = self.parse_items(items, "전월세")
                
                filtered_rent = []
                for p in parsed:
                    if "월" in p['price']:
                        p['type'] = "월세"
                    else:
                        p['type'] = "전세"
                    
                    if txn_filter == "jeonse":
                         if p['type'] == "전세":
                            filtered_rent.append(p)
                    else:
                        filtered_rent.append(p)
                
                all_data.extend(filtered_rent)

        # 동 이름 필터링 (dong_name이 있을 때만)
        if dong_name:
            all_data = [d for d in all_data if d['dong'] == dong_name]

        # 정렬: 최신순 (날짜) -> 가격순
        all_data.sort(key=lambda x: x['price_num'], reverse=True)

        return all_data

# Singleton Logic
service = RealEstateService()

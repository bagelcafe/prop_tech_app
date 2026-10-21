# Prop Tech App (부동산 실거래가 조회 서비스)

이 프로젝트는 국토교통부 공공데이터 포털의 아파트 매매 및 전월세 실거래가 데이터를 활용하여, 쉽고 빠르게 부동산 정보를 조회할 수 있는 웹 애플리케이션입니다.

## 1. 주요 기능

*   **지역 검색**: 시군구 또는 읍면동 이름으로 법정동 코드를 검색할 수 있습니다.
*   **실거래가 조회**: 선택한 지역, 기간, 거래 유형(매매/전세/월세)에 따른 아파트 실거래 내역을 조회합니다.
*   **통계 대시보드**: 일별 방문자 수 및 요청 수 통계를 제공합니다.
*   **접속 로그**: 모든 API 요청에 대한 로그를 날짜별 파일로 저장합니다.

## 2. 기술 스택

*   **Language**: Python 3.9+
*   **Web Framework**: FastAPI
*   **Data Analysis**: Pandas (법정동 코드 데이터 처리)
*   **HTTP Client**: Requests (공공데이터 API 호출)
*   **Frontend**: HTML, CSS, JavaScript (Static files)

## 3. 프로젝트 구조

```
prop_tech_app/
├── main.py                 # FastAPI 앱 진입점, 라우팅, 미들웨어(로깅) 정의
├── services.py             # 비즈니스 로직 (공공데이터 API 호출, 데이터 파싱, 법정동 검색)
├── debug_server_check.py   # 서버 상태 확인용 스크립트
├── static/                 # 정적 파일 (HTML, CSS, JS, Favicon 등)
├── log/                    # 서비스 로그 저장 디렉토리 (자동 생성)
├── 국토교통부_전국 법정동_*.csv  # 법정동 코드 마스터 데이터
├── requirements.txt        # 의존성 패키지 목록
└── README.md               # 프로젝트 설명 파일
```

## 4. 동작 원리

### 4.1. 서버 초기화 및 데이터 로드
*   앱 구동 시 `services.py`의 `RealEstateService` 클래스가 초기화됩니다.
*   `국토교통부_전국 법정동_*.csv` 파일을 메모리(Pandas DataFrame)에 로드하여 빠른 지역 검색을 준비합니다.

### 4.2. 지역 검색 (`/api/regions`)
*   사용자가 입력한 검색어(시군구명 또는 읍면동명)를 메모리에 로드된 법정동 데이터에서 필터링하여 반환합니다.

### 4.3. 실거래가 데이터 조회 (`/api/search`)
1.  사용자가 선택한 지역(법정동 코드)과 기간을 기준으로 공공데이터 포털 API를 호출합니다.
    *   **매매**: `RTMSDataSvcAptTrade` API
    *   **전월세**: `RTMSDataSvcAptRent` API
2.  반환된 XML 데이터를 파싱하여 JSON 형태로 변환합니다.
3.  동 이름 필터링 및 가격/날짜 정렬을 수행한 후 클라이언트에 응답합니다.

### 4.4. 로깅 및 통계 (`/api/stats`)
*   `main.py`의 미들웨어(`log_requests`)가 모든 요청 정보를 `log/service_log_YYYYMMDD.log` 파일에 기록합니다.
*   `/api/stats` 엔드포인트는 이 로그 파일들을 분석하여 오늘 방문자 수와 최근 7일간의 히스토리를 반환합니다.

## 5. 설치 및 실행

### 필수 요건
*   Python 3.9 이상
*   공공데이터포털 API Key (코드 내 `services.py`에 포함되어 있음)

### 실행 방법

1.  **가상환경 생성 및 활성화**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # Windows: .venv\Scripts\activate
    ```

2.  **의존성 설치**
    ```bash
    pip install -r requirements.txt
    ```
    *(참고: `requirements.txt`가 없다면 `fastapi`, `uvicorn`, `pandas`, `requests`, `python-dateutil` 등을 설치해야 합니다.)*

3.  **서버 실행**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

4.  **접속**
    *   웹 브라우저에서 `http://localhost:8000` 접속

## Docker 실행

Docker Compose로 프론트엔드 빌드와 FastAPI 서버를 함께 실행합니다.

```bash
docker compose up --build -d
```

첫 실행 시 기존 프로젝트 루트의 `trades.db`와 `stats.json`을 `data/` 디렉터리로 자동 복사합니다. 이후 매매 이력, 통계, 로그는 `data/` 볼륨에 유지되므로 컨테이너를 재시작하거나 다시 생성해도 보존됩니다.

Compose 대신 직접 Docker 컨테이너를 실행하려면 다음 스크립트를 사용합니다.

```bash
chmod +x docker-run.sh
./docker-run.sh
```

기본 포트는 `8000`이며, 다른 포트를 사용하려면 `PORT=8080 ./docker-run.sh`처럼 실행합니다.

```bash
docker compose down
docker compose up -d
```

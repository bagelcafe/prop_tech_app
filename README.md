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
*   메인 앱의 lifespan은 키움 앱의 lifespan을 명시적으로 호출합니다. 키움 앱 단독 실행도 같은 초기화·종료 로직을 사용합니다.
*   초기화 순서는 SQLite 테이블 생성 → 키움 토큰 발급 시도 → 자산 스냅샷 스케줄러 시작입니다. 기존 테이블과 데이터는 유지됩니다.
*   DB 초기화 실패 시 기동을 중단합니다. 토큰 통신 오류·잘못된 JSON·빈 토큰은 기록 후 기동을 계속하며, 토큰이 없으면 이후 API 요청에서 발급을 다시 시도합니다.
*   종료 시 스케줄러 태스크를 취소하고 완료까지 기다립니다. 동일 앱의 활성 lifespan 중복 진입은 거부하며, 종료 후 재시작은 가능합니다.
*   스케줄러는 평일 15:40 KST에 동작하며, 장 마감 후 기동하면 당일 누락 스냅샷을 기록할 수 있습니다. 중복 방지는 프로세스 내부에 한정되므로 **단일 워커·단일 인스턴스**로 실행해야 합니다.
*   로컬 DB는 기본적으로 프로젝트 루트의 `trades.db`이며, `APP_DATA_DIR` 환경변수를 지정하면 해당 경로를 사용합니다. Docker Compose는 `/app/data/trades.db`를 사용합니다.

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

## 토스 계좌 보유종목

토스 계좌 내역은 자산 조회 화면을 열면 자동으로 조회됩니다. 앱은 별도의 계좌 조회 인증을 요구하지 않으므로, 서버와 프록시는 신뢰할 수 있는 사용자만 접근할 수 있도록 방화벽 또는 인증 게이트웨이로 보호해야 합니다. 외부 접속 시 HTTPS를 사용하세요.

토스 계좌 보유종목은 실시간 읽기 전용이며 수동 등록 내역을 변경하지 않습니다. 조회 성공 시 보유종목 표와 현재 요약의 수동 토스 내역을 실제 계좌 내역으로 대체하며, 달러 자산은 토스의 조회 시점 USD/KRW 표시 환율로 환산합니다. 환율 변동은 과거 매입 환율이 아닌 현재 환율을 매입액과 평가액 모두에 적용합니다. 자산 추이는 기존 수동 기록 기준이며 실시간 토스 내역을 포함하지 않습니다.

## 오프라인 수명주기 테스트

```bash
.venv/bin/python -m unittest test_kiwoom_lifespan -v
```

임시 SQLite DB와 모의 토큰·가격 응답으로 메인/키움 앱 초기화, 자산 추가·재저장·조회, 기존 데이터 보존, 중복 시작 방지 및 실패·종료 처리를 검증합니다. 운영 DB와 실제 증권사 API는 사용하지 않습니다. 기존 실 API 진단 스크립트와 분리하기 위해 전체 테스트 탐색 대신 위 모듈만 실행합니다.

`--reload` 실행 중 소스를 수정하면 서버가 자동 재시작되어 실제 DB 초기화, 토큰 발급 및 누락 스냅샷 기록이 실행될 수 있습니다. 운영 적용 전 DB를 백업하고 시작·종료 로그를 확인하세요.

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

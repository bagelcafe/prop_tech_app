# Changelog

설계·기능이 변경될 때마다 이 파일을 **함께 수정**한다 (최신 항목이 위). 관련 설계 문서(`*_DESIGN.md`, `README.md`)도 같이 갱신한다.

형식: `## YYYY-MM-DD` 아래에 Added / Changed / Fixed / Docs 로 구분.

## 2026-11-11

### Docs (AGENTS.md 추가, changelog 자동 기록 규칙 명시)
- `AGENTS.md` 생성: 에이전트/기여자가 따르는 규칙. "코드·설계·설정 변경 시 `changelog.md`에 자동 기록"을 최우선 규칙(§0)으로 명시. 프로젝트 개요, 빌드·테스트 명령, 도커, 감시봇 안전 규칙, 코드 스타일·의존성 지침 포함.

### Changed (토스 30분봉: 최근 5거래일 페이지네이션 집계)
- 토스 candles API는 `1m`/`1d`만 제공하고 1회 최대 200개 제한이라, 30분봉이 당일 일부만 나오던 문제 수정. `get_candles`가 `nextBefore` 커서로 1분봉을 여러 페이지 수집(`_fetch_candles_pages`, 상한 12페이지) 후 30분 버킷으로 집계하고 **최근 5거래일**만 반환(`toss_service.py`). 주말/휴장은 고유 날짜 기준으로 자동 제외.

### Added (Trailing Stop 봇 — 국내 매도 보호, 실주문 자동 집행)
- 설계 `TRAILING_BOT_DESIGN.md`: 국내 보유종목 순수 손절(고점 대비 -15%, MARKET), 서버 조건주문(SINGLE SELL) 안전망 + 봇 modify 추적 + 급락 백업매도 하이브리드. peak는 최근 120일 고점, 등록 즉시 손절권이면 노티 후 승인(AWAITING_CONFIRM).
- 주문 모듈 `toss_trading.py`: 조건주문 생성/수정/취소, 백업 시장가 매도, 매도가능수량. `BOT_DRY_RUN` 기본 모의, clientOrderId 멱등키, 401 토큰 재발급 재시도.
- 엔진 `trailing_bot.py`: `trailing_stops` 테이블, 순수 상태머신(`evaluate_tick`/`compute_stop`), 등록/승인/거절/해제/긴급정지/tick 루프, 서킷브레이커, 정규장 세션 가드.
- 라우터 `bot_router.py`: `/api/bot/*`(등록/조회/pending-confirms/confirm/reject/cancel/halt/resume). `main.py` lifespan에 tick 루프 연결.
- 프론트: 감시종목 `/api/toss/watchlist`(안랩 default, 120일 고점 peak + -15% stop 호가단위 보정), `WatchStopList.tsx`에 봇 등록 다이얼로그·승인 대기 노티(웹페이지)·상태 뱃지·긴급정지. 토스 차트 봉 선택(30분/일/주/월봉), default 종목을 감시 리스트 첫 종목으로 동적 로드.
- 테스트: `test_toss_service`/`test_toss_trading`/`test_trailing_bot` (mock, 실 API 미사용).

### Changed (도커 단일 컨테이너 + 데이터 마이그레이션 보강)
- `requirements.txt` 버전 핀 고정 + `python-dotenv` 추가(kiwoom 모듈 사용), 미사용 jinja2 제거, pandas 2.2.3 호환 위해 python-dateutil 2.9.0.post0.
- `Dockerfile`: healthcheck(`/api/config` urllib) + 단일 워커(`--workers 1`). `docker-entrypoint.sh`: 마이그레이션 로그 보강(멱등 복사). `docker-compose.yml`: `BOT_DRY_RUN`/`BOT_TICK_INTERVAL` 환경변수. `main.py`: 앱 로거 INFO(봇 tick/서킷브레이커 가시성).

## 2026-11-06

### Changed / Added (자산조회 국내·해외 분리)
- 메뉴 `자산 조회` 하위에 `국내종목`(/assets), `해외종목`(/assets/overseas) 추가 (`AppShell.tsx`, `App.tsx`).
- 국내종목: 토스 보유종목 중 KRW 종목만 카드/표/합계에 반영. 추이·코스피 고점·월초 수익률 차트는 해외 포함 전체 자산 기준(안내 문구 표시). 오늘 추이 지점도 전체 실시간 값 사용.
- 해외종목(`OverseasAssetsPage.tsx`): 토스 USD 보유종목 목록(수량/매입가/현재가/매입·평가금액/손익/수익률, 원화 환산 평가금액), 합계 행, 컬럼 정렬, 총매입·평가·손익 카드. 환율은 현재 환율.

### Changed (월초 수익률 비교: 지수 시가 기준)
- KOSPI/S&P500/NASDAQ 수익률을 해당일 시가 기준으로 산정 (1/2 시가 = 0%, 휴장 시 다음 거래일 시가, '현재'는 최신 종가). 포트폴리오는 종가 평가금액 기준 유지. `_index_closes` → `_index_prices`.

### Changed (월초 수익률 비교: 기준일 통일)
- 포트폴리오와 지수 모두 1/2 종가를 0% 기준으로 통일 (기존: 포트폴리오 12/31, 지수 1/2). 이후 지점은 매월 1일 + 현재.

### Changed (월초 수익률 비교: 지수 산정 기준)
- KOSPI/S&P500/NASDAQ 수익률은 해당일 지수 가격 기준으로 산정 (1일이 휴장이면 다음 거래일 종가, 마지막 '현재'는 최신 종가). 내 수익률은 기존대로 평가금액 기준 유지.

### Changed (코스피 고점 비교 표에 연초 평가금액 추가)
- `PeakComparison` 표의 6/19 열 왼쪽에 1/2 종가 기준 평가금액 열 추가 (`startDate`).
- `value-at`이 토스 일봉 페이지네이션(`_toss_closes_since`)을 쓰도록 변경, 조회 가능 범위를 190일 → 700일로 확대.

### Added (월초 기준 수익률 비교 그래프)
- `GET /api/assets/monthly-returns`: 매월 1일(휴장 시 직전 종가)·현재 시점의 현재 보유종목 평가금액을 1월 1일 대비 수익률로 계산하고 KOSPI(^KS11)/S&P500(^GSPC)/NASDAQ(^IXIC) 지수 수익률과 함께 반환. 토스 일봉은 `before/nextBefore`로 페이지네이션, 지수는 Yahoo Finance 일봉 사용. 1시간 메모리 캐시.
- 1월 1일 시세가 없는(이후 상장) 종목은 전 기간에서 제외하고 목록으로 표시. 미국 종목은 현재 환율 고정 적용.
- 코스피 고점 비교 아래에 `MonthlyReturnChart` 추가.

### Fixed (토스 HTTP 429)
- 원인: 토스 계좌 API(`/accounts`, `/holdings`)는 초당 1회(X-RateLimit-Limit: 1) 제한인데, 자산조회 페이지가 `/api/toss/holdings`와 `value-at`(내부에서 보유종목 재조회)를 동시에 호출해 초과.
- 수정: `get_toss_data`가 429 수신 시 `Retry-After`만큼 대기 후 최대 3회 재시도 (`toss_service.py`). 동시 3건 조회 정상 확인.

### Added (코스피 고점 대비 자산 비교)
- `GET /api/assets/value-at?date=YYYY-MM-DD`: 현재 보유종목을 해당일(이전 최근 거래일) 종가로 평가한 증권사별/전체 금액 (토스 일봉, 최대 190일 전). `_collect_positions()`를 재계산 로직과 공유.
- 자산조회 누적자산추이 아래에 `PeakComparison` 추가: 2026-06-19 평가금액 vs 현재 평가금액, 손익금액/손익률 (증권사별 + 전체).

### Fixed / Changed (자산조회 합계 일치, 카드 정보)
- 전체 합계(상단)와 누적자산추이 총계 불일치 수정: 추이 차트의 오늘 지점을 상단 합계와 동일한 실시간 값으로 대체 (`AssetsPage.tsx` `displayTrend`). 오늘 스냅샷도 재기록.
- 증권사/전체 합계 카드에 총매입금액 표시, 평가손익 옆에 수익률(%) 표시 (`BrokerSummaryCards.tsx`).

### Data (나무증권 보유종목 보강)
- 스크린샷 기준 수량/매입가 수정: 삼성전기 8주, HD현대일렉트릭 22주, 효성중공업 2,398,167원, 두산에너빌리티 89,021원, 한화에어로스페이스 847,557원.
- 스크린샷 기준 누락 12종목을 나무증권에 추가 (KODEX 레버리지, TIGER SK하이닉스단일종목레버리지, 한진칼, 삼천리, 유일로보틱스, LS ELECTRIC, KB 레버리지 KOSPI 200 ETN, 에스앤디, 보라티알, 한세엠케이, 대한제당우, 삼성전기우). 코드는 토스 검색으로 확인.

### Changed (종목 추가 검색을 토스 API로)
- 자산조회 "종목 추가" 다이얼로그의 종목명 검색이 키움 대신 토스 `/api/toss/search`를 사용 (`HoldingEditDialog.tsx`). 키움에서 조회되지 않던 "TIGER SK하이닉스단일종목레버리지"(0195S0) 등 검색 가능.
- `/api/toss/search`에 `scope=all|kr` 파라미터 추가 (kr: KOSPI/KOSDAQ/KR_ETC만). 보유종목은 국내 종목만 대상이므로 `kr` 사용.
- 현재가는 기존대로 키움 시세 사용 (0195S0 조회 확인).

### Added (토스 실시간 시세)
- **웹소켓 실시간 체결가**: 토스 `wss://openapi-ws.tossinvest.com/ws/v1`(체결 `trade:kr|us`)를 서버가 대신 연결하고, 브라우저는 `WS /api/toss/ws/trades/{kr|us}/{symbol}`로 수신 ([toss_realtime.py](./toss_realtime.py))
  - 토큰·허용 IP 인증이 필요한 헤더 방식이라 브라우저 직접 연결 대신 서버 프록시 사용 (토큰 비노출)
  - 계정당 동시 연결 2개 제한 대응: 업스트림 연결 1개를 모든 클라이언트가 공유(`TradeHub`), 구독 선언은 현재 종목 전체를 full-replace로 재선언
  - 60초 `PING`, 끊김 시 지수 백오프 재연결, 클라이언트가 없으면 연결 종료
- 토스주식 화면의 종목 정보와 차트 사이에 **실시간 시세** 섹션(`RealtimePrice`): 현재 체결가, 전일 종가 대비 등락, 최근 체결 10건, 연결 상태 표시
- `vite.config.ts` 개발 프록시에 `/api` 웹소켓(`ws: true`) 추가

### Added (토스주식 화면)
- **종목명 검색**: `GET /api/toss/search?q=` — 토스 `/api/v1/stocks/all`(국내·미국 7개 시장)을 하루 1회 조회해 메모리 + `data/toss_stocks.json`에 캐시, 429(호출 제한) 시 재시도. 이름 일치/접두/포함 순 정렬. 화면의 종목 코드 입력을 종목명·코드 자동완성(Autocomplete)으로 교체
- **차트**: `GET /api/toss/stocks/{symbol}/candles`(일봉 200개) + 종목 정보 아래 `StockPriceChart` — 종가, 5/20/60일선, 볼린저밴드(20일, ±2σ, 최근 120거래일 표시)

### Changed (자산 추이 재계산)
- 일별 증권사별/누적 자산 추이를 **현재 보유종목 수량 × 과거 일별 종가** 기준으로 재계산 (`_rebuild_history_sync`, `POST /api/assets/rebuild-history?days=30`, days 최대 190)
  - 종가는 토스 일봉(`/api/v1/candles`, interval=1d) 사용: 국내·미국(USD) 종목 모두 조회, 미국 종목은 현재 USD/KRW 환율로 환산하고 국내 거래일 기준 직전 종가를 사용
  - 매수금액은 현재 보유 기준 고정값. 해당 기간의 기존 `asset_snapshots`는 삭제 후 대체
  - 토스는 실계좌 보유종목, 미래에셋/나무는 `holdings` 사용 (토스 조회 실패 시 수동 내역)
  - 2026-10-12 ~ 2026-11-06 (20거래일) 재계산 완료. 이후 매일 15:40 스냅샷은 기존대로 그날 보유 기준으로 누적

### Fixed
- 일별 자산 스냅샷(`record_daily_snapshot`)의 토스 금액을 수동 등록(3주) 대신 **토스 실계좌 조회 합계**(`total_eval_krw`/`total_buy_krw`)로 기록. 조회 실패 시 수동 내역으로 대체하고 경고 로그 기록
- 2026-11-06 토스 스냅샷 재기록 (3,396,000 → 34,100,075원). 이전 날짜는 토스 이력 조회 수단이 없어 기존 값 유지

### Changed (추가 수정)
- 보유 종목 표(`HoldingsTable.tsx`): 하단 **합계 행**(매수금액·평가금액·평가손익·수익률, 원화 환산) 추가. 증권사 필터(전체/미래에셋/나무/토스)에 따라 합계가 갱신됨
- 보유 종목 표: 증권사·종목명·수량·매수가·현재가·평가금액·평가손익·수익률 **컬럼 정렬** 추가 (토스 실계좌 행도 원화 환산 기준으로 함께 정렬)
- 데이터: `TIGER 반도체TOP10레버리지`(488080) 보유를 미래에셋 → 나무증권으로 이동 (`trades.db` `holdings` id=9, `broker='namuh'`)
- `TossHolding.marketValue` 타입에 `purchaseAmount` 추가

### Added
- **토스증권 Open API 연동** ([toss_service.py](./toss_service.py), 설계: [TOSS_OPENAPI_DESIGN.md](./TOSS_OPENAPI_DESIGN.md))
  - OAuth2 client_credentials 토큰 발급/캐시/401 1회 재시도
  - `GET /api/toss/holdings`: 계좌별 보유종목 조회, USD→KRW 환산 합계(Decimal), 계좌번호 비노출
  - `GET /api/toss/stocks/{symbol}`: 종목 정보·현재가 조회
  - API 명세 [toss_api.json](./toss_api.json), 테스트 [test_toss_service.py](./test_toss_service.py), 실서버 점검 [test_toss_api.py](./test_toss_api.py)
- **자산 조회 대시보드** (설계: [ASSET_DASHBOARD_DESIGN.md](./ASSET_DASHBOARD_DESIGN.md))
  - 키움 FastAPI(`kiwoom_fastapi/main.py`): `/api/holdings` CRUD, `/api/assets/summary`, `/api/assets/trend`, `/api/assets/snapshot`
  - 평일 15:40 KST 일별 자산 스냅샷 스케줄러(누락 시 기동 후 보충)
  - 프론트: `AssetsPage`, `TossPage`, `BrokerSummaryCards`, `HoldingsTable`, `HoldingEditDialog`, `AssetTrendChart`, `CumulativeAssetChart`
  - 사이드바에 `자산 조회`(`/assets`), `토스주식`(`/toss`) 메뉴 및 라우트 추가
- 앱 수명주기 오프라인 테스트 `test_kiwoom_lifespan.py`

### Changed
- [main.py](./main.py): `lifespan` 도입(키움 앱 lifespan 명시 호출), `toss_router` 등록
- 초기화 순서: SQLite 테이블 생성 → 키움 토큰 발급 시도 → 스냅샷 스케줄러 시작. DB 초기화 실패 시 기동 중단, 토큰 오류는 기록 후 계속
- 토스 실계좌 조회 성공 시 보유 표/요약의 수동 토스 내역을 실제 내역으로 대체 (수동 등록 데이터는 변경하지 않음)
- 관심종목 테이블(`WatchlistTable.tsx`): 종목명·3M 고/저가·매수/매도가·잔여 주식·고가대비↓·저가대비↑ 컬럼 정렬 추가, 결측값은 항상 뒤로 정렬
- 프론트 API 클라이언트(`api/index.ts`, `types/index.ts`)에 자산/토스 타입·함수 추가 (`fetchTossHoldings`는 중복 요청 병합)

### Docs
- README: 수명주기, 단일 워커 제약, `APP_DATA_DIR`, 토스 보유종목 보안 주의, 오프라인 테스트 실행법 추가
- 신규: TOSS_OPENAPI_DESIGN.md, ASSET_DASHBOARD_DESIGN.md, changelog.md

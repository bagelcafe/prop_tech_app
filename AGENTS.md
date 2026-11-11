# AGENTS.md

이 저장소에서 작업하는 모든 AI 에이전트(및 기여자)가 따르는 규칙입니다.

## 0. 가장 중요한 규칙 — 수정 내역 자동 기록

**코드·설계·설정을 변경할 때마다 반드시 [`changelog.md`](./changelog.md)에 변경 내역을 기록한다.**

- 변경 작업을 완료하기 전, 같은 작업 단위 안에서 `changelog.md`를 함께 수정한다. 별도 요청이 없어도 자동으로 수행한다.
- 최신 항목이 **맨 위**에 오도록 추가한다.
- 형식:
  ```markdown
  ## YYYY-MM-DD

  ### Added | Changed | Fixed | Docs (한 줄 요약)
  - 무엇을, 어느 파일에서, 왜 바꿨는지 간결히. 핵심 동작/영향 포함.
  ```
  - 구분 라벨: `Added`(기능 추가) / `Changed`(동작 변경) / `Fixed`(버그 수정) / `Docs`(문서) / `Data`(데이터 보정).
  - 같은 날짜 섹션이 이미 있으면 그 아래에 항목을 추가한다(새 날짜 섹션을 중복 생성하지 않는다).
- 관련 설계 문서(`*_DESIGN.md`, `README.md`)에 영향이 있으면 **함께 갱신**한다.
- 날짜는 작업 시점 기준(KST)으로 적는다.

> 요약: "변경 = 코드 수정 + changelog.md 기록 + 영향받는 문서 갱신"을 한 묶음으로 처리한다.

## 1. 프로젝트 개요

부동산 실거래가 조회 + 키움/토스 자산 대시보드 + 토스 매도 보호(trailing stop) 봇을 제공하는 FastAPI + React(Vite) 앱.

- 백엔드: Python / FastAPI. 진입점 `main.py`. 키움 서브앱 `kiwoom_fastapi/`, 토스 조회 `toss_service.py`, 토스 실시간 `toss_realtime.py`, 주문 `toss_trading.py`, 감시봇 `trailing_bot.py` + `bot_router.py`.
- 프론트: `frontend/` (React + MUI + Vite). 빌드 산출물은 `static/dist/`로, FastAPI가 SPA로 서빙.
- 데이터: SQLite `trades.db`(키움/봇 공용), `stats.json`. 로컬은 프로젝트 루트, 도커는 `APP_DATA_DIR=/app/data`.
- 설계 문서: `README.md`, `ASSET_DASHBOARD_DESIGN.md`, `TOSS_OPENAPI_DESIGN.md`, `TRAILING_BOT_DESIGN.md`.

## 2. 빌드 · 테스트 명령

변경 후에는 아래를 실행해 검증하고, 결과를 근거로 완료를 판단한다.

- 프론트 빌드(타입체크 포함): `cd frontend && npm run build` (`tsc && vite build`).
- 백엔드 단위 테스트(실 API 미사용, mock):
  ```bash
  python3 -m unittest test_toss_service test_toss_trading test_trailing_bot
  ```
- 키움 수명주기 테스트(임시 DB·모의 응답):
  ```bash
  python3 -m unittest test_kiwoom_lifespan
  ```
- `test_kiwoom_*`/`test_toss_api.py` 중 실서버 대상 스크립트는 자격증명·허용 IP가 필요하므로 자동 검증에서 제외하고, 위 mock 테스트만 사용한다.

## 3. 도커

프론트(Vite)와 백엔드·감시봇을 **하나의 이미지/컨테이너**에서 실행한다(멀티스테이지 빌드).

- 빌드·실행: `sh docker-run.sh` (이미지 빌드 → 기존 컨테이너 제거 → 새 컨테이너 실행). 포트 변경: `PORT=8080 sh docker-run.sh`.
- Compose: `docker compose up --build -d` (buildx 최신 필요). buildx 구버전 환경은 `DOCKER_BUILDKIT=0 docker build ...` 또는 `docker-run.sh` 사용.
- `frontend/src` 변경 시 도커 빌드가 Vite를 **새로 빌드**해 이미지에 포함한다.
- 데이터 마이그레이션: `docker-entrypoint.sh`가 볼륨(`$APP_DATA_DIR`)에 `trades.db`/`stats.json`이 없을 때만 이미지 내 파일을 1회 복사(멱등). 신규 테이블은 앱 기동 시 `init_db()`의 `CREATE TABLE IF NOT EXISTS`로 자동 추가(기존 데이터 보존).
- **단일 인스턴스만 실행**한다(`--workers 1`, scale 금지). 감시봇 중복 발주 방지 때문.

## 4. 감시봇(매도 보호) 안전 규칙

- 봇은 실제 매도 주문을 집행할 수 있다. 기본값은 항상 **안전한 쪽(모의)** 이다.
- `BOT_DRY_RUN`은 기본 `1`(모의, 실주문 없음). 실주문은 **서버 `BOT_DRY_RUN=0` + 포지션별 `dry_run=false`** 이중 스위치를 모두 꺼야 집행된다.
- 봇 로직은 순수 함수(`evaluate_tick`, `compute_stop` 등)와 I/O를 분리해 테스트 가능하게 유지한다.
- 설계 변경 시 `TRAILING_BOT_DESIGN.md`와 `changelog.md`를 함께 갱신한다.

## 5. 코드 스타일 · 안전

- 기존 코드의 스타일·라이브러리·패턴을 따른다. 불필요한 리팩터링은 피한다.
- Python 3.9 호환을 유지한다(예: `X | None` 금지 → `Optional[X]`). 런타임은 3.9, 도커 이미지는 3.12.
- 시크릿(`.env`, 토큰, 계좌번호)은 커밋·로그·응답에 노출하지 않는다. `.env`는 값 변경만 하고 시크릿 값은 출력하지 않는다.
- 외부(토스/키움) 응답은 신뢰하지 않고 형식·범위를 검증한다. 금액은 `Decimal`로 계산한다.
- 파괴적 작업(데이터 삭제·덮어쓰기, 강제 컨테이너 제거)은 백업 후 수행하고 영향·되돌림 가능 여부를 밝힌다.

## 6. 의존성

- `requirements.txt`는 버전을 핀 고정한다(재현성). 의존성 충돌 시 호환 범위로 조정하고 changelog에 기록한다.
- 미사용 의존성은 추가하지 않는다.

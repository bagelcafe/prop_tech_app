# 토스증권 Open API 연동 설계

## 1. 개요

토스증권 Open API(`https://openapi.tossinvest.com`)를 FastAPI 백엔드에 연동하여 **보유 종목·평가금액 조회**와 **종목 시세 조회**를 제공한다. 이는 [ASSET_DASHBOARD_DESIGN.md](./ASSET_DASHBOARD_DESIGN.md)의 토스증권 부분을 수동 입력 대신 공식 API 자동 조회로 대체하는 확장 포인트(§2.2)에 해당한다.

- API 명세: [toss_api.json](./toss_api.json) (OpenAPI 문서)
- 백엔드: [toss_service.py](./toss_service.py) — `APIRouter(prefix="/api/toss")`, [main.py](./main.py)에서 `app.include_router(toss_router)`
- 프론트엔드: [frontend/src/api/index.ts](./frontend/src/api/index.ts) — `fetchTossStock`, `fetchTossHoldings`
- 테스트: [test_toss_service.py](./test_toss_service.py)(단위, mock), [test_toss_api.py](./test_toss_api.py)(실서버 수동 점검 스크립트)

## 2. 인증

OAuth2 **client_credentials** 방식.

| 항목 | 내용 |
|------|------|
| 토큰 발급 | `POST /oauth2/token` (form: `grant_type=client_credentials`, `client_id`, `client_secret`) |
| 환경변수 | `.env`의 `Toss_client_id`, `Toss_secret_key` (따옴표·공백 제거 후 사용) |
| API 호출 헤더 | `Authorization: Bearer <access_token>` |
| 계좌 지정 헤더 | `X-Tossinvest-Account: <accountSeq>` (계좌 단위 API 호출 시) |
| 허용 IP | 토스 개발자 콘솔에 등록된 IP에서만 호출 가능 (인증 실패 시 확인) |

토큰 관리 (`get_token`):
- 프로세스 메모리에 캐시, `threading.Lock`으로 동시 발급 방지.
- 만료 60초 전까지만 유효한 것으로 간주 (`expires_in - 60`, `time.monotonic()` 기준).
- 조회 중 `401`이 오면 `previous_token`과 다른 새 토큰을 받아 **1회만 재시도** (폐기된 토큰 교체).
- 인증 정보 미설정 → `503`, 인증 실패/서버 연결 불가 → `502`. 외부 오류 상세(자격 증명 등)는 응답에 노출하지 않는다.

## 3. 백엔드 엔드포인트

### 3.1. `GET /api/toss/holdings` — 보유 자산 요약

응답은 `Cache-Control: no-store`.

처리 흐름:
1. `GET /api/v1/accounts` → 계좌 목록 (`accountSeq`).
2. 계좌별 `GET /api/v1/holdings` (`X-Tossinvest-Account` 헤더) → `items`.
3. 통화 검증: `KRW`, `USD`만 허용, 그 외는 `502`.
4. `USD` 종목이 있으면 `GET /api/v1/exchange-rate?baseCurrency=USD&quoteCurrency=KRW`로 환율 조회 (유한한 양수만 허용). KRW만 있으면 환율 조회 생략.
5. 종목별 `marketValue.purchaseAmount`(매수금액), `marketValue.amount`(평가금액)를 `Decimal`로 계산, 통화 환산 후 합산.

응답 형태:

```json
{
  "accounts": [{ "account_seq": 1, "items": [ /* 토스 holdings item 원본 */ ] }],
  "exchange_rate": "1380.5",     // USD 보유 시에만, 아니면 null
  "total_buy_krw": "12345678",
  "total_eval_krw": "13456789"
}
```

설계 원칙:
- 금액은 부동소수점 오차 방지를 위해 **`Decimal` 계산 후 문자열**로 반환.
- 계좌번호 등 민감정보는 노출하지 않고 `accountSeq`만 사용 (테스트로 보장).
- 필드 누락·음수·NaN 등 비정상 응답은 요약 전체를 `502`로 거부 (부분 합산 금지).
- 보유 계좌가 없으면 빈 `accounts`와 0 합계 반환.

### 3.2. `GET /api/toss/stocks/{symbol}` — 종목 정보 + 시세

- `symbol`: 1~30자, `^[A-Za-z0-9.\-]+$` 검증 (경로 주입 방지).
- `GET /api/v1/stocks?symbols=`로 종목 정보 조회, 없으면 `404`.
- 이어서 `GET /api/v1/prices?symbols=`로 현재가 조회. 두 호출은 **같은 토큰을 공유**한다.

### 3.3. 오류 매핑

| 토스 응답 | 반환 |
|-----------|------|
| 400/403/404/429 | 동일 코드 + `토스 조회에 실패했습니다. (HTTP n)` |
| 그 외 오류 | `502` |
| 네트워크/파싱 오류, `result` 누락 | `502` |
| 인증 정보 미설정 | `503` |

모든 요청 `timeout=15s`.

## 4. 프론트엔드

- `fetchTossHoldings()`: `no-store`로 호출하며, 진행 중인 요청을 `pendingTossHoldings`로 공유해 **중복 호출을 합친다** (완료 시 해제).
- `fetchTossStock(symbol)`: 종목 정보·현재가 조회.
- 타입: `TossHolding`, `TossHoldingsData`, `TossStockData`.
- 사용 컴포넌트: `BrokerSummaryCards`, `HoldingsTable`, `AppShell`, `App.tsx` (토스 카드/보유 테이블에 반영).

## 5. 사용 예정/가능 API (toss_api.json 기준)

현재 연동: `/oauth2/token`, `/api/v1/accounts`, `/api/v1/holdings`, `/api/v1/exchange-rate`, `/api/v1/stocks`, `/api/v1/prices`.

추후 활용 후보:
- 시세: `/orderbook`, `/trades`, `/candles`, `/price-limits`, `/rankings`, `/sectors*`, `/market-indicators/*`, `/market-calendar/KR|US`
- 종목 부가정보: `/stocks/{symbol}/investor-trading`, `/program-trades`, `/short-selling`, `/credit-trades`, `/securities-lending`, `/warnings`
- 계좌: `/transactions`(거래내역), `/buying-power`, `/sellable-quantity`, `/commissions`
- 주문(현재 **미사용**, 자동매매 범위 확정 시 검토): `/orders*`, `/conditional-orders*`

일별 자산 추이(자산 대시보드 §6.4)의 스냅샷 값으로 `total_eval_krw`를 사용하면 토스 부분은 수동 입력 없이 자동 기록할 수 있다.

## 6. 보안 및 운영 주의

- `Toss_client_id`, `Toss_secret_key`는 `.env`로만 관리하고 저장소에 커밋하지 않는다.
- 토큰·시크릿·계좌번호를 로그/응답에 남기지 않는다.
- 허용 IP 제한이 있으므로 서버(Docker 포함) 외부 IP가 바뀌면 콘솔에서 갱신해야 한다.
- 429(호출 제한) 대비: 프론트 중복 요청 병합 외에 필요 시 서버측 단기 캐시를 추가한다.
- `.env`에는 `TOSS_HOLDINGS_ACCESS_KEY`도 존재하나 현재 코드에서는 사용하지 않는다 (`test_holdings_loads_without_access_key`로 불필요함을 검증).

## 7. 테스트

- `python -m unittest test_toss_service` — 토큰 공유/재발급, 계좌별 보유 조회, 계좌번호 비노출, 계좌 없음, KRW 전용 시 환율 생략, 잘못된 환율·보유 데이터 거부.
- `python test_toss_api.py` — 실제 토스 서버 대상 수동 점검 (자격 증명·허용 IP 필요).

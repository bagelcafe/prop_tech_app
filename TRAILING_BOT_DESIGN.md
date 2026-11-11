# 국내 주식 Trailing Stop Bot 설계 (매도 보호 / 자동매매)

## 0. 범위와 목표

- **대상 시장**: 국내 주식(KRX)만. 해외 주식은 범위 밖.
- **목적**: 이미 보유 중인 종목의 **순수 손절 전용 하락 보호(trailing stop-loss)**. 최근 고점을 추적하며, **고점 대비 -15% 하락 시 시장가(MARKET) 매도**한다. (익절 상한·activation 시작점·신규 매수 진입은 범위 밖)
- **집행 수준**: **실제 매도 주문을 자동 집행**한다. dry-run(페이퍼) 모드를 기본으로 두고, 명시적으로 켤 때만 실주문.
- **전제 인프라**: 기존 `toss_service.py`(조회), FastAPI 단일 워커/단일 인스턴스(README 제약), 토스 OpenAPI `https://openapi.tossinvest.com`.

> ⚠️ 이 봇은 실제 금전 손실을 유발할 수 있다. 기본값은 항상 안전한 쪽(미집행/보수적)으로 둔다.

---

## 1. 핵심 설계 판단: 왜 하이브리드인가

토스 OpenAPI의 조건주문 `triggerPrice`는 **고정 감시가**다. "현재가가 이 값에 닿으면 주문 생성"일 뿐, 고점 대비 %로 자동 추적되는 네이티브 trailing 타입은 없다(enum: `SINGLE`/`OCO`/`OTO`). 따라서 trailing은 **봇이 고점을 추적하며 `triggerPrice`를 직접 올려주는** 방식으로만 구현된다.

두 축을 결합한다:

| 축 | 역할 | 사용 API |
|----|------|----------|
| **서버측 안전망 (Primary)** | 토스 서버에 `SINGLE` 매도 조건주문을 항상 1건 유지. 봇이 죽어도 마지막 stop은 서버에 살아있음 | `POST/GET/modify/DELETE /api/v1/conditional-orders` |
| **봇측 능동 추적 (Driver)** | 폴링으로 고점 갱신 감지 → 조건주문 `triggerPrice`를 끌어올림(modify). 급락·조건주문 발동 지연 시 백업으로 직접 시장가 매도 | `GET /api/v1/prices`, `POST /api/v1/orders` |

핵심 원칙: **stop 값의 "진실의 원천(source of truth)"은 토스에 걸린 조건주문**이다. 봇 메모리는 캐시/추적 상태일 뿐이며, 재시작 시 토스 조건주문 조회로 상태를 복원한다.

---

## 2. 전체 아키텍처

```
                   ┌──────────────────────────────────────────┐
                   │  TrailingBotEngine (단일 인스턴스, asyncio)   │
                   │                                            │
  [config/state]   │  매 tick(예: 10~30s, 정규장만):             │
  trailing_stops.  │   1) prices 조회 (보유 대상 종목 배치)         │
  json / SQLite    │   2) 각 포지션 상태머신 평가                   │
      ▲  ▼         │   3) 고점 갱신 → 조건주문 modify              │
      │            │   4) 급락/이탈 → 직접 매도(백업)              │
      │            │   5) 체결/취소 reconcile                     │
      │            └──────────────────────────────────────────┘
      │                        │ 호출
      │          ┌─────────────┴──────────────┐
      │          │  toss order client (신규)     │
      │          │  toss_service.py 확장 or      │
      │          │  별도 toss_trading.py         │
      │          └─────────────┬──────────────┘
      │                        │ HTTPS
      │              https://openapi.tossinvest.com
 FastAPI 라우터 (/api/bot/*): 등록/조회/해제/긴급정지
```

파일 배치(제안):
- `toss_trading.py` — 주문/조건주문/매도가능수량 클라이언트 (쓰기 경로. 조회 전용 `toss_service.py`와 분리).
- `trailing_bot.py` — 상태머신 + tick 루프 엔진.
- `bot_router.py` — `/api/bot/*` REST (등록/수정/해제/상태/긴급정지).
- 상태 저장: SQLite(기존 `trades.db`에 `trailing_stops` 테이블 추가) — 크래시 복구 대상이므로 파일보다 트랜잭션 안전한 DB 권장.

---

## 3. 데이터 모델

`trailing_stops` 테이블(종목·계좌당 1 레코드):

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | INTEGER PK | |
| `account_seq` | INTEGER | 대상 계좌 |
| `symbol` | TEXT | 6자리 국내 종목코드 |
| `quantity` | TEXT(decimal) | 보호 수량 (정수, 주) |
| `mode` | TEXT | `PERCENT` (1차 버전 고정) |
| `trail_value` | TEXT | 추적폭. 기본 `0.15` (고점 대비 -15%) |
| `peak_price` | TEXT | 추적 기준 최고가. **등록 시 최근 120일 고점으로 초기화**(§5.1), 이후 실시간 갱신 |
| `peak_date` | TEXT/null | peak_price가 기록된 날짜(참고·감사용, 예: 2026-11-03) |
| `stop_price` | TEXT | 현재 손절 trigger = `round_to_krx_tick(peak × (1 − trail_value))` |
| `order_type` | TEXT | 발동 시 호가유형. **`MARKET` 고정**(확실한 청산) |
| `conditional_order_id` | TEXT/null | 토스에 걸린 조건주문 ID |
| `state` | TEXT | 상태머신 값(§4) |
| `client_order_id_base` | TEXT | 멱등키 prefix |
| `dry_run` | INTEGER | 1=페이퍼, 0=실주문 |
| `updated_at` | TEXT | |

---

## 4. 상태 머신

```
             register
   ──────────────────────────▶  PENDING
                                  │ peak = 최근 120일 고점으로 초기화 (§5.1)
                                  │ stop = round_tick(peak × 0.85)
                                  │
                ┌─────────────────┴──────────────────┐
     현재가 > stop │                                     │ 현재가 ≤ stop (등록 즉시 이미 손절권)
                 ▼                                     ▼
               ARMED                           AWAITING_CONFIRM ── 사용자 노티
                 │ 조건주문 생성 성공                     │  ├─ 승인 → 시장가 매도 ──▶ TRIGGERED
                 ▼                                     │  └─ 거절/해제 ─────────▶ CANCELLED
              TRAILING                                 │  (조건주문은 걸지 않음)
                 │                                     │
   고점 갱신 → modify(stop↑) ◀────────────────────────┘ (매 tick)
                 │
   현재가 ≤ stop  │
   ├─ 조건주문이 토스에서 발동·체결 ──────────────────────────────▶ TRIGGERED
   └─ (백업) 봇이 직접 시장가 매도 ────────────────────────────────▶ TRIGGERED
                                                                 │ 체결 확인
                                                                 ▼
                                                               DONE
   어느 상태든: 에러 누적/수동 긴급정지 ─────────────────────────▶ HALTED
   어느 상태든: 해제 요청 ─ 조건주문 DELETE ─────────────────────▶ CANCELLED
```

상태 정의:
- **PENDING**: 등록 직후 초기화 단계. `peak`를 **최근 120일 고점**(§5.1)으로 세팅하고 `stop`을 계산. 현재가와 stop을 비교해 `ARMED`(정상) 또는 `AWAITING_CONFIRM`(이미 손절권)으로 분기.
- **ARMED**: 추적 시작 직전. 조건주문 생성 시도.
- **TRAILING**: 조건주문 서버에 존재. 고점 추적 + modify 중.
- **AWAITING_CONFIRM**: 등록 시점에 현재가가 이미 stop 이하. **조건주문을 걸면 즉시 체결될 수 있으므로 걸지 않고**, 사용자에게 노티 후 승인을 기다린다. 승인 시 시장가 매도(→TRIGGERED), 거절/해제 시 CANCELLED. (정상 trailing 발동과 달리 이 경로만 사용자 확인 필요)
- **TRIGGERED**: stop 도달. 매도 주문 생성됨(조건주문 발동 / 백업 직접주문 / AWAITING_CONFIRM 승인). 체결 확인 대기.
- **DONE**: 매도 체결 완료. 추적 종료.
- **HALTED**: 에러/서킷브레이커로 자동 집행 정지. 사람이 개입할 때까지 신규 주문 금지(단, 서버 조건주문은 유지되어 보호는 계속).
- **CANCELLED**: 사용자가 보호 해제. 토스 조건주문 삭제.

> 사용자 확인이 필요한 유일한 집행 경로는 **AWAITING_CONFIRM**(등록 즉시 손절권)뿐이다. 추적 중 정상적으로 stop에 닿아 서버 조건주문이 발동하는 것은 **사전 승인된 보호장치**이므로 별도 확인 없이 집행된다.

재시작 복구: 기동 시 DB의 `TRAILING`/`TRIGGERED` 레코드와 토스 `GET /api/v1/conditional-orders`·`GET /api/v1/orders`를 **reconcile**해서 상태를 재구성한다.

---

## 5. Trailing 알고리즘 (PERCENT -15% 고정)

### 5.1 peak 초기화 — "최근 고점" 산정

손절선은 **등록 시점 현재가가 아니라 최근 고점** 기준이어야 한다. 그렇지 않으면 이미 고점에서 내려온 종목의 손절선이 비정상적으로 낮게 잡힌다.

등록 시:
```
candles = GET /api/v1/candles?symbol=...&interval=1d&count=120   # 최근 120 영업일
peak = max(c.highPrice for c in candles)        # 최근 120일 중 최고가
peak_date = 해당 고점의 날짜
stop_price = round_to_krx_tick(peak * (1 - 0.15))
```
- 사용자가 고점을 직접 지정(override)할 수도 있다(예: 안랩 137,300 / 11-03). 지정값이 있으면 그 값을 peak로 사용하고, 없으면 캔들 120일에서 자동 산출.
- 산출 직후 현재가가 이미 `stop_price` 이하라면 → **자동 집행하지 않는다.** `AWAITING_CONFIRM`으로 전이해 사용자에게 노티하고, 사용자가 승인해야 시장가 매도한다(§4). 조건주문도 걸지 않는다(걸면 즉시 체결될 수 있으므로). 거절 시 CANCELLED.

### 5.2 매 tick (각 `TRAILING` 포지션)

```
price = prices[symbol].lastPrice          # GET /api/v1/prices
peak  = max(peak, price)                   # 고점은 오르기만 함

candidate = round_to_krx_tick(peak * (1 - 0.15))   # 고점 대비 -15%, 호가단위 보정

# stop 은 '오르기만' 한다 (trailing 의 본질). 절대 내리지 않음.
if candidate > stop_price:
    stop_price = candidate
    conditional_orders.modify(conditional_order_id, triggerPrice=stop_price, ...)
```

급락 백업(조건주문이 세션/지연으로 못 잡는 경우 대비):
```
if price <= stop_price * (1 - SLIPPAGE_GUARD):   # stop 보다 더 아래로 뚫림
    if not dry_run and state == TRAILING:
        place MARKET SELL  (clientOrderId = base + ":backup")   # 직접 집행
        state = TRIGGERED
```

### 5.3 워크스루 예시 — 안랩(053800)

- 최근 고점(11/3): **137,300원** → peak = 137,300, peak_date = 2026-11-03
- 손절선: 137,300 × (1 − 0.15) = 116,705 → 호가단위(10만~20만 구간 100원) 보정 → **stop = 116,700원**
- 이후 주가가 150,000까지 신고가 → peak=150,000, stop = 150,000×0.85 = 127,500 → modify로 끌어올림
- 이후 주가가 내려와 116,700원(기존 stop) 또는 신고점 기준 상향된 stop에 닿으면 → 시장가 매도 발동
- stop은 150,000 기준(127,500)으로 올라간 뒤에는 절대 116,700으로 되돌아가지 않음

호가단위(tick size) 보정은 **필수**다. `triggerPrice`가 호가단위에 맞지 않으면 토스가 거절한다. KRX 가격대별 호가단위 테이블을 내장해 `round_to_krx_tick`(매도 trigger는 하한 방향으로 보정)을 구현한다(예: 2,000원 미만 1원 / 5,000원 미만 5원 / 2만원 미만 10원 / 5만원 미만 50원 / 20만원 미만 100원 / 50만원 미만 500원 / 그 이상 1,000원 — **출시 전 토스/KRX 최신 기준으로 재확인**).

---

## 6. 토스 API 매핑

### 6.1 조건주문 생성 (stop 최초 설정)
`POST /api/v1/conditional-orders`, 헤더 `X-Tossinvest-Account: <accountSeq>`
```json
{
  "symbol": "053800",
  "type": "SINGLE",
  "quantity": "10",
  "orderType": "MARKET",            // 확실한 청산 우선
  "clientOrderId": "trail-053800-0001",
  "expireDate": "2026-12-31",       // 최대 1년. 봇이 만료 전 롤오버
  "first": { "orderSide": "SELL", "triggerPrice": "116700" }
}
```
// 안랩(053800): 최근 고점 137,300 × 0.85 = 116,705 → 호가단위(100원) 보정 → 116,700
- `orderType=MARKET`이면 각 조건에 `orderPrice`를 넣지 않는다.
- 손절 전용이므로 **항상 `SINGLE` + `SELL` 한 조건만** 사용한다. (익절 상한을 묶는 OCO는 범위 밖)

### 6.2 고점 갱신 → 수정
`POST /api/v1/conditional-orders/{conditionalOrderId}/modify` — `first.triggerPrice`를 올림. (type/quantity/orderType/expireDate 공통값 함께 전송)

### 6.3 해제 / 긴급정지
`DELETE /api/v1/conditional-orders/{conditionalOrderId}`

### 6.4 백업 직접 매도
`POST /api/v1/orders`
```json
{ "symbol":"005930", "side":"SELL", "orderType":"MARKET",
  "quantity":"10", "timeInForce":"DAY", "clientOrderId":"trail-005930-backup-0001" }
```

### 6.5 조회
- 현재가: `GET /api/v1/prices?symbols=...` → `lastPrice`, `currency`(KRW 확인), `timestamp`(null 가능).
- 매도가능수량: `GET /api/v1/sellable-quantity` → `sellableQuantity`. **주문 수량 상한 검증**에 사용(미수/예약매도 중복 방지).
- 보유종목: `GET /api/v1/holdings` → 보호 대상 유효성·수량 변동 확인.
- 체결 확인: `GET /api/v1/orders`, `GET /api/v1/conditional-orders/{id}`.

### 6.6 멱등성
모든 주문·조건주문 생성/백업에 `clientOrderId` 필수. (일반 주문 키 10분 유효, 포맷 `^[a-zA-Z0-9\-_]+$` 최대 36자). 네트워크 재시도 시 중복 집행 방지의 1차 방어선.

---

## 7. 안전장치 (실집행이므로 핵심)

1. **DRY_RUN 기본 ON**: 환경변수 `BOT_DRY_RUN=1`이 기본. 실주문은 명시적으로 `0` + 포지션별 `dry_run=0`을 모두 만족해야 함(이중 스위치).
2. **킬 스위치**: `GET /api/bot/halt` 한 번으로 전 포지션 `HALTED`. 신규 주문 즉시 중단(서버 조건주문은 보호 위해 유지, 옵션으로 전량 취소도).
3. **서킷 브레이커**: 주문 API 연속 실패 N회 / 비정상 가격(0·음수·전틱 대비 과도 점프) 감지 시 자동 `HALTED` + 알림.
4. **세션 가드**: KRX 정규장(09:00~15:30 KST, 장 상태 API/`market-calendar/KR`로 휴장·조기폐장 확인) 외에는 집행 tick을 돌리지 않음. 조건주문도 국내는 정규장에서만 발동.
5. **수량 상한**: 주문 수량 ≤ `sellableQuantity`. 보유보다 많이 못 팜.
6. **중복 집행 방지**: 멱등키 + 상태머신(`TRIGGERED` 진입 후 재주문 금지) + "조건주문은 종목당 1건" 불변식. `AWAITING_CONFIRM`은 사용자 승인 전까지 어떤 주문·조건주문도 생성하지 않는다.
7. **stop 단조 증가**: `stop_price`는 내려가지 않음. 버그로 인한 하향 조정 차단.
8. **단일 인스턴스 락**: README의 단일 워커 제약과 동일. 파일락/DB락으로 두 번째 봇 기동 거부(중복 발주 치명적).
9. **가격 신선도**: `prices.timestamp`가 null이거나 과도하게 오래되면 그 tick은 집행 보류.
10. **금액 동의**: 1억원 이상 주문은 `confirmHighValueOrder` 필요 — 대형 포지션 시 사전 설정.
11. **감사 로그**: 모든 주문/수정/취소 요청·응답을 (시크릿·계좌번호 제외) 기록. 사후 추적 가능.
12. **Rate limit 준수**: 조건주문은 `CONDITIONAL_ORDER` 그룹 제한. modify를 매 tick 무조건 하지 말고 **"고점이 의미있게 갱신됐고 stop 이동폭이 호가단위 이상일 때만"** 호출(디바운스). 기존 `get_toss_data`의 429+Retry-After 재시도 패턴 재사용.

---

## 8. REST 인터페이스 (`/api/bot/*`)

| 메서드/경로 | 기능 |
|---|---|
| `POST /api/bot/stops` | 보호 등록 (symbol, quantity, trail_value(기본 0.15), peak override…) |
| `GET /api/bot/stops` | 현재 보호 목록·상태·peak·stop 조회 |
| `GET /api/bot/pending-confirms` | 승인 대기(AWAITING_CONFIRM) 목록 — 노티 대상 |
| `POST /api/bot/stops/{id}/confirm` | AWAITING_CONFIRM 승인 → 시장가 매도 집행 |
| `POST /api/bot/stops/{id}/reject` | AWAITING_CONFIRM 거절 → CANCELLED |
| `PATCH /api/bot/stops/{id}` | 추적폭/수량/peak 수정 |
| `DELETE /api/bot/stops/{id}` | 보호 해제(조건주문 취소) |
| `POST /api/bot/halt` | 긴급정지(전체 HALTED) |
| `POST /api/bot/resume` | 재개 |

프론트: 기존 `AssetsPage`/`HoldingsTable`에 "매도 보호" 토글·설정 컬럼, 그리고 **승인 대기 알림 배지/다이얼로그**(AWAITING_CONFIRM 종목을 보여주고 승인/거절) 추가.

---

## 9. 운영

- **단일 워커/단일 인스턴스** 필수(README 동일 제약). 봇 tick과 FastAPI를 같은 프로세스 asyncio 태스크로.
- 허용 IP 고정(토스 콘솔 등록). 운영 IP 변경 시 콘솔 갱신.
- 비밀값(`Toss_client_id`/`Toss_secret_key`)은 `.env`만. 로그/응답에 토큰·계좌번호 비노출(기존 원칙 유지).
- 조건주문 `expireDate` 만료 전 자동 롤오버 잡 필요.
- 시계: tick 스케줄·세션 판정은 KST 기준.

---

## 10. 테스트 전략

- **단위(mock)**: 상태머신 전이(ARMED/AWAITING_CONFIRM 분기 포함), trailing 계산(PERCENT -15%), 120일 고점 산출, 호가단위 반올림, stop 단조성, 멱등키 생성, 세션 가드 → 실 API 미사용(기존 `test_toss_service.py` 패턴).
- **AWAITING_CONFIRM 테스트**: 등록 즉시 손절권일 때 자동 집행하지 않고 승인 대기로 전이, 승인 시에만 매도, 거절 시 CANCELLED, 승인 전 조건주문 미생성.
- **reconcile 테스트**: 재시작 시 DB×토스 조건주문/주문 상태 정합 복구.
- **서킷/킬스위치 테스트**: 연속 실패·비정상 가격 시 HALTED 전이, 신규 주문 차단.
- **드라이런 통합**: `BOT_DRY_RUN=1`로 실주문 없이 전체 루프(주문은 로그만).
- **실서버 수동 점검**: 소액·단일 종목·시장가, 허용 IP·정규장에서만. (기존 `test_toss_api.py` 수동 점검 스타일)

---

## 11. 단계별 구현 로드맵

1. `toss_trading.py` — 조건주문/주문/sellable-quantity 클라이언트 + mock 단위테스트(실호출 0).
2. `trailing_bot.py` — 상태머신·trailing 계산·호가단위 보정 (순수 로직, 테스트 우선).
3. 영속화(`trailing_stops` 테이블) + reconcile.
4. tick 루프 + 세션/서킷/킬스위치 (DRY_RUN 기본).
5. `/api/bot/*` 라우터 + 프론트 토글.
6. 드라이런 종단 검증 → 소액 실거래 파일럿 → 점진 확대.

---

## 12. 확정 결정 / 미해결·확인 필요 사항

**확정된 결정사항**
- 범위: 국내(KRX) 보유종목, 순수 손절 전용, 실제 자동 집행.
- 발동 호가유형: **MARKET**(확실한 청산).
- 추적폭: **PERCENT, 고점 대비 -15% 고정**.
- peak 기준: **최근 120일 고점**(캔들 자동 산출 또는 사용자 override). 예: 안랩 137,300(11/3) → stop 116,700.
- 등록 즉시 현재가가 이미 stop 이하이면 → **자동 집행 안 함. 노티 후 사용자 승인 시에만 집행**(`AWAITING_CONFIRM` 상태).

**미해결·확인 필요**
- 노티 채널(웹 UI 배지/푸시/이메일 등) 구체화 및 승인 UX.
- KRX 호가단위 최신 테이블(토스 거절 기준) 재확인.
- 조건주문 `CONDITIONAL_ORDER`/주문 그룹의 **구체적 rate limit 수치**(명세 info에 표 없음 → 콘솔/문서 확인).
- 조건주문 MARKET 발동 시 체결가 슬리피지 허용 범위(정책 결정).

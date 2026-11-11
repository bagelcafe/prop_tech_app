# 자산 조회 대시보드 설계

## 1. 개요

프론트엔드 사이드바에 **자산 조회** 메뉴를 추가한다. 선택 시 **미래에셋증권 / 나무증권(NH) / 토스증권** 3개 증권사별 보유 종목을 집계하여 다음을 제공한다.

1. **증권사별 보유 종목 테이블** — 종목별 매수가, 현재가, 수익률 + 증권사별 전체 누적 수익 현황
2. **일별 증권사별 자산 추이 그래프** — 3개 증권사 각각의 일별 평가금액 라인
3. **누적 자산 추이 그래프** — 3개 증권사 합산 총 자산의 일별 추이

기존 아키텍처(FastAPI + SQLite `trades.db` + 키움 REST API + React/MUI SPA)와 일관성을 유지한다.

## 2. 데이터 수집 전략 (중요)

미래에셋 / 나무 / 토스는 현재 이 프로젝트에 연동된 공식 OAuth API가 **없다**. 키움(`api.kiwoom.com`)만 토큰 기반으로 연동되어 있다. **1단계 확정 방식: 보유 데이터는 사용자가 화면에서 수동 입력하고, 기존 SQLite `trades.db`의 신규 테이블에 저장·조회한다.**

| 계층 | 역할 | 데이터 출처 |
|------|------|------------|
| **보유 종목 (정적)** | 각 증권사의 보유 종목·수량·매수평균가 | **사용자 수동 입력 → `trades.db`의 `holdings` 테이블** |
| **현재가 (동적)** | 종목별 실시간 현재가 | **키움 `ka10001` API** (국내 상장 종목은 증권사 무관하게 동일 시세) |

> 핵심: 현재가는 증권사와 무관하게 시장 가격이 동일하므로 키움 API 하나로 전 종목 현재가를 조회할 수 있다. 증권사별 구분은 "어느 증권사 계좌에서 몇 주 보유 중인가"라는 **보유 정보**에만 적용된다.

### 2.1. 저장 위치
기존 `DB_PATH = os.path.join(DATA_DIR, "trades.db")`를 그대로 사용한다. `init_db()`에 신규 테이블 생성 구문을 추가한다. Docker 볼륨(`data/`)에 포함되므로 컨테이너 재시작에도 보존된다.

### 2.2. 확장 포인트
- 추후 각 증권사의 공식 Open API가 확보되면 `broker` 어댑터 인터페이스를 추가해 자동 동기화로 대체할 수 있도록, 저장 접근을 데이터 액세스 함수로 캡슐화한다.
- 일별 자산 추이는 장 마감 후 스케줄러가 당일 1회 스냅샷을 기록하여 누적한다 (§6.4).

## 3. UI 레이아웃

```
┌────────────────────────────────────────────────────────────────────────────┐
│  💰 자산 조회                                          [증권사 필터▼] [새로고침] │
├────────────────────────────────────────────────────────────────────────────┤
│  📊 증권사별 요약 카드                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ 미래에셋      │ │ 나무(NH)     │ │ 토스         │ │ 전체 합계     │        │
│  │ 평가 12,340K │ │ 평가 8,120K  │ │ 평가 3,450K │ │ 평가 23,910K │        │
│  │ 수익 +1,230K │ │ 수익 -210K   │ │ 수익 +450K  │ │ 수익 +1,470K │        │
│  │ +11.1%       │ │ -2.5%        │ │ +15.0%      │ │ +6.5%        │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
├────────────────────────────────────────────────────────────────────────────┤
│  📋 보유 종목 테이블                                                           │
│  ┌──────┬────────┬──────┬────────┬────────┬────────┬────────┬────────┐       │
│  │증권사│종목명  │수량  │매수가  │현재가  │평가금액│평가손익│수익률  │       │
│  ├──────┼────────┼──────┼────────┼────────┼────────┼────────┼────────┤       │
│  │미래..│삼성전자│100   │68,000  │72,000  │7,200K  │+400K   │+5.9%   │       │
│  │나무  │SK하이..│20    │175,000 │185,000 │3,700K  │+200K   │+5.7%   │       │
│  │토스  │NAVER   │10    │210,000 │195,000 │1,950K  │-150K   │-7.1%   │       │
│  └──────┴────────┴──────┴────────┴────────┴────────┴────────┴────────┘       │
├────────────────────────────────────────────────────────────────────────────┤
│  📈 일별 증권사별 자산 추이 (라인 3개: 미래에셋/나무/토스)                      │
│  [────────────────────────── Recharts LineChart ──────────────────────────]  │
├────────────────────────────────────────────────────────────────────────────┤
│  📈 누적 자산 추이 (3사 합산 총 평가금액)                                      │
│  [────────────────────────── Recharts AreaChart ──────────────────────────]  │
└────────────────────────────────────────────────────────────────────────────┘
```

## 4. 테이블 컬럼 정의

### 4.1. 보유 종목 테이블

| # | 컬럼 | 필드 | 계산식 |
|---|------|------|--------|
| 1 | 증권사 | `broker` | 미래에셋 / 나무 / 토스 |
| 2 | 종목명 | `stock_name` | 보유내역 |
| 3 | 수량 | `quantity` | 보유내역 |
| 4 | 매수가 | `avg_buy_price` | 매수 가중평균가 |
| 5 | 현재가 | `cur_prc` | 키움 `ka10001` |
| 6 | 평가금액 | `eval_amount` | `cur_prc × quantity` |
| 7 | 평가손익 | `profit_amount` | `(cur_prc - avg_buy_price) × quantity` |
| 8 | 수익률 | `profit_rate` | `(cur_prc - avg_buy_price) / avg_buy_price × 100` |

### 4.2. 증권사별 요약 (누적 수익 현황)

| 필드 | 계산식 |
|------|--------|
| `total_buy_amount` | Σ(`avg_buy_price × quantity`) |
| `total_eval_amount` | Σ(`cur_prc × quantity`) |
| `total_profit_amount` | `total_eval_amount - total_buy_amount` |
| `total_profit_rate` | `total_profit_amount / total_buy_amount × 100` |

> 전체 합계 카드는 3사 값을 합산.

## 5. DB 스키마

SQLite `trades.db`에 테이블 2개 추가.

```sql
-- 증권사별 보유 종목
CREATE TABLE IF NOT EXISTS holdings (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    broker         TEXT NOT NULL,          -- 'mirae' | 'namuh' | 'toss'
    stock_code     TEXT NOT NULL,
    stock_name     TEXT NOT NULL,
    quantity       INTEGER NOT NULL,
    avg_buy_price  REAL NOT NULL,
    updated_at     TEXT NOT NULL,
    UNIQUE(broker, stock_code)
);

-- 일별 자산 스냅샷 (추이 그래프용)
CREATE TABLE IF NOT EXISTS asset_snapshots (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    snapshot_date   TEXT NOT NULL,         -- YYYY-MM-DD
    broker          TEXT NOT NULL,         -- 'mirae' | 'namuh' | 'toss'
    eval_amount     INTEGER NOT NULL,      -- 해당 증권사 당일 총 평가금액
    buy_amount      INTEGER NOT NULL,      -- 해당 증권사 당일 총 매수금액
    created_at      TEXT NOT NULL,
    UNIQUE(snapshot_date, broker)
);
```

증권사 식별자 상수:
```python
BROKERS = {
    "mirae": "미래에셋증권",
    "namuh": "나무증권",
    "toss":  "토스증권",
}
```

## 6. Backend API (kiwoom_fastapi 서브앱 → `/kiwoom/api/...`)

> **재사용 가능한 기존 코드** (kiwoom_fastapi/main.py):
> - `init_db()` — 여기에 `holdings`, `asset_snapshots` CREATE 구문 추가
> - `get_db()` — SQLite 커넥션 (row_factory=Row)
> - `get_access_token()` / `fetch_access_token()` — 토큰 발급·만료 재발급
> - `ka10001` 호출 패턴 (`POST {KIWOOM_HOST}/api/dostk/stkinfo`, body `{stk_cd}`) → 현재가(`cur_prc`, 필드 `"10"` 등) 조회 함수 `_fetch_current_price(code)`로 추출
> - `@app.on_event("startup")` — 여기서 `asyncio.create_task(snapshot_scheduler())` 등록

### 6.1. 보유 종목 CRUD

| Method | Path | 설명 | Body |
|--------|------|------|------|
| `GET` | `/api/holdings` | 전체 보유 종목 조회 (옵션 `?broker=`) | - |
| `POST` | `/api/holdings` | 보유 종목 추가/수정(upsert) | `{broker, stock_code, stock_name, quantity, avg_buy_price}` |
| `PUT` | `/api/holdings/{id}` | 보유 종목 수량/매수가 수정 | `{quantity, avg_buy_price}` |
| `DELETE` | `/api/holdings/{id}` | 보유 종목 삭제 | - |

### 6.2. 자산 요약 조회

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/api/assets/summary` | 증권사별 보유 종목 + 현재가 + 파생지표 + 증권사별/전체 요약 일괄 반환 |

#### 처리 로직
1. `holdings` 테이블에서 전 종목 조회 (증권사 그룹)
2. 고유 종목코드 집합에 대해 `ka10001`로 현재가 일괄 조회 (종목 간 0.3초 딜레이, 5분 메모리 캐시)
3. 종목별 파생지표 계산 → `eval_amount`, `profit_amount`, `profit_rate`
4. 증권사별 합계 + 전체 합계 계산

> 일별 스냅샷 기록은 이 엔드포인트에서 하지 않는다. 장 마감 후 스케줄러(§6.4)가 전담한다.

#### 응답 형식
```json
{
  "brokers": {
    "mirae": {
      "label": "미래에셋증권",
      "total_buy_amount": 11110000,
      "total_eval_amount": 12340000,
      "total_profit_amount": 1230000,
      "total_profit_rate": 11.07,
      "holdings": [
        {
          "id": 1, "stock_code": "005930", "stock_name": "삼성전자",
          "quantity": 100, "avg_buy_price": 68000, "cur_prc": 72000,
          "eval_amount": 7200000, "profit_amount": 400000, "profit_rate": 5.88
        }
      ]
    },
    "namuh": { "...": "..." },
    "toss":  { "...": "..." }
  },
  "total": {
    "total_buy_amount": 23520000,
    "total_eval_amount": 24990000,
    "total_profit_amount": 1470000,
    "total_profit_rate": 6.25
  }
}
```

### 6.3. 자산 추이 조회

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/api/assets/trend?days=30` | 일별 증권사별 평가금액 + 합산 추이 |

#### 응답 형식
```json
{
  "series": [
    {
      "date": "2026-10-01",
      "mirae": 12100000,
      "namuh": 8050000,
      "toss":  3300000,
      "total": 23450000
    }
  ]
}
```

### 6.4. 일별 스냅샷 스케줄러 (장 마감 후 기록)

추가 의존성 없이 FastAPI `lifespan`(또는 `startup` 이벤트)에서 `asyncio` 백그라운드 태스크를 기동한다.

#### 동작
- **기록 시각**: 평일(월~금) **장 마감 직후 15:40 KST**에 1회 실행.
- **대상**: `holdings`의 전 종목 현재가를 `ka10001`로 조회 → 증권사별 `eval_amount`, `buy_amount` 계산 → `asset_snapshots`에 `(snapshot_date, broker)` upsert.
- **중복 방지**: 이미 당일 스냅샷이 있으면 덮어쓰기(최신값 반영). 서버 재시작 시, 오늘이 평일이고 15:40을 지났는데 당일 스냅샷이 없으면 **즉시 1회 보정 기록**(누락 방지).
- 공휴일은 1차 구현에서 제외(주말만 스킵). 공휴일에 기록되어도 추이 그래프에 큰 영향 없음. 추후 휴장일 캘린더 연동으로 개선 가능.

#### 의사 코드
```python
async def snapshot_scheduler():
    while True:
        now = datetime.now(KST)
        next_run = _next_1540_weekday(now)   # 다음 평일 15:40
        await asyncio.sleep((next_run - now).total_seconds())
        try:
            await record_daily_snapshot()    # ka10001 조회 + asset_snapshots upsert
        except Exception as e:
            logger.error(f"스냅샷 기록 실패: {e}")

# lifespan에서: asyncio.create_task(snapshot_scheduler())
# 서버 기동 시 보정: 평일 && now >= 15:40 && 당일 스냅샷 없음 → record_daily_snapshot()
```

#### 수동 트리거(옵션)
| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/api/assets/snapshot` | 관리/테스트용 즉시 스냅샷 기록 |

## 7. Frontend

### 7.1. 라우팅 (`App.tsx`)
```tsx
<Route path="/assets" element={<AssetsPage />} />
```

### 7.2. 사이드바 메뉴 (`AppShell.tsx`)
`NAV_ITEMS`에 추가 (AccountBalanceWalletIcon 사용):
```tsx
{ label: '자산 조회', path: '/assets', icon: <AccountBalanceWalletIcon /> }
```

### 7.3. 타입 (`types/index.ts`)
```typescript
export type BrokerKey = 'mirae' | 'namuh' | 'toss'

export interface Holding {
  id: number
  broker: BrokerKey
  stock_code: string
  stock_name: string
  quantity: number
  avg_buy_price: number
  cur_prc: number
  eval_amount: number
  profit_amount: number
  profit_rate: number
}

export interface BrokerSummary {
  label: string
  total_buy_amount: number
  total_eval_amount: number
  total_profit_amount: number
  total_profit_rate: number
  holdings: Holding[]
}

export interface AssetSummary {
  brokers: Record<BrokerKey, BrokerSummary>
  total: {
    total_buy_amount: number
    total_eval_amount: number
    total_profit_amount: number
    total_profit_rate: number
  }
}

export interface AssetTrendPoint {
  date: string
  mirae: number
  namuh: number
  toss: number
  total: number
}

// 수동 입력/수정용 (id/파생값 제외)
export interface HoldingInput {
  broker: BrokerKey
  stock_code: string
  stock_name: string
  quantity: number
  avg_buy_price: number
}
```

### 7.4. API 함수 (`api/index.ts`)
```typescript
export const fetchHoldings      = () => fetch('/kiwoom/api/holdings').then(r => r.json())
export const upsertHolding      = (h: HoldingInput) => fetch('/kiwoom/api/holdings', { method:'POST', ... })
export const deleteHolding      = (id: number) => fetch(`/kiwoom/api/holdings/${id}`, { method:'DELETE' })
export const fetchAssetSummary  = () => fetch('/kiwoom/api/assets/summary').then(r => r.json())
export const fetchAssetTrend    = (days = 30) => fetch(`/kiwoom/api/assets/trend?days=${days}`).then(r => r.json())
```

### 7.5. 컴포넌트 구성
```
pages/AssetsPage.tsx
  ├─ components/BrokerSummaryCards.tsx   — 증권사별 + 전체 요약 카드
  ├─ components/HoldingsTable.tsx        — 보유 종목 테이블 (증권사 필터, 수익 색상)
  ├─ components/AssetTrendChart.tsx      — 일별 증권사별 라인 차트 (Recharts LineChart)
  ├─ components/CumulativeAssetChart.tsx — 누적 자산 AreaChart (Recharts)
  └─ components/HoldingEditDialog.tsx    — 보유 종목 수동 입력/수정/삭제
```

- 그래프 라이브러리는 기존 `PriceChart.tsx` 패턴에 맞춰 Recharts 사용.
- 색상 규칙: 수익(+) 빨강, 손실(−) 파랑 (기존 키움 페이지 컨벤션 준수).
- 증권사별 색상: 미래에셋(주황), 나무(초록), 토스(파랑) — 고정 팔레트.

## 8. UX 흐름

```
사이드바 "자산 조회" 클릭
  → /assets 진입
  → fetchAssetSummary() + fetchAssetTrend() 병렬 호출
  → 요약 카드 → 보유 테이블 → 추이 그래프 순으로 렌더링
  (일별 스냅샷은 장 마감 후 스케줄러가 별도 기록 — 조회 시점에는 기록하지 않음)

"보유 종목 추가" (Dialog)
  → 증권사 선택 + 종목 검색(키움 검색 재사용) + 수량/매수가 입력
  → upsert 후 summary 재조회

"수정/삭제"
  → 테이블 행에서 수정(PUT) 또는 삭제(DELETE) → summary 재조회
```

## 9. 구현 범위 및 단계

| 단계 | 내용 |
|------|------|
| 1 | DB 스키마(`holdings`, `asset_snapshots`) + holdings CRUD API |
| 2 | `ka10001` 현재가 캐시 유틸 + `/assets/summary` 구현 |
| 3 | `/assets/trend` 구현 + 장 마감 후 스냅샷 스케줄러(§6.4) |
| 4 | 타입/API 함수 + AppShell 메뉴 + 라우트 |
| 5 | AssetsPage + 요약 카드 + 보유 테이블 |
| 6 | 추이/누적 그래프 2종 |
| 7 | 보유 종목 입력/수정/삭제 Dialog (수동 입력) |

## 10. 확정 사항

1. **보유 데이터 입력 방식**: 화면에서 **수동 입력**. 저장은 **SQLite `trades.db`의 `holdings` 테이블** (CSV 파일 미사용).
2. **현재가 소스**: 전 종목 현재가를 **키움 `ka10001` API**로 조회. (국내 상장 종목 기준, 해외주식은 범위 외)
3. **스냅샷 시점**: 일별 추이는 **장 마감 후 스케줄러(평일 15:40 KST)로 1회 기록** (§6.4). 서버 기동 시 당일 누락분 보정.

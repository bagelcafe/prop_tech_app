# 관심종목 대시보드 설계

## 개요

KiwoomPage에 **관심종목 테이블** 섹션을 추가하여, 등록된 종목들의 현재가/3개월 고저/매수매도가 정보를 한눈에 보여준다.

## UI 레이아웃

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  🏠 키움 주식 정보                                       [토큰상태] [갱신]    │
├───────────────────────────────────────────────────────────────────────────────┤
│  📋 관심종목 대시보드                                              [새로고침] │
│  ┌──────┬──────┬───────┬───────┬─────┬─────┬──────┬──────────┬──────────┐    │
│  │종목명│현재가│3M고가 │3M저가 │매수가│매도가│수익률│고가대비↓ │저가대비↑ │    │
│  ├──────┼──────┼───────┼───────┼─────┼─────┼──────┼──────────┼──────────┤    │
│  │삼성..│72,000│78,500 │65,200 │68,000│  -  │+5.9% │ -8.3%   │ +10.4%   │    │
│  │SK..  │185K  │210K   │170K   │175K  │195K │+5.7% │ -11.9%  │ +8.8%    │    │
│  └──────┴──────┴───────┴───────┴─────┴─────┴──────┴──────────┴──────────┘    │
├───────────────────────────────────────────────────────────────────────────────┤
│  🔍 종목 검색  [_______________] [검색] [★]                                   │
├───────────────────────────────────────────────────────────────────────────────┤
│  📊 차트 / 종목 상세 (기존과 동일)                                            │
├───────────────────────────────────────────────────────────────────────────────┤
│  📝 매매 이력 (기존과 동일)                                                   │
└───────────────────────────────────────────────────────────────────────────────┘
```

## 테이블 컬럼 정의

| # | 컬럼명 | 필드명 | 설명 | 계산식 |
|---|--------|--------|------|--------|
| 1 | 종목명 | `stock_name` | 종목 이름 | - |
| 2 | 현재가 | `cur_prc` | 현재 주가 | ka10001 API |
| 3 | 3M 고가 | `high_3m` | 최근 3개월 최고가 | max(일봉 high_pric) |
| 4 | 3M 저가 | `low_3m` | 최근 3개월 최저가 | min(일봉 low_pric) |
| 5 | 매수가 | `avg_buy_price` | 매수 가중평균가 | trades 테이블에서 계산 |
| 6 | 매도가 | `avg_sell_price` | 매도 가중평균가 | trades 테이블에서 계산 |
| 7 | 수익률 | `profit_rate` | 매수가 대비 현재가 수익률 | `(cur_prc - avg_buy_price) / avg_buy_price * 100` |
| 8 | 고가대비↓ | `high_drop_rate` | 3개월 최고가 대비 현재가 하락률 | `(cur_prc - high_3m) / high_3m * 100` (음수) |
| 9 | 저가대비↑ | `low_rise_rate` | 3개월 최저가 대비 현재가 상승률 | `(cur_prc - low_3m) / low_3m * 100` (양수) |

## DB 스키마

SQLite `trades.db`에 테이블 추가:

```sql
CREATE TABLE IF NOT EXISTS watchlist (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_code  TEXT NOT NULL UNIQUE,
    stock_name  TEXT NOT NULL,
    added_at    TEXT NOT NULL
);
```

## Backend API

### 관심종목 CRUD

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/api/watchlist` | 관심종목 목록 조회 |
| `POST` | `/api/watchlist` | 관심종목 추가 `{stock_code, stock_name}` |
| `DELETE` | `/api/watchlist/{stock_code}` | 관심종목 삭제 |

### 관심종목 요약 조회

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/api/watchlist/summary` | 전 종목 현재가 + 3개월 고저 + 매수/매도가 + 파생 비율 일괄 조회 |

#### `/api/watchlist/summary` 처리 로직

1. `watchlist` 테이블에서 종목 코드 목록 조회
2. 각 종목에 대해:
   - `ka10001` → 현재가(`cur_prc`)
   - `ka10081` → 최근 ~65영업일(3개월) 일봉 → `max(high_pric)`, `min(low_pric)`
   - `trades` 테이블 → 매수 가중평균가, 매도 가중평균가 계산
3. 파생 비율 계산:
   - `profit_rate` = (cur_prc - avg_buy_price) / avg_buy_price * 100 (매수가 있을 때)
   - `high_drop_rate` = (cur_prc - high_3m) / high_3m * 100 (항상 ≤ 0)
   - `low_rise_rate` = (cur_prc - low_3m) / low_3m * 100 (항상 ≥ 0)
4. 결과 반환

#### 응답 형식

```json
{
  "items": [
    {
      "stock_code": "005930",
      "stock_name": "삼성전자",
      "cur_prc": 72000,
      "change_rate": "+1.25",
      "high_3m": 78500,
      "low_3m": 65200,
      "avg_buy_price": 68000,
      "avg_sell_price": null,
      "buy_qty": 100,
      "sell_qty": 0,
      "profit_rate": 5.88,
      "high_drop_rate": -8.28,
      "low_rise_rate": 10.43
    }
  ]
}
```

#### 매수/매도 평균가 계산

```sql
SELECT trade_type,
       SUM(quantity) as total_qty,
       SUM(amount) as total_amount
FROM trades
WHERE stock_code = ?
GROUP BY trade_type
-- avg_buy_price = total_amount / total_qty (trade_type='매수')
-- avg_sell_price = total_amount / total_qty (trade_type='매도')
```

#### 비율 계산 공식

```python
# 수익률: 매수가 대비 현재가
profit_rate = (cur_prc - avg_buy_price) / avg_buy_price * 100  # null if no buy

# 최고가 대비 하락률: 3개월 최고가에서 얼마나 하락했는지
high_drop_rate = (cur_prc - high_3m) / high_3m * 100  # 항상 ≤ 0 (최고가가 현재가일 때 0)

# 최저가 대비 상승률: 3개월 최저가에서 얼마나 상승했는지
low_rise_rate = (cur_prc - low_3m) / low_3m * 100  # 항상 ≥ 0 (최저가가 현재가일 때 0)
```

## Frontend

### 타입 (`types/index.ts`)

```typescript
export interface WatchlistItem {
  stock_code: string
  stock_name: string
  cur_prc: number
  change_rate: string
  high_3m: number
  low_3m: number
  avg_buy_price: number | null
  avg_sell_price: number | null
  buy_qty: number
  sell_qty: number
  profit_rate: number | null
  high_drop_rate: number | null
  low_rise_rate: number | null
}
```

### API 함수 (`api/index.ts`)

```typescript
export const fetchWatchlist = () => api.get('/kiwoom/api/watchlist')
export const addToWatchlist = (stock_code: string, stock_name: string) =>
  api.post('/kiwoom/api/watchlist', { stock_code, stock_name })
export const removeFromWatchlist = (stock_code: string) =>
  api.delete(`/kiwoom/api/watchlist/${stock_code}`)
export const fetchWatchlistSummary = () =>
  api.get('/kiwoom/api/watchlist/summary')
```

### 컴포넌트 (`components/WatchlistTable.tsx`)

- MUI `Table` 기반 관심종목 리스트
- 컬럼: 종목명, 현재가, 등락률, 3개월 고가, 3개월 저가, 매수가, 매도가, 수익률, 고가대비↓, 저가대비↑, 삭제
- 종목명 클릭 시 해당 종목 상세 조회 트리거
- 상승/하락 색상 (빨강/파랑)
- 비율 셀에 조건부 색상 (하락=파랑, 상승=빨강)
- 새로고침 버튼

### KiwoomPage 변경

- 관심종목 테이블을 검색 카드 상단에 배치
- 종목 조회 시 "★ 관심종목 추가" 버튼 표시
- 매매 이력 등록 시 자동으로 관심종목에 추가

## UX 흐름

```
KiwoomPage 진입
  → watchlist/summary API 호출
  → 관심종목 테이블 렌더링

종목 검색/조회
  → 관심종목에 없으면 "★ 추가" 버튼
  → 있으면 "☆ 해제" 버튼

매매 이력 등록
  → 자동으로 관심종목에 추가

테이블 행 클릭
  → 해당 종목 상세 차트 표시
```

## API 호출 최적화

| 고려사항 | 해결 방안 |
|---------|----------|
| API Rate Limit | 종목 간 0.3초 딜레이로 순차 호출 |
| 3개월 일봉 | `ka10081` 1회 호출로 120일 데이터 수신 |
| 페이지 진입 시 지연 | 로딩 스피너 표시 |
| 캐시 | summary 결과를 5분간 메모리 캐시 |

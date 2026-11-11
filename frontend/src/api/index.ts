import type {
  RegionOption, TradeItem, StatsData,
  StockSearchResult, StockData, TokenStatus,
  Trade, TradeInput, TradeUpdateInput, WatchlistItem, KiwoomCondition, ConditionSearchItem,
  Holding, AssetSummary, AssetTrendPoint, HoldingInput,
} from '../types'

// ── Real Estate APIs ─────────────────────────────────────────────────────────

export async function searchRegions(query: string): Promise<RegionOption[]> {
  const res = await fetch(`/api/regions?query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Region search failed: ${res.status}`)
  return res.json()
}

export async function fetchTradeData(
  code: string,
  dong: string | null,
  type: 'all' | 'sale' | 'jeonse',
  startMonth?: string,
  endMonth?: string,
): Promise<TradeItem[]> {
  const params = new URLSearchParams({ code, type })
  if (dong) params.set('dong', dong)
  if (startMonth) params.set('start_month', startMonth)
  if (endMonth) params.set('end_month', endMonth)
  const res = await fetch(`/api/search?${params.toString()}`)
  if (!res.ok) throw new Error(`Trade fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchStats(
  startDate?: string,
  endDate?: string,
): Promise<StatsData> {
  const params = new URLSearchParams()
  if (startDate) params.set('start_date', startDate)
  if (endDate) params.set('end_date', endDate)
  const qs = params.toString()
  const res = await fetch(`/api/stats${qs ? `?${qs}` : ''}`)
  if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchConfig(): Promise<{ enable_adsense: boolean }> {
  const res = await fetch('/api/config')
  if (!res.ok) throw new Error('Config fetch failed')
  return res.json()
}

export interface TossStockData {
  stock: {
    symbol: string
    name: string
    englishName: string
    isinCode: string
    market: string
    securityType: string
    status: string
    currency: string
    listDate: string | null
    sharesOutstanding: string
  }
  price: { lastPrice: string; currency: string; timestamp: string | null } | null
}

export async function fetchTossStock(symbol: string): Promise<TossStockData> {
  const res = await fetch(`/api/toss/stocks/${encodeURIComponent(symbol)}`)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(typeof error.detail === 'string' ? error.detail : `조회 실패 (HTTP ${res.status})`)
  }
  return res.json()
}

export interface TossHolding {
  symbol: string
  name: string
  currency: string
  quantity: string
  lastPrice: string
  averagePurchasePrice: string
  marketValue: { amount: string; purchaseAmount: string }
  profitLoss: { amount: string; rate: string }
}

export interface TossHoldingsData {
  accounts: { account_seq: number; items: TossHolding[] }[]
  exchange_rate: string | null
  total_buy_krw: string
  total_eval_krw: string
}

let pendingTossHoldings: Promise<TossHoldingsData> | null = null

export function fetchTossHoldings(): Promise<TossHoldingsData> {
  if (!pendingTossHoldings) {
    pendingTossHoldings = (async () => {
      const res = await fetch('/api/toss/holdings', { cache: 'no-store' })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(typeof error.detail === 'string' ? error.detail : `토스 보유종목 조회 실패 (HTTP ${res.status})`)
      }
      return res.json() as Promise<TossHoldingsData>
    })().finally(() => { pendingTossHoldings = null })
  }
  return pendingTossHoldings
}

// ── Kiwoom APIs ──────────────────────────────────────────────────────────────

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  const res = await fetch(`/kiwoom/api/search/${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Stock search failed: ${res.status}`)
  const data = await res.json()
  return (data.results ?? []) as StockSearchResult[]
}

export async function fetchStockData(code: string): Promise<StockData> {
  const res = await fetch(`/kiwoom/api/stock/${code}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data as StockData
}

export async function getTokenStatus(): Promise<TokenStatus> {
  const res = await fetch('/kiwoom/token/status')
  if (!res.ok) throw new Error(`Token status failed: ${res.status}`)
  return res.json()
}

export async function refreshToken(): Promise<{ success: boolean; expires_dt?: string }> {
  const res = await fetch('/kiwoom/token/refresh', { method: 'POST' })
  return res.json()
}

export async function fetchConditions(): Promise<KiwoomCondition[]> {
  const res = await fetch('/kiwoom/api/conditions')
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))
    throw new Error(error.detail ?? '조건식 목록 조회 실패')
  }
  const data = await res.json()
  return data.conditions as KiwoomCondition[]
}

export async function searchCondition(seq: string): Promise<ConditionSearchItem[]> {
  const res = await fetch(`/kiwoom/api/conditions/${encodeURIComponent(seq)}/search`, { method: 'POST' })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))
    throw new Error(error.detail ?? '조건검색 조회 실패')
  }
  const data = await res.json()
  return data.items as ConditionSearchItem[]
}

// ── Trade (매매이력) APIs ────────────────────────────────────────────────────

export async function fetchTrades(stockCode: string): Promise<Trade[]> {
  const res = await fetch(`/kiwoom/api/trades/${stockCode}`)
  if (!res.ok) throw new Error(`Trades fetch failed: ${res.status}`)
  const data = await res.json()
  return data.trades as Trade[]
}

export async function addTrade(trade: TradeInput): Promise<{ success: boolean; id: number }> {
  const res = await fetch('/kiwoom/api/trades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trade),
  })
  if (!res.ok) throw new Error(`Add trade failed: ${res.status}`)
  return res.json()
}

export async function deleteTrade(id: number): Promise<void> {
  const res = await fetch(`/kiwoom/api/trades/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Delete trade failed: ${res.status}`)
}

export async function updateTrade(id: number, payload: TradeUpdateInput): Promise<{ success: boolean }> {
  const res = await fetch(`/kiwoom/api/trades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Update trade failed: ${res.status}`)
  return res.json()
}

// ── Watchlist APIs ───────────────────────────────────────────────────────────

export async function fetchWatchlist(): Promise<{ items: { stock_code: string; stock_name: string; added_at: string }[] }> {
  const res = await fetch('/kiwoom/api/watchlist')
  if (!res.ok) throw new Error(`Watchlist fetch failed: ${res.status}`)
  return res.json()
}

export async function addToWatchlist(stock_code: string, stock_name: string): Promise<{ success: boolean }> {
  const res = await fetch('/kiwoom/api/watchlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_code, stock_name }),
  })
  if (!res.ok) throw new Error(`Add to watchlist failed: ${res.status}`)
  return res.json()
}

export async function removeFromWatchlist(stock_code: string): Promise<void> {
  const res = await fetch(`/kiwoom/api/watchlist/${stock_code}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Remove from watchlist failed: ${res.status}`)
}

export async function fetchWatchlistSummary(): Promise<{ items: WatchlistItem[] }> {
  const res = await fetch('/kiwoom/api/watchlist/summary')
  if (!res.ok) throw new Error(`Watchlist summary failed: ${res.status}`)
  return res.json()
}

// ── Asset Dashboard APIs ───────────────────────────────────────────────────────

export async function fetchHoldings(broker?: string): Promise<{ items: Holding[] }> {
  const qs = broker ? `?broker=${encodeURIComponent(broker)}` : ''
  const res = await fetch(`/kiwoom/api/holdings${qs}`)
  if (!res.ok) throw new Error(`Holdings fetch failed: ${res.status}`)
  return res.json()
}

export async function upsertHolding(h: HoldingInput): Promise<{ success: boolean }> {
  const res = await fetch('/kiwoom/api/holdings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(h),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))
    throw new Error(err.detail ?? '보유 종목 저장 실패')
  }
  return res.json()
}

export async function updateHolding(
  id: number,
  payload: { quantity: number; avg_buy_price: number },
): Promise<{ success: boolean }> {
  const res = await fetch(`/kiwoom/api/holdings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))
    throw new Error(err.detail ?? '보유 종목 수정 실패')
  }
  return res.json()
}

export async function deleteHolding(id: number): Promise<void> {
  const res = await fetch(`/kiwoom/api/holdings/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Delete holding failed: ${res.status}`)
}

export async function fetchAssetSummary(): Promise<AssetSummary> {
  const res = await fetch('/kiwoom/api/assets/summary')
  if (!res.ok) throw new Error(`Asset summary failed: ${res.status}`)
  return res.json()
}

export async function fetchAssetTrend(days = 30): Promise<{ series: AssetTrendPoint[] }> {
  const res = await fetch(`/kiwoom/api/assets/trend?days=${days}`)
  if (!res.ok) throw new Error(`Asset trend failed: ${res.status}`)
  return res.json()
}

export interface ValueAtDate {
  date: string
  brokers: Record<'mirae' | 'namuh' | 'toss', number>
  total: number
  missing: string[]
}

export async function fetchValueAt(date: string): Promise<ValueAtDate> {
  const res = await fetch(`/kiwoom/api/assets/value-at?date=${date}`)
  if (!res.ok) throw new Error(`Value-at failed: ${res.status}`)
  return res.json()
}

export interface MonthlyReturnPoint {
  date: string
  value: number
  portfolio: number | null
  kospi: number | null
  sp500: number | null
  nasdaq: number | null
}

export async function fetchMonthlyReturns(): Promise<{ series: MonthlyReturnPoint[]; excluded: string[] }> {
  const res = await fetch('/kiwoom/api/assets/monthly-returns')
  if (!res.ok) throw new Error(`Monthly returns failed: ${res.status}`)
  return res.json()
}

export interface TossSearchItem {
  symbol: string
  name: string
  market: string
}

async function tossJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(typeof error.detail === 'string' ? error.detail : `조회 실패 (HTTP ${res.status})`)
  }
  return res.json()
}

export function searchTossStocks(query: string, scope: 'all' | 'kr' = 'all'): Promise<TossSearchItem[]> {
  return tossJson(`/api/toss/search?q=${encodeURIComponent(query)}&scope=${scope}`)
}

export interface TossCandle {
  date: string
  open: string
  high: string
  low: string
  close: string
  volume: string
}

export type CandleInterval = '30m' | '1d' | '1w' | '1M'

export function fetchTossCandles(symbol: string, interval: CandleInterval = '1d'): Promise<TossCandle[]> {
  return tossJson(`/api/toss/stocks/${encodeURIComponent(symbol)}/candles?interval=${interval}`)
}

export interface TossWatchItem {
  symbol: string
  name: string
  market: string
  lastPrice: string | null
  currency: string
  peak: string | null
  peakDate: string | null
  stop: string | null
  trailRate: string
  error: string | null
}

export function fetchTossWatchlist(): Promise<{ items: TossWatchItem[] }> {
  return tossJson('/api/toss/watchlist')
}

// ── Trailing Stop Bot APIs (/api/bot/*) ───────────────────────────────────────

export type BotState =
  | 'PENDING' | 'ARMED' | 'TRAILING' | 'AWAITING_CONFIRM'
  | 'TRIGGERED' | 'DONE' | 'HALTED' | 'CANCELLED'

export interface BotStop {
  id: number
  account_seq: number
  symbol: string
  name: string | null
  quantity: string
  trail_rate: string
  peak_price: string | null
  peak_date: string | null
  stop_price: string | null
  conditional_order_id: string | null
  state: BotState
  dry_run: number
  last_price: string | null
  fail_count: number
  note: string | null
  created_at: string
  updated_at: string
}

export interface BotStopRegisterInput {
  account_seq: number
  symbol: string
  quantity: string
  name?: string
  peak_override?: string
  dry_run?: boolean
}

async function botJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(typeof error.detail === 'string' ? error.detail : `봇 요청 실패 (HTTP ${res.status})`)
  }
  return res.json()
}

export function fetchBotStops(): Promise<{ items: BotStop[] }> {
  return botJson('/api/bot/stops')
}

export function fetchBotPendingConfirms(): Promise<{ items: BotStop[] }> {
  return botJson('/api/bot/pending-confirms')
}

export function registerBotStop(payload: BotStopRegisterInput): Promise<BotStop> {
  return botJson('/api/bot/stops', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function confirmBotStop(id: number): Promise<BotStop> {
  return botJson(`/api/bot/stops/${id}/confirm`, { method: 'POST' })
}

export function rejectBotStop(id: number): Promise<BotStop> {
  return botJson(`/api/bot/stops/${id}/reject`, { method: 'POST' })
}

export function cancelBotStop(id: number): Promise<BotStop> {
  return botJson(`/api/bot/stops/${id}`, { method: 'DELETE' })
}

export function haltBot(): Promise<{ halted: boolean }> {
  return botJson('/api/bot/halt', { method: 'POST' })
}

export function resumeBot(): Promise<{ resumed: boolean }> {
  return botJson('/api/bot/resume', { method: 'POST' })
}

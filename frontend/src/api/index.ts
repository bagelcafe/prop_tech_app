import type {
  RegionOption, TradeItem, StatsData,
  StockSearchResult, StockData, TokenStatus,
  Trade, TradeInput, TradeUpdateInput, WatchlistItem, KiwoomCondition, ConditionSearchItem,
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

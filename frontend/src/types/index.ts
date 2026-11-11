// Real estate region search result
export interface RegionOption {
  code: string
  label: string
  dong_name: string
}

// A single real estate trade record
export interface TradeItem {
  type: string       // 매매 | 전세 | 월세
  apt_name: string
  dong: string
  price: string
  price_num: number
  area: string
  pyung: number
  floor: string
  build_year: string
  date: string
}

// Stats API response
export interface StatsData {
  today_logs?: LogEntry[]  // 오늘 로그 파일이 없을 수 있음
  history: HistoryEntry[]
  summary: { total_visitors: number; total_requests: number }
  period: { start: string; end: string }
}

export interface LogEntry {
  time: string
  ip: string
  url: string
  status: number
}

export interface HistoryEntry {
  date: string
  visitors: number
  requests: number
}

// Config
export interface AppConfig {
  enable_adsense: boolean
}

// ── Kiwoom types ─────────────────────────────────────────────────────────────
export interface StockSearchResult {
  stk_cd: string
  stk_nm: string
}

export interface StockInfo {
  stk_cd: string
  stk_nm: string
  cur_prc: string
  pred_pre: string
  flu_rt: string
  open_pric: string
  high_pric: string
  low_pric: string
  trde_qty: string
  trde_prica: string
  per?: string
  pbr?: string
  eps?: string
  [key: string]: string | undefined
}

export interface ChartCandle {
  dt: string
  cur_prc: string
  open_pric: string
  high_pric: string
  low_pric: string
  trde_qty: string
}

export interface StockData {
  info: StockInfo
  chart: ChartCandle[]
}

export interface TokenStatus {
  has_token: boolean
  expires_dt: string | null
  token_preview: string | null
}

export interface KiwoomCondition {
  seq: string
  name: string
}

export interface ConditionSearchItem {
  stock_code: string
  stock_name: string
  current_price: string
  change: string
  change_rate: string
  volume: string
}

// ── Trade types ──────────────────────────────────────────────────────────────
export interface Trade {
  id: number
  stock_code: string
  stock_name: string
  trade_type: '매수' | '매도'
  quantity: number
  price: number
  amount: number
  order_no: string | null
  account_no: string | null
  account_name: string | null
  trade_date: string   // YYYYMMDD
  memo: string | null
  created_at: string
}

export interface TradeInput {
  stock_code: string
  stock_name: string
  trade_type: '매수' | '매도'
  quantity: number
  price: number
  amount: number
  order_no?: string
  account_no?: string
  account_name?: string
  trade_date: string
  memo?: string
}

export interface TradeUpdateInput {
  quantity: number
  price: number
  amount: number
  trade_date: string
}

// ── Watchlist types ──────────────────────────────────────────────────────────
export interface WatchlistItem {
  stock_code: string
  stock_name: string
  cur_prc: number
  change_rate: string
  high_3m: number
  low_3m: number
  avg_buy_price: number | null
  avg_sell_price: number | null
  holding_qty: number
  avg_holding_buy_price: number | null
  sell_qty: number
  evaluation_amount: number | null
  profit_rate: number | null
  profit_amount: number | null
  high_drop_rate: number | null
  low_rise_rate: number | null
}

// ── Asset Dashboard types ──────────────────────────────────────────────────────
export type BrokerKey = 'mirae' | 'namuh' | 'toss'

export const BROKER_LABELS: Record<BrokerKey, string> = {
  mirae: '미래에셋증권',
  namuh: '나무증권',
  toss: '토스증권',
}

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

export interface AssetTotal {
  total_buy_amount: number
  total_eval_amount: number
  total_profit_amount: number
  total_profit_rate: number
}

export interface AssetSummary {
  brokers: Record<BrokerKey, BrokerSummary>
  total: AssetTotal
}

export interface AssetTrendPoint {
  date: string
  mirae: number
  namuh: number
  toss: number
  total: number
}

// 수동 입력/수정용
export interface HoldingInput {
  broker: BrokerKey
  stock_code: string
  stock_name: string
  quantity: number
  avg_buy_price: number
}

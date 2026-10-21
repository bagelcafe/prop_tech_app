import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container, Box, Typography, Button, Fade,
  Alert, Snackbar, Chip, Card, CardContent, Divider,
  Grid,
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import AutocompleteInput from '../components/AutocompleteInput'
import KiwoomChart from '../components/KiwoomChart'
import TradeInputDialog from '../components/TradeInputDialog'
import TradeEditDialog from '../components/TradeEditDialog'
import TradeHistoryTable from '../components/TradeHistoryTable'
import WatchlistTable from '../components/WatchlistTable'
import { searchStocks, fetchStockData, getTokenStatus, refreshToken, fetchTrades, addTrade, deleteTrade, updateTrade, fetchWatchlist, addToWatchlist, removeFromWatchlist } from '../api'
import type { StockData, TokenStatus, Trade } from '../types'
import { useEffect } from 'react'

// 키움 페이지 전용 라이트 테마
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8' },
    secondary: { main: '#7c3aed' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
    error: { main: '#dc2626' },
    success: { main: '#16a34a' },
    divider: 'rgba(15, 23, 42, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          border: '1px solid rgba(15,23,42,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 } },
    },
    MuiTextField: {
      styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8, backgroundColor: '#ffffff' } } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        },
      },
    },
  },
})

const fmt = (v: string | undefined) =>
  v ? new Intl.NumberFormat('ko-KR').format(Math.abs(parseInt(v))) : '-'

const fmtBig = (v: string | undefined) => {
  const n = v ? Math.abs(parseInt(v)) : 0
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}조`
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(0)}억`
  return new Intl.NumberFormat('ko-KR').format(n)
}

export default function KiwoomPage() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<StockData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingCode, setPendingCode] = useState('')
  const [token, setToken] = useState<TokenStatus | null>(null)
  const [tokenLoading, setTokenLoading] = useState(false)

  // 매매이력 상태
  const [trades, setTrades] = useState<Trade[]>([])
  const [tradesLoading, setTradesLoading] = useState(false)
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [tradeToast, setTradeToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  // 관심종목 상태
  const [watchlistCodes, setWatchlistCodes] = useState<Set<string>>(new Set())
  const [watchlistRefresh, setWatchlistRefresh] = useState(0)

  const loadTokenStatus = async () => {
    try { setToken(await getTokenStatus()) } catch { /* silent */ }
  }

  const loadWatchlistCodes = async () => {
    try {
      const res = await fetchWatchlist()
      setWatchlistCodes(new Set(res.items.map((i) => i.stock_code)))
    } catch { /* silent */ }
  }

  useEffect(() => { loadTokenStatus(); loadWatchlistCodes() }, [])

  const handleTokenRefresh = async () => {
    setTokenLoading(true)
    try { await refreshToken(); await loadTokenStatus() } finally { setTokenLoading(false) }
  }

  const handleSelect = (code: string) => {
    setPendingCode(code)
  }

  const loadTrades = useCallback(async (code: string) => {
    setTradesLoading(true)
    try { setTrades(await fetchTrades(code)) } catch { setTrades([]) } finally { setTradesLoading(false) }
  }, [])

  const handleSearch = async () => {
    if (!pendingCode) { setError('종목을 선택하거나 6자리 코드를 입력하세요.'); return }
    setLoading(true); setError(null)
    try {
      const result = await fetchStockData(pendingCode)
      setData(result)
      await loadTrades(pendingCode)
    } catch (e) {
      setError(e instanceof Error ? e.message : '데이터 조회 실패')
      setData(null)
    } finally { setLoading(false) }
  }

  const handleAddTrade = async (trade: Parameters<typeof addTrade>[0]) => {
    await addTrade(trade)
    // 매매 이력 추가 시 자동으로 관심종목에 추가
    if (trade.stock_code && trade.stock_name) {
      try {
        await addToWatchlist(trade.stock_code, trade.stock_name)
        setWatchlistCodes((prev) => new Set(prev).add(trade.stock_code))
        setWatchlistRefresh((v) => v + 1)
      } catch { /* silent */ }
    }
  }

  const handleDeleteTrade = async (id: number) => {
    await deleteTrade(id)
    if (data?.info?.stk_cd) await loadTrades(data.info.stk_cd)
  }

  const handleUpdateTrade = async (id: number, payload: { quantity: number; price: number; amount: number; trade_date: string }) => {
    await updateTrade(id, payload)
    if (data?.info?.stk_cd) await loadTrades(data.info.stk_cd)
  }

  const handleToggleWatchlist = async () => {
    if (!data?.info) return
    const code = data.info.stk_cd
    const name = data.info.stk_nm
    if (watchlistCodes.has(code)) {
      await removeFromWatchlist(code)
      setWatchlistCodes((prev) => { const s = new Set(prev); s.delete(code); return s })
    } else {
      await addToWatchlist(code, name)
      setWatchlistCodes((prev) => new Set(prev).add(code))
    }
    setWatchlistRefresh((v) => v + 1)
  }

  const handleWatchlistStockClick = async (code: string) => {
    setPendingCode(code)
    setLoading(true); setError(null)
    try {
      const result = await fetchStockData(code)
      setData(result)
      await loadTrades(code)
    } catch (e) {
      setError(e instanceof Error ? e.message : '데이터 조회 실패')
      setData(null)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    const code = searchParams.get('code')
    if (code && /^\d{6}$/.test(code) && code !== data?.info?.stk_cd) {
      void handleWatchlistStockClick(code)
    }
  }, [searchParams])

  const info = data?.info
  const change = info ? parseInt(info.pred_pre) : 0
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  // 한국 주식 컨벤션: 상승=빨강, 하락=파랑
  const priceColor = { up: '#e11d48', down: '#2563eb', flat: '#64748b' }[direction]
  const PriceIcon = direction === 'up' ? TrendingUpIcon : direction === 'down' ? TrendingDownIcon : TrendingFlatIcon

  const metrics = info ? [
    ['시가', fmt(info.open_pric)],
    ['고가', fmt(info.high_pric)],
    ['저가', fmt(info.low_pric)],
    ['거래량', fmt(info.trde_qty)],
    ['거래대금', fmtBig(info.trde_prica)],
    ['PER', info.per ?? '-'],
    ['PBR', info.pbr ?? '-'],
    ['EPS', info.eps ? fmt(info.eps) : '-'],
  ] : []

  return (
    <ThemeProvider theme={lightTheme}>
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <ShowChartIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4">키움 주식 정보</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            키움증권 REST API 기반 실시간 주식 데이터
          </Typography>
        </Box>

        {/* Token badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {token && (
            <Chip
              size="small"
              icon={token.has_token ? <CheckCircleOutlineIcon fontSize="small" /> : <ErrorOutlineIcon fontSize="small" />}
              label={token.has_token ? `Token OK · ${token.expires_dt ?? ''}` : 'No Token'}
              color={token.has_token ? 'success' : 'error'}
              variant="outlined"
              sx={{ fontSize: '0.72rem' }}
            />
          )}
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleTokenRefresh}
            disabled={tokenLoading}
            variant="outlined"
          >
            토큰 갱신
          </Button>
        </Box>
      </Box>

      {/* Watchlist Table */}
      <WatchlistTable onStockClick={handleWatchlistStockClick} refreshTrigger={watchlistRefresh} />

      {/* Search */}
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <CardContent sx={{ overflow: 'visible' }}>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Box sx={{ flex: 1, minWidth: 280, maxWidth: 560 }}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                종목 검색
              </Typography>
              <AutocompleteInput
                placeholder="종목명 또는 6자리 코드 (예: 삼성전자, 005930)"
                fetchSuggestions={async (q) => {
                  if (/^\d{6}$/.test(q)) return [{ label: q, value: q }]
                  const results = await searchStocks(q)
                  return results.map((r) => ({ label: r.stk_nm, value: r.stk_cd, extra: r.stk_cd }))
                }}
                onSelect={(value) => handleSelect(value)}
                disabled={loading}
                minLength={1}
              />
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading || !pendingCode}
              sx={{ height: 56, minWidth: 100 }}
            >
              {loading ? '조회 중…' : '검색'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">시장 데이터를 불러오는 중…</Typography>
        </Box>
      )}

      {!loading && data && info && (
        <Fade in>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Info Card */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={800} mb={0.5}>{info.stk_nm}</Typography>
                    <Chip label={info.stk_cd} size="small"
                      sx={{ fontFamily: 'monospace', bgcolor: 'action.selected', fontSize: '0.75rem' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      size="small"
                      variant={watchlistCodes.has(info.stk_cd) ? 'contained' : 'outlined'}
                      color="warning"
                      startIcon={watchlistCodes.has(info.stk_cd) ? <StarIcon /> : <StarBorderIcon />}
                      onClick={handleToggleWatchlist}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {watchlistCodes.has(info.stk_cd) ? '관심종목' : '관심추가'}
                    </Button>
                    <PriceIcon sx={{ color: priceColor, fontSize: 36 }} />
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h4" sx={{ color: priceColor, fontWeight: 800, mb: 0.5 }}>
                  ₩{fmt(info.cur_prc)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="body1" sx={{ color: priceColor, fontWeight: 600 }}>
                    {change > 0 ? '+' : ''}{fmt(info.pred_pre)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: priceColor, fontWeight: 600 }}>
                    ({info.flu_rt}%)
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  {metrics.map(([label, value]) => (
                    <Grid item xs={6} sm={3} key={label}>
                      <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                      <Typography variant="body2" fontWeight={600}>{value}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Chart */}
            <KiwoomChart data={data.chart} stockName={info.stk_nm} isUp={change >= 0} trades={trades} />

            {/* 매매이력 */}
            <TradeHistoryTable
              trades={trades}
              loading={tradesLoading}
              onEdit={setEditingTrade}
              onDelete={handleDeleteTrade}
              onAddClick={() => setTradeDialogOpen(true)}
            />
          </Box>
        </Fade>
      )}

      {/* 매매이력 입력 다이얼로그 */}
      <TradeInputDialog
        open={tradeDialogOpen}
        onClose={() => setTradeDialogOpen(false)}
        defaultStockCode={data?.info?.stk_cd}
        defaultStockName={data?.info?.stk_nm}
        onAdd={handleAddTrade}
        onSaved={() => { if (data?.info?.stk_cd) loadTrades(data.info.stk_cd) }}
        onSaveResult={(ok, message) => setTradeToast({ open: true, message, severity: ok ? 'success' : 'error' })}
      />

      <TradeEditDialog
        open={!!editingTrade}
        trade={editingTrade}
        onClose={() => setEditingTrade(null)}
        onUpdate={handleUpdateTrade}
        onSaved={() => { if (data?.info?.stk_cd) loadTrades(data.info.stk_cd) }}
        onSaveResult={(ok, message) => setTradeToast({ open: true, message, severity: ok ? 'success' : 'error' })}
      />

      {!loading && !data && !error && (
        <Box sx={{
          textAlign: 'center', py: 10,
          border: '2px dashed', borderColor: 'divider', borderRadius: 3,
        }}>
          <ShowChartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
          <Typography variant="h6" color="text.secondary">종목명 또는 코드를 검색하세요</Typography>
        </Box>
      )}

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>

      <Snackbar
        open={tradeToast.open}
        autoHideDuration={3200}
        onClose={() => setTradeToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={tradeToast.severity}
          onClose={() => setTradeToast((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {tradeToast.message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
    </ThemeProvider>
  )
}

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Alert, Box, Button, Chip, CircularProgress, Container, Divider, Grid,
  Autocomplete, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import { fetchTossCandles, fetchTossStock, fetchTossWatchlist, searchTossStocks } from '../api'
import type { CandleInterval, TossCandle, TossSearchItem, TossStockData } from '../api'
import StockPriceChart from '../components/StockPriceChart'
import RealtimePrice from '../components/RealtimePrice'
import WatchStopList from '../components/WatchStopList'

const FALLBACK_SYMBOL = '053800'   // 감시 리스트 조회 실패 시 폴백(안랩)
const INTERVALS: { value: CandleInterval; label: string }[] = [
  { value: '30m', label: '30분봉' },
  { value: '1d', label: '일봉' },
  { value: '1w', label: '주봉' },
  { value: '1M', label: '월봉' },
]

function formatNumber(value: string) {
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString('ko-KR', { maximumFractionDigits: 4 }) : value
}

export default function TossPage() {
  const [input, setInput] = useState('안랩')
  const [options, setOptions] = useState<TossSearchItem[]>([])
  const [searching, setSearching] = useState(false)
  const [data, setData] = useState<TossStockData | null>(null)
  const [candles, setCandles] = useState<TossCandle[]>([])
  const [interval, setInterval] = useState<CandleInterval>('1d')
  const [chartError, setChartError] = useState('')
  const [chartLoading, setChartLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadStock(code: string, iv: CandleInterval = interval) {
    setLoading(true)
    setError('')
    setChartError('')
    setData(null)
    setCandles([])
    try {
      const [stock, chart] = await Promise.allSettled([fetchTossStock(code), fetchTossCandles(code, iv)])
      if (stock.status === 'rejected') throw stock.reason
      setData(stock.value)
      if (chart.status === 'fulfilled') setCandles(chart.value)
      else setChartError(chart.reason instanceof Error ? chart.reason.message : '차트 조회에 실패했습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '종목 조회에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 봉 단위만 변경 시: 종목 정보는 유지한 채 차트만 다시 조회
  async function reloadChart(code: string, iv: CandleInterval) {
    setChartLoading(true)
    setChartError('')
    try {
      const chart = await fetchTossCandles(code, iv)
      setCandles(chart)
    } catch (err) {
      setChartError(err instanceof Error ? err.message : '차트 조회에 실패했습니다.')
    } finally {
      setChartLoading(false)
    }
  }

  function handleIntervalChange(_: unknown, next: CandleInterval | null) {
    if (!next || next === interval) return
    setInterval(next)
    if (data) void reloadChart(data.stock.symbol, next)
  }

  // 진입 시 감시 리스트의 첫 종목을 default 로 로드 (감시 중인 종목을 보여줌)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let symbol = FALLBACK_SYMBOL
      let name = ''
      try {
        const wl = await fetchTossWatchlist()
        if (wl.items.length > 0) {
          symbol = wl.items[0].symbol
          name = wl.items[0].name
        }
      } catch {
        // 감시 리스트 조회 실패 시 폴백 심볼 사용
      }
      if (cancelled) return
      if (name) setInput(name)
      void loadStock(symbol, '1d')
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const query = input.trim()
    if (query.length < 1) { setOptions([]); return }
    let cancelled = false
    const timer = window.setTimeout(async () => {
      setSearching(true)
      try {
        const found = await searchTossStocks(query)
        if (!cancelled) setOptions(found)
      } catch {
        if (!cancelled) setOptions([])
      } finally {
        if (!cancelled) setSearching(false)
      }
    }, 300)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [input])

  function selectItem(item: TossSearchItem) {
    setInput(item.name)
    void loadStock(item.symbol)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = input.trim()
    const exact = options.find((o) => o.name === query || o.symbol.toUpperCase() === query.toUpperCase())
    const target = exact ?? options[0]
    if (target) { selectItem(target); return }
    const code = query.toUpperCase()
    if (!/^[A-Z0-9.-]{1,30}$/.test(code)) {
      setError('검색 결과가 없습니다. 종목명 또는 종목 코드를 확인하세요.')
      return
    }
    void loadStock(code)
  }

  const details = data ? [
    ['시장', data.stock.market],
    ['종목 유형', data.stock.securityType],
    ['상장 상태', data.stock.status === 'ACTIVE' ? '상장' : data.stock.status === 'DELISTED' ? '상장폐지' : '상장 예정'],
    ['통화', data.stock.currency],
    ['상장일', data.stock.listDate || '-'],
    ['발행주식수', `${formatNumber(data.stock.sharesOutstanding)}주`],
    ['ISIN', data.stock.isinCode],
    ['영문명', data.stock.englishName],
  ] : []

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>토스주식</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>종목 조회</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Autocomplete
            freeSolo
            options={options}
            loading={searching}
            filterOptions={(x) => x}
            inputValue={input}
            onInputChange={(_, value) => setInput(value)}
            onChange={(_, value) => { if (value && typeof value !== 'string') selectItem(value) }}
            getOptionLabel={(o) => (typeof o === 'string' ? o : o.name)}
            isOptionEqualToValue={(a, b) => a.symbol === b.symbol}
            renderOption={(props, o) => (
              <li {...props} key={`${o.market}-${o.symbol}`}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                  <span>{o.name}</span>
                  <Typography component="span" variant="caption" color="text.secondary">{o.symbol} · {o.market}</Typography>
                </Box>
              </li>
            )}
            sx={{ width: { xs: '100%', sm: 360 } }}
            renderInput={(params) => (
              <TextField {...params} label="종목명 또는 코드" size="small" placeholder="삼성전자, 엔비디아, AAPL" />
            )}
          />
          <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={loading}>조회</Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} disabled={loading || !data} onClick={() => data && void loadStock(data.stock.symbol)}>새로고침</Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {loading && <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress size={28} aria-label="조회 중" /></Box>}

        {data && !loading && (
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 1, boxShadow: 'none' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="h5" fontWeight={700}>{data.stock.name}</Typography>
                  <Chip label={data.stock.market} size="small" variant="outlined" />
                </Stack>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>{data.stock.symbol}</Typography>
              </Box>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="body2" color="text.secondary">현재가</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {data.price ? `${formatNumber(data.price.lastPrice)} ${data.price.currency}` : '시세 없음'}
                </Typography>
                {data.price?.timestamp && <Typography variant="caption" color="text.secondary">{new Date(data.price.timestamp).toLocaleString('ko-KR')}</Typography>}
              </Box>
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>종목 정보</Typography>
            <Grid container spacing={2}>
              {details.map(([label, value]) => (
                <Grid item xs={6} md={3} key={label}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, overflowWrap: 'anywhere' }}>{value}</Typography>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>실시간 시세 (웹소켓)</Typography>
            <RealtimePrice symbol={data.stock.symbol} currency={data.stock.currency} candles={candles} />
            <Divider sx={{ my: 3 }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>차트 (5/20/60 이동평균 · 볼린저밴드)</Typography>
              <ToggleButtonGroup size="small" exclusive value={interval} onChange={handleIntervalChange} aria-label="봉 단위 선택">
                {INTERVALS.map((iv) => (
                  <ToggleButton key={iv.value} value={iv.value} aria-label={iv.label}>{iv.label}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
            {chartError && <Alert severity="warning">{chartError}</Alert>}
            {!chartError && (
              chartLoading
                ? <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} aria-label="차트 조회 중" /></Box>
                : <StockPriceChart candles={candles} currency={data.stock.currency} />
            )}
          </Paper>
        )}

        <WatchStopList />
      </Stack>
    </Container>
  )
}
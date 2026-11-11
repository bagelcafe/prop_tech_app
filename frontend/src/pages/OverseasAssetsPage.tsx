import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Container, Box, Typography, Card, CardContent, Grid, Chip, Alert, Button, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, TableContainer,
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import RefreshIcon from '@mui/icons-material/Refresh'
import { fetchTossHoldings } from '../api'
import type { TossHoldingsData } from '../api'

interface Row {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  lastPrice: number
  buyUsd: number
  evalUsd: number
  profitUsd: number
  rate: number
  evalKrw: number
  buyKrw: number
}

type SortKey = keyof Row

const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: 'name', label: '종목명', numeric: false },
  { key: 'quantity', label: '수량', numeric: true },
  { key: 'avgPrice', label: '매입가($)', numeric: true },
  { key: 'lastPrice', label: '현재가($)', numeric: true },
  { key: 'buyUsd', label: '매입금액($)', numeric: true },
  { key: 'evalUsd', label: '평가금액($)', numeric: true },
  { key: 'profitUsd', label: '평가손익($)', numeric: true },
  { key: 'rate', label: '수익률', numeric: true },
  { key: 'evalKrw', label: '평가금액(원)', numeric: true },
]

function profitColor(v: number): string {
  if (v > 0) return '#ef4444'
  if (v < 0) return '#3b82f6'
  return '#94a3b8'
}

const usd = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const krw = (v: number) => `${Math.round(v).toLocaleString()}원`
const pct = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%`
const sgn = (s: string, v: number) => `${v > 0 ? '+' : v < 0 ? '-' : ''}${s}`

export default function OverseasAssetsPage() {
  const [data, setData] = useState<TossHoldingsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('evalKrw')
  const [asc, setAsc] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await fetchTossHoldings())
    } catch (e) {
      setData(null)
      setError(e instanceof Error ? e.message : '토스 보유종목 조회 실패')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const rate = Number(data?.exchange_rate ?? 0)

  const rows = useMemo<Row[]>(() => {
    if (!data) return []
    const map = new Map<string, Row>()
    data.accounts.forEach((a) => a.items.filter((i) => i.currency === 'USD').forEach((i) => {
      const qty = Number(i.quantity)
      const buyUsd = Number(i.marketValue.purchaseAmount)
      const evalUsd = Number(i.marketValue.amount)
      const prev = map.get(i.symbol)
      // 계좌가 여러 개여도 같은 종목은 합산
      const quantity = (prev?.quantity ?? 0) + qty
      const b = (prev?.buyUsd ?? 0) + buyUsd
      const e = (prev?.evalUsd ?? 0) + evalUsd
      map.set(i.symbol, {
        symbol: i.symbol, name: i.name, quantity,
        avgPrice: quantity > 0 ? b / quantity : 0,
        lastPrice: Number(i.lastPrice),
        buyUsd: b, evalUsd: e, profitUsd: e - b, rate: b > 0 ? (e - b) / b * 100 : 0,
        evalKrw: e * rate, buyKrw: b * rate,
      })
    }))
    return [...map.values()]
  }, [data, rate])

  const sorted = useMemo(() => {
    const list = [...rows]
    list.sort((a, b) => {
      const x = a[sortKey]
      const y = b[sortKey]
      const c = typeof x === 'string' ? x.localeCompare(y as string, 'ko') : (x as number) - (y as number)
      return asc ? c : -c
    })
    return list
  }, [rows, sortKey, asc])

  const total = useMemo(() => {
    const buyUsd = rows.reduce((t, r) => t + r.buyUsd, 0)
    const evalUsd = rows.reduce((t, r) => t + r.evalUsd, 0)
    return {
      buyUsd, evalUsd, profitUsd: evalUsd - buyUsd, rate: buyUsd > 0 ? (evalUsd - buyUsd) / buyUsd * 100 : 0,
      buyKrw: buyUsd * rate, evalKrw: evalUsd * rate, profitKrw: (evalUsd - buyUsd) * rate,
    }
  }, [rows, rate])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setAsc((v) => !v)
    else { setSortKey(key); setAsc(key === 'name') }
  }

  const cards = [
    { label: '총매입금액', value: krw(total.buyKrw), sub: usd(total.buyUsd) },
    { label: '평가금액', value: krw(total.evalKrw), sub: usd(total.evalUsd) },
    { label: '평가손익', value: `${total.profitKrw > 0 ? '+' : ''}${Math.round(total.profitKrw).toLocaleString()}원`,
      sub: sgn(usd(Math.abs(total.profitUsd)), total.profitUsd), color: profitColor(total.profitKrw) },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <PublicIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>자산 조회 - 해외종목</Typography>
        <Box sx={{ flex: 1 }} />
        <Button size="small" startIcon={loading ? <CircularProgress size={14} /> : <RefreshIcon />} onClick={load} disabled={loading}>
          새로고침
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {data && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((c) => (
              <Grid item xs={12} sm={4} key={c.label}>
                <Card sx={{ borderTop: '3px solid #3b82f6', height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>{c.label}</Typography>
                      {c.label === '평가손익' && (
                        <Chip label={pct(total.rate)} size="small"
                          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700, color: '#fff', bgcolor: profitColor(total.rate) }} />
                      )}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: c.color }}>{c.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.sub}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                토스증권 해외 보유종목 {rows.length}개 · 적용 환율 {rate.toLocaleString()}원/USD (현재 환율, 원화 금액은 환산값)
              </Typography>
              {rows.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  해외 보유종목이 없습니다.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {COLUMNS.map((c) => (
                          <TableCell key={c.key} align={c.numeric ? 'right' : 'left'} sx={{ whiteSpace: 'nowrap' }}>
                            <TableSortLabel active={sortKey === c.key} direction={asc ? 'asc' : 'desc'} onClick={() => handleSort(c.key)}>
                              {c.label}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sorted.map((r) => (
                        <TableRow key={r.symbol} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{r.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{r.symbol}</Typography>
                          </TableCell>
                          <TableCell align="right">{r.quantity.toLocaleString()}</TableCell>
                          <TableCell align="right">{usd(r.avgPrice)}</TableCell>
                          <TableCell align="right">{usd(r.lastPrice)}</TableCell>
                          <TableCell align="right">{usd(r.buyUsd)}</TableCell>
                          <TableCell align="right">{usd(r.evalUsd)}</TableCell>
                          <TableCell align="right" sx={{ color: profitColor(r.profitUsd) }}>{sgn(usd(Math.abs(r.profitUsd)), r.profitUsd)}</TableCell>
                          <TableCell align="right" sx={{ color: profitColor(r.rate), fontWeight: 600 }}>{pct(r.rate)}</TableCell>
                          <TableCell align="right">{krw(r.evalKrw)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ '& td': { fontWeight: 700, borderTop: '2px solid rgba(255,255,255,0.2)' } }}>
                        <TableCell>합계</TableCell>
                        <TableCell /><TableCell /><TableCell />
                        <TableCell align="right">{usd(total.buyUsd)}</TableCell>
                        <TableCell align="right">{usd(total.evalUsd)}</TableCell>
                        <TableCell align="right" sx={{ color: profitColor(total.profitUsd) }}>{sgn(usd(Math.abs(total.profitUsd)), total.profitUsd)}</TableCell>
                        <TableCell align="right" sx={{ color: profitColor(total.rate) }}>{pct(total.rate)}</TableCell>
                        <TableCell align="right">{krw(total.evalKrw)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  )
}

import {
  Card, CardContent, Typography, Box, Table, TableBody,
  TableRow, TableCell, TableHead, TableSortLabel, IconButton, ToggleButton, ToggleButtonGroup,
  Tooltip, Chip, Button, Alert, Divider,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import { useState, useMemo } from 'react'
import type { AssetSummary, Holding, BrokerKey } from '../types'
import type { TossHoldingsData } from '../api'
import { BROKER_LABELS } from '../types'

interface Props {
  summary: AssetSummary | null
  loading: boolean
  onRefresh: () => void
  onAdd: () => void
  onEdit: (h: Holding) => void
  onDelete: (h: Holding) => void
  tossHoldings: TossHoldingsData | null
  tossLoading: boolean
  tossError: string
}

function fmt(num: number): string {
  return Math.round(num).toLocaleString()
}

function profitColor(v: number): string {
  if (v > 0) return '#ef4444'
  if (v < 0) return '#3b82f6'
  return '#94a3b8'
}

function formatDecimal(value: string | null | undefined): string {
  if (value == null || !/^-?\d+(\.\d+)?$/.test(value)) return '-'
  const [integer, fraction] = value.split('.')
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${fraction ? `.${fraction}` : ''}`
}

type SortKey = 'broker' | 'name' | 'quantity' | 'buy' | 'cur' | 'evalAmount' | 'profit' | 'rate'

interface Row {
  key: string
  broker: string
  brokerSub?: string
  name: string
  code: string
  quantity: number
  buy: number
  cur: number
  evalAmount: number
  profit: number
  rate: number
  buyTotal: number
  manual?: Holding
  live?: LiveHolding
}

type LiveHolding = TossHoldingsData['accounts'][number]['items'][number]

const HEADERS: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
  { key: 'broker', label: '증권사', align: 'left' },
  { key: 'name', label: '종목명', align: 'left' },
  { key: 'quantity', label: '수량', align: 'right' },
  { key: 'buy', label: '매수가', align: 'right' },
  { key: 'cur', label: '현재가', align: 'right' },
  { key: 'evalAmount', label: '평가금액', align: 'right' },
  { key: 'profit', label: '평가손익', align: 'right' },
  { key: 'rate', label: '수익률', align: 'right' },
]

export default function HoldingsTable({ summary, loading, onRefresh, onAdd, onEdit, onDelete, tossHoldings, tossLoading, tossError }: Props) {
  const [filter, setFilter] = useState<BrokerKey | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const rows: Row[] = useMemo(() => {
    const all: Row[] = []
    if (summary) {
      ;(['mirae', 'namuh', 'toss'] as BrokerKey[]).forEach((key) => {
        if (filter !== 'all' && filter !== key) return
        for (const h of summary.brokers[key]?.holdings ?? []) {
          all.push({
            key: `${h.broker}-${h.id}`, broker: BROKER_LABELS[h.broker], name: h.stock_name, code: h.stock_code,
            quantity: h.quantity, buy: h.avg_buy_price, cur: h.cur_prc, evalAmount: h.eval_amount,
            profit: h.profit_amount, rate: h.profit_rate, buyTotal: h.avg_buy_price * h.quantity, manual: h,
          })
        }
      })
    }
    if ((filter === 'all' || filter === 'toss') && tossHoldings) {
      const usd = Number(tossHoldings.exchange_rate)
      tossHoldings.accounts.forEach((account, index) => {
        for (const item of account.items) {
          const factor = item.currency === 'USD' ? usd : 1
          const evalKrw = Number(item.marketValue?.amount) * factor
          const buyKrw = Number(item.marketValue?.purchaseAmount) * factor
          const rate = Number(item.profitLoss?.rate) * 100
          all.push({
            key: `live-${account.account_seq}-${item.symbol}`, broker: '토스증권', brokerSub: `계좌 ${index + 1}`,
            name: item.name, code: item.symbol, quantity: Number(item.quantity),
            buy: Number(item.averagePurchasePrice) * factor, cur: Number(item.lastPrice) * factor,
            evalAmount: evalKrw, profit: evalKrw - buyKrw, rate, buyTotal: buyKrw, live: item,
          })
        }
      })
    }
    return all
  }, [summary, filter, tossHoldings])

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows
    const sign = sortDir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const x = a[sortKey]
      const y = b[sortKey]
      if (typeof x === 'string' && typeof y === 'string') return sign * x.localeCompare(y, 'ko-KR')
      const nx = Number(x)
      const ny = Number(y)
      if (!Number.isFinite(nx) && !Number.isFinite(ny)) return 0
      if (!Number.isFinite(nx)) return 1
      if (!Number.isFinite(ny)) return -1
      return sign * (nx - ny)
    })
  }, [rows, sortKey, sortDir])

  const totals = useMemo(() => {
    const buy = rows.reduce((sum, r) => sum + (Number.isFinite(r.buyTotal) ? r.buyTotal : 0), 0)
    const evaluation = rows.reduce((sum, r) => sum + (Number.isFinite(r.evalAmount) ? r.evalAmount : 0), 0)
    const profit = evaluation - buy
    return { buy, evaluation, profit, rate: buy > 0 ? (profit / buy) * 100 : 0 }
  }, [rows])

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" fontWeight={700}>보유 종목</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ToggleButtonGroup
              size="small"
              value={filter}
              exclusive
              onChange={(_, v) => v && setFilter(v)}
            >
              <ToggleButton value="all">전체</ToggleButton>
              <ToggleButton value="mirae">미래에셋</ToggleButton>
              <ToggleButton value="namuh">나무</ToggleButton>
              <ToggleButton value="toss">토스</ToggleButton>
            </ToggleButtonGroup>
            <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
              추가
            </Button>
            <Tooltip title="새로고침">
              <IconButton size="small" onClick={onRefresh} disabled={loading}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                {HEADERS.map((h) => (
                  <TableCell key={h.key} align={h.align} sortDirection={sortKey === h.key ? sortDir : false}>
                    <TableSortLabel
                      active={sortKey === h.key}
                      direction={sortKey === h.key ? sortDir : 'asc'}
                      onClick={() => handleSort(h.key)}
                    >
                      {h.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {loading ? '불러오는 중…' : '보유 종목이 없습니다. "추가" 버튼으로 등록하세요.'}
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows.map((r) => {
                  const h = r.manual
                  const live = r.live
                  const currency = live?.currency
                  return (
                    <TableRow key={r.key} hover>
                      <TableCell>
                        <Chip label={r.broker} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                        {r.brokerSub && <Typography variant="caption" display="block" color="text.secondary">{r.brokerSub}</Typography>}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{r.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.code}</Typography>
                      </TableCell>
                      {h ? (
                        <>
                          <TableCell align="right">{fmt(h.quantity)}</TableCell>
                          <TableCell align="right">{fmt(h.avg_buy_price)}</TableCell>
                          <TableCell align="right">{fmt(h.cur_prc)}</TableCell>
                          <TableCell align="right">{fmt(h.eval_amount)}</TableCell>
                          <TableCell align="right" sx={{ color: profitColor(h.profit_amount), fontWeight: 600 }}>
                            {h.profit_amount > 0 ? '+' : ''}{fmt(h.profit_amount)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: profitColor(h.profit_rate), fontWeight: 600 }}>
                            {h.profit_rate > 0 ? '+' : ''}{h.profit_rate.toFixed(2)}%
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => onEdit(h)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDelete(h)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </>
                      ) : live ? (
                        <>
                          <TableCell align="right">{formatDecimal(live.quantity)}</TableCell>
                          <TableCell align="right">{formatDecimal(live.averagePurchasePrice)} {currency}</TableCell>
                          <TableCell align="right">{formatDecimal(live.lastPrice)} {currency}</TableCell>
                          <TableCell align="right">{formatDecimal(live.marketValue?.amount)} {currency}</TableCell>
                          <TableCell align="right" sx={{ color: profitColor(Number(live.profitLoss?.amount)), fontWeight: 600 }}>{formatDecimal(live.profitLoss?.amount)} {currency}</TableCell>
                          <TableCell align="right" sx={{ color: profitColor(r.rate), fontWeight: 600 }}>{Number.isFinite(r.rate) ? `${r.rate.toFixed(2)}%` : '-'}</TableCell>
                          <TableCell align="center"><Typography variant="caption" color="text.secondary">계좌 연동</Typography></TableCell>
                        </>
                      ) : null}
                    </TableRow>
                  )
                })
              )}
              {sortedRows.length > 0 && (
                <TableRow sx={{ '& td': { fontWeight: 700, borderTop: '2px solid', borderColor: 'divider' } }}>
                  <TableCell colSpan={2}>
                    합계 ({filter === 'all' ? '전체' : BROKER_LABELS[filter]}, {sortedRows.length}종목, 원화 환산)
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">{fmt(totals.buy)}</TableCell>
                  <TableCell />
                  <TableCell align="right">{fmt(totals.evaluation)}</TableCell>
                  <TableCell align="right" sx={{ color: profitColor(totals.profit) }}>
                    {totals.profit > 0 ? '+' : ''}{fmt(totals.profit)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: profitColor(totals.rate) }}>
                    {totals.rate > 0 ? '+' : ''}{totals.rate.toFixed(2)}%
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {(filter === 'all' || filter === 'toss') && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>토스증권 계좌 보유종목</Typography>
              {tossLoading && <Typography variant="body2" color="text.secondary">조회 중...</Typography>}
            </Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              {tossHoldings ? `토스 계좌의 국내 종목 내역을 합계에 반영했습니다(해외 종목은 해외종목 메뉴). 수동 등록된 토스 내역은 중복을 막기 위해 제외됩니다.${tossHoldings.exchange_rate ? ` USD 환율: ${formatDecimal(tossHoldings.exchange_rate)}원.` : ''}` : '토스 계좌 조회 전에는 수동 등록된 토스 내역만 합계에 반영됩니다.'}
            </Alert>
            {tossError && <Alert severity="error" sx={{ mb: 2 }}>{tossError}</Alert>}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

import { useState, useEffect, useCallback } from 'react'
import {
  Card, CardContent, Box, Typography, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Tooltip, Chip, TableSortLabel,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import StarIcon from '@mui/icons-material/Star'
import { fetchWatchlistSummary, removeFromWatchlist } from '../api'
import type { WatchlistItem } from '../types'

interface WatchlistTableProps {
  onStockClick?: (code: string) => void
  refreshTrigger?: number  // 외부에서 새로고침 트리거
}

type NumericSortField =
  | 'cur_prc'
  | 'change_rate'
  | 'high_3m'
  | 'low_3m'
  | 'avg_buy_price'
  | 'avg_sell_price'
  | 'holding_qty'
  | 'evaluation_amount'
  | 'profit_rate'
  | 'profit_amount'
  | 'high_drop_rate'
  | 'low_rise_rate'
type SortField = 'stock_name' | NumericSortField
type SortDirection = 'asc' | 'desc'

const fmt = (v: number | null | undefined): string => {
  if (v == null || v === 0) return '-'
  return new Intl.NumberFormat('ko-KR').format(v)
}

const fmtRate = (v: number | null | undefined): string => {
  if (v == null) return '-'
  const sign = v > 0 ? '+' : ''
  return `${sign}${v.toFixed(2)}%`
}

/** 비율 값에 따른 색상 (상승=빨강, 하락=파랑) */
const rateColor = (v: number | null | undefined): string => {
  if (v == null || v === 0) return 'text.secondary'
  return v > 0 ? '#e11d48' : '#2563eb'
}

export default function WatchlistTable({ onStockClick, refreshTrigger }: WatchlistTableProps) {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const loadSummary = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWatchlistSummary()
      setItems(data.items)
    } catch (e) {
      setError(e instanceof Error ? e.message : '관심종목 조회 실패')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary, refreshTrigger])

  const handleDelete = async (stockCode: string) => {
    try {
      await removeFromWatchlist(stockCode)
      setItems((prev) => prev.filter((i) => i.stock_code !== stockCode))
    } catch {
      // silent
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')
      return
    }
    setSortField(field)
    setSortDirection('desc')
  }

  const sortedItems = sortField
    ? [...items].sort((first, second) => {
        if (sortField === 'stock_name') {
          const result = first.stock_name.localeCompare(second.stock_name, 'ko-KR')
          return sortDirection === 'asc' ? result : -result
        }

        const firstValue = sortField === 'change_rate' ? parseFloat(first.change_rate) : first[sortField]
        const secondValue = sortField === 'change_rate' ? parseFloat(second.change_rate) : second[sortField]
        if (firstValue == null && secondValue == null) return 0
        if (firstValue == null) return 1
        if (secondValue == null) return -1
        if (!Number.isFinite(firstValue) && !Number.isFinite(secondValue)) return 0
        if (!Number.isFinite(firstValue)) return 1
        if (!Number.isFinite(secondValue)) return -1
        return sortDirection === 'asc' ? firstValue - secondValue : secondValue - firstValue
      })
    : items

  const sortableHeader = (label: string, field: SortField) => (
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortDirection : 'desc'}
      onClick={() => handleSort(field)}
    >
      {label}
    </TableSortLabel>
  )

  if (!loading && items.length === 0 && !error) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#f59e0b', fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                관심종목 대시보드
              </Typography>
              <Chip label="0종목" size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            종목 검색 후 ★ 버튼으로 관심종목을 추가하세요
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ color: '#f59e0b', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              관심종목 대시보드
            </Typography>
            <Chip label={`${items.length}종목`} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
          </Box>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={loadSummary}
            disabled={loading}
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          >
            새로고침
          </Button>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1.5 }}>
              시세 데이터 로딩 중…
            </Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Typography variant="body2" color="error" sx={{ py: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Table */}
        {!loading && items.length > 0 && (
          <TableContainer>
            <Table size="small" sx={{ '& th, & td': { px: 1, py: 0.75, fontSize: '0.8rem', whiteSpace: 'nowrap' } }}>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'action.hover', borderBottom: '2px solid', borderColor: 'divider' } }}>
                  <TableCell>{sortableHeader('종목명', 'stock_name')}</TableCell>
                  <TableCell align="right">{sortableHeader('현재가', 'cur_prc')}</TableCell>
                  <TableCell align="right">{sortableHeader('등락률', 'change_rate')}</TableCell>
                  <TableCell align="right">{sortableHeader('3M 고가', 'high_3m')}</TableCell>
                  <TableCell align="right">{sortableHeader('3M 저가', 'low_3m')}</TableCell>
                  <TableCell align="right">{sortableHeader('매수가', 'avg_buy_price')}</TableCell>
                  <TableCell align="right">{sortableHeader('매도가', 'avg_sell_price')}</TableCell>
                  <TableCell align="right">{sortableHeader('잔여 주식', 'holding_qty')}</TableCell>
                  <TableCell align="right">{sortableHeader('총 평가금액', 'evaluation_amount')}</TableCell>
                  <TableCell align="right">{sortableHeader('수익률', 'profit_rate')}</TableCell>
                  <TableCell align="right">{sortableHeader('수익금', 'profit_amount')}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="3개월 최고가 대비 현재가 하락률" arrow>
                      {sortableHeader('고가대비↓', 'high_drop_rate')}
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="3개월 최저가 대비 현재가 상승률" arrow>
                      {sortableHeader('저가대비↑', 'low_rise_rate')}
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ width: 40 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedItems.map((item) => (
                  <TableRow
                    key={item.stock_code}
                    hover
                    sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                    onClick={() => onStockClick?.(item.stock_code)}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                          {item.stock_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                          {item.stock_code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {fmt(item.cur_prc)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: rateColor(parseFloat(item.change_rate)), fontWeight: 600, fontFamily: 'monospace' }}>
                      {fmtRate(parseFloat(item.change_rate))}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#e11d48', fontFamily: 'monospace' }}>
                      {fmt(item.high_3m)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#2563eb', fontFamily: 'monospace' }}>
                      {fmt(item.low_3m)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                      {fmt(item.avg_buy_price)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                      {fmt(item.avg_sell_price)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                      {item.holding_qty > 0 ? `${fmt(item.holding_qty)}주` : '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {fmt(item.evaluation_amount)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: rateColor(item.profit_rate), fontWeight: 600, fontFamily: 'monospace' }}>
                      {fmtRate(item.profit_rate)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: rateColor(item.profit_amount), fontWeight: 600, fontFamily: 'monospace' }}>
                      {item.profit_amount != null ? `${item.profit_amount > 0 ? '+' : ''}${fmt(item.profit_amount)}` : '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ color: rateColor(item.high_drop_rate), fontWeight: 600, fontFamily: 'monospace' }}>
                      {fmtRate(item.high_drop_rate)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: rateColor(item.low_rise_rate), fontWeight: 600, fontFamily: 'monospace' }}>
                      {fmtRate(item.low_rise_rate)}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.stock_code) }}
                        sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: 'error.main' } }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}

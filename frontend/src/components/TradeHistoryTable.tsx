import {
  Card, CardContent, Typography, Box, Chip, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody,
  Tooltip, Skeleton,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import HistoryIcon from '@mui/icons-material/History'
import type { Trade } from '../types'

interface Props {
  trades: Trade[]
  loading: boolean
  onEdit: (trade: Trade) => void
  onDelete: (id: number) => void
  onAddClick: () => void
}

const fmtN = (v: number) => new Intl.NumberFormat('ko-KR').format(v)

const fmtDate = (d: string) => {
  // YYYYMMDD → YYYY-MM-DD
  if (d?.length === 8) return `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`
  return d
}

export default function TradeHistoryTable({ trades, loading, onEdit, onDelete, onAddClick }: Props) {
  const buyCount  = trades.filter((t) => t.trade_type === '매수').length
  const sellCount = trades.filter((t) => t.trade_type === '매도').length

  const avgBuy = (() => {
    const buys = trades.filter((t) => t.trade_type === '매수')
    if (!buys.length) return null
    const totalAmt = buys.reduce((s, t) => s + t.amount, 0)
    const totalQty = buys.reduce((s, t) => s + t.quantity, 0)
    return totalQty > 0 ? Math.round(totalAmt / totalQty) : null
  })()

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
            <Typography variant="h6" fontWeight={700}>매매 이력</Typography>
            {!loading && trades.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                <Chip label={`매수 ${buyCount}`} size="small"
                  sx={{ bgcolor: '#fce7e7', color: '#e11d48', fontWeight: 700, fontSize: '0.72rem' }} />
                <Chip label={`매도 ${sellCount}`} size="small"
                  sx={{ bgcolor: '#e7effe', color: '#2563eb', fontWeight: 700, fontSize: '0.72rem' }} />
              </Box>
            )}
          </Box>
          <Tooltip title="매매 이력 추가">
            <IconButton size="small" onClick={onAddClick}
              sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' }, width: 32, height: 32 }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 매수 평균단가 요약 */}
        {avgBuy != null && (
          <Box sx={{
            display: 'flex', gap: 3, mb: 2, p: 1.5,
            bgcolor: '#fafafa', borderRadius: 1.5, border: '1px solid rgba(0,0,0,0.06)',
          }}>
            <Box>
              <Typography variant="caption" color="text.secondary">평균 매수단가</Typography>
              <Typography variant="body2" fontWeight={700} color="#e11d48">₩{fmtN(avgBuy)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">총 매수금액</Typography>
              <Typography variant="body2" fontWeight={700}>
                ₩{fmtN(trades.filter((t) => t.trade_type === '매수').reduce((s, t) => s + t.amount, 0))}
              </Typography>
            </Box>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 1 }} />)}
          </Box>
        ) : trades.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5, color: 'text.disabled' }}>
            <HistoryIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">매매 이력이 없습니다.</Typography>
            <Typography variant="caption">+ 버튼을 눌러 이력을 추가하세요.</Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow>
                  {['날짜', '구분', '수량', '단가', '금액', '주문번호', '메모', ''].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.72rem', whiteSpace: 'nowrap', py: 0.75 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{fmtDate(t.trade_date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={t.trade_type === '매수' ? '▲ 매수' : '▼ 매도'}
                        size="small"
                        sx={{
                          bgcolor: t.trade_type === '매수' ? '#fce7e7' : '#e7effe',
                          color: t.trade_type === '매수' ? '#e11d48' : '#2563eb',
                          fontWeight: 700, fontSize: '0.72rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', textAlign: 'right' }}>{fmtN(t.quantity)}주</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', textAlign: 'right' }}>₩{fmtN(t.price)}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', textAlign: 'right', fontWeight: 600 }}>₩{fmtN(t.amount)}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                      {t.order_no ?? '-'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary', maxWidth: 120,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.memo ?? ''}
                    </TableCell>
                    <TableCell sx={{ width: 72, whiteSpace: 'nowrap' }}>
                      <Tooltip title="수정">
                        <IconButton size="small" onClick={() => onEdit(t)}
                          sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton size="small" onClick={() => onDelete(t.id)}
                          sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

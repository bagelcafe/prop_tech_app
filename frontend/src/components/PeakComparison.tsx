import { useEffect, useState } from 'react'
import {
  Card, CardContent, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Alert,
} from '@mui/material'
import { fetchValueAt } from '../api'
import type { ValueAtDate } from '../api'
import type { AssetSummary, BrokerKey } from '../types'
import { BROKER_LABELS } from '../types'

interface Props {
  summary: AssetSummary | null
  date: string // 비교 기준일 (코스피 고점)
  startDate: string // 연초 기준일
}

function profitColor(v: number): string {
  if (v > 0) return '#ef4444'
  if (v < 0) return '#3b82f6'
  return '#94a3b8'
}

const won = (v: number) => `${Math.round(v).toLocaleString()}원`
const signed = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v).toLocaleString()}원`

export default function PeakComparison({ summary, date, startDate }: Props) {
  const [past, setPast] = useState<ValueAtDate | null>(null)
  const [start, setStart] = useState<ValueAtDate | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchValueAt(date).then(setPast).catch((e) => setError(e instanceof Error ? e.message : '조회 실패'))
    fetchValueAt(startDate).then(setStart).catch(() => setStart(null))
  }, [date, startDate])

  const keys: BrokerKey[] = ['mirae', 'namuh', 'toss']
  const rows: { label: string; start?: number; then: number; now: number; bold?: boolean }[] = past && summary ? [
    ...keys.map((k) => ({ label: BROKER_LABELS[k], start: start?.brokers[k], then: past.brokers[k], now: summary.brokers[k]?.total_eval_amount ?? 0 })),
    { label: '전체 합계', start: start?.total, then: past.total, now: summary.total.total_eval_amount, bold: true },
  ] : []

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          코스피 고점({date}) 대비 현재 자산
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          현재 보유종목을 {date} 종가로 평가한 금액과 현재 평가금액 비교
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {!error && !past && <Box sx={{ py: 3, textAlign: 'center' }}><CircularProgress size={24} /></Box>}
        {rows.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>구분</TableCell>
                <TableCell align="right">{startDate.slice(5).replace('-', '/')} 평가금액</TableCell>
                <TableCell align="right">{date} 평가금액</TableCell>
                <TableCell align="right">현재 평가금액</TableCell>
                <TableCell align="right">손익금액</TableCell>
                <TableCell align="right">손익률</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => {
                const diff = r.now - r.then
                const rate = r.then > 0 ? diff / r.then * 100 : 0
                const w = r.bold ? 700 : 400
                return (
                  <TableRow key={r.label}>
                    <TableCell sx={{ fontWeight: w }}>{r.label}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: w }}>{r.start == null ? '-' : won(r.start)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: w }}>{won(r.then)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: w }}>{won(r.now)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: w, color: profitColor(diff) }}>{signed(diff)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: w, color: profitColor(diff) }}>
                      {rate > 0 ? '+' : ''}{rate.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
        {past && past.missing.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            해당일 시세가 없어 제외된 종목: {past.missing.join(', ')}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

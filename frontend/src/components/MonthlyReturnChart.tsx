import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { fetchMonthlyReturns } from '../api'
import type { MonthlyReturnPoint } from '../api'

const LINES = [
  { key: 'portfolio', name: '내 포트폴리오', color: '#8b5cf6', width: 3 },
  { key: 'kospi', name: 'KOSPI', color: '#ef4444', width: 2 },
  { key: 'sp500', name: 'S&P500', color: '#10b981', width: 2 },
  { key: 'nasdaq', name: 'NASDAQ', color: '#3b82f6', width: 2 },
] as const

export default function MonthlyReturnChart() {
  const [series, setSeries] = useState<MonthlyReturnPoint[]>([])
  const [excluded, setExcluded] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMonthlyReturns()
      .then((d) => { setSeries(d.series); setExcluded(d.excluded) })
      .catch((e) => setError(e instanceof Error ? e.message : '조회 실패'))
      .finally(() => setLoading(false))
  }, [])

  const data = series.map((p, i) => ({ ...p, label: i === series.length - 1 ? '현재' : p.date.slice(5) }))

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>월초 기준 수익률 비교</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          1월 2일 종가 대비, 매월 1일 기준 수익률. 포트폴리오는 현재 보유종목의 평가금액(휴장 시 직전 종가, 미국 종목은 현재 환율) 기준, 지수는 해당일 시가(휴장 시 다음 거래일 시가, 현재는 최신 종가) 기준.
        </Typography>
        {loading && <Box sx={{ py: 5, textAlign: 'center' }}><CircularProgress size={24} /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v, name) => [typeof v === 'number' ? `${v > 0 ? '+' : ''}${v.toFixed(2)}%` : '-', name]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ''}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#94a3b8" />
              {LINES.map((l) => (
                <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color}
                  strokeWidth={l.width} dot={{ r: 3 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {excluded.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            1월 2일 시세가 없어(이후 상장) 제외된 종목: {excluded.join(', ')}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

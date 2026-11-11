import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { TossCandle } from '../api'

const VISIBLE_DAYS = 120
const BB_PERIOD = 20
const BB_MULTIPLIER = 2

interface Point {
  date: string
  close: number
  ma5: number | null
  ma20: number | null
  ma60: number | null
  bbUpper: number | null
  bbLower: number | null
  band: [number, number] | null
}

function movingAverage(values: number[], index: number, period: number): number | null {
  if (index + 1 < period) return null
  let sum = 0
  for (let i = index - period + 1; i <= index; i++) sum += values[i]
  return sum / period
}

export function buildPoints(candles: TossCandle[]): Point[] {
  const closes = candles.map((c) => Number(c.close))
  return candles.map((c, i) => {
    const ma20 = movingAverage(closes, i, BB_PERIOD)
    let bbUpper: number | null = null
    let bbLower: number | null = null
    if (ma20 != null) {
      let variance = 0
      for (let j = i - BB_PERIOD + 1; j <= i; j++) variance += (closes[j] - ma20) ** 2
      const std = Math.sqrt(variance / BB_PERIOD)
      bbUpper = ma20 + BB_MULTIPLIER * std
      bbLower = ma20 - BB_MULTIPLIER * std
    }
    return {
      date: c.date,
      close: closes[i],
      ma5: movingAverage(closes, i, 5),
      ma20,
      ma60: movingAverage(closes, i, 60),
      bbUpper,
      bbLower,
      band: bbUpper != null && bbLower != null ? [bbLower, bbUpper] : null,
    }
  })
}

function fmt(v: number | null | undefined, currency: string): string {
  if (v == null) return '-'
  return `${v.toLocaleString('ko-KR', { maximumFractionDigits: currency === 'USD' ? 2 : 0 })}`
}

export default function StockPriceChart({ candles, currency }: { candles: TossCandle[]; currency: string }) {
  const data = useMemo(() => buildPoints(candles).slice(-VISIBLE_DAYS), [candles])
  const last = data[data.length - 1]

  if (data.length === 0) {
    return <Typography variant="body2" color="text.secondary">차트 데이터가 없습니다.</Typography>
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ color: '#f59e0b' }}>MA5 {fmt(last.ma5, currency)}</Typography>
        <Typography variant="caption" sx={{ color: '#10b981' }}>MA20 {fmt(last.ma20, currency)}</Typography>
        <Typography variant="caption" sx={{ color: '#a855f7' }}>MA60 {fmt(last.ma60, currency)}</Typography>
        <Typography variant="caption" color="text.secondary">
          볼린저밴드(20, 2σ) 상단 {fmt(last.bbUpper, currency)} / 하단 {fmt(last.bbLower, currency)}
        </Typography>
      </Stack>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={40} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} width={72} tickFormatter={(v: number) => fmt(v, currency)} />
          <Tooltip formatter={(value: unknown) => (Array.isArray(value) ? value.map((v) => fmt(v, currency)).join(' ~ ') : fmt(Number(value), currency))} />
          <Legend />
          <Area type="monotone" dataKey="band" name="볼린저밴드" stroke="none" fill="#64748b" fillOpacity={0.18} connectNulls isAnimationActive={false} />
          <Line type="monotone" dataKey="bbUpper" name="BB 상단" stroke="#94a3b8" strokeDasharray="4 3" dot={false} strokeWidth={1} isAnimationActive={false} />
          <Line type="monotone" dataKey="bbLower" name="BB 하단" stroke="#94a3b8" strokeDasharray="4 3" dot={false} strokeWidth={1} isAnimationActive={false} />
          <Line type="monotone" dataKey="close" name="종가" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive={false} />
          <Line type="monotone" dataKey="ma5" name="MA5" stroke="#f59e0b" dot={false} strokeWidth={1.5} isAnimationActive={false} />
          <Line type="monotone" dataKey="ma20" name="MA20" stroke="#10b981" dot={false} strokeWidth={1.5} isAnimationActive={false} />
          <Line type="monotone" dataKey="ma60" name="MA60" stroke="#a855f7" dot={false} strokeWidth={1.5} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  )
}

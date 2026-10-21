import { useMemo } from 'react'
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { TradeItem } from '../types'

interface Props {
  aptName: string
  data: TradeItem[]
  onClose: () => void
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4']

function formatPrice(num: number): string {
  if (num >= 10000) {
    const eok = Math.floor(num / 10000)
    const man = num % 10000
    return `${eok}억${man > 0 ? ` ${man.toLocaleString()}` : ''}`
  }
  return `${num.toLocaleString()}만원`
}

export default function PriceChart({ aptName, data, onClose }: Props) {
  const { chartData, pyungGroups } = useMemo(() => {
    // Group by pyung
    const groups: Record<string, Record<string, number>> = {}
    const dates = new Set<string>()

    data.forEach((item) => {
      if (!item.date || !item.price_num) return
      const key = `${item.pyung}평`
      dates.add(item.date)
      if (!groups[key]) groups[key] = {}
      // If multiple on same date, keep latest (or average)
      if (!groups[key][item.date] || item.price_num > groups[key][item.date]) {
        groups[key][item.date] = item.price_num
      }
    })

    const sortedDates = Array.from(dates).sort()
    const pyungGroups = Object.keys(groups).sort((a, b) => parseFloat(a) - parseFloat(b))

    const chartData = sortedDates.map((date) => {
      const row: Record<string, string | number> = { date }
      pyungGroups.forEach((key) => {
        if (groups[key][date] !== undefined) row[key] = groups[key][date]
      })
      return row
    })

    return { chartData, pyungGroups }
  }, [data])

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            가격 추이 · {aptName}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 10000).toFixed(1)}억`}
              width={55}
            />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8 }}
              labelStyle={{ color: '#94a3b8', fontSize: 12 }}
              formatter={(value: number) => [formatPrice(value), '']}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
              iconType="circle"
              iconSize={8}
            />
            {pyungGroups.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 4, fill: COLORS[idx % COLORS.length] }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

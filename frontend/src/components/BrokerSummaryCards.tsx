import { Card, CardContent, Typography, Box, Grid, Chip } from '@mui/material'
import type { AssetSummary, BrokerKey } from '../types'
import { BROKER_LABELS } from '../types'

interface Props {
  summary: AssetSummary | null
}

const BROKER_COLORS: Record<BrokerKey, string> = {
  mirae: '#f59e0b', // 미래에셋 - 주황
  namuh: '#10b981', // 나무 - 초록
  toss: '#3b82f6',  // 토스 - 파랑
}

function formatKRW(num: number): string {
  return `${Math.round(num).toLocaleString()}원`
}

// 수익(+)=빨강, 손실(−)=파랑 (키움 컨벤션)
function profitColor(v: number): string {
  if (v > 0) return '#ef4444'
  if (v < 0) return '#3b82f6'
  return '#94a3b8'
}

function signed(v: number): string {
  const sign = v > 0 ? '+' : ''
  return `${sign}${Math.round(v).toLocaleString()}`
}

interface CardData {
  label: string
  accent: string
  buy: number
  eval: number
  profit: number
  rate: number
}

export default function BrokerSummaryCards({ summary }: Props) {
  if (!summary) return null

  const brokerKeys: BrokerKey[] = ['mirae', 'namuh', 'toss']
  const cards: CardData[] = brokerKeys.map((key) => ({
    label: BROKER_LABELS[key],
    accent: BROKER_COLORS[key],
    buy: summary.brokers[key]?.total_buy_amount ?? 0,
    eval: summary.brokers[key]?.total_eval_amount ?? 0,
    profit: summary.brokers[key]?.total_profit_amount ?? 0,
    rate: summary.brokers[key]?.total_profit_rate ?? 0,
  }))

  cards.push({
    label: '전체 합계',
    accent: '#8b5cf6',
    buy: summary.total.total_buy_amount,
    eval: summary.total.total_eval_amount,
    profit: summary.total.total_profit_amount,
    rate: summary.total.total_profit_rate,
  })

  return (
    <Grid container spacing={2}>
      {cards.map((c) => (
        <Grid item xs={12} sm={6} md={3} key={c.label}>
          <Card sx={{ borderTop: `3px solid ${c.accent}`, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>{c.label}</Typography>
                <Chip
                  label={`${c.rate > 0 ? '+' : ''}${c.rate.toFixed(2)}%`}
                  size="small"
                  sx={{
                    height: 22, fontSize: '0.72rem', fontWeight: 700,
                    color: '#fff', bgcolor: profitColor(c.rate),
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">총매입금액</Typography>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                {formatKRW(c.buy)}
              </Typography>
              <Typography variant="caption" color="text.secondary">평가금액</Typography>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                {formatKRW(c.eval)}
              </Typography>
              <Typography variant="caption" color="text.secondary">평가손익 ({c.rate > 0 ? '+' : ''}{c.rate.toFixed(2)}%)</Typography>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: profitColor(c.profit) }}>
                {signed(c.profit)}원
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import type { TossCandle } from '../api'

interface Trade {
  price: string
  volume: string
  timestamp: string
  currency: string
}

type Status = 'connecting' | 'live' | 'error' | 'closed'

const MAX_RECENT = 10

function num(value: string, currency: string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return n.toLocaleString('ko-KR', { maximumFractionDigits: currency === 'USD' ? 4 : 0 })
}

export default function RealtimePrice({ symbol, currency, candles }: { symbol: string; currency: string; candles: TossCandle[] }) {
  const [status, setStatus] = useState<Status>('connecting')
  const [detail, setDetail] = useState('')
  const [trades, setTrades] = useState<Trade[]>([])
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const lastPrice = useRef<number | null>(null)

  useEffect(() => {
    const market = currency === 'KRW' ? 'kr' : 'us'
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    let closedByUs = false
    let retry = 0
    let timer: number | undefined
    let ws: WebSocket | null = null

    setTrades([])
    lastPrice.current = null
    setStatus('connecting')

    const connect = () => {
      ws = new WebSocket(`${protocol}://${window.location.host}/api/toss/ws/trades/${market}/${encodeURIComponent(symbol)}`)
      ws.onopen = () => { retry = 0 }
      ws.onmessage = (event) => {
        let msg: { type: string; status?: Status; detail?: string } & Partial<Trade>
        try { msg = JSON.parse(event.data) } catch { return }
        if (msg.type === 'status' && msg.status) {
          setStatus(msg.status)
          setDetail(msg.detail ?? '')
        } else if (msg.type === 'trade' && msg.price && msg.timestamp) {
          const price = Number(msg.price)
          if (lastPrice.current != null && price !== lastPrice.current) {
            setFlash(price > lastPrice.current ? 'up' : 'down')
          }
          lastPrice.current = price
          const trade = { price: msg.price, volume: msg.volume ?? '', timestamp: msg.timestamp, currency: msg.currency ?? currency }
          setTrades((prev) => [trade, ...prev].slice(0, MAX_RECENT))
        }
      }
      ws.onclose = () => {
        if (closedByUs) return
        setStatus('closed')
        retry += 1
        timer = window.setTimeout(connect, Math.min(30000, 1000 * 2 ** Math.min(retry, 5)))
      }
    }
    connect()
    return () => {
      closedByUs = true
      window.clearTimeout(timer)
      ws?.close()
    }
  }, [symbol, currency])

  useEffect(() => {
    if (!flash) return
    const timer = window.setTimeout(() => setFlash(null), 400)
    return () => window.clearTimeout(timer)
  }, [flash, trades])

  const latest = trades[0]
  const latestPrice = latest ? Number(latest.price) : null
  const tradeDate = latest?.timestamp.slice(0, 10)
  const reference = tradeDate ? [...candles].reverse().find((c) => c.date < tradeDate) : undefined
  const refClose = reference ? Number(reference.close) : null
  const change = latestPrice != null && refClose ? latestPrice - refClose : null
  const changeRate = change != null && refClose ? (change / refClose) * 100 : null
  const color = change == null || change === 0 ? 'text.primary' : change > 0 ? '#ef4444' : '#3b82f6'
  const statusLabel = { connecting: '연결 중', live: '실시간', error: '오류', closed: '재연결 중' }[status]
  const statusColor = status === 'live' ? 'success' : status === 'error' ? 'error' : 'default'

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Chip size="small" label={statusLabel} color={statusColor} variant={status === 'live' ? 'filled' : 'outlined'} />
        {detail && <Typography variant="caption" color="text.secondary">{detail}</Typography>}
      </Stack>
      {!latest ? (
        <Typography variant="body2" color="text.secondary">
          {status === 'live' ? '체결을 기다리는 중입니다. 장이 열려 있지 않으면 갱신되지 않습니다.' : '실시간 시세에 연결하는 중입니다.'}
        </Typography>
      ) : (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color, transition: 'background-color 0.3s', bgcolor: flash === 'up' ? 'rgba(239,68,68,0.2)' : flash === 'down' ? 'rgba(59,130,246,0.2)' : 'transparent', px: 0.5, borderRadius: 1, display: 'inline-block' }}
            >
              {num(latest.price, latest.currency)} <Typography component="span" variant="body2">{latest.currency}</Typography>
            </Typography>
            {change != null && changeRate != null && (
              <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
                전일 대비 {change > 0 ? '+' : ''}{num(String(change), latest.currency)} ({changeRate > 0 ? '+' : ''}{changeRate.toFixed(2)}%)
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">최근 체결 {new Date(latest.timestamp).toLocaleTimeString('ko-KR')}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant="caption" color="text.secondary">최근 체결 내역</Typography>
            {trades.map((t, i) => (
              <Stack key={`${t.timestamp}-${i}`} direction="row" justifyContent="space-between" sx={{ fontSize: '0.8rem', opacity: 1 - i * 0.07 }}>
                <span>{new Date(t.timestamp).toLocaleTimeString('ko-KR')}</span>
                <span>{num(t.price, t.currency)}</span>
                <span>{num(t.volume, t.currency)}주</span>
              </Stack>
            ))}
          </Box>
        </Stack>
      )}
    </Box>
  )
}

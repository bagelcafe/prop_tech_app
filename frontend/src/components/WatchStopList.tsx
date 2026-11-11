import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, FormControlLabel, Paper, Stack, Switch, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ShieldIcon from '@mui/icons-material/Shield'
import {
  fetchTossWatchlist, fetchBotStops, fetchBotPendingConfirms, registerBotStop,
  confirmBotStop, rejectBotStop, cancelBotStop, haltBot, resumeBot,
} from '../api'
import type { TossWatchItem, BotStop, BotState } from '../api'

const WARN_NEAR_RATE = 0.03
type WsStatus = 'connecting' | 'live' | 'error' | 'closed'
type Alertness = 'triggered' | 'near' | 'safe'

function toNum(v: string | null | undefined): number | null {
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
function fmtKRW(v: number | null): string {
  return v == null ? '-' : v.toLocaleString('ko-KR', { maximumFractionDigits: 0 })
}
function assess(price: number | null, stop: number | null): Alertness {
  if (price == null || stop == null) return 'safe'
  if (price <= stop) return 'triggered'
  if (price <= stop * (1 + WARN_NEAR_RATE)) return 'near'
  return 'safe'
}

const STATE_LABEL: Record<BotState, string> = {
  PENDING: '초기화', ARMED: '감시 준비', TRAILING: '추적 중', AWAITING_CONFIRM: '승인 대기',
  TRIGGERED: '매도 집행', DONE: '완료', HALTED: '정지', CANCELLED: '해제됨',
}
const STATE_COLOR: Record<BotState, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  PENDING: 'default', ARMED: 'info', TRAILING: 'primary', AWAITING_CONFIRM: 'warning',
  TRIGGERED: 'error', DONE: 'success', HALTED: 'error', CANCELLED: 'default',
}
const ACTIVE_STATES: BotState[] = ['PENDING', 'ARMED', 'TRAILING', 'AWAITING_CONFIRM']

function useRealtimePrice(symbol: string, market: 'kr' | 'us') {
  const [price, setPrice] = useState<number | null>(null)
  const [status, setStatus] = useState<WsStatus>('connecting')
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    let closedByUs = false
    let retry = 0
    let timer: number | undefined
    let ws: WebSocket | null = null
    setStatus('connecting'); setPrice(null)
    const connect = () => {
      ws = new WebSocket(`${protocol}://${window.location.host}/api/toss/ws/trades/${market}/${encodeURIComponent(symbol)}`)
      ws.onopen = () => { retry = 0 }
      ws.onmessage = (event) => {
        let msg: { type: string; status?: WsStatus; price?: string }
        try { msg = JSON.parse(event.data) } catch { return }
        if (msg.type === 'status' && msg.status) setStatus(msg.status)
        else if (msg.type === 'trade' && msg.price) {
          const p = Number(msg.price)
          if (Number.isFinite(p)) setPrice(p)
        }
      }
      ws.onclose = () => {
        if (closedByUs) return
        setStatus('closed'); retry += 1
        timer = window.setTimeout(connect, Math.min(30000, 1000 * 2 ** Math.min(retry, 5)))
      }
    }
    connect()
    return () => { closedByUs = true; window.clearTimeout(timer); ws?.close() }
  }, [symbol, market])
  return { price, status }
}

interface RowProps {
  item: TossWatchItem
  bot?: BotStop
  busy: boolean
  onAlert: (symbol: string, level: Alertness) => void
  onRegister: (item: TossWatchItem) => void
  onCancel: (bot: BotStop) => void
}

function WatchRow({ item, bot, busy, onAlert, onRegister, onCancel }: RowProps) {
  const market = item.currency === 'USD' ? 'us' : 'kr'
  const { price: livePrice, status } = useRealtimePrice(item.symbol, market)
  const price = livePrice ?? toNum(item.lastPrice)
  const peak = toNum(item.peak)
  const stop = toNum(item.stop)
  const level = assess(price, stop)
  const dropFromPeak = price != null && peak ? ((price - peak) / peak) * 100 : null
  useEffect(() => { onAlert(item.symbol, level) }, [item.symbol, level, onAlert])

  const rowBg = level === 'triggered' ? 'rgba(239,68,68,0.14)' : level === 'near' ? 'rgba(245,158,11,0.12)' : 'transparent'
  const statusLabel = { connecting: '연결 중', live: '실시간', error: '오류', closed: '재연결' }[status]
  const botActive = bot && ACTIVE_STATES.includes(bot.state)

  return (
    <TableRow sx={{ bgcolor: rowBg }}>
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={700}>{item.name}</Typography>
          <Typography variant="caption" color="text.secondary">{item.symbol}</Typography>
          {level === 'triggered' && <Chip size="small" color="error" icon={<WarningAmberIcon />} label="손절 도달" />}
          {level === 'near' && <Chip size="small" color="warning" icon={<WarningAmberIcon />} label="손절 임박" />}
        </Stack>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight={700}>{fmtKRW(price)}</Typography>
        <Chip size="small" variant="outlined" label={statusLabel}
          color={status === 'live' ? 'success' : status === 'error' ? 'error' : 'default'} sx={{ height: 18, fontSize: '0.65rem' }} />
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2">{fmtKRW(peak)}</Typography>
        {item.peakDate && <Typography variant="caption" color="text.secondary">{item.peakDate}</Typography>}
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight={700} sx={{ color: '#ef4444' }}>{fmtKRW(stop)}</Typography>
        <Typography variant="caption" color="text.secondary">-{(Number(item.trailRate) * 100).toFixed(0)}%</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" sx={{ color: dropFromPeak != null && dropFromPeak < 0 ? '#3b82f6' : 'text.primary' }}>
          {dropFromPeak == null ? '-' : `${dropFromPeak > 0 ? '+' : ''}${dropFromPeak.toFixed(2)}%`}
        </Typography>
      </TableCell>
      <TableCell align="center">
        {bot ? (
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
            <Chip size="small" color={STATE_COLOR[bot.state]} label={STATE_LABEL[bot.state]} />
            {Number(bot.dry_run) === 1 && <Chip size="small" variant="outlined" label="모의" sx={{ height: 18, fontSize: '0.6rem' }} />}
          </Stack>
        ) : (
          <Typography variant="caption" color="text.secondary">미보호</Typography>
        )}
      </TableCell>
      <TableCell align="center">
        {botActive ? (
          <Button size="small" color="inherit" variant="outlined" disabled={busy} onClick={() => bot && onCancel(bot)}>해제</Button>
        ) : (
          <Button size="small" variant="contained" startIcon={<ShieldIcon />} disabled={busy || stop == null} onClick={() => onRegister(item)}>보호 시작</Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default function WatchStopList() {
  const [items, setItems] = useState<TossWatchItem[]>([])
  const [bots, setBots] = useState<BotStop[]>([])
  const [pending, setPending] = useState<BotStop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [alerts, setAlerts] = useState<Record<string, Alertness>>({})
  const [regTarget, setRegTarget] = useState<TossWatchItem | null>(null)
  const [regQty, setRegQty] = useState('1')
  const [regDryRun, setRegDryRun] = useState(true)
  const [halted, setHalted] = useState(false)
  const timerRef = useRef<number | undefined>(undefined)

  const refreshBots = useCallback(async () => {
    try {
      const [stops, confirms] = await Promise.all([fetchBotStops(), fetchBotPendingConfirms()])
      setBots(stops.items)
      setPending(confirms.items)
      setHalted(stops.items.some((b) => b.state === 'HALTED'))
    } catch (err) {
      setError(err instanceof Error ? err.message : '봇 상태 조회에 실패했습니다.')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchTossWatchlist()
        if (!cancelled) setItems(data.items)
        await refreshBots()
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : '감시종목 조회에 실패했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    // 승인 대기/상태는 주기적으로 폴링 (노티 채널)
    timerRef.current = window.setInterval(() => { void refreshBots() }, 15000)
    return () => { cancelled = true; window.clearInterval(timerRef.current) }
  }, [refreshBots])

  const handleAlert = useCallback((symbol: string, level: Alertness) =>
    setAlerts((prev) => (prev[symbol] === level ? prev : { ...prev, [symbol]: level })), [])

  const botBySymbol = (symbol: string) =>
    bots.find((b) => b.symbol === symbol && ACTIVE_STATES.includes(b.state)) ??
    bots.find((b) => b.symbol === symbol)

  async function withBusy<T>(fn: () => Promise<T>, okMsg: string) {
    setBusy(true); setError(''); setNotice('')
    try {
      await fn()
      await refreshBots()
      setNotice(okMsg)
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청에 실패했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const openRegister = (item: TossWatchItem) => { setRegTarget(item); setRegQty('1'); setRegDryRun(true) }

  const submitRegister = () =>
    withBusy(async () => {
      if (!regTarget) return
      const res = await registerBotStop({
        account_seq: 1, symbol: regTarget.symbol, quantity: regQty, name: regTarget.name, dry_run: regDryRun,
      })
      setRegTarget(null)
      if (res.state === 'AWAITING_CONFIRM') setNotice(`${regTarget.name}: 이미 손절가 이하입니다. 승인 대기로 등록되었습니다.`)
    }, '보호가 등록되었습니다.')

  const triggered = items.filter((i) => alerts[i.symbol] === 'triggered')
  const near = items.filter((i) => alerts[i.symbol] === 'near')

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 1, boxShadow: 'none' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }} flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>매도 보호 감시종목</Typography>
          <Typography variant="caption" color="text.secondary">최근 120일 고점 대비 -15% 손절 감시 · 실시간(웹소켓) · 국내 전용</Typography>
        </Box>
        <Button size="small" color={halted ? 'success' : 'error'} variant="outlined" disabled={busy}
          onClick={() => withBusy(async () => { await (halted ? resumeBot() : haltBot()) }, halted ? '봇을 재개했습니다.' : '봇을 긴급정지했습니다.')}>
          {halted ? '봇 재개' : '긴급정지'}
        </Button>
      </Stack>

      {/* 노티 채널: 승인 대기 — 등록 즉시 손절가 이하였던 종목의 매도 집행 승인 */}
      {pending.map((p) => (
        <Alert key={p.id} severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 1 }}
          action={
            <Stack direction="row" spacing={1}>
              <Button color="error" size="small" variant="contained" disabled={busy}
                onClick={() => withBusy(() => confirmBotStop(p.id), `${p.name ?? p.symbol} 매도를 집행했습니다.`)}>승인(매도)</Button>
              <Button color="inherit" size="small" disabled={busy}
                onClick={() => withBusy(() => rejectBotStop(p.id), '승인을 거절했습니다.')}>거절</Button>
            </Stack>
          }>
          <strong>{p.name ?? p.symbol}</strong> 손절가({fmtKRW(toNum(p.stop_price))}) 이하입니다. 매도 집행을 승인하시겠습니까?
          {Number(p.dry_run) === 1 && ' (모의 모드)'}
        </Alert>
      ))}

      {triggered.length > 0 && (
        <Alert severity="error" icon={<WarningAmberIcon />} sx={{ mb: 1 }}>
          손절 감시가 도달: {triggered.map((i) => i.name).join(', ')}
        </Alert>
      )}
      {near.length > 0 && (
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 1 }}>
          손절 감시가 임박: {near.map((i) => i.name).join(', ')}
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setNotice('')}>{notice}</Alert>}

      {loading ? (
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} aria-label="감시종목 조회 중" /></Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>종목</TableCell>
              <TableCell align="right">현재가</TableCell>
              <TableCell align="right">이전 최고가(120일)</TableCell>
              <TableCell align="right">매도 감시가</TableCell>
              <TableCell align="right">고점대비</TableCell>
              <TableCell align="center">보호 상태</TableCell>
              <TableCell align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <WatchRow key={item.symbol} item={item} bot={botBySymbol(item.symbol)} busy={busy}
                onAlert={handleAlert} onRegister={openRegister} onCancel={(b) =>
                  withBusy(() => cancelBotStop(b.id), '보호를 해제했습니다.')} />
            ))}
            {items.length === 0 && !error && (
              <TableRow><TableCell colSpan={7}><Typography variant="body2" color="text.secondary">감시 중인 종목이 없습니다.</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* 보호 등록 다이얼로그 */}
      <Dialog open={regTarget != null} onClose={() => !busy && setRegTarget(null)}>
        <DialogTitle>매도 보호 시작 — {regTarget?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            최근 120일 고점({fmtKRW(toNum(regTarget?.peak ?? null))}) 대비 -15% 손절 감시가
            <strong> {fmtKRW(toNum(regTarget?.stop ?? null))}원</strong>에 도달하면 시장가 매도합니다.
          </DialogContentText>
          <TextField label="수량(주)" size="small" fullWidth value={regQty}
            onChange={(e) => setRegQty(e.target.value.replace(/[^\d.]/g, ''))}
            error={!/^\d+(\.\d+)?$/.test(regQty)} helperText={!/^\d+(\.\d+)?$/.test(regQty) ? '숫자만 입력하세요.' : ' '} />
          <FormControlLabel sx={{ mt: 1 }}
            control={<Switch checked={regDryRun} onChange={(e) => setRegDryRun(e.target.checked)} />}
            label={regDryRun ? '모의 모드 (실주문 없음)' : '실주문 모드 — 실제 매도 집행됨'} />
          {!regDryRun && <Alert severity="error" sx={{ mt: 1 }}>실주문 모드는 실제로 매도 주문을 집행합니다. 서버의 BOT_DRY_RUN 설정도 함께 꺼져 있어야 합니다.</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegTarget(null)} disabled={busy}>취소</Button>
          <Button variant="contained" onClick={submitRegister} disabled={busy || !/^\d+(\.\d+)?$/.test(regQty)}>등록</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

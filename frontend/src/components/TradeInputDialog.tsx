import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, ToggleButton, ToggleButtonGroup,
  Box, Typography, Divider, Alert, CircularProgress,
  IconButton, Tooltip,
} from '@mui/material'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import CloseIcon from '@mui/icons-material/Close'
import type { TradeInput } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  defaultStockCode?: string
  defaultStockName?: string
  onSaved: () => void
  onAdd: (trade: TradeInput) => Promise<void>
  onSaveResult?: (ok: boolean, message: string) => void
}

// ── SMS 텍스트 파서 ──────────────────────────────────────────────────────────
function parseSmsText(text: string): Partial<TradeInput> {
  const extract = (pattern: RegExp) => text.match(pattern)?.[1]?.trim() ?? ''

  // 오늘 날짜를 기본값으로
  const today = new Date()
  const trade_date = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`

  // ── 공통 필드 ──────────────────────────────────────────────────────

  // 체결수량 (공통)
  const qtyStr = extract(/체결수량\s*:\s*([\d,]+)/)
  const quantity = parseInt(qtyStr.replace(/,/g, '')) || 0

  // 체결단가 (공통)
  const priceStr = extract(/체결단가\s*:\s*([\d,]+)/)
  const price = parseInt(priceStr.replace(/,/g, '')) || 0

  // 체결금액 (없으면 수량×단가로 계산)
  const amtStr = extract(/체결금액\s*:\s*([\d,]+)/)
  const amount = parseInt(amtStr.replace(/,/g, '')) || (quantity * price)

  // 주문번호 (공통)
  const order_no = extract(/주문번호\s*:\s*(\S+)/)

  // ── 매매 구분 ──────────────────────────────────────────────────────
  // 미래에셋: "매매구분 : 매수"  |  NH: "[NH투자증권] 매수 주문체결" or "체결종류 : 매수 전량체결"
  const tradeTypeRaw =
    extract(/매매구분\s*:\s*(\S+)/) ||
    extract(/체결종류\s*:\s*(\S+)/) ||
    (text.match(/\]\s*(매수|매도)/) ? text.match(/\]\s*(매수|매도)/)![1] : '')
  const trade_type: '매수' | '매도' = tradeTypeRaw.includes('매도') ? '매도' : '매수'

  // ── 종목명 / 종목코드 ───────────────────────────────────────────────
  let stock_code = ''
  let stock_name = ''

  // NH: "종목코드 : 064350" (별도 필드)
  const nhCode = extract(/종목코드\s*:\s*(\d{6})/)
  if (nhCode) {
    stock_code = nhCode
    // NH: "종 목 명 : 현대로템" (공백 포함 가능)
    stock_name = extract(/종\s*목\s*명\s*:\s*(.+)/)
  } else {
    // 미래에셋: "종목명 : LS ELECTRIC(A010120)"
    const stockRaw = extract(/종목명\s*:\s*(.+)/)
    const codeMatch = stockRaw.match(/\(A?(\d{6})\)/)
    stock_code = codeMatch ? codeMatch[1] : ''
    stock_name = stockRaw.replace(/\([^)]+\)/, '').trim()
  }

  // ── 계좌 정보 (미래에셋에만 존재) ──────────────────────────────────
  const account_no   = extract(/계좌번호\s*:\s*(\S+)/)
  const account_name = extract(/계좌명\s*:\s*(.+)/)

  return { stock_code, stock_name, trade_type, quantity, price, amount, order_no, account_no, account_name, trade_date }
}

const EMPTY: TradeInput = {
  stock_code: '', stock_name: '', trade_type: '매수',
  quantity: 0, price: 0, amount: 0,
  order_no: '', account_no: '', account_name: '',
  trade_date: '',
  memo: '',
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

export default function TradeInputDialog({ open, onClose, defaultStockCode, defaultStockName, onSaved, onAdd, onSaveResult }: Props) {
  const [smsText, setSmsText] = useState('')
  const [form, setForm] = useState<TradeInput>({ ...EMPTY, trade_date: todayStr() })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 종목 정보를 기본값으로 채우기
  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        stock_code: defaultStockCode ?? prev.stock_code,
        stock_name: defaultStockName ?? prev.stock_name,
        trade_date: todayStr(),
      }))
      setSmsText('')
      setError(null)
    }
  }, [open, defaultStockCode, defaultStockName])

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      amount: Number(prev.quantity || 0) * Number(prev.price || 0),
    }))
  }, [form.quantity, form.price])

  const handleParseSms = () => {
    const parsed = parseSmsText(smsText)
    setForm((prev) => ({ ...prev, ...parsed }))
  }

  const set = (field: keyof TradeInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSave = async () => {
    if (!form.stock_code) { setError('종목코드를 입력하세요.'); return }
    if (!form.quantity || !form.price) { setError('수량과 단가를 입력하세요.'); return }
    if (!form.trade_date || form.trade_date.length !== 8) { setError('날짜를 YYYYMMDD 형식으로 입력하세요.'); return }

    setSaving(true); setError(null)
    try {
      await onAdd({
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        amount: Number(form.amount) || Number(form.quantity) * Number(form.price),
      })
      onSaved()
      onSaveResult?.(true, '매매 이력이 저장되었습니다.')
      onClose()
      setForm({ ...EMPTY, trade_date: todayStr() })
      setSmsText('')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '저장 실패'
      setError(msg)
      onSaveResult?.(false, `저장 실패: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const fmtDateInput = (v: string) => {
    // YYYYMMDD → YYYY-MM-DD (표시용)
    if (v.length === 8) return `${v.substring(0, 4)}-${v.substring(4, 6)}-${v.substring(6, 8)}`
    return v
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>매매 이력 추가</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* SMS 파서 */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
            📱 증권사 SMS 붙여넣기 (자동 파싱)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              size="small" multiline rows={3} fullWidth
              placeholder={'[미래에셋증권] 전량체결\n계좌번호 : 210-22-****108\n종목명 : LS ELECTRIC(A010120)\n매매구분 : 매수\n체결수량 : 1주\n체결단가 : 211,500원\n체결금액 : 211,500원\n주문번호 : 188475'}
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.75rem' } }}
            />
            <Tooltip title="파싱하기">
              <Button
                variant="outlined" size="small" onClick={handleParseSms}
                disabled={!smsText.trim()}
                startIcon={<ContentPasteIcon fontSize="small" />}
                sx={{ mt: 0.5, whiteSpace: 'nowrap', minWidth: 90 }}
              >
                자동 입력
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* 수동 입력 폼 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 매수/매도 */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              매매 구분 *
            </Typography>
            <ToggleButtonGroup
              value={form.trade_type}
              exclusive
              onChange={(_, v) => v && setForm((p) => ({ ...p, trade_type: v }))}
              size="small"
            >
              <ToggleButton value="매수" sx={{
                px: 3, fontWeight: 700,
                '&.Mui-selected': { bgcolor: '#fce7e7', color: '#e11d48', borderColor: '#e11d48' },
              }}>
                ▲ 매수
              </ToggleButton>
              <ToggleButton value="매도" sx={{
                px: 3, fontWeight: 700,
                '&.Mui-selected': { bgcolor: '#e7effe', color: '#2563eb', borderColor: '#2563eb' },
              }}>
                ▼ 매도
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* 종목 */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField size="small" label="종목코드 *" value={form.stock_code} onChange={set('stock_code')}
              sx={{ width: 130 }} inputProps={{ style: { fontFamily: 'monospace' } }} />
            <TextField size="small" label="종목명 *" value={form.stock_name} onChange={set('stock_name')} sx={{ flex: 1 }} />
          </Box>

          {/* 수량/단가/금액 */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField size="small" label="체결수량 *" type="number" value={form.quantity || ''} onChange={set('quantity')} sx={{ flex: 1 }} />
            <TextField size="small" label="체결단가 *" type="number" value={form.price || ''} onChange={set('price')} sx={{ flex: 1 }} />
            <TextField size="small" label="체결금액" type="number" value={form.amount || ''} InputProps={{ readOnly: true }} sx={{ flex: 1 }} />
          </Box>

          {/* 날짜/주문번호 */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              size="small" label="체결일 (YYYYMMDD) *" value={form.trade_date} onChange={set('trade_date')}
              sx={{ flex: 1 }} helperText={form.trade_date.length === 8 ? fmtDateInput(form.trade_date) : '8자리 숫자'}
            />
            <TextField size="small" label="주문번호" value={form.order_no ?? ''} onChange={set('order_no')} sx={{ flex: 1 }} />
          </Box>

          {/* 계좌 정보 */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField size="small" label="계좌번호" value={form.account_no ?? ''} onChange={set('account_no')} sx={{ flex: 1 }} />
            <TextField size="small" label="계좌명" value={form.account_name ?? ''} onChange={set('account_name')} sx={{ flex: 1 }} />
          </Box>

          {/* 메모 */}
          <TextField size="small" label="메모" value={form.memo ?? ''} onChange={set('memo')} fullWidth multiline rows={2} />
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={saving}>취소</Button>
        <Button
          variant="contained" onClick={handleSave} disabled={saving}
          startIcon={saving ? <CircularProgress size={16} /> : null}
          sx={{
            bgcolor: form.trade_type === '매수' ? '#e11d48' : '#2563eb',
            '&:hover': { bgcolor: form.trade_type === '매수' ? '#be123c' : '#1d4ed8' },
          }}
        >
          {saving ? '저장 중…' : `${form.trade_type} 이력 저장`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

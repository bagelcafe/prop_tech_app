import { useEffect, useMemo, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Alert, CircularProgress,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { Trade, TradeUpdateInput } from '../types'

interface Props {
  open: boolean
  trade: Trade | null
  onClose: () => void
  onSaved: () => void
  onUpdate: (id: number, payload: TradeUpdateInput) => Promise<void>
  onSaveResult?: (ok: boolean, message: string) => void
}

const fmtN = (v: number) => new Intl.NumberFormat('ko-KR').format(v)

export default function TradeEditDialog({ open, trade, onClose, onSaved, onUpdate, onSaveResult }: Props) {
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [tradeDate, setTradeDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !trade) return
    setQuantity(String(trade.quantity))
    setPrice(String(trade.price))
    setTradeDate(trade.trade_date)
    setError(null)
  }, [open, trade])

  const amountPreview = useMemo(() => {
    const q = Number(quantity)
    const p = Number(price)
    if (!q || !p) return 0
    return q * p
  }, [quantity, price])

  const handleSave = async () => {
    if (!trade) return
    const q = Number(quantity)
    const p = Number(price)
    if (!q || q <= 0) { setError('매수 수량을 올바르게 입력하세요.'); return }
    if (!p || p <= 0) { setError('매수가를 올바르게 입력하세요.'); return }
    if (!tradeDate || tradeDate.length !== 8) { setError('날짜를 YYYYMMDD 형식으로 입력하세요.'); return }

    setSaving(true)
    setError(null)
    try {
      await onUpdate(trade.id, {
        quantity: q,
        price: p,
        amount: q * p,
        trade_date: tradeDate,
      })
      onSaved()
      onSaveResult?.(true, '매매 이력이 수정되었습니다.')
      onClose()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '수정 실패'
      setError(msg)
      onSaveResult?.(false, `수정 실패: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>매매 이력 수정</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {trade?.stock_name} ({trade?.stock_code})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            size="small"
            label="매수 수량"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            size="small"
            label="매수가"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            size="small"
            label="체결일 (YYYYMMDD)"
            value={tradeDate}
            onChange={(e) => setTradeDate(e.target.value)}
          />
          <TextField
            size="small"
            label="체결금액"
            value={amountPreview ? `₩${fmtN(amountPreview)}` : ''}
            InputProps={{ readOnly: true }}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={saving}>취소</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} /> : null}
        >
          {saving ? '저장 중…' : '수정 저장'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
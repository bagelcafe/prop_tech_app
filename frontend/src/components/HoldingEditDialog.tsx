import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, ToggleButton, ToggleButtonGroup,
  Box, Typography, Autocomplete, CircularProgress, Alert,
} from '@mui/material'
import type { BrokerKey, Holding, HoldingInput, StockSearchResult } from '../types'
import { searchTossStocks, upsertHolding, updateHolding } from '../api'

interface Props {
  open: boolean
  onClose: () => void
  editTarget: Holding | null  // null이면 신규 추가
  onSaved: () => void
}

const BROKERS: { key: BrokerKey; label: string }[] = [
  { key: 'mirae', label: '미래에셋' },
  { key: 'namuh', label: '나무' },
  { key: 'toss', label: '토스' },
]

export default function HoldingEditDialog({ open, onClose, editTarget, onSaved }: Props) {
  const isEdit = !!editTarget

  const [broker, setBroker] = useState<BrokerKey>('mirae')
  const [stockCode, setStockCode] = useState('')
  const [stockName, setStockName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [avgBuyPrice, setAvgBuyPrice] = useState('')

  const [options, setOptions] = useState<StockSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setError('')
    if (editTarget) {
      setBroker(editTarget.broker)
      setStockCode(editTarget.stock_code)
      setStockName(editTarget.stock_name)
      setQuantity(String(editTarget.quantity))
      setAvgBuyPrice(String(editTarget.avg_buy_price))
    } else {
      setBroker('mirae')
      setStockCode('')
      setStockName('')
      setQuantity('')
      setAvgBuyPrice('')
      setOptions([])
    }
  }, [open, editTarget])

  const handleSearch = async (query: string) => {
    if (!query || query.length < 1) { setOptions([]); return }
    setSearching(true)
    try {
      const results = await searchTossStocks(query, 'kr')
      setOptions(results.map((r) => ({ stk_cd: r.symbol, stk_nm: r.name })))
    } catch {
      setOptions([])
    } finally {
      setSearching(false)
    }
  }

  const handleSave = async () => {
    setError('')
    const qty = parseInt(quantity.replace(/,/g, ''), 10)
    const price = parseFloat(avgBuyPrice.replace(/,/g, ''))

    if (!stockCode || !stockName) { setError('종목을 선택하세요.'); return }
    if (!qty || qty <= 0) { setError('수량은 0보다 커야 합니다.'); return }
    if (!price || price <= 0) { setError('매수가는 0보다 커야 합니다.'); return }

    setSaving(true)
    try {
      if (isEdit && editTarget) {
        await updateHolding(editTarget.id, { quantity: qty, avg_buy_price: price })
      } else {
        const payload: HoldingInput = {
          broker, stock_code: stockCode, stock_name: stockName,
          quantity: qty, avg_buy_price: price,
        }
        await upsertHolding(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? '보유 종목 수정' : '보유 종목 추가'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>증권사</Typography>
            <ToggleButtonGroup
              size="small"
              value={broker}
              exclusive
              onChange={(_, v) => v && setBroker(v)}
              disabled={isEdit}
              fullWidth
            >
              {BROKERS.map((b) => (
                <ToggleButton key={b.key} value={b.key}>{b.label}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {isEdit ? (
            <TextField label="종목" value={`${stockName} (${stockCode})`} size="small" disabled fullWidth />
          ) : (
            <Autocomplete
              options={options}
              getOptionLabel={(o) => `${o.stk_nm} (${o.stk_cd})`}
              loading={searching}
              onInputChange={(_, value) => handleSearch(value)}
              onChange={(_, value) => {
                setStockCode(value?.stk_cd ?? '')
                setStockName(value?.stk_nm ?? '')
              }}
              isOptionEqualToValue={(o, v) => o.stk_cd === v.stk_cd}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="종목 검색"
                  size="small"
                  placeholder="종목명 입력"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searching ? <CircularProgress size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}

          <TextField
            label="수량"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            size="small"
            type="number"
            fullWidth
          />
          <TextField
            label="매수 평균가"
            value={avgBuyPrice}
            onChange={(e) => setAvgBuyPrice(e.target.value)}
            size="small"
            type="number"
            fullWidth
          />

          {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>취소</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? '저장 중…' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

import { useState, useEffect, useCallback } from 'react'
import {
  Container, Box, Typography, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import BrokerSummaryCards from '../components/BrokerSummaryCards'
import HoldingsTable from '../components/HoldingsTable'
import HoldingEditDialog from '../components/HoldingEditDialog'
import AssetTrendChart from '../components/AssetTrendChart'
import CumulativeAssetChart from '../components/CumulativeAssetChart'
import PeakComparison from '../components/PeakComparison'
import MonthlyReturnChart from '../components/MonthlyReturnChart'
import { fetchAssetSummary, fetchAssetTrend, fetchTossHoldings, deleteHolding } from '../api'
import type { TossHoldingsData, TossHolding } from '../api'
import type { AssetSummary, AssetTrendPoint, Holding } from '../types'

export default function AssetsPage() {
  const [summary, setSummary] = useState<AssetSummary | null>(null)
  const [trend, setTrend] = useState<AssetTrendPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [tossHoldings, setTossHoldings] = useState<TossHoldingsData | null>(null)
  const [tossLoading, setTossLoading] = useState(false)
  const [tossError, setTossError] = useState('')
  const [toast, setToast] = useState<{ msg: string; sev: 'success' | 'error' } | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Holding | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Holding | null>(null)

  const loadSummary = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAssetSummary()
      setSummary(data)
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : '요약 조회 실패', sev: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTrend = useCallback(async () => {
    try {
      const data = await fetchAssetTrend(30)
      setTrend(data.series)
    } catch {
      /* 추이 데이터 없음은 조용히 무시 */
    }
  }, [])

  const loadTossHoldings = useCallback(async () => {
    setTossLoading(true)
    setTossError('')
    try {
      setTossHoldings(await fetchTossHoldings())
    } catch (e) {
      setTossHoldings(null)
      setTossError(e instanceof Error ? e.message : '토스 보유종목 조회 실패')
    } finally {
      setTossLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummary()
    loadTrend()
    loadTossHoldings()
  }, [loadSummary, loadTrend, loadTossHoldings])

  const handleAdd = () => { setEditTarget(null); setDialogOpen(true) }
  const handleEdit = (h: Holding) => { setEditTarget(h); setDialogOpen(true) }
  const handleSaved = () => {
    setToast({ msg: '저장되었습니다.', sev: 'success' })
    loadSummary()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteHolding(deleteTarget.id)
      setToast({ msg: '삭제되었습니다.', sev: 'success' })
      loadSummary()
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : '삭제 실패', sev: 'error' })
    } finally {
      setDeleteTarget(null)
    }
  }

  // 국내 페이지는 토스 보유종목 중 KRW 종목만 반영 (해외 종목은 해외종목 메뉴)
  const domesticToss: TossHoldingsData | null = tossHoldings ? (() => {
    const accounts = tossHoldings.accounts.map((a) => ({ ...a, items: a.items.filter((i) => i.currency === 'KRW') }))
    const sum = (f: (i: TossHolding) => string) =>
      accounts.reduce((t, a) => t + a.items.reduce((u, i) => u + Number(f(i)), 0), 0)
    return {
      accounts,
      exchange_rate: null,
      total_buy_krw: String(sum((i) => i.marketValue.purchaseAmount)),
      total_eval_krw: String(sum((i) => i.marketValue.amount)),
    }
  })() : null

  const withToss = (toss: TossHoldingsData | null) => summary && toss ? (() => {
    const buy = Number(toss.total_buy_krw)
    const evaluation = Number(toss.total_eval_krw)
    const profit = evaluation - buy
    const totalBuy = summary.total.total_buy_amount - summary.brokers.toss.total_buy_amount + buy
    const totalEval = summary.total.total_eval_amount - summary.brokers.toss.total_eval_amount + evaluation
    return {
      brokers: {
        ...summary.brokers,
        toss: { ...summary.brokers.toss, holdings: [], total_buy_amount: buy, total_eval_amount: evaluation,
          total_profit_amount: profit, total_profit_rate: buy > 0 ? profit / buy * 100 : 0 },
      },
      total: { total_buy_amount: totalBuy, total_eval_amount: totalEval, total_profit_amount: totalEval - totalBuy,
        total_profit_rate: totalBuy > 0 ? (totalEval - totalBuy) / totalBuy * 100 : 0 },
    }
  })() : summary

  // 국내 종목만(카드/표) vs 국내+해외 전체(추이·비교 차트)
  const displaySummary = withToss(domesticToss)
  const fullSummary = withToss(tossHoldings)

  // 오늘 추이 지점은 상단 합계와 동일한 실시간 값으로 맞춘다
  const displayTrend: AssetTrendPoint[] = (() => {
    if (!fullSummary || trend.length === 0) return trend
    const d = new Date()
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const live: AssetTrendPoint = {
      date: today,
      mirae: Math.round(fullSummary.brokers.mirae.total_eval_amount),
      namuh: Math.round(fullSummary.brokers.namuh.total_eval_amount),
      toss: Math.round(fullSummary.brokers.toss.total_eval_amount),
      total: Math.round(fullSummary.total.total_eval_amount),
    }
    const last = trend[trend.length - 1]
    if (last.date > today) return trend
    return last.date === today ? [...trend.slice(0, -1), live] : [...trend, live]
  })()

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <AccountBalanceWalletIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>자산 조회 - 국내종목</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <BrokerSummaryCards summary={displaySummary} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <HoldingsTable
          summary={displaySummary}
          loading={loading || tossLoading}
          onRefresh={() => { void loadSummary(); void loadTossHoldings() }}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={(h) => setDeleteTarget(h)}
          tossHoldings={domesticToss}
          tossLoading={tossLoading}
          tossError={tossError}
        />
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        위 카드/보유종목은 국내 종목 기준입니다. 아래 추이·비교 차트는 해외 종목을 포함한 전체 자산 기준입니다.
      </Alert>

      <Box sx={{ mb: 3 }}>
        <AssetTrendChart series={displayTrend} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <CumulativeAssetChart series={displayTrend} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <PeakComparison summary={fullSummary} date="2026-06-19" startDate="2026-01-02" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <MonthlyReturnChart />
      </Box>

      <HoldingEditDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editTarget={editTarget}
        onSaved={handleSaved}
      />

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>보유 종목 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTarget?.stock_name} ({deleteTarget?.stock_code}) 보유 내역을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>취소</Button>
          <Button color="error" onClick={confirmDelete}>삭제</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? <Alert severity={toast.sev} onClose={() => setToast(null)}>{toast.msg}</Alert> : undefined}
      </Snackbar>
    </Container>
  )
}

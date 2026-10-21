import { useState } from 'react'
import {
  Container, Box, Typography, Button, Grid,
  ToggleButtonGroup, ToggleButton, Card, CardContent,
  CardActionArea, Chip, Divider, Fade, Alert, Snackbar,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ApartmentIcon from '@mui/icons-material/Apartment'
import AutocompleteInput from '../components/AutocompleteInput'
import PriceChart from '../components/PriceChart'
import { searchRegions, fetchTradeData } from '../api'
import type { TradeItem, RegionOption } from '../types'

function formatPriceNum(num: number): string {
  if (num >= 10000) {
    const eok = Math.floor(num / 10000)
    const man = num % 10000
    return `${eok}억${man > 0 ? ` ${man.toLocaleString()}` : ''}`
  }
  return `${num.toLocaleString()}만원`
}

export default function RealEstatePage() {
  const [selectedRegion, setSelectedRegion] = useState<RegionOption | null>(null)
  const [txnType, setTxnType] = useState<'all' | 'sale' | 'jeonse'>('all')
  const [startMonth, setStartMonth] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [endMonth, setEndMonth] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [trades, setTrades] = useState<TradeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chartApt, setChartApt] = useState<string | null>(null)

  const handleRegionSelectFull = (region: RegionOption) => {
    setSelectedRegion(region)
    doSearch(region, txnType, startMonth, endMonth)
  }

  const doSearch = async (
    region: RegionOption,
    type: 'all' | 'sale' | 'jeonse',
    start: string,
    end: string,
  ) => {
    setLoading(true)
    setError(null)
    setChartApt(null)
    try {
      const data = await fetchTradeData(
        region.code,
        region.dong_name || null,
        type,
        start.replace('-', ''),
        end.replace('-', ''),
      )
      setTrades(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '데이터 조회에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!selectedRegion) { setError('지역을 먼저 선택하세요.'); return }
    doSearch(selectedRegion, txnType, startMonth, endMonth)
  }

  const typeColorMap: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning'> = {
    '매매': 'primary', '전세': 'success', '월세': 'warning',
  }

  const chartData = chartApt ? trades.filter(t => t.apt_name === chartApt && t.price_num > 0) : []

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <ApartmentIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4">국토부 아파트 실거래가</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          국토교통부 공공데이터 기반 매매 · 전세 실거래 조회
        </Typography>
      </Box>

      {/* Search Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={5}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                지역 검색
              </Typography>
              <AutocompleteInput
                placeholder="예: 삼성동, 여의도동"
                fetchSuggestions={async (q) => {
                  const results = await searchRegions(q)
                  return results.map((r) => ({ label: r.label, value: r.code, extra: r.dong_name }))
                }}
                onSelect={(value, label, extra) => {
                  const region = { code: value, label, dong_name: extra ?? '' }
                  handleRegionSelectFull(region)
                }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                거래 유형
              </Typography>
              <ToggleButtonGroup
                value={txnType}
                exclusive
                onChange={(_, v) => { if (v) setTxnType(v) }}
                size="small"
                fullWidth
              >
                <ToggleButton value="all">전체</ToggleButton>
                <ToggleButton value="sale">매매</ToggleButton>
                <ToggleButton value="jeonse">전세</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                시작 월
              </Typography>
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 8,
                  border: '1px solid rgba(148,163,184,0.3)',
                  background: '#1e293b', color: '#f1f5f9', fontSize: '0.875rem',
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                종료 월
              </Typography>
              <input
                type="month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 8,
                  border: '1px solid rgba(148,163,184,0.3)',
                  background: '#1e293b', color: '#f1f5f9', fontSize: '0.875rem',
                }}
              />
            </Grid>

            <Grid item xs={12} md="auto">
              <Button
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={loading || !selectedRegion}
                sx={{ height: 42, minWidth: 100 }}
              >
                {loading ? '조회 중…' : '검색'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Chart */}
      {chartApt && chartData.length > 0 && (
        <Fade in>
          <Box sx={{ mb: 3 }}>
            <PriceChart aptName={chartApt} data={chartData} onClose={() => setChartApt(null)} />
          </Box>
        </Fade>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">시장 데이터를 불러오는 중…</Typography>
        </Box>
      )}

      {/* Results */}
      {!loading && trades.length > 0 && (
        <Fade in>
          <Grid container spacing={2}>
            {trades.map((item, idx) => (
              <Grid item xs={12} sm={6} lg={4} key={idx}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea onClick={() => setChartApt(item.apt_name)} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>
                        {item.apt_name}
                      </Typography>
                      <Chip
                        label={item.type}
                        size="small"
                        color={typeColorMap[item.type] ?? 'default'}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Typography variant="h6" color="primary.light" fontWeight={800} sx={{ mb: 1.5 }}>
                      {item.price_num > 0 ? formatPriceNum(item.price_num) : item.price}
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    <Grid container spacing={0.5}>
                      {[
                        ['동', item.dong],
                        ['면적', `${item.area}㎡ (${item.pyung}평)`],
                        ['층', `${item.floor}층`],
                        ['날짜', item.date],
                        ['건축년도', item.build_year],
                      ].map(([label, value]) => (
                        <Grid item xs={6} key={label}>
                          <Typography variant="caption" color="text.disabled">{label}</Typography>
                          <Typography variant="body2" fontSize="0.8rem">{value}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      {/* Empty state */}
      {!loading && trades.length === 0 && !error && (
        <Box
          sx={{
            textAlign: 'center', py: 10,
            border: '2px dashed', borderColor: 'divider', borderRadius: 3,
          }}
        >
          <ApartmentIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
          <Typography variant="h6" color="text.secondary">
            지역을 검색하고 실거래가를 확인하세요
          </Typography>
        </Box>
      )}

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Container>
  )
}

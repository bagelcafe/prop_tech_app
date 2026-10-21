import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert, Box, Button, Card, CardContent, CircularProgress, Container,
  FormControl, InputLabel, MenuItem, Select, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { fetchConditions, searchCondition } from '../api'
import type { ConditionSearchItem, KiwoomCondition } from '../types'

const formatNumber = (value: string) => {
  const number = Number(value)
  return Number.isFinite(number) ? Math.abs(number).toLocaleString('ko-KR') : '-'
}

export default function ConditionSearchPage() {
  const navigate = useNavigate()
  const [conditions, setConditions] = useState<KiwoomCondition[]>([])
  const [selectedCondition, setSelectedCondition] = useState('')
  const [items, setItems] = useState<ConditionSearchItem[]>([])
  const [conditionsLoading, setConditionsLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadConditions = async () => {
    setConditionsLoading(true)
    try {
      const result = await fetchConditions()
      setConditions(result)
      setSelectedCondition((current) => current || result[0]?.seq || '')
    } catch (error) {
      setError(error instanceof Error ? error.message : '조건식 목록을 불러오지 못했습니다.')
    } finally {
      setConditionsLoading(false)
    }
  }

  useEffect(() => { void loadConditions() }, [])

  const runSearch = async () => {
    if (!selectedCondition) return
    setSearchLoading(true)
    try {
      setItems(await searchCondition(selectedCondition))
    } catch (error) {
      setError(error instanceof Error ? error.message : '조건검색에 실패했습니다.')
      setItems([])
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <ManageSearchIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4">조건 검색</Typography>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        영웅문에서 저장한 조건식을 실행하여 현재 편입 종목을 조회합니다.
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <FormControl size="small" sx={{ minWidth: 280, flex: 1, maxWidth: 560 }}>
              <InputLabel id="condition-select-label">저장된 조건식</InputLabel>
              <Select
                labelId="condition-select-label"
                label="저장된 조건식"
                value={selectedCondition}
                onChange={(event) => setSelectedCondition(event.target.value)}
                disabled={conditionsLoading}
              >
                {conditions.map((condition) => (
                  <MenuItem key={condition.seq} value={condition.seq}>
                    {condition.name} ({condition.seq})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={loadConditions} disabled={conditionsLoading} startIcon={conditionsLoading ? <CircularProgress size={16} /> : <RefreshIcon />}>
              조건식 새로고침
            </Button>
            <Button variant="contained" onClick={runSearch} disabled={!selectedCondition || searchLoading} startIcon={searchLoading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}>
              조건검색 실행
            </Button>
          </Box>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <TableContainer component={Card} sx={{ mt: 3 }}>
          <Table>
            <TableHead><TableRow><TableCell>종목</TableCell><TableCell align="right">현재가</TableCell><TableCell align="right">등락률</TableCell><TableCell align="right">거래량</TableCell></TableRow></TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.stock_code} hover onClick={() => navigate(`/kiwoom?code=${encodeURIComponent(item.stock_code)}`)} sx={{ cursor: 'pointer' }}>
                  <TableCell><Typography fontWeight={600}>{item.stock_name}</Typography><Typography variant="caption" color="text.secondary">{item.stock_code}</Typography></TableCell>
                  <TableCell align="right">{formatNumber(item.current_price)}</TableCell>
                  <TableCell align="right">{item.change_rate}%</TableCell>
                  <TableCell align="right">{formatNumber(item.volume)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!conditionsLoading && conditions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}><Typography color="text.secondary">영웅문에서 저장한 조건식이 없습니다.</Typography></Box>
      )}
      {!searchLoading && selectedCondition && items.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}><Typography color="text.secondary">조건식을 선택한 뒤 검색을 실행하세요.</Typography></Box>
      )}

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Container>
  )
}
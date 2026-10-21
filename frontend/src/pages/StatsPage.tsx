import { useState, useEffect } from 'react'
import {
  Container, Box, Typography, Button, Card, CardContent,
  Grid, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
} from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchStats } from '../api'
import type { StatsData } from '../types'

function todayStr(offset = 0) {
  const d = new Date(); d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(() => todayStr(-6))
  const [endDate, setEndDate] = useState(() => todayStr())

  const load = async (start: string, end: string) => {
    setLoading(true)
    try { setData(await fetchStats(start, end)) } finally { setLoading(false) }
  }

  useEffect(() => { load(startDate, endDate) }, [])

  const getTodayVisitors = () => {
    if (!data) return 0

    // 1. history(stats.json 기반)에서 오늘 데이터 우선 사용
    const today = new Date().toISOString().slice(0, 10)
    const todayRecord = data.history?.find((h) => h.date === today)
    if (todayRecord) return todayRecord.visitors

    // 2. fallback: today_logs(로그 파일 기반)
    if (data.today_logs && data.today_logs.length > 0) {
      return new Set(data.today_logs.map((l) => l.ip)).size
    }

    return 0
  }

  const uniqueIPs = getTodayVisitors()

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <BarChartIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4">사용자 접속 통계</Typography>
          <Typography variant="body1" color="text.secondary">서버 로그 기반 실시간 접속 현황</Typography>
        </Box>
      </Box>

      {/* Date filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>시작일</Typography>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.3)', background: '#1e293b', color: '#f1f5f9', fontSize: '0.875rem' }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>종료일</Typography>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.3)', background: '#1e293b', color: '#f1f5f9', fontSize: '0.875rem' }} />
            </Box>
            <Button variant="contained" startIcon={<RefreshIcon />}
              onClick={() => load(startDate, endDate)} disabled={loading}>
              조회
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: '오늘 방문자 수', value: uniqueIPs.toLocaleString(), color: 'primary.main' },
          { label: '누적 방문자', value: data ? data.summary.total_visitors.toLocaleString() : '-', color: 'secondary.main' },
          { label: '누적 API 호출', value: data ? data.summary.total_requests.toLocaleString() : '-', color: 'success.main' },
        ].map(({ label, value, color }) => (
          <Grid item xs={12} sm={4} key={label}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{label}</Typography>
                <Typography variant="h4" sx={{ color, fontWeight: 800 }}>{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      {data && data.history.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { title: '일별 방문자 수 (명)', dataKey: 'visitors', color: '#3b82f6' },
            { title: '일별 API 호출 수 (건)', dataKey: 'requests', color: '#8b5cf6' },
          ].map(({ title, dataKey, color }) => (
            <Grid item xs={12} md={6} key={title}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={2}>{title}</Typography>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data.history} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8 }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                      <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Log table */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>오늘 접속 로그</Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['시간', 'IP', '요청 경로', '상태'].map((h) => (
                    <TableCell key={h} sx={{ bgcolor: 'background.paper', fontWeight: 700, fontSize: '0.8rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.today_logs && data.today_logs.length > 0 ? (
                  [...data.today_logs].reverse().map((log, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{log.time}</TableCell>
                      <TableCell sx={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{log.ip}</TableCell>
                      <TableCell sx={{ fontSize: '0.78rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.url}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          color={log.status < 400 ? 'success' : log.status < 500 ? 'warning' : 'error'}
                          sx={{ fontSize: '0.72rem', height: 20 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                      {loading ? '로딩 중…' : '오늘 로그가 없습니다.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}

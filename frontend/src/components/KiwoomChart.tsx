import { useMemo, useState, useCallback, useRef } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Customized,
  BarChart, Bar, Cell,
} from 'recharts'
import type { ChartCandle, Trade } from '../types'

interface Props { data: ChartCandle[]; stockName?: string; isUp?: boolean; trades?: Trade[] }

const parseDate = (dt: string) => {
  if (!dt || dt.length < 8) return dt
  return `${dt.substring(4, 6)}/${dt.substring(6, 8)}`
}

function calcMA(prices: number[], period: number): (number | null)[] {
  return prices.map((_, i) => {
    if (i < period - 1) return null
    const slice = prices.slice(i - period + 1, i + 1)
    return Math.round(slice.reduce((s, v) => s + v, 0) / period)
  })
}

const MA_DEFS = [
  { key: 'ma5',   label: 'MA5',   color: '#ef4444' },
  { key: 'ma20',  label: 'MA20',  color: '#22c55e' },
  { key: 'ma120', label: 'MA120', color: '#a855f7' },
]

interface CandleRow {
  date: string; close: number; open: number; high: number; low: number
  volume: number; ma5: number | null; ma20: number | null; ma120: number | null
}

// ── recharts 내부 좌표를 캡처하는 타입 ────────────────────────────────
interface AxisScale {
  scale: ((v: string | number) => number) & { bandwidth?: () => number }
}

interface ChartCoords {
  xAxisMap: Record<string, AxisScale>
  yAxisMap: Record<string, AxisScale>
  offset: { left: number; top: number; width: number; height: number }
}

// ── 캔들스틱 커스텀 레이어 ──────────────────────────────────────────────
function CandlestickLayer({ xAxisMap, yAxisMap, data }: {
  xAxisMap?: Record<string, AxisScale>
  yAxisMap?: Record<string, AxisScale>
  data: CandleRow[]
}) {
  const xAxis = xAxisMap && Object.values(xAxisMap)[0]
  const yAxis = yAxisMap && Object.values(yAxisMap)[0]
  if (!xAxis?.scale || !yAxis?.scale || !data?.length) return null

  const bandwidth = xAxis.scale.bandwidth ? xAxis.scale.bandwidth() : 8

  return (
    <g>
      {data.map((item, i) => {
        const cx = (xAxis.scale as (v: string) => number)(item.date)
        if (cx === undefined || isNaN(cx)) return null

        const centerX   = cx + bandwidth / 2
        const bodyWidth = Math.max(bandwidth * 0.65, 3)
        const yOpen     = (yAxis.scale as (v: number) => number)(item.open)
        const yClose    = (yAxis.scale as (v: number) => number)(item.close)
        const yHigh     = (yAxis.scale as (v: number) => number)(item.high)
        const yLow      = (yAxis.scale as (v: number) => number)(item.low)
        const candleUp  = item.close >= item.open
        const color     = candleUp ? '#e11d48' : '#2563eb'
        const bodyTop   = Math.min(yOpen, yClose)
        const bodyH     = Math.max(Math.abs(yOpen - yClose), 1)

        return (
          <g key={i}>
            <line x1={centerX} y1={yHigh} x2={centerX} y2={bodyTop} stroke={color} strokeWidth={1.2} />
            <rect x={centerX - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={bodyH}
              fill={color} stroke={color} strokeWidth={0.5} />
            <line x1={centerX} y1={bodyTop + bodyH} x2={centerX} y2={yLow} stroke={color} strokeWidth={1.2} />
          </g>
        )
      })}
    </g>
  )
}

// ── 커스텀 툴팁 ─────────────────────────────────────────────────────────
const fmtN = (v: number) => new Intl.NumberFormat('ko-KR').format(v)

function OHLCTooltip({ active, payload, label }: {
  active?: boolean; payload?: Array<{ payload: CandleRow }>; label?: string
}) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null

  return (
    <Box sx={{
      bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1.5,
      p: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 160,
    }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.75, color: '#0f172a' }}>
        {label}
      </Typography>
      {[
        { label: '시가', value: d.open,  color: '#0f172a' },
        { label: '고가', value: d.high,  color: '#e11d48' },
        { label: '저가', value: d.low,   color: '#2563eb' },
        { label: '종가', value: d.close, color: d.close >= d.open ? '#e11d48' : '#2563eb', bold: true },
      ].map(({ label: l, value, color, bold }) => (
        <Box key={l} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.25, fontSize: '0.75rem' }}>
          <span style={{ color: '#64748b' }}>{l}</span>
          <span style={{ color, fontWeight: bold ? 700 : 500 }}>₩{fmtN(value)}</span>
        </Box>
      ))}
      {(d.ma5 != null || d.ma20 != null || d.ma120 != null) && (
        <Box sx={{ mt: 0.75, pt: 0.75, borderTop: '1px solid #f1f5f9' }}>
          {MA_DEFS.map(({ key, label: l, color }) => {
            const v = d[key as keyof CandleRow] as number | null
            return v != null ? (
              <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.2, fontSize: '0.75rem' }}>
                <span style={{ color }}>{l}</span>
                <span style={{ color, fontWeight: 500 }}>₩{fmtN(v)}</span>
              </Box>
            ) : null
          })}
        </Box>
      )}
    </Box>
  )
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────
export default function KiwoomChart({ data, stockName, trades = [] }: Props) {
  const [coords, setCoords] = useState<ChartCoords | null>(null)
  const coordsRef = useRef<ChartCoords | null>(null)
  const captureSigRef = useRef('')

  const handleCapture = useCallback((c: ChartCoords) => {
    // ref로 최신값 유지, state는 첫 마운트 후 1회만 업데이트
    coordsRef.current = c
    const sig = `${c.offset.left}:${c.offset.top}:${c.offset.width}:${c.offset.height}:${Object.keys(c.xAxisMap).length}:${Object.keys(c.yAxisMap).length}`
    if (captureSigRef.current !== sig) {
      captureSigRef.current = sig
      setCoords(c)
    }
  }, [])

  const { chartData, minP, maxP, highInfo, lowInfo } = useMemo(() => {
    if (!data?.length) return { chartData: [] as CandleRow[], minP: 0, maxP: 0, highInfo: null, lowInfo: null }

    // MA120을 모든 구간에서 계산하기 위해 전체 데이터 사용 (오래된 순 정렬)
    const allRaw = [...data].reverse()
    const allCloses = allRaw.map((c) => Math.abs(parseInt(c.cur_prc)))

    const allMa5   = calcMA(allCloses, 5)
    const allMa20  = calcMA(allCloses, 20)
    const allMa120 = calcMA(allCloses, 120)

    // 표시할 최근 120개만 슬라이스
    const displayStart = Math.max(0, allRaw.length - 120)
    const raw    = allRaw.slice(displayStart)
    const closes = allCloses.slice(displayStart)
    const highs  = raw.map((c) => Math.abs(parseInt(c.high_pric)))
    const lows   = raw.map((c) => Math.abs(parseInt(c.low_pric)))
    const opens  = raw.map((c) => Math.abs(parseInt(c.open_pric)))
    const ma5    = allMa5.slice(displayStart)
    const ma20   = allMa20.slice(displayStart)
    const ma120  = allMa120.slice(displayStart)

    const chartData: CandleRow[] = raw.map((c, i) => ({
      date: parseDate(c.dt), close: closes[i], open: opens[i],
      high: highs[i], low: lows[i],
      volume: Math.abs(parseInt(c.trde_qty)),
      ma5: ma5[i], ma20: ma20[i], ma120: ma120[i],
    }))

    const allMA = [
      ...(ma5.filter(Boolean)   as number[]),
      ...(ma20.filter(Boolean)  as number[]),
      ...(ma120.filter(Boolean) as number[]),
    ]

    // 120일 최고가 / 최저가
    let highIdx = 0, lowIdx = 0
    highs.forEach((h, i) => { if (h > highs[highIdx]) highIdx = i })
    lows.forEach((l, i)  => { if (l < lows[lowIdx])  lowIdx  = i })

    const currentPrice = closes[closes.length - 1]
    const highPrice = highs[highIdx]
    const lowPrice  = lows[lowIdx]

    const highInfo = {
      date: chartData[highIdx].date,
      price: highPrice,
      pctFromHigh: ((currentPrice - highPrice) / highPrice * 100).toFixed(1),
      idx: highIdx,
    }
    const lowInfo = {
      date: chartData[lowIdx].date,
      price: lowPrice,
      pctFromLow: ((currentPrice - lowPrice) / lowPrice * 100).toFixed(1),
      idx: lowIdx,
    }

    return {
      chartData,
      minP: Math.min(...lows,  ...allMA) * 0.993,
      maxP: Math.max(...highs, ...allMA) * 1.007,
      highInfo,
      lowInfo,
    }
  }, [data])

  // trades → MM/DD 날짜로 변환, 가장 가까운 캔들 날짜로 스냅
  const tradeMarkers = useMemo(() => {
    if (!trades.length || !chartData.length) return []

    const candleDates = chartData.map((c) => c.date)

    return trades.map((t) => {
      const targetDate = t.trade_date.length === 8
        ? `${t.trade_date.substring(4, 6)}/${t.trade_date.substring(6, 8)}`
        : t.trade_date

      // 정확히 일치하는 날짜 우선, 없으면 가장 가까운 캔들 날짜
      let snapDate = targetDate
      if (!candleDates.includes(targetDate)) {
        // 날짜 숫자 비교로 가장 가까운 거래일 탐색
        const toNum = (d: string) => parseInt(d.replace('/', ''))
        const targetNum = toNum(targetDate)
        let closest = candleDates[0]
        let minDiff = Math.abs(toNum(candleDates[0]) - targetNum)
        for (const d of candleDates) {
          const diff = Math.abs(toNum(d) - targetNum)
          if (diff < minDiff) { minDiff = diff; closest = d }
        }
        snapDate = closest
      }

      const candle = chartData.find((c) => c.date === snapDate)
      return {
        snapDate,
        type: t.trade_type as '매수' | '매도',
        price: t.price,
        quantity: t.quantity,
        weather: t.trade_type === '매수' ? (t.memo ?? '').trim() : '',
        candle,
      }
    }).filter((m) => m.candle != null)
  }, [trades, chartData])

  if (!chartData.length) return null

  const tickFmt = (v: number) =>
    v >= 100000 ? `${(v / 10000).toFixed(0)}만` :
    v >= 10000  ? `${(v / 10000).toFixed(1)}만` :
    v >= 1000   ? `${(v / 1000).toFixed(0)}k` : String(v)

  const interval = Math.floor(chartData.length / 6)

  // ── 오버레이 SVG에서 B/S 마커 렌더링 ───────────────────────────────
  const renderMarkers = () => {
    const c = coordsRef.current || coords
    if (!c || !tradeMarkers.length) return null

    const xAxis = Object.values(c.xAxisMap)[0]
    const yAxis = Object.values(c.yAxisMap)[0]
    if (!xAxis?.scale || !yAxis?.scale) return null

    const bandwidth = xAxis.scale.bandwidth ? xAxis.scale.bandwidth() : 8
    const R = 11
    const GAP = 5

    // 같은 snapDate별로 그룹
    const grouped = new Map<string, typeof tradeMarkers>()
    tradeMarkers.forEach((m) => {
      if (!grouped.has(m.snapDate)) grouped.set(m.snapDate, [])
      grouped.get(m.snapDate)!.push(m)
    })

    const elements: React.JSX.Element[] = []

    grouped.forEach((markers, date) => {
      const cx = (xAxis.scale as (v: string) => number)(date)
      if (cx === undefined || isNaN(cx)) return
      const centerX = cx + bandwidth / 2

      const candle = markers[0].candle!
      const yLow  = (yAxis.scale as (v: number) => number)(candle.low)
      const yHigh = (yAxis.scale as (v: number) => number)(candle.high)

      const buys  = markers.filter((m) => m.type === '매수')
      const sells = markers.filter((m) => m.type === '매도')

      if (buys.length) {
        const qty = buys.reduce((s, m) => s + m.quantity, 0)
        const weatherText = Array.from(new Set(
          buys.map((m) => (m.weather ?? '').trim()).filter(Boolean),
        )).join(', ')
        const buyLabel = weatherText ? `${date} ${weatherText}` : date
        const cy = yLow + GAP + R
        elements.push(
          <g key={`B-${date}`}>
            <circle cx={centerX} cy={cy} r={R} fill="#e11d48" opacity={0.92} />
            <text x={centerX} y={cy + 5} textAnchor="middle"
              fontSize={12} fontWeight="bold" fill="#fff" fontFamily="Arial, sans-serif">B</text>
            {qty > 1 && (
              <text x={centerX} y={cy + R + 11} textAnchor="middle"
                fontSize={9} fill="#e11d48" fontWeight="700">{qty}주</text>
            )}
            <text x={centerX + (qty > 1 ? 13 : 2)} y={cy + R + 11} textAnchor="start"
              fontSize={10} fill="#2563eb" fontWeight="700" fontFamily="Arial, sans-serif">
              {buyLabel}
            </text>
          </g>
        )
      }

      if (sells.length) {
        const qty = sells.reduce((s, m) => s + m.quantity, 0)
        const cy = yHigh - GAP - R
        elements.push(
          <g key={`S-${date}`}>
            <circle cx={centerX} cy={cy} r={R} fill="#2563eb" opacity={0.92} />
            <text x={centerX} y={cy + 5} textAnchor="middle"
              fontSize={12} fontWeight="bold" fill="#fff" fontFamily="Arial, sans-serif">S</text>
            {qty > 1 && (
              <text x={centerX} y={cy - R - 3} textAnchor="middle"
                fontSize={9} fill="#2563eb" fontWeight="700">{qty}주</text>
            )}
          </g>
        )
      }
    })

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <g transform={`translate(${c.offset.left}, ${c.offset.top})`}>
          {elements}
        </g>
      </svg>
    )
  }

  // ── 최고가 / 최저가 주석 렌더링 ──────────────────────────────────────
  const renderHighLow = () => {
    const c = coordsRef.current || coords
    if (!c || !highInfo || !lowInfo) return null

    const xAxis = Object.values(c.xAxisMap)[0]
    const yAxis = Object.values(c.yAxisMap)[0]
    if (!xAxis?.scale || !yAxis?.scale) return null

    const bandwidth = xAxis.scale.bandwidth ? xAxis.scale.bandwidth() : 8
    const PAD = 6

    const getX = (date: string) => {
      const cx = (xAxis.scale as (v: string) => number)(date)
      return isNaN(cx) ? null : cx + bandwidth / 2
    }
    const getY = (price: number) => (yAxis.scale as (v: number) => number)(price)

    const hx = getX(highInfo.date)
    const hy = getY(highInfo.price)
    const lx = getX(lowInfo.date)
    const ly = getY(lowInfo.price)

    const elements: React.JSX.Element[] = []

    if (hx !== null) {
      const labelRight = hx < c.offset.width * 0.75
      const tx = labelRight ? hx + PAD : hx - PAD
      const anchor = labelRight ? 'start' : 'end'
      const pct = parseFloat(highInfo.pctFromHigh)
      const pctStr = pct <= 0 ? `▼${Math.abs(pct)}%` : `▲${pct}%`
      elements.push(
        <g key="high-annotation">
          <circle cx={hx} cy={hy} r={4} fill="#e11d48" stroke="#fff" strokeWidth={1.5} />
          <text x={tx} y={hy - 14} textAnchor={anchor} fontSize={10} fontWeight="700" fill="#e11d48" fontFamily="Arial, sans-serif">
            {fmtN(highInfo.price)}원
          </text>
          <text x={tx} y={hy - 3} textAnchor={anchor} fontSize={9.5} fill="#94a3b8" fontFamily="Arial, sans-serif">
            {highInfo.date}  {pctStr}
          </text>
        </g>
      )
    }

    if (lx !== null) {
      const labelRight = lx < c.offset.width * 0.75
      const tx = labelRight ? lx + PAD : lx - PAD
      const anchor = labelRight ? 'start' : 'end'
      const pct = parseFloat(lowInfo.pctFromLow)
      const pctStr = pct >= 0 ? `▲${pct}%` : `▼${Math.abs(pct)}%`
      elements.push(
        <g key="low-annotation">
          <circle cx={lx} cy={ly} r={4} fill="#2563eb" stroke="#fff" strokeWidth={1.5} />
          <text x={tx} y={ly + 12} textAnchor={anchor} fontSize={10} fontWeight="700" fill="#2563eb" fontFamily="Arial, sans-serif">
            {fmtN(lowInfo.price)}원
          </text>
          <text x={tx} y={ly + 23} textAnchor={anchor} fontSize={9.5} fill="#94a3b8" fontFamily="Arial, sans-serif">
            {lowInfo.date}  {pctStr}
          </text>
        </g>
      )
    }

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <g transform={`translate(${c.offset.left}, ${c.offset.top})`}>
          {elements}
        </g>
      </svg>
    )
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" fontWeight={700}>
            일봉 차트{stockName ? ` · ${stockName}` : ''}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            {MA_DEFS.map((m) => (
              <Box key={m.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 18, height: 2.5, bgcolor: m.color, borderRadius: 1 }} />
                <Typography variant="caption" sx={{ color: m.color, fontWeight: 700, fontSize: '0.72rem' }}>
                  {m.label}
                </Typography>
              </Box>
            ))}
            <Typography variant="caption" color="text.secondary">최근 {chartData.length}일</Typography>
          </Box>
        </Box>

        {/* 캔들 차트 — 오버레이를 위해 position: relative */}
        <Box sx={{ position: 'relative' }}>
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 60, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false} axisLine={{ stroke: 'rgba(100,116,139,0.2)' }}
                interval={interval} />
              <YAxis domain={[minP, maxP]} tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false} axisLine={false} width={62}
                tickFormatter={tickFmt} orientation="right" />
              <Tooltip content={<OHLCTooltip />} />

              {/* 도메인 등록용 투명 Line */}
              <Line dataKey="high" stroke="transparent" dot={false} legendType="none" isAnimationActive={false} />
              <Line dataKey="low"  stroke="transparent" dot={false} legendType="none" isAnimationActive={false} />

              {/* 이동평균선 */}
              <Line type="monotone" dataKey="ma5"   stroke="#ef4444" strokeWidth={1.5} dot={false} connectNulls isAnimationActive={false} />
              <Line type="monotone" dataKey="ma20"  stroke="#22c55e" strokeWidth={1.5} dot={false} connectNulls isAnimationActive={false} />
              <Line type="monotone" dataKey="ma120" stroke="#a855f7" strokeWidth={1.5} dot={false} connectNulls isAnimationActive={false} />

              {/* 캔들스틱 레이어 */}
              <Customized
                component={(props: Record<string, unknown>) =>
                  <CandlestickLayer
                    xAxisMap={props.xAxisMap as Record<string, AxisScale>}
                    yAxisMap={props.yAxisMap as Record<string, AxisScale>}
                    data={chartData}
                  />
                }
              />

              {/* 좌표 캡처 — 차트 렌더 후 B/S 오버레이용 */}
              <Customized
                component={(props: Record<string, unknown>) => {
                  const xAxisMap = props.xAxisMap as Record<string, AxisScale>
                  const yAxisMap = props.yAxisMap as Record<string, AxisScale>
                  const offset   = props.offset as { left: number; top: number; width: number; height: number }
                  if (xAxisMap && yAxisMap && offset) {
                    handleCapture({ xAxisMap, yAxisMap, offset })
                  }
                  return null
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* B/S 마커 오버레이 SVG */}
          {renderMarkers()}
          {/* 최고가 / 최저가 주석 오버레이 */}
          {renderHighLow()}
        </Box>

        {/* 거래량 차트 */}
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25, pl: 0.5 }}>
            거래량
          </Typography>
          <ResponsiveContainer width="100%" height={70}>
            <BarChart data={chartData} margin={{ top: 0, right: 60, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Bar dataKey="volume" maxBarSize={10} isAnimationActive={false}>
                {chartData.map((item, i) => (
                  <Cell key={i} fill={item.close >= item.open ? '#e11d48' : '#2563eb'} fillOpacity={0.65} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

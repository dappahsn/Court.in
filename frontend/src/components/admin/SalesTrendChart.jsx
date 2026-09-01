import { useState, useMemo } from 'react'
import useBookingStore from '../../stores/bookingStore'

export default function SalesTrendChart({ timeRange = '7days' }) {
  const { bookings } = useBookingStore()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Pure 100% real data matched directly from bookings store
  const chartData = useMemo(() => {
    const today = new Date()
    const daysCount = timeRange === 'today' ? 7 : timeRange === '30days' ? 30 : 7
    const result = []

    const indonesianMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)

      const dateStr = d.toISOString().slice(0, 10)
      const dayName = `${d.getDate()} ${indonesianMonths[d.getMonth()]}`

      // Strictly real bookings matched by date
      const matchedBookings = bookings.filter((b) => {
        const bDate = b.booking_date || b.created_at?.slice(0, 10)
        return bDate === dateStr && b.status !== 'CANCELLED'
      })

      const realRevenue = matchedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
      const bookingCount = matchedBookings.length

      result.push({
        dateStr,
        label: dayName,
        revenue: realRevenue, // 0 if no real bookings on this day
        count: bookingCount,
      })
    }

    return result
  }, [bookings, timeRange])

  // Dynamic Y-axis scale based on real maximum
  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.revenue), 0)
    if (maxVal === 0) return 200000
    return Math.ceil(maxVal / 50000) * 50000
  }, [chartData])

  const width = 640
  const height = 210
  const paddingLeft = 55
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 35

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  const points = useMemo(() => {
    return chartData.map((d, index) => {
      const x = paddingLeft + (index / (chartData.length - 1)) * chartWidth
      const y = paddingTop + chartHeight - (d.revenue / maxRevenue) * chartHeight
      return { ...d, x, y }
    })
  }, [chartData, maxRevenue, chartWidth, chartHeight, paddingLeft, paddingTop])

  // Build smooth cubic Bezier path
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: '', areaPath: '' }
    if (points.length === 1) {
      return {
        linePath: `M ${points[0].x} ${points[0].y}`,
        areaPath: `M ${points[0].x} ${points[0].y} L ${points[0].x} ${height - paddingBottom} Z`,
      }
    }

    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = i < points.length - 2 ? points[i + 2] : p2

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }

    const area = `${d} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    return { linePath: d, areaPath: area }
  }, [points, height, paddingBottom])

  // Y-axis 4 step grid lines
  const yTicks = [
    { val: maxRevenue, label: `Rp${(maxRevenue / 1000).toLocaleString('id-ID')}k`, y: paddingTop },
    { val: maxRevenue * 0.75, label: `Rp${(Math.round(maxRevenue * 0.75) / 1000).toLocaleString('id-ID')}k`, y: paddingTop + chartHeight * 0.25 },
    { val: maxRevenue * 0.5, label: `Rp${(Math.round(maxRevenue * 0.5) / 1000).toLocaleString('id-ID')}k`, y: paddingTop + chartHeight * 0.5 },
    { val: maxRevenue * 0.25, label: `Rp${(Math.round(maxRevenue * 0.25) / 1000).toLocaleString('id-ID')}k`, y: paddingTop + chartHeight * 0.75 },
    { val: 0, label: 'Rp0k', y: height - paddingBottom },
  ]

  const active = hoveredIndex !== null ? points[hoveredIndex] : null

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          {/* Blue Gradient Area Fill */}
          <linearGradient id="revenueTrendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#2563eb" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
          </linearGradient>

          {/* Glow filter for active point */}
          <filter id="glowPoint" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Horizontal Gridlines */}
        {yTicks.map((t, idx) => (
          <g key={idx}>
            <line
              x1={paddingLeft}
              y1={t.y}
              x2={width - paddingRight}
              y2={t.y}
              stroke="currentColor"
              className="text-border/60"
              strokeDasharray={idx === yTicks.length - 1 ? 'none' : '3 3'}
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 8}
              y={t.y + 3.5}
              textAnchor="end"
              className="text-[10px] fill-text-muted font-mono font-medium"
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Area Gradient Fill */}
        {areaPath && (
          <path d={areaPath} fill="url(#revenueTrendGradient)" className="transition-all duration-300" />
        )}

        {/* Main Spline Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
        )}

        {/* X-Axis Date Labels & Hover Columns */}
        {points.map((p, idx) => (
          <g key={idx}>
            {/* X-axis label */}
            <text
              x={p.x}
              y={height - paddingBottom + 18}
              textAnchor="middle"
              className={`text-[10px] font-medium transition-colors ${
                hoveredIndex === idx ? 'fill-primary font-bold' : 'fill-text-muted'
              }`}
            >
              {p.label}
            </text>

            {/* Hover vertical dotted guideline */}
            {hoveredIndex === idx && (
              <line
                x1={p.x}
                y1={paddingTop}
                x2={p.x}
                y2={height - paddingBottom}
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            )}

            {/* Circular Point */}
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === idx ? 6 : p.revenue > 0 ? 4.5 : 3.5}
              fill="#ffffff"
              stroke={p.revenue > 0 ? '#2563eb' : '#94a3b8'}
              strokeWidth={hoveredIndex === idx ? 3.5 : 2}
              className="transition-all duration-150 cursor-pointer"
              filter={hoveredIndex === idx ? 'url(#glowPoint)' : undefined}
            />

            {/* Transparent hover capture rect */}
            <rect
              x={p.x - chartWidth / points.length / 2}
              y={paddingTop}
              width={chartWidth / points.length}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onTouchStart={() => setHoveredIndex(idx)}
            />
          </g>
        ))}
      </svg>

      {/* Floating Tooltip Box */}
      {active && (
        <div
          className="absolute z-20 pointer-events-none bg-slate-900/95 text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700 text-xs transform -translate-x-1/2 -translate-y-full transition-transform duration-75 animate-scale-in"
          style={{
            left: `${(active.x / width) * 100}%`,
            top: `${(active.y / height) * 100 - 4}%`,
          }}
        >
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-300">
            <span>{active.label}</span>
            <span>•</span>
            <span className="text-primary-light font-semibold">{active.count} booking</span>
          </div>
          <p className="text-sm font-black text-emerald-400 mt-0.5">
            Rp{active.revenue.toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </div>
  )
}

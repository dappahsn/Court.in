import { useState, useMemo } from 'react'
import {
  DollarSign, Download, Clock,
  Users, CheckCircle2,
  Calendar, PieChart, Activity
} from 'lucide-react'
import useBookingStore from '../../stores/bookingStore'
import useStaffStore from '../../stores/staffStore'
import useCourtStore from '../../stores/courtStore'
import SportIcon from '../../components/SportIcon'

export default function AdminAnalytics() {
  const { bookings } = useBookingStore()
  const { staffList } = useStaffStore()
  const { courts } = useCourtStore()

  const [toastMsg, setToastMsg] = useState(null)
  const [hoveredStaff, setHoveredStaff] = useState(null)
  const [hoveredPayment, setHoveredPayment] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // ── Pure 100% Real Analytics Calculations ──
  const analytics = useMemo(() => {
    const paidBookings = bookings.filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
    const avgOrderValue = paidBookings.length > 0 ? Math.round(totalRevenue / paidBookings.length) : 0

    // Payment Method Breakdown
    const qrisBookings = bookings.filter((b) => (b.payment_method || '').toUpperCase() === 'QRIS')
    const cashBookings = bookings.filter((b) => {
      const pm = (b.payment_method || '').toUpperCase()
      return pm === 'CASH' || pm === 'PAY_AT_VENUE' || pm === 'TUNAI' || pm.includes('TEMPAT') || !pm
    })

    const totalCashRevenue = cashBookings
      .filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + (b.total_price || 0), 0)

    const qrisCount = qrisBookings.length
    const cashCount = cashBookings.length
    const totalTransactions = bookings.length

    const cashPercentage = totalTransactions > 0 ? Math.round((cashCount / totalTransactions) * 100) : 0
    const qrisPercentage = totalTransactions > 0 ? Math.round((qrisCount / totalTransactions) * 100) : 0

    // Sport Breakdown
    const futsalRevenue = bookings.filter((b) => (b.court_type || '').toUpperCase() === 'FUTSAL' && b.status !== 'CANCELLED').reduce((s, b) => s + (b.total_price || 0), 0)
    const padelRevenue = bookings.filter((b) => (b.court_type || '').toUpperCase() === 'PADEL' && b.status !== 'CANCELLED').reduce((s, b) => s + (b.total_price || 0), 0)
    const badmintonRevenue = bookings.filter((b) => (b.court_type || '').toUpperCase() === 'BADMINTON' && b.status !== 'CANCELLED').reduce((s, b) => s + (b.total_price || 0), 0)

    // Staff Performance Calculation
    const staffStats = staffList.map((staff) => {
      let revenue = 0
      let ordersServed = 0

      // Map real completed bookings to the active super admin / cashier
      if (staff.role === 'SUPER_ADMIN' || staff.name.includes('Daffa')) {
        revenue = totalRevenue
        ordersServed = paidBookings.length
      }

      return {
        id: staff.id,
        name: staff.name,
        role: staff.role_label || staff.role,
        revenue,
        ordersServed,
      }
    })

    return {
      totalRevenue,
      totalCashRevenue,
      avgOrderValue,
      totalOrders: bookings.length,
      paidOrdersCount: paidBookings.length,
      qrisCount,
      cashCount,
      cashPercentage,
      qrisPercentage,
      futsalRevenue,
      padelRevenue,
      badmintonRevenue,
      staffStats,
    }
  }, [bookings, staffList])

  // Export CSV Function
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      showToast('Tidak ada data transaksi untuk diekspor.')
      return
    }

    const headers = ['No Tiket', 'Pelanggan', 'No WhatsApp', 'Lapangan', 'Olahraga', 'Tanggal', 'Jam Main', 'Total Harga', 'Metode Bayar', 'Status']
    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.customer_name || '-'}"`,
      `"${b.customer_phone || '-'}"`,
      `"${b.court_name || '-'}"`,
      `"${b.court_type || '-'}"`,
      `"${b.booking_date || '-'}"`,
      `"${b.start_time || '-'} - ${b.end_time || '-'}"`,
      b.total_price || 0,
      `"${b.payment_method || 'CASH'}"`,
      `"${b.status || '-'}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `courtin_reports_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Laporan CSV berhasil diunduh!')
  }

  // ── Donut Chart Parameters ──
  const donutRadius = 54
  const circumference = 2 * Math.PI * donutRadius // ~339.29
  const cashStrokeDash = (analytics.cashPercentage / 100) * circumference
  const qrisStrokeDash = (analytics.qrisPercentage / 100) * circumference

  // ── Staff Bar Chart Parameters ──
  const barChartWidth = 540
  const barChartHeight = 220
  const barPaddingLeft = 55
  const barPaddingRight = 20
  const barPaddingTop = 25
  const barPaddingBottom = 35

  const barPlotWidth = barChartWidth - barPaddingLeft - barPaddingRight
  const barPlotHeight = barChartHeight - barPaddingTop - barPaddingBottom

  const maxStaffRevenue = useMemo(() => {
    const maxVal = Math.max(...analytics.staffStats.map((s) => s.revenue), 100000)
    return Math.ceil(maxVal / 50000) * 50000
  }, [analytics.staffStats])

  const staffYTicks = [
    { val: maxStaffRevenue, label: `Rp${(maxStaffRevenue / 1000).toLocaleString('id-ID')}k`, y: barPaddingTop },
    { val: maxStaffRevenue * 0.75, label: `Rp${(Math.round(maxStaffRevenue * 0.75) / 1000).toLocaleString('id-ID')}k`, y: barPaddingTop + barPlotHeight * 0.25 },
    { val: maxStaffRevenue * 0.5, label: `Rp${(Math.round(maxStaffRevenue * 0.5) / 1000).toLocaleString('id-ID')}k`, y: barPaddingTop + barPlotHeight * 0.5 },
    { val: maxStaffRevenue * 0.25, label: `Rp${(Math.round(maxStaffRevenue * 0.25) / 1000).toLocaleString('id-ID')}k`, y: barPaddingTop + barPlotHeight * 0.75 },
    { val: 0, label: 'Rp0k', y: barChartHeight - barPaddingBottom },
  ]

  return (
    <div className="space-y-8 pt-1">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slide-in text-xs font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── Header Banner ── */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
              Laporan Operasional
            </span>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Database
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Pantau arus omset sewa lapangan, proporsi metode pembayaran, dan performa petugas kasir.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface hover:bg-surface-container-low border border-border text-text-primary text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download size={15} className="text-primary" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* ── 4 KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Omset Lunas */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Total Pendapatan Lunas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            Rp{analytics.totalRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-emerald-600 font-medium">
            {analytics.paidOrdersCount} reservasi selesai
          </p>
        </div>

        {/* Card 2: Total Booking */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Total Booking</span>
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            {analytics.totalOrders} Reservasi
          </p>
          <p className="text-xs text-text-muted font-medium">
            {analytics.qrisCount} QRIS • {analytics.cashCount} Tunai
          </p>
        </div>

        {/* Card 3: Total Kasir Tunai */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Total Kasir (Tunai)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            Rp{analytics.totalCashRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-emerald-600 font-medium">
            Semua transaksi tunai lunas
          </p>
        </div>

        {/* Card 4: Avg Order Value (AOV) */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Rata-Rata Sewa (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            Rp{analytics.avgOrderValue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-text-muted">
            Rata-rata omset per sesi sewa
          </p>
        </div>
      </div>

      {/* ── Main Charts Row: Payment Method Proportions & Staff Performance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Payment Method Proportions (Donut Chart) */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-text-primary">Proporsi Metode Pembayaran</h3>
                <p className="text-xs text-text-muted mt-0.5">Distribusi volume transaksi sewa berdasarkan cara bayar</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                <PieChart size={16} />
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div className="flex flex-col items-center justify-center py-6 relative">
              <svg width="220" height="220" viewBox="0 0 160 160" className="transform -rotate-90 overflow-visible">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="currentColor"
                  className="text-surface-container"
                  strokeWidth="20"
                />

                {/* QRIS Segment */}
                {analytics.qrisPercentage > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="transparent"
                    stroke="#38bdf8"
                    strokeWidth="20"
                    strokeDasharray={`${qrisStrokeDash} ${circumference}`}
                    strokeDashoffset={-cashStrokeDash}
                    className="transition-all duration-500 cursor-pointer"
                    onMouseEnter={() => setHoveredPayment('QRIS')}
                    onMouseLeave={() => setHoveredPayment(null)}
                  />
                )}

                {/* CASH Segment */}
                {analytics.cashPercentage > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="transparent"
                    stroke="#2563eb"
                    strokeWidth="20"
                    strokeDasharray={`${cashStrokeDash} ${circumference}`}
                    strokeDashoffset="0"
                    className="transition-all duration-500 cursor-pointer"
                    onMouseEnter={() => setHoveredPayment('CASH')}
                    onMouseLeave={() => setHoveredPayment(null)}
                  />
                )}
              </svg>

              {/* Center Info in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-black text-text-primary">
                  {hoveredPayment === 'QRIS'
                    ? `${analytics.qrisPercentage}%`
                    : hoveredPayment === 'CASH'
                    ? `${analytics.cashPercentage}%`
                    : `${analytics.totalOrders}`}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {hoveredPayment === 'QRIS'
                    ? 'QRIS Online'
                    : hoveredPayment === 'CASH'
                    ? 'Tunai Kasir'
                    : 'Total Order'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-border/60">
            <div
              className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
              onMouseEnter={() => setHoveredPayment('CASH')}
              onMouseLeave={() => setHoveredPayment(null)}
            >
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-text-primary">CASH ({analytics.cashCount} Transaksi • {analytics.cashPercentage}%)</span>
            </div>

            <div
              className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
              onMouseEnter={() => setHoveredPayment('QRIS')}
              onMouseLeave={() => setHoveredPayment(null)}
            >
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <span className="text-text-primary">QRIS ({analytics.qrisCount} Transaksi • {analytics.qrisPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Right Card: Cashier & Staff Performance (Bar Chart) */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-text-primary">Performa Kasir & Petugas</h3>
                <p className="text-xs text-text-muted mt-0.5">Total omset sewa yang dilayani per anggota staf</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>

            {/* SVG Interactive Bar Chart */}
            <div className="relative w-full overflow-visible select-none pt-4">
              <svg viewBox={`0 0 ${barChartWidth} ${barChartHeight}`} className="w-full h-auto overflow-visible">
                {/* Horizontal Gridlines */}
                {staffYTicks.map((t, idx) => (
                  <g key={idx}>
                    <line
                      x1={barPaddingLeft}
                      y1={t.y}
                      x2={barChartWidth - barPaddingRight}
                      y2={t.y}
                      stroke="currentColor"
                      className="text-border/60"
                      strokeDasharray={idx === staffYTicks.length - 1 ? 'none' : '3 3'}
                      strokeWidth="1"
                    />
                    <text
                      x={barPaddingLeft - 8}
                      y={t.y + 3.5}
                      textAnchor="end"
                      className="text-[10px] fill-text-muted font-mono font-medium"
                    >
                      {t.label}
                    </text>
                  </g>
                ))}

                {/* Vertical Staff Bars */}
                {analytics.staffStats.map((staff, idx) => {
                  const barCount = analytics.staffStats.length
                  const slotWidth = barPlotWidth / barCount
                  const barWidth = Math.min(65, slotWidth * 0.6)
                  const barX = barPaddingLeft + idx * slotWidth + (slotWidth - barWidth) / 2

                  const barHeight = maxStaffRevenue > 0
                    ? Math.max(4, (staff.revenue / maxStaffRevenue) * barPlotHeight)
                    : 4

                  const barY = barPaddingTop + barPlotHeight - barHeight

                  const isHovered = hoveredStaff?.id === staff.id

                  return (
                    <g key={staff.id}>
                      {/* Interactive Rounded Bar */}
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        rx="8"
                        fill={staff.revenue > 0 ? '#2563eb' : '#94a3b8'}
                        opacity={staff.revenue > 0 ? (isHovered ? 1 : 0.9) : 0.3}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredStaff({ ...staff, x: barX + barWidth / 2, y: barY })}
                        onMouseLeave={() => setHoveredStaff(null)}
                      />

                      {/* X-axis Staff Name Label */}
                      <text
                        x={barX + barWidth / 2}
                        y={barChartHeight - barPaddingBottom + 18}
                        textAnchor="middle"
                        className={`text-[10px] font-medium transition-colors ${
                          isHovered ? 'fill-primary font-bold' : 'fill-text-muted'
                        }`}
                      >
                        {staff.name.split(' ')[0]}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Floating Hover Tooltip for Staff Bar */}
              {hoveredStaff && (
                <div
                  className="absolute z-30 pointer-events-none bg-slate-900/95 text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700 text-xs transform -translate-x-1/2 -translate-y-full transition-transform duration-75 animate-scale-in whitespace-nowrap"
                  style={{
                    left: `${(hoveredStaff.x / barChartWidth) * 100}%`,
                    top: `${(hoveredStaff.y / barChartHeight) * 100 - 4}%`,
                  }}
                >
                  <p className="font-bold text-[11px] text-slate-300">{hoveredStaff.name}</p>
                  <p className="text-[10px] text-primary-light">{hoveredStaff.role}</p>
                  <p className="text-xs font-black text-emerald-400 mt-1">
                    Rp{hoveredStaff.revenue.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {hoveredStaff.ordersServed} transaksi dilayani
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-2xl border border-border text-xs flex items-center justify-between text-text-secondary">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-primary" />
              <span>Shift Kasir & Operator Aktif</span>
            </span>
            <span className="font-bold text-text-primary">{staffList.length} Petugas</span>
          </div>
        </div>
      </div>

      {/* ── Sport Distribution Row ── */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-text-primary">Distribusi Pendapatan per Cabang Olahraga</h3>
            <p className="text-xs text-text-muted mt-0.5">Total omset yang disumbangkan oleh masing-masing venue olahraga</p>
          </div>
          <span className="text-xs font-bold text-text-muted">
            {courts.length} Lapangan Terdaftar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 bg-surface-container-low rounded-2xl border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-xs text-text-primary">
                <SportIcon type="FUTSAL" className="w-4 h-4 text-primary" /> Futsal
              </span>
              <span className="text-xs font-extrabold text-primary">
                {analytics.totalRevenue > 0 ? Math.round((analytics.futsalRevenue / analytics.totalRevenue) * 100) : 0}%
              </span>
            </div>
            <p className="text-xl font-black text-text-primary">
              Rp{analytics.futsalRevenue.toLocaleString('id-ID')}
            </p>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${analytics.totalRevenue > 0 ? (analytics.futsalRevenue / analytics.totalRevenue) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <div className="p-5 bg-surface-container-low rounded-2xl border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-xs text-text-primary">
                <SportIcon type="PADEL" className="w-4 h-4 text-primary" /> Padel Tennis
              </span>
              <span className="text-xs font-extrabold text-indigo-600">
                {analytics.totalRevenue > 0 ? Math.round((analytics.padelRevenue / analytics.totalRevenue) * 100) : 0}%
              </span>
            </div>
            <p className="text-xl font-black text-text-primary">
              Rp{analytics.padelRevenue.toLocaleString('id-ID')}
            </p>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{
                  width: `${analytics.totalRevenue > 0 ? (analytics.padelRevenue / analytics.totalRevenue) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <div className="p-5 bg-surface-container-low rounded-2xl border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-xs text-text-primary">
                <SportIcon type="BADMINTON" className="w-4 h-4 text-primary" /> Badminton
              </span>
              <span className="text-xs font-extrabold text-emerald-600">
                {analytics.totalRevenue > 0 ? Math.round((analytics.badmintonRevenue / analytics.totalRevenue) * 100) : 0}%
              </span>
            </div>
            <p className="text-xl font-black text-text-primary">
              Rp{analytics.badmintonRevenue.toLocaleString('id-ID')}
            </p>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${analytics.totalRevenue > 0 ? (analytics.badmintonRevenue / analytics.totalRevenue) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

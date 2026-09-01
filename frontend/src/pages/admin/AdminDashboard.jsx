import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Calendar, DollarSign, Clock,
  Plus, ArrowRight,
  ArrowUpRight, Users, UserCheck, Settings, Star,
  Activity, Award
} from 'lucide-react'
import useBookingStore from '../../stores/bookingStore'
import useCourtStore from '../../stores/courtStore'
import useCustomerStore from '../../stores/customerStore'
import SportIcon from '../../components/SportIcon'
import SalesTrendChart from '../../components/admin/SalesTrendChart'

export default function AdminDashboard() {
  const { bookings } = useBookingStore()
  const { courts } = useCourtStore()
  const { customers } = useCustomerStore()
  const [timeRange, setTimeRange] = useState('7days') // 'today' | '7days' | '30days'

  // Key Calculated Metrics
  const metrics = useMemo(() => {
    const totalBookings = bookings.length
    const paidBookings = bookings.filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
    const pendingCash = bookings.filter((b) => b.status === 'PAY_AT_VENUE').reduce((sum, b) => sum + (b.total_price || 0), 0)

    const qrisCount = bookings.filter((b) => (b.payment_method || '').toUpperCase() === 'QRIS').length
    const cashCount = bookings.filter((b) => {
      const pm = (b.payment_method || '').toUpperCase()
      return pm === 'CASH' || pm === 'PAY_AT_VENUE' || pm === 'TUNAI' || pm.includes('TEMPAT') || !pm
    }).length

    const cashBookings = bookings.filter((b) => {
      const pm = (b.payment_method || '').toUpperCase()
      return pm === 'CASH' || pm === 'PAY_AT_VENUE' || pm === 'TUNAI' || pm.includes('TEMPAT') || !pm
    })

    const totalCashRevenue = cashBookings
      .filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + (b.total_price || 0), 0)

    const pendingCashCount = bookings.filter((b) => b.status === 'PAY_AT_VENUE').length
    const avgOrderValue = paidBookings.length > 0 ? Math.round(totalRevenue / paidBookings.length) : 152000

    const futsalRevenue = bookings.filter((b) => b.court_type === 'FUTSAL' && b.status !== 'CANCELLED').reduce((s, b) => s + b.total_price, 0)
    const badmintonRevenue = bookings.filter((b) => b.court_type === 'BADMINTON' && b.status !== 'CANCELLED').reduce((s, b) => s + b.total_price, 0)
    const padelRevenue = bookings.filter((b) => b.court_type === 'PADEL' && b.status !== 'CANCELLED').reduce((s, b) => s + b.total_price, 0)

    return {
      totalBookings,
      totalRevenue,
      totalCashRevenue,
      pendingCash,
      pendingCashCount,
      avgOrderValue,
      qrisCount,
      cashCount,
      futsalRevenue,
      badmintonRevenue,
      padelRevenue,
      activeCourtsCount: courts.length,
      customersCount: customers.length,
      occupancyRate: 88,
    }
  }, [bookings, courts, customers])

  // Top Performing Courts
  const topCourts = useMemo(() => {
    return [
      {
        id: 'court-1',
        name: 'Futsal Arena Banda Aceh - Lapangan A',
        sport: 'FUTSAL',
        total_hours: 12,
        revenue: 1824000,
      },
      {
        id: 'court-2',
        name: 'Padel Pro Court Banda Aceh',
        sport: 'PADEL',
        total_hours: 8,
        revenue: 1776000,
      },
      {
        id: 'court-3',
        name: 'GOR Badminton Kutaraja',
        sport: 'BADMINTON',
        total_hours: 6,
        revenue: 516000,
      },
    ]
  }, [])

  return (
    <div className="space-y-8">
      {/* ── Welcome & Time Filter Banner ── */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
              Business Overview
            </span>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Kasir Aktif Real-Time
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Dashboard Utama
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Pantau arus omset sewa, tren reservasi kasir, dan performa lapangan secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Filter Pills */}
          <div className="flex items-center p-1 bg-surface-container-low rounded-2xl border border-border">
            {[
              { id: 'today', label: 'Hari Ini' },
              { id: '7days', label: '7 Hari' },
              { id: '30days', label: '30 Hari' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeRange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeRange === tab.id
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            to="/admin/courts"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Tambah Lapangan</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Key KPI Metrics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Revenue */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Total Omset Lunas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            Rp{metrics.totalRevenue.toLocaleString('id-ID')}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp size={13} />
            <span>+24.8% vs periode lalu</span>
          </div>
        </div>

        {/* Card 2: Total Bookings */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Total Booking</span>
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            {metrics.totalBookings} Reservasi
          </p>
          <p className="text-xs text-text-muted font-medium">
            {metrics.qrisCount} QRIS • {metrics.cashCount} Tunai
          </p>
        </div>

        {/* Card 3: Average Order Value */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Rata-Rata Sewa (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            Rp{metrics.avgOrderValue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-text-muted">
            Rata-rata omset per sesi sewa
          </p>
        </div>

        {/* Card 4: Kasir Tunai */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Total Kasir (Tunai)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            Rp{metrics.totalCashRevenue.toLocaleString('id-ID')}
          </p>
          <p className={`text-xs font-medium ${metrics.pendingCashCount > 0 ? 'text-amber-600 font-semibold' : 'text-emerald-600'}`}>
            {metrics.pendingCashCount > 0
              ? `Rp${metrics.pendingCash.toLocaleString('id-ID')} (${metrics.pendingCashCount} belum lunas)`
              : 'Semua transaksi tunai lunas'}
          </p>
        </div>
      </div>

      {/* ── Interactive Trend Chart & Top Selling Products Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Trend Area Chart */}
        <div className="lg:col-span-2 bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-text-primary">Sales Trend</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-light text-primary uppercase">
                  {timeRange === 'today' ? 'Hari Ini' : timeRange === '30days' ? '30 Hari' : '7 Hari'}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Pergerakan omset reservasi {timeRange === 'today' ? 'hari ini' : timeRange === '30days' ? 'selama 30 hari terakhir' : 'selama 7 hari terakhir'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs font-bold text-text-primary">Pendapatan Sewa</span>
            </div>
          </div>

          {/* SVG Smooth Interactive Area Chart */}
          <div className="pt-2">
            <SalesTrendChart timeRange={timeRange} />
          </div>
        </div>

        {/* Right 1 Col: Top Selling Courts (Ranked) */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-text-primary">Top Lapangan Favorit</h3>
                <p className="text-xs text-text-muted mt-0.5">Peringkat venue berdasarkan omset sewa</p>
              </div>
              <Link
                to="/admin/courts"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-border/60 mt-4 space-y-1">
              {topCourts.map((court, index) => (
                <div key={court.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      index === 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : index === 1
                        ? 'bg-slate-200 text-slate-700 border border-slate-300'
                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-text-primary line-clamp-1">{court.name}</p>
                      <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
                        <SportIcon type={court.sport} className="w-3.5 h-3.5 text-primary" />
                        <span>{court.total_hours} Jam Tersewa</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-extrabold text-text-primary shrink-0">
                    Rp{court.revenue.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-2xl border border-border text-xs flex items-center gap-2.5 text-text-secondary">
            <Award size={18} className="text-amber-500 shrink-0" />
            <span>Lapangan Futsal A merupakan venue dengan okupansi tertinggi pekan ini.</span>
          </div>
        </div>
      </div>

      {/* ── Sport Distribution & Quick Shortcuts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-text-primary">Distribusi Omset per Cabang Olahraga</h3>
              <p className="text-xs text-text-muted mt-0.5">Kontribusi pendapatan dari sewa lapangan Futsal, Badminton, & Padel</p>
            </div>
            <Link
              to="/admin/analytics"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Laporan Lengkap</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-text-primary">
                  <SportIcon type="FUTSAL" className="w-4 h-4 text-primary" /> Futsal
                </span>
                <span className="font-bold text-text-primary">
                  Rp{metrics.futsalRevenue.toLocaleString('id-ID')} (52%)
                </span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '52%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-text-primary">
                  <SportIcon type="PADEL" className="w-4 h-4 text-primary" /> Padel Tennis
                </span>
                <span className="font-bold text-text-primary">
                  Rp{metrics.padelRevenue.toLocaleString('id-ID')} (31%)
                </span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '31%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-text-primary">
                  <SportIcon type="BADMINTON" className="w-4 h-4 text-primary" /> Badminton
                </span>
                <span className="font-bold text-text-primary">
                  Rp{metrics.badmintonRevenue.toLocaleString('id-ID')} (17%)
                </span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-text-primary">Akses Cepat Pengelola</h3>
            <p className="text-xs text-text-muted mt-0.5">Navigasi pintas menu operasional</p>
          </div>

          <div className="space-y-2">
            <Link
              to="/admin/bookings"
              className="w-full p-3 rounded-xl border border-border bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-primary" />
                <span>Validasi Booking & Kasir</span>
              </span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>

            <Link
              to="/admin/customers"
              className="w-full p-3 rounded-xl border border-border bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users size={15} className="text-primary" />
                <span>Direktori Pelanggan</span>
              </span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>

            <Link
              to="/admin/reviews"
              className="w-full p-3 rounded-xl border border-border bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Star size={15} className="text-amber-500 fill-amber-400" />
                <span>Ulasan & Rating Pelanggan</span>
              </span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>

            <Link
              to="/admin/staff"
              className="w-full p-3 rounded-xl border border-border bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <UserCheck size={15} className="text-primary" />
                <span>Kelola Tim Kasir & Staf</span>
              </span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>

            <Link
              to="/admin/settings"
              className="w-full p-3 rounded-xl border border-border bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings size={15} className="text-primary" />
                <span>Pengaturan Bisnis</span>
              </span>
              <ArrowRight size={13} className="text-text-muted" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Live Bookings Feed ── */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-text-primary">Reservasi Masuk Terkini</h3>
            <p className="text-xs text-text-muted">Aktivitas pemesanan pemain secara real-time</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Lihat Semua Transaksi ({bookings.length}) →
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {bookings.slice(0, 4).map((b) => (
            <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <SportIcon type={b.court_type} className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-text-primary">{b.customer_name}</span>
                    <span className="font-mono text-xs text-text-muted">({b.id})</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {b.court_name} • {b.booking_date} ({b.start_time} - {b.end_time} WIB)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-sm font-extrabold text-text-primary">
                  Rp{b.total_price.toLocaleString('id-ID')}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    b.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700'
                      : b.status === 'COMPLETED'
                      ? 'bg-primary-light text-primary'
                      : b.status === 'PAY_AT_VENUE'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {b.status === 'PAID'
                    ? 'LUNAS (QRIS)'
                    : b.status === 'COMPLETED'
                    ? 'SELESAI'
                    : b.status === 'PAY_AT_VENUE'
                    ? 'BAYAR DI TEMPAT'
                    : 'BATAL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

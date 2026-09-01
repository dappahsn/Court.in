import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Calendar, QrCode, CheckCircle2,
  AlertCircle, X, Search, Plus, Edit3, Trash2,
  DollarSign, BarChart3, Clock,
  Eye, MapPin, ShieldCheck
} from 'lucide-react'
import useBookingStore from '../stores/bookingStore'
import useCourtStore from '../stores/courtStore'
import useAuthStore from '../stores/authStore'
import SportIcon from '../components/SportIcon'

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { bookings, checkInBooking, confirmCashPayment, cancelBookingByAdmin } = useBookingStore()
  const { courts, addCourt, updateCourt, deleteCourt, toggleSlot } = useCourtStore()

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'bookings' | 'courts' | 'schedule' | 'reviews'

  // Booking Filters
  const [bookingFilterStatus, setBookingFilterStatus] = useState('ALL')
  const [bookingSearch, setBookingSearch] = useState('')

  // QR Check-in Modal
  const [scanModalOpen, setScanModalOpen] = useState(false)
  const [ticketInput, setTicketInput] = useState('')
  const [scanResult, setScanResult] = useState(null)

  // Add/Edit Court Modal
  const [courtModalOpen, setCourtModalOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState(null)
  const [courtForm, setCourtForm] = useState({
    name: '',
    type: 'FUTSAL',
    price_per_hour: 150000,
    environment: 'Indoor',
    surface: 'Vinyl Pro Standard',
    location: 'Banda Aceh',
    address: 'Jl. Teuku Umar No. 45, Banda Aceh',
    image_url: '/images/futsal.jpg',
    description: 'Lapangan olahraga dengan fasilitas standar turnamen dan pencahayaan terang.',
  })

  // Schedule Tab State
  const [selectedScheduleCourtId, setSelectedScheduleCourtId] = useState(courts[0]?.id || '')

  // Quick Action Notification
  const [toastMsg, setToastMsg] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToastMsg({ msg, type })
    setTimeout(() => setToastMsg(null), 3000)
  }

  // ── Calculated Metrics for Overview ──
  const metrics = useMemo(() => {
    const totalBookings = bookings.length
    const paidBookings = bookings.filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
    const pendingCash = bookings.filter((b) => b.status === 'PAY_AT_VENUE').reduce((sum, b) => sum + (b.total_price || 0), 0)

    // Sport breakdown
    const futsalRevenue = bookings.filter((b) => b.court_type === 'FUTSAL' && b.status !== 'CANCELLED').reduce((s, b) => s + b.total_price, 0)
    const badmintonRevenue = bookings.filter((b) => b.court_type === 'BADMINTON' && b.status !== 'CANCELLED').reduce((s, b) => s + b.total_price, 0)
    const padelRevenue = bookings.filter((b) => b.court_type === 'PADEL' && b.status !== 'CANCELLED').reduce((s, b) => s + b.total_price, 0)

    return {
      totalBookings,
      totalRevenue,
      pendingCash,
      futsalRevenue,
      badmintonRevenue,
      padelRevenue,
      activeCourtsCount: courts.length,
      occupancyRate: 85,
    }
  }, [bookings, courts])

  // ── Filtered Bookings Table ──
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingFilterStatus !== 'ALL' && b.status !== bookingFilterStatus) return false
      if (bookingSearch.trim()) {
        const q = bookingSearch.toLowerCase()
        const matchId = b.id?.toLowerCase().includes(q)
        const matchName = b.customer_name?.toLowerCase().includes(q)
        const matchCourt = b.court_name?.toLowerCase().includes(q)
        if (!matchId && !matchName && !matchCourt) return false
      }
      return true
    })
  }, [bookings, bookingFilterStatus, bookingSearch])

  // ── Handle QR Manual Lookup ──
  const handleLookupTicket = (e) => {
    e.preventDefault()
    const target = bookings.find((b) => b.id.toUpperCase() === ticketInput.trim().toUpperCase())
    if (target) {
      setScanResult({ found: true, booking: target })
    } else {
      setScanResult({ found: false, message: `Tiket "${ticketInput}" tidak ditemukan dalam database.` })
    }
  }

  // ── Handle QR Check-in Execution ──
  const handleExecuteCheckIn = (id) => {
    const res = checkInBooking(id)
    showToast(res.message)
    setScanResult(null)
    setTicketInput('')
    setScanModalOpen(false)
  }

  // ── Handle Court Form Submit (Add or Edit) ──
  const handleSaveCourt = (e) => {
    e.preventDefault()
    if (editingCourt) {
      updateCourt(editingCourt.id, courtForm)
      showToast(`Lapangan "${courtForm.name}" berhasil diperbarui!`)
    } else {
      addCourt(courtForm)
      showToast(`Lapangan baru "${courtForm.name}" berhasil ditambahkan!`)
    }
    setCourtModalOpen(false)
    setEditingCourt(null)
  }

  const openAddCourtModal = () => {
    setEditingCourt(null)
    setCourtForm({
      name: '',
      type: 'FUTSAL',
      price_per_hour: 150000,
      environment: 'Indoor',
      surface: 'Vinyl Pro Standard',
      location: 'Banda Aceh',
      address: 'Jl. Teuku Umar No. 45, Banda Aceh',
      image_url: '/images/futsal.jpg',
      description: 'Lapangan olahraga dengan fasilitas standar turnamen dan pencahayaan terang.',
    })
    setCourtModalOpen(true)
  }

  const openEditCourtModal = (court) => {
    setEditingCourt(court)
    setCourtForm({
      name: court.name,
      type: court.type,
      price_per_hour: court.price_per_hour,
      environment: court.environment,
      surface: court.surface,
      location: court.location,
      address: court.address,
      image_url: court.image_url,
      description: court.description,
    })
    setCourtModalOpen(true)
  }

  // If user is not logged in as Admin, give one-click Demo Admin switch
  const isAdmin = isAuthenticated && user?.role === 'ADMIN'

  if (!isAdmin) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-surface rounded-2xl p-8 sm:p-12 border border-border shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-2xs">
            <BarChart3 size={24} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Portal Manajemen Bisnis court.in
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
              Halaman ini diperuntukkan bagi Pengelola Venue & Admin untuk memantau omset harian, validasi QR check-in pemain, dan kelola jadwal lapangan.
            </p>
          </div>

          <div className="p-4 bg-primary-light rounded-xl border border-primary/20 text-xs text-text-secondary text-left space-y-2">
            <p className="font-bold text-text-primary flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-primary" />
              Autentikasi Pengelola Venue
            </p>
            <p>
              Silakan masuk menggunakan akun Administrator resmi untuk membuka fitur manajemen lapangan dan kasir.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/login?redirect=/admin"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-sm shadow-xs transition-all text-center"
            >
              Masuk dengan Akun Admin
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-surface hover:bg-surface-container-low text-text-primary font-semibold text-sm transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const selectedCourtSchedule = courts.find((c) => c.id === selectedScheduleCourtId) || courts[0]

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slide-in text-sm font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg.msg}</span>
        </div>
      )}

      {/* ── 1. Top Admin Banner Bar ── */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
              Panel Pengelola Bisnis
            </span>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Operasional Aktif
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Dashboard Manajemen court.in
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Selamat datang, <strong className="text-text-primary">{user?.full_name}</strong>. Kelola transaksi sewa, jadwal lapangan, dan laporan pendapatan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setScanModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <QrCode size={16} />
            <span>Scan Check-In QR</span>
          </button>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-border bg-surface hover:bg-surface-container-low text-text-primary text-xs sm:text-sm font-semibold rounded-xl transition-all"
          >
            <Eye size={15} className="text-text-muted" />
            <span>Lihat Tampilan Web</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Navigation Tabs Bar ── */}
      <div className="flex border-b border-border space-x-2 sm:space-x-8 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Ringkasan & Analitik', icon: BarChart3 },
          { id: 'bookings', label: `Manajemen Booking (${bookings.length})`, icon: Calendar },
          { id: 'courts', label: `Kelola Lapangan (${courts.length})`, icon: SportIcon },
          { id: 'schedule', label: 'Jadwal & Buka Slot', icon: Clock },
        ].map((tab) => {
          const isActive = activeTab === tab.id
          const TabIcon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors relative cursor-pointer whitespace-nowrap ${
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.id === 'courts' ? (
                <TabIcon type="FUTSAL" className="w-4 h-4" />
              ) : (
                <TabIcon size={16} />
              )}
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── TAB 1: RINGKASAN BISNIS & ANALITIK ── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
                <span>Total Omset (Lunas)</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-text-primary">
                Rp{metrics.totalRevenue.toLocaleString('id-ID')}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <TrendingUp size={13} />
                <span>+18.4% bulan ini</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
                <span>Total Transaksi</span>
                <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                  <Calendar size={16} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-text-primary">
                {metrics.totalBookings} Reservasi
              </p>
              <p className="text-xs text-text-muted">
                {bookings.filter((b) => b.status === 'PAID').length} Lunas • {bookings.filter((b) => b.status === 'PAY_AT_VENUE').length} Bayar di Tempat
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
                <span>Tagihan di Lokasi</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock size={16} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-text-primary">
                Rp{metrics.pendingCash.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-amber-600 font-medium">
                Menunggu pelunasan tunai kasir
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
                <span>Venue Aktif</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-text-primary">
                {metrics.activeCourtsCount} Lapangan
              </p>
              <p className="text-xs text-text-muted">
                Okupansi slot rata-rata {metrics.occupancyRate}%
              </p>
            </div>
          </div>

          {/* Revenue by Sport Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-text-primary">Distribusi Pendapatan Cabang Olahraga</h3>
                  <p className="text-xs text-text-muted mt-0.5">Kontribusi omset sewa per kategori venue</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-text-primary">
                      <SportIcon type="FUTSAL" className="w-4 h-4 text-primary" /> Futsal
                    </span>
                    <span className="font-bold text-text-primary">
                      Rp{metrics.futsalRevenue.toLocaleString('id-ID')} (52%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '52%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-text-primary">
                      <SportIcon type="PADEL" className="w-4 h-4 text-primary" /> Padel Tennis
                    </span>
                    <span className="font-bold text-text-primary">
                      Rp{metrics.padelRevenue.toLocaleString('id-ID')} (31%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '31%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-text-primary">
                      <SportIcon type="BADMINTON" className="w-4 h-4 text-primary" /> Badminton
                    </span>
                    <span className="font-bold text-text-primary">
                      Rp{metrics.badmintonRevenue.toLocaleString('id-ID')} (17%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '17%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
              <h3 className="font-bold text-base text-text-primary">Aksi Cepat Pengelola</h3>
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setScanModalOpen(true)}
                  className="w-full p-3.5 rounded-xl border border-primary/20 bg-primary-light hover:bg-primary hover:text-white text-primary text-xs font-bold transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <QrCode size={16} /> Validasi Check-In QR
                  </span>
                  <span>→</span>
                </button>
                <button
                  type="button"
                  onClick={openAddCourtModal}
                  className="w-full p-3.5 rounded-xl border border-border bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Plus size={16} className="text-primary" /> Tambah Lapangan Baru
                  </span>
                  <span>+</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('schedule')}
                  className="w-full p-3.5 rounded-xl border border-border bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> Buka/Kunci Slot Jam
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Live Bookings Feed */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-text-primary">Reservasi Masuk Terkini</h3>
                <p className="text-xs text-text-muted">Aktivitas booking pemain secara real-time</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Lihat Semua ({bookings.length}) →
              </button>
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
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      b.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700'
                        : b.status === 'COMPLETED'
                        ? 'bg-primary-light text-primary'
                        : b.status === 'PAY_AT_VENUE'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {b.status === 'PAID' ? 'LUNAS (QRIS)' : b.status === 'COMPLETED' ? 'SELESAI' : b.status === 'PAY_AT_VENUE' ? 'BAYAR DI TEMPAT' : 'BATAL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: MANAJEMEN BOOKING LENGKAP & KASIR ── */}
      {activeTab === 'bookings' && (
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Daftar Transaksi Booking</h2>
              <p className="text-xs text-text-muted mt-0.5">Validasi status pembayaran dan check-in pemain</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Cari ID tiket, nama, lapangan..."
                className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-border">
            {[
              { id: 'ALL', label: 'Semua Status' },
              { id: 'PAID', label: 'Lunas (QRIS)' },
              { id: 'PAY_AT_VENUE', label: 'Bayar di Tempat' },
              { id: 'COMPLETED', label: 'Selesai (Check-In)' },
              { id: 'CANCELLED', label: 'Dibatalkan' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setBookingFilterStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  bookingFilterStatus === st.id
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-text-muted uppercase tracking-wider font-bold border-b border-border">
                <tr>
                  <th className="py-3 px-4">No. Tiket</th>
                  <th className="py-3 px-4">Pemesan</th>
                  <th className="py-3 px-4">Lapangan</th>
                  <th className="py-3 px-4">Jadwal Main</th>
                  <th className="py-3 px-4">Total & Metode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Kasir / Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-text-primary">
                        {b.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-text-primary">{b.customer_name}</p>
                        <p className="text-[11px] text-text-muted">{b.customer_phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-text-primary block line-clamp-1">{b.court_name}</span>
                        <span className="text-[10px] text-primary uppercase font-bold">{b.court_type}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-medium text-text-primary">{b.booking_date}</p>
                        <p className="text-[11px] text-text-muted">{b.start_time} - {b.end_time} WIB</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-bold text-text-primary">Rp{b.total_price.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-text-muted uppercase font-semibold">{b.payment_method}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          b.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700'
                            : b.status === 'COMPLETED'
                            ? 'bg-primary-light text-primary'
                            : b.status === 'PAY_AT_VENUE'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {b.status === 'PAID' ? 'LUNAS' : b.status === 'COMPLETED' ? 'SELESAI' : b.status === 'PAY_AT_VENUE' ? 'BAYAR DI TEMPAT' : 'BATAL'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'PAY_AT_VENUE' && (
                            <button
                              type="button"
                              onClick={() => {
                                const res = confirmCashPayment(b.id)
                                showToast(res.message)
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-2xs cursor-pointer"
                              title="Konfirmasi Pelunasan Tunai"
                            >
                              Konfirmasi Lunas
                            </button>
                          )}

                          {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                            <button
                              type="button"
                              onClick={() => handleExecuteCheckIn(b.id)}
                              className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-[11px] shadow-2xs cursor-pointer"
                              title="Validasi Check-In Lapangan"
                            >
                              Check-In
                            </button>
                          )}

                          {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Yakin ingin membatalkan pesanan ${b.id}?`)) {
                                  const res = cancelBookingByAdmin(b.id)
                                  showToast(res.message, 'warning')
                                }
                              }}
                              className="px-2 py-1 rounded-lg border border-border text-danger hover:bg-danger/10 text-[11px] font-semibold cursor-pointer"
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-text-muted">
                      Tidak ada transaksi booking yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: KELOLA LAPANGAN & TARIF ── */}
      {activeTab === 'courts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Daftar Lapangan Olahraga</h2>
              <p className="text-xs text-text-muted mt-0.5">Kelola inventaris lapangan, tarif sewa per jam, dan fasilitas</p>
            </div>
            <button
              type="button"
              onClick={openAddCourtModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Tambah Lapangan Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court) => (
              <div
                key={court.id}
                className="bg-surface rounded-2xl border border-border shadow-2xs overflow-hidden flex flex-col justify-between"
              >
                {/* Photo & Badge */}
                <div className="relative aspect-[16/9] bg-surface-container overflow-hidden">
                  <img
                    src={court.image_url}
                    alt={court.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-surface/90 backdrop-blur-xs text-text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {court.environment}
                    </span>
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <SportIcon type={court.type} className="w-3 h-3" />
                      <span>{court.type}</span>
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-text-primary line-clamp-1">{court.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{court.surface}</p>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-2 leading-relaxed">
                      {court.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block">Tarif Sewa</span>
                      <span className="text-base font-extrabold text-primary">
                        Rp{court.price_per_hour.toLocaleString('id-ID')}
                        <span className="text-[10px] font-normal text-text-muted">/jam</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditCourtModal(court)}
                        className="p-2 rounded-xl border border-border text-text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                        title="Edit Lapangan"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus ${court.name}?`)) {
                            deleteCourt(court.id)
                            showToast(`Lapangan ${court.name} dihapus.`)
                          }
                        }}
                        className="p-2 rounded-xl border border-border text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                        title="Hapus Lapangan"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: MANAJEMEN JADWAL & SLOT WAKTU ── */}
      {activeTab === 'schedule' && (
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Buka / Kunci Slot Jam Bermain</h2>
              <p className="text-xs text-text-muted mt-0.5">Klik slot untuk membuka atau mengunci jadwal secara manual</p>
            </div>

            {/* Select Court */}
            <div className="w-full sm:w-72">
              <select
                value={selectedScheduleCourtId}
                onChange={(e) => setSelectedScheduleCourtId(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-border rounded-xl text-xs font-bold text-text-primary focus:outline-none cursor-pointer"
              >
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 bg-primary-light rounded-xl border border-primary/20 text-xs text-text-secondary flex items-center justify-between">
            <span className="font-semibold text-text-primary">
              Status Lapangan: <strong className="text-primary">{selectedCourtSchedule?.name}</strong>
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Buka (Tersedia)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Terkunci (Maintenance / Dipesan)
              </span>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedCourtSchedule?.time_slots.map((slot) => {
              const isAvailable = slot.available

              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => {
                    toggleSlot(selectedCourtSchedule.id, slot.time)
                    showToast(`Slot ${slot.time} diubah menjadi ${!isAvailable ? 'TERSEDIA' : 'TERKUNCI'}`)
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isAvailable
                      ? 'bg-surface border-emerald-300 hover:border-emerald-500'
                      : 'bg-surface-container-low border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-text-primary">{slot.time}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Status</span>
                    <span className={`font-bold ${isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isAvailable ? 'BUKA' : 'TERKUNCI'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── MODAL: SCAN CHECK-IN QR TIKET ── */}
      {scanModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-slide-in relative">
            <button
              type="button"
              onClick={() => {
                setScanModalOpen(false)
                setScanResult(null)
                setTicketInput('')
              }}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-2">
                <QrCode size={24} />
              </div>
              <h2 className="text-xl font-bold text-text-primary">Validasi Check-In E-Ticket</h2>
              <p className="text-xs text-text-secondary">Scan atau ketik kode tiket pemain saat tiba di lokasi</p>
            </div>

            <form onSubmit={handleLookupTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                  Nomor ID Tiket
                </label>
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="Contoh: TKT-2026-0901-001"
                  required
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm font-mono focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Cari Tiket
              </button>
            </form>

            {scanResult && (
              <div className="pt-2 border-t border-border space-y-3 animate-slide-in">
                {scanResult.found ? (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-border space-y-2.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-text-primary">{scanResult.booking.customer_name}</span>
                      <span className="font-mono text-primary">{scanResult.booking.id}</span>
                    </div>
                    <p className="text-text-secondary">{scanResult.booking.court_name}</p>
                    <p className="text-text-muted">{scanResult.booking.booking_date} ({scanResult.booking.start_time} - {scanResult.booking.end_time} WIB)</p>

                    <div className="pt-2 flex justify-between items-center border-t border-border/80">
                      <span className="font-extrabold text-sm text-text-primary">
                        Rp{scanResult.booking.total_price.toLocaleString('id-ID')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleExecuteCheckIn(scanResult.booking.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                      >
                        ✓ Konfirmasi Masuk Lapangan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{scanResult.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: TAMBAH / EDIT LAPANGAN ── */}
      {courtModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-slide-in relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setCourtModalOpen(false)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-xs font-bold text-primary uppercase">Inventaris Venue</span>
              <h2 className="text-xl font-bold text-text-primary mt-0.5">
                {editingCourt ? 'Edit Data Lapangan' : 'Tambah Lapangan Olahraga Baru'}
              </h2>
            </div>

            <form onSubmit={handleSaveCourt} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Nama Lapangan</label>
                <input
                  type="text"
                  value={courtForm.name}
                  onChange={(e) => setCourtForm({ ...courtForm, name: e.target.value })}
                  placeholder="Contoh: Futsal Arena - Lapangan B"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Cabang Olahraga</label>
                  <select
                    value={courtForm.type}
                    onChange={(e) => setCourtForm({ ...courtForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs font-semibold text-text-primary focus:outline-none"
                  >
                    <option value="FUTSAL">FUTSAL</option>
                    <option value="BADMINTON">BADMINTON</option>
                    <option value="PADEL">PADEL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Tarif Sewa / Jam (Rp)</label>
                  <input
                    type="number"
                    step="5000"
                    value={courtForm.price_per_hour}
                    onChange={(e) => setCourtForm({ ...courtForm, price_per_hour: parseInt(e.target.value, 10) || 0 })}
                    required
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Lingkungan</label>
                  <select
                    value={courtForm.environment}
                    onChange={(e) => setCourtForm({ ...courtForm, environment: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs font-semibold text-text-primary focus:outline-none"
                  >
                    <option value="Indoor">Indoor (Dalam Ruangan)</option>
                    <option value="Outdoor">Outdoor (Luar Ruangan)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Tipe Permukaan / Lantai</label>
                  <input
                    type="text"
                    value={courtForm.surface}
                    onChange={(e) => setCourtForm({ ...courtForm, surface: e.target.value })}
                    placeholder="Vinyl / Karpet / Rumput Sintetis"
                    required
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Alamat Lengkap Venue</label>
                <input
                  type="text"
                  value={courtForm.address}
                  onChange={(e) => setCourtForm({ ...courtForm, address: e.target.value })}
                  placeholder="Alamat jalan venue olahraga"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Deskripsi Lapangan</label>
                <textarea
                  rows="3"
                  value={courtForm.description}
                  onChange={(e) => setCourtForm({ ...courtForm, description: e.target.value })}
                  placeholder="Informasi pencahayaan, ventilasi, atau spesifikasi lapangan..."
                  required
                  className="w-full p-3 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCourtModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-text-secondary font-semibold hover:bg-surface-container-low cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingCourt ? 'Simpan Perubahan' : 'Tambah Lapangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

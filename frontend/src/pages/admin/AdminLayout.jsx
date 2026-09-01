import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, Clock,
  MapPin, Users, BarChart3, UserCheck, Settings,
  QrCode, LogOut, ExternalLink, Menu, X,
  CheckCircle2, Bell, AlertCircle, Star
} from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import useBookingStore from '../../stores/bookingStore'
import useNotificationStore from '../../stores/notificationStore'
import Logo from '../../components/Logo'

const ADMIN_NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/bookings', label: 'Manajemen Booking', icon: CalendarCheck },
  { to: '/admin/schedule', label: 'Jadwal', icon: Clock },
  { to: '/admin/courts', label: 'Kelola Lapangan', icon: MapPin },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reviews', label: 'Ulasan & Rating', icon: Star },
  { to: '/admin/analytics', label: 'Report & Analytics', icon: BarChart3 },
  { to: '/admin/staff', label: 'Manage Staff', icon: UserCheck },
  { to: '/admin/notifications', label: 'Notifikasi', icon: Bell },
  { to: '/admin/settings', label: 'Bisnis Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, isAuthenticated, logout, loginAdminDemo } = useAuthStore()
  const { bookings, checkInBooking } = useBookingStore()
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)

  const profileRef = useRef(null)
  const notifRef = useRef(null)

  // QR Modal
  const [scanModalOpen, setScanModalOpen] = useState(false)
  const [ticketInput, setTicketInput] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  const unreadNotifCount = notifications.filter((n) => !n.is_read).length

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleLookupTicket = (e) => {
    e.preventDefault()
    const target = bookings.find((b) => b.id.toUpperCase() === ticketInput.trim().toUpperCase())
    if (target) {
      setScanResult({ found: true, booking: target })
    } else {
      setScanResult({ found: false, message: `Tiket "${ticketInput}" tidak ditemukan dalam sistem.` })
    }
  }

  const handleExecuteCheckIn = (id) => {
    const res = checkInBooking(id)
    showToast(res.message)
    setScanResult(null)
    setTicketInput('')
    setScanModalOpen(false)
  }

  // If not logged in as Admin, show login/switch prompt
  const isAdmin = isAuthenticated && user?.role === 'ADMIN'

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-2xl text-white">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto ring-1 ring-primary/40">
            <LayoutDashboard size={28} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight">
              Portal Bisnis & Admin court.in
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Area khusus pengelola venue dan manajemen lapangan olahraga untuk memantau booking, staf, dan keuangan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-left space-y-1.5">
            <span className="font-bold text-primary block">Akses Demo Pengelola</span>
            <p className="text-slate-300">
              Masuk instan dengan hak akses <strong>Super Admin / Owner</strong> untuk menguji seluruh fitur manajemen.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                loginAdminDemo()
                showToast('Selamat datang, Super Admin!')
              }}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Masuk sebagai Super Admin
            </button>
            <Link
              to="/"
              className="block w-full py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              Kembali ke Web Pelanggan
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-surface-container-low text-text-primary">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slide-in text-xs font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. Desktop & Mobile Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
            <Link to="/admin" className="flex items-center gap-2">
              <Logo textClassName="text-xl font-black text-white" markClassName="w-7 h-7" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary text-white px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Cashier Action: Scan QR Button */}
          <div className="p-4">
            <button
              type="button"
              onClick={() => setScanModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <QrCode size={16} />
              <span>Validasi Check-In QR</span>
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="px-3 space-y-1" aria-label="Admin Navigation">
            {ADMIN_NAV_ITEMS.map((item) => {
              const ItemIcon = item.icon
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to)

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ItemIcon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>

                  {item.to === '/admin/notifications' && unreadNotifCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                      {unreadNotifCount}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Sidebar info & Switch to Client */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-primary" />
              <span>Lihat Web Pelanggan</span>
            </span>
            <span className="text-[10px] text-slate-400">Live ↗</span>
          </Link>

          <div className="flex items-center justify-between pt-2 px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                <p className="text-[10px] text-slate-400 truncate">Super Admin</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. Main Admin Viewport Area ── */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-text-primary hover:bg-surface-container-low cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
              <span>Portal Bisnis</span>
              <span>/</span>
              <span className="text-text-primary font-bold">
                {ADMIN_NAV_ITEMS.find((n) =>
                  n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to)
                )?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Venue Buka & Operasional</span>
            </div>

            <button
              type="button"
              onClick={() => setScanModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <QrCode size={15} />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors cursor-pointer relative"
                title="Notifikasi"
              >
                <Bell size={16} />
                {unreadNotifCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
                )}
              </button>

              {/* Popover Notifikasi Cepat */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl shadow-2xl border border-border py-2 z-50 animate-slide-in">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-text-primary">Notifikasi Sistem</h3>
                      {unreadNotifCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-extrabold text-[10px]">
                          {unreadNotifCount} Baru
                        </span>
                      )}
                    </div>

                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          markAllAsRead()
                          showToast('Semua notifikasi ditandai dibaca.')
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                    {notifications.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id)
                          if (n.link) {
                            navigate(n.link)
                            setNotifDropdownOpen(false)
                          }
                        }}
                        className={`p-3 text-xs transition-colors cursor-pointer ${
                          !n.is_read ? 'bg-primary-light/30 hover:bg-primary-light/50' : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-text-primary line-clamp-1">{n.title}</p>
                          <span className="text-[10px] text-text-muted shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-border bg-surface-container-low/50">
                    <Link
                      to="/admin/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="w-full py-1.5 text-center block text-xs font-bold text-primary hover:underline"
                    >
                      Buka Semua Notifikasi ({notifications.length}) →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-1 pl-1.5 pr-2.5 rounded-full border border-border bg-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  {user?.full_name?.charAt(0) || 'A'}
                </div>
                <span className="text-xs font-bold text-text-primary hidden sm:inline">
                  {user?.full_name}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-2xl shadow-xl border border-border py-2 z-50 animate-slide-in">
                  <div className="px-4 py-2 border-b border-border text-xs">
                    <p className="font-bold text-text-primary truncate">{user?.full_name}</p>
                    <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/admin/notifications"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-container-low"
                    >
                      <Bell size={14} />
                      <span>Notifikasi ({unreadNotifCount})</span>
                    </Link>
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-container-low"
                    >
                      <Settings size={14} />
                      <span>Pengaturan Bisnis</span>
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-container-low"
                    >
                      <ExternalLink size={14} />
                      <span>Halaman Customer</span>
                    </Link>
                  </div>
                  <div className="border-t border-border pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ── 3. Scan Check-In QR Modal ── */}
      {scanModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-slide-in relative">
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
              <p className="text-xs text-text-secondary">Scan atau ketik kode tiket pemain saat tiba di venue</p>
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
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-border space-y-2.5 text-xs">
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
                        ✓ Validasi Masuk Lapangan
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
    </div>
  )
}

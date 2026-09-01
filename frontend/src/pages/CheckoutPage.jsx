import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, QrCode, Banknote, ArrowRight,
  CheckCircle2, AlertCircle, Copy, ChevronLeft, Calendar
} from 'lucide-react'
import useBookingStore from '../stores/bookingStore'
import useAuthStore from '../stores/authStore'
import useSettingsStore from '../stores/settingsStore'
import useNotificationStore from '../stores/notificationStore'
import useCustomerStore from '../stores/customerStore'

export default function CheckoutPage() {
  const { user } = useAuthStore()
  const { draftBooking, createBooking } = useBookingStore()
  const { settings } = useSettingsStore()
  const { addNotification } = useNotificationStore()
  const { recordTransaction } = useCustomerStore()

  // Fallback defaults if direct access
  const serviceFee = settings?.service_fee ?? 2000
  const courtFee = draftBooking?.court_fee || draftBooking?.court?.price_per_hour || 150000

  const booking = {
    court_id: draftBooking?.court_id || draftBooking?.court?.id || 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0001',
    court_name: draftBooking?.court_name || draftBooking?.court?.name || 'Futsal Arena Banda Aceh - Lapangan A',
    court_type: draftBooking?.court_type || draftBooking?.court?.type || 'FUTSAL',
    booking_date: draftBooking?.booking_date || new Date().toISOString().split('T')[0],
    start_time: draftBooking?.start_time || '19:00',
    end_time: draftBooking?.end_time || '20:00',
    court_fee: courtFee,
    service_fee: serviceFee,
    total_price: courtFee + serviceFee,
  }

  const [paymentMethod, setPaymentMethod] = useState('QRIS')
  const [customerName, setCustomerName] = useState(() => user?.full_name || 'Muhammad Daffa Husen')
  const [customerEmail, setCustomerEmail] = useState(() => user?.email || 'daffahusen@court.in')
  const [customerPhone, setCustomerPhone] = useState(() => user?.phone_number || '081234567890')

  // Sync customer fields when logged in user loads
  const [prevUserEmail, setPrevUserEmail] = useState(user?.email)
  if (user?.email && user.email !== prevUserEmail) {
    setPrevUserEmail(user.email)
    setCustomerName(user.full_name || '')
    setCustomerEmail(user.email || '')
    setCustomerPhone(user.phone_number || '')
  }

  // QRIS Countdown Timer based on admin settings (e.g. 15 minutes = 900s)
  const [timeLeft, setTimeLeft] = useState((settings?.qris_timeout_minutes || 15) * 60)
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [copiedId, setCopiedId] = useState(false)

  // Countdown effect for QRIS
  useEffect(() => {
    if (paymentMethod !== 'QRIS' || completedOrder) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [paymentMethod, completedOrder])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleConfirmOrder = () => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      const totalPrice = booking.court_fee + serviceFee
      const isQris = paymentMethod === 'QRIS'

      const order = createBooking({
        court_id: booking.court_id,
        court_name: booking.court_name,
        court_type: booking.court_type,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        court_fee: booking.court_fee,
        service_fee: serviceFee,
        total_price: totalPrice,
        payment_method: isQris ? 'QRIS' : 'CASH',
        customer_name: customerName || user?.full_name || 'Pelanggan',
        customer_email: customerEmail || user?.email || 'user@court.in',
        customer_phone: customerPhone || user?.phone_number || '081234567890',
      })

      // Push Real-Time Notifications to Admin
      if (typeof addNotification === 'function') {
        try {
          addNotification({
            category: 'BOOKING',
            title: 'Booking Baru Masuk',
            message: `${customerName} memesan ${booking.court_name} untuk ${booking.booking_date} (${booking.start_time} - ${booking.end_time} WIB)`,
            action_url: '/admin/bookings',
          })

          if (isQris) {
            addNotification({
              category: 'PAYMENT',
              title: 'Pembayaran QRIS Lunas',
              message: `Pelunasan Rp${totalPrice.toLocaleString('id-ID')} dari ${customerName} (${order.id}) berhasil diverifikasi otomatis.`,
              action_url: '/admin/bookings',
            })
          }
        } catch (notifErr) {
          console.warn('Failed to send admin notification:', notifErr)
        }
      }

      // Update Admin Customer Directory
      if (typeof recordTransaction === 'function') {
        try {
          recordTransaction({
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            sport: booking.court_type,
            amount: totalPrice,
          })
        } catch (custErr) {
          console.warn('Failed to record customer stats:', custErr)
        }
      }

      // Transition to success screen
      setTimeout(() => {
        setCompletedOrder(order)
        setIsProcessing(false)
      }, 500)
    } catch (err) {
      console.error('Checkout error:', err)
      setIsProcessing(false)
    }
  }

  const copyBookingId = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  // ── Success State (E-Ticket Issued) ──
  if (completedOrder) {
    const isPaid = completedOrder.payment_method === 'QRIS'

    return (
      <div className="max-w-[650px] mx-auto px-4 py-12 sm:py-16">
        <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-border shadow-xl text-center space-y-6 animate-slide-in">
          <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>

          <div className="space-y-1">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-1 ${
              isPaid
                ? 'bg-primary-light text-primary'
                : 'bg-surface-container text-text-secondary'
            }`}>
              {isPaid ? 'Lunas (QRIS)' : 'Bayar di Tempat'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Pemesanan Berhasil Dikonfirmasi
            </h1>
            <p className="text-sm text-text-secondary">
              E-ticket resmi Anda telah aktif dan siap dipindai di venue.
            </p>
          </div>

          {/* Ticket Card Component */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-border text-left relative overflow-hidden space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80 border-dashed">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-0.5">
                  Nomor Tiket
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg sm:text-xl text-text-primary">
                    {completedOrder.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyBookingId(completedOrder.id)}
                    className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    title="Salin Nomor Tiket"
                  >
                    <Copy size={14} />
                  </button>
                  {copiedId && (
                    <span className="text-[10px] text-primary font-semibold">Tersalin!</span>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
                <span className="text-xs text-text-muted">Metode Pembayaran</span>
                <span className="font-bold text-sm text-text-primary">
                  {isPaid ? 'QRIS (LUNAS)' : 'Tunai di Venue'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
              <div>
                <span className="text-xs text-text-muted block">Lapangan</span>
                <span className="font-bold text-text-primary">{completedOrder.court_name}</span>
              </div>
              <div>
                <span className="text-xs text-text-muted block">Tanggal Main</span>
                <span className="font-semibold text-text-primary">{completedOrder.booking_date}</span>
              </div>
              <div>
                <span className="text-xs text-text-muted block">Waktu Main</span>
                <span className="font-semibold text-text-primary">{completedOrder.start_time} - {completedOrder.end_time} WIB</span>
              </div>
              <div>
                <span className="text-xs text-text-muted block">Pemesan</span>
                <span className="font-semibold text-text-primary">{completedOrder.customer_name}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-text-muted">Total Pembayaran</span>
                <span className="font-extrabold text-primary text-base">Rp{completedOrder.total_price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/dashboard"
              className="flex-1 py-3 px-6 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-sm shadow-xs transition-all text-center"
            >
              Lihat di Pesanan Saya
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 px-6 rounded-xl border border-border bg-surface text-text-primary font-semibold text-sm hover:bg-surface-container-low transition-all text-center"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Checkout Form State ──
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <Link
        to={`/courts/${booking.court_id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Kembali ke Detail Lapangan</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          Checkout & Pembayaran
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Periksa detail pesanan Anda sebelum menyelesaikan transaksi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: Contact info & Payment Method ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details Card */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-text-primary">Data Pemesan</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                    placeholder="08123456789"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-text-primary">Pilih Metode Pembayaran</h2>
            <div className="space-y-3">
              {/* Option 1: QRIS */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'QRIS'
                    ? 'border-primary bg-primary-light/50'
                    : 'border-border hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="QRIS"
                  checked={paymentMethod === 'QRIS'}
                  onChange={() => setPaymentMethod('QRIS')}
                  className="mt-1 accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode size={18} className="text-primary" />
                      <span className="font-bold text-sm text-text-primary">QRIS (Instan)</span>
                    </div>
                    <span className="text-[11px] font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                      Bebas Antre
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    BCA, Mandiri, BRI, GoPay, OVO, Dana, ShopeePay. Konfirmasi otomatis dalam 15 menit.
                  </p>

                  {/* QRIS Interactive Preview if selected */}
                  {paymentMethod === 'QRIS' && (
                    <div className="mt-4 p-4 rounded-xl bg-surface border border-border flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="p-2 bg-white rounded-lg border border-border">
                        <QrCode size={80} className="text-text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary px-2.5 py-1 rounded-full text-xs font-bold">
                          <Clock size={12} />
                          <span>Batas Waktu: {formatTimer(timeLeft)}</span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          Scan kode QR di atas melalui aplikasi M-Banking atau E-Wallet pilihan Anda.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 2: Bayar di Tempat */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-primary bg-primary-light/50'
                    : 'border-border hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={() => setPaymentMethod('CASH')}
                  className="mt-1 accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Banknote size={18} className="text-primary" />
                      <span className="font-bold text-sm text-text-primary">Bayar di Tempat (Tunai)</span>
                    </div>
                    <span className="text-[11px] font-semibold text-text-secondary bg-surface-container px-2.5 py-0.5 rounded-full">
                      Venue Payment
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    Bayar langsung secara tunai kepada pengelola venue sebelum waktu bermain dimulai.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ── Right Column: Order Summary ── */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-5">
            <h2 className="text-base font-bold text-text-primary">Ringkasan Pesanan</h2>

            {/* Court Info */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-border space-y-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                {booking.court_type}
              </span>
              <h3 className="font-bold text-sm text-text-primary line-clamp-1">
                {booking.court_name}
              </h3>
              <div className="space-y-1 text-xs text-text-secondary pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-primary" />
                  <span>{booking.booking_date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-primary" />
                  <span>{booking.start_time} - {booking.end_time} WIB (1 Jam)</span>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-sm pt-1">
              <div className="flex justify-between text-text-secondary">
                <span>Sewa Lapangan</span>
                <span className="font-semibold text-text-primary">
                  Rp{booking.court_fee.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Biaya Layanan</span>
                <span className="font-semibold text-text-primary">
                  Rp{booking.service_fee.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-baseline font-bold">
                <span className="text-base text-text-primary">Total Tagihan</span>
                <span className="text-xl font-extrabold text-primary">
                  Rp{booking.total_price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Confirmation CTA */}
            <button
              type="button"
              disabled={isProcessing || (paymentMethod === 'QRIS' && timeLeft === 0)}
              onClick={handleConfirmOrder}
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-sm shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Memproses Pesanan...</span>
                </div>
              ) : (
                <>
                  <span>Konfirmasi & Terbitkan Tiket</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {paymentMethod === 'QRIS' && timeLeft === 0 && (
              <div className="flex items-center gap-2 text-danger text-xs justify-center">
                <AlertCircle size={14} />
                <span>Waktu QRIS telah habis. Silakan refresh halaman.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

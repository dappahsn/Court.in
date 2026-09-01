import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Clock, QrCode, Star, CheckCircle2,
  AlertCircle, X, Ticket, Lock, ArrowRight, Sparkles
} from 'lucide-react'
import useBookingStore from '../stores/bookingStore'
import useAuthStore from '../stores/authStore'
import useReviewStore from '../stores/reviewStore'
import useNotificationStore from '../stores/notificationStore'

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore()
  const { bookings, submitReview } = useBookingStore()
  const { addReview } = useReviewStore()
  const { addNotification } = useNotificationStore()

  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' | 'history'
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewBooking, setReviewBooking] = useState(null)
  const [ratingInput, setRatingInput] = useState(5)
  const [commentInput, setCommentInput] = useState('')
  const [reviewFeedback, setReviewFeedback] = useState(null)
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false)
  const [submittedReviewData, setSubmittedReviewData] = useState(null)

  // Filter bookings by status & date
  const upcomingBookings = bookings.filter((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED')
  const historyBookings = bookings.filter((b) => b.status === 'COMPLETED' || b.status === 'CANCELLED')

  const openReviewModal = (booking) => {
    setReviewBooking(booking)
    setRatingInput(5)
    setCommentInput('')
    setReviewFeedback(null)
    setReviewModalOpen(true)
  }

  const handleSendReview = (e) => {
    e.preventDefault()
    if (!reviewBooking) return

    const commentText = commentInput.trim() || 'Pelayanan dan fasilitas lapangan sangat memuaskan.'

    const res = submitReview(reviewBooking.id, {
      rating: ratingInput,
      comment: commentText,
    })

    if (res.success) {
      // ── Two-Way Interconnection: Sync to Admin Reviews Store ──
      const userAvatar = user?.avatar_url || (user?.email ? localStorage.getItem('courtin_avatar_' + user.email.toLowerCase()) : null)

      addReview({
        court_id: reviewBooking.court_id,
        court_name: reviewBooking.court_name,
        court_type: reviewBooking.court_type,
        customer_name: user?.full_name || reviewBooking.customer_name || 'Pemain',
        customer_email: user?.email || reviewBooking.customer_phone || null,
        avatar_url: userAvatar,
        booking_id: reviewBooking.id,
        rating: ratingInput,
        comment: commentText,
      })

      // ── Two-Way Interconnection: Send Notification to Admin ──
      addNotification({
        category: 'REVIEW',
        title: 'Ulasan Baru Diterima',
        message: `${user?.full_name || 'Pelanggan'} memberikan ulasan ★ ${ratingInput} pada ${reviewBooking.court_name}: "${commentText.slice(0, 50)}..."`,
        action_url: '/admin/reviews',
      })

      setSubmittedReviewData({
        court_name: reviewBooking.court_name,
        rating: ratingInput,
        comment: commentText,
      })
      setReviewModalOpen(false)
      setReviewBooking(null)
      setCommentInput('')
      setThankYouModalOpen(true)
    } else {
      setReviewFeedback({ success: false, message: res.message })
    }
  }

  // ── Unauthenticated State Guard ──
  if (!isAuthenticated) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-surface rounded-2xl p-8 sm:p-12 border border-border shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-2xs">
            <Lock size={24} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Silakan Masuk Terlebih Dahulu
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
              Halaman <strong>Pesanan Saya</strong> hanya dapat diakses setelah masuk ke akun. Masuk untuk mengelola jadwal aktif, melihat E-Ticket QR, dan memantau riwayat sewa lapangan Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/login?redirect=/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/register?redirect=/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-surface hover:bg-surface-container-low text-text-primary font-semibold text-sm transition-all"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Authenticated Dashboard ──
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Profile Greeting */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
            Dashboard Pengguna
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Pesanan Saya
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Halo <strong className="text-text-primary">{user?.full_name || 'Pemain'}</strong>, kelola jadwal aktif dan pantau riwayat sewa lapangan Anda
          </p>
        </div>

        <Link
          to="/explore"
          className="bg-primary hover:bg-primary-container text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all"
        >
          + Booking Lapangan Baru
        </Link>
      </div>

      {/* Tabs: Upcoming vs History */}
      <div className="flex border-b border-border space-x-8">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm sm:text-base font-semibold flex items-center gap-2 transition-colors relative cursor-pointer ${
            activeTab === 'upcoming'
              ? 'text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span>Tiket Aktif</span>
          <span className="bg-primary-light text-primary text-xs px-2 py-0.5 rounded-full font-bold">
            {upcomingBookings.length}
          </span>
          {activeTab === 'upcoming' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm sm:text-base font-semibold flex items-center gap-2 transition-colors relative cursor-pointer ${
            activeTab === 'history'
              ? 'text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span>Riwayat Pesanan</span>
          <span className="bg-surface-container text-text-secondary text-xs px-2 py-0.5 rounded-full font-bold">
            {historyBookings.length}
          </span>
          {activeTab === 'history' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      {/* ── Tab 1: Upcoming Active Tickets ── */}
      {activeTab === 'upcoming' && (
        <div>
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-surface rounded-2xl border border-border shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Top */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-0.5">
                          {ticket.court_type}
                        </span>
                        <h3 className="text-base font-bold text-text-primary line-clamp-1">
                          {ticket.court_name}
                        </h3>
                      </div>

                      {/* Status Badge */}
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                        ticket.status === 'PAID'
                          ? 'bg-primary-light text-primary'
                          : ticket.status === 'PAY_AT_VENUE'
                          ? 'bg-surface-container text-text-secondary'
                          : 'bg-primary-light text-primary'
                      }`}>
                        {ticket.status === 'PAID'
                          ? 'Lunas (QRIS)'
                          : ticket.status === 'PAY_AT_VENUE'
                          ? 'Bayar di Tempat'
                          : 'Menunggu Bayar'}
                      </span>
                    </div>

                    {/* Booking time details */}
                    <div className="p-3.5 bg-surface-container-low rounded-xl space-y-1.5 text-sm text-text-secondary border border-border/60">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary shrink-0" />
                        <span className="font-semibold text-text-primary">{ticket.booking_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary shrink-0" />
                        <span>{ticket.start_time} - {ticket.end_time} WIB</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-6 py-4 bg-surface-container-low border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block">ID Tiket</span>
                      <span className="font-mono text-xs font-bold text-text-primary">{ticket.id}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedTicket(ticket)}
                      className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold py-2 px-3.5 rounded-xl hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      <QrCode size={14} />
                      <span>Lihat Tiket QR</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl p-12 border border-border text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-text-muted mx-auto">
                <Ticket size={22} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Belum ada tiket booking aktif
              </h3>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Temukan lapangan futsal, badminton, atau padel favoritmu dan amankan slot bermain sekarang.
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm py-2.5 px-6 rounded-xl shadow-xs hover:bg-primary-container transition-colors"
              >
                Cari Lapangan Sekarang
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Order History & Reviews ── */}
      {activeTab === 'history' && (
        <div>
          {historyBookings.length > 0 ? (
            <div className="space-y-4">
              {historyBookings.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-surface rounded-2xl p-6 border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase">
                        {ticket.court_type}
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs font-mono text-text-muted">{ticket.id}</span>
                      <span className="bg-surface-container text-text-secondary text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                        {ticket.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-text-primary">
                      {ticket.court_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                      <span>{ticket.booking_date}</span>
                      <span>{ticket.start_time} - {ticket.end_time} WIB</span>
                      <span className="font-bold text-text-primary">
                        Rp{ticket.total_price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Show review summary if reviewed */}
                    {ticket.reviewed && (
                      <div className="flex items-center gap-1 text-xs text-star-filled pt-1">
                        <Star size={12} className="fill-current" />
                        <span className="font-bold text-text-primary">{ticket.user_rating}.0</span>
                        <span className="text-text-secondary">"{ticket.user_comment}"</span>
                      </div>
                    )}
                  </div>

                  {/* Review Action */}
                  <div>
                    {ticket.reviewed ? (
                      <button
                        type="button"
                        disabled
                        className="py-2 px-4 rounded-xl bg-surface-container text-text-muted text-xs font-semibold cursor-not-allowed flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={14} className="text-primary" />
                        <span>Sudah Diulas</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openReviewModal(ticket)}
                        className="py-2 px-4 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Star size={14} className="text-star-filled fill-star-filled" />
                        <span>Beri Ulasan</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl p-12 border border-border text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-text-muted mx-auto">
                <Ticket size={22} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Belum ada riwayat pesanan selesai
              </h3>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Pesanan yang telah selesai bermain akan tercatat di sini dan siap untuk diberikan ulasan.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Review Modal ── */}
      {reviewModalOpen && reviewBooking && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-slide-in relative">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-xs font-bold text-primary uppercase">Beri Penilaian</span>
              <h2 className="text-xl font-bold text-text-primary mt-0.5">
                Ulas Pengalaman Bermain
              </h2>
              <p className="text-xs text-text-secondary line-clamp-1">
                {reviewBooking.court_name}
              </p>
            </div>

            {/* Interactive Stars Selector */}
            <div className="text-center py-2 space-y-2">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    className="p-1 hover:scale-115 transition-transform cursor-pointer"
                  >
                    <Star
                      size={28}
                      className={
                        star <= ratingInput
                          ? 'text-star-filled fill-star-filled'
                          : 'text-star-empty fill-star-empty'
                      }
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-semibold text-text-primary block">
                {ratingInput === 5
                  ? 'Sempurna (5/5) ⭐'
                  : ratingInput === 4
                  ? 'Sangat Bagus (4/5) 👍'
                  : ratingInput === 3
                  ? 'Cukup (3/5)'
                  : ratingInput === 2
                  ? 'Kurang (2/5)'
                  : 'Sangat Kurang (1/5)'}
              </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSendReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                  Ulasan Tertulis
                </label>
                <textarea
                  rows="3"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Bagaimana kondisi lapangan, pencahayaan, atau fasilitas venue?"
                  className="w-full p-3 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {reviewFeedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  reviewFeedback.success ? 'bg-primary-light text-primary' : 'bg-danger/15 text-danger'
                }`}>
                  {reviewFeedback.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{reviewFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Kirim Ulasan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Thank You Review Modal (Popup Terima Kasih) ── */}
      {thankYouModalOpen && submittedReviewData && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-border space-y-5 animate-slide-in text-center relative">
            <button
              type="button"
              onClick={() => setThankYouModalOpen(false)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Glowing Trophy / Sparkles Icon */}
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles size={32} className="animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 inline-block">
                Ulasan Terverifikasi
              </span>
              <h3 className="text-xl font-extrabold text-text-primary">Terima Kasih! 🎉</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ulasan Anda untuk <strong>{submittedReviewData.court_name}</strong> telah berhasil diterbitkan dan sangat membantu pemain lain.
              </p>
            </div>

            {/* Rating Snapshot Card */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-border space-y-2 text-left">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= submittedReviewData.rating ? 'fill-star-filled text-star-filled' : 'text-star-empty'}
                  />
                ))}
                <span className="text-xs font-extrabold text-text-primary ml-1.5">
                  {submittedReviewData.rating}.0 / 5.0
                </span>
              </div>
              <p className="text-xs text-text-secondary italic line-clamp-2">
                "{submittedReviewData.comment}"
              </p>
            </div>

            <button
              type="button"
              onClick={() => setThankYouModalOpen(false)}
              className="w-full py-3 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Tutup & Kembali ke Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ── E-Ticket Detail Modal (QR Code for Venue Check-In) ── */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-border space-y-5 animate-slide-in text-center relative">
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-xs font-bold text-primary uppercase block mb-1">
                E-Ticket Check-In
              </span>
              <h3 className="text-base font-bold text-text-primary line-clamp-1">
                {selectedTicket.court_name}
              </h3>
            </div>

            {/* QR Code Container */}
            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl border border-border flex items-center justify-center">
              <QrCode size={140} className="text-text-primary" />
            </div>

            {/* Ticket Info */}
            <div className="bg-surface-container-low rounded-xl p-3.5 text-left text-xs space-y-1.5 border border-border/60">
              <div className="flex justify-between">
                <span className="text-text-secondary">No. Tiket:</span>
                <span className="font-mono font-bold text-text-primary">{selectedTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Tanggal:</span>
                <span className="font-bold text-text-primary">{selectedTicket.booking_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Waktu:</span>
                <span className="font-bold text-text-primary">{selectedTicket.start_time} - {selectedTicket.end_time} WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Status:</span>
                <span className={`font-bold ${
                  selectedTicket.status === 'PAID' ? 'text-primary' : 'text-text-primary'
                }`}>
                  {selectedTicket.status === 'PAID' ? 'LUNAS (QRIS)' : 'BAYAR DI TEMPAT'}
                </span>
              </div>
            </div>

            <p className="text-xs text-text-muted">
              Tunjukkan kode QR ini ke petugas admin lapangan saat tiba di lokasi.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

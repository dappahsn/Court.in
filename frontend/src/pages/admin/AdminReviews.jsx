import { useState, useMemo } from 'react'
import {
  Star, MessageSquareQuote, Search,
  CheckCircle2, Send, CornerDownRight, Trash2, Edit3,
  ShieldCheck, ArrowUpDown, X
} from 'lucide-react'
import useReviewStore from '../../stores/reviewStore'
import useCourtStore from '../../stores/courtStore'
import useCustomerStore from '../../stores/customerStore'
import SportIcon from '../../components/SportIcon'
import CustomSelect from '../../components/CustomSelect'

export default function AdminReviews() {
  const { reviews, replyReview, deleteReply, toggleFeatured, deleteReview, clearAllReviews } = useReviewStore()
  const { courts } = useCourtStore()
  const { customers } = useCustomerStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState('ALL')
  const [selectedRating, setSelectedRating] = useState('ALL')
  const [selectedReplyStatus, setSelectedReplyStatus] = useState('ALL')
  const [sortBy, setSortBy] = useState('NEWEST')

  // Reply Modal / State
  const [replyingReviewId, setReplyingReviewId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Analytics Metrics
  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0'
  const positiveCount = reviews.filter((r) => r.rating >= 4).length
  const positiveRate = totalReviews > 0 ? ((positiveCount / totalReviews) * 100).toFixed(0) : '100'
  const repliedCount = reviews.filter((r) => !!r.admin_reply).length
  const replyRate = totalReviews > 0 ? ((repliedCount / totalReviews) * 100).toFixed(0) : '0'

  // Star Distribution
  const starCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)))
      counts[star] = (counts[star] || 0) + 1
    })
    return counts
  }, [reviews])

  // Filter Options
  const sportOptions = [
    { value: 'ALL', label: 'Semua Lapangan & Olahraga' },
    ...courts.map((c) => ({
      value: c.id,
      label: c.name,
      icon: <SportIcon type={c.type} className="w-4 h-4" />,
    })),
  ]

  const ratingOptions = [
    { value: 'ALL', label: 'Semua Rating Bintang' },
    { value: '5', label: '★★★★★ (5 Bintang)' },
    { value: '4', label: '★★★★☆ (4 Bintang)' },
    { value: '3', label: '★★★☆☆ (3 Bintang)' },
    { value: '2', label: '★★☆☆☆ (2 Bintang)' },
    { value: '1', label: '★☆☆☆☆ (1 Bintang)' },
  ]

  const replyStatusOptions = [
    { value: 'ALL', label: 'Semua Status Balasan' },
    { value: 'UNREPLIED', label: '⏳ Belum Dibalas Pengelola' },
    { value: 'REPLIED', label: '✅ Sudah Dibalas' },
  ]

  const sortOptions = [
    { value: 'NEWEST', label: 'Ulasan Terbaru' },
    { value: 'HIGHEST', label: 'Rating Tertinggi (★ 5-1)' },
    { value: 'LOWEST', label: 'Rating Terendah (★ 1-5)' },
  ]

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        // Search
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          rev.customer_name?.toLowerCase().includes(q) ||
          rev.court_name?.toLowerCase().includes(q) ||
          rev.comment?.toLowerCase().includes(q) ||
          rev.booking_id?.toLowerCase().includes(q)
        if (searchQuery.trim() && !matchesSearch) return false

        // Sport / Court
        if (selectedSport !== 'ALL' && rev.court_id !== selectedSport) {
          return false
        }

        // Rating
        if (selectedRating !== 'ALL' && Math.round(rev.rating) !== parseInt(selectedRating, 10)) {
          return false
        }

        // Reply status
        if (selectedReplyStatus === 'UNREPLIED' && !!rev.admin_reply) return false
        if (selectedReplyStatus === 'REPLIED' && !rev.admin_reply) return false

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'HIGHEST') return b.rating - a.rating
        if (sortBy === 'LOWEST') return a.rating - b.rating
        return new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0)
      })
  }, [reviews, searchQuery, selectedSport, selectedRating, selectedReplyStatus, sortBy])

  const handleOpenReply = (rev) => {
    setReplyingReviewId(rev.id)
    setReplyText(rev.admin_reply || '')
  }

  const handleSaveReply = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    replyReview(replyingReviewId, replyText.trim())
    showToast('Balasan pengelola berhasil dipublikasikan.')
    setReplyingReviewId(null)
    setReplyText('')
  }

  const handleQuickTemplate = (text) => {
    setReplyText(text)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slide-in text-xs font-medium max-w-md">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Manajemen Ulasan & Rating</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Pantau kepuasan pemain, reputasi venue, dan berikan respon pengelola pada ulasan terverifikasi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {reviews.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Yakin ingin menghapus seluruh riwayat ulasan yang ada?')) {
                  clearAllReviews()
                  showToast('Semua ulasan berhasil dikosongkan.')
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-danger/30 text-danger hover:bg-danger/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Hapus seluruh ulasan"
            >
              <Trash2 size={14} />
              <span>Kosongkan Semua Ulasan</span>
            </button>
          )}
          <span className="px-3 py-1.5 rounded-xl bg-star-filled/15 text-star-filled border border-amber-300/40 text-xs font-extrabold flex items-center gap-1">
            <Star size={14} className="fill-star-filled" />
            {avgRating} / 5.0 Rating Venue
          </span>
        </div>
      </div>

      {/* KPI Cards & Rating Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Cards (Left - 7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="bg-surface p-5 rounded-3xl border border-border shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase">Rata-Rata Rating</span>
              <div className="w-8 h-8 rounded-xl bg-star-filled/15 text-star-filled flex items-center justify-center">
                <Star size={16} className="fill-star-filled" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-text-primary">{avgRating}</span>
                <span className="text-xs text-text-muted font-bold">/ 5.0</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                {positiveRate}% Pemain Sangat Puas
              </p>
            </div>
          </div>

          <div className="bg-surface p-5 rounded-3xl border border-border shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase">Total Ulasan</span>
              <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                <MessageSquareQuote size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-text-primary">{totalReviews}</span>
              <p className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
                <ShieldCheck size={12} className="text-primary" /> 100% Terverifikasi Transaksi
              </p>
            </div>
          </div>

          <div className="bg-surface p-5 rounded-3xl border border-border shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase">Respon Pengelola</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CornerDownRight size={16} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-text-primary">{replyRate}%</span>
                <span className="text-xs text-text-muted font-bold">({repliedCount}/{totalReviews})</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                {totalReviews - repliedCount} ulasan menunggu balasan
              </p>
            </div>
          </div>

          <div className="bg-surface p-5 rounded-3xl border border-border shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase">Ulasan Unggulan</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Star size={16} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-text-primary">
                {reviews.filter((r) => r.is_featured).length}
              </span>
              <p className="text-[11px] text-purple-700 font-semibold mt-1">
                Ditampilkan pada Halaman Utama
              </p>
            </div>
          </div>
        </div>

        {/* 5-Star Distribution Graph (Right - 5 cols) */}
        <div className="lg:col-span-5 bg-surface p-6 rounded-3xl border border-border shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Distribusi Bintang Rating
            </h3>
            <span className="text-xs text-text-muted font-medium">Berdasarkan {totalReviews} Ulasan</span>
          </div>

          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starCounts[star] || 0
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-12 font-bold text-text-primary shrink-0">
                    <span>{star}</span>
                    <Star size={12} className="text-star-filled fill-star-filled" />
                  </div>
                  <div className="flex-1 h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        star >= 4 ? 'bg-amber-400' : star === 3 ? 'bg-amber-300' : 'bg-rose-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-text-muted text-[11px] font-mono">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cari pemain, lapangan, komentar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
            />
          </div>

          {/* Sport / Court Filter */}
          <CustomSelect
            value={selectedSport}
            onChange={setSelectedSport}
            options={sportOptions}
            placeholder="Pilih Lapangan"
          />

          {/* Rating Filter */}
          <CustomSelect
            value={selectedRating}
            onChange={setSelectedRating}
            options={ratingOptions}
            placeholder="Filter Rating"
          />

          {/* Reply Status Filter */}
          <CustomSelect
            value={selectedReplyStatus}
            onChange={setSelectedReplyStatus}
            options={replyStatusOptions}
            placeholder="Status Balasan"
          />
        </div>

        {/* Sub-bar: Sort & Result Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs">
          <div className="text-text-muted">
            Menampilkan <span className="font-bold text-text-primary">{filteredReviews.length}</span> ulasan
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-muted flex items-center gap-1 text-[11px] font-semibold">
              <ArrowUpDown size={12} /> Urutkan:
            </span>
            <div className="w-48">
              <CustomSelect
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                buttonClassName="py-1.5 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-surface rounded-3xl p-12 text-center border border-border text-text-muted space-y-2">
            <MessageSquareQuote size={40} className="mx-auto text-text-muted/40" />
            <p className="font-bold text-text-primary">Tidak Ada Ulasan yang Sesuai</p>
            <p className="text-xs">Coba ubah kata kunci pencarian atau filter yang Anda gunakan.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isFeatured = !!rev.is_featured
            const customerName = rev.customer_name || 'Pemain'
            const matchedCustomer = customers.find(
              (c) => c.name?.toLowerCase() === customerName.toLowerCase() ||
                     (rev.customer_email && c.email?.toLowerCase() === rev.customer_email.toLowerCase())
            )
            const avatarSrc = rev.avatar_url ||
              rev.customer_avatar ||
              matchedCustomer?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=2563eb&color=fff&bold=true&size=128`

            return (
              <div
                key={rev.id}
                className={`bg-surface rounded-3xl p-6 border transition-all space-y-4 shadow-2xs ${
                  isFeatured ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border'
                }`}
              >
                {/* Header Row: User info & Court badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarSrc}
                      alt={customerName}
                      className="w-11 h-11 rounded-2xl object-cover border border-border/80 shadow-2xs shrink-0 bg-surface"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=2563eb&color=fff&bold=true&size=128`
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-text-primary">{customerName}</h4>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                            <ShieldCheck size={11} /> Pemain Terverifikasi
                          </span>
                        )}
                        {isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">
                            ⭐ Unggulan
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {rev.date} {rev.booking_id && `• ID Booking: ${rev.booking_id}`}
                      </p>
                    </div>
                  </div>

                  {/* Court & Sport Badge */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-surface-container-low border border-border text-xs font-semibold text-text-primary flex items-center gap-1.5">
                      <SportIcon type={rev.court_type} className="w-3.5 h-3.5 text-primary" />
                      <span>{rev.court_name}</span>
                    </span>
                  </div>
                </div>

                {/* Star Rating & Comment Text */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        className={
                          star <= rev.rating
                            ? 'text-star-filled fill-star-filled'
                            : 'text-star-empty fill-star-empty'
                        }
                      />
                    ))}
                    <span className="text-xs font-extrabold text-text-primary ml-1.5">
                      {rev.rating}.0
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed bg-surface-container-low/60 p-4 rounded-2xl border border-border/60">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Admin Reply Box (if exists) */}
                {rev.admin_reply && (
                  <div className="pl-4 sm:pl-6 border-l-2 border-primary/40 space-y-2 py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <CornerDownRight size={13} />
                        Respon Pengelola Venue
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenReply(rev)}
                          className="text-text-muted hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Hapus balasan pengelola ini?')) {
                              deleteReply(rev.id)
                              showToast('Balasan pengelola berhasil dihapus.')
                            }
                          }}
                          className="text-text-muted hover:text-danger transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed bg-primary-light/50 p-3 rounded-xl border border-primary/20">
                      {rev.admin_reply}
                    </p>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                  <div className="flex items-center gap-2">
                    {!rev.admin_reply ? (
                      <button
                        type="button"
                        onClick={() => handleOpenReply(rev)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <CornerDownRight size={13} /> Balas Ulasan
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={13} /> Sudah Dibalas
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        toggleFeatured(rev.id)
                        showToast(
                          !isFeatured
                            ? 'Ulasan ditandai sebagai ulasan unggulan di beranda.'
                            : 'Ulasan dihapus dari daftar unggulan.'
                        )
                      }}
                      className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isFeatured
                          ? 'bg-purple-50 text-purple-700 border-purple-300'
                          : 'border-border text-text-primary hover:bg-surface-container-low'
                      }`}
                    >
                      <Star size={13} className={isFeatured ? 'fill-purple-700 text-purple-700' : ''} />
                      {isFeatured ? 'Unggulan' : 'Jadikan Unggulan'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Yakin ingin menghapus ulasan ini secara permanen?')) {
                        deleteReview(rev.id)
                        showToast('Ulasan berhasil dihapus.')
                      }
                    }}
                    className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    title="Hapus Ulasan"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Reply Modal */}
      {replyingReviewId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-border space-y-5 animate-slide-in relative">
            <button
              type="button"
              onClick={() => setReplyingReviewId(null)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-xs font-bold text-primary uppercase">Respon Pengelola</span>
              <h3 className="text-lg font-bold text-text-primary mt-0.5">
                Balas Ulasan Pelanggan
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Balasan Anda akan terlihat secara publik di bawah komentar pemain.
              </p>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-text-muted uppercase">Template Cepat:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickTemplate(
                      'Terima kasih banyak atas ulasan positifnya! Senang bisa memberikan pengalaman bermain yang nyaman. Ditunggu jadwal main berikutnya di court.in! 🙏'
                    )
                  }
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-container-low border border-border text-text-primary hover:bg-surface-container transition-colors cursor-pointer text-left truncate max-w-xs"
                >
                  🙏 Terima Kasih & Apresiasi
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickTemplate(
                      'Halo, terima kasih atas masukannya yang sangat berharga. Kami telah berkoordinasi dengan tim operasional untuk segera menindaklanjuti hal ini demi kenyamanan Anda.'
                    )
                  }
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-container-low border border-border text-text-primary hover:bg-surface-container transition-colors cursor-pointer text-left truncate max-w-xs"
                >
                  💡 Tindak Lanjut Masukan
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-4 text-xs">
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis tanggapan atau balasan resmi pengelola venue..."
                className="w-full p-3.5 bg-surface-container-low border border-border rounded-2xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingReviewId(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-text-primary font-bold hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Send size={14} /> Publikasikan Balasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

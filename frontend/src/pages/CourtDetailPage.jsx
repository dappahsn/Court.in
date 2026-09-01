import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin, Star, Calendar as CalendarIcon, Clock,
  ChevronLeft, ArrowRight, ShieldCheck, Share2, Heart,
  ShowerHead, Coffee, Car, Wifi, Flame, Wind
} from 'lucide-react'
import useCourtStore from '../stores/courtStore'
import useBookingStore from '../stores/bookingStore'
import useAuthStore from '../stores/authStore'
import useReviewStore from '../stores/reviewStore'
import useCustomerStore from '../stores/customerStore'
import useSettingsStore from '../stores/settingsStore'
import SportIcon from '../components/SportIcon'
import DatePicker from '../components/DatePicker'
import { getCourtSlotsForDate } from '../utils/slotHelper'

const FACILITY_ICONS = {
  shower: ShowerHead,
  canteen: Coffee,
  parking: Car,
  wifi: Wifi,
  ac: Wind,
  light: Flame,
  racket: ShieldCheck,
  locker: ShieldCheck,
}

export default function CourtDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { courts, manualLocks } = useCourtStore()
  const { bookings, setDraftBooking } = useBookingStore()
  const { isAuthenticated, user } = useAuthStore()
  const { reviews } = useReviewStore()
  const { customers } = useCustomerStore()
  const { settings } = useSettingsStore()

  const court = courts.find((c) => c.id === id) || courts[0]

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [rawSelectedSlot, setRawSelectedSlot] = useState('')
  const [copied, setCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Live reviews for this court strictly from reviewStore
  const courtLiveReviews = useMemo(() => {
    return reviews.filter((r) => r.court_id === court?.id)
  }, [reviews, court])

  const liveAvgRating = useMemo(() => {
    if (courtLiveReviews.length === 0) return null
    const sum = courtLiveReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0)
    return (sum / courtLiveReviews.length).toFixed(1)
  }, [courtLiveReviews])

  // Compute live slots for this court and selected date
  const dynamicSlots = useMemo(() => {
    return getCourtSlotsForDate(court, selectedDate, bookings, manualLocks)
  }, [court, selectedDate, bookings, manualLocks])

  const isSlotValid = dynamicSlots.find((s) => s.time === rawSelectedSlot)?.isAvailable
  const selectedSlot = isSlotValid ? rawSelectedSlot : ''

  // Price calculations
  const courtFee = court.price_per_hour
  const serviceFee = settings?.service_fee ?? 2000
  const totalPrice = selectedSlot ? courtFee + serviceFee : 0

  const handleProceedToBooking = () => {
    if (!selectedSlot) return

    const [start_time, end_time] = selectedSlot.split(' - ')

    setDraftBooking({
      court,
      court_id: court.id,
      court_name: court.name,
      court_type: court.type,
      booking_date: selectedDate,
      time_slot: selectedSlot,
      start_time: start_time || '19:00',
      end_time: end_time || '20:00',
      total_price: totalPrice,
      court_fee: courtFee,
      service_fee: serviceFee,
    })

    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: court.name,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Kembali ke Jelajah</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors relative cursor-pointer"
            title="Bagikan"
          >
            <Share2 size={16} />
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[10px] py-1 px-2 rounded-lg font-medium whitespace-nowrap shadow-md">
                Link Disalin!
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                navigate(`/login?redirect=${encodeURIComponent('/courts/' + court.id)}`)
                return
              }
              setIsLiked(!isLiked)
            }}
            className={`p-2 rounded-xl border border-border bg-surface transition-colors cursor-pointer ${
              isLiked ? 'text-danger fill-danger' : 'text-text-secondary hover:text-text-primary'
            }`}
            title="Simpan Favorit"
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* Hero Visual Banner */}
      <div className="relative aspect-[16/8] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-border shadow-xs">
        <img
          src={court.image_url}
          alt={court.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-surface/90 backdrop-blur-md text-text-primary text-xs font-semibold px-3 py-1 rounded-lg shadow-2xs">
            {court.environment}
          </span>
          <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-2xs inline-flex items-center gap-1.5">
            <SportIcon type={court.type} className="w-3.5 h-3.5" />
            <span>{court.type}</span>
          </span>
        </div>

        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white max-w-xl">
          <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-3 py-1 rounded-md backdrop-blur-sm mb-2 inline-block">
            {court.surface}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold line-clamp-1 drop-shadow-sm">
            {court.name}
          </h2>
        </div>
      </div>

      {/* Main Content Grid: Details (Left) + Booking Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: Court Info, Facilities, Description, Reviews (8 cols) ── */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Title & Rating */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-star-filled/15 text-text-primary px-2.5 py-1 rounded-lg text-xs font-bold">
                <Star size={13} className="text-star-filled fill-star-filled" />
                <span>{court.rating}</span>
                <span className="text-text-muted font-normal">({court.reviews_count} ulasan)</span>
              </div>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-xs text-primary font-semibold">{court.surface}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              {court.name}
            </h1>
            <p className="text-sm text-text-secondary flex items-start gap-1.5">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <span>{court.address}</span>
            </p>
          </div>

          {/* Facilities */}
          <div className="bg-surface rounded-2xl p-6 border border-border space-y-4">
            <h3 className="text-base font-bold text-text-primary">Fasilitas Venue</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {court.facilities.map((fac, idx) => {
                const IconComponent = FACILITY_ICONS[fac.icon] || ShieldCheck
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low border border-border/60"
                  >
                    <IconComponent size={16} className="text-primary shrink-0" />
                    <span className="text-sm font-medium text-text-primary truncate">
                      {fac.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface rounded-2xl p-6 border border-border space-y-3">
            <h3 className="text-base font-bold text-text-primary">Deskripsi Lapangan</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {court.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="bg-surface rounded-2xl p-6 border border-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary">Ulasan Terverifikasi</h3>
                <p className="text-xs text-text-muted mt-0.5">Dari pemain yang telah selesai bermain di venue ini</p>
              </div>
              {liveAvgRating ? (
                <div className="flex items-center gap-1.5 bg-star-filled/15 text-text-primary px-3 py-1.5 rounded-xl font-bold text-sm">
                  <Star size={14} className="text-star-filled fill-star-filled" />
                  <span>{liveAvgRating}</span>
                  <span className="text-text-muted text-xs font-normal">/ 5.0 ({courtLiveReviews.length})</span>
                </div>
              ) : (
                <span className="text-xs text-text-muted font-medium bg-surface-container-low px-2.5 py-1 rounded-lg border border-border">
                  0 Ulasan
                </span>
              )}
            </div>

            {/* Reviews List */}
            {courtLiveReviews.length > 0 ? (
              <div className="space-y-3">
                {courtLiveReviews.map((rev) => {
                  const customerName = rev.customer_name || rev.user_name || 'Pemain'
                  const matchedCustomer = customers.find(
                    (c) => c.name?.toLowerCase() === customerName.toLowerCase() ||
                           (rev.customer_email && c.email?.toLowerCase() === rev.customer_email.toLowerCase())
                  )
                  const currentUserAvatar = (user?.full_name?.toLowerCase() === customerName.toLowerCase() || (user?.email && rev.customer_email && user.email.toLowerCase() === rev.customer_email.toLowerCase()))
                    ? (user?.avatar_url || (user?.email ? localStorage.getItem('courtin_avatar_' + user.email.toLowerCase()) : null))
                    : null

                  const avatarSrc = rev.avatar_url ||
                    rev.customer_avatar ||
                    matchedCustomer?.avatar_url ||
                    currentUserAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=2563eb&color=fff&bold=true&size=128`

                  return (
                    <div key={rev.id} className="p-4 rounded-2xl bg-surface-container-low border border-border/60 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarSrc}
                            alt={customerName}
                            className="w-10 h-10 rounded-full object-cover border border-border/80 shadow-2xs shrink-0 bg-surface"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=2563eb&color=fff&bold=true&size=128`
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-text-primary">
                                {customerName}
                              </p>
                              {rev.verified && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                                  Terverifikasi
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-text-muted">{rev.date}</p>
                          </div>
                        </div>
                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              className={
                                star <= rev.rating
                                  ? 'text-star-filled fill-star-filled'
                                  : 'text-star-empty fill-star-empty'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed pl-1">
                        "{rev.comment}"
                      </p>

                      {/* Admin Reply if exists */}
                      {rev.admin_reply && (
                        <div className="mt-2 pl-3.5 border-l-2 border-primary/40 bg-primary-light/40 p-2.5 rounded-r-xl space-y-1">
                          <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                            Respon Pengelola Venue:
                          </span>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {rev.admin_reply}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-surface-container-low/40 rounded-2xl border border-dashed border-border/80 p-6 space-y-1.5">
                <p className="text-sm font-bold text-text-primary">Belum Ada Ulasan</p>
                <p className="text-xs text-text-secondary">Ulasan dari pemain yang telah selesai bermain akan otomatis tampil di sini.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Interactive Schedule & Sticky Booking Card ── */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-lg shadow-slate-200/50 space-y-6">
            <div>
              <span className="text-xs font-semibold text-text-muted block">Harga Sewa</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                  Rp{court.price_per_hour.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-text-muted">/ jam</span>
              </div>
            </div>

            {/* 1. Date Selector (Clean Custom Date Picker Only) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                <CalendarIcon size={14} className="text-primary" />
                Pilih Tanggal
              </label>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* 2. Time Slots Picker */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-wider">
                  <Clock size={14} className="text-primary" />
                  Slot Jam
                </label>
                <div className="flex items-center gap-3 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-primary"></span> Tersedia
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary"></span> Dipilih
                  </span>
                </div>
              </div>

              {/* Slot grid */}
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {dynamicSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.time
                  const isAvailable = slot.isAvailable

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setRawSelectedSlot(slot.time)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                        !isAvailable
                          ? 'bg-surface-container text-text-muted/50 cursor-not-allowed border border-border/40 line-through'
                          : isSelected
                          ? 'bg-primary text-white border-2 border-primary shadow-xs font-bold cursor-pointer'
                          : 'border border-border text-text-primary hover:border-primary/50 hover:bg-primary-light cursor-pointer'
                      }`}
                    >
                      <span>{slot.time}</span>
                      {!isAvailable && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider no-underline ${
                          slot.isPast ? 'text-text-muted' : 'text-rose-500'
                        }`}>
                          {slot.isPast ? 'Lewat Jam' : slot.booking ? 'Terisi' : 'Terkunci'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Summary Breakdown */}
            <div className="pt-4 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Durasi</span>
                <span className="font-semibold text-text-primary">1 Jam</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Biaya Lapangan</span>
                <span className="font-semibold text-text-primary">Rp{courtFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Biaya Layanan</span>
                <span className="font-semibold text-text-primary">Rp{serviceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between font-bold text-base">
                <span>Total Bayar</span>
                <span className="text-primary font-extrabold text-lg">
                  Rp{totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={handleProceedToBooking}
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight size={16} />
            </button>

            <p className="text-[11px] text-center text-text-muted">
              Slot otomatis diamankan selama 15 menit pada proses pembayaran
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

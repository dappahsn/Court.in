import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, ShieldCheck, Zap, CreditCard, ArrowRight } from 'lucide-react'
import useCourtStore from '../stores/courtStore'
import SportIcon from '../components/SportIcon'
import DatePicker from '../components/DatePicker'
import SportPicker from '../components/SportPicker'

const CATEGORIES = [
  {
    type: 'FUTSAL',
    label: 'Futsal',
    image: '/images/futsal.jpg',
    courts: '12 Lapangan Mitra',
  },
  {
    type: 'BADMINTON',
    label: 'Badminton',
    image: '/images/badminton.jpg',
    courts: '18 Lapangan Mitra',
  },
  {
    type: 'PADEL',
    label: 'Padel',
    image: '/images/padel.jpg',
    courts: '8 Lapangan Mitra',
  },
]

export default function HomePage() {
  const { courts } = useCourtStore()
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const featuredCourts = courts.slice(0, 4)

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* ── 1. Hero Section (Minimalist, Spacious & Elegant) ── */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-border bg-gradient-to-b from-surface via-surface-container-low/40 to-bg-app">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5 mb-10">
            {/* Typography */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
              Pesan Lapangan Olahraga <br className="hidden sm:inline" />
              <span className="text-primary">Lebih Praktis & Pasti</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
              Jadwal real-time, pilih jam bermain, dan konfirmasi instan via QRIS atau bayar langsung di lokasi tanpa risiko dobel booking.
            </p>
          </div>

          {/* Search Card (Floating, Minimalist & Focused) */}
          <div className="max-w-3xl mx-auto bg-surface rounded-2xl p-3 sm:p-4 border border-border shadow-xl shadow-slate-200/50">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                window.location.href = `/explore?type=${selectedSport}&date=${selectedDate}`
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              {/* Custom Bespoke Sport Picker */}
              <div className="sm:col-span-5 p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Cabang Olahraga
                </label>
                <SportPicker
                  value={selectedSport}
                  onChange={setSelectedSport}
                />
              </div>

              {/* Divider on Desktop */}
              <div className="hidden sm:block w-px h-10 bg-border" />

              {/* Bespoke Interactive Date Picker */}
              <div className="sm:col-span-4 p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Tanggal Main
                </label>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  minDate={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Submit CTA */}
              <div className="sm:col-span-2 sm:ml-auto w-full">
                <button
                  type="submit"
                  className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all text-sm cursor-pointer"
                >
                  <Search size={16} />
                  <span>Cari</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs text-text-muted font-medium">Pilihan Cepat:</span>
            {['FUTSAL', 'BADMINTON', 'PADEL'].map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() => setSelectedSport(selectedSport === sport ? '' : sport)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedSport === sport
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface border border-border text-text-secondary hover:border-text-muted hover:text-text-primary'
                }`}
              >
                <SportIcon type={sport} className="w-3.5 h-3.5" />
                <span>{sport === 'FUTSAL' ? 'Futsal' : sport === 'BADMINTON' ? 'Badminton' : 'Padel'}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Kategori Olahraga Grid ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
              Kategori
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Pilihan Cabang Olahraga
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-primary hover:text-primary-container flex items-center gap-1 transition-colors group"
          >
            Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.type}
              to={`/explore?type=${cat.type}`}
              className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/50 shadow-xs hover:shadow-xl transition-all duration-300 h-44 sm:h-48 flex flex-col justify-end p-6 bg-surface-container"
            >
              {/* Background Clean Photo */}
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Soft Dark Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

              <div className="relative z-10 flex items-center justify-between text-white">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20 group-hover:scale-105 transition-transform">
                    <SportIcon type={cat.type} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-white/75">{cat.courts}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Rekomendasi Lapangan Unggulan (Grid 4 Kolom) ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
              Rekomendasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Lapangan Favorit & Terpopuler
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-primary hover:text-primary-container flex items-center gap-1 transition-colors group"
          >
            Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourts.map((court) => (
            <Link
              key={court.id}
              to={`/courts/${court.id}`}
              className="group bg-surface rounded-2xl border border-border hover:border-primary/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] bg-surface-container overflow-hidden">
                <img
                  src={court.image_url}
                  alt={court.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-surface/90 backdrop-blur-xs text-text-primary text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                    {court.environment}
                  </span>
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs inline-flex items-center gap-1">
                    <SportIcon type={court.type} className="w-3 h-3" />
                    <span>{court.type}</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                    <span>{court.location}</span>
                    <div className="flex items-center gap-1 font-bold text-text-primary">
                      <Star size={12} className="text-star-filled fill-star-filled" />
                      <span>{court.rating}</span>
                      <span className="text-text-muted font-normal">({court.reviews_count})</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                    {court.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {court.surface}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-text-muted block">Mulai dari</span>
                    <span className="text-sm font-extrabold text-text-primary">
                      Rp{court.price_per_hour.toLocaleString('id-ID')}
                      <span className="text-[10px] font-normal text-text-muted">/jam</span>
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    Detail <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Value Propositions (3 Pilar Utama) ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-border shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Kenapa Memilih court.in?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Standar Terbaik Booking Lapangan Olahraga
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0 shadow-2xs">
                <Zap size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-text-primary">Jadwal Real-Time</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Slot jam yang Anda lihat selalu akurat secara langsung dari sistem komputer masing-masing venue.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-text-primary">Bebas Dobel Booking</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Slot otomatis dikunci saat Anda melakukan proses checkout sehingga tidak akan diambil pengguna lain.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0 shadow-2xs">
                <CreditCard size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-text-primary">Bayar Fleksibel</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Pilihan pembayaran instan QRIS (GoPay, OVO, Dana, M-Banking) atau bayar langsung di tempat saat bermain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Clean Minimalist CTA Section ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border p-8 sm:p-12 text-center space-y-6 shadow-xs">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Siap Bertanding Hari Ini?
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Jelajahi puluhan pilihan lapangan futsal, badminton, dan padel terbaik di dekat Anda. Booking mudah hanya dalam hitungan detik.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/explore"
              className="px-6 py-3.5 bg-primary hover:bg-primary-container text-white font-semibold rounded-xl text-sm shadow-xs transition-all"
            >
              Cari Lapangan Sekarang
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-surface-container-low hover:bg-surface-container text-text-primary font-semibold rounded-xl text-sm transition-all border border-border"
            >
              Hubungi Bantuan
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

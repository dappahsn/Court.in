import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import useCourtStore from '../stores/courtStore'
import SportPicker from '../components/SportPicker'
import DatePicker from '../components/DatePicker'
import SportIcon from '../components/SportIcon'

const CATEGORY_CARDS = [
  {
    type: 'FUTSAL',
    title: 'Futsal',
    desc: 'Lapangan Futsal sintetis dan vinyl',
    image: '/images/futsal.jpg',
    link: '/explore?type=FUTSAL',
  },
  {
    type: 'PADEL',
    title: 'Padel',
    desc: 'Lapangan padel indoor dan outdoor',
    image: '/images/padel.jpg',
    link: '/explore?type=PADEL',
  },
  {
    type: 'BADMINTON',
    title: 'Badminton',
    desc: 'Lapangan karpet standar BWF.',
    image: '/images/badminton.jpg',
    link: '/explore?type=BADMINTON',
  },
]

export default function HomePage() {
  const { courts } = useCourtStore()
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const popularCourts = courts.slice(0, 4)

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* ── 1. Hero Section With Interactive Search Card ── */}
      <section className="relative w-full overflow-hidden pt-12 sm:pt-16 pb-16 sm:pb-24">
        {/* Background Image & Blue Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_sky.jpg"
            alt="Sports Stadium"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/75 to-sky-900/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-7">
          <div className="max-w-2xl space-y-4 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
              Booking Lapangan<br />
              Jadi Lebih Mudah
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-slate-100/90 max-w-lg leading-relaxed font-normal">
              Temukan dan pesan lapangan olahraga terbaik di sekitarmu dengan cepat dan aman.
            </p>
          </div>

          {/* Interactive Search Card */}
          <div className="max-w-3xl bg-surface/98 backdrop-blur-md rounded-3xl p-3 sm:p-4 border border-border/80 shadow-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                window.location.href = `/explore?type=${selectedSport}&date=${selectedDate}`
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              {/* Sport Picker */}
              <div className="sm:col-span-5 p-2 rounded-2xl hover:bg-surface-container-low transition-colors">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Cabang Olahraga
                </label>
                <SportPicker
                  value={selectedSport}
                  onChange={setSelectedSport}
                />
              </div>

              {/* Divider on Desktop */}
              <div className="hidden sm:block w-px h-10 bg-border" />

              {/* Date Picker */}
              <div className="sm:col-span-4 p-2 rounded-2xl hover:bg-surface-container-low transition-colors">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
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
                  className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white font-bold rounded-2xl shadow-sm hover:shadow transition-all text-sm cursor-pointer"
                >
                  <Search size={17} />
                  <span>Cari</span>
                </button>
              </div>
            </form>
          </div>

          {/* Pilihan Cepat Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-white/85 font-medium">Pilihan Cepat:</span>
            {[
              { label: 'Futsal', type: 'FUTSAL' },
              { label: 'Badminton', type: 'BADMINTON' },
              { label: 'Padel', type: 'PADEL' },
            ].map((s) => (
              <button
                key={s.type}
                type="button"
                onClick={() => {
                  setSelectedSport(s.type)
                  window.location.href = `/explore?type=${s.type}`
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 font-semibold shadow-xs hover:shadow transition-all cursor-pointer text-xs"
              >
                <SportIcon type={s.type} className="w-3.5 h-3.5 text-primary" />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Three Sport Categories Cards ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORY_CARDS.map((cat) => (
            <div
              key={cat.type}
              className="relative h-60 sm:h-64 rounded-3xl overflow-hidden shadow-md group flex flex-col justify-end p-6 border border-border/40"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

              <div className="relative z-10 space-y-2 text-left">
                <h3 className="text-xl font-black text-white tracking-wide">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-200/90 leading-relaxed font-normal">
                  {cat.desc}
                </p>
                <div className="pt-1">
                  <Link
                    to={cat.link}
                    className="inline-block px-5 py-2 bg-white text-slate-900 font-bold text-xs rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    Lihat Lapangan
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Lapangan Terpopuler ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Lapangan Terpopuler
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Pilihan terbaik berdasarkan ulasan pengguna kami
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCourts.map((court) => (
            <div
              key={court.id}
              className="bg-surface rounded-3xl border border-border/80 p-3 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Court Image */}
                <div className="h-44 rounded-2xl overflow-hidden relative">
                  <img
                    src={court.image_url}
                    alt={court.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Court Info */}
                <div className="px-1 space-y-1 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-text-primary truncate">
                      {court.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-text-muted bg-surface-container-low px-2 py-0.5 rounded-md shrink-0 border border-border/60">
                      {court.type}
                    </span>
                  </div>

                  <p className="text-xs text-text-muted">
                    {court.location || 'Indonesia'}
                  </p>

                  <p className="text-xs font-black text-text-primary pt-1">
                    Rp {court.price_per_hour.toLocaleString('id-ID')}<span className="font-normal text-text-muted text-[11px]">/jam</span>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 px-1">
                <Link
                  to={`/courts/${court.id}`}
                  className="block w-full py-2.5 bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-bold rounded-xl border border-border/80 transition-colors text-center shadow-2xs"
                >
                  Detail
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="text-center pt-2">
          <Link
            to="/explore"
            className="inline-block px-7 py-3 bg-surface-container-low hover:bg-surface-container border border-border text-text-primary text-xs font-bold rounded-full transition-colors shadow-2xs"
          >
            Lihat Semua Lapangan
          </Link>
        </div>
      </section>

      {/* ── 4. Rekomendasi Untukmu (Bento Grid) ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Rekomendasi Untukmu
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Pilihan lapangan berdasarkan aktivitasmu.
          </p>
        </div>

        {/* Bento Grid: 1 Large Card on Left, 2 Stacked Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Large Card: Lapangan Premium */}
          <div className="lg:col-span-7 h-[360px] sm:h-[420px] rounded-3xl overflow-hidden relative shadow-md group flex flex-col justify-end p-8 border border-border/40">
            <img
              src="/images/premium_court.jpg"
              alt="Lapangan Premium"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="relative z-10 space-y-3 text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Lapangan Premium
              </h3>
              <div>
                <Link
                  to="/explore"
                  className="inline-block px-6 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                >
                  Lihat Semua
                </Link>
              </div>
            </div>
          </div>

          {/* Right Stacked Cards: Indoor & Outdoor */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Top Card: Indoor */}
            <div className="h-[170px] sm:h-[198px] rounded-3xl overflow-hidden relative shadow-md group flex flex-col justify-start p-6 border border-border/40">
              <img
                src="/images/indoor_court.jpg"
                alt="Indoor Courts"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

              <div className="relative z-10 space-y-2 text-left">
                <h3 className="text-xl font-black text-white tracking-wide">
                  Indoor
                </h3>
                <div>
                  <Link
                    to="/explore?env=Indoor"
                    className="inline-block px-5 py-2 bg-white text-slate-900 font-bold text-xs rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    Lihat Semua
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Card: Outdoor */}
            <div className="h-[170px] sm:h-[198px] rounded-3xl overflow-hidden relative shadow-md group flex flex-col justify-start p-6 border border-border/40">
              <img
                src="/images/outdoor_court.jpg"
                alt="Outdoor Courts"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

              <div className="relative z-10 space-y-2 text-left">
                <h3 className="text-xl font-black text-white tracking-wide">
                  Outdoor
                </h3>
                <div>
                  <Link
                    to="/explore?env=Outdoor"
                    className="inline-block px-5 py-2 bg-white text-slate-900 font-bold text-xs rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    Lihat Semua
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Action Motivational Banner ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-60 sm:h-72 rounded-3xl overflow-hidden shadow-lg flex items-center justify-center text-center p-6 border border-border/40 group">
          <img
            src="/images/action_banner.jpg"
            alt="Sports Community Action Banner"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />

          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              Mulai Aktivitas Sehatmu Hari Ini.
            </h2>
            <div>
              <Link
                to="/register"
                className="inline-block px-8 py-3.5 bg-white text-slate-900 font-bold text-xs sm:text-sm rounded-full shadow-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

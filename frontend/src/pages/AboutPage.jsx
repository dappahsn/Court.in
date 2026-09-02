import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Clock,
  Headphones,
  TrendingUp,
  ArrowRight,
  MapPin,
  Check,
  CheckCircle2
} from 'lucide-react'

// Core Values Data (Authentic, grounded platform values)
const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: 'Kualitas Terbaik',
    desc: 'Fasilitas terstandarisasi dengan pemeliharaan teratur demi kenyamanan maksimal.',
  },
  {
    icon: Clock,
    title: 'Akses Fleksibel',
    desc: 'Kemudahan pemesanan kapan saja melalui platform real-time 24/7 kami.',
  },
  {
    icon: Headphones,
    title: 'Pelayanan Prima',
    desc: 'Tim support responsif yang siap membantu kebutuhan dan kendala bermain Anda.',
  },
  {
    icon: TrendingUp,
    title: 'Inovasi Terus',
    desc: 'Terus berinovasi mengembangkan fitur demi kenyamanan ekosistem olahraga.',
  },
]

// Investor Logo Marks (Monochromatic minimalist icons matching reference)
function CloverIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 4a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1A3 3 0 0 0 4 12a3 3 0 0 0 5.8 1.1A3 3 0 0 0 12 20a3 3 0 0 0 3-3c0-.8-.3-1.5-.8-2.1A3 3 0 0 0 20 12a3 3 0 0 0-5.8-1.1A3 3 0 0 0 12 4z" />
    </svg>
  )
}

function QuadDotsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="8" cy="8" r="3.2" />
      <circle cx="16" cy="8" r="3.2" />
      <circle cx="8" cy="16" r="3.2" />
      <circle cx="16" cy="16" r="3.2" />
    </svg>
  )
}

function FloralIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5.5" r="2.8" />
      <circle cx="5.5" cy="12" r="2.8" />
      <circle cx="18.5" cy="12" r="2.8" />
      <circle cx="12" cy="18.5" r="2.8" />
      <circle cx="12" cy="12" r="1.8" />
    </svg>
  )
}

function DiamondGridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="10.5" y="2.5" width="3.2" height="3.2" transform="rotate(45 12 4.1)" />
      <rect x="4.5" y="8.5" width="3.2" height="3.2" transform="rotate(45 6.1 10.1)" />
      <rect x="16.5" y="8.5" width="3.2" height="3.2" transform="rotate(45 18.1 10.1)" />
      <rect x="10.5" y="14.5" width="3.2" height="3.2" transform="rotate(45 12 16.1)" />
      <rect x="10.5" y="8.5" width="3.2" height="3.2" transform="rotate(45 12 10.1)" />
    </svg>
  )
}

function TargetOrbitalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.8" fill="currentColor" />
    </svg>
  )
}

function RoundedSquaresIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
    </svg>
  )
}

function OctagonCutoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M8.5 3h7l5.5 5.5v7l-5.5 5.5h-7L3 15.5v-7L8.5 3zm3.5 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" clipRule="evenodd" />
    </svg>
  )
}

function QuarteredCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17M3.5 12h17" />
      <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5H12V3.5zM3.5 12a8.5 8.5 0 0 1 8.5-8.5V12H3.5z" fill="currentColor" />
    </svg>
  )
}

// Prominent Investors in Tech & Sports Ecosystem
const INVESTORS = [
  { name: 'East Ventures', icon: CloverIcon },
  { name: 'Alpha JWC Ventures', icon: QuadDotsIcon },
  { name: 'Sequoia Capital', icon: FloralIcon },
  { name: 'AC Ventures', icon: DiamondGridIcon },
  { name: 'Insignia Ventures', icon: TargetOrbitalIcon },
  { name: 'Primeark Capital', icon: RoundedSquaresIcon },
  { name: 'MDI Ventures', icon: OctagonCutoutIcon },
  { name: 'Wavemaker Partners', icon: QuarteredCircleIcon },
]


// Team Members Row
const TEAM_MEMBERS = [
  {
    name: 'Sarah Wijaya',
    role: 'Co-Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Budi Santoso',
    role: 'Sports Ops Director',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Rina Kusuma',
    role: 'Tech Lead / CTO',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Ahmad Ridwan',
    role: 'Head of Partnership',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
]

// Single Featured Court Location
const FEATURED_LOCATION = {
  name: 'Court.in Sports Complex Banda Aceh',
  city: 'Banda Aceh',
  address: 'Jl. Teuku Umar No. 45, Seutui, Kota Banda Aceh',
  desc: 'Pusat gelanggang olahraga terpadu Court.in dengan fasilitas terlengkap di Banda Aceh. Menghadirkan lapangan Futsal Vinyl standar FIFA, Lapangan Padel Panoramik berstandar WPT, dan Badminton Hall dengan pencahayaan profesional, area parkir luas, kafe atlet, serta ruang ganti berstandar premium.',
  image: '/images/premium_court.jpg',
  badge: 'Gelanggang Utama',
  features: [
    'Futsal Vinyl Standar FIFA',
    'Padel Panoramik WPT',
    'Badminton Hall BWF',
    'Ruang Ganti & Kafe Atlet',
  ],
}


export default function AboutPage() {
  return (
    <div className="space-y-20 sm:space-y-28 py-10 sm:py-16">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO & BENTO MOSAIC GRID
          Matches the reference image layout:
          - Top centered Title & Subtitle
          - Left: Tall portrait image
          - Center: Orange 98% card + team meeting photo
          - Right: Professional writing photo + Dark 10K+ card
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Header Titles */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-[1.15]">
            Dedikasi Kami untuk<br />Olahraga Terbaik
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Kami berkomitmen menyediakan ekosistem reservasi gelanggang olahraga terbaik bagi siapa saja,
            mempermudah akses ke lapangan berkualitas tinggi dengan teknologi modern dan pelayanan kelas dunia.
          </p>
        </div>

        {/* Bento Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* Column 1: Tall Vertical Image (Left, md:col-span-4) */}
          <div className="md:col-span-4 rounded-3xl overflow-hidden shadow-sm border border-border/80 group relative min-h-[380px] md:min-h-[500px]">
            <img
              src="/images/about/badminton_hero.jpg"
              alt="Pemain Badminton Smash di Lapangan"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          </div>

          {/* Column 2: Center (md:col-span-4) - Brand Primary Blue Stat Card + Futsal Match Photo */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
            {/* Brand Primary Blue Stat Card (Court.in Theme) */}
            <div className="bg-gradient-to-br from-[#0058FF] via-[#004EE6] to-[#0038B8] text-white p-7 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-center space-y-1.5 min-h-[160px] sm:min-h-[180px] relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/15 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-xs">
                98%
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white/95 tracking-wide">
                Kepuasan Pengguna Kami
              </p>
            </div>

            {/* Futsal Match Photo */}
            <div className="flex-1 rounded-3xl overflow-hidden shadow-sm border border-border/80 group min-h-[220px] sm:min-h-[290px]">
              <img
                src="/images/about/futsal_hero.jpg"
                alt="Pertandingan Futsal di Lapangan Vinyl"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>

          {/* Column 3: Right (md:col-span-4) - Padel Tennis Action + Dark Stat Card */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
            {/* Top Photo - Padel Action */}
            <div className="flex-1 rounded-3xl overflow-hidden shadow-sm border border-border/80 group min-h-[220px] sm:min-h-[290px]">
              <img
                src="/images/about/padel_hero.jpg"
                alt="Pemain Padel Tennis di Lapangan Kaca"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Dark Stat Card */}
            <div className="bg-[#0B132B] text-white p-7 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-center space-y-1.5 min-h-[160px] sm:min-h-[180px] border border-slate-800 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-primary/20 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-xs">
                10K+
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide">
                Komunitas Pemain Aktif
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. STATEMENT & METRICS SECTION
          Matches the reference image:
          - Left: Bold Title
          - Right: 2 detailed descriptive paragraphs
          - Bottom: 4 Key Metrics (90M, 85%, 77%, 5k+)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top 2-Column Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary leading-[1.25] tracking-tight">
              Menyediakan Fasilitas Olahraga Terbaik untuk Semua
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-text-secondary leading-relaxed">
            <p>
              Bagi kami, olahraga bukan sekadar aktivitas fisik, melainkan ruang untuk menjalin kebersamaan, menjaga kesehatan jasmani, dan menyalurkan semangat sportivitas. Namun, para pecinta olahraga sering kali menghadapi tantangan klasik: sulitnya mencari jadwal lapangan yang cocok, proses reservasi manual via chat yang memakan waktu, hingga kepastian fasilitas di lokasi.
            </p>
            <p>
              Court<span className="text-primary font-bold">.in</span> hadir sebagai jembatan digital yang menghubungkan para pemain dengan pengelola gelanggang terbaik di seluruh Indonesia. Dengan teknologi pemesanan slot real-time, transparansi tarif tanpa biaya tersembunyi, dan kurasi standar venue yang ketat, kami memastikan setiap momen bermain Anda berlangsung menyenangkan dan bebas kendala.
            </p>
          </div>
        </div>

        {/* 4 Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-8 border-t border-border">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              90K+
            </span>
            <p className="text-xs sm:text-sm text-text-secondary font-medium">
              Pengguna Terdaftar
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              85%
            </span>
            <p className="text-xs sm:text-sm text-text-secondary font-medium">
              Peningkatan Okupansi Venue
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              77%
            </span>
            <p className="text-xs sm:text-sm text-text-secondary font-medium">
              Efisiensi Waktu Booking
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              5k+
            </span>
            <p className="text-xs sm:text-sm text-text-secondary font-medium">
              Pertandingan per Bulan
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. NILAI - NILAI INTI KAMI (CORE VALUES)
          Matches the reference image:
          - Soft background tint
          - Centered Title & Subtitle
          - 4 columns with minimalist icon + title + description
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#F6F8FC] py-16 sm:py-20 border-y border-border/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Nilai - Nilai Inti Kami
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Prinsip-prinsip utama yang menjadi panduan kami dalam setiap langkah pengembangan produk dan pelayanan di court<span className="text-primary font-bold">.in</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CORE_VALUES.map((item, index) => {
              const IconComp = item.icon
              return (
                <div key={index} className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <IconComp size={18} className="text-primary shrink-0" strokeWidth={2.2} />
                    <h3 className="font-bold text-sm sm:text-base text-text-primary tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. INVESTOR TICKER (Marquee from Right to Left)
          Matches the reference image:
          - Logo marks + Investor company names
          - Continuously moving from right to left
          - Soft gradient edge fades & pause on hover
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-6 sm:py-10 space-y-6 overflow-hidden">
        <div className="text-center space-y-2 max-w-2xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
            Didukung oleh Investor Terkemuka
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Didukung oleh perusahaan modal ventura dan mitra investasi terpercaya untuk mengakselerasi ekosistem olahraga digital Indonesia
          </p>
        </div>

        {/* Continuous Marquee Ticker Track */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Left Gradient Edge Fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-36 bg-gradient-to-r from-bg-app via-bg-app/80 to-transparent z-10" />

          {/* Marquee Track Moving Right to Left */}
          <div className="flex animate-marquee gap-12 sm:gap-16 items-center">
            {/* Set 1 */}
            {INVESTORS.map((inv, idx) => {
              const IconComponent = inv.icon
              return (
                <div
                  key={`inv-1-${idx}`}
                  className="flex items-center gap-2.5 text-slate-600 hover:text-text-primary transition-colors shrink-0 group cursor-default"
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 group-hover:text-primary transition-colors shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base tracking-tight whitespace-nowrap">
                    {inv.name}
                  </span>
                </div>
              )
            })}

            {/* Set 2 for seamless loop */}
            {INVESTORS.map((inv, idx) => {
              const IconComponent = inv.icon
              return (
                <div
                  key={`inv-2-${idx}`}
                  className="flex items-center gap-2.5 text-slate-600 hover:text-text-primary transition-colors shrink-0 group cursor-default"
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 group-hover:text-primary transition-colors shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base tracking-tight whitespace-nowrap">
                    {inv.name}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Right Gradient Edge Fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-36 bg-gradient-to-l from-bg-app via-bg-app/80 to-transparent z-10" />
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          6. TIM KAMI (OUR TEAM - ROW)
          Matches the reference image:
          - Centered Title & Subtitle
          - 4 smaller member cards in a horizontal row
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Tim Kami
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Kenali orang-orang berdedikasi di balik platform booking lapangan olahraga terbaik di court<span className="text-primary font-bold">.in</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx} className="space-y-2.5 text-left group">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-border/80 shadow-2xs">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-text-primary">
                  {member.name}
                </h4>
                <p className="text-[11px] sm:text-xs text-text-muted">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. LOKASI LAPANGAN KAMI (WARM CREAM SECTION)
          Matches the reference image:
          - Soft warm beige/cream background (#FAF7F2)
          - Pill tag "LOKASI KAMI"
          - Title & Subtitle
          - 3 City cards with landscape photo + title + description
          - Button "Jelajahi Lapangan"
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF7F2] py-16 sm:py-20 border-y border-[#EFE9DD]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Lokasi Lapangan Kami
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Kunjungi gelanggang olahraga utama kami dengan fasilitas berstandar internasional dan sistem reservasi terpadu.
            </p>
          </div>
          {/* Single Featured Location Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden border border-[#E9E3D5] shadow-xs hover:shadow-md transition-all duration-300 group">
            <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden relative">
              <img
                src={FEATURED_LOCATION.image}
                alt={FEATURED_LOCATION.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                {FEATURED_LOCATION.badge}
              </div>
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 uppercase tracking-wider bg-primary/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                  <MapPin size={12} /> {FEATURED_LOCATION.city}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">
                  Court<span className="text-primary">.in</span> Sports Complex
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {FEATURED_LOCATION.desc}
              </p>

              {/* Highlights pills without emojis */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {FEATURED_LOCATION.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] sm:text-xs border border-slate-200/70"
                  >
                    <Check size={12} className="text-primary shrink-0" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-xs text-text-muted">
                  {FEATURED_LOCATION.address}
                </span>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 bg-text-primary hover:bg-black text-white font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-xs transition-colors shrink-0"
                >
                  <span>Pesan Lapangan Sekarang</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          9. CALL TO ACTION BANNER ("Mulai Main Hari Ini.")
          Matches the reference image:
          - Split banner card
          - Left: Title, Subtitle, CTA buttons
          - Right: Wireframe / Mockup preview of booking UI
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F2F5FB] rounded-3xl p-6 sm:p-10 lg:p-12 border border-border/80 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
                Mulai Main Hari Ini.
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md">
                Temukan lapangan favoritmu, pilih jam main yang pas, dan nikmati serunya bertanding bersama teman tanpa khawatir jadwal bentrok.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 bg-text-primary hover:bg-black text-white font-semibold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-xs transition-colors"
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-text-primary font-semibold text-xs sm:text-sm py-3 px-5 rounded-xl border border-border shadow-2xs transition-colors"
                >
                  <span>Hubungi Tim Kami</span>
                </Link>
              </div>
            </div>

            {/* Right Mockup UI (Interactive preview of Court.in Booking Card) */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-4">
                {/* Mock Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
                      C.in
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-text-primary">
                        Gelanggang Futsal Vinyl Pro
                      </h4>
                      <p className="text-[11px] text-text-muted flex items-center gap-1">
                        <MapPin size={10} /> Banda Aceh • Lapangan 1
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                    Tersedia
                  </span>
                </div>

                {/* Mock Date & Slots */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-border/80 text-center">
                    <span className="text-[10px] text-text-muted block">Slot 1</span>
                    <span className="text-xs font-bold text-text-primary block mt-0.5">18:00 - 19:00</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Tersedia</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary text-white text-center shadow-xs">
                    <span className="text-[10px] text-white/80 block">Slot 2</span>
                    <span className="text-xs font-bold text-white block mt-0.5">19:00 - 20:00</span>
                    <span className="text-[10px] text-white/90 font-semibold">Terpilih</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-border/80 text-center">
                    <span className="text-[10px] text-text-muted block">Slot 3</span>
                    <span className="text-xs font-bold text-text-primary block mt-0.5">20:00 - 21:00</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Tersedia</span>
                  </div>
                </div>

                {/* Mock Card Footer */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div>
                    <span className="text-[11px] text-text-muted block">Total Biaya Sewa</span>
                    <span className="font-extrabold text-sm text-primary">Rp 150.000 / jam</span>
                  </div>
                  <div className="flex items-center gap-1 text-text-secondary text-[11px]">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Garansi Anti-Bentrok</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

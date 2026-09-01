import { useState, useRef, useEffect } from 'react'
import {
  Mail, Phone, Clock,
  Send, ChevronDown, CheckCircle2,
  HelpCircle, Calendar, CreditCard, Building2,
  MessageSquare, Check, User
} from 'lucide-react'

const FAQ_ITEMS = [
  {
    q: 'Bagaimana cara memesan lapangan di court.in?',
    a: 'Cukup buka menu "Jelajah Lapangan", pilih cabang olahraga (Futsal, Badminton, atau Padel), pilih lapangan yang Anda inginkan, tentukan tanggal serta slot jam yang tersedia, lalu selesaikan pembayaran dengan QRIS atau pilih Bayar di Tempat.',
  },
  {
    q: 'Berapa batas waktu pembayaran jika memilih metode QRIS?',
    a: 'Anda diberikan waktu 15 menit untuk menyelesaikan pembayaran setelah kode QRIS terbit. Jika dalam 15 menit pembayaran belum diselesaikan, sistem otomatis membatalkan pesanan dan mengembalikan slot waktu tersebut agar dapat dipesan pemain lain.',
  },
  {
    q: 'Apakah bisa membayar tunai langsung di lapangan?',
    a: 'Bisa! Anda dapat memilih metode "Bayar di Tempat" saat checkout. E-ticket booking Anda langsung terbit, dan Anda cukup melunasi tagihan secara tunai kepada pengelola venue sebelum mulai bermain.',
  },
  {
    q: 'Bagaimana cara melakukan check-in saat tiba di venue olahraga?',
    a: 'Buka menu "Pesanan Saya" (Dashboard), pilih tab "Tiket Aktif", lalu tekan tombol "Lihat Tiket QR". Tunjukkan kode QR tersebut kepada petugas admin lapangan untuk di-scan dan divalidasi.',
  },
  {
    q: 'Kapan saya dapat memberikan penilaian (Rating & Ulasan) untuk lapangan?',
    a: 'Sesuai sistem court.in, ulasan dan rating bintang 1-5 HANYA bisa diberikan setelah jadwal bermain Anda selesai dan pesanan berstatus COMPLETED. Setiap ID Pesanan berhak memberikan 1 ulasan terverifikasi.',
  },
  {
    q: 'Bagaimana jika saya ingin mendaftarkan lapangan saya menjadi mitra court.in?',
    a: 'Kami menyambut hangat para pemilik venue olahraga. Anda dapat menghubungi tim kemitraan kami melalui formulir kontak di bawah ini dengan subjek "Kemitraan Venue Lapangan" atau langsung chat WhatsApp kami.',
  },
  {
    q: 'Apakah biaya sewa di aplikasi berbeda dengan sewa langsung di lokasi?',
    a: 'Harga sewa lapangan di court.in sama persis dengan tarif resmi venue. Anda hanya dikenakan biaya sistem & layanan kecil sebesar Rp2.000 per transaksi untuk menjamin kepastian jadwal dan bebas antre.',
  },
]

const SUBJECT_OPTIONS = [
  {
    id: 'Pertanyaan Umum',
    label: 'Pertanyaan Umum',
    desc: 'Informasi umum seputar aplikasi & layanan',
    icon: HelpCircle,
  },
  {
    id: 'Kendala Booking / Jadwal',
    label: 'Kendala Booking / Jadwal',
    desc: 'Bantuan jadwal bentrok atau perubahan jam',
    icon: Calendar,
  },
  {
    id: 'Konfirmasi Pembayaran QRIS',
    label: 'Konfirmasi Pembayaran QRIS',
    desc: 'Status verifikasi pembayaran atau mutasi',
    icon: CreditCard,
  },
  {
    id: 'Kemitraan Venue Lapangan',
    label: 'Kemitraan Venue Lapangan',
    desc: 'Pendaftaran lapangan atau kerjasama bisnis',
    icon: Building2,
  },
  {
    id: 'Lainnya',
    label: 'Lainnya',
    desc: 'Kritik, saran, dan pertanyaan lainnya',
    icon: MessageSquare,
  },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('Pertanyaan Umum')
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [isSubjectOpen, setIsSubjectOpen] = useState(false)
  const subjectRef = useRef(null)

  // Close subject dropdown when clicking outside or ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target)) {
        setIsSubjectOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSubjectOpen(false)
      }
    }

    if (isSubjectOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSubjectOpen])

  const selectedSubjectObj = SUBJECT_OPTIONS.find((s) => s.id === subject) || SUBJECT_OPTIONS[0]
  const SelectedIcon = selectedSubjectObj.icon

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setIsSubmitted(false)
    }, 4000)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* ── 1. Page Header ── */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Hubungi Tim court.in
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Punya pertanyaan seputar reservasi, kendala pembayaran, atau ingin bermitra dengan kami? Tim kami siap membantu setiap hari.
        </p>
      </div>

      {/* ── 2. Quick Contact Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Phone size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-base">WhatsApp Support</h3>
            <p className="text-xs text-text-secondary mt-0.5">Respon cepat via chat WhatsApp</p>
          </div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-semibold text-primary hover:underline"
          >
            +62 812-3456-7890 →
          </a>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-base">Email Resmi</h3>
            <p className="text-xs text-text-secondary mt-0.5">Bantuan resmi & kemitraan venue</p>
          </div>
          <a
            href="mailto:support@court.in"
            className="inline-block text-sm font-semibold text-primary hover:underline"
          >
            support@court.in →
          </a>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-base">Jam Operasional</h3>
            <p className="text-xs text-text-secondary mt-0.5">Layanan bantuan pelanggan</p>
          </div>
          <p className="text-sm font-semibold text-text-primary">
            Setiap Hari (07:00 - 23:00 WIB)
          </p>
        </div>
      </div>

      {/* ── 3. Centralized FAQ Accordion ── */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-sm text-text-secondary">
            Jawaban cepat untuk pertanyaan umum seputar pemesanan dan layanan court.in
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx

            return (
              <div
                key={idx}
                className="bg-surface rounded-2xl border border-border overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-text-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-text-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-text-secondary leading-relaxed border-t border-border/60 animate-slide-in">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 4. Contact Form Section ── */}
      <section className="bg-surface rounded-2xl p-8 sm:p-12 border border-border max-w-3xl mx-auto space-y-6 shadow-2xs">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Kirim Pesan ke Tim Kami
          </h2>
          <p className="text-sm text-text-secondary">
            Ada pertanyaan spesifik atau kendala teknis? Tim kami siap menjawab pesan Anda.
          </p>
        </div>

        {isSubmitted && (
          <div className="p-4 rounded-xl bg-primary-light text-primary border border-primary/20 flex items-center gap-3 animate-slide-in">
            <CheckCircle2 size={20} className="shrink-0" />
            <div>
              <p className="font-bold text-sm">Pesan Berhasil Terkirim</p>
              <p className="text-xs text-text-secondary">Tim kami akan membalas melalui email atau WhatsApp Anda dalam 1x24 jam.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Muhammad Daffa"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                No. WhatsApp
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Custom Interactive Subject Dropdown */}
            <div ref={subjectRef} className="relative">
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                Subjek
              </label>
              <button
                type="button"
                onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low border rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  isSubjectOpen
                    ? 'border-primary bg-surface ring-2 ring-primary/20 text-text-primary'
                    : 'border-border text-text-primary hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <SelectedIcon size={16} className="text-primary shrink-0" />
                  <span className="truncate">{selectedSubjectObj.label}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-text-muted shrink-0 ml-2 transition-transform duration-200 ${
                    isSubjectOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              {/* Subject Popover Menu */}
              {isSubjectOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-surface rounded-2xl border border-border shadow-2xl p-1.5 z-50 animate-slide-in backdrop-blur-md">
                  <div className="space-y-1">
                    {SUBJECT_OPTIONS.map((opt) => {
                      const isSelected = subject === opt.id
                      const OptIcon = opt.icon

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSubject(opt.id)
                            setIsSubjectOpen(false)
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary-light text-primary font-bold shadow-2xs border border-primary/30'
                              : 'hover:bg-surface-container-low text-text-primary'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-primary text-white'
                                  : 'bg-surface-container text-text-secondary'
                              }`}
                            >
                              <OptIcon size={16} />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm block truncate">
                                {opt.label}
                              </span>
                              <span className="text-[11px] text-text-muted block truncate font-normal">
                                {opt.desc}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 ml-2">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
              Pesan
            </label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan pertanyaan atau detail kendala Anda..."
              required
              className="w-full p-4 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Send size={15} />
            <span>Kirim Pesan</span>
          </button>
        </form>
      </section>
    </div>
  )
}

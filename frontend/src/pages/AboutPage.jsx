import { Link } from 'react-router-dom'
import {
  ShieldCheck, Zap, Award,
  Users, Trophy, CheckCircle2, ArrowRight
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-16">
      {/* ── 1. Hero Section ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight max-w-3xl mx-auto leading-tight">
          Solusi Modern Booking Lapangan Olahraga di Indonesia
        </h1>
        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          court.in hadir untuk mempermudah para pecinta olahraga menemukan, memesan, dan menikmati pertandingan di venue terbaik tanpa kendala bentrok jadwal atau antre manual.
        </p>
      </section>

      {/* ── 2. Stat Highlights ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-surface rounded-2xl border border-border shadow-2xs text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-text-primary">50+</span>
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Lapangan Mitra</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-text-primary">15K+</span>
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Jam Main Terjadwal</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-primary">99.8%</span>
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Tingkat Kepuasan</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-text-primary">3</span>
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Cabang Olahraga</p>
          </div>
        </div>
      </section>

      {/* ── 3. Visi & Misi ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface rounded-2xl p-8 border border-border space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Visi Kami</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Menjadi ekosistem digital olahraga terdepan di Indonesia yang mengintegrasikan penyewaan lapangan, komunitas pertandingan, dan kemudahan transaksi digital dalam satu platform terpadu.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-8 border border-border space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <Users size={20} />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Misi Kami</h2>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Menghilangkan masalah bentrok jadwal dengan sistem penguncian slot real-time.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Memberikan fleksibilitas pembayaran melalui QRIS otomatis atau Bayar di Tempat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Mendukung digitalisasi pengelola venue olahraga lokal agar operasional lebih efisien.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4. Our Journey (Perjalanan Kami) ── */}
      <section id="journey" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-2xl p-8 sm:p-12 border border-border space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block">
              Linimasa
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Perjalanan Kami
            </h2>
            <p className="text-sm text-text-secondary">
              Langkah demi langkah membangun platform pemesanan lapangan olahraga terpercaya
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-6 rounded-2xl border border-border space-y-3">
              <span className="text-xs font-bold text-primary block">
                2024
              </span>
              <h3 className="font-bold text-base text-text-primary">Ide & Peluncuran Awal</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Dimulai dari keresahan susahnya mencari dan memesan lapangan futsal tanpa telepon atau chat bolak-balik yang memakan waktu.
              </p>
            </div>

            <div className="bg-surface-container-low p-6 rounded-2xl border border-border space-y-3">
              <span className="text-xs font-bold text-primary block">
                2025
              </span>
              <h3 className="font-bold text-base text-text-primary">Ekspansi Badminton & Padel</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Menyusul antusiasme komunitas yang pesat, kami menambahkan integrasi gelanggang bulu tangkis standar BWF dan lapangan padel panoramik.
              </p>
            </div>

            <div className="bg-surface-container-low p-6 rounded-2xl border border-border space-y-3">
              <span className="text-xs font-bold text-primary block">
                2026
              </span>
              <h3 className="font-bold text-base text-text-primary">Otomatisasi E-Ticket & QRIS</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Peluncuran fitur e-ticket berbasis QR Code, integrasi QRIS real-time dengan timer 15 menit, serta sistem ulasan terverifikasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Nilai yang Kami Pegang Teguh ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block">
            Prinsip
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Nilai yang Kami Pegang Teguh
          </h2>
          <p className="text-sm text-text-secondary">
            Komitmen kami untuk memberikan pengalaman terbaik kepada seluruh pengguna
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-surface rounded-2xl border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary">Kecepatan & Kepastian</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Jadwal yang Anda pilih dikunci instan selama proses transaksi berlangsung, menjamin slot bebas dari risiko bentrok.
            </p>
          </div>

          <div className="p-6 bg-surface rounded-2xl border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary">Transparansi Penuh</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Seluruh harga sewa lapangan, fasilitas, dan biaya layanan tertera transparan tanpa ada biaya tersembunyi.
            </p>
          </div>

          <div className="p-6 bg-surface rounded-2xl border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <Award size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary">Standar Terjamin</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Hanya venue yang memenuhi standar kelayakan, pencahayaan, dan kebersihan yang terdaftar di court.in.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. Bottom CTA (Clean & Elegant) ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-text-primary text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Siap Bermain Hari Ini?</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Temukan lapangan futsal, badminton, atau padel terdekat dan amankan slot bermainmu sekarang juga.
            </p>
            <div className="pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <span>Jelajahi Lapangan</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import {
  Shield, Lock, Eye,
  UserCheck, ChevronRight
} from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Kebijakan Privasi Pengguna
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Terakhir diperbarui: 1 September 2026. Menjelaskan bagaimana court.in menjaga kerahasiaan dan melindungi data pribadi Anda sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP).
        </p>
      </div>

      {/* Security Pillars Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-surface rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Lock size={18} />
          </div>
          <h3 className="font-bold text-text-primary text-sm">Enkripsi Tingkat Tinggi</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Seluruh data komunikasi dan transaksi diproteksi dengan sertifikasi enkripsi SSL/TLS 256-bit standar perbankan.
          </p>
        </div>

        <div className="p-5 bg-surface rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Eye size={18} />
          </div>
          <h3 className="font-bold text-text-primary text-sm">Tanpa Penjualan Data</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            court.in tidak pernah menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak ketiga mana pun.
          </p>
        </div>

        <div className="p-5 bg-surface rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <UserCheck size={18} />
          </div>
          <h3 className="font-bold text-text-primary text-sm">Kendali Penuh di Tangan Anda</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Anda berhak mengakses, memperbarui, atau mengajukan permohonan penghapusan akun beserta data kapan saja.
          </p>
        </div>
      </div>

      {/* Main Legal Sections */}
      <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-border shadow-2xs space-y-10 text-text-secondary leading-relaxed text-sm">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">1</span>
            <span>Informasi yang Kami Kumpulkan</span>
          </h2>
          <p>
            Untuk memberikan layanan pemesanan lapangan olahraga terbaik dan pembuatan E-Ticket yang valid, kami mengumpulkan beberapa kategori data pribadi:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Data Identitas & Kontak</strong>: Nama lengkap, alamat email aktif, nomor WhatsApp/telepon, tanggal lahir, dan foto profil yang Anda unggah secara sukarela.</li>
            <li><strong>Data Transaksi Reservasi</strong>: Informasi lapangan yang dipesan, tanggal & jam bermain, rincian nominal pembayaran, serta metode pembayaran yang dipilih.</li>
            <li><strong>Data Perangkat & Log Teknis</strong>: Alamat IP, jenis browser, data log aktivitas, dan sesi akses untuk menjaga keamanan sistem dari aktivitas mencurigakan.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">2</span>
            <span>Tujuan Penggunaan Data Pribadi</span>
          </h2>
          <p>
            Informasi yang Anda berikan digunakan untuk tujuan-tujuan berikut:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-2">
            <li>Memproses dan mengonfirmasi reservasi lapangan secara real-time.</li>
            <li>Menerbitkan E-Ticket QR resmi sebagai bukti akses masuk di lokasi venue.</li>
            <li>Mengirimkan notifikasi status pembayaran QRIS serta pengingat jadwal bermain.</li>
            <li>Menyediakan layanan bantuan pelanggan jika Anda mengalami kendala transaksi.</li>
            <li>Meningkatkan kualitas performa dan kenyamanan penggunaan platform court.in.</li>
          </ol>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">3</span>
            <span>Pembagian Data dengan Pihak Ketiga</span>
          </h2>
          <p>
            Data Anda hanya dibagikan kepada pihak-pihak terkait yang esensial dalam rangka penyelesaian pesanan:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Mitra Venue Lapangan</strong>: Menerima nama pemesan dan jam reservasi untuk persiapan lapangan dan verifikasi E-Ticket QR di lokasi.</li>
            <li><strong>Penyedia Gerbang Pembayaran (Payment Gateway)</strong>: Mitra pemroses pembayaran resmi berizin Bank Indonesia untuk memproses transaksi QRIS secara aman.</li>
            <li><strong>Kepatuhan Hukum</strong>: Apabila diwajibkan secara tegas oleh otoritas penegak hukum yang berwenang di Republik Indonesia berdasarkan peraturan perundang-undangan.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">4</span>
            <span>Penyimpanan & Keamanan Data</span>
          </h2>
          <p>
            Kami menerapkan standar keamanan teknis dan organisasional yang ketat untuk mencegah akses tanpa izin, kehilangan, atau penyalahgunaan data Anda. Data kredensial kata sandi dienkripsi menggunakan algoritma hashing satu arah (*one-way cryptographic hash*) dan tidak dapat dibaca oleh staf kami.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">5</span>
            <span>Hak Anda sebagai Pemilik Data Pribadi</span>
          </h2>
          <p>
            Berdasarkan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP), Anda memiliki hak untuk:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Mengakses dan memperbarui data profil Anda melalui menu <Link to="/profile" className="text-primary font-semibold hover:underline">Pengaturan Profil</Link>.</li>
            <li>Meminta riwayat pemesanan dan bukti transaksi yang pernah Anda lakukan.</li>
            <li>Mengajukan permohonan penutupan akun dan penghapusan data pribadi Anda secara permanen dari server kami.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">6</span>
            <span>Pembaruan Kebijakan Privasi</span>
          </h2>
          <p>
            Kebijakan Privasi ini dapat diperbarui sewaktu-waktu sesuai dengan perkembangan layanan atau penyesuaian regulasi hukum yang berlaku. Setiap perubahan penting akan kami informasikan melalui platform atau email terdaftar Anda.
          </p>
        </section>
      </div>

      {/* Help Banner */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-base">Petugas Perlindungan Data (DPO)</h3>
            <p className="text-xs text-text-secondary">Hubungi kami jika ada pertanyaan seputar keamanan dan privasi data Anda.</p>
          </div>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
        >
          <span>Hubungi Tim DPO</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}

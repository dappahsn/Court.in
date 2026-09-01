import { Link } from 'react-router-dom'
import {
  ShieldCheck, Clock, CreditCard,
  RotateCcw, ChevronRight, HelpCircle
} from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Syarat & Ketentuan Layanan
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Terakhir diperbarui: 1 September 2026. Harap membaca ketentuan ini secara seksama sebelum menggunakan platform court.in.
        </p>
      </div>

      {/* Quick Summary Card */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <ShieldCheck size={18} />
          <span>Ringkasan Pokok Ketentuan court.in</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
          <div className="p-3.5 bg-surface-container-low rounded-xl border border-border/60 space-y-1">
            <span className="font-bold text-text-primary block flex items-center gap-1.5">
              <Clock size={14} className="text-primary" />
              Kunci Slot 15 Menit
            </span>
            <p>Slot otomatis diamankan selama 15 menit pada proses pembayaran QRIS untuk mencegah dobel booking.</p>
          </div>
          <div className="p-3.5 bg-surface-container-low rounded-xl border border-border/60 space-y-1">
            <span className="font-bold text-text-primary block flex items-center gap-1.5">
              <CreditCard size={14} className="text-primary" />
              Metode Pembayaran
            </span>
            <p>Mendukung QRIS otomatis instan dan opsi Bayar Langsung di Lokasi (Cash on Venue).</p>
          </div>
          <div className="p-3.5 bg-surface-container-low rounded-xl border border-border/60 space-y-1">
            <span className="font-bold text-text-primary block flex items-center gap-1.5">
              <RotateCcw size={14} className="text-primary" />
              E-Ticket Check-In
            </span>
            <p>Tunjukkan kode QR tiket pada akun Anda kepada pengelola venue saat tiba di lapangan.</p>
          </div>
        </div>
      </div>

      {/* Main Content Clauses */}
      <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-border shadow-2xs space-y-10 text-text-secondary leading-relaxed text-sm">
        {/* Pasal 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">1</span>
            <span>Ketentuan Umum & Definisi</span>
          </h2>
          <p>
            Selamat datang di <strong>court.in</strong>. Dokumen Syarat dan Ketentuan ini merupakan perjanjian yang mengikat secara hukum antara Anda sebagai Pengguna ("Pengguna" atau "Anda") dengan pengelola platform court.in ("Kami").
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Platform</strong> merujuk pada situs web, aplikasi web, dan layanan pendukung yang dikelola oleh court.in.</li>
            <li><strong>Mitra Venue</strong> adalah pemilik, pengelola, atau pihak berwenang dari lapangan olahraga (futsal, badminton, padel) yang terdaftar di platform.</li>
            <li><strong>Booking / Pemesanan</strong> adalah reservasi slot jam bermain yang dilakukan oleh Pengguna melalui platform.</li>
            <li><strong>E-Ticket</strong> adalah bukti sah reservasi elektronik yang memuat rincian jadwal dan kode QR unik untuk validasi di lokasi.</li>
          </ul>
        </section>

        {/* Pasal 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">2</span>
            <span>Pendaftaran Akun & Keamanan</span>
          </h2>
          <p>
            Untuk melakukan pemesanan lapangan dan memperoleh E-Ticket QR, Pengguna diwajibkan membuat akun resmi dengan mencantumkan nama lengkap, nomor WhatsApp aktif, dan alamat email yang valid.
          </p>
          <p>
            Pengguna bertanggung jawab penuh atas kerahasiaan kata sandi dan seluruh aktivitas yang terjadi dalam akun tersebut. Segera hubungi tim dukungan kami apabila mendeteksi adanya penggunaan akun tanpa izin.
          </p>
        </section>

        {/* Pasal 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">3</span>
            <span>Aturan Pemesanan & Kunci Slot Otomatis</span>
          </h2>
          <p>
            Saat Anda memilih slot jam lapangan dan melanjutkan ke tahap pembayaran (checkout):
          </p>
          <div className="p-4 bg-surface-container-low rounded-xl border border-border space-y-2">
            <p className="font-semibold text-text-primary">
              Mekanisme Kunci Slot (15-Minute Lock):
            </p>
            <p className="text-xs">
              Sistem court.in akan mengunci slot waktu yang Anda pilih selama <strong>15 menit</strong>. Selama durasi ini, pengguna lain tidak dapat memesan slot yang sama. Jika pembayaran tidak diselesaikan sebelum batas waktu berakhir, slot akan otomatis terbuka kembali untuk publik.
            </p>
          </div>
        </section>

        {/* Pasal 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">4</span>
            <span>Tata Cara Pembayaran & Biaya Layanan</span>
          </h2>
          <p>
            court.in menyediakan 2 metode pembayaran resmi:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>
              <strong>QRIS Dinamis Otomatis</strong>: Pembayaran instan melalui seluruh aplikasi mobile banking atau dompet digital (GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI, BSI, dll). Status tiket otomatis berubah menjadi <em>Lunas (PAID)</em> secara instan.
            </li>
            <li>
              <strong>Bayar di Tempat (Cash on Venue)</strong>: Pengguna wajib melunasi biaya sewa kepada staf kasir venue setibanya di lokasi sebelum memasuki lapangan permainan.
            </li>
          </ol>
          <p className="text-xs text-text-muted">
            Setiap transaksi dapat dikenakan biaya pemeliharaan sistem / layanan aplikasi sebesar Rp2.000 per transaksi yang tertera secara transparan di rincian pesanan.
          </p>
        </section>

        {/* Pasal 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">5</span>
            <span>Kebijakan Pembatalan & Perubahan Jadwal (Reschedule)</span>
          </h2>
          <p>
            Kebijakan pembatalan atau perubahan jadwal tunduk pada peraturan operasional masing-masing Mitra Venue:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Permohonan perubahan jadwal (reschedule) wajib diajukan minimal <strong>24 jam sebelum jadwal bermain</strong> dengan menghubungi admin venue terkait atau pusat bantuan court.in.</li>
            <li>Pembatalan sepihak tanpa pemberitahuan dalam kurun waktu kurang dari 12 jam dapat menyebabkan hangusnya biaya reservasi yang telah dibayarkan.</li>
          </ul>
        </section>

        {/* Pasal 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">6</span>
            <span>Ulasan & Penilaian Terverifikasi (Verified Reviews)</span>
          </h2>
          <p>
            court.in berkomitmen menyajikan ulasan yang 100% jujur dan transparan. Penilaian bintang dan ulasan hanya dapat diberikan oleh Pengguna yang <strong>telah menyelesaikan sesi bermain</strong> berdasarkan histori E-Ticket resmi. Ulasan yang mengandung ujaran kebencian, sara, atau spam akan dihapus oleh moderator kami.
          </p>
        </section>

        {/* Pasal 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-xs flex items-center justify-center font-extrabold">7</span>
            <span>Hukum yang Berlaku & Penyelesaian Sengketa</span>
          </h2>
          <p>
            Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Negara Kesatuan Republik Indonesia. Segala sengketa yang timbul akan diselesaikan secara musyawarah untuk mufakat terlebih dahulu sebelum menempuh jalur hukum.
          </p>
        </section>
      </div>

      {/* Help Banner */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-base">Ada pertanyaan terkait ketentuan layanan?</h3>
            <p className="text-xs text-text-secondary">Tim dukungan pelanggan court.in siap membantu setiap hari.</p>
          </div>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
        >
          <span>Pusat Bantuan</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}

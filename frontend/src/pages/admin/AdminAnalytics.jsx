import { useMemo, useState } from 'react'
import {
  TrendingUp, DollarSign,
  Download, Award, CheckCircle2,
  Clock, ShieldCheck
} from 'lucide-react'
import useBookingStore from '../../stores/bookingStore'
import SportIcon from '../../components/SportIcon'

export default function AdminAnalytics() {
  const { bookings } = useBookingStore()
  const [timeRange, setTimeRange] = useState('monthly') // 'weekly' | 'monthly' | 'yearly'
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const analytics = useMemo(() => {
    const paidBookings = bookings.filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
    const avgOrderValue = paidBookings.length > 0 ? Math.round(totalRevenue / paidBookings.length) : 0

    const futsalCount = bookings.filter((b) => b.court_type === 'FUTSAL').length
    const badmintonCount = bookings.filter((b) => b.court_type === 'BADMINTON').length
    const padelCount = bookings.filter((b) => b.court_type === 'PADEL').length

    const qrisCount = bookings.filter((b) => b.payment_method === 'QRIS').length
    const cashCount = bookings.filter((b) => b.payment_method === 'CASH').length

    return {
      totalRevenue,
      avgOrderValue,
      totalOrders: bookings.length,
      paidOrdersCount: paidBookings.length,
      futsalCount,
      badmintonCount,
      padelCount,
      qrisCount,
      cashCount,
    }
  }, [bookings])

  const handleExportReport = () => {
    const reportContent = `LAPORAN KEUANGAN & ANALITIK court.in
Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}
Periode: ${timeRange.toUpperCase()}

1. RINGKASAN KEUANGAN
Total Omset Lunas: Rp${analytics.totalRevenue.toLocaleString('id-ID')}
Rata-rata Nilai Transaksi: Rp${analytics.avgOrderValue.toLocaleString('id-ID')}
Total Reservasi: ${analytics.totalOrders} Transaksi

2. DISTRIBUSI CABANG OLAHRAGA
- Futsal: ${analytics.futsalCount} booking
- Badminton: ${analytics.badmintonCount} booking
- Padel Tennis: ${analytics.padelCount} booking

3. METODE PEMBAYARAN
- QRIS (Otomatis): ${analytics.qrisCount} transaksi
- Tunai (Bayar di Tempat): ${analytics.cashCount} transaksi
`
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `courtin_financial_report_${timeRange}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Laporan keuangan & analitik berhasil diunduh!')
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slide-in text-xs font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Report & Analitik Bisnis</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Laporan komprehensif omset venue, performa sewa per cabang olahraga, dan metode pembayaran.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-border">
            {[
              { id: 'weekly', label: 'Mingguan' },
              { id: 'monthly', label: 'Bulanan' },
              { id: 'yearly', label: 'Tahunan' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === t.id
                    ? 'bg-primary text-white font-bold shadow-2xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Unduh Laporan</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-surface rounded-3xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Total Pendapatan Bersih</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-text-primary">
            Rp{analytics.totalRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp size={13} />
            <span>+18.4% pertumbuhan omset</span>
          </p>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Rata-Rata Transaksi (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-text-primary">
            Rp{analytics.avgOrderValue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-text-muted">
            Rata-rata durasi sewa 1.5 jam / transaksi
          </p>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider">
            <span>Tingkat Keterisian (Peak)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-text-primary">
            91.2%
          </p>
          <p className="text-xs text-text-muted">
            Slot terpadat pukul 18:00 - 22:00 WIB
          </p>
        </div>
      </div>

      {/* Sport Breakdown & Payment Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sport Share */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-text-primary">Volume Booking per Cabang Olahraga</h3>
            <p className="text-xs text-text-muted mt-0.5">Persentase jumlah jadwal sewa yang dipesan pemain</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-text-primary">
                  <SportIcon type="FUTSAL" className="w-4 h-4 text-primary" /> Futsal ({analytics.futsalCount} Booking)
                </span>
                <span className="text-primary font-extrabold">50%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-text-primary">
                  <SportIcon type="PADEL" className="w-4 h-4 text-primary" /> Padel Tennis ({analytics.padelCount} Booking)
                </span>
                <span className="text-indigo-600 font-extrabold">30%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-text-primary">
                  <SportIcon type="BADMINTON" className="w-4 h-4 text-primary" /> Badminton ({analytics.badmintonCount} Booking)
                </span>
                <span className="text-emerald-600 font-extrabold">20%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-text-primary">Perbandingan Metode Pembayaran</h3>
            <p className="text-xs text-text-muted mt-0.5">Distribusi transaksi online (QRIS) vs Bayar di Tempat</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-primary-light border border-primary/20 space-y-1 text-center">
              <span className="text-xs font-bold text-primary uppercase">QRIS (Otomatis)</span>
              <p className="text-2xl font-black text-text-primary">{analytics.qrisCount} Transaksi</p>
              <p className="text-[11px] text-text-secondary">E-Ticket terbit instan</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/60 space-y-1 text-center">
              <span className="text-xs font-bold text-amber-700 uppercase">Bayar di Tempat</span>
              <p className="text-2xl font-black text-text-primary">{analytics.cashCount} Transaksi</p>
              <p className="text-[11px] text-amber-700">Pelunasan di kasir venue</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-border text-xs text-text-secondary flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span>Sistem QRIS menggunakan timer reservasi 15 menit dengan auto-release slot jika tidak dibayar.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import {
  Search, CheckCircle2,
  Download, Eye, X
} from 'lucide-react'
import useBookingStore from '../../stores/bookingStore'

export default function AdminBookings() {
  const { bookings, checkInBooking, confirmCashPayment, cancelBookingByAdmin } = useBookingStore()

  const [filterStatus, setFilterStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToastMsg({ msg, type })
    setTimeout(() => setToastMsg(null), 3000)
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (filterStatus !== 'ALL' && b.status !== filterStatus) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = b.id?.toLowerCase().includes(q)
        const matchName = b.customer_name?.toLowerCase().includes(q)
        const matchPhone = b.customer_phone?.toLowerCase().includes(q)
        const matchCourt = b.court_name?.toLowerCase().includes(q)
        if (!matchId && !matchName && !matchPhone && !matchCourt) return false
      }
      return true
    })
  }, [bookings, filterStatus, searchQuery])

  const exportCSV = () => {
    const headers = 'ID Tiket,Nama Pelanggan,No WhatsApp,Lapangan,Cabang,Tanggal,Jam Mulai,Jam Selesai,Total Harga,Metode,Status\n'
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.id}","${b.customer_name}","${b.customer_phone}","${b.court_name}","${b.court_type}","${b.booking_date}","${b.start_time}","${b.end_time}",${b.total_price},"${b.payment_method}","${b.status}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `courtin_bookings_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Data booking berhasil diekspor ke CSV!')
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slide-in text-xs font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Manajemen Booking & Kasir</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Kelola daftar transaksi reservasi lapangan, validasi kedatangan pemain, dan konfirmasi pembayaran tunai kasir.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-container-low text-text-primary text-xs font-bold transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Download size={15} />
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded-2xl border border-border">
            {[
              { id: 'ALL', label: 'Semua Status' },
              { id: 'PAID', label: 'Lunas (QRIS)' },
              { id: 'PAY_AT_VENUE', label: 'Bayar di Tempat' },
              { id: 'COMPLETED', label: 'Selesai' },
              { id: 'CANCELLED', label: 'Dibatalkan' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setFilterStatus(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === st.id
                    ? 'bg-primary text-white shadow-2xs font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID tiket, nama, WhatsApp..."
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-text-muted uppercase tracking-wider font-bold border-b border-border">
              <tr>
                <th className="py-3.5 px-4">No. Tiket</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Lapangan & Olahraga</th>
                <th className="py-3.5 px-4">Jadwal Bermain</th>
                <th className="py-3.5 px-4">Total & Metode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-text-primary">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        className="hover:text-primary hover:underline text-left cursor-pointer"
                      >
                        {b.id}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-text-primary">{b.customer_name}</p>
                      <p className="text-[11px] text-text-muted">{b.customer_phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-text-primary block line-clamp-1">{b.court_name}</span>
                      <span className="text-[10px] text-primary uppercase font-bold">{b.court_type}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-medium text-text-primary">{b.booking_date}</p>
                      <p className="text-[11px] text-text-muted">{b.start_time} - {b.end_time} WIB</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-text-primary">Rp{b.total_price.toLocaleString('id-ID')}</p>
                      <p className="text-[10px] text-text-muted uppercase font-semibold">{b.payment_method}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          b.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700'
                            : b.status === 'COMPLETED'
                            ? 'bg-primary-light text-primary'
                            : b.status === 'PAY_AT_VENUE'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.status === 'PAID'
                          ? 'LUNAS'
                          : b.status === 'COMPLETED'
                          ? 'SELESAI'
                          : b.status === 'PAY_AT_VENUE'
                          ? 'BAYAR DI TEMPAT'
                          : 'BATAL'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'PAY_AT_VENUE' && (
                          <button
                            type="button"
                            onClick={() => {
                              const res = confirmCashPayment(b.id)
                              showToast(res.message)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-2xs cursor-pointer"
                            title="Konfirmasi Pelunasan Tunai Kasir"
                          >
                            Konfirmasi Lunas
                          </button>
                        )}

                        {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => {
                              const res = checkInBooking(b.id)
                              showToast(res.message)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-[11px] shadow-2xs cursor-pointer"
                            title="Validasi Check-In Lapangan"
                          >
                            Check-In
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg border border-border text-text-secondary hover:bg-surface-container-low hover:text-text-primary"
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                        </button>

                        {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Batalkan pesanan tiket ${b.id}?`)) {
                                const res = cancelBookingByAdmin(b.id)
                                showToast(res.message, 'warning')
                              }
                            }}
                            className="px-2 py-1 rounded-lg border border-border text-danger hover:bg-danger/10 text-[11px] font-semibold cursor-pointer"
                          >
                            Batalkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    Tidak ada transaksi booking yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Booking Drawer/Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-slide-in relative">
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Detail E-Ticket Reservasi
              </span>
              <h2 className="text-xl font-extrabold text-text-primary font-mono mt-0.5">
                {selectedBooking.id}
              </h2>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-5 border border-border space-y-3 text-xs">
              <div className="flex justify-between border-b border-border/80 pb-2.5">
                <span className="text-text-muted">Nama Pelanggan</span>
                <span className="font-bold text-text-primary">{selectedBooking.customer_name}</span>
              </div>
              <div className="flex justify-between border-b border-border/80 pb-2.5">
                <span className="text-text-muted">No. WhatsApp</span>
                <span className="font-bold text-text-primary">{selectedBooking.customer_phone}</span>
              </div>
              <div className="flex justify-between border-b border-border/80 pb-2.5">
                <span className="text-text-muted">Nama Lapangan</span>
                <span className="font-bold text-text-primary">{selectedBooking.court_name}</span>
              </div>
              <div className="flex justify-between border-b border-border/80 pb-2.5">
                <span className="text-text-muted">Jadwal Bermain</span>
                <span className="font-bold text-text-primary">
                  {selectedBooking.booking_date} ({selectedBooking.start_time} - {selectedBooking.end_time} WIB)
                </span>
              </div>
              <div className="flex justify-between border-b border-border/80 pb-2.5">
                <span className="text-text-muted">Metode Pembayaran</span>
                <span className="font-bold text-text-primary uppercase">{selectedBooking.payment_method}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-text-muted font-bold">Total Pembayaran</span>
                <span className="text-base font-extrabold text-primary">
                  Rp{selectedBooking.total_price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              {selectedBooking.status === 'PAY_AT_VENUE' && (
                <button
                  type="button"
                  onClick={() => {
                    const res = confirmCashPayment(selectedBooking.id)
                    showToast(res.message)
                    setSelectedBooking(null)
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Konfirmasi Lunas Kasir
                </button>
              )}
              {selectedBooking.status !== 'COMPLETED' && selectedBooking.status !== 'CANCELLED' && (
                <button
                  type="button"
                  onClick={() => {
                    const res = checkInBooking(selectedBooking.id)
                    showToast(res.message)
                    setSelectedBooking(null)
                  }}
                  className="px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Validasi Check-In
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2.5 border border-border rounded-xl text-xs font-semibold text-text-secondary hover:bg-surface-container-low"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

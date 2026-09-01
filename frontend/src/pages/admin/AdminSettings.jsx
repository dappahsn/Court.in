import { useState } from 'react'
import {
  Save, CheckCircle2,
  Building, Clock, CreditCard,
  RotateCcw
} from 'lucide-react'
import useSettingsStore from '../../stores/settingsStore'
import TimePicker from '../../components/TimePicker'

export default function AdminSettings() {
  const { settings, updateSettings, resetSettings } = useSettingsStore()
  const [form, setForm] = useState(settings)
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateSettings(form)
    showToast('Pengaturan bisnis berhasil disimpan!')
  }

  return (
    <div className="space-y-6 max-w-4xl">
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
          <h1 className="text-2xl font-extrabold text-text-primary">Bisnis Settings</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Konfigurasi profil venue olahraga, jam operasional buka-tutup, batas waktu pembayaran QRIS, dan biaya sistem.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Kembalikan semua pengaturan ke nilai standar?')) {
              resetSettings()
              setForm(settings)
              showToast('Pengaturan direset ke default.')
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:bg-surface-container-low cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={13} />
          <span>Reset Default</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Profil Venue */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
            <Building size={18} className="text-primary" />
            <h2 className="text-base font-bold text-text-primary">Profil & Identitas Venue</h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">Nama Usaha / Venue</label>
              <input
                type="text"
                value={form.venue_name}
                onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">Tagline Bisnis</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">No. WhatsApp Resmi</label>
                <input
                  type="text"
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">Alamat Lengkap Venue</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Jam Operasional */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
            <Clock size={18} className="text-primary" />
            <h2 className="text-base font-bold text-text-primary">Jam Operasional Venue</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TimePicker
              label="Jam Buka Harian"
              value={form.open_hour}
              onChange={(val) => setForm({ ...form, open_hour: val })}
            />
            <TimePicker
              label="Jam Tutup Harian"
              value={form.close_hour}
              onChange={(val) => setForm({ ...form, close_hour: val })}
            />
          </div>
        </div>

        {/* Section 3: Aturan Pembayaran & Pemesanan */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
            <CreditCard size={18} className="text-primary" />
            <h2 className="text-base font-bold text-text-primary">Aturan Pembayaran & Reservasi</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">
                  Batas Waktu Bayar QRIS
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={form.qris_timeout_minutes}
                    onChange={(e) =>
                      setForm({ ...form, qris_timeout_minutes: parseInt(e.target.value, 10) || 15 })
                    }
                    className="w-full pl-3.5 pr-14 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">
                    Menit
                  </span>
                </div>
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Slot waktu akan dikunci selama durasi ini sebelum dibatalkan otomatis
                </span>
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">
                  Biaya Layanan & Sistem
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="500"
                    value={form.service_fee}
                    onChange={(e) =>
                      setForm({ ...form, service_fee: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs font-semibold text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Biaya platform per transaksi booking
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-text-primary">Opsi Bayar di Tempat (Kasir)</p>
                <p className="text-text-muted text-[11px]">
                  Izinkan pemain membuat pesanan dengan pelunasan tunai saat tiba di lokasi.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.allow_cash_payment}
                onChange={(e) => setForm({ ...form, allow_cash_payment: e.target.checked })}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save size={16} />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  )
}

import { useState, useMemo, useEffect } from 'react'
import {
  Search, Plus, Phone, Mail,
  CheckCircle2, X, MessageSquare,
  Trash2, AlertTriangle
} from 'lucide-react'
import useCustomerStore from '../../stores/customerStore'
import SportIcon from '../../components/SportIcon'
import CustomSelect from '../../components/CustomSelect'

export default function AdminCustomers() {
  const { customers, addCustomer, deleteCustomer, fetchCustomers } = useCustomerStore()

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferred_sport: 'FUTSAL',
    tier: 'Regular',
  })

  const sportOptions = [
    { value: 'FUTSAL', label: 'FUTSAL', icon: <SportIcon type="FUTSAL" className="w-4 h-4" /> },
    { value: 'BADMINTON', label: 'BADMINTON', icon: <SportIcon type="BADMINTON" className="w-4 h-4" /> },
    { value: 'PADEL', label: 'PADEL', icon: <SportIcon type="PADEL" className="w-4 h-4" /> },
  ]

  const tierOptions = [
    { value: 'Regular', label: 'Regular Member', desc: 'Pemain kasual umum' },
    { value: 'VIP Member', label: 'VIP Member', desc: 'Pelanggan setia & prioritas' },
  ]

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase()
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.preferred_sport || '').toLowerCase().includes(q)
      )
    })
  }, [customers, search])

  const handleSubmit = (e) => {
    e.preventDefault()
    addCustomer(formData)
    showToast(`Pelanggan baru "${formData.name}" berhasil ditambahkan!`)
    setFormData({
      name: '',
      phone: '',
      email: '',
      preferred_sport: 'FUTSAL',
      tier: 'Regular',
    })
    setModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteCustomer(deleteTarget.id)
      showToast(`Data pelanggan "${deleteTarget.name}" berhasil dihapus.`)
      setDeleteTarget(null)
    } catch (err) {
      console.error('Delete error', err)
      showToast('Gagal menghapus data pelanggan.')
    } finally {
      setIsDeleting(false)
    }
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
          <h1 className="text-2xl font-extrabold text-text-primary">Direktori Pelanggan & Pemain</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Daftar pemain terdaftar, riwayat jumlah bermain, total belanja sewa, status membership, dan chat WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-surface rounded-3xl p-4 sm:p-6 border border-border shadow-2xs">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, no. WhatsApp, atau olahraga..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:bg-surface focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-surface rounded-3xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-container-low/50 text-text-muted font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-4 sm:px-6">Nama & Kontak</th>
                <th className="py-4 px-4">Membership</th>
                <th className="py-4 px-4">Olahraga Favorit</th>
                <th className="py-4 px-4">Total Main</th>
                <th className="py-4 px-4">Total Belanja</th>
                <th className="py-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-extrabold text-xs shrink-0">
                          {(c.name || 'P').charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm">{c.name}</p>
                          <div className="flex items-center gap-3 text-[11px] text-text-muted mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone size={11} /> {c.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail size={11} /> {c.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          c.tier === 'VIP Member'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40'
                            : 'bg-surface-container text-text-secondary'
                        }`}
                      >
                        {c.tier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 font-semibold text-text-primary">
                        <SportIcon type={c.preferred_sport || 'FUTSAL'} className="w-3.5 h-3.5 text-primary" />
                        <span>{c.preferred_sport || 'FUTSAL'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-text-primary">
                      {c.total_bookings || 0} Kali
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-extrabold text-primary">
                      Rp{(c.total_spend || 0).toLocaleString('id-ID')}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${(c.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Chat WhatsApp"
                        >
                          <MessageSquare size={12} />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(c)}
                          className="p-1.5 rounded-lg border border-border text-danger hover:bg-danger/10 hover:border-danger/30 transition-colors cursor-pointer"
                          title="Hapus Data"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted">
                    Tidak ada data pelanggan yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Pelanggan */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-border space-y-5 animate-slide-in text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto ring-8 ring-danger/5">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-text-primary">
                Hapus Pelanggan?
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Apakah Anda yakin ingin menghapus data pemain <strong className="text-text-primary font-bold">{deleteTarget.name}</strong> ({deleteTarget.email})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-2xl border border-border text-left flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-extrabold text-xs shrink-0">
                {(deleteTarget.name || 'P').charAt(0)}
              </div>
              <div className="truncate text-xs">
                <p className="font-bold text-text-primary truncate">{deleteTarget.name}</p>
                <p className="text-[11px] text-text-muted truncate">{deleteTarget.phone} • {deleteTarget.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="w-full py-2.5 rounded-xl border border-border text-text-secondary font-bold text-xs hover:bg-surface-container transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-full py-2.5 rounded-xl bg-danger hover:bg-danger/90 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pelanggan */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-slide-in relative">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Registrasi Member</span>
              <h2 className="text-xl font-bold text-text-primary mt-0.5">
                Tambah Pelanggan Baru
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Nama Lengkap Pemain</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Rian Syahputra"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">No. WhatsApp</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081234567890"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomSelect
                  label="Olahraga Favorit"
                  value={formData.preferred_sport}
                  onChange={(val) => setFormData({ ...formData, preferred_sport: val })}
                  options={sportOptions}
                />

                <CustomSelect
                  label="Membership Tier"
                  value={formData.tier}
                  onChange={(val) => setFormData({ ...formData, tier: val })}
                  options={tierOptions}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-text-secondary font-semibold hover:bg-surface-container-low cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-xs cursor-pointer"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import {
  Plus, Trash2, CheckCircle2,
  X, Phone, Mail, Clock
} from 'lucide-react'
import useStaffStore from '../../stores/staffStore'
import CustomSelect from '../../components/CustomSelect'

export default function AdminStaff() {
  const { staffList, addStaff, deleteStaff, toggleStaffStatus } = useStaffStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CASHIER',
    role_label: 'Kasir & Check-In',
    shift: 'Shift Pagi (07:00 - 15:00)',
  })

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleRoleChange = (role) => {
    let label = 'Kasir & Check-In'
    if (role === 'SUPER_ADMIN') label = 'Super Admin / Owner'
    if (role === 'VENUE_ADMIN') label = 'Admin Lapangan & Jadwal'
    if (role === 'STAFF') label = 'Petugas Operasional & Lapangan'

    setFormData({ ...formData, role, role_label: label })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addStaff(formData)
    showToast(`Staf "${formData.name}" berhasil ditambahkan!`)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'CASHIER',
      role_label: 'Kasir & Check-In',
      shift: 'Shift Pagi (07:00 - 15:00)',
    })
    setModalOpen(false)
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
          <h1 className="text-2xl font-extrabold text-text-primary">Manage Staff & Petugas Venue</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Kelola hak akses akun staf admin, operator kasir check-in tiket, dan jadwal shift kerja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tambah Anggota Staf</span>
        </button>
      </div>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {staffList.map((staff) => {
          const isSuperAdmin = staff.role === 'SUPER_ADMIN'

          return (
            <div
              key={staff.id}
              className="bg-surface rounded-3xl p-6 border border-border shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-primary">{staff.name}</h3>
                    <p className="text-xs text-primary font-semibold">{staff.role_label}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isSuperAdmin) {
                      showToast('Akun Super Admin utama tidak dapat dinonaktifkan.', 'warning')
                      return
                    }
                    toggleStaffStatus(staff.id)
                    showToast(`Status staf ${staff.name} diubah.`)
                  }}
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider cursor-pointer ${
                    staff.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {staff.status === 'ACTIVE' ? '● Aktif' : '○ Nonaktif'}
                </button>
              </div>

              <div className="bg-surface-container-low rounded-2xl p-4 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Mail size={13} /> Email
                  </span>
                  <span className="font-semibold text-text-primary">{staff.email}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Phone size={13} /> WhatsApp
                  </span>
                  <span className="font-semibold text-text-primary">{staff.phone}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Clock size={13} /> Shift Kerja
                  </span>
                  <span className="font-semibold text-text-primary">{staff.shift}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-text-muted">
                <span>ID: {staff.id}</span>
                {!isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus anggota staf ${staff.name}?`)) {
                        deleteStaff(staff.id)
                        showToast(`Staf ${staff.name} berhasil dihapus.`)
                      }
                    }}
                    className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    title="Hapus Staf"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Tambah Staf */}
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
              <span className="text-xs font-bold text-primary uppercase">Manajemen Tim</span>
              <h2 className="text-xl font-bold text-text-primary mt-0.5">Tambah Anggota Staf</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ahmad Kasir"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Email Login Staf</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staf@court.in"
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

              <CustomSelect
                label="Peran / Hak Akses"
                value={formData.role}
                onChange={(val) => handleRoleChange(val)}
                options={roleOptions}
              />

              <CustomSelect
                label="Jadwal Shift"
                value={formData.shift}
                onChange={(val) => setFormData({ ...formData, shift: val })}
                options={shiftOptions}
              />

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
                  Simpan Staf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

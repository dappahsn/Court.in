import { useState } from 'react'
import {
  Plus, Trash2, Edit2, CheckCircle2,
  X, Phone, Mail, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react'
import useStaffStore from '../../stores/staffStore'
import CustomSelect from '../../components/CustomSelect'

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Admin / Owner' },
  { value: 'VENUE_ADMIN', label: 'Admin Lapangan & Jadwal' },
  { value: 'CASHIER', label: 'Kasir & Check-In' },
  { value: 'STAFF', label: 'Petugas Operasional & Lapangan' },
]

const SHIFT_OPTIONS = [
  { value: 'Full Time (All Access)', label: 'Full Time (All Access)' },
  { value: 'Shift Pagi (07:00 - 15:00)', label: 'Shift Pagi (07:00 - 15:00)' },
  { value: 'Shift Siang (12:00 - 20:00)', label: 'Shift Siang (12:00 - 20:00)' },
  { value: 'Shift Malam (15:00 - 23:00)', label: 'Shift Malam (15:00 - 23:00)' },
]

export default function AdminStaff() {
  const { staffList, addStaff, updateStaff, deleteStaff, toggleStaffStatus } = useStaffStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [deleteConfirmStaff, setDeleteConfirmStaff] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CASHIER',
    role_label: 'Kasir & Check-In',
    shift: 'Shift Pagi (07:00 - 15:00)',
    status: 'ACTIVE',
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

  const openAddModal = () => {
    setEditingStaff(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'CASHIER',
      role_label: 'Kasir & Check-In',
      shift: 'Shift Pagi (07:00 - 15:00)',
      status: 'ACTIVE',
    })
    setModalOpen(true)
  }

  const openEditModal = (staff) => {
    setEditingStaff(staff)
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      role_label: staff.role_label,
      shift: staff.shift,
      status: staff.status || 'ACTIVE',
    })
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingStaff) {
      updateStaff(editingStaff.id, formData)
      showToast(`Data staf "${formData.name}" berhasil diperbarui!`)
    } else {
      addStaff(formData)
      showToast(`Staf "${formData.name}" berhasil ditambahkan!`)
    }
    setModalOpen(false)
    setEditingStaff(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteConfirmStaff) return
    deleteStaff(deleteConfirmStaff.id)
    showToast(`Staf "${deleteConfirmStaff.name}" berhasil dihapus.`)
    setDeleteConfirmStaff(null)
  }

  return (
    <div className="space-y-6 pt-1">
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
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
              Manajemen Tim & Akun
            </span>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs text-text-muted font-medium">{staffList.length} Petugas Terdaftar</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary">Manage Staff & Petugas Venue</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Kelola data staf, edit informasi kontak, jadwal shift kerja, dan hak akses admin venue.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
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
              className="bg-surface rounded-3xl p-6 border border-border shadow-2xs flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-2xs">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-text-primary">{staff.name}</h3>
                      {isSuperAdmin && (
                        <ShieldCheck size={16} className="text-primary" title="Super Admin" />
                      )}
                    </div>
                    <p className="text-xs text-primary font-semibold">{staff.role_label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isSuperAdmin) {
                        showToast('Akun Super Admin utama tidak dapat dinonaktifkan.')
                        return
                      }
                      toggleStaffStatus(staff.id)
                      showToast(`Status staf ${staff.name} diubah.`)
                    }}
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider cursor-pointer transition-colors ${
                      staff.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {staff.status === 'ACTIVE' ? '● Aktif' : '○ Nonaktif'}
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-2xl p-4 border border-border space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Mail size={13} className="text-primary" /> Email
                  </span>
                  <span className="font-semibold text-text-primary">{staff.email}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Phone size={13} className="text-primary" /> WhatsApp
                  </span>
                  <span className="font-semibold text-text-primary">{staff.phone}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Clock size={13} className="text-primary" /> Shift Kerja
                  </span>
                  <span className="font-semibold text-text-primary">{staff.shift}</span>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="flex items-center justify-between pt-1 text-xs border-t border-border/60">
                <span className="text-[11px] text-text-muted font-mono">ID: {staff.id}</span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(staff)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-container text-text-primary font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                    title="Edit Data Staf"
                  >
                    <Edit2 size={13} className="text-primary" />
                    <span>Edit</span>
                  </button>

                  {!isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmStaff(staff)}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Hapus Staf"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Modal Tambah / Edit Staf ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-slide-in relative">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false)
                setEditingStaff(null)
              }}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary cursor-pointer p-1"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {editingStaff ? 'Perbarui Data Petugas' : 'Manajemen Tim & Kasir'}
              </span>
              <h2 className="text-xl font-extrabold text-text-primary mt-0.5">
                {editingStaff ? `Edit Staf: ${editingStaff.name}` : 'Tambah Anggota Staf'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Daffa Husen"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Email Akun Staf</label>
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
                  placeholder="0812-3456-7890"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <CustomSelect
                label="Peran / Hak Akses"
                value={formData.role}
                onChange={(val) => handleRoleChange(val)}
                options={ROLE_OPTIONS}
              />

              <CustomSelect
                label="Jadwal Shift Kerja"
                value={formData.shift}
                onChange={(val) => setFormData({ ...formData, shift: val })}
                options={SHIFT_OPTIONS}
              />

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false)
                    setEditingStaff(null)
                  }}
                  className="px-4 py-2.5 rounded-xl border border-border text-text-secondary font-semibold hover:bg-surface-container-low cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingStaff ? 'Simpan Perubahan' : 'Simpan Staf'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Konfirmasi Hapus Staf ── */}
      {deleteConfirmStaff && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-border space-y-5 animate-slide-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3 className="font-bold text-base text-text-primary">Hapus Anggota Staf?</h3>
              <p className="text-xs text-text-secondary mt-1">
                Apakah Anda yakin ingin menghapus akun staf <strong>{deleteConfirmStaff.name}</strong> ({deleteConfirmStaff.email})?
              </p>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmStaff(null)}
                className="w-1/2 py-2.5 rounded-xl border border-border text-text-secondary text-xs font-semibold hover:bg-surface-container-low cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

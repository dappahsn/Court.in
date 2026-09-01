import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Edit3, Trash2, CheckCircle2,
  X, MapPin, Upload, Image as ImageIcon,
  Link as LinkIcon, Check, ExternalLink
} from 'lucide-react'
import useCourtStore from '../../stores/courtStore'
import SportIcon from '../../components/SportIcon'
import CustomSelect from '../../components/CustomSelect'

const PRESET_IMAGES = [
  { id: 'futsal', label: 'Futsal Arena Pro', url: '/images/futsal.jpg', sport: 'FUTSAL' },
  { id: 'badminton', label: 'Badminton Hall BWF', url: '/images/badminton.jpg', sport: 'BADMINTON' },
  { id: 'padel', label: 'Padel Glass Panoramic', url: '/images/padel.jpg', sport: 'PADEL' },
  { id: 'complex', label: 'Sports Arena Center', url: '/images/hero.jpg', sport: 'ALL' },
]

export default function AdminCourts() {
  const { courts, addCourt, updateCourt, deleteCourt } = useCourtStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const [imageTab, setImageTab] = useState('preset') // 'preset' | 'upload' | 'url'
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'FUTSAL',
    price_per_hour: 150000,
    environment: 'Indoor',
    surface: 'Vinyl Pro Standard FIFA',
    location: 'Banda Aceh',
    address: 'Jl. Teuku Umar No. 45, Seutui, Banda Aceh',
    image_url: '/images/futsal.jpg',
    description: 'Lapangan olahraga dengan lantai berkualitas, pencahayaan LED terang, dan ventilasi sejuk.',
  })

  const sportOptions = [
    { value: 'FUTSAL', label: 'FUTSAL', icon: <SportIcon type="FUTSAL" className="w-4 h-4" /> },
    { value: 'BADMINTON', label: 'BADMINTON', icon: <SportIcon type="BADMINTON" className="w-4 h-4" /> },
    { value: 'PADEL', label: 'PADEL', icon: <SportIcon type="PADEL" className="w-4 h-4" /> },
  ]

  const envOptions = [
    { value: 'Indoor', label: 'Indoor (Dalam Ruangan)' },
    { value: 'Outdoor', label: 'Outdoor (Luar Ruangan)' },
  ]

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const openAddModal = () => {
    setEditingCourt(null)
    setImageTab('preset')
    setFormData({
      name: '',
      type: 'FUTSAL',
      price_per_hour: 150000,
      environment: 'Indoor',
      surface: 'Vinyl Pro Standard FIFA',
      location: 'Banda Aceh',
      address: 'Jl. Teuku Umar No. 45, Seutui, Banda Aceh',
      image_url: '/images/futsal.jpg',
      description: 'Lapangan olahraga dengan lantai berkualitas, pencahayaan LED terang, dan ventilasi sejuk.',
    })
    setModalOpen(true)
  }

  const openEditModal = (court) => {
    setEditingCourt(court)
    setImageTab('preset')
    setFormData({
      name: court.name,
      type: court.type,
      price_per_hour: court.price_per_hour,
      environment: court.environment,
      surface: court.surface,
      location: court.location,
      address: court.address,
      image_url: court.image_url,
      description: court.description,
    })
    setModalOpen(true)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Mohon pilih file gambar yang valid (.jpg, .png, .webp)')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64Url = event.target.result
        setFormData((prev) => ({ ...prev, image_url: base64Url }))
        showToast('Foto lapangan berhasil diunggah!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCourt) {
      updateCourt(editingCourt.id, formData)
      showToast(`Lapangan "${formData.name}" berhasil diperbarui! Foto telah disinkronisasi ke halaman user.`)
    } else {
      addCourt(formData)
      showToast(`Lapangan baru "${formData.name}" berhasil ditambahkan dan tampil di halaman user!`)
    }
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
          <h1 className="text-2xl font-extrabold text-text-primary">Kelola Lapangan Olahraga</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Daftar seluruh venue olahraga terdaftar, tarif sewa per jam, spesifikasi lantai, foto lapangan, dan fasilitas untuk halaman user.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tambah Lapangan Baru</span>
        </button>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <div
            key={court.id}
            className="bg-surface rounded-3xl border border-border shadow-2xs overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-surface-container overflow-hidden group">
              <img
                src={court.image_url}
                alt={court.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="bg-surface/90 backdrop-blur-xs text-text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {court.environment}
                </span>
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  <SportIcon type={court.type} className="w-3 h-3" />
                  <span>{court.type}</span>
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-text-primary line-clamp-1">{court.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">{court.surface}</p>
                <div className="flex items-center gap-1 text-[11px] text-text-secondary mt-1">
                  <MapPin size={12} className="text-text-muted" />
                  <span className="truncate">{court.address}</span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2 mt-2 leading-relaxed">
                  {court.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-text-muted block">Tarif Sewa</span>
                  <span className="text-base font-extrabold text-primary">
                    Rp{court.price_per_hour.toLocaleString('id-ID')}
                    <span className="text-[10px] font-normal text-text-muted">/jam</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/courts/${court.id}`}
                    target="_blank"
                    className="p-2 rounded-xl border border-border text-text-muted hover:text-primary hover:bg-primary-light transition-colors cursor-pointer"
                    title="Lihat Pratinjau di Halaman User"
                  >
                    <ExternalLink size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => openEditModal(court)}
                    className="p-2 rounded-xl border border-border text-text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                    title="Edit Data Lapangan & Foto"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Yakin ingin menghapus ${court.name}?`)) {
                        deleteCourt(court.id)
                        showToast(`Lapangan "${court.name}" berhasil dihapus.`)
                      }
                    }}
                    className="p-2 rounded-xl border border-border text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    title="Hapus Lapangan"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-slide-in relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-xs font-bold text-primary uppercase">Inventaris Venue</span>
              <h2 className="text-xl font-bold text-text-primary mt-0.5">
                {editingCourt ? 'Edit Data & Foto Lapangan' : 'Tambah Lapangan Olahraga Baru'}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Foto dan informasi yang diinput akan langsung ditampilkan pada katalog pencarian dan halaman detail pengguna.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* ── Visual Image Manager & Live Preview ── */}
              <div className="space-y-2.5 bg-surface-container-low p-4 rounded-2xl border border-border">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-text-primary uppercase tracking-wider text-[11px]">
                    Foto Lapangan (Tampil di Halaman User)
                  </label>
                  <span className="text-[10px] text-text-muted">Preview Real-time</span>
                </div>

                {/* Live Image Preview */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-border group shadow-xs">
                  <img
                    src={formData.image_url || '/images/hero.jpg'}
                    alt="Preview Lapangan"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/hero.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3 text-white">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold bg-primary px-2 py-0.5 rounded-md">
                        {formData.type} • {formData.environment}
                      </span>
                      <p className="font-extrabold text-sm">{formData.name || 'Nama Lapangan Olahraga'}</p>
                    </div>
                  </div>
                </div>

                {/* Image Selection Tabs */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() => setImageTab('preset')}
                      className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        imageTab === 'preset'
                          ? 'bg-primary text-white font-bold shadow-2xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <ImageIcon size={13} />
                      <span>Galeri Preset</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        imageTab === 'upload'
                          ? 'bg-primary text-white font-bold shadow-2xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Upload size={13} />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        imageTab === 'url'
                          ? 'bg-primary text-white font-bold shadow-2xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <LinkIcon size={13} />
                      <span>URL Gambar</span>
                    </button>
                  </div>

                  {/* Tab 1: Galeri Preset */}
                  {imageTab === 'preset' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {PRESET_IMAGES.map((preset) => {
                        const isSelected = formData.image_url === preset.url
                        return (
                          <div
                            key={preset.id}
                            onClick={() => setFormData({ ...formData, image_url: preset.url })}
                            className={`relative aspect-[4/3] rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                              isSelected
                                ? 'border-primary ring-2 ring-primary/40 shadow-xs'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 p-1.5 flex flex-col justify-between text-white text-[10px]">
                              {isSelected ? (
                                <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center self-end shadow-xs">
                                  <Check size={10} strokeWidth={3} />
                                </span>
                              ) : <span />}
                              <span className="font-bold line-clamp-1 leading-tight">{preset.label}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Tab 2: Upload File Lokal */}
                  {imageTab === 'upload' && (
                    <div className="pt-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border hover:border-primary rounded-2xl p-4 text-center cursor-pointer transition-colors bg-surface hover:bg-surface-container-low/50 space-y-1.5"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mx-auto">
                          <Upload size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-xs">
                            Klik untuk pilih file foto dari komputer/HP
                          </p>
                          <p className="text-[10px] text-text-muted">
                            Mendukung JPG, PNG, WEBP (Otomatis dikonversi & tersimpan)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: URL Gambar Eksternal */}
                  {imageTab === 'url' && (
                    <div className="pt-1 space-y-1">
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/foto-lapangan.jpg"
                        className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-xs text-text-primary focus:border-primary focus:outline-none"
                      />
                      <p className="text-[10px] text-text-muted">
                        Tempel URL tautan gambar langsung (CDN / Cloud Storage).
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Input Fields */}
              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Nama Lapangan</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Futsal Arena - Lapangan B"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomSelect
                  label="Cabang Olahraga"
                  value={formData.type}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                  options={sportOptions}
                />

                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Tarif Sewa / Jam</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                      Rp
                    </span>
                    <input
                      type="number"
                      step="5000"
                      value={formData.price_per_hour}
                      onChange={(e) =>
                        setFormData({ ...formData, price_per_hour: parseInt(e.target.value, 10) || 0 })
                      }
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs font-semibold text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomSelect
                  label="Lingkungan"
                  value={formData.environment}
                  onChange={(val) => setFormData({ ...formData, environment: val })}
                  options={envOptions}
                />

                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Tipe Permukaan / Lantai</label>
                  <input
                    type="text"
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                    placeholder="Vinyl / Karpet / Rumput Sintetis"
                    required
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Alamat Lengkap Venue</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Alamat jalan venue olahraga"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text-muted uppercase mb-1">Deskripsi Lapangan</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Informasi pencahayaan, ventilasi, atau spesifikasi lapangan..."
                  required
                  className="w-full p-3 bg-surface-container-low border border-border rounded-xl text-xs text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
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
                  {editingCourt ? 'Simpan Perubahan' : 'Tambah Lapangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Shield, Sliders, CheckCircle2, Phone,
  Mail, Calendar, Camera, Trash2, AlertCircle
} from 'lucide-react'
import useAuthStore from '../stores/authStore'
import SportIcon from '../components/SportIcon'
import { compressAvatar } from '../utils/imageCompressor'

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated } = useAuthStore()
  const fileInputRef = useRef(null)

  const getStoredAvatar = () => (user?.email ? localStorage.getItem('courtin_avatar_' + user.email.toLowerCase()) : null) || user?.avatar_url || null

  const [activeTab, setActiveTab] = useState('personal')
  const [fullName, setFullName] = useState(() => user?.full_name || '')
  const [email, setEmail] = useState(() => user?.email || '')
  const [phone, setPhone] = useState(() => user?.phone_number || '')
  const [birthDate, setBirthDate] = useState('1998-08-15')
  const [avatarUrl, setAvatarUrl] = useState(getStoredAvatar)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Adjust state during render if user changes
  const [prevUserEmail, setPrevUserEmail] = useState(user?.email)
  if (user?.email !== prevUserEmail) {
    setPrevUserEmail(user?.email)
    setFullName(user?.full_name || '')
    setEmail(user?.email || '')
    setPhone(user?.phone_number || '')
    setAvatarUrl(getStoredAvatar())
  }

  // Handle Photo File Selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    setUploadError('')

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file foto maksimal 5MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar (JPG, PNG, atau WebP).')
      return
    }

    try {
      const compressedImage = await compressAvatar(file, 256, 256, 0.85)
      setAvatarUrl(compressedImage)
      await updateProfile({ avatar_url: compressedImage })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to compress avatar', err)
      setUploadError('Gagal memproses gambar. Silakan coba gambar lain.')
    }
  }

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    setAvatarUrl(null)
    await updateProfile({ avatar_url: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    await updateProfile({
      full_name: fullName,
      email,
      phone_number: phone,
      avatar_url: avatarUrl,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  // ── Unauthenticated Guard ──
  if (!isAuthenticated) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-surface rounded-2xl p-8 sm:p-12 border border-border shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-2xs">
            <User size={24} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Silakan Masuk Terlebih Dahulu
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
              Halaman profil dan pengaturan akun hanya dapat diakses setelah Anda masuk ke akun court.in.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/login?redirect=/profile"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center"
            >
              Masuk ke Akun
            </Link>
            <Link
              to="/register?redirect=/profile"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-surface hover:bg-surface-container-low text-text-primary font-semibold text-sm transition-all flex items-center justify-center"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          Pengaturan Akun & Profil
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Kelola informasi identitas akun dan preferensi Anda di court.in
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* ── Left Sidebar Navigation (4 cols) ── */}
        <aside className="md:col-span-4 space-y-1.5 bg-surface p-3 rounded-2xl border border-border shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-left cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-primary-light text-primary font-bold'
                : 'text-text-primary hover:bg-surface-container-low'
            }`}
          >
            <User size={18} />
            <span>Informasi Pribadi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-left cursor-pointer ${
              activeTab === 'security'
                ? 'bg-primary-light text-primary font-bold'
                : 'text-text-primary hover:bg-surface-container-low'
            }`}
          >
            <Shield size={18} />
            <span>Keamanan Akun</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-left cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-primary-light text-primary font-bold'
                : 'text-text-primary hover:bg-surface-container-low'
            }`}
          >
            <Sliders size={18} />
            <span>Preferensi Olahraga</span>
          </button>
        </aside>

        {/* ── Right Content Panel (8 cols) ── */}
        <main className="md:col-span-8 space-y-6">
          {/* User Banner Card with Photo Edit */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with Camera Trigger */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary text-white border-2 border-border overflow-hidden flex items-center justify-center text-3xl font-extrabold shadow-sm">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{fullName.charAt(0)}</span>
                )}
              </div>

              {/* Hover overlay button to trigger file input */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Ganti Foto Profil"
              >
                <Camera size={20} />
                <span className="text-[10px] font-semibold mt-0.5">Ubah</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white shadow-md border-2 border-white hover:bg-primary-container transition-colors"
                title="Upload Foto"
              >
                <Camera size={14} />
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* User Meta & Action Buttons */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{fullName}</h2>
                  <p className="text-xs text-text-secondary">
                    Bergabung sejak {user?.joined_date || 'Maret 2024'}
                  </p>
                </div>
                <span className="inline-block text-[11px] font-semibold text-primary bg-primary-light px-3 py-1 rounded-full self-center sm:self-start">
                  Akun Terverifikasi
                </span>
              </div>

              {/* Photo Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-container-low text-xs font-semibold text-text-primary transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Camera size={13} className="text-primary" />
                  <span>Pilih Foto Baru</span>
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-danger/10 text-xs font-semibold text-danger transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Hapus Foto</span>
                  </button>
                )}
                <span className="text-[11px] text-text-muted hidden sm:inline ml-1">
                  Format JPG, PNG, atau WebP (Maks. 3MB)
                </span>
              </div>

              {uploadError && (
                <div className="text-xs text-danger flex items-center gap-1 mt-1 justify-center sm:justify-start font-medium">
                  <AlertCircle size={14} />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-2xs">
            {activeTab === 'personal' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h3 className="text-base font-bold text-text-primary">Informasi Data Diri</h3>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>

                {savedSuccess && (
                  <div className="p-3.5 rounded-xl bg-primary-light text-primary text-sm font-semibold flex items-center gap-2 animate-slide-in">
                    <CheckCircle2 size={16} />
                    <span>Perubahan profil berhasil disimpan!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-bold text-text-muted uppercase">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-text-muted uppercase">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-text-muted uppercase">
                      Nomor Telepon / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-bold text-text-muted uppercase">
                      Tanggal Lahir
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-text-primary pb-3 border-b border-border">
                  Keamanan Kata Sandi
                </h3>
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                      Kata Sandi Saat Ini
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
                      Kata Sandi Baru (Min. 8 karakter)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Sandi berhasil diperbarui!')}
                    className="py-2.5 px-5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-container transition-colors shadow-xs"
                  >
                    Perbarui Kata Sandi
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-text-primary pb-3 border-b border-border">
                  Preferensi Olahraga Favorit
                </h3>
                <p className="text-sm text-text-secondary">
                  Pilih olahraga favorit untuk personalisasi rekomendasi lapangan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { type: 'FUTSAL', label: 'Futsal' },
                    { type: 'BADMINTON', label: 'Badminton' },
                    { type: 'PADEL', label: 'Padel' },
                  ].map((sp) => (
                    <label
                      key={sp.type}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface-container-low cursor-pointer hover:bg-surface transition-colors"
                    >
                      <input type="checkbox" defaultChecked className="accent-primary w-4 h-4 cursor-pointer" />
                      <div className="flex items-center gap-2">
                        <SportIcon type={sp.type} className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm text-text-primary">{sp.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

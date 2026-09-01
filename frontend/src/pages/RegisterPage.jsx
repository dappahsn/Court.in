import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  User, Mail, Phone, Lock, Calendar, ArrowRight,
  AlertCircle, Eye, EyeOff
} from 'lucide-react'
import useAuthStore from '../stores/authStore'
import Logo from '../components/Logo'

const MONTH_OPTIONS = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const { register, isLoading, isAuthenticated } = useAuthStore()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  
  // Custom 3-Field Birth Date State
  const [birthDay, setBirthDay] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear, setBirthYear] = useState('')

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Generate Year options (from current year - 8 down to 1945)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear - 6
    const minYear = 1945
    const years = []
    for (let y = maxAllowedYear; y >= minYear; y--) {
      years.push(String(y))
    }
    return years
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  // Handle Phone input formatting (only digits)
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '')
    setPhone(val)
    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: '' }))
    }
  }

  const validateAll = () => {
    const errors = {}
    const cleanName = fullName.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.replace(/\D/g, '')

    if (!cleanName) {
      errors.fullName = 'Nama lengkap wajib diisi.'
    } else if (cleanName.length < 3) {
      errors.fullName = 'Nama lengkap minimal 3 karakter.'
    }

    if (!cleanEmail) {
      errors.email = 'Alamat email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = 'Format email tidak valid (contoh: nama@email.com).'
    }

    if (!cleanPhone) {
      errors.phone = 'Nomor WhatsApp/HP wajib diisi.'
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Nomor HP minimal 10 digit angka (contoh: 081234567890).'
    } else if (cleanPhone.length > 15) {
      errors.phone = 'Nomor HP maksimal 15 digit angka.'
    }

    if (!birthDay || !birthMonth || !birthYear) {
      errors.birthDate = 'Lengkapi tanggal, bulan, dan tahun lahir Anda.'
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 8) {
      errors.password = 'Kata sandi minimal 8 karakter.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const isValid = validateAll()
    if (!isValid) return

    const cleanName = fullName.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.replace(/\D/g, '')
    const formattedBirthDate = `${birthYear}-${birthMonth}-${birthDay}`

    const res = await register({
      full_name: cleanName,
      email: cleanEmail,
      phone_number: cleanPhone.startsWith('0') ? cleanPhone : `0${cleanPhone}`,
      birth_date: formattedBirthDate,
      password,
    })

    if (res.success) {
      navigate(redirectPath, { replace: true })
    } else {
      setErrorMsg(res.message || 'Pendaftaran gagal. Silakan coba kembali.')
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface rounded-3xl p-8 sm:p-10 border border-border shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <Logo variant="full" className="h-16 sm:h-20 mx-auto" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              Daftar Akun Baru
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Mulai nikmati kemudahan booking lapangan futsal, badminton & padel
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold flex items-center gap-2.5 animate-slide-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form with noValidate to block native browser popups */}
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Nama Lengkap */}
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: '' }))
                }}
                placeholder="Muhammad Daffa"
                className={`w-full pl-10 pr-4 py-2.5 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-all placeholder:text-text-muted/60 ${
                  fieldErrors.fullName
                    ? 'border-danger/80 focus:border-danger bg-danger/5 ring-1 ring-danger/20'
                    : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1 animate-slide-in">
                <AlertCircle size={12} className="shrink-0" />
                <span>{fieldErrors.fullName}</span>
              </p>
            )}
          </div>

          {/* 2. Alamat Email */}
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }))
                }}
                placeholder="nama@email.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-all placeholder:text-text-muted/60 ${
                  fieldErrors.email
                    ? 'border-danger/80 focus:border-danger bg-danger/5 ring-1 ring-danger/20'
                    : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1 animate-slide-in">
                <AlertCircle size={12} className="shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* 3. Nomor HP / WhatsApp */}
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              No. WhatsApp / HP
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="081234567890"
                maxLength={15}
                className={`w-full pl-10 pr-4 py-2.5 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-all placeholder:text-text-muted/60 ${
                  fieldErrors.phone
                    ? 'border-danger/80 focus:border-danger bg-danger/5 ring-1 ring-danger/20'
                    : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1 animate-slide-in">
                <AlertCircle size={12} className="shrink-0" />
                <span>{fieldErrors.phone}</span>
              </p>
            )}
          </div>

          {/* 4. Tanggal Lahir (Clean 3-Dropdown Selector) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              <Calendar size={13} className="text-primary" />
              <span>Tanggal Lahir</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Hari */}
              <select
                value={birthDay}
                onChange={(e) => {
                  setBirthDay(e.target.value)
                  if (fieldErrors.birthDate) setFieldErrors((p) => ({ ...p, birthDate: '' }))
                }}
                className={`w-full px-2.5 py-2.5 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-all cursor-pointer ${
                  fieldErrors.birthDate && !birthDay
                    ? 'border-danger/80 bg-danger/5'
                    : 'border-border focus:border-primary'
                }`}
              >
                <option value="">Tanggal</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const val = String(day).padStart(2, '0')
                  return (
                    <option key={val} value={val}>
                      {day}
                    </option>
                  )
                })}
              </select>

              {/* Bulan */}
              <select
                value={birthMonth}
                onChange={(e) => {
                  setBirthMonth(e.target.value)
                  if (fieldErrors.birthDate) setFieldErrors((p) => ({ ...p, birthDate: '' }))
                }}
                className={`w-full px-2.5 py-2.5 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-all cursor-pointer ${
                  fieldErrors.birthDate && !birthMonth
                    ? 'border-danger/80 bg-danger/5'
                    : 'border-border focus:border-primary'
                }`}
              >
                <option value="">Bulan</option>
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {/* Tahun */}
              <select
                value={birthYear}
                onChange={(e) => {
                  setBirthYear(e.target.value)
                  if (fieldErrors.birthDate) setFieldErrors((p) => ({ ...p, birthDate: '' }))
                }}
                className={`w-full px-2.5 py-2.5 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-all cursor-pointer ${
                  fieldErrors.birthDate && !birthYear
                    ? 'border-danger/80 bg-danger/5'
                    : 'border-border focus:border-primary'
                }`}
              >
                <option value="">Tahun</option>
                {yearOptions.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {fieldErrors.birthDate && (
              <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1 animate-slide-in">
                <AlertCircle size={12} className="shrink-0" />
                <span>{fieldErrors.birthDate}</span>
              </p>
            )}
          </div>

          {/* 5. Kata Sandi */}
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }))
                }}
                placeholder="Minimal 8 karakter"
                className={`w-full pl-10 pr-11 py-2.5 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-all placeholder:text-text-muted/60 ${
                  fieldErrors.password
                    ? 'border-danger/80 focus:border-danger bg-danger/5 ring-1 ring-danger/20'
                    : 'border-border focus:border-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1 animate-slide-in">
                <AlertCircle size={12} className="shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-primary hover:bg-primary-container text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Mendaftarkan ke Cloud...</span>
              </span>
            ) : (
              <>
                <span>Buat Akun Sekarang</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-text-muted leading-relaxed pt-1">
            Dengan mendaftar, Anda menyetujui{' '}
            <Link to="/terms" className="text-primary font-semibold hover:underline">Syarat & Ketentuan</Link> serta{' '}
            <Link to="/privacy" className="text-primary font-semibold hover:underline">Kebijakan Privasi</Link> court.in
          </p>
        </form>

        <div className="pt-2 border-t border-border text-center">
          <p className="text-xs text-text-secondary">
            Sudah punya akun?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="font-bold text-primary hover:underline">
              Masuk di Sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

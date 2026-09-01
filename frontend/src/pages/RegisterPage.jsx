import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  User, Mail, Phone, Lock, Calendar, ArrowRight,
  AlertCircle, Eye, EyeOff
} from 'lucide-react'
import useAuthStore from '../stores/authStore'
import Logo from '../components/Logo'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const { register, isLoading, isAuthenticated } = useAuthStore()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const cleanName = fullName.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.replace(/\D/g, '')

    if (cleanName.length < 3) {
      setErrorMsg('Nama lengkap harus minimal 3 karakter.')
      return
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    if (!isEmailValid) {
      setErrorMsg('Format email tidak valid. Pastikan menyertakan @ dan domain yang benar.')
      return
    }

    if (cleanPhone.length < 10) {
      setErrorMsg('Nomor HP/WhatsApp harus minimal 10 digit angka (contoh: 081234567890).')
      return
    }

    if (cleanPhone.length > 15) {
      setErrorMsg('Nomor HP/WhatsApp maksimal 15 digit angka.')
      return
    }

    if (!birthDate) {
      setErrorMsg('Harap masukkan tanggal lahir Anda.')
      return
    }

    if (new Date(birthDate) > new Date()) {
      setErrorMsg('Tanggal lahir tidak valid.')
      return
    }

    if (password.length < 8) {
      setErrorMsg('Kata sandi harus minimal 8 karakter.')
      return
    }

    const res = await register({
      full_name: cleanName,
      email: cleanEmail,
      phone_number: cleanPhone.startsWith('0') ? cleanPhone : `0${cleanPhone}`,
      birth_date: birthDate,
      password,
    })

    if (res.success) {
      navigate(redirectPath, { replace: true })
    } else {
      setErrorMsg(res.message || 'Pendaftaran gagal. Silakan coba kembali.')
    }
  }

  const maxDate = new Date().toISOString().split('T')[0]

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Muhammad Daffa"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none transition-all placeholder:text-text-muted/60"
              />
            </div>
          </div>

          {/* 2. Alamat Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none transition-all placeholder:text-text-muted/60"
              />
            </div>
          </div>

          {/* 3. Nomor HP / WhatsApp */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              No. WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="081234567890"
                maxLength={15}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none transition-all placeholder:text-text-muted/60"
              />
            </div>
          </div>

          {/* 4. Tanggal Lahir */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              Tanggal Lahir
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
              <input
                type="date"
                value={birthDate}
                max={maxDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* 5. Kata Sandi */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              Kata Sandi (Minimal 8 Karakter)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full pl-10 pr-11 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none transition-all placeholder:text-text-muted/60"
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-primary hover:bg-primary-container text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Mendaftarkan...</span>
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

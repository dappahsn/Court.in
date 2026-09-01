import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  User, Mail, Phone, Lock, Calendar, ArrowRight,
  AlertCircle, CheckCircle2, Circle, Eye, EyeOff
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

  // Real-time Validations
  const isNameValid = fullName.trim().length >= 3
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  
  // Clean phone number: digits only
  const cleanPhoneDigits = phone.replace(/\D/g, '')
  const isPhoneValid = cleanPhoneDigits.length >= 10 && cleanPhoneDigits.length <= 14 && (cleanPhoneDigits.startsWith('08') || cleanPhoneDigits.startsWith('628') || cleanPhoneDigits.startsWith('8'))
  
  // Birth date validation (must be selected and in the past)
  const isBirthDateValid = Boolean(birthDate && new Date(birthDate) < new Date())

  // Password validation (min 8 chars)
  const isPasswordValid = password.length >= 8

  // All valid
  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isBirthDateValid && isPasswordValid

  // Handle Phone input formatting (only numbers)
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^\d+]/g, '')
    setPhone(val)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!isNameValid) {
      setErrorMsg('Nama lengkap harus minimal 3 karakter.')
      return
    }

    if (!isEmailValid) {
      setErrorMsg('Format email tidak valid. Pastikan menyertakan @ dan domain yang benar.')
      return
    }

    if (!isPhoneValid) {
      setErrorMsg('Nomor WhatsApp harus valid minimal 10 digit (contoh: 081234567890).')
      return
    }

    if (!isBirthDateValid) {
      setErrorMsg('Harap masukkan tanggal lahir yang valid.')
      return
    }

    if (!isPasswordValid) {
      setErrorMsg('Kata sandi harus minimal 8 karakter.')
      return
    }

    const res = await register({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone_number: cleanPhoneDigits.startsWith('0') ? cleanPhoneDigits : `0${cleanPhoneDigits}`,
      birth_date: birthDate,
      password,
    })

    if (res.success) {
      navigate(redirectPath, { replace: true })
    } else {
      setErrorMsg(res.message || 'Pendaftaran gagal. Silakan coba kembali.')
    }
  }

  // Max birth date allowed (must be at least today)
  const maxDate = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-surface rounded-3xl p-8 sm:p-10 border border-border shadow-2xl space-y-6">
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
              Mulai nikmati kemudahan booking lapangan futsal, badminton & padel secara real-time
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

          {/* 3. Nomor HP / WhatsApp & Tanggal Lahir (2 Kolom di Layar Lebar) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nomor HP */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
                  No. WhatsApp
                </label>
                <span className={`text-[10px] font-semibold ${
                  cleanPhoneDigits.length === 0
                    ? 'text-text-muted'
                    : isPhoneValid
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}>
                  {cleanPhoneDigits.length > 0 ? `${cleanPhoneDigits.length} digit` : 'Min. 10 digit'}
                </span>
              </div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="081234567890"
                  maxLength={15}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-all placeholder:text-text-muted/60 ${
                    cleanPhoneDigits.length > 0 && !isPhoneValid
                      ? 'border-amber-400 focus:border-amber-500'
                      : 'border-border focus:border-primary'
                  }`}
                />
              </div>
            </div>

            {/* Tanggal Lahir */}
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
          </div>

          {/* 4. Kata Sandi */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-text-muted uppercase tracking-wider">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
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

          {/* ── Requirements Checklist (Enhanced UI) ── */}
          <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-border/80 space-y-2 text-xs">
            <span className="font-bold text-text-primary text-[11px] block uppercase tracking-wide">
              Ketentuan Pendaftaran Akun:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {/* Req 1: Phone */}
              <div className="flex items-center gap-1.5">
                {isPhoneValid ? (
                  <CheckCircle2 size={13} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={13} className="text-text-muted/50 shrink-0" />
                )}
                <span className={isPhoneValid ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-text-secondary'}>
                  Nomor HP min. 10 digit (08...)
                </span>
              </div>

              {/* Req 2: Email */}
              <div className="flex items-center gap-1.5">
                {isEmailValid ? (
                  <CheckCircle2 size={13} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={13} className="text-text-muted/50 shrink-0" />
                )}
                <span className={isEmailValid ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-text-secondary'}>
                  Format email valid (@ domain)
                </span>
              </div>

              {/* Req 3: Birth Date */}
              <div className="flex items-center gap-1.5">
                {isBirthDateValid ? (
                  <CheckCircle2 size={13} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={13} className="text-text-muted/50 shrink-0" />
                )}
                <span className={isBirthDateValid ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-text-secondary'}>
                  Tanggal lahir terisi
                </span>
              </div>

              {/* Req 4: Password */}
              <div className="flex items-center gap-1.5">
                {isPasswordValid ? (
                  <CheckCircle2 size={13} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={13} className="text-text-muted/50 shrink-0" />
                )}
                <span className={isPasswordValid ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-text-secondary'}>
                  Kata sandi min. 8 karakter
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isFormValid
                ? 'bg-primary hover:bg-primary-container text-white active:scale-[0.99]'
                : 'bg-primary/50 text-white/80 cursor-not-allowed'
            }`}
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

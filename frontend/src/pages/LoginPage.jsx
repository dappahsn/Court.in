import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import Logo from '../components/Logo'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const isAdminTarget = redirectPath.startsWith('/admin')
  const { user, login, isLoading, isAuthenticated } = useAuthStore()

  const [email, setEmail] = useState(isAdminTarget ? 'admin@court.in' : '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Redirect if already authenticated as the correct role
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdminTarget && user?.role !== 'ADMIN') {
        // Logged in as customer, but want to access admin -> don't redirect, let them authenticate as admin
        return
      }
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, user, navigate, redirectPath, isAdminTarget])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const errors = {}
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      errors.email = 'Alamat email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = 'Format email tidak valid (contoh: nama@email.com).'
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    const res = await login(cleanEmail, password)
    if (res.success) {
      navigate(redirectPath, { replace: true })
    } else {
      setErrorMsg(res.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface rounded-3xl p-8 sm:p-10 border border-border shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <Logo variant="full" className="h-16 sm:h-20 mx-auto" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              {isAdminTarget ? 'Login Portal Pengelola Venue' : 'Masuk ke Akun Anda'}
            </h1>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {isAdminTarget
                ? 'Autentikasi keamanan administrator untuk mengelola operasional venue'
                : 'Pesan lapangan secara real-time dan pantau e-ticket Anda'}
            </p>
          </div>
        </div>

        {isAdminTarget && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2.5 font-medium">
            <ShieldCheck size={18} className="shrink-0" />
            <span>Halaman ini khusus untuk staf dan pemilik venue resmi <strong>court.in</strong>.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold flex items-center gap-2.5 animate-slide-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form with noValidate */}
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
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
                placeholder={isAdminTarget ? 'admin@court.in' : 'nama@email.com'}
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-3 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-colors ${
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

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Kata Sandi
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Silakan hubungi administrator sistem atau WhatsApp customer care untuk reset kata sandi.')
                }}
                className="text-xs text-primary hover:underline font-medium"
              >
                Lupa Sandi?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }))
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full pl-10 pr-11 py-3 bg-surface-container-low border rounded-xl text-sm text-text-primary focus:bg-surface focus:outline-none transition-colors ${
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-primary hover:bg-primary-container text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Memverifikasi Akun...</span>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-border text-center">
          <p className="text-xs text-text-secondary">
            Belum punya akun?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="font-bold text-primary hover:underline">
              Daftar Akun Baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

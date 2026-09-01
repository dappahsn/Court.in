import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, Zap } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import Logo from '../components/Logo'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const isAdminTarget = redirectPath.startsWith('/admin')
  const { login, loginDemo, loginAdminDemo, isLoading, isAuthenticated } = useAuthStore()

  const [email, setEmail] = useState(isAdminTarget ? 'admin@court.in' : '')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('Harap isi email dan kata sandi.')
      return
    }

    const res = await login(email, password)
    if (res.success) {
      navigate(redirectPath, { replace: true })
    } else {
      setErrorMsg(res.message)
    }
  }

  const handleDemoLogin = () => {
    if (isAdminTarget) {
      loginAdminDemo()
    } else {
      loginDemo()
    }
    navigate(redirectPath, { replace: true })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface rounded-2xl p-8 sm:p-10 border border-border shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <Logo variant="full" className="h-16 sm:h-20 mx-auto" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {isAdminTarget ? 'Login Portal Pengelola' : 'Masuk ke Akun Anda'}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {isAdminTarget
                ? 'Autentikasi keamanan untuk mengakses operasional venue'
                : 'Booking lapangan cepat & kelola tiket Anda'}
            </p>
          </div>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="p-4 rounded-xl bg-primary-light border border-primary/20 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-primary text-xs font-bold">
            <Zap size={14} />
            <span>Mode Demo Cepat</span>
          </div>
          <p className="text-xs text-text-secondary">
            {isAdminTarget
              ? 'Akses instan ke seluruh modul admin & kasir venue:'
              : 'Coba semua alur booking & ulasan langsung:'}
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 bg-primary hover:bg-primary-container text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {isAdminTarget
              ? 'Masuk sebagai Super Admin (admin@court.in)'
              : 'Masuk dengan Akun Demo (Daffa Husen)'}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-danger/15 text-danger text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-muted uppercase">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-muted uppercase">
                Kata Sandi
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Silakan hubungi bantuan WhatsApp atau gunakan Akun Demo.')
                }}
                className="text-xs text-primary hover:underline font-medium"
              >
                Lupa Sandi?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-center text-text-secondary">
          Belum punya akun?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="font-semibold text-primary hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}

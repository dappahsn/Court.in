import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react'
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

    if (password.length < 8) {
      setErrorMsg('Kata sandi harus minimal 8 karakter')
      return
    }

    const res = await register({
      full_name: fullName,
      email,
      phone_number: phone,
      password,
    })

    if (res.success) {
      navigate(redirectPath, { replace: true })
    } else {
      setErrorMsg(res.message)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface rounded-2xl p-8 sm:p-10 border border-border shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <Logo variant="full" className="h-16 sm:h-20 mx-auto" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Daftar Akun Baru
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Mulai nikmati kemudahan booking lapangan futsal, badminton & padel
            </p>
          </div>
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
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
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
                placeholder="nama@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-muted uppercase">
              No. WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:bg-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-muted uppercase">
              Kata Sandi (Minimal 8 karakter)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
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
              <span>Mendaftarkan...</span>
            ) : (
              <>
                <span>Buat Akun Sekarang</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-text-muted leading-relaxed">
            Dengan mendaftar, Anda menyetujui{' '}
            <Link to="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link> serta{' '}
            <Link to="/privacy" className="text-primary hover:underline">Kebijakan Privasi</Link> court.in
          </p>
        </form>

        <p className="text-xs text-center text-text-secondary">
          Sudah punya akun?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="font-semibold text-primary hover:underline">
            Masuk di Sini
          </Link>
        </p>
      </div>
    </div>
  )
}

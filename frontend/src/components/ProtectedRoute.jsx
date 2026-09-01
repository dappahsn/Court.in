import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react'
import useAuthStore from '../stores/authStore'

/**
 * ProtectedRoute Guard Component
 * Safely guards Customer and Admin routes with clear feedback and seamless switching.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    const redirectUrl = location.pathname + location.search
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 max-w-md w-full text-center space-y-6 shadow-2xl text-white">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto ring-1 ring-rose-500/40">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight">
              Akses Ditolak
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman ini diperuntukkan khusus pengelola venue resmi <strong>court.in</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-left space-y-1">
            <span className="text-slate-400 block text-[11px]">Akun yang sedang aktif:</span>
            <p className="text-slate-200 font-bold truncate">
              {user?.full_name || 'Pengguna'} ({user?.email})
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] font-semibold uppercase">
              Role: {user?.role || 'CUSTOMER'}
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login?redirect=/admin')
              }}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={15} />
              <span>Ganti & Masuk dengan Akun Admin</span>
            </button>
            <Link
              to="/"
              className="w-full py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}

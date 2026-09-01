import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { User, Menu, X, LogOut, Calendar, ShieldCheck } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import Logo from './Logo'

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/explore', label: 'Jelajah Lapangan' },
  { to: '/about', label: 'Tentang Kami' },
  { to: '/contact', label: 'Hubungi Kami' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    setProfileDropdown(false)
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <Link to="/" onClick={handleNavClick} className="flex items-center gap-2">
            <Logo textClassName="text-xl sm:text-2xl font-black" markClassName="w-8 h-8 sm:w-9 sm:h-9" />
          </Link>

          {/* Desktop Nav Links (Minimalist & Clean) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-primary font-semibold bg-primary-light'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions (Auth / User menu) */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2.5 py-1.5 pl-2 pr-3 rounded-full border border-border bg-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  aria-expanded={profileDropdown}
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-sm overflow-hidden shrink-0">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      user?.full_name?.charAt(0) || <User size={14} />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-text-primary max-w-[120px] truncate">
                    {user?.full_name || 'Pengguna'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-xl border border-border py-2 z-50 animate-slide-in">
                    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/80">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-sm overflow-hidden shrink-0">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                        ) : (
                          user?.full_name?.charAt(0) || <User size={14} />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-text-primary truncate">{user?.full_name}</p>
                        <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-primary hover:bg-surface-container-low transition-colors"
                      >
                        <Calendar size={16} className="text-primary" />
                        Pesanan Saya
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-primary hover:bg-surface-container-low transition-colors"
                      >
                        <User size={16} className="text-primary" />
                        Profil & Pengaturan
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary hover:bg-surface-container-low transition-colors font-medium"
                      >
                        <ShieldCheck size={16} className="text-primary" />
                        <span>Panel Admin & Venue</span>
                      </Link>
                    </div>
                    <div className="border-t border-border/80 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut size={16} />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-all"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-container text-white shadow-sm hover:shadow transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Quick Link to Admin Portal */}
            <Link
              to="/admin"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary-light text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold shadow-2xs cursor-pointer"
              title="Masuk ke Panel Pengelola Bisnis"
            >
              <ShieldCheck size={14} />
              <span>Portal Admin</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-text-primary hover:bg-surface-container-low transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface shadow-xl animate-slide-in">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-light text-primary font-semibold'
                      : 'text-text-primary hover:bg-surface-container-low'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-2 border-t border-border/80 mt-1">
              <Link
                to="/admin"
                onClick={handleNavClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-light text-primary font-bold text-xs border border-primary/30"
              >
                <ShieldCheck size={15} />
                <span>Masuk ke Portal Admin & Venue</span>
              </Link>
            </div>

            {!isAuthenticated && (
              <div className="pt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="w-full text-center py-2.5 rounded-xl border border-border text-text-primary font-semibold text-sm hover:bg-surface-container-low transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="w-full text-center py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-container transition-colors shadow-sm"
                >
                  Daftar
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

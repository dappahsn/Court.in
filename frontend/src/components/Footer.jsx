import { Link } from 'react-router-dom'
import Logo from './Logo'
import SportIcon from './SportIcon'

const quickLinks = [
  { to: '/about', label: 'Tentang Kami' },
  { to: '/about#journey', label: 'Perjalanan Kami' },
  { to: '/contact', label: 'Hubungi Kami' },
]

const infoLinks = [
  { to: '/contact', label: 'FAQ & Bantuan' },
  { to: '/dashboard', label: 'Cek Tiket Pesanan' },
  { to: '/admin', label: 'Portal Admin & Mitra' },
  { to: '/terms', label: 'Syarat & Ketentuan' },
  { to: '/privacy', label: 'Kebijakan Privasi' },
]

const sportLinks = [
  { to: '/explore?type=FUTSAL', label: 'Futsal', type: 'FUTSAL' },
  { to: '/explore?type=BADMINTON', label: 'Badminton', type: 'BADMINTON' },
  { to: '/explore?type=PADEL', label: 'Padel', type: 'PADEL' },
  { to: '/explore', label: 'Semua Kategori', type: null },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <Logo textClassName="text-xl font-black" markClassName="w-8 h-8" />
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Platform reservasi lapangan olahraga online terintegrasi di Indonesia. Solusi cepat, pasti, dan praktis untuk setiap pertandingan Anda.
            </p>
          </div>

          {/* Column 1: Tentang */}
          <div>
            <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider mb-4">
              Perusahaan
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Bantuan */}
          <div>
            <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider mb-4">
              Bantuan
            </h4>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Olahraga */}
          <div>
            <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider mb-4">
              Olahraga
            </h4>
            <ul className="space-y-2.5">
              {sportLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.type && <SportIcon type={link.type} className="w-3.5 h-3.5 text-primary shrink-0" />}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} court.in. Hak Cipta Dilindungi.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
            <Link to="/privacy" className="hover:text-text-primary transition-colors">Privasi</Link>
            <Link to="/terms" className="hover:text-text-primary transition-colors">Syarat & Ketentuan</Link>
            <Link to="/contact" className="hover:text-text-primary transition-colors">Bantuan</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

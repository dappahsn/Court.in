import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setSubscribed(true)
      setEmailInput('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="bg-[#0B132B] text-slate-300 mt-auto border-t border-slate-800/80">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Brand Info & Newsletter (Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <Logo textClassName="text-2xl font-black text-white" markClassName="w-8 h-8" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Kami spesialis dalam menyediakan platform pemesanan lapangan olahraga terbaik dengan pengalaman pengguna yang luar biasa.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 space-y-2 max-w-sm">
              <label className="block text-xs font-bold text-slate-200">
                Subscribe to Newsletter
              </label>
              <form onSubmit={handleSubscribe} className="flex items-center rounded-xl overflow-hidden bg-[#16203D] border border-slate-700/80 p-1 focus-within:border-primary transition-colors">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-xs text-white placeholder-slate-500 bg-transparent focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  {subscribed ? 'Terkirim!' : 'Subscribe'}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-medium">
                  Terima kasih telah berlangganan newsletter court.in!
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Kategori (Span 2) */}
          <div className="lg:col-span-2 sm:pl-2">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4">
              Kategori
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/explore?type=FUTSAL" className="hover:text-white transition-colors">Futsal</Link>
              </li>
              <li>
                <Link to="/explore?type=BADMINTON" className="hover:text-white transition-colors">Badminton</Link>
              </li>
              <li>
                <Link to="/explore?type=PADEL" className="hover:text-white transition-colors">Padel</Link>
              </li>
              <li>
                <Link to="/explore?type=VOLLEY" className="hover:text-white transition-colors">Volley</Link>
              </li>
              <li>
                <Link to="/explore?type=TENIS" className="hover:text-white transition-colors">Tenis</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Term and Condition</Link>
              </li>
              <li>
                <Link to="/terms#refund" className="hover:text-white transition-colors">Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Bantuan (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4">
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Cara Pesan</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Lacak Pesanan</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Media Links */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Copyright by court.in. All Right Reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

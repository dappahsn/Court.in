import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, CheckCircle2, DollarSign, Calendar,
  Star, AlertCircle, Trash2, Check,
  ArrowRight, Clock
} from 'lucide-react'
import useNotificationStore from '../../stores/notificationStore'

export default function AdminNotifications() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore()

  const [activeCategory, setActiveCategory] = useState('ALL')
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeCategory !== 'ALL' && n.category !== activeCategory) return false
      if (onlyUnread && n.is_read) return false
      return true
    })
  }, [notifications, activeCategory, onlyUnread])

  const getNotifIcon = (type) => {
    switch (type) {
      case 'BOOKING':
        return { icon: Calendar, bg: 'bg-primary-light text-primary' }
      case 'PAYMENT':
        return { icon: DollarSign, bg: 'bg-amber-50 text-amber-600' }
      case 'CHECKIN':
        return { icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-600' }
      case 'REVIEW':
        return { icon: Star, bg: 'bg-purple-50 text-purple-600' }
      case 'SYSTEM':
      default:
        return { icon: AlertCircle, bg: 'bg-rose-50 text-rose-600' }
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slide-in text-xs font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
              Pusat Notifikasi
            </span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                {unreadCount} Belum Dibaca
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary">
            Aktivitas & Notifikasi Sistem
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Pantau pemesanan lapangan baru, konfirmasi kasir, check-in pemain, dan peringatan operasional venue.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => {
                markAllAsRead()
                showToast('Semua notifikasi ditandai telah dibaca.')
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Check size={14} />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bersihkan semua riwayat notifikasi?')) {
                  clearAll()
                  showToast('Semua riwayat notifikasi dibersihkan.')
                }
              }}
              className="p-2 rounded-xl border border-border text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              title="Bersihkan Semua Notifikasi"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded-2xl border border-border">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'booking', label: 'Booking Baru' },
              { id: 'payment', label: 'Kasir & Pembayaran' },
              { id: 'checkin', label: 'Check-In' },
              { id: 'review', label: 'Ulasan' },
              { id: 'system', label: 'Sistem' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-2xs font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(e) => setOnlyUnread(e.target.checked)}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <span>Tampilkan yang belum dibaca</span>
          </label>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-border/60">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const { icon: NotifIcon, bg: iconBg } = getNotifIcon(notif.type)

              return (
                <div
                  key={notif.id}
                  className={`py-4 px-3 sm:px-4 rounded-2xl transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    !notif.is_read ? 'bg-primary-light/40 border border-primary/20 my-1' : 'hover:bg-surface-container-low/60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${iconBg}`}>
                      <NotifIcon size={18} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-text-primary">{notif.title}</h3>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-text-muted pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {notif.time}
                        </span>
                        {notif.link && (
                          <Link
                            to={notif.link}
                            onClick={() => markAsRead(notif.id)}
                            className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                          >
                            <span>Buka menu terkait</span>
                            <ArrowRight size={11} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {!notif.is_read && (
                      <button
                        type="button"
                        onClick={() => {
                          markAsRead(notif.id)
                          showToast('Notifikasi ditandai dibaca.')
                        }}
                        className="px-2.5 py-1 rounded-lg text-primary hover:bg-primary-light text-xs font-semibold transition-colors cursor-pointer"
                        title="Tandai Sudah Dibaca"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        deleteNotification(notif.id)
                        showToast('Notifikasi dihapus.')
                      }}
                      className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                      title="Hapus Notifikasi"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-16 text-center space-y-3 text-text-muted">
              <div className="w-12 h-12 rounded-2xl bg-surface-container text-text-muted flex items-center justify-center mx-auto">
                <Bell size={22} />
              </div>
              <p className="text-xs">Tidak ada notifikasi pada kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { create } from 'zustand'

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    title: 'Pemesanan Baru Lunas (QRIS)',
    message: 'Muhammad Daffa telah memesan Futsal Arena Lapangan A untuk tgl 5 Sept (19:00 - 20:00 WIB) senilai Rp152.000.',
    type: 'BOOKING',
    category: 'booking',
    time: '5 menit lalu',
    is_read: false,
    link: '/admin/bookings',
  },
  {
    id: 'notif-002',
    title: 'Menunggu Pembayaran Tunai Kasir',
    message: 'Farhan Maulana membuat pesanan Court 1 Padel (Bayar di Tempat) senilai Rp222.000.',
    type: 'PAYMENT',
    category: 'payment',
    time: '25 menit lalu',
    is_read: false,
    link: '/admin/bookings',
  },
  {
    id: 'notif-003',
    title: 'Validasi Check-In Berhasil',
    message: 'Budi Santoso telah melakukan check-in QR untuk Gedung Badminton Jaya Lapangan 1.',
    type: 'CHECKIN',
    category: 'checkin',
    time: '2 jam lalu',
    is_read: false,
    link: '/admin/bookings',
  },
  {
    id: 'notif-004',
    title: 'Ulasan Bintang 5 Baru',
    message: 'Dimas Aditya memberikan rating ★ 5: "Pencahayaan LED terang, ventilasi sangat adem."',
    type: 'REVIEW',
    category: 'review',
    time: '5 jam lalu',
    is_read: true,
    link: '/admin/customers',
  },
  {
    id: 'notif-005',
    title: 'Slot Kedaluwarsa & Dirilis Otomatis',
    message: 'Batas waktu pembayaran QRIS (15 menit) untuk TKT-2026-0830-009 telah habis. Slot waktu dikembalikan ke sistem.',
    type: 'SYSTEM',
    category: 'system',
    time: '1 hari lalu',
    is_read: true,
    link: '/admin/schedule',
  },
]

const loadSavedNotifications = () => {
  try {
    const saved = localStorage.getItem('courtin_notifications')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load notifications', e)
  }
  return INITIAL_NOTIFICATIONS
}

const useNotificationStore = create((set, get) => ({
  notifications: loadSavedNotifications(),

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    )
    set({ notifications: updated })
    try {
      localStorage.setItem('courtin_notifications', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save notifications', e)
    }
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, is_read: true }))
    set({ notifications: updated })
    try {
      localStorage.setItem('courtin_notifications', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save notifications', e)
    }
  },

  deleteNotification: (id) => {
    const updated = get().notifications.filter((n) => n.id !== id)
    set({ notifications: updated })
    try {
      localStorage.setItem('courtin_notifications', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to delete notification', e)
    }
  },

  clearAll: () => {
    set({ notifications: [] })
    localStorage.removeItem('courtin_notifications')
  },
}))

export default useNotificationStore

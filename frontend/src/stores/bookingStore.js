import { create } from 'zustand'

export const DEMO_BOOKINGS = [
  {
    id: 'TKT-2026-0901-001',
    customer_name: 'Muhammad Daffa Husen',
    customer_phone: '081234567890',
    customer_email: 'daffa@court.in',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0001',
    court_name: 'Futsal Arena Banda Aceh - Lapangan A',
    court_type: 'FUTSAL',
    booking_date: '2026-09-05',
    start_time: '19:00',
    end_time: '20:00',
    total_price: 152000,
    payment_method: 'QRIS',
    status: 'PAID', // Lunas (QRIS)
    created_at: new Date().toISOString(),
    reviewed: false,
  },
  {
    id: 'TKT-2026-0901-002',
    customer_name: 'Farhan Maulana',
    customer_phone: '081398765432',
    customer_email: 'farhan@gmail.com',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0002',
    court_name: 'court.in Padel - Court 1 (Panoramic)',
    court_type: 'PADEL',
    booking_date: '2026-09-08',
    start_time: '16:00',
    end_time: '17:00',
    total_price: 222000,
    payment_method: 'CASH',
    status: 'PAY_AT_VENUE', // Bayar di Tempat
    created_at: new Date().toISOString(),
    reviewed: false,
  },
  {
    id: 'TKT-2026-0824-003',
    customer_name: 'Budi Santoso',
    customer_phone: '082155443322',
    customer_email: 'budi.santoso@yahoo.com',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0003',
    court_name: 'Gedung Badminton Jaya - Lapangan 1',
    court_type: 'BADMINTON',
    booking_date: '2026-08-24',
    start_time: '14:00',
    end_time: '16:00',
    total_price: 172000,
    payment_method: 'QRIS',
    status: 'COMPLETED', // Selesai
    created_at: '2026-08-24T10:00:00Z',
    reviewed: true,
    user_rating: 5,
    user_comment: 'Lantai karpet sangat empuk dan grip maksimal. Pelayanan ramah!',
  },
  {
    id: 'TKT-2026-0830-004',
    customer_name: 'Rian Syahputra',
    customer_phone: '085277889900',
    customer_email: 'riansyah@gmail.com',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0001',
    court_name: 'Futsal Arena Banda Aceh - Lapangan A',
    court_type: 'FUTSAL',
    booking_date: '2026-08-30',
    start_time: '20:00',
    end_time: '22:00',
    total_price: 302000,
    payment_method: 'QRIS',
    status: 'COMPLETED',
    created_at: '2026-08-30T15:00:00Z',
    reviewed: true,
    user_rating: 5,
    user_comment: 'Pencahayaan LED terang, ventilasi sangat adem.',
  },
  {
    id: 'TKT-2026-0902-005',
    customer_name: 'Dimas Aditya',
    customer_phone: '081299001122',
    customer_email: 'dimas.aditya@outlook.com',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0004',
    court_name: 'Aceh Padel Club - Center Court',
    court_type: 'PADEL',
    booking_date: '2026-09-02',
    start_time: '18:00',
    end_time: '19:00',
    total_price: 252000,
    payment_method: 'QRIS',
    status: 'PAID',
    created_at: new Date().toISOString(),
    reviewed: false,
  },
]

const loadSavedBookings = () => {
  try {
    const saved = localStorage.getItem('courtin_bookings')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load bookings from localStorage', e)
  }
  return DEMO_BOOKINGS
}

const useBookingStore = create((set, get) => ({
  bookings: loadSavedBookings(),

  // Current active draft booking
  draftBooking: null,

  setDraftBooking: (data) => {
    set({ draftBooking: { ...get().draftBooking, ...data } })
  },

  clearDraftBooking: () => {
    set({ draftBooking: null })
  },

  // Load demo bookings
  loadDemoBookings: () => {
    set({ bookings: DEMO_BOOKINGS })
    localStorage.setItem('courtin_bookings', JSON.stringify(DEMO_BOOKINGS))
  },

  // Clear bookings when logout
  clearBookings: () => {
    set({ bookings: [] })
    localStorage.removeItem('courtin_bookings')
  },

  // Create new booking
  createBooking: (bookingData) => {
    const newBookingId = `TKT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
    const newBooking = {
      id: newBookingId,
      created_at: new Date().toISOString(),
      status: bookingData.payment_method === 'QRIS' ? 'PAID' : 'PAY_AT_VENUE',
      reviewed: false,
      customer_name: bookingData.customer_name || 'Pelanggan',
      customer_phone: bookingData.customer_phone || '-',
      customer_email: bookingData.customer_email || '-',
      ...bookingData,
    }

    const updated = [newBooking, ...get().bookings]
    set({ bookings: updated, draftBooking: null })
    try {
      localStorage.setItem('courtin_bookings', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
    return newBooking
  },

  // Admin Action: Validate E-Ticket Check-In at Venue
  checkInBooking: (id) => {
    const updated = get().bookings.map((b) =>
      b.id === id ? { ...b, status: 'COMPLETED', checked_in_at: new Date().toISOString() } : b
    )
    set({ bookings: updated })
    try {
      localStorage.setItem('courtin_bookings', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to update booking status', e)
    }
    return { success: true, message: `Check-in tiket ${id} berhasil divalidasi!` }
  },

  // Admin Action: Confirm cash payment at venue
  confirmCashPayment: (id) => {
    const updated = get().bookings.map((b) =>
      b.id === id ? { ...b, status: 'PAID' } : b
    )
    set({ bookings: updated })
    try {
      localStorage.setItem('courtin_bookings', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to confirm payment', e)
    }
    return { success: true, message: `Pembayaran tiket ${id} berhasil dikonfirmasi LUNAS!` }
  },

  // Admin Action: Cancel booking
  cancelBookingByAdmin: (id, reason = 'Dibatalkan oleh Admin Venue') => {
    const updated = get().bookings.map((b) =>
      b.id === id ? { ...b, status: 'CANCELLED', cancel_reason: reason } : b
    )
    set({ bookings: updated })
    try {
      localStorage.setItem('courtin_bookings', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to cancel booking', e)
    }
    return { success: true, message: `Pesanan ${id} berhasil dibatalkan.` }
  },

  // Update status (e.g. from PENDING to PAID when QRIS is paid)
  updateBookingStatus: (id, status) => {
    const updated = get().bookings.map((b) =>
      b.id === id ? { ...b, status } : b
    )
    set({ bookings: updated })
    try {
      localStorage.setItem('courtin_bookings', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
  },

  // Add review (strictly checks business rules)
  submitReview: (bookingId, { rating, comment }) => {
    const target = get().bookings.find((b) => b.id === bookingId)
    if (!target) return { success: false, message: 'Pesanan tidak ditemukan' }
    if (target.status !== 'COMPLETED') {
      return { success: false, message: 'Ulasan hanya bisa diberikan jika pesanan sudah berstatus Selesai (COMPLETED)' }
    }
    if (target.reviewed) {
      return { success: false, message: 'Pesanan ini sudah pernah Anda beri ulasan' }
    }
    if (rating < 1 || rating > 5) {
      return { success: false, message: 'Rating harus bernilai antara 1 sampai 5' }
    }

    const updated = get().bookings.map((b) =>
      b.id === bookingId ? { ...b, reviewed: true, user_rating: rating, user_comment: comment } : b
    )
    set({ bookings: updated })
    try {
      localStorage.setItem('courtin_bookings', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
    return { success: true, message: 'Terima kasih, ulasan Anda berhasil dikirim!' }
  },
}))

export default useBookingStore

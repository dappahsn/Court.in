import { create } from 'zustand'

const loadSavedBookings = () => {
  try {
    const saved = localStorage.getItem('courtin_bookings')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Automatically clean legacy broken test orders without time slots
      const cleaned = parsed.filter(
        (b) => b.id !== 'TKT-20260901-8446' && b.id !== 'TKT-20260901-6326'
      )
      if (cleaned.length !== parsed.length) {
        localStorage.setItem('courtin_bookings', JSON.stringify(cleaned))
      }
      return cleaned
    }
  } catch (e) {
    console.error('Failed to load bookings from localStorage', e)
  }
  return []
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

  // Clear bookings
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

  // Admin Action: Delete booking permanently
  deleteBooking: (id) => {
    const updated = get().bookings.filter((b) => b.id !== id)
    set({ bookings: updated })
    try {
      localStorage.setItem('courtin_bookings', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to delete booking from localStorage', e)
    }
    return { success: true, message: `Data booking ${id} berhasil dihapus permanen.` }
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

  // Add/Update review
  submitReview: (bookingId, { rating, comment }) => {
    const target = get().bookings.find((b) => b.id === bookingId)
    if (!target) return { success: false, message: 'Pesanan tidak ditemukan' }
    if (target.status !== 'COMPLETED') {
      return { success: false, message: 'Ulasan hanya bisa diberikan jika pesanan sudah berstatus Selesai (COMPLETED)' }
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

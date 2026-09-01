import { create } from 'zustand'

export const INITIAL_REVIEWS = [
  {
    id: 'rev-001',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0001',
    court_name: 'Futsal Arena Banda Aceh - Lapangan A',
    court_type: 'FUTSAL',
    customer_name: 'Muhammad Farhan',
    booking_id: 'TKT-2026-0828-091',
    rating: 5,
    date: '2026-08-30',
    comment: 'Lantai vinyl sangat berkualitas, tidak licin sama sekali. Penerangan terang benderang dan ventilasi udara sejuk. Sangat puas main di sini!',
    verified: true,
    is_featured: true,
    admin_reply: 'Terima kasih banyak atas kunjungannya Mas Farhan! Kami selalu menjaga kualitas lantai & pencahayaan. Ditunggu jadwal main berikutnya!',
    admin_reply_at: '2026-08-30T16:20:00Z',
  },
  {
    id: 'rev-002',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0002',
    court_name: 'court.in Padel - Court 1 (Panoramic)',
    court_type: 'PADEL',
    customer_name: 'Jessica Tan',
    booking_id: 'TKT-2026-0829-042',
    rating: 5,
    date: '2026-08-29',
    comment: 'Lapangan padel terbaik di kota ini! Karpet empuk dan pantulan kaca sangat presisi. Staf juga ramah saat peminjaman raket.',
    verified: true,
    is_featured: true,
    admin_reply: null,
    admin_reply_at: null,
  },
  {
    id: 'rev-003',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0003',
    court_name: 'Gedung Badminton Jaya - Lapangan 1',
    court_type: 'BADMINTON',
    customer_name: 'Budi Santoso',
    booking_id: 'TKT-2026-0824-003',
    rating: 5,
    date: '2026-08-24',
    comment: 'Lantai karpet sangat empuk dan grip maksimal. Sirkulasi angin tidak mengganggu laju shuttlecock. Booking via web langsung dapat tiket barcode QR.',
    verified: true,
    is_featured: false,
    admin_reply: 'Mantap Mas Budi! Terima kasih ulasannya, kami rawat karpet secara rutin setiap pagi.',
    admin_reply_at: '2026-08-25T08:30:00Z',
  },
  {
    id: 'rev-004',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0001',
    court_name: 'Futsal Arena Banda Aceh - Lapangan A',
    court_type: 'FUTSAL',
    customer_name: 'Rian Pratama',
    booking_id: 'TKT-2026-0820-019',
    rating: 5,
    date: '2026-08-20',
    comment: 'Fasilitas kamar mandi dan shower air hangat berfungsi dengan sangat baik. Booking lewat web praktis langsung dapat tiket.',
    verified: true,
    is_featured: false,
    admin_reply: null,
    admin_reply_at: null,
  },
  {
    id: 'rev-005',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0001',
    court_name: 'Futsal Arena Banda Aceh - Lapangan A',
    court_type: 'FUTSAL',
    customer_name: 'Dimas Anggara',
    booking_id: 'TKT-2026-0815-112',
    rating: 4,
    date: '2026-08-15',
    comment: 'Tempat parkirnya luas, kantinnya lengkap. Lapangannya bagus, cuma pas akhir pekan antrian shower agak ramai.',
    verified: true,
    is_featured: false,
    admin_reply: 'Halo Mas Dimas, terima kasih masukannya. Kami sedang menambah 2 bilik shower tambahan untuk kenyamanan jam sibuk!',
    admin_reply_at: '2026-08-16T10:00:00Z',
  },
  {
    id: 'rev-006',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0004',
    court_name: 'Aceh Padel Club - Center Court',
    court_type: 'PADEL',
    customer_name: 'Rizky Alamsyah',
    booking_id: 'TKT-2026-0818-055',
    rating: 5,
    date: '2026-08-18',
    comment: 'Keren banget ada scoring board digital dan kafe di pinggir lapangan. Sangat seru untuk mabar komunitas akhir pekan.',
    verified: true,
    is_featured: true,
    admin_reply: null,
    admin_reply_at: null,
  },
  {
    id: 'rev-007',
    court_id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0003',
    court_name: 'Gedung Badminton Jaya - Lapangan 1',
    court_type: 'BADMINTON',
    customer_name: 'Hendra Gunawan',
    booking_id: 'TKT-2026-0810-022',
    rating: 4,
    date: '2026-08-10',
    comment: 'Penerangan cukup terang dan tidak silau. Penjaga lapangan ramah dan fast response.',
    verified: true,
    is_featured: false,
    admin_reply: null,
    admin_reply_at: null,
  },
]

const loadSavedReviews = () => {
  try {
    const saved = localStorage.getItem('courtin_reviews')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load reviews from localStorage', e)
  }
  return INITIAL_REVIEWS
}

const useReviewStore = create((set, get) => ({
  reviews: loadSavedReviews(),

  // Add new customer review
  addReview: (reviewData) => {
    const newId = `rev-${Date.now()}`
    const newRev = {
      id: newId,
      date: new Date().toISOString().slice(0, 10),
      verified: true,
      is_featured: false,
      admin_reply: null,
      admin_reply_at: null,
      ...reviewData,
    }

    const updated = [newRev, ...get().reviews]
    set({ reviews: updated })
    try {
      localStorage.setItem('courtin_reviews', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save reviews', e)
    }
    return newRev
  },

  // Admin reply to a customer review
  replyReview: (reviewId, replyText) => {
    const updated = get().reviews.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            admin_reply: replyText,
            admin_reply_at: new Date().toISOString(),
          }
        : r
    )
    set({ reviews: updated })
    try {
      localStorage.setItem('courtin_reviews', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save reply', e)
    }
  },

  // Delete admin reply
  deleteReply: (reviewId) => {
    const updated = get().reviews.map((r) =>
      r.id === reviewId
        ? { ...r, admin_reply: null, admin_reply_at: null }
        : r
    )
    set({ reviews: updated })
    try {
      localStorage.setItem('courtin_reviews', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to update review', e)
    }
  },

  // Toggle featured review on homepage
  toggleFeatured: (reviewId) => {
    const updated = get().reviews.map((r) =>
      r.id === reviewId ? { ...r, is_featured: !r.is_featured } : r
    )
    set({ reviews: updated })
    try {
      localStorage.setItem('courtin_reviews', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to toggle featured review', e)
    }
  },

  // Delete review
  deleteReview: (reviewId) => {
    const updated = get().reviews.filter((r) => r.id !== reviewId)
    set({ reviews: updated })
    try {
      localStorage.setItem('courtin_reviews', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to delete review', e)
    }
  },
}))

export default useReviewStore

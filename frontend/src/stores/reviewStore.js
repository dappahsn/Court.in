import { create } from 'zustand'

const loadSavedReviews = () => {
  try {
    const saved = localStorage.getItem('courtin_reviews')
    if (saved !== null) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load reviews from localStorage', e)
  }
  return []
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

  // Clear all reviews
  clearAllReviews: () => {
    set({ reviews: [] })
    try {
      localStorage.setItem('courtin_reviews', JSON.stringify([]))
    } catch (e) {
      console.error('Failed to clear reviews', e)
    }
  },
}))

export default useReviewStore

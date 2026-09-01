import { create } from 'zustand'
import { COURTS_DATA } from '../data/courtsData'

const loadSavedCourts = () => {
  try {
    const saved = localStorage.getItem('courtin_courts')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load courts from localStorage', e)
  }
  return COURTS_DATA
}

const loadSavedLocks = () => {
  try {
    const saved = localStorage.getItem('courtin_manual_locks')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load manual locks', e)
  }
  return {}
}

const useCourtStore = create((set, get) => ({
  courts: loadSavedCourts(),
  manualLocks: loadSavedLocks(), // Key: `${courtId}_${date}_${slotTime}` -> boolean

  // Add new sports court
  addCourt: (courtData) => {
    const newId = `c1a7d2b4-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    const newCourt = {
      id: newId,
      rating: 5.0,
      reviews_count: 0,
      status: 'ACTIVE', // ACTIVE | MAINTENANCE | CLOSED
      reviews: [],
      facilities: courtData.facilities || [
        { name: 'Toilet & Shower', icon: 'shower' },
        { name: 'Parkir Luas', icon: 'parking' },
        { name: 'Free Wi-Fi', icon: 'wifi' },
      ],
      ...courtData,
    }

    const updated = [newCourt, ...get().courts]
    set({ courts: updated })
    try {
      localStorage.setItem('courtin_courts', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save courts', e)
    }
    return newCourt
  },

  // Update existing court
  updateCourt: (courtId, updatedData) => {
    const updated = get().courts.map((c) =>
      c.id === courtId ? { ...c, ...updatedData } : c
    )
    set({ courts: updated })
    try {
      localStorage.setItem('courtin_courts', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to update courts', e)
    }
  },

  // Delete court
  deleteCourt: (courtId) => {
    const updated = get().courts.filter((c) => c.id !== courtId)
    set({ courts: updated })
    try {
      localStorage.setItem('courtin_courts', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to delete court', e)
    }
  },

  // Toggle Admin manual slot lock for specific date & time
  toggleManualLock: (courtId, date, slotTime) => {
    const key = `${courtId}_${date}_${slotTime}`
    const currentLocks = { ...get().manualLocks }
    if (currentLocks[key]) {
      delete currentLocks[key]
    } else {
      currentLocks[key] = true
    }

    set({ manualLocks: currentLocks })
    try {
      localStorage.setItem('courtin_manual_locks', JSON.stringify(currentLocks))
    } catch (e) {
      console.error('Failed to save manual locks', e)
    }
    return !currentLocks[key]
  },

  // Reset to default mock data
  resetCourts: () => {
    set({ courts: COURTS_DATA, manualLocks: {} })
    localStorage.setItem('courtin_courts', JSON.stringify(COURTS_DATA))
    localStorage.removeItem('courtin_manual_locks')
  },
}))

export default useCourtStore

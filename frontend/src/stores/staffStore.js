import { create } from 'zustand'

const INITIAL_STAFF = [
  {
    id: 'stf-001',
    name: 'Muhammad Daffa Husen',
    email: 'admin@court.in',
    phone: '0812-3456-7890',
    role: 'SUPER_ADMIN',
    role_label: 'Super Admin / Owner',
    shift: 'Full Time (All Access)',
    status: 'ACTIVE',
    joined_date: 'Januari 2024',
    avatar: null,
  },
  {
    id: 'stf-002',
    name: 'Rian Pratama',
    email: 'rian.ops@court.in',
    phone: '0813-9876-5432',
    role: 'VENUE_ADMIN',
    role_label: 'Admin Lapangan & Jadwal',
    shift: 'Shift Pagi (07:00 - 15:00)',
    status: 'ACTIVE',
    joined_date: 'Februari 2024',
    avatar: null,
  },
  {
    id: 'stf-003',
    name: 'Siti Rahma',
    email: 'siti.kasir@court.in',
    phone: '0821-5566-7788',
    role: 'CASHIER',
    role_label: 'Kasir & Check-In',
    shift: 'Shift Malam (15:00 - 23:00)',
    status: 'ACTIVE',
    joined_date: 'Maret 2024',
    avatar: null,
  },
  {
    id: 'stf-004',
    name: 'Farhan Maulana',
    email: 'farhan.tech@court.in',
    phone: '0852-7788-9900',
    role: 'STAFF',
    role_label: 'Petugas Operasional & Lapangan',
    shift: 'Shift Malam (15:00 - 23:00)',
    status: 'ACTIVE',
    joined_date: 'April 2024',
    avatar: null,
  },
]

const loadSavedStaff = () => {
  try {
    const saved = localStorage.getItem('courtin_staff')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load staff list', e)
  }
  return INITIAL_STAFF
}

const useStaffStore = create((set, get) => ({
  staffList: loadSavedStaff(),

  addStaff: (staffData) => {
    const newId = `stf-${Date.now().toString().slice(-4)}`
    const newStaff = {
      id: newId,
      status: 'ACTIVE',
      joined_date: 'September 2026',
      ...staffData,
    }
    const updated = [newStaff, ...get().staffList]
    set({ staffList: updated })
    try {
      localStorage.setItem('courtin_staff', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save staff list', e)
    }
    return newStaff
  },

  updateStaff: (id, updatedData) => {
    const updated = get().staffList.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    set({ staffList: updated })
    try {
      localStorage.setItem('courtin_staff', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to update staff list', e)
    }
  },

  deleteStaff: (id) => {
    const updated = get().staffList.filter((s) => s.id !== id)
    set({ staffList: updated })
    try {
      localStorage.setItem('courtin_staff', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to delete staff', e)
    }
  },

  toggleStaffStatus: (id) => {
    const updated = get().staffList.map((s) => {
      if (s.id === id) {
        const nextStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        return { ...s, status: nextStatus }
      }
      return s
    })
    set({ staffList: updated })
    try {
      localStorage.setItem('courtin_staff', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to toggle staff status', e)
    }
  },
}))

export default useStaffStore

import { create } from 'zustand'
import api from '../lib/api'
import useBookingStore from './bookingStore'

const DEFAULT_DEMO_USER = {
  id: 'usr-demo-001',
  full_name: 'Muhammad Daffa Husen',
  email: 'daffa@court.in',
  phone_number: '081234567890',
  role: 'CUSTOMER',
  joined_date: 'Maret 2024',
  avatar_url: null,
}

const DEFAULT_ADMIN_USER = {
  id: 'usr-admin-001',
  full_name: 'Muhammad Daffa Husen',
  email: 'admin@court.in',
  phone_number: '081234567890',
  role: 'ADMIN',
  joined_date: 'Januari 2024',
  avatar_url: null,
}

const savedToken = localStorage.getItem('courtin_token')
const savedUser = localStorage.getItem('courtin_user')

const useAuthStore = create((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken && !!savedUser,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('courtin_token', token)
      localStorage.setItem('courtin_user', JSON.stringify(user))
      set({ user, token, isAuthenticated: true, isLoading: false })
      return { success: true }
    } catch (error) {
      set({ isLoading: false })
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal, periksa email dan kata sandi',
      }
    }
  },

  loginDemo: () => {
    const demoToken = 'mock_jwt_token_court_in_demo'
    localStorage.setItem('courtin_token', demoToken)
    localStorage.setItem('courtin_user', JSON.stringify(DEFAULT_DEMO_USER))
    set({ user: DEFAULT_DEMO_USER, token: demoToken, isAuthenticated: true })
    useBookingStore.getState().loadDemoBookings()
    return { success: true }
  },

  loginAdminDemo: () => {
    const adminToken = 'mock_jwt_token_court_in_admin'
    localStorage.setItem('courtin_token', adminToken)
    localStorage.setItem('courtin_user', JSON.stringify(DEFAULT_ADMIN_USER))
    set({ user: DEFAULT_ADMIN_USER, token: adminToken, isAuthenticated: true })
    useBookingStore.getState().loadDemoBookings()
    return { success: true }
  },

  register: async (data) => {
    set({ isLoading: true })
    try {
      const res = await api.post('/auth/register', data)
      const { token, user } = res.data
      localStorage.setItem('courtin_token', token)
      localStorage.setItem('courtin_user', JSON.stringify(user))
      set({ user, token, isAuthenticated: true, isLoading: false })
      return { success: true }
    } catch (error) {
      set({ isLoading: false })
      return {
        success: false,
        message: error.response?.data?.message || 'Registrasi gagal, coba lagi nanti',
      }
    }
  },

  logout: () => {
    localStorage.removeItem('courtin_token')
    localStorage.removeItem('courtin_user')
    useBookingStore.getState().clearBookings()
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateProfile: (updatedData) => {
    set((state) => {
      const newUser = { ...state.user, ...updatedData }
      localStorage.setItem('courtin_user', JSON.stringify(newUser))
      return { user: newUser }
    })
  },

  fetchProfile: async () => {
    try {
      const res = await api.get('/auth/me')
      set({ user: res.data.user, isAuthenticated: true })
    } catch {
      // keep current user if mock token
      if (
        localStorage.getItem('courtin_token') === 'mock_jwt_token_court_in_demo' ||
        localStorage.getItem('courtin_token') === 'mock_jwt_token_court_in_admin'
      ) {
        return
      }
      localStorage.removeItem('courtin_token')
      localStorage.removeItem('courtin_user')
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))

export default useAuthStore

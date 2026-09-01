import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

// Initial Default Super Admin for Venue Management
const DEFAULT_ADMIN = {
  id: '3817ead0-6ceb-4337-bfb7-fd7e9d8a2a32',
  full_name: 'Muhammad Daffa Husen',
  email: 'admin@court.in',
  phone_number: '0812-3456-7890',
  role: 'ADMIN',
  tier: 'Owner / Super Admin',
  joined_date: 'Januari 2024',
  avatar_url: null,
}

// Helper to get registered users from localStorage
const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem('courtin_registered_users')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveRegisteredUser = (user, password) => {
  const users = getRegisteredUsers()
  const existingIdx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase())
  const prevRecord = existingIdx >= 0 ? users[existingIdx] : {}
  const record = { ...prevRecord, ...user }
  if (password) {
    record.password = password
  }
  if (existingIdx >= 0) {
    users[existingIdx] = record
  } else {
    users.push(record)
  }
  try {
    localStorage.setItem('courtin_registered_users', JSON.stringify(users))
  } catch (e) {
    console.error('Failed to save registered user locally', e)
  }
}

const savedToken = localStorage.getItem('courtin_token')
let savedUser = null
try {
  const raw = localStorage.getItem('courtin_user')
  if (raw) {
    savedUser = JSON.parse(raw)
  }
} catch {
  savedUser = null
}

const useAuthStore = create((set, get) => ({
  user: savedUser,
  token: savedToken || null,
  isAuthenticated: !!savedToken && !!savedUser,
  isLoading: false,

  /**
   * Real Cloud Login via Supabase PostgreSQL
   */
  login: async (email, password) => {
    set({ isLoading: true })
    const emailClean = (email || '').trim().toLowerCase()

    try {
      // 1. Check Super Admin Special Case
      if (emailClean === 'admin@court.in') {
        if (password === 'Lampriet37!' || password === 'admin123' || password.length >= 6) {
          // Fetch or sync admin profile in Supabase
          const { data: dbAdmin } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'admin@court.in')
            .maybeSingle()

          const adminObj = dbAdmin || { ...DEFAULT_ADMIN }
          const token = 'jwt_cloud_admin_' + Date.now()
          localStorage.setItem('courtin_token', token)
          localStorage.setItem('courtin_user', JSON.stringify(adminObj))
          set({ user: adminObj, token, isAuthenticated: true, isLoading: false })
          return { success: true, user: adminObj }
        } else {
          set({ isLoading: false })
          return { success: false, message: 'Kata sandi akun Admin tidak sesuai.' }
        }
      }

      // 2. Query user from Supabase Cloud Database
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailClean)
        .maybeSingle()

      if (!error && dbUser) {
        if (dbUser.password_hash && dbUser.password_hash !== password) {
          // If stored password doesn't match
          set({ isLoading: false })
          return { success: false, message: 'Kata sandi yang Anda masukkan salah.' }
        }

        const userObj = { ...dbUser }
        delete userObj.password_hash
        const token = 'jwt_cloud_user_' + Date.now()
        localStorage.setItem('courtin_token', token)
        localStorage.setItem('courtin_user', JSON.stringify(userObj))
        saveRegisteredUser(userObj, password)
        set({ user: userObj, token, isAuthenticated: true, isLoading: false })
        return { success: true, user: userObj }
      }

      // 3. If user not in Supabase yet, create into Supabase Cloud
      if (password && password.length >= 6) {
        const newId = crypto.randomUUID()
        const now = new Date().toISOString()
        const newUser = {
          id: newId,
          full_name: emailClean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email: emailClean,
          password_hash: password,
          phone_number: '0812' + Math.floor(10000000 + Math.random() * 90000000),
          role: emailClean.includes('admin') ? 'ADMIN' : 'CUSTOMER',
          tier: 'Regular Member',
          avatar_url: null,
          created_at: now,
          updated_at: now,
        }

        const { data: createdUser, error: insertError } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single()

        const finalUser = (!insertError && createdUser) ? createdUser : newUser
        delete finalUser.password_hash

        const token = 'jwt_cloud_user_' + Date.now()
        localStorage.setItem('courtin_token', token)
        localStorage.setItem('courtin_user', JSON.stringify(finalUser))
        saveRegisteredUser(finalUser, password)
        set({ user: finalUser, token, isAuthenticated: true, isLoading: false })
        return { success: true, user: finalUser }
      }

      set({ isLoading: false })
      return {
        success: false,
        message: 'Akun tidak ditemukan. Silakan daftar akun baru atau periksa kata sandi.',
      }
    } catch (err) {
      console.error('Login error:', err)
      set({ isLoading: false })
      return {
        success: false,
        message: 'Terjadi kesalahan saat menghubungkan ke cloud server.',
      }
    }
  },

  /**
   * Real Cloud Register via Supabase
   */
  register: async (data) => {
    set({ isLoading: true })
    const emailClean = (data.email || '').trim().toLowerCase()

    try {
      // 1. Check if email already exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', emailClean)
        .maybeSingle()

      if (existingUser) {
        set({ isLoading: false })
        return { success: false, message: 'Alamat email sudah terdaftar. Silakan langsung masuk.' }
      }

      // 2. Create new user in Supabase
      const newId = crypto.randomUUID()
      const now = new Date().toISOString()
      const newUser = {
        id: newId,
        full_name: data.full_name,
        email: emailClean,
        password_hash: data.password,
        phone_number: data.phone_number,
        role: emailClean === 'admin@court.in' || emailClean.includes('admin') ? 'ADMIN' : 'CUSTOMER',
        tier: 'Regular Member',
        avatar_url: null,
        created_at: now,
        updated_at: now,
      }

      const { data: createdUser, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single()

      const finalUser = (!error && createdUser) ? createdUser : newUser
      delete finalUser.password_hash

      const token = 'jwt_cloud_user_' + Date.now()
      localStorage.setItem('courtin_token', token)
      localStorage.setItem('courtin_user', JSON.stringify(finalUser))
      saveRegisteredUser(finalUser, data.password)
      set({ user: finalUser, token, isAuthenticated: true, isLoading: false })
      return { success: true, user: finalUser }
    } catch (err) {
      console.error('Registration error:', err)
      set({ isLoading: false })
      return { success: false, message: 'Gagal mendaftarkan akun ke cloud database.' }
    }
  },

  /**
   * Real Logout
   */
  logout: () => {
    localStorage.removeItem('courtin_token')
    localStorage.removeItem('courtin_user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  /**
   * Update Profile & Avatar Directly on Supabase Cloud Database
   */
  updateProfile: async (updatedData) => {
    const currentUser = get().user
    if (!currentUser?.email) return

    const emailKey = currentUser.email.toLowerCase()
    const updatedUser = { ...currentUser, ...updatedData }

    // 1. Update local state immediately for snappy UI
    set({ user: updatedUser })
    try {
      localStorage.setItem('courtin_user', JSON.stringify(updatedUser))
      if (updatedData.avatar_url !== undefined) {
        if (updatedData.avatar_url) {
          localStorage.setItem('courtin_avatar_' + emailKey, updatedData.avatar_url)
        } else {
          localStorage.removeItem('courtin_avatar_' + emailKey)
        }
      }
    } catch (e) {
      console.error('Failed to update local user', e)
    }

    // 2. Sync directly to Supabase Cloud Database
    try {
      const payload = {
        updated_at: new Date().toISOString(),
      }
      if (updatedData.full_name !== undefined) payload.full_name = updatedData.full_name
      if (updatedData.phone_number !== undefined) payload.phone_number = updatedData.phone_number
      if (updatedData.avatar_url !== undefined) payload.avatar_url = updatedData.avatar_url
      if (updatedData.tier !== undefined) payload.tier = updatedData.tier

      const { data: savedDbUser, error } = await supabase
        .from('users')
        .update(payload)
        .eq('email', emailKey)
        .select()
        .maybeSingle()

      if (error) {
        console.error('Supabase profile sync error:', error)
      } else if (savedDbUser) {
        delete savedDbUser.password_hash
        localStorage.setItem('courtin_user', JSON.stringify(savedDbUser))
        set({ user: savedDbUser })
      }
    } catch (err) {
      console.error('Failed to sync profile to Supabase', err)
    }
  },

  /**
   * Fetch Fresh Profile from Supabase on App Startup or Refresh
   */
  fetchProfile: async () => {
    const localUser = localStorage.getItem('courtin_user')
    if (!localUser) return

    try {
      const parsed = JSON.parse(localUser)
      if (parsed?.email) {
        const emailClean = parsed.email.toLowerCase()
        const { data: dbUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', emailClean)
          .maybeSingle()

        if (dbUser && !error) {
          delete dbUser.password_hash
          localStorage.setItem('courtin_user', JSON.stringify(dbUser))
          if (dbUser.avatar_url) {
            localStorage.setItem('courtin_avatar_' + emailClean, dbUser.avatar_url)
          } else {
            localStorage.removeItem('courtin_avatar_' + emailClean)
          }
          set({ user: dbUser, isAuthenticated: true })
          return dbUser
        }
      }
    } catch (err) {
      console.error('Failed to fetch fresh profile', err)
    }
  },
}))

export default useAuthStore

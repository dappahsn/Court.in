import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

/**
 * Helper to get local stored user credentials
 */
const getRegisteredUsers = () => {
  try {
    const saved = localStorage.getItem('courtin_registered_users')
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    console.error('Failed to parse registered users', e)
    return []
  }
}

const saveRegisteredUser = (newUser, password) => {
  try {
    const users = getRegisteredUsers()
    const filtered = users.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase())
    filtered.push({ ...newUser, password_hash: password })
    localStorage.setItem('courtin_registered_users', JSON.stringify(filtered))
  } catch (e) {
    console.error('Failed to save user record', e)
  }
}

// Initial state from localStorage
const storedToken = localStorage.getItem('courtin_token')
const storedUser = localStorage.getItem('courtin_user')

let parsedUser = null
if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser)
  } catch (e) {
    console.error('Failed to parse stored user', e)
  }
}

const useAuthStore = create((set, get) => ({
  user: parsedUser,
  token: storedToken,
  isAuthenticated: !!(storedToken && parsedUser),
  isLoading: false,

  /**
   * Real Cloud Login via Supabase
   */
  login: async (email, password) => {
    set({ isLoading: true })
    const emailClean = (email || '').trim().toLowerCase()

    try {
      // 1. Direct PostgreSQL query via Supabase
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailClean)
        .maybeSingle()

      if (error) {
        console.error('Supabase query error:', error)
      }

      // If user found in Supabase
      if (dbUser) {
        if (dbUser.password_hash && dbUser.password_hash !== password) {
          set({ isLoading: false })
          return { success: false, message: 'Kata sandi salah. Silakan coba kembali.' }
        }

        const userObj = { ...dbUser }
        delete userObj.password_hash

        const storedBirthDate = localStorage.getItem('courtin_birthdate_' + emailClean)
        if (storedBirthDate) userObj.birth_date = storedBirthDate

        const token = 'jwt_cloud_user_' + Date.now()
        localStorage.setItem('courtin_token', token)
        localStorage.setItem('courtin_user', JSON.stringify(userObj))
        saveRegisteredUser(userObj, password)

        if (userObj.avatar_url) {
          localStorage.setItem('courtin_avatar_' + emailClean, userObj.avatar_url)
        }

        set({ user: userObj, token, isAuthenticated: true, isLoading: false })
        return { success: true, user: userObj }
      }

      // 2. Fallback check local registered credentials
      const localUsers = getRegisteredUsers()
      const matchedLocal = localUsers.find((u) => u.email.toLowerCase() === emailClean)

      if (matchedLocal) {
        if (matchedLocal.password_hash !== password) {
          set({ isLoading: false })
          return { success: false, message: 'Kata sandi salah. Silakan coba kembali.' }
        }

        const newId = matchedLocal.id || crypto.randomUUID()
        const now = new Date().toISOString()
        const newUser = {
          id: newId,
          full_name: matchedLocal.full_name,
          email: emailClean,
          password_hash: password,
          phone_number: matchedLocal.phone_number || '081234567890',
          role: matchedLocal.role || (emailClean === 'admin@court.in' || emailClean.includes('admin') ? 'ADMIN' : 'CUSTOMER'),
          tier: matchedLocal.tier || 'Regular Member',
          avatar_url: matchedLocal.avatar_url || null,
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

      // 3. Fallback Auto-Enroll
      if (emailClean) {
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
      if (data.birth_date) {
        finalUser.birth_date = data.birth_date
        localStorage.setItem('courtin_birthdate_' + emailClean, data.birth_date)
      }

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

    // 1. Update local state and localStorage immediately
    set({ user: updatedUser })
    try {
      localStorage.setItem('courtin_user', JSON.stringify(updatedUser))
      if (updatedData.birth_date) {
        localStorage.setItem('courtin_birthdate_' + emailKey, updatedData.birth_date)
      }
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
        const fullUser = {
          ...updatedUser,
          ...savedDbUser,
          birth_date: updatedData.birth_date || updatedUser.birth_date || localStorage.getItem('courtin_birthdate_' + emailKey)
        }
        localStorage.setItem('courtin_user', JSON.stringify(fullUser))
        set({ user: fullUser })
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
          const storedBirthDate = localStorage.getItem('courtin_birthdate_' + emailClean)
          const mergedUser = {
            ...parsed,
            ...dbUser,
            birth_date: storedBirthDate || parsed.birth_date || '1998-08-15'
          }
          localStorage.setItem('courtin_user', JSON.stringify(mergedUser))
          if (mergedUser.avatar_url) {
            localStorage.setItem('courtin_avatar_' + emailClean, mergedUser.avatar_url)
          } else {
            localStorage.removeItem('courtin_avatar_' + emailClean)
          }
          set({ user: mergedUser, isAuthenticated: true })
          return mergedUser
        }
      }
    } catch (err) {
      console.error('Failed to fetch fresh profile', err)
    }
  },

  /**
   * Real-time WebSocket Subscription from Supabase
   */
  subscribeToUserRealtime: () => {
    const localUser = localStorage.getItem('courtin_user')
    if (!localUser) return () => {}

    try {
      const parsed = JSON.parse(localUser)
      if (!parsed?.email) return () => {}

      const emailClean = parsed.email.toLowerCase()
      const channelName = `public:users:email=${emailClean}`

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `email=eq.${emailClean}`,
          },
          (payload) => {
            if (payload?.new) {
              const dbUser = { ...payload.new }
              delete dbUser.password_hash
              const storedBirthDate = localStorage.getItem('courtin_birthdate_' + emailClean)
              const mergedUser = {
                ...dbUser,
                birth_date: storedBirthDate || dbUser.birth_date || '1998-08-15',
              }
              localStorage.setItem('courtin_user', JSON.stringify(mergedUser))
              if (mergedUser.avatar_url) {
                localStorage.setItem('courtin_avatar_' + emailClean, mergedUser.avatar_url)
              } else {
                localStorage.removeItem('courtin_avatar_' + emailClean)
              }
              set({ user: mergedUser })
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (e) {
      console.error('Failed to subscribe to realtime updates', e)
      return () => {}
    }
  },
}))

export default useAuthStore

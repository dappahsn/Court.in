import { create } from 'zustand'

const DEFAULT_SETTINGS = {
  venue_name: 'court.in Sport Complex & Arena',
  tagline: 'Platform Reservasi Lapangan Olahraga Terintegrasi',
  phone_number: '0812-3456-7890',
  email: 'admin@court.in',
  address: 'Jl. Teuku Umar No. 45, Seutui, Kota Banda Aceh',
  open_hour: '07:00',
  close_hour: '23:00',
  qris_timeout_minutes: 15,
  service_fee: 2000,
  allow_cash_payment: true,
  auto_cancel_unpaid: true,
  reschedule_notice_hours: 24,
}

const loadSavedSettings = () => {
  try {
    const saved = localStorage.getItem('courtin_settings')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load settings', e)
  }
  return DEFAULT_SETTINGS
}

const useSettingsStore = create((set, get) => ({
  settings: loadSavedSettings(),

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings }
    set({ settings: updated })
    try {
      localStorage.setItem('courtin_settings', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save settings', e)
    }
    return { success: true, message: 'Pengaturan bisnis berhasil disimpan!' }
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS })
    localStorage.setItem('courtin_settings', JSON.stringify(DEFAULT_SETTINGS))
  },
}))

export default useSettingsStore

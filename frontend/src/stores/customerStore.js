import { create } from 'zustand'

const INITIAL_CUSTOMERS = [
  {
    id: 'cst-001',
    name: 'Muhammad Daffa Husen',
    email: 'daffa@court.in',
    phone: '0812-3456-7890',
    tier: 'VIP Member',
    total_bookings: 8,
    total_spend: 1216000,
    preferred_sport: 'FUTSAL',
    last_active: 'Hari Ini',
    joined_date: 'Januari 2024',
    status: 'ACTIVE',
  },
  {
    id: 'cst-002',
    name: 'Farhan Maulana',
    email: 'farhan.m@gmail.com',
    phone: '0813-9876-5432',
    tier: 'Regular',
    total_bookings: 4,
    total_spend: 888000,
    preferred_sport: 'PADEL',
    last_active: 'Kemarin',
    joined_date: 'Maret 2024',
    status: 'ACTIVE',
  },
  {
    id: 'cst-003',
    name: 'Budi Santoso',
    email: 'budi.santoso@yahoo.com',
    phone: '0821-5544-3322',
    tier: 'Regular',
    total_bookings: 3,
    total_spend: 516000,
    preferred_sport: 'BADMINTON',
    last_active: '3 hari lalu',
    joined_date: 'April 2024',
    status: 'ACTIVE',
  },
  {
    id: 'cst-004',
    name: 'Rian Syahputra',
    email: 'riansyah@gmail.com',
    phone: '0852-7788-9900',
    tier: 'VIP Member',
    total_bookings: 6,
    total_spend: 906000,
    preferred_sport: 'FUTSAL',
    last_active: '1 minggu lalu',
    joined_date: 'Februari 2024',
    status: 'ACTIVE',
  },
  {
    id: 'cst-005',
    name: 'Dimas Aditya',
    email: 'dimas.aditya@outlook.com',
    phone: '0812-9900-1122',
    tier: 'Regular',
    total_bookings: 2,
    total_spend: 504000,
    preferred_sport: 'PADEL',
    last_active: '2 minggu lalu',
    joined_date: 'Mei 2024',
    status: 'ACTIVE',
  },
]

const loadSavedCustomers = () => {
  try {
    const saved = localStorage.getItem('courtin_customers')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load customers', e)
  }
  return INITIAL_CUSTOMERS
}

const useCustomerStore = create((set, get) => ({
  customers: loadSavedCustomers(),

  addCustomer: (customerData) => {
    const newId = `cst-${Date.now().toString().slice(-4)}`
    const newCustomer = {
      id: newId,
      tier: 'Regular',
      total_bookings: 1,
      total_spend: 0,
      last_active: 'Baru saja',
      joined_date: 'September 2026',
      status: 'ACTIVE',
      ...customerData,
    }
    const updated = [newCustomer, ...get().customers]
    set({ customers: updated })
    try {
      localStorage.setItem('courtin_customers', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save customer', e)
    }
    return newCustomer
  },

  updateCustomer: (id, updatedData) => {
    const updated = get().customers.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    set({ customers: updated })
    try {
      localStorage.setItem('courtin_customers', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to update customer', e)
    }
  },

  recordTransaction: ({ name, email, phone, sport, amount }) => {
    const existing = get().customers.find(
      (c) =>
        (email && c.email.toLowerCase() === email.toLowerCase()) ||
        c.name.toLowerCase() === name.toLowerCase()
    )

    if (existing) {
      const updated = get().customers.map((c) =>
        c.id === existing.id
          ? {
              ...c,
              total_bookings: c.total_bookings + 1,
              total_spend: c.total_spend + amount,
              last_active: 'Hari Ini',
              preferred_sport: sport || c.preferred_sport,
              tier: c.total_bookings + 1 >= 5 ? 'VIP Member' : c.tier,
            }
          : c
      )
      set({ customers: updated })
      try {
        localStorage.setItem('courtin_customers', JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to update customer', e)
      }
    } else {
      get().addCustomer({
        name,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        phone: phone || '-',
        preferred_sport: sport || 'FUTSAL',
        total_spend: amount,
      })
    }
  },
}))

export default useCustomerStore

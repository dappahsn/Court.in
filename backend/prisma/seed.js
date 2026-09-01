const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed for court.in...')

  // 1. Create Default Super Admin
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@court.in' },
    update: {},
    create: {
      full_name: 'Muhammad Daffa Husen',
      email: 'admin@court.in',
      password_hash: adminPasswordHash,
      phone_number: '0812-3456-7890',
      role: 'ADMIN',
      tier: 'VIP Member',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // 2. Create Initial Courts
  const courtsData = [
    {
      id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0001',
      name: 'Futsal Arena Banda Aceh - Lapangan A',
      type: 'FUTSAL',
      price_per_hour: 150000,
      environment: 'Indoor',
      surface: 'Vinyl Pro Standard FIFA',
      image_url: '/images/futsal.jpg',
      rating: 4.9,
      reviews_count: 128,
      location: 'Banda Aceh',
      address: 'Jl. Teuku Umar No. 45, Seutui, Kota Banda Aceh',
      description: 'Lapangan Futsal Indoor berstandar internasional dengan lantai vinyl empuk anti-selip. Dilengkapi pencahayaan LED sorot berkekuatan 500 lux dan tribun penonton yang nyaman.',
      facilities: [
        { name: 'Toilet & Shower', icon: 'shower' },
        { name: 'Kantin & Lounge', icon: 'canteen' },
        { name: 'Parkir Luas', icon: 'parking' },
        { name: 'Free Wi-Fi', icon: 'wifi' },
        { name: 'Loker Penyimpanan', icon: 'locker' },
      ],
    },
    {
      id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0002',
      name: 'court.in Padel - Court 1 (Panoramic)',
      type: 'PADEL',
      price_per_hour: 220000,
      environment: 'Outdoor',
      surface: 'Mondo Supercourt XN',
      image_url: '/images/padel.jpg',
      rating: 4.8,
      reviews_count: 94,
      location: 'Metropolis Center',
      address: 'Komp. Olahraga Metropolis Blok B, Banda Aceh',
      description: 'Lapangan Padel berstandar World Padel Tour dengan kaca tempered panoramik tanpa tiang sudut, memberikan visibilitas maksimal dan pantulan bola sempurna.',
      facilities: [
        { name: 'Rental Raket & Bola', icon: 'racket' },
        { name: 'Kantin & Kafe', icon: 'canteen' },
        { name: 'Free Wi-Fi', icon: 'wifi' },
        { name: 'Parkir Mobil/Motor', icon: 'parking' },
        { name: 'Lampu LED Malam', icon: 'light' },
      ],
    },
    {
      id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0003',
      name: 'Gedung Badminton Jaya - Lapangan 1',
      type: 'BADMINTON',
      price_per_hour: 85000,
      environment: 'Indoor',
      surface: 'Enlio BWF Approved Mat',
      image_url: '/images/badminton.jpg',
      rating: 4.9,
      reviews_count: 156,
      location: 'Syiah Kuala',
      address: 'Jl. Inong Balee No. 12, Darussalam, Banda Aceh',
      description: 'Hall Badminton eksklusif dengan 4 lapangan karpet tebal standar BWF. Sirkulasi udara sejuk tanpa hembusan angin langsung yang mengganggu shuttlecock.',
      facilities: [
        { name: 'Beli & Sewa Shuttlecock', icon: 'racket' },
        { name: 'Musholla Nyaman', icon: 'shower' },
        { name: 'Shower Air Hangat', icon: 'shower' },
        { name: 'Minuman Dingin & Snack', icon: 'canteen' },
      ],
    },
    {
      id: 'c1a7d2b4-5f8e-4a11-9c32-1b8e9f2a0004',
      name: 'Aceh Padel Club - Center Court',
      type: 'PADEL',
      price_per_hour: 250000,
      environment: 'Indoor',
      surface: 'Textured Synthetic Turf',
      image_url: '/images/hero.jpg',
      rating: 5.0,
      reviews_count: 67,
      location: 'Lampineung',
      address: 'Jl. T. Nyak Arief No. 88, Lampineung, Banda Aceh',
      description: 'Pusat olahraga padel indoor premium pertama di Aceh dengan langit-langit setinggi 12 meter dan fasilitas cafe lounge eksklusif untuk komunitas.',
      facilities: [
        { name: 'Pro Coach & Kursus Padel', icon: 'racket' },
        { name: 'Cafe & Mocktail Bar', icon: 'canteen' },
        { name: 'Locker Room VIP', icon: 'locker' },
        { name: 'High-speed Wi-Fi', icon: 'wifi' },
      ],
    },
  ]

  for (const c of courtsData) {
    await prisma.court.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    })
  }
  console.log(`✅ ${courtsData.length} courts seeded successfully.`)

  // 3. Create Business Settings
  await prisma.businessSetting.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
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
    },
  })
  console.log('✅ Business settings seeded.')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

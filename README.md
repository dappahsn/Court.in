<div align="center">

<a href="#">
  <img src="assets/logo-horizontal.png" alt="court.in Logo" width="280" />
</a>

<br />

### Platform Reservasi Lapangan Olahraga & Manajemen Gelanggang Terintegrasi

*Solusi digital modern untuk booking lapangan Futsal, Badminton, dan Padel secara real-time, bebas bentrok jadwal, dilengkapi pembayaran QRIS otomatis dan dashboard manajemen venue.*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

[Fitur Utama](#-fitur-utama) •
[Arsitektur & Tech Stack](#-arsitektur--tech-stack) •
[Skema Database](#-skema-database) •
[Struktur Direktori](#-struktur-direktori) •
[Panduan Instalasi](#-panduan-instalasi--menjalankan-proyek) •
[Aturan Bisnis](#-aturan-bisnis--keamanan-transaksi)

</div>

---

## 📌 Tentang court.in

**court.in** hadir untuk mengatasi permasalahan klasik para pecinta olahraga dan pemilik fasilitas gelanggang di Indonesia:
- ❌ **Proses booking manual via chat** yang lambat, rentan salah catat, dan berisiko jadwal bentrok (*double-booking*).
- ❌ **Ketiadaan transparansi ketersediaan slot** secara real-time.
- ❌ **Pembayaran tanpa verifikasi otomatis** yang menyulitkan rekonsiliasi kasir/admin.

Dengan **court.in**, pemain dapat langsung mengecek slot kosong, memilih tanggal dan jam main, menyelesaikan pembayaran QRIS ber-timer 15 menit, menerima E-Ticket resmi ber-QR Code, serta memberikan ulasan terverifikasi setelah sesi bermain selesai.

---

## ✨ Fitur Utama

### 👤 1. Portal Pelanggan (Customer Experience)
* **Pencarian & Eksplorasi Multi-Kategori**: Filter lapangan berdasarkan cabang olahraga (**Futsal**, **Badminton**, **Padel**), lingkungan (*Indoor* vs *Outdoor*), rentang harga, dan rating.
* **Slot Jadwal Real-time**: Matriks jam interaktif dari jam buka (07:00) hingga tutup (23:00) dengan visualisasi status slot (*Tersedia*, *Terpilih*, *Terpesona/Terkunci*).
* **Booking Conflict Prevention**: Penguncian slot otomatis selama 15 menit saat proses pembayaran berlangsung agar tidak dapat direbut oleh pengguna lain.
* **Metode Pembayaran Ganda**:
  * **QRIS Otomatis**: Integrasi Midtrans API dengan hitung mundur (*countdown timer*) 15 menit.
  * **Bayar di Tempat (Cash)**: Konfirmasi instan dengan validasi kasir di lokasi gelanggang.
* **E-Ticket Digital**: Tiket resmi dengan nomor booking unik (`TKT-YYYY-MMDD-XXX`), barcode/QR visual, ringkasan biaya transparan, dan opsi cetak/unduh PDF.
* **Ulasan Terverifikasi (Verified Reviews)**: Sistem proteksi ulasan bintang 1–5 yang hanya terbuka bagi pengguna yang telah menyelesaikan jadwal bermain (`COMPLETED`).
* **Motion & Interaktivitas Halus**: Animasi *scroll reveal*, kartu bento interaktif, investor marquee ticker, dan animasi *count-up* metrik dinamis.

### 🛡️ 2. Portal Manajemen Venue (Admin & Staff)
* **Dashboard Analitik**: Ringkasan omzet harian/bulanan, total reservasi, tingkat okupansi lapangan, dan grafik performa venue.
* **Live Slot Scheduler**: Kalender visual untuk melihat seluruh reservasi per lapangan dan per jam, lengkap dengan tombol **Check-in**, **Reschedule**, atau **Batalkan**.
* **Katalog Lapangan**: Tambah, edit tarif per jam, ubah foto, fasilitas, dan status operasional (*Aktif*, *Maintenance*, *Tutup*).
* **Moderasi Ulasan**: Balas ulasan pelanggan secara langsung dari sistem untuk membangun reputasi venue.
* **Manajemen Staf & Akses**: Kelola akun staf dengan pembagian peran (*Admin*, *Staff Kasir*, *Staff Operasional*).
* **Pengaturan Bisnis**: Konfigurasi jam operasional gelanggang, biaya layanan (*service fee*), durasi timer QRIS, dan aturan pembatalan.

---

## 🏗️ Arsitektur & Tech Stack

Proyek ini dibangun menggunakan struktur **Monorepo (npm workspaces)** yang memisahkan client-side dan server-side secara modular:

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Frontend)                      │
│   React 19 • Vite 8 • Tailwind CSS v4 • Zustand • React Router│
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON / Axios)
┌──────────────────────────────▼──────────────────────────────┐
│                      SERVER (Backend)                       │
│    Node.js • Express.js 5 • JWT Auth • Midtrans Payment SDK │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma ORM
┌──────────────────────────────▼──────────────────────────────┐
│                     DATABASE LAYER                          │
│          PostgreSQL (Supabase / Local Database)             │
└─────────────────────────────────────────────────────────────┘
```

### Rincian Teknologi:
| Layer | Komponen / Library | Kegunaan |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8 | UI Reaktif performa tinggi dengan bundling kilat |
| **Styling** | Tailwind CSS v4 | Desain sistem modern dengan CSS tokens `@theme` |
| **State Management** | Zustand | State auth, keranjang booking, notifikasi, dan data lapangan |
| **Icons & Motion** | Lucide React, CSS Scroll-Driven | Ikon vektor presisi dan animasi scroll GPU-accelerated |
| **Backend** | Node.js, Express.js 5 | RESTful API cepat dan modular |
| **Database & ORM** | PostgreSQL, Prisma 5.22 | Pemodelan data relasional dengan type-safety |
| **Keamanan** | JWT, bcryptjs, CORS | Otentikasi stateless dan hashing password aman |
| **Payment Gateway** | Midtrans API | Integrasi QRIS dinamis |

---

## 🗄️ Skema Database

Berikut diagram hubungan antar entitas (Entity Relationship) pada sistem **court.in**:

```mermaid
erDiagram
    USER ||--o{ BOOKING : "melakukan"
    USER ||--o{ REVIEW : "memberikan"
    COURT ||--o{ BOOKING : "dipesan pada"
    COURT ||--o{ REVIEW : "menerima"
    BOOKING ||--o| REVIEW : "menghasilkan"

    USER {
        string id PK
        string full_name
        string email UK
        string password_hash
        string phone_number
        enum role "CUSTOMER | ADMIN | STAFF"
        string tier
        datetime created_at
    }

    COURT {
        string id PK
        string name
        enum type "FUTSAL | PADEL | BADMINTON"
        int price_per_hour
        string environment "Indoor | Outdoor"
        string surface
        string location
        string status "ACTIVE | MAINTENANCE | CLOSED"
        float rating
        int reviews_count
    }

    BOOKING {
        string id PK "TKT-YYYY-MMDD-XXX"
        string user_id FK
        string court_id FK
        string customer_name
        string booking_date "YYYY-MM-DD"
        string start_time
        string end_time
        int court_fee
        int service_fee
        int total_price
        string payment_method "QRIS | CASH"
        enum status "PENDING | PAID | PAY_AT_VENUE | CANCELLED | COMPLETED"
        datetime checked_in_at
        datetime created_at
    }

    REVIEW {
        string id PK
        string booking_id FK,UK
        string user_id FK
        string court_id FK
        int rating "1 - 5"
        string comment
        boolean verified
        string admin_reply
        datetime created_at
    }

    BUSINESS_SETTING {
        string id PK
        string venue_name
        string open_hour
        string close_hour
        int qris_timeout_minutes
        int service_fee
        boolean allow_cash_payment
        boolean auto_cancel_unpaid
    }
```

---

## 📁 Struktur Direktori

```text
Court.in/
├── backend/                  # Server-side Application (Express.js)
│   ├── prisma/
│   │   ├── schema.prisma     # Definisi model & migrasi PostgreSQL
│   │   └── seed.js           # Data awal (lapangan, akun admin, ulasan)
│   ├── src/
│   │   ├── index.js          # Entrypoint server & routes API
│   │   ├── middleware/       # JWT Auth & role guard middleware
│   │   └── routes/           # Endpoint auth, courts, bookings, reviews
│   ├── .env.example          # Template konfigurasi environment backend
│   └── package.json
│
├── frontend/                 # Client-side Application (React + Vite)
│   ├── public/
│   │   └── images/           # Asset statis gelanggang & aksi olahraga
│   ├── src/
│   │   ├── components/       # Komponen UI (Header, Footer, Dialogs, Cards)
│   │   ├── data/             # Data mock fallback & opsi sortir
│   │   ├── hooks/            # Custom hooks (useScrollReveal, dll.)
│   │   ├── pages/            # Halaman utama (Home, Explore, About, Contact, E-Ticket)
│   │   │   └── admin/        # Panel Manajemen Admin (Dashboard, Slots, Staff)
│   │   ├── stores/           # Zustand state management (auth, courts, bookings)
│   │   ├── App.jsx           # Routing aplikasi
│   │   ├── index.css         # Design system tokens & animasi keyframes
│   │   └── main.jsx          # Entry point React
│   ├── .env.example          # Template environment variabel frontend
│   └── package.json
│
├── package.json              # Monorepo workspace root
└── README.md                 # Dokumentasi proyek
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### Prasyarat:
* **Node.js**: Versi `>= 18.0.0`
* **npm**: Versi `>= 9.0.0`
* **Database**: PostgreSQL lokal atau cloud provider ([Supabase](https://supabase.com/))

### Langkah 1: Clone Repository
```bash
git clone https://github.com/username/court.in.git
cd court.in
```

### Langkah 2: Install Dependensi Monorepo
Jalankan perintah ini di direktori root proyek untuk menginstal dependensi backend dan frontend sekaligus:
```bash
npm install
```

### Langkah 3: Konfigurasi Environment Variables

1. **Backend Environment**:
   Salin file `.env.example` di folder `backend/` menjadi `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Sesuaikan isinya:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   DATABASE_URL="postgresql://postgres:password@localhost:5432/courtin_db?schema=public"
   JWT_SECRET=super_secret_jwt_key_courtin_2026
   JWT_EXPIRES_IN=7d
   MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxx
   MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxx
   MIDTRANS_IS_PRODUCTION=false
   ```

2. **Frontend Environment**:
   Salin file `.env.example` di folder `frontend/` menjadi `.env`:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   Isi konfigurasi:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Langkah 4: Setup Database & Seeding (Prisma)
Migrasikan skema database dan masukkan data awal (lapangan default, user admin, dan review):
```bash
# Jalankan migrasi Prisma
npx prisma migrate dev --name init --schema=backend/prisma/schema.prisma

# Eksekusi database seeder
node backend/prisma/seed.js
```

### Langkah 5: Jalankan Server Development
Cukup satu perintah di direktori root untuk menjalankan Backend (`port 5000`) dan Frontend (`port 5173`) secara bersamaan:
```bash
npm run dev
```

Buka peramban Anda di:
* 🌐 **Frontend Client**: [http://localhost:5173](http://localhost:5173) (atau port 5174 jika 5173 terpakai)
* 🔌 **Backend REST API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Kredensial Akun Default (Seed Data)

Untuk menguji fitur tanpa harus mendaftar dari awal, gunakan akun demo berikut:

| Peran (Role) | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@court.in` | `admin123` | Akses penuh Dashboard Admin, jadwal slot, moderasi ulasan, dan staf |
| **Staf Kasir** | `siti.kasir@court.in` | `admin123` | Check-in pelanggan, input booking bayar di tempat (cash) |
| **Pelanggan Demo** | `daffa@court.in` | `user123` | Eksplorasi lapangan, reservasi slot, riwayat tiket, submit ulasan |

---

## 🔒 Aturan Bisnis & Keamanan Transaksi

1. **Anti Double-Booking**:
   Validasi ganda diterapkan pada level database (*atomic queries*) dan middleware backend untuk memastikan satu slot waktu lapangan tidak pernah dipesan dua kali pada jam yang sama.
2. **Timer Pembayaran 15 Menit**:
   Saat memilih metode QRIS, status pesanan menjadi `PENDING` dan slot dikunci selama 15 menit. Jika timer habis tanpa konfirmasi webhook pembayaran, status otomatis berubah menjadi `CANCELLED` dan slot kembali terbuka untuk umum.
3. **Integritas Ulasan (Review Integrity)**:
   Ulasan hanya dapat dikirimkan jika ID pesanan telah terverifikasi berstatus `COMPLETED`. Satu tiket hanya berhak atas satu ulasan (mencegah review spam/bot).

---

## 🛠️ Perintah Skrip Tersedia

Di direktori root:
* `npm run dev`: Menjalankan backend dan frontend secara bersamaan (*concurrently*).
* `npm run dev:frontend`: Menjalankan server dev frontend saja.
* `npm run dev:backend`: Menjalankan server backend saja.
* `npm run build`: Melakukan build bundle produksi frontend (`vite build`).
* `npm run lint`: Menjalankan linter cepat menggunakan `oxlint`.

---

## 👨‍💻 Kontributor

* **Daffa Husen** — *Creator & Lead Developer* ([GitHub](https://github.com/dappahsn))

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [ISC License](LICENSE).
Hak Cipta © 2026 court.in. Seluruh hak cipta dilindungi undang-undang.

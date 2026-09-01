# Design System - court.in (Web App Booking Lapangan)

Dokumen ini adalah panduan utama (Single Source of Truth) untuk styling dan antarmuka pengguna proyek court.in. Seluruh pengembangan frontend (React/Tailwind) harus mengacu pada spesifikasi di bawah ini.

## 1. Grid, Layout & Responsivitas
* **Max Width Kontainer:** 1200px (terpusat/centered) agar UI tidak terlalu melebar di layar ultrawide.
* **Grid System:** 12 Kolom standar.
* **Breakpoints (Tailwind standar):**
  - Mobile (`sm` & ke bawah): `< 768px` (Tampilan 1 kolom bertumpuk vertikal).
  - Tablet (`md` - `lg`): `768px - 1024px` (Tampilan 2 kolom untuk grid kartu).
  - Desktop (`xl` & ke atas): `> 1024px` (Tampilan 3-4 kolom).

## 2. Tipografi
* **Font Utama:** `Inter` (Sangat direkomendasikan untuk UI karena angka dan huruf sangat terbaca jelas).
* **Hirarki Teks:**
  - **H1 (Judul Halaman):** Bold, 32px
  - **H2 (Sub-judul Seksi):** Semi-Bold, 24px
  - **H3 (Nama Lapangan):** Medium, 20px
  - **Body Large (Teks Utama):** Regular, 16px
  - **Body Small (Info Sekunder):** Regular, 14px
  - **Caption (Label/Waktu):** Regular, 12px

## 3. Palet Warna (Color Tokens)
### A. Warna Brand & Netral
* **Primary-500 (Biru Sporty court.in):** `#3B82F6` (Warna identitas utama, untuk tombol CTA dan elemen interaktif).
* **Primary-600 (Biru Hover):** `#2563EB` (Saat tombol utama disorot kursor).
* **Background App:** `#F8FAFC` (Abu-abu sangat terang untuk latar belakang *body* website).
* **Surface/Card:** `#FFFFFF` (Putih murni untuk kotak konten, kartu, popup, dan modal).
* **Text Primary:** `#0F172A` (Abu-abu hampir hitam untuk judul dan teks utama).
* **Text Secondary:** `#64748B` (Abu-abu pudar untuk teks deskripsi tambahan).
* **Border:** `#E2E8F0` (Warna garis pemisah / *divider*).

### B. Warna Status & Rating (Semantic)
* **Success:** `#10B981` (Hijau) -> Slot jam tersedia, Pembayaran QRIS Lunas.
* **Info:** `#0EA5E9` (Biru Langit) -> Khusus untuk badge status tiket "Bayar di Tempat".
* **Warning:** `#F59E0B` (Kuning/Oranye) -> Menunggu Pembayaran QRIS.
* **Danger:** `#EF4444` (Merah) -> Slot Penuh/Dipesan, Pesanan Dibatalkan, Pesan Error Form.
* **Star-Filled:** `#FBBF24` (Kuning Emas) -> Ikon Bintang pada rating ulasan.
* **Star-Empty:** `#CBD5E1` (Abu-abu Terang) -> Bintang yang belum dipilih / kosong.

## 4. Spesifikasi Komponen UI

### A. Tombol (Buttons)
Semua tombol memiliki properti dasar: *Border Radius: 8px, Transisi warna 0.2s*.
* **Primary:** Background `#3B82F6`, Teks Putih. Saat hover: Background `#2563EB`.
* **Outline / Secondary:** Background transparan, Garis Tepi (Border) 1px solid `#3B82F6`, Teks `#3B82F6`.
* **Disabled (Non-aktif):** Background `#E2E8F0` (Abu-abu terang), Teks `#64748B`. Kursor `not-allowed`.

### B. Form & Input Area
* **Default:** Kotak putih dengan garis tepi `#E2E8F0`, radius 8px.
* **Focus / Aktif:** Garis tepi berubah biru `#3B82F6` ditambah efek bayangan biru tipis (Tailwind: `ring-blue-500`).
* **Error:** Garis tepi merah `#EF4444` disertai teks peringatan berukuran 12px warna merah di bawah input.

### C. Kalender & Slot Waktu (Time Picker)
* **Slot Tersedia:** Kotak dengan garis tepi hijau muda (`#10B981`), teks hijau.
* **Slot Dipilih:** Kotak dengan warna latar solid hijau (`#10B981`), teks putih.
* **Slot Penuh:** Kotak abu-abu pudar, teks dicoret (*line-through* / *strikethrough*), tidak bisa diklik.

### D. Sistem Kartu (Cards)
Semua kartu memiliki properti dasar: *Background `#FFFFFF`, Border Radius 12px, Soft Shadow (Tailwind: `shadow-md`)*.
* **Kartu Lapangan (Homepage & Explore):**
  - Foto lapangan di bagian atas (aspek rasio 16:9).
  - Nama, harga, dan rating bintang di bagian tengah.
  - Tombol "Booking" di bagian bawah.
* **Kartu Ulasan (Reviews):** 
  - Avatar pengguna (bulat), Nama, dan Tanggal di bagian header.
  - Bintang rating (5 bintang).
  - Teks ulasan maksimal 3-4 baris (bisa di-expand).
* **Kartu Tiket (Dashboard Pesanan):**
  - Detail lapangan dan jam di sisi kiri.
  - QR Code atau ID Booking di sisi kanan.
  - **Badge Status:** Hijau untuk Lunas (QRIS), Biru Langit untuk "Bayar di Tempat".

### E. Notifikasi (Toast / Snackbar)
* **Desain:** Kotak melayang kecil di sudut kanan atas atau tengah bawah layar. Radius 8px.
* **Perilaku:** Muncul dengan animasi *slide-in*, otomatis menghilang dalam 3 detik.
* **Varian:** Latar hijau untuk aksi sukses (contoh: "Berhasil Booking"), latar merah untuk error (contoh: "Jadwal sudah diambil orang lain").
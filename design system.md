# Comprehensive Design System - Web App Booking Lapangan

## 1. Grid, Layout & Responsivitas
* **Max Width Kontainer:** 1200px (terpusat/centered).
* **Grid System:** 12 Kolom standar.
* **Breakpoints:**
  - Mobile: `< 768px` (Tampilan 1 kolom vertikal).
  - Tablet: `768px - 1024px` (Tampilan 2 kolom untuk *grid* kartu).
  - Desktop: `> 1024px` (Tampilan 3-4 kolom).

## 2. Tipografi (Font Utama: Inter)
* **H1 (Judul Halaman):** Bold, 32px
* **H2 (Sub-judul Seksi):** Semi-Bold, 24px
* **H3 (Nama Lapangan):** Medium, 20px
* **Body Large (Teks Utama):** Regular, 16px
* **Body Small (Info Sekunder):** Regular, 14px
* **Caption (Label/Waktu):** Regular, 12px

## 3. Palet Warna (Color Tokens)
### Warna Brand & Netral
* **Primary-500 (Biru Sporty):** `#3B82F6` (Tombol utama, elemen interaktif).
* **Primary-600 (Biru Gelap/Hover):** `#2563EB` (Saat tombol disorot kursor).
* **Background App:** `#F8FAFC` (Abu-abu sangat terang untuk latar halaman).
* **Surface/Card:** `#FFFFFF` (Putih murni untuk kotak konten/kartu).
* **Text Primary:** `#0F172A` (Abu-abu hampir hitam).
* **Text Secondary:** `#64748B` (Abu-abu pudar untuk teks deskripsi).
* **Border:** `#E2E8F0` (Garis pemisah).

### Warna Status & Rating (Semantic)
* **Success:** `#10B981` (Hijau - Slot Tersedia, Pembayaran QRIS Lunas).
* **Info:** `#0EA5E9` (Biru Langit - Status tiket "Bayar di Tempat").
* **Warning:** `#F59E0B` (Kuning - Menunggu Pembayaran QRIS).
* **Danger:** `#EF4444` (Merah - Slot Penuh, Pesanan Dibatalkan, Teks Error).
* **Star-Filled:** `#FBBF24` (Kuning Emas - Bintang rating yang terisi/menyala).
* **Star-Empty:** `#CBD5E1` (Abu-abu - Bintang rating kosong/belum dipilih).

## 4. Spesifikasi Komponen UI (UI Components)

### A. Tombol (Buttons) - *Border Radius: 8px*
* **Primary:** BG `#3B82F6`, Teks Putih. Saat *hover* berubah ke `#2563EB`.
* **Outline:** BG Transparan, Garis tepi dan Teks `#3B82F6`.
* **Disabled:** BG Abu-abu terang, Teks Abu-abu redup (tidak bisa diklik).

### B. Input Form & Interaksi
* **Default:** Kotak putih dengan garis tepi `#E2E8F0`.
* **Focus (Aktif):** Garis tepi berubah biru `#3B82F6` dan muncul efek bayangan tipis (*ring glow*).
* **Error:** Garis tepi merah `#EF4444` disertai teks bantuan berwarna merah di bawah kolom.

### C. Kalender & Slot Waktu
* **Slot Tersedia:** Kotak dengan garis tepi hijau, teks hijau.
* **Slot Dipilih:** Kotak hijau *solid* (`#10B981`), teks putih.
* **Slot Penuh:** Kotak abu-abu pudar, teks dicoret (*strikethrough*), tidak bisa diklik.

### D. Sistem Kartu (Cards) - *Border Radius: 12px, Soft Shadow*
* **Kartu Lapangan:** Foto lapangan (atas), Nama & Harga (tengah), Rating Bintang, dan Tombol "Booking" (bawah).
* **Kartu Ulasan:** Menampilkan Foto Profil, Nama Pengguna, tanggal, deretan 5 ikon bintang (warna `Star-Filled`/`Star-Empty`), dan teks ulasan.
* **Kartu Tiket (Dashboard):** Menampilkan Detail Pesanan, QR Code Tiket, dan Badge Status (Hijau untuk QRIS, Biru Langit untuk Bayar di Tempat).

### E. Notifikasi (Toast/Snackbar)
* **Desain:** Kotak melayang di sudut layar, durasi tampil 3 detik.
* **Varian:** Latar hijau untuk aksi sukses, latar merah untuk *error*.
# Comprehensive User Flow - Web App Booking Lapangan Olahraga

## 1. Navigasi Global (Global Header & Footer)
* **Header (Guest):** Logo platform, Menu (Beranda, Jelajah, Tentang, Hubungi Kami), Tombol "Masuk", Tombol "Daftar".
* **Header (Logged In):** Menampilkan *Dropdown* Profil (Foto Profil, Nama, "Pesanan Saya", "Pengaturan Akun", "Keluar").
* **Footer:** Tautan cepat, Syarat & Ketentuan, Kebijakan Privasi, Tautan Media Sosial, dan Kontak Bantuan.

## 2. Alur Halaman Publik
### A. Beranda (Home)
1. Pengguna mendarat di halaman utama web.
2. Melihat *Hero Banner* dengan form pencarian cepat: [Pilih Olahraga] + [Pilih Tanggal] -> Klik "Cari Lapangan".
3. Menggulir ke bawah untuk melihat bagian "Lapangan Terpopuler" (menampilkan lapangan dengan *rating* tertinggi) dan "Promo Hari Ini".

### B. Jelajah (Explore & Filter)
1. Pengguna masuk ke halaman Jelajah.
2. Sistem menampilkan daftar semua lapangan (Futsal, Padel, Bulu Tangkis) dalam bentuk kartu.
3. **Skenario Filter:** Pengguna memfilter berdasarkan:
   - Jenis Olahraga.
   - Tipe Lapangan (Indoor / Outdoor / Vinyl / Sintetis).
   - Rentang Harga (Slider min-max).
   - *Rating* Minimum (misal: 4 Bintang ke atas).
4. Hasil pencarian diperbarui secara dinamis.

## 3. Alur Autentikasi (Authentication)
### A. Pendaftaran (Register)
1. Pengguna mengisi form: Nama Lengkap, Email, No. WhatsApp, Kata Sandi.
2. Validasi *Frontend*: Memastikan email berformat benar dan kata sandi minimal 8 karakter.
3. Jika sukses -> Sistem mengirim OTP -> Pengguna memasukkan OTP.
4. Akun terverifikasi -> Otomatis *login* dan diarahkan ke Beranda.

### B. Masuk & Lupa Kata Sandi (Login & Reset)
1. **Login:** Pengguna memasukkan Email dan Kata Sandi. Jika sukses, kembali ke halaman terakhir yang dikunjungi.
2. **Lupa Sandi:** Klik "Lupa Kata Sandi" -> Masukkan Email -> Klik tautan *reset* di email -> Buat sandi baru -> Login ulang.

## 4. Alur Pemesanan (Booking Engine Flow)
1. Di halaman **Jelajah**, pengguna memilih lapangan dan menekan "Lihat Detail".
2. **Halaman Detail Lapangan:**
   - Melihat galeri foto, fasilitas, deskripsi, dan **Rangkuman Ulasan/Rating** beserta ulasan tertulis dari pengguna lain di bagian bawah.
3. **Pemilihan Jadwal:**
   - Pengguna memilih **Tanggal** pada kalender.
   - Sistem mengambil data ketersediaan slot jam secara *real-time*.
   - Pengguna mengklik slot jam yang tersedia.
4. Pengguna menekan **"Booking Sekarang"**. (Jika belum *login*, diarahkan ke form masuk).
5. **Ringkasan & Metode Pembayaran:**
   - Menampilkan detail durasi dan total harga.
   - Pengguna memilih metode pembayaran:
     a. **QRIS** (Bayar langsung).
     b. **Bayar di Tempat** (Bayar tunai di lokasi lapangan sebelum bermain).
   - Menekan "Konfirmasi Pesanan".
6. **Proses Konfirmasi (Bercabang):**
   - **Jika pilih QRIS:** Sistem menampilkan QR Code -> Pengguna *scan* -> Pembayaran berhasil -> Terbit Tiket dengan status "Lunas".
   - **Jika pilih Bayar di Tempat:** Sistem langsung menerbitkan Kode Booking/Tiket dengan status "Bayar di Tempat".

## 5. Alur Area Pengguna & Ulasan (Dashboard & Reviews)
### A. Profil & Pesanan Aktif
1. Pengguna membuka tab **Pesanan Saya**.
2. **Menunggu Pembayaran (Hanya QRIS):** Pesanan yang QR Code-nya belum dibayar dan *timer* masih berjalan.
3. **Tiket Aktif:** Menampilkan tiket pesanan untuk jadwal yang akan datang (menampilkan QR Code tiket untuk di-*scan* di lapangan).
   - Label **Hijau:** "Lunas (QRIS)".
   - Label **Biru Langit:** "Bayar di Tempat".

### B. Riwayat & Sistem Ulasan (Rating System)
1. Pengguna membuka tab **Riwayat** (pesanan yang jadwal mainnya sudah selesai).
2. Terdapat tombol **"Beri Ulasan"** pada tiket yang sudah selesai.
3. Pengguna mengklik tombol -> Muncul *Pop-up* Penilaian.
4. Pengguna memilih nilai **1 hingga 5 Bintang** dan menulis pengalaman mereka.
5. Menekan "Kirim Ulasan" -> Muncul notifikasi sukses.
6. Tombol berubah menjadi **"Sudah Diulas"** (tidak bisa diklik lagi).
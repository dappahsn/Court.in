# Business Rules - court.in

Dokumen ini berisi aturan logika bisnis dan batasan sistem yang harus diterapkan di level Backend untuk mencegah *bug* dan kecurangan.

## 1. Aturan Ketersediaan (Booking Conflict Prevention)
* **Validasi Real-time:** Sistem tidak boleh mengizinkan dua pengguna mem-booking `court_id` yang sama pada `date` dan `time_slot` yang sama.
* **Locking:** Jika sebuah slot sedang dalam status "Menunggu Pembayaran (QRIS)", slot tersebut dikunci (tidak bisa di-booking orang lain) selama durasi *timer*.

## 2. Aturan Pembayaran
* **Timer QRIS:** Pengguna diberikan waktu **15 menit** untuk menyelesaikan pembayaran QRIS.
* **Kadaluarsa Otomatis:** Jika lewat 15 menit dan tidak ada Webhook sukses dari Midtrans, sistem otomatis mengubah status pesanan dari `PENDING` menjadi `CANCELLED` dan melepaskan slot kembali ke publik.
* **Bayar di Tempat:** Jika metode ini dipilih, status langsung menjadi `PAY_AT_VENUE`. Tidak ada *timer* otomatis batal, status hanya bisa diubah menjadi `COMPLETED` oleh Admin di lokasi (lapangan).

## 3. Aturan Ulasan (Reviews & Ratings)
* Pengguna HANYA BISA memberikan ulasan (Bintang 1-5) jika status pesanan sudah `COMPLETED` (Jadwal main sudah lewat dan lunas).
* Satu ID Pesanan (Booking ID) hanya bisa diberi ulasan maksimal 1 kali.
* Nilai minimum rating adalah 1, maksimum 5.
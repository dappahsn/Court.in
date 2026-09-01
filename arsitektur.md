# System Architecture - court.in

Sistem court.in menggunakan arsitektur **Client-Server (Monolithic API)** yang berkomunikasi melalui RESTful API.

## 1. Alur Sistem Tingkat Tinggi (High-Level Flow)
1. **Client (Web Browser):** Pengguna mengakses UI React.js yang di-host di Vercel.
2. **API Request:** Saat pengguna melakukan pencarian atau *booking*, UI mengirim HTTP Request (GET/POST) ke Backend Node.js.
3. **Backend Logic:** Express.js memproses permintaan, memvalidasi sesi (JWT), dan mengecek ketersediaan data di PostgreSQL.
4. **Third-Party Integration:** Jika pengguna memilih metode QRIS, Backend akan menembak API Midtrans. Midtrans merespons dengan URL/Gambar QR Code.
5. **Webhook:** Saat pengguna selesai membayar via M-Banking, Midtrans mengirimkan *Webhook* (notifikasi otomatis) ke Backend court.in untuk mengubah status database menjadi "Lunas".

## 2. Diagram Interaksi (Sederhana)
[React Frontend] <--(REST API/JSON)--> [Node.js Backend] <--(Prisma ORM)--> [PostgreSQL]
                                            |
                                    (API & Webhook)
                                            |
                                    [Midtrans (QRIS)]
# Database Schema - court.in

Menggunakan PostgreSQL. Berikut adalah rancangan tabel (Entity Relationship) utama untuk sistem.

## 1. Table `users`
Menyimpan data pengguna (pelanggan dan admin).
* `id` (UUID, Primary Key)
* `full_name` (Varchar) -> *Contoh: Muhammad Daffa Husen*
* `email` (Varchar, Unique)
* `password_hash` (Varchar)
* `phone_number` (Varchar)
* `role` (Enum: 'CUSTOMER', 'ADMIN')
* `created_at` (Timestamp)

## 2. Table `courts`
Menyimpan data lapangan olahraga.
* `id` (UUID, Primary Key)
* `name` (Varchar) -> *Contoh: Futsal Arena Banda Aceh*
* `type` (Enum: 'FUTSAL', 'PADEL', 'BADMINTON')
* `price_per_hour` (Integer)
* `description` (Text)
* `image_url` (Varchar)
* `created_at` (Timestamp)

## 3. Table `bookings`
Jantung dari aplikasi, menyimpan data transaksi.
* `id` (UUID, Primary Key) -> Digunakan sebagai Nomor Tiket
* `user_id` (UUID, Foreign Key ke `users`)
* `court_id` (UUID, Foreign Key ke `courts`)
* `booking_date` (Date)
* `start_time` (Time)
* `end_time` (Time)
* `total_price` (Integer)
* `payment_method` (Enum: 'QRIS', 'CASH')
* `status` (Enum: 'PENDING', 'PAID', 'PAY_AT_VENUE', 'CANCELLED', 'COMPLETED')
* `payment_token` (Varchar, Nullable) -> Token dari Midtrans
* `created_at` (Timestamp)

## 4. Table `reviews`
Menyimpan ulasan dari pengguna.
* `id` (UUID, Primary Key)
* `booking_id` (UUID, Foreign Key ke `bookings`, Unique)
* `user_id` (UUID, Foreign Key ke `users`)
* `court_id` (UUID, Foreign Key ke `courts`)
* `rating` (Integer, 1-5)
* `comment` (Text)
* `created_at` (Timestamp)
# Tech Stack - court.in

Dokumen ini mendefinisikan teknologi yang digunakan dalam pengembangan aplikasi court.in. Pemilihan teknologi didasarkan pada kebutuhan performa *real-time*, keamanan transaksi, dan kemudahan skalabilitas.

## 1. Frontend (Client-Side)
* **Framework:** React.js (Kuat dalam merender UI interaktif).
* **Styling:** Tailwind CSS (Untuk implementasi *Design System* yang cepat dan konsisten).
* **Routing:** React Router.
* **State Management:** Zustand atau Redux Toolkit (Untuk menyimpan state *login* dan data *booking* sementara).
* **Deployment:** Vercel.

## 2. Backend (Server-Side / API)
* **Environment:** Node.js.
* **Framework:** Express.js (Ringan dan cepat untuk membangun RESTful API).
* **Authentication:** JSON Web Token (JWT).
* **Payment Gateway:** Midtrans API (Mendukung integrasi QRIS).

## 3. Database
* **Primary Database:** PostgreSQL (Database relasional yang sangat andal untuk mencegah bentrok jadwal dan menjaga integritas data transaksi).
* **ORM (Object-Relational Mapping):** Prisma (Memudahkan interaksi antara Node.js dan PostgreSQL).

## 4. Tools & Version Control
* **Repository:** Git & GitHub.
* **Design/Prototyping:** Figma.
* **API Testing:** Postman.
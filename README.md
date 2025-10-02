WhatsApp Gateway Berbasis Node.js & Baileys
Ini adalah aplikasi backend WhatsApp Gateway multi-device yang dibangun menggunakan Node.js, Express, Sequelize (dengan SQLite), dan library Baileys.

Fitur Utama
Multi-Device: Kelola beberapa akun WhatsApp secara bersamaan.

Dashboard Web: Antarmuka untuk mengelola akun, melihat status koneksi (termasuk QR Code), dan log pesan.

Autentikasi & Otorisasi: Login dengan Email/Password atau Google OAuth, dengan hak akses berbasis peran (admin, operator, viewer).

Database: Menggunakan SQLite untuk kemudahan setup dan backup.

REST API: Endpoint untuk mengirim pesan dan memeriksa status.

Webhook: Terintegrasi untuk mengirim notifikasi ke sistem lain seperti n8n.

Keamanan: Dilengkapi dengan helmet untuk proteksi header HTTP dan manajemen sesi yang aman.

Siap Produksi: Termasuk konfigurasi PM2 untuk menjalankan aplikasi di background.

1. Prasyarat
Node.js: Versi 18 atau lebih tinggi.

NPM: Versi 10 atau lebih tinggi.

Git: Untuk clone repositori.

2. Instalasi
Clone Repositori

git clone <url-repo-anda>
cd whatsapp-gateway-backend

Install Dependensi

npm install

Konfigurasi Environment
Salin file .env.example menjadi .env dan isi nilainya.

cp .env.example .env

Buka file .env dan sesuaikan nilainya:

SESSION_SECRET: Ganti dengan string acak yang sangat kuat.

GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET: Dapatkan dari Google Cloud Console dengan membuat kredensial OAuth 2.0. Pastikan Authorized redirect URIs diisi dengan http://your-domain.com/auth/google/callback.

INITIAL_ADMIN_EMAIL & INITIAL_ADMIN_PASSWORD: Atur kredensial untuk akun admin pertama yang akan dibuat secara otomatis.

3. Menjalankan Aplikasi
Migrasi Database
Perintah ini akan membuat file database SQLite dan tabel-tabel yang diperlukan berdasarkan model Sequelize.

npm run db:migrate

Menjalankan dalam Mode Development
Gunakan nodemon untuk auto-reload saat ada perubahan kode.

npm run dev

Aplikasi akan berjalan di http://localhost:3000.

Menjalankan dalam Mode Produksi dengan PM2
PM2 adalah manajer proses yang akan menjaga aplikasi tetap berjalan di background dan me-restartnya jika terjadi crash.

Install PM2 secara global:

npm install pm2 -g

Start aplikasi menggunakan file konfigurasi:

pm2 start ecosystem.config.js --env production

Simpan daftar proses PM2 agar otomatis berjalan saat server reboot:

pm2 save

Buat startup script untuk sistem operasi Anda (misal: Linux/Debian/Ubuntu):

pm2 startup

PM2 akan memberikan perintah yang perlu Anda jalankan (biasanya dengan sudo).

Memantau Log:

pm2 logs whatsapp-gateway

4. Struktur Proyek
/config: Konfigurasi database, logger, dan passport.

/models: Definisi model data Sequelize.

/routes: Pengaturan rute untuk API, auth, dan dashboard.

/middleware: Middleware untuk autentikasi dan otorisasi.

/services: Logika bisnis inti, termasuk koneksi Baileys dan webhook.

/views: File template EJS untuk frontend.

/public: Aset statis (CSS, JS, gambar).

/whatsapp-sessions: Folder tempat Baileys menyimpan file sesi otentikasi (jangan dihapus!).

server.js: File utama aplikasi.

ecosystem.config.js: Konfigurasi untuk PM2.

5. Tips untuk Deployment di VPS (Debian/Ubuntu/Armbian)
Pastikan build-essential, python, dan git terinstall.

Jika menggunakan Nginx sebagai reverse proxy, konfigurasikan untuk meneruskan request ke localhost:3000 dan atur header yang diperlukan untuk WebSocket jika Anda mengembangkannya nanti.

Pastikan firewall (misal: ufw) mengizinkan trafik pada port 80 (HTTP) dan 443 (HTTPS).

Gunakan Certbot untuk mendapatkan sertifikat SSL/TLS gratis dari Let's Encrypt agar koneksi aman.
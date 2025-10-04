WA Gateway - Versi 3.0Selamat datang di WA Gateway, sebuah backend Node.js yang kuat dan fleksibel untuk mengelola beberapa akun WhatsApp. Dibangun di atas library Baileys, aplikasi ini mengubah perangkat Anda menjadi gateway WhatsApp multi-sesi yang siap diintegrasikan dengan platform otomasi seperti n8n atau sistem Anda sendiri.Versi 3.0 membawa pembaruan besar pada sisi user experience dan fleksibilitas, dengan dashboard real-time, log pesan, dan konfigurasi per sesi.✨ Fitur Utama (v3.0)Manajemen Multi-Akun: Kelola beberapa akun WhatsApp secara bersamaan dari satu dashboard.Dashboard Real-time:Status Koneksi Live: Lihat status (connecting, connected, qr-code, disconnected) berubah secara instan tanpa perlu me-refresh halaman, berkat integrasi WebSockets (Socket.IO).QR Code Instan: QR code untuk login muncul secara otomatis saat dibutuhkan.Log Pesan Interaktif:Lihat riwayat pesan masuk dan keluar langsung di dashboard.Pesan baru muncul secara real-time.Filter per Akun: Saring log pesan untuk melihat percakapan dari sesi tertentu.Konfigurasi per Sesi:Webhook & API Key Unik: Atur tujuan Webhook dan API Key yang berbeda untuk setiap akun WhatsApp melalui menu "Settings" di dashboard.Integrasi & API:REST API Fleksibel: Kirim pesan teks, media via URL (/api/send), atau unggah file biner (/api/send-media).Proteksi API Key: Amankan endpoint API Anda dengan API Key yang bisa diatur per sesi.Webhook Otomatis: Kirim data pesan masuk (termasuk URL media) ke sistem eksternal (seperti n8n) secara otomatis.Keamanan:Login via Google OAuth: Autentikasi yang aman dan mudah.Whitelist Admin: Batasi akses login hanya untuk email yang terdaftar di file .env.Proteksi CSRF & Helmet: Keamanan standar untuk aplikasi web.Stabilitas:Restore Sesi Otomatis: Sesi yang aktif akan secara otomatis mencoba menyambung ulang saat server di-restart.Penanganan Konkurensi Database: Menggunakan mode WAL pada SQLite dan write queue untuk menangani banyak pesan masuk secara bersamaan tanpa crash.🛠️ Tumpukan TeknologiBackend: Node.js, Express.jsIntegrasi WhatsApp: @whiskeysockets/baileysDatabase: SQLite dengan Sequelize ORMReal-time Engine: Socket.IOAutentikasi: Passport.js (Google OAuth 2.0)Tampilan: EJS (Embedded JavaScript templates) dengan Tailwind CSS🚀 Instalasi & SetupIkuti langkah-langkah berikut untuk menjalankan aplikasi ini di server Anda (direkomendasikan Debian/Ubuntu/Armbian).1. PrasyaratNode.js (v18 atau lebih tinggi)npm (v10 atau lebih tinggi)Git2. Kloning Repositorigit clone [https://github.com/thehanifz/wa-gateway.git](https://github.com/thehanifz/wa-gateway.git)
cd wa-gateway
3. Instal Dependensinpm install
4. Konfigurasi EnvironmentSalin file .env.example menjadi .env dan isi semua nilainya.cp .env.example .env
nano .env
Penjelasan Variabel .env:| Variabel | Deskripsi | Contoh || :--- | :--- | :--- || PORT | Port yang akan digunakan oleh server. | 3000 || SESSION_SECRET | Kunci rahasia untuk enkripsi sesi. Ganti dengan string acak yang panjang. | rahasia-sekali-jangan-disebar || DB_STORAGE | Nama file database SQLite. | whatsapp_gateway.sqlite || GOOGLE_CLIENT_ID| Client ID dari Google Cloud Console. | 12345...apps.googleusercontent.com || GOOGLE_CLIENT_SECRET | Client Secret dari Google Cloud Console. | GOCSPX-... || ADMIN_EMAILS | Daftar email yang diizinkan login, pisahkan dengan koma. | user1@gmail.com,user2@gmail.com || BASE_URL | PENTING! URL publik lengkap aplikasi Anda. Harus sama persis dengan Authorized redirect URI di Google Cloud. | https://wa.domain-anda.com |⚙️ Cara PakaiMenjalankan AplikasiMode Pengembangan (Development):Gunakan nodemon untuk menjalankan server, yang akan otomatis restart saat ada perubahan kode.npm run dev
Mode Produksi (Production) dengan PM2:Gunakan PM2 untuk menjalankan aplikasi di latar belakang secara permanen dan memonitornya.# Instal PM2 secara global jika belum ada
npm install pm2 -g

# Jalankan aplikasi dengan nama "wa-gateway"
pm2 start server.js --name "wa-gateway"

# (Opsional) Perintah PM2 lainnya:
pm2 list        # Lihat semua proses yang berjalan
pm2 logs wa-gateway # Lihat log real-time
pm2 restart wa-gateway # Restart aplikasi
pm2 stop wa-gateway  # Hentikan aplikasi
Tutorial Penggunaan DashboardLogin: Buka https://wa.domain-anda.com di browser. Anda akan diarahkan ke halaman login. Klik "Sign in with Google" dan login menggunakan email yang sudah Anda daftarkan di ADMIN_EMAILS.Menambah Akun:Di dashboard, masukkan nama deskriptif untuk sesi baru Anda (misal: "Nomor Kantor").Klik "Add Account".Menghubungkan Akun:Akun baru akan muncul dengan status "disconnected".Klik tombol "Connect". Status akan berubah menjadi "connecting", lalu "qr-code".Scan QR code yang muncul menggunakan aplikasi WhatsApp di ponsel Anda (Link a device).Setelah berhasil, status akan berubah menjadi "connected".Mengatur Webhook & API Key (Fitur v3.0):Klik tombol "Settings" pada akun yang sudah ada.Sebuah pop-up akan muncul.Webhook URL: Masukkan URL tujuan (misal: dari n8n) ke mana data pesan masuk akan dikirim untuk sesi ini.API Key: Masukkan kunci rahasia yang akan digunakan oleh sistem eksternal untuk mengirim pesan melalui sesi ini.Klik "Save Settings".Tutorial Integrasi n8nMenerima Pesan di n8nBuat workflow baru di n8n.Gunakan node Webhook.Salin URL Webhook (mode Production) dari n8n.Di dashboard WA Gateway Anda, klik "Settings" pada akun yang relevan, dan tempelkan URL tersebut ke kolom "Webhook URL", lalu simpan.Aktifkan workflow n8n Anda.Setiap kali ada pesan masuk ke nomor WhatsApp tersebut, datanya akan muncul di n8n dengan struktur seperti ini:{
  "event": "message.incoming",
  "data": {
    "id": 1,
    "messageId": "ABCDEFG12345",
    "direction": "incoming",
    "from": "628xxxxxxxxxx@s.whatsapp.net",
    "to": "628yyyyyyyyyy@s.whatsapp.net",
    "content": "Ini adalah isi pesan",
    "type": "conversation",
    "mediaUrl": null,
    "accountId": 1
  }
}
Mengirim Pesan dari n8nGunakan node HTTP Request di n8n.Konfigurasi Dasar:Authentication: Header AuthName: x-api-keyValue: Masukkan API Key yang Anda atur di "Settings" dashboard untuk akun tersebut.1. Mengirim Teks atau Media via URL (/api/send)Method: POSTURL: https://wa.domain-anda.com/api/sendBody Content Type: JSONBody (Contoh Teks):{
  "accountId": 1,
  "to": "{{ $('Webhook').item.json.body.data.from }}",
  "text": "Ini adalah balasan otomatis."
}
Body (Contoh Gambar dari URL):{
  "accountId": 1,
  "to": "628xxxxxxxxxx@s.whatsapp.net",
  "text": "Ini gambar untuk Anda.",
  "media": {
    "type": "image",
    "url": "[https://domain.com/gambar.jpg](https://domain.com/gambar.jpg)"
  }
}
2. Mengirim File Biner (/api/send-media)Method: POSTURL: https://wa.domain-anda.com/api/send-mediaBody Content Type: Form-Data MultipartFields:accountId: 1to: 628xxxxxxxxxx@s.whatsapp.nettext: Ini caption untuk file Anda.mediaFile: Hubungkan data biner dari node sebelumnya (misal: dari node "Read Binary File"). Pastikan "Binary Property Name" diatur ke data.Selamat menggunakan WA Gateway v3.0!

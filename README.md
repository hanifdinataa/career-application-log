# Riwayat Cari Kerja - Personal Job Application Tracker

**Riwayat Cari Kerja** adalah aplikasi web personal modern, bersih, dan profesional untuk mencatat, mengelola, serta memantau seluruh riwayat lamaran pekerjaan tanpa ketergantungan backend server.

Aplikasi ini dibangun menggunakan teknologi **HTML5, CSS3 murni, dan Vanilla JavaScript**, serta memanfaatkan browser **LocalStorage** dengan key `jobTrackerDB` untuk memastikan data tersimpan permanen dan dapat dijalankan langsung di **GitHub Pages**.

---

## 🌟 Fitur Utama

1. **Dashboard Statistik Dinamis**
   - 6 Kartu ringkasan angka: *Total Lamaran*, *Menunggu Respons*, *Interview*, *Offering*, *Diterima*, dan *Ditolak*.
   - **Grafik Distribusi Status (Doughnut Chart)**: Visualisasi proporsi 8 status seleksi lamaran kerja.
   - **Grafik Tren Bulanan (Bar Chart)**: Memantau keaktifan mengirimkan lamaran dalam rentang 6 bulan terakhir.
   - **Riwayat Lamaran Terbaru**: Ringkasan 5 lamaran terakhir dengan akses cepat ke data lengkap.

2. **Pengelolaan Data Lamaran (CRUD Lengkap)**
   - **Tambah Lamaran**: Form modal yang mudah digunakan dengan 8 atribut data.
   - **Edit Lamaran**: Memperbarui status, tahapan wawancara, catatan, atau rincian tawaran tanpa membuat data ganda.
   - **Hapus Lamaran**: Dilengkapi dialog konfirmasi keamanan agar data tidak terhapus tanpa sengaja.
   - **Lihat Catatan/Detail**: Modal pratinjau yang menampilkan detail kontak recruiter, link lowongan, dan riwayat catatan.

3. **Pencarian, Filter, & Pengurutan Cepat**
   - Pencarian *live* berdasarkan nama perusahaan atau posisi pekerjaan.
   - Filter berdasarkan 8 status seleksi (*Sudah Melamar, Dalam Review, Interview, Tes Seleksi, Offering, Diterima, Ditolak, Mengundurkan Diri*).
   - Filter berdasarkan sistem kerja (*Remote / WFH, Hybrid, WFO*).
   - Pengurutan tanggal melamar (terbaru atau terlama).
   - Tombol satu klik **Reset Filter**.

4. **Sistem Penyimpanan LocalStorage Terisolasi**
   - Menggunakan format schema `jobTrackerDB` dengan ID unik.
   - Toleran terhadap data kosong atau format lama tanpa menimbulkan error.
   - Data otomatis tersimpan saat input, edit, hapus, maupun restore.

5. **Backup & Restore Data (Settings)**
   - **Export JSON**: Unduh seluruh database riwayat lamaran ke file `.json`.
   - **Import JSON**: Pulihkan kembali data lamaran kapan pun pengguna berganti perangkat atau membersihkan cache browser.
   - **Export CSV**: Ekspor seluruh riwayat ke file format `.csv` dengan UTF-8 BOM untuk dibuka di Microsoft Excel atau Google Sheets.
   - **Contoh Data Demo (Beta)**: Ditandai sebagai fitur dalam pengembangan (non-aktif).
   - **Kosongkan Seluruh Data**: Opsi reset database dengan proteksi konfirmasi ganda.

6. **Desain Bersih, Minimalis, & Responsif**
   - Mengusung tema SaaS minimalis dengan dukungan **Mode Gelap (Dark Mode)** dan **Mode Terang (Light Mode)**.
   - Tipografi yang sangat nyaman dibaca dengan sistem badge warna yang konsisten.
   - Navigasi menu sidebar yang rapi untuk desktop dan mode *hamburger drawer* untuk smartphone dan tablet.

---

## 📂 Struktur Direktori Proyek

```
RiwayatLamar/
│
├── index.html                  # Struktur halaman tunggal aplikasi
│
├── assets/
│   ├── css/
│   │   └── style.css           # Styling native CSS3, variabel tema, & responsive media queries
│   │
│   ├── js/
│   │   ├── storage.js          # Pengelolaan LocalStorage 'jobTrackerDB', import/export JSON & CSV
│   │   ├── dashboard.js        # Kalkulasi statistik, integrasi Chart.js & recent activities
│   │   ├── applications.js     # Manajemen tabel, pencarian, filter, modal CRUD & preview detail
│   │   └── app.js              # Inisialisasi aplikasi, navigasi view, mobile sidebar, & toast notifikasi
│   │
│   └── images/                 # Aset gambar atau logo aplikasi
│
└── README.md                   # Dokumentasi lengkap proyek
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini **tidak memerlukan Node.js, PHP, database server, ataupun build step**.

### 1. Menjalankan Langsung di Browser Lokal
Cukup klik dua kali file `index.html` atau buka file tersebut menggunakan browser pilihan Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### 2. Menggunakan Live Server (VS Code)
1. Buka folder proyek di Visual Studio Code.
2. Klik kanan file `index.html` dan pilih **Open with Live Server**.

---

## 🌐 Panduan Deployment ke GitHub Pages (Gratis)

Aplikasi dirancang 100% kompatibel dengan GitHub Pages menggunakan jalur file relatif:

1. Buat repository baru di GitHub (misalnya: `jobtrack` atau `riwayat-lamar`).
2. Masukkan seluruh file ke dalam repositori:
   ```bash
   git init
   git add .
   git commit -m "Initial commit JobTrack app"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
3. Buka repositori di GitHub, lalu masuk ke tab **Settings** > **Pages**.
4. Pada bagian **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** / folder: `/(root)`
5. Klik **Save**.
6. Dalam 1-2 menit, aplikasi JobTrack akan aktif di URL:
   `https://<username>.github.io/<repo-name>/`

---

## 🛡️ Struktur Skema Data LocalStorage

Aplikasi menggunakan key `jobTrackerDB` pada browser LocalStorage dengan struktur:

```json
{
  "applications": [
    {
      "id": "app_1730876400000_a1b2c",
      "companyName": "PT Telkom Indonesia",
      "position": "Frontend Engineer",
      "location": "Jakarta Selatan",
      "workMode": "Hybrid",
      "applicationDate": "2026-11-06",
      "jobSource": "LinkedIn - https://...",
      "status": "Interview",
      "notes": "Interview teknikal user via Google Meet",
      "createdAt": "2026-11-06T08:00:00.000Z",
      "updatedAt": "2026-11-06T08:00:00.000Z"
    }
  ]
}
```

---

## 🎨 Palet Warna Status Lamaran

| Status | Warna Aksen | Latar Belakang Badge |
|---|---|---|
| **Sudah Melamar** | Slate Gray (`#64748B`) | `#F1F5F9` |
| **Dalam Review** | Royal Blue (`#2563EB`) | `#EFF6FF` |
| **Interview** | Amber / Kuning (`#D97706`) | `#FFFBEB` |
| **Tes Seleksi** | Ungu (`#7C3AED`) | `#F5F3FF` |
| **Offering** | Cyan / Toska (`#0891B2`) | `#ECFEFF` |
| **Diterima** | Hijau Emerald (`#16A34A`) | `#F0FDF4` |
| **Ditolak** | Merah Crimson (`#DC2626`) | `#FEF2F2` |
| **Mengundurkan Diri** | Dark Slate (`#475569`) | `#F8FAFC` |

---

## 📄 Lisensi & Pembuat
Dibuat oleh **Hanif Dinata, A.Md.T.**
Hak Cipta (c) 2026 Riwayat Cari Kerja. Terbuka untuk penggunaan personal maupun pengembangan portofolio profesional.

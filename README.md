# Sistem Monitoring Daya Serap Anggaran 📊

Aplikasi berbasis web untuk memantau, mencatat, dan melaporkan tingkat penyerapan anggaran (Daya Serap) institusi secara sistematis. Sistem ini dirancang untuk memudahkan bagian keuangan dalam melacak alokasi, penerimaan, dan pengeluaran per bulan secara real-time.

Dibangun khusus untuk pengelolaan anggaran institusi (khususnya STIKES), aplikasi ini menyediakan ringkasan komprehensif, input data terstruktur per bulan, dan fitur *export* laporan ke Excel dengan rumus otomatis terintegrasi.

## 🚀 Fitur Utama

- **Dashboard Interaktif**: Menampilkan ringkasan total alokasi, penerimaan, pengeluaran, persentase daya serap (1 Tahun Penuh), sisa anggaran, dan patokan batas serapan.
- **Manajemen Tahun Anggaran**: Kelola tahun anggaran secara dinamis (jangka panjang) tanpa batas *hardcode*.
- **Kategori & Pos Anggaran**: Pengelompokan jenis pengeluaran (Belanja Personel, Belanja Barang, dll) dengan struktur penomoran romawi yang otomatis.
- **Input Realisasi Bulanan**: Antarmuka mirip *spreadsheet* untuk mengisi penerimaan yayasan dan rincian jenis pengeluaran (Pers, Barang, Har, Jaldis, Umum) setiap bulan secara berurutan.
- **Laporan & Export Excel Pintar**: Mencetak laporan *Daya Serap* ke dalam format Excel yang rapi, lengkap dengan tanda tangan pengesahan (Ketua, Waket II, Ka Biro), dan **sudah tertanam rumus Excel otomatis** (Penjumlahan, Persentase, Sisa Anggaran, dll) untuk kemudahan manipulasi pasca-unduh.
- **Data Tersinkronisasi**: Sistem kalkulasi kumulatif pintar yang otomatis mengakumulasi penerimaan dan pengeluaran bulan sebelumnya.

## 🛠️ Stack Teknologi

Aplikasi ini dikembangkan menggunakan *modern web stack*:

- **Backend**: [Laravel 12](https://laravel.com/) (PHP)
- **Frontend**: [React 18](https://react.dev/) dengan [Inertia.js](https://inertiajs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: MySQL / MariaDB
- **Excel Export**: [Laravel Excel / PhpSpreadsheet](https://laravel-excel.com/)

## ⚙️ Prasyarat Instalasi

Sebelum menginstal, pastikan Anda telah memasang:
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL Server

## 🏃 Cara Instalasi & Menjalankan Secara Lokal

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/nandomardi23/daya_serap_stikes.git
   cd daya_serap_stikes
   ```

2. **Install dependensi PHP & Node.js:**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment:**
   Duplikat file `.env.example` menjadi `.env` lalu sesuaikan konfigurasi database Anda.
   ```bash
   cp .env.example .env
   ```
   Generate *application key*:
   ```bash
   php artisan key:generate
   ```

4. **Jalankan Migrasi Database & Seeder:**
   (Pastikan database yang tertera di `.env` sudah dibuat).
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Jalankan Aplikasi:**
   Buka dua terminal terpisah.
   
   Terminal 1 (Jalankan server Laravel):
   ```bash
   php artisan serve
   ```
   
   Terminal 2 (Jalankan Vite untuk kompilasi asset React):
   ```bash
   npm run dev
   ```

6. **Akses Aplikasi:**
   Buka browser Anda dan tuju: `http://localhost:8000`

## 📂 Struktur Menu Utama

- **Dashboard**: Tampilan utama yang merangkum keseluruhan data tahun anggaran aktif.
- **Data Master**:
  - **Tahun Anggaran**: Tambah/edit masa berlaku anggaran.
  - **Kategori Anggaran**: Manajemen jenis kategori (misal: I. Belanja Personel).
  - **Item Anggaran**: Rincian sub-anggaran dari tiap kategori beserta plafon/alokasi nominalnya.
  - **Penandatangan**: Pengaturan nama & NIK pejabat untuk pengesahan laporan.
- **Input Daya Serap**: Form bulanan (Januari-Desember) untuk memasukkan realisasi penerimaan dan pengeluaran.
- **Laporan**: Tabel rekap keseluruhan daya serap dengan tombol export per bulan atau rekap seluruh bulan (1 tahun).

## 👨‍💻 Kontributor

- **Fernando Mardi Nurzaman** - *Full Stack Developer*

---
*Aplikasi ini dikembangkan untuk memfasilitasi kelancaran dan transparansi pelaporan administrasi dan keuangan.*

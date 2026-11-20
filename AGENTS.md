# GAME DEVELOPMENT & INTEGRATION GUIDE

> **PERATURAN WAJIB BAGI AGENT (ANTIGRAVITY / AI ASSISTANT):**
> Dokumen ini adalah panduan standar mutlak yang **WAJIB dibaca, dipahami, dan dipatuhi** setiap kali ada perintah untuk membuat, memodifikasi, atau merancang game baru di repositori ini.

---

## 1. Arsitektur Game (Single-File Game)
Setiap game yang dibuat wajib menggunakan format **Pure HTML, CSS, dan JavaScript yang disatukan langsung di dalam 1 file `index.html`**.
- **Lokasi Folder:** `public/games/<nama-game-slug>/` (Contoh: `public/games/becak-drift/`).
- **File Utama:** `public/games/<nama-game-slug>/index.html`
  - Seluruh elemen `<style>` (CSS) dan `<script>` (JS) wajib ditulis secara internal di dalam file ini agar mudah dimuat, responsif, mandiri, dan portable.

---

## 2. Aset Pendukung Game (Aset Gambar Generatif `.webp`)
Setiap game harus memiliki visual yang menarik. Agent wajib menghasilkan aset menggunakan visual generator (apabila IDE mendukung) dengan aturan berikut:
- **Lokasi Penyimpanan:** Seluruh aset pendukung wajib disimpan di dalam folder game itu sendiri: `public/games/<nama-game-slug>/assets/`.
- **Format & Ukuran Wajib:**
  - Format aset wajib berupa **`.webp`** dengan ukuran maksimal **150 KB** per file.
  - Beri nama file yang deskriptif, contoh: `bg-sky.webp`, `player-becak.webp`, `obstacle-candi.webp`.
- **Placeholder Fallback:** Jika visual generator tidak aktif atau gagal membuat file `.webp`, agent **WAJIB** membuat ilustrasi minimalis berbasis **CSS inline / inline SVG / HTML5 Canvas** yang di-render secara dinamis di dalam kode HTML, lalu mencantumkannya pada laporan.

---

## 3. Gambar Preview Game (Placeholder Web Utama)
Setiap game wajib memiliki file gambar preview untuk ditampilkan pada katalog game di web utama:
- **Nama File & Format:** `preview.png` (atau `preview.webp`) dengan ukuran maksimal **200 KB**.
- **Lokasi Penyimpanan:** `public/games/<nama-game-slug>/preview.png`.
- **Dimensi Rekomendasi:** `600px x 400px` (Aspect Ratio 3:2 atau 4:3).
- **Konten Visual:** Merepresentasikan tema game, menyertakan elemen visual/karakter utama, serta judul game secara jelas.

---

## 4. Integrasi ke Katalog Web Utama (Wajib)
Setelah membuat folder `public/games/<nama-game-slug>/`, agent **WAJIB** mendaftarkan metadata game ke sumber data/registry game pada folder `src/` agar muncul otomatis di Beranda, Kategori, fitur Main Acak, dan rute `/play/<nama-game-slug>`:
- **Data Wajib:** `slug`, `title`, `category`, `shortDescription` (maksimal 2 kalimat), `thumbnail` (`/games/<nama-game-slug>/preview.png`), dan `gameUrl` (`/games/<nama-game-slug>/index.html`).
- **Tampilan Card:** Pastikan kartu katalog menampilkan gambar `preview.png` secara penuh (`object-fit: cover`), bukan kotak inisial huruf.

---

## 5. Batasan Performa & Teknis Ketat
- **Tanpa CDN Eksternal:** DILARANG mengimpor library game, CSS framework, atau font eksternal dari internet di dalam `index.html` game. Seluruh logika, styling, dan audio (Web Audio API) harus berjalan mandiri secara lokal.
- **Tanpa Emoji:** Seluruh teks instruksi, skor, tombol, dan judul di dalam game maupun katalog web wajib menggunakan teks bersih atau ikon SVG, tanpa karakter emoji.

---

## 6. Pencatatan Histori Game di `game-log.md`
Setiap kali game selesai dibuat, diperbarui, atau dihapus, agent **WAJIB** memperbarui file `game-log.md` di root directory dengan menambahkan entri terbaru di bagian **paling atas**:

```markdown
### YYYY-MM-DD - <NAMA GAME>
- **Folder Game:** `public/games/<nama-game-slug>`
- **Deskripsi:** <Penjelasan 1-2 dan game gameplay, kalimat mekanik, singkat tentang tujuan>
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage)
  - [x] Visual Asset (.webp) & Preview Thumbnail (preview.png)
- **Status Akhir:** READY / TESTING / WIP
- **Dibuat oleh:** AI Agent
```

---

## 7. Aturan Pengujian Browser (Isolasi Instance Chrome Baru)
Saat melakukan pengujian browser atau automated testing menggunakan Chrome / DevTools:
- **Instance Terisolasi:** Agent **WAJIB** membuka atau menggunakan instance Google Chrome **BARU** yang terisolasi (misalnya dengan flag `--remote-debugging-port=9222 --user-data-dir=...` pada direktori profil sementara) atau mode headless.
- **Dilarang Mengganggu Browser Pengguna:** **DILARANG KERAS** mengontrol, membuka tab baru, me-reload, atau menutup jendela browser Chrome utama yang sedang aktif digunakan oleh pengguna agar aktivitas kerja pengguna tidak terganggu sama sekali.

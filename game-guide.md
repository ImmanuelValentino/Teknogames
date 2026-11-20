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
- **Anti-Placeholder (No Fake Completion):** DILARANG meninggalkan komentar `// TODO`, fungsi kosong, atau aset rusak lalu menyatakan game selesai.

---

## 6. Pencatatan Histori Game di `game-log.md`
Setiap kali game selesai dibuat, diperbarui, atau dihapus, agent **WAJIB** memperbarui file `game-log.md` di root directory dengan menambahkan entri terbaru di bagian **paling atas**:

```markdown
### YYYY-MM-DD - <NAMA GAME>
- **Folder Game:** `public/games/<nama-game-slug>`
- **Deskripsi:** <Penjelasan 1-2 dan game kalimat mekanik singkat tentang tujuan>
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage)
  - [x] Visual Asset (.webp) & Preview Thumbnail (preview.png)
- **Status Akhir:** READY / TESTING / WIP
- **Dibuat oleh:** AI Agent

---

## 7. Sistem Quality Checklist (Mandatory Self-Audit Gate)
Agent **DILARANG** menyatakan pembuatan atau pembaruan game selesai sebelum memverifikasi dan mencentang seluruh poin kualitas di bawah ini:

### A. Teknis & Fungsionalitas Inti
- [ ] **Single-File Standalone:** Tidak ada ketergantungan pada file `.css` atau `.js` eksternal di luar `index.html` (kecuali referensi aset lokal di folder `assets/`).
- [ ] **Zero Console Error:** Game berjalan mulus tanpa error JavaScript (`Uncaught TypeError`, `ReferenceError`, atau `404 Not Found` pada aset).
- [ ] **Game Loop & State Management:** Siklus permainan lengkap dan jelas (*Start Screen* → *Active Gameplay* → *Pause / Game Over* → *Restart*), di mana tombol *Play Again* mereset skor, nyawa, dan posisi objek dengan bersih tanpa perlu reload halaman.
- [ ] **Penyimpanan Skor (`localStorage`):** Skor tertinggi (*High Score*) tersimpan otomatis menggunakan `localStorage` dengan *key* unik per game (contoh: `teknogames_<slug>_highscore`).

### B. Kontrol, Responsivitas & UI/UX
- [ ] **Dual-Input Support:** Mendukung kontrol **Desktop** (Keyboard/Mouse) sekaligus kontrol **Mobile** (Touch/Tap/Swipe atau tombol virtual di layar).
- [ ] **Viewport & Scaling:** Layout menyesuaikan layar tanpa *horizontal scroll* atau elemen yang terpotong pada resolusi HP (`360×800`) maupun Desktop (`1920×1080`).
- [ ] **Feedback Visual & Audio:** Memiliki respons visual saat aksi terjadi (animasi hit, efek skor bertambah, atau transisi) serta tombol *Mute/Unmute* jika menggunakan Web Audio API / efek suara.

### C. Aset, Preview & Integrasi Web Utama
- [ ] **Validasi Aset `.webp`:** Semua file gambar di `public/games/<nama-game-slug>/assets/` berformat `.webp`, termuat sempurna, dan tidak ada *broken image* (atau sudah menggunakan SVG/Canvas inline jika fallback aktif).
- [ ] **Validasi Thumbnail Preview:** File `public/games/<nama-game-slug>/preview.png` (atau `.webp`) sudah tersedia, tidak korup, dan sesuai rasio katalog web utama.
- [ ] **Akses Rute Lokal:** File dapat dibuka langsung melalui URL lokal (`http://localhost:3000/games/<nama-game-slug>/index.html`).

### D. Dokumentasi & Git Workflow
- [ ] **Update `game-log.md`:** Entri game baru/perubahan sudah ditambahkan di bagian paling atas `game-log.md`.
- [ ] **Sinkronisasi `AGENTS.md`:** Jika perubahan juga menyentuh konfigurasi/katalog frontend atau backend web utama, `UPDATE.md` dan `laporan.md` ikut diperbarui serta lolos verifikasi `npm run build`.

---

## 8. Aturan Pengujian Browser (Isolasi Instance Chrome Baru)
Saat melakukan pengujian browser atau automated testing menggunakan Chrome / DevTools:
- **Instance Terisolasi:** Agent **WAJIB** membuka atau menggunakan instance Google Chrome **BARU** yang terisolasi (misalnya dengan profil sementara `--user-data-dir=...` dan port terpisah) atau mode headless.
- **Dilarang Mengganggu Browser Pengguna:** **DILARANG KERAS** mengontrol, membuka tab baru, me-reload, atau menutup jendela browser Chrome utama yang sedang aktif digunakan oleh pengguna agar aktivitas kerja pengguna tidak terganggu sama sekali.

---

## 9. Larangan Khusus & Konten Terlarang (Blacklist Game)
- **Larangan Game Bertema Batik / Konsep Serupa (MUTLAK):** DILARANG KERAS membuat, memodifikasi, merancang, menyarankan, atau memulihkan kembali game dengan nama mengandung "batik" (contoh: `batik-flow`, `batik-canting`, dll.) maupun konsep serupa (puzzle sambung alur lilin malam/canting batik atau mekanisme serupa bertema batik). Game ini telah dihapus permanen atas instruksi mutlak pengguna dan tidak boleh dibuat kembali dalam bentuk apa pun.

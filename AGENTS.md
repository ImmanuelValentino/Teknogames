# AGENT WORKFLOW & COMMIT POLICY

Setiap kali agent / asisten melakukan perubahan pada project ini, **WAJIB mengikuti workflow berikut**:

1. **Catat Perubahan di UPDATE.md (SemVer):**
   - Setiap pembaruan (baik dari **Backend maupun Frontend**) wajib dicatat di `UPDATE.md` dan `game/UPDATE.md` dengan standar Semantic Versioning (`MAJOR.MINOR.PATCH`).

2. **Wajib Melakukan Git Commit (Mandatory Git Commit):**
   - Setiap selesai mengimplementasikan fitur, merapikan desain, atau memperbaiki issue, jalankan perintah git commit:
     ```bash
     cd game
     git add .
     git commit -m "<tipe>: <deskripsi singkat perubahan>"
     ```
   - Contoh konvensi commit:
     - `feat: implementasi tema cyber blue dan logo teknogame`
     - `fix: update tab favicon cache buster teknogame-icon`
     - `docs: update PRD dan Design.md v2.1.0`

3. **Verifikasi Build:**
   - Jalankan `npm run build` (`next build --webpack`) untuk memastikan tidak ada error kompilasi atau TypeScript mismatch sebelum turn berakhir.

4. **Wajib Mencatat Laporan Detail di `laporan.md` (Backend & Frontend):**
   - Setiap kali ada update atau perubahan pada **Backend maupun Frontend**, agent wajib menambahkan catatan baru di bagian paling atas `laporan.md` dengan format berikut:
     ```markdown
     ### [YYYY-MM-DD HH:MM] - [Backend / Frontend / Fullstack] - <Judul Perubahan Singkat>
     - **Kondisi Sebelum:** <Penjelasan diubah kondisi/kode/tampilan sebelum>
     - **Perubahan Sesudah:** <Penjelasan apa atau detail ditambahkan diubah yang>
     - **Masalah yang Ditemukan:** <Bug, error, atau kendala selama pengerjaan; tulis "Tidak ada" jika lancar>
     - **Penyelesaian:** <Langkah atau diterapkan masalah mengatasi solusi teknis tersebut untuk yang>
     - **File Terdampak:** `<daftar file yang diubah>`
     ```

5. **Aturan Khusus Pembuatan Game (`game-guide.md`):**
   - Jika ada perintah untuk membuat, merancang, atau menambahkan game baru, agent **WAJIB membaca dan mematuhi `game-guide.md`** terlebih dahulu sebelum menulis kode apa pun.
   - *(Catatan: Jika file `game-guide.md` masih kosong atau belum tersedia, konfirmasi kepada user terlebih dahulu sebelum melanjutkan).*

6. **Kebijakan Tanpa Emoji & Komunikasi Singkat (Zero-Emoji Policy):**
   - **Website & UI Game:** DILARANG menggunakan emoji pada teks tampilan website, katalog, tombol, judul, maupun di dalam game. Gunakan ikon SVG (seperti Lucide Icons) untuk kebutuhan visual.
   - **Balasan Chat:** Gunakan bahasa Indonesia yang lugas, teknis, ringkas (maksimal 3-5 poin), dan tanpa emoji. Hindari paragraf basa-basi; langsung sampaikan ringkasan perubahan, file terdampak, dan status build.

7. **Proteksi Slot Iklan & Konfigurasi Inti:**
   - DILARANG menghapus, memindahkan, atau mengubah struktur komponen slot iklan (AdSense), file `ads.txt`, maupun konfigurasi `.env` tanpa izin eksplisit dari user.

---

## 8. Aturan Pengujian Browser (Isolasi Instance Chrome Baru)
Saat melakukan pengujian browser atau automated testing menggunakan Chrome / DevTools:
- **Instance Terisolasi:** Agent **WAJIB** membuka atau menggunakan instance Google Chrome **BARU** yang terisolasi (misalnya dengan flag `--remote-debugging-port=9222 --user-data-dir=...` pada direktori profil sementara) atau mode headless.
- **Dilarang Mengganggu Browser Pengguna:** **DILARANG KERAS** mengontrol, membuka tab baru, me-reload, atau menutup jendela browser Chrome utama yang sedang aktif digunakan oleh pengguna agar aktivitas kerja pengguna tidak terganggu sama sekali.

---

## 9. Larangan Khusus & Konten Terlarang (Blacklist Game)
- **Larangan Game Bertema Batik / Konsep Serupa (MUTLAK):** DILARANG KERAS membuat, memodifikasi, merancang, menyarankan, atau memulihkan kembali game dengan nama mengandung "batik" (contoh: `batik-flow`, `batik-canting`, dll.) maupun konsep serupa (puzzle sambung alur lilin malam/canting batik atau mekanisme serupa bertema batik). Game ini telah dihapus permanen atas instruksi mutlak pengguna dan tidak boleh dibuat kembali dalam bentuk apa pun.



## 10. Penulisan Code dan Pembalasan Chat
untuk membalas pesan gunakan skill ponytail.

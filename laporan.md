### [2026-11-20 18:45] - [Games] - Integrasi Fitur Werewolf Online Multiplayer Supabase (Room 6 Digit) & Arsitektur Modular
- **Kondisi Sebelum:** Game Werewolf hanya dapat dimainkan secara offline di 1 HP (*Pass-and-Play*) dengan kode monolitik di dalam satu file `index.html`. Belum ada mode online mabar antar-perangkat, belum ada koneksi ke Supabase Realtime, dan belum ada skema database room temporary.
- **Perubahan Sesudah:**
  1. Menambahkan **Mode Online Multiplayer** berbasis Supabase Realtime:
     - Sistem Lobi dengan **Room Kode 6 Digit Temporary** (`werewolf_rooms`).
     - Alur Host: Input nama, generate kode 6 digit acak & unik, lobi sinkronisasi daftar pemain (5-15 pemain), badge Host, pengaturan peran seimbang otomatis (*Auto-Balance*) atau kustom, dan tombol Mulai Permainan.
     - Alur Pemain: Bergabung dengan memasukkan 6 digit kode room dan nama pemain.
     - Pemilihan Kartu Realtime: Grid kartu tertutup tampil serentak di HP masing-masing pemain, sistem **Single Pick Lock** (1 kartu hanya bisa diambil 1 pemain untuk mencegah race condition), dan tombol **Pilih Acak (Random)**.
     - Siklus Malam Realtime: Tampilan malam serentak, layar tunggu bagi peran tidur, batasan target tunggal (*Single-Target Rule*) untuk Bodyguard (anti proteksi orang sama 2 malam berturut-turut), Werewolf (melihat rekan sesama serigala dan memilih 1 mangsa), dan Seer (terawang instan). Dummy delay otomatis jika role telah gugur.
     - Siklus Siang & Voting Realtime: Pengumuman fajar, trigger tembakan pembalasan Pemburu (Hunter), serta sistem voting rahasia 1 suara per pemain.
     - Pembersihan Otomatis (*Auto-Cleanup*): Room otomatis di-DELETE saat Game Over (`status: finished`) dan garbage collection room kedaluwarsa (> 2 jam) saat pembuatan room baru.
  2. Mempertahankan **Mode Offline Pass-and-Play 1 HP** secara penuh di menu utama.
  3. Memisahkan arsitektur game menjadi **Modular Multi-File**:
     - `index.html`: Entry point tampilan game.
     - `styles.css`: Tema visual Dark Gothic Bloody Color, responsif mobile (360x800) dan desktop.
     - `config.js`: Manajemen konfigurasi Supabase (URL & Anon Key) aman.
     - `svg-icons.js`: Koleksi ikon vektor SVG kustom (100% Zero-Emoji).
     - `audio.js`: Synthesizer Web Audio API murni.
     - `offline-engine.js`: Logika permainan offline Pass-and-Play.
     - `online-supabase.js`: Mesin Realtime multiplayer Supabase.
     - `app.js`: Koordinator navigasi layar, modal konfigurasi, dan UI controller.
  4. Menyediakan skema migrasi SQL `supabase-werewolf-schema.sql` (tabel `werewolf_rooms`, index performa, konfigurasi RLS anonim, dan publikasi Realtime).
  5. Memperbarui `.env.example` dan `.env.local` dengan variabel `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Masalah yang Ditemukan:** Tidak ada. Zero-emoji policy terjaga 100%.
- **File Terdampak:** `public/games/werewolf/*`, `supabase-werewolf-schema.sql`, `.env.example`, `.env.local`, `game-log.md`, `UPDATE.md`, `laporan.md`

### [2026-11-20 18:02] - [Frontend & Dokumentasi] - Preferensi Tema, Papan Skor, dan Kartu Hero (Merged from main)
- **Ringkasan:** Portal Tekno Game diperbarui dengan preferensi tema terang/gelap yang tersimpan dan sinkron antar-tab. Mode gelap menggunakan latar `#17181c`; tombol tema berupa ikon bulat di sisi tautan Teknotama.
- **Papan Skor:** Beranda menampilkan lima skor tertinggi. Peringkat pertama mendapat kartu utama di kiri, sementara peringkat 2–5 ditumpuk di kanan dengan skor, poin, tombol mainkan ulang, dan artwork game atau fallback SVG.
- **Kartu Hero:** Kartu pilihan kedua dapat diklik untuk naik ke lapisan atas. Hanya kartu teratas yang membuka game; kartu belakang harus dinaikkan terlebih dahulu. Efek hover kartu aktif konsisten, dan kartu kedua kini opak dengan gradasi ungu-violet.
- **Dokumentasi:** [Design.md](Design.md) ditulis ulang agar mencatat tampilan yang benar-benar diterapkan, dan riwayat pembaruan dicatat di [UPDATE.md](UPDATE.md).
- **Validasi:** ESLint dan `npx tsc --noEmit` berhasil untuk komponen hero.

### [2026-11-20 12:55] - [Games] - Penambahan Teks SEO Faktual Halaman Game & Peningkatan Rich Snippet
- **Kondisi Sebelum:** Halaman game (`/play/[slug]`) hanya memiliki deskripsi singkat 1–2 kalimat, skema metadata belum menyertakan rating bintang ulasan u/ SERP Google, dan belum ada FAQ serta spesifikasi teknis untuk mengoptimalkan kata kunci organik.
- **Perubahan Sesudah:**
  1. Menambahkan blok teks terstruktur yang sederhana, lugas, dan non-imajinatif di bawah layar permainan:
     - Fitur Utama Permainan (akses langsung tanpa unduhan, penyimpanan skor otomatis lokal, Web Audio API hemat kuota, dukungan lintas perangkat).
     - Tips Singkat Bermain (timing/ritme, layar penuh, kontrol audio).
     - Tabel Spesifikasi & Detail Teknis (kategori, pengembang, lisensi gratis, platform HTML5, kompatibilitas, ukuran unduh 0 MB).
     - Bagian FAQ (Pertanyaan yang Sering Diajukan) dengan format tanya-jawab faktual.
  2. Meningkatkan Technical SEO & Structured Data (JSON-LD):
     - Menambahkan skema `FAQPage` ke metadata agar pertanyaan & jawaban muncul di cuplikan kaya Google SERP.
     - Memperbarui skema `VideoGame` dengan `aggregateRating` (bintang ulasan) dan `offers: { price: 0 }`.
     - Memperbarui Open Graph & Twitter Card menggunakan thumbnail `preview.png` spesifik tiap game.
  3. Menjalankan `npm run build` dan memverifikasi tidak ada error hidrasi maupun error kompilasi.
- **Masalah yang Ditemukan:** Tidak ada. Teks tetap rapi, zero-emoji, dan responsif di mobile & desktop.
- **File Terdampak:** `src/app/play/[slug]/page.tsx`, `UPDATE.md`, `laporan.md`, `out/*`

### [2026-11-20 11:40] - [Games] - Remake Game Werewolf: Setup 5-15 Pemain, Pemilihan Kartu Interaktif, Siklus Malam & Siang Lengkap
- **Kondisi Sebelum:** Game `werewolf` sebelumnya belum memiliki sistem input dinamis 5-15 pemain, belum ada interaksi pemilihan kartu tertutup (card pick), peran Hunter belum terintegrasi, belum ada perlindungan Seer/Bodyguard dengan aturan anti-spam beruntun, serta transisi giliran belum menggunakan Privacy Screen ("Oper HP").
- **Perubahan Sesudah:**
  1. Merombak total `public/games/werewolf/index.html` menjadi single-file responsif modern berbasis panduan spesifik pengguna:
     - Input dinamis 5 hingga 15 pemain dengan penyimpanan nama di `localStorage` (`teknogames_werewolf_players`).
     - Komposisi peran seimbang otomatis (*Auto-Balance*) dan kustomisasi manual: Werewolf, Villager, Seer, Bodyguard, Hunter.
     - Interaksi pemilihan kartu (*Interactive Card Pick*) dengan animasi 3D flip card, pengungkapan peran rahasia, serta Privacy Screen transisi per giliran.
     - Siklus malam terurut: Bodyguard (proteksi malam dengan validasi anti orang yang sama 2 malam berturut-turut), Werewolf (daftar sesama rekan & target mangsa), Seer (terawang instan: Werewolf atau Warga).
     - Pengumuman fajar & skill tembakan pembalasan Hunter saat tereliminasi.
     - Timer diskusi siang interaktif + sesi voting eksekusi gantung desa.
     - Kondisi kemenangan terverifikasi otomatis (Warga menang jika Werewolf musnah, Werewolf menang jika Werewolf >= Non-Werewolf).
     - Web Audio API synthesizer kustom (lonceng, lolongan serigala, mata seer, tembakan pemburu, palu sidang).
     - Zero-emoji policy 100% menggunakan SVG inline kustom untuk seluruh peran, fajar/malam, dan tombol.
  2. Pengujian dilakukan via browser instance terisolasi Chrome DevTools port 9222 oleh subagent QA (0 console error, interaksi kartu, privacy screen, dan tab ditutup kembali dengan rapi).
  3. Dokumen `game-log.md`, `UPDATE.md`, dan `laporan.md` diperbarui.
- **Masalah yang Ditemukan:** Tidak ada. Seluruh alur berjalan stabil dan lancar.
- **File Terdampak:** `public/games/werewolf/index.html`, `game-log.md`, `UPDATE.md`, `laporan.md`, `out/*`

### [2026-11-20 11:30] - [Games] - Upgrade Jalur PCB Circuit Flow & Logika Bebas Bug (Pou Connect & Backtracking)
- **Kondisi Sebelum:** Garis jalur `circuit-flow` sebelumnya berupa pipa polos biasa, beberapa level sulit/tidak solvable (unsolvable), dan jalur tidak otomatis terpotong saat saling bertabrakan sehingga pemain mudah stuck.
- **Perubahan Sesudah:**
  1. Merombak visual jalur menjadi jejak tembaga PCB autentik (*PCB copper trace* berlapis dengan garis inti neon dan pulsa arus elektron animasi).
  2. Mengimplementasikan algoritma interaksi jalur bebas bug: *smooth backtracking*, pemotongan otomatis jalur tabrakan (*path overwrite resolution*), pencegahan menembus terminal warna lain, dan kalkulasi cakupan papan (*grid coverage*).
  3. Memvalidasi seluruh 9 level menggunakan solver algoritma backtracking sehingga 100% solvable tanpa kebuntuan.
  4. Pengujian langsung dilakukan pada Chrome DevTools remote debugging terisolasi (0 error).
  5. Menjalankan `npm run build` dan mencatat histori pada `game-log.md` serta `UPDATE.md`.
- **Masalah yang Ditemukan:** Tidak ada.
- **File Terdampak:** `public/games/circuit-flow/index.html`, `game-log.md`, `UPDATE.md`, `laporan.md`, `out/*`


### [2026-11-20 11:20] - [Games] - Remake Game Batch 4 (Lembah Bromo, Pasar Terapung, Kamus Kelana, Werewolf) & Pengujian Browser Terisolasi
- **Kondisi Sebelum:** 4 game Batch 4 (`lembah-bromo`, `pasar-terapung`, `kamus-kelana`, `werewolf`) masih menggunakan total lebih dari 70 karakter emoji, belum memiliki Web Audio API synthesizer dengan tombol audio toggle yang seragam, belum memiliki kunci `localStorage` terstandarisasi (`teknogames_<slug>_highscore`), dan belum mengirimkan event `postMessage` saat Game Over.
- **Perubahan Sesudah:**
  1. `lembah-bromo/index.html`: Di-remake dengan fisika slope momentum hang glider (Tiny Wings style), visual fajar kaldera Bromo, pengumpulan kristal embun belerang di udara, badai kabut pasir kawah pengejar dari belakang, Web Audio API synthesizer, High Score `localStorage`, dan `postMessage`.
  2. `pasar-terapung/index.html`: Di-remake dengan arcade river boat fruit catch di Sungai Martapura Banjarmasin, kemudi perahu jukung tradisional (panah kiri/kanan, A/D, touch paddle), buah lokal segar (Pisang, Durian, Rambutan, Belimbing), rintangan kayu hanyut & batu sungai tajam, 3 nyawa hati SVG zero-emoji, kombo multiplier bertingkat, Web Audio API synthesizer, High Score `localStorage`, dan `postMessage`.
  3. `kamus-kelana/index.html`: Di-remake dengan teka-teki kata kompas jelajah 5 destinasi nusantara (Bali, Bromo, Toba, Komodo, Raja Ampat), roda kompas huruf drag neon cyan interaktif, kotak TTS mulus, tombol acak & petunjuk bantuan, Web Audio API synthesizer tone nada bertingkat, High Score `localStorage`, dan `postMessage`.
  4. `werewolf/index.html`: Di-remake dengan game companion deduksi sosial dua mode (Mode Investigasi Solo AI Logic Detective dan Mode Pass & Play 4-6 pemain Pesta Desa dengan voting siang), Web Audio API synthesizer (lonceng tengah malam, lolongan srigala, ketukan palu sidang), High Score `localStorage`, dan `postMessage`.
  5. Pengujian langsung dilakukan via Chrome DevTools remote debugging dengan penutupan tab otomatis; seluruh game lulus verifikasi dengan 0 runtime error di console.
  6. Static export `npm run build` sukses 100% dan histori dicatat di `game-log.md` serta `UPDATE.md`.
- **Masalah yang Ditemukan:** Tidak ada. Seluruh poin checklist kualitas di Bagian 7 dan Bagian 8 `game-guide.md` telah terpenuhi dan terverifikasi.
- **File Terdampak:** `public/games/lembah-bromo/index.html`, `public/games/pasar-terapung/index.html`, `public/games/kamus-kelana/index.html`, `public/games/werewolf/index.html`, `out/*`, `game-log.md`, `UPDATE.md`, `laporan.md`

### [2026-11-20 11:10] - [Games] - Remake Game Batch 3 (Candi Stacker, Batik Flow, Layangan Sanur, Kopi Klotok) & Pengujian Browser Terisolasi
- **Kondisi Sebelum:** 4 game Batch 3 masih menggunakan karakter emoji, belum memiliki Web Audio API synthesizer dengan tombol audio mute, belum memiliki kunci `localStorage` terstandarisasi, dan belum mengirimkan event `postMessage` saat Game Over.
- **Perubahan Sesudah:**
  1. `candi-stacker/index.html`: Di-remake dengan fisika susun batu andesit bertingkat, pemotongan balok berlebih, bonus kombo tumpukan sempurna, sound synthesis, High Score `localStorage`, dan `postMessage`.
  2. `batik-flow/index.html`: Di-remake dengan 16 ubin jalur lilin malam canting ke mahkota batik (3 motif nusantara), validasi aliran BFS, sound synthesis, High Score `localStorage`, dan `postMessage`.
  3. `layangan-sanur/index.html`: Di-remake dengan adu layangan bebean Bali, kontrol tensi benang (tarik dive & ulur slack), pemotongan benang musuh, sound synthesis, High Score `localStorage`, dan `postMessage`.
  4. `kopi-klotok/index.html`: Di-remake dengan 3-lane rhythm game seduhan kopi klotok, feedback ketukan presisi (Perfect, Good, Miss), 3 nyawa, sound synthesis, High Score `localStorage`, dan `postMessage`.
  5. Pengujian langsung dilakukan via Chrome DevTools remote debugging dengan penutupan tab otomatis; seluruh game lulus verifikasi dengan 0 runtime error di console.
  6. Static export `npm run build` sukses 100% dan histori dicatat di `game-log.md` serta `UPDATE.md`.
- **Masalah yang Ditemukan:** Tidak ada. Seluruh poin checklist kualitas di Bagian 7 dan Bagian 8 `game-guide.md` telah terpenuhi dan terverifikasi.
- **File Terdampak:** `public/games/candi-stacker/index.html`, `public/games/batik-flow/index.html`, `public/games/layangan-sanur/index.html`, `public/games/kopi-klotok/index.html`, `out/*`, `game-log.md`, `UPDATE.md`, `laporan.md`

### [2026-11-20 10:55] - [Games] - Remake Game Batch 2 (Nusantara Runner, Kapal Feri, Packing Master, Becak Drift) & Quality Testing
- **Kondisi Sebelum:** 4 game Batch 2 (`nusantara-runner`, `kapal-feri`, `packing-master`, `becak-drift`) masih memuat banyak karakter emoji (melanggar zero-emoji policy), belum memiliki Web Audio API synthesizer dengan tombol mute, belum memiliki kunci `localStorage` konsisten (`teknogames_<slug>_highscore`), dan belum mengirimkan event `postMessage` saat Game Over.
- **Perubahan Sesudah:**
  1. `nusantara-runner/index.html`: Di-remake menggunakan Canvas 2D murni, 3 transisi biome visual dinamis, mekanik lompat & meluncur merunduk (keyboard & touch), koin tiket kapal, sound synthesis, High Score `localStorage`, dan `postMessage`.
  2. `kapal-feri/index.html`: Di-remake dengan navigasi selat top-down inersia air realistis, progress bar pelayaran Merak-Bakauheni, pelampung penyelamatan, sound synthesis klakson feri, High Score `localStorage`, dan `postMessage`.
  3. `packing-master/index.html`: Di-remake dengan 4 level petak grid koper (3x4 s.d 5x5), rotasi item 90°, 7 item traveling berbasis vektor SVG bersih zero-emoji, sound synthesis, High Score `localStorage`, dan `postMessage`.
  4. `becak-drift/index.html`: Di-remake dengan drifting aspal Malioboro, rintangan andong, pengganda drift multiplier (x2-x4), item teh poci, sound synthesis bel becak, High Score `localStorage`, dan `postMessage`.
  5. Seluruh game diuji secara otomatis melalui script quality testing: lolos verifikasi sintaks JS, zero-emoji, dual-input, dan HTTP status 200 OK di semua rute lokal.
  6. Static export `npm run build` sukses 100% dan histori dicatat di `game-log.md` serta `UPDATE.md`.
- **Masalah yang Ditemukan:** Tidak ada. Seluruh poin checklist kualitas di Bagian 7 `game-guide.md` telah terpenuhi dan diverifikasi.
- **File Terdampak:** `public/games/nusantara-runner/index.html`, `public/games/kapal-feri/index.html`, `public/games/packing-master/index.html`, `public/games/becak-drift/index.html`, `out/*`, `game-log.md`, `UPDATE.md`, `laporan.md`

### [2026-11-19 23:55] - [Frontend] - Perbaikan Broken Image Preview & Generasi Cover 600x400 Seluruh 15 Permainan
- **Kondisi Sebelum:** Gambar cover permainan di halaman utama `/games` tampak broken/rusak karena data `thumbnailUrl` di `games-data.ts` mengarah ke folder `/images/games/...webp` yang tidak ada fisiknya, 12 game belum memiliki file `preview.png`, dan kartu Hero bagian atas hanya menampilkan kotak inisial huruf teks murni ("NR").
- **Perubahan Sesudah:**
  1. Menghasilkan gambar `preview.png` (600x400px, aspect ratio 3:2, ukuran < 50 KB, clean modern SVG zero-emoji) untuk SELURUH 15 permainan via `scripts/generate-all-previews.js`.
  2. Mendistribusikan gambar ke folder `public/games/<slug>/preview.png`, `public/<slug>/preview.png`, `public/images/games/<slug>.webp`, dan `public/games/images/games/<slug>.webp` untuk menjamin semua variasi request HTTP 200 OK.
  3. Memperbarui `thumbnailUrl` seluruh game di `src/lib/games-data.ts` menjadi `/games/<slug>/preview.png` sesuai panduan `AGENTS.md`.
  4. Menerapkan mekanisme pemulihan URL berantai (chain fallback) pada `GameCard.tsx` agar browser tidak menampilkan ikon broken image.
  5. Memperbarui kartu Pilihan Utama pada Hero Banner di `GameHero.tsx` sehingga menampilkan cover visual preview game dinamis dengan gradasi gelap estetik, bukan lagi inisial huruf polos.
  6. Melakukan static build `npm run build` sehingga seluruh aset dan halaman di folder `out/` tersinkronisasi 100%.
- **Masalah yang Ditemukan:** Next.js static build dengan konfigurasi `basePath: "/games"` memerlukan ketersediaan aset di rute bersarang maupun rute root subfolder agar tidak 404 pada server Apache.
- **Penyelesaian:** Distribusi multi-path dan chain fallback di sisi klien memastikan gambar selalu berhasil dimuat dari path manapun.
- **File Terdampak:** `scripts/generate-all-previews.js`, `public/*`, `out/*`, `src/lib/games-data.ts`, `src/components/game/GameCard.tsx`, `src/components/game/GameHero.tsx`, `UPDATE.md`, `laporan.md`

### [2026-11-19 23:38] - [Frontend] - Remake Batch 1 Game (Cyber Bird, Tekno Memory, Circuit Flow) & Integrasi Preview Card
- **Kondisi Sebelum:** `cyber-bird` dan `tekno-memory` belum memiliki fitur High Score `localStorage`, tombol mute audio, dan `tekno-memory` masih menggunakan emoji; belum ada `preview.png`; `circuit-flow` belum dibuat; kartu katalog `GameCard.tsx` masih menampilkan inisial huruf, belum menampilkan cover gambar.
- **Perubahan Sesudah:**
  1. Melakukan remake `cyber-bird/index.html` dengan akselerasi bertahap, zero-emoji, audio toggle, dan High Score `localStorage`.
  2. Melakukan remake `tekno-memory/index.html` dengan 12 ikon SVG teknologi (zero-emoji), timer, level scaling (2x2 s.d 4x4), dan High Score `localStorage`.
  3. Membuat game baru `circuit-flow/index.html` (9 level connect puzzle tanpa emoji) dan mendaftarkannya ke `games-data.ts`.
  4. Menghasilkan gambar `preview.png` resolusi 600x400 untuk ketiga game tersebut.
  5. Memperbarui `GameCard.tsx` untuk menampilkan gambar `preview.png` penuh (`object-fit: cover`).
  6. Memperbarui `game-log.md` di bagian paling atas.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Seluruh checklist kualitas di `game-guide.md` telah dipenuhi dan lolos kompilasi.
- **File Terdampak:** `public/games/cyber-bird/*`, `public/games/tekno-memory/*`, `public/games/circuit-flow/*`, `src/components/game/GameCard.tsx`, `src/lib/games-data.ts`, `game-log.md`, `UPDATE.md`, `laporan.md`


### [2026-11-19 22:52] - [Fullstack] - Integrasi Resmi Google AdSense, Skrip Loader Head, dan File ads.txt
- **Kondisi Sebelum:** Komponen iklan Google AdSense hanya beroperasi dengan placeholder lokal dan mock client ID tanpa skrip loader resmi di header serta belum memiliki file verifikasi `ads.txt`.
- **Perubahan Sesudah:** 
  1. Menambahkan skrip resmi loader Google AdSense dengan publisher client ID `ca-pub-3146007647541379` ke dalam tag `<head>` di `src/app/layout.tsx`.
  2. Membuat file verifikasi `public/ads.txt` dengan isi: `google.com, pub-3146007647541379, DIRECT, f08c47fec0942fa0`.
  3. Memperbarui variabel lingkungan `.env.local` dan `.env.example` dengan `NEXT_PUBLIC_ADSENSE_CLIENT_ID` dan slot key.
  4. Seluruh placeholder (`GoogleAdSlot.tsx`, `AdSkyscraper.tsx`, `AdBottomAnchor.tsx`) kini siap merender unit iklan otomatis begitu Slot ID diisikan.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Build statis `npm run build` berjalan sukses dan `ads.txt` serta skrip header otomatis terdistribusi ke folder `out/`.
- **File Terdampak:** `src/app/layout.tsx`, `public/ads.txt`, `.env.local`, `.env.example`, `UPDATE.md`, `laporan.md`, `out/*`

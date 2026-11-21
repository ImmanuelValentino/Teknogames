### 2026-11-21 - Fitur CMS Indexing & Ranking Game (/manage-games)
- **Folder Game:** `src/app/manage-games`, `src/lib/cms-supabase.ts`, `src/app/page.tsx`
- **Deskripsi:** Menambahkan sistem Content Management System (CMS) untuk indexing dan kurasi urutan game dari Top 1 hingga terakhir. Urutan dikontrol penuh oleh Admin melalui panel `/manage-games` dengan antarmuka drag-and-drop dan tombol geser. Game yang ditempatkan pada posisi Top 1 secara otomatis menjadi Kartu Utama di Hero Banner Beranda, dan susunan katalog game langsung menyesuaikan secara instan melalui Supabase database (`cms_settings`).
- **Fitur Utama:**
  - [x] Panel CMS di rute `/manage-games` terlindungi kata sandi rahasia Supabase
  - [x] Antarmuka Drag-and-Drop Native + Tombol Geser Panah Cepat & Shortcut "Jadikan Top 1"
  - [x] Live Highlight Box untuk memantau game pemegang posisi Top 1 Hero Homepage
  - [x] Sinkronisasi instan ke Beranda: Top 1 menjadi Hero Banner, Top 2 kartu kedua, katalog tersusun berurutan
  - [x] Fitur Ganti Kata Sandi Admin langsung ke database Supabase
  - [x] Zero-Emoji Policy 100% menggunakan Lucide React icons
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Werewolf: Hotfix Tembakan Pemburu & Penanganan Tombol Diskusi Online
- **Folder Game:** `public/games/werewolf`
- **Deskripsi:** Memperbaiki 3 isu pada fase siang game Werewolf: (1) Menghilangkan teks anomali 'PEMBURU () GUGUR!' yang muncul saat malam damai akibat kebocoran elemen panel, (2) Memastikan panel dan tombol 'Lepaskan Tembakan Terakhir' HANYA muncul pada layar pemain Pemburu (Hunter) yang benar-benar gugur dan disembunyikan secara absolut untuk pemain lain atau saat malam damai, serta (3) Mengaktifkan fungsi klik tombol 'Lewati Diskusi' dan 'Lanjut ke Voting' di Mode Online bersama sinkronisasi hitung mundur timer diskusi 120 detik.
- **Fitur Utama:**
  - [x] Rule CSS Global `.hidden { display: none !important; }` dan proteksi inline style
  - [x] Isolasi Panel Tembakan Terakhir Khusus Hunter yang Gugur
  - [x] Fungsionalitas Tombol Lewati Diskusi (Host Skip Controller)
  - [x] Timer Countdown Diskusi Siang 120 Detik Online Realtime
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Werewolf: Bugfix Seer Single-Lock, Timer 30 Detik Malam, & Sinkronisasi Role Realtime
- **Folder Game:** `public/games/werewolf`
- **Deskripsi:** Memperbaiki 3 isu gameplay pada game Werewolf: (1) Membatasi Seer hanya dapat mengklik/melihat 1 identitas per malam dengan langsung mengunci dan menonaktifkan kartu target lainnya, (2) Menambahkan pembatasan waktu giliran aksi malam 30 detik (auto-submit/auto-skip saat waktu habis) serta menampilkan status peran yang sedang beraksi dan countdown waktu giliran di layar tunggu pemain lain, dan (3) Memperbaiki sinkronisasi perubahan jumlah role di room master agar user/guest lain di lobi dapat langsung melihat perubahan secara real-time via dual-sync (Realtime + Polling 1 detik).
- **Fitur Utama:**
  - [x] Seer Single-Target Lock (hanya 1 klik terawang per malam, kartu lain langsung nonaktif)
  - [x] Batas Waktu Giliran Aksi Malam 30 Detik + Auto-Submit Timeout
  - [x] Layar Tunggu Malam Informatif (Pemberitahuan Peran yang Sedang Beraksi + Timer Sisa)
  - [x] Sinkronisasi Role Lobi Realtime untuk Seluruh User/Guest (Dual-Sync Realtime + Polling)
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Werewolf: Online Multiplayer Supabase & Modular Architecture Upgrade
- **Folder Game:** `public/games/werewolf`
- **Deskripsi:** Pembaruan besar game Werewolf dengan menambahkan fitur Mode Online Multiplayer berbasis Supabase Realtime dengan sistem Room Kode 6 Digit Temporary, sambil mempertahankan Mode Offline (Pass-and-Play 1 HP) secara penuh. Arsitektur game dipecah menjadi multi-file modular (`index.html`, `styles.css`, `app.js`, `offline-engine.js`, `online-supabase.js`, `svg-icons.js`, `config.js`) dengan tema visual Dark Gothic Bloody Color, pemilihan kartu acak/terkunci (Single Pick Lock), siklus malam single-target, voting rahasia, auto-cleanup room, dan skema migrasi database SQL `supabase-werewolf-schema.sql`.
- **Fitur Utama:**
  - [x] Mode Online Multiplayer (Room Kode 6 Digit Temporary via Supabase Realtime)
  - [x] Mode Offline (Pass-and-Play 1 HP) Lengkap
  - [x] Arsitektur Modular Multi-File Terpisah & Bersih Bebas Bug
  - [x] Kunci 1 Pilihan (Single Pick Lock) & Tombol Pilih Acak (Random)
  - [x] Sinkronisasi Siklus Malam & Siang (Single-Target Rule: Bodyguard, Werewolf, Seer, Hunter)
  - [x] Skema SQL Lengkap (`supabase-werewolf-schema.sql`) dengan RLS & Publikasi Realtime
  - [x] Pembersihan Room Otomatis (Auto-Delete saat Game Over & Garbage Collection > 2 jam)
  - [x] Tema Dark Gothic Bloody Color Responsif (Mobile 360x800 & Desktop)
  - [x] Zero-Emoji Policy 100% Menggunakan Ikon SVG Vektor Kustom
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - [DELETED] Kamus Kelana: Kata Tersembunyi (Dihapus Permanen)
- **Folder Game:** `public/games/kamus-kelana` (DIHAPUS)
- **Deskripsi:** Game teka-teki kata tersembunyi nusantara beserta seluruh konsep idenya telah dihapus secara permanen dari direktori game, katalog website utama, dan dokumen konsep ide (`list-game2.md`) atas instruksi pengguna.
- **Fitur Utama:**
  - [x] Penghapusan direktori `public/games/kamus-kelana/` dan aset preview
  - [x] Penghapusan registrasi game dari `src/lib/games-data.ts`
  - [x] Penghapusan styling gradient kartu dari `src/components/game/GameCard.tsx`
  - [x] Penghapusan konfigurasi generator preview dari `scripts/generate-all-previews.js`
  - [x] Pembersihan seluruh konsep & ide game dari dokumen `list-game2.md`
- **Status Akhir:** REMOVED
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Werewolf: Malam & Desa (Remake Interaktif 5-15 Pemain)
- **Folder Game:** `public/games/werewolf`
- **Deskripsi:** Remake penuh sistem moderator otomatis Werewolf untuk 5-15 pemain dalam 1 perangkat: input nama dinamis & auto-balance role, grid pemilihan kartu peran interaktif (3D flip card) dengan layar transisi aman (Privacy Screen), siklus malam berurutan (Bodyguard anti-spam 2 malam berturut-turut, Werewolf melihat rekan serigala, Seer terawang instan), pengumuman fajar, skill kematian tembakan balasan Hunter, timer diskusi desa (2-3 menit), serta sidang voting eksekusi siang.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Input Dinamis 5-15 Pemain + LocalStorage Persistence
  - [x] Pemilihan Kartu Interaktif (3D Card Pick & Flip Animation)
  - [x] Layar Transisi Aman (Privacy Screen Anti-Intip)
  - [x] Siklus Malam Berurutan & Dummy Screen Simulasi
  - [x] Skill Pembalasan Hunter Saat Gugur
  - [x] Timer Diskusi Desa & Voting Sidang Gantung
  - [x] Ilustrasi Vektor SVG Kustom (Zero-Emoji) & Web Audio API Synth
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Circuit Flow: PCB Circuit Trace & Algorithm Upgrade
- **Folder Game:** `public/games/circuit-flow`
- **Deskripsi:** Peningkatan besar pada visual dan logika koneksi sirkuit: jalur kini mengadopsi jejak tembaga PCB (*copper trace*, *circuit core*, dan *flowing electron pulse* dinamis), algoritma interaksi jalur bebas bug berbasis standar Pou Connect & Flow Free (backtracking otomatis, penimpaan tabrakan jalur, kalkulasi cakupan grid), serta 9 level puzzle yang diverifikasi 100% solvable menggunakan solver backtracking.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] PCB Circuit Trace Visuals with Flowing Electrons Animation
  - [x] Bug-Free Path Routing Logic & Automatic Backtracking
  - [x] 100% Verified Solvable Levels via Backtracking Solver
  - [x] Scoring, Grid Coverage Bonus & High Score (`teknogames_circuit-flow_highscore`)
  - [x] Web Audio API Synthesizer & Toggle Audio Mute
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - [DELETED] Batik Flow (Dihapus Permanen)
- **Folder Game:** `public/games/batik-flow` (DIHAPUS)
- **Deskripsi:** Game Batik Flow telah dihapus permanen dari direktori public, katalog web utama, dan sistem navigasi atas instruksi mutlak pengguna. Aturan larangan permanen ditambahkan pada AGENTS.md (Bagian 8) dan game-guide.md (Bagian 9) yang melarang pembuatan kembali game bertema batik atau konsep sambung alur serupa.
- **Fitur Utama:**
  - [x] Penghapusan folder `public/games/batik-flow/` dan aset terkait
  - [x] Penghapusan registrasi game dari `src/lib/games-data.ts` dan `GameCard.tsx`
  - [x] Penambahan klausul blacklist permanen di `AGENTS.md` & `game-guide.md`
- **Status Akhir:** DELETED / REMOVED PERMANENTLY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Werewolf: Malam & Desa
- **Folder Game:** `public/games/werewolf`
- **Deskripsi:** Game companion deduksi sosial misteri malam desa nusantara dengan dua mode: Mode Detektif Solo menganalisis alibi kebohongan serigala dan Mode Pass & Play pesta (Werewolf, Seer, Bodyguard, Villager) dengan voting sidang siang.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_werewolf_highscore`)
  - [x] Visual Asset (Deep Dark UI + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Lonceng desa tengah malam, lolongan malam, palu sidang) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Kamus Kelana: Kata Tersembunyi
- **Folder Game:** `public/games/kamus-kelana`
- **Deskripsi:** Teka-teki tebak kata jelajah destinasi nusantara (Bali, Bromo, Toba, Komodo, Raja Ampat) menggunakan roda kompas huruf interaktif dengan garis neon cyan, tombol acak, dan bantuan petunjuk.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_kamus-kelana_highscore`)
  - [x] Visual Asset (Canvas 2D Wheel + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Tone tangga nada tiap sambungan huruf, success chime chord, error buzz) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Pasar Terapung: Fruit Catch
- **Folder Game:** `public/games/pasar-terapung`
- **Deskripsi:** Game arcade menangkap komoditas buah lokal segar (Pisang, Durian, Rambutan, Belimbing) dari atas perahu jukung di Sungai Martapura Banjarmasin, menghindari kayu hanyut dan batu sungai tajam dengan sistem kombo bertingkat.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_pasar-terapung_highscore`)
  - [x] Visual Asset (Canvas 2D Riak Air + Jukung Tradisional + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Cipratan air, plop tangkap buah, benturan kayu, kombo chime) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Lembah Bromo: Hang Glider
- **Folder Game:** `public/games/lembah-bromo`
- **Deskripsi:** Permainan momentum lereng bukit pasir bergelombang (Tiny Wings style) menerbangkan gantole melintasi kaldera Bromo, menukik di lereng turun untuk melontarkan glider tinggi ke angkasa menghindari badai pasir kawah.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_lembah-bromo_highscore`)
  - [x] Visual Asset (Canvas 2D Sunrise Bromo + Glider Trail + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Desau angin tukik, launch swoosh, kristal belerang ping) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Kopi Klotok: Barista Rhythm
- **Folder Game:** `public/games/kopi-klotok`
- **Deskripsi:** Permainan ritme ketukan barista warung kopi klotok Jogja pada 3 jalur rel tetesan air mendidih dan biji kopi sangrai menuju cangkir tanah liat dengan kombo bertingkat.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_kopi-klotok_highscore`)
  - [x] Visual Asset (Canvas 2D + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Chime seduh, tap good, miss, crash) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Layangan Sanur: Wind Battle
- **Folder Game:** `public/games/layangan-sanur`
- **Deskripsi:** Pertarungan adu tarik-ulur layangan bebean khas Pantai Sanur Bali di udara dengan mekanisme manajemen tensi benang dan manuver menukik pemotong benang lawan.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_layangan-sanur_highscore`)
  - [x] Visual Asset (Canvas 2D + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Desau angin, whistle benang, snap cut) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Batik Flow: Sambung Canting
- **Folder Game:** `public/games/batik-flow`
- **Deskripsi:** Teka-teki logika memutar 16 ubin jalur lilin malam canting tembaga agar terhubung membentuk 3 motif adiluhung batik nusantara (Parang Rusak, Kawung, Mega Mendung).
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_batik-flow_highscore`)
  - [x] Visual Asset (Canvas 2D + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Tick putar, droplet flow, victory arpeggio) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Candi Stacker: Megalitikum
- **Folder Game:** `public/games/candi-stacker`
- **Deskripsi:** Permainan presisi menyusun tumpukan balok batu andesit bertingkat candi Borobudur dengan fisika pemotongan balok berlebih dan bonus kombo tumpukan sempurna.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_candi-stacker_highscore`)
  - [x] Visual Asset (Canvas 2D + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Thud batu, kencring sempurna, slice cut) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Becak Drift: Malioboro Rush
- **Folder Game:** `public/games/becak-drift`
- **Deskripsi:** Balapan drifting becak modern menembus lorong Malioboro Jogja, menghindari andong dan pot bunga jalanan dengan sistem pengganda skor kombo drift.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_becak-drift_highscore`)
  - [x] Visual Asset (Canvas 2D + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Bel becak, decitan drift, tabrakan) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Packing Master: Koper Rapi
- **Folder Game:** `public/games/packing-master`
- **Deskripsi:** Teka-teki penataan barang bawaan traveling ke dalam koper bagasi dengan 4 level petak matriks (3x4 s.d 5x5), fitur rotasi barang 90 derajat, dan batas waktu hitung mundur.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_packing-master_highscore`)
  - [x] Visual Asset (SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Pop item, tick putar, snap petak, victory) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Kapal Feri: Island Hopper
- **Folder Game:** `public/games/kapal-feri`
- **Deskripsi:** Navigasi petualangan kemudi kapal feri menyeberangi Selat Sunda (Merak ke Bakauheni), bermanuver menghindari karang laut tajam dan menyelamatkan pelampung darurat hingga sandar di dermaga.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_kapal-feri_highscore`)
  - [x] Visual Asset (Canvas 2D + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Klakson foghorn feri, pelampung, ombak, crash) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-20 - Nusantara Runner: Escape to Bali
- **Folder Game:** `public/games/nusantara-runner`
- **Deskripsi:** Endless runner arkade melintasi Malioboro, Bromo, hingga Pantai Kuta dengan rintangan bertingkat (lompat dan meluncur), pengumpulan tiket koin kapal, dan akselerasi kecepatan dinamis.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage: `teknogames_nusantara-runner_highscore`)
  - [x] Visual Asset (Canvas 2D + SVG Zero-Emoji) & Preview Thumbnail (preview.png)
  - [x] Web Audio API Synthesizer (Jump chirp, slide swoosh, coin chime, hit) & Audio Toggle
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-19 - Circuit Flow
- **Folder Game:** `public/games/circuit-flow`
- **Deskripsi:** Permainan teka-teki logika menghubungkan simpul terminal warna sirkuit neon tanpa saling menyilang kabel. Selesaikan 9 level matriks sirkuit dengan berbagai tingkat kerumitan.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage)
  - [x] Visual Asset (.webp/Canvas) & Preview Thumbnail (preview.png)
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-19 - Tekno Memory
- **Folder Game:** `public/games/tekno-memory`
- **Deskripsi:** Permainan pencocokan memori sirkuit dengan sistem scaling ukuran grid bertahap (2x2 hingga 4x4) dan batas waktu hitung mundur. Dilengkapi ikon teknologi SVG bersih tanpa emoji.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage)
  - [x] Visual Asset (.webp/SVG) & Preview Thumbnail (preview.png)
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

### 2026-11-19 - Cyber Bird
- **Folder Game:** `public/games/cyber-bird`
- **Deskripsi:** Permainan arcade kendali drone siber melintasi pilar neon dengan akselerasi kecepatan horizontal bertahap setiap kelipatan skor.
- **Fitur Utama:**
  - [x] Gameplay HTML5 Single File (Responsive Mobile & Desktop)
  - [x] Scoring & High Score System (Local Storage)
  - [x] Visual Asset (.webp/Canvas) & Preview Thumbnail (preview.png)
- **Status Akhir:** READY
- **Dibuat oleh:** AI Agent

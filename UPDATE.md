# CHANGELOG & UPDATE LOG (teknotama.com/games)

Dokumen ini mencatat seluruh riwayat pembaruan, perbaikan bug, penambahan fitur, dan audit pembersihan visual pada project **Tekno Game** (`https://teknotama.com/games/`) dengan format standar **Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`)**:

- **MAJOR (`X.0.0`):** Perubahan besar pada arsitektur sistem, desain/redesign total, struktur URL/SEO, atau breaking changes.
- **MINOR (`0.X.0`):** Penambahan fitur baru, halaman baru, atau pembaruan fungsionalitas yang backward-compatible.
- \*\*PATCH (`0.0.X`):

---

\*\* Perbaikan bug, hotfix styling, optimasi performa, atau perbaikan minor.

## [3.15.15] - 2026-11-24
### Changed (Footer Hitam dan Pengurangan Warna Krem)
- **Tema website (src/app/globals.css):** Menghilangkan krem dari elemen umum dan memakai Snow White untuk permukaan terang; footer menjadi hitam #101010 dengan teks putih salju dan aksen merah berkontras tinggi.

## [3.15.13] - 2026-11-24
### Improved (HUD Role Responsive Wrap & Maksimal 30 Pemain Werewolf)
- **Visibilitas Role HUD (`styles.css`):** Menambahkan `flex-wrap: wrap` pada `.hud-left` agar badge peran pemain (`#hudMyRoleBadge`) selalu terlihat jelas dan tidak terpotong di layar mobile.
- **Kapasitas Pemain (`online-supabase.js`, `offline-engine.js`, `index.html`):** Menaikkan batas maksimal pemain per room dari 15 menjadi 30 pemain.

## [3.15.12] - 2026-11-24
### Changed (Pembagian Kartu Langsung ke Semua Pemain Werewolf Online)
- **Instant Card Dealing (`online-supabase.js`):** Saat Host memulai game (`startOnlineGame`), seluruh kartu langsung dibagikan secara acak dan merata ke semua pemain dalam 1 kali write, sehingga setiap pemain langsung menerima kartu perannya tanpa antrean atau risiko kehabisan kartu, disertai timer siap 15 detik otomatis.

## [3.15.11] - 2026-11-24
### Changed (Giliran Pick Card 1-by-1 3 Detik Sesuai Urutan Masuk Room)
- **Sequential Card Pick (`online-supabase.js`):** Pemilihan kartu kini bergiliran 1 per 1 sesuai urutan pemain masuk room (`card_pick_turn_index`), masing-masing diberi waktu 3 detik (`card_pick_turn_start_time`) dengan auto-pick otomatis (plus fallback Host di detik ke-4) bila waktu habis.

## [3.15.10] - 2026-11-24

### Fixed (Penyesuaian Warna Ikon Kategori di Bawah Game agar Seragam dengan Navbar)

- **Ikon Kategori Bilah Kontrol Game (`GameFrame.tsx`, `PlayPageView.tsx`):** Menghapus `variant="dark"` yang terpasang statis pada komponen `CategoryIcon` di bawah iframe game dan kotak spesifikasi teknis, sehingga ikon kategori kini secara dinamis mengikuti skema warna tema yang sama dengan dropdown kategori navbar (`--category-icon-light` saat mode terang dan `--category-icon-dark` saat mode gelap).

## [3.15.15] - 2026-11-24
### Changed (Footer Hitam dan Pengurangan Warna Krem)
- **Tema website (src/app/globals.css):** Menghilangkan krem dari elemen umum dan memakai Snow White untuk permukaan terang; footer menjadi hitam #101010 dengan teks putih salju dan aksen merah berkontras tinggi.

## [3.15.13] - 2026-11-24
### Improved (HUD Role Responsive Wrap & Maksimal 30 Pemain Werewolf)
- **Visibilitas Role HUD (`styles.css`):** Menambahkan `flex-wrap: wrap` pada `.hud-left` agar badge peran pemain (`#hudMyRoleBadge`) selalu terlihat jelas dan tidak terpotong di layar mobile.
- **Kapasitas Pemain (`online-supabase.js`, `offline-engine.js`, `index.html`):** Menaikkan batas maksimal pemain per room dari 15 menjadi 30 pemain.

## [3.15.12] - 2026-11-24
### Changed (Pembagian Kartu Langsung ke Semua Pemain Werewolf Online)
- **Instant Card Dealing (`online-supabase.js`):** Saat Host memulai game (`startOnlineGame`), seluruh kartu langsung dibagikan secara acak dan merata ke semua pemain dalam 1 kali write, sehingga setiap pemain langsung menerima kartu perannya tanpa antrean atau risiko kehabisan kartu, disertai timer siap 15 detik otomatis.

## [3.15.11] - 2026-11-24
### Changed (Giliran Pick Card 1-by-1 3 Detik Sesuai Urutan Masuk Room)
- **Sequential Card Pick (`online-supabase.js`):** Pemilihan kartu kini bergiliran 1 per 1 sesuai urutan pemain masuk room (`card_pick_turn_index`), masing-masing diberi waktu 3 detik (`card_pick_turn_start_time`) dengan auto-pick otomatis (plus fallback Host di detik ke-4) bila waktu habis.

## [3.15.10] - 2026-11-24
### Fixed & Added (Role Popup In-Game, Sisa Belum Siap, & Sinkronisasi Voting Werewolf)
- **Popup Detail Peran In-Game (`#roleInfoModal`):** Badge peran di HUD atas kini bisa diklik sepanjang permainan untuk membuka popup ikon, nama, dan deskripsi peran pemain.
- **Penghitung Sisa Belum Siap (`renderOnlineCardPick`):** Tombol menunggu kini menampilkan jumlah pemain yang belum menekan tombol Siap (`Sisa {count} orang belum siap`).
- **Perbaikan Desync Voting & Game Over (`online-supabase.js`):** Menambahkan guard `status !== 'day_voting'` + lock `isSubmittingVote`, pengecekan ketat `vote !== null && vote !== undefined`, mempertahankan pilihan target saat polling, menampilkan sisa pemain belum vote, membandingkan `room.status` saat polling, serta memperpanjang auto-cleanup room ke 30 detik (sekali jalan) agar seluruh pemain menerima status selesai secara serempak.

## [3.15.9] - 2026-11-24

### Improved (Penyesuaian Spasi di Atas Rekomendasi Game / More Games For You)

- **Margin & Padding Rekomendasi (`PlayPageView.tsx`, `globals.css`):** Mempersempit jarak vertikal kosong di atas judul "Permainan Lainnya Untuk Anda" / "More Games For You" dari 40px menjadi 6px menggunakan class `.play-page-recommendations` dengan `margin-top: 6px !important` dan `padding-top: 0 !important`, serta memastikan slot iklan yang tidak aktif tidak menambah margin kosong.

## [3.15.15] - 2026-11-24
### Changed (Footer Hitam dan Pengurangan Warna Krem)
- **Tema website (src/app/globals.css):** Menghilangkan krem dari elemen umum dan memakai Snow White untuk permukaan terang; footer menjadi hitam #101010 dengan teks putih salju dan aksen merah berkontras tinggi.

## [3.15.13] - 2026-11-24
### Improved (HUD Role Responsive Wrap & Maksimal 30 Pemain Werewolf)
- **Visibilitas Role HUD (`styles.css`):** Menambahkan `flex-wrap: wrap` pada `.hud-left` agar badge peran pemain (`#hudMyRoleBadge`) selalu terlihat jelas dan tidak terpotong di layar mobile.
- **Kapasitas Pemain (`online-supabase.js`, `offline-engine.js`, `index.html`):** Menaikkan batas maksimal pemain per room dari 15 menjadi 30 pemain.

## [3.15.12] - 2026-11-24
### Changed (Pembagian Kartu Langsung ke Semua Pemain Werewolf Online)
- **Instant Card Dealing (`online-supabase.js`):** Saat Host memulai game (`startOnlineGame`), seluruh kartu langsung dibagikan secara acak dan merata ke semua pemain dalam 1 kali write, sehingga setiap pemain langsung menerima kartu perannya tanpa antrean atau risiko kehabisan kartu, disertai timer siap 15 detik otomatis.

## [3.15.11] - 2026-11-24
### Changed (Giliran Pick Card 1-by-1 3 Detik Sesuai Urutan Masuk Room)
- **Sequential Card Pick (`online-supabase.js`):** Pemilihan kartu kini bergiliran 1 per 1 sesuai urutan pemain masuk room (`card_pick_turn_index`), masing-masing diberi waktu 3 detik (`card_pick_turn_start_time`) dengan auto-pick otomatis (plus fallback Host di detik ke-4) bila waktu habis.

## [3.15.10] - 2026-11-24
### Fixed & Added (Role Popup In-Game, Sisa Belum Siap, & Sinkronisasi Voting Werewolf)
- **Popup Detail Peran In-Game (`#roleInfoModal`):** Badge peran di HUD atas kini bisa diklik sepanjang permainan untuk membuka popup ikon, nama, dan deskripsi peran pemain.
- **Penghitung Sisa Belum Siap (`renderOnlineCardPick`):** Tombol menunggu kini menampilkan jumlah pemain yang belum menekan tombol Siap (`Sisa {count} orang belum siap`).
- **Perbaikan Desync Voting & Game Over (`online-supabase.js`):** Menambahkan guard `status !== 'day_voting'` + lock `isSubmittingVote`, pengecekan ketat `vote !== null && vote !== undefined`, mempertahankan pilihan target saat polling, menampilkan sisa pemain belum vote, membandingkan `room.status` saat polling, serta memperpanjang auto-cleanup room ke 30 detik (sekali jalan) agar seluruh pemain menerima status selesai secara serempak.

## [3.15.9] - 2026-11-24
### Fixed & Added (Seer Stability, Card Pick Timer & Quota, Vote Tally, & In-Game Role HUD)
- **Seer Anti-Reset (`online-supabase.js`):** Mencegah polling 1.2 detik me-render ulang dan menutup hasil penerawangan Seer (`lastRenderedNightKey`), serta memindahkan aksi malam ke `updateRoomStateAtomically`.
- **Card Pick Visual, Kuota & Timer Auto-Pick:** Menambahkan highlight kartu milik pemain (`MILIKMU`/`YOURS`), label nama pengambil pada kartu yang sudah terambil, badge kuota sisa kartu, serta timer 30 detik dengan auto-pick & auto-ready saat waktu habis.
- **Layar Hasil Voting (`#screenVoteResult`):** Menampilkan perolehan suara per pemain dan pengumuman pemain yang tereliminasi sebelum lanjut ke fase berikutnya.
- **Badge Role In-Game HUD (`app.js`):** Menampilkan peran pemain yang sedang aktif di HUD atas agar tidak lupa selama permainan.

## [3.15.8] - 2026-11-24

### Fixed (Kontras Teks Breadcrumb pada Dark Mode)

- **Teks Judul Breadcrumb (`globals.css`):** Memperbaiki aturan CSS `main nav[aria-label="Jejak navigasi"] > span:last-child` agar menggunakan `var(--ink)` (alih-alih `#161616` statis) dan menambahkan override khusus dark mode `color: #f3f4f6 !important`, sehingga teks judul game (seperti "Nusantara Runner: Escape to Bali", "Kapal Feri", dll.) dan kategori terlihat jelas dan kontras saat mode gelap.
- **Komponen Tampilan (`PlayPageView.tsx`, `CategoryView.tsx`):** Menambahkan class penegas `text-slate-900 dark:text-slate-100` pada elemen span terakhir jejak navigasi.

## [3.15.15] - 2026-11-24
### Changed (Footer Hitam dan Pengurangan Warna Krem)
- **Tema website (src/app/globals.css):** Menghilangkan krem dari elemen umum dan memakai Snow White untuk permukaan terang; footer menjadi hitam #101010 dengan teks putih salju dan aksen merah berkontras tinggi.

## [3.15.13] - 2026-11-24
### Improved (HUD Role Responsive Wrap & Maksimal 30 Pemain Werewolf)
- **Visibilitas Role HUD (`styles.css`):** Menambahkan `flex-wrap: wrap` pada `.hud-left` agar badge peran pemain (`#hudMyRoleBadge`) selalu terlihat jelas dan tidak terpotong di layar mobile.
- **Kapasitas Pemain (`online-supabase.js`, `offline-engine.js`, `index.html`):** Menaikkan batas maksimal pemain per room dari 15 menjadi 30 pemain.

## [3.15.12] - 2026-11-24
### Changed (Pembagian Kartu Langsung ke Semua Pemain Werewolf Online)
- **Instant Card Dealing (`online-supabase.js`):** Saat Host memulai game (`startOnlineGame`), seluruh kartu langsung dibagikan secara acak dan merata ke semua pemain dalam 1 kali write, sehingga setiap pemain langsung menerima kartu perannya tanpa antrean atau risiko kehabisan kartu, disertai timer siap 15 detik otomatis.

## [3.15.11] - 2026-11-24
### Changed (Giliran Pick Card 1-by-1 3 Detik Sesuai Urutan Masuk Room)
- **Sequential Card Pick (`online-supabase.js`):** Pemilihan kartu kini bergiliran 1 per 1 sesuai urutan pemain masuk room (`card_pick_turn_index`), masing-masing diberi waktu 3 detik (`card_pick_turn_start_time`) dengan auto-pick otomatis (plus fallback Host di detik ke-4) bila waktu habis.

## [3.15.10] - 2026-11-24
### Fixed & Added (Role Popup In-Game, Sisa Belum Siap, & Sinkronisasi Voting Werewolf)
- **Popup Detail Peran In-Game (`#roleInfoModal`):** Badge peran di HUD atas kini bisa diklik sepanjang permainan untuk membuka popup ikon, nama, dan deskripsi peran pemain.
- **Penghitung Sisa Belum Siap (`renderOnlineCardPick`):** Tombol menunggu kini menampilkan jumlah pemain yang belum menekan tombol Siap (`Sisa {count} orang belum siap`).
- **Perbaikan Desync Voting & Game Over (`online-supabase.js`):** Menambahkan guard `status !== 'day_voting'` + lock `isSubmittingVote`, pengecekan ketat `vote !== null && vote !== undefined`, mempertahankan pilihan target saat polling, menampilkan sisa pemain belum vote, membandingkan `room.status` saat polling, serta memperpanjang auto-cleanup room ke 30 detik (sekali jalan) agar seluruh pemain menerima status selesai secara serempak.

## [3.15.9] - 2026-11-24
### Fixed & Added (Seer Stability, Card Pick Timer & Quota, Vote Tally, & In-Game Role HUD)
- **Seer Anti-Reset (`online-supabase.js`):** Mencegah polling 1.2 detik me-render ulang dan menutup hasil penerawangan Seer (`lastRenderedNightKey`), serta memindahkan aksi malam ke `updateRoomStateAtomically`.
- **Card Pick Visual, Kuota & Timer Auto-Pick:** Menambahkan highlight kartu milik pemain (`MILIKMU`/`YOURS`), label nama pengambil pada kartu yang sudah terambil, badge kuota sisa kartu, serta timer 30 detik dengan auto-pick & auto-ready saat waktu habis.
- **Layar Hasil Voting (`#screenVoteResult`):** Menampilkan perolehan suara per pemain dan pengumuman pemain yang tereliminasi sebelum lanjut ke fase berikutnya.
- **Badge Role In-Game HUD (`app.js`):** Menampilkan peran pemain yang sedang aktif di HUD atas agar tidak lupa selama permainan.

## [3.15.8] - 2026-11-24
### Fixed (Race Condition Pick Card Werewolf Online)
- **Optimistic Concurrency Control (`online-supabase.js`):** Menambahkan `updateRoomStateAtomically` (fetch state terbaru + CAS `updated_at` + retry jitter) untuk `pickCardAtomically` dan `syncPlayerReadyState`, serta lock `isPickingCard` agar pemain yang memilih kartu bersamaan tidak saling menimpa `game_state` atau kehabisan kartu.

## [3.15.7] - 2026-11-24

### Fixed (403 Forbidden pada /games/manage-games/ dan Rute Trailing Slash)

- **`.htaccess` Rewrite Rule:** Menghapus syarat `!-d` dan mengabaikan trailing slash (`^(.+?)/?$`) pada rewrite `.html` di `public/.htaccess`, sehingga URL seperti `/games/manage-games/` langsung melayani `manage-games.html` alih-alih terkena `403 Forbidden` dari `Options -Indexes`.

## [3.15.6] - 2026-11-24

### Improved (WebP Previews & Lighter Hero GPU Effects)

- **Preview `.webp` Menyeluruh:** Mengubah `thumbnailUrl` di `games-data.ts` dan sumber gambar di `GameHero.tsx` ke `.webp` (`/games/images/games/<slug>.webp` dengan fallback `.png`).
- **Pengurangan Beban Blur GPU:** Mengganti `blur-[120px]` di `GameHero.tsx` dengan `radial-gradient` CSS dan menghapus `backdrop-blur` berlapis pada kartu Hero.

## [3.15.5] - 2026-11-24

### Fixed (React Hydration Mismatch pada Head & Hero Game Order)

- **AdSense Script (`layout.tsx`):** Memindahkan loader AdSense ke `next/script` dengan `strategy="afterInteractive"` agar injeksi skrip Google (`show_ads_impl`) tidak menggeser DOM `<head>` sebelum React hydration selesai.
- **Urutan Game (`page.tsx`):** Memindahkan pembacaan `getCachedGameOrder()` dari initializer `useState` ke dalam `useEffect` agar render awal server dan client selalu konsisten.

## [3.15.4] - 2026-11-24

### Changed (Hide AdSense Placeholders Until Slot IDs Configured)

- **Auto Ads Only Mode:** Menyembunyikan placeholder `GoogleAdSlot` dan bar `AdBottomAnchor` saat `NEXT_PUBLIC_ADSENSE_CLIENT_ID` atau `adSlot` belum diisi, sehingga tampilan tetap bersih sambil mengandalkan Google AdSense Auto Ads dari `layout.tsx`.

## [3.15.3] - 2026-11-24

### Improved (Lazy Loading & Asset Priority)

- **Code-Splitting Komponen Sekunder:** Menggunakan `next/dynamic` untuk `AdBottomAnchor`, `AdSkyscraper`, `AdCompanion`, `AdNativeTile`, dan `GoogleAdSlot`.
- **Optimasi Iframe & Gambar:** Menambahkan `loading="lazy"` pada `<iframe>` di `GameFrame.tsx`, `fetchPriority="high"` + `decoding="async"` pada gambar hero di `GameHero.tsx`, serta memprioritaskan `.webp` sebelum `.png` di `GameCard.tsx`.

## [3.15.2] - 2026-11-23

### Added, Changed, & Fixed (Dukungan Bahasa ID/EN, Kontras & Ikon Responsif, Notifikasi Skor, & Tombol Tutup Ads)

- **Dukungan Bahasa Indonesia & Bahasa Inggris (ID/EN):**

1. Menambahkan fitur peralihan bahasa Indonesia dan bahasa Inggris pada antarmuka portal.

- **Pembetulan Visualisasi & Ikon Responsif:**

1. Memperbaiki kontras pada sejumlah teks yang kurang terlihat baik saat mode gelap maupun mode terang.
2. Menyesuaikan warna ikon ketika menu hamburger dibuka pada tampilan responsif di ponsel serta pada ikon kartu.

- **Notifikasi Skor & Posisi Tombol Tutup Google Ads:**

1. Menyesuaikan warna notifikasi perolehan skor/poin saat menang atau kalah permainan agar lebih mudah terlihat.
2. Memindahkan posisi tombol tutup (X) pada banner Google AdSense ke sisi kanan di dalam area banner iklan.

## [3.15.1] - 2026-11-21

### Improved (Readability, Mobile Spacing, & UI Contrast)

- **Readability and contrast:** Improved text and the Teknotama partner link so they remain visible in light and dark themes.
- **Mobile layout:** Reduced padding in selected mobile sections while preserving desktop spacing.
- **Icon visibility:** Improved score-related icon visibility without changing category icon colors.
- **About Portal card:** Matched its dark background to the Papan Skor Saya rank card (`#292a31`).
- **Files:** [globals.css](src/app/globals.css), [page.tsx](src/app/page.tsx), [AdBottomAnchor.tsx](src/components/ads/AdBottomAnchor.tsx), [GameCard.tsx](src/components/game/GameCard.tsx), [GameFrame.tsx](src/components/game/GameFrame.tsx), [GameGrid.tsx](src/components/game/GameGrid.tsx), [GameHero.tsx](src/components/game/GameHero.tsx), [Footer.tsx](src/components/layout/Footer.tsx), [LayoutWrapper.tsx](src/components/layout/LayoutWrapper.tsx), [Navbar.tsx](src/components/layout/Navbar.tsx)

## [3.15.0] - 2026-11-21

### Added & Improved (Content Management System Indexing & Ranking Game di /manage-games)

- **Panel Admin CMS ([src/app/manage-games/page.tsx](src/app/manage-games/page.tsx)):**
  - Rute `/manage-games` terlindungi form verifikasi kata sandi rahasia yang tersimpan di Supabase (`cms_settings`).
  - Antarmuka **Drag-and-Drop** intuitif untuk menggeser susunan game dari posisi #1 hingga terakhir, dilengkapi tombol geser satu posisi (naik/turun) untuk kemudahan di perangkat mobile.
  - Tombol shortcut **"Jadikan Top 1"** pada setiap baris game untuk menaikkan game pilihan langsung ke puncak.
  - Panel **Live Highlight Box** yang menampilkan pratinjau game pemegang posisi Top 1 beserta status Hero Homepage.
  - Dialog modal pengaturan untuk mengganti kata sandi admin kapan saja.
- **Layanan CMS Supabase ([src/lib/cms-supabase.ts](src/lib/cms-supabase.ts)):**
  - Integrasi REST API ke tabel `public.cms_settings` untuk memuat dan menyimpan urutan slug game (`game_order`) serta validasi kata sandi (`admin_password`).
  - Sistem dual-cache (Supabase + LocalStorage) yang memastikan pemuatan halaman beranda instan (0 ms).
- **Integrasi Otomatis Beranda ([src/app/page.tsx](src/app/page.tsx)):**
  - Game pada urutan #1 otomatis menjadi **Kartu Pilihan Utama di Hero Banner** (paling depan dan siap dimainkan).
  - Game pada urutan #2 otomatis menjadi kartu kedua di Hero Banner.
  - Katalog game di bagian bawah beranda otomatis menampilkan urutan kurasi admin dari Top 1 hingga terakhir.

## [3.14.2] - 2026-11-20

### Fixed & Improved (Werewolf Hunter Revenge Isolation, .hidden CSS Rule, & Online Discussion Controls)

- **Perbaikan Kebocoran Panel Pemburu ([public/games/werewolf/styles.css](public/games/werewolf/styles.css), [index.html](public/games/werewolf/index.html)):**
  - Menambahkan aturan CSS global `.hidden { display: none !important; }` pada `styles.css`. Sebelumnya selector hanya `.screen.hidden` sehingga elemen internal seperti `#dayHunterRevengePanel` bocor ke layar dengan teks anomali `PEMBURU () GUGUR!`.
  - Menambahkan fallback proteksi inline style `display: none` pada elemen `#dayHunterRevengePanel`.
- **Isolasi Panel Tembakan Terakhir Hunter ([public/games/werewolf/online-supabase.js](public/games/werewolf/online-supabase.js), [offline-engine.js](public/games/werewolf/offline-engine.js)):**
  - Memastikan panel `#dayHunterRevengePanel` dan tombol "Lepaskan Tembakan Terakhir" HANYA terbuka dan aktif di layar pemain yang berstatus Hunter DAN sedang gugur.
  - Untuk pemain lain atau saat malam damai tanpa korban, panel disembunyikan secara absolut (`display: none`), dan pemain lain hanya melihat status info "Menunggu tembakan pembalasan Pemburu...".
- **Pengaktifan Tombol Lewati Diskusi & Timer 120 Detik Online ([public/games/werewolf/online-supabase.js](public/games/werewolf/online-supabase.js)):**
  - Mengimplementasikan event listener pada `btnSkipDiscussion` dan `btnProceedToVoting` untuk Mode Online: Host dapat melewati waktu diskusi atau langsung menuju voting, sedangkan pemain tamu mendapatkan panduan status "Menunggu Host...".
  - Menjalankan sinkronisasi hitung mundur waktu diskusi 120 detik (`#discussionTimerDigits`) dengan auto-trigger voting saat timer habis.

## [3.14.1] - 2026-11-20

### Fixed & Improved (Werewolf Seer Single-Lock, 30s Night Turn Timer, & Realtime Lobby Sync)

- **Pembatasan Terawang Seer ([public/games/werewolf/online-supabase.js](public/games/werewolf/online-supabase.js), [offline-engine.js](public/games/werewolf/offline-engine.js)):**
  - Mengunci pilihan Seer tepat pada klik pertama; seluruh kartu target lainnya langsung dinonaktifkan (`disabled` dan event klik dihapus) sehingga Seer tidak dapat mengintip lebih dari 1 pemain dalam satu malam.
- **Pembatasan Waktu Giliran Malam 30 Detik & Layar Tunggu Informatif:**
  - Menambahkan batas waktu 30 detik untuk setiap giliran peran aktif di malam hari (Bodyguard, Werewolf, Seer). Jika waktu habis sebelum pemain menekan kunci aksi, sistem secara otomatis mengeksekusi pilihan sasaran yang sah / auto-timeout.
  - Memperbarui layar tunggu pemain lain di malam hari agar menampilkan status peran yang sedang beraksi secara spesifik serta sisa waktu hitung mundur gilirannya.
- **Sinkronisasi Perubahan Role Lobi Realtime untuk Seluruh Pemain:**
  - Memperbaiki sinkronisasi perubahan penambahan/pengurangan role oleh Room Master sehingga pemain tamu (guest) langsung melihat pembaruan jumlah peran secara instan melalui sistem dual-sync (Supabase Realtime + polling 1.2 detik).

## [3.14.0] - 2026-11-20

### Added & Improved (Werewolf Online Multiplayer Supabase & Modular Multi-File Architecture)

- **Mode Online Multiplayer Berbasis Supabase Realtime ([public/games/werewolf/online-supabase.js](public/games/werewolf/online-supabase.js)):**
  - Pembuatan room dengan **Kode 6 Digit Acak Temporary** untuk mempermudah pemain mabar lintas HP/perangkat.
  - Lobi realtime dengan sinkronisasi daftar pemain (5-15 pemain), badge Host, dan pengaturan peran auto-balance / custom.
  - Pemilihan kartu serentak di HP masing-masing dengan mekanisme **Single Pick Lock** (1 kartu hanya bisa diambil 1 pemain) dan tombol **Pilih Acak (Random)**.
  - Siklus malam realtime dengan urutan peran terarah (Bodyguard, Werewolf, Seer), aturan target tunggal (_Single-Target Rule_), dan dummy delay saat peran sudah gugur agar tidak terbaca.
  - Siklus siang realtime dengan pengumuman fajar, trigger balas dendam Pemburu (Hunter), serta sistem voting sidang rahasia.
  - **Auto-Cleanup & Garbage Collection:** Pembersihan room otomatis saat Game Over (`status: finished`) dan pembersihan room kedaluwarsa (> 2 jam).
- **Mode Offline Pass-and-Play 1 HP ([public/games/werewolf/offline-engine.js](public/games/werewolf/offline-engine.js)):**
  - Mempertahankan alur offline bergiliran 1 HP dengan input nama 5-15 pemain, auto-balance role, grid kartu 3D flip, Privacy Screen transisi giliran, siklus malam, dan sidang voting.
- **Arsitektur Modular Multi-File ([public/games/werewolf/](public/games/werewolf/)):**
  - Memisahkan kode menjadi `index.html`, `styles.css`, `app.js`, `offline-engine.js`, `online-supabase.js`, `svg-icons.js`, dan `config.js`.
  - Desain atmosferik **Dark Gothic Bloody Color** yang responsif pada mobile (360x800) dan desktop.
  - 100% Zero-Emoji Policy menggunakan ilustrasi vektor SVG inline kustom.
- **Skema Database & Migrasi SQL ([supabase-werewolf-schema.sql](supabase-werewolf-schema.sql)):**
  - Membuat DDL tabel `werewolf_rooms` lengkap dengan kolom `room_code`, `status`, `game_state` JSONB, index performa, konfigurasi RLS publik/anonim, dan publikasi Realtime.
- **Konfigurasi Lingkungan ([.env.example](.env.example), [.env.local](.env.local)):**
  - Menambahkan placeholder `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## [3.5.0] - 2026-11-20

### Added & Changed (Preferensi Tema, Papan Skor Top 5, dan Kartu Hero Interaktif)

- **Preferensi Tema ([Navbar.tsx](src/components/layout/Navbar.tsx), [layout.tsx](src/app/layout.tsx), [globals.css](src/app/globals.css)):**
  - Menyediakan mode terang dan gelap yang tersimpan di `localStorage` dengan key `teknogame-theme`, serta disinkronkan antar-tab.
  - Menambahkan tombol ikon berbentuk bulat di samping tautan `teknotama.com`; latar mode gelap menggunakan `#17181c`.
- **Papan Skor Beranda ([page.tsx](src/app/page.tsx)):**
  - Menampilkan maksimal lima skor tertinggi: peringkat pertama sebagai kartu besar, peringkat 2–5 sebagai kartu bertumpuk di sampingnya.
  - Menampilkan skor dengan warna terang, label poin, tombol mainkan ulang, serta gambar game atau ilustrasi SVG sebagai fallback.
- **Kartu Game Hero ([GameHero.tsx](src/components/game/GameHero.tsx)):**
  - Kartu pilihan kedua dapat dinaikkan ke lapisan teratas dengan klik; kartu di lapisan bawah hanya mengubah susunan dan tidak langsung membuka game.
  - Kartu teratas dapat dimainkan dan menggunakan efek hover rotasi/skala. Kartu kedua memakai gradasi ungu-violet opak untuk membedakannya dari kartu utama.
  - Warna berubah
  - Sidebar dibuat sticky
- **Dokumentasi:** Menulis ulang [Design.md](Design.md) agar sesuai dengan struktur halaman, token warna, komponen, dan interaksi yang saat ini diterapkan; memperbarui [laporan.md](laporan.md).
- **Validasi:** ESLint dan `npx tsc --noEmit` berhasil untuk perubahan komponen hero.

## [3.13.0] - 2026-11-20

### Added & Improved (Game Page SEO Content & Rich Snippet Enhancement)

- **Penambahan Konten Teks Faktual & Terstruktur pada Halaman Game (`/play/[slug]`):**
  - Menambahkan bagian **Fitur Utama Permainan** (akses instan browser, penyimpanan rekor lokal, audio sintetis hemat kuota, dukungan lintas perangkat).
  - Menambahkan bagian **Tips Singkat Bermain** (fokus timing/ritme, mode layar penuh, kontrol audio).
  - Menambahkan tabel **Informasi & Spesifikasi Teknis** (pengembang, kategori, lisensi gratis, platform HTML5, kompatibilitas, ukuran unduh 0 MB).
  - Menambahkan bagian **Pertanyaan yang Sering Diajukan (FAQ)** dengan jawaban lugas dan non-imajinatif.
- **Peningkatan Technical SEO & Rich Snippets:**
  - Menambahkan skema terstruktur `FAQPage` JSON-LD agar tanya-jawab muncul langsung di cuplikan pencarian Google SERP.
  - Memperbarui skema `VideoGame` dengan data `aggregateRating` (rating bintang Google) dan `offers` (label Gratis).
  - Memperbaiki gambar Open Graph dan Twitter Card agar menggunakan thumbnail preview masing-masing game secara spesifik.
  - Memperbaiki canonical URL menjadi URL absolut penuh.

## [3.12.0] - 2026-11-20

### Removed (Permanent Deletion of Kamus Kelana & Ideas)

- **Penghapusan Total Game Kamus Kelana:**
  - Menghapus folder `public/games/kamus-kelana/` beserta seluruh file kode HTML dan aset gambar preview.
  - Menghapus registrasi metadata game `kamus-kelana` dari `src/lib/games-data.ts`.
  - Menghapus konfigurasi styling kartu dari `src/components/game/GameCard.tsx`.
  - Menghapus definisi preview dari `scripts/generate-all-previews.js`.
- **Pembersihan Konsep Ide:**
  - Menghapus seluruh spesifikasi ide game "8. Kamus Kelana: Kata Tersembunyi" dari dokumen referensi ide `list-game2.md` (tabel matriks, rincian konsep, dan struktur pohon direktori).
- **Sinkronisasi Katalog & Static Build:**
  - Build statis diekspor ulang via `npm run build` sehingga rute `/play/kamus-kelana` bersih dari folder output `out/`.

## [3.11.0] - 2026-11-20

### Added & Changed (Remake Werewolf: 5-15 Players Setup, Interactive Tarot Card Pick & Complete Night/Day Cycle)

- **Setup Pemain Fleksibel & Dinamis (5–15 Pemain):**
  - Input nama dinamis untuk 5 hingga 15 pemain pada satu perangkat dengan tombol tambah/hapus pemain.
  - Komposisi peran seimbang otomatis (_Auto-Balance_) serta opsi kustomisasi manual sebelum mulai main.
  - Peran lengkap terintegrasi: Werewolf, Villager, Seer, Bodyguard, dan Hunter.
  - State nama pemain tersimpan otomatis di `localStorage` (`teknogames_werewolf_players`) untuk kemudahan replay langsung.
- **Mekanisme Pemilihan Kartu Interaktif (_Interactive Card Pick_):**
  - Papan grid kartu tertutup (_face-down cards_) teracak dengan giliran pemain satu per satu.
  - Efek 3D flip card saat kartu disentuh, menampilkan ilustrasi SVG per peran dan kartu ringkasan tugas.
  - Layar Transisi Privasi Aman (_Privacy Screen_ "Oper HP ke [Nama Pemain]") di setiap pergantian giliran agar peran tidak diintip pemain lain.
- **Siklus Malam Berurutan (_Night Phase_):**
  - **Bodyguard:** Melindungi 1 pemain dari serangan serigala dengan validasi ketat larangan melindungi orang yang sama 2 malam berturut-turut.
  - **Werewolf:** Menampilkan daftar rekan sesama serigala dan memilih 1 target korban mangsa.
  - **Seer:** Menerawang identitas pemain terpilih secara instan ("WEREWOLF" atau "BUKAN WEREWOLF / WARGA").
  - Dummy screen otomatis disimulasikan jika pemilik peran telah gugur untuk menyamarkan durasi giliran.
- **Siklus Siang, Skill Pembalasan Hunter & Sidang Voting:**
  - Pengumuman fajar atas peristiwa malam hari (selamat karena terlindungi atau tewas beserta pengungkapan peran).
  - **Skill Trigger Kematian Hunter:** Saat Hunter tereliminasi (diserang serigala semalam maupun digantung di siang hari), muncul kesempatan menembak 1 pemain lain untuk ikut gugur bersamanya.
  - Timer diskusi interaktif (1 s.d. 3 menit) dilengkapi tombol _Lewati ke Voting_.
  - Sesi voting eksekusi sidang gantung desa untuk mengeliminasi tersangka perolehan suara terbanyak.
- **Atmosfer & UI/UX Mutlak Tanpa Emoji:**
  - Tema _Dark Gothic Midnight Village_ yang nyaman dimainkan malam hari dan responsif mobile-first.
  - Zero-emoji policy lolos 100% menggunakan ikon SVG inline kustom untuk seluruh peran, fase bulan/matahari, status, dan tombol navigasi.
  - Web Audio API synthesizer terintegrasi (lonceng malam, lolongan serigala, mantra penerawang, tembakan pemburu, palu sidang, terompet kemenangan).
- **Pengujian & Verifikasi Terisolasi:**
  - Lulus verifikasi browser otomatis via Chrome DevTools remote debugging port 9222 dengan 0 console error.
  - Seluruh alur (Setup Pemain -> Pemilihan Kartu -> Privacy Screen) terverifikasi berjalan mulus dan tab uji ditutup rapi.

## [3.10.0] - 2026-11-20

### Improved & Fixed (Circuit Flow Visuals & Zero-Bug Connection Algorithm)

- **Upgrade Visual Jalur Sirkuit Elektronik (PCB Circuit Trace):**
  - Mengubah tampilan garis menjadi jejak tembaga sirkuit PCB (_copper trace track_ dengan garis inti neon _circuit core_).
  - Menambahkan animasi aliran pulsa partikel elektron (_flowing electrons pulse_) yang mengalir dinamis di sepanjang jalur aktif.
  - Mempercantik simpul terminal menjadi PCB via solder pad dengan detil crosshair dan glow interaktif saat terhubung.
- **Logika Koneksi Bebas Bug (Standar Pou Connect & Backtracking):**
  - Menerapkan penanganan pemotongan jalur tabrakan (_path overwrite resolution_) sesuai referensi Pou Connect / Flow Free tanpa menyebabkan kebuntuan (_deadlock_).
  - Menerapkan fitur _smooth backtracking_ (memendekkan jalur secara otomatis saat jari/kursor digerakkan mundur).
  - Memperbaiki seluruh 9 level sirkuit sehingga terverifikasi 100% solvable menggunakan solver backtracking algoritma Numberlink.
  - Menambahkan indikator kelistrikan / persentase cakupan papan (_Board Coverage Percentage_) dengan bonus skor 100% full grid.

## [3.9.0] - 2026-11-20

### Removed & Added (Permanent Deletion of Batik Flow & Blacklist Rule)

- **Penghapusan Total Game Batik Flow:**
  - Menghapus direktori `public/games/batik-flow/` beserta seluruh file kode dan aset preview di `public/batik-flow/` dan `public/images/games/batik-flow.*`.
  - Menghapus registrasi metadata game `batik-flow` dari `src/lib/games-data.ts`, `src/components/game/GameCard.tsx`, dan generator preview.
- **Penetapan Aturan Larangan Mutlak (Blacklist):**
  - Menambahkan klausul permanen pada `AGENTS.md` (Bagian 8) dan `game-guide.md` (Bagian 9) yang **MELARANG KERAS** pembuatan, modifikasi, perancangan, atau pemulihan kembali game dengan nama mengandung "batik" maupun konsep serupa (puzzle alur lilin malam/canting/pipa bertema batik) untuk masa mendatang.
- **Sinkronisasi Katalog & Static Build:**
  - Mengekspor ulang build statis `npm run build` sehingga rute `/play/batik-flow` dan kartu terkait dihapus dari direktori output `out/`.

## [3.8.0] - 2026-11-20

### Added & Changed (Remake Batch 4: Lembah Bromo, Pasar Terapung, Kamus Kelana, Werewolf)

- **Remake 4 Permainan Batch 4 Sesuai Standar Mutlak `game-guide.md` & `AGENTS.md`:**
  - **`lembah-bromo` ([index.html](public/games/lembah-bromo/index.html)):** Single-file Canvas 2D slope momentum hang glider (Tiny Wings style), visual sunrise kaldera Gunung Bromo & Gunung Batok, fisika luncuran lereng pasir dinamis (tahan tukik di downslope, lepas di upslope untuk lompatan tinggi), pengumpulan kristal embun belerang di udara, badai kabut pasir kawah yang mengejar dari belakang, Web Audio API synthesizer, High Score `localStorage` (`teknogames_lembah-bromo_highscore`), dan `postMessage`.
  - **`pasar-terapung` ([index.html](public/games/pasar-terapung/index.html)):** Arcade river boat fruit catch di Sungai Martapura Lok Baintan Banjarmasin, kemudi perahu jukung tradisional dengan keranjang rotan (panah kiri/kanan, A/D, paddle layar), komoditas buah lokal (Pisang, Durian, Rambutan, Belimbing), rintangan kayu hanyut & batu sungai, sistem 3 hati nyawa SVG, kombo bertingkat (x1 s.d x4), Web Audio API synthesizer, High Score `localStorage` (`teknogames_pasar-terapung_highscore`), dan `postMessage`.
  - **`kamus-kelana` ([index.html](public/games/kamus-kelana/index.html)):** Word connect compass puzzle jelajah 5 destinasi nusantara (Bali, Bromo, Toba, Komodo, Raja Ampat), roda kompas huruf melingkar dengan drag neon line cyan bercahaya, kotak teka-teki silang interaktif, tombol acak (shuffle) dan petunjuk (hint), Web Audio API synthesizer tone nada bertingkat & success arpeggio, High Score `localStorage` (`teknogames_kamus-kelana_highscore`), dan `postMessage`.
  - **`werewolf` ([index.html](public/games/werewolf/index.html)):** Permainan deduksi sosial misteri malam desa nusantara dengan dua mode: Mode Detektif Solo menganalisis alibi logika kebohongan serigala dan Mode Pass & Play pesta (Werewolf, Seer, Bodyguard, Villager) dengan pemilihan malam hari dan sidang eliminasi siang, Web Audio API synthesizer (lonceng tengah malam, lolongan malam hari, palu sidang), High Score `localStorage` (`teknogames_werewolf_highscore`), dan `postMessage`.
- **Quality Verification & Browser Testing:**
  - Zero-emoji policy lolos audit 100% menggunakan regex Unicode property `/\p{Extended_Pictographic}/gu`.
  - Seluruh tombol interaksi (Start, Audio Toggle, On-screen controls, Retry) responsif di mobile & desktop.
  - Lolos pengujian browser terisolasi via Chrome DevTools remote debugging port 9222 (0 console error).
  - Rute permainan merespons status HTTP 200 OK di dev server localhost.
  - Berhasil diekspor via `npm run build` ke direktori statis `out/`.

## [3.7.0] - 2026-11-20

### Added & Changed (Remake Batch 3: Candi Stacker, Batik Flow, Layangan Sanur, Kopi Klotok)

- **Remake 4 Permainan Batch 3 Sesuai Standar Mutlak `game-guide.md` & `AGENTS.md`:**
  - **`candi-stacker` ([index.html](public/games/candi-stacker/index.html)):** Single-file Canvas 2D, penyusunan balok batu andesit bertingkat candi Borobudur, pemotongan presisi balok overhang berlebih, bonus sempurna (_Perfect Placement_), scrolling kamera vertikal halus, Web Audio API synthesizer, High Score `localStorage` (`teknogames_candi-stacker_highscore`), dan `postMessage`.
  - **`batik-flow` ([index.html](public/games/batik-flow/index.html)):** Pipe connection puzzle 16 ubin membatik nusantara (Parang Rusak, Kawung, Mega Mendung), validasi BFS aliran lilin malam cair dari canting tembaga ke mahkota batik, Web Audio API synthesizer, High Score `localStorage` (`teknogames_batik-flow_highscore`), dan `postMessage`.
  - **`layangan-sanur` ([index.html](public/games/layangan-sanur/index.html)):** Aksi adu layangan bebean Bali di langit Pantai Sanur, manajemen tensi benang (tarik menukik vs ulur), pemotongan benang layangan musuh, Web Audio API synthesizer, High Score `localStorage` (`teknogames_layangan-sanur_highscore`), dan `postMessage`.
  - **`kopi-klotok` ([index.html](public/games/kopi-klotok/index.html)):** 3-lane rhythm game seduhan warung kopi klotok Jogja, ketukan presisi tetesan air & biji kopi sangrai menuju cangkir tanah liat, kombo bertingkat (Perfect, Good, Miss), 3 nyawa seduhan, Web Audio API synthesizer, High Score `localStorage` (`teknogames_kopi-klotok_highscore`), dan `postMessage`.
- **Quality Verification & Browser Testing:**
  - Zero-emoji policy lolos audit 100% menggunakan regex Unicode pictographic.
  - Lolos pengujian browser terisolasi via Chrome DevTools remote debugging tanpa runtime error console.
  - Rute permainan merespons status HTTP 200 OK di localhost.
  - Berhasil diekspor via `npm run build` ke direktori statis `out/`.

## [3.6.0] - 2026-11-20

### Added & Changed (Remake Batch 2: Nusantara Runner, Kapal Feri, Packing Master, Becak Drift)

- **Remake 4 Permainan Batch 2 Sesuai Standar Mutlak `game-guide.md` & `AGENTS.md`:**
  - **`nusantara-runner` ([index.html](public/games/nusantara-runner/index.html)):** Single-file pure Canvas 2D, zero-emoji, 3 transisi biome visual (Malioboro, Bromo, Kuta), kontrol lompat & meluncur merunduk (keyboard & tombol virtual sentuh), progressive speed scaling, Web Audio API synthesizer, High Score `localStorage` (`teknogames_nusantara-runner_highscore`), dan `postMessage`.
  - **`kapal-feri` ([index.html](public/games/kapal-feri/index.html)):** Navigasi laut top-down inersia air realistis, rute Selat Sunda 4200 unit dengan progress bar, rintangan karang tajam, koleksi pelampung darurat, dermaga sandar Pelabuhan Bakauheni, Web Audio API klakson feri foghorn, High Score `localStorage` (`teknogames_kapal-feri_highscore`), dan `postMessage`.
  - **`packing-master` ([index.html](public/games/packing-master/index.html)):** Inventory polyomino grid puzzle 4 level (3x4 s.d 5x5), sistem rotasi item 90 derajat (`R` / tombol Putar), countdown timer dengan bonus waktu, item digambar dengan ikon vektor SVG bersih (kemeja, kamera, botol, kacamata, sepatu, topi, laptop) tanpa emoji, Web Audio API synthesizer, High Score `localStorage` (`teknogames_packing-master_highscore`), dan `postMessage`.
  - **`becak-drift` ([index.html](public/games/becak-drift/index.html)):** Top-down arc racing & drifting di aspal Malioboro, rintangan andong & pot bunga, mekanik drift tajam dengan bekas ban (skid marks) dan pengganda kombo drift (x2 s.d x4), item teh poci penambah poin, Web Audio API lonceng becak dan decitan drift, High Score `localStorage` (`teknogames_becak-drift_highscore`), dan `postMessage`.
- **Quality Audit & Verification:**
  - Seluruh 4 game lolos verifikasi AST/syntax node tanpa error console/syntax.
  - Zero-emoji policy terverifikasi 100% menggunakan regex Unicode pictographic.
  - Seluruh rute lokal (`/games/games/<slug>/index.html` dan `/games/play/<slug>`) terverifikasi 200 OK.
  - Static export `npm run build` sukses 100% mendistribusikan seluruh file ke folder `out/`.

## [3.5.1] - 2026-11-19

### Fixed & Improved (Catalog Thumbnail Previews for All 15 Games & Hero Card Cover)

- **Generasi Preview Gambar 600x400 untuk Seluruh 15 Game ([scripts/generate-all-previews.js](scripts/generate-all-previews.js)):**
  - Membuat aset `preview.png` (600x400px, aspect ratio 3:2, ukuran < 50 KB, clean typography, zero emoji) menggunakan Sharp SVG renderer untuk seluruh 15 game.
  - Mendistribusikan file preview ke rute `public/games/<slug>/preview.png` dan fallback ganda `public/<slug>/preview.png`.
  - Mengonversi dan menyalin aset ke format webp dan png di `public/images/games/<slug>.webp` serta `public/games/images/games/<slug>.webp` untuk kompatibilitas penuh.
- **Pembaruan Komponen Katalog & Hero ([GameCard.tsx](src/components/game/GameCard.tsx), [GameHero.tsx](src/components/game/GameHero.tsx), [games-data.ts](src/lib/games-data.ts)):**
  - Memperbarui `thumbnailUrl` seluruh game di `src/lib/games-data.ts` mengarah ke `/games/<slug>/preview.png` sesuai Bagian 4 `AGENTS.md`.
  - Menerapkan mekanisme pemulihan URL berantai (chain fallback) di `GameCard.tsx` (`/games/<slug>/preview.png` -> `/games/games/<slug>/preview.png` -> `/<slug>/preview.png` -> webp) untuk mencegah ikon broken image browser muncul.
  - Memperbarui kartu Pilihan Utama pada Hero Banner di `GameHero.tsx` agar menampilkan cover visual preview game secara penuh dengan dark gradient overlay estetik, menggantikan kotak inisial huruf teks murni.
  - Menjalankan static export `npm run build` sehingga seluruh aset dan HTML di folder `out/` ter-generate sempurna.

## [3.5.0] - 2026-11-19

### Added & Changed (Remake Batch 1: Cyber Bird, Tekno Memory, Circuit Flow & Cover Preview Card)

- **Remake Game Batch 1 Sesuai Standar Mutlak `game-guide.md`:**
  - **`cyber-bird` ([index.html](public/games/cyber-bird/index.html)):** Single-file pure Canvas 2D, zero-emoji, progressive speed scaling, sistem High Score `localStorage`, tombol audio Web Audio API, dan pengiriman event `postMessage`.
  - **`tekno-memory` ([index.html](public/games/tekno-memory/index.html)):** Single-file pure CSS Grid & SVG, zero-emoji (12 ikon sirkuit teknologi), level scaling Pou-style (2x2 s.d 4x4), countdown timer, bonus sisa waktu, dan High Score `localStorage`.
  - **`circuit-flow` ([index.html](public/games/circuit-flow/index.html)):** Single-file pure Canvas 2D, puzzle connect node neon 9 level (4x4, 5x5, 6x6), validasi jalur kabel non-overlapping, scoring, dan High Score `localStorage`.
- **Standarisasi Cover Preview 600x400 ([GameCard.tsx](src/components/game/GameCard.tsx)):**
  - Membuat file `preview.png` resolusi 600x400 (< 50 KB) untuk `cyber-bird`, `tekno-memory`, dan `circuit-flow`.
  - Memperbarui komponen `GameCard.tsx` untuk menampilkan gambar cover `preview.png` penuh (`object-fit: cover`) sesuai Bagian 4 `game-guide.md`.
  - Mendaftarkan `circuit-flow` ke katalog metadata di `src/lib/games-data.ts`.
  - Memperbarui riwayat rilis pada `game-log.md`.

## [3.4.2] - 2026-11-19

### Added (Google AdSense Official Integration & ads.txt Verification)

- **Implementasi Skrip Loader & Konfigurasi AdSense ([layout.tsx](src/app/layout.tsx), [.env.local](.env.local)):**
  - Memasang skrip resmi Google AdSense loader di `<head>` dengan client ID `ca-pub-3146007647541379`.
  - Mendaftarkan entri verifikasi resmi AdSense ke file `public/ads.txt`: `google.com, pub-3146007647541379, DIRECT, f08c47fec0942fa0`.
  - Mengonfigurasi variabel `NEXT_PUBLIC_ADSENSE_CLIENT_ID` dan template slot iklan di `.env.local` dan `.env.example`.
  - Menyiapkan integrasi dinamis pada seluruh placeholder (Skyscraper 160x600, Leaderboard 1080x90, dan Anchor Mobile 320x50) agar langsung aktif begitu slot ID diisi.

## [3.4.1] - 2026-11-19

### Added (SEO & Social Meta Tags Integration in Layout Header)

- **Implementasi Meta Tags SEO & OpenGraph ([layout.tsx](src/app/layout.tsx)):**
  - Menambahkan title persis: `Game Online Gratis Tanpa Download – TeknoGame`.
  - Menambahkan meta description, robots (`index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`), dan link canonical `https://www.teknotama.com/games/`.
  - Menambahkan OpenGraph meta tags (`og:type`, `og:locale`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`, `og:image:alt`).
  - Menambahkan Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
  - Menambahkan JSON-LD Schema.org `WebSite` structured data pada baris baru untuk meningkatkan rich snippets pencarian Google.
  - Memverifikasi output build statis di folder `out/` agar seluruh metadata terinjeksi ke file HTML.

## [3.4.0] - 2026-11-19

### Redesign Total Frontend (Figma-Driven), Auto-Discovery Game, & Standardisasi Ads (1080 x 90)

#### 1. Rangkuman Perubahan Utama

- **Struktur Halaman Beranda Baru (Split-Hero Modern Sesuai Desain Figma):**
  - Menerapkan layout hero split modern dengan branding Tekno Game, judul utama (`<h1>`), deskripsi portal web HTML5 resmi persembahan PT Teknotama Prakarsa Mulia, CTA jelajahi katalog, dan visual cover perisai GT.
  - Menghapus total blok sorotan tambahan sekunder di bawah Hero (`02 PETUALANGAN` & `03 TEKA-TEKI`).
  - Menghapus total bar metrik/statistik 4 kolom (`Permainan pilihan`, `Total permainan`, `Gratis dimainkan`, `Skor tersimpan`).
  - Menghapus komponen modal/popup mengambang untuk Papan Skor dan Favorit.
- **Section Mandiri Papan Skor & Favorit:**
  - Menambahkan Section Papan Skor (`#papan-skor`) langsung di dalam halaman beranda yang terhubung dengan menu Navbar (`localStorage` sinkron).
  - Menambahkan Section Favorit (`#favorit`) langsung di dalam halaman beranda lengkap dengan kondisi kosong (_empty state_) yang estetis.
- **Section Tentang Portal & 4 Layanan Teknotama:**
  - Menampilkan 4 kartu layanan enterprise (_Infrastruktur Jaringan_, _Sistem Awan_, _Keamanan Data_, dan _Perangkat Lunak_) yang mengarah ke website resmi `https://teknotama.com`.
- **Sistem Auto-Discovery Folder Game (`src/lib/games.ts`):**
  - Modul plug-and-play berbasis Node.js `fs` / `path` yang secara otomatis memindai seluruh sub-direktori di `public/games/` yang memiliki `index.html`.
  - Penambahan game baru ke depan cukup menaruh folder game baru ke dalam `public/games/[slug-game]/` tanpa perlu mengubah kode frontend.
- **Dynamic Sitemap (`src/app/sitemap.ts`):**
  - Mengotomatiskan sitemap XML statis yang mendaftarkan URL root, 6 kategori, dan seluruh game yang terdeteksi dari auto-discovery.
- **Standardisasi Iklan Horizontal Tengah (1080 × 90):**
  - Memperbarui ukuran slot iklan horizontal bagian tengah di beranda, kategori, dan play page menjadi standar `1080 x 90` (`GoogleAdSlot`).
  - Menjamin dimensi terkunci anti-CLS (Cumulative Layout Shift = 0).
- **Halaman Kategori & Kondisi Kosong (Empty State):**
  - Menambahkan tampilan kondisi kosong khusus yang elegan pada kategori Olahraga (dan kategori lain bila belum ada game).

#### 2. Panduan Menambahkan Game Baru (Plug-and-Play)

Untuk menambahkan game HTML5 baru ke dalam Tekno Game:

1. Siapkan folder game Anda, pastikan memiliki file utama `index.html` dan aset-aset pendukungnya.
2. Tempatkan folder tersebut ke dalam direktori `public/games/[nama-game]/` (contoh: `public/games/balap-karung/index.html`).
3. Jalankan `npm run build`. Sistem Auto-Discovery secara otomatis akan:
   - Mendeteksi game baru tersebut.
   - Membuat rute bermain di `/play/[nama-game]`.
   - Mendaftarkannya ke dalam `sitemap.xml`.
   - Menampilkannya di katalog beranda dan pencarian instan.

---

## [3.3.3] - 2026-11-18

### Mengganti Logo Sorotan dengan Cover Permainan

- Menghapus logo Tekno Game dari area sorotan beranda.
- Menampilkan cover statis berdasarkan kategori dan judul permainan unggulan; klik cover membuka halaman permainan tanpa memuat iframe di beranda.

## [3.3.2] - 2026-11-18

### Optimasi Performa Hero dan Interaksi

- Mengganti chip Three.js dengan logo statis dan menghapus loop render canvas 3D dari hero.
- Menghapus aura kursor, kemiringan kartu, tarikan tombol, serta animasi masuk dekoratif.
- Menghapus dependensi Three.js yang tidak lagi digunakan tanpa mengubah navigasi atau fitur permainan.
- Memperbarui README dan panduan desain agar sesuai dengan perilaku antarmuka yang baru.

## [3.3.1] - 2026-11-18

### Pembaruan Logo Tekno Game

- Mengganti aset logo utama dengan logo perisai GT beresolusi tinggi dan latar transparan.
- Menghapus bingkai dan warna latar di belakang logo pada navigasi dan footer.
- Memperbarui tampilan logo yang dipakai metadata, ikon tab, dan ilustrasi hero melalui aset kanonis yang sama.

## [3.3.0] - 2026-11-17

### Redesain Antarmuka dan SEO Tekno Game

- Menyelaraskan tampilan dengan palet Obsidian, Midnight Navy, Cobalt Blue, dan Burgundy; menghapus motto lama, ticker, animasi pembuka lama, lencana promosi buatan, dan rating visual.
- Menambahkan panggung chip Three.js, aura kursor, kemiringan kartu, tombol magnetik, serta empat kartu layanan mitra.
- Melokalkan label kategori dan antarmuka ke Bahasa Indonesia tanpa mengubah data permainan, penyimpanan skor/favorit, atau mesin permainan.
- Menyamakan canonical, Open Graph, ikon, dan JSON-LD dengan jalur `NEXT_PUBLIC_BASE_PATH` (bawaan `/games`).
- Memperbarui panduan desain dan README agar sesuai dengan antarmuka saat ini.

#### Berkas usang yang dihapus

| Lokasi                   | Berkas                                                                                                                                       | Alasan                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `public/`                | `favicon.ico`, `teknogame-banner.png`, `teknogame-icon.png`, `teknogame-logo-horizontal.png`, `teknogame-logo.png`, `teknogame-wordmark.png` | Aset identitas lama atau duplikat; identitas kini memakai `Teknogame_logo_only.png`. |
| `public/`                | `travelista-logo-gram.png`, `travelista-logo-light.png`                                                                                      | Logo proyek lama yang tidak digunakan oleh portal Tekno Game.                        |
| `public/`                | `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`                                                                              | Aset contoh bawaan yang tidak digunakan.                                             |
| `src/app/`               | `favicon.ico`, `icon.png`, `apple-icon.png`                                                                                                  | Ikon duplikat yang tidak lagi dipakai; metadata memakai logo kanonis di `public/`.   |
| `src/components/layout/` | `BreakingTicker.tsx`                                                                                                                         | Ticker dekoratif dan aktivitas yang tidak bersumber telah dihapus dari navigasi.     |
| `src/components/three/`  | `IntroAnimation.tsx`                                                                                                                         | Animasi pembuka lama digantikan panggung chip pada hero.                             |

Seluruh berkas di `public/games/` dipertahankan tanpa perubahan.

## [3.2.1] - 2026-11-17

### Added Placeholder Ad Slot Component

- Dibuat file `src/components/ads/AdSlotPlaceholder.tsx` sebagai placeholder iklan Google AdSense yang dapat dipasang di semua slot iklan yang belum memiliki ID.
- Mengganti semua penggunaan `<GoogleAdSlot />` tanpa konfigurasi dengan `<AdSlotPlaceholder />` untuk tampilan visual yang bersih selama pengembangan.

## [3.2.0] - 2026-11-17

### Added & Standardized (Google AdSense Ready Display Slots & Clean Structure)

- **Standardisasi Wadah Iklan Google AdSense ([GoogleAdSlot.tsx](src/components/ads/GoogleAdSlot.tsx)):**
  - Mengimplementasikan slot iklan universal Google AdSense yang langsung siap pakai dengan tag `<ins className="adsbygoogle" />`, parameter `data-ad-client` dan `data-ad-slot`, serta dukungan variabel lingkungan (`NEXT_PUBLIC_ADSENSE_CLIENT_ID`).
  - Menampilkan visual slot iklan profesional dengan dimensi terkunci ketat anti-CLS di seluruh titik strategis:
    1. **Top & Mid Leaderboard Banner (728 × 90)** di halaman Beranda ([page.tsx](src/app/page.tsx)) dan Kategori ([page.tsx](src/app/category/[category]/page.tsx)).
    2. **In-Feed Native Ad Tile** di dalam grid katalog game ([AdNativeTile.tsx](src/components/ads/AdNativeTile.tsx)).
    3. **Medium Rectangle Ad (300 × 250)** di sidebar halaman pemutar game ([AdCompanion.tsx](src/components/ads/AdCompanion.tsx)).
    4. **Mobile Anchor Banner (320 × 50)** di bagian bawah layar smartphone ([AdBottomAnchor.tsx](src/components/ads/AdBottomAnchor.tsx)).
    5. **Skyscraper Banner (160 × 600)** di margin luar desktop layar ultra-lebar ([AdSkyscraper.tsx](src/components/ads/AdSkyscraper.tsx)).
  - Menghapus seluruh teks tiruan atau elemen visual berlebih sehingga slot terlihat bersih, autentik, dan langsung siap tayang saat script unit Google AdSense dimasukkan.

---

## [3.1.0] - 2026-11-17

### Changed & Refined (Natural Gradient, Clean UI/UX, Zero AI Slop & Layout Collision Fix)

- **Implementasi Gradient Halus Sesuai Referensi Pengguna ([globals.css](src/app/globals.css)):**
  - Mengganti latar belakang dengan gradasi diagonal halus dari Navy/Indigo (`#18225e` - `#242e75`) melewati Purple/Violet (`#4c1b54`) menuju Burgundy/Magenta (`#7a1240` - `#961250`).
- **Eliminasi Total AI Slop & Elemen Buatan:**
  - Menghapus seluruh badge buatan: "HOT", "BARU", "POPULER", "TRENDING", "GAME UTAMA PEKAN INI", "ARENA PILIHAN".
  - Menghapus rating bintang ("4.9/5.0") pada seluruh kartu game, hero, dan modal pencarian.
  - Menghapus ornamen sirkuit garis/lingkaran SVG dan pola cyber grid yang membuat UI terasa tidak alami.
  - Kartu game ([GameCard.tsx](src/components/game/GameCard.tsx)) dibuat senatural mungkin: hanya menampilkan thumbnail/ikon, kategori, dan judul game dengan tombol play yang bersih.
- **Penghapusan Marquee / Ticker Bergeser di Bawah Navbar ([ClientLayout.tsx](src/components/layout/ClientLayout.tsx)):**
  - Menghapus komponen `BreakingTicker` ("RADAR TEKNO") sehingga area di bawah navbar bersih, tenang, dan langsung mengalir ke konten utama.
- **Perbaikan Bentrokan Tata Letak (Layout Collision Fix) ([LayoutWrapper.tsx](src/components/layout/LayoutWrapper.tsx) & [AdSkyscraper.tsx](src/components/ads/AdSkyscraper.tsx)):**
  - Memperbaiki posisi iklan samping yang sebelumnya menabrak dan menutupi kontainer konten pada layar laptop/desktop 1366px - 1536px. Iklan skyscraper kini hanya aktif di margin luar layar ultra-lebar (`>= 1680px`), menjamin nol tumpang tindih (_zero overlap_) pada seluruh perangkat kerja.

---

## [3.0.0] - 2026-11-17

### Major Redesign Total Frontend (UI/UX) & Technical SEO Sub-Direktori (`teknotama.com/games/`)

#### 1. Audit & Pembersihan Visual Usang (Visual Cleanup)

Daftar lengkap elemen visual lama yang dihapus dari antarmuka:

| No  | Elemen Visual / Teks yang Dihapus                                                                                                                                                                               | Lokasi File Asal                                                                                                                                   | Alasan Penghapusan                                                                                   | Solusi & Elemen Pengganti Baru                                                                                                                                                                                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Motto lama                                                                                                                                                                                                      | `src/app/layout.tsx`<br>`src/app/page.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx`                             | Tidak lagi sesuai dengan identitas Tekno Game.                                                       | Dihapus dari UI, teks, komentar, dan metadata `<head>`. Fokus pada identitas resmi sub-portal PT Teknotama Prakarsa Mulia.                                                                                                                                |
| 2   | **Logo Lama & Ikon Usang:** `teknogame-icon.png`, `teknogame-banner.png`, `teknogame-logo.png`                                                                                                                  | `src/app/layout.tsx`<br>`src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx`<br>`src/app/icon.png`<br>`src/app/apple-icon.png` | Logo lama tidak menggunakan perisai monogram GT modern.                                              | Diganti dengan ikon perisai monogram GT baru `/Teknogame_logo_only.png` berdampingan horizontal dengan teks modern "Tekno Game".                                                                                                                          |
| 3   | **Penulisan Nama Brand Tanpa Spasi:** `"TeknoGame"`                                                                                                                                                             | Seluruh file di `src/app/` dan `src/components/`                                                                                                   | Menyeragamkan identitas resmi menjadi **"Tekno Game"** (dengan spasi).                               | Diubah 100% konsisten menjadi **"Tekno Game"** di Navbar, Footer, Hero, Title Tag, Metadata, dan Schema JSON-LD.                                                                                                                                          |
| 4   | **Karakter Emoji Unicode (Strict No-Emoji Policy):** `🎮`, `🕹️`, `🧭`, `🧩`, `⚡`, `☕`, `⚽`, `🏃‍♂️`, `🚢`, `🧳`, `🛺`, `🛕`, `🎨`, `🪁`, `🪂`, `🛶`, `🗺️`, `🐺`, `🐦`, `🧠`, `🌐`, `🏆`, `🏎️`, `🚀`, `💻`, `⭐` | `src/lib/games-data.ts`<br>`src/components/game/`<br>`src/components/layout/`<br>`src/components/ads/`<br>`src/app/`                               | Kebijakan ketat bebas emoji untuk estetika modern, profesional, dan konsisten di seluruh browser/OS. | 0 emoji di seluruh kode. Digantikan sepenuhnya dengan ikon vektor presisi dari **Lucide React** (`Gamepad2`, `Compass`, `Puzzle`, `Zap`, `Coffee`, `Trophy`, `Star`, `ShieldCheck`, `Network`, `Cpu`, dll.) dan ornamen SVG murni.                        |
| 5   | **Palet Warna Neon Cyan Lama:** (`#00F0FF`, `#070B14`, `#0B1222`)                                                                                                                                               | `src/app/globals.css`<br>Seluruh komponen UI                                                                                                       | Desain warna lama digantikan sistem warna proporsional dinamis 60-30-10.                             | Diperbarui menjadi palet Midnight Navy (`#18225e`), Cobalt/Indigo (`#242e75`), Purple (`#4c1b54`), dan Burgundy/Magenta (`#7a1240` - `#961250`).                                                                                                          |
| 6   | **Tipografi Lama (Geist / Geist Mono):**                                                                                                                                                                        | `src/app/layout.tsx`<br>`src/app/globals.css`                                                                                                      | Mengoptimalkan keterbacaan (_legibility_) dan identitas modern futuristik.                           | Menggunakan self-hosted Google Fonts (`next/font/google`) dengan `display: 'swap'`:<br>- Heading: **`Space Grotesk`** (600, 700)<br>- Body/UI: **`Plus Jakarta Sans`** (400, 500, 600, 700).                                                              |
| 7   | **Pengalih Bahasa (`ID/EN`):**                                                                                                                                                                                  | `src/components/layout/Navbar.tsx`                                                                                                                 | Seluruh antarmuka diarahkan 100% Bahasa Indonesia baku.                                              | Dihapus agar Navbar tepat memuat 8 elemen wajib.                                                                                                                                                                                                          |
| 8   | **Grid Kolom Lama (6-8 Kolom Rapat di Desktop & 3 Kolom di HP):**                                                                                                                                               | `src/components/game/GameGrid.tsx`<br>`src/app/play/[slug]/page.tsx`                                                                               | Mencegah salah klik (_accidental click_) pada Google Ads di layar HP dan menjaga proporsi kartu.     | Menerapkan layout responsif 3 ukuran layar:<br>- Mobile (`< 768px`): 2 kolom proporsional (touch target > 44px)<br>- Tablet (`768px - 1023px`): 3 kolom proporsional<br>- Desktop (`>= 1024px`): 4 kolom proporsional dengan zona aman Floating Side Ads. |
| 9   | **Iklan Samping & Bawah Tanpa Kunci Wadah Anti-CLS:**                                                                                                                                                           | `src/components/ads/AdSkyscraper.tsx`<br>`src/components/ads/AdBottomAnchor.tsx`                                                                   | Menghilangkan risiko pergeseran tata letak (CLS > 0).                                                | Mengunci dimensi wadah iklan via komponen baru `<GoogleAdSlot />`, membuat floating side ads aman di desktop, dan menambahkan tombol "Sembunyikan Iklan" di mobile.                                                                                       |

---

[2.6.3] - 2026-11-17
Changed & Deployed (Include out/ Build Folder in Git Tracking)
Mengaktifkan Git Tracking untuk Folder out/ (.gitignore):
Menghapus /out/ dari .gitignore agar artefak hasil build produksi Next.js tersimpan langsung di branch GitHub games.
Memudahkan proses deployment langsung ke hosting cPanel/Apache tanpa harus menjalankan build di sisi server.
[2.6.2] - 2026-11-16
Fixed (Lembah Bromo Game Over & Sunset/Momentum Mechanics)
Implementasi Mekanik Game Over yang Seimbang di Lembah Bromo:
Menambahkan batas waktu siang (Daylight / Sunset Timer) selama 60 detik. Setiap mengambil bintang emas di bukit, waktu siang bertambah +3 detik. Saat matahari terbenam (waktu habis), petualangan berakhir (Game Over).
Menambahkan sistem Friction & Loss of Momentum: jika paralayang terhenti di hamparan pasir bukit dan kehilangan kecepatan (vx <= 0.8) selama ~0.7 detik, game over dipicu.
Menambahkan Hard Crash Detection: jika pemain menukik tajam langsung menabrak lereng tebing terjal (vy > 4.5 pada lereng negatif curam), paralayang terhempas dan game over.
Membatasi lompatan di udara (Air Jump) menjadi 1 kali per fase terbang (bisa di-reset dengan menyentuh lereng bukit atau mengambil bintang), sehingga pemain harus mahir memanfaatkan gelombang bukit ala Tiny Wings.
Folder out/ telah di-build ulang (npm run build).
[2.6.1] - 2026-11-16
Added & Fixed (Custom Not-Found Page & Auto-Redirect from Root to /games)
Penambahan Custom 404 & Auto-Redirect Root (not-found.tsx):
Membuat halaman khusus 404 Cyber TeknoGame dengan tombol aksi cepat menuju beranda /games.
Menambahkan auto-redirect otomatis berbasis JavaScript di browser ketika user membuka root http://localhost:3000/ agar langsung diarahkan ke http://localhost:3000/games.
[2.6.0] - 2026-11-16
Added (Integrasi Game Werewolf: Malam & Desa)
Integrasi Penuh Game Werewolf (/games/werewolf/index.html):
Mengintegrasikan game deduksi sosial lokal Werewolf ke portal utama TeknoGame.
Fitur lengkap: setup nama pemain unik (min 5 pemain), pembagian role rahasia (Werewolf, Seer, Doctor, Villager), fase malam (target Werewolf, perlindungan Doctor, terawang Seer), fase siang (diskusi desa & voting eliminasi), serta penentuan kemenangan warga vs werewolf.
Sinkronisasi skor akhir ronde ke portal TeknoGame via postMessage({ type: 'GAME_OVER' }).
Terdaftar resmi di INITIAL_GAMES (games-data.ts) dan kartu game (GameCard.tsx) dengan icon 🐺.
Fixed & Improved (Bug Fixes & Mobile HP Compatibility)
Perbaikan Game Lembah Bromo (Hang Glider):
Memperbaiki bug kritis loop animasi terputus (requestAnimationFrame) saat menabrak lereng yang menyebabkan gunung membeku (stuck) dan jalanan/karakter hilang.
Memperbaiki tombol restart "Terbangkan Kembali" agar langsung me-reset state dan melanjutkan permainan tanpa macet.
Menambahkan mekanik LOMPAT / ANGKAT SAYAP (melalui Spasi, Panah Atas, tombol on-screen 🪂 LOMPAT, atau tap cepat layar) dengan dorongan updraft thermal.
Menyesuaikan gravitasi dan aerodinamika luncur (aerodynamic lift) agar paralayang tidak jatuh terlalu cepat dan melayang anggun di atas lembah Bromo.
Menambahkan tombol on-screen 🔻 TUKIK untuk menukik di lereng turunan dan mendapatkan dorongan kecepatan tinggi.
Perbaikan Game Barista (Kopi Klotok):
Mengatur popup score banner di bagian atas GameFrame.tsx agar otomatis menutup (auto-close) setelah 2 detik (2000ms), sehingga tidak menghalangi area bermain.
Memperlambat kecepatan jatuh tetesan kopi di awal permainan (kecepatan awal santai 2.0) dan mempercepat secara bertahap seiring bertambahnya skor pemain.
Menyesuaikan jeda spawn tetesan secara dinamis sesuai ritme kopi barista.
Mendukung tap di seluruh area kanvas layar untuk mempermudah pemain di smartphone.
Optimasi Kontrol Becak Drift & Kompatibilitas Seluruh Game di HP (Mobile):
Becak Drift: Menambahkan tombol kemudi sentuh di layar [ ◀ KIRI ] dan [ KANAN ▶ ] serta area tap layar kiri/kanan dengan event listener anti-stuck (pointerleave, pointercancel, touchcancel). Menambahkan touch-action: none agar tidak terganggu gesture browser HP.
Packing Master: Menambahkan sistem sentuh tap-to-select & tap-to-place (karena HTML5 native drag-and-drop tidak didukung browser mobile HP).
Pasar Terapung: Menambahkan tombol kemudi [ ◀ KAYUH ] dan [ KAYUH ▶ ] serta swipe drag layar dengan touch-action: none.
Candi Stacker: Menambahkan tombol [ 🛕 JATUHKAN BATU ] dan tap kanvas responsif di HP.
Layangan Sanur: Menambahkan tombol [ 🪁 TARIK MENUKIK ] di layar HP.
Nusantara Runner: Menambahkan tombol [ 👟 LOMPAT ] melayang di layar HP.
Kamus Kelana & Batik Flow: Mengoptimalkan touch-action: none / manipulation agar input roda huruf dan ubin batik instan tanpa delay.
[2.5.1] - 2026-11-13
Fixed (Header Logo Asset Path & Game Over Audio Loop Bug)
Perbaikan Audio Game Over (Anti-Loop & Sound Sekali Saja):
Memperbaiki bug di mana fungsi gameOver() terpanggil berulang kali (60x/detik) saat becak/karakter menabrak rintangan di becak-drift dan nusantara-runner.
Menambahkan guard clause if (!isPlaying) return; dan membatasi collision check di dalam blok isPlaying pada seluruh game mini HTML5.
Suara tabrakan game over kini berbunyi sekali saja dengan volume yang nyaman dan tidak berulang.
Perbaikan Logo Header TeknoGame di Subfolder /games/:
Mengubah path gambar <Image src="/games/teknogame-icon.png"> di Navbar.tsx dan Footer.tsx agar browser memuat logo langsung dari subfolder /games/ tanpa error broken image icon.
[2.5.0] - 2026-11-13
Changed & Optimized (Configured Subfolder /games for /public_html/games/ Match)
Penyesuaian Subfolder Menjadi /games:
Menyetel basePath: "/games" di next.config.ts agar presisi 100% dengan folder server /public_html/games/.
Mengubah prefix aset metadata & icon favicon menjadi /games/teknogame-icon.png?v=3 dan /games/favicon.ico?v=3.
Menyesuaikan iframe container GameFrame.tsx agar memuat engine game dari /games/games/[slug]/index.html.
Memperbarui panduan deployment di DEPLOY.md untuk mencerminkan folder /public_html/games/ dan .htaccess dengan RewriteBase /games/.
[2.4.0] - 2026-11-13
Added & Documented (Deployment Guide DEPLOY.md for Apache XAMPP & FileZilla)
Pembuatan Panduan Deployment Lengkap (DEPLOY.md):
Menjelaskan secara rinci bahwa yang di-deploy ke server adalah HASIL BUILD di dalam folder out/, bukan file mentah project (src/, node_modules/, dll).
Menyediakan panduan langkah demi langkah penggunaan FileZilla untuk meng-upload ke subfolder htdocs/game/ maupun root domain htdocs/.
Menyertakan konfigurasi template Apache .htaccess untuk client-side routing dan pencegahan error 404 pada saat refresh halaman.
Menyertakan checklist troubleshooting permission file, path URL basePath, dan cache buster browser.
[2.3.1] - 2026-11-13
Added & Configured (Subfolder Deployment /game for Apache htdocs/game)
Konfigurasi Subfolder BasePath /game:
Menyetel basePath: "/game" di next.config.ts sehingga seluruh rute internal (<Link>), routing navigasi, chunk JS, stylesheet CSS, dan aset statis otomatis diawali dengan prefix /game.
Memperbarui path iframe pada GameFrame.tsx agar memuat engine game HTML5 dari subfolder /game/games/[slug]/index.html.
Memperbarui tag <head> dan metadata favicon di layout.tsx agar menggunakan path /game/teknogame-icon.png?v=3 dan /game/favicon.ico?v=3.
Hasil kompilasi folder out/ kini siap di-upload ke dalam folder htdocs/game/ dan langsung dapat diakses sempurna melalui URL http://.../game.
[2.5.1] - 2026-11-13
Fixed (Header Logo Asset Path & Game Over Audio Loop Bug)
Perbaikan Audio Game Over (Anti-Loop & Sound Sekali Saja):
Memperbaiki bug di mana fungsi gameOver() terpanggil berulang kali (60x/detik) saat becak/karakter menabrak rintangan di becak-drift dan nusantara-runner.
Menambahkan guard clause if (!isPlaying) return; dan membatasi collision check di dalam blok isPlaying pada seluruh game mini HTML5.
Suara tabrakan game over kini berbunyi sekali saja dengan volume yang nyaman dan tidak berulang.
Perbaikan Logo Header TeknoGame di Subfolder /games/:
Mengubah path gambar <Image src="/games/teknogame-icon.png"> di Navbar.tsx dan Footer.tsx agar browser memuat logo langsung dari subfolder /games/ tanpa error broken image icon.
[2.5.0] - 2026-11-13
Changed & Optimized (Configured Subfolder /games for /public_html/games/ Match)
Penyesuaian Subfolder Menjadi /games:
Menyetel basePath: "/games" di next.config.ts agar presisi 100% dengan folder server /public_html/games/.
Mengubah prefix aset metadata & icon favicon menjadi /games/teknogame-icon.png?v=3 dan /games/favicon.ico?v=3.
Menyesuaikan iframe container GameFrame.tsx agar memuat engine game dari /games/games/[slug]/index.html.
Memperbarui panduan deployment di DEPLOY.md untuk mencerminkan folder /public_html/games/ dan .htaccess dengan RewriteBase /games/.
[2.4.0] - 2026-11-13
Added & Documented (Deployment Guide DEPLOY.md for Apache XAMPP & FileZilla)
Pembuatan Panduan Deployment Lengkap (DEPLOY.md):
Menjelaskan secara rinci bahwa yang di-deploy ke server adalah HASIL BUILD di dalam folder out/, bukan file mentah project (src/, node_modules/, dll).
Menyediakan panduan langkah demi langkah penggunaan FileZilla untuk meng-upload ke subfolder htdocs/game/ maupun root domain htdocs/.
Menyertakan konfigurasi template Apache .htaccess untuk client-side routing dan pencegahan error 404 pada saat refresh halaman.
Menyertakan checklist troubleshooting permission file, path URL basePath, dan cache buster browser.
[2.3.1] - 2026-11-13
Added & Configured (Subfolder Deployment /game for Apache htdocs/game)
Konfigurasi Subfolder BasePath /game:
Menyetel basePath: "/game" di next.config.ts sehingga seluruh rute internal (<Link>), routing navigasi, chunk JS, stylesheet CSS, dan aset statis otomatis diawali dengan prefix /game.
Memperbarui path iframe pada GameFrame.tsx agar memuat engine game HTML5 dari subfolder /game/games/[slug]/index.html.
Memperbarui tag <head> dan metadata favicon di layout.tsx agar menggunakan path /game/teknogame-icon.png?v=3 dan /game/favicon.ico?v=3.
Hasil kompilasi folder out/ kini siap di-upload ke dalam folder htdocs/game/ dan langsung dapat diakses sempurna melalui URL http://.../game.
[2.3.0] - 2026-11-13
Added & Optimized (Static HTML Export for Apache XAMPP / htdocs Deployment)
Konfigurasi Output Static Export (out/):
Mengubah konfigurasi next.config.ts menjadi output: "export" sehingga build menghasilkan bundle 100% statis (HTML, CSS, JS, dan aset game).
Mengimplementasikan generateStaticParams() pada rute src/app/play/[slug]/page.tsx dan src/app/category/[category]/page.tsx untuk pre-render seluruh halaman game dan kategori secara statis (SSG).
Folder output out/ kini dapat di-copy/upload langsung via FileZilla ke folder htdocs Apache XAMPP tanpa perlu instalasi Node.js runtime di server remote.
[2.2.0] - 2026-11-13
Added & Changed (All Promotional Links Connected to teknotama.com)
Integrasi Penuh Promosi ke teknotama.com:
Menghubungkan seluruh elemen promosi, slot iklan sponsor, dan backlink partner ke situs resmi https://teknotama.com (PT Teknotama Prakarsa Mulia).
AdBottomAnchor: Mengubah banner sticky sponsor bawah menjadi highlight solusi IT & layanan digital Teknotama dengan tombol aksi langsung ke teknotama.com.
AdCompanion (300x250) & Play Page Partner Card: Menampilkan promo layanan cloud system, data security, dan custom software development dari Teknotama di sebelah layar bermain game.
AdNativeTile: Menyesuaikan tile sponsor di dalam matriks game menjadi promosi resmi solusi IT Teknotama.
AdSkyscraper (160x600 Rails): Menyelaraskan promosi banner rel kiri (Solusi Jaringan & Cloud) dan kanan (Custom Software & Security) lengkap dengan tautan ke teknotama.com.
Navbar & Live Radar Ticker: Menambahkan badge partner 🌐 teknotama.com pada navbar desktop & drawer mobile, serta menyisipkan marquis promo solusi digital Teknotama pada ticker Live Radar.
Footer & Homepage Feature: Menambahkan kolom profil partner teknologi resmi PT Teknotama Prakarsa Mulia pada footer serta banner promosi akselerasi bisnis di beranda utama.
Penyelarasan Dokumentasi:
Memperbarui Design.md, PRD.md, dan UPDATE.md terkait integrasi promosi tunggal ke teknotama.com.
[2.1.1] - 2026-11-13
Fixed & Added (Tab Favicon Cache Refresh & Agent Workflow Policy)
Tab Favicon Cache Refresh & Head Injection:
Menginjeksi tag <head> eksplisit dengan cache-buster (/teknogame-icon.png?v=3 dan /favicon.ico?v=3) di src/app/layout.tsx untuk memastikan tab browser segera memperbarui favicon ke logo perisai TeknoGame.
Menimpa legacy travelista-logo-gram.png dengan logo resmi TeknoGame.
Workflow & Commit Policy Integration:
Menambahkan aturan wajib commit Git dan standar SemVer ke AGENTS.md agar setiap perubahan langsung tersimpan ke version control.
[2.1.0] - 2026-11-13
Added & Changed (Complete Brand Pivot to TeknoGame & Cyber Blue Theme)
Transformasi Identitas Brand ke TeknoGame:
Melakukan pivot menyeluruh dari portal Travelista Games menjadi TeknoGame (TEKNO GAME) dengan slogan resmi "PLAY. EVOLVE. CONQUER.".
Mengintegrasikan aset logo resmi TeknoGame_Logo.jpeg, memproses ikon perisai GT emblem untuk favicon.ico, icon.png, apple-icon.png, dan teknogame-icon.png.
Implementasi Sistem Palet Warna Cyber Blue & Dark Mode:
Mengubah tema dasar menjadi Deep Space Dark Mode (#070B14 void black, #0B1222 midnight navy, #0F172A card surface).
Mengadopsi aksen utama Neon Cyber Cyan (#00F0FF / #38BDF8) dan Electric Blue (#2563EB / #1D4ED8) dengan efek interaktif glow cyan pada hover kartu game.
Perombakan Total Komponen UI/UX:
Navbar: Header cyberpunk baru berlogo perisai GT menyala, navigasi arena kategori, dan tombol neon [ ⚡ Main Acak ] & [ 🏆 Hall of Fame ].
Breaking Ticker (Live Radar): Mengubah bar berita merah lama menjadi bar kaca navy gelap [ ⚡ LIVE RADAR ] dengan pulsing dot hijau menampilkan aktivitas online gamer.
Game Hero: Menghadirkan spotlight arena bertema Game of the Week dengan tombol CTA neon cyan-blue dan kartu trending bertumpuk.
Game Grid & Card (The Tekno Matrix): Kartu Friv dengan border sirkuit gelap yang menyala terang (cyan glow) saat di-hover.
Game Frame (Cyber Theater Mode): Layar bermain berbingkai neon dengan dock kontrol instan dan banner Game Over otomatis.
LeaderboardModal (Tekno Hall of Fame): Papan rekor pribadi bergaya ruang piala sirkuit digital berbasis LocalStorage tanpa latensi server.
Footer: Identitas TeknoGame, informasi fitur, dan penegasan privasi 100% bebas database.
Sponsor Ads: Memperbarui banner fallback companion, skyscraper, native tile, dan bottom anchor ke tema perlengkapan gaming futuristik.
Penyelarasan Seluruh Dokumentasi Proyek:
Memperbarui Design.md, PRD.md, newdesign.md, dan UPDATE.md di seluruh direktori proyek.
[2.0.0] - 2026-11-13
Changed & Removed (Zero-Database Architecture & 100% Static / LocalStorage)
Eliminasi Total Koneksi & Modul Database:
Menghapus dependency driver mysql2 dari package.json dan membersihkan node_modules.
Menghapus modul pool koneksi database src/lib/db.ts.
Menghapus seluruh variabel lingkungan database (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) dari file .env.local dan .env.example.
Penghapusan Fitur & Route Handler Berbasis Database:
Menghapus direktori backend route handlers src/app/api/ (/api/games, /api/leaderboard, dan /api/stats).
Menghilangkan network request tracker statistik fetch('/api/stats') pada saat game dibuka di GameFrame.tsx.
Menghilangkan form input nickname & submission score fetch('/api/leaderboard') di GameFrame.tsx.
Refactoring Leaderboard ke 100% Client-Side LocalStorage:
Mengubah LeaderboardModal.tsx menjadi modal "Papan Rekor & Prestasi Pribadi" yang memuat skor terbaik langsung dari LocalStorage browser secara instan tanpa loading spinner atau latensi server.
Menambahkan visualisasi ringkasan rekor (total game dimainkan, skor tertinggi, medali juara, dan tombol main lagi).
Menambahkan utilitas clearLocalScores() di src/lib/local-storage.ts agar pemain dapat mereset rekor lokal secara mandiri.
Memperbarui tampilan Game Over banner pada layar game agar langsung menampilkan skor akhir dan konfirmasi penyimpanan ke browser.
Pembaruan Dokumen PRD ke Versi 2.0.0:
Menyelaraskan seluruh dokumen PRD.md (root dan game/PRD.md) dengan arsitektur 100% Database-Free, menghilangkan langkah setup MariaDB di DirectAdmin Hostdata.id, dan menghapus skema tabel SQL yang sudah tidak digunakan.
[1.5.1] - 2026-11-05
Changed & Fixed (Web Title & Official Favicon)
Web Title Optimization: Mengubah metadata title tab browser menjadi ringkas dan tepat: Travelista Games (menghilangkan suffix deskripsi panjang pada tab title).
Official Brand Favicon (Logo Gram): Mengganti favicon bawaan Next.js "N" dengan ikon resmi travelista-logo-gram.png (emblem lingkaran 'T' Travelista) untuk favicon.ico, icon.png, dan apple-icon.png, sehingga tab browser menampilkan logo resmi Travelista secara tajam dan konsisten.
[1.5.0] - 2026-11-03
Added & Changed (Zero-Asset Games & No More Duplicates)
Eliminasi Game Duplikat / Placeholder: Menghapus seluruh link fallback duplikat pada 9 game kemarin dan menggantinya dengan implementasi game mandiri.
Implementasi 8 Game Baru dari list-game2.md:
becak-drift (/games/becak-drift/): Top-down micro racing & drift becak Malioboro Jogja.
candi-stacker (/games/candi-stacker/): Precision tower stacker balok andesit Candi Borobudur dengan audio gamelan.
batik-flow (/games/batik-flow/): Rotating pipe puzzle sambung ukiran lilin malam canting kain batik mori.
layangan-sanur (/games/layangan-sanur/): Action tension battle layangan aduan bebean di Pantai Sanur Bali.
kopi-klotok (/games/kopi-klotok/): Rhythm barista menyeduh tetesan kopi & biji panggang di cangkir tanah liat.
lembah-bromo (/games/lembah-bromo/): Momentum flight paralayang menukik melintasi bukit pasir Bromo.
pasar-terapung (/games/pasar-terapung/): Falling fruit catcher perahu jukung di Sungai Martapura Banjarmasin.
kamus-kelana (/games/kamus-kelana/): Word connect & teka-teki silang kosakata destinasi pariwisata nusantara.
100% Unique Game Pathing: Setiap game pada katalog utama kini memiliki direktori dan entry point mandiri (/games/[slug]/index.html), sehingga saat diklik tidak akan membuka game yang salah.
Enhanced Friv Card Icons: Menambahkan mapping ikon tematik unik untuk setiap game agar tampilan grid Friv semakin semarak dan mudah dikenali.
[1.4.0] - 2026-11-02
Added & Changed
Official Brand Logo Asset: Mengganti logo teks di Navbar.tsx dan Footer.tsx dengan aset gambar resmi travelista-logo-light.png beresolusi tajam.
Direct Portal Hyperlink: Menghubungkan klik logo langsung mengarah ke portal utama https://travelista.id.
Badge GAMES Retention: Mempertahankan pill badge merah tebal GAMES di samping kanan logo gambar.
[1.3.2] - 2026-11-02
Fixed
Hydration Mismatch Fix: Menambahkan atribut suppressHydrationWarning pada tag <html> dan <body> di layout.tsx untuk mencegah crash hidrasi akibat injeksi atribut ekstensi Chrome (Grammarly, ColorZilla).
Tailwind Source Scanning: Menambahkan direktif @source di globals.css untuk memastikan PostCSS memindai seluruh direktori komponen secara menyeluruh.
Cache Clean-up: Membersihkan cache stale di .next dan melakukan build ulang yang sukses menghasilkan stylesheet 58.3 KB.
[1.3.1] - 2026-11-02
Fixed
Webpack & PostCSS Compatibility Patch:
Mengubah script dev dan build di package.json untuk menyertakan flag --webpack karena platform Windows host tidak memuat native binary SWC Turbopack.
Menginstal package pendukung @tailwindcss/postcss dan postcss.
Membuat file konfigurasi postcss.config.mjs untuk memproses @import "tailwindcss"; pada mode Webpack.
[1.3.0] - 2026-11-02
Added (Full System & Game MVP Implementation)
Implementasi Frontend Next.js 16 + Tailwind CSS v4:
Desain sistem lengkap sesuai token Design.md.
Navbar 2-Tier: Main Bar (Logo, navigasi kategori, tombol pencarian, selector bahasa, dual pills Main Acak dan Leaderboard) + Sub-bar Ticker Merah dengan animasi marquis berjalan.
Monetisasi & Ad Placements: Skyscraper Kiri-Kanan (160x600 untuk layar >= 1440px), Sticky Bottom Anchor Ad (728x90/320x50 dengan tombol minimize collapse), In-Grid Native Ad Tile, dan Companion Ad 300x250.
Katalog Game Friv-Style: Hero section 3 game unggulan, chip filter kategori "Jelajahi", dan grid dinamis ubin game responsif.
Layar Gameplay (/play/[slug]): Iframe runner sandbox, kontrol Layar Penuh (Fullscreen), Reload, Simpan Favorit, Bagikan Link, dan panduan tombol kendali keyboard/touch.
3 Game HTML5 Internal Siap Main:
nusantara-runner (Endless runner 2D melintasi Malioboro, Bromo, Bali).
kapal-feri (Simulasi nakhoda feri Merak-Bakauheni dengan fisika ombak laut).
packing-master (Puzzle drag-and-drop menata koper bagasi).
Interaksi Skor postMessage: Setiap game HTML5 mengirimkan event skor saat game over ke portal Next.js.
Hybrid Data Storage: Penyimpanan skor dan favorit di LocalStorage + modul API route /api/leaderboard, /api/games, dan /api/stats dengan pool koneksi database MariaDB / MySQL.
[1.2.0] - 2026-11-02
Added
Spesifikasi Struktur Direktori Lengkap: Pemetaan arsitektur folder dan file di PRD.md (komponen layout, iklan, game, lib database, public games, dan types).
Standalone Build Target: Konfigurasi Next.js output: "standalone" untuk mendukung CloudLinux Node.js Selector di DirectAdmin Hostdata.id.
[1.1.0] - 2026-11-02
Added
Spesifikasi Server Hostdata.id & Database:
Penyesuaian arsitektur untuk DirectAdmin, LiteSpeed Web Server, CloudLinux CageFS, dan Node.js v20.20.2 LTS.
Skema database MariaDB 10.11 / MySQL lokal dengan nama database immanuel_travelista_game.
Prosedur delegasi DNS A Record subdomain game.travelista.id.
[1.0.0] - 2026-11-02
Added (Initial Blueprint & Specification Release)
Design System (Design.md): Token warna, blueprint navbar 2-tier, aturan slot iklan AdSense / Better Ads Standards, dan grid katalog ala Friv.
Konsep Game (List-Game.md): Brainstorming 12 konsep game mini bertema wisata, kuliner, dan transportasi nusantara beserta use case dan spesifikasi teknis HTML5.
Product Requirements Document (PRD.md): Dokumen spesifikasi kebutuhan produk, arsitektur sistem, dan roadmap peluncuran.





### [2026-11-24 20:38] - [Frontend] - Efek Hover Konsisten pada Navbar
- **Kondisi Sebelum:** Hanya tombol Main Acak yang punya state hover/fokus coral khusus dark mode; item navbar lain memakai efek berbeda.
- **Perubahan Sesudah:** Semua tautan dan tombol navbar memakai latar coral serta teks/ikon hitam pada hover/fokus dark mode, kecuali switch tema dan bahasa.
- **Masalah yang Ditemukan:** Efek kursor tidak seragam dan ikon beberapa item kurang terlihat.
- **Penyelesaian:** Memperluas selector dark mode untuk interaksi navbar dan mengecualikan kontrol beratribut aria-pressed.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 20:22] - [Frontend] - Warna Teks Dimulai Di Sini Konsisten
- **Kondisi Sebelum:** Highlight teks memakai warna putih di atas latar merah.
- **Perubahan Sesudah:** Teks memakai warna #D9141D secara konsisten di light dan dark mode tanpa latar highlight.
- **Masalah yang Ditemukan:** Gaya sebelumnya tidak sesuai warna yang diminta.
- **Penyelesaian:** Mengatur warna foreground dan text fill pada selector hero yang sama untuk kedua tema.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 20:05] - [Frontend] - Warna Konsisten Frasa Dimulai Di Sini
- **Kondisi Sebelum:** Frasa pada judul hero berganti dari merah gelap ke coral antara light dan dark mode.
- **Perubahan Sesudah:** Frasa memakai Snow White di atas highlight merah Teknotama yang konsisten pada kedua tema.
- **Masalah yang Ditemukan:** Warna tema sebelumnya berubah saat berganti mode.
- **Penyelesaian:** Menetapkan warna teks dan latar highlight di rule bersama serta menghapus override dark mode khusus.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 19:47] - [Frontend] - Kontras Hover Main Acak Navbar
- **Kondisi Sebelum:** Ikon Main Acak berwarna abu statis dan kurang terlihat saat hover di dark mode.
- **Perubahan Sesudah:** Tombol memakai latar coral dengan teks serta ikon hitam saat hover dan fokus keyboard di dark mode.
- **Masalah yang Ditemukan:** Warna ikon statis tidak menyesuaikan warna hover tombol.
- **Penyelesaian:** Menambahkan class tombol dan aturan tema khusus untuk hover/focus-visible beserta ikon.
- **File Terdampak:** `src/components/layout/Navbar.tsx`, `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 19:32] - [Frontend] - Kontras Tombol Lihat yang Populer saat Hover
- **Kondisi Sebelum:** Saat hover di light mode, tombol berubah berlatar putih dan teksnya juga putih sehingga tidak terbaca.
- **Perubahan Sesudah:** Teks dan ikon tombol memakai warna gelap pada hover light mode; dark mode tetap mengikuti aturan teks terang.
- **Masalah yang Ditemukan:** Warna hover dari utility text-white bertabrakan dengan latar hover putih.
- **Penyelesaian:** Menetapkan warna teks eksplisit pada aturan hover tombol hero di light mode.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 19:18] - [Frontend] - Kontras Kotak Isi Light Mode
- **Kondisi Sebelum:** Kotak informasi pada kartu detail game di light mode menggunakan warna yang sama dengan panel sehingga batas dan isinya kurang terlihat.
- **Perubahan Sesudah:** Kotak memperoleh tint merah tipis dan garis pembatas lembut; teks tetap gelap untuk kontras.
- **Masalah yang Ditemukan:** Aturan tema terang menimpa latar g-black/20 dengan Snow White.
- **Penyelesaian:** Memisahkan aturan kotak isi dari aturan tombol dan memberi latar merah transparan khusus untuk kotak tersebut.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 19:05] - [Frontend] - Warna Tautan Teknotama di Navbar Dark Mode
- **Kondisi Sebelum:** Teks dan ikon pada tombol teknotama.com tetap gelap di light dan dark mode.
- **Perubahan Sesudah:** Saat dark mode, latar tombol merah dan teks serta ikon menjadi Snow White; light mode mempertahankan teks gelap.
- **Masalah yang Ditemukan:** Warna teks pada tautan tidak berbeda antartema.
- **Penyelesaian:** Menambahkan override tema gelap pada tombol sponsor navbar dengan kombinasi merah dan putih yang kontras.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 18:45] - [Frontend] - Tipografi Website Lebih Jelas dan Konsisten
- **Kondisi Sebelum:** Judul, isi, dan kontrol memakai kombinasi Space Grotesk, Plus Jakarta Sans, Georgia, serta monospace dengan tracking lebar.
- **Perubahan Sesudah:** Font sistem Segoe UI/system-ui dipakai pada judul, isi, dan kontrol; monospace hanya tersedia untuk utilitas kode. Judul memakai kapitalisasi normal.
- **Masalah yang Ditemukan:** Build gagal saat mencoba mengambil Inter dari Google Fonts karena koneksi jaringan ditolak.
- **Penyelesaian:** Menghapus kebutuhan unduh font dan memakai font sistem lokal agar build bisa berjalan offline; tracking kontrol dikurangi.
- **File Terdampak:** `src/app/layout.tsx`, `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 18:32] - [Frontend] - Tampilan Ringkas Peringkat 2–5
- **Kondisi Sebelum:** Baris peringkat 2–5 menampilkan thumbnail besar dan angka skor dengan ukuran besar.
- **Perubahan Sesudah:** Thumbnail dihapus, nomor peringkat dan nama game tetap ditampilkan, sementara angka poin diperkecil agar lebih proporsional.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Merapikan layout daftar skor pada section papan rekor.
- **File Terdampak:** `src/app/page.tsx`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 18:22] - [Frontend] - Samakan Sumber Gambar Papan Rekor dengan Katalog
- **Kondisi Sebelum:** Kartu peringkat pertama hanya mencoba satu URL thumbnail dan berakhir pada artwork fallback ketika URL tidak tersedia.
- **Perubahan Sesudah:** Papan rekor memakai urutan kandidat gambar dan fallback yang sama seperti kartu katalog, mencakup file WebP dan preview PNG.
- **Masalah yang Ditemukan:** URL thumbnail tunggal tidak cocok dengan aset yang berhasil dipakai katalog.
- **Penyelesaian:** Menambahkan fallback URL berdasarkan slug di komponen artwork papan rekor untuk peringkat pertama dan daftar peringkat.
- **File Terdampak:** `src/app/page.tsx`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 18:12] - [Frontend] - Gambar Game Peringkat Tertinggi di Papan Rekor
- **Kondisi Sebelum:** Kartu peringkat pertama menerima URL thumbnail placeholder dari data game sehingga gambar tidak muncul.
- **Perubahan Sesudah:** URL gambar dibuat dari slug game pada skor tertinggi untuk memuat thumbnail yang sesuai.
- **Masalah yang Ditemukan:** Metadata thumbnail memiliki path placeholder.
- **Penyelesaian:** Menggunakan path /images/games/{slug}.webp dari ID/slug game saat menyiapkan skor lokal.
- **File Terdampak:** `src/app/page.tsx`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 18:02] - [Frontend] - Padding Bagian Papan Rekor
- **Kondisi Sebelum:** Header papan rekor memiliki garis bawah dan padding lebar sebelum konten skor.
- **Perubahan Sesudah:** Garis dihapus dan padding serta jarak konten dirapatkan, konsisten dengan bagian permainan favorit.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Menyamakan kelas styling section papan rekor dengan section favorit.
- **File Terdampak:** `src/app/page.tsx`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 17:55] - [Frontend] - Padding Bagian Permainan Favorit
- **Kondisi Sebelum:** Header favorit memiliki garis bawah dan jarak/padding lebar sebelum daftar game.
- **Perubahan Sesudah:** Garis dihapus, padding kartu dipersempit, dan jarak antara header dengan konten dirapatkan.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Mengubah kelas styling pada section favorit.
- **File Terdampak:** `src/app/page.tsx`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 17:48] - [Frontend] - Penyamaan Warna Main Acak Footer
- **Kondisi Sebelum:** Tombol Main Acak mewarisi warna merah gelap berbeda dari aksen tautan footer.
- **Perubahan Sesudah:** Warna tombol dan hover disamakan dengan aksen footer serta tetap kontras di kedua tema.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Menambahkan aturan CSS khusus footer untuk state normal dan hover.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 17:42] - [Frontend] - Footer Hitam dan Pengurangan Warna Krem
- **Kondisi Sebelum:** Footer memakai permukaan abu terang dan beberapa state umum memakai warna krem.
- **Perubahan Sesudah:** Footer memakai #101010 dengan teks #FFFAFA, teks sekunder abu terang, serta tombol dan tautan beraksen merah; warna krem di elemen umum diganti Snow White. Krem tetap dipakai pada papan rekor sesuai palet.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Memperbarui token dan aturan CSS footer untuk kedua tema serta warna permukaan state interaksi.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 17:42] - [Frontend] - Footer Hitam dan Pengurangan Warna Krem
- **Kondisi Sebelum:** Footer memakai permukaan abu terang dan beberapa state umum memakai warna krem.
- **Perubahan Sesudah:** Footer memakai #101010 dengan teks #FFFAFA, teks sekunder abu terang, serta tombol dan tautan beraksen merah; warna krem di elemen umum diganti Snow White. Krem tetap dipakai pada papan rekor sesuai palet.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Memperbarui token dan aturan CSS footer untuk kedua tema serta warna permukaan state interaksi.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 17:33] - [Frontend] - Penyelarasan Palet Warna Teknotama
- **Kondisi Sebelum:** Palet website menggunakan abu kemerahan dan aksen pink yang belum mengikuti identitas warna Teknotama.
- **Perubahan Sesudah:** Mengatur token light/dark, latar, teks, garis, aksen merah #D9141D, hover, serta highlight papan rekor #F5EDDA agar kontras tetap jelas.
- **Masalah yang Ditemukan:** File game/UPDATE.md belum tersedia pada struktur project.
- **Penyelesaian:** Menambahkan catatan pembaruan pada UPDATE.md dan membuat game/UPDATE.md sebagai log versi khusus game sesuai workflow.
- **File Terdampak:** `src/app/globals.css`, `UPDATE.md`, `game/UPDATE.md`, `laporan.md`

### [2026-11-24 09:30] - [Frontend] - Penyesuaian Warna Ikon Kategori di Bawah Game agar Seragam dengan Navbar
- **Kondisi Sebelum:**
  1. Ikon kategori pada bilah kontrol di bawah iframe game (`GameFrame.tsx`) menggunakan prop `variant="dark"` secara statis.
  2. Saat mode terang, ikon tetap berwarna terang/pudar (misalnya hijau mint `#6ee7b7` untuk Adventure) sehingga kontrasnya rendah dan tidak serasi dengan ikon kategori di navbar (`#047857`).
- **Perubahan Sesudah:**
  1. Menghapus prop `variant="dark"` pada `CategoryIcon` di `GameFrame.tsx` dan `PlayPageView.tsx`, sehingga warnanya otomatis adaptif sesuai tema: menggunakan `--category-icon-light` saat light mode dan `--category-icon-dark` saat dark mode persis seperti di navbar kategori.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Memperbarui pemanggilan komponen `CategoryIcon` dan memverifikasi build.
- **File Terdampak:** `src/components/game/GameFrame.tsx`, `src/components/game/PlayPageView.tsx`, `UPDATE.md`, `laporan.md`

### [2026-11-24 09:22] - [Frontend] - Penyesuaian Spasi di Atas Permainan Lainnya Untuk Anda
- **Kondisi Sebelum:**
  1. Pada halaman gameplay (`/play/[slug]`), terdapat jarak vertikal kosong yang lebar (~40px) di antara kartu gameplay/informasi dan judul "Permainan Lainnya Untuk Anda" / "More Games For You" akibat kombinasi `space-y-6` pada kontainer utama dan padding section.
- **Perubahan Sesudah:**
  1. Menggunakan class `.play-page-recommendations` dengan `margin-top: 6px !important` dan `padding-top: 0 !important` serta inline style penjamin pada section di `PlayPageView.tsx` agar margin bawaan `space-y-6` tidak memaksa jarak berlebih.
  2. Memastikan `GoogleAdSlot` hanya dirender bersyarat jika `adSlot` terisi sehingga tidak menyisakan ruang kosong.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Menambahkan class spesifik di `globals.css` dan memperbarui `PlayPageView.tsx`.
- **File Terdampak:** `src/components/game/PlayPageView.tsx`, `src/app/globals.css`, `UPDATE.md`, `laporan.md`

### [2026-11-24 09:00] - [Frontend] - Perbaikan Kontras Teks Judul Breadcrumb pada Dark Mode
- **Kondisi Sebelum:**
  1. Pada halaman gameplay (`/play/[slug]`) dan kategori (`/category/[category]`), teks judul terakhir pada jejak navigasi / breadcrumb (misalnya "Nusantara Runner: Escape to Bali", "Kapal Feri", dll.) berwarna hitam (`#161616`) karena aturan statis `main nav[aria-label="Jejak navigasi"] > span:last-child { color: #161616; }` di `globals.css` tanpa override dark mode.
  2. Saat dark mode aktif dengan background gelap (`#17181c`), teks judul menjadi hitam di atas background hitam sehingga tidak terbaca / tidak terlihat sama sekali.
- **Perubahan Sesudah:**
  1. Mengubah aturan di `src/app/globals.css` agar memakai `var(--ink)` untuk light mode, serta menambahkan selector dark mode `html[data-theme="dark"] main nav[aria-label*="navigasi"] > span:last-child` dengan warna terang `#f3f4f6 !important`.
  2. Memperbarui `PlayPageView.tsx` dan `CategoryView.tsx` dengan class utilitas adaptif `text-slate-900 dark:text-slate-100`.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Memperbarui CSS selector di `globals.css` dan komponen terkait, lalu memverifikasi build static page.
- **File Terdampak:** `src/app/globals.css`, `src/components/game/PlayPageView.tsx`, `src/components/game/CategoryView.tsx`, `UPDATE.md`, `laporan.md`

### [2026-11-24 14:02] - [Games] - Responsivitas Badge Role HUD & Peningkatan Kapasitas Room Werewolf ke 30 Pemain
- **Kondisi Sebelum:**
  1. `.hud-left` di `public/games/werewolf/styles.css` belum memiliki `flex-wrap: wrap`, sehingga di layar sempit badge `#hudMyRoleBadge` berisiko terpotong.
  2. Batas maksimal pemain dalam satu room Werewolf adalah 15 orang.
- **Perubahan Sesudah:**
  1. Menambahkan `flex-wrap: wrap` pada `.hud-left` dan `flex-shrink: 0` pada `.hud-right` agar badge peran `#hudMyRoleBadge` selalu tampil utuh di layar selama permainan berlangsung.
  2. Menaikkan batas maksimal pemain dari 15 menjadi 30 pemain pada mode online (`online-supabase.js`), offline (`offline-engine.js`), dan teks UI/i18n (`index.html`).
- **Masalah yang Ditemukan:** Validasi sintaks JS semua skrip Werewolf lulus.
- **Penyelesaian:** Menyesuaikan CSS flex-wrap HUD dan konstanta batas maksimal pemain.
- **File Terdampak:** `public/games/werewolf/styles.css`, `public/games/werewolf/online-supabase.js`, `public/games/werewolf/offline-engine.js`, `public/games/werewolf/index.html`, `UPDATE.md`, `laporan.md`

### [2026-11-24 13:59] - [Games] - Pembagian Kartu Langsung ke Semua Pemain Werewolf Online
- **Kondisi Sebelum:**
  1. Pemilihan kartu bergiliran 1-by-1 berisiko gagal mengunci kartu bila terjadi konflik CAS saat auto-pick (`autoPickHandledTurnKey` terkunci sebelum retry berhasil), sehingga ada pemain yang tetap tidak mendapat kartu.
- **Perubahan Sesudah:**
  1. Mengubah `startOnlineGame()` di `public/games/werewolf/online-supabase.js` agar langsung membagikan 1 kartu acak unik ke setiap pemain saat permainan dimulai.
  2. `renderOnlineCardPick()` langsung menampilkan kartu peran milik masing-masing pemain (`is-mine`), deskripsi peran, tombol `Saya Siap` dengan penghitung sisa pemain belum siap, dan timer auto-ready 15 detik.
- **Masalah yang Ditemukan:** Validasi sintaks JS `online-supabase.js` lulus.
- **Penyelesaian:** Menghilangkan fase rebutan/antrean tulis DB saat pembagian kartu online.
- **File Terdampak:** `public/games/werewolf/online-supabase.js`, `UPDATE.md`, `laporan.md`

### [2026-11-24 13:23] - [Games] - Pemilihan Kartu Werewolf Online Bergiliran 1-by-1 (3 Detik/Pemain)
- **Kondisi Sebelum:**
  1. Seluruh pemain memilih kartu secara bersamaan dengan timer global 30 detik.
- **Perubahan Sesudah:**
  1. Mengubah fase `card_pick` di `public/games/werewolf/online-supabase.js` menjadi bergiliran 1-by-1 sesuai urutan pemain masuk room (`card_pick_turn_index`).
  2. Setiap pemain mendapat timer 3 detik (`card_pick_turn_start_time`); jika melewati 3 detik belum memilih, kartu tersisa otomatis dipilihkan (`auto-pick`) dengan fallback Host pada detik ke-4 agar antrean tidak macet.
  3. Menambahkan teks status giliran aktif di `public/games/werewolf/index.html` (ID/EN).
- **Masalah yang Ditemukan:** Validasi sintaks JS `index.html` dan `online-supabase.js` lulus.
- **Penyelesaian:** Mengelola giliran dan reset timestamp per giliran di dalam `updateRoomStateAtomically`.
- **File Terdampak:** `public/games/werewolf/online-supabase.js`, `public/games/werewolf/index.html`, `UPDATE.md`, `laporan.md`

### [2026-11-24 12:38] - [Games] - Popup Peran In-Game, Counter Belum Siap, dan Perbaikan Desync Voting Werewolf
- **Kondisi Sebelum:**
  1. Badge peran di HUD belum memiliki popup detail deskripsi peran saat diklik.
  2. Status menunggu di fase pilih kartu belum menunjukkan berapa orang lagi yang belum menekan tombol Siap.
  3. Saat voting, perbedaan kondisi `undefined` vs `null` pada `p.vote`, tidak adanya guard `status !== 'day_voting'`, polling yang hanya mengecek `updated_at`, serta penghapusan room 10 detik setelah Game Over menyebabkan sebagian pemain sudah selesai sementara pemain lain masih tertahan di layar voting.
- **Perubahan Sesudah:**
  1. Mengubah `#hudMyRoleBadge` menjadi tombol interaktif yang membuka `#roleInfoModal` (ikon, nama, dan deskripsi peran) sepanjang permainan.
  2. Menampilkan sisa pemain yang belum siap pada tombol menunggu di `renderOnlineCardPick` (`waiting_other_players_count`) dan sisa pemain yang belum memilih di `renderOnlineDayVoting` (`vote_submitted_count`).
  3. Menambahkan guard `status !== 'day_voting'` dan `isSubmittingVote` di `submitVoteOnline`, pengecekan ketat `vote !== null && vote !== undefined`, preservasi pilihan target saat polling, pengecekan `room.status !== currentRoomData.status` di `startRoomPolling`, serta menghentikan polling dan menunda `deleteCurrentRoom` menjadi 30 detik sekali jalan di `renderOnlineGameOver`.
- **Masalah yang Ditemukan:** Validasi sintaks JS seluruh skrip Werewolf lulus.
- **Penyelesaian:** Menyelaraskan sinkronisasi state voting dan UI popup peran di `index.html`, `app.js`, dan `online-supabase.js`.
- **File Terdampak:** `public/games/werewolf/index.html`, `public/games/werewolf/app.js`, `public/games/werewolf/online-supabase.js`, `UPDATE.md`, `laporan.md`

### [2026-11-24 12:24] - [Games] - Perbaikan Seer Auto-Close, Indikator & Timer Pick Card, Rekap Voting, dan Role HUD Werewolf
- **Kondisi Sebelum:**
  1. Saat giliran Seer, polling 1.2 detik memanggil `renderOnlineNight` berulang kali dan mengosongkan daftar target serta menyembunyikan hasil terawangan Seer.
  2. Kartu yang sudah diambil pemain memiliki kelas `taken` sehingga tampak redup, dan belum ada tampilan kuota sisa kartu maupun timer auto-pick.
  3. Setelah semua pemain selesai voting, game langsung lompat ke malam berikutnya tanpa menampilkan jumlah suara tiap pemain dan siapa yang tereliminasi.
  4. HUD atas belum menampilkan peran pemain selama permainan berlangsung.
- **Perubahan Sesudah:**
  1. Menambahkan guard `lastRenderedNightKey` di `renderOnlineNight` serta memigrasikan `submitNightAction` dan `advanceNightStep` ke `updateRoomStateAtomically`.
  2. Menambahkan kelas `.is-mine` + badge `MILIKMU`/`YOURS`, nama pengambil kartu di bagian belakang kartu terambil, badge kuota terpilih/sisa kartu (`#cardPickQuotaBadge`), serta timer 30 detik dengan auto-pick & auto-ready saat waktu habis.
  3. Menambahkan layar `#screenVoteResult` (`day_vote_result`) yang menampilkan rekapitulasi suara setiap pemain dan pemain yang tereliminasi sebelum masuk ke malam/game over.
  4. Menambahkan badge peran `#hudMyRoleBadge` pada HUD atas melalui `WerewolfApp.setHudRole(role)`.
- **Masalah yang Ditemukan:** Validasi sintaks JS semua skrip Werewolf lulus.
- **Penyelesaian:** Menyelaraskan state sinkronisasi online dan UI layar baru dalam `index.html`, `styles.css`, `app.js`, `online-supabase.js`, dan `offline-engine.js`.
- **File Terdampak:** `public/games/werewolf/index.html`, `public/games/werewolf/styles.css`, `public/games/werewolf/app.js`, `public/games/werewolf/online-supabase.js`, `public/games/werewolf/offline-engine.js`, `UPDATE.md`, `laporan.md`

### [2026-11-24 12:04] - [Games] - Perbaikan Bug Race Condition Pick Card Werewolf Online
- **Kondisi Sebelum:**
  1. `pickCardAtomically` dan `syncPlayerReadyState` di `public/games/werewolf/online-supabase.js` langsung menimpa kolom JSONB `game_state` menggunakan cache lokal tanpa membaca state terbaru atau mengecek versi `updated_at`.
  2. Ketika banyak pemain memilih kartu atau menekan "Saya Siap" hampir bersamaan, update saling menimpa (lost update) sehingga pemain lain kehilangan kartu atau kehabisan kartu yang bisa dipilih.
- **Perubahan Sesudah:**
  1. Menambahkan helper `updateRoomStateAtomically` yang membaca `game_state` dan `updated_at` terbaru, memvalidasi ulang ketersediaan kartu/pemain, lalu melakukan update CAS (`.eq('updated_at', freshRow.updated_at)`) dengan retry otomatis jika terjadi konflik.
  2. Menerapkan `isPickingCard` lock untuk mencegah klik ganda saat memilih kartu, serta memakai `updateRoomStateAtomically` pada `syncPlayerReadyState`.
- **Masalah yang Ditemukan:** Validasi sintaks JS `online-supabase.js` lulus.
- **Penyelesaian:** Menyerahkan serialisasi penulisan `game_state` ke CAS `updated_at` di Supabase tanpa perlu perubahan skema SQL.
- **File Terdampak:** `public/games/werewolf/online-supabase.js`, `UPDATE.md`, `laporan.md`

### [2026-11-24 08:20] - [Backend / Server Config] - Perbaikan 403 Forbidden pada /games/manage-games/ di .htaccess
- **Kondisi Sebelum:**
  1. Next.js static export menghasilkan `manage-games.html` sekaligus folder `manage-games/` (berisi payload RSC tanpa `index.html`).
  2. Di `public/.htaccess`, rule rewrite `.html` memakai `RewriteCond %{REQUEST_FILENAME} !-d`, sehingga saat user membuka `/games/manage-games/` (yang merupakan folder fisik tanpa `index.html`), rewrite dilewati dan `Options -Indexes` memicu `403 Forbidden`.
- **Perubahan Sesudah:**
  1. Memperbarui `public/.htaccess` agar me-rewrite `^(.+?)/?$` ke `/games/$1.html` selama bukan file fisik (`!-f`) dan file `$1.html` tersedia.
- **Masalah yang Ditemukan:** Tidak ada.
- **Penyelesaian:** Memperbarui rule di `public/.htaccess` dan mencatat agar file `.htaccess` ikut di-upload ulang ke server setelah `npm run build`.
- **File Terdampak:** `public/.htaccess`, `UPDATE.md`, `laporan.md`

### [2026-11-24 08:11] - [Frontend] - Konversi Preview ke WebP Menyeluruh & Pengurangan Efek Blur GPU di Hero
- **Kondisi Sebelum:**
  1. `GameHero.tsx` dan `thumbnailUrl` di `games-data.ts` masih menggunakan `.png` (`/games/<slug>/preview.png`).
  2. `GameHero.tsx` memakai dua layer `blur-[120px]` besar serta beberapa `backdrop-blur-md` yang membebani rendering GPU/CPU mobile.
- **Perubahan Sesudah:**
  1. Mengarahkan sumber preview di `GameHero.tsx` dan `thumbnailUrl` di `src/lib/games-data.ts` ke `/games/images/games/<slug>.webp` (dengan fallback ke `.png` di `GameHero.tsx`).
  2. Mengganti dua elemen `blur-[120px]` di `GameHero.tsx` menjadi `radial-gradient` CSS biasa dan menghilangkan `backdrop-blur` berlapis pada badge/footer kartu Hero.
- **Masalah yang Ditemukan:** `npx tsc --noEmit` lulus tanpa error.
- **Penyelesaian:** Memverifikasi TypeScript dengan `npx tsc --noEmit` dan melakukan commit sesuai workflow.
- **File Terdampak:** `src/components/game/GameHero.tsx`, `src/lib/games-data.ts`, `UPDATE.md`, `laporan.md`

### [2026-11-24 08:05] - [Frontend] - Perbaikan Hydration Mismatch pada Head AdSense & Urutan Game Beranda
- **Kondisi Sebelum:**
  1. `<script async src="...adsbygoogle.js">` di dalam `<head>` pada `layout.tsx` menyuntikkan skrip `show_ads_impl` sebelum React hydration selesai sehingga memicu *Hydration failed* pada `<head>`.
  2. `useState` di `src/app/page.tsx` memanggil `getCachedGameOrder()` (`localStorage`) saat render awal sehingga urutan kartu Hero berbeda antara server (`nusantara-runner`) dan client (`werewolf`).
- **Perubahan Sesudah:**
  1. Mengganti loader AdSense di `layout.tsx` menggunakan `next/script` (`strategy="afterInteractive"`) di dalam `<body>`.
  2. Menginisialisasi `games` di `src/app/page.tsx` dengan `INITIAL_GAMES` lalu menerapkan `getCachedGameOrder()` di dalam `useEffect`.
- **Masalah yang Ditemukan:** `npx tsc --noEmit` lulus tanpa error; `npm run build` di sandbox tetap terkendala jaringan untuk Google Fonts.
- **Penyelesaian:** Memverifikasi TypeScript dengan `npx tsc --noEmit` dan melakukan commit perubahan.
- **File Terdampak:** `src/app/layout.tsx`, `src/app/page.tsx`, `UPDATE.md`, `laporan.md`

### [2026-11-24 08:02] - [Frontend] - Sembunyikan Placeholder Slot Iklan Sementara (Mode Auto Ads)
- **Kondisi Sebelum:**
  1. Ketika `NEXT_PUBLIC_ADSENSE_CLIENT_ID` dan `NEXT_PUBLIC_ADSENSE_SLOT_*` masih kosong, `GoogleAdSlot.tsx` dan `AdBottomAnchor.tsx` tetap menampilkan kotak placeholder *"Slot Google AdSense"* ke pengunjung.
- **Perubahan Sesudah:**
  1. Menambahkan early return `null` di `GoogleAdSlot.tsx` saat `client` atau `slot` kosong, serta di `AdBottomAnchor.tsx` saat `NEXT_PUBLIC_ADSENSE_CLIENT_ID` atau `NEXT_PUBLIC_ADSENSE_SLOT_ANCHOR` kosong.
  2. Script Google AdSense Auto Ads di `layout.tsx` dan `public/ads.txt` tetap aktif tanpa perubahan.
- **Masalah yang Ditemukan:** `npx tsc --noEmit` lulus; `npm run build` di sandbox tetap terkendala jaringan untuk Google Fonts (`ENOTFOUND fonts.googleapis.com`).
- **Penyelesaian:** Memverifikasi TypeScript dengan `npx tsc --noEmit` dan melakukan commit sesuai workflow.
- **File Terdampak:** `src/components/ads/GoogleAdSlot.tsx`, `src/components/ads/AdBottomAnchor.tsx`, `UPDATE.md`, `laporan.md`

### [2026-11-24 07:56] - [Frontend] - Implementasi Lazy Loading Selektif untuk Optimasi Performa
- **Kondisi Sebelum:**
  1. Lazy loading baru diterapkan pada `<img loading="lazy">` di `GameCard.tsx`; komponen iklan di luar viewport awal masih di-bundle secara eager.
  2. `<iframe>` di `GameFrame.tsx` belum memiliki `loading="lazy"`, gambar hero belum memakai `fetchPriority="high"`, dan `GameCard.tsx` masih memuat `.png` lebih dulu sebelum `.webp`.
- **Perubahan Sesudah:**
  1. Menerapkan `next/dynamic` pada `AdBottomAnchor`, `AdSkyscraper`, `AdCompanion`, `AdNativeTile`, dan `GoogleAdSlot` tanpa mengubah struktur slot iklan.
  2. Menambahkan `loading="lazy"` pada `<iframe>` di `GameFrame.tsx`, `fetchPriority="high"` + `decoding="async"` pada gambar hero di `GameHero.tsx`, serta memprioritaskan format `.webp` di `GameCard.tsx`.
- **Masalah yang Ditemukan:** `npx tsc --noEmit` lulus tanpa error; `npm run build` di lingkungan sandbox tanpa internet gagal saat mengunduh Google Fonts (`ENOTFOUND fonts.googleapis.com`).
- **Penyelesaian:** Memverifikasi tipe TypeScript dengan `npx tsc --noEmit` dan menyertakan catatan agar `npm run build` dijalankan di lingkungan dengan akses jaringan untuk menghasilkan `out/`.
- **File Terdampak:** `src/components/layout/ClientLayout.tsx`, `src/components/layout/LayoutWrapper.tsx`, `src/app/page.tsx`, `src/components/game/PlayPageView.tsx`, `src/components/game/CategoryView.tsx`, `src/components/game/GameGrid.tsx`, `src/components/game/GameFrame.tsx`, `src/components/game/GameHero.tsx`, `src/components/game/GameCard.tsx`, `UPDATE.md`, `laporan.md`

### [2026-11-24 07:45] - [Games & Frontend] - Sinkronisasi Bahasa (ID/EN) pada 13 Game HTML5 & Pembersihan Badge Genre di Preview Gambar
- **Kondisi Sebelum:**
  1. Tombol pergantian bahasa (ID/EN) di Navbar hanya mengubah tampilan antarmuka portal Next.js, sedangkan 13 game HTML5 di dalam `<iframe>` tetap berbahasa Indonesia.
  2. Gambar preview (`preview.png` / `.webp`) hasil generator masih memiliki badge genre bawaan (`ARKADE`, `STRATEGI`, `PETUALANGAN`, dll.) di pojok kiri atas sehingga menumpuk dengan badge genre dinamis di kartu beranda.
- **Perubahan Sesudah:**
  1. Menambahkan sinkronisasi `postMessage` (`{ type: "LANG_CHANGE", lang }`) di `src/components/game/GameFrame.tsx` saat bahasa berubah maupun saat `iframe` selesai dimuat (`onLoad`).
  2. Menambahkan dukungan dwibahasa ID/EN (`localStorage` `teknogame-lang`, listener `message` dan `storage`, kamus `I18N`, serta fungsi `applyLanguage`) di seluruh 13 game (`becak-drift`, `candi-stacker`, `circuit-flow`, `cyber-bird`, `kapal-feri`, `kopi-klotok`, `layangan-sanur`, `lembah-bromo`, `nusantara-runner`, `packing-master`, `pasar-terapung`, `tekno-memory`, dan `werewolf` beserta skrip modularnya).
  3. Menghapus badge kategori bawaan dari `scripts/generate-all-previews.js` dan meng-generate ulang seluruh preview gambar game agar tampil bersih, sambil tetap mempertahankan badge genre dinamis ID/EN di `src/components/game/GameCard.tsx`.
- **Masalah yang Ditemukan:** Validasi `npx tsc --noEmit` dan sintaks JS seluruh 13 game lulus; `npm run build` di sandbox gagal hanya karena keterbatasan jaringan (`ENOTFOUND fonts.googleapis.com` untuk Google Fonts).
- **File Terdampak:** `src/components/game/GameFrame.tsx`, `src/components/game/GameCard.tsx`, `scripts/generate-all-previews.js`, `public/games/*`, `public/*/preview.png`, `public/images/games/*`, `game-log.md`, `laporan.md`

### [2026-11-23 23:52] - [Frontend] - Multi-language (ID/EN), Perbaikan Kontras & Responsivitas UI, serta Posisi Tombol Tutup Iklan
- **Kondisi Sebelum:**
1. Antarmuka portal belum memiliki dukungan peralihan Bahasa Indonesia dan Bahasa Inggris.
2. Sejumlah teks masih sulit terlihat pada mode terang maupun gelap, dan warna ikon pada menu hamburger mobile serta ikon kartu belum selaras.
3. Warna notifikasi perolehan skor/poin saat kondisi menang atau kalah permainan kurang kontras sehingga sulit dibaca.
4. Posisi tombol tutup (X) pada banner Google AdSense belum berada di sisi kanan di dalam area banner iklan.
- **Perubahan Sesudah:**
1. Menambahkan dukungan dwibahasa Bahasa Indonesia (ID) dan Bahasa Inggris (EN) di antarmuka portal.
2. Memperbaiki kontras visualisasi pada sebagian teks yang kurang terlihat di mode terang maupun gelap, menyesuaikan warna ikon saat menu hamburger terbuka di layar ponsel serta pada ikon kartu.
3. Menyesuaikan warna notifikasi skor/poin ketika menang atau kalah permainan agar lebih jelas dan mudah terlihat.
4. Memindahkan posisi tombol X pada banner Google AdSense ke sisi kanan di dalam banner iklan.
- **Masalah yang Ditemukan:** Tidak ada masalah fungsional yang dilaporkan; pembaruan berfokus pada lokalisasi bahasa, keterbacaan visual, dan tata letak UI.
- **File Terdampak:** 'src/app/globals.css', 'src/components/layout/Navbar.tsx', 'src/components/game/GameCard.tsx', 'src/components/ads/AdBottomAnchor.tsx'

### [2026-11-21 14:17] - [Frontend] - Penyempurnaan Keterbacaan & Responsivitas UI
- **Kondisi Sebelum:**
  1. Sejumlah teks dan tombol kurang kontras pada mode terang maupun gelap.
  2. Padding beberapa bagian masih terasa lebar pada layar ponsel, dan warna latar Tentang Portal berbeda dari kartu peringkat Papan Skor Saya.
- **Perubahan Sesudah:**
  1. Meningkatkan kontras teks dan tombol layanan mitra agar lebih mudah dibaca pada kedua mode.
  2. Mempersempit padding mobile pada beberapa area tanpa mengubah ukuran desktop.
  3. Menyesuaikan tampilan ikon skor agar lebih mudah terlihat, tanpa mengubah warna ikon kategorinya.
  4. Menyamakan latar Tentang Portal dengan kartu peringkat Papan Skor Saya (`#292a31`).
- **Masalah yang Ditemukan:** Tidak ada masalah fungsional yang dilaporkan; perubahan berfokus pada tampilan.
- **File Terdampak:** `src/app/globals.css`, `src/app/page.tsx`, `src/components/ads/AdBottomAnchor.tsx`, `src/components/game/GameCard.tsx`, `src/components/game/GameFrame.tsx`, `src/components/game/GameGrid.tsx`, `src/components/game/GameHero.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/LayoutWrapper.tsx`, `src/components/layout/Navbar.tsx`

### [2026-11-21 11:00] - [Frontend & CMS] - Implementasi CMS Indexing & Ranking Game (/manage-games)
- **Kondisi Sebelum:**
  1. Urutan game di Beranda bersifat statis berdasarkan susunan hardcode di `INITIAL_GAMES`.
  2. Untuk mengganti game yang tampil sebagai Hero Pilihan Utama (Top 1) atau mengatur urutan katalog, admin harus mengedit file kode dan melakukan build ulang/deploy.
- **Perubahan Sesudah:**
  1. Dibuat rute CMS khusus di `/manage-games` dengan perlindungan kata sandi rahasia yang terhubung langsung ke tabel `cms_settings` di Supabase.
  2. Dilengkapi antarmuka Drag-and-Drop native, tombol panah naik/turun, shortcut "Jadikan Top 1", tombol reset default, serta tombol "Terapkan Urutan" untuk menyimpan urutan kurasi admin ke Supabase.
  3. Beranda (`src/app/page.tsx`) langsung terhubung dengan data urutan CMS: game pada urutan #1 otomatis menjadi Kartu Utama di Hero Banner, game #2 menjadi kartu pendamping Hero, dan katalog game di bawahnya tersusun rapi sesuai urutan kurasi admin.
  4. Tersedia fitur ganti kata sandi admin secara mandiri langsung ke database Supabase.
- **Masalah yang Ditemukan:** Tidak ada. Zero-Emoji policy terjaga 100%.
- **File Terdampak:** `src/app/manage-games/page.tsx`, `src/lib/cms-supabase.ts`, `src/app/page.tsx`, `game-log.md`, `UPDATE.md`, `laporan.md`

### [2026-11-20 20:00] - [Games] - Hotfix Tembakan Pemburu & Penanganan Tombol Lewati Diskusi Online
- **Kondisi Sebelum:**
  1. Saat fajar menyingsing dengan hasil malam damai, muncul teks anomali `PEMBURU () GUGUR!` dengan nama kosong dan tombol `Lepaskan Tembakan Terakhir` tampil ke semua pemain. Hal ini terjadi karena class `.hidden` di `styles.css` hanya mencakup selector `.screen.hidden`, sehingga elemen panel pemburu tidak disembunyikan.
  2. Tombol `Lepaskan Tembakan Terakhir` muncul di seluruh layar pemain, bukan eksklusif untuk Hunter yang gugur.
  3. Tombol `Lewati Diskusi` tidak merespons atau tidak bisa dipencet pada mode online karena belum memiliki event handler di `online-supabase.js`, serta timer diskusi 2 menit tidak berjalan mundur.
- **Perubahan Sesudah:**
  1. Menambahkan rule CSS global `.hidden { display: none !important; }` serta inline style protektif pada `#dayHunterRevengePanel` sehingga seluruh elemen tersembunyi tidak akan pernah bocor lagi.
  2. Mengisolasi panel dan tombol `Lepaskan Tembakan Terakhir` secara ketat: hanya pemain yang berstatus Hunter dan terbunuh semalam yang melihat panel aksi tersebut di peralatannya. Pemain lain melihat teks menunggu.
  3. Memasang event listener klik pada tombol `Lewati Diskusi` (`btnSkipDiscussion`) dan `Mulai Sesi Voting` (`btnProceedToVoting`) di mode online: Host dapat langsung mempercepat alur ke voting eksekusi desa.
  4. Menjalankan sinkronisasi countdown timer diskusi 120 detik (`#discussionTimerDigits`) dengan auto-transition ke voting jika waktu habis.
- **Masalah yang Ditemukan:** Tidak ada. Zero-emoji policy terjaga 100%.
- **File Terdampak:** `public/games/werewolf/styles.css`, `public/games/werewolf/index.html`, `public/games/werewolf/online-supabase.js`, `public/games/werewolf/offline-engine.js`, `game-log.md`, `UPDATE.md`, `laporan.md`

### [2026-11-20 19:50] - [Games] - Perbaikan Bug Seer Single-Lock, Timer 30 Detik Malam, dan Sinkronisasi Role Lobi Realtime
- **Kondisi Sebelum:**
  1. Seer bisa mengklik dan mengintip identitas seluruh pemain lain berkali-kali dalam 1 malam sebelum menekan tombol kunci aksi.
  2. Giliran aksi malam tidak memiliki batas waktu (bisa idle tanpa batas), dan layar pemain lain saat menunggu tidak menampilkan peran apa yang sedang memilih aksi.
  3. Saat Room Master menambah atau mengurangi jumlah role di lobi, pemain tamu (guest) tidak melihat pembaruan angka role tersebut secara real-time.
- **Perubahan Sesudah:**
  1. Membatasi klik Seer menjadi tepat 1 kali per malam: begitu 1 pemain dipilih, seluruh kartu target lainnya langsung dinonaktifkan (`disabled` dengan `pointer-events: none` dan pelepasan event click) sehingga Seer hanya bisa melihat 1 orang per malam.
  2. Menambahkan timer pembatasan waktu 30 detik untuk setiap giliran peran malam (Bodyguard, Werewolf, Seer) dengan mekanisme auto-submit target jika waktu habis.
  3. Memperbarui layar tunggu pemain lain di malam hari dengan menampilkan nama dan ikon peran yang sedang aktif beraksi serta hitung mundur sisa waktu gilirannya.
  4. Menerapkan sistem dual-sync (Realtime websocket + polling sinkronisasi 1.2 detik) dan me-render daftar peran dinamis di layar tamu lobi, sehingga setiap perubahan tombol +/- oleh Room Master langsung tercermin seketika di layar pemain lain.
- **Masalah yang Ditemukan:** Tidak ada. Zero-emoji policy tetap dipatuhi 100%.
- **File Terdampak:** `public/games/werewolf/online-supabase.js`, `public/games/werewolf/offline-engine.js`, `public/games/werewolf/index.html`, `public/games/werewolf/styles.css`, `game-log.md`, `UPDATE.md`, `laporan.md`, `out/*`

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
- **Papan Skor:** Beranda menampilkan lima skor tertinggi. Peringkat pertama mendapat kartu utama di kiri, sementara peringkat 2â€“5 ditumpuk di kanan dengan skor, poin, tombol mainkan ulang, dan artwork game atau fallback SVG.
- **Kartu Hero:** Kartu pilihan kedua dapat diklik untuk naik ke lapisan atas. Hanya kartu teratas yang membuka game; kartu belakang harus dinaikkan terlebih dahulu. Efek hover kartu aktif konsisten, dan kartu kedua kini opak dengan gradasi ungu-violet.
- **Dokumentasi:** [Design.md](Design.md) ditulis ulang agar mencatat tampilan yang benar-benar diterapkan, dan riwayat pembaruan dicatat di [UPDATE.md](UPDATE.md).
- **Validasi:** ESLint dan `npx tsc --noEmit` berhasil untuk komponen hero.

### [2026-11-20 12:55] - [Games] - Penambahan Teks SEO Faktual Halaman Game & Peningkatan Rich Snippet
- **Kondisi Sebelum:** Halaman game (`/play/[slug]`) hanya memiliki deskripsi singkat 1â€“2 kalimat, skema metadata belum menyertakan rating bintang ulasan u/ SERP Google, dan belum ada FAQ serta spesifikasi teknis untuk mengoptimalkan kata kunci organik.
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
  3. `packing-master/index.html`: Di-remake dengan 4 level petak grid koper (3x4 s.d 5x5), rotasi item 90Â°, 7 item traveling berbasis vektor SVG bersih zero-emoji, sound synthesis, High Score `localStorage`, dan `postMessage`.
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



















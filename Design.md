# Panduan Desain Tekno Game

Dokumen ini menggambarkan tampilan dan interaksi yang saat ini diterapkan pada portal Tekno Game (`teknotama.com/games`), bukan rancangan yang belum dibuat.

## Identitas visual dan tema

| Elemen | Mode terang | Mode gelap |
| --- | --- | --- |
| Latar halaman | `#e9e4e5` | `#17181c` |
| Panel dan kartu | `#fffafa` | `#202127` |
| Permukaan sekunder | `#e3d3d6` | `#292a31` |
| Garis tepi | `#b6a8aa` | `#393b43` |
| Teks utama | `#161616` | `#f3f4f6` |
| Teks sekunder | `#68595c` | `#a4a6ae` |
| Aksen utama | Rose `#ce7c8a` | Rose muda `#e09aa6` |

- CTA sponsor `teknotama.com` diberi penekanan warna rose. Tombol tema berbentuk bulat, hanya memakai ikon bulan/matahari, dan berada di sebelah tautan sponsor.
- Preferensi tema disimpan di `localStorage` dengan key `teknogame-theme` serta disinkronkan antar-tab. Mode terang menjadi pilihan awal saat belum ada preferensi.
- Skor papan peringkat memakai warna kuning terang `#ffd166` agar mudah dibaca pada kartu gelap.
- Tumpukan font yang didefinisikan di stylesheet memakai Bahnschrift/Arial Narrow untuk judul dan Georgia untuk teks isi; sejumlah label navigasi memakai font monospace.
- Identitas merek memakai logo Tekno Game dan aksen rose, bukan palet navy/cobalt dari rancangan lama.

## Susunan halaman saat ini

1. **Navbar tetap:** logo, beranda, dropdown kategori, Main Acak, tautan ke papan skor dan favorit, switch tema, tautan sponsor, serta menu drawer pada layar kecil.
2. **Hero permainan:** judul “Petualangan Baru Dimulai Di Sini”, deskripsi portal, tautan katalog, dan dua kartu game yang bertumpuk.
3. **Slot iklan horizontal:** area leaderboard berukuran 1080 × 90.
4. **Katalog:** filter kategori dan kartu permainan responsif.
5. **Papan Skor Saya:** maksimal lima skor lokal. Peringkat pertama ditampilkan sebagai kartu besar di kiri; peringkat 2–5 ditampilkan di kanan. Skor menggunakan warna cerah, dan artwork memakai thumbnail game bila tersedia atau ilustrasi SVG sebagai fallback.
6. **Permainan Favorit Saya:** daftar favorit lokal atau pesan kondisi kosong.
7. **Tentang portal:** penjelasan singkat Tekno Game sebagai portal HTML5.
8. **Layanan mitra dan panel kemitraan:** kartu Infrastruktur Jaringan, Sistem Awan, Keamanan Data, dan Perangkat Lunak yang tertaut ke Teknotama.
9. **Footer:** identitas portal dan tautan informasi.

## Kartu hero dan katalog

- Kartu utama hero memakai gradasi rose-merah. Kartu pilihan kedua memakai gradasi ungu-violet dan opacity 100%, sehingga warnanya berbeda dan tidak transparan.
- Klik kartu yang berada di belakang menaikkannya ke lapisan teratas tanpa mengganti identitas atau isi kartu. Kartu di belakang tidak membuka game; klik berikutnya saat sudah di atas akan memainkan game. Kartu utama dapat dinaikkan kembali dengan cara yang sama.
- Kartu yang aktif di atas mendapat efek hover rotasi dan skala, termasuk animasi monogram dan ikon play. Warna dasar kartu tidak berubah saat diklik atau di-hover.
- Kartu katalog memakai monogram judul dan gradasi warna yang bervariasi menurut game/kategori, dengan label kategori, deskripsi, dan aksi saat hover.

## Responsif, aksesibilitas, dan data

- Navbar, hero, katalog, papan skor, favorit, dan layanan menyesuaikan ke layar kecil; menu navigasi mobile memakai drawer.
- Tautan dan tombol interaktif tetap dapat dijangkau melalui keyboard serta menampilkan indikator fokus.
- Skor tertinggi dan favorit disimpan lokal di browser; tidak ditampilkan sebagai angka aktivitas global.
- Iklan tetap berada pada slot yang ditentukan dan tidak menggantikan konten utama halaman.

## Rute

- Bahasa antarmuka utama: Indonesia.
- Jalur portal memakai `NEXT_PUBLIC_BASE_PATH`, dengan nilai bawaan `/games`.
- Katalog, kategori, dan halaman permainan menggunakan jalur `/`, `/category/[category]`, dan `/play/[slug]` di dalam base path portal.

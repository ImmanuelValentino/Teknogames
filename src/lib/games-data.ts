import { Game, CategoryInfo, GameCategory } from "@/types/game";

export const CATEGORIES: CategoryInfo[] = [
  { id: "all", label: "Semua Permainan", icon: "Gamepad2", colorClass: "bg-red-600" },
  { id: "arcade", label: "Arkade", icon: "Gamepad", colorClass: "bg-rose-600" },
  { id: "adventure", label: "Petualangan", icon: "Compass", colorClass: "bg-[#d9141d]" },
  { id: "puzzle", label: "Teka-teki", icon: "Puzzle", colorClass: "bg-rose-600" },
  { id: "action", label: "Aksi", icon: "Zap", colorClass: "bg-red-700" },
  { id: "casual", label: "Santai", icon: "Coffee", colorClass: "bg-slate-600" },
  { id: "sports", label: "Olahraga", icon: "Dumbbell", colorClass: "bg-red-600" },
];

export function getCategoryLabel(category: GameCategory): string {
  return CATEGORIES.find((item) => item.id === category)?.label ?? "Permainan";
}

export const INITIAL_GAMES: Game[] = [
  // 1. Nusantara Runner (Hero Featured)
  {
    id: "nusantara-runner",
    slug: "nusantara-runner",
    title: "Nusantara Runner: Escape to Bali",
    description: "Lari santai melintasi Malioboro, Bromo, hingga Pantai Kuta. Hindari rintangan dan kumpulkan tiket kapal!",
    category: "arcade",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/nusantara-runner/index.html",
    playCount: 14250,
    likesCount: 1240,
    rating: 4.9,
    badge: "HOT",
    featured: true,
    controlsGuide: {
      keyboard: ["Spasi / Panah Atas : Lompat", "Panah Bawah : Meluncur"],
      touch: "Tap atas untuk lompat, swipe bawah untuk meluncur",
    },
  },
  // 2. Kapal Feri (Hero Featured)
  {
    id: "kapal-feri",
    slug: "kapal-feri",
    title: "Kapal Feri: Island Hopper",
    description: "Kemudikan kapal penyeberangan antar pulau Merak - Bakauheni. Arungi ombak dan sandar di dermaga!",
    category: "adventure",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/kapal-feri/index.html",
    playCount: 9820,
    likesCount: 890,
    rating: 4.8,
    badge: "BARU",
    featured: true,
    controlsGuide: {
      keyboard: ["W / Panah Atas : Maju", "A/D : Belok Kemudi", "S : Rem / Mundur"],
      touch: "Gunakan setir di layar dan tombol gas",
    },
  },
  // 3. Packing Master (Hero Featured)
  {
    id: "packing-master",
    slug: "packing-master",
    title: "Packing Master: Koper Rapi",
    description: "Tata perlengkapan traveling ke dalam koper bagasi dengan ruang terbatas sebelum jadwal terbang tiba!",
    category: "puzzle",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/packing-master/index.html",
    playCount: 12100,
    likesCount: 1120,
    rating: 4.9,
    badge: "POPULAR",
    featured: true,
    controlsGuide: {
      keyboard: ["Klik & Drag : Pindahkan Barang", "R / Dobel Klik : Putar Barang"],
      touch: "Tahan dan geser barang ke dalam koper",
    },
  },
  // 4. Becak Drift (New from list-game2.md)
  {
    id: "becak-drift",
    slug: "becak-drift",
    title: "Becak Drift: Malioboro Rush",
    description: "Ngebut meliuk di lorong Malioboro & Keraton Jogja! Lakukan drifting tajam, hindari andong, dan jemput turis!",
    category: "arcade",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/becak-drift/index.html",
    playCount: 8750,
    likesCount: 780,
    rating: 4.8,
    badge: "BARU",
    controlsGuide: {
      keyboard: ["A / D atau Panah Kiri / Kanan : Kemudi Belok & Drift"],
      touch: "Tap sisi kiri atau kanan layar untuk belok",
    },
  },
  // 5. Candi Stacker (New from list-game2.md)
  {
    id: "candi-stacker",
    slug: "candi-stacker",
    title: "Candi Stacker: Megalitikum",
    description: "Tumpuk batu andesit bertingkat setinggi langit Borobudur! Pasang balok dengan presisi tanpa terpotong!",
    category: "casual",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/candi-stacker/index.html",
    playCount: 11340,
    likesCount: 960,
    rating: 4.9,
    badge: "HOT",
    controlsGuide: {
      keyboard: ["Spasi : Jatuhkan Balok Batu"],
      touch: "Tap layar di mana saja untuk menjatuhkan balok",
    },
  },
  // 7. Layangan Sanur (New from list-game2.md)
  {
    id: "layangan-sanur",
    slug: "layangan-sanur",
    title: "Layangan Sanur: Wind Battle",
    description: "Adu tarik-ulur benang layangan bebean di pantai Bali! Potong benang lawan tanpa membuat benang sendiri putus!",
    category: "action",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/layangan-sanur/index.html",
    playCount: 9230,
    likesCount: 810,
    rating: 4.8,
    badge: "POPULAR",
    controlsGuide: {
      keyboard: ["Tahan Spasi : Tarik Menukik Tajam", "Lepas Spasi : Mengulur Benang"],
      touch: "Tahan layar untuk menukik, lepas untuk mengulur",
    },
  },
  // 8. Kopi Klotok (New from list-game2.md)
  {
    id: "kopi-klotok",
    slug: "kopi-klotok",
    title: "Kopi Klotok: Barista Rhythm",
    description: "Ketuk seduhan kopi tepat saat tetesan air mendidih & biji kopi panggang menyentuh cangkir tanah liat!",
    category: "casual",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/kopi-klotok/index.html",
    playCount: 7890,
    likesCount: 670,
    rating: 4.8,
    badge: "HOT",
    controlsGuide: {
      keyboard: ["Spasi : Seduh Kopi Sesuai Ritme"],
      touch: "Tap tombol SEDOH di bawah cangkir",
    },
  },
  // 9. Lembah Bromo (New from list-game2.md)
  {
    id: "lembah-bromo",
    slug: "lembah-bromo",
    title: "Lembah Bromo: Hang Glider",
    description: "Kemudikan paralayang melintasi bukit pasir Bromo! Tukik menuruni lembah untuk momentum terbang melayang di udara!",
    category: "adventure",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/lembah-bromo/index.html",
    playCount: 8450,
    likesCount: 720,
    rating: 4.8,
    badge: "BARU",
    controlsGuide: {
      keyboard: ["Tahan Spasi : Menukik ke Bawah (Dive)", "Lepas Spasi : Meluncur ke Atas"],
      touch: "Tahan layar saat menuruni bukit, lepas di puncak bukit",
    },
  },
  // 10. Pasar Terapung (New from list-game2.md)
  {
    id: "pasar-terapung",
    slug: "pasar-terapung",
    title: "Pasar Terapung: Fruit Catch",
    description: "Geser perahu jukung di Sungai Martapura Banjarmasin! Tangkap buah-buahan segar nusantara & hindari batu sungai!",
    category: "arcade",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/pasar-terapung/index.html",
    playCount: 10560,
    likesCount: 930,
    rating: 4.9,
    badge: "HOT",
    controlsGuide: {
      keyboard: ["A / D atau Panah Kiri / Kanan : Kayuh Perahu"],
      touch: "Geser jari di layar untuk memandu perahu jukung",
    },
  },
  // 12. Werewolf (Malam & Desa)
  {
    id: "werewolf",
    slug: "werewolf",
    title: "Werewolf: Malam & Desa",
    description: "Permainan deduksi sosial legendaris! Temukan Werewolf di antara warga desa atau mangsa penduduk saat malam tiba.",
    category: "casual",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/werewolf/index.html",
    playCount: 8940,
    likesCount: 820,
    rating: 4.9,
    badge: "HOT",
    controlsGuide: {
      keyboard: ["Klik Menu & Pilih Aksi Moderator"],
      touch: "Oper perangkat ke tiap pemain secara bergiliran",
    },
  },
  // 13. Cyber Bird
  {
    id: "cyber-bird",
    slug: "cyber-bird",
    title: "Cyber Bird: Sky Dash",
    description: "Terbang dan kepakkan sayap melintasi pilar sirkuit neon! Kecepatan semakin kencang seiring bertambahnya poin.",
    category: "arcade",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/cyber-bird/index.html",
    playCount: 4230,
    likesCount: 390,
    rating: 4.8,
    badge: "BARU",
    controlsGuide: {
      keyboard: ["Spasi / Panah Atas : Terbang / Kepak Sayap"],
      touch: "Tap di mana saja pada layar untuk terbang",
    },
  },
  // 14. Tekno Memory
  {
    id: "tekno-memory",
    slug: "tekno-memory",
    title: "Tekno Memory: Matrix Match",
    description: "Asah daya ingatmu! Cocokkan kartu simbol teknologi sebelum waktu habis. Jumlah kartu bertambah di setiap level.",
    category: "casual",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/tekno-memory/index.html",
    playCount: 5120,
    likesCount: 440,
    rating: 4.9,
    badge: "BARU",
    controlsGuide: {
      keyboard: ["Klik Kartu untuk membuka simbol"],
      touch: "Tap kartu untuk mencocokkan pasangan",
    },
  },
  // 15. Circuit Flow
  {
    id: "circuit-flow",
    slug: "circuit-flow",
    title: "Circuit Flow: Node Connect",
    description: "Hubungkan terminal warna sirkuit neon tanpa saling menyilang jalur kabel. Selesaikan 9 level matriks sirkuit!",
    category: "puzzle",
    thumbnailUrl: "/games/images/games/.webp",
    gamePath: "/games/circuit-flow/index.html",
    playCount: 3840,
    likesCount: 320,
    rating: 4.9,
    badge: "BARU",
    controlsGuide: {
      keyboard: ["Klik & Tarik Kursor Mouse dari terminal ke terminal"],
      touch: "Tahan dan geser jari antar kotak terminal untuk menyambung jalur",
    },
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return INITIAL_GAMES.find((g) => g.slug === slug);
}

export function getGamesByCategory(category: string): Game[] {
  if (!category || category === "all") {
    return INITIAL_GAMES;
  }
  return INITIAL_GAMES.filter((g) => g.category === category);
}

export function searchGames(query: string): Game[] {
  const q = query.toLowerCase().trim();
  if (!q) return INITIAL_GAMES;
  return INITIAL_GAMES.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      getCategoryLabel(g.category).toLowerCase().includes(q)
  );
}

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GAMES_CONFIG = [
  {
    slug: 'cyber-bird',
    category: 'ARCADE',
    title: 'CYBER BIRD',
    subtitle: 'HIGH-SPEED NEON FLYER',
    bg1: '#060913', bg2: '#0b1329',
    primary: '#00f0ff', secondary: '#3b82f6',
    iconSvg: `
      <!-- Pillars -->
      <rect x="80" y="0" width="46" height="110" fill="#0b172e" stroke="#00f0ff" stroke-width="2" />
      <rect x="76" y="102" width="54" height="8" fill="#00f0ff" />
      <rect x="80" y="270" width="46" height="130" fill="#0b172e" stroke="#00f0ff" stroke-width="2" />
      <rect x="76" y="270" width="54" height="8" fill="#00f0ff" />
      <rect x="460" y="0" width="46" height="160" fill="#0b172e" stroke="#00f0ff" stroke-width="2" />
      <rect x="456" y="152" width="54" height="8" fill="#00f0ff" />
      <rect x="460" y="320" width="46" height="80" fill="#0b172e" stroke="#00f0ff" stroke-width="2" />
      <!-- Drone -->
      <g transform="translate(260, 190)">
        <polygon points="-20,-5 -52,0 -20,5" fill="#38bdf8" />
        <polygon points="38,0 -24,-24 -12,0 -24,24" fill="#00f0ff" />
        <polygon points="12,0 -14,-10 -6,0 -14,10" fill="#060913" />
        <circle cx="4" cy="0" r="4" fill="#ffffff" />
      </g>
    `
  },
  {
    slug: 'tekno-memory',
    category: 'PUZZLE',
    title: 'TEKNO MEMORY',
    subtitle: 'CIRCUIT GRID MATRIX MATCH',
    bg1: '#060913', bg2: '#0e172e',
    primary: '#00f0ff', secondary: '#10b981',
    iconSvg: `
      <g transform="translate(130, 70)">
        <rect x="0" y="0" width="150" height="105" rx="14" fill="#142242" stroke="#00f0ff" stroke-width="2" />
        <g stroke="#00f0ff" stroke-width="2.5" fill="none" transform="translate(57, 35)">
          <rect x="4" y="4" width="28" height="28" rx="3" /><rect x="12" y="12" width="12" height="12" />
          <line x1="12" y1="0" x2="12" y2="4" /><line x1="24" y1="0" x2="24" y2="4" />
          <line x1="0" y1="12" x2="4" y2="12" /><line x1="0" y1="24" x2="4" y2="24" />
        </g>
        <rect x="180" y="0" width="150" height="105" rx="14" fill="#06382b" stroke="#10b981" stroke-width="2" />
        <g stroke="#10b981" stroke-width="2.5" fill="none" transform="translate(237, 35)">
          <path d="M18 34s14-7 14-17V7l-14-5-14 5v10c0 10 14 17 14 17z" /><polyline points="11 16 16 21 25 12" />
        </g>
        <rect x="0" y="125" width="150" height="105" rx="14" fill="#06382b" stroke="#10b981" stroke-width="2" />
        <g stroke="#10b981" stroke-width="2.5" fill="none" transform="translate(57, 160)">
          <path d="M18 34s14-7 14-17V7l-14-5-14 5v10c0 10 14 17 14 17z" /><polyline points="11 16 16 21 25 12" />
        </g>
        <rect x="180" y="125" width="150" height="105" rx="14" fill="#0d172c" stroke="#334155" stroke-width="2" />
        <circle cx="255" cy="177" r="14" fill="none" stroke="rgba(0,240,255,0.4)" stroke-width="2" />
      </g>
    `
  },
  {
    slug: 'circuit-flow',
    category: 'PUZZLE',
    title: 'CIRCUIT FLOW',
    subtitle: 'NEON NODE CONNECT LOGIC',
    bg1: '#060913', bg2: '#0a1226',
    primary: '#00f0ff', secondary: '#f59e0b',
    iconSvg: `
      <g transform="translate(180, 45)">
        <rect width="240" height="240" rx="16" fill="#0d1527" stroke="rgba(0, 240, 255, 0.3)" stroke-width="2" />
        <path d="M30,30 H210" fill="none" stroke="#00f0ff" stroke-width="18" stroke-linecap="round" />
        <path d="M30,210 H210" fill="none" stroke="#f59e0b" stroke-width="18" stroke-linecap="round" />
        <path d="M90,90 V150 H150" fill="none" stroke="#10b981" stroke-width="18" stroke-linecap="round" />
        <circle cx="30" cy="30" r="18" fill="#00f0ff" /><circle cx="30" cy="30" r="6" fill="#060913" />
        <circle cx="210" cy="30" r="18" fill="#00f0ff" /><circle cx="210" cy="30" r="6" fill="#060913" />
        <circle cx="30" cy="210" r="18" fill="#f59e0b" /><circle cx="30" cy="210" r="6" fill="#060913" />
        <circle cx="210" cy="210" r="18" fill="#f59e0b" /><circle cx="210" cy="210" r="6" fill="#060913" />
        <circle cx="90" cy="90" r="18" fill="#10b981" /><circle cx="90" cy="90" r="6" fill="#060913" />
        <circle cx="150" cy="150" r="18" fill="#10b981" /><circle cx="150" cy="150" r="6" fill="#060913" />
      </g>
    `
  },
  {
    slug: 'nusantara-runner',
    category: 'ARKADE',
    title: 'NUSANTARA RUNNER',
    subtitle: 'ESCAPE TO BALI ENDLESS DASH',
    bg1: '#071329', bg2: '#0d284f',
    primary: '#38bdf8', secondary: '#3b82f6',
    iconSvg: `
      <!-- Track Perspectives -->
      <polygon points="120,400 240,160 360,160 480,400" fill="#111c38" stroke="#38bdf8" stroke-width="2" />
      <line x1="280" y1="160" x2="220" y2="400" stroke="rgba(56,189,248,0.4)" stroke-width="2" stroke-dasharray="16,10" />
      <line x1="320" y1="160" x2="380" y2="400" stroke="rgba(56,189,248,0.4)" stroke-width="2" stroke-dasharray="16,10" />
      <!-- Runner Silhouette -->
      <g transform="translate(290, 240)">
        <circle cx="10" cy="-35" r="10" fill="#38bdf8" />
        <path d="M5,-25 L15,-10 L25,-2 L32,12" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M5,-10 L-8,10 L-16,30" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M12,-22 L-6,-8 L-18,-6" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none" />
        <path d="M15,-18 L28,-6 L38,-12" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none" />
      </g>
    `
  },
  {
    slug: 'kapal-feri',
    category: 'PETUALANGAN',
    title: 'KAPAL FERI',
    subtitle: 'ISLAND HOPPER STRAIT NAVIGATION',
    bg1: '#041624', bg2: '#0b3552',
    primary: '#0ea5e9', secondary: '#14b8a6',
    iconSvg: `
      <!-- Sea Waves -->
      <path d="M0,220 Q150,180 300,220 T600,220 L600,400 L0,400 Z" fill="#06223b" />
      <path d="M0,260 Q150,230 300,260 T600,260 L600,400 L0,400 Z" fill="#082d4f" />
      <!-- Ferry Boat -->
      <g transform="translate(230, 160)">
        <polygon points="20,50 140,50 120,80 35,80" fill="#ffffff" />
        <rect x="40" y="25" width="70" height="25" rx="3" fill="#0284c7" />
        <rect x="50" y="32" width="10" height="10" fill="#e0f2fe" />
        <rect x="70" y="32" width="10" height="10" fill="#e0f2fe" />
        <rect x="90" y="32" width="10" height="10" fill="#e0f2fe" />
        <rect x="68" y="10" width="14" height="15" fill="#f43f5e" />
        <!-- Water ripple -->
        <ellipse cx="75" cy="84" rx="80" ry="12" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.6" />
      </g>
    `
  },
  {
    slug: 'packing-master',
    category: 'TEKA-TEKI',
    title: 'PACKING MASTER',
    subtitle: 'KOPER RAPI TRAVEL FIT PUZZLE',
    bg1: '#1c1004', bg2: '#3d2008',
    primary: '#f59e0b', secondary: '#ea580c',
    iconSvg: `
      <!-- Suitcase -->
      <g transform="translate(190, 80)">
        <rect width="220" height="160" rx="20" fill="#78350f" stroke="#f59e0b" stroke-width="3" />
        <rect x="15" y="15" width="190" height="130" rx="10" fill="#451a03" />
        <!-- Packed Polyomino Blocks -->
        <rect x="25" y="25" width="50" height="50" rx="4" fill="#f59e0b" />
        <rect x="80" y="25" width="115" height="50" rx="4" fill="#3b82f6" />
        <rect x="25" y="80" width="100" height="65" rx="4" fill="#10b981" />
        <rect x="130" y="80" width="65" height="65" rx="4" fill="#ec4899" />
        <!-- Handle -->
        <rect x="85" y="-14" width="50" height="14" rx="6" fill="#f59e0b" />
      </g>
    `
  },
  {
    slug: 'becak-drift',
    category: 'ARKADE',
    title: 'BECAK DRIFT',
    subtitle: 'MALIOBORO NIGHT DRIFT RACER',
    bg1: '#1c0608', bg2: '#3b0b14',
    primary: '#ef4444', secondary: '#f97316',
    iconSvg: `
      <!-- Asphalt Road -->
      <rect x="150" y="0" width="300" height="400" fill="#131418" />
      <path d="M220,320 Q260,200 360,140" fill="none" stroke="#ef4444" stroke-width="12" stroke-linecap="round" opacity="0.8" />
      <!-- Becak Silhouette -->
      <g transform="translate(290, 150) rotate(-25)">
        <rect x="-24" y="-35" width="48" height="40" rx="6" fill="#ef4444" />
        <circle cx="-28" cy="-15" r="14" fill="#0f172a" stroke="#ffffff" stroke-width="3" />
        <circle cx="28" cy="-15" r="14" fill="#0f172a" stroke="#ffffff" stroke-width="3" />
        <rect x="-4" y="5" width="8" height="30" fill="#94a3b8" />
        <circle cx="0" cy="38" r="12" fill="#0f172a" stroke="#ffffff" stroke-width="3" />
      </g>
    `
  },
  {
    slug: 'candi-stacker',
    category: 'SANTAI',
    title: 'CANDI STACKER',
    subtitle: 'MEGALITIKUM STONE TOWER',
    bg1: '#041c14', bg2: '#0b3829',
    primary: '#10b981', secondary: '#14b8a6',
    iconSvg: `
      <!-- Stone Blocks Tower -->
      <g transform="translate(190, 70)">
        <rect x="0" y="170" width="220" height="40" rx="4" fill="#065f46" stroke="#10b981" stroke-width="2" />
        <rect x="25" y="125" width="170" height="40" rx="4" fill="#047857" stroke="#10b981" stroke-width="2" />
        <rect x="50" y="80" width="120" height="40" rx="4" fill="#059669" stroke="#10b981" stroke-width="2" />
        <rect x="75" y="35" width="70" height="40" rx="4" fill="#10b981" stroke="#34d399" stroke-width="2" />
        <!-- Stupa Pinnacle -->
        <polygon points="110,0 95,35 125,35" fill="#34d399" />
      </g>
    `
  },
  {
    slug: 'layangan-sanur',
    category: 'AKSI',
    title: 'LAYANGAN SANUR',
    subtitle: 'WIND BATTLE COASTAL BALI',
    bg1: '#061a29', bg2: '#0c3552',
    primary: '#38bdf8', secondary: '#0284c7',
    iconSvg: `
      <!-- Traditional Kite Shape -->
      <g transform="translate(300, 150) rotate(-15)">
        <polygon points="0,-75 55,0 0,60 -55,0" fill="#0284c7" stroke="#38bdf8" stroke-width="3" />
        <line x1="0" y1="-75" x2="0" y2="60" stroke="#f8fafc" stroke-width="2" />
        <line x1="-55" y1="0" x2="55" y2="0" stroke="#f8fafc" stroke-width="2" />
        <!-- Tail Ribbon -->
        <path d="M0,60 Q30,100 -20,130 T30,170" fill="none" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" />
      </g>
    `
  },
  {
    slug: 'kopi-klotok',
    category: 'SANTAI',
    title: 'KOPI KLOTOK',
    subtitle: 'BARISTA RHYTHM TRADITIONAL BREW',
    bg1: '#211005', bg2: '#422006',
    primary: '#d97706', secondary: '#f59e0b',
    iconSvg: `
      <!-- Coffee Cup & Drops -->
      <g transform="translate(250, 160)">
        <path d="M10,40 L90,40 L80,95 L20,95 Z" fill="#b45309" stroke="#f59e0b" stroke-width="3" />
        <path d="M85,50 Q110,65 80,80" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
        <!-- Steam Waves -->
        <path d="M30,25 Q35,5 40,25" fill="none" stroke="rgba(245,158,11,0.6)" stroke-width="2" />
        <path d="M50,20 Q55,0 60,20" fill="none" stroke="rgba(245,158,11,0.6)" stroke-width="2" />
        <path d="M70,25 Q75,5 80,25" fill="none" stroke="rgba(245,158,11,0.6)" stroke-width="2" />
        <!-- Coffee Bean Drop -->
        <circle cx="50" cy="-20" r="10" fill="#f59e0b" />
      </g>
    `
  },
  {
    slug: 'lembah-bromo',
    category: 'PETUALANGAN',
    title: 'LEMBAH BROMO',
    subtitle: 'HANG GLIDER MOMENTUM FLIGHT',
    bg1: '#071f1a', bg2: '#0e3d34',
    primary: '#14b8a6', secondary: '#10b981',
    iconSvg: `
      <!-- Dunes Hills -->
      <path d="M0,280 Q160,180 320,280 T600,260 L600,400 L0,400 Z" fill="#042f2e" stroke="#14b8a6" stroke-width="2" />
      <!-- Paraglider Wing -->
      <g transform="translate(290, 130) rotate(-10)">
        <path d="M-60,0 Q0,-45 60,0 Q0,-15 -60,0 Z" fill="#14b8a6" stroke="#2dd4bf" stroke-width="2" />
        <line x1="-35" y1="0" x2="0" y2="30" stroke="#f8fafc" stroke-width="1.5" />
        <line x1="35" y1="0" x2="0" y2="30" stroke="#f8fafc" stroke-width="1.5" />
        <circle cx="0" cy="34" r="5" fill="#f59e0b" />
      </g>
    `
  },
  {
    slug: 'pasar-terapung',
    category: 'ARKADE',
    title: 'PASAR TERAPUNG',
    subtitle: 'FRUIT CATCH RIVER BOAT MARKET',
    bg1: '#1a071c', bg2: '#380f3d',
    primary: '#ec4899', secondary: '#f43f5e',
    iconSvg: `
      <!-- River Boat Market -->
      <g transform="translate(230, 180)">
        <path d="M10,40 L130,40 L115,70 L25,70 Z" fill="#9d174d" stroke="#f43f5e" stroke-width="3" />
        <!-- Fruit Baskets -->
        <circle cx="45" cy="30" r="16" fill="#f59e0b" />
        <circle cx="70" cy="25" r="18" fill="#10b981" />
        <circle cx="95" cy="30" r="16" fill="#ec4899" />
      </g>
    `
  },
  {
    slug: 'werewolf',
    category: 'STRATEGI',
    title: 'WEREWOLF',
    subtitle: 'DESA MISTERI SOCIAL DEDUCTION',
    bg1: '#09081f', bg2: '#18153b',
    primary: '#6366f1', secondary: '#a855f7',
    iconSvg: `
      <!-- Full Moon & Wolf Silhouette -->
      <circle cx="300" cy="150" r="55" fill="#f8fafc" opacity="0.9" />
      <g transform="translate(300, 160)">
        <polygon points="0,-35 25,10 10,25 -10,25 -25,10" fill="#09081f" />
        <polygon points="-18,-5 -15,-28 -5,-12" fill="#09081f" />
        <polygon points="18,-5 15,-28 5,-12" fill="#09081f" />
        <circle cx="-6" cy="4" r="3" fill="#ef4444" />
        <circle cx="6" cy="4" r="3" fill="#ef4444" />
      </g>
    `
  }
];

async function generateAll() {
  for (const cfg of GAMES_CONFIG) {
    const svg = `
    <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg_${cfg.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${cfg.bg1}" />
          <stop offset="60%" stop-color="${cfg.bg2}" />
          <stop offset="100%" stop-color="${cfg.bg1}" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="600" height="400" fill="url(#bg_${cfg.slug})" />

      <!-- Subtle Grid Lines -->
      <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
        <line x1="0" y1="100" x2="600" y2="100" />
        <line x1="0" y1="200" x2="600" y2="200" />
        <line x1="0" y1="300" x2="600" y2="300" />
        <line x1="150" y1="0" x2="150" y2="400" />
        <line x1="300" y1="0" x2="300" y2="400" />
        <line x1="450" y1="0" x2="450" y2="400" />
      </g>

      <!-- Badge Category -->
      <rect x="30" y="26" width="90" height="24" rx="12" fill="rgba(255, 255, 255, 0.12)" stroke="${cfg.primary}" stroke-width="1" />
      <text x="75" y="42" fill="${cfg.primary}" font-family="sans-serif" font-size="10" font-weight="900" text-anchor="middle" letter-spacing="1">${cfg.category}</text>

      <!-- Central Game Visual Artwork -->
      ${cfg.iconSvg}

      <!-- Bottom Ground Accent Glow Line -->
      <line x1="0" y1="388" x2="600" y2="388" stroke="${cfg.primary}" stroke-width="3" />

      <!-- Title Text Banner (Clean, Zero Emoji) -->
      <text x="300" y="348" fill="#ffffff" font-family="sans-serif" font-size="30" font-weight="900" text-anchor="middle" letter-spacing="2">${cfg.title}</text>
      <text x="300" y="370" fill="${cfg.primary}" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="3">${cfg.subtitle}</text>
    </svg>
    `;

    const buffer = Buffer.from(svg);
    const targetDir = path.join(__dirname, '..', 'public', 'games', cfg.slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 1. Simpan di public/games/<slug>/preview.png
    const dest1 = path.join(targetDir, 'preview.png');
    await sharp(buffer).png().toFile(dest1);

    // 2. Simpan juga di public/<slug>/preview.png agar rute URL tanpa prefix /games/ selalu 200 OK
    const fallbackDir = path.join(__dirname, '..', 'public', cfg.slug);
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    const dest2 = path.join(fallbackDir, 'preview.png');
    await sharp(buffer).png().toFile(dest2);

    // 3. Simpan juga ke public/images/games/<slug>.webp dan .png untuk backwards compatibility
    const imagesGamesDir = path.join(__dirname, '..', 'public', 'images', 'games');
    if (!fs.existsSync(imagesGamesDir)) {
      fs.mkdirSync(imagesGamesDir, { recursive: true });
    }
    await sharp(buffer).webp({ quality: 90 }).toFile(path.join(imagesGamesDir, `${cfg.slug}.webp`));
    await sharp(buffer).png().toFile(path.join(imagesGamesDir, `${cfg.slug}.png`));

    // 4. Simpan juga ke public/games/images/games/<slug>.webp untuk subpath basePath
    const gamesImagesDir = path.join(__dirname, '..', 'public', 'games', 'images', 'games');
    if (!fs.existsSync(gamesImagesDir)) {
      fs.mkdirSync(gamesImagesDir, { recursive: true });
    }
    await sharp(buffer).webp({ quality: 90 }).toFile(path.join(gamesImagesDir, `${cfg.slug}.webp`));

    console.log(`Generated all preview & webp formats for: ${cfg.slug}`);
  }
}

generateAll().then(() => console.log('ALL PREVIEWS GENERATED SUCCESSFULLY!'));

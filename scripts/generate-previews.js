const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateCyberBirdPreview() {
  const svg = `
  <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#060913" />
        <stop offset="50%" stop-color="#0b1329" />
        <stop offset="100%" stop-color="#050811" />
      </linearGradient>
      <linearGradient id="glowPillar" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00f0ff" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>
      <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="600" height="400" fill="url(#bg)" />

    <!-- Grid Lines -->
    <g stroke="rgba(0, 240, 255, 0.08)" stroke-width="1">
      <line x1="0" y1="100" x2="600" y2="100" />
      <line x1="0" y1="200" x2="600" y2="200" />
      <line x1="0" y1="300" x2="600" y2="300" />
      <line x1="150" y1="0" x2="150" y2="400" />
      <line x1="300" y1="0" x2="300" y2="400" />
      <line x1="450" y1="0" x2="450" y2="400" />
    </g>

    <!-- Star Particles -->
    <circle cx="80" cy="60" r="1.5" fill="#00f0ff" opacity="0.6" />
    <circle cx="210" cy="140" r="2" fill="#38bdf8" opacity="0.5" />
    <circle cx="490" cy="70" r="1.5" fill="#00f0ff" opacity="0.7" />
    <circle cx="530" cy="220" r="2" fill="#38bdf8" opacity="0.4" />
    <circle cx="120" cy="280" r="1.5" fill="#00f0ff" opacity="0.5" />

    <!-- Pillars Left -->
    <rect x="80" y="0" width="46" height="110" fill="#0b172e" stroke="#00f0ff" stroke-width="2" />
    <rect x="76" y="102" width="54" height="8" fill="#00f0ff" filter="url(#neon)" />
    <rect x="80" y="270" width="46" height="130" fill="#0b172e" stroke="#00f0ff" stroke-width="2" />
    <rect x="76" y="270" width="54" height="8" fill="#00f0ff" filter="url(#neon)" />

    <!-- Pillars Right -->
    <rect x="460" y="0" width="46" height="160" fill="#0b172e" stroke="#00f0ff" stroke-width="2" />
    <rect x="456" y="152" width="54" height="8" fill="#00f0ff" filter="url(#neon)" />
    <rect x="460" y="320" width="46" height="80" fill="#0b172e" stroke="#00f0ff" stroke-width="2" />
    <rect x="456" y="320" width="54" height="8" fill="#00f0ff" filter="url(#neon)" />

    <!-- Cyber Drone (Center-Left) -->
    <g transform="translate(250, 195)">
      <!-- Thruster Jet Flame -->
      <polygon points="-20,-5 -52,0 -20,5" fill="#38bdf8" filter="url(#neon)" />
      <polygon points="-16,-3 -36,0 -16,3" fill="#ffffff" />

      <!-- Drone Body -->
      <polygon points="38,0 -24,-24 -12,0 -24,24" fill="#00f0ff" filter="url(#neon)" />
      <polygon points="34,0 -20,-20 -10,0 -20,20" fill="#00f0ff" />
      <polygon points="12,0 -14,-10 -6,0 -14,10" fill="#060913" />
      <circle cx="4" cy="0" r="5" fill="#38bdf8" />
      <circle cx="4" cy="0" r="2.5" fill="#ffffff" />
    </g>

    <!-- Ground Line -->
    <line x1="0" y1="388" x2="600" y2="388" stroke="#00f0ff" stroke-width="3" filter="url(#neon)" />

    <!-- Badges & Title -->
    <rect x="30" y="28" width="80" height="24" rx="12" fill="rgba(0, 240, 255, 0.15)" stroke="#00f0ff" stroke-width="1" />
    <text x="70" y="44" fill="#00f0ff" font-family="sans-serif" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="1">ARCADE</text>

    <!-- Game Title Banner -->
    <text x="300" y="340" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="900" text-anchor="middle" letter-spacing="3">CYBER BIRD</text>
    <text x="300" y="364" fill="#00f0ff" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="4">TEKNOGAME HIGH-SPEED FLIER</text>
  </svg>
  `;

  const dest = path.join(__dirname, '..', 'public', 'games', 'cyber-bird', 'preview.png');
  await sharp(Buffer.from(svg)).png().toFile(dest);
  console.log('Generated cyber-bird preview.png');
}

async function generateTeknoMemoryPreview() {
  const svg = `
  <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="memBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#060913" />
        <stop offset="60%" stop-color="#0e172e" />
        <stop offset="100%" stop-color="#050811" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#142242" />
        <stop offset="100%" stop-color="#0c152a" />
      </linearGradient>
      <linearGradient id="cardMatchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06382b" />
        <stop offset="100%" stop-color="#04231b" />
      </linearGradient>
      <filter id="neonBlue" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="neonGreen" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="600" height="400" fill="url(#memBg)" />

    <!-- Subtle Circuit Board Background Pattern -->
    <g stroke="rgba(0, 240, 255, 0.08)" stroke-width="1.5" fill="none">
      <path d="M0,150 H120 L160,190 V320" />
      <path d="M600,120 H480 L440,160 V340" />
      <path d="M200,0 V60 L240,100 H360 L400,60 V0" />
      <circle cx="160" cy="320" r="4" fill="rgba(0, 240, 255, 0.2)" />
      <circle cx="440" cy="340" r="4" fill="rgba(0, 240, 255, 0.2)" />
    </g>

    <!-- Category Badge -->
    <rect x="30" y="28" width="80" height="24" rx="12" fill="rgba(0, 240, 255, 0.15)" stroke="#00f0ff" stroke-width="1" />
    <text x="70" y="44" fill="#00f0ff" font-family="sans-serif" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="1">PUZZLE</text>

    <!-- Memory Card Grid (4 Cards Highlighted) -->
    <g transform="translate(130, 80)">
      <!-- Card 1: CPU Chip (Revealed) -->
      <g transform="translate(0, 0)">
        <rect width="150" height="110" rx="14" fill="url(#cardGrad)" stroke="#00f0ff" stroke-width="2" filter="url(#neonBlue)" />
        <g stroke="#00f0ff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(57, 37)">
          <rect x="4" y="4" width="28" height="28" rx="3" />
          <rect x="12" y="12" width="12" height="12" />
          <line x1="12" y1="0" x2="12" y2="4" />
          <line x1="24" y1="0" x2="24" y2="4" />
          <line x1="12" y1="32" x2="12" y2="36" />
          <line x1="24" y1="32" x2="24" y2="36" />
          <line x1="0" y1="12" x2="4" y2="12" />
          <line x1="0" y1="24" x2="4" y2="24" />
          <line x1="32" y1="12" x2="36" y2="12" />
          <line x1="32" y1="24" x2="36" y2="24" />
        </g>
      </g>

      <!-- Card 2: Shield Security (Matched Green) -->
      <g transform="translate(180, 0)">
        <rect width="150" height="110" rx="14" fill="url(#cardMatchGrad)" stroke="#10b981" stroke-width="2" filter="url(#neonGreen)" />
        <g stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(57, 37)">
          <path d="M18 34s14-7 14-17V7l-14-5-14 5v10c0 10 14 17 14 17z" />
          <polyline points="11 16 16 21 25 12" />
        </g>
      </g>

      <!-- Card 3: Database Server (Matched Green) -->
      <g transform="translate(0, 130)">
        <rect width="150" height="110" rx="14" fill="url(#cardMatchGrad)" stroke="#10b981" stroke-width="2" filter="url(#neonGreen)" />
        <g stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(57, 37)">
          <path d="M18 34s14-7 14-17V7l-14-5-14 5v10c0 10 14 17 14 17z" />
          <polyline points="11 16 16 21 25 12" />
        </g>
      </g>

      <!-- Card 4: Circuit Face-down (Glow Pattern) -->
      <g transform="translate(180, 130)">
        <rect width="150" height="110" rx="14" fill="#0d172c" stroke="#334155" stroke-width="2" />
        <g stroke="rgba(0, 240, 255, 0.4)" stroke-width="2" fill="none" transform="translate(57, 37)">
          <polygon points="18,0 34,9 34,27 18,36 2,27 2,9" />
          <circle cx="18" cy="18" r="5" fill="rgba(0, 240, 255, 0.6)" />
        </g>
      </g>
    </g>

    <!-- Game Title Banner -->
    <text x="300" y="352" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="900" text-anchor="middle" letter-spacing="3">TEKNO MEMORY</text>
    <text x="300" y="374" fill="#00f0ff" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="4">CIRCUIT GRID PATTERN MATCH</text>
  </svg>
  `;

  const dest = path.join(__dirname, '..', 'public', 'games', 'tekno-memory', 'preview.png');
  await sharp(Buffer.from(svg)).png().toFile(dest);
  console.log('Generated tekno-memory preview.png');
}

async function generateCircuitFlowPreview() {
  const svg = `
  <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flowBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#060913" />
        <stop offset="50%" stop-color="#0a1226" />
        <stop offset="100%" stop-color="#050811" />
      </linearGradient>
      <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="600" height="400" fill="url(#flowBg)" />

    <!-- Grid Board Container -->
    <g transform="translate(180, 50)">
      <rect width="240" height="240" rx="16" fill="#0d1527" stroke="rgba(0, 240, 255, 0.3)" stroke-width="2" />

      <!-- Inner Grid Lines (4x4) -->
      <g stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5">
        <line x1="60" y1="0" x2="60" y2="240" />
        <line x1="120" y1="0" x2="120" y2="240" />
        <line x1="180" y1="0" x2="180" y2="240" />
        <line x1="0" y1="60" x2="240" y2="60" />
        <line x1="0" y1="120" x2="240" y2="120" />
        <line x1="0" y1="180" x2="240" y2="180" />
      </g>

      <!-- Cyan Circuit Wire -->
      <path d="M30,30 H210" fill="none" stroke="#00f0ff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowCyan)" />

      <!-- Amber Circuit Wire -->
      <path d="M30,210 H210" fill="none" stroke="#f59e0b" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowAmber)" />

      <!-- Green Circuit Wire -->
      <path d="M90,90 V150 H150" fill="none" stroke="#10b981" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowGreen)" />

      <!-- Terminals -->
      <!-- Cyan Pair -->
      <circle cx="30" cy="30" r="22" fill="#00f0ff" filter="url(#glowCyan)" />
      <circle cx="30" cy="30" r="11" fill="#060913" />
      <circle cx="30" cy="30" r="5" fill="#00f0ff" />

      <circle cx="210" cy="30" r="22" fill="#00f0ff" filter="url(#glowCyan)" />
      <circle cx="210" cy="30" r="11" fill="#060913" />
      <circle cx="210" cy="30" r="5" fill="#00f0ff" />

      <!-- Amber Pair -->
      <circle cx="30" cy="210" r="22" fill="#f59e0b" filter="url(#glowAmber)" />
      <circle cx="30" cy="210" r="11" fill="#060913" />
      <circle cx="30" cy="210" r="5" fill="#f59e0b" />

      <circle cx="210" cy="210" r="22" fill="#f59e0b" filter="url(#glowAmber)" />
      <circle cx="210" cy="210" r="11" fill="#060913" />
      <circle cx="210" cy="210" r="5" fill="#f59e0b" />

      <!-- Green Pair -->
      <circle cx="90" cy="90" r="22" fill="#10b981" filter="url(#glowGreen)" />
      <circle cx="90" cy="90" r="11" fill="#060913" />
      <circle cx="90" cy="90" r="5" fill="#10b981" />

      <circle cx="150" cy="150" r="22" fill="#10b981" filter="url(#glowGreen)" />
      <circle cx="150" cy="150" r="11" fill="#060913" />
      <circle cx="150" cy="150" r="5" fill="#10b981" />
    </g>

    <!-- Category Badge -->
    <rect x="30" y="28" width="80" height="24" rx="12" fill="rgba(0, 240, 255, 0.15)" stroke="#00f0ff" stroke-width="1" />
    <text x="70" y="44" fill="#00f0ff" font-family="sans-serif" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="1">PUZZLE</text>

    <!-- Game Title Banner -->
    <text x="300" y="348" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="900" text-anchor="middle" letter-spacing="3">CIRCUIT FLOW</text>
    <text x="300" y="372" fill="#00f0ff" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="4">NEON NODE CONNECT LOGIC</text>
  </svg>
  `;

  const dest = path.join(__dirname, '..', 'public', 'games', 'circuit-flow', 'preview.png');
  await sharp(Buffer.from(svg)).png().toFile(dest);
  console.log('Generated circuit-flow preview.png');
}

async function run() {
  await generateCyberBirdPreview();
  await generateTeknoMemoryPreview();
  await generateCircuitFlowPreview();
}

run();

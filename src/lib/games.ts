import fs from "fs";
import path from "path";
import { Game, GameCategory } from "@/types/game";
import { INITIAL_GAMES, CATEGORIES, getCategoryLabel } from "./games-data";

/**
 * Auto-discovery games module:
 * Scans `public/games/` for any subdirectories containing an `index.html`.
 * Matches each discovered folder against INITIAL_GAMES metadata,
 * or generates fallback metadata for newly added games plug-and-play.
 */
export function getDiscoveredGames(): Game[] {
  const gamesDir = path.join(process.cwd(), "public", "games");
  if (!fs.existsSync(gamesDir)) {
    return INITIAL_GAMES;
  }

  const entries = fs.readdirSync(gamesDir, { withFileTypes: true });
  const discoveredFolders = entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(gamesDir, entry.name, "index.html")))
    .map((entry) => entry.name);

  // Map known games preserving their rich metadata
  const games: Game[] = [];
  const processedSlugs = new Set<string>();

  // First, add all discovered games that exist in INITIAL_GAMES
  for (const initialGame of INITIAL_GAMES) {
    if (discoveredFolders.includes(initialGame.slug)) {
      games.push(initialGame);
      processedSlugs.add(initialGame.slug);
    }
  }

  // Next, auto-register any new game folder placed in public/games/
  for (const folderName of discoveredFolders) {
    if (!processedSlugs.has(folderName)) {
      const formattedTitle = folderName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const newGame: Game = {
        id: folderName,
        slug: folderName,
        title: formattedTitle,
        description: `Mainkan game web HTML5 ${formattedTitle} secara gratis langsung di peramban tanpa instalasi.`,
        category: "arcade",
        thumbnailUrl: `/images/games/${folderName}.webp`,
        gamePath: `/games/${folderName}/index.html`,
        playCount: 100,
        likesCount: 10,
        rating: 5.0,
        featured: false,
        controlsGuide: {
          keyboard: ["Gunakan tombol panah atau spasi untuk mengontrol permainan."],
          touch: "Sentuh atau geser pada layar untuk mengontrol permainan.",
        },
      };

      games.push(newGame);
      processedSlugs.add(folderName);
    }
  }

  return games.length > 0 ? games : INITIAL_GAMES;
}

export function getAllGameSlugs(): string[] {
  return getDiscoveredGames().map((g) => g.slug);
}

export function getGameBySlugFromDiscovery(slug: string): Game | undefined {
  return getDiscoveredGames().find((g) => g.slug === slug);
}

export { CATEGORIES, getCategoryLabel };

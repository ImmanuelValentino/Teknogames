"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import { Play } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { useTranslation, getLocalizedCategoryLabel, getLocalizedGame } from "@/lib/i18n";

interface GameCardProps {
  game: Game;
}

// Skema palet warna gradasi cerah, modern & bervariasi sesuai referensi PlayForge
const getPlayForgeGradient = (slug: string, category: string) => {
  switch (slug) {
    case "nusantara-runner":
      return "from-rose-500 via-red-600 to-rose-600";
    case "becak-drift":
      return "from-orange-500 via-rose-500 to-red-600";
    case "candi-stacker":
      return "from-emerald-400 via-rose-500 to-rose-600";
    case "kapal-feri":
      return "from-red-500 via-rose-600 to-violet-700";
    case "packing-master":
      return "from-amber-400 via-orange-500 to-rose-500";
    case "layangan-sanur":
      return "from-rose-400 via-rose-500 to-red-600";
    case "kopi-klotok":
      return "from-amber-500 via-amber-600 to-orange-700";
    case "lembah-bromo":
      return "from-rose-400 via-emerald-500 to-green-600";
    case "pasar-terapung":
      return "from-rose-500 via-pink-600 to-purple-600";
    case "werewolf":
      return "from-rose-600 via-purple-700 to-pink-800";
    case "cyber-bird":
      return "from-fuchsia-500 via-pink-600 to-rose-600";
    case "tekno-memory":
      return "from-red-600 via-rose-700 to-purple-800";
    default:
      switch (category) {
        case "arcade":
          return "from-rose-500 to-rose-600";
        case "adventure":
          return "from-emerald-400 to-rose-600";
        case "puzzle":
          return "from-purple-500 to-pink-600";
        case "action":
          return "from-rose-500 to-orange-600";
        case "casual":
          return "from-amber-400 to-orange-600";
        case "sports":
          return "from-green-500 to-emerald-600";
        default:
          return "from-rose-500 to-purple-600";
      }
  }
};

export default function GameCard({ game }: GameCardProps) {
  const { lang } = useTranslation();
  const localized = getLocalizedGame(game, lang);
  const candidateSources = React.useMemo(() => [
    `/games/images/games/${game.slug}.webp`,
    `/images/games/${game.slug}.webp`,
    `/games/${game.slug}/preview.png`,
    `/games/games/${game.slug}/preview.png`,
    `/${game.slug}/preview.png`,
  ], [game.slug]);

  const [srcIndex, setSrcIndex] = React.useState(0);
  const [imgFailed, setImgFailed] = React.useState(false);

  // Ambil 2 huruf inisial dari judul game untuk visual Monogram PlayForge fallback
  const getInitials = (title: string) => {
    const clean = title.split(":")[0].trim();
    const parts = clean.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const handleImageError = () => {
    if (srcIndex < candidateSources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setImgFailed(true);
    }
  };

  const gradientClass = getPlayForgeGradient(game.slug, game.category);
  const initials = getInitials(game.title);

  return (
    <Link
      href={`/play/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-3 transition-all duration-300 hover:border-rose-400/50 hover:bg-white/[0.06] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Visual Tile Thumbnail Preview Sesuai game-guide.md */}
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gradient-to-br ${gradientClass} shadow-md flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.02]`}
      >
        {!imgFailed ? (
          <img
            src={candidateSources[srcIndex]}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <>
            {/* Dekorasi Garis Lengkung Halus SVG di Latar Belakang */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="white" strokeWidth="2" />
                <path d="M0,80 Q50,20 100,80" fill="none" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Tengah: Monogram 2 Huruf Tebal Fallback */}
            <div className="relative z-10 my-auto flex items-center justify-center">
              <span className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110">
                {initials}
              </span>
            </div>
          </>
        )}

        {/* Baris Atas: Kategori Badge */}
        <div className="relative z-10 flex items-center justify-between p-3.5 pointer-events-none">
          <span className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 shadow-sm">
            <CategoryIcon category={game.category} />
            {getLocalizedCategoryLabel(game.category, lang)}
          </span>
        </div>

        {/* Sudut Kanan Bawah: Tombol Play Mengambang */}
        <div className="relative z-10 flex justify-end p-3.5 pointer-events-none">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-900 opacity-0 shadow-md backdrop-blur transition-all duration-200 group-hover:opacity-100 group-hover:scale-105">
            <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
          </span>
        </div>
      </div>

      {/* Info Teks di Bawah Kartu */}
      <div className="mt-3 flex flex-1 flex-col justify-between px-1">
        <div>
          <h4 className="line-clamp-1 font-heading text-sm font-bold text-white transition-colors group-hover:text-rose-300">
            {game.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {localized.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

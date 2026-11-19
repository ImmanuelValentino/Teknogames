"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import { Play } from "lucide-react";
import { getCategoryLabel } from "@/lib/games-data";

interface GameCardProps {
  game: Game;
}

// Skema palet warna gradasi cerah, modern & bervariasi sesuai referensi PlayForge
const getPlayForgeGradient = (slug: string, category: string) => {
  switch (slug) {
    case "nusantara-runner":
      return "from-sky-500 via-blue-600 to-indigo-600";
    case "becak-drift":
      return "from-orange-500 via-rose-500 to-red-600";
    case "candi-stacker":
      return "from-emerald-400 via-teal-500 to-cyan-600";
    case "kapal-feri":
      return "from-blue-500 via-indigo-600 to-violet-700";
    case "packing-master":
      return "from-amber-400 via-orange-500 to-rose-500";
    case "batik-flow":
      return "from-purple-500 via-fuchsia-600 to-pink-600";
    case "layangan-sanur":
      return "from-cyan-400 via-sky-500 to-blue-600";
    case "kopi-klotok":
      return "from-amber-500 via-amber-600 to-orange-700";
    case "lembah-bromo":
      return "from-teal-400 via-emerald-500 to-green-600";
    case "pasar-terapung":
      return "from-rose-500 via-pink-600 to-purple-600";
    case "kamus-kelana":
      return "from-violet-500 via-purple-600 to-indigo-700";
    case "werewolf":
      return "from-indigo-600 via-purple-700 to-pink-800";
    case "cyber-bird":
      return "from-fuchsia-500 via-pink-600 to-rose-600";
    case "tekno-memory":
      return "from-blue-600 via-indigo-700 to-purple-800";
    default:
      switch (category) {
        case "arcade":
          return "from-sky-500 to-indigo-600";
        case "adventure":
          return "from-emerald-400 to-teal-600";
        case "puzzle":
          return "from-purple-500 to-pink-600";
        case "action":
          return "from-rose-500 to-orange-600";
        case "casual":
          return "from-amber-400 to-orange-600";
        case "sports":
          return "from-green-500 to-emerald-600";
        default:
          return "from-indigo-500 to-purple-600";
      }
  }
};

export default function GameCard({ game }: GameCardProps) {
  // Ambil 2 huruf inisial dari judul game untuk visual Monogram PlayForge
  const getInitials = (title: string) => {
    const clean = title.split(":")[0].trim();
    const parts = clean.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const gradientClass = getPlayForgeGradient(game.slug, game.category);
  const initials = getInitials(game.title);

  return (
    <Link
      href={`/play/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-3 transition-all duration-300 hover:border-indigo-400/50 hover:bg-white/[0.06] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Visual Tile Monogram PlayForge */}
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gradient-to-br ${gradientClass} p-3.5 shadow-md flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.02]`}
      >
        {/* Dekorasi Garis Lengkung Halus SVG di Latar Belakang */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="white" strokeWidth="2" />
            <path d="M0,80 Q50,20 100,80" fill="none" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Baris Atas: Kategori Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-full bg-black/30 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {getCategoryLabel(game.category)}
          </span>
        </div>

        {/* Tengah: Monogram 2 Huruf Tebal */}
        <div className="relative z-10 my-auto flex items-center justify-center">
          <span className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110">
            {initials}
          </span>
        </div>

        {/* Sudut Kanan Bawah: Tombol Play Mengambang */}
        <div className="relative z-10 flex justify-end">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-900 opacity-0 shadow-md backdrop-blur transition-all duration-200 group-hover:opacity-100 group-hover:scale-105">
            <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
          </span>
        </div>
      </div>

      {/* Info Teks di Bawah Kartu */}
      <div className="mt-3 flex flex-1 flex-col justify-between px-1">
        <div>
          <h4 className="line-clamp-1 font-heading text-sm font-bold text-white transition-colors group-hover:text-indigo-300">
            {game.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

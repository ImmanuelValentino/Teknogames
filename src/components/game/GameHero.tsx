"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import { Play, Sparkles, ArrowDown } from "lucide-react";

interface GameHeroProps {
  featuredGames: Game[];
}

export default function GameHero({ featuredGames }: GameHeroProps) {
  const [secondaryOnTop, setSecondaryOnTop] = React.useState(false);

  if (!featuredGames || featuredGames.length === 0) return null;

  const mainHero = featuredGames[0];
  const secondaryHero = featuredGames[1] || featuredGames[0];

  // Inisial untuk kartu monogram PlayForge style
  const getInitials = (title: string) => {
    const clean = title.split(":")[0].trim();
    const parts = clean.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  return (
    <section className="mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1d0c0f] via-[#261014] to-[#2e1116] p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Glow Ambient di Background */}
        <div className="absolute top-0 right-1/4 -mt-20 h-96 w-96 rounded-full bg-[#f1637b]/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 -mb-20 h-96 w-96 rounded-full bg-[#ec4899]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Kolom Kiri: Headline & CTA PlayForge Style */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/40 px-3.5 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-xs font-semibold tracking-wide text-rose-200">
                Game Online Gratis Tanpa Download – TeknoGame
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
                Petualangan Baru
                <br />
                <span className="bg-gradient-to-r from-rose-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Dimulai Di Sini.
                </span>
              </h1>
              <p className="pt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Temukan aneka game web HTML5 gratis berkualitas persembahan resmi <strong className="text-white">PT Teknotama Prakarsa Mulia</strong>. Main langsung bersama teman tanpa instalasi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href={`/play/${mainHero.slug}`}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 px-7 py-3 text-sm font-bold text-white shadow-[0_8px_25px_rgba(241, 99, 123,0.4)] transition-all hover:scale-105 hover:shadow-[0_12px_30px_rgba(241, 99, 123,0.6)]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Jelajahi Permainan</span>
              </Link>

              <Link
                href="#katalog"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-rose-400/50 hover:bg-white/[0.08] hover:text-white"
              >
                <span>Lihat yang Populer</span>
                <ArrowDown className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: 2 Kartu Bertumpuk Modern (PlayForge Hero 3D Card Stack) */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6 sm:py-8">
            {/* Kartu Belakang (Secondary Game) */}
            <Link
              href={`/play/${secondaryHero.slug}`}
              onClick={(event) => {
                if (!secondaryOnTop) {
                  event.preventDefault();
                  setSecondaryOnTop(true);
                }
              }}
              className={`group absolute top-2 right-4 sm:right-8 flex w-56 sm:w-64 aspect-[4/5] -rotate-6 flex-col justify-between rounded-3xl border border-white/20 bg-gradient-to-br from-purple-500 via-purple-700 to-violet-700 p-5 shadow-2xl opacity-100 transition-transform ${secondaryOnTop ? "z-20 hover:rotate-0 hover:scale-105" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  Pilihan Kedua
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                  {secondaryHero.category}
                </span>
              </div>
              <div className="my-auto flex flex-col items-center justify-center text-center">
                <span className={`font-heading text-6xl font-black tracking-tighter text-white/90 ${secondaryOnTop ? "transition-transform duration-300 group-hover:scale-110" : ""}`}>
                  {getInitials(secondaryHero.title)}
                </span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/80">
                  {secondaryHero.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-3.5 backdrop-blur-md">
                <div className="min-w-0">
                  <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-rose-200">
                    Tekno Game
                  </span>
                  <h3 className="truncate text-sm font-bold text-white">
                    {secondaryHero.title.split(":")[0]}
                  </h3>
                </div>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-rose-900 shadow-md ${secondaryOnTop ? "transition-transform group-hover:scale-110" : ""}`}>
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </span>
              </div>
            </Link>

            {/* Kartu Depan Utama (Main Hero Game) */}
            <Link
              href={`/play/${mainHero.slug}`}
              onClick={(event) => {
                if (secondaryOnTop) {
                  event.preventDefault();
                  setSecondaryOnTop(false);
                }
              }}
              className={`group relative z-10 w-64 sm:w-72 aspect-[4/5] rounded-3xl bg-gradient-to-br from-rose-500 via-red-600 to-rose-400 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)] rotate-3 transform transition-all duration-300 ${secondaryOnTop ? "" : "hover:rotate-0 hover:scale-105"} border border-white/20 flex flex-col justify-between`}
            >
              {/* Top Tag & Category Badge */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/40 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  Pilihan Utama
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                  {mainHero.category}
                </span>
              </div>

              {/* Center Monogram Typography Visual */}
              <div className="my-auto flex flex-col items-center justify-center text-center">
                <span className={`font-heading text-7xl font-black tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] ${secondaryOnTop ? "" : "transition-transform duration-300 group-hover:scale-110"}`}>
                  {getInitials(mainHero.title)}
                </span>
                <span className="text-[11px] font-semibold text-white/80 uppercase tracking-widest mt-1">
                  {mainHero.category}
                </span>
              </div>

              {/* Bottom Card Footer */}
              <div className="rounded-2xl bg-black/40 border border-white/15 p-3.5 backdrop-blur-md flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-rose-200 tracking-wider block truncate">
                    Tekno Game
                  </span>
                  <h3 className="text-sm font-bold text-white truncate">
                    {mainHero.title.split(":")[0]}
                  </h3>
                </div>
                <span className={`h-9 w-9 shrink-0 rounded-full bg-white text-rose-900 flex items-center justify-center shadow-md ${secondaryOnTop ? "" : "transition-transform group-hover:scale-110"}`}>
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

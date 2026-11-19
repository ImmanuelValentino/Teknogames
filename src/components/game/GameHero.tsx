"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Game } from "@/types/game";
import { Play, ArrowRight, ArrowDown } from "lucide-react";

interface GameHeroProps {
  featuredGames: Game[];
}

export default function GameHero({ featuredGames }: GameHeroProps) {
  if (!featuredGames || featuredGames.length === 0) return null;

  const mainHero = featuredGames[0];

  return (
    <section className="mb-10">
      <div className="card-glass relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10">
        {/* Subtle Ambient Circuit Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#255dce]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#021861]/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri: Branding & Pengantar Utama */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#255dce]/30 bg-[#021861]/40 px-3.5 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wide text-slate-200">
                Portal Game Web HTML5 Resmi PT Teknotama Prakarsa Mulia
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              Mainkan Game Web.
              <br />
              <span className="text-[#8caeff]">Gratis Langsung di Browser.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Nikmati aneka koleksi game petualangan, arkade seru, teka-teki cerdas, dan aksi cepat tanpa perlu instalasi aplikasi. Cepat, responsif, dan ringan dimainkan dari ponsel maupun desktop.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href={`/play/${mainHero.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold btn-primary-clean shadow-lg transition-transform hover:scale-[1.02]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Mainkan Sekarang</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>

              <Link
                href="#katalog"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-[#255dce]/50 hover:text-white"
              >
                <span>Jelajahi Katalog</span>
                <ArrowDown className="h-4 w-4" />
              </Link>

              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#255dce]/30 bg-[#255dce]/10 px-5 py-3 text-sm font-semibold text-[#8caeff] transition-colors hover:bg-[#255dce]/20 hover:text-white"
              >
                <span>Tentang Teknotama</span>
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Visual Showcase Modern Hero */}
          <div className="lg:col-span-5 flex justify-center">
            <Link
              href={`/play/${mainHero.slug}`}
              className="group relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden card-natural border border-[#255dce]/40 p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-[#8caeff] hover:shadow-[0_20px_50px_rgba(37,93,206,0.25)]"
            >
              {/* Top Banner Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  Permainan Pilihan
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Siap Main
                </span>
              </div>

              {/* Center Icon / Logo Shield */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto transition-transform duration-300 group-hover:scale-110">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
                  <Image
                    src="/games/Teknogame_logo_only.png"
                    alt="Logo Tekno Game"
                    fill
                    sizes="128px"
                    className="object-contain p-1"
                    priority
                  />
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="relative z-10 rounded-xl bg-black/60 border border-white/10 p-3.5 backdrop-blur-md flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Kategori: {mainHero.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-[#8caeff] transition-colors">
                    {mainHero.title}
                  </h3>
                </div>
                <span className="h-9 w-9 shrink-0 rounded-full btn-primary-clean flex items-center justify-center text-white shadow-md">
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

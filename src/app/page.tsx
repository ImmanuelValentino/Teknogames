"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cloud,
  Code2,
  ExternalLink,
  Heart,
  Network,
  Play,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import GameHero from "@/components/game/GameHero";
import GameGrid from "@/components/game/GameGrid";
import GameCard from "@/components/game/GameCard";
import GoogleAdSlot from "@/components/ads/GoogleAdSlot";
import { CATEGORIES, INITIAL_GAMES } from "@/lib/games-data";
import { GameCategory, Game } from "@/types/game";
import { getLocalScores, getLocalFavorites } from "@/lib/local-storage";
import { getGamePortalUrl } from "@/lib/site";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all");
  const [topScores, setTopScores] = useState<
    { gameId: string; title: string; slug: string; score: number }[]
  >([]);
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);

  // Sinkronisasi Rekor Skor & Game Favorit dari LocalStorage
  useEffect(() => {
    const updateLocalData = () => {
      // 1. Rekor Skor
      const scores = getLocalScores();
      const parsed = Object.entries(scores)
        .map(([gameId, score]) => {
          const game = INITIAL_GAMES.find((g) => g.id === gameId);
          return {
            gameId,
            title: game?.title || gameId.replace(/-/g, " "),
            slug: game?.slug || gameId,
            score,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
      setTopScores(parsed);

      // 2. Game Favorit
      const favIds = getLocalFavorites();
      const favs = INITIAL_GAMES.filter((g) => favIds.includes(g.id));
      setFavoriteGames(favs);
    };

    updateLocalData();
    window.addEventListener("storage", updateLocalData);
    window.addEventListener("focus", updateLocalData);
    return () => {
      window.removeEventListener("storage", updateLocalData);
      window.removeEventListener("focus", updateLocalData);
    };
  }, []);

  const featuredGames = INITIAL_GAMES.filter((g) => g.featured);
  const selectedCategoryLabel =
    CATEGORIES.find((category) => category.id === selectedCategory)?.label ??
    "Semua Permainan";
  const displayGames =
    selectedCategory === "all"
      ? INITIAL_GAMES
      : INITIAL_GAMES.filter((g) => g.category === selectedCategory);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tekno Game",
    alternateName: "Portal Permainan Tekno Game",
    url: getGamePortalUrl(),
    description:
      "Portal permainan web HTML5 resmi persembahan PT Teknotama Prakarsa Mulia. Mainkan permainan gratis tanpa instalasi.",
    publisher: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
      logo: getGamePortalUrl("/Teknogame_logo_only.png"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${getGamePortalUrl()}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="pt-5 sm:pt-8">
      {/* Skrip SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section (Split-Hero Modern Sesuai Desain Figma) */}
      <GameHero featuredGames={featuredGames} />

      {/* 2. Slot Iklan Tengah Horizontal (1080 x 90) */}
      <GoogleAdSlot
        slotType="leaderboard-1080x90"
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || ""}
      />

      {/* 3. Pilihan Game: Semua Koleksi Permainan dengan Dropdown Kategori */}
      <div id="katalog" className="scroll-mt-24">
        <GameGrid
          games={displayGames}
          title={
            selectedCategory === "all"
              ? "Semua Koleksi Permainan"
              : `Koleksi Permainan: ${selectedCategoryLabel}`
          }
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={CATEGORIES}
        />
      </div>

      {/* 4. Section Papan Skor Mandiri (id="papan-skor") */}
      <section id="papan-skor" className="mb-14 scroll-mt-24 rounded-2xl card-natural p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 shrink-0">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                Papan Skor Saya
              </h2>
              <p className="text-xs text-slate-300">
                Pencapaian skor tertinggi Anda yang tersimpan di peramban ini
              </p>
            </div>
          </div>
        </div>

        {topScores.length === 0 ? (
          <div className="py-8 text-center bg-white/[0.02] rounded-xl border border-white/10">
            <p className="text-xs sm:text-sm text-slate-300">
              Belum ada skor yang dicatat. Mainkan salah satu permainan sekarang untuk mulai mencatat skor terbaik Anda.
            </p>
            <div className="mt-4">
              <Link
                href="/play/nusantara-runner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-primary-clean text-xs font-semibold shadow-md"
              >
                <span>Mainkan Nusantara Runner</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {topScores.map((item, idx) => (
              <div
                key={item.gameId}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 hover:border-[#255dce]/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-[#255dce]/20 border border-[#255dce]/30 text-[#8caeff] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-xs font-bold text-amber-300 block">
                      {item.score.toLocaleString("id-ID")} poin
                    </span>
                  </div>
                </div>

                <Link
                  href={`/play/${item.slug}`}
                  className="p-2 rounded-lg btn-primary-clean text-white shrink-0"
                  title="Mainkan lagi"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Section Favorit Mandiri (id="favorit") */}
      <section id="favorit" className="mb-14 scroll-mt-24 rounded-2xl card-natural p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300 shrink-0">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                Permainan Favorit Saya
              </h2>
              <p className="text-xs text-slate-300">
                Daftar permainan yang Anda tandai dengan ikon hati
              </p>
            </div>
          </div>
        </div>

        {favoriteGames.length === 0 ? (
          <div className="py-8 text-center bg-white/[0.02] rounded-xl border border-white/10">
            <p className="text-xs sm:text-sm text-slate-300">
              Belum ada permainan favorit yang disimpan. Klik ikon hati pada permainan favorit Anda untuk menambahkannya ke sini.
            </p>
            <div className="mt-4">
              <Link
                href="#katalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.04] text-xs font-semibold text-slate-200 hover:text-white hover:border-[#255dce]/40 transition-colors"
              >
                <span>Lihat Koleksi Permainan</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {favoriteGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Section Tentang Portal & Layanan Mitra Sesuai Referensi Gambar */}
      {/* Kartu Atas: Tentang Portal */}
      <section className="card-natural mb-6 grid gap-6 p-6 sm:p-8 md:grid-cols-[1.1fr_1.9fr] md:items-center">
        <div>
          <p className="section-kicker mb-2">Tentang portal</p>
          <h2 className="section-heading">
            Dirancang untuk <span>langsung bermain.</span>
          </h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          Tekno Game adalah portal permainan web HTML5 resmi yang dioperasikan sebagai subdirektori dari <strong className="text-white">PT Teknotama Prakarsa Mulia</strong> (<a href="https://teknotama.com" target="_blank" rel="noopener noreferrer" className="font-medium text-[#8caeff] underline underline-offset-4">teknotama.com</a>). Portal ini menyajikan berbagai permainan yang dapat dimainkan secara gratis langsung melalui peramban tanpa perlu memasang aplikasi.
        </p>
      </section>

      {/* Kartu Tengah: Layanan Mitra (4 Kartu) */}
      <section className="mb-6" aria-labelledby="partner-services-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker mb-2">Layanan mitra</p>
            <h2 id="partner-services-title" className="section-heading">
              Teknologi untuk <span>bertumbuh.</span>
            </h2>
          </div>
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold text-slate-200 transition-colors hover:border-[#255dce]/50 hover:text-white"
          >
            <span>Lihat layanan Teknotama</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Network className="h-5 w-5" />,
              title: "Infrastruktur Jaringan",
              description:
                "Perencanaan dan pengelolaan jaringan yang andal untuk operasional bisnis.",
            },
            {
              icon: <Cloud className="h-5 w-5" />,
              title: "Sistem Awan",
              description:
                "Solusi komputasi awan yang fleksibel, aman, dan siap berkembang.",
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: "Keamanan Data",
              description:
                "Perlindungan data dan sistem untuk menjaga kelangsungan bisnis.",
            },
            {
              icon: <Code2 className="h-5 w-5" />,
              title: "Perangkat Lunak",
              description:
                "Pengembangan perangkat lunak khusus sesuai kebutuhan organisasi.",
            },
          ].map((service) => (
            <a
              key={service.title}
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="partner-service-card group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-200 hover:border-[#255dce]/50 hover:bg-white/[0.045] flex flex-col justify-between"
            >
              <div>
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-[#255dce]/25 bg-[#021861]/30 text-[#8caeff] transition-colors group-hover:text-white">
                  {service.icon}
                </span>
                <span className="block text-sm font-bold text-white">
                  {service.title}
                </span>
                <span className="mt-2 block text-xs leading-5 text-slate-400">
                  {service.description}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Kartu Bawah: Partner Panel Teknotama */}
      <section className="partner-panel mb-14 flex flex-col items-start justify-between gap-6 p-6 sm:p-8 md:flex-row md:items-center">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="section-kicker">
            Partner Teknologi Resmi
          </span>
          <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
            Solusi Transformasi Digital Bersama PT Teknotama Prakarsa Mulia
          </h3>
          <p className="text-sm leading-6 text-slate-300">
            PT Teknotama Prakarsa Mulia menyediakan layanan infrastruktur jaringan, sistem awan, keamanan data, serta pengembangan perangkat lunak khusus untuk perusahaan.
          </p>
        </div>
        <div className="relative z-10 w-full shrink-0 md:w-auto">
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold btn-sponsor-clean md:w-auto shadow-md"
          >
            <span>Kunjungi teknotama.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

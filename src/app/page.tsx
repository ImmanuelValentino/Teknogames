"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
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

const GoogleAdSlot = dynamic(() => import("@/components/ads/GoogleAdSlot"), {
  ssr: false,
});
import { CATEGORIES, INITIAL_GAMES } from "@/lib/games-data";
import { GameCategory, Game } from "@/types/game";
import { getLocalScores, getLocalFavorites } from "@/lib/local-storage";
import { getGamePortalUrl } from "@/lib/site";
import { fetchGameOrder, getCachedGameOrder } from "@/lib/cms-supabase";
import { useTranslation, getLocalizedCategoryLabel } from "@/lib/i18n";

function sortGamesByOrder(baseGames: Game[], orderSlugs: string[]): Game[] {
  if (!orderSlugs || orderSlugs.length === 0) return baseGames;
  const map = new Map<string, Game>();
  baseGames.forEach((g) => map.set(g.slug, g));

  const sorted: Game[] = [];
  const added = new Set<string>();

  orderSlugs.forEach((slug) => {
    const game = map.get(slug);
    if (game) {
      sorted.push(game);
      added.add(slug);
    }
  });

  baseGames.forEach((g) => {
    if (!added.has(g.slug)) {
      sorted.push(g);
    }
  });

  return sorted;
}

interface ScoreGameArtworkProps {
  title: string;
  thumbnailUrl?: string;
  className: string;
  sizes: string;
}

function ScoreGameArtwork({
  title,
  thumbnailUrl,
  className,
  sizes,
}: ScoreGameArtworkProps) {
  const initials = title
    .split(":")[0]
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative isolate overflow-hidden bg-gradient-to-br from-rose-900 via-[#252432] to-[#292a31] ${className}`}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="250" cy="48" r="28" fill="#ffd166" opacity=".8" />
        <path d="M0 128 72 70l45 44 58-67 92 81v72H0Z" fill="#7e3951" />
        <path d="m0 155 81-48 61 47 62-40 63 48v38H0Z" fill="#343650" />
        <path
          d="M104 200c10-42 48-47 62-74 13 32 51 35 62 74"
          fill="none"
          stroke="#292a31"
          strokeLinecap="round"
          strokeWidth="22"
        />
        <path
          d="M104 200c10-42 48-47 62-74 13 32 51 35 62 74"
          fill="none"
          stroke="#ffd166"
          strokeDasharray="7 12"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center font-heading text-6xl font-black text-white/20"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        {initials}
      </span>
      {thumbnailUrl && (
        <Image
          alt=""
          fill
          sizes={sizes}
          src={thumbnailUrl}
          className="object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  const { lang, t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all");
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [topScores, setTopScores] = useState<
    {
      gameId: string;
      title: string;
      slug: string;
      thumbnailUrl?: string;
      score: number;
    }[]
  >([]);
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);

  // Sinkronisasi Urutan Game dari Cache & Supabase CMS
  useEffect(() => {
    let isMounted = true;
    const cachedOrder = getCachedGameOrder();
    if (cachedOrder.length > 0) {
      setGames(sortGamesByOrder(INITIAL_GAMES, cachedOrder));
    }
    fetchGameOrder().then((remoteOrder) => {
      if (isMounted && Array.isArray(remoteOrder) && remoteOrder.length > 0) {
        setGames(sortGamesByOrder(INITIAL_GAMES, remoteOrder));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
            thumbnailUrl: game?.thumbnailUrl,
            score,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
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

  // Game urutan #1 menjadi Kartu Utama Hero Banner, urutan #2 menjadi kartu kedua
  const featuredGames = [games[0], games[1] || games[0]].filter(Boolean);
  const selectedCategoryLabel =
    CATEGORIES.find((category) => category.id === selectedCategory)?.label ??
    "Semua Permainan";
  const displayGames =
    selectedCategory === "all"
      ? games
      : games.filter((g) => g.category === selectedCategory);

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
      logo: getGamePortalUrl("/TeknoGame_logo_red.png"),
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
              ? t.catalog.title
              : `${lang === "en" ? "Games Collection:" : "Koleksi Permainan:"} ${getLocalizedCategoryLabel(selectedCategory, lang)}`
          }
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={CATEGORIES}
        />
      </div>

      {/* 4. Section Papan Skor Mandiri (id="papan-skor") */}
      <section id="papan-skor" className="mb-4 scroll-mt-24 rounded-2xl card-natural p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="score-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-400/20">
              <Trophy className="h-4 w-4 text-amber-700" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                {t.leaderboard.title}
              </h2>
              <p className="text-xs text-slate-300">
                {t.leaderboard.subtitle}
              </p>
            </div>
          </div>
        </div>

        {topScores.length === 0 ? (
          <div className="py-8 text-center bg-white/[0.02] rounded-xl border border-white/10">
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === "en"
                ? "No scores recorded yet. Play a game now to start tracking your best score."
                : "Belum ada skor yang dicatat. Mainkan salah satu permainan sekarang untuk mulai mencatat skor terbaik Anda."}
            </p>
            <div className="mt-4">
              <Link
                href="/play/nusantara-runner"
                className="inline-flex items-center gap-2 rounded-full border border-[#686a74] bg-[#50525c] px-5 py-2.5 text-xs font-semibold text-[#fffafa] shadow-md transition-colors hover:border-[#858792] hover:bg-[#646671]"
              >
                <span>{lang === "en" ? "Play Nusantara Runner" : "Mainkan Nusantara Runner"}</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-3 ${
              topScores.length > 1
                ? "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
                : ""
            }`}
          >
            <article className="flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-[#d8c99e] bg-[#292a31] lg:min-h-0">
              <div className="relative min-h-[190px] flex-1">
                <ScoreGameArtwork
                  title={topScores[0].title}
                  thumbnailUrl={topScores[0].thumbnailUrl}
                  className="absolute inset-0"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#292a31] via-[#292a31]/25 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <span
                    className="text-xs font-bold uppercase tracking-[0.16em]"
                    style={{ color: "#ffd166" }}
                  >
                    {t.leaderboard.rank1}
                  </span>
                  <h3
                    className="mt-1 break-words text-xl font-bold sm:text-2xl"
                    style={{ color: "#fffafa" }}
                  >
                    {topScores[0].title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#292a31] p-4">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className="text-xl font-bold tracking-tight sm:text-2xl"
                    style={{ color: "#ffd166" }}
                  >
                    {topScores[0].score.toLocaleString(lang === "en" ? "en-US" : "id-ID")}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "#fffafa" }}>
                    {t.leaderboard.points}
                  </span>
                </div>
                <Link
                  href={`/play/${topScores[0].slug}`}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#686a74] bg-[#50525c] text-[#fffafa] shadow-sm transition-colors hover:border-[#858792] hover:bg-[#646671]"
                  title={t.leaderboard.playAgain}
                  aria-label={`${t.leaderboard.playAgain} ${topScores[0].title}`}
                >
                  <Play className="h-4 w-4 fill-current" />
                </Link>
              </div>
            </article>

            {topScores.length > 1 && (
              <div
                className={`grid content-start gap-2 ${
                  topScores.length === 5
                    ? "lg:h-full lg:grid-rows-4 lg:content-stretch"
                    : ""
                }`}
              >
                {topScores.slice(1).map((item, index) => (
                  <div
                    key={item.gameId}
                    className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[#d8c99e] bg-[#f5edda] p-2.5 sm:gap-3 sm:p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <ScoreGameArtwork
                        title={item.title}
                        thumbnailUrl={item.thumbnailUrl}
                        className="h-12 w-16 shrink-0 rounded-lg"
                        sizes="64px"
                      />
                      <div className="min-w-0">
                        <span
                          className="block text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: "#765b2c" }}
                        >
                          {t.leaderboard.rankPrefix} {index + 2}
                        </span>
                        <h4
                          className="truncate text-xs font-semibold sm:text-sm"
                          style={{ color: "#241b1d" }}
                        >
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="flex items-baseline gap-1.5 rounded-lg bg-[#303139] px-2 py-1.5">
                        <span
                          className="text-xl font-bold tracking-tight sm:text-2xl"
                          style={{ color: "#ffd166" }}
                        >
                          {item.score.toLocaleString(lang === "en" ? "en-US" : "id-ID")}
                        </span>
                        <span className="text-[9px] font-semibold" style={{ color: "#fffafa" }}>
                          {t.leaderboard.pointsUnit}
                        </span>
                      </div>
                      <Link
                        href={`/play/${item.slug}`}
                        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-[#686a74] bg-[#50525c] text-[#fffafa] shadow-sm transition-colors hover:border-[#858792] hover:bg-[#646671]"
                        title={t.leaderboard.playAgain}
                        aria-label={`${t.leaderboard.playAgain} ${item.title}`}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. Section Favorit Mandiri (id="favorit") */}
      <section id="favorit" className="mb-4 scroll-mt-24 rounded-2xl card-natural p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-rose-500/25 bg-rose-400/15">
              <Heart className="h-4 w-4 fill-current text-rose-600" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                {t.favorites.title}
              </h2>
              <p className="text-xs text-slate-300">
                {t.favorites.subtitle}
              </p>
            </div>
          </div>
        </div>

        {favoriteGames.length === 0 ? (
          <div className="py-8 text-center bg-white/[0.02] rounded-xl border border-white/10">
            <p className="text-xs sm:text-sm text-slate-300">
              {t.favorites.emptyDesc}
            </p>
            <div className="mt-4">
              <Link
                href="#katalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.04] text-xs font-semibold text-slate-200 hover:text-white hover:border-[#ce2541]/40 transition-colors"
              >
                <span>{t.favorites.browseCatalog}</span>
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

      {/* 6. Section Tentang Portal & Layanan Mitra */}
      {/* Kartu Atas: Tentang Portal */}
      <section className="card-natural mb-6 grid gap-6 p-6 sm:p-8 md:grid-cols-[1.1fr_1.9fr] md:items-center">
        <div>
          <p className="section-kicker mb-2">{t.about.kicker}</p>
          <h2 className="section-heading">
            {t.about.heading1} <span>{t.about.heading2}</span>
          </h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          {t.about.desc}
        </p>
      </section>

      {/* Kartu Tengah: Layanan Mitra (4 Kartu) */}
      <section className="mb-6" aria-labelledby="partner-services-title">
        <div className="mb-2 sm:mb-4 flex flex-wrap items-end justify-between gap-2 sm:gap-3">
          <div>
            <p className="section-kicker mb-2">{t.about.partnerKicker}</p>
            <h2 id="partner-services-title" className="section-heading">
              {t.about.partnerHeading1} <span>{t.about.partnerHeading2}</span>
            </h2>
          </div>
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="partner-service-link inline-flex min-h-11 items-center gap-2 rounded-full border px-3 sm:px-4 text-xs font-semibold transition-colors"
          >
            <span>{t.about.partnerButton}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Network className="h-5 w-5" />,
              title: t.about.services.network.title,
              description: t.about.services.network.description,
            },
            {
              icon: <Cloud className="h-5 w-5" />,
              title: t.about.services.cloud.title,
              description: t.about.services.cloud.description,
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: t.about.services.security.title,
              description: t.about.services.security.description,
            },
            {
              icon: <Code2 className="h-5 w-5" />,
              title: t.about.services.software.title,
              description: t.about.services.software.description,
            },
          ].map((service) => (
            <a
              key={service.title}
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="partner-service-card group rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5 transition-all duration-200 hover:border-[#ce2541]/50 hover:bg-white/[0.045] flex flex-col justify-between"
            >
              <div>
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-[#ce2541]/25 bg-[#610212]/30 text-[#ff8c9f] transition-colors group-hover:text-white">
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
      <section className="partner-panel mb-2 flex flex-col items-start justify-between gap-6 p-4 sm:p-8 md:flex-row md:items-center">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="section-kicker">
            {t.about.partnerPanelKicker}
          </span>
          <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
            {t.about.partnerPanelTitle}
          </h3>
          <p className="text-sm leading-6 text-slate-300">
            {t.about.partnerPanelDesc}
          </p>
        </div>
        <div className="relative z-10 w-full shrink-0 md:w-auto">
          <a
            href="https://teknotama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold btn-sponsor-clean md:w-auto shadow-md"
          >
            <span>{t.about.partnerPanelButton}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

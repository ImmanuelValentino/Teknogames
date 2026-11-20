import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryLabel,
  getGameBySlug,
  INITIAL_GAMES,
} from "@/lib/games-data";
import { getGamePortalPath, getGamePortalUrl } from "@/lib/site";
import GameFrame from "@/components/game/GameFrame";
import AdCompanion from "@/components/ads/AdCompanion";
import GameCard from "@/components/game/GameCard";
import GoogleAdSlot from "@/components/ads/GoogleAdSlot";
import { ArrowLeft, Keyboard, Smartphone, Info, ExternalLink } from "lucide-react";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return INITIAL_GAMES.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({
  params,
}: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Permainan Tidak Ditemukan",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${game.title} - Mainkan Gratis Tanpa Instalasi`,
    description: `${game.description} Mainkan langsung di peramban secara gratis di portal resmi Tekno Game oleh PT Teknotama Prakarsa Mulia.`,
    alternates: {
      canonical: getGamePortalPath(`/play/${game.slug}`),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: `${game.title} - Tekno Game`,
      description: game.description,
      url: getGamePortalUrl(`/play/${game.slug}`),
      type: "video.other",
      images: [
        {
          url: getGamePortalUrl("/TeknoGame_logo_red.png"),
          width: 800,
          height: 800,
          alt: game.title,
        },
      ],
    },
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = INITIAL_GAMES.filter(
    (g) => g.id !== game.id && (g.category === game.category || g.featured)
  ).slice(0, 4);

  const jsonLdGame = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    genre: getCategoryLabel(game.category),
    applicationCategory: "Game",
    operatingSystem: "Peramban web modern yang mendukung HTML5",
    url: getGamePortalUrl(`/play/${game.slug}`),
    inLanguage: "id",
    author: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Teknotama",
        item: "https://teknotama.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tekno Game",
        item: getGamePortalUrl(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: getCategoryLabel(game.category),
        item: getGamePortalUrl(`/category/${game.category}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: game.title,
        item: getGamePortalUrl(`/play/${game.slug}`),
      },
    ],
  };

  return (
    <div className="pt-6 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGame) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* Navigasi Breadcrumb */}
      <nav
        aria-label="Jejak navigasi"
        className="flex items-center gap-2 text-xs font-medium text-slate-300"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Semua Permainan</span>
        </Link>
        <span>/</span>
        <Link
          href={`/category/${game.category}`}
          className="capitalize hover:text-white transition-colors"
        >
          {getCategoryLabel(game.category)}
        </Link>
        <span>/</span>
        <span className="text-white font-semibold truncate max-w-xs">{game.title}</span>
      </nav>

      {/* Tata Letak Gameplay */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <GameFrame game={game} />

          {/* Kartu Informasi & Panduan Kendali */}
          <div className="rounded-2xl card-natural p-6 space-y-4 text-slate-300">
            <div>
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#ff8c9f]" />
                <span>Tentang {game.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {game.description}
              </p>
            </div>

            {game.controlsGuide && (
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                  Panduan Tombol
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {game.controlsGuide.keyboard && (
                    <div className="bg-black/20 p-3.5 rounded-xl border border-white/10">
                      <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
                        <Keyboard className="w-3.5 h-3.5 text-slate-300" />
                        <span>Papan ketik:</span>
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {game.controlsGuide.keyboard.map((k, idx) => (
                          <li key={idx}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {game.controlsGuide.touch && (
                    <div className="bg-black/20 p-3.5 rounded-xl border border-white/10">
                      <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-slate-300" />
                        <span>Layar sentuh (ponsel / tablet):</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {game.controlsGuide.touch}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Kanan: Companion Ad & Sponsor Card */}
        <div className="xl:col-span-1 flex flex-col items-center space-y-6 self-start xl:sticky xl:top-20 xl:items-start">
          <AdCompanion />

          <div className="w-[300px] rounded-2xl card-natural p-5 space-y-2.5">
            <span className="text-[10px] uppercase font-semibold text-[#ff8c9f] tracking-wider">
              Sponsor Resmi
            </span>
            <h4 className="font-heading text-sm font-bold text-white leading-snug">
              PT Teknotama Prakarsa Mulia
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Konsultasikan solusi infrastruktur teknologi informasi, sistem awan, keamanan data, dan perangkat lunak khusus bersama tim kami.
            </p>
            <div className="pt-1">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block min-h-11 w-full rounded-full py-3 text-center btn-sponsor-clean text-xs font-semibold shadow-sm"
              >
                <span>Kunjungi teknotama.com</span>
                <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Iklan Horizontal Tengah Ukuran 1080 x 90 */}
      <GoogleAdSlot
        slotType="leaderboard-1080x90"
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PLAY || ""}
      />

      {/* Rekomendasi Game Lainnya */}
      <section className="pt-4">
        <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-4">
          Permainan Lainnya Untuk Anda
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {relatedGames.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>
    </div>
  );
}

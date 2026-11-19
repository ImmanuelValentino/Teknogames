import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGamesByCategory, CATEGORIES } from "@/lib/games-data";
import { getGamePortalPath } from "@/lib/site";
import GameGrid from "@/components/game/GameGrid";
import GoogleAdSlot from "@/components/ads/GoogleAdSlot";
import { ArrowLeft, Gamepad2, Compass, Puzzle, Zap, Coffee, Trophy } from "lucide-react";
import { GameCategory } from "@/types/game";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
    category: c.id,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const validCat = CATEGORIES.find((c) => c.id === category);

  if (!validCat) {
    return {
      title: "Kategori Tidak Ditemukan",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `Permainan Kategori ${validCat.label}`,
    description: `Mainkan aneka permainan kategori ${validCat.label} secara gratis di portal resmi Tekno Game oleh PT Teknotama Prakarsa Mulia.`,
    alternates: {
      canonical: getGamePortalPath(`/category/${validCat.id}`),
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
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const validCat = CATEGORIES.find((c) => c.id === category);

  if (!validCat) {
    notFound();
  }

  const games = getGamesByCategory(category);

  const getCategoryHeroIcon = (id: GameCategory) => {
    switch (id) {
      case "arcade":
        return <Gamepad2 className="w-6 h-6 text-[#8caeff]" />;
      case "adventure":
        return <Compass className="w-6 h-6 text-emerald-200" />;
      case "puzzle":
        return <Puzzle className="w-6 h-6 text-sky-200" />;
      case "action":
        return <Zap className="w-6 h-6 text-rose-200" />;
      case "casual":
        return <Coffee className="w-6 h-6 text-amber-200" />;
      case "sports":
        return <Trophy className="w-6 h-6 text-yellow-200" />;
      default:
        return <Gamepad2 className="w-6 h-6 text-blue-200" />;
    }
  };

  return (
    <div className="pt-6 space-y-6">
      {/* Breadcrumb */}
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
        <span className="text-white font-semibold capitalize">
          {validCat.label}
        </span>
      </nav>

      {/* Header Banner Kategori */}
      <div className="rounded-2xl card-natural p-6 sm:p-8 flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
            {getCategoryHeroIcon(validCat.id)}
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
            Kategori: {validCat.label}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Jelajahi beragam permainan web kategori {validCat.label.toLowerCase()} secara gratis langsung di peramban.
          </p>
        </div>
      </div>

      {/* Slot Iklan Horizontal Tengah Ukuran 1080 x 90 */}
      <GoogleAdSlot
        slotType="leaderboard-1080x90"
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY || ""}
      />

      {/* Grid Katalog atau Tampilan Kondisi Kosong (Empty State) untuk Olahraga / Kategori Kosong */}
      {games.length === 0 ? (
        <div className="card-natural rounded-2xl p-10 sm:p-16 text-center my-8">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-amber-300">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-2">
            Belum Ada Permainan di Kategori {validCat.label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
            Permainan dalam kategori {validCat.label.toLowerCase()} sedang dalam tahap pengembangan oleh tim pengembang kami. Silakan jelajahi kategori permainan menarik lainnya!
          </p>
          <Link
            href="/#katalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full btn-primary-clean text-xs font-semibold shadow-md"
          >
            <span>Jelajahi Kategori Lainnya</span>
          </Link>
        </div>
      ) : (
        <GameGrid games={games} title={`Permainan ${validCat.label}`} />
      )}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Compass, Puzzle, Zap, Coffee, Dumbbell } from "lucide-react";
import { Game, GameCategory } from "@/types/game";
import { useTranslation, getLocalizedCategoryLabel } from "@/lib/i18n";
import GameGrid from "@/components/game/GameGrid";
import GoogleAdSlot from "@/components/ads/GoogleAdSlot";

interface CategoryViewProps {
  categoryId: GameCategory;
  defaultLabel: string;
  games: Game[];
  adSlot?: string;
}

export default function CategoryView({
  categoryId,
  defaultLabel,
  games,
  adSlot = "",
}: CategoryViewProps) {
  const { lang, t } = useTranslation();
  const catLabel = getLocalizedCategoryLabel(categoryId, lang);

  const getCategoryHeroIcon = (id: GameCategory) => {
    switch (id) {
      case "arcade":
        return <Gamepad2 className="w-6 h-6 text-red-700" strokeWidth={2.5} />;
      case "adventure":
        return <Compass className="w-6 h-6 text-emerald-700" strokeWidth={2.5} />;
      case "puzzle":
        return <Puzzle className="w-6 h-6 text-rose-700" strokeWidth={2.5} />;
      case "action":
        return <Zap className="w-6 h-6 text-rose-700" strokeWidth={2.5} />;
      case "casual":
        return <Coffee className="w-6 h-6 text-amber-700" strokeWidth={2.5} />;
      case "sports":
        return <Dumbbell className="w-6 h-6 text-yellow-700" strokeWidth={2.5} />;
      default:
        return <Gamepad2 className="w-6 h-6 text-red-700" strokeWidth={2.5} />;
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
          <span>{t.categoryPage.breadcrumbAll}</span>
        </Link>
        <span>/</span>
        <span className="text-white font-semibold capitalize">
          {catLabel}
        </span>
      </nav>

      {/* Header Banner Kategori */}
      <div className="rounded-2xl card-natural p-6 sm:p-8 flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-[#ce7c8a] bg-[#e09aa6] flex items-center justify-center shrink-0 shadow-sm">
              {getCategoryHeroIcon(categoryId)}
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t.categoryPage.categoryPrefix} {catLabel}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {t.categoryPage.descPrefix} {catLabel.toLowerCase()} {t.categoryPage.descSuffix}
          </p>
        </div>
      </div>

      {/* Slot Iklan Horizontal Tengah Ukuran 1080 x 90 */}
      <GoogleAdSlot
        slotType="leaderboard-1080x90"
        adSlot={adSlot}
      />

      {/* Grid Katalog atau Tampilan Kondisi Kosong (Empty State) */}
      {games.length === 0 ? (
        <div className="card-natural rounded-2xl p-10 sm:p-16 text-center my-8">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-2">
            {t.categoryPage.emptyTitle} {catLabel}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
            {t.categoryPage.emptyDescPrefix} {catLabel.toLowerCase()} {t.categoryPage.emptyDescSuffix}
          </p>
          <Link
            href="/#katalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full btn-primary-clean text-xs font-semibold shadow-md"
          >
            <span>{t.categoryPage.exploreOther}</span>
          </Link>
        </div>
      ) : (
        <GameGrid
          games={games}
          title={lang === "en" ? `${catLabel} Games` : `Permainan ${catLabel}`}
        />
      )}
    </div>
  );
}

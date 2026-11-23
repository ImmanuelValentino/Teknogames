"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Heart, Play, Gamepad2 } from "lucide-react";
import { getLocalFavorites, toggleLocalFavorite } from "@/lib/local-storage";
import { getCategoryLabel, INITIAL_GAMES } from "@/lib/games-data";
import { Game } from "@/types/game";
import { useTranslation, getLocalizedCategoryLabel } from "@/lib/i18n";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const { lang, t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      const favIds = getLocalFavorites();
      const matched = INITIAL_GAMES.filter((g) => favIds.includes(g.id));
      setFavoriteGames(matched);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemoveFavorite = (gameId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLocalFavorite(gameId);
    setFavoriteGames((prev) => prev.filter((g) => g.id !== gameId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-modal-clean rounded-2xl overflow-hidden flex flex-col text-white shadow-2xl">
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-rose-300 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-rose-300" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                {t.favorites.title}
              </h3>
              <p className="text-[11px] text-slate-300">
                {t.favorites.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
          {favoriteGames.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-300 flex items-center justify-center mx-auto">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                {t.favorites.emptyTitle}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {t.favorites.modalEmptyDesc}
              </p>
            </div>
          ) : (
            favoriteGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                      {game.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 capitalize block">
                      {getLocalizedCategoryLabel(game.category, lang)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveFavorite(game.id, e)}
                    title={t.favorites.removeFromFavorites}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label={t.favorites.removeFromFavorites}
                  >
                    <Heart className="w-4 h-4 fill-rose-400" />
                  </button>

                  <Link
                    href={`/play/${game.slug}`}
                    onClick={onClose}
                    className="flex min-h-11 items-center gap-1 rounded-full px-3 btn-primary-clean text-xs font-semibold shadow-sm"
                  >
                    <span>{t.favorites.playNow}</span>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-black/20 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <span>{favoriteGames.length} {lang === "en" ? "Saved Games" : "Permainan Tersimpan"}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-white/70 hover:text-white cursor-pointer"
          >
            {lang === "en" ? "Close" : "Tutup"}
          </button>
        </div>
      </div>
    </div>
  );
}

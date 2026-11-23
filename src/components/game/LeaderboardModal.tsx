"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Play, Trash2, Trophy, Gamepad2 } from "lucide-react";
import { getLocalScores, clearLocalScores } from "@/lib/local-storage";
import { getCategoryLabel, INITIAL_GAMES } from "@/lib/games-data";
import { useTranslation, getLocalizedCategoryLabel } from "@/lib/i18n";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [localScores, setLocalScores] = useState<Record<string, number>>({});
  const { lang, t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setLocalScores(getLocalScores());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const scoreEntries = Object.entries(localScores)
    .map(([gameId, score]) => {
      const gameInfo = INITIAL_GAMES.find((g) => g.id === gameId);
      return {
        gameId,
        score,
        title: gameInfo?.title || gameId.replace(/-/g, " "),
        category: gameInfo ? getLocalizedCategoryLabel(gameInfo.category, lang) : (lang === "en" ? "Game" : "Permainan"),
        slug: gameInfo?.slug || gameId,
      };
    })
    .sort((a, b) => b.score - a.score);

  const totalPlayed = scoreEntries.length;
  const bestScore = scoreEntries.length > 0 ? scoreEntries[0].score : 0;
  const topEntries = scoreEntries.slice(0, 5);

  const handleClear = () => {
    if (window.confirm(t.leaderboard.clearConfirm)) {
      clearLocalScores();
      setLocalScores({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-3xl glass-modal-clean rounded-2xl overflow-hidden flex flex-col text-white shadow-2xl">
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-[#9a7a3d] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                {t.leaderboard.title}
              </h3>
              <p className="text-[11px] text-slate-300">
                {t.leaderboard.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={lang === "en" ? "Close" : "Tutup"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 p-3 bg-black/15 border-b border-white/10 text-center gap-2">
          <div className="bg-white/[0.04] py-2 px-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.leaderboard.recordedGames}</span>
            <span className="text-sm font-bold text-white">{totalPlayed} {t.leaderboard.titlesCount}</span>
          </div>
          <div className="bg-white/[0.04] py-2 px-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.leaderboard.highestScore}</span>
            <span className="text-sm font-bold text-[#876a32]">
              {bestScore.toLocaleString(lang === "en" ? "en-US" : "id-ID")} {t.leaderboard.points}
            </span>
          </div>
        </div>

        <div className="p-4 max-h-[min(60vh,520px)] overflow-y-auto">
          {scoreEntries.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-300 flex items-center justify-center mx-auto">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                {t.leaderboard.emptyTitle}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {t.leaderboard.emptyDesc}
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 gap-3 ${
                topEntries.length > 1
                  ? "md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:items-stretch"
                  : ""
              }`}
            >
              <article className="flex min-h-56 flex-col justify-between rounded-2xl border border-[#d8c99e] bg-[#f5edda] p-5 sm:p-6 md:aspect-square md:min-h-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#876a32]">
                      {t.leaderboard.rank1}
                    </span>
                    <h4 className="mt-2 text-lg font-bold text-[#241b1d] sm:text-2xl">
                      {topEntries[0].title}
                    </h4>
                    <span className="mt-1 block text-xs text-slate-600">
                      {topEntries[0].category}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eadfbe] text-[#876a32]">
                    <Trophy className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <span className="block text-3xl font-bold tracking-tight text-[#765b2c] sm:text-4xl">
                      {topEntries[0].score.toLocaleString(lang === "en" ? "en-US" : "id-ID")}
                    </span>
                    <span className="mt-1 block text-xs text-slate-600">{t.leaderboard.points}</span>
                  </div>
                  <Link
                    href={`/play/${topEntries[0].slug}`}
                    onClick={onClose}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg btn-primary-clean text-white"
                    title={t.leaderboard.playAgain}
                  >
                    <Play className="h-4 w-4 fill-current" />
                  </Link>
                </div>
              </article>

              {topEntries.length > 1 && (
                <div className="grid grid-cols-1 gap-2 md:h-full md:grid-rows-4">
                  {topEntries.slice(1).map((entry, index) => (
                    <div
                      key={entry.gameId}
                      className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08] md:h-full"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eee5d2] text-xs font-bold text-[#765b2c]">
                          {index + 2}
                        </span>
                        <div className="min-w-0">
                          <h4 className="truncate text-xs font-semibold text-white sm:text-sm">
                            {entry.title}
                          </h4>
                          <span className="block text-[10px] text-slate-400">
                            {entry.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <span className="block text-xs font-bold text-[#876a32] sm:text-sm">
                            {entry.score.toLocaleString(lang === "en" ? "en-US" : "id-ID")}
                          </span>
                          <span className="block text-[9px] text-slate-400">{t.leaderboard.pointsUnit}</span>
                        </div>
                        <Link
                          href={`/play/${entry.slug}`}
                          onClick={onClose}
                          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg btn-primary-clean text-white"
                          title={t.leaderboard.playAgain}
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
        </div>

        <div className="p-3 bg-black/20 border-t border-white/10 flex items-center justify-between">
          {scoreEntries.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.leaderboard.clearHistory}</span>
            </button>
          ) : (
            <div />
          )}

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

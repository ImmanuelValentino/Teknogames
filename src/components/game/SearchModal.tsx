"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Play, Gamepad2 } from "lucide-react";
import { getCategoryLabel, INITIAL_GAMES, searchGames } from "@/lib/games-data";
import { Game } from "@/types/game";
import { useTranslation, getLocalizedCategoryLabel } from "@/lib/i18n";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { lang, t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>(INITIAL_GAMES.slice(0, 6));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(INITIAL_GAMES.slice(0, 6));
      return;
    }
    setResults(searchGames(query));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-xl glass-modal-clean rounded-2xl overflow-hidden text-white shadow-2xl">
        <div className="p-3.5 border-b border-white/10 flex items-center gap-2.5 bg-black/20">
          <Search className="w-4 h-4 text-slate-300 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchModal.placeholder}
            className="w-full text-sm font-medium text-white placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={t.searchModal.closeLabel}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-[380px] overflow-y-auto space-y-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              {t.searchModal.emptyResult} &quot;{query}&quot;. {t.searchModal.tryOther}
            </div>
          ) : (
            results.map((game) => (
              <Link
                key={game.id}
                href={`/play/${game.slug}`}
                onClick={onClose}
                className="flex min-h-11 items-center justify-between rounded-xl p-2.5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-rose-200 transition-colors truncate">
                      {game.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 capitalize block">
                      {getLocalizedCategoryLabel(game.category, lang)}
                    </span>
                  </div>
                </div>

                <span className="w-7 h-7 rounded-lg btn-primary-clean text-white flex items-center justify-center shrink-0">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Game } from "@/types/game";
import { GameCategory } from "@/types/game";
import { searchGames } from "@/lib/games-data";
import GameCard from "./GameCard";
import AdNativeTile from "../ads/AdNativeTile";

interface CategoryOption {
  id: GameCategory;
  label: string;
}

interface GameGridProps {
  games: Game[];
  title?: string;
  selectedCategory?: GameCategory;
  onSelectCategory?: (cat: GameCategory) => void;
  categories?: CategoryOption[];
}

export default function GameGrid({
  games,
  title = "Semua Koleksi Permainan",
  selectedCategory = "all",
  onSelectCategory,
  categories = [],
}: GameGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isEmpty = !games || games.length === 0;
  const matchingGameIds = new Set(
    searchGames(searchQuery).map((game) => game.id)
  );
  const filteredGames = games.filter((game) => matchingGameIds.has(game.id));

  return (
    <section id="catalog" className="mb-14 scroll-mt-28">
      {/* Section Header dengan Dropdown Kategori */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker mb-2">Pilih permainan</p>
          <h2 className="section-heading">{title}</h2>
        </div>

        {/* Pencarian dan dropdown filter kategori */}
        {categories.length > 0 && onSelectCategory && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <label className="relative flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 text-sm text-slate-300 transition-colors focus-within:border-[#255dce]/60 sm:w-64">
              <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari permainan..."
                aria-label="Cari permainan"
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </label>

            <div className="relative shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value as GameCategory)}
                className="
                appearance-none
                min-h-11
                rounded-xl
                border border-white/15
                bg-white/[0.04]
                pl-4 pr-10
                py-2.5
                text-sm
                font-medium
                text-slate-200
                cursor-pointer
                hover:border-[#255dce]/50
                hover:text-white
                focus:outline-none
                focus:border-[#255dce]/60
                transition-colors
                w-full sm:w-auto
              "
                aria-label="Filter berdasarkan kategori"
              >
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="bg-[#0a1628] text-slate-200"
                  >
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid Konten */}
      {isEmpty || filteredGames.length === 0 ? (
        <div className="card-natural rounded-2xl p-8 py-16 text-center">
          <h3 className="font-heading text-base font-semibold text-white">
            Permainan Tidak Ditemukan
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau pilih kategori lain untuk
            menemukan permainan yang Anda cari.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map((game, index) => {
            if (index === 7) {
              return (
                <React.Fragment key="sponsored-tile-native">
                  <GameCard game={game} />
                  <AdNativeTile />
                </React.Fragment>
              );
            }
            return <GameCard key={game.id} game={game} />;
          })}
        </div>
      )}
    </section>
  );
}

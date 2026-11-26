"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Search } from "lucide-react";
import { Game } from "@/types/game";
import { GameCategory } from "@/types/game";
import { searchGames } from "@/lib/games-data";
import GameCard from "./GameCard";
import CategoryIcon from "./CategoryIcon";

const AdNativeTile = dynamic(() => import("../ads/AdNativeTile"), {
  ssr: false,
});
import { useTranslation, getLocalizedCategoryLabel } from "@/lib/i18n";

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
  title,
  selectedCategory = "all",
  onSelectCategory,
  categories = [],
}: GameGridProps) {
  const { lang, t } = useTranslation();
  const displayTitle = title ?? t.catalog.title;
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryMenuId = useId();
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const categoryOptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isEmpty = !games || games.length === 0;
  const matchingGameIds = new Set(
    searchGames(searchQuery).map((game) => game.id)
  );
  const filteredGames = games.filter((game) => matchingGameIds.has(game.id));
  const selectedCategoryIndex = categories.findIndex(
    (category) => category.id === selectedCategory
  );
  const selectedCategoryLabel = getLocalizedCategoryLabel(selectedCategory, lang);

  useEffect(() => {
    if (!categoryMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setCategoryMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCategoryMenuOpen(false);
        categoryTriggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [categoryMenuOpen]);

  const focusCategoryOption = (index: number) => {
    if (categories.length === 0) return;
    const wrappedIndex = (index + categories.length) % categories.length;
    categoryOptionRefs.current[wrappedIndex]?.focus();
  };

  return (
    <section id="catalog" className="mb-4 scroll-mt-28">
      {/* Section Header dengan Dropdown Kategori */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker mb-2">{t.catalog.kicker}</p>
          <h2 className="section-heading">{displayTitle}</h2>
        </div>

        {/* Pencarian dan dropdown filter kategori */}
        {categories.length > 0 && onSelectCategory && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <label className="relative flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 text-sm text-slate-300 transition-colors focus-within:border-[#d9141d]/60 sm:w-64">
              <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t.catalog.searchPlaceholder}
                aria-label={t.catalog.searchAriaLabel}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </label>

            <div ref={categoryMenuRef} className="relative w-full shrink-0 sm:w-auto">
              <button
                ref={categoryTriggerRef}
                type="button"
                onClick={() => setCategoryMenuOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setCategoryMenuOpen(true);
                    requestAnimationFrame(() => {
                      focusCategoryOption(
                        selectedCategoryIndex >= 0 ? selectedCategoryIndex : 0
                      );
                    });
                  }
                }}
                className="catalog-category-trigger flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors sm:w-60"
                aria-label={t.catalog.selectCategory}
                aria-haspopup="menu"
                aria-expanded={categoryMenuOpen}
                aria-controls={categoryMenuId}
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <CategoryIcon category={selectedCategory} />
                  {selectedCategoryLabel}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                    categoryMenuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {categoryMenuOpen && (
                <div
                  id={categoryMenuId}
                  role="menu"
                  aria-label={t.catalog.selectCategory}
                  className="glass-modal absolute right-0 top-full z-30 mt-1.5 max-h-64 w-full overflow-y-auto rounded-2xl border p-1.5 shadow-2xl sm:w-60"
                >
                  {categories.map((category, index) => (
                    <React.Fragment key={category.id}>
                      {index === 1 && <div className="my-1 h-px bg-[var(--line)]" />}
                      <button
                        ref={(element) => {
                          categoryOptionRefs.current[index] = element;
                        }}
                        type="button"
                        role="menuitemradio"
                        aria-checked={category.id === selectedCategory}
                        tabIndex={category.id === selectedCategory ? 0 : -1}
                        onClick={() => {
                          onSelectCategory(category.id);
                          setCategoryMenuOpen(false);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            focusCategoryOption(index + 1);
                          } else if (event.key === "ArrowUp") {
                            event.preventDefault();
                            focusCategoryOption(index - 1);
                          } else if (event.key === "Home") {
                            event.preventDefault();
                            focusCategoryOption(0);
                          } else if (event.key === "End") {
                            event.preventDefault();
                            focusCategoryOption(categories.length - 1);
                          } else if (event.key === "Escape") {
                            setCategoryMenuOpen(false);
                            categoryTriggerRef.current?.focus();
                          }
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                          category.id === selectedCategory
                            ? "font-semibold"
                            : "font-medium"
                        }`}
                      >
                        <CategoryIcon category={category.id} />
                        <span>{getLocalizedCategoryLabel(category.id, lang)}</span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grid Konten */}
      {isEmpty || filteredGames.length === 0 ? (
        <div className="card-natural rounded-2xl p-8 py-16 text-center">
          <h3 className="font-heading text-base font-semibold text-white">
            {lang === "en" ? "No Games Found" : "Permainan Tidak Ditemukan"}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            {lang === "en"
              ? "Try changing your search query or select another category to find games."
              : "Coba ubah kata kunci pencarian atau pilih kategori lain untuk menemukan permainan yang Anda cari."}
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

"use client";

import React from "react";
import { CATEGORIES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";
import { useTranslation, getLocalizedCategoryLabel } from "@/lib/i18n";
import CategoryIcon from "./CategoryIcon";

interface CategoryChipsProps {
  selectedCategory: GameCategory;
  onSelectCategory: (cat: GameCategory) => void;
}

export default function CategoryChips({
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  const { lang } = useTranslation();
  return (
    <div className="py-2 mb-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`min-h-10 shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                isSelected
                  ? "bg-white text-slate-900 shadow-md scale-[1.02]"
                  : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <span><CategoryIcon category={cat.id} /></span>
              <span>{getLocalizedCategoryLabel(cat.id, lang)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { CATEGORIES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";
import {
  Gamepad2,
  Compass,
  Puzzle,
  Zap,
  Coffee,
  Dumbbell,
} from "lucide-react";

interface CategoryChipsProps {
  selectedCategory: GameCategory;
  onSelectCategory: (cat: GameCategory) => void;
}

export default function CategoryChips({
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  const getCategoryIcon = (id: GameCategory) => {
    switch (id) {
      case "arcade":
        return <Gamepad2 className="w-3.5 h-3.5" />;
      case "adventure":
        return <Compass className="w-3.5 h-3.5" />;
      case "puzzle":
        return <Puzzle className="w-3.5 h-3.5" />;
      case "action":
        return <Zap className="w-3.5 h-3.5" />;
      case "casual":
        return <Coffee className="w-3.5 h-3.5" />;
      case "sports":
        return <Dumbbell className="w-3.5 h-3.5" />;
      default:
        return <Gamepad2 className="w-3.5 h-3.5" />;
    }
  };

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
              <span>{getCategoryIcon(cat.id)}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

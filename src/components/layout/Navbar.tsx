"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dices,
  Trophy,
  Heart,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  Gamepad2,
  Compass,
  Puzzle,
  Zap,
  Coffee,
} from "lucide-react";
import { INITIAL_GAMES, CATEGORIES } from "@/lib/games-data";
import { GameCategory } from "@/types/game";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRandomPlay = () => {
    if (!INITIAL_GAMES.length) return;
    const randomIndex = Math.floor(Math.random() * INITIAL_GAMES.length);
    const randomGame = INITIAL_GAMES[randomIndex];
    router.push(`/play/${randomGame.slug}`);
    setMobileMenuOpen(false);
  };

  const getCategoryIcon = (id: GameCategory) => {
    switch (id) {
      case "arcade":
        return <Gamepad2 className="w-4 h-4 text-[#8caeff]" />;
      case "adventure":
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case "puzzle":
        return <Puzzle className="w-4 h-4 text-sky-400" />;
      case "action":
        return <Zap className="w-4 h-4 text-purple-400" />;
      case "casual":
        return <Coffee className="w-4 h-4 text-amber-400" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-[#8caeff]" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Brand */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 group select-none"
              title="Tekno Game"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                <Image
                  src="/games/Teknogame_logo_only.png"
                  alt="Logo Tekno Game"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-xl font-bold tracking-tight text-white sm:text-[1.35rem]">
                    Tekno
                  </span>
                  <span className="font-heading text-xl font-bold tracking-tight text-[#8caeff] sm:text-[1.35rem]">
                    Game
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-300">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors"
            >
              Beranda
            </Link>

            {/* Pilihan Kategori (Dropdown 6 Kategori) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
                aria-expanded={dropdownOpen}
              >
                <span>Kategori</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-52 rounded-2xl glass-modal p-1.5 z-50 shadow-2xl border border-white/10">
                  <Link
                    href="/#katalog"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/8 transition-colors"
                  >
                    <Gamepad2 className="w-4 h-4 text-[#8caeff]" />
                    <span>Semua Permainan</span>
                  </Link>
                  <div className="h-px bg-white/8 my-1" />
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      {getCategoryIcon(cat.id)}
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main Acak */}
            <button
              type="button"
              onClick={handleRandomPlay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <Dices className="w-4 h-4 text-slate-400" />
              <span>Main Acak</span>
            </button>

            {/* Papan Skor (Direct Smooth Scroll Anchor) */}
            <Link
              href="/#papan-skor"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Papan Skor</span>
            </Link>

            {/* Favorit (Direct Smooth Scroll Anchor) */}
            <Link
              href="/#favorit"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Favorit</span>
            </Link>
          </nav>

          {/* Sisi Kanan: Link Sponsor teknotama.com */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold shadow-sm transition sm:inline-flex btn-sponsor"
            >
              <span>teknotama.com</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:text-white lg:hidden"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#255dce]/10 bg-[#0a0e1a] px-4 py-4 space-y-2 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/8 transition-colors"
          >
            <Gamepad2 className="w-4 h-4 text-[#8caeff]" />
            <span>Beranda</span>
          </Link>

          <div className="pt-2 text-xs font-semibold text-slate-500 px-3">
            Kategori Permainan
          </div>
          <div className="grid grid-cols-2 gap-1 px-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === "all" ? "/#katalog" : `/category/${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/8 transition-colors"
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/8 my-2" />

          <button
            type="button"
            onClick={handleRandomPlay}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/8"
          >
            <Dices className="w-4 h-4" />
            <span>Main Acak</span>
          </button>

          <Link
            href="/#papan-skor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/8"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Papan Skor</span>
          </Link>

          <Link
            href="/#favorit"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/8"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Favorit</span>
          </Link>

          <div className="pt-2">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 w-full items-center justify-between rounded-full px-4 py-2.5 text-xs font-semibold shadow-md btn-sponsor"
            >
              <span>Kunjungi teknotama.com</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
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
  Moon,
  Sun,
} from "lucide-react";
import { INITIAL_GAMES, CATEGORIES } from "@/lib/games-data";
import CategoryIcon from "@/components/game/CategoryIcon";
import { useTranslation, getLocalizedCategoryLabel } from "@/lib/i18n";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "teknogame-theme";
const THEME_CHANGE_EVENT = "teknogame-theme-change";

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeToTheme(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    document.documentElement.dataset.theme = event.newValue === "dark" ? "dark" : "light";
    onChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, () => "light");
  const { lang, setLang, t } = useTranslation();
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

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.error("Preferensi tema tidak dapat disimpan.", error);
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
              className="navbar-brand flex items-center gap-2.5 group select-none"
              title="Tekno Game"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                <Image
                  src="/games/TeknoGame_logo_red.png"
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
                  <span className="navbar-brand-accent font-heading text-xl font-bold tracking-tight sm:text-[1.35rem]">
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
              {t.nav.home}
            </Link>

            {/* Pilihan Kategori (Dropdown 6 Kategori) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
                aria-expanded={dropdownOpen}
              >
                <span>{t.nav.categories}</span>
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
                    <CategoryIcon category="all" />
                    <span>{t.nav.allGames}</span>
                  </Link>
                  <div className="h-px bg-white/8 my-1" />
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      <CategoryIcon category={cat.id} />
                      <span>{getLocalizedCategoryLabel(cat.id, lang)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main Acak */}
            <button
              type="button"
              onClick={handleRandomPlay}
              className="navbar-random-play flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <Dices className="w-4 h-4 text-slate-400" />
              <span>{t.nav.randomPlay}</span>
            </button>

            {/* Papan Skor (Direct Smooth Scroll Anchor) */}
            <Link
              href="/#papan-skor"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <span className="score-icon flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-400/20">
                <Trophy className="h-4 w-4 text-amber-700" strokeWidth={2.5} />
              </span>
              <span>{t.nav.leaderboard}</span>
            </Link>

            {/* Favorit (Direct Smooth Scroll Anchor) */}
            <Link
              href="/#favorit"
              className="navbar-favorites-link flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/25 bg-rose-400/15">
                <Heart className="h-4 w-4 fill-current text-rose-600" strokeWidth={2.5} />
              </span>
              <span>{t.nav.favorites}</span>
            </Link>
          </nav>

          {/* Sisi Kanan: Theme Toggle, Language Switcher, Link Sponsor teknotama.com */}
          <div className="flex items-center gap-2">
            {/* Language Switcher ID | EN */}
            <div
              className={`flex h-11 items-center rounded-full border p-1 text-xs font-bold transition-colors ${
                theme === "dark"
                    ? "border-[#51535c] bg-[#2b2d34]"
                    : "border-[#e5d9d5] bg-[#fffafa]"
              }`}
              role="group"
              aria-label={t.nav.switchLanguage}
            >
              <button
                type="button"
                onClick={() => setLang("id")}
                className={`h-full px-2.5 rounded-full transition-all text-xs font-bold ${
                  lang === "id"
                    ? "bg-[#d9141d] text-white shadow-sm"
                    : theme === "dark"
                    ? "text-slate-400 hover:text-white"
                    : "text-[#62595a] hover:text-[#101010]"
                }`}
                aria-pressed={lang === "id"}
                title="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`h-full px-2.5 rounded-full transition-all text-xs font-bold ${
                  lang === "en"
                    ? "bg-[#d9141d] text-white shadow-sm"
                    : theme === "dark"
                    ? "text-slate-400 hover:text-white"
                    : "text-[#62595a] hover:text-[#101010]"
                }`}
                aria-pressed={lang === "en"}
                title="English"
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`navbar-theme-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors ${
                theme === "dark"
                  ? "border-[#51535c] bg-[#2b2d34] text-[#fffafa]"
                  : "border-[#e5d9d5] bg-[#fffafa] text-[#101010]"
              }`}
              aria-label={theme === "dark" ? t.nav.themeToggleLight : t.nav.themeToggleDark}
              aria-pressed={theme === "dark"}
              title={theme === "dark" ? t.nav.themeDark : t.nav.themeLight}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold shadow-sm transition sm:inline-flex btn-sponsor"
            >
              <span>teknotama.com</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:text-white lg:hidden"
              aria-label={t.nav.menuLabel}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#d9141d]/10 bg-[#1a0a0d] px-4 py-4 space-y-2 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/8 transition-colors"
          >
            <Gamepad2 className="w-4 h-4 text-[#ff6b70]" />
            <span>{t.nav.home}</span>
          </Link>

          <div className="pt-2 text-xs font-semibold text-slate-500 px-3">
            {t.nav.categoriesTitle}
          </div>
          <div className="grid grid-cols-2 gap-1 px-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === "all" ? "/#katalog" : `/category/${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/8 transition-colors"
              >
                <CategoryIcon category={cat.id} />
                <span>{getLocalizedCategoryLabel(cat.id, lang)}</span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/8 my-2" />

          <button
            type="button"
            onClick={handleRandomPlay}
            className="navbar-random-play flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/8"
          >
            <Dices className="w-4 h-4" />
            <span>{t.nav.randomPlay}</span>
          </button>

          <Link
            href="/#papan-skor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/8"
          >
            <span className="score-icon flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-400/20">
              <Trophy className="h-4 w-4 text-amber-700" strokeWidth={2.5} />
            </span>
            <span>{t.nav.leaderboard}</span>
          </Link>

          <Link
            href="/#favorit"
            onClick={() => setMobileMenuOpen(false)}
            className="navbar-favorites-link flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/8"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/25 bg-rose-400/15">
              <Heart className="h-4 w-4 fill-current text-rose-600" strokeWidth={2.5} />
            </span>
            <span>{t.nav.favorites}</span>
          </Link>

          <div className="pt-2">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 w-full items-center justify-between rounded-full px-4 py-2.5 text-xs font-semibold shadow-md btn-sponsor"
            >
              <span>{t.nav.visitTeknotama}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

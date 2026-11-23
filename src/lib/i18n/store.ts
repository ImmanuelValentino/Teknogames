"use client";

import { useSyncExternalStore } from "react";
import { Game, GameCategory } from "@/types/game";
import { idDictionary, enDictionary, Dictionary } from "./dictionaries";

export type Locale = "id" | "en";

export const LANG_STORAGE_KEY = "teknogame-lang";
export const LANG_CHANGE_EVENT = "teknogame-lang-change";

export function getLanguage(): Locale {
  if (typeof window === "undefined") return "id";
  const datasetLang = document.documentElement.dataset.lang as Locale | undefined;
  if (datasetLang === "en" || datasetLang === "id") return datasetLang;
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "en" || stored === "id") return stored;
  } catch {
    // localStorage not accessible
  }
  return "id";
}

export function setLanguage(lang: Locale): void {
  if (typeof window === "undefined") return;
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (err) {
    console.error("Preferensi bahasa tidak dapat disimpan.", err);
  }
  window.dispatchEvent(new Event(LANG_CHANGE_EVENT));
}

export function subscribeToLanguage(onChange: () => void): () => void {
  function handleStorage(event: StorageEvent) {
    if (event.key !== LANG_STORAGE_KEY && event.key !== null) return;
    const next: Locale = event.newValue === "en" ? "en" : "id";
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next;
    onChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LANG_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LANG_CHANGE_EVENT, onChange);
  };
}

export function useTranslation() {
  const lang: Locale = useSyncExternalStore<Locale>(
    subscribeToLanguage,
    getLanguage,
    () => "id"
  );
  const t: Dictionary = lang === "en" ? enDictionary : idDictionary;
  const isEn = lang === "en";

  return {
    lang,
    isEn,
    setLang: setLanguage,
    toggleLang: () => setLanguage(lang === "id" ? "en" : "id"),
    t,
  };
}

export function getLocalizedCategoryLabel(category: GameCategory, lang: Locale | string): string {
  const dict = lang === "en" ? enDictionary : idDictionary;
  return dict.categories[category] || dict.categories.all;
}

export function getLocalizedGame(game: Game, lang: Locale | string): {
  description: string;
  controlsGuide?: { keyboard?: string[]; touch?: string };
} {
  if (lang === "en" && enDictionary.games[game.slug]) {
    const translated = enDictionary.games[game.slug];
    return {
      description: translated.description || game.description,
      controlsGuide: translated.controlsGuide || game.controlsGuide,
    };
  }
  return {
    description: game.description,
    controlsGuide: game.controlsGuide,
  };
}

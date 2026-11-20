"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { CATEGORIES, INITIAL_GAMES } from "@/lib/games-data";

export default function Footer() {
  const router = useRouter();

  const handleRandomPlay = () => {
    if (!INITIAL_GAMES.length) return;
    const randomGame = INITIAL_GAMES[Math.floor(Math.random() * INITIAL_GAMES.length)];
    router.push(`/play/${randomGame.slug}`);
  };

  return (
    <footer className="mt-2 pt-4 pb-8 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 border-b border-[#b6a8aa] pb-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.85fr_0.85fr_1.2fr]">
          {/* Kolom 1: Identitas */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/games/TeknoGame_logo_red.png"
                  alt="Logo Tekno Game"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-lg font-bold text-white">
                  Tekno
                </span>
                <span className="font-heading text-lg font-bold text-[#ff8c9f]">
                  Game
                </span>
              </div>
            </Link>
            <p className="text-slate-300 text-xs leading-relaxed">
              Portal permainan web HTML5 resmi persembahan PT Teknotama Prakarsa Mulia. Mainkan permainan gratis langsung di peramban tanpa perlu memasang aplikasi.
            </p>
          </div>

          {/* Kolom 2: Kategori permainan */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Kategori
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/#katalog" className="hover:text-white transition-colors">
                  Semua Permainan
                </Link>
              </li>
              {CATEGORIES.filter((cat) => cat.id !== "all").map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="hover:text-white transition-colors"
                  >
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Navigasi */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Navigasi
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleRandomPlay}
                  className="border-0 bg-transparent p-0 text-left text-[#843441] transition-colors hover:text-[#642832]"
                >
                  Main Acak
                </button>
              </li>
              <li>
                <Link href="/#papan-skor" className="hover:text-white transition-colors">
                  Papan Skor
                </Link>
              </li>
              <li>
                <Link href="/#favorit" className="hover:text-white transition-colors">
                  Favorit
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Mitra */}
          <div className="space-y-1.5">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Partner Teknologi Resmi
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              Didukung oleh <strong className="text-white font-semibold">PT Teknotama Prakarsa Mulia</strong>, penyedia solusi infrastruktur teknologi informasi, sistem awan, keamanan data, dan pengembangan perangkat lunak khusus untuk mendukung bisnis Anda.
            </p>
            <div className="pt-1">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 btn-sponsor-clean text-xs font-medium shadow-sm"
              >
                <span>Kunjungi teknotama.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="flex flex-col items-center justify-between gap-2 pt-4 text-slate-400 text-[11px] sm:flex-row">
          <p>© 2026 Tekno Game. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://teknotama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#ff8c9f] hover:text-white transition-colors"
            >
              <span>PT Teknotama Prakarsa Mulia</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Game } from "@/types/game";
import {
  Maximize,
  Minimize,
  RotateCcw,
  Heart,
  Share2,
  Trophy,
  Check,
  X,
  Gamepad2,
} from "lucide-react";
import { getCategoryLabel } from "@/lib/games-data";
import {
  toggleLocalFavorite,
  getLocalFavorites,
  addRecentGame,
  saveLocalScore,
} from "@/lib/local-storage";

interface GameFrameProps {
  game: Game;
  onOpenLeaderboard?: () => void;
}

export default function GameFrame({ game, onOpenLeaderboard }: GameFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [lastScore, setLastScore] = useState<number | null>(null);

  useEffect(() => {
    const favs = getLocalFavorites();
    setIsFavorite(favs.includes(game.id));
    addRecentGame(game.id);
  }, [game.id]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "GAME_OVER") {
        const score = Number(e.data.score) || 0;
        setLastScore(score);
        saveLocalScore(game.id, score);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [game.id]);

  useEffect(() => {
    if (lastScore !== null) {
      const timer = setTimeout(() => {
        setLastScore(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [lastScore]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleToggleFavorite = () => {
    const next = toggleLocalFavorite(game.id);
    setIsFavorite(next);
    setToastMessage(next ? "Ditambahkan ke Favorit" : "Dihapus dari Favorit");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleShare = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : `https://teknotama.com/games/play/${game.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${game.title} - Tekno Game`,
          text: `Mainkan ${game.title} di Tekno Game resmi PT Teknotama Prakarsa Mulia:`,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setToastMessage("Tautan berhasil disalin!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/games";
  const gameSrc = `${basePath}${game.gamePath.startsWith("/") ? game.gamePath : `/${game.gamePath}`}`;

  return (
    <div className="flex flex-col gap-3 relative">
      {/* Toast Notifikasi */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-modal-clean px-4 py-2 rounded-xl text-white text-xs font-medium shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Kontainer Layar Permainan (Iframe) */}
      <div
        ref={containerRef}
        suppressHydrationWarning
        data-grammarly-skip="true"
        data-enable-grammarly="false"
        className={`relative w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-lg transition-all ${
          isFullscreen ? "h-screen rounded-none" : "h-[450px] sm:h-[540px] md:h-[600px]"
        }`}
      >
        <iframe
          ref={iframeRef}
          src={gameSrc}
          title={game.title}
          className="w-full h-full border-0 select-none"
          allow="autoplay; fullscreen; pointer-lock"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        />

        {/* Overlay Skor Selesai */}
        {lastScore !== null && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 glass-modal-clean rounded-2xl p-4 shadow-xl text-white flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-white/70 block">Permainan selesai! Skor:</span>
              <span className="text-lg font-bold text-amber-300">
                {lastScore.toLocaleString("id-ID")} Poin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenLeaderboard?.()}
                className="min-h-11 px-3 btn-primary-clean text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Lihat Rekor
              </button>
              <button
                type="button"
                onClick={() => setLastScore(null)}
                className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bilah Kontrol Bersih & Alami */}
      <div className="rounded-2xl card-natural p-3 sm:p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white">
            <Gamepad2 className="w-5 h-5 text-[#8caeff]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-sm sm:text-base font-semibold text-white leading-tight truncate">
              {game.title}
            </h1>
            <span className="text-[11px] text-white/60 capitalize">
              {getCategoryLabel(game.category)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Tombol Favorit */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
            className={`min-h-11 min-w-11 p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
              isFavorite
                ? "bg-[#8a1347] border-rose-300 text-white"
                : "bg-white/10 border-white/10 text-slate-300 hover:text-white hover:bg-white/15"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-white text-white" : ""
              }`}
            />
          </button>

          {/* Tombol Bagikan */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Bagikan Tautan Permainan"
            className="min-h-11 min-w-11 p-2.5 rounded-xl bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Tombol Muat Ulang */}
          <button
            type="button"
            onClick={handleReload}
            aria-label="Muat Ulang"
            className="min-h-11 min-w-11 p-2.5 rounded-xl bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Tombol Layar Penuh */}
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            className="min-h-11 min-w-11 px-3.5 py-2 rounded-xl btn-primary-clean text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar layar penuh</span>
              </>
            ) : (
              <>
                <Maximize className="w-4 h-4" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

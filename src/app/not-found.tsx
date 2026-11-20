"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Compass, Home, RefreshCw } from "lucide-react";
import { getGamePortalPath } from "@/lib/site";

export default function NotFound() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/" || path === "") {
        window.location.replace(getGamePortalPath());
      }
    }
  }, []);

  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-[#610212] border border-[#ce2541]/60 text-[#ff8c9f] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(206, 37, 65,0.4)] mb-6">
        <Compass className="w-10 h-10 text-[#ff8c9f]" />
      </div>

      <span className="text-[#ff8c9f] text-xs font-black tracking-widest uppercase mb-2">
        Kesalahan 404 • Halaman Tidak Ditemukan
      </span>

      <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Halaman tidak tersedia
      </h1>

      <p className="text-slate-300 text-sm max-w-md leading-relaxed mb-8">
        Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan. Portal Tekno Game tersedia di subdirektori{" "}
        <code className="text-[#ff8c9f] bg-[#610212]/50 px-2 py-0.5 rounded border border-[#ce2541]/40 font-mono">
          /games
        </code>
        . Silakan kembali ke beranda melalui tombol di bawah:
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="min-h-11 rounded-full px-6 btn-burgundy text-white font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Beranda Tekno Game</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = getGamePortalPath();
            }
          }}
          className="min-h-11 rounded-full px-5 bg-[#610212] hover:bg-[#ce2541]/30 text-slate-200 border border-[#ce2541]/50 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-[#ff8c9f]" />
          <span>Kembali ke Tekno Game</span>
        </button>
      </div>
    </div>
  );
}

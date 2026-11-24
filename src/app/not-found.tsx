"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Compass, Home, RefreshCw } from "lucide-react";
import { getGamePortalPath } from "@/lib/site";
import { useTranslation } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useTranslation();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/" || path === "") {
        window.location.replace(getGamePortalPath());
      }
    }
  }, []);

  return (
    <div className="not-found-page min-h-[55vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="not-found-icon w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mb-6">
        <Compass className="w-10 h-10" />
      </div>

      <span className="not-found-badge text-xs font-black tracking-widest uppercase mb-2">
        {t.notFound.badge}
      </span>

      <h1 className="font-heading text-3xl sm:text-4xl font-extrabold mb-3">
        {t.notFound.title}
      </h1>

      <p className="not-found-description text-sm max-w-md leading-relaxed mb-8">
        {t.notFound.desc}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="min-h-11 rounded-full px-6 btn-primary-clean text-white font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{t.notFound.homeButton}</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = getGamePortalPath();
            }
          }}
          className="not-found-refresh min-h-11 rounded-full px-5 btn-sponsor-clean font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.notFound.refreshButton}</span>
        </button>
      </div>
    </div>
  );
}

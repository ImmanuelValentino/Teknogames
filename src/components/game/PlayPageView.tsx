"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Game } from "@/types/game";
import GameFrame from "@/components/game/GameFrame";
import CategoryIcon from "@/components/game/CategoryIcon";
import GameCard from "@/components/game/GameCard";

const AdCompanion = dynamic(() => import("@/components/ads/AdCompanion"), {
  ssr: false,
});
const GoogleAdSlot = dynamic(() => import("@/components/ads/GoogleAdSlot"), {
  ssr: false,
});
import { useTranslation, getLocalizedCategoryLabel, getLocalizedGame } from "@/lib/i18n";
import {
  ArrowLeft,
  Keyboard,
  Smartphone,
  Info,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
  Cpu,
} from "lucide-react";

interface PlayPageViewProps {
  game: Game;
  relatedGames: Game[];
  adSlot?: string;
}

export default function PlayPageView({
  game,
  relatedGames,
  adSlot = "",
}: PlayPageViewProps) {
  const { lang, t } = useTranslation();
  const localized = getLocalizedGame(game, lang);
  const catLabel = getLocalizedCategoryLabel(game.category, lang);

  return (
    <div className="pt-6 space-y-6">
      {/* Navigasi Breadcrumb */}
      <nav
        aria-label="Jejak navigasi"
        className="flex items-center gap-2 text-xs font-medium text-slate-300"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.play.allGames}</span>
        </Link>
        <span>/</span>
        <Link
          href={`/category/${game.category}`}
          className="inline-flex items-center gap-1 capitalize hover:text-white transition-colors"
        >
          <CategoryIcon category={game.category} />
          {catLabel}
        </Link>
        <span>/</span>
        <span className="font-semibold truncate max-w-xs text-slate-900 dark:text-slate-100">{game.title}</span>
      </nav>

      {/* Tata Letak Gameplay */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <GameFrame game={game} />

          {/* Kartu Informasi & Panduan Kendali */}
          <div className="rounded-2xl card-natural p-6 space-y-6 text-slate-300">
            {/* Bagian 1: Tentang Permainan */}
            <div>
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#ff8c9f]" />
                <span>
                  {t.play.aboutTitle} {game.title}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {localized.description} {t.play.aboutSuffix}
              </p>
            </div>

            {/* Bagian 2: Panduan Tombol Kendali */}
            {localized.controlsGuide && (
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                  {t.play.controlsGuide}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {localized.controlsGuide.keyboard && (
                    <div className="bg-black/20 p-3.5 rounded-xl border border-white/10">
                      <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
                        <Keyboard className="w-3.5 h-3.5 text-slate-300" />
                        <span>{t.play.keyboardControls}</span>
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {localized.controlsGuide.keyboard.map((k, idx) => (
                          <li key={idx}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {localized.controlsGuide.touch && (
                    <div className="bg-black/20 p-3.5 rounded-xl border border-white/10">
                      <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-slate-300" />
                        <span>{t.play.touchControls}</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {localized.controlsGuide.touch}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bagian 3: Fitur Utama Permainan */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.play.keyFeatures}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                  <span className="font-semibold text-white block mb-1">
                    {t.play.features.f1Title}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {t.play.features.f1Desc}
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                  <span className="font-semibold text-white block mb-1">
                    {t.play.features.f2Title}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {t.play.features.f2Desc}
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                  <span className="font-semibold text-white block mb-1">
                    {t.play.features.f3Title}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {t.play.features.f3Desc}
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                  <span className="font-semibold text-white block mb-1">
                    {t.play.features.f4Title}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {t.play.features.f4Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Bagian 4: Tips Bermain */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                <span>{t.play.tipsTitle}</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/10">
                {t.play.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Bagian 5: Spesifikasi Teknis Permainan */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>{t.play.techSpecsTitle}</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">{t.play.specs.category}</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-white capitalize">
                    <CategoryIcon category={game.category} />
                    {catLabel}
                  </span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">{t.play.specs.developer}</span>
                  <span className="font-semibold text-white">{t.play.specs.developerValue}</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">{t.play.specs.license}</span>
                  <span className="font-semibold text-emerald-400">{t.play.specs.licenseValue}</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">{t.play.specs.platform}</span>
                  <span className="font-semibold text-white">{t.play.specs.platformValue}</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">{t.play.specs.compatibility}</span>
                  <span className="font-semibold text-white">{t.play.specs.compatibilityValue}</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">{t.play.specs.downloadSize}</span>
                  <span className="font-semibold text-white">{t.play.specs.downloadSizeValue}</span>
                </div>
              </div>
            </div>

            {/* Bagian 6: Pertanyaan Umum (FAQ) */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                <span>{t.play.faqTitle}</span>
              </h4>
              <div className="space-y-2 text-xs">
                {t.play.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-black/20 p-3 rounded-xl border border-white/10 space-y-1">
                    <span className="font-semibold text-white block">{faq.q}</span>
                    <p className="text-slate-300 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Kanan: Companion Ad & Sponsor Card */}
        <div className="xl:col-span-1 flex flex-col items-center space-y-6 self-start xl:sticky xl:top-20 xl:items-start">
          <AdCompanion />

          <div className="w-[300px] rounded-2xl card-natural p-5 space-y-2.5">
            <span className="text-[10px] uppercase font-semibold text-[#ff8c9f] tracking-wider">
              {t.play.sponsorBadge}
            </span>
            <h4 className="font-heading text-sm font-bold text-white leading-snug">
              {t.play.sponsorTitle}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.play.sponsorDesc}
            </p>
            <div className="pt-1">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block min-h-11 w-full rounded-full py-3 text-center btn-sponsor-clean text-xs font-semibold shadow-sm"
              >
                <span>{t.play.sponsorButton}</span>
                <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Iklan Horizontal Tengah Ukuran 1080 x 90 */}
      {adSlot ? (
        <GoogleAdSlot
          slotType="leaderboard-1080x90"
          adSlot={adSlot}
        />
      ) : null}

      {/* Rekomendasi Game Lainnya */}
      <section
        className="play-page-recommendations !pt-0 !mt-1.5"
        style={{ marginTop: "6px", paddingTop: 0 }}
      >
        <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-3">
          {t.play.relatedGamesTitle}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {relatedGames.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>
    </div>
  );
}

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryLabel,
  getGameBySlug,
  INITIAL_GAMES,
} from "@/lib/games-data";
import { getGamePortalPath, getGamePortalUrl } from "@/lib/site";
import GameFrame from "@/components/game/GameFrame";
import AdCompanion from "@/components/ads/AdCompanion";
import GameCard from "@/components/game/GameCard";
import GoogleAdSlot from "@/components/ads/GoogleAdSlot";
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

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return INITIAL_GAMES.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({
  params,
}: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Permainan Tidak Ditemukan",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${game.title} - Mainkan Gratis Tanpa Instalasi`,
    description: `${game.description} Mainkan langsung di peramban secara gratis di portal resmi Tekno Game oleh PT Teknotama Prakarsa Mulia.`,
    alternates: {
      canonical: getGamePortalUrl(`/play/${game.slug}`),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: `${game.title} - Tekno Game`,
      description: game.description,
      url: getGamePortalUrl(`/play/${game.slug}`),
      type: "website",
      images: [
        {
          url: getGamePortalUrl(game.thumbnailUrl || "/TeknoGame_logo_red.png"),
          width: 600,
          height: 400,
          alt: game.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} - Tekno Game`,
      description: game.description,
      images: [getGamePortalUrl(game.thumbnailUrl)],
    },
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = INITIAL_GAMES.filter(
    (g) => g.id !== game.id && (g.category === game.category || g.featured)
  ).slice(0, 4);

  const jsonLdGame = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    image: getGamePortalUrl(game.thumbnailUrl),
    genre: getCategoryLabel(game.category),
    applicationCategory: "Game",
    operatingSystem: "Peramban web modern yang mendukung HTML5",
    url: getGamePortalUrl(`/play/${game.slug}`),
    inLanguage: "id",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: game.rating ? game.rating.toString() : "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: (game.likesCount || 300).toString(),
    },
    author: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PT Teknotama Prakarsa Mulia",
      url: "https://teknotama.com",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Apakah permainan ${game.title} ini gratis?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Ya, ${game.title} dapat dimainkan 100% gratis langsung melalui peramban web tanpa biaya unduhan atau langganan.`,
        },
      },
      {
        "@type": "Question",
        name: "Apakah perlu memasang aplikasi tambahan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tidak perlu. Permainan ini berbasis HTML5 murni sehingga langsung berjalan seketika saat halaman web dibuka.",
        },
      },
      {
        "@type": "Question",
        name: `Perangkat apa saja yang mendukung permainan ${game.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Permainan ini mendukung komputer desktop, laptop, tablet, serta ponsel pintar Android dan iOS melalui peramban web modern.",
        },
      },
    ],
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Teknotama",
        item: "https://teknotama.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tekno Game",
        item: getGamePortalUrl(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: getCategoryLabel(game.category),
        item: getGamePortalUrl(`/category/${game.category}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: game.title,
        item: getGamePortalUrl(`/play/${game.slug}`),
      },
    ],
  };

  return (
    <div className="pt-6 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGame) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

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
          <span>Semua Permainan</span>
        </Link>
        <span>/</span>
        <Link
          href={`/category/${game.category}`}
          className="capitalize hover:text-white transition-colors"
        >
          {getCategoryLabel(game.category)}
        </Link>
        <span>/</span>
        <span className="text-white font-semibold truncate max-w-xs">{game.title}</span>
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
                <span>Tentang {game.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {game.description} Permainan ini dirancang dengan antarmuka yang bersih dan responsif, memudahkan Anda untuk langsung bermain tanpa instalasi tambahan.
              </p>
            </div>

            {/* Bagian 2: Panduan Tombol Kendali */}
            {game.controlsGuide && (
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                  Panduan Kontrol
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {game.controlsGuide.keyboard && (
                    <div className="bg-black/20 p-3.5 rounded-xl border border-white/10">
                      <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
                        <Keyboard className="w-3.5 h-3.5 text-slate-300" />
                        <span>Papan ketik (Komputer / Laptop):</span>
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {game.controlsGuide.keyboard.map((k, idx) => (
                          <li key={idx}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {game.controlsGuide.touch && (
                    <div className="bg-black/20 p-3.5 rounded-xl border border-white/10">
                      <span className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-slate-300" />
                        <span>Layar sentuh (Ponsel / Tablet):</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {game.controlsGuide.touch}
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
                <span>Fitur Utama Permainan</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                  <span className="font-semibold text-white block mb-1">Akses Langsung di Browser</span>
                  <p className="text-slate-300 leading-relaxed">Dapat dimainkan seketika tanpa perlu mengunduh aplikasi, menghemat ruang penyimpanan perangkat Anda.</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                  <span className="font-semibold text-white block mb-1">Penyimpanan Rekor Otomatis</span>
                  <p className="text-slate-300 leading-relaxed">Skor tertinggi otomatis tersimpan di peramban lokal perangkat untuk melacak pencapaian terbaik Anda.</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                  <span className="font-semibold text-white block mb-1">Audio Sintetis Ringan</span>
                  <p className="text-slate-300 leading-relaxed">Menggunakan Web Audio API terintegrasi yang menghasilkan efek suara jernih tanpa membebani kuota data.</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                  <span className="font-semibold text-white block mb-1">Dukungan Multi-Perangkat</span>
                  <p className="text-slate-300 leading-relaxed">Tampilan adaptif yang nyaman digunakan pada layar ponsel, tablet, maupun monitor komputer.</p>
                </div>
              </div>
            </div>

            {/* Bagian 4: Tips Bermain */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                <span>Tips Singkat Bermain</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/10">
                <li>Perhatikan ritme permainan dan hindari terburu-buru agar timing aksi lebih presisi.</li>
                <li>Gunakan mode layar penuh (tombol perbesar di samping judul) untuk pengalaman bermain yang lebih fokus.</li>
                <li>Gunakan tombol mute audio pada bilah kontrol jika Anda ingin bermain dalam kondisi senyap.</li>
              </ul>
            </div>

            {/* Bagian 5: Spesifikasi Teknis Permainan */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Informasi & Spesifikasi Teknis</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Kategori</span>
                  <span className="font-semibold text-white capitalize">{getCategoryLabel(game.category)}</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Pengembang</span>
                  <span className="font-semibold text-white">PT Teknotama</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Lisensi</span>
                  <span className="font-semibold text-emerald-400">Gratis (Free to Play)</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Platform</span>
                  <span className="font-semibold text-white">Web Browser (HTML5)</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Kompatibilitas</span>
                  <span className="font-semibold text-white">Desktop & Mobile</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Ukuran Unduh</span>
                  <span className="font-semibold text-white">0 MB (Instan)</span>
                </div>
              </div>
            </div>

            {/* Bagian 6: Pertanyaan Umum (FAQ) */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="bg-black/20 p-3 rounded-xl border border-white/10 space-y-1">
                  <span className="font-semibold text-white block">Apakah permainan {game.title} ini gratis?</span>
                  <p className="text-slate-300 leading-relaxed">
                    Ya, seluruh permainan di Tekno Game dapat dimainkan 100% gratis tanpa biaya langganan maupun pembelian di dalam game.
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/10 space-y-1">
                  <span className="font-semibold text-white block">Apakah perlu mengunduh aplikasi tambahan?</span>
                  <p className="text-slate-300 leading-relaxed">
                    Tidak perlu. Game ini berjalan secara instan langsung melalui peramban web modern Anda.
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/10 space-y-1">
                  <span className="font-semibold text-white block">Perangkat apa saja yang bisa digunakan?</span>
                  <p className="text-slate-300 leading-relaxed">
                    Permainan ini kompatibel dengan komputer desktop, laptop, tablet, serta ponsel pintar Android dan iOS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Kanan: Companion Ad & Sponsor Card */}
        <div className="xl:col-span-1 flex flex-col items-center space-y-6 self-start xl:sticky xl:top-20 xl:items-start">
          <AdCompanion />

          <div className="w-[300px] rounded-2xl card-natural p-5 space-y-2.5">
            <span className="text-[10px] uppercase font-semibold text-[#ff8c9f] tracking-wider">
              Sponsor Resmi
            </span>
            <h4 className="font-heading text-sm font-bold text-white leading-snug">
              PT Teknotama Prakarsa Mulia
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Konsultasikan solusi infrastruktur teknologi informasi, sistem awan, keamanan data, dan perangkat lunak khusus bersama tim kami.
            </p>
            <div className="pt-1">
              <a
                href="https://teknotama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block min-h-11 w-full rounded-full py-3 text-center btn-sponsor-clean text-xs font-semibold shadow-sm"
              >
                <span>Kunjungi teknotama.com</span>
                <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Iklan Horizontal Tengah Ukuran 1080 x 90 */}
      <GoogleAdSlot
        slotType="leaderboard-1080x90"
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PLAY || ""}
      />

      {/* Rekomendasi Game Lainnya */}
      <section className="pt-4">
        <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-4">
          Permainan Lainnya Untuk Anda
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

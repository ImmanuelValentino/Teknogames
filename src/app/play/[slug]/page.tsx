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
import PlayPageView from "@/components/game/PlayPageView";

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
    <>
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

      <PlayPageView
        game={game}
        relatedGames={relatedGames}
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PLAY || ""}
      />
    </>
  );
}

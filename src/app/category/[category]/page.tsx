import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGamesByCategory, CATEGORIES } from "@/lib/games-data";
import { getGamePortalPath } from "@/lib/site";
import CategoryView from "@/components/game/CategoryView";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
    category: c.id,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const validCat = CATEGORIES.find((c) => c.id === category);

  if (!validCat) {
    return {
      title: "Kategori Tidak Ditemukan",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `Permainan Kategori ${validCat.label}`,
    description: `Mainkan aneka permainan kategori ${validCat.label} secara gratis di portal resmi Tekno Game oleh PT Teknotama Prakarsa Mulia.`,
    alternates: {
      canonical: getGamePortalPath(`/category/${validCat.id}`),
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
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const validCat = CATEGORIES.find((c) => c.id === category);

  if (!validCat) {
    notFound();
  }

  const games = getGamesByCategory(category);

  return (
    <CategoryView
      categoryId={validCat.id}
      defaultLabel={validCat.label}
      games={games}
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY || ""}
    />
  );
}

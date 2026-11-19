import { MetadataRoute } from "next";
import { getDiscoveredGames, CATEGORIES } from "@/lib/games";
import { getGamePortalUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const games = getDiscoveredGames();
  const currentDate = new Date().toISOString();

  // Root / Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: getGamePortalUrl(),
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Category Pages
  CATEGORIES.filter((c) => c.id !== "all").forEach((category) => {
    routes.push({
      url: getGamePortalUrl(`/category/${category.id}`),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Individual Discovered Game Pages
  games.forEach((game) => {
    routes.push({
      url: getGamePortalUrl(`/play/${game.slug}`),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  });

  return routes;
}

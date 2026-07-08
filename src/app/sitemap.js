import { niches } from "@/lib/niches";
import { site } from "@/lib/site";

/**
 * Programmatic sitemap. Static marketing routes plus one entry per coaching
 * niche, generated from src/lib/niches.js so new niches are indexed automatically.
 */
export default function sitemap() {
  const lastModified = new Date();

  const staticRoutes = [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
  ];

  const nicheRoutes = niches.map((niche) => ({
    url: `${site.url}/coaching/${niche.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...nicheRoutes].map((route) => ({
    ...route,
    lastModified,
  }));
}

import { site } from "@/lib/site";

/**
 * Robots policy. Allow crawling of marketing + programmatic SEO pages, but keep
 * the authenticated app and onboarding funnel out of the index.
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/onboarding"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

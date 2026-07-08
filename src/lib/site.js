/**
 * Global site constants. Keep brand + URL config in one place so metadata,
 * sitemap, robots, and JSON-LD all stay in sync.
 */
export const site = {
  name: "Aivra",
  tagline: "Your adaptive AI life coach",
  description:
    "Aivra is a 24/7 adaptive AI life coach that blends your goals, daily check-ins, and recovery data into a coaching program that adjusts every day.",
  // Set NEXT_PUBLIC_SITE_URL in production; falls back to localhost in dev.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

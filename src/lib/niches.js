/**
 * Coaching niches — the single source of truth for programmatic SEO.
 *
 * Each niche generates a static landing page at `/coaching/[slug]` (see
 * src/app/coaching/[niche]/page.js) and is surfaced on the home page. Adding an
 * entry here is all it takes to publish a new SEO page: the route's
 * generateStaticParams(), the sitemap, and the home grid all read from this list.
 */
export const niches = [
  {
    slug: "executive-stress",
    audience: "Executives",
    headline: "Stress & cognitive performance coaching for executives",
    promise:
      "Manage cortisol, sharpen decision-making, and build resilience for high-pressure roles.",
    outcomes: [
      "Evidence-based CBT techniques for high-stakes decisions",
      "Cortisol-aware daily routines that protect deep focus",
      "Weekly resilience reviews calibrated to your calendar load",
    ],
    keywords: [
      "AI stress coach for executives",
      "cognitive performance coaching",
      "executive burnout prevention",
    ],
  },
  {
    slug: "marathon-training",
    audience: "Amateur athletes",
    headline: "Adaptive marathon & triathlon training that reads your recovery",
    promise:
      "A training plan that adjusts every day based on your sleep quality and recovery metrics.",
    outcomes: [
      "Daily sessions that flex with your sleep and HRV",
      "Auto-recalibrated mileage when recovery dips",
      "Race-week tapering guided by real readiness data",
    ],
    keywords: [
      "AI marathon training plan",
      "adaptive triathlon coaching",
      "recovery-based running plan",
    ],
  },
  {
    slug: "habit-building",
    audience: "Wellness seekers",
    headline: "Habit-loop engineering for sustainable weight & mindfulness",
    promise:
      "Build habits that actually stick with micro-adjustments tuned to your daily check-ins.",
    outcomes: [
      "Habit loops designed around your real routine",
      "Gentle nudges instead of guilt-driven streaks",
      "Mindfulness and nutrition woven into small daily wins",
    ],
    keywords: [
      "AI habit coach",
      "sustainable weight management coaching",
      "mindfulness habit builder",
    ],
  },
];

/** Look up a single niche by slug. Returns undefined if not found. */
export function getNiche(slug) {
  return niches.find((n) => n.slug === slug);
}

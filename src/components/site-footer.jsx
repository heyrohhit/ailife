import Link from "next/link";
import { site } from "@/lib/site";
import { niches } from "@/lib/niches";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <span
              aria-hidden
              className="grid size-7 place-items-center rounded-lg bg-brand text-white"
            >
              ◈
            </span>
            {site.name}
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">{site.tagline}.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Coaching</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {niches.map((n) => (
              <li key={n.slug}>
                <Link href={`/coaching/${n.slug}`} className="hover:text-ink">
                  {n.audience}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/onboarding" className="hover:text-ink">Take the quiz</Link></li>
            <li><Link href="/dashboard" className="hover:text-ink">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Trust</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>GDPR &amp; CCPA aligned</li>
            <li>Encrypted check-ins</li>
            <li>Human-reviewed guidance</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted sm:flex-row">
          <p>© {SITE_YEAR} {site.name}. Not a substitute for professional medical advice.</p>
          <p>Made for people who want to grow, daily.</p>
        </div>
      </div>
    </footer>
  );
}

// Rendered on the server at build/request time. Hardcoded to avoid hydration
// mismatch from Date in a Server Component; bump as needed.
const SITE_YEAR = 2026;

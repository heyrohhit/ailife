import Link from "next/link";
import { site } from "@/lib/site";
import { HeaderAuth } from "@/components/header-auth";

const navLinks = [
  { href: "/#niches", label: "Coaching" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/onboarding", label: "Get started" },
];

/**
 * Site header. Yeh STATIC server component hai (koi cookie/auth read nahi) taaki marketing
 * aur SEO landing pages statically prerender hoti rahen. Auth-specific buttons ko client
 * component <HeaderAuth /> handle karta hai (browser me auth check).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-brand text-white"
          >
            ◈
          </span>
          <span className="text-lg tracking-tight">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}

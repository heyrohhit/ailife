import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { niches, getNiche } from "@/lib/niches";
import { site } from "@/lib/site";

/**
 * Programmatic SEO landing page. One statically-generated page per niche, driven
 * entirely by src/lib/niches.js. Add a niche there and a page appears here.
 */

// Pre-render every niche at build time (SSG). Params are async in Next 16.
export function generateStaticParams() {
  return niches.map((niche) => ({ niche: niche.slug }));
}

// Reject any slug not backed by a niche so we never render (or index) 404-ish pages.
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { niche: slug } = await params;
  const niche = getNiche(slug);
  if (!niche) return {};

  const title = niche.headline;
  const url = `${site.url}/coaching/${niche.slug}`;
  return {
    title,
    description: niche.promise,
    keywords: niche.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: niche.promise,
      url,
    },
  };
}

function buildFaq(niche) {
  return [
    {
      q: `How does ${site.name} coach ${niche.audience.toLowerCase()}?`,
      a: `${niche.promise} ${site.name} combines your goals with daily check-ins to adjust each day's plan automatically.`,
    },
    {
      q: `Is the coaching personalized?`,
      a: `Yes. Every plan is generated from your onboarding assessment and recalibrated from your daily inputs — no two programs are the same.`,
    },
    {
      q: `Do I need any equipment or a subscription to start?`,
      a: `No. You can start with a free assessment and get your first personalized plan in about two minutes.`,
    },
  ];
}

export default async function NichePage({ params }) {
  const { niche: slug } = await params;
  const niche = getNiche(slug);
  if (!niche) notFound();

  const faq = buildFaq(niche);
  const url = `${site.url}/coaching/${niche.slug}`;

  // JSON-LD: Service + FAQPage. Injected as a script tag per the docs pattern.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: niche.headline,
        description: niche.promise,
        provider: { "@type": "Organization", name: site.name, url: site.url },
        areaServed: "Worldwide",
        url,
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe to inject here (no user input).
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-5 py-16">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          Coaching for {niche.audience}
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {niche.headline}
        </h1>
        {/* Direct, concise answer right after the H1 for featured snippets / voice. */}
        <p className="mt-5 text-lg text-muted">{niche.promise}</p>

        <div className="mt-8">
          <Button href="/onboarding" size="lg">
            Get my {niche.audience.toLowerCase()} plan
          </Button>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-ink">What you get</h2>
          <ul className="mt-5 space-y-3">
            {niche.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3 text-ink">
                <span aria-hidden className="mt-1 text-brand-600">
                  ✓
                </span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-ink">
            Frequently asked questions
          </h2>
          <dl className="mt-5 divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="font-medium text-ink">{item.q}</dt>
                <dd className="mt-2 text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 rounded-2xl bg-brand-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-brand-900">
            Ready to start?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-800">
            Take the free assessment and get a plan built for you today.
          </p>
          <div className="mt-6">
            <Button href="/onboarding" size="lg">
              Start free assessment
            </Button>
          </div>
        </section>
      </article>
    </>
  );
}

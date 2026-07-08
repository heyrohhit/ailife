import Link from "next/link";
import { Button } from "@/components/ui/button";
import { niches } from "@/lib/niches";
import { site } from "@/lib/site";

const steps = [
  {
    title: "Onboarding quiz",
    body: "A 2-minute assessment maps your goals, constraints, and starting point.",
  },
  {
    title: "Daily micro check-ins",
    body: "Log mood, sleep, and energy. Aivra reshapes today's plan in seconds.",
  },
  {
    title: "Weekly recalibration",
    body: "An AI progress report spots trends and adjusts your long-term goals.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-brand-100/60 to-transparent blur-2xl"
        />
        <div className="mx-auto max-w-6xl px-5 pt-20 pb-16 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-brand-700">
            Adaptive coaching, powered by AI
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
            Coaching that adapts to you, every single day
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            {site.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/onboarding" size="lg">
              Start your free assessment
            </Button>
            <Button href="/#how-it-works" variant="secondary" size="lg">
              See how it works
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted">
            No card required · Human-reviewed guidance · Private by design
          </p>
        </div>
      </section>

      {/* Niches */}
      <section id="niches" className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            Built for your specific goal
          </h2>
          <p className="mt-3 text-muted">
            Generic advice doesn&apos;t change lives. Pick the program shaped for
            where you are right now.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {niches.map((niche) => (
            <Link
              key={niche.slug}
              href={`/coaching/${niche.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand-300"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {niche.audience}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink">
                {niche.headline}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted">{niche.promise}</p>
              <span className="mt-4 text-sm font-medium text-brand-700 group-hover:underline">
                Explore program →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            How Aivra coaches you
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-line bg-background p-6"
              >
                <span className="grid size-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="rounded-3xl bg-brand-800 px-8 py-14 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your first plan is two minutes away
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Answer a few questions and get a personalized coaching program today.
          </p>
          <div className="mt-8">
            <Button
              href="/onboarding"
              size="lg"
              variant="secondary"
              className="border-transparent"
            >
              Start free assessment
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

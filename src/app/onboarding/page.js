import { OnboardingQuiz } from "./OnboardingQuiz";

export const metadata = {
  title: "Free coaching assessment",
  description:
    "Answer a few questions and get a personalized AI coaching plan in about two minutes.",
  // Interactive funnel step — no SEO value in indexing it.
  robots: { index: false, follow: true },
};

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Let&apos;s build your plan
      </h1>
      <p className="mt-3 text-muted">
        A quick assessment so Aivra can tailor your first coaching program.
      </p>
      <div className="mt-8">
        <OnboardingQuiz />
      </div>
    </div>
  );
}

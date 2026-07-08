"use client";

import { useState } from "react";
import Link from "next/link";
import { niches } from "@/lib/niches";
import { Button } from "@/components/ui/button";

/**
 * Client-side onboarding quiz stub. Collects a couple of answers in local state
 * and shows a summary. Wiring to the backend AI assessment is a later step —
 * this establishes the flow and UI.
 */
const questions = [
  {
    id: "focus",
    prompt: "What do you most want to work on?",
    options: niches.map((n) => ({ value: n.slug, label: n.audience, hint: n.promise })),
  },
  {
    id: "commitment",
    prompt: "How much time can you give most days?",
    options: [
      { value: "10", label: "~10 minutes", hint: "Light-touch daily check-ins" },
      { value: "30", label: "~30 minutes", hint: "A focused daily session" },
      { value: "60", label: "60+ minutes", hint: "Serious, structured training" },
    ],
  },
];

export function OnboardingQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const isSummary = step >= questions.length;
  const question = questions[step];

  function choose(value) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setStep((s) => s + 1);
  }

  if (isSummary) {
    const niche = niches.find((n) => n.slug === answers.focus) ?? niches[0];
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
          Your starting point
        </p>
        <h2 className="mt-2 text-xl font-semibold text-ink">{niche.headline}</h2>
        <p className="mt-2 text-sm text-muted">
          Based on your answers, we&apos;ll build a {niche.audience.toLowerCase()}{" "}
          program around roughly {answers.commitment ?? "10"} minutes a day.
        </p>
        <p className="mt-4 rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
          Next: this is where the AI assessment generates your first week. Backend
          wiring comes in a later step.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/dashboard">Go to my dashboard</Button>
          <button
            onClick={() => {
              setStep(0);
              setAnswers({});
            }}
            className="text-sm text-muted hover:text-ink"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Step {step + 1} of {questions.length}
        </span>
        <Link href="/" className="hover:text-ink">
          Exit
        </Link>
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${(step / questions.length) * 100}%` }}
        />
      </div>

      <h2 className="mt-6 text-lg font-semibold text-ink">{question.prompt}</h2>
      <div className="mt-4 space-y-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => choose(opt.value)}
            className="flex w-full flex-col rounded-xl border border-line p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40"
          >
            <span className="font-medium text-ink">{opt.label}</span>
            <span className="mt-0.5 text-sm text-muted">{opt.hint}</span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="mt-5 text-sm text-muted hover:text-ink"
        >
          ← Back
        </button>
      )}
    </div>
  );
}

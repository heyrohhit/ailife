"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";

/**
 * Signup form (client component). Submit par `signup` server action chalta hai jo:
 *  - email format + password strength check karta hai,
 *  - disposable/temp email block karta hai,
 *  - Supabase me account banata hai aur confirmation email bhejta hai.
 * Success par action khud /verify-email par redirect kar deta hai.
 */
export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">
          Naam
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-ink outline-none focus:border-brand-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-ink outline-none focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-muted">
          Asli email use karo — temporary/temp-mail allowed nahi hai.
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-ink outline-none focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-muted">
          Kam se kam 8 characters, ek letter aur ek number.
        </p>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Pehle se account hai?{" "}
        <Link href="/login" className="text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

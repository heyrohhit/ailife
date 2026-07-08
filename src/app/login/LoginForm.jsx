"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";

/**
 * Login form (client component). React 19 ka `useActionState` server action ke saath
 * bind hota hai: submit hone par `login` chalta hai, aur uska return `{ error }` state me
 * aata hai — jise hum niche dikhate hain. `pending` se button disable hota hai.
 */
export function LoginForm({ next = "/dashboard", initialError = "" }) {
  const [state, action, pending] = useActionState(login, undefined);
  const error = state?.error || initialError;

  return (
    <form action={action} className="space-y-4">
      {/* Login ke baad kahan bhejna hai — proxy.js se aaya path */}
      <input type="hidden" name="next" value={next} />

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
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-ink outline-none focus:border-brand-400"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted">
        Naya account?{" "}
        <Link href="/signup" className="text-brand-700 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

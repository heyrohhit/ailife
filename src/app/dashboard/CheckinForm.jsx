"use client";

import { useActionState } from "react";
import { addCheckin } from "./actions";

/**
 * Daily check-in form. Submit par `addCheckin` server action chalta hai jo data ko
 * ENCRYPT karke Supabase me daalta hai. Yeh form sirf plain values bhejta hai — encryption
 * server par hoti hai (client ko key ka pata bhi nahi chalta).
 */
export function CheckinForm() {
  const [state, action, pending] = useActionState(addCheckin, undefined);

  return (
    <form action={action} className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          <span className="text-ink">Mood (1–5)</span>
          <input
            name="mood"
            type="number"
            min="1"
            max="5"
            defaultValue="3"
            className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-ink outline-none focus:border-brand-400"
          />
        </label>
        <label className="text-sm">
          <span className="text-ink">Sleep (hours)</span>
          <input
            name="sleep"
            type="number"
            min="0"
            max="24"
            defaultValue="7"
            className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-ink outline-none focus:border-brand-400"
          />
        </label>
        <label className="text-sm">
          <span className="text-ink">Energy (1–5)</span>
          <input
            name="energy"
            type="number"
            min="1"
            max="5"
            defaultValue="3"
            className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-ink outline-none focus:border-brand-400"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-ink">Private note (encrypted)</span>
        <textarea
          name="note"
          rows="3"
          placeholder="Aaj kaisa raha? Yeh note encrypted hokar store hoga."
          className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-ink outline-none focus:border-brand-400"
        />
      </label>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Check-in save ho gaya (encrypted). 🎉
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-full bg-brand px-5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save today's check-in"}
      </button>
    </form>
  );
}

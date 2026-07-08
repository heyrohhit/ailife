"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/auth/actions";

/**
 * Header ke auth buttons (client component).
 *
 * Yeh ALAG se client par auth check karta hai taaki SiteHeader (aur pura layout) server par
 * STATIC reh sake — warna header me server-side cookie padhne se saari SEO landing pages
 * dynamic ho jaati (SSG khatm). Isliye auth state browser me nikaalte hain.
 *
 * Default UI = logged-out (Sign in / Start free). User mil gaya to Dashboard / Sign out.
 */
export function HeaderAuth() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // Current session ka user nikalo.
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
    });
    // Login/logout hone par UI turant update ho.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Auth state aane se pehle logged-out UI dikhao (flash/mismatch minimal).
  if (ready && user) {
    return (
      <>
        <Button href="/dashboard" variant="ghost" size="md">
          Dashboard
        </Button>
        {/* signout ek server action hai — client form se safely call ho sakta hai */}
        <form action={signout}>
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-full px-4 text-sm font-medium text-ink hover:text-brand-700"
          >
            Sign out
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <Button href="/login" variant="ghost" size="md" className="hidden sm:inline-flex">
        Sign in
      </Button>
      <Button href="/signup" size="md">
        Start free
      </Button>
    </>
  );
}

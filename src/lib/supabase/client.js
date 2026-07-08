/**
 * Supabase BROWSER client (client components / "use client" ke liye).
 *
 * Yeh client browser me chalta hai, isliye yahan sirf PUBLIC keys use hoti hain
 * (NEXT_PUBLIC_* wale). Publishable key ko browser me expose karna safe hai —
 * asli protection Row Level Security (RLS) policies deti hain (dekho supabase/schema.sql).
 *
 * Kahan use karein: "use client" components me jahan realtime, auth UI, ya
 * client-side queries chahiye. Server components/actions ke liye ./server.js use karo.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    // Project ka URL — Supabase Dashboard → Project Settings → Data API → Project URL
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    // Publishable (anon) key — Dashboard → Project Settings → API Keys → publishable key
    // (browser me safe; RLS ke bina yeh apne aap koi private data nahi dega)
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

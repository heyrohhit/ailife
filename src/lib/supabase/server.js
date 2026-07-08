/**
 * Supabase SERVER client (server components, server actions, route handlers ke liye).
 *
 * Yeh client server par chalta hai aur user ka session HTTP cookies me padhta/likhta hai.
 * Next.js 16 me `cookies()` ab ASYNC hai — isliye niche `await cookies()` kiya gaya hai
 * (purani Next.js docs isse sync dikhati hain, wahan mat jao).
 *
 * Har request par NAYA client banao (module-level pe cache mat karo), warna ek user ka
 * session doosre user ko leak ho sakta hai.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // Next 16: cookies() ek Promise deta hai — pehle await karo.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, // Project URL (Dashboard → Settings → Data API)
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, // Publishable key (Dashboard → API Keys)
    {
      cookies: {
        // Supabase yahan se saari auth cookies padhta hai (session token wagera).
        getAll() {
          return cookieStore.getAll();
        },
        // Jab Supabase session refresh kare to nayi cookies yahan set hoti hain.
        // Server Component ke andar cookie set karna allowed nahi — isliye try/catch.
        // Session refresh asli me proxy.js me hota hai, to yeh error safe hai.
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component se call hua — ignore. proxy.js cookie refresh handle karta hai.
          }
        },
      },
    },
  );
}

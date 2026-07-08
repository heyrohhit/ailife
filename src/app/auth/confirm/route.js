/**
 * Email confirmation handler (Route Handler).
 *
 * Signup ke baad Supabase user ko ek confirm-link wala email bhejta hai. Us link par
 * `token_hash` aur `type` query params hote hain aur woh yahan (/auth/confirm) redirect
 * hota hai (kyunki signup me emailRedirectTo = .../auth/confirm diya tha).
 *
 * Yahan hum us token ko verify karte hain — verify hote hi user ka session ban jata hai
 * (auth cookies set) aur hum use dashboard par bhej dete hain. Isi step se "email verify"
 * requirement poori hoti hai: bina is link ke user login nahi kar sakta.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type"); // usually "email" / "signup"
  const next = searchParams.get("next") || "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();
    // Token verify karo — sahi hua to session cookies set ho jayengi.
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      // Verify success → seedha app ke andar (relative path hi allow).
      const safeNext = next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(new URL(safeNext, request.url));
    }
  }

  // Token missing/expired/invalid → error message ke saath login par bhejo.
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "error",
    "Email verify link invalid ya expire ho gaya. Dobara try karo.",
  );
  return NextResponse.redirect(loginUrl);
}

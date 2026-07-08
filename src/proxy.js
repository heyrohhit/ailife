/**
 * proxy.js — Next.js 16 me yeh purani `middleware.js` ki jagah aata hai
 * (Next 16 me `middleware` deprecate hokar `proxy` ban gaya — file root/src level par).
 *
 * Do kaam karta hai HAR request se pehle:
 *   1) Supabase auth session refresh karta hai (expired token ko naye se badalta hai)
 *      aur naye cookies response par set karta hai — warna server components ka session
 *      stale ho jata hai.
 *   2) Route protection: agar user logged-in nahi hai aur /dashboard (ya onboarding save)
 *      kholna chahta hai, to /login par bhej deta hai.
 *
 * NOTE: getUser() ko yahan call karna zaroori hai — yeh token refresh trigger karta hai.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  // Default response — isi par hum refreshed cookies chipkayenge.
  let response = NextResponse.next({ request });

  // Server client jo request ki cookies padhega aur response par nayi cookies likhega.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        // Incoming request se saari cookies padho.
        getAll() {
          return request.cookies.getAll();
        },
        // Supabase jo nayi cookies dena chahe unhe request + response dono par set karo,
        // taaki aage server components ko fresh session mile aur browser ko bhi.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Yeh call session ko refresh karti hai (aur setAll trigger karti hai jab naya token mile).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes: bina login ke /dashboard allow nahi.
  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith("/dashboard");

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    // Login ke baad wapas usi page par bhejne ke liye original path yaad rakho.
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  // Logged-in user ko login/signup dikhane ka fayda nahi — seedha dashboard bhejo.
  if (user && (path === "/login" || path === "/signup")) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  // IMPORTANT: yehi `response` return karo (isi me refreshed cookies hain).
  return response;
}

/**
 * matcher: proxy sirf inhi paths par chale. Static files, images, favicon exclude —
 * warna CSS/JS/images bhi auth logic se guzar kar slow/block ho sakte hain.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

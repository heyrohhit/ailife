"use server";

/**
 * Auth Server Actions — signup, login, logout.
 *
 * "use server" ke kaaran yeh functions SIRF server par chalte hain, isliye passwords aur
 * validation logic browser me kabhi expose nahi hote. Forms in actions ko `action={...}`
 * ke through call karte hain (dekho src/app/login & src/app/signup).
 *
 * Return shape: { error?: string, fieldErrors?: {...} }  (client `useActionState` se dikhata hai)
 * Success par `redirect()` throw karta hai (Next.js pattern) — isliye redirect hamesha
 * try/catch ke BAAHAR call kiya gaya hai.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidEmailFormat, validatePassword } from "@/lib/validation";
import { isDisposableEmail, isDisposableViaApi } from "@/lib/disposable-email";
import { site } from "@/lib/site";

/**
 * SIGNUP: naya account banata hai + confirmation email bhejta hai.
 * Steps: validate → temp-mail block → supabase.auth.signUp → "check email" page.
 */
export async function signup(prevState, formData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  // 1) Basic format validation
  if (!name) return { error: "Naam daalna zaroori hai." };
  if (!isValidEmailFormat(email)) {
    return { error: "Sahi email address daalo." };
  }
  const pwErrors = validatePassword(password);
  if (pwErrors.length) return { error: pwErrors.join(" ") };

  // 2) Temp / disposable mail block (requirement: koi temp mail allowed nahi)
  //    Pehle fast built-in list, phir optional live API (agar .env me configured ho).
  if (isDisposableEmail(email) || (await isDisposableViaApi(email))) {
    return {
      error: "Temporary/disposable email allowed nahi hai. Apna asli email use karo.",
    };
  }

  const supabase = await createClient();

  // 3) Account banao. `emailRedirectTo` = woh URL jahan user confirm link click karke
  //    aayega (dekho src/app/auth/confirm/route.js). Email confirmation Supabase Dashboard
  //    me ON hona chahiye (Authentication → Sign In / Providers → Email → Confirm email).
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${site.url}/auth/confirm`,
      data: { full_name: name }, // user_metadata me naam store
    },
  });

  if (error) {
    return { error: error.message };
  }

  // 4) Confirmation email chala gaya — user ko "inbox check karo" page par bhejo.
  //    (Email confirm hone tak session nahi banta.)
  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

/**
 * LOGIN: email + password se sign in. Email confirm nahi hua to Supabase khud error deta hai.
 */
export async function login(prevState, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  // "next" = login ke baad kahan bhejna hai (proxy.js isse set karta hai)
  const next = String(formData.get("next") || "/dashboard");

  if (!isValidEmailFormat(email) || !password) {
    return { error: "Email aur password sahi se daalo." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase "Email not confirmed" jaisa message deta hai — user ko wahi dikha do.
    return { error: error.message };
  }

  // Sirf apne app ke andar ka relative path allow karo (open-redirect se bachne ke liye).
  const safeNext = next.startsWith("/") ? next : "/dashboard";
  redirect(safeNext);
}

/**
 * LOGOUT: session khatam karo, home par bhejo.
 */
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

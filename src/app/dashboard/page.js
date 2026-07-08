import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { decrypt, decryptJSON, encrypt } from "@/lib/encryption";
import { getNiche } from "@/lib/niches";
import { signout } from "@/app/auth/actions";
import { CheckinForm } from "./CheckinForm";

export const metadata = {
  title: "Dashboard",
  description: "Your daily coaching plan and progress.",
  robots: { index: false, follow: false },
};

/**
 * User ka asli, authenticated dashboard.
 *
 * Flow:
 *  1) Logged-in user nikalo (proxy.js already guard karta hai, yahan double-check).
 *  2) Profile ensure karo (pehli baar aaye to encrypted naam ke saath row bana do).
 *  3) User ke check-ins DB se lao (ciphertext) aur SERVER par DECRYPT karo.
 *  4) Decrypted (readable) data user ko dikhao. DB me sab encrypted rehta hai.
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // 1) Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2) Profile ensure (lazy create). full_name encrypted store hota hai.
  let { data: profile } = await supabase
    .from("profiles")
    .select("full_name_encrypted, focus, commitment")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // Pehli visit — signup ke metadata se profile bana do (naam encrypt karke).
    const nameFromSignup = user.user_metadata?.full_name || "there";
    await supabase.from("profiles").insert({
      id: user.id,
      full_name_encrypted: encrypt(nameFromSignup),
    });
    profile = {
      full_name_encrypted: encrypt(nameFromSignup),
      focus: null,
      commitment: null,
    };
  }

  // full_name ko decrypt karke readable naam nikaalo (agar decrypt fail ho to fallback).
  let displayName = "there";
  try {
    displayName = decrypt(profile.full_name_encrypted) || "there";
  } catch {
    displayName = "there";
  }

  // 3) Check-ins lao (RLS ke kaaran sirf isi user ke aayenge). created_at plain rehta hai
  //    taaki hum streak/order nikaal saken; personal data (mood/note) encrypted column me hai.
  const { data: rawCheckins } = await supabase
    .from("checkins")
    .select("id, created_at, data_encrypted")
    .order("created_at", { ascending: false })
    .limit(30);

  // Har check-in ko decrypt karo (server par). Kharab/tampered row ko skip kar do.
  const checkins = (rawCheckins || [])
    .map((row) => {
      try {
        return {
          id: row.id,
          created_at: row.created_at,
          ...decryptJSON(row.data_encrypted),
        };
      } catch {
        return null; // decrypt fail (tamper/purani key) — dikhana nahi
      }
    })
    .filter(Boolean);

  // 4) Derived stats
  const streak = computeStreak(checkins.map((c) => c.created_at));
  const latest = checkins[0];
  const niche = profile.focus ? getNiche(profile.focus) : null;

  const stats = [
    { label: "Day streak", value: String(streak) },
    { label: "Check-ins", value: String(checkins.length) },
    { label: "Focus", value: niche ? niche.audience : "Set in onboarding" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Hi, {displayName} 👋
          </h1>
          <p className="mt-2 text-muted">
            Yeh tumhara private dashboard hai. Saara personal data{" "}
            <span className="font-medium text-ink">encrypted</span> store hota hai —
            sirf tumhe yahan decrypted dikhta hai.
          </p>
        </div>
        {/* Sign out — server action ko chhote form se call kiya */}
        <form action={signout}>
          <button
            type="submit"
            className="h-10 rounded-full border border-line bg-surface px-4 text-sm text-ink hover:border-brand-300"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Aaj ka check-in */}
      <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-semibold text-ink">Today&apos;s check-in</h2>
        <p className="mt-1 text-sm text-muted">
          Mood, sleep, energy aur ek private note log karo. Yeh sab encrypt hokar save hoga.
        </p>
        <CheckinForm />
      </section>

      {/* Recent (decrypted) check-ins */}
      <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-semibold text-ink">Recent check-ins</h2>
        {checkins.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Abhi koi check-in nahi. Upar apna pehla check-in save karo.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {checkins.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3"
              >
                <span className="text-sm font-medium text-ink">
                  {formatDate(c.created_at)}
                </span>
                <span className="text-sm text-muted">
                  Mood {c.mood}/5 · Sleep {c.sleep}h · Energy {c.energy}/5
                </span>
                {c.note && (
                  <p className="w-full text-sm text-ink/80">“{c.note}”</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {latest?.note && (
        <p className="mt-6 text-xs text-muted">
          Tip: yeh notes DB me AES-256-GCM se encrypted hain. Bina ENCRYPTION_KEY ke koi
          bhi (Supabase admin bhi) inhe padh nahi sakta.
        </p>
      )}
    </div>
  );
}

/**
 * Streak = aaj se peeche lagataar kitne din check-in hua. Dates ko YYYY-MM-DD (UTC) me
 * normalize karke consecutive din count karte hain.
 */
function computeStreak(isoDates) {
  const days = new Set(isoDates.map((d) => d.slice(0, 10)));
  let streak = 0;
  // Aaj ki date server ke request time se — new Date() server component me allowed hai.
  const cursor = new Date();
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

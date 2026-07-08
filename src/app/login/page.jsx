import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

/**
 * Login page (server component). Next.js 16 me `searchParams` ASYNC hai — isliye await.
 * `?next=` proxy.js se aata hai (login ke baad kahan jaana), `?error=` confirm route se.
 */
export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  const next = typeof sp?.next === "string" ? sp.next : "/dashboard";
  const initialError = typeof sp?.error === "string" ? sp.error : "";

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-muted">
        Apne Aivra dashboard me sign in karo.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <LoginForm next={next} initialError={initialError} />
      </div>
    </div>
  );
}

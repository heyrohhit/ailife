export const metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

/**
 * "Inbox check karo" page. Signup ke baturant yahan bhejte hain. Confirmation email me
 * diye link par click karne se user /auth/confirm par jata hai jahan session ban jata hai.
 * searchParams Next 16 me async hai — await zaroori.
 */
export default async function VerifyEmailPage({ searchParams }) {
  const sp = await searchParams;
  const email = typeof sp?.email === "string" ? sp.email : "";

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand-50 text-2xl">
        ✉️
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
        Email verify karo
      </h1>
      <p className="mt-3 text-muted">
        Humne{" "}
        {email ? (
          <span className="font-medium text-ink">{email}</span>
        ) : (
          "aapke email"
        )}{" "}
        par ek confirmation link bheja hai. Us link par click karo — verify hote hi aapka
        account activate ho jayega aur aap login kar paoge.
      </p>
      <p className="mt-4 text-sm text-muted">
        Link nahi mila? Spam folder check karo. (Temp/disposable emails allowed nahi hote.)
      </p>
    </div>
  );
}

import { SignupForm } from "./SignupForm";

export const metadata = {
  title: "Create your account",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-muted">
        Aivra ke saath apna encrypted, personalized coaching plan shuru karo.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <SignupForm />
      </div>
    </div>
  );
}

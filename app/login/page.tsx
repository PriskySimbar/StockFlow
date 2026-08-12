import Link from "next/link";
import LoginButton from "./LoginButton";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Stockflow
          </Link>

          <div className="mt-10">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue shopping on Stockflow.
            </p>
          </div>

          <div className="mt-8">
            <LoginButton />
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to use Stockflow responsibly.
          </p>
        </div>
      </div>
    </main>
  );
}

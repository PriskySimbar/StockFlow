"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  async function handleLogin() {
    await signIn("google", {
      callbackUrl: "/products",
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
      Continue with Google
    </button>
  );
}

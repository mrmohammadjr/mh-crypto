"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", { email, password, redirect: false });
    // const result = await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });

    setPending(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(ROUTES.dashboard);
    router.refresh();
  }

  function handleGitHubSignIn() {
    void signIn("github", { callbackUrl: ROUTES.dashboard });
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-black to-[#2d2d2d] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white/5 p-8 backdrop-blur-md border border-white/10"
      >
        <h1 className="text-3xl font-semibold text-white text-center">Login</h1>
        <p className="text-gray-400 text-center text-sm">
          Sign in to manage your watchlist
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-green-600 py-2.5 font-medium text-white hover:bg-green-500 transition disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-gray-400">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGitHubSignIn}
          className="w-full rounded-lg border border-white/20 py-2.5 font-medium text-white hover:bg-white/10 transition"
        >
          Continue with GitHub
        </button>

        <p className="text-center text-sm text-gray-400">
          No account?{" "}
          <Link
            href={ROUTES.register}
            className="text-green-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}

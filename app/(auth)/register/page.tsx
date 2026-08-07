"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password.length < 6) {
      setPending(false);
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPending(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle both a plain string error and Zod's fieldErrors shape
        const message =
          typeof data.error === "string"
            ? data.error
            : Object.values(data.error ?? {})
                .flat()
                .join(" ") || "Registration failed.";
        setPending(false);
        setError(message);
        return;
      }

      // Registration succeeded — now sign the user in
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setPending(false);

      if (signInResult?.error) {
        setError("Account created, but automatic sign-in failed. Please log in.");
        router.push(ROUTES.login);
        return;
      }

      router.push(ROUTES.dashboard);
      router.refresh();
    } catch (err) {
      setPending(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-black to-[#2d2d2d] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white/5 p-8 backdrop-blur-md border border-white/10"
      >
        <h1 className="text-3xl font-semibold text-white text-center">
          Register
        </h1>

        <p className="text-gray-400 text-center text-sm">
          Create an account to track your favorite coins
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Name</label>
          <input
            name="name"
            required
            className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-green-600 py-2.5 font-medium text-white hover:bg-green-500 transition disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#111] to-[#1f1f1f] text-white px-6">
      <div className="text-center max-w-md space-y-6">

        <h1 className="text-5xl font-bold">Something went wrong 😕</h1>

        <p className="text-gray-400 text-sm">
          An unexpected error occurred. Please try again.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition backdrop-blur-md"
          >
            Try again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition"
          >
            Go Home
          </button>
        </div>

      </div>
    </div>
  );
}
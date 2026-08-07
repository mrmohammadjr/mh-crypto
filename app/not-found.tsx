

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#111] to-[#1f1f1f] text-white px-6">
      <div className="text-center max-w-md space-y-6">
        
        <h1 className="text-6xl font-bold tracking-tight">404</h1>

        <h2 className="text-2xl font-semibold">
          Page not found
        </h2>

        <p className="text-gray-400 text-sm">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition backdrop-blur-md"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
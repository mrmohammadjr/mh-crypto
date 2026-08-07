"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ROUTES } from "@/lib/constants";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f172a] via-black to-[#1e293b] text-white px-6 md:px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              👋 Welcome back
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              {session?.user?.name ?? session?.user?.email}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 transition text-sm backdrop-blur-md"
          >
            Logout
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <p className="text-gray-400 text-sm mb-1">Your Email</p>
          <p className="text-lg font-medium">{session?.user?.email}</p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Link
            href={ROUTES.watchlistMarket}
            className="group rounded-2xl bg-white/5 hover:bg-white/10 transition p-6 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">My Watchlist</h2>
              <span className="text-gray-400 group-hover:translate-x-1 transition">
                →
              </span>
            </div>

            <p className="text-gray-400 text-sm">
              Track your favorite coins in one place
            </p>

            <div className="mt-4 h-1 w-0 bg-gradient-to-r from-green-400 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full" />
          </Link>
        </div>

      </div>
    </section>
  );
}
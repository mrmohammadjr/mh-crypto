"use client";

import Link from "next/link";
import Image from "next/image";
import { useNews } from "@/features/news/hooks/useNews";
import CurrencySkeleton from "../currency/CurrencySkeleton";

export default function NewsList() {
  const { data, isLoading, isError } = useNews();

  if (isLoading) return <CurrencySkeleton />;
  if (isError || !data) {
    return <p className="text-red-400 p-10">Failed to load news. Try again later.</p>;
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-black to-[#2d2d2d] text-white px-6 md:px-10 py-10">
      <h1 className="text-3xl md:text-4xl font-semibold mb-2">News</h1>
      <p className="text-gray-400 mb-8">
        Latest fundamental news from the crypto world
      </p>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <li key={item.id}>
            <Link
              href={`/news/${encodeURIComponent(item.id)}`}
              className="block h-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:ring-1 hover:ring-green-500/30 transition-all duration-200"
            >
              {item.imageUrl && (
                <div className="relative aspect-video w-full bg-white/5">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <h2 className="font-medium leading-snug line-clamp-3">
                  {item.title}
                </h2>
                <p className="text-xs text-gray-400">
                  {item.source} · {new Date(item.publishedAt * 1000).toLocaleString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

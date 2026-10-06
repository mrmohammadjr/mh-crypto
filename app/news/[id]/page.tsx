"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useNews, useNewsImpact } from "@/features/news/hooks/useNews";
import CurrencySkeleton from "../../components/currency/CurrencySkeleton";
import { ROUTES } from "@/lib/constants";

export default function NewsDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  const { data, isLoading } = useNews();
  const article = data?.find((n) => n.id === id);
  const { data: impact, isLoading: impactLoading, isError: impactError } =
    useNewsImpact(article?.publishedAt);

  return (
    <section className="min-h-screen bg-gradient-to-r from-black to-[#2d2d2d] text-white px-6 md:px-10 py-10">
      <Link
        href={ROUTES?.news}
        className="text-sm text-gray-400 hover:text-white mb-6 inline-block"
      >
        ← Back to News
      </Link>

      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <CurrencySkeleton />
        ) : !article ? (
          <p className="text-gray-400">
            This article is no longer available.{" "}
            <Link href={ROUTES?.news} className="text-green-400 hover:underline">
              See latest news
            </Link>
          </p>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold leading-snug">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
              <span>{article.source}</span>
              <span>·</span>
              <span>{new Date(article.publishedAt * 1000).toLocaleString()}</span>
              {article.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-gray-300"
                >
                  {c}
                </span>
              ))}
            </div>

            {article.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}

            <p className="text-gray-200 leading-7 whitespace-pre-line">
              {article.body}
            </p>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-500 transition"
            >
              Read full article on {article.source}
            </a>

            {/* Impact */}
            <div className="space-y-3 pt-4">
              <h2 className="text-xl font-semibold">Market impact</h2>
              <p className="text-sm text-gray-400">
                Price change since this article was published. This shows
                correlation in time, not proof the news caused the move.
              </p>

              {impactLoading && <CurrencySkeleton />}
              {impactError && (
                <p className="text-red-400 text-sm">Failed to load price impact.</p>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                {impact?.map((coin) => (
                  <div
                    key={coin.symbol}
                    className="rounded-xl bg-white/5 p-4 border border-white/10"
                  >
                    <p className="text-sm text-gray-400">
                      {coin.name} ({coin.symbol}) · since publish
                    </p>
                    <p
                      className={`text-xl font-semibold ${
                        coin.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {coin.change >= 0 ? "+" : ""}
                      {coin.change.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ${coin.priceAtNews.toLocaleString(undefined, { maximumFractionDigits: 2 })} → $
                      {coin.priceNow.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useWatchlist, useRemoveFromWatchlist } from "../../../hooks/useWatchlist";
import Link from "next/link";

export default function WatchlistPage() {
  const { data: watchlist, isLoading, isError } = useWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Loading watchlist...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-400">Failed to load watchlist.</p>
      </div>
    );
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <p className="text-gray-400">Your watchlist is empty.</p>
        <p className="text-sm text-gray-500">
          Add coins from the market page to track them here.
        </p>
      </div>
    );
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">My Watchlist</h1>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/5 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Coin</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">24h</th>
              <th className="px-4 py-3">Market Cap</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((coin) => {
              const priceDay = Number(coin.coinPriceDay);
              const isPositive = priceDay >= 0;

              return (
                <tr
                  key={coin.coinId}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Image
                      src={coin.coinIcon}
                      alt={coin.coinName}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium">{coin.coinName}</p>
                      <p className="text-gray-500 text-xs uppercase">
                        {coin.coinSymbol}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">${coin.coinPrice}</td>
                  <td
                    className={`px-4 py-3 ${
                      isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {coin.coinPriceDay}%
                  </td>
                  <td className="px-4 py-3">${coin.coinMarketCap}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeMutation.mutate(coin.coinId)}
                      disabled={removeMutation.isPending}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 transition disabled:opacity-50"
                    >
                      Remove
                    </button>
                    <Link
                     href={`/chart/${coin.coinId}`}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 transition disabled:opacity-50"
                    >
                      chart
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
"use client";

import Link from "next/link";
import { useCoins } from "@/features/market/hooks/useCoins";
import { Coin } from "@/features/market/types";
import Image from "next/image";
import CurrencySkeleton from "./CurrencySkeleton";
import { useState, useMemo } from "react";
import { WatchlistButton } from "../WatchlistButton";
export default function CurrencyTable() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCoins();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "gainers" | "losers">("all");
  const [sort, setSort] = useState<"price" | "market_cap">("price");

  const coins = data?.pages.flat() ?? [];

  const filteredData = useMemo(() => {
    let result = [...coins];

    // search
    if (search) {
      result = result.filter((coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // filter
    if (filter === "gainers") {
      result = result.filter((c) => c.price_change_percentage_24h > 0);
    } else if (filter === "losers") {
      result = result.filter((c) => c.price_change_percentage_24h < 0);
    }

    // sort
    result.sort((a, b) =>
      sort === "price"
        ? b.current_price - a.current_price
        : b.market_cap - a.market_cap,
    );

    return result;
  }, [coins, search, filter, sort]);
  if (isLoading) return <CurrencySkeleton />;

  if (isError) return <p className="text-white p-10">Something went wrong</p>;

  return (
    <section className="w-full px-6 md:px-10 py-10 min-h-screen bg-gradient-to-r from-black to-[#2d2d2d] text-white">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">Market</h1>
      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search coin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as never)}
          className="px-4 py-2 rounded-lg bg-white/10 "
        >
          <option
            value="all"
            className="text-black hover:text-white hover:bg-green-600"
          >
            All
          </option>
          <option
            value="gainers"
            className="text-black hover:text-white hover:bg-green-600"
          >
            Gainers
          </option>
          <option
            value="losers"
            className="text-black hover:text-white hover:bg-green-600"
          >
            Losers
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as never)}
          className="px-4 py-2 rounded-lg bg-white/10"
        >
          <option
            value="price"
            className="text-black hover:text-white hover:bg-green-600"
          >
            Sort by Price
          </option>
          <option
            value="market_cap"
            className="text-black hover:text-white hover:bg-green-600"
          >
            Sort by Market Cap
          </option>
        </select>
      </div>
      <div className="grid grid-cols-5 gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl text-sm uppercase tracking-wide text-gray-300">
        <span>Coin</span>
        <span className="text-right">Price</span>
        <span className="text-right">24h</span>
        <span className="text-right">Market Cap</span>
        <span className="text-right">Action</span>
      </div>
      <ul className="mt-4 space-y-3">
        {filteredData.map((coin: Coin) => (
          <li
            key={coin.id}
            className="grid grid-cols-5 gap-4 items-center bg-white/5 hover:bg-white/10 transition-all duration-200 p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Image
                src={coin.image}
                width={28}
                height={28}
                alt={coin.name}
                className="rounded-full"
              />

              <div>
                <p className="font-medium">{coin.name}</p>

                <p className="text-xs uppercase text-gray-400">{coin.symbol}</p>
              </div>
            </div>

            <span className="text-right font-medium">
              ${coin.current_price.toLocaleString()}
            </span>

            <span
              className={`text-right font-medium ${
                coin.price_change_percentage_24h > 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>

            <span className="text-right text-gray-300">
              ${coin.market_cap.toLocaleString()}
            </span>

            <div className="flex justify-end gap-2">
              <Link
                href={`/chart/${coin.id}`}
                className="px-3 py-1.5 text-sm bg-white text-black rounded-lg hover:bg-gray-200 transition"
              >
                Chart
              </Link>
              <WatchlistButton
                coinId={coin.id}
                coinName={coin.name}
                coinIcon={coin.image}
                coinPrice={coin.current_price.toLocaleString()}
                coinSymbol={coin.symbol}
                coinPriceDay={coin.price_change_percentage_24h?.toFixed(2)}
                coinMarketCap={coin.market_cap.toLocaleString()}
              />
            </div>
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="
          mt-8
          w-full
          py-3
          rounded-xl
          bg-white
          text-black
          font-medium
          hover:bg-gray-200
          transition
          disabled:opacity-50
          "
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </section>
  );
}

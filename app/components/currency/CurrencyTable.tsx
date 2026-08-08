
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

  // همیشه تمام داده‌هایی که از API گرفته‌ایم
  const coins = data?.pages.flat() ?? [];

  // فقط برای نمایش filter/sort می‌کنیم
  const filteredData = useMemo(() => {
    let result = [...coins];

    // Search
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchValue) ||
          coin.symbol.toLowerCase().includes(searchValue),
      );
    }

    // Filter
    if (filter === "gainers") {
      result = result.filter(
        (coin) => coin.price_change_percentage_24h > 0,
      );
    }

    if (filter === "losers") {
      result = result.filter(
        (coin) => coin.price_change_percentage_24h < 0,
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "price") {
        return b.current_price - a.current_price;
      }

      return b.market_cap - a.market_cap;
    });

    return result;
  }, [coins, search, filter, sort]);

  if (isLoading) {
    return <CurrencySkeleton />;
  }

  if (isError) {
    return (
      <p className="text-red-400">
        Something went wrong try again
      </p>
    );
  }

  /*
   * IMPORTANT:
   *
   * Load More نباید به filteredData وابسته باشد.
   *
   * مثلا اگر Gainers را انتخاب کنیم و از 100 coin
   * فقط 3 تا Gainer داشته باشیم، هنوز ممکن است API
   * page بعدی داشته باشد.
   *
   * بنابراین فقط hasNextPage تعیین می‌کند که
   * Load More نمایش داده شود یا نه.
   */
  const showLoadMore = Boolean(hasNextPage);

  const filtersActive = search.trim() !== "" || filter !== "all";

  return (
    <section className="p-5">
      Market

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 ">
        <input
          type="text"
          placeholder="Search coin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto flex-1 px-4 py-2 rounded-lg bg-white/10 outline-none focus:ring-2 focus:ring-white/30"
        />

        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as "all" | "gainers" | "losers",
              )
            }
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/10"
          >
            <option
              value="all"
              className="text-black"
            >
              All
            </option>

            <option
              value="gainers"
              className="text-black"
            >
              Gainers
            </option>

            <option
              value="losers"
              className="text-black"
            >
              Losers
            </option>
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(
                e.target.value as "price" | "market_cap",
              )
            }
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/10"
          >
            <option
              value="price"
              className="text-black"
            >
              Sort by Price
            </option>

            <option
              value="market_cap"
              className="text-black"
            >
              Sort by Market Cap
            </option>
          </select>
        </div>
      </div>

      {/* Header row — desktop/tablet only */}
      <div className="hidden md:grid grid-cols-5 gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl text-sm uppercase tracking-wide text-gray-300">
        <span>Coin</span>

        <span className="text-right">
          Price
        </span>

        <span className="text-right">
          24h
        </span>

        <span className="text-right">
          Market Cap
        </span>

        <span className="text-right">
          Action
        </span>
      </div>

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="mt-6 p-6 rounded-2xl bg-white/5 text-center text-gray-300">
          <p>
            No coins match your current filters
            {filtersActive ? "" : " yet"}.
          </p>

          {showLoadMore && filtersActive && (
            <p className="text-sm mt-1 text-gray-400">
              Try loading more coins — matches may be
              further down the list.
            </p>
          )}
        </div>
      )}

      <ul className="mt-4 space-y-3">
        {filteredData.map((coin: Coin) => (
          <li
            key={coin.id}
            className="flex flex-col md:grid md:grid-cols-5 gap-3 md:gap-4 md:items-center bg-white/5 hover:bg-white/10 transition-all duration-200 p-4 rounded-2xl"
          >
            {/* Coin identity + price on mobile */}
            <div className="flex items-center justify-between md:contents">
              <div className="flex items-center gap-3">
                <Image
                  src={coin.image}
                  width={28}
                  height={28}
                  alt={coin.name}
                  className="rounded-full"
                />

                <div>
                  <p className="font-medium">
                    {coin.name}
                  </p>

                  <p className="text-xs uppercase text-gray-400">
                    {coin.symbol}
                  </p>
                </div>
              </div>

              <span className="md:text-right font-medium">
                ${coin.current_price.toLocaleString()}
              </span>
            </div>

            {/* 24h */}
            <div className="flex items-center justify-between md:contents text-sm md:text-base">
              <span className="text-gray-400 md:hidden">
                24h
              </span>

              <span
                className={`md:text-right font-medium ${
                  coin.price_change_percentage_24h > 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>

            {/* Market Cap */}
            <div className="flex items-center justify-between md:contents text-sm md:text-base">
              <span className="text-gray-400 md:hidden">
                Market Cap
              </span>

              <span className="md:text-right text-gray-300">
                ${coin.market_cap.toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
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

      {/* Load More */}
      {showLoadMore && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-8 w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition disabled:opacity-50"
        >
          {isFetchingNextPage
            ? "Loading..."
            : "Load More"}
        </button>
      )}
    </section>
  );
}


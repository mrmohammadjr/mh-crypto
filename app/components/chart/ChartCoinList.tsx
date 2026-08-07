"use client";

import Link from "next/link";
import Image from "next/image";
import { useCoins } from "@/features/market/hooks/useCoins";
import { Coin } from "@/features/market/types";
import CurrencySkeleton from "../../components/currency/CurrencySkeleton";

export default function ChartCoinList() {
  const { data, isLoading, isError } = useCoins();
  const coins = data?.pages.flat() ?? [];

  if (isLoading) return <CurrencySkeleton />;
  if (isError) {
    return <p className="text-white p-10">Something went wrong loading coins.</p>;
  }

  return (
    <section className="w-full px-6 md:px-10 py-10 min-h-screen bg-gradient-to-r from-black to-[#2d2d2d] text-white">
      <h1 className="text-3xl md:text-4xl font-semibold mb-2">Charts</h1>
      <p className="text-gray-400 mb-8">
        Select a currency to view its price chart
      </p>

      {/* <div className="grid grid-cols-4 gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl text-sm uppercase tracking-wide text-gray-300">
        <span className="col-span-2">Coin</span>
        <span className="text-right">Price</span>
        <span className="text-right">24h</span>
      </div> */}

      <ul className="grid grid-cols-4 gap-2 mt-4 space-y-3">

        {coins.map((coin: Coin) => (
          <li key={coin.id}>
            <Link
              href={`/chart/${coin.id}`}
              className="grid grid-cols-4 gap-4 items-center bg-white/5 hover:bg-white/10 hover:ring-1 hover:ring-green-500/30 transition-all duration-200 p-4 rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-3 col-span-2">
                <Image
                  src={coin.image}
                  width={32}
                  height={32}
                  alt={coin.name}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{coin.name}</p>
                  <p className="text-xs uppercase text-gray-400">{coin.symbol}</p>
                </div>
              </div>

              
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

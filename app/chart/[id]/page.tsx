"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CoinChart from "../../components/chart/CoinChart";
import TimeframeSwitch from "../../components/chart/TimeframeSwitch";
import { useCoins } from "@/features/market/hooks/useCoins";
import { Coin } from "@/features/market/types";
// import { ROUTES } from "@/lib/constants";
import CurrencySkeleton from "../../components/currency/CurrencySkeleton";
import CandleChart from "../../components/chart/CandleChart";

export default function CoinPage() {
  const params = useParams();
  const coinId = params.id as string;
  const [days, setDays] = useState(7);
  const { data, isLoading } = useCoins();
  const [type, setType] = useState<boolean>(false);
  const coin = data?.pages.flat().find((c: Coin) => c.id === coinId);

  return (
    <section className="min-h-screen bg-gradient-to-r from-black to-[#2d2d2d] text-white px-6 md:px-10 py-10">
      <Link
        href={"/chart"}
        className="text-sm text-gray-400 hover:text-white mb-6 inline-block"
      >
        ← Back to Charts
      </Link>

      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <CurrencySkeleton />
        ) : (
          <div className="flex items-center gap-4">
            {coin?.image && (
              <Image
                src={coin.image}
                width={48}
                height={48}
                alt={coin.name}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold capitalize">
                {coin?.name ?? coinId.replace(/-/g, " ")}
              </h1>
              {coin?.symbol && (
                <p className="text-gray-400 uppercase text-sm">{coin.symbol}</p>
              )}
            </div>
          </div>
        )}

        {coin && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <p className="text-sm text-gray-400">Price</p>
              <p className="text-xl font-semibold">
                ${coin.current_price.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <p className="text-sm text-gray-400">24h Change</p>
              <p
                className={`text-xl font-semibold ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
        <button
         onClick={()=> setType((c)=> !c)}
         className={`transition ${type === false ? "bg-white text-black p-2 rounded-md hover:bg-green-600 hover:text-white" : "bg-green-600 text-white p-2 rounded-md hover:bg-white hover:text-black"}`}
        >
          {type === false ? "Show with candle stick" : "Show with line"}
        </button>
        {type === false ? (
          <>
            <TimeframeSwitch value={days} onChange={setDays} />
            <CoinChart coinId={coinId} days={days} />
          </>
        ) : (
          <CandleChart coinId={coinId} />
        )}
      </div>
    </section>
  );
}

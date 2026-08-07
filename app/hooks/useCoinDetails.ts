"use client";

import { useQuery } from "@tanstack/react-query";

export interface CoinDetails {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinIcon: string;
  coinPrice: number;
  coinPriceDay: number; // 24h % change
  coinMarketCap: number;
  coinRank: number;
  coinDescription: string;
  coinHigh24h: number;
  coinLow24h: number;
}

async function fetchCoinDetails(coinId: string): Promise<CoinDetails> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
  if (!res.ok) throw new Error("Failed to fetch coin details");

  const data = await res.json();

  return {
    coinId: data.id,
    coinName: data.name,
    coinSymbol: data.symbol,
    coinIcon: data.image?.large,
    coinPrice: data.market_data?.current_price?.usd,
    coinPriceDay: data.market_data?.price_change_percentage_24h,
    coinMarketCap: data.market_data?.market_cap?.usd,
    coinRank: data.market_cap_rank,
    coinDescription: data.description?.en,
    coinHigh24h: data.market_data?.high_24h?.usd,
    coinLow24h: data.market_data?.low_24h?.usd,
  };
}

export function useCoinDetails(coinId: string) {
  return useQuery({
    queryKey: ["coin-details", coinId],
    queryFn: () => fetchCoinDetails(coinId),
    enabled: !!coinId,
    staleTime: 60 * 1000,
  });
}
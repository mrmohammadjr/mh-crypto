"use client";

import { useQuery } from "@tanstack/react-query";

export interface Candle {
  time: string; // "YYYY-MM-DD"
  open: number;
  high: number;
  low: number;
  close: number;
}

async function fetchOHLC(coinId: string, days: number): Promise<Candle[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error("Failed to fetch chart data");

  const raw: [number, number, number, number, number][] = await res.json();

  return raw.map(([timestamp, open, high, low, close]) => ({
    time: new Date(timestamp).toISOString().split("T")[0],
    open,
    high,
    low,
    close,
  }));
}

export function useCoinOHLC(coinId: string, days: number = 30) {
  return useQuery({
    queryKey: ["ohlc", coinId, days],
    queryFn: () => fetchOHLC(coinId, days),
    staleTime: 60 * 1000,
  });
}
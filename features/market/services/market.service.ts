import { apiFetch } from "@/lib/fetch";
import { Coin } from "../types";

export const getCoins = async (page: number): Promise<Coin[]> => {
  const params = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: "20",
    page: String(page),
    sparkline: "false",
  });

  const data = await apiFetch(`/coins/markets?${params.toString()}`);

  return data;
};
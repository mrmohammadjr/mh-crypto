import { apiFetch } from "@/lib/fetch";

export interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export const searchCoins = async (query: string): Promise<SearchCoin[]> => {
  if (!query.trim()) return [];

  const data = await apiFetch(`/search?query=${encodeURIComponent(query.trim())}`);
  return data.coins?.slice(0, 8) ?? [];
};

// types/watchlist.ts
export interface WatchlistItem {
  coinId: string;
  coinName: string;
  coinIcon: string;
  coinPrice: string | number;
  coinSymbol: string;
  coinPriceDay: string | number;
  coinMarketCap: string | number;
  addedAt?: string;   // ISO timestamp
}
export interface NewsItem {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  url: string;
  source: string;
  publishedAt: number; // unix seconds
  categories: string[];
}

export interface CoinImpact {
  symbol: string;
  name: string;
  priceAtNews: number;
  priceNow: number;
  change: number; // percent
}

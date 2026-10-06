"use client";

import { useQuery } from "@tanstack/react-query";
import type { CoinImpact, NewsItem } from "../types";

export const useNews = () =>
  useQuery({
    queryKey: ["news"],
    queryFn: async (): Promise<NewsItem[]> => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      return (await res.json()).news;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useNewsImpact = (publishedAt?: number) =>
  useQuery({
    queryKey: ["news-impact", publishedAt],
    queryFn: async (): Promise<CoinImpact[]> => {
      const res = await fetch(`/api/news/impact?from=${publishedAt}`);
      if (!res.ok) throw new Error("Failed to fetch impact");
      return (await res.json()).impact;
    },
    enabled: !!publishedAt,
    staleTime: 5 * 60 * 1000,
  });

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WatchlistItem } from "@/types/index";

const WATCHLIST_KEY = ["watchlist"];

async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const res = await fetch("/api/watchlist");
  console.log(res)
  if (!res.ok) throw new Error("Failed to fetch watchlist");
  const data = await res.json();
  return data.watchlist;
}

export function useWatchlist() {
  return useQuery({
    queryKey: WATCHLIST_KEY,
    queryFn: fetchWatchlist,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coin: WatchlistItem) => {
      const res = await fetch("/api/watchList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coin),
      });
      if (!res.ok) throw new Error("Failed to add coin");
      const data = await res.json();
      return data.watchlist as WatchlistItem[];
    },

    onMutate: async (coin) => {
      await queryClient.cancelQueries({ queryKey: WATCHLIST_KEY });
      const previous = queryClient.getQueryData<WatchlistItem[]>(WATCHLIST_KEY);

      queryClient.setQueryData<WatchlistItem[]>(WATCHLIST_KEY, (old = []) => [
        ...old,
        { ...coin, addedAt: new Date().toISOString() },
      ]);

      return { previous };
    },

    onError: (_err, _coin, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WATCHLIST_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coinId: string) => {
      const res = await fetch("/api/watchList", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coinId }),
      });
      if (!res.ok) throw new Error("Failed to remove coin");
      const data = await res.json();
      return data.watchlist as WatchlistItem[];
    },

    onMutate: async (coinId) => {
      await queryClient.cancelQueries({ queryKey: WATCHLIST_KEY });
      const previous = queryClient.getQueryData<WatchlistItem[]>(WATCHLIST_KEY);

      queryClient.setQueryData<WatchlistItem[]>(WATCHLIST_KEY, (old = []) =>
        old.filter((c) => c.coinId !== coinId)
      );

      return { previous };
    },

    onError: (_err, _coinId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WATCHLIST_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
  });
}
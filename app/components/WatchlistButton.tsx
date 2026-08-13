"use client";

import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/app/hooks/useWatchlist";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
interface CoinType {
  coinId: string;
  coinName: string;
  coinIcon: string;
  coinPrice: string | number;
  coinSymbol: string;
  coinPriceDay: string | number;
  coinMarketCap: string | number;
}

export function WatchlistButton({
  coinId,
  coinName,
  coinIcon,
  coinPrice,
  coinSymbol,
  coinPriceDay,
  coinMarketCap,
}: CoinType) {
  const { status } = useSession();
  const router = useRouter();

  const isLoggedIn = status === "authenticated";
  const isLoadingSession = status === "loading";
  const { data: watchlist } = useWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const isWatched = watchlist?.some((c) => c.coinId === coinId);
  const pending = addMutation.isPending || removeMutation.isPending;

  function toggleWatchlist() {
    if (isWatched) {
      removeMutation.mutate(coinId);
    } else {
      addMutation.mutate({
        coinId,
        coinName,
        coinIcon,
        coinPrice,
        coinSymbol,
        coinPriceDay,
        coinMarketCap,
      });
    }
  }

  return (
    <button
      onClick={isLoggedIn ? toggleWatchlist : () => router.push("/login")}
      disabled={pending}
      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-500 disabled:opacity-50"
    >
      {isWatched ? "Remove from watchlist" : "Add to watchlist"}
    </button>
  );
}

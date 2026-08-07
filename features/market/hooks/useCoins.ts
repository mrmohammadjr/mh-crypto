import { useInfiniteQuery } from "@tanstack/react-query";
import { getCoins } from "../services/market.service";

export const useCoins = () => {
  return useInfiniteQuery({
    queryKey: ["coins"],

    queryFn: ({ pageParam }) => getCoins(pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });
};
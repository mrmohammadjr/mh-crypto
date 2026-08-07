import { useInfiniteQuery } from "@tanstack/react-query";
import { getCoins } from "../services/market.service";


export const useInfiniteCoins = () => {

  return useInfiniteQuery({

    queryKey: ["coins"],

    queryFn: ({pageParam}) =>
      getCoins(pageParam),


    initialPageParam: 1,


    getNextPageParam: (lastPage, allPages)=>{

      if(lastPage.length < 10)
        return undefined;


      return allPages.length + 1;

    }

  });

};
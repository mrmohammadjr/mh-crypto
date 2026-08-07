import { useQuery } from "@tanstack/react-query";
import { getCoinChart } from "../services/coin.service";

export const useCoinChart = (id: string, days: number) => {
  return useQuery({
    queryKey: ["coin-chart", id, days],
    queryFn: () => getCoinChart(id, days),
    enabled: !!id,
  });
};
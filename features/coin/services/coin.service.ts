import { apiFetch } from "@/lib/fetch";

export const getCoinChart = async (id: string, days: number) => {
  const params = new URLSearchParams({
    vs_currency: "usd",
    days: String(days),
  });

  const data = await apiFetch(
    `/coins/${id}/market_chart?${params.toString()}`
  );

  return data;
};
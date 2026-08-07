"use client";

import { useCoinChart } from "@/features/coin/hooks/useCoins";
import { formatChartData } from "@/features/coin/utils/formatChartData";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CoinChart({
  coinId,
  days,
}: {
  coinId: string;
  days: number;
}) {
  const { data, isLoading, isError } = useCoinChart(coinId, days);

  if (isLoading) {
    return <p className="text-gray-400">Loading chart...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-400">
        Failed to load chart data. Please try again later.
      </p>
    );
  }

  const chartData = formatChartData(data?.prices);

  if (!chartData?.length) {
    return <p className="text-gray-400">No chart data available.</p>;
  }

  return (
    <div className="h-[400px] w-full rounded-xl bg-white/5 p-4 border border-white/10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="time" hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import {
  createChart,
  ColorType,
  CandlestickSeries,
  UTCTimestamp,
} from "lightweight-charts";
import {
IChartApi,
ISeriesApi,
CandlestickData,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

type Candle = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Props = {
  coinId: string;
};

export default function CandleChart({ coinId }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

const chartRef = useRef<IChartApi | null>(null);
const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [days, setDays] = useState<1 | 7 | 30>(1);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

  // 🎯 fetch data
  const fetchChart = async () => {
    try {
      
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      return res.json();
    } catch (error) {
      setError("Something went wrong");
    }
  };

  // 🧠 convert to candles
  const convertToCandles = (prices: [number, number][]): Candle[] => {
    const candles: Candle[] = [];

    for (let i = 0; i < prices?.length; i += 4) {
      const chunk = prices?.slice(i, i + 4);
      if (chunk.length < 4) continue;

      const open = chunk[0][1];
      const close = chunk[chunk.length - 1][1];
      const high = Math.max(...chunk.map((p) => p[1]));
      const low = Math.min(...chunk.map((p) => p[1]));

      candles.push({
        time: Math.floor(chunk[0][0] / 1000) as UTCTimestamp,
        open,
        high,
        low,
        close,
      });
    }

    return candles;
  };

  // 📊 init chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#020617" },
        textColor: "#CBD5F5",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: "rgba(255,255,255,0.1)",
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.1)",
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // 🔄 fetch + update chart
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await fetchChart();
        const candles = convertToCandles(data?.prices);

        seriesRef.current?.setData(candles);
        chartRef.current?.timeScale().fitContent();
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    load();
  }, [days, coinId]);

  return (
    <div className="w-full">
      {/* 🎛 Timeframe */}
      {/* <h1>{error}</h1> */}
      <div className="flex gap-2 mb-4">
        {[1, 7, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d as 1 | 7 | 30)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              days === d
                ? "bg-white text-black"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {d === 1 ? "1D" : d === 7 ? "7D" : "30D"}
          </button>
        ))}
      </div>

      {/* 📊 Chart */}
      <div
        ref={chartContainerRef}
        className="w-full rounded-xl overflow-hidden"
      />

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-sm text-gray-400 mt-3">Loading chart...</p>
      )}
    </div>
  );
}
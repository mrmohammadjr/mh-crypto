export const formatCandleData = (prices: number[][]) => {
  const candles = [];

  for (let i = 0; i < prices.length; i += 5) {
    const chunk = prices.slice(i, i + 5);

    if (chunk.length < 5) break;

    const open = chunk[0][1];
    const close = chunk[chunk.length - 1][1];
    const high = Math.max(...chunk.map((p) => p[1]));
    const low = Math.min(...chunk.map((p) => p[1]));

    candles.push({
      time: chunk[0][0] / 1000,
      open,
      high,
      low,
      close,
    });
  }

  return candles;
};
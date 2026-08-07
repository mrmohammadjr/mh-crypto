export const formatChartData = (prices?: [number, number][]) => {
  if (!prices?.length) return [];

  return prices.map((item) => ({
    time: new Date(item[0]).toLocaleDateString(),
    price: item[1],
  }));
};

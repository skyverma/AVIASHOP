export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function marginLabel(cost: number, sell: number): string {
  if (sell <= 0) return "—";
  const m = ((sell - cost) / sell) * 100;
  return `${m.toFixed(1)}%`;
}

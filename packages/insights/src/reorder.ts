import type { Alert, Sale, ShopData } from "./types";

/**
 * Reorder alert: flag products with < 3 days of stock left
 * based on average daily sales over the last 14 days.
 *
 * Example:
 *   quantity=10, avg_daily_sales=5 → days_cover=2 → critical
 *   quantity=30, avg_daily_sales=5 → days_cover=6 → ok (no alert)
 */
export function reorderAlerts(data: ShopData, now = new Date()): Alert[] {
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 14);

  const salesByProduct = new Map<string, number>();
  for (const sale of data.sales) {
    const soldAt = new Date(sale.sold_at);
    if (soldAt < windowStart || soldAt > now) continue;
    salesByProduct.set(
      sale.product_id,
      (salesByProduct.get(sale.product_id) ?? 0) + sale.quantity
    );
  }

  const alerts: Alert[] = [];

  for (const product of data.products) {
    const unitsSold = salesByProduct.get(product.id) ?? 0;
    const avgDaily = unitsSold / 14;
    if (avgDaily <= 0) continue;

    const daysCover = product.quantity / avgDaily;
    if (daysCover >= 3) continue;

    alerts.push({
      id: `reorder-${product.id}`,
      type: "reorder",
      severity: daysCover < 1.5 ? "critical" : "warning",
      title: `Reorder ${product.name}`,
      message: `Only ${daysCover.toFixed(1)} days of stock left at current sales pace.`,
      product_id: product.id,
      meta: {
        days_cover: Number(daysCover.toFixed(2)),
        avg_daily_sales: Number(avgDaily.toFixed(2)),
        quantity: product.quantity,
      },
    });
  }

  return alerts.sort(
    (a, b) =>
      Number(a.meta?.days_cover ?? 99) - Number(b.meta?.days_cover ?? 99)
  );
}

export function avgDailySales(sales: Sale[], productId: string, now = new Date(), days = 14): number {
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - days);
  let units = 0;
  for (const sale of sales) {
    if (sale.product_id !== productId) continue;
    const soldAt = new Date(sale.sold_at);
    if (soldAt < windowStart || soldAt > now) continue;
    units += sale.quantity;
  }
  return units / days;
}

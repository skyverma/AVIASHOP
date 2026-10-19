import { marginPercent, type Alert, type ShopData } from "./types";

/**
 * Pricing nudge: flag products whose margin % is more than
 * `thresholdPts` below the shop's average margin.
 *
 * Example: shop avg margin 30%, product margin 18%, threshold 8 → alert.
 */
export function pricingAlerts(
  data: ShopData,
  thresholdPts = 8
): Alert[] {
  if (data.products.length === 0) return [];

  const margins = data.products.map((p) => ({
    product: p,
    margin: marginPercent(p.cost_price, p.sell_price),
  }));

  const avg =
    margins.reduce((sum, m) => sum + m.margin, 0) / margins.length;

  const alerts: Alert[] = [];

  for (const { product, margin } of margins) {
    if (margin >= avg - thresholdPts) continue;

    alerts.push({
      id: `pricing-${product.id}`,
      type: "pricing",
      severity: margin < avg - thresholdPts * 1.5 ? "warning" : "info",
      title: `Underpriced: ${product.name}`,
      message: `Margin ${margin.toFixed(1)}% vs shop average ${avg.toFixed(1)}%. Consider raising sell price.`,
      product_id: product.id,
      meta: {
        margin: Number(margin.toFixed(2)),
        shop_avg_margin: Number(avg.toFixed(2)),
        cost_price: product.cost_price,
        sell_price: product.sell_price,
      },
    });
  }

  return alerts.sort(
    (a, b) => Number(a.meta?.margin ?? 0) - Number(b.meta?.margin ?? 0)
  );
}

import type { Alert, ShopData } from "./types";

/**
 * Dead-stock: quantity > 0 and zero sales in the last 30 days.
 * Shows capital tied up = quantity * cost_price.
 */
export function deadstockAlerts(data: ShopData, now = new Date()): Alert[] {
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 30);

  const soldIds = new Set<string>();
  for (const sale of data.sales) {
    const soldAt = new Date(sale.sold_at);
    if (soldAt >= windowStart && soldAt <= now) {
      soldIds.add(sale.product_id);
    }
  }

  const alerts: Alert[] = [];

  for (const product of data.products) {
    if (product.quantity <= 0) continue;
    if (soldIds.has(product.id)) continue;

    const tiedUp = product.quantity * product.cost_price;
    alerts.push({
      id: `deadstock-${product.id}`,
      type: "deadstock",
      severity: tiedUp >= 5000 ? "warning" : "info",
      title: `Dead stock: ${product.name}`,
      message: `No sales in 30 days. ₹${tiedUp.toLocaleString("en-IN")} tied up in inventory.`,
      product_id: product.id,
      meta: {
        quantity: product.quantity,
        capital_tied: Number(tiedUp.toFixed(2)),
      },
    });
  }

  return alerts.sort(
    (a, b) =>
      Number(b.meta?.capital_tied ?? 0) - Number(a.meta?.capital_tied ?? 0)
  );
}

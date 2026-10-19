import type { Alert } from "@vyomai/insights";
import type { ProfitSummary } from "@vyomai/insights";
import type { ShopStore } from "@vyomai/api-client";

/** Compact shop snapshot for the LLM (keeps token use low on free tier). */
export function buildShopContext(opts: {
  store: ShopStore;
  alerts: Alert[];
  summary: ProfitSummary;
}): string {
  const { store, alerts, summary } = opts;

  const products = store.products
    .slice(0, 40)
    .map((p) => {
      const margin =
        p.sell_price > 0
          ? (((p.sell_price - p.cost_price) / p.sell_price) * 100).toFixed(1)
          : "0";
      return `- ${p.name} | qty ${p.quantity} ${p.unit} | cost ₹${p.cost_price} | sell ₹${p.sell_price} | margin ${margin}%`;
    })
    .join("\n");

  const recentSales = store.sales
    .slice(0, 15)
    .map((s) => {
      const name =
        store.products.find((p) => p.id === s.product_id)?.name ?? "product";
      const rev = s.price_per_unit * s.quantity;
      const profit = (s.price_per_unit - s.cost_per_unit) * s.quantity;
      return `- ${s.sold_at.slice(0, 10)} | ${name} x${s.quantity} | revenue ₹${rev} | profit ₹${profit}${s.customer_name ? ` | ${s.customer_name}` : ""}`;
    })
    .join("\n");

  const credit = store.credit
    .slice(0, 15)
    .map(
      (c) =>
        `- ${c.customer_name} | ₹${c.amount} | ${c.status}${c.due_date ? ` | due ${c.due_date}` : ""}`
    )
    .join("\n");

  const alertLines = alerts
    .slice(0, 12)
    .map((a) => `- [${a.severity}/${a.type}] ${a.title}: ${a.message}`)
    .join("\n");

  return [
    `Shop: ${store.shop.name}`,
    `Totals: revenue ₹${summary.revenue.toFixed(0)}, COGS ₹${summary.cost.toFixed(0)}, profit ₹${summary.profit.toFixed(0)}, margin ${summary.margin_percent.toFixed(1)}%, stock at cost ₹${summary.inventory_value_cost.toFixed(0)}, unrealized profit ₹${summary.unrealized_profit.toFixed(0)}`,
    "",
    "Products:",
    products || "(none)",
    "",
    "Recent sales:",
    recentSales || "(none)",
    "",
    "Credit ledger:",
    credit || "(none)",
    "",
    "Current agent alerts:",
    alertLines || "(none)",
  ].join("\n");
}

import type { Sale, ShopData } from "./types";
import { marginPercent } from "./types";

export type ProfitSummary = {
  revenue: number;
  cost: number;
  profit: number;
  margin_percent: number;
  units_sold: number;
  inventory_value_cost: number;
  inventory_value_retail: number;
  unrealized_profit: number;
};

function saleCost(sale: Sale, data: ShopData): number {
  if (sale.cost_per_unit != null && sale.cost_per_unit > 0) {
    return sale.cost_per_unit * sale.quantity;
  }
  const product = data.products.find((p) => p.id === sale.product_id);
  return (product?.cost_price ?? 0) * sale.quantity;
}

/**
 * Revenue / cost / profit for sales in an optional date window.
 */
export function profitSummary(
  data: ShopData,
  from?: Date,
  to?: Date
): ProfitSummary {
  let revenue = 0;
  let cost = 0;
  let units = 0;

  for (const sale of data.sales) {
    const soldAt = new Date(sale.sold_at);
    if (from && soldAt < from) continue;
    if (to && soldAt > to) continue;
    revenue += sale.price_per_unit * sale.quantity;
    cost += saleCost(sale, data);
    units += sale.quantity;
  }

  const profit = revenue - cost;
  const inventory_value_cost = data.products.reduce(
    (s, p) => s + p.quantity * p.cost_price,
    0
  );
  const inventory_value_retail = data.products.reduce(
    (s, p) => s + p.quantity * p.sell_price,
    0
  );

  return {
    revenue,
    cost,
    profit,
    margin_percent: marginPercent(cost, revenue),
    units_sold: units,
    inventory_value_cost,
    inventory_value_retail,
    unrealized_profit: inventory_value_retail - inventory_value_cost,
  };
}

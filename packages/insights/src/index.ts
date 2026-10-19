import { creditRiskAlerts } from "./credit-risk";
import { deadstockAlerts } from "./deadstock";
import { pricingAlerts } from "./pricing";
import { profitSummary } from "./profit";
import { reorderAlerts } from "./reorder";
import type { Alert, ShopData } from "./types";

export * from "./types";
export { reorderAlerts, avgDailySales } from "./reorder";
export { deadstockAlerts } from "./deadstock";
export { pricingAlerts } from "./pricing";
export { creditRiskAlerts } from "./credit-risk";
export { profitSummary } from "./profit";
export type { ProfitSummary } from "./profit";

/** Run all V1 agentic insight rules for a shop. */
export function runAllInsights(data: ShopData, now = new Date()): Alert[] {
  return [
    ...reorderAlerts(data, now),
    ...deadstockAlerts(data, now),
    ...pricingAlerts(data),
    ...creditRiskAlerts(data, now),
  ];
}

export function shopHealth(data: ShopData, now = new Date()) {
  const alerts = runAllInsights(data, now);
  const summary = profitSummary(data);
  return { alerts, summary };
}

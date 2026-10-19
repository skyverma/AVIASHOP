export type Product = {
  id: string;
  name: string;
  cost_price: number;
  sell_price: number;
  quantity: number;
};

export type Sale = {
  id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
  cost_per_unit?: number;
  sold_at: string;
};

export type CreditEntry = {
  id: string;
  customer_name: string;
  customer_phone?: string | null;
  amount: number;
  status: "pending" | "paid" | "partial";
  due_date?: string | null;
  created_at: string;
  paid_at?: string | null;
};

export type ShopData = {
  products: Product[];
  sales: Sale[];
  credit: CreditEntry[];
};

export type AlertSeverity = "critical" | "warning" | "info";

export type Alert = {
  id: string;
  type: "reorder" | "deadstock" | "pricing" | "credit_risk" | "profit";
  severity: AlertSeverity;
  title: string;
  message: string;
  product_id?: string;
  customer_name?: string;
  meta?: Record<string, number | string>;
};

export function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

export function marginPercent(cost: number, sell: number): number {
  if (sell <= 0) return 0;
  return ((sell - cost) / sell) * 100;
}

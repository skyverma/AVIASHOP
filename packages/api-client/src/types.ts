export type Shop = {
  id: string;
  name: string;
  phone?: string;
  created_at: string;
};

export type ProductRecord = {
  id: string;
  shop_id: string;
  name: string;
  sku?: string;
  cost_price: number;
  sell_price: number;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
};

export type SaleRecord = {
  id: string;
  shop_id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
  cost_per_unit: number;
  customer_name?: string;
  sold_at: string;
};

export type CreditRecord = {
  id: string;
  shop_id: string;
  customer_name: string;
  customer_phone?: string;
  amount: number;
  status: "pending" | "paid" | "partial";
  due_date?: string;
  created_at: string;
  paid_at?: string;
};

export type CreateProductInput = {
  name: string;
  sku?: string;
  cost_price: number;
  sell_price: number;
  quantity: number;
  unit?: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type CreateSaleInput = {
  product_id: string;
  quantity: number;
  price_per_unit?: number;
  customer_name?: string;
};

export type CreateCreditInput = {
  customer_name: string;
  customer_phone?: string;
  amount: number;
  due_date?: string;
};

export type ShopStore = {
  shop: Shop;
  products: ProductRecord[];
  sales: SaleRecord[];
  credit: CreditRecord[];
};

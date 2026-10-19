import type {
  CreateCreditInput,
  CreateProductInput,
  CreateSaleInput,
  CreditRecord,
  ProductRecord,
  SaleRecord,
  ShopStore,
  UpdateProductInput,
} from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function makeProduct(
  shopId: string,
  index: number,
  opts: {
    cost: number;
    sell: number;
    qty: number;
  }
): ProductRecord {
  const now = new Date().toISOString();
  return {
    id: uid(),
    shop_id: shopId,
    name: `Item ${index}`,
    sku: `ITEM-${index}`,
    cost_price: opts.cost,
    sell_price: opts.sell,
    quantity: opts.qty,
    unit: "pcs",
    created_at: now,
    updated_at: now,
  };
}

/** Neutral demo seed — Item 1..N so alerts/profit still work without brand names. */
export function createDemoStore(shopName = "My Shop"): ShopStore {
  const shopId = uid();

  const item1 = makeProduct(shopId, 1, { cost: 420, sell: 480, qty: 8 });
  const item2 = makeProduct(shopId, 2, { cost: 145, sell: 168, qty: 42 });
  const item3 = makeProduct(shopId, 3, { cost: 55, sell: 58, qty: 60 });
  const item4 = makeProduct(shopId, 4, { cost: 40, sell: 55, qty: 25 });

  const sales: SaleRecord[] = [
    {
      id: uid(),
      shop_id: shopId,
      product_id: item1.id,
      quantity: 4,
      price_per_unit: 480,
      cost_per_unit: 420,
      customer_name: "Customer 1",
      sold_at: daysAgo(1),
    },
    {
      id: uid(),
      shop_id: shopId,
      product_id: item1.id,
      quantity: 3,
      price_per_unit: 480,
      cost_per_unit: 420,
      customer_name: "Customer 2",
      sold_at: daysAgo(3),
    },
    {
      id: uid(),
      shop_id: shopId,
      product_id: item1.id,
      quantity: 5,
      price_per_unit: 475,
      cost_per_unit: 420,
      sold_at: daysAgo(6),
    },
    {
      id: uid(),
      shop_id: shopId,
      product_id: item2.id,
      quantity: 6,
      price_per_unit: 168,
      cost_per_unit: 145,
      sold_at: daysAgo(2),
    },
    {
      id: uid(),
      shop_id: shopId,
      product_id: item4.id,
      quantity: 8,
      price_per_unit: 55,
      cost_per_unit: 40,
      sold_at: daysAgo(4),
    },
  ];

  const credit: CreditRecord[] = [
    {
      id: uid(),
      shop_id: shopId,
      customer_name: "Customer 2",
      customer_phone: "9000000002",
      amount: 2400,
      status: "pending",
      due_date: daysAgo(5).slice(0, 10),
      created_at: daysAgo(12),
    },
    {
      id: uid(),
      shop_id: shopId,
      customer_name: "Customer 2",
      amount: 1200,
      status: "paid",
      due_date: daysAgo(20).slice(0, 10),
      created_at: daysAgo(28),
      paid_at: daysAgo(10),
    },
    {
      id: uid(),
      shop_id: shopId,
      customer_name: "Customer 1",
      amount: 800,
      status: "paid",
      due_date: daysAgo(8).slice(0, 10),
      created_at: daysAgo(15),
      paid_at: daysAgo(9),
    },
  ];

  return {
    shop: {
      id: shopId,
      name: shopName,
      phone: "",
      created_at: new Date().toISOString(),
    },
    products: [item1, item2, item3, item4],
    sales,
    credit,
  };
}

export function addProduct(
  store: ShopStore,
  input: CreateProductInput
): ShopStore {
  const now = new Date().toISOString();
  const product: ProductRecord = {
    id: uid(),
    shop_id: store.shop.id,
    name: input.name.trim(),
    sku: input.sku?.trim(),
    cost_price: input.cost_price,
    sell_price: input.sell_price,
    quantity: input.quantity,
    unit: input.unit?.trim() || "pcs",
    created_at: now,
    updated_at: now,
  };
  return { ...store, products: [product, ...store.products] };
}

export function updateProduct(
  store: ShopStore,
  productId: string,
  input: UpdateProductInput
): ShopStore {
  return {
    ...store,
    products: store.products.map((p) =>
      p.id === productId
        ? {
            ...p,
            ...input,
            name: input.name?.trim() ?? p.name,
            sku: input.sku?.trim() ?? p.sku,
            unit: input.unit?.trim() ?? p.unit,
            updated_at: new Date().toISOString(),
          }
        : p
    ),
  };
}

export function deleteProduct(store: ShopStore, productId: string): ShopStore {
  return {
    ...store,
    products: store.products.filter((p) => p.id !== productId),
  };
}

export function recordSale(
  store: ShopStore,
  input: CreateSaleInput
): { store: ShopStore; error?: string } {
  const product = store.products.find((p) => p.id === input.product_id);
  if (!product) return { store, error: "Product not found" };
  if (input.quantity <= 0) return { store, error: "Quantity must be positive" };
  if (product.quantity < input.quantity) {
    return { store, error: `Only ${product.quantity} ${product.unit} in stock` };
  }

  const price = input.price_per_unit ?? product.sell_price;
  const sale: SaleRecord = {
    id: uid(),
    shop_id: store.shop.id,
    product_id: product.id,
    quantity: input.quantity,
    price_per_unit: price,
    cost_per_unit: product.cost_price,
    customer_name: input.customer_name?.trim(),
    sold_at: new Date().toISOString(),
  };

  return {
    store: {
      ...store,
      sales: [sale, ...store.sales],
      products: store.products.map((p) =>
        p.id === product.id
          ? {
              ...p,
              quantity: p.quantity - input.quantity,
              updated_at: new Date().toISOString(),
            }
          : p
      ),
    },
  };
}

export function addCredit(
  store: ShopStore,
  input: CreateCreditInput
): ShopStore {
  const entry: CreditRecord = {
    id: uid(),
    shop_id: store.shop.id,
    customer_name: input.customer_name.trim(),
    customer_phone: input.customer_phone?.trim(),
    amount: input.amount,
    status: "pending",
    due_date: input.due_date,
    created_at: new Date().toISOString(),
  };
  return { ...store, credit: [entry, ...store.credit] };
}

export function markCreditPaid(
  store: ShopStore,
  creditId: string
): ShopStore {
  return {
    ...store,
    credit: store.credit.map((c) =>
      c.id === creditId
        ? { ...c, status: "paid", paid_at: new Date().toISOString() }
        : c
    ),
  };
}

export function toInsightShopData(store: ShopStore) {
  return {
    products: store.products.map((p) => ({
      id: p.id,
      name: p.name,
      cost_price: p.cost_price,
      sell_price: p.sell_price,
      quantity: p.quantity,
    })),
    sales: store.sales.map((s) => ({
      id: s.id,
      product_id: s.product_id,
      quantity: s.quantity,
      price_per_unit: s.price_per_unit,
      cost_per_unit: s.cost_per_unit,
      sold_at: s.sold_at,
    })),
    credit: store.credit.map((c) => ({
      id: c.id,
      customer_name: c.customer_name,
      customer_phone: c.customer_phone,
      amount: c.amount,
      status: c.status,
      due_date: c.due_date,
      created_at: c.created_at,
      paid_at: c.paid_at,
    })),
  };
}

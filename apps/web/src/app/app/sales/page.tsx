"use client";

import { useEffect, useState } from "react";
import { MoneyStat } from "@/components/StatTile";
import { formatINR } from "@/lib/format";
import { useShop } from "@/lib/shop-context";

export default function SalesPage() {
  const { store, summary, sell } = useShop();
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [customer, setCustomer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    if (!productId && store.products[0]) {
      setProductId(store.products[0].id);
    }
  }, [store.products, productId]);

  const selected = store.products.find((p) => p.id === productId);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    const qty = Number(quantity);
    const err = sell({
      product_id: productId,
      quantity: qty,
      customer_name: customer || undefined,
    });
    if (err) {
      setError(err);
      return;
    }
    setOk(`Sold ${qty} ${selected?.unit ?? "units"} of ${selected?.name ?? "item"}`);
    setQuantity("1");
    setCustomer("");
  }

  return (
    <div className="space-y-8">
      <section>
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sales & profit
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Every sale reduces stock and updates revenue, cost of goods, and
          profit automatically.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <MoneyStat label="Revenue" amount={summary.revenue} tone="teal" />
        <MoneyStat label="COGS" amount={summary.cost} />
        <MoneyStat
          label="Profit"
          amount={summary.profit}
          tone={summary.profit >= 0 ? "profit" : "loss"}
          hint={`${summary.margin_percent.toFixed(1)}% on sales`}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={onSubmit} className="vyom-panel space-y-3 p-5">
          <h2 className="text-lg font-semibold">Record a sale</h2>
          <label className="block text-sm text-ink-soft">
            Product
            <select
              className="vyom-input mt-1"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              {store.products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.quantity} {p.unit})
                </option>
              ))}
            </select>
          </label>
          <input
            className="vyom-input"
            placeholder="Quantity"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <input
            className="vyom-input"
            placeholder="Customer name (optional)"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          {selected ? (
            <p className="text-sm text-ink-soft">
              Line total ≈{" "}
              {formatINR(selected.sell_price * (Number(quantity) || 0))} · unit
              margin{" "}
              {formatINR(selected.sell_price - selected.cost_price)}
            </p>
          ) : null}
          {error ? <p className="text-sm text-loss">{error}</p> : null}
          {ok ? <p className="text-sm text-profit">{ok}</p> : null}
          <button type="submit" className="vyom-btn vyom-btn-primary">
            Save sale
          </button>
        </form>

        <div className="space-y-2">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent sales
          </h2>
          {store.sales.slice(0, 12).map((sale) => {
            const product = store.products.find((p) => p.id === sale.product_id);
            const revenue = sale.price_per_unit * sale.quantity;
            const profit =
              (sale.price_per_unit - sale.cost_per_unit) * sale.quantity;
            return (
              <article key={sale.id} className="vyom-panel animate-rise p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {product?.name ?? "Deleted product"}
                    </h3>
                    <p className="text-xs text-ink-soft">
                      {sale.quantity} units ·{" "}
                      {sale.customer_name || "Walk-in"} ·{" "}
                      {new Date(sale.sold_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{formatINR(revenue)}</div>
                    <div className={profit >= 0 ? "text-profit" : "text-loss"}>
                      Profit {formatINR(profit)}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

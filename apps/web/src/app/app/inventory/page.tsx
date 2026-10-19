"use client";

import { useMemo, useState } from "react";
import { formatINR, marginLabel } from "@/lib/format";
import { useShop } from "@/lib/shop-context";

export default function InventoryPage() {
  const { store, createProduct, editProduct, removeProduct } = useShop();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [cost, setCost] = useState("");
  const [sell, setSell] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.products;
    return store.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q)
    );
  }, [store.products, query]);

  function resetForm() {
    setName("");
    setSku("");
    setCost("");
    setSell("");
    setQty("");
    setUnit("pcs");
    setEditingId(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      sku,
      cost_price: Number(cost),
      sell_price: Number(sell),
      quantity: Number(qty),
      unit,
    };
    if (!payload.name || Number.isNaN(payload.cost_price) || Number.isNaN(payload.sell_price) || Number.isNaN(payload.quantity)) {
      return;
    }
    if (editingId) {
      editProduct(editingId, payload);
    } else {
      createProduct(payload);
    }
    resetForm();
  }

  function startEdit(id: string) {
    const p = store.products.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setName(p.name);
    setSku(p.sku ?? "");
    setCost(String(p.cost_price));
    setSell(String(p.sell_price));
    setQty(String(p.quantity));
    setUnit(p.unit);
  }

  return (
    <div className="space-y-8">
      <section>
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Inventory
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Register products with cost and sell price. Margin and agent pricing
          nudges are computed from these numbers.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={onSubmit} className="vyom-panel space-y-3 p-5">
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit product" : "Add product"}
          </h2>
          <input
            className="vyom-input"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="vyom-input"
            placeholder="SKU (optional)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="vyom-input"
              placeholder="Cost price"
              inputMode="decimal"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
            <input
              className="vyom-input"
              placeholder="Sell price"
              inputMode="decimal"
              value={sell}
              onChange={(e) => setSell(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="vyom-input"
              placeholder="Quantity"
              inputMode="decimal"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
            <input
              className="vyom-input"
              placeholder="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="vyom-btn vyom-btn-primary">
              {editingId ? "Save changes" : "Add to inventory"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="vyom-btn vyom-btn-ghost"
                onClick={resetForm}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="space-y-3">
          <input
            className="vyom-input"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="space-y-2">
            {filtered.map((p) => (
              <article key={p.id} className="vyom-panel animate-rise p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{p.name}</h3>
                    <p className="text-xs text-ink-soft">
                      {p.sku || "No SKU"} · {p.quantity} {p.unit}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{formatINR(p.sell_price)}</div>
                    <div className="text-ink-soft">
                      Cost {formatINR(p.cost_price)} ·{" "}
                      {marginLabel(p.cost_price, p.sell_price)} margin
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="vyom-btn vyom-btn-ghost !px-3 !py-1.5 text-sm"
                    onClick={() => startEdit(p.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="vyom-btn vyom-btn-ghost !px-3 !py-1.5 text-sm text-loss"
                    onClick={() => removeProduct(p.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
            {filtered.length === 0 ? (
              <p className="text-ink-soft">No products match your search.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

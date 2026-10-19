"use client";

import Link from "next/link";
import { AlertCard } from "@/components/AlertCard";
import { MoneyStat, StatTile } from "@/components/StatTile";
import { formatNumber } from "@/lib/format";
import { useShop } from "@/lib/shop-context";

export default function DashboardPage() {
  const { ready, store, alerts, summary, resetDemo, setShopName } = useShop();

  if (!ready) {
    return <p className="text-ink-soft">Loading your shop…</p>;
  }

  const topAlerts = alerts.slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm tracking-[0.14em] text-teal uppercase">
            Business home
          </p>
          <h1
            className="mt-1 text-3xl font-semibold text-ink sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {store.shop.name}
          </h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            Track stock, pricing, revenue, and profit. Your agent flags what
            needs attention first.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/inventory" className="vyom-btn vyom-btn-primary">
            Add product
          </Link>
          <Link href="/app/sales" className="vyom-btn vyom-btn-ghost">
            Record sale
          </Link>
          <button
            type="button"
            className="vyom-btn vyom-btn-ghost"
            onClick={() => resetDemo()}
          >
            Reset demo data
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MoneyStat
          label="Revenue"
          amount={summary.revenue}
          hint="From recorded sales"
          tone="teal"
        />
        <MoneyStat
          label="Profit"
          amount={summary.profit}
          hint={`${summary.margin_percent.toFixed(1)}% margin`}
          tone={summary.profit >= 0 ? "profit" : "loss"}
        />
        <MoneyStat
          label="Stock at cost"
          amount={summary.inventory_value_cost}
          hint="Capital in inventory"
        />
        <StatTile
          label="Open alerts"
          value={formatNumber(alerts.length)}
          hint="Reorder · pricing · credit"
          tone="teal"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Agent priorities
            </h2>
            <Link href="/app/agent" className="text-sm font-medium text-teal">
              View all
            </Link>
          </div>
          {topAlerts.length === 0 ? (
            <div className="vyom-panel p-5 text-ink-soft">
              No urgent alerts. Keep logging sales so the agent can learn demand.
            </div>
          ) : (
            <div className="space-y-3">
              {topAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>

        <div className="vyom-panel space-y-4 p-5">
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Quick setup
          </h2>
          <label className="block text-sm text-ink-soft">
            Shop name
            <input
              className="vyom-input mt-1"
              defaultValue={store.shop.name}
              onBlur={(e) => setShopName(e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-paper p-3">
              <div className="text-ink-soft">SKUs</div>
              <div className="text-lg font-semibold">{store.products.length}</div>
            </div>
            <div className="rounded-xl bg-paper p-3">
              <div className="text-ink-soft">Sales logged</div>
              <div className="text-lg font-semibold">{store.sales.length}</div>
            </div>
            <div className="rounded-xl bg-paper p-3">
              <div className="text-ink-soft">Unrealized profit</div>
              <div className="text-lg font-semibold text-profit">
                {formatNumber(summary.unrealized_profit)}
              </div>
            </div>
            <div className="rounded-xl bg-paper p-3">
              <div className="text-ink-soft">Units sold</div>
              <div className="text-lg font-semibold">
                {formatNumber(summary.units_sold)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

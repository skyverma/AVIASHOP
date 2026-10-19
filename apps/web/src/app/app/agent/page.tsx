"use client";

import { useChatUi } from "@/components/ChatDrawer";
import { AlertCard } from "@/components/AlertCard";
import { useShop } from "@/lib/shop-context";

const GROUPS = [
  {
    key: "reorder",
    title: "Reorder",
    blurb: "Less than ~3 days of stock at recent sales pace.",
  },
  {
    key: "deadstock",
    title: "Dead stock",
    blurb: "In stock with no sales in 30 days — capital stuck.",
  },
  {
    key: "pricing",
    title: "Pricing",
    blurb: "Margins meaningfully below your shop average.",
  },
  {
    key: "credit_risk",
    title: "Credit risk",
    blurb: "Customers with weak repayment scores.",
  },
] as const;

export default function AgentPage() {
  const { alerts } = useShop();
  const { openChat } = useChatUi();

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm tracking-[0.14em] text-teal uppercase">
            Agentic layer
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VYOMAI Agent
          </h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Rule-based alerts below. For questions in plain language, open the
            AI chat panel on the right.
          </p>
        </div>
        <button
          type="button"
          className="vyom-btn vyom-btn-primary"
          onClick={openChat}
        >
          Open AI Chat
        </button>
      </section>

      <section className="grid gap-6">
        {GROUPS.map((group) => {
          const items = alerts.filter((a) => a.type === group.key);
          return (
            <div key={group.key} className="space-y-3">
              <div>
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {group.title}
                </h2>
                <p className="text-sm text-ink-soft">{group.blurb}</p>
              </div>
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line px-4 py-5 text-sm text-ink-soft">
                  No {group.title.toLowerCase()} alerts right now.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {items.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

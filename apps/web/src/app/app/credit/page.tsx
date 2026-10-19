"use client";

import { useState } from "react";
import { formatINR } from "@/lib/format";
import { useShop } from "@/lib/shop-context";

export default function CreditPage() {
  const { store, lend, settleCredit } = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");

  const pending = store.credit.filter((c) => c.status !== "paid");
  const pendingTotal = pending.reduce((s, c) => s + c.amount, 0);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    lend({
      customer_name: name,
      customer_phone: phone || undefined,
      amount: Number(amount),
      due_date: due || undefined,
    });
    setName("");
    setPhone("");
    setAmount("");
    setDue("");
  }

  return (
    <div className="space-y-8">
      <section>
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Credit ledger
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Track udhaar cleanly. The agent scores repayment risk from on-time
          history and overdue days.
        </p>
      </section>

      <div className="vyom-panel inline-flex flex-col p-4 sm:p-5">
        <span className="text-xs tracking-[0.12em] text-ink-soft uppercase">
          Outstanding
        </span>
        <span
          className="text-3xl font-semibold text-amber"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {formatINR(pendingTotal)}
        </span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={onSubmit} className="vyom-panel space-y-3 p-5">
          <h2 className="text-lg font-semibold">Add credit entry</h2>
          <input
            className="vyom-input"
            placeholder="Customer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="vyom-input"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="vyom-input"
            placeholder="Amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <label className="block text-sm text-ink-soft">
            Due date
            <input
              type="date"
              className="vyom-input mt-1"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </label>
          <button type="submit" className="vyom-btn vyom-btn-primary">
            Save credit
          </button>
        </form>

        <div className="space-y-2">
          {store.credit.map((entry) => (
            <article key={entry.id} className="vyom-panel animate-rise p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{entry.customer_name}</h3>
                  <p className="text-xs text-ink-soft">
                    {entry.status.toUpperCase()}
                    {entry.due_date ? ` · due ${entry.due_date}` : ""}
                    {entry.customer_phone ? ` · ${entry.customer_phone}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatINR(entry.amount)}</div>
                  {entry.status !== "paid" ? (
                    <button
                      type="button"
                      className="mt-2 text-sm font-medium text-teal"
                      onClick={() => settleCredit(entry.id)}
                    >
                      Mark paid
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sparkline } from "@/components/landing/Sparkline";

const STEPS = [
  {
    id: "track",
    label: "Track",
    title: "See every item clearly",
    body: "Register Item 1, Item 2, and more with cost, sell price, and quantity — the base for margin and stock decisions.",
    metrics: [
      { label: "Items", value: "24", points: [8, 10, 12, 14, 18, 22, 24], color: "#d97706" },
      { label: "Stock value", value: "₹1.2L", points: [40, 42, 48, 55, 60, 70, 78], color: "#ea580c" },
    ],
  },
  {
    id: "price",
    label: "Price",
    title: "Protect your margin",
    body: "Compare cost vs sell price across your catalog. VYOMAI flags underpriced items before profit leaks away.",
    metrics: [
      { label: "Avg margin", value: "22%", points: [14, 15, 16, 18, 19, 21, 22], color: "#3f7a52" },
      { label: "Alerts", value: "3", points: [1, 2, 2, 4, 3, 3, 3], color: "#e11d48" },
    ],
  },
  {
    id: "grow",
    label: "Grow",
    title: "Watch revenue become profit",
    body: "Every sale updates stock, revenue, COGS, and true profit — so growth curves reflect cash reality, not guesswork.",
    metrics: [
      { label: "Revenue", value: "₹86k", points: [20, 28, 32, 45, 52, 70, 86], color: "#2563eb" },
      { label: "Profit", value: "₹18k", points: [4, 6, 7, 10, 12, 15, 18], color: "#3f7a52" },
    ],
  },
  {
    id: "act",
    label: "Act",
    title: "Let the agent push next steps",
    body: "Reorder, dead stock, pricing, and credit risk — plus AI chat on the right when you want answers in plain language.",
    metrics: [
      { label: "Actions", value: "7", points: [2, 3, 3, 5, 4, 6, 7], color: "#db2777" },
      { label: "Risk score", value: "Good", points: [40, 45, 50, 55, 62, 70, 78], color: "#d97706" },
    ],
  },
] as const;

function StepBody({
  index,
  step,
}: {
  index: number;
  step: (typeof STEPS)[number];
}) {
  return (
    <div className="grid h-full gap-4 p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-6">
      <div className="flex flex-col justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#fbbf24] uppercase">
            0{index + 1} {step.label}
          </p>
          <h3
            className="mt-3 text-2xl leading-tight font-semibold sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {step.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#d6c7b8]">
            {step.body}
          </p>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((_, di) => (
            <span
              key={di}
              className={`h-1 rounded-full transition-all duration-300 ${
                di === index ? "w-8 bg-[#fbbf24]" : "w-4 bg-[#5c4a3f]"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-3 self-center">
        {step.metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-[11px] tracking-wide text-[#b9a794] uppercase">
                  {m.label}
                </div>
                <div className="mt-1 text-xl font-semibold text-white">
                  {m.value}
                </div>
              </div>
              <div className="w-28">
                <Sparkline points={[...m.points]} color={m.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MethodSteps() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div className="space-y-4">
      {/* Mobile: tab pills + single panel */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              i === active
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink-soft"
            }`}
          >
            0{i + 1} {s.label}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-[28px] border border-line bg-[#1a1210] md:hidden">
        <StepBody index={active} step={step} />
      </div>

      {/* Desktop: horizontal expand accordion */}
      <div className="method-rail hidden min-h-[360px] gap-2 overflow-hidden rounded-[28px] border border-line bg-[#1a1210] p-2 md:flex">
        {STEPS.map((s, i) => {
          const open = i === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              className={`method-step relative overflow-hidden rounded-[22px] text-left transition-[flex,background] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open
                  ? "flex-[3.2] bg-[#2a1f1a] text-[#faf7f2]"
                  : "flex-[0.55] bg-[#241914] text-[#c4b5a5] hover:bg-[#2f231c]"
              }`}
              aria-pressed={open}
            >
              {open ? (
                <StepBody index={i} step={s} />
              ) : (
                <div className="flex h-full min-h-[340px] items-end justify-center px-2 py-5">
                  <span className="origin-center -rotate-90 text-sm font-semibold tracking-[0.14em] whitespace-nowrap uppercase">
                    0{i + 1} {s.label}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { formatINR } from "@/lib/format";

export function StatTile({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "profit" | "loss" | "teal";
}) {
  const toneClass =
    tone === "profit"
      ? "text-profit"
      : tone === "loss"
        ? "text-loss"
        : tone === "teal"
          ? "text-teal"
          : "text-ink";

  return (
    <div className="vyom-panel animate-rise p-4 sm:p-5">
      <div className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
        {label}
      </div>
      <div
        className={`mt-2 text-2xl font-semibold sm:text-3xl ${toneClass}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      {hint ? <p className="mt-2 text-sm text-ink-soft">{hint}</p> : null}
    </div>
  );
}

export function MoneyStat({
  label,
  amount,
  hint,
  tone,
}: {
  label: string;
  amount: number;
  hint?: string;
  tone?: "default" | "profit" | "loss" | "teal";
}) {
  return (
    <StatTile label={label} value={formatINR(amount)} hint={hint} tone={tone} />
  );
}

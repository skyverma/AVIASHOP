import type { Alert } from "@vyomai/insights";

const SEVERITY_STYLES: Record<Alert["severity"], string> = {
  critical: "border-loss/30 bg-loss/5 text-loss",
  warning: "border-amber/30 bg-amber/5 text-amber",
  info: "border-teal/25 bg-teal/5 text-teal-deep",
};

export function AlertCard({ alert }: { alert: Alert }) {
  return (
    <article
      className={`animate-rise rounded-2xl border px-4 py-3 ${SEVERITY_STYLES[alert.severity]}`}
    >
      <div className="mb-1 flex items-center justify-between gap-3">
        <h3 className="font-semibold">{alert.title}</h3>
        <span className="text-[11px] uppercase tracking-[0.14em] opacity-70">
          {alert.type.replace("_", " ")}
        </span>
      </div>
      <p className="text-sm leading-relaxed opacity-90">{alert.message}</p>
    </article>
  );
}

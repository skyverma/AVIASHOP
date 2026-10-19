import { daysBetween, type Alert, type ShopData } from "./types";

/**
 * Credit risk: on_time_ratio * 100 - (avg_days_overdue * weight)
 * Flag customers below scoreThreshold (default 60).
 */
export function creditRiskAlerts(
  data: ShopData,
  now = new Date(),
  opts: { overdueWeight?: number; scoreThreshold?: number } = {}
): Alert[] {
  const overdueWeight = opts.overdueWeight ?? 2;
  const scoreThreshold = opts.scoreThreshold ?? 60;

  const byCustomer = new Map<
    string,
    { total: number; onTime: number; overdueDays: number[]; pending: number }
  >();

  for (const entry of data.credit) {
    const key = entry.customer_name.trim().toLowerCase();
    const bucket = byCustomer.get(key) ?? {
      total: 0,
      onTime: 0,
      overdueDays: [],
      pending: 0,
    };
    bucket.total += 1;

    if (entry.status === "paid") {
      const due = entry.due_date ? new Date(entry.due_date) : null;
      const paid = entry.paid_at ? new Date(entry.paid_at) : now;
      if (!due || paid <= due) {
        bucket.onTime += 1;
      } else {
        bucket.overdueDays.push(daysBetween(paid, due));
      }
    } else {
      bucket.pending += entry.amount;
      if (entry.due_date) {
        const due = new Date(entry.due_date);
        if (due < now) {
          bucket.overdueDays.push(daysBetween(now, due));
        }
      }
    }

    byCustomer.set(key, bucket);
  }

  const alerts: Alert[] = [];

  for (const [key, bucket] of byCustomer) {
    if (bucket.total === 0) continue;
    const onTimeRatio = bucket.onTime / bucket.total;
    const avgOverdue =
      bucket.overdueDays.length === 0
        ? 0
        : bucket.overdueDays.reduce((a, b) => a + b, 0) /
          bucket.overdueDays.length;

    const score = onTimeRatio * 100 - avgOverdue * overdueWeight;
    if (score >= scoreThreshold && bucket.pending <= 0) continue;
    if (score >= scoreThreshold) continue;

    const displayName = data.credit.find(
      (c) => c.customer_name.trim().toLowerCase() === key
    )?.customer_name;

    alerts.push({
      id: `credit-${key}`,
      type: "credit_risk",
      severity: score < 40 ? "critical" : "warning",
      title: `Credit risk: ${displayName ?? key}`,
      message: `Score ${Math.round(score)}. Pending ₹${bucket.pending.toLocaleString("en-IN")}.`,
      customer_name: displayName ?? key,
      meta: {
        score: Number(score.toFixed(1)),
        on_time_ratio: Number(onTimeRatio.toFixed(2)),
        avg_days_overdue: Number(avgOverdue.toFixed(1)),
        pending: bucket.pending,
      },
    });
  }

  return alerts.sort(
    (a, b) => Number(a.meta?.score ?? 100) - Number(b.meta?.score ?? 100)
  );
}

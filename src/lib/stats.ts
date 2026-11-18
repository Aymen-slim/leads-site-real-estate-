// Statistical helpers, date range resolution (Europe/Oslo), and formatting.

export const MIN_EXPOSURES_FOR_CONFIDENCE = 100;
export const MIN_TOTAL_CONVERSIONS = 5;

export type ConfidenceStatus = "insufficient_data" | "inconclusive" | "significant";

export interface ExperimentSignificance {
  rateA: number;
  rateB: number;
  relativeLiftPct: number | null; // (rateB - rateA) / rateA * 100
  leader: "A" | "B" | "tie";
  zScore: number;
  pValue: number;
  confidencePct: number;
  status: ConfidenceStatus;
}

/** Standard normal CDF using Abramowitz & Stegun 7.1.26 (max error 1.5e-7). */
function normalCdf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * ax);
  const poly =
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t);
  const erf = 1 - poly * Math.exp(-ax * ax);
  return 0.5 * (1 + sign * erf);
}

/** Two-proportion two-sided z-test comparing Variant A vs Variant B. */
export function evaluateExperiment(
  exposuresA: number,
  conversionsA: number,
  exposuresB: number,
  conversionsB: number
): ExperimentSignificance {
  const rateA = exposuresA > 0 ? conversionsA / exposuresA : 0;
  const rateB = exposuresB > 0 ? conversionsB / exposuresB : 0;
  const leader: "A" | "B" | "tie" =
    Math.abs(rateA - rateB) < 1e-9 ? "tie" : rateA > rateB ? "A" : "B";
  const relativeLiftPct =
    rateA > 0 ? ((rateB - rateA) / rateA) * 100 : null;

  const totalConv = conversionsA + conversionsB;
  if (
    exposuresA < MIN_EXPOSURES_FOR_CONFIDENCE ||
    exposuresB < MIN_EXPOSURES_FOR_CONFIDENCE ||
    totalConv < MIN_TOTAL_CONVERSIONS
  ) {
    return {
      rateA,
      rateB,
      relativeLiftPct,
      leader,
      zScore: 0,
      pValue: 1,
      confidencePct: 0,
      status: "insufficient_data",
    };
  }

  const pooled = totalConv / (exposuresA + exposuresB);
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / exposuresA + 1 / exposuresB));
  if (se === 0) {
    return {
      rateA,
      rateB,
      relativeLiftPct,
      leader,
      zScore: 0,
      pValue: 1,
      confidencePct: 0,
      status: "inconclusive",
    };
  }

  const z = (rateB - rateA) / se;
  const pValue = Math.min(1, Math.max(0, 2 * (1 - normalCdf(Math.abs(z)))));
  const confidencePct = Math.round((1 - pValue) * 1000) / 10;

  return {
    rateA,
    rateB,
    relativeLiftPct,
    leader,
    zScore: z,
    pValue,
    confidencePct,
    status: confidencePct >= 95 ? "significant" : "inconclusive",
  };
}

export type DatePreset = "today" | "7d" | "30d" | "90d" | "custom";

export interface ResolvedDateRange {
  preset: DatePreset;
  from: string; // ISO UTC
  to: string;   // ISO UTC
  fromDate: string; // YYYY-MM-DD (Oslo)
  toDate: string;   // YYYY-MM-DD (Oslo)
}

function osloDateParts(date: Date): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [y, m, d] = fmt.format(date).split("-").map(Number);
  return { y, m, d };
}

function formatYmd(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Convert YYYY-MM-DD in Europe/Oslo midnight to UTC ISO string. */
function osloMidnightUtc(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  // Probe offset at noon UTC on that date (handles CET +01:00 vs CEST +02:00 cleanly)
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const osloStr = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Oslo",
    timeZoneName: "shortOffset",
  }).format(noonUtc);
  const match = osloStr.match(/GMT([+-]\d+)(?::(\d+))?/);
  const offsetMin = match
    ? Number(match[1]) * 60 + (match[2] ? Math.sign(Number(match[1])) * Number(match[2]) : 0)
    : 60;
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - offsetMin * 60_000);
}

export function resolveDateRange(
  presetRaw?: string | null,
  fromRaw?: string | null,
  toRaw?: string | null
): ResolvedDateRange {
  const now = new Date();
  const todayParts = osloDateParts(now);
  const todayYmd = formatYmd(todayParts.y, todayParts.m, todayParts.d);

  const isYmd = (s: string | null | undefined): s is string =>
    Boolean(s && /^\d{4}-\d{2}-\d{2}$/.test(s));

  if (presetRaw === "custom" && isYmd(fromRaw) && isYmd(toRaw) && fromRaw <= toRaw) {
    const fromUtc = osloMidnightUtc(fromRaw);
    const toEndDay = new Date(osloMidnightUtc(toRaw).getTime() + 86_400_000);
    return {
      preset: "custom",
      from: fromUtc.toISOString(),
      to: toEndDay.toISOString(),
      fromDate: fromRaw,
      toDate: toRaw,
    };
  }

  const preset: DatePreset =
    presetRaw === "today" || presetRaw === "7d" || presetRaw === "30d" || presetRaw === "90d"
      ? presetRaw
      : "30d";

  const daysBack = preset === "today" ? 0 : preset === "7d" ? 6 : preset === "30d" ? 29 : 89;
  const startRef = new Date(Date.UTC(todayParts.y, todayParts.m - 1, todayParts.d) - daysBack * 86_400_000);
  const fromYmd = formatYmd(startRef.getUTCFullYear(), startRef.getUTCMonth() + 1, startRef.getUTCDate());
  const fromUtc = osloMidnightUtc(fromYmd);
  const toUtc = new Date(osloMidnightUtc(todayYmd).getTime() + 86_400_000);

  return {
    preset,
    from: fromUtc.toISOString(),
    to: toUtc.toISOString(),
    fromDate: fromYmd,
    toDate: todayYmd,
  };
}

export function formatDuration(ms: number): string {
  const sec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function formatPct(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

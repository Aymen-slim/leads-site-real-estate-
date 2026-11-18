// Shared A/B + routing logic. Edge-safe (used by middleware, API routes and server components).

export type Variant = "A" | "B";
export type ExperimentId = "landing" | "funnel";
export type RouteDestination = "split" | "A" | "B";

export interface VariantConfig {
  key: Variant;
  label: string;
  weight: number;
  enabled: boolean;
}

export interface ExperimentConfig {
  id: ExperimentId;
  name: string;
  status: "running" | "winner";
  winner: Variant | null;
  version: number;
  started_at: string;
  variants: VariantConfig[];
}

export interface RouteRule {
  source: string;
  label: string | null;
  destination: RouteDestination;
}

export interface SiteConfig {
  experiments: Record<ExperimentId, ExperimentConfig>;
  routes: Record<string, RouteDestination>;
}

export const AB_COOKIE = "kr_ab";
export const PREVIEW_COOKIE = "kr_preview";
export const AB_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days
export const FUNNEL_PATHS = ["/connect-agency", "/sell"];
export const FALLBACK_SOURCE = "*";
export const NAV_SOURCE = "nav";

export const KNOWN_SOURCES: { source: string; group: string; label: string }[] = [
  { source: "*", group: "System", label: "Fallback (unknown / no source)" },
  { source: "nav", group: "Navigation", label: "Menu / navigation links" },
  { source: "hero-a", group: "Home", label: "Home A — hero button" },
  { source: "landing-b", group: "Home", label: "Home B — hero button" },
  { source: "growth-calc", group: "Home", label: "Home — price growth calculator" },
  { source: "land-value", group: "Home", label: "Home — land value section" },
  { source: "sell-as-is", group: "Home", label: "Home — sell as-is section" },
  { source: "sample-ads", group: "Home", label: "Home — sample ads header CTA" },
  { source: "tools-hub", group: "Calculators", label: "Tools overview page CTA" },
  { source: "ad-villa", group: "Sample Ads", label: "Sample ad — villa" },
  { source: "ad-land", group: "Sample Ads", label: "Sample ad — land plot" },
  { source: "ad-family", group: "Sample Ads", label: "Sample ad — family house" },
  { source: "price-m2", group: "Calculators", label: "Tool 1 — price per m²" },
  { source: "net-cash", group: "Calculators", label: "Tool 2 — net cash in pocket" },
  { source: "land", group: "Calculators", label: "Tool 3 — land buildability" },
  { source: "inheritance", group: "Calculators", label: "Tool 4 — inherited property" },
  { source: "as-is", group: "Calculators", label: "Tool 5 — sell as-is vs fix" },
];

export const KNOWN_PAGES: { path: string; title: string }[] = [
  { path: "/", title: "Home (Landing Page)" },
  { path: "/tools", title: "Free Seller Tools Hub" },
  { path: "/tools/price-per-m2", title: "Tool 1: Price per m²" },
  { path: "/tools/net-cash", title: "Tool 2: Net Cash in Pocket" },
  { path: "/tools/land-buildability", title: "Tool 3: Land Buildability" },
  { path: "/tools/inherited-property", title: "Tool 4: Inherited Property" },
  { path: "/tools/sell-as-is", title: "Tool 5: Sell As-Is vs. Fix" },
  { path: "/connect-agency", title: "Connect Agency (Seller Funnel)" },
  { path: "/sell", title: "Sell (Seller Funnel Alias)" },
  { path: "/privacy-policy", title: "Privacy Policy" },
];

export const DEFAULT_CONFIG: SiteConfig = {
  experiments: {
    landing: {
      id: "landing",
      name: "Landing page",
      status: "running",
      winner: null,
      version: 1,
      started_at: new Date(0).toISOString(),
      variants: [
        { key: "A", label: "A", weight: 50, enabled: true },
        { key: "B", label: "B", weight: 50, enabled: true },
      ],
    },
    funnel: {
      id: "funnel",
      name: "Seller form",
      status: "running",
      winner: null,
      version: 1,
      started_at: new Date(0).toISOString(),
      variants: [
        { key: "A", label: "A", weight: 50, enabled: true },
        { key: "B", label: "B", weight: 50, enabled: true },
      ],
    },
  },
  routes: { [FALLBACK_SOURCE]: "split" },
};

export function isVariant(v: unknown): v is Variant {
  return v === "A" || v === "B";
}

/** Weighted random pick among enabled variants with weight > 0. */
export function pickWeighted(variants: VariantConfig[], rand: number = Math.random()): Variant {
  const pool = variants.filter((v) => v.enabled && v.weight > 0);
  if (pool.length === 0) {
    return variants.find((v) => v.enabled)?.key ?? "A";
  }
  const total = pool.reduce((sum, v) => sum + v.weight, 0);
  let cursor = rand * total;
  for (const v of pool) {
    cursor -= v.weight;
    if (cursor < 0) return v.key;
  }
  return pool[pool.length - 1].key;
}

export interface Assignment {
  v: Variant;
  ver: number;
}

/**
 * Decide which variant a visitor sees.
 * - Experiment has a winner      -> everyone gets the winner.
 * - Valid sticky assignment      -> keep it (same version + variant still enabled).
 * - Otherwise                    -> new weighted pick.
 */
export function resolveAssignment(
  exp: ExperimentConfig,
  current: Assignment | undefined
): { assignment: Assignment; changed: boolean } {
  if (exp.status === "winner" && exp.winner) {
    const assignment = { v: exp.winner, ver: exp.version };
    const changed = !current || current.v !== assignment.v || current.ver !== assignment.ver;
    return { assignment, changed };
  }
  if (
    current &&
    current.ver === exp.version &&
    exp.variants.some((v) => v.key === current.v && v.enabled)
  ) {
    return { assignment: current, changed: false };
  }
  return { assignment: { v: pickWeighted(exp.variants), ver: exp.version }, changed: true };
}

/** Cookie format: "landing:A:1|funnel:B:3" */
export function parseAbCookie(value: string | undefined): Partial<Record<ExperimentId, Assignment>> {
  const out: Partial<Record<ExperimentId, Assignment>> = {};
  if (!value) return out;
  for (const part of value.split("|")) {
    const [id, v, ver] = part.split(":");
    if ((id === "landing" || id === "funnel") && isVariant(v)) {
      const n = Number(ver);
      if (Number.isInteger(n) && n > 0) out[id] = { v, ver: n };
    }
  }
  return out;
}

export function serializeAbCookie(a: Record<ExperimentId, Assignment>): string {
  return `landing:${a.landing.v}:${a.landing.ver}|funnel:${a.funnel.v}:${a.funnel.ver}`;
}

export function parsePreviewCookie(
  value: string | undefined
): Partial<Record<ExperimentId, Variant>> {
  const out: Partial<Record<ExperimentId, Variant>> = {};
  if (!value) return out;
  for (const part of value.split("|")) {
    const [id, v] = part.split(":");
    if ((id === "landing" || id === "funnel") && isVariant(v)) out[id] = v;
  }
  return out;
}

export function serializePreviewCookie(p: Partial<Record<ExperimentId, Variant>>): string {
  const parts: string[] = [];
  if (p.landing) parts.push(`landing:${p.landing}`);
  if (p.funnel) parts.push(`funnel:${p.funnel}`);
  return parts.join("|");
}

/** Only allow short slug-like sources so junk cannot pollute the routing table. */
export function normalizeSource(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{0,39}$/.test(s) ? s : null;
}

/**
 * Which form a funnel visit shows, based on the CTA source.
 * Forced routes (A/B) are flagged `routed` and excluded from experiment stats.
 */
export function resolveFormVariant(
  config: SiteConfig,
  rawSource: string | null | undefined,
  assignedFunnel: Variant
): { variant: Variant; routed: boolean; source: string } {
  const source = normalizeSource(rawSource) ?? NAV_SOURCE;
  const rule = config.routes[source] ?? config.routes[FALLBACK_SOURCE] ?? "split";
  if (rule === "A" || rule === "B") {
    return { variant: rule, routed: true, source };
  }
  return { variant: assignedFunnel, routed: false, source };
}

// Shared A/B/M + routing logic. Edge-safe (used by middleware, API routes and server components).

export type LandingVariant = "A" | "B" | "M";
export type FunnelVariant = "A" | "B";
export type Variant = LandingVariant;
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
export const FUNNEL_PATHS = ["/koble-til-megler", "/selg", "/connect-agency", "/sell"];
export const FALLBACK_SOURCE = "*";
export const NAV_SOURCE = "nav";

export const VARIANT_META: Record<
  ExperimentId,
  Record<string, { short: string; name: string; desc: string; color: string }>
> = {
  landing: {
    A: {
      short: "Classic A",
      name: "Classic A — Krogsveen Split Hero",
      desc: "Editorial two-image split hero with House Value Growth Calculator & classic Krogsveen layout.",
      color: "#1B4332",
    },
    B: {
      short: "Classic B",
      name: "Classic B — Krogsveen Sage Direct",
      desc: "Botanical sage full-bleed hero with single agency CTA & classic Krogsveen layout.",
      color: "#C9963B",
    },
    M: {
      short: "Modern",
      name: "Modern — VurderBoligen Full Site (Home A)",
      desc: "Modern VurderBoligen architecture: frosted pill navbar, interactive charts, rounded cards (Home A only).",
      color: "#147A53",
    },
  },
  funnel: {
    A: {
      short: "Funnel A",
      name: "Funnel A — 5-Step Tap Cards",
      desc: "Zero-typing oversized tap cards with auto-advance and 1-tap GPS location.",
      color: "#1B4332",
    },
    B: {
      short: "Funnel B",
      name: "Funnel B — 1-Page Typed Form",
      desc: "All 4 seller questions on a single page with zone buyer demand banner.",
      color: "#147A53",
    },
  },
};

export const KNOWN_SOURCES: { source: string; group: string; label: string }[] = [
  { source: "*", group: "System", label: "Fallback (unknown / no source)" },
  { source: "nav", group: "Navigation", label: "Menu / navigation links" },
  { source: "hero-a", group: "Home", label: "Home A / Modern — hero button" },
  { source: "landing-b", group: "Home", label: "Home B — hero button" },
  { source: "growth-calc", group: "Home", label: "Home — price growth calculator" },
  { source: "recipe-banner", group: "Home", label: "Modern home — fjord recipe banner CTA" },
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
  { source: "tax-calc", group: "Calculators", label: "Tool 6 — capital gains & residency tax" },
  { source: "partner-buyout", group: "Calculators", label: "Tool 7 — partner buyout & split" },
  { source: "broker-fee", group: "Calculators", label: "Tool 8 — broker fee & DIY vs agency" },
  { source: "bridge-loan", group: "Calculators", label: "Tool 9 — bridge loan (mellomfinansiering)" },
  { source: "rent-or-sell", group: "Calculators", label: "Tool 10 — rent out vs sell" },
  { source: "property-tax", group: "Calculators", label: "Tool 11 — municipal property tax" },
  { source: "document-fee", group: "Calculators", label: "Tool 12 — 2.5% document fee & costs" },
  { source: "cabin-cost", group: "Calculators", label: "Tool 13 — cabin annual cost & sale" },
  { source: "energy-rating", group: "Calculators", label: "Tool 14 — energy rating (A–G)" },
  { source: "ground-lease", group: "Calculators", label: "Tool 15 — ground lease (tomtefeste)" },
  { source: "sun-conditions", group: "Calculators", label: "Tool 16 — sun conditions (solforhold)" },
];

export const KNOWN_PAGES: { path: string; title: string }[] = [
  { path: "/", title: "Home (Landing Page)" },
  { path: "/verktoy", title: "Free Seller Tools Hub" },
  { path: "/verktoy/pris-per-m2", title: "Tool 1: Price per m²" },
  { path: "/verktoy/netto-utbetalt", title: "Tool 2: Net Cash in Pocket" },
  { path: "/verktoy/tomtedeling", title: "Tool 3: Land Buildability" },
  { path: "/verktoy/arvet-bolig", title: "Tool 4: Inherited Property" },
  { path: "/verktoy/selge-som-den-er", title: "Tool 5: Sell As-Is vs. Fix" },
  { path: "/verktoy/gevinstskatt", title: "Tool 6: Capital Gains & Residency Tax" },
  { path: "/verktoy/kjope-ut-samboer", title: "Tool 7: Partner Buyout Calculator" },
  { path: "/verktoy/meglerkostnad", title: "Tool 8: Broker Fee & DIY vs. Agency" },
  { path: "/verktoy/mellomfinansiering", title: "Tool 9: Bridge Loan (Mellomfinansiering)" },
  { path: "/verktoy/leie-ut-eller-selge", title: "Tool 10: Rent Out vs. Sell" },
  { path: "/verktoy/eiendomsskatt", title: "Tool 11: Municipal Property Tax" },
  { path: "/verktoy/dokumentavgift", title: "Tool 12: Document Fee (2.5%)" },
  { path: "/verktoy/hyttekostnad", title: "Tool 13: Cabin Cost & Sale" },
  { path: "/verktoy/energimerking", title: "Tool 14: Energy Rating (A–G)" },
  { path: "/verktoy/tomtefeste", title: "Tool 15: Ground Lease (Tomtefeste)" },
  { path: "/verktoy/solforhold", title: "Tool 16: Sun Conditions (Solforhold)" },
  { path: "/koble-til-megler", title: "Connect Agency (Seller Funnel)" },
  { path: "/selg", title: "Sell (Seller Funnel Alias)" },
  { path: "/personvern", title: "Privacy Policy" },
];

export const DEFAULT_CONFIG: SiteConfig = {
  experiments: {
    landing: {
      id: "landing",
      name: "Site Experience & Landing Page",
      status: "running",
      winner: null,
      version: 1,
      started_at: new Date(0).toISOString(),
      variants: [
        { key: "A", label: "A - Classic split photo hero + calculator", weight: 33, enabled: true },
        { key: "B", label: "B - Classic sage hero, single CTA", weight: 33, enabled: true },
        { key: "M", label: "M - Modern VurderBoligen site (Home A)", weight: 34, enabled: true },
      ],
    },
    funnel: {
      id: "funnel",
      name: "Seller Form",
      status: "running",
      winner: null,
      version: 1,
      started_at: new Date(0).toISOString(),
      variants: [
        { key: "A", label: "A - Tap cards, 5 steps", weight: 50, enabled: true },
        { key: "B", label: "B - Single page typed form", weight: 50, enabled: true },
      ],
    },
  },
  routes: { [FALLBACK_SOURCE]: "split" },
};

export function isLandingVariant(v: unknown): v is LandingVariant {
  return v === "A" || v === "B" || v === "M";
}

export function isFunnelVariant(v: unknown): v is FunnelVariant {
  return v === "A" || v === "B";
}

export function isVariant(v: unknown): v is Variant {
  return isLandingVariant(v);
}

export function isVariantForExperiment(expId: ExperimentId, v: unknown): v is Variant {
  return expId === "landing" ? isLandingVariant(v) : isFunnelVariant(v);
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

/** Cookie format: "landing:M:1|funnel:B:3" */
export function parseAbCookie(value: string | undefined): Partial<Record<ExperimentId, Assignment>> {
  const out: Partial<Record<ExperimentId, Assignment>> = {};
  if (!value) return out;
  for (const part of value.split("|")) {
    const [id, v, ver] = part.split(":");
    if ((id === "landing" || id === "funnel") && isVariantForExperiment(id, v)) {
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
    if ((id === "landing" || id === "funnel") && isVariantForExperiment(id, v)) out[id] = v;
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
  assignedFunnel: FunnelVariant
): { variant: FunnelVariant; routed: boolean; source: string } {
  const source = normalizeSource(rawSource) ?? NAV_SOURCE;
  const rule = config.routes[source] ?? config.routes[FALLBACK_SOURCE] ?? "split";
  if (rule === "A" || rule === "B") {
    return { variant: rule, routed: true, source };
  }
  return { variant: assignedFunnel, routed: false, source };
}

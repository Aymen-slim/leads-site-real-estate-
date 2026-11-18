import { normalizeSource } from "@/lib/ab";
import { resolveDateRange } from "@/lib/stats";

export type LeadStatus = "new" | "contacted" | "won" | "lost";

export interface LeadRow {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  property_type: string | null;
  size: string | null;
  city: string | null;
  area: string | null;
  timeline: string | null;
  property_text: string | null;
  location_text: string | null;
  source: string | null;
  landing_page: string | null;
  landing_variant: string | null;
  form_variant: string | null;
  routed: boolean;
  session_id: string | null;
  visitor_id: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  lang: string | null;
  details: Record<string, unknown>;
  status: LeadStatus;
  notes: string | null;
}

export interface LeadFilterParams {
  sources: string[];
  landingPage: string;
  formVariant: string;
  landingVariant: string;
  routed: string;
  propertyType: string;
  city: string;
  utmSource: string;
  status: string;
  q: string;
  range: string;
  from: string;
  to: string;
}

export function parseLeadFilters(sp: URLSearchParams): LeadFilterParams {
  const rawSources = sp.getAll("source").flatMap((s) => s.split(","));
  const sources = Array.from(
    new Set(rawSources.map((s) => normalizeSource(s)).filter((s): s is string => Boolean(s)))
  );
  return {
    sources,
    landingPage: sp.get("landingPage")?.trim() ?? "",
    formVariant: sp.get("formVariant")?.trim() ?? "",
    landingVariant: sp.get("landingVariant")?.trim() ?? "",
    routed: sp.get("routed")?.trim() ?? "",
    propertyType: sp.get("propertyType")?.trim() ?? "",
    city: sp.get("city")?.trim() ?? "",
    utmSource: sp.get("utmSource")?.trim() ?? "",
    status: sp.get("status")?.trim() ?? "",
    q: sp.get("q")?.trim() ?? "",
    range: sp.get("range")?.trim() ?? "30d",
    from: sp.get("from")?.trim() ?? "",
    to: sp.get("to")?.trim() ?? "",
  };
}

/** Build a PostgREST filter string from LeadFilterParams. */
export function buildLeadPostgrestFilter(f: LeadFilterParams): string[] {
  const parts: string[] = [];

  if (f.range !== "all") {
    const { from, to } = resolveDateRange(f.range, f.from, f.to);
    parts.push(`created_at=gte.${encodeURIComponent(from)}`);
    parts.push(`created_at=lt.${encodeURIComponent(to)}`);
  }

  if (f.sources.length === 1) {
    parts.push(`source=eq.${encodeURIComponent(f.sources[0])}`);
  } else if (f.sources.length > 1) {
    parts.push(`source=in.(${f.sources.map(encodeURIComponent).join(",")})`);
  }

  if (f.landingPage) parts.push(`landing_page=eq.${encodeURIComponent(f.landingPage)}`);
  if (f.formVariant === "A" || f.formVariant === "B") parts.push(`form_variant=eq.${f.formVariant}`);
  if (f.landingVariant === "A" || f.landingVariant === "B") {
    parts.push(`landing_variant=eq.${f.landingVariant}`);
  }
  if (f.routed === "true" || f.routed === "false") parts.push(`routed=eq.${f.routed}`);
  if (f.propertyType) parts.push(`property_type=eq.${encodeURIComponent(f.propertyType)}`);
  if (f.city) parts.push(`city=eq.${encodeURIComponent(f.city)}`);
  if (f.utmSource) parts.push(`utm_source=eq.${encodeURIComponent(f.utmSource)}`);
  if (["new", "contacted", "won", "lost"].includes(f.status)) {
    parts.push(`status=eq.${f.status}`);
  }

  if (f.q) {
    const term = f.q.replace(/[(),*]/g, " ").trim().slice(0, 80);
    if (term) {
      const pattern = `*${term}*`;
      parts.push(
        `or=(${[
          `name.ilike.${encodeURIComponent(pattern)}`,
          `phone.ilike.${encodeURIComponent(pattern)}`,
          `city.ilike.${encodeURIComponent(pattern)}`,
          `area.ilike.${encodeURIComponent(pattern)}`,
          `location_text.ilike.${encodeURIComponent(pattern)}`,
        ].join(",")})`
      );
    }
  }

  return parts;
}

/** Escape a CSV cell (RFC 4180 + spreadsheet formula-injection guard). */
function csvCell(raw: unknown): string {
  let s = raw == null ? "" : String(raw);
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function leadsToCsv(leads: LeadRow[]): string {
  const headers = [
    "Created (Oslo)",
    "Status",
    "Name",
    "Phone",
    "Source (Button/CTA)",
    "Landing Page",
    "Landing Variant",
    "Form Shown",
    "Routing Mode",
    "Property Type",
    "Size",
    "City",
    "Area",
    "Timeline",
    "Typed Property (Form B)",
    "Typed Location (Form B)",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Referrer",
    "Language",
    "Calculator Details",
    "Notes",
    "Lead ID",
  ];

  const fmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const rows = leads.map((l) => [
    fmt.format(new Date(l.created_at)),
    l.status,
    l.name,
    l.phone,
    l.source ?? "nav",
    l.landing_page ?? "",
    l.landing_variant ?? "",
    l.form_variant ?? "",
    l.routed ? "Forced rule" : "A/B split",
    l.property_type ?? "",
    l.size ?? "",
    l.city ?? "",
    l.area ?? "",
    l.timeline ?? "",
    l.property_text ?? "",
    l.location_text ?? "",
    l.utm_source ?? "",
    l.utm_medium ?? "",
    l.utm_campaign ?? "",
    l.referrer ?? "",
    l.lang ?? "",
    l.details && Object.keys(l.details).length > 0 ? JSON.stringify(l.details) : "",
    l.notes ?? "",
    l.id,
  ]);

  const lines = [headers, ...rows].map((row) => row.map(csvCell).join(","));
  return `\uFEFF${lines.join("\r\n")}`;
}

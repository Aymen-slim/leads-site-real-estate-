import { NextRequest, NextResponse } from "next/server";
import { FUNNEL_PATHS, isFunnelVariant, isLandingVariant, normalizeSource } from "@/lib/ab";
import { sbInsert, supabaseConfigured } from "@/lib/supabase";

const ALLOWED_TYPES = new Set([
  "page_view",
  "page_time",
  "cta_click",
  "funnel_view",
  "funnel_step",
]);

interface IncomingEvent {
  type?: unknown;
  path?: unknown;
  view_id?: unknown;
  session_id?: unknown;
  visitor_id?: unknown;
  landing_variant?: unknown;
  funnel_variant?: unknown;
  routed?: unknown;
  source?: unknown;
  step?: unknown;
  duration_ms?: unknown;
  referrer?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
}

function cleanStr(v: unknown, max = 160): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

function detectDevice(ua: string | null): "mobile" | "tablet" | "desktop" {
  if (!ua) return "desktop";
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

function hasAnalyticsConsent(req: NextRequest): boolean {
  return req.cookies.get("kr_consent")?.value === "all";
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let raw: unknown;
  try {
    const txt = await req.text();
    if (!txt || txt.length > 32_768) {
      return NextResponse.json({ error: "Invalid payload size" }, { status: 400 });
    }
    raw = JSON.parse(txt);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const list: IncomingEvent[] = Array.isArray((raw as { events?: unknown })?.events)
    ? ((raw as { events: IncomingEvent[] }).events).slice(0, 20)
    : [raw as IncomingEvent];

  const consent = hasAnalyticsConsent(req);
  const device = detectDevice(req.headers.get("user-agent"));
  const rows: Record<string, unknown>[] = [];
  const discoveredSources = new Set<string>();

  for (const ev of list) {
    if (!ev || typeof ev !== "object") continue;
    if (typeof ev.type !== "string" || !ALLOWED_TYPES.has(ev.type)) continue;

    const path = cleanStr(ev.path, 160);
    const sessionId = cleanStr(ev.session_id, 80);
    if (!path || !path.startsWith("/") || path.startsWith("/admin") || !sessionId) continue;

    const source = normalizeSource(typeof ev.source === "string" ? ev.source : null);
    if (
      source &&
      source !== "nav" &&
      (ev.type === "cta_click" || (ev.type === "funnel_view" && FUNNEL_PATHS.includes(path)))
    ) {
      discoveredSources.add(source);
    }

    const durationMs =
      ev.type === "page_time" && typeof ev.duration_ms === "number" && Number.isFinite(ev.duration_ms)
        ? Math.max(0, Math.min(1_800_000, Math.round(ev.duration_ms)))
        : null;

    if (ev.type === "page_time" && (!durationMs || durationMs < 200)) continue;

    rows.push({
      type: ev.type,
      path,
      view_id: cleanStr(ev.view_id, 80),
      session_id: sessionId,
      visitor_id: consent ? cleanStr(ev.visitor_id, 80) : null,
      landing_variant: isLandingVariant(ev.landing_variant) ? ev.landing_variant : null,
      funnel_variant: isFunnelVariant(ev.funnel_variant) ? ev.funnel_variant : null,
      routed: Boolean(ev.routed),
      source,
      step: cleanStr(ev.step, 40),
      duration_ms: durationMs,
      referrer: cleanStr(ev.referrer, 240),
      utm_source: cleanStr(ev.utm_source, 80),
      utm_medium: cleanStr(ev.utm_medium, 80),
      utm_campaign: cleanStr(ev.utm_campaign, 120),
      device,
      consent,
    });
  }

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  try {
    await sbInsert("events", rows);
    if (discoveredSources.size > 0) {
      const ruleRows = Array.from(discoveredSources).map((source) => ({
        source,
        destination: "split",
      }));
      await sbInsert("route_rules", ruleRows, {
        ignoreDuplicates: true,
        onConflict: "source",
      }).catch(() => {});
    }
    return NextResponse.json({ ok: true, count: rows.length });
  } catch (err) {
    console.error("[api/track] insert failed:", err);
    return NextResponse.json({ error: "Tracking store error" }, { status: 500 });
  }
}

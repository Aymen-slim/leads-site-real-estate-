import { NextRequest, NextResponse } from "next/server";
import {
  AB_COOKIE,
  FunnelVariant,
  NAV_SOURCE,
  isFunnelVariant,
  isLandingVariant,
  normalizeSource,
  parseAbCookie,
  resolveFormVariant,
} from "@/lib/ab";
import { getSiteConfig } from "@/lib/config";
import { sbInsert, supabaseConfigured } from "@/lib/supabase";

function cleanStr(v: unknown, max = 200): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = cleanStr(body.name, 160);
  const phone = cleanStr(body.phone, 40);
  const digits = phone ? phone.replace(/\D/g, "") : "";
  if (!name || digits.length < 8) {
    return NextResponse.json(
      { error: "Name and a valid phone number (at least 8 digits) are required." },
      { status: 400 }
    );
  }

  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured yet. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  const config = await getSiteConfig();
  const abCookie = parseAbCookie(req.cookies.get(AB_COOKIE)?.value);

  const landingVariant =
    abCookie.landing?.v ?? (isLandingVariant(body.landingVariant) ? body.landingVariant : "A");
  const cookieFunnel = abCookie.funnel?.v;
  const assignedFunnel: FunnelVariant = isFunnelVariant(cookieFunnel)
    ? cookieFunnel
    : isFunnelVariant(body.formVariant)
    ? body.formVariant
    : "A";

  const resolved = resolveFormVariant(
    config,
    typeof body.source === "string" ? body.source : null,
    assignedFunnel
  );

  // Respect UI-rendered variant if cookie was blocked, otherwise use authoritative server decision.
  const formVariant: FunnelVariant = isFunnelVariant(body.formVariant)
    ? body.formVariant
    : resolved.variant;
  const routed = typeof body.routed === "boolean" ? body.routed : resolved.routed;
  const source = normalizeSource(typeof body.source === "string" ? body.source : null) ?? NAV_SOURCE;
  const consent = req.cookies.get("kr_consent")?.value === "all";

  const detailsObj =
    body.details && typeof body.details === "object" && !Array.isArray(body.details)
      ? body.details
      : {};

  const row = {
    name,
    phone,
    property_type: cleanStr(body.propertyType, 40),
    size: cleanStr(body.size, 60),
    city: cleanStr(body.city, 80),
    area: cleanStr(body.area, 120),
    timeline: cleanStr(body.timeline, 80),
    property_text: cleanStr(body.propertyText, 240),
    location_text: cleanStr(body.locationText, 240),
    source,
    landing_page: cleanStr(body.landingPage, 160),
    landing_variant: landingVariant,
    form_variant: formVariant,
    routed,
    session_id: cleanStr(body.sessionId, 80),
    visitor_id: consent ? cleanStr(body.visitorId, 80) : null,
    referrer: cleanStr(body.referrer, 240),
    utm_source: cleanStr(body.utmSource, 80),
    utm_medium: cleanStr(body.utmMedium, 80),
    utm_campaign: cleanStr(body.utmCampaign, 120),
    lang: body.lang === "no" ? "no" : "en",
    details: detailsObj,
    status: "new",
  };

  try {
    await sbInsert("leads", row);
    if (source !== NAV_SOURCE) {
      await sbInsert(
        "route_rules",
        { source, destination: "split" },
        { ignoreDuplicates: true, onConflict: "source" }
      ).catch(() => {});
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[api/leads] insert failed:", err);
    return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
  }
}

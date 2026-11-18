import { NextRequest, NextResponse } from "next/server";
import { RouteDestination, normalizeSource } from "@/lib/ab";
import { isSameOrigin } from "@/lib/auth";
import { invalidateSiteConfig } from "@/lib/config";
import { resolveDateRange } from "@/lib/stats";
import { sbInsert, sbRpc, sbSelect, sbUpdate, supabaseConfigured } from "@/lib/supabase";

interface RouteRuleDb {
  source: string;
  label: string | null;
  destination: RouteDestination;
  first_seen: string;
  updated_at: string;
}

interface SourceStatRow {
  source: string;
  clicks: number;
  leads: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const { from, to } = resolveDateRange(
    searchParams.get("range"),
    searchParams.get("from"),
    searchParams.get("to")
  );

  if (!supabaseConfigured()) {
    return NextResponse.json({ configured: false, rules: [] });
  }

  try {
    const [rulesRes, statsRows] = await Promise.all([
      sbSelect<RouteRuleDb>(
        "route_rules?select=source,label,destination,first_seen,updated_at&order=source.asc"
      ),
      sbRpc<SourceStatRow[]>("dash_sources", { p_from: from, p_to: to }),
    ]);

    const statMap = new Map<string, SourceStatRow>();
    for (const s of statsRows) statMap.set(s.source, s);

    const merged = rulesRes.rows.map((r) => {
      const st = statMap.get(r.source);
      return {
        ...r,
        clicks: Number(st?.clicks ?? 0),
        leads: Number(st?.leads ?? 0),
      };
    });

    return NextResponse.json({ configured: true, rules: merged });
  } catch (err) {
    console.error("[api/admin/routes] GET failed:", err);
    return NextResponse.json({ error: "Failed to load routing rules" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: { updates?: unknown; source?: unknown; destination?: unknown; label?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const items = Array.isArray(body.updates)
    ? body.updates
    : [{ source: body.source, destination: body.destination, label: body.label }];

  const validDests = new Set<RouteDestination>(["split", "A", "B"]);
  const now = new Date().toISOString();

  try {
    for (const raw of items) {
      if (!raw || typeof raw !== "object") continue;
      const r = raw as { source?: unknown; destination?: unknown; label?: unknown };
      const sourceRaw = typeof r.source === "string" ? r.source.trim() : "";
      const source = sourceRaw === "*" ? "*" : normalizeSource(sourceRaw);
      if (!source || typeof r.destination !== "string" || !validDests.has(r.destination as RouteDestination)) {
        return NextResponse.json({ error: "Invalid route update item" }, { status: 400 });
      }
      const patch: Record<string, unknown> = {
        destination: r.destination,
        updated_at: now,
      };
      if (typeof r.label === "string") {
        patch.label = r.label.trim().slice(0, 120) || null;
      }
      await sbUpdate("route_rules", `source=eq.${encodeURIComponent(source)}`, patch);
    }

    invalidateSiteConfig();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/routes] PATCH failed:", err);
    return NextResponse.json({ error: "Failed to update routes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: { source?: unknown; label?: unknown; destination?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const source = normalizeSource(typeof body.source === "string" ? body.source : null);
  const dest =
    body.destination === "A" || body.destination === "B" || body.destination === "split"
      ? body.destination
      : "split";
  if (!source) {
    return NextResponse.json(
      { error: "Source slug must be 1–40 lowercase letters, numbers or hyphens (e.g. fb-spring)." },
      { status: 400 }
    );
  }
  const label = typeof body.label === "string" ? body.label.trim().slice(0, 120) || null : null;

  try {
    await sbInsert(
      "route_rules",
      { source, label, destination: dest, updated_at: new Date().toISOString() },
      { upsert: true, onConflict: "source" }
    );
    invalidateSiteConfig();
    return NextResponse.json({ ok: true, source }, { status: 201 });
  } catch (err) {
    console.error("[api/admin/routes] POST failed:", err);
    return NextResponse.json({ error: "Failed to add route" }, { status: 500 });
  }
}

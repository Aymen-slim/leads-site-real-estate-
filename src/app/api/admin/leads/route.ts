import { NextRequest, NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/auth";
import {
  LeadRow,
  LeadStatus,
  buildLeadPostgrestFilter,
  parseLeadFilters,
} from "@/lib/leadsQuery";
import { sbRpc, sbSelect, sbUpdate, supabaseConfigured, supabaseErrorResponse } from "@/lib/supabase";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_STATUSES = new Set<LeadStatus>(["new", "contacted", "won", "lost"]);

interface FacetsRpc {
  sources: string[];
  landing_pages: string[];
  cities: string[];
  utm_sources: string[];
}

export async function GET(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      leads: [],
      total: 0,
      page: 1,
      limit: 50,
      facets: { sources: [], landing_pages: [], cities: [], utm_sources: [] },
    });
  }

  const sp = req.nextUrl.searchParams;
  const filters = parseLeadFilters(sp);
  const page = Math.max(1, Number(sp.get("page") ?? "1") || 1);
  const limit = Math.min(200, Math.max(10, Number(sp.get("limit") ?? "50") || 50));
  const offset = (page - 1) * limit;

  const filterParts = buildLeadPostgrestFilter(filters);
  const query = [
    "select=*",
    ...filterParts,
    "order=created_at.desc",
    `limit=${limit}`,
    `offset=${offset}`,
  ].join("&");

  try {
    const [{ rows, count }, facets] = await Promise.all([
      sbSelect<LeadRow>(`leads?${query}`, { count: true }),
      sbRpc<FacetsRpc>("dash_lead_facets"),
    ]);

    return NextResponse.json({
      configured: true,
      leads: rows,
      total: count ?? rows.length,
      page,
      limit,
      facets,
    });
  } catch (err) {
    console.error("[api/admin/leads] GET failed:", err);
    const { status, error } = supabaseErrorResponse(err, "Failed to load leads");
    return NextResponse.json({ error }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: { id?: unknown; status?: unknown; notes?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.id !== "string" || !UUID_RE.test(body.id)) {
    return NextResponse.json({ error: "Invalid lead id" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.status === "string") {
    if (!VALID_STATUSES.has(body.status as LeadStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (typeof body.notes === "string") {
    patch.notes = body.notes.slice(0, 2000);
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    await sbUpdate("leads", `id=eq.${body.id}`, patch);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/leads] PATCH failed:", err);
    const { status, error } = supabaseErrorResponse(err, "Failed to update lead");
    return NextResponse.json({ error }, { status });
  }
}

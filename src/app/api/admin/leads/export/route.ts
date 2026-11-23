import { NextRequest, NextResponse } from "next/server";
import {
  LeadRow,
  buildLeadPostgrestFilter,
  leadsToCsv,
  parseLeadFilters,
} from "@/lib/leadsQuery";
import { sbSelect, supabaseConfigured, supabaseErrorResponse } from "@/lib/supabase";

const PAGE_SIZE = 1000;
const MAX_EXPORT_ROWS = 10_000;

export async function GET(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const filters = parseLeadFilters(req.nextUrl.searchParams);
  const filterParts = buildLeadPostgrestFilter(filters);
  const allRows: LeadRow[] = [];

  try {
    for (let offset = 0; offset < MAX_EXPORT_ROWS; offset += PAGE_SIZE) {
      const query = [
        "select=*",
        ...filterParts,
        "order=created_at.desc",
        `limit=${PAGE_SIZE}`,
        `offset=${offset}`,
      ].join("&");

      const { rows } = await sbSelect<LeadRow>(`leads?${query}`);
      allRows.push(...rows);
      if (rows.length < PAGE_SIZE) break;
    }

    const csv = leadsToCsv(allRows);
    const today = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="krogsveen-leads-${today}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/admin/leads/export] failed:", err);
    const { status, error } = supabaseErrorResponse(err, "Failed to export leads");
    return NextResponse.json({ error }, { status });
  }
}

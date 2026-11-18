import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/config";
import { evaluateExperiment, resolveDateRange } from "@/lib/stats";
import { sbRpc, supabaseConfigured } from "@/lib/supabase";

interface OverviewRpc {
  page_views: number;
  sessions: number;
  visitors: number;
  avg_time_ms: number;
  cta_clicks: number;
  leads: number;
  daily: { day: string; page_views: number; sessions: number; leads: number }[];
  top_sources: { source: string; clicks: number; leads: number }[];
}

interface PageRpc {
  path: string;
  views: number;
  sessions: number;
  visitors: number;
  avg_time_ms: number;
  exits: number;
  cta_clicks: number;
  lead_sessions: number;
  first_touch_leads: number;
}

interface ExpRpc {
  variant: "A" | "B";
  exposures: number;
  conversions: number;
}

interface FunnelRpc {
  variant: "A" | "B";
  step: string;
  sessions: number;
}

function buildExpStats(rows: ExpRpc[]) {
  const a = rows.find((r) => r.variant === "A");
  const b = rows.find((r) => r.variant === "B");
  const expA = Number(a?.exposures ?? 0);
  const convA = Number(a?.conversions ?? 0);
  const expB = Number(b?.exposures ?? 0);
  const convB = Number(b?.conversions ?? 0);
  return {
    A: { exposures: expA, conversions: convA },
    B: { exposures: expB, conversions: convB },
    significance: evaluateExperiment(expA, convA, expB, convB),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateRange = resolveDateRange(
    searchParams.get("range"),
    searchParams.get("from"),
    searchParams.get("to")
  );
  const includeRouted = searchParams.get("includeRouted") !== "false";
  const expWindow = searchParams.get("expWindow") === "range" ? "range" : "round";

  if (!supabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      range: dateRange,
      config: await getSiteConfig(),
      overview: {
        page_views: 0,
        sessions: 0,
        visitors: 0,
        avg_time_ms: 0,
        cta_clicks: 0,
        leads: 0,
        daily: [],
        top_sources: [],
      },
      pages: [],
      experiments: {
        landing: buildExpStats([]),
        funnel: buildExpStats([]),
      },
      funnel: [],
    });
  }

  try {
    const config = await getSiteConfig({ fresh: true });
    const landingFrom =
      expWindow === "round" ? config.experiments.landing.started_at : dateRange.from;
    const funnelFrom =
      expWindow === "round" ? config.experiments.funnel.started_at : dateRange.from;
    const expTo = expWindow === "round" ? new Date().toISOString() : dateRange.to;

    const [overview, pages, landingExp, funnelExp, funnel] = await Promise.all([
      sbRpc<OverviewRpc>("dash_overview", { p_from: dateRange.from, p_to: dateRange.to }),
      sbRpc<PageRpc[]>("dash_pages", { p_from: dateRange.from, p_to: dateRange.to }),
      sbRpc<ExpRpc[]>("dash_experiment", {
        p_exp: "landing",
        p_from: landingFrom,
        p_to: expTo,
      }),
      sbRpc<ExpRpc[]>("dash_experiment", {
        p_exp: "funnel",
        p_from: funnelFrom,
        p_to: expTo,
      }),
      sbRpc<FunnelRpc[]>("dash_funnel", {
        p_from: dateRange.from,
        p_to: dateRange.to,
        p_include_routed: includeRouted,
      }),
    ]);

    return NextResponse.json({
      configured: true,
      range: dateRange,
      expWindow,
      config,
      overview,
      pages,
      experiments: {
        landing: buildExpStats(landingExp),
        funnel: buildExpStats(funnelExp),
      },
      funnel,
    });
  } catch (err) {
    console.error("[api/admin/stats] failed:", err);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/config";
import { ConfidenceStatus, evaluateExperiment, resolveDateRange } from "@/lib/stats";
import { sbRpc, supabaseConfigured, supabaseErrorResponse } from "@/lib/supabase";

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
  variant: string;
  exposures: number;
  conversions: number;
}

interface FunnelRpc {
  variant: "A" | "B";
  step: string;
  sessions: number;
}

export interface VariantStatRow {
  key: string;
  exposures: number;
  conversions: number;
  rate: number;
  liftVsBaseline: number | null;
  confidenceVsBaseline: number;
  statusVsBaseline: ConfidenceStatus | "baseline";
}

function buildExpStats(rows: ExpRpc[], keys: string[]) {
  const byKey = new Map<string, { exposures: number; conversions: number }>();
  for (const k of keys) {
    const found = rows.find((r) => r.variant === k);
    byKey.set(k, {
      exposures: Number(found?.exposures ?? 0),
      conversions: Number(found?.conversions ?? 0),
    });
  }

  const base = byKey.get("A") ?? { exposures: 0, conversions: 0 };
  const baseRate = base.exposures > 0 ? base.conversions / base.exposures : 0;

  const variants: VariantStatRow[] = keys.map((k) => {
    const cur = byKey.get(k) ?? { exposures: 0, conversions: 0 };
    const rate = cur.exposures > 0 ? cur.conversions / cur.exposures : 0;
    if (k === "A") {
      return {
        key: k,
        exposures: cur.exposures,
        conversions: cur.conversions,
        rate,
        liftVsBaseline: null,
        confidenceVsBaseline: 0,
        statusVsBaseline: "baseline",
      };
    }
    const sig = evaluateExperiment(base.exposures, base.conversions, cur.exposures, cur.conversions);
    return {
      key: k,
      exposures: cur.exposures,
      conversions: cur.conversions,
      rate,
      liftVsBaseline: sig.relativeLiftPct,
      confidenceVsBaseline: sig.confidencePct,
      statusVsBaseline: sig.status,
    };
  });

  // Determine overall leader & top vs runner-up significance
  const sorted = [...variants].sort((a, b) => b.rate - a.rate || b.conversions - a.conversions);
  const top = sorted[0];
  const runnerUp = sorted[1];
  const topTest =
    top && runnerUp
      ? evaluateExperiment(runnerUp.exposures, runnerUp.conversions, top.exposures, top.conversions)
      : evaluateExperiment(0, 0, 0, 0);

  return {
    variants,
    leader: top && top.exposures > 0 ? top.key : "tie",
    confidencePct: topTest.confidencePct,
    status: topTest.status,
    baseRate,
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
      expWindow,
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
        landing: buildExpStats([], ["A", "B", "M"]),
        funnel: buildExpStats([], ["A", "B"]),
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
        landing: buildExpStats(landingExp, ["A", "B", "M"]),
        funnel: buildExpStats(funnelExp, ["A", "B"]),
      },
      funnel,
    });
  } catch (err) {
    console.error("[api/admin/stats] failed:", err);
    const { status, error } = supabaseErrorResponse(err, "Failed to load analytics");
    return NextResponse.json({ error }, { status });
  }
}

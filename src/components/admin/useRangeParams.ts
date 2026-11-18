"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/ab";
import type { ExperimentSignificance, ResolvedDateRange } from "@/lib/stats";

export interface ExpSideStats {
  exposures: number;
  conversions: number;
}

export interface ExpStatsBundle {
  A: ExpSideStats;
  B: ExpSideStats;
  significance: ExperimentSignificance;
}

export interface StatsResponse {
  configured: boolean;
  range: ResolvedDateRange;
  expWindow: "round" | "range";
  config: SiteConfig;
  overview: {
    page_views: number;
    sessions: number;
    visitors: number;
    avg_time_ms: number;
    cta_clicks: number;
    leads: number;
    daily: { day: string; page_views: number; sessions: number; leads: number }[];
    top_sources: { source: string; clicks: number; leads: number }[];
  };
  pages: {
    path: string;
    views: number;
    sessions: number;
    visitors: number;
    avg_time_ms: number;
    exits: number;
    cta_clicks: number;
    lead_sessions: number;
    first_touch_leads: number;
  }[];
  experiments: {
    landing: ExpStatsBundle;
    funnel: ExpStatsBundle;
  };
  funnel: {
    variant: "A" | "B";
    step: string;
    sessions: number;
  }[];
}

export function useRangeQueryString() {
  const sp = useSearchParams();
  const range = sp.get("range") || "30d";
  const from = sp.get("from") || "";
  const to = sp.get("to") || "";

  const p = new URLSearchParams();
  p.set("range", range);
  if (range === "custom" && from && to) {
    p.set("from", from);
    p.set("to", to);
  }
  return p.toString();
}

export function useAdminStats(extraParams: Record<string, string> = {}) {
  const rangeQs = useRangeQueryString();
  const extraQs = new URLSearchParams(extraParams).toString();
  const fullQs = extraQs ? `${rangeQs}&${extraQs}` : rangeQs;

  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/stats?${fullQs}`, { cache: "no-store" });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `Error ${res.status}`);
      }
      setData((await res.json()) as StatsResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [fullQs]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload, rangeQs };
}

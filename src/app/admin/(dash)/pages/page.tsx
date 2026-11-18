"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useAdminStats } from "@/components/admin/useRangeParams";
import { KNOWN_PAGES } from "@/lib/ab";
import { formatDuration, formatPct } from "@/lib/stats";
import { RefreshIcon } from "@/components/AdminIcons";

type SortKey =
  | "views"
  | "sessions"
  | "avg_time_ms"
  | "exit_rate"
  | "cta_clicks"
  | "lead_sessions"
  | "cr";

function PagesInner() {
  const { data, loading, error, reload, rangeQs } = useAdminStats();
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDesc, setSortDesc] = useState(true);

  const pageTitleMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of KNOWN_PAGES) m.set(p.path, p.title);
    return m;
  }, []);

  const rows = useMemo(() => {
    const raw = data?.pages ?? [];
    // Include known pages even if they have 0 views so admin sees the whole site map.
    const byPath = new Map(raw.map((r) => [r.path, r]));
    const merged = [...raw];
    for (const kp of KNOWN_PAGES) {
      if (!byPath.has(kp.path)) {
        merged.push({
          path: kp.path,
          views: 0,
          sessions: 0,
          visitors: 0,
          avg_time_ms: 0,
          exits: 0,
          cta_clicks: 0,
          lead_sessions: 0,
          first_touch_leads: 0,
        });
      }
    }

    const enriched = merged.map((r) => {
      const views = Number(r.views || 0);
      const sessions = Number(r.sessions || 0);
      const exits = Number(r.exits || 0);
      const leadSessions = Number(r.lead_sessions || 0);
      return {
        ...r,
        views,
        sessions,
        visitors: Number(r.visitors || 0),
        avg_time_ms: Number(r.avg_time_ms || 0),
        exits,
        cta_clicks: Number(r.cta_clicks || 0),
        lead_sessions: leadSessions,
        first_touch_leads: Number(r.first_touch_leads || 0),
        exit_rate: views > 0 ? exits / views : 0,
        cr: sessions > 0 ? leadSessions / sessions : 0,
      };
    });

    enriched.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDesc ? -diff : diff;
    });

    return enriched;
  }, [data?.pages, sortKey, sortDesc]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDesc((d) => !d);
    else {
      setSortKey(k);
      setSortDesc(true);
    }
  };

  const sortHeader = (label: string, k: SortKey) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 font-medium hover:text-[#000000] cursor-pointer"
    >
      <span>{label}</span>
      {sortKey === k && <span className="text-[#5D726A]">{sortDesc ? "↓" : "↑"}</span>}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[32px] leading-tight text-[#000000]">
            Pages Performance
          </h1>
          <p className="text-[15px] text-[#5A5954]">
            Views, active time spent, CTA clicks, and conversions for every page on the site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void reload()}
          disabled={loading}
          className="min-h-[40px] px-3.5 py-2 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#EDF0E7] text-[14px] font-medium inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshIcon className="w-4 h-4" />
          <span>{loading ? "Loading..." : "Refresh"}</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[hsl(6deg_100%_97%)] border border-[#BA5B3E] text-[#BA5B3E] text-[15px]">
          {error}
        </div>
      )}

      <div className="bg-[#FFFFFF] border border-[#DFDFDF] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="bg-[#EDF0E7] border-b border-[#DCE2CF] text-[#292823]">
              <th className="py-3 px-4 font-medium">Page</th>
              <th className="py-3 px-3 text-right">{sortHeader("Views", "views")}</th>
              <th className="py-3 px-3 text-right">{sortHeader("Sessions", "sessions")}</th>
              <th className="py-3 px-3 text-right">{sortHeader("Avg Time", "avg_time_ms")}</th>
              <th className="py-3 px-3 text-right">{sortHeader("Exit %", "exit_rate")}</th>
              <th className="py-3 px-3 text-right">{sortHeader("CTA Clicks", "cta_clicks")}</th>
              <th className="py-3 px-3 text-right">1st-Touch Leads</th>
              <th className="py-3 px-3 text-right">{sortHeader("Session Leads", "lead_sessions")}</th>
              <th className="py-3 px-4 text-right">{sortHeader("Conv. Rate", "cr")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.path} className="border-b border-[#EDF0E7] hover:bg-[#F7F7F7]">
                <td className="py-3 px-4">
                  <span className="block font-medium text-[#000000]">
                    {pageTitleMap.get(r.path) || r.path}
                  </span>
                  <span className="block text-[12px] font-mono text-[#5A5954]">{r.path}</span>
                </td>
                <td className="py-3 px-3 text-right tabular-nums">{r.views}</td>
                <td className="py-3 px-3 text-right tabular-nums">{r.sessions}</td>
                <td className="py-3 px-3 text-right tabular-nums font-medium">
                  {formatDuration(r.avg_time_ms)}
                </td>
                <td className="py-3 px-3 text-right tabular-nums">
                  {r.views > 0 ? formatPct(r.exit_rate, 0) : "—"}
                </td>
                <td className="py-3 px-3 text-right tabular-nums">{r.cta_clicks}</td>
                <td className="py-3 px-3 text-right tabular-nums">
                  {r.first_touch_leads > 0 ? (
                    <Link
                      href={`/admin/leads?${rangeQs}&landingPage=${encodeURIComponent(r.path)}`}
                      className="underline decoration-[#5D726A] font-medium"
                    >
                      {r.first_touch_leads}
                    </Link>
                  ) : (
                    0
                  )}
                </td>
                <td className="py-3 px-3 text-right tabular-nums font-semibold">
                  {r.lead_sessions}
                </td>
                <td className="py-3 px-4 text-right tabular-nums font-semibold text-[#5D726A]">
                  {r.sessions > 0 ? formatPct(r.cr, 1) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[13px] text-[#5A5954]">
        <strong>Avg Time</strong> counts active time while the browser tab is visible and the visitor interacted within the last 30 seconds.{" "}
        <strong>Session Leads / Conv. Rate</strong> measures sessions that viewed the page and submitted the form;{" "}
        <strong>1st-Touch Leads</strong> counts leads whose very first landing page in that session was that route.
      </p>
    </div>
  );
}

export default function AdminPagesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#5D726A]">Loading page analytics...</div>}>
      <PagesInner />
    </Suspense>
  );
}

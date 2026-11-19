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
      className="inline-flex items-center gap-1 font-semibold hover:text-[#0F291E] cursor-pointer"
    >
      <span>{label}</span>
      {sortKey === k && <span className="text-[#147A53]">{sortDesc ? "↓" : "↑"}</span>}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#0F291E]">
            Pages Performance
          </h1>
          <p className="text-[14px] text-[#5B7065] mt-0.5">
            Views, active time spent, CTA clicks, and conversions for every route on your site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void reload()}
          disabled={loading}
          className="h-9 px-3.5 rounded-full bg-[#FFFFFF] border border-[#D8E2DC] hover:bg-[#EAF4EF] text-[#0F291E] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshIcon className={`w-3.5 h-3.5 text-[#147A53] ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Loading..." : "Refresh"}</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-2xl bg-[#FEF2F0] border border-[#F0C2B9] text-[#B8422C] text-[14px]">
          {error}
        </div>
      )}

      <div className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#F7FAF8] border-b border-[#E6ECE8] text-[#5B7065] text-[12px] uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Page</th>
                <th className="py-3.5 px-3 text-right">{sortHeader("Views", "views")}</th>
                <th className="py-3.5 px-3 text-right">{sortHeader("Sessions", "sessions")}</th>
                <th className="py-3.5 px-3 text-right">{sortHeader("Avg Time", "avg_time_ms")}</th>
                <th className="py-3.5 px-3 text-right">{sortHeader("Exit %", "exit_rate")}</th>
                <th className="py-3.5 px-3 text-right">{sortHeader("CTA Clicks", "cta_clicks")}</th>
                <th className="py-3.5 px-3 text-right font-semibold">1st-Touch</th>
                <th className="py-3.5 px-3 text-right">{sortHeader("Leads", "lead_sessions")}</th>
                <th className="py-3.5 px-5 text-right">{sortHeader("Conv. Rate", "cr")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.path}
                  className="border-b border-[#F1F5F2] last:border-0 hover:bg-[#F7FAF8] transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <span className="block font-semibold text-[#0F291E]">
                      {pageTitleMap.get(r.path) || r.path}
                    </span>
                    <span className="block text-[12px] font-mono text-[#6E8278]">{r.path}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums text-[#14201A] font-medium">
                    {r.views}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums text-[#4B5F55]">
                    {r.sessions}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums font-semibold text-[#0F291E]">
                    {formatDuration(r.avg_time_ms)}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums text-[#5B7065]">
                    {r.views > 0 ? formatPct(r.exit_rate, 0) : "—"}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums text-[#4B5F55]">
                    {r.cta_clicks}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums">
                    {r.first_touch_leads > 0 ? (
                      <Link
                        href={`/admin/leads?${rangeQs}&landingPage=${encodeURIComponent(r.path)}`}
                        className="text-[#147A53] underline font-semibold"
                      >
                        {r.first_touch_leads}
                      </Link>
                    ) : (
                      <span className="text-[#8DA096]">0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums font-semibold text-[#0F291E]">
                    {r.lead_sessions}
                  </td>
                  <td className="py-3.5 px-5 text-right tabular-nums">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                        r.cr > 0
                          ? "bg-[#EAF4EF] text-[#14533C]"
                          : "bg-[#F3F6F4] text-[#7D9186]"
                      }`}
                    >
                      {r.sessions > 0 ? formatPct(r.cr, 1) : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[13px] text-[#5B7065]">
        <strong>Avg Time</strong> counts active time while the tab is visible and the visitor interacted within 30s.{" "}
        <strong>Leads / Conv. Rate</strong> counts sessions that visited the page and submitted a lead.
      </p>
    </div>
  );
}

export default function AdminPagesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#147A53]">Loading page analytics...</div>}>
      <PagesInner />
    </Suspense>
  );
}

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

type PageCategoryFilter = "all" | "tools" | "local" | "core";

function classifyPage(path: string): Exclude<PageCategoryFilter, "all"> {
  if (
    path.startsWith("/boligpris/") ||
    path.startsWith("/verktoy/eiendomsskatt/") ||
    path.startsWith("/tools/property-tax/")
  ) {
    return "local";
  }
  if (
    path === "/verktoy" ||
    path.startsWith("/verktoy/") ||
    path === "/tools" ||
    path.startsWith("/tools/")
  ) {
    return "tools";
  }
  return "core";
}

function formatDynamicTitle(path: string, titleMap: Map<string, string>): string {
  const known = titleMap.get(path);
  if (known) return known;
  if (path.startsWith("/boligpris/")) {
    const segs = path.split("/").filter(Boolean).slice(1);
    return `Local Price SEO: ${segs.map((s) => s.replace(/-/g, " ")).join(" / ")}`;
  }
  if (path.startsWith("/verktoy/eiendomsskatt/")) {
    const muni = path.replace("/verktoy/eiendomsskatt/", "").replace(/-/g, " ");
    return `Property Tax SEO: ${muni}`;
  }
  if (path.startsWith("/tools/property-tax/")) {
    const muni = path.replace("/tools/property-tax/", "").replace(/-/g, " ");
    return `Property Tax SEO: ${muni}`;
  }
  return path;
}

function PagesInner() {
  const { data, loading, error, reload, rangeQs } = useAdminStats();
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDesc, setSortDesc] = useState(true);
  const [category, setCategory] = useState<PageCategoryFilter>("all");

  const pageTitleMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of KNOWN_PAGES) m.set(p.path, p.title);
    return m;
  }, []);

  const allRows = useMemo(() => {
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

    return merged.map((r) => {
      const views = Number(r.views || 0);
      const sessions = Number(r.sessions || 0);
      const exits = Number(r.exits || 0);
      const leadSessions = Number(r.lead_sessions || 0);
      return {
        ...r,
        category: classifyPage(r.path),
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
  }, [data?.pages]);

  const rows = useMemo(() => {
    const filtered =
      category === "all"
        ? allRows
        : allRows.filter((r) => r.category === category);

    const copy = [...filtered];
    copy.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDesc ? -diff : diff;
    });
    return copy;
  }, [allRows, category, sortKey, sortDesc]);

  const totals = useMemo(() => {
    const views = rows.reduce((s, r) => s + r.views, 0);
    const sessions = rows.reduce((s, r) => s + r.sessions, 0);
    const ctaClicks = rows.reduce((s, r) => s + r.cta_clicks, 0);
    const firstTouchLeads = rows.reduce((s, r) => s + r.first_touch_leads, 0);
    const leadSessions = rows.reduce((s, r) => s + r.lead_sessions, 0);
    return { views, sessions, ctaClicks, firstTouchLeads, leadSessions };
  }, [rows]);

  const counts = useMemo(() => {
    return {
      all: allRows.length,
      tools: allRows.filter((r) => r.category === "tools").length,
      local: allRows.filter((r) => r.category === "local").length,
      core: allRows.filter((r) => r.category === "core").length,
    };
  }, [allRows]);

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
            Pages &amp; Tools Visit Tracker
          </h1>
          <p className="text-[14px] text-[#5B7065] mt-0.5">
            Live page views, sessions, active time spent, CTA clicks, and lead conversions for all 16 tools and local SEO pages.
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

      {/* Category filter tabs + quick rollup */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter pages by type"
          className="inline-flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[#EEF2EF] border border-[#DCE5DF]"
        >
          {(
            [
              { id: "all", label: `All Pages (${counts.all})` },
              { id: "tools", label: `Free Tools (${counts.tools})` },
              { id: "local", label: `Local SEO (${counts.local})` },
              { id: "core", label: `Core & Funnels (${counts.core})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors ${
                category === tab.id
                  ? "bg-[#0F291E] text-[#FFFFFF] shadow-2xs"
                  : "text-[#4D6157] hover:text-[#0F291E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#4B5F55] tabular-nums">
          <span>
            Views: <strong className="text-[#0F291E]">{totals.views}</strong>
          </span>
          <span>
            CTA Clicks: <strong className="text-[#0F291E]">{totals.ctaClicks}</strong>
          </span>
          <span>
            1st-Touch Leads: <strong className="text-[#147A53]">{totals.firstTouchLeads}</strong>
          </span>
        </div>
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
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-[#6E8278]">
                    No visits recorded in this category yet. Local SEO pages appear automatically on their first visit.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.path}
                    className="border-b border-[#F1F5F2] last:border-0 hover:bg-[#F7FAF8] transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <span className="block font-semibold text-[#0F291E]">
                        {formatDynamicTitle(r.path, pageTitleMap)}
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
                ))
              )}
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

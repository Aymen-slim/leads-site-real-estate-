"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { DailyChart } from "@/components/admin/DailyChart";
import { useAdminStats } from "@/components/admin/useRangeParams";
import { formatDuration, formatPct } from "@/lib/stats";
import { KNOWN_SOURCES } from "@/lib/ab";
import { ArrowRightIcon } from "@/components/Icons";
import { RefreshIcon } from "@/components/AdminIcons";

function OverviewInner() {
  const { data, loading, error, reload, rangeQs } = useAdminStats();

  const ov = data?.overview;
  const sessions = Number(ov?.sessions ?? 0);
  const leads = Number(ov?.leads ?? 0);
  const overallCr = sessions > 0 ? leads / sessions : 0;

  const sourceLabel = (src: string) =>
    KNOWN_SOURCES.find((s) => s.source === src)?.label ?? src;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[32px] leading-tight text-[#000000]">
            Overview
          </h1>
          <p className="text-[15px] text-[#5A5954]">
            {data?.range
              ? `${data.range.fromDate} to ${data.range.toDate} (Oslo time)`
              : "Traffic, active time, conversions and split status"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          disabled={loading}
          className="min-h-[40px] px-3.5 py-2 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#EDF0E7] text-[14px] font-medium inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshIcon className="w-4 h-4" />
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[hsl(6deg_100%_97%)] border border-[#BA5B3E] text-[#BA5B3E] text-[15px]">
          {error}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <div className="bg-[#FFFFFF] border border-[#DFDFDF] p-4">
          <span className="block text-[13px] font-medium text-[#5A5954]">Page Views</span>
          <span className="block text-[28px] font-semibold text-[#000000] tabular-nums mt-1">
            {Number(ov?.page_views ?? 0).toLocaleString("en-US")}
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DFDFDF] p-4">
          <span className="block text-[13px] font-medium text-[#5A5954]">Sessions</span>
          <span className="block text-[28px] font-semibold text-[#000000] tabular-nums mt-1">
            {sessions.toLocaleString("en-US")}
          </span>
          <span className="block text-[12px] text-[#5A5954] mt-0.5 tabular-nums">
            {Number(ov?.visitors ?? 0).toLocaleString("en-US")} consented visitors
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DFDFDF] p-4">
          <span className="block text-[13px] font-medium text-[#5A5954]">Avg Active Time</span>
          <span className="block text-[28px] font-semibold text-[#000000] tabular-nums mt-1">
            {formatDuration(Number(ov?.avg_time_ms ?? 0))}
          </span>
          <span className="block text-[12px] text-[#5A5954] mt-0.5">Per page view</span>
        </div>

        <div className="bg-[#EDF0E7] border border-[#5D726A] p-4">
          <span className="block text-[13px] font-medium text-[#292823]">Leads (Conversions)</span>
          <span className="block text-[28px] font-semibold text-[#000000] tabular-nums mt-1">
            {leads.toLocaleString("en-US")}
          </span>
          <span className="block text-[12px] text-[#5D726A] mt-0.5 tabular-nums">
            {Number(ov?.cta_clicks ?? 0).toLocaleString("en-US")} CTA clicks
          </span>
        </div>

        <div className="bg-[#DCE2CF] border border-[#5D726A] p-4 col-span-2 md:col-span-1">
          <span className="block text-[13px] font-medium text-[#292823]">Session Conv. Rate</span>
          <span className="block text-[28px] font-semibold text-[#000000] tabular-nums mt-1">
            {formatPct(overallCr, 1)}
          </span>
          <span className="block text-[12px] text-[#292823] mt-0.5">Leads / Sessions</span>
        </div>
      </div>

      {/* Daily Traffic & Leads Chart */}
      <section className="bg-[#FFFFFF] border border-[#DFDFDF] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[19px] font-semibold text-[#000000]">
            Daily Visits &amp; Conversions
          </h2>
          <Link
            href={`/admin/pages?${rangeQs}`}
            className="text-[14px] font-medium text-[#000000] underline decoration-[#5D726A] inline-flex items-center gap-1"
          >
            <span>All pages</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <DailyChart data={ov?.daily ?? []} />
      </section>

      {/* Active Experiments + Top Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5 bg-[#FFFFFF] border border-[#DFDFDF] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[19px] font-semibold text-[#000000]">
              Active Traffic Control
            </h2>
            <Link
              href={`/admin/experiments?${rangeQs}`}
              className="text-[14px] font-medium text-[#000000] underline decoration-[#5D726A]"
            >
              Adjust %
            </Link>
          </div>

          {(["landing", "funnel"] as const).map((expId) => {
            const exp = data?.config.experiments[expId];
            const stats = data?.experiments[expId];
            const vA = exp?.variants.find((v) => v.key === "A");
            const vB = exp?.variants.find((v) => v.key === "B");
            return (
              <div key={expId} className="bg-[#EDF0E7] border border-[#DCE2CF] p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold text-[#000000]">
                    {expId === "landing" ? "Landing Page (/)" : "Seller Form (/connect-agency)"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[12px] font-semibold ${
                      exp?.status === "winner"
                        ? "bg-[#5D726A] text-[#FFFFFF]"
                        : "bg-[#B8C49E] text-[#000000]"
                    }`}
                  >
                    {exp?.status === "winner"
                      ? `Winner: ${exp.winner}`
                      : `Split v${exp?.version ?? 1}`}
                  </span>
                </div>

                {/* Split bar */}
                <div className="h-3 w-full bg-[#DCE2CF] flex overflow-hidden border border-[#BFBFBD]">
                  <div
                    style={{ width: `${vA?.enabled ? vA.weight : 0}%` }}
                    className="bg-[#5D726A] h-full"
                    title={`Variant A: ${vA?.weight ?? 50}%`}
                  />
                  <div
                    style={{ width: `${vB?.enabled ? vB.weight : 0}%` }}
                    className="bg-[#B8C49E] h-full"
                    title={`Variant B: ${vB?.weight ?? 50}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[13px] tabular-nums text-[#292823]">
                  <span>
                    A: <strong>{vA?.enabled ? vA.weight : 0}%</strong> ({stats?.A.conversions ?? 0}/
                    {stats?.A.exposures ?? 0} = {formatPct(stats?.significance.rateA ?? 0)})
                  </span>
                  <span>
                    B: <strong>{vB?.enabled ? vB.weight : 0}%</strong> ({stats?.B.conversions ?? 0}/
                    {stats?.B.exposures ?? 0} = {formatPct(stats?.significance.rateB ?? 0)})
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        <section className="lg:col-span-7 bg-[#FFFFFF] border border-[#DFDFDF] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[19px] font-semibold text-[#000000]">
              Top Conversion Sources
            </h2>
            <div className="flex items-center gap-4 text-[14px]">
              <Link
                href={`/admin/routing?${rangeQs}`}
                className="font-medium text-[#000000] underline decoration-[#5D726A]"
              >
                Route buttons
              </Link>
              <Link
                href={`/admin/leads?${rangeQs}`}
                className="font-medium text-[#000000] underline decoration-[#5D726A]"
              >
                Filter leads
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-[#DFDFDF] text-[#5A5954]">
                  <th className="py-2 pr-3 font-medium">Button / Source</th>
                  <th className="py-2 px-3 font-medium text-right">Clicks</th>
                  <th className="py-2 px-3 font-medium text-right">Leads</th>
                  <th className="py-2 pl-3 font-medium text-right">Click → Lead</th>
                </tr>
              </thead>
              <tbody>
                {(ov?.top_sources ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#5A5954]">
                      No clicks or leads recorded yet for this period.
                    </td>
                  </tr>
                ) : (
                  (ov?.top_sources ?? []).map((s) => {
                    const cr = s.clicks > 0 ? s.leads / s.clicks : 0;
                    return (
                      <tr key={s.source} className="border-b border-[#EDF0E7]">
                        <td className="py-2.5 pr-3">
                          <Link
                            href={`/admin/leads?${rangeQs}&source=${encodeURIComponent(s.source)}`}
                            className="font-medium text-[#000000] hover:underline decoration-[#5D726A]"
                          >
                            {sourceLabel(s.source)}
                          </Link>
                          <span className="block text-[12px] text-[#5A5954] font-mono">
                            {s.source}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">{s.clicks}</td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-semibold">
                          {s.leads}
                        </td>
                        <td className="py-2.5 pl-3 text-right tabular-nums">
                          {s.clicks > 0 ? formatPct(cr, 1) : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#5D726A]">Loading overview...</div>}>
      <OverviewInner />
    </Suspense>
  );
}

"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { DailyChart } from "@/components/admin/DailyChart";
import { useAdminStats } from "@/components/admin/useRangeParams";
import { formatDuration, formatPct } from "@/lib/stats";
import { KNOWN_SOURCES, VARIANT_META } from "@/lib/ab";
import { ArrowRightIcon, TrendingUpIcon } from "@/components/Icons";
import {
  ChartBarIcon,
  ClockIcon,
  RefreshIcon,
  UsersLeadsIcon,
} from "@/components/AdminIcons";

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#0F291E]">
            Overview
          </h1>
          <p className="text-[14px] text-[#5B7065] mt-0.5">
            {data?.range
              ? `${data.range.fromDate} → ${data.range.toDate} (Oslo time)`
              : "Traffic, active time, conversions and live split status"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          disabled={loading}
          className="h-9 px-3.5 rounded-full bg-[#FFFFFF] border border-[#D8E2DC] hover:bg-[#EAF4EF] text-[#0F291E] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
        >
          <RefreshIcon className={`w-3.5 h-3.5 text-[#147A53] ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-2xl bg-[#FEF2F0] border border-[#F0C2B9] text-[#B8422C] text-[14px]">
          {error}
        </div>
      )}

      {/* Modern KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_6px_18px_rgba(15,41,30,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#5B7065]">Page Views</span>
            <span className="w-8 h-8 rounded-xl bg-[#EEF3F0] text-[#147A53] flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4" />
            </span>
          </div>
          <span className="block font-display text-[30px] font-semibold text-[#0F291E] tabular-nums mt-2 leading-none">
            {Number(ov?.page_views ?? 0).toLocaleString("en-US")}
          </span>
          <span className="block text-[12px] text-[#6E8278] mt-1.5">Total loaded pages</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_6px_18px_rgba(15,41,30,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#5B7065]">Sessions</span>
            <span className="w-8 h-8 rounded-xl bg-[#EEF3F0] text-[#147A53] flex items-center justify-center">
              <TrendingUpIcon className="w-4 h-4" />
            </span>
          </div>
          <span className="block font-display text-[30px] font-semibold text-[#0F291E] tabular-nums mt-2 leading-none">
            {sessions.toLocaleString("en-US")}
          </span>
          <span className="block text-[12px] text-[#6E8278] mt-1.5 tabular-nums">
            {Number(ov?.visitors ?? 0).toLocaleString("en-US")} consented visitors
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_6px_18px_rgba(15,41,30,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#5B7065]">Avg Active Time</span>
            <span className="w-8 h-8 rounded-xl bg-[#EEF3F0] text-[#147A53] flex items-center justify-center">
              <ClockIcon className="w-4 h-4" />
            </span>
          </div>
          <span className="block font-display text-[30px] font-semibold text-[#0F291E] tabular-nums mt-2 leading-none">
            {formatDuration(Number(ov?.avg_time_ms ?? 0))}
          </span>
          <span className="block text-[12px] text-[#6E8278] mt-1.5">Active tab focus</span>
        </div>

        <div className="bg-[#EAF4EF] border border-[#C7E2D4] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#14533C]">Leads</span>
            <span className="w-8 h-8 rounded-xl bg-[#FFFFFF] text-[#147A53] flex items-center justify-center">
              <UsersLeadsIcon className="w-4 h-4" />
            </span>
          </div>
          <span className="block font-display text-[30px] font-semibold text-[#0F291E] tabular-nums mt-2 leading-none">
            {leads.toLocaleString("en-US")}
          </span>
          <span className="block text-[12px] text-[#14533C] mt-1.5 tabular-nums">
            {Number(ov?.cta_clicks ?? 0).toLocaleString("en-US")} CTA clicks
          </span>
        </div>

        <div className="bg-[#0F291E] text-[#FFFFFF] rounded-2xl p-5 shadow-md col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#B8D7C8]">Conversion Rate</span>
            <span className="w-2 h-2 rounded-full bg-[#52D19A]" />
          </div>
          <span className="block font-display text-[30px] font-semibold text-[#FFFFFF] tabular-nums mt-2 leading-none">
            {formatPct(overallCr, 1)}
          </span>
          <span className="block text-[12px] text-[#9CC2AF] mt-1.5">Leads / Sessions</span>
        </div>
      </div>

      {/* Daily Traffic & Leads Chart */}
      <section className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)] space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-[19px] font-semibold text-[#0F291E]">
              Daily Visits &amp; Conversions
            </h2>
            <p className="text-[13px] text-[#63786D]">
              Page views against submitted seller leads over time
            </p>
          </div>
          <Link
            href={`/admin/pages?${rangeQs}`}
            className="text-[13px] font-semibold text-[#147A53] hover:text-[#0F291E] inline-flex items-center gap-1 transition-colors"
          >
            <span>All pages</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <DailyChart data={ov?.daily ?? []} />
      </section>

      {/* Active Site & Funnel Traffic Split + Top Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[19px] font-semibold text-[#0F291E]">
              Active Traffic Control
            </h2>
            <Link
              href={`/admin/experiments?${rangeQs}`}
              className="px-3 py-1 rounded-full bg-[#EAF4EF] hover:bg-[#D6EAE0] text-[#0F291E] text-[12px] font-semibold transition-colors"
            >
              Edit splits →
            </Link>
          </div>

          {(["landing", "funnel"] as const).map((expId) => {
            const exp = data?.config.experiments[expId];
            const stats = data?.experiments[expId];
            const meta = VARIANT_META[expId];

            return (
              <div
                key={expId}
                className="rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold text-[#0F291E]">
                    {expId === "landing"
                      ? "Site & Landing Experience"
                      : "Seller Form (/connect-agency)"}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      exp?.status === "winner"
                        ? "bg-[#0F291E] text-[#FFFFFF]"
                        : "bg-[#DDF0E6] text-[#14533C]"
                    }`}
                  >
                    {exp?.status === "winner"
                      ? `Winner: ${meta[exp.winner ?? "A"]?.short ?? exp.winner}`
                      : `Round v${exp?.version ?? 1}`}
                  </span>
                </div>

                {/* Multi-segment rounded split bar */}
                <div className="h-3 w-full bg-[#E3EAE6] rounded-full flex overflow-hidden p-0.5 gap-0.5">
                  {(exp?.variants ?? []).map((v) => {
                    const pct = v.enabled ? v.weight : 0;
                    if (pct <= 0) return null;
                    return (
                      <div
                        key={v.key}
                        style={{
                          width: `${pct}%`,
                          backgroundColor: meta[v.key]?.color ?? "#147A53",
                        }}
                        className="h-full rounded-full transition-all"
                        title={`${meta[v.key]?.short ?? v.key}: ${pct}%`}
                      />
                    );
                  })}
                </div>

                <div className="space-y-1.5 text-[13px] tabular-nums">
                  {(exp?.variants ?? []).map((v) => {
                    const st = stats?.variants.find((r) => r.key === v.key);
                    const pct = v.enabled ? v.weight : 0;
                    return (
                      <div key={v.key} className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 text-[#14201A]">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: meta[v.key]?.color ?? "#147A53" }}
                          />
                          <span className={v.enabled ? "font-medium" : "text-[#83968C] line-through"}>
                            {meta[v.key]?.short ?? v.key}
                          </span>
                          <span className="text-[#5B7065] font-semibold">{pct}%</span>
                        </span>
                        <span className="text-[#4B5F55]">
                          {st?.conversions ?? 0}/{st?.exposures ?? 0}{" "}
                          <strong className="text-[#0F291E]">
                            ({formatPct(st?.rate ?? 0)})
                          </strong>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        <section className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)] space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-[19px] font-semibold text-[#0F291E]">
              Top Conversion Sources
            </h2>
            <div className="flex items-center gap-3 text-[13px]">
              <Link
                href={`/admin/routing?${rangeQs}`}
                className="font-semibold text-[#147A53] hover:text-[#0F291E]"
              >
                Route buttons
              </Link>
              <span className="text-[#D0DBD5]">·</span>
              <Link
                href={`/admin/leads?${rangeQs}`}
                className="font-semibold text-[#147A53] hover:text-[#0F291E]"
              >
                Filter leads
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-[#E7ECE9] text-[#63786D] text-[12px] uppercase tracking-wider">
                  <th className="py-2.5 pr-3 font-semibold">Button / Source</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Clicks</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Leads</th>
                  <th className="py-2.5 pl-3 font-semibold text-right">Click → Lead</th>
                </tr>
              </thead>
              <tbody>
                {(ov?.top_sources ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#6E8278]">
                      No clicks or leads recorded yet for this period.
                    </td>
                  </tr>
                ) : (
                  (ov?.top_sources ?? []).map((s) => {
                    const cr = s.clicks > 0 ? s.leads / s.clicks : 0;
                    return (
                      <tr
                        key={s.source}
                        className="border-b border-[#F1F5F2] last:border-0 hover:bg-[#F7FAF8] transition-colors"
                      >
                        <td className="py-3 pr-3">
                          <Link
                            href={`/admin/leads?${rangeQs}&source=${encodeURIComponent(s.source)}`}
                            className="font-semibold text-[#0F291E] hover:text-[#147A53] transition-colors"
                          >
                            {sourceLabel(s.source)}
                          </Link>
                          <span className="block text-[12px] text-[#6E8278] font-mono">
                            {s.source}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right tabular-nums text-[#4B5F55]">
                          {s.clicks}
                        </td>
                        <td className="py-3 px-3 text-right tabular-nums font-semibold text-[#0F291E]">
                          {s.leads}
                        </td>
                        <td className="py-3 pl-3 text-right tabular-nums">
                          <span className="px-2 py-0.5 rounded-full bg-[#EAF4EF] text-[#14533C] font-semibold text-[12px]">
                            {s.clicks > 0 ? formatPct(cr, 1) : "—"}
                          </span>
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
    <Suspense fallback={<div className="p-6 text-[#147A53]">Loading overview...</div>}>
      <OverviewInner />
    </Suspense>
  );
}

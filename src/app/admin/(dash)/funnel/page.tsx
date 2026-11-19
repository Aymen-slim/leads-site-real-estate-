"use client";

import React, { Suspense, useState } from "react";
import { useAdminStats } from "@/components/admin/useRangeParams";
import { formatPct } from "@/lib/stats";
import { RefreshIcon } from "@/components/AdminIcons";

const FUNNEL_A_STEPS = [
  { key: "view", label: "Opened Seller Form" },
  { key: "step_1", label: "Step 1: Property Type" },
  { key: "step_2", label: "Step 2: Surface Area" },
  { key: "step_3", label: "Step 3: City / GPS Location" },
  { key: "step_4", label: "Step 4: Selling Timeline" },
  { key: "step_5", label: "Step 5: Name & Phone" },
  { key: "submit", label: "Submitted Lead" },
];

const FUNNEL_B_STEPS = [
  { key: "view", label: "Opened Seller Form" },
  { key: "started", label: "Started Typing Fields" },
  { key: "submit", label: "Submitted Lead" },
];

function StepDropoffCard({
  title,
  subtitle,
  steps,
  counts,
}: {
  title: string;
  subtitle: string;
  steps: { key: string; label: string }[];
  counts: Map<string, number>;
}) {
  const startCount = Math.max(
    counts.get("view") ?? 0,
    ...steps.map((s) => counts.get(s.key) ?? 0)
  );
  const submitCount = counts.get("submit") ?? 0;

  return (
    <section className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)] space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EDF2EF] pb-4">
        <div>
          <h2 className="font-display text-[21px] font-semibold text-[#0F291E]">{title}</h2>
          <p className="text-[13px] text-[#5B7065] mt-0.5">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-[#EAF4EF] border border-[#CBE3D6] px-3.5 py-2 text-right">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#14533C]">
            Completion
          </span>
          <span className="font-display text-[22px] font-semibold text-[#0F291E] tabular-nums leading-tight">
            {startCount > 0 ? formatPct(submitCount / startCount, 1) : "—"}
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        {steps.map((s, idx) => {
          const val = counts.get(s.key) ?? 0;
          const prevVal = idx > 0 ? counts.get(steps[idx - 1].key) ?? 0 : val;
          const pctOfStart = startCount > 0 ? (val / startCount) * 100 : 0;
          const dropFromPrev =
            idx > 0 && prevVal > 0 ? Math.max(0, (prevVal - val) / prevVal) : null;

          return (
            <div key={s.key} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                <span className="font-semibold text-[#14201A]">{s.label}</span>
                <div className="flex items-center gap-2.5 tabular-nums">
                  {dropFromPrev !== null && dropFromPrev > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FEF2F0] text-[#B8422C] text-[11px] font-semibold">
                      −{formatPct(dropFromPrev, 0)} drop
                    </span>
                  )}
                  <span className="font-semibold text-[#0F291E]">
                    {val} <span className="font-normal text-[#5B7065]">({pctOfStart.toFixed(0)}%)</span>
                  </span>
                </div>
              </div>
              <div className="h-3 w-full bg-[#EEF2EF] rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, pctOfStart)}%` }}
                  className={`h-full rounded-full transition-all ${
                    s.key === "submit" ? "bg-[#0F291E]" : "bg-[#147A53]"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FunnelInner() {
  const [includeRouted, setIncludeRouted] = useState(true);
  const { data, loading, error, reload } = useAdminStats({
    includeRouted: includeRouted ? "true" : "false",
  });

  const mapA = new Map<string, number>();
  const mapB = new Map<string, number>();
  for (const row of data?.funnel ?? []) {
    if (row.variant === "A") mapA.set(row.step, Number(row.sessions));
    if (row.variant === "B") mapB.set(row.step, Number(row.sessions));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#0F291E]">
            Funnel Drop-off
          </h1>
          <p className="text-[14px] text-[#5B7065] mt-0.5">
            Track step-by-step retention across Funnel A and Funnel B to pinpoint seller friction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-[#EEF2EF] rounded-full p-1 border border-[#DFE6E1] text-[13px]">
            <button
              type="button"
              onClick={() => setIncludeRouted(true)}
              className={`px-3 py-1 rounded-full font-medium cursor-pointer transition-all ${
                includeRouted ? "bg-[#FFFFFF] text-[#0F291E] font-semibold shadow-2xs" : "text-[#4D6157]"
              }`}
            >
              All form visits
            </button>
            <button
              type="button"
              onClick={() => setIncludeRouted(false)}
              className={`px-3 py-1 rounded-full font-medium cursor-pointer transition-all ${
                !includeRouted ? "bg-[#FFFFFF] text-[#0F291E] font-semibold shadow-2xs" : "text-[#4D6157]"
              }`}
            >
              A/B split only
            </button>
          </div>

          <button
            type="button"
            onClick={() => void reload()}
            disabled={loading}
            className="h-9 px-3.5 rounded-full bg-[#FFFFFF] border border-[#D8E2DC] hover:bg-[#EAF4EF] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshIcon className={`w-3.5 h-3.5 text-[#147A53] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-2xl bg-[#FEF2F0] border border-[#F0C2B9] text-[#B8422C] text-[14px]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StepDropoffCard
          title="Funnel A — 5-Step Tap Cards"
          subtitle="Giant tap cards with auto-advance and GPS / dropdown location"
          steps={FUNNEL_A_STEPS}
          counts={mapA}
        />

        <StepDropoffCard
          title="Funnel B — Single-Page Typed Form"
          subtitle="All 4 seller questions typed on one page"
          steps={FUNNEL_B_STEPS}
          counts={mapB}
        />
      </div>

      <p className="text-[13px] text-[#5B7065]">
        Note: Sellers arriving from calculators with pre-filled property type and size skip directly to Step 2 or Step 3 in Funnel A.
      </p>
    </div>
  );
}

export default function AdminFunnelPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#147A53]">Loading funnel metrics...</div>}>
      <FunnelInner />
    </Suspense>
  );
}

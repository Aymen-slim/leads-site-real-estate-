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
    <section className="bg-[#FFFFFF] border border-[#DFDFDF] p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#EDF0E7] pb-4">
        <div>
          <h2 className="font-serif text-[24px] text-[#000000]">{title}</h2>
          <p className="text-[14px] text-[#5A5954] mt-0.5">{subtitle}</p>
        </div>
        <div className="bg-[#EDF0E7] border border-[#DCE2CF] px-3.5 py-2 text-right">
          <span className="block text-[12px] text-[#5A5954]">Completion rate</span>
          <span className="text-[20px] font-semibold text-[#000000] tabular-nums">
            {startCount > 0 ? formatPct(submitCount / startCount, 1) : "—"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((s, idx) => {
          const val = counts.get(s.key) ?? 0;
          const prevVal = idx > 0 ? counts.get(steps[idx - 1].key) ?? 0 : val;
          const pctOfStart = startCount > 0 ? (val / startCount) * 100 : 0;
          const dropFromPrev =
            idx > 0 && prevVal > 0 ? Math.max(0, (prevVal - val) / prevVal) : null;

          return (
            <div key={s.key} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[14px]">
                <span className="font-medium text-[#000000]">{s.label}</span>
                <div className="flex items-center gap-3 tabular-nums">
                  {dropFromPrev !== null && dropFromPrev > 0 && (
                    <span className="text-[12px] text-[#BA5B3E] font-medium">
                      −{formatPct(dropFromPrev, 0)} drop
                    </span>
                  )}
                  <span className="font-semibold text-[#000000]">
                    {val} sessions ({pctOfStart.toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="h-4 w-full bg-[#EDF0E7] border border-[#DCE2CF]">
                <div
                  style={{ width: `${Math.min(100, pctOfStart)}%` }}
                  className={`h-full transition-all ${
                    s.key === "submit" ? "bg-[#5D726A]" : "bg-[#B8C49E]"
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[32px] leading-tight text-[#000000]">
            Funnel Drop-off
          </h1>
          <p className="text-[15px] text-[#5A5954]">
            See exactly which question or step causes sellers to abandon Funnel A or Funnel B.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-[#FFFFFF] border border-[#BFBFBD] p-0.5 text-[13px]">
            <button
              type="button"
              onClick={() => setIncludeRouted(true)}
              className={`px-3 py-1.5 font-medium cursor-pointer ${
                includeRouted ? "bg-[#292823] text-[#FFFFFF]" : "text-[#000000]"
              }`}
            >
              All form visits
            </button>
            <button
              type="button"
              onClick={() => setIncludeRouted(false)}
              className={`px-3 py-1.5 font-medium cursor-pointer ${
                !includeRouted ? "bg-[#292823] text-[#FFFFFF]" : "text-[#000000]"
              }`}
            >
              A/B split only
            </button>
          </div>

          <button
            type="button"
            onClick={() => void reload()}
            disabled={loading}
            className="min-h-[38px] px-3 py-1.5 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#EDF0E7] text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[hsl(6deg_100%_97%)] border border-[#BA5B3E] text-[#BA5B3E] text-[15px]">
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
          subtitle="All 4 questions typed on one page"
          steps={FUNNEL_B_STEPS}
          counts={mapB}
        />
      </div>

      <p className="text-[13px] text-[#5A5954]">
        Note: Visitors arriving from calculators with pre-filled property type and size skip directly to Step 2 or Step 3 in Funnel A.
      </p>
    </div>
  );
}

export default function AdminFunnelPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#5D726A]">Loading funnel metrics...</div>}>
      <FunnelInner />
    </Suspense>
  );
}

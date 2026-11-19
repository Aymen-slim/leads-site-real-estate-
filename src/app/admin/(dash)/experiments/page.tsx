"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useAdminStats } from "@/components/admin/useRangeParams";
import type { ExpStatsBundle } from "@/components/admin/useRangeParams";
import {
  VARIANT_META,
  type ExperimentConfig,
  type ExperimentId,
  type Variant,
} from "@/lib/ab";
import { formatPct } from "@/lib/stats";
import { ExternalLinkIcon, RefreshIcon } from "@/components/AdminIcons";

interface DraftVariant {
  key: Variant;
  weight: number;
  enabled: boolean;
}

function buildDraft(exp: ExperimentConfig): DraftVariant[] {
  return exp.variants.map((v) => ({
    key: v.key,
    weight: v.enabled ? v.weight : 0,
    enabled: v.enabled,
  }));
}

/** Auto-balance enabled variants so total weight always equals 100. */
function rebalance(draft: DraftVariant[], changedKey: Variant, targetWeight: number): DraftVariant[] {
  const clamped = Math.max(0, Math.min(100, Math.round(targetWeight)));
  const enabled = draft.filter((d) => d.enabled);
  if (enabled.length <= 1) {
    return draft.map((d) => ({ ...d, weight: d.enabled ? 100 : 0 }));
  }

  const others = enabled.filter((d) => d.key !== changedKey);
  const remaining = 100 - clamped;
  const otherSum = others.reduce((acc, d) => acc + d.weight, 0);

  const nextWeights = new Map<Variant, number>([[changedKey, clamped]]);
  let assigned = 0;
  others.forEach((d, idx) => {
    if (idx === others.length - 1) {
      nextWeights.set(d.key, Math.max(0, remaining - assigned));
    } else {
      const share =
        otherSum > 0
          ? Math.round((remaining * d.weight) / otherSum)
          : Math.round(remaining / others.length);
      const bounded = Math.max(0, Math.min(remaining - assigned, share));
      nextWeights.set(d.key, bounded);
      assigned += bounded;
    }
  });

  return draft.map((d) => ({
    ...d,
    weight: d.enabled ? nextWeights.get(d.key) ?? 0 : 0,
  }));
}

function toggleDraftVariant(draft: DraftVariant[], key: Variant): DraftVariant[] {
  const target = draft.find((d) => d.key === key);
  if (!target) return draft;
  const enabledCount = draft.filter((d) => d.enabled).length;
  if (target.enabled && enabledCount <= 1) return draft; // keep at least 1 enabled

  const toggled = draft.map((d) =>
    d.key === key ? { ...d, enabled: !d.enabled, weight: !d.enabled ? 25 : 0 } : d
  );

  // Normalize all enabled variants to sum to 100
  const enabled = toggled.filter((d) => d.enabled);
  const sum = enabled.reduce((acc, d) => acc + d.weight, 0);
  let assigned = 0;
  const weightMap = new Map<Variant, number>();
  enabled.forEach((d, idx) => {
    if (idx === enabled.length - 1) {
      weightMap.set(d.key, Math.max(0, 100 - assigned));
    } else {
      const share = sum > 0 ? Math.round((100 * d.weight) / sum) : Math.floor(100 / enabled.length);
      weightMap.set(d.key, share);
      assigned += share;
    }
  });

  return toggled.map((d) => ({
    ...d,
    weight: d.enabled ? weightMap.get(d.key) ?? 0 : 0,
  }));
}

function ExperimentCard({
  expId,
  title,
  subtitle,
  previewBase,
  expConfig,
  stats,
  presets,
  onMutate,
}: {
  expId: ExperimentId;
  title: string;
  subtitle: string;
  previewBase: string;
  expConfig: ExperimentConfig;
  stats: ExpStatsBundle;
  presets: { label: string; values: Record<string, number> }[];
  onMutate: (body: Record<string, unknown>) => Promise<void>;
}) {
  const [draft, setDraft] = useState<DraftVariant[]>(() => buildDraft(expConfig));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeErr, setNoticeErr] = useState(false);

  const meta = VARIANT_META[expId];

  useEffect(() => {
    setDraft(buildDraft(expConfig));
  }, [expConfig]);

  const applyPreset = (values: Record<string, number>) => {
    setDraft((prev) =>
      prev.map((d) => {
        const w = values[d.key] ?? 0;
        return { ...d, weight: w, enabled: w > 0 };
      })
    );
  };

  const runAction = async (payload: Record<string, unknown>, okMsg: string) => {
    setSaving(true);
    setNotice("");
    setNoticeErr(false);
    try {
      await onMutate({ experimentId: expId, ...payload });
      setNotice(okMsg);
    } catch (e) {
      setNoticeErr(true);
      setNotice(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveWeights = (resetRound: boolean) =>
    runAction(
      {
        action: "weights",
        resetRound,
        variants: draft.map((d) => ({
          key: d.key,
          weight: d.enabled ? d.weight : 0,
          enabled: d.enabled,
        })),
      },
      resetRound
        ? "Saved new traffic split and reset all visitors for a fresh round."
        : "Saved traffic split for new visitors."
    );

  const startedLabel =
    expConfig.started_at && new Date(expConfig.started_at).getFullYear() > 1971
      ? new Date(expConfig.started_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Initial";

  const enabledCount = draft.filter((d) => d.enabled).length;

  return (
    <section className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 sm:p-7 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EDF2EF] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-[23px] font-semibold tracking-tight text-[#0F291E]">
              {title}
            </h2>
            <span
              className={`px-3 py-0.5 rounded-full text-[12px] font-semibold ${
                expConfig.status === "winner"
                  ? "bg-[#0F291E] text-[#FFFFFF]"
                  : "bg-[#EAF4EF] text-[#14533C]"
              }`}
            >
              {expConfig.status === "winner"
                ? `Winner: ${meta[expConfig.winner ?? "A"]?.short ?? expConfig.winner} (100%)`
                : `Active · Round v${expConfig.version}`}
            </span>
          </div>
          <p className="text-[14px] text-[#5B7065] mt-1">
            {subtitle} · Round started: <strong className="text-[#14201A]">{startedLabel}</strong>
          </p>
        </div>

        {/* Live Preview Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {draft.map((d) => (
            <a
              key={d.key}
              href={`${previewBase}?preview=${expId}:${d.key}`}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-3.5 rounded-full bg-[#F4F7F5] hover:bg-[#EAF4EF] border border-[#D8E2DC] text-[13px] font-semibold text-[#0F291E] inline-flex items-center gap-1.5 transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: meta[d.key]?.color ?? "#147A53" }}
              />
              <span>Preview {meta[d.key]?.short ?? d.key}</span>
              <ExternalLinkIcon className="w-3.5 h-3.5 text-[#5B7065]" />
            </a>
          ))}
        </div>
      </div>

      {/* Traffic Split Controls */}
      <div className="rounded-2xl bg-[#F7FAF8] border border-[#E4ECE7] p-4 sm:p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-[#0F291E]">
            Traffic Allocation (Always sums to 100%)
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.values)}
                className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D5DFD9] hover:border-[#147A53] hover:bg-[#EAF4EF] text-[#0F291E] font-medium cursor-pointer transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-variant Visual Split Bar */}
        <div className="h-4 w-full bg-[#E3EAE6] rounded-full flex overflow-hidden p-0.5 gap-0.5">
          {draft.map((d) => {
            const pct = d.enabled ? d.weight : 0;
            if (pct <= 0) return null;
            return (
              <div
                key={d.key}
                style={{
                  width: `${pct}%`,
                  backgroundColor: meta[d.key]?.color ?? "#147A53",
                }}
                className="h-full rounded-full transition-all flex items-center justify-center text-[10px] font-bold text-[#FFFFFF]"
                title={`${meta[d.key]?.short ?? d.key}: ${pct}%`}
              >
                {pct >= 14 ? `${pct}%` : ""}
              </div>
            );
          })}
        </div>

        {/* Variant Cards Grid */}
        <div
          className={`grid grid-cols-1 ${
            draft.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2"
          } gap-4`}
        >
          {draft.map((d) => {
            const info = meta[d.key];
            const isOnlyEnabled = d.enabled && enabledCount === 1;
            const color = info?.color ?? "#147A53";

            return (
              <div
                key={d.key}
                className={`rounded-2xl p-4 bg-[#FFFFFF] border transition-all flex flex-col justify-between gap-4 ${
                  d.enabled
                    ? "border-[#CEDBD3] shadow-xs"
                    : "border-[#E8EEEA] opacity-65 bg-[#FAFCFB]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold text-[#FFFFFF]"
                      style={{ backgroundColor: color }}
                    >
                      {info?.short ?? `Variant ${d.key}`}
                    </span>

                    {/* Modern Sliding Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={d.enabled}
                      aria-label={`Toggle ${info?.short ?? d.key}`}
                      disabled={isOnlyEnabled}
                      onClick={() => setDraft((prev) => toggleDraftVariant(prev, d.key))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed ${
                        d.enabled ? "bg-[#147A53]" : "bg-[#CBD5CF]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-[#FFFFFF] shadow-xs transition-transform ${
                          d.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <p className="text-[15px] font-semibold text-[#0F291E] leading-snug">
                      {info?.name ?? `Variant ${d.key}`}
                    </p>
                    <p className="text-[12px] text-[#5B7065] leading-relaxed mt-1">
                      {info?.desc}
                    </p>
                  </div>
                </div>

                {/* Slider + Numeric Input */}
                <div className="space-y-2.5 pt-2 border-t border-[#EFF4F1]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-[#5B7065]">Traffic share</span>
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        aria-label={`Percentage for ${info?.short ?? d.key}`}
                        disabled={!d.enabled || isOnlyEnabled}
                        value={d.enabled ? d.weight : 0}
                        onChange={(e) =>
                          setDraft((prev) => rebalance(prev, d.key, Number(e.target.value)))
                        }
                        className="w-16 px-2 py-1 rounded-lg border border-[#CFDAD3] bg-[#F7FAF8] text-right text-[15px] font-semibold tabular-nums text-[#0F291E] disabled:opacity-50"
                      />
                      <span className="text-[14px] font-semibold text-[#5B7065]">%</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    aria-label={`Slider for ${info?.short ?? d.key}`}
                    disabled={!d.enabled || isOnlyEnabled}
                    value={d.enabled ? d.weight : 0}
                    style={
                      {
                        "--attr-min": 0,
                        "--attr-max": 100,
                        "--control-value": d.enabled ? d.weight : 0,
                        "--slider-fill-color": color,
                      } as React.CSSProperties
                    }
                    onChange={(e) =>
                      setDraft((prev) => rebalance(prev, d.key, Number(e.target.value)))
                    }
                    className="nm-slider"
                  />

                  <button
                    type="button"
                    disabled={saving || (expConfig.status === "winner" && expConfig.winner === d.key)}
                    onClick={() =>
                      runAction(
                        { action: "winner", winner: d.key },
                        `${info?.short ?? d.key} declared winner — 100% of traffic now sees it.`
                      )
                    }
                    className="w-full py-2 px-3 rounded-xl bg-[#F4F7F5] hover:bg-[#EAF4EF] border border-[#DCE5DF] text-[12px] font-semibold text-[#0F291E] cursor-pointer transition-colors disabled:opacity-45"
                  >
                    Make {info?.short ?? d.key} winner (100%)
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            disabled={saving}
            onClick={() => saveWeights(false)}
            className="h-10 px-5 rounded-full bg-[#147A53] hover:bg-[#0D5E3F] text-[#FFFFFF] text-[14px] font-semibold cursor-pointer transition-colors shadow-xs disabled:opacity-60"
          >
            Save % (new visitors only)
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => saveWeights(true)}
            className="h-10 px-5 rounded-full bg-[#0F291E] hover:bg-[#193F2F] text-[#FFFFFF] text-[14px] font-medium cursor-pointer transition-colors disabled:opacity-60"
          >
            Save % &amp; reset all visitors (new round)
          </button>

          {expConfig.status === "winner" && (
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                runAction({ action: "resume" }, "Split test reopened for a fresh round.")
              }
              className="h-10 px-4 rounded-full bg-[#FFFFFF] hover:bg-[#EAF4EF] border border-[#CBD7D0] text-[#0F291E] text-[14px] font-semibold cursor-pointer transition-colors"
            >
              Resume split test
            </button>
          )}
        </div>

        {notice && (
          <p
            role="status"
            className={`text-[13px] font-semibold ${
              noticeErr ? "text-[#B8422C]" : "text-[#147A53]"
            }`}
          >
            {notice}
          </p>
        )}
      </div>

      {/* Live Experiment Results & Confidence Table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-[#0F291E]">
            Conversion Results &amp; Statistical Confidence
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${
              stats.status === "significant"
                ? "bg-[#EAF4EF] border-[#B6DCC8] text-[#14533C]"
                : stats.status === "inconclusive"
                ? "bg-[#F4F7F5] border-[#DCE5DF] text-[#43564C]"
                : "bg-[#FEF6E2] border-[#ECD8A4] text-[#7A4E00]"
            }`}
          >
            {stats.status === "insufficient_data"
              ? "Not enough data yet (need 100+ sessions per top variants & 5+ leads)"
              : stats.status === "significant"
              ? `Statistically significant: ${stats.confidencePct}% confidence (${
                  meta[stats.leader]?.short ?? stats.leader
                } leads)`
              : `Inconclusive so far (${stats.confidencePct}% confidence — keep running)`}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E4ECE7]">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#F7FAF8] border-b border-[#E4ECE7] text-[#5B7065] text-[12px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Variant</th>
                <th className="py-3 px-3 text-right font-semibold">Sessions</th>
                <th className="py-3 px-3 text-right font-semibold">Leads</th>
                <th className="py-3 px-3 text-right font-semibold">Conv. Rate</th>
                <th className="py-3 px-3 text-right font-semibold">Lift vs A</th>
                <th className="py-3 px-4 text-right font-semibold">Confidence vs A</th>
              </tr>
            </thead>
            <tbody>
              {stats.variants.map((row) => {
                const info = meta[row.key];
                return (
                  <tr
                    key={row.key}
                    className="border-b border-[#F1F5F2] last:border-0 hover:bg-[#FAFDFB]"
                  >
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2 font-semibold text-[#0F291E]">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: info?.color ?? "#147A53" }}
                        />
                        <span>{info?.short ?? row.key}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-[#4B5F55]">
                      {row.exposures}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-[#0F291E]">
                      {row.conversions}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-[#0F291E]">
                      {formatPct(row.rate, 2)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right tabular-nums font-semibold ${
                        row.liftVsBaseline !== null && row.liftVsBaseline > 0
                          ? "text-[#147A53]"
                          : row.liftVsBaseline !== null && row.liftVsBaseline < 0
                          ? "text-[#B8422C]"
                          : "text-[#6E8278]"
                      }`}
                    >
                      {row.statusVsBaseline === "baseline"
                        ? "Baseline"
                        : row.liftVsBaseline === null
                        ? "—"
                        : `${row.liftVsBaseline > 0 ? "+" : ""}${row.liftVsBaseline.toFixed(1)}%`}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-[13px] text-[#5B7065]">
                      {row.statusVsBaseline === "baseline"
                        ? "—"
                        : row.statusVsBaseline === "insufficient_data"
                        ? "Need 100+ each"
                        : `${row.confidenceVsBaseline}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ExperimentsInner() {
  const [expWindow, setExpWindow] = useState<"round" | "range">("round");
  const { data, loading, error, reload } = useAdminStats({ expWindow });

  const mutateConfig = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(j.error || `Failed (${res.status})`);
    }
    await reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#0F291E]">
            Traffic % &amp; Site Versions
          </h1>
          <p className="text-[14px] text-[#5B7065] mt-0.5">
            Control exact percentages between Classic A, Classic B, and the Modern VurderBoligen site (Home A only), plus Seller Form A vs B.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-[#EEF2EF] rounded-full p-1 border border-[#DFE6E1] text-[13px]">
            <button
              type="button"
              onClick={() => setExpWindow("round")}
              className={`px-3 py-1 rounded-full font-medium cursor-pointer transition-all ${
                expWindow === "round"
                  ? "bg-[#FFFFFF] text-[#0F291E] font-semibold shadow-2xs"
                  : "text-[#4D6157]"
              }`}
            >
              Current round
            </button>
            <button
              type="button"
              onClick={() => setExpWindow("range")}
              className={`px-3 py-1 rounded-full font-medium cursor-pointer transition-all ${
                expWindow === "range"
                  ? "bg-[#FFFFFF] text-[#0F291E] font-semibold shadow-2xs"
                  : "text-[#4D6157]"
              }`}
            >
              Selected date range
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

      {data && (
        <div className="space-y-6">
          <ExperimentCard
            expId="landing"
            title="1. Site Experience & Home Page (/)"
            subtitle="Choose how traffic splits across Classic A, Classic B, and the Modern VurderBoligen site"
            previewBase="/"
            expConfig={data.config.experiments.landing}
            stats={data.experiments.landing}
            presets={[
              { label: "Equal 3-Way (33/33/34)", values: { A: 33, B: 33, M: 34 } },
              { label: "Classic A vs Modern (50/0/50)", values: { A: 50, B: 0, M: 50 } },
              { label: "100% Modern", values: { A: 0, B: 0, M: 100 } },
              { label: "Classic A vs B (50/50/0)", values: { A: 50, B: 50, M: 0 } },
            ]}
            onMutate={mutateConfig}
          />

          <ExperimentCard
            expId="funnel"
            title="2. Seller Form (/connect-agency & /sell)"
            subtitle="Controls which form is shown for buttons set to 'A/B Split' in Form Routing"
            previewBase="/connect-agency"
            expConfig={data.config.experiments.funnel}
            stats={data.experiments.funnel}
            presets={[
              { label: "50 / 50", values: { A: 50, B: 50 } },
              { label: "80 / 20", values: { A: 80, B: 20 } },
              { label: "20 / 80", values: { A: 20, B: 80 } },
            ]}
            onMutate={mutateConfig}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminExperimentsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#147A53]">Loading traffic controls...</div>}>
      <ExperimentsInner />
    </Suspense>
  );
}

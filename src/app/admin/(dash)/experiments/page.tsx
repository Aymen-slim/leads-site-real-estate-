"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useAdminStats } from "@/components/admin/useRangeParams";
import type { ExperimentConfig, ExperimentId, Variant } from "@/lib/ab";
import type { ExpStatsBundle } from "@/components/admin/useRangeParams";
import { formatPct } from "@/lib/stats";
import { ExternalLinkIcon, RefreshIcon } from "@/components/AdminIcons";

interface DraftWeights {
  weightA: number;
  weightB: number;
  enabledA: boolean;
  enabledB: boolean;
}

function draftFromConfig(exp: ExperimentConfig): DraftWeights {
  const a = exp.variants.find((v) => v.key === "A");
  const b = exp.variants.find((v) => v.key === "B");
  return {
    weightA: a?.weight ?? 50,
    weightB: b?.weight ?? 50,
    enabledA: a?.enabled ?? true,
    enabledB: b?.enabled ?? true,
  };
}

function ExperimentCard({
  expId,
  title,
  subtitle,
  previewBase,
  expConfig,
  stats,
  onMutate,
}: {
  expId: ExperimentId;
  title: string;
  subtitle: string;
  previewBase: string;
  expConfig: ExperimentConfig;
  stats: ExpStatsBundle;
  onMutate: (body: Record<string, unknown>) => Promise<void>;
}) {
  const [draft, setDraft] = useState<DraftWeights>(() => draftFromConfig(expConfig));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setDraft(draftFromConfig(expConfig));
  }, [expConfig]);

  const setWeightA = (val: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)));
    if (!draft.enabledB) {
      setDraft({ ...draft, weightA: 100, weightB: 0 });
      return;
    }
    setDraft({ ...draft, weightA: clamped, weightB: 100 - clamped });
  };

  const toggleVariant = (key: Variant) => {
    if (key === "A") {
      if (draft.enabledA && !draft.enabledB) return; // keep at least 1 enabled
      const nextA = !draft.enabledA;
      setDraft({
        enabledA: nextA,
        enabledB: draft.enabledB,
        weightA: nextA ? 50 : 0,
        weightB: nextA ? 50 : 100,
      });
    } else {
      if (draft.enabledB && !draft.enabledA) return;
      const nextB = !draft.enabledB;
      setDraft({
        enabledA: draft.enabledA,
        enabledB: nextB,
        weightA: nextB ? 50 : 100,
        weightB: nextB ? 50 : 0,
      });
    }
  };

  const runAction = async (payload: Record<string, unknown>, okMsg: string) => {
    setSaving(true);
    setNotice("");
    try {
      await onMutate({ experimentId: expId, ...payload });
      setNotice(okMsg);
    } catch (e) {
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
        variants: [
          { key: "A", weight: draft.enabledA ? draft.weightA : 0, enabled: draft.enabledA },
          { key: "B", weight: draft.enabledB ? draft.weightB : 0, enabled: draft.enabledB },
        ],
      },
      resetRound
        ? "Saved new traffic split and reset assignments for a fresh round."
        : "Saved traffic split for new visitors."
    );

  const sig = stats.significance;
  const startedLabel =
    expConfig.started_at && new Date(expConfig.started_at).getFullYear() > 1971
      ? new Date(expConfig.started_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Initial";

  return (
    <section className="bg-[#FFFFFF] border-2 border-[#DCE2CF] p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EDF0E7] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-serif text-[26px] leading-tight text-[#000000]">
              {title}
            </h2>
            <span
              className={`px-2.5 py-0.5 text-[12px] font-semibold ${
                expConfig.status === "winner"
                  ? "bg-[#5D726A] text-[#FFFFFF]"
                  : "bg-[#B8C49E] text-[#000000]"
              }`}
            >
              {expConfig.status === "winner"
                ? `Winner declared: Variant ${expConfig.winner}`
                : `Running · Round v${expConfig.version}`}
            </span>
          </div>
          <p className="text-[14px] text-[#5A5954] mt-1">
            {subtitle} · Round started: <strong>{startedLabel}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["A", "B"] as const).map((v) => (
            <a
              key={v}
              href={`${previewBase}?preview=${expId}:${v}`}
              target="_blank"
              rel="noreferrer"
              className="min-h-[36px] px-3 py-1.5 bg-[#EDF0E7] hover:bg-[#DCE2CF] border border-[#BFBFBD] text-[13px] font-medium text-[#000000] inline-flex items-center gap-1.5"
            >
              <span>Preview {v}</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Traffic Percentage Controls */}
      <div className="bg-[#EDF0E7] border border-[#DCE2CF] p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[#000000]">
            Traffic Split Percentage
          </h3>
          <div className="flex items-center gap-2 text-[13px]">
            <button
              type="button"
              onClick={() =>
                setDraft({ enabledA: true, enabledB: true, weightA: 50, weightB: 50 })
              }
              className="px-2.5 py-1 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#DCE2CF] font-medium cursor-pointer"
            >
              50 / 50
            </button>
            <button
              type="button"
              onClick={() =>
                setDraft({ enabledA: true, enabledB: true, weightA: 80, weightB: 20 })
              }
              className="px-2.5 py-1 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#DCE2CF] font-medium cursor-pointer"
            >
              80 / 20
            </button>
            <button
              type="button"
              onClick={() =>
                setDraft({ enabledA: true, enabledB: true, weightA: 20, weightB: 80 })
              }
              className="px-2.5 py-1 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#DCE2CF] font-medium cursor-pointer"
            >
              20 / 80
            </button>
          </div>
        </div>

        {/* Visual Split Bar */}
        <div className="h-4 w-full bg-[#DCE2CF] flex overflow-hidden border border-[#5D726A]">
          <div
            style={{ width: `${draft.enabledA ? draft.weightA : 0}%` }}
            className="bg-[#5D726A] transition-all"
          />
          <div
            style={{ width: `${draft.enabledB ? draft.weightB : 0}%` }}
            className="bg-[#B8C49E] transition-all"
          />
        </div>

        {/* Slider */}
        <div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            aria-label={`${title} traffic share for Variant A`}
            disabled={!draft.enabledA || !draft.enabledB}
            value={draft.enabledA ? draft.weightA : 0}
            style={
              {
                "--attr-min": 0,
                "--attr-max": 100,
                "--control-value": draft.enabledA ? draft.weightA : 0,
              } as React.CSSProperties
            }
            onChange={(e) => setWeightA(Number(e.target.value))}
            className="kr-slider"
          />
        </div>

        {/* Variant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {(["A", "B"] as const).map((k) => {
            const isA = k === "A";
            const enabled = isA ? draft.enabledA : draft.enabledB;
            const weight = isA ? draft.weightA : draft.weightB;
            const label =
              expConfig.variants.find((v) => v.key === k)?.label ?? `Variant ${k}`;

            return (
              <div
                key={k}
                className={`p-4 border-2 bg-[#FFFFFF] flex flex-col justify-between gap-3 ${
                  enabled ? "border-[#5D726A]" : "border-[#DFDFDF] opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[12px] font-semibold bg-[#EDF0E7] border border-[#DCE2CF] text-[#000000]">
                      Variant {k}
                    </span>
                    <p className="text-[15px] font-medium text-[#000000] mt-1">
                      {label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleVariant(k)}
                    className={`px-2.5 py-1 text-[12px] font-semibold border cursor-pointer ${
                      enabled
                        ? "bg-[#B8C49E] border-[#5D726A] text-[#000000]"
                        : "bg-[#F7F7F7] border-[#BFBFBD] text-[#5A5954]"
                    }`}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="text-[14px] text-[#292823] flex items-center gap-2">
                    <span>Traffic %:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      disabled={!enabled || (!draft.enabledA || !draft.enabledB)}
                      value={enabled ? weight : 0}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        setWeightA(isA ? n : 100 - n);
                      }}
                      className="w-20 px-2.5 py-1.5 border border-[#5D726A] bg-[#F7F7F7] text-[16px] font-semibold tabular-nums text-[#000000]"
                    />
                  </label>

                  <button
                    type="button"
                    disabled={saving || (expConfig.status === "winner" && expConfig.winner === k)}
                    onClick={() =>
                      runAction(
                        { action: "winner", winner: k },
                        `Variant ${k} declared winner — 100% of traffic now sees Variant ${k}.`
                      )
                    }
                    className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#DCE2CF] border border-[#5D726A] text-[13px] font-medium text-[#000000] cursor-pointer disabled:opacity-50"
                  >
                    Declare {k} winner (100%)
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
            className="min-h-[44px] px-4 py-2 bg-[#B8C49E] hover:bg-[#C5D0AF] border border-[#5D726A] text-[#000000] text-[14px] font-semibold cursor-pointer disabled:opacity-60"
          >
            Save % (new visitors only)
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => saveWeights(true)}
            className="min-h-[44px] px-4 py-2 bg-[#292823] hover:bg-[#000000] text-[#FFFFFF] text-[14px] font-medium cursor-pointer disabled:opacity-60"
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
              className="min-h-[44px] px-4 py-2 bg-[#FFFFFF] hover:bg-[#DCE2CF] border border-[#5D726A] text-[#000000] text-[14px] font-medium cursor-pointer"
            >
              Resume A/B split test
            </button>
          )}
        </div>

        {notice && (
          <p role="status" className="text-[14px] font-medium text-[#5D726A]">
            {notice}
          </p>
        )}
      </div>

      {/* Live Experiment Results & Statistical Confidence */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[#000000]">
            Conversion Performance &amp; Significance
          </h3>
          <span
            className={`px-3 py-1 text-[13px] font-semibold border ${
              sig.status === "significant"
                ? "bg-[#B8C49E] border-[#5D726A] text-[#000000]"
                : sig.status === "inconclusive"
                ? "bg-[#EDF0E7] border-[#BFBFBD] text-[#292823]"
                : "bg-[#FFF7D4] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            {sig.status === "insufficient_data"
              ? "Not enough data yet (need 100+ sessions per variant & 5+ leads)"
              : sig.status === "significant"
              ? `Statistically significant: ${sig.confidencePct}% confidence (Variant ${sig.leader} leads)`
              : `Inconclusive so far (${sig.confidencePct}% confidence — keep running)`}
          </span>
        </div>

        <div className="overflow-x-auto border border-[#DFDFDF]">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#DFDFDF] text-[#5A5954]">
                <th className="py-2.5 px-4 font-medium">Variant</th>
                <th className="py-2.5 px-3 text-right font-medium">Exposed Sessions</th>
                <th className="py-2.5 px-3 text-right font-medium">Leads</th>
                <th className="py-2.5 px-3 text-right font-medium">Conversion Rate</th>
                <th className="py-2.5 px-4 text-right font-medium">Lift vs A</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#EDF0E7]">
                <td className="py-3 px-4 font-semibold text-[#000000]">Variant A</td>
                <td className="py-3 px-3 text-right tabular-nums">{stats.A.exposures}</td>
                <td className="py-3 px-3 text-right tabular-nums font-semibold">
                  {stats.A.conversions}
                </td>
                <td className="py-3 px-3 text-right tabular-nums font-semibold">
                  {formatPct(sig.rateA, 2)}
                </td>
                <td className="py-3 px-4 text-right text-[#5A5954]">Baseline</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#000000]">Variant B</td>
                <td className="py-3 px-3 text-right tabular-nums">{stats.B.exposures}</td>
                <td className="py-3 px-3 text-right tabular-nums font-semibold">
                  {stats.B.conversions}
                </td>
                <td className="py-3 px-3 text-right tabular-nums font-semibold">
                  {formatPct(sig.rateB, 2)}
                </td>
                <td
                  className={`py-3 px-4 text-right tabular-nums font-semibold ${
                    sig.relativeLiftPct !== null && sig.relativeLiftPct > 0
                      ? "text-[#5D726A]"
                      : sig.relativeLiftPct !== null && sig.relativeLiftPct < 0
                      ? "text-[#BA5B3E]"
                      : "text-[#5A5954]"
                  }`}
                >
                  {sig.relativeLiftPct === null
                    ? "—"
                    : `${sig.relativeLiftPct > 0 ? "+" : ""}${sig.relativeLiftPct.toFixed(1)}%`}
                </td>
              </tr>
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[32px] leading-tight text-[#000000]">
            Traffic % &amp; A/B Split Control
          </h1>
          <p className="text-[15px] text-[#5A5954]">
            Set exact traffic percentages for each page version, keep visitors sticky, or declare a 100% winner.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-[#FFFFFF] border border-[#BFBFBD] p-0.5 text-[13px]">
            <button
              type="button"
              onClick={() => setExpWindow("round")}
              className={`px-3 py-1.5 font-medium cursor-pointer ${
                expWindow === "round" ? "bg-[#292823] text-[#FFFFFF]" : "text-[#000000]"
              }`}
            >
              Current round stats
            </button>
            <button
              type="button"
              onClick={() => setExpWindow("range")}
              className={`px-3 py-1.5 font-medium cursor-pointer ${
                expWindow === "range" ? "bg-[#292823] text-[#FFFFFF]" : "text-[#000000]"
              }`}
            >
              Selected date range
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

      {data && (
        <div className="space-y-6">
          <ExperimentCard
            expId="landing"
            title="1. Landing Page (/)"
            subtitle="Controls which Home Hero layout visitors see when arriving at the site"
            previewBase="/"
            expConfig={data.config.experiments.landing}
            stats={data.experiments.landing}
            onMutate={mutateConfig}
          />

          <ExperimentCard
            expId="funnel"
            title="2. Seller Form (/connect-agency & /sell)"
            subtitle="Controls which form is shown for sources set to 'A/B Split' in Form Routing"
            previewBase="/connect-agency"
            expConfig={data.config.experiments.funnel}
            stats={data.experiments.funnel}
            onMutate={mutateConfig}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminExperimentsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#5D726A]">Loading experiments...</div>}>
      <ExperimentsInner />
    </Suspense>
  );
}

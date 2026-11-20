"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRangeQueryString } from "@/components/admin/useRangeParams";
import { KNOWN_SOURCES, RouteDestination } from "@/lib/ab";
import { formatPct } from "@/lib/stats";
import { RefreshIcon } from "@/components/AdminIcons";

interface RouteItem {
  source: string;
  label: string | null;
  destination: RouteDestination;
  clicks: number;
  leads: number;
}

const TOOL_SOURCES = new Set([
  "price-m2",
  "net-cash",
  "land",
  "inheritance",
  "as-is",
  "tax-calc",
  "partner-buyout",
  "broker-fee",
  "bridge-loan",
  "rent-or-sell",
  "property-tax",
  "document-fee",
  "cabin-cost",
  "energy-rating",
  "ground-lease",
  "sun-conditions",
]);
const AD_SOURCES = new Set(["ad-villa", "ad-land", "ad-family"]);

function RoutingInner() {
  const rangeQs = useRangeQueryString();
  const [rules, setRules] = useState<RouteItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, RouteDestination>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [newSource, setNewSource] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDest, setNewDest] = useState<RouteDestination>("split");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/routes?${rangeQs}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = (await res.json()) as { configured: boolean; rules: RouteItem[] };

      const baseRules: RouteItem[] = json.configured
        ? json.rules
        : KNOWN_SOURCES.map((k) => ({
            source: k.source,
            label: k.label,
            destination: "split",
            clicks: 0,
            leads: 0,
          }));

      const orderMap = new Map(KNOWN_SOURCES.map((k, i) => [k.source, i]));
      baseRules.sort((a, b) => {
        const ia = orderMap.get(a.source) ?? 999;
        const ib = orderMap.get(b.source) ?? 999;
        return ia !== ib ? ia - ib : a.source.localeCompare(b.source);
      });

      setRules(baseRules);
      const map: Record<string, RouteDestination> = {};
      for (const r of baseRules) map[r.source] = r.destination;
      setDrafts(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load routing rules");
    } finally {
      setLoading(false);
    }
  }, [rangeQs]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirtySources = rules.filter((r) => drafts[r.source] && drafts[r.source] !== r.destination);

  const saveChanges = async (customUpdates?: { source: string; destination: RouteDestination }[]) => {
    const updates =
      customUpdates ??
      dirtySources.map((r) => ({ source: r.source, destination: drafts[r.source] }));
    if (updates.length === 0) return;

    setSaving(true);
    setNotice("");
    setError("");
    try {
      const res = await fetch("/api/admin/routes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `Error ${res.status}`);
      }
      setNotice(`Saved ${updates.length} routing rule${updates.length === 1 ? "" : "s"}.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save rules");
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (predicate: (src: string) => boolean, dest: RouteDestination) => {
    setDrafts((prev) => {
      const next = { ...prev };
      for (const r of rules) {
        if (predicate(r.source)) next[r.source] = dest;
      }
      return next;
    });
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.trim()) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: newSource.trim().toLowerCase(),
          label: newLabel.trim(),
          destination: newDest,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `Error ${res.status}`);
      }
      setNewSource("");
      setNewLabel("");
      setNewDest("split");
      setNotice("Custom source added.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add custom source");
    } finally {
      setSaving(false);
    }
  };

  const groupName = (src: string) =>
    KNOWN_SOURCES.find((k) => k.source === src)?.group ?? "Custom";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#0F291E]">
            Form Routing
          </h1>
          <p className="text-[14px] text-[#5B7065] mt-0.5">
            Decide per button, calculator, or ad whether visitors see Funnel A (5-step tap cards), Funnel B (1-page typed form), or follow the A/B split.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="h-9 px-3.5 rounded-full bg-[#FFFFFF] border border-[#D8E2DC] hover:bg-[#EAF4EF] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshIcon className={`w-3.5 h-3.5 text-[#147A53] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            disabled={saving || dirtySources.length === 0}
            onClick={() => void saveChanges()}
            className="h-9 px-4 rounded-full bg-[#147A53] hover:bg-[#0D5E3F] text-[#FFFFFF] text-[13px] font-semibold cursor-pointer transition-colors shadow-xs disabled:opacity-45"
          >
            {saving
              ? "Saving..."
              : dirtySources.length > 0
              ? `Save changes (${dirtySources.length})`
              : "All changes saved"}
          </button>
        </div>
      </div>

      {/* Info + Quick Presets */}
      <div className="rounded-2xl bg-[#EAF4EF] border border-[#CBE3D6] p-4 flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <p className="text-[#14533C] max-w-2xl leading-relaxed">
          <strong>Fair A/B rule:</strong> Forced routes always open your chosen form and are excluded from Seller Form A/B experiment statistics.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset((s) => TOOL_SOURCES.has(s), "A")}
            className="px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#C3DCD0] hover:border-[#147A53] text-[#0F291E] font-semibold cursor-pointer transition-colors"
          >
            All 16 Tools → Funnel A
          </button>
          <button
            type="button"
            onClick={() => applyPreset((s) => AD_SOURCES.has(s), "B")}
            className="px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#C3DCD0] hover:border-[#147A53] text-[#0F291E] font-semibold cursor-pointer transition-colors"
          >
            Sample Ads → Funnel B
          </button>
          <button
            type="button"
            onClick={() => applyPreset(() => true, "split")}
            className="px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D8E2DC] hover:bg-[#F4F6F5] text-[#43564C] font-medium cursor-pointer transition-colors"
          >
            Reset all → A/B Split
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-2xl bg-[#FEF2F0] border border-[#F0C2B9] text-[#B8422C] text-[14px]">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="p-3.5 rounded-2xl bg-[#EAF4EF] border border-[#B6DCC8] text-[#14533C] text-[13px] font-semibold">
          {notice}
        </div>
      )}

      {/* Rules Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#F7FAF8] border-b border-[#E6ECE8] text-[#5B7065] text-[12px] uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Source / Entry Button</th>
                <th className="py-3.5 px-3 font-semibold">Group</th>
                <th className="py-3.5 px-3 text-right font-semibold">Clicks</th>
                <th className="py-3.5 px-3 text-right font-semibold">Leads</th>
                <th className="py-3.5 px-3 text-right font-semibold">CR %</th>
                <th className="py-3.5 px-5 font-semibold">Destination Form</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => {
                const currentDest = drafts[r.source] ?? r.destination;
                const isDirty = currentDest !== r.destination;
                const cr = r.clicks > 0 ? r.leads / r.clicks : 0;

                return (
                  <tr
                    key={r.source}
                    className={`border-b border-[#F1F5F2] last:border-0 transition-colors ${
                      isDirty ? "bg-[#FEF6E2]/55" : "hover:bg-[#F7FAF8]"
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <span className="block font-semibold text-[#0F291E]">
                        {r.label ||
                          KNOWN_SOURCES.find((k) => k.source === r.source)?.label ||
                          r.source}
                      </span>
                      <code className="text-[12px] text-[#147A53]">
                        {r.source === "*" ? "Fallback (*)" : `?source=${r.source}`}
                      </code>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F2F6F4] text-[#566A60] text-[12px] font-medium">
                        {groupName(r.source)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-[#4B5F55]">
                      {r.clicks}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums font-semibold text-[#0F291E]">
                      {r.leads}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-[#4B5F55]">
                      {r.clicks > 0 ? formatPct(cr, 1) : "—"}
                    </td>
                    <td className="py-3.5 px-5">
                      <div
                        role="group"
                        aria-label={`Destination for ${r.source}`}
                        className="inline-flex rounded-full bg-[#EEF2EF] p-1 border border-[#DFE6E1]"
                      >
                        {(
                          [
                            { id: "split", label: "A/B Split" },
                            { id: "A", label: "Funnel A" },
                            { id: "B", label: "Funnel B" },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setDrafts((prev) => ({ ...prev, [r.source]: opt.id }))
                            }
                            className={`px-3 py-1 rounded-full text-[12px] font-semibold cursor-pointer transition-all whitespace-nowrap ${
                              currentDest === opt.id
                                ? opt.id === "split"
                                  ? "bg-[#0F291E] text-[#FFFFFF] shadow-2xs"
                                  : "bg-[#147A53] text-[#FFFFFF] shadow-2xs"
                                : "text-[#4D6157] hover:text-[#0F291E]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Campaign Source */}
      <form
        onSubmit={handleAddCustom}
        className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-3.5"
      >
        <div>
          <h2 className="font-display text-[17px] font-semibold text-[#0F291E]">
            Pre-register a campaign source link
          </h2>
          <p className="text-[13px] text-[#5B7065] mt-0.5">
            Running an ad linking to{" "}
            <code className="bg-[#F2F6F4] px-1.5 py-0.5 rounded-md text-[#147A53]">
              /connect-agency?source=fb-oslo
            </code>
            ? Add it here to choose its form destination ahead of launch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label htmlFor="new-src" className="block text-[12px] font-semibold text-[#4B5F55] mb-1">
              Source slug
            </label>
            <input
              id="new-src"
              type="text"
              required
              pattern="[a-zA-Z0-9][a-zA-Z0-9-]{0,39}"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="e.g. fb-oslo"
              className="w-full h-10 px-3.5 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            />
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="new-lbl" className="block text-[12px] font-semibold text-[#4B5F55] mb-1">
              Description
            </label>
            <input
              id="new-lbl"
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Facebook campaign Oslo"
              className="w-full h-10 px-3.5 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="new-dest" className="block text-[12px] font-semibold text-[#4B5F55] mb-1">
              Destination form
            </label>
            <select
              id="new-dest"
              value={newDest}
              onChange={(e) => setNewDest(e.target.value as RouteDestination)}
              className="w-full h-10 px-3 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            >
              <option value="split">A/B Split</option>
              <option value="A">Force Funnel A (Tap Cards)</option>
              <option value="B">Force Funnel B (Typed)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full h-10 px-4 rounded-full bg-[#0F291E] hover:bg-[#147A53] text-[#FFFFFF] text-[13px] font-semibold cursor-pointer transition-colors"
            >
              Add rule
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AdminRoutingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#147A53]">Loading routing rules...</div>}>
      <RoutingInner />
    </Suspense>
  );
}

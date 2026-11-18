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

const TOOL_SOURCES = new Set(["price-m2", "net-cash", "land", "inheritance", "as-is"]);
const AD_SOURCES = new Set(["ad-villa", "ad-land", "ad-family"]);

function RoutingInner() {
  const rangeQs = useRangeQueryString();
  const [rules, setRules] = useState<RouteItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, RouteDestination>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Custom source creator
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

      // If Supabase isn't configured yet, show KNOWN_SOURCES as preview.
      const baseRules: RouteItem[] = json.configured
        ? json.rules
        : KNOWN_SOURCES.map((k) => ({
            source: k.source,
            label: k.label,
            destination: "split",
            clicks: 0,
            leads: 0,
          }));

      // Keep fallback '*' first, then known order, then custom discovered sources.
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
    KNOWN_SOURCES.find((k) => k.source === src)?.group ?? "Custom / Discovered";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[32px] leading-tight text-[#000000]">
            Form Routing (Which Button Opens Which Form)
          </h1>
          <p className="text-[15px] text-[#5A5954]">
            Decide per CTA / calculator / ad whether visitors see Funnel A (5-step tap cards), Funnel B (1-page typed form), or follow the A/B split.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="min-h-[40px] px-3 py-2 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#EDF0E7] text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            disabled={saving || dirtySources.length === 0}
            onClick={() => void saveChanges()}
            className="min-h-[40px] px-4 py-2 bg-[#B8C49E] hover:bg-[#C5D0AF] border border-[#5D726A] text-[#000000] text-[14px] font-semibold cursor-pointer disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : dirtySources.length > 0
              ? `Save changes (${dirtySources.length})`
              : "All changes saved"}
          </button>
        </div>
      </div>

      <div className="bg-[#EDF0E7] border border-[#DCE2CF] p-4 flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <p className="text-[#292823] max-w-2xl">
          <strong>Fair A/B rule:</strong> When a button is forced to Funnel A or Funnel B, those visits are flagged as routed and excluded from the Seller Form A/B test math so forced rules never bias your experiment.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset((s) => TOOL_SOURCES.has(s), "A")}
            className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#5D726A] hover:bg-[#DCE2CF] font-medium cursor-pointer"
          >
            Preset: All 5 Tools → Funnel A
          </button>
          <button
            type="button"
            onClick={() => applyPreset((s) => AD_SOURCES.has(s), "B")}
            className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#5D726A] hover:bg-[#DCE2CF] font-medium cursor-pointer"
          >
            Preset: Sample Ads → Funnel B
          </button>
          <button
            type="button"
            onClick={() => applyPreset(() => true, "split")}
            className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#DCE2CF] font-medium cursor-pointer"
          >
            Reset all → A/B Split
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[hsl(6deg_100%_97%)] border border-[#BA5B3E] text-[#BA5B3E] text-[15px]">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="p-3 bg-[#EDF0E7] border border-[#5D726A] text-[#000000] text-[14px] font-medium">
          {notice}
        </div>
      )}

      {/* Rules Table */}
      <div className="bg-[#FFFFFF] border border-[#DFDFDF] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="bg-[#EDF0E7] border-b border-[#DCE2CF] text-[#292823]">
              <th className="py-3 px-4 font-medium">Source / Entry Button</th>
              <th className="py-3 px-3 font-medium">Group</th>
              <th className="py-3 px-3 text-right font-medium">Clicks</th>
              <th className="py-3 px-3 text-right font-medium">Leads</th>
              <th className="py-3 px-3 text-right font-medium">CR %</th>
              <th className="py-3 px-4 font-medium">Form to Open</th>
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
                  className={`border-b border-[#EDF0E7] ${isDirty ? "bg-[#FFF7D4]/50" : "hover:bg-[#F7F7F7]"}`}
                >
                  <td className="py-3 px-4">
                    <span className="block font-medium text-[#000000]">
                      {r.label ||
                        KNOWN_SOURCES.find((k) => k.source === r.source)?.label ||
                        r.source}
                    </span>
                    <code className="text-[12px] text-[#5D726A]">
                      {r.source === "*" ? "Fallback (*)" : `?source=${r.source}`}
                    </code>
                  </td>
                  <td className="py-3 px-3 text-[#5A5954] text-[13px]">{groupName(r.source)}</td>
                  <td className="py-3 px-3 text-right tabular-nums">{r.clicks}</td>
                  <td className="py-3 px-3 text-right tabular-nums font-semibold">{r.leads}</td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    {r.clicks > 0 ? formatPct(cr, 1) : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <div
                      role="group"
                      aria-label={`Destination for ${r.source}`}
                      className="inline-flex border border-[#BFBFBD] bg-[#F7F7F7] p-0.5"
                    >
                      {(
                        [
                          { id: "split", label: "A/B Split" },
                          { id: "A", label: "Funnel A (Cards)" },
                          { id: "B", label: "Funnel B (Typed)" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setDrafts((prev) => ({ ...prev, [r.source]: opt.id }))
                          }
                          className={`px-2.5 py-1.5 text-[12px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                            currentDest === opt.id
                              ? opt.id === "split"
                                ? "bg-[#292823] text-[#FFFFFF]"
                                : "bg-[#B8C49E] text-[#000000] font-semibold"
                              : "text-[#292823] hover:bg-[#DCE2CF]"
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

      {/* Add Custom Campaign Source */}
      <form
        onSubmit={handleAddCustom}
        className="bg-[#FFFFFF] border border-[#DFDFDF] p-5 space-y-3"
      >
        <h2 className="text-[16px] font-semibold text-[#000000]">
          Pre-register a campaign source link
        </h2>
        <p className="text-[13px] text-[#5A5954]">
          Planning an ad linking to <code className="bg-[#EDF0E7] px-1">/connect-agency?source=fb-oslo</code>? Register it here to lock its form destination before launching.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label htmlFor="new-src" className="block text-[13px] font-medium text-[#292823] mb-1">
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
              className="w-full min-h-[42px] px-3 bg-[#F7F7F7] border border-[#5D726A] text-[14px]"
            />
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="new-lbl" className="block text-[13px] font-medium text-[#292823] mb-1">
              Description
            </label>
            <input
              id="new-lbl"
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Facebook campaign Oslo Q4"
              className="w-full min-h-[42px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="new-dest" className="block text-[13px] font-medium text-[#292823] mb-1">
              Destination form
            </label>
            <select
              id="new-dest"
              value={newDest}
              onChange={(e) => setNewDest(e.target.value as RouteDestination)}
              className="w-full min-h-[42px] px-3 bg-[#F7F7F7] border border-[#5D726A] text-[14px]"
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
              className="w-full min-h-[42px] px-4 bg-[#B8C49E] hover:bg-[#C5D0AF] border border-[#5D726A] text-[#000000] text-[14px] font-semibold cursor-pointer"
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
    <Suspense fallback={<div className="p-6 text-[#5D726A]">Loading routing rules...</div>}>
      <RoutingInner />
    </Suspense>
  );
}

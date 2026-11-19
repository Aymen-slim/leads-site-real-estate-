"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KNOWN_SOURCES, VARIANT_META } from "@/lib/ab";
import type { LeadRow, LeadStatus } from "@/lib/leadsQuery";
import { DownloadCsvIcon, RefreshIcon } from "@/components/AdminIcons";

interface LeadsApiResponse {
  configured: boolean;
  leads: LeadRow[];
  total: number;
  page: number;
  limit: number;
  facets: {
    sources: string[];
    landing_pages: string[];
    cities: string[];
    utm_sources: string[];
  };
}

const STATUS_BADGE: Record<LeadStatus, string> = {
  new: "bg-[#EAF4EF] border-[#B6DCC8] text-[#14533C]",
  contacted: "bg-[#FEF6E2] border-[#ECD8A4] text-[#7A4E00]",
  won: "bg-[#0F291E] border-[#0F291E] text-[#FFFFFF]",
  lost: "bg-[#F3F5F4] border-[#DCE2DE] text-[#6B7D73]",
};

function LeadsInner() {
  const sp = useSearchParams();

  const range = sp.get("range") || "30d";
  const rangeFrom = sp.get("from") || "";
  const rangeTo = sp.get("to") || "";

  const [selectedSources, setSelectedSources] = useState<string[]>(() => {
    const raw = sp.get("source");
    return raw ? raw.split(",").filter(Boolean) : [];
  });
  const [landingPage, setLandingPage] = useState(() => sp.get("landingPage") || "");
  const [formVariant, setFormVariant] = useState("");
  const [routedFilter, setRoutedFilter] = useState("");
  const [landingVariant, setLandingVariant] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [city, setCity] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [useAllDates, setUseAllDates] = useState(false);
  const [page, setPage] = useState(1);

  const [data, setData] = useState<LeadsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeLead, setActiveLead] = useState<LeadRow | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const filterQs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("range", useAllDates ? "all" : range);
    if (!useAllDates && range === "custom" && rangeFrom && rangeTo) {
      p.set("from", rangeFrom);
      p.set("to", rangeTo);
    }
    if (selectedSources.length > 0) p.set("source", selectedSources.join(","));
    if (landingPage) p.set("landingPage", landingPage);
    if (formVariant) p.set("formVariant", formVariant);
    if (routedFilter) p.set("routed", routedFilter);
    if (landingVariant) p.set("landingVariant", landingVariant);
    if (propertyType) p.set("propertyType", propertyType);
    if (city) p.set("city", city);
    if (utmSource) p.set("utmSource", utmSource);
    if (status) p.set("status", status);
    if (searchText.trim()) p.set("q", searchText.trim());
    return p.toString();
  }, [
    useAllDates,
    range,
    rangeFrom,
    rangeTo,
    selectedSources,
    landingPage,
    formVariant,
    routedFilter,
    landingVariant,
    propertyType,
    city,
    utmSource,
    status,
    searchText,
  ]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads?${filterQs}&page=${page}&limit=50`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setData((await res.json()) as LeadsApiResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [filterQs, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const allSourceOptions = useMemo(() => {
    const map = new Map<string, { source: string; group: string; label: string }>();
    for (const k of KNOWN_SOURCES) {
      if (k.source !== "*") map.set(k.source, k);
    }
    for (const s of data?.facets.sources ?? []) {
      if (!map.has(s)) map.set(s, { source: s, group: "Campaign", label: s });
    }
    return Array.from(map.values());
  }, [data?.facets.sources]);

  const toggleSource = (src: string) => {
    setPage(1);
    setSelectedSources((prev) =>
      prev.includes(src) ? prev.filter((x) => x !== src) : [...prev, src]
    );
  };

  const resetFilters = () => {
    setSelectedSources([]);
    setLandingPage("");
    setFormVariant("");
    setRoutedFilter("");
    setLandingVariant("");
    setPropertyType("");
    setCity("");
    setUtmSource("");
    setStatus("");
    setSearchText("");
    setUseAllDates(false);
    setPage(1);
  };

  const updateLeadStatus = async (id: string, nextStatus: LeadStatus) => {
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    if (res.ok) {
      setData((prev) =>
        prev
          ? {
              ...prev,
              leads: prev.leads.map((l) => (l.id === id ? { ...l, status: nextStatus } : l)),
            }
          : prev
      );
      if (activeLead?.id === id) setActiveLead({ ...activeLead, status: nextStatus });
    }
  };

  const saveLeadNotes = async () => {
    if (!activeLead) return;
    setSavingNote(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeLead.id, notes: notesDraft }),
      });
      if (res.ok) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                leads: prev.leads.map((l) =>
                  l.id === activeLead.id ? { ...l, notes: notesDraft } : l
                ),
              }
            : prev
        );
        setActiveLead({ ...activeLead, notes: notesDraft });
      }
    } finally {
      setSavingNote(false);
    }
  };

  const formatTs = (iso: string) =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Oslo",
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  const sourceTitle = (src: string | null) => {
    const key = src || "nav";
    return KNOWN_SOURCES.find((k) => k.source === key)?.label ?? key;
  };

  const siteLabel = (v: string | null) =>
    v ? VARIANT_META.landing[v]?.short ?? v : "—";

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="space-y-6">
      {/* Header + CSV Download */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#0F291E]">
            Leads &amp; Submissions
          </h1>
          <p className="text-[14px] text-[#5B7065] mt-0.5">
            Filter leads by source button, site version, or form, and download filtered results as CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="h-10 px-3.5 rounded-full bg-[#FFFFFF] border border-[#D8E2DC] hover:bg-[#EAF4EF] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshIcon className={`w-3.5 h-3.5 text-[#147A53] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <a
            href={`/api/admin/leads/export?${filterQs}`}
            className="h-10 px-5 rounded-full bg-[#147A53] hover:bg-[#0D5E3F] text-[#FFFFFF] text-[13px] font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
          >
            <DownloadCsvIcon className="w-4 h-4" />
            <span>Download CSV ({data?.total ?? 0})</span>
          </a>
        </div>
      </div>

      {/* Filters Panel */}
      <section className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-5 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[14px] font-semibold text-[#0F291E]">Filter Leads</h2>
          <div className="flex items-center gap-4 text-[13px]">
            <label className="inline-flex items-center gap-2 cursor-pointer text-[#4B5F55]">
              <input
                type="checkbox"
                checked={useAllDates}
                onChange={(e) => {
                  setPage(1);
                  setUseAllDates(e.target.checked);
                }}
                className="accent-[#147A53] w-4 h-4"
              />
              <span>All dates</span>
            </label>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[#147A53] hover:text-[#0F291E] font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="f-search" className="block text-[12px] font-semibold text-[#5B7065] mb-1">
              Search name, phone or city
            </label>
            <input
              id="f-search"
              type="search"
              value={searchText}
              onChange={(e) => {
                setPage(1);
                setSearchText(e.target.value);
              }}
              placeholder="e.g. Henrik or 900..."
              className="w-full h-10 px-3.5 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="f-lv" className="block text-[12px] font-semibold text-[#5B7065] mb-1">
              Site Version Seen
            </label>
            <select
              id="f-lv"
              value={landingVariant}
              onChange={(e) => {
                setPage(1);
                setLandingVariant(e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            >
              <option value="">All site versions</option>
              <option value="A">Classic A</option>
              <option value="B">Classic B</option>
              <option value="M">Modern (VurderBoligen)</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-form" className="block text-[12px] font-semibold text-[#5B7065] mb-1">
              Form Shown
            </label>
            <select
              id="f-form"
              value={formVariant}
              onChange={(e) => {
                setPage(1);
                setFormVariant(e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            >
              <option value="">All forms</option>
              <option value="A">Funnel A (Tap Cards)</option>
              <option value="B">Funnel B (Typed 1-Page)</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-status" className="block text-[12px] font-semibold text-[#5B7065] mb-1">
              Lead Status
            </label>
            <select
              id="f-status"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-lp" className="block text-[12px] font-semibold text-[#5B7065] mb-1">
              Entry Landing Page
            </label>
            <select
              id="f-lp"
              value={landingPage}
              onChange={(e) => {
                setPage(1);
                setLandingPage(e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            >
              <option value="">All landing pages</option>
              {(data?.facets.landing_pages ?? []).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-routed" className="block text-[12px] font-semibold text-[#5B7065] mb-1">
              Routing Mode
            </label>
            <select
              id="f-routed"
              value={routedFilter}
              onChange={(e) => {
                setPage(1);
                setRoutedFilter(e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            >
              <option value="">Split + Forced</option>
              <option value="false">A/B Split only</option>
              <option value="true">Forced route only</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-ptype" className="block text-[12px] font-semibold text-[#5B7065] mb-1">
              Property Type
            </label>
            <select
              id="f-ptype"
              value={propertyType}
              onChange={(e) => {
                setPage(1);
                setPropertyType(e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            >
              <option value="">All types</option>
              <option value="house">House / Villa</option>
              <option value="land">Plot of Land</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-city" className="block text-[12px] font-semibold text-[#5B7065] mb-1">
              City
            </label>
            <select
              id="f-city"
              value={city}
              onChange={(e) => {
                setPage(1);
                setCity(e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#F7FAF8] border border-[#D4DFD8] focus:border-[#147A53] outline-none text-[14px]"
            >
              <option value="">All cities</option>
              {(data?.facets.cities ?? []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multi-select Source Chips */}
        <div className="pt-3 border-t border-[#EDF2EF] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5B7065]">
              Filter by Source (button / calculator / ad):
            </span>
            {selectedSources.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  setSelectedSources([]);
                }}
                className="text-[12px] font-semibold text-[#147A53] cursor-pointer"
              >
                Clear ({selectedSources.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allSourceOptions.map((opt) => {
              const active = selectedSources.includes(opt.source);
              return (
                <button
                  key={opt.source}
                  type="button"
                  onClick={() => toggleSource(opt.source)}
                  title={`${opt.group}: ${opt.label}`}
                  className={`px-3 py-1 rounded-full text-[12px] border cursor-pointer transition-all ${
                    active
                      ? "bg-[#0F291E] border-[#0F291E] text-[#FFFFFF] font-semibold shadow-2xs"
                      : "bg-[#F4F7F5] border-[#DCE5DF] text-[#273930] hover:bg-[#EAF4EF] hover:border-[#B6DCC8]"
                  }`}
                >
                  {opt.source}
                </button>
              );
            })}
          </div>

          {(data?.facets.utm_sources ?? []).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label htmlFor="f-utm" className="text-[12px] font-semibold text-[#5B7065]">
                UTM Source:
              </label>
              <select
                id="f-utm"
                value={utmSource}
                onChange={(e) => {
                  setPage(1);
                  setUtmSource(e.target.value);
                }}
                className="px-3 py-1 rounded-full bg-[#F7FAF8] border border-[#D4DFD8] text-[12px]"
              >
                <option value="">All UTM</option>
                {data?.facets.utm_sources.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {error && (
        <div role="alert" className="p-4 rounded-2xl bg-[#FEF2F0] border border-[#F0C2B9] text-[#B8422C] text-[14px]">
          {error}
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(15,41,30,0.03),0_8px_24px_rgba(15,41,30,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#F7FAF8] border-b border-[#E6ECE8] text-[#5B7065] text-[12px] uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Date</th>
                <th className="py-3.5 px-3 font-semibold">Seller</th>
                <th className="py-3.5 px-3 font-semibold">Property &amp; Location</th>
                <th className="py-3.5 px-3 font-semibold">Came From</th>
                <th className="py-3.5 px-3 font-semibold">Site / Form</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 px-5 text-right font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {(data?.leads ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6E8278]">
                    {loading ? "Loading leads..." : "No leads match these filters."}
                  </td>
                </tr>
              ) : (
                data?.leads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-[#F1F5F2] last:border-0 hover:bg-[#F7FAF8] transition-colors"
                  >
                    <td className="py-3.5 px-5 whitespace-nowrap text-[13px] tabular-nums text-[#63786D]">
                      {formatTs(l.created_at)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="block font-semibold text-[#0F291E]">{l.name}</span>
                      <a
                        href={`tel:${l.phone.replace(/\s+/g, "")}`}
                        className="text-[13px] tabular-nums text-[#147A53] hover:underline font-medium"
                      >
                        {l.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-3 text-[13px]">
                      <span className="block text-[#0F291E] font-medium">
                        {l.property_text ||
                          [l.property_type, l.size].filter(Boolean).join(" · ") ||
                          "—"}
                      </span>
                      <span className="block text-[#63786D]">
                        {l.location_text ||
                          [l.city, l.area].filter(Boolean).join(" — ") ||
                          "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[13px]">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EAF4EF] text-[#14533C] font-mono text-[11px] font-semibold">
                        {l.source || "nav"}
                      </span>
                      <span className="block text-[12px] text-[#5B7065] mt-0.5">
                        {sourceTitle(l.source)}
                      </span>
                      {l.landing_page && (
                        <span className="block text-[11px] text-[#7D9186]">
                          1st: {l.landing_page}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-[12px]">
                      <span className="block font-semibold text-[#0F291E]">
                        {siteLabel(l.landing_variant)} · Form {l.form_variant || "?"}
                      </span>
                      <span className="block text-[#63786D]">
                        {l.routed ? "Forced route" : "A/B split"}
                        {l.utm_source ? ` · ${l.utm_source}` : ""}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        aria-label={`Status for ${l.name}`}
                        value={l.status}
                        onChange={(e) =>
                          void updateLeadStatus(l.id, e.target.value as LeadStatus)
                        }
                        className={`px-3 py-1 rounded-full text-[12px] font-semibold border cursor-pointer outline-none ${
                          STATUS_BADGE[l.status]
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveLead(l);
                          setNotesDraft(l.notes || "");
                        }}
                        className="px-3 py-1 rounded-full bg-[#F4F7F5] hover:bg-[#EAF4EF] border border-[#D8E2DC] text-[12px] font-semibold text-[#0F291E] cursor-pointer transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[#5B7065]">
            Page {page} of {totalPages} ({data?.total ?? 0} leads)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D8E2DC] font-semibold disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D8E2DC] font-semibold disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modern Slide-Over Lead Inspector Drawer */}
      {activeLead && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
          className="fixed inset-0 z-50 bg-[#0F291E]/40 backdrop-blur-[2px] flex justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveLead(null);
          }}
        >
          <div className="w-full max-w-lg bg-[#FFFFFF] h-full p-6 sm:p-7 shadow-2xl overflow-y-auto space-y-6 border-l border-[#DCE5DF]">
            <div className="flex items-start justify-between gap-4 border-b border-[#EDF2EF] pb-4">
              <div>
                <h2
                  id="lead-modal-title"
                  className="font-display text-[25px] font-semibold text-[#0F291E]"
                >
                  {activeLead.name}
                </h2>
                <p className="text-[14px] tabular-nums text-[#147A53] font-semibold mt-0.5">
                  {activeLead.phone} · {formatTs(activeLead.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="px-3.5 py-1.5 rounded-full bg-[#F4F7F5] hover:bg-[#EAF4EF] border border-[#D8E2DC] text-[13px] font-semibold text-[#0F291E] cursor-pointer"
              >
                Close
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-3.5 text-[14px] rounded-2xl bg-[#F7FAF8] p-4 border border-[#E4ECE7]">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#63786D]">
                  Source CTA
                </dt>
                <dd className="font-mono font-semibold text-[#0F291E] mt-0.5">
                  {activeLead.source || "nav"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#63786D]">
                  First Landing Page
                </dt>
                <dd className="font-mono text-[#0F291E] mt-0.5">
                  {activeLead.landing_page || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#63786D]">
                  Site Version
                </dt>
                <dd className="font-semibold text-[#0F291E] mt-0.5">
                  {siteLabel(activeLead.landing_variant)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#63786D]">
                  Form Shown
                </dt>
                <dd className="font-semibold text-[#0F291E] mt-0.5">
                  Funnel {activeLead.form_variant} ({activeLead.routed ? "Forced" : "Split"})
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#63786D]">
                  Property
                </dt>
                <dd className="text-[#14201A] mt-0.5">
                  {activeLead.property_text ||
                    [activeLead.property_type, activeLead.size].filter(Boolean).join(" · ") ||
                    "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#63786D]">
                  Location
                </dt>
                <dd className="text-[#14201A] mt-0.5">
                  {activeLead.location_text ||
                    [activeLead.city, activeLead.area].filter(Boolean).join(" — ") ||
                    "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#63786D]">
                  Timeline
                </dt>
                <dd className="text-[#14201A] mt-0.5">{activeLead.timeline || "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#63786D]">
                  Language / UTM
                </dt>
                <dd className="text-[#14201A] mt-0.5">
                  {activeLead.lang || "en"}
                  {activeLead.utm_source ? ` · ${activeLead.utm_source}` : ""}
                </dd>
              </div>
            </dl>

            {activeLead.details && Object.keys(activeLead.details).length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#5B7065]">
                  Pre-filled Calculator Details
                </h3>
                <pre className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E4ECE7] text-[12px] overflow-x-auto text-[#0F291E]">
                  {JSON.stringify(activeLead.details, null, 2)}
                </pre>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="lead-notes"
                className="block text-[13px] font-semibold uppercase tracking-wider text-[#5B7065]"
              >
                Internal Notes
              </label>
              <textarea
                id="lead-notes"
                rows={4}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Call outcome, broker assigned, follow-up date..."
                className="w-full p-3.5 rounded-xl bg-[#F7FAF8] border border-[#CFDAD3] focus:border-[#147A53] outline-none text-[14px]"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={savingNote}
                  onClick={() => void saveLeadNotes()}
                  className="h-10 px-5 rounded-full bg-[#147A53] hover:bg-[#0D5E3F] text-[#FFFFFF] text-[13px] font-semibold cursor-pointer transition-colors disabled:opacity-60"
                >
                  {savingNote ? "Saving..." : "Save notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#147A53]">Loading leads...</div>}>
      <LeadsInner />
    </Suspense>
  );
}

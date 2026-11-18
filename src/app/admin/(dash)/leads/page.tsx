"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KNOWN_SOURCES } from "@/lib/ab";
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
  new: "bg-[#B8C49E] border-[#5D726A] text-[#000000]",
  contacted: "bg-[#FFF7D4] border-[#BFBFBD] text-[#000000]",
  won: "bg-[#5D726A] border-[#43544E] text-[#FFFFFF]",
  lost: "bg-[#F7F7F7] border-[#BFBFBD] text-[#5A5954]",
};

function LeadsInner() {
  const sp = useSearchParams();

  // Read global date range from URL + initialize optional source filter from URL (?source=...)
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
      if (!map.has(s)) map.set(s, { source: s, group: "Campaign / Custom", label: s });
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

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="space-y-5">
      {/* Header + CSV Download Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[32px] leading-tight text-[#000000]">
            Leads &amp; Form Submissions
          </h1>
          <p className="text-[15px] text-[#5A5954]">
            Filter leads by which button, tool, or page they came from, and export filtered results to CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="min-h-[44px] px-3.5 py-2 bg-[#FFFFFF] border border-[#BFBFBD] hover:bg-[#EDF0E7] text-[14px] font-medium inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <a
            href={`/api/admin/leads/export?${filterQs}`}
            className="min-h-[44px] px-4 py-2 bg-[#B8C49E] hover:bg-[#C5D0AF] border border-[#5D726A] text-[#000000] text-[14px] font-semibold inline-flex items-center gap-2"
          >
            <DownloadCsvIcon className="w-4 h-4" />
            <span>Download CSV ({data?.total ?? 0})</span>
          </a>
        </div>
      </div>

      {/* Filters Panel */}
      <section className="bg-[#FFFFFF] border border-[#DFDFDF] p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-[#000000]">
            Filter Leads
          </h2>
          <div className="flex items-center gap-4 text-[13px]">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useAllDates}
                onChange={(e) => {
                  setPage(1);
                  setUseAllDates(e.target.checked);
                }}
                className="accent-[#5D726A] w-4 h-4"
              />
              <span>All dates (ignore top date range)</span>
            </label>
            <button
              type="button"
              onClick={resetFilters}
              className="underline decoration-[#5D726A] text-[#000000] font-medium cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="f-search" className="block text-[12px] font-medium text-[#5A5954] mb-1">
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
              className="w-full min-h-[40px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="f-lp" className="block text-[12px] font-medium text-[#5A5954] mb-1">
              Entry Landing Page
            </label>
            <select
              id="f-lp"
              value={landingPage}
              onChange={(e) => {
                setPage(1);
                setLandingPage(e.target.value);
              }}
              className="w-full min-h-[40px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
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
            <label htmlFor="f-form" className="block text-[12px] font-medium text-[#5A5954] mb-1">
              Form Shown
            </label>
            <select
              id="f-form"
              value={formVariant}
              onChange={(e) => {
                setPage(1);
                setFormVariant(e.target.value);
              }}
              className="w-full min-h-[40px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
            >
              <option value="">All forms</option>
              <option value="A">Funnel A (Tap Cards)</option>
              <option value="B">Funnel B (Typed 1-Page)</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-status" className="block text-[12px] font-medium text-[#5A5954] mb-1">
              Lead Status
            </label>
            <select
              id="f-status"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              className="w-full min-h-[40px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-routed" className="block text-[12px] font-medium text-[#5A5954] mb-1">
              Routing Mode
            </label>
            <select
              id="f-routed"
              value={routedFilter}
              onChange={(e) => {
                setPage(1);
                setRoutedFilter(e.target.value);
              }}
              className="w-full min-h-[40px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
            >
              <option value="">Split + Forced</option>
              <option value="false">A/B Split only</option>
              <option value="true">Forced route only</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-lv" className="block text-[12px] font-medium text-[#5A5954] mb-1">
              Home Variant Seen
            </label>
            <select
              id="f-lv"
              value={landingVariant}
              onChange={(e) => {
                setPage(1);
                setLandingVariant(e.target.value);
              }}
              className="w-full min-h-[40px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
            >
              <option value="">A &amp; B</option>
              <option value="A">Landing A</option>
              <option value="B">Landing B</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-ptype" className="block text-[12px] font-medium text-[#5A5954] mb-1">
              Property Type
            </label>
            <select
              id="f-ptype"
              value={propertyType}
              onChange={(e) => {
                setPage(1);
                setPropertyType(e.target.value);
              }}
              className="w-full min-h-[40px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
            >
              <option value="">All types</option>
              <option value="house">House / Villa</option>
              <option value="land">Plot of Land</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-city" className="block text-[12px] font-medium text-[#5A5954] mb-1">
              City
            </label>
            <select
              id="f-city"
              value={city}
              onChange={(e) => {
                setPage(1);
                setCity(e.target.value);
              }}
              className="w-full min-h-[40px] px-3 bg-[#F7F7F7] border border-[#BFBFBD] text-[14px]"
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

        {/* Multi-select Source Filter Chips ("filter from which form/button it came") */}
        <div className="pt-2 border-t border-[#EDF0E7] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-[#292823]">
              Filter by Source (where the lead came from):
            </span>
            {selectedSources.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  setSelectedSources([]);
                }}
                className="text-[12px] underline text-[#5D726A] cursor-pointer"
              >
                Clear source filter ({selectedSources.length})
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
                  className={`px-2.5 py-1 text-[12px] border cursor-pointer transition-colors ${
                    active
                      ? "bg-[#292823] border-[#292823] text-[#FFFFFF] font-semibold"
                      : "bg-[#EDF0E7] border-[#DCE2CF] text-[#000000] hover:bg-[#DCE2CF]"
                  }`}
                >
                  {opt.source}
                </button>
              );
            })}
          </div>

          {(data?.facets.utm_sources ?? []).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label htmlFor="f-utm" className="text-[12px] font-medium text-[#5A5954]">
                UTM Source:
              </label>
              <select
                id="f-utm"
                value={utmSource}
                onChange={(e) => {
                  setPage(1);
                  setUtmSource(e.target.value);
                }}
                className="px-2.5 py-1 bg-[#F7F7F7] border border-[#BFBFBD] text-[13px]"
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
        <div role="alert" className="p-4 bg-[hsl(6deg_100%_97%)] border border-[#BA5B3E] text-[#BA5B3E] text-[15px]">
          {error}
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-[#FFFFFF] border border-[#DFDFDF] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="bg-[#EDF0E7] border-b border-[#DCE2CF] text-[#292823]">
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-3 font-medium">Seller</th>
              <th className="py-3 px-3 font-medium">Property &amp; Location</th>
              <th className="py-3 px-3 font-medium">Came From (Source)</th>
              <th className="py-3 px-3 font-medium">Form / Variants</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-4 text-right font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {(data?.leads ?? []).length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#5A5954]">
                  {loading ? "Loading leads..." : "No leads match these filters."}
                </td>
              </tr>
            ) : (
              data?.leads.map((l) => (
                <tr key={l.id} className="border-b border-[#EDF0E7] hover:bg-[#F7F7F7]">
                  <td className="py-3 px-4 whitespace-nowrap text-[13px] tabular-nums text-[#5A5954]">
                    {formatTs(l.created_at)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="block font-semibold text-[#000000]">{l.name}</span>
                    <a
                      href={`tel:${l.phone.replace(/\s+/g, "")}`}
                      className="text-[13px] tabular-nums text-[#5D726A] underline"
                    >
                      {l.phone}
                    </a>
                  </td>
                  <td className="py-3 px-3 text-[13px]">
                    <span className="block text-[#000000] font-medium">
                      {l.property_text ||
                        [l.property_type, l.size].filter(Boolean).join(" · ") ||
                        "—"}
                    </span>
                    <span className="block text-[#5A5954]">
                      {l.location_text ||
                        [l.city, l.area].filter(Boolean).join(" — ") ||
                        "—"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[13px]">
                    <span className="inline-block px-2 py-0.5 bg-[#EDF0E7] border border-[#DCE2CF] font-mono text-[12px] text-[#000000]">
                      {l.source || "nav"}
                    </span>
                    <span className="block text-[12px] text-[#5A5954] mt-0.5">
                      {sourceTitle(l.source)}
                    </span>
                    {l.landing_page && (
                      <span className="block text-[11px] text-[#5A5954]">
                        1st page: {l.landing_page}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[12px]">
                    <span className="block font-medium text-[#000000]">
                      Form {l.form_variant || "?"}{" "}
                      <span className="text-[#5A5954]">
                        ({l.routed ? "Forced" : "Split"})
                      </span>
                    </span>
                    <span className="block text-[#5A5954]">
                      Home: {l.landing_variant || "?"}
                      {l.utm_source ? ` · utm:${l.utm_source}` : ""}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      aria-label={`Status for ${l.name}`}
                      value={l.status}
                      onChange={(e) =>
                        void updateLeadStatus(l.id, e.target.value as LeadStatus)
                      }
                      className={`px-2 py-1 text-[12px] font-semibold border cursor-pointer ${
                        STATUS_BADGE[l.status]
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLead(l);
                        setNotesDraft(l.notes || "");
                      }}
                      className="px-2.5 py-1 bg-[#FFFFFF] border border-[#5D726A] hover:bg-[#DCE2CF] text-[12px] font-medium cursor-pointer"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-[#5A5954]">
            Page {page} of {totalPages} ({data?.total ?? 0} total leads)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-[#FFFFFF] border border-[#BFBFBD] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 bg-[#FFFFFF] border border-[#BFBFBD] disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Lead Inspector Modal */}
      {activeLead && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
          className="fixed inset-0 z-50 bg-[#000000]/45 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-xl bg-[#FFFFFF] border-2 border-[#5D726A] p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#EDF0E7] pb-3">
              <div>
                <h2 id="lead-modal-title" className="font-serif text-[26px] text-[#000000]">
                  {activeLead.name}
                </h2>
                <p className="text-[15px] tabular-nums text-[#5D726A] font-medium">
                  {activeLead.phone} · {formatTs(activeLead.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="px-3 py-1.5 bg-[#EDF0E7] border border-[#BFBFBD] text-[13px] font-medium cursor-pointer"
              >
                Close
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-[14px] bg-[#EDF0E7] p-4 border border-[#DCE2CF]">
              <div>
                <dt className="text-[12px] text-[#5A5954]">Source CTA</dt>
                <dd className="font-mono font-semibold text-[#000000]">
                  {activeLead.source || "nav"}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5A5954]">First Landing Page</dt>
                <dd className="font-mono text-[#000000]">{activeLead.landing_page || "—"}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5A5954]">Form Shown</dt>
                <dd className="font-medium text-[#000000]">
                  Funnel {activeLead.form_variant} ({activeLead.routed ? "Forced" : "A/B Split"})
                </dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5A5954]">Home Variant</dt>
                <dd className="font-medium text-[#000000]">{activeLead.landing_variant || "—"}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5A5954]">Property</dt>
                <dd className="text-[#000000]">
                  {activeLead.property_text ||
                    [activeLead.property_type, activeLead.size].filter(Boolean).join(" · ") ||
                    "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5A5954]">Location</dt>
                <dd className="text-[#000000]">
                  {activeLead.location_text ||
                    [activeLead.city, activeLead.area].filter(Boolean).join(" — ") ||
                    "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5A5954]">Timeline</dt>
                <dd className="text-[#000000]">{activeLead.timeline || "—"}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5A5954]">Language / UTM</dt>
                <dd className="text-[#000000]">
                  {activeLead.lang || "en"}
                  {activeLead.utm_source ? ` · ${activeLead.utm_source}` : ""}
                </dd>
              </div>
            </dl>

            {activeLead.details && Object.keys(activeLead.details).length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-[14px] font-semibold text-[#000000]">
                  Pre-filled Calculator Values
                </h3>
                <pre className="p-3 bg-[#F7F7F7] border border-[#DFDFDF] text-[12px] overflow-x-auto">
                  {JSON.stringify(activeLead.details, null, 2)}
                </pre>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="lead-notes" className="block text-[14px] font-semibold text-[#000000]">
                Internal Notes
              </label>
              <textarea
                id="lead-notes"
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Call outcome, broker assigned, follow-up date..."
                className="w-full p-3 bg-[#F7F7F7] border border-[#5D726A] text-[14px]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={savingNote}
                  onClick={() => void saveLeadNotes()}
                  className="px-4 py-2 bg-[#B8C49E] hover:bg-[#C5D0AF] border border-[#5D726A] text-[#000000] text-[14px] font-semibold cursor-pointer disabled:opacity-60"
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
    <Suspense fallback={<div className="p-6 text-[#5D726A]">Loading leads...</div>}>
      <LeadsInner />
    </Suspense>
  );
}

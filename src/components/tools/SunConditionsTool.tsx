"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { NORWAY_CITIES } from "@/data/norwayData";
import {
  HORIZON_OPTIONS,
  SOLAR_DIRECTIONS,
  calculateSunProfile,
} from "@/data/norwayToolsData";
import { CheckMarkIcon, LocationCrosshairIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

interface AddressHit {
  label: string;
  municipality: string;
  lat: number;
  lng: number;
}

export function SunConditionsTool() {
  const { lang, isModern } = useApp();

  const [cityId, setCityId] = useState<string>(NORWAY_CITIES[0].id);
  const [directionId, setDirectionId] = useState<string>("SW");
  const [horizonId, setHorizonId] = useState<string>("suburban");
  const [customCoords, setCustomCoords] = useState<{
    label: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>("");

  // Optional live Kartverket address search
  const [addressQuery, setAddressQuery] = useState<string>("");
  const [addressHits, setAddressHits] = useState<AddressHit[]>([]);
  const [searchingAddr, setSearchingAddr] = useState<boolean>(false);

  const selectedCity =
    NORWAY_CITIES.find((c) => c.id === cityId) || NORWAY_CITIES[0];
  const defaultArea = selectedCity.neighborhoods[0];
  const activeLat = customCoords?.lat ?? defaultArea.lat;
  const activeLng = customCoords?.lng ?? defaultArea.lng;
  const activePlaceLabel = customCoords?.label ?? `${selectedCity.name} (${activeLat.toFixed(2)}°N)`;

  const direction =
    SOLAR_DIRECTIONS.find((d) => d.id === directionId) || SOLAR_DIRECTIONS[5];
  const horizon =
    HORIZON_OPTIONS.find((h) => h.id === horizonId) || HORIZON_OPTIONS[1];

  const seasons = useMemo(
    () => calculateSunProfile(activeLat, activeLng, direction.azimuth, horizon.minElevationDeg),
    [activeLat, activeLng, direction.azimuth, horizon.minElevationDeg]
  );

  const summer = seasons.find((s) => s.key === "summer") || seasons[1];

  const handleCitySelect = (nextCityId: string) => {
    setCityId(nextCityId);
    setCustomCoords(null);
    setGpsStatus("");
  };

  const handleGps = () => {
    setGpsStatus(lang === "no" ? "Finner din posisjon..." : "Detecting GPS coordinates...");
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomCoords({
            label:
              lang === "no"
                ? `Din GPS-posisjon (${pos.coords.latitude.toFixed(2)}°N)`
                : `Your GPS Position (${pos.coords.latitude.toFixed(2)}°N)`,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGpsStatus(lang === "no" ? "GPS-posisjon brukt" : "GPS coordinates applied");
        },
        () => {
          setGpsStatus(
            lang === "no"
              ? "Kunne ikke lese GPS — bruker valgt by."
              : "Could not access GPS — using selected city."
          );
        },
        { timeout: 5000 }
      );
    }
  };

  const handleAddressLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addressQuery.trim().length < 3) return;
    setSearchingAddr(true);
    try {
      const res = await fetch(
        `/api/norway/address?q=${encodeURIComponent(addressQuery.trim())}`
      );
      if (res.ok) {
        const json = (await res.json()) as { results?: AddressHit[] };
        setAddressHits(json.results || []);
      }
    } catch {
      setAddressHits([]);
    } finally {
      setSearchingAddr(false);
    }
  };

  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  return (
    <ToolShell
      slug="sun-conditions"
      iconKey="sun-conditions"
      title={
        lang === "no"
          ? "Solforhold Kalkulator for Terrasse og Hage"
          : "Property Sunlight & Terrace Sun Hours Calculator"
      }
      subtitle={
        lang === "no"
          ? "Se nøyaktig når solen treffer terrassen og når den går ned i din by og hvordan kveldssol påvirker boligprisen."
          : "Calculate direct terrace sun hours and sunset times on March 21, June 21, September 21, and December 21 by Norwegian latitude — with live Kartverket address lookup."
      }
      ctaSource="sun-conditions"
      ctaHref={`/koble-til-megler?source=sun-conditions&type=house&city=${selectedCity.id}&sunHours=${summer.directHours}`}
      ctaLabel={
        lang === "no"
          ? `Gode solforhold gir opptil +${direction.eveningSunPremiumPct} % høyere betalingsvilje — få lokal verdivurdering`
          : `Strong sunlight boosts buyer demand by up to +${direction.eveningSunPremiumPct}% — get a free local valuation`
      }
    >
      <div className={panelClass}>
        {/* Location: City Dropdown + 1-Tap GPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label
              htmlFor="sun-city"
              className={`block text-[18px] sm:text-xl mb-2 ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "1. Velg by (breddegrad)" : "1. Select City (Latitude)"}
            </label>
            <select
              id="sun-city"
              value={cityId}
              onChange={(e) => handleCitySelect(e.target.value)}
              className={`w-full min-h-[60px] px-4 py-3 text-[19px] font-semibold bg-[#FFFFFF] border-2 text-[#000000] cursor-pointer ${
                isModern
                  ? "border-[#9EB6AA] focus:border-[#147A53] rounded-xl"
                  : "border-[#5D726A] rounded-none"
              }`}
            >
              {NORWAY_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.neighborhoods[0].lat.toFixed(1)}° N)
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGps}
              className={`w-full min-h-[60px] px-4 py-3 border-2 text-[16px] sm:text-[17px] font-semibold inline-flex items-center justify-center gap-2.5 cursor-pointer transition-colors ${
                isModern
                  ? "rounded-xl bg-[#FFFFFF] border-[#147A53] text-[#0F3D2E] hover:bg-[#E6F2EC]"
                  : "rounded-none bg-[#FFFFFF] border-[#5D726A] text-[#000000] hover:bg-[#DCE2CF]"
              }`}
            >
              <LocationCrosshairIcon className="w-5 h-5 shrink-0" />
              <span>
                {lang === "no" ? "Bruk min GPS-posisjon nå" : "Use My Live GPS Location"}
              </span>
            </button>
            {gpsStatus && (
              <p className="text-[13px] mt-1.5 text-[#3B4D44] font-medium">{gpsStatus}</p>
            )}
          </div>
        </div>

        {/* Optional Live Kartverket Address Lookup */}
        <form onSubmit={handleAddressLookup} className="space-y-2">
          <label
            htmlFor="sun-kartverket"
            className={`block text-[14px] font-semibold ${
              isModern ? "text-[#3B4D44]" : "text-[#292823]"
            }`}
          >
            {lang === "no"
              ? "Valgfritt: Søk eksakt norsk gateadresse via Kartverket"
              : "Optional: Look up exact Norwegian street address via Kartverket"}
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              id="sun-kartverket"
              type="search"
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              placeholder={lang === "no" ? "F.eks. Bygdøy allé 12, Oslo" : "e.g. Bygdøy allé 12, Oslo"}
              className={`flex-1 min-h-[48px] px-4 bg-[#FFFFFF] border text-[16px] text-[#000000] ${
                isModern ? "rounded-xl border-[#B8C2AE]" : "rounded-none border-[#BFBFBD]"
              }`}
            />
            <button
              type="submit"
              disabled={searchingAddr}
              className={`min-h-[48px] px-5 font-semibold text-[15px] cursor-pointer ${
                isModern
                  ? "rounded-xl bg-[#243323] text-[#FFFFFF] hover:bg-[#172216]"
                  : "rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] hover:bg-[#B8C49E]"
              }`}
            >
              {searchingAddr
                ? lang === "no"
                  ? "Søker..."
                  : "Searching..."
                : lang === "no"
                ? "Søk adresse"
                : "Find Address"}
            </button>
          </div>
          {addressHits.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {addressHits.map((hit) => (
                <button
                  key={hit.label}
                  type="button"
                  onClick={() => {
                    setCustomCoords({ label: hit.label, lat: hit.lat, lng: hit.lng });
                    setAddressHits([]);
                  }}
                  className={`px-3 py-1.5 text-[14px] font-medium border cursor-pointer ${
                    isModern
                      ? "rounded-full bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                      : "rounded-none bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  }`}
                >
                  {hit.label}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Compass Direction Tap Grid */}
        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <p
            className={`text-[18px] sm:text-xl mb-3 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no"
              ? "2. Hvilken retning vender terrassen / hagen mot?"
              : "2. Which Compass Direction Does Your Terrace / Garden Face?"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {SOLAR_DIRECTIONS.map((d) => {
              const active = directionId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDirectionId(d.id)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[68px] p-3.5 border-2 text-left flex flex-col justify-between ${
                    active
                      ? isModern
                        ? "bg-[#147A53] border-[#0F3D2E] text-[#FFFFFF]"
                        : "bg-[#B8C49E] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#121C17]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#000000]"
                  }`}
                >
                  <span className="text-[19px] font-bold">
                    {lang === "no" ? d.shortNo : d.shortEn}
                  </span>
                  <span className="text-[13px] opacity-90 leading-snug mt-0.5">
                    {lang === "no" ? d.labelNo : d.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizon Obstruction */}
        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <p
            className={`text-[17px] sm:text-lg mb-3 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no" ? "3. Omgivelser og skyggeforhold" : "3. Surroundings & Horizon Obstruction"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HORIZON_OPTIONS.map((h) => {
              const active = horizonId === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHorizonId(h.id)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[72px] p-4 border-2 text-left flex items-center justify-between gap-2 ${
                    active
                      ? isModern
                        ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                        : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                  }`}
                >
                  <div>
                    <span className="block text-[15px] font-semibold">
                      {lang === "no" ? h.labelNo : h.labelEn}
                    </span>
                    <span className="block text-[13px] opacity-80 mt-0.5">
                      {lang === "no" ? h.descNo : h.descEn}
                    </span>
                  </div>
                  {active && (
                    <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Headline Summer Result + Visual Seasonal Bars */}
      <div
        className={`overflow-hidden ${
          isModern
            ? "bg-[#FFFFFF] border-2 border-[#147A53] rounded-2xl"
            : "bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none"
        }`}
      >
        <div
          className={`p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isModern
              ? "bg-[#E6F2EC] border-b border-[#9EB6AA]"
              : "bg-[#DCE2CF] border-b-2 border-[#5D726A]"
          }`}
        >
          <div>
            <span className={`block text-[14px] font-semibold ${isModern ? "text-[#0F3D2E]" : "text-[#292823]"}`}>
              {activePlaceLabel} · {lang === "no" ? direction.labelNo : direction.labelEn}
            </span>
            <h2 className="text-[22px] sm:text-3xl font-semibold text-[#000000] mt-1">
              {lang === "no"
                ? `Direkte sol på terrassen 21. juni: ${summer.directHours.toFixed(1).replace(".", ",")} timer`
                : `Direct Terrace Sun on June 21: ${summer.directHours.toFixed(1)} hours`}
            </h2>
            <p className={`text-[15px] mt-1 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {lang === "no"
                ? `Sol på uteplassen kl. ${summer.directStartStr} – ${summer.directEndStr} · Solnedgang ${summer.sunsetStr}`
                : `Direct sun ${summer.directStartStr} – ${summer.directEndStr} · Sunset ${summer.sunsetStr}`}
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <span className={`block text-[13px] font-medium ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {lang === "no" ? "Verdiindikator kveldssol" : "Buyer Sun Premium"}
            </span>
            <span
              className={`block text-[30px] sm:text-4xl font-semibold tabular-nums ${
                isModern ? "text-[#147A53]" : "text-[#000000]"
              }`}
            >
              +{direction.eveningSunPremiumPct} %
            </span>
          </div>
        </div>

        {/* 4-Season Breakdown Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {seasons.map((s) => {
            const barPct = Math.min(100, Math.round((s.directHours / 16) * 100));
            return (
              <div
                key={s.key}
                className={`p-4 space-y-2.5 border ${
                  isModern
                    ? "rounded-xl bg-[#F8FAF9] border-[#DCE5DF]"
                    : "rounded-none bg-[#EDF0E7]/60 border-[#DCE2CF]"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="font-semibold text-[17px] text-[#000000]">
                      {lang === "no" ? s.labelNo : s.labelEn}
                    </span>
                    <span className="ml-2 text-[13px] text-[#5D726A]">
                      ({lang === "no" ? s.dateNo : s.dateEn})
                    </span>
                  </div>
                  <span className="font-semibold text-[18px] tabular-nums text-[#000000]">
                    {s.directHours.toFixed(1).replace(".", ",")} t
                  </span>
                </div>

                <div
                  className={`h-2.5 w-full overflow-hidden ${
                    isModern ? "bg-[#DCE5DF] rounded-full" : "bg-[#DCE2CF] rounded-none"
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      isModern ? "bg-[#147A53] rounded-full" : "bg-[#5D726A] rounded-none"
                    }`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>

                <div className="flex flex-wrap justify-between gap-2 text-[13px] text-[#292823] tabular-nums">
                  <span>
                    {lang === "no" ? "Direkte sol:" : "Direct:"}{" "}
                    <strong>
                      {s.directHours > 0 ? `${s.directStartStr}–${s.directEndStr}` : "—"}
                    </strong>
                  </span>
                  <span>
                    {lang === "no" ? "Dag:" : "Day:"} {s.sunriseStr}–{s.sunsetStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolShell>
  );
}

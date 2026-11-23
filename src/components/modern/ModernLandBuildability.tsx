"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  LAND_SIZE_OPTIONS,
  LAND_ZONE_OPTIONS,
  NORWAY_CITIES,
  formatNok,
} from "@/data/norwayData";
import { LandPlotIcon, ArrowRightIcon, CheckMarkIcon } from "@/components/Icons";

export function ModernLandBuildability() {
  const { lang, trackClick, t } = useApp();

  const [sizeId, setSizeId] = useState<string>(LAND_SIZE_OPTIONS[1].id);
  const [zoneId, setZoneId] = useState<string>(LAND_ZONE_OPTIONS[1].id);
  const [cityId, setCityId] = useState<string>(NORWAY_CITIES[0].id);

  const selectedSize =
    LAND_SIZE_OPTIONS.find((s) => s.id === sizeId) || LAND_SIZE_OPTIONS[1];
  const selectedZone =
    LAND_ZONE_OPTIONS.find((z) => z.id === zoneId) || LAND_ZONE_OPTIONS[1];
  const selectedCity =
    NORWAY_CITIES.find((c) => c.id === cityId) || NORWAY_CITIES[0];

  const baseLandM2 = selectedCity.neighborhoods[0].landPriceM2;
  const maxConstructibleBra = Math.round(
    selectedSize.avgSqm * selectedZone.braFactor
  );
  const estimatedLandValue = Math.round(
    selectedSize.avgSqm * baseLandM2 * selectedZone.valueMultiplier
  );
  const braRatioPct = Math.min(100, Math.round(selectedZone.braFactor * 75));

  return (
    <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
      <div className="max-w-5xl mx-auto nm-card p-4 sm:p-10 space-y-6 sm:space-y-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#E6F2EC] text-[#0F3D2E] flex items-center justify-center shrink-0">
            <LandPlotIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="nm-h1">{t.tools.tool3.title}</h1>
            <p className="nm-body-lg mt-2">{t.tools.tool3.subtitle}</p>
          </div>
        </div>

        <div>
          <h2 className="text-[19px] sm:text-xl font-semibold text-[#121C17] mb-3">
            {t.tools.tool3.sizeHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LAND_SIZE_OPTIONS.map((opt) => {
              const active = opt.id === sizeId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSizeId(opt.id)}
                  aria-pressed={active}
                  className={`nm-tap-card min-h-[68px] sm:min-h-[76px] px-4 sm:px-5 py-3.5 sm:py-4 border-2 text-left font-semibold text-[18px] sm:text-xl tabular-nums flex items-center justify-between gap-2 ${
                    active
                      ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                      : "bg-[#F8FAF9] hover:bg-[#E6F2EC] border-[#DCE5DF] text-[#121C17]"
                  }`}
                >
                  <span>{lang === "no" ? opt.labelNo : opt.labelEn}</span>
                  {active && (
                    <CheckMarkIcon className="w-5 h-5 text-[#147A53] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-[19px] sm:text-xl font-semibold text-[#121C17] mb-3">
            {t.tools.tool3.zoneHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {LAND_ZONE_OPTIONS.map((zone) => {
              const active = zone.id === zoneId;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setZoneId(zone.id)}
                  aria-pressed={active}
                  className={`nm-tap-card min-h-[92px] p-4 sm:p-5 border-2 text-left flex flex-col justify-between ${
                    active
                      ? "bg-[#E6F2EC] border-[#147A53]"
                      : "bg-[#F8FAF9] hover:bg-[#E6F2EC] border-[#DCE5DF]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#0F3D2E] text-[#FFFFFF] text-[13px] font-semibold">
                      {zone.code}
                    </span>
                    {active && (
                      <CheckMarkIcon className="w-5 h-5 text-[#147A53]" />
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="block text-[18px] sm:text-xl font-semibold text-[#121C17]">
                      {lang === "no" ? zone.labelNo : zone.labelEn}
                    </span>
                    <span className="block text-[15px] text-[#3B4D44] mt-1">
                      {lang === "no" ? zone.descNo : zone.descEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-5">
          <label
            htmlFor="land-city-select"
            className="block text-[18px] sm:text-xl font-semibold text-[#121C17] mb-2"
          >
            {t.tools.tool3.cityHeading}
          </label>
          <select
            id="land-city-select"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="w-full min-h-[60px] sm:min-h-[64px] px-4 py-3 text-[19px] sm:text-xl font-semibold bg-[#FFFFFF] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17] cursor-pointer"
          >
            {NORWAY_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Visual Subdivision Parcel Blocks + BRA Output */}
        <div className="bg-[#E6F2EC] border border-[#9EB6AA] rounded-2xl p-4 sm:p-8 space-y-6">
          <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-5 border border-[#DCE5DF] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[15px] font-semibold text-[#0F3D2E]">
                {lang === "no"
                  ? "Visuell tomteinndeling og utbyggingsgrad"
                  : "Visual Plot Subdivision & Density Meter"}
              </span>
              <span className="text-[14px] font-semibold text-[#147A53] tabular-nums">
                {selectedSize.basePlots === 1
                  ? lang === "no"
                    ? "1 samlet tomt"
                    : "1 single parcel"
                  : `${selectedSize.basePlots} ${t.tools.tool3.plotsUnit}`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 pt-1">
              {Array.from({ length: selectedSize.basePlots }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-[#E6F2EC] border-2 border-dashed border-[#147A53] flex items-center justify-center text-[14px] font-semibold text-[#0F3D2E]"
                >
                  {lang === "no" ? `Parsell ${i + 1}` : `Plot ${i + 1}`}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[13px] font-medium text-[#3B4D44] mb-1">
                <span>
                  {lang === "no" ? "Utbyggbar flate (BRA)" : "Buildable Density"}
                </span>
                <span className="tabular-nums">{maxConstructibleBra} m² BRA</span>
              </div>
              <div className="h-2.5 w-full bg-[#F1F5F3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#147A53] rounded-full transition-all duration-300"
                  style={{ width: `${braRatioPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-5 border border-[#DCE5DF]">
              <span className="block text-[15px] font-medium text-[#3B4D44]">
                {t.tools.tool3.plotsResultLabel}
              </span>
              <span className="block text-[26px] sm:text-3xl font-semibold text-[#121C17] tabular-nums mt-2">
                {selectedSize.basePlots === 1
                  ? lang === "no"
                    ? "1 samlet tomt"
                    : "1 Single Plot"
                  : `1 – ${selectedSize.basePlots} ${t.tools.tool3.plotsUnit}`}
              </span>
            </div>

            <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-5 border border-[#DCE5DF]">
              <span className="block text-[15px] font-medium text-[#3B4D44]">
                {t.tools.tool3.braResultLabel}
              </span>
              <span className="block text-[26px] sm:text-3xl font-semibold text-[#121C17] tabular-nums mt-2">
                {maxConstructibleBra} m² BRA
              </span>
            </div>

            <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-5 border border-[#DCE5DF]">
              <span className="block text-[15px] font-medium text-[#3B4D44]">
                {t.tools.tool3.estimatedValueLabel}
              </span>
              <span className="block text-[26px] sm:text-3xl font-semibold text-[#147A53] tabular-nums mt-2 whitespace-nowrap">
                {formatNok(estimatedLandValue)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#C3DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[15px] font-medium text-[#3B4D44]">
              {t.tools.tool3.demandBannerLabel}:
            </span>
            <span className="text-[18px] sm:text-xl font-semibold text-[#0F3D2E]">
              {lang === "no"
                ? selectedZone.developerDemandNo
                : selectedZone.developerDemandEn}
            </span>
          </div>
        </div>

        <Link
          href={`/koble-til-megler?source=land&type=land&size=${
            selectedSize.avgSqm > 500 ? "over-500" : "300-500"
          }&zone=${selectedZone.code}&city=${selectedCity.id}`}
          onClick={() => trackClick("land")}
          className="nm-btn-primary w-full min-h-[72px] sm:min-h-[82px] px-5 sm:px-7 py-4 sm:py-5 text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool3.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}

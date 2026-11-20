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
import { ModernLandBuildability } from "@/components/modern/ModernLandBuildability";
import { ToolSeoGuide } from "@/components/ToolSeoGuide";

export function LandBuildabilityTool() {
  const { isModern } = useApp();
  if (isModern) {
    return (
      <div className="bg-[#F8FAF9] pb-12">
        <ModernLandBuildability />
        <div className="px-3 sm:px-6">
          <ToolSeoGuide slug="land-buildability" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#FFFFFF] pb-12">
      <ClassicLandBuildability />
      <div className="px-4 sm:px-6">
        <ToolSeoGuide slug="land-buildability" />
      </div>
    </div>
  );
}

function ClassicLandBuildability() {
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

  return (
    <main className="bg-[#FFFFFF] pt-10 px-4 sm:pt-14 sm:px-6 lg:pt-16">
      <div className="max-w-5xl mx-auto bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-6 sm:p-10 lg:p-12">
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
            <LandPlotIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="kr-h1">{t.tools.tool3.title}</h1>
            <p className="kr-body-lg mt-2">{t.tools.tool3.subtitle}</p>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-[19px] sm:text-xl font-medium text-[#000000] mb-3">
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
                  className={`kr-tap-card min-h-[68px] sm:min-h-[76px] px-4 sm:px-5 py-3.5 sm:py-4 border-2 text-left font-medium text-[19px] sm:text-xl tabular-nums flex items-center justify-between gap-2 ${
                    active
                      ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                      : "bg-[#EDF0E7] hover:bg-[#DCE2CF] border-[#BFBFBD] text-[#000000]"
                  }`}
                >
                  <span>{lang === "no" ? opt.labelNo : opt.labelEn}</span>
                  {active && (
                    <CheckMarkIcon className="w-5 h-5 text-[#5D726A] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-[19px] sm:text-xl font-medium text-[#000000] mb-3">
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
                  className={`kr-tap-card min-h-[92px] p-4 sm:p-5 border-2 text-left flex flex-col justify-between ${
                    active
                      ? "bg-[#DCE2CF] border-[#5D726A]"
                      : "bg-[#EDF0E7] hover:bg-[#DCE2CF] border-[#BFBFBD]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-none bg-[#292823] text-[#FFFFFF] text-sm font-medium">
                      {zone.code}
                    </span>
                    {active && (
                      <CheckMarkIcon className="w-5 h-5 text-[#5D726A]" />
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="block text-[18px] sm:text-xl font-medium text-[#000000]">
                      {lang === "no" ? zone.labelNo : zone.labelEn}
                    </span>
                    <span className="block text-base text-[#292823] mt-1">
                      {lang === "no" ? zone.descNo : zone.descEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 sm:mb-8 bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-5">
          <label
            htmlFor="land-city-select"
            className="block text-[18px] sm:text-xl font-medium text-[#000000] mb-2"
          >
            {t.tools.tool3.cityHeading}
          </label>
          <select
            id="land-city-select"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="w-full min-h-[60px] sm:min-h-[64px] px-4 py-3 text-[19px] sm:text-xl font-medium bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none text-[#000000] cursor-pointer"
          >
            {NORWAY_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#DCE2CF] border-2 border-[#5D726A] rounded-none p-4 sm:p-8 mb-6 sm:mb-8 space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#FFFFFF] rounded-none p-4 sm:p-5 border border-[#BFBFBD]">
              <span className="block text-base font-medium text-[#292823]">
                {t.tools.tool3.plotsResultLabel}
              </span>
              <span className="block text-[26px] sm:text-4xl font-medium text-[#000000] tabular-nums mt-2">
                {selectedSize.basePlots === 1
                  ? lang === "no"
                    ? "1 samlet tomt"
                    : "1 Single Plot"
                  : `1 – ${selectedSize.basePlots} ${t.tools.tool3.plotsUnit}`}
              </span>
            </div>

            <div className="bg-[#FFFFFF] rounded-none p-4 sm:p-5 border border-[#BFBFBD]">
              <span className="block text-base font-medium text-[#292823]">
                {t.tools.tool3.braResultLabel}
              </span>
              <span className="block text-[26px] sm:text-4xl font-medium text-[#000000] tabular-nums mt-2">
                {maxConstructibleBra} m² BRA
              </span>
            </div>

            <div className="bg-[#FFFFFF] rounded-none p-4 sm:p-5 border border-[#BFBFBD]">
              <span className="block text-base font-medium text-[#292823]">
                {t.tools.tool3.estimatedValueLabel}
              </span>
              <span className="block text-[26px] sm:text-4xl font-medium text-[#5D726A] tabular-nums mt-2 whitespace-nowrap">
                {formatNok(estimatedLandValue)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#949391] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-base font-medium text-[#292823]">
              {t.tools.tool3.demandBannerLabel}:
            </span>
            <span className="text-[18px] sm:text-xl font-medium text-[#000000]">
              {lang === "no"
                ? selectedZone.developerDemandNo
                : selectedZone.developerDemandEn}
            </span>
          </div>
        </div>

        <Link
          href={`/connect-agency?source=land&type=land&size=${
            selectedSize.avgSqm > 500 ? "over-500" : "300-500"
          }&zone=${selectedZone.code}&city=${selectedCity.id}`}
          onClick={() => trackClick("land")}
          className="kr-btn-primary w-full min-h-[72px] sm:min-h-[84px] px-5 sm:px-7 py-4 sm:py-5 border-2 border-[#5D726A] text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool3.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}

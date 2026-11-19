"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  HouseIcon,
  LandPlotIcon,
  ScaleMeasureIcon,
  UsersFamilyIcon,
  PaintRollerIcon,
  ArrowRightIcon,
} from "@/components/Icons";
import { ModernToolsHub } from "@/components/modern/ModernToolsHub";

export default function FreeToolsHubPage() {
  const { lang, isModern, trackClick, t } = useApp();

  if (isModern) return <ModernToolsHub />;

  const tools = [
    {
      href: "/tools/price-per-m2",
      title: t.tools.tool1.title,
      desc: t.tools.tool1.subtitle,
      controlHint:
        lang === "no"
          ? "Velg by og bydel fra to store menyer"
          : "Select City and Neighborhood from two large menus",
      metric: "108 200 kr / m²",
      icon: <ScaleMeasureIcon className="w-7 h-7" />,
    },
    {
      href: "/tools/net-cash",
      title: t.tools.tool2.title,
      desc: t.tools.tool2.subtitle,
      controlHint:
        lang === "no"
          ? "Dra én stor skyveknapp til forventet salgspris"
          : "Slide one bar to your expected selling price",
      metric: "6 367 250 kr",
      icon: <HouseIcon className="w-7 h-7" />,
    },
    {
      href: "/tools/land-buildability",
      title: t.tools.tool3.title,
      desc: t.tools.tool3.subtitle,
      controlHint:
        lang === "no"
          ? "Velg tomtestørrelse og sone (R+2, R+3, næring)"
          : "Select land size and zone (R+2, R+3, commercial)",
      metric: "+38% – +75%",
      icon: <LandPlotIcon className="w-7 h-7" />,
    },
    {
      href: "/tools/inherited-property",
      title: t.tools.tool4.title,
      desc: t.tools.tool4.subtitle,
      controlHint:
        lang === "no"
          ? "Velg boligverdi og antall arvinger"
          : "Select estimated value and number of heirs",
      metric: "2 451 000 kr / heir",
      icon: <UsersFamilyIcon className="w-7 h-7" />,
    },
    {
      href: "/tools/sell-as-is",
      title: t.tools.tool5.title,
      desc: t.tools.tool5.subtitle,
      controlHint:
        lang === "no"
          ? "Trykk på det som trenger arbeid (maling, kjøkken, tak)"
          : "Tap what needs work (paint, kitchen, old roof)",
      metric: "0 kr outlay",
      icon: <PaintRollerIcon className="w-7 h-7" />,
    },
  ];

  return (
    <main className="bg-[#FFFFFF] min-h-[calc(100vh-140px)] py-10 sm:py-14 lg:py-16">
      <div className="kr-container space-y-10 sm:space-y-12">
        <div className="max-w-3xl space-y-3">
          <h1 className="kr-h1">{t.landing.toolsSectionTitle}</h1>
          <p className="kr-body-lg">{t.landing.toolsSectionDesc}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {tools.map((tool) => (
            <div
              key={tool.href}
              className="bg-[#FFFFFF] border border-[#BFBFBD] rounded-none p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6"
            >
              <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
                <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
                  {tool.icon}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[21px] sm:text-[24px] font-medium text-[#000000] leading-snug">
                    {tool.title}
                  </h2>
                  <p className="text-[16px] sm:text-[17px] text-[#292823] mt-2 leading-relaxed">
                    {tool.desc}
                  </p>
                  <span className="inline-block mt-3 px-3 py-1 bg-[#EDF0E7] text-[#292823] text-[14px] font-medium rounded-none border border-[#DCE2CF]">
                    {tool.controlHint}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
                <div className="bg-[#EDF0E7] px-4 py-3 rounded-none border border-[#DFDFDF] text-left sm:text-right">
                  <span className="block text-[13px] font-normal text-[#292823]">
                    {lang === "no" ? "Eksempel" : "Sample"}
                  </span>
                  <span className="block text-[20px] font-medium text-[#000000] tabular-nums whitespace-nowrap">
                    {tool.metric}
                  </span>
                </div>
                <Link
                  href={tool.href}
                  className="kr-btn-primary w-full sm:w-auto border border-[#5D726A] min-h-[56px]"
                >
                  <span>{t.landing.openToolBtn}</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#DCE2CF] border border-[#5D726A] rounded-none p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="kr-h2-serif">
              {lang === "no"
                ? "Klar til å få den beste prisen?"
                : "Ready to connect with a local agency?"}
            </h2>
            <p className="kr-body-lg mt-1">
              {lang === "no"
                ? "Få en uforpliktende verdivurdering og tilbud direkte fra lokale meglere og kjøpere."
                : "Get a free valuation and compare offers from local Norwegian agencies."}
            </p>
          </div>
          <Link
            href="/connect-agency?source=tools-hub"
            onClick={() => trackClick("tools-hub")}
            className="kr-btn-primary w-full sm:w-auto border border-[#5D726A] shrink-0 min-h-[58px]"
          >
            <span>
              {lang === "no"
                ? "Koble til megler nå"
                : "Connect Agency — Get Best Price"}
            </span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

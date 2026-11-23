"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { NORWAY_CITIES } from "@/data/norwayData";
import {
  TOOL_CATALOG,
  TOOL_CATEGORIES,
  ToolCategory,
} from "@/data/norwayToolsData";
import {
  HouseIcon,
  UsersFamilyIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BoltFastIcon,
  HeartFreeIcon,
  StarBadgeIcon,
  WalletCashIcon,
  RefreshCycleIcon,
  LightBulbIcon,
  LocationCrosshairIcon,
} from "@/components/Icons";
import { ToolIcon } from "@/components/ToolIcon";

export function ModernToolsHub() {
  const { lang, trackClick } = useApp();
  const [activeCat, setActiveCat] = useState<"all" | ToolCategory>("all");

  const featuredCards = [
    {
      href: "/verktoy/netto-utbetalt",
      title:
        lang === "no"
          ? "Finn ut hva du sitter igjen med etter skatt og gebyrer"
          : "“Net Cash in Pocket” Calculator",
      desc:
        lang === "no"
          ? "Se nøyaktig hvor mye penger som faktisk blir igjen etter meglergebyr, skatt og innfrielse av banklån."
          : "See how much money you actually keep after fees, taxes and other costs.",
      image: "/images/tool-net-cash.jpg",
      imageAlt:
        lang === "no"
          ? "Arkitekturmodell av hus og myntstabler"
          : "Minimalist model house beside coin stacks",
      icon: <WalletCashIcon className="w-6 h-6" />,
    },
    {
      href: "/verktoy/tomtedeling",
      title:
        lang === "no"
          ? "Tomtedeling og utbyggingspotensial"
          : "Land Buildability & Division Estimator",
      desc:
        lang === "no"
          ? "Finn ut om tomten din kan deles i flere enheter eller bygges ut for høyere pris"
          : "Find out how your land can be divided and what you can build.",
      image: "/images/tool-land-plot.jpg",
      imageAlt:
        lang === "no"
          ? "3D-illustrasjon av fradelt byggetomt med trær"
          : "Isometric grassy land plot divided into buildable parcels",
      icon: <LocationCrosshairIcon className="w-6 h-6" />,
    },
    {
      href: "/verktoy/arvet-bolig",
      title:
        lang === "no"
          ? "Kalkulator for arvet bolig og familieoppgjør"
          : "Inherited / Family Property Share Calculator",
      desc:
        lang === "no"
          ? "Beregn forventet salgsverdi og eksakt netto utbetaling per arving eller søsken."
          : "Calculate the estimated value and share per heir for inherited property.",
      image: "/images/tool-inherited.jpg",
      imageAlt:
        lang === "no"
          ? "Familie som går sammen i sollys på eng"
          : "Sunlit family walking across meadow",
      icon: <UsersFamilyIcon className="w-6 h-6" />,
    },
    {
      href: "/verktoy/selge-som-den-er",
      title:
        lang === "no"
          ? "Selge som den er eller pusse opp først?"
          : "“Sell As-Is vs. Fix It Up” Calculator",
      desc:
        lang === "no"
          ? "Sammenlign oppussingskostnader og se hvilken strategi som gir best gevinst."
          : "Compare renovation costs and see which option gets you the best return.",
      image: "/images/tool-sell-asis.jpg",
      imageAlt:
        lang === "no"
          ? "Hvit malerrull og malingsspann mot lys vegg"
          : "Minimal paint roller resting on brushed paint tin",
      icon: <RefreshCycleIcon className="w-6 h-6" />,
    },
  ];

  const newToolsAll = TOOL_CATALOG.filter((t) => t.isNew);
  const filteredDirectory =
    activeCat === "all"
      ? newToolsAll
      : TOOL_CATALOG.filter((t) => t.category === activeCat);

  const statsTiles = [
    {
      value: "16",
      label: lang === "no" ? "Gratis verktøy" : "Free calculators",
      icon: <HouseIcon className="w-5 h-5" />,
    },
    {
      value: "500+",
      label: lang === "no" ? "Lokale meglere" : "Local agents",
      icon: <UsersFamilyIcon className="w-5 h-5" />,
    },
    {
      value: "100%",
      label: lang === "no" ? "Trygg & gratis" : "Trusted & free",
      icon: <ShieldCheckIcon className="w-5 h-5" />,
    },
  ];

  return (
    <main className="bg-[#F4F5F0] text-[#1D281C]">
      {/* 1. ARCHITECTURAL TOOLS HERO */}
      <section className="relative overflow-hidden bg-[#F4F5F0] border-b border-[#DCE2D4]">
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[62%]">
          <Image
            src="/images/ad-villa-oslo.jpg"
            alt={
              lang === "no"
                ? "Moderne norsk enebolig i dagslys"
                : "Modern Norwegian detached villa in daylight"
            }
            fill
            priority
            sizes="62vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#F4F5F0] via-[#F4F5F0]/75 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#F4F5F0]/35 via-transparent to-[#F4F5F0]/45"
            aria-hidden="true"
          />
        </div>

        <svg
          viewBox="0 0 1440 420"
          fill="none"
          className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full opacity-60"
          aria-hidden="true"
        >
          <path d="M 540 -30 Q 750 200 520 460" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M 630 -30 Q 840 210 610 460" stroke="#FFFFFF" strokeWidth="1.25" opacity="0.65" />
        </svg>

        <div className="nm-container relative z-10 py-10 sm:py-14 lg:py-16">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7ECE0] border border-[#D4DCCB] text-[#243323] text-[14px] font-medium">
              <BoltFastIcon className="w-4 h-4 text-[#243323]" />
              <span>{lang === "no" ? "16 smarte verktøy" : "16 Smart Tools"}</span>
            </div>

            <h1 className="font-serif text-[40px] sm:text-[52px] lg:text-[60px] leading-[1.06] font-normal text-[#1D281C] tracking-[-0.02em] text-balance">
              {lang === "no"
                ? "Gratis verktøy for deg som skal selge bolig"
                : "Free Tools for Home Sellers"}
            </h1>

            <p className="text-[17px] sm:text-[19px] leading-relaxed text-[#495647] max-w-lg">
              {lang === "no"
                ? "Få en rask tilbakemelding på din boligverdi, kostnader ved salg og mye mer - alt på et sted"
                : "Get fast feedback on your home value, selling costs, and much more — all in one place."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[14px] sm:text-[15px] font-medium text-[#243323]">
              <span className="inline-flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-[#243323]" />
                <span>{lang === "no" ? "SSB & Skatteetaten-satser" : "Norwegian 2026 rates"}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <BoltFastIcon className="w-4 h-4 text-[#243323]" />
                <span>{lang === "no" ? "Raskt & uten tasting" : "Fast & zero typing"}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <HeartFreeIcon className="w-4 h-4 text-[#243323]" />
                <span>{lang === "no" ? "100 % gratis" : "100% free"}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BENTO TOOLS GRID */}
      <section className="py-8 sm:py-12">
        <div className="nm-container space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* CARD 1: FEATURED DARK OLIVE CARD — Price per m2 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F2D1E] via-[#2B3D29] to-[#566A53] text-[#FFFFFF] p-6 sm:p-8 min-h-[260px] flex flex-col justify-between shadow-md border border-[#344732]">
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-[55%] opacity-45"
                aria-hidden="true"
              >
                <svg viewBox="0 0 320 260" fill="none" className="w-full h-full">
                  <path d="M 30 30 L 310 110 M 10 95 L 300 45 M 40 165 L 310 220 M 115 0 L 85 260 M 210 0 L 175 260" stroke="#A8B8A2" strokeWidth="1.25" />
                  <circle cx="215" cy="145" r="55" stroke="#D8E2D4" strokeWidth="1" strokeDasharray="3 4" />
                </svg>
              </div>

              <div className="relative z-10 max-w-xs sm:max-w-[290px] space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A4D38]/90 border border-[#5B7259] text-[#E9EDE3] text-[12px] font-semibold">
                  <StarBadgeIcon className="w-3.5 h-3.5 text-[#D8C16E]" />
                  <span>{lang === "no" ? "Mest populær" : "Most Popular"}</span>
                </div>

                <h2 className="font-serif text-[26px] sm:text-[30px] leading-[1.15] font-normal text-[#FFFFFF]">
                  {lang === "no"
                    ? "Pris per m² i ditt nabolag"
                    : "Instant Neighborhood “Price per m²” Lookup"}
                </h2>

                <p className="text-[15px] text-[#D4DFD0] leading-relaxed">
                  {lang === "no"
                    ? "Sammenlign gjennomsnittlig salgspris per m² for boligen din med andre boliger i nærområdet"
                    : "Compare prices in your area and discover the current average selling price per m²."}
                </p>
              </div>

              <div className="relative z-10 pt-5">
                <Link
                  href="/verktoy/pris-per-m2"
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full bg-[#FFFFFF] hover:bg-[#E7ECE0] text-[#1D281C] text-[15px] font-semibold transition-colors shadow-sm"
                >
                  <span>
                    {lang === "no" ? "Åpne kalkulator" : "Open Calculator"}
                  </span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {featuredCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#DCE2D4] hover:border-[#B8C2AE] p-6 sm:p-8 min-h-[260px] flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div className="pointer-events-none absolute inset-y-0 right-0 w-[56%] sm:w-[52%]">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 768px) 60vw, 28vw"
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="relative z-10 max-w-[280px] sm:max-w-[300px] space-y-3">
                  <span className="w-11 h-11 rounded-xl bg-[#EAEFE4] border border-[#D4DCCB] text-[#243323] flex items-center justify-center">
                    {card.icon}
                  </span>

                  <h2 className="font-serif text-[25px] sm:text-[28px] leading-[1.16] font-normal text-[#1D281C]">
                    {card.title}
                  </h2>

                  <p className="text-[14px] sm:text-[15px] text-[#495647] leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-5">
                  <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#1D281C] underline decoration-[#9EB09A] underline-offset-4 group-hover:text-[#243323]">
                    <span>
                      {lang === "no" ? "Åpne kalkulator" : "Open Calculator"}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}

            {/* CARD 6: SAGE HELP CARD */}
            <div className="relative overflow-hidden rounded-2xl bg-[#E7ECE0] border border-[#D4DCCB] p-6 sm:p-8 min-h-[260px] flex flex-col justify-between shadow-xs">
              <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-[48%] opacity-75">
                <Image
                  src="/images/ad-land-plot.jpg"
                  alt={
                    lang === "no"
                      ? "Norsk fjordutsikt"
                      : "Norwegian scenic coastline"
                  }
                  fill
                  sizes="25vw"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#E7ECE0] via-[#E7ECE0]/85 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-b from-[#E7ECE0]/90 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>

              <div className="relative z-10 max-w-xs space-y-3">
                <span className="w-11 h-11 rounded-xl bg-[#FFFFFF] border border-[#D4DCCB] text-[#243323] flex items-center justify-center">
                  <LightBulbIcon className="w-6 h-6" />
                </span>

                <h2 className="font-serif text-[26px] sm:text-[30px] leading-[1.15] font-normal text-[#1D281C]">
                  {lang === "no" ? "Trenger du mer hjelp?" : "Need more help?"}
                </h2>

                <p className="text-[15px] text-[#495647] leading-relaxed">
                  {lang === "no"
                    ? "Koble deg direkte med en lokal megler og få nøytral verdivurdering fra erfarne rådgivere."
                    : "Connect with a local agency and get expert advice from our trusted partners."}
                </p>
              </div>

              <div className="relative z-10 pt-5 flex items-center justify-between gap-4">
                <Link
                  href="/koble-til-megler?source=tools-hub"
                  onClick={() => trackClick("tools-hub")}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full bg-[#243323] hover:bg-[#172216] text-[#FFFFFF] text-[15px] font-semibold transition-colors shadow-sm"
                >
                  <span>
                    {lang === "no" ? "Koble til megler" : "Connect Agency"}
                  </span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 3. ALL 11 NEW SPECIALIZED NORWEGIAN CALCULATORS + CATEGORY FILTER */}
          <div className="space-y-5 pt-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="nm-h2">
                  {lang === "no"
                    ? "Flere gratis kalkulatorer for bolig, skatt, hytte og solforhold"
                    : "More Free Calculators for Tax, Buyout, Cabins & Sunlight"}
                </h2>
                <p className="text-[16px] text-[#495647] mt-1">
                  {lang === "no"
                    ? "Filtrer etter din situasjon — alle kalkulatorer er oppdatert for norske regler i 2026."
                    : "Filter by your situation — every calculator reflects 2026 Norwegian rules."}
                </p>
              </div>

              <div
                role="group"
                aria-label={lang === "no" ? "Filtrer kalkulatorer" : "Filter calculators"}
                className="flex flex-wrap gap-2"
              >
                {TOOL_CATEGORIES.map((cat) => {
                  const active = activeCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCat(cat.id)}
                      aria-pressed={active}
                      className={`min-h-[40px] px-4 py-1.5 rounded-full text-[13px] sm:text-[14px] font-semibold border transition-colors cursor-pointer ${
                        active
                          ? "bg-[#243323] border-[#243323] text-[#FFFFFF]"
                          : "bg-[#FFFFFF] border-[#DCE2D4] hover:bg-[#E7ECE0] text-[#1D281C]"
                      }`}
                    >
                      {cat.id === "all"
                        ? lang === "no"
                          ? "Alle nye (11)"
                          : "All New (11)"
                        : lang === "no"
                        ? cat.labelNo
                        : cat.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredDirectory.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.path}
                  className="group rounded-2xl bg-[#FFFFFF] border border-[#DCE2D4] hover:border-[#147A53] p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-11 h-11 rounded-xl bg-[#E6F2EC] border border-[#C3DEC9] text-[#0F3D2E] flex items-center justify-center">
                        <ToolIcon iconKey={tool.iconKey} className="w-5 h-5" />
                      </span>
                    </div>

                    <h3 className="font-serif text-[21px] sm:text-[23px] leading-[1.2] font-normal text-[#1D281C]">
                      {lang === "no" ? tool.titleNo : tool.shortTitleEn}
                    </h3>

                    <p className="text-[14px] sm:text-[15px] text-[#495647] leading-relaxed">
                      {lang === "no" ? tool.descNo : tool.descEn}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#147A53] group-hover:text-[#0F3D2E]">
                    <span>
                      {lang === "no" ? "Åpne kalkulator" : "Open Calculator"}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 4. LOCAL SEO CITY PRICE DIRECTORY */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#DCE2D4] p-6 sm:p-8 space-y-4">
            <h2 className="nm-h3">
              {lang === "no"
                ? "Lokale boligpriser per m² i norske byer"
                : "Local Price per m² Across Major Norwegian Cities"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {NORWAY_CITIES.map((city) => (
                <Link
                  key={city.id}
                  href={`/boligpris/${city.id}`}
                  className="px-4 py-2 rounded-full bg-[#F4F5F0] hover:bg-[#E7ECE0] border border-[#DCE2D4] text-[14px] font-semibold text-[#1D281C] transition-colors"
                >
                  {lang === "no" ? `Boligpris ${city.name}` : `${city.name} m² Prices`}
                </Link>
              ))}
            </div>
          </div>

          {/* 5. DARK FOREST FULL-WIDTH BOTTOM BANNER */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1E2A1E] text-[#FFFFFF] shadow-md border border-[#2E3E2D]">
            <div className="hidden md:block absolute inset-y-0 right-0 w-[62%]">
              <Image
                src="/images/ad-land-plot.jpg"
                alt={
                  lang === "no"
                    ? "Norsk fjordlandskap"
                    : "Norwegian fjord landscape"
                }
                fill
                sizes="62vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#1E2A1E] via-[#1E2A1E]/75 to-[#1E2A1E]/25"
                aria-hidden="true"
              />
            </div>

            <svg
              viewBox="0 0 1200 260"
              fill="none"
              className="hidden md:block pointer-events-none absolute inset-0 w-full h-full opacity-25"
              aria-hidden="true"
            >
              <path d="M 480 -20 Q 610 130 450 280" stroke="#FFFFFF" strokeWidth="1.5" />
            </svg>

            <div className="relative z-10 p-6 sm:p-9 lg:p-11 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <h2 className="font-serif text-[30px] sm:text-[36px] leading-[1.12] font-normal text-[#FFFFFF]">
                  {lang === "no"
                    ? "Klar for å selge boligen?"
                    : "Ready to sell your home?"}
                </h2>
                <p className="text-[16px] text-[#D4DFD0] max-w-md leading-relaxed">
                  {lang === "no"
                    ? "Få en uforpliktende verdivurdering og sammenlign tilbud fra lokale norske meglere."
                    : "Get a free valuation and compare offers from local Norwegian agencies."}
                </p>
                <div className="pt-1">
                  <Link
                    href="/koble-til-megler?source=tools-hub"
                    onClick={() => trackClick("tools-hub")}
                    className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3 rounded-full bg-[#F4F5F0] hover:bg-[#FFFFFF] text-[#1D281C] text-[15px] font-semibold transition-colors shadow-sm"
                  >
                    <span>
                      {lang === "no" ? "Koble til megler" : "Connect Agency"}
                    </span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-3 gap-3 sm:gap-4">
                {statsTiles.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-xl bg-[#FFFFFF]/12 backdrop-blur-md border border-[#FFFFFF]/20 p-4 text-center flex flex-col items-center justify-center gap-1.5"
                  >
                    <span className="text-[#D4DFD0]">{stat.icon}</span>
                    <span className="font-display text-[22px] sm:text-[26px] font-semibold text-[#FFFFFF] tabular-nums leading-none mt-1">
                      {stat.value}
                    </span>
                    <span className="text-[12px] sm:text-[13px] text-[#D4DFD0] leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

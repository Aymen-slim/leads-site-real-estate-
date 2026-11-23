"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  ArrowRightIcon,
  ChevronDownIcon,
} from "@/components/Icons";
import { ToolIcon } from "@/components/ToolIcon";
import { TOOL_CATALOG } from "@/data/norwayToolsData";

export function ModernNavbar() {
  const pathname = usePathname();
  const { lang, setLang, trackClick } = useApp();

  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === "/";
  const isTools = pathname.startsWith("/verktoy") || pathname.startsWith("/tools") || pathname.startsWith("/boligpris");
  const isAgency = pathname === "/koble-til-megler" || pathname === "/selg" || pathname === "/connect-agency" || pathname === "/sell";

  useEffect(() => {
    setToolsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const topToolSlugs = [
    "price-per-m2",
    "net-cash",
    "broker-fee",
    "capital-gains-tax",
    "partner-buyout",
    "bridge-loan",
    "rent-or-sell",
    "property-tax",
    "document-fee",
    "sun-conditions",
  ];
  const toolItems = topToolSlugs
    .map((slug) => TOOL_CATALOG.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <header className="bg-[#F4F5F0]/90 backdrop-blur-md text-[#1D281C] border-b border-[#DCE2D4] sm:sticky sm:top-0 z-40">
      <div className="nm-container">
        <div className="flex items-center justify-between py-3 gap-3 min-h-[64px] md:min-h-[72px]">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px] w-fit focus-visible:outline-2 focus-visible:outline-[#243323]"
            >
              <Image
                src="/images/vurderboligen-logo.png"
                alt="VurderBoligen"
                width={200}
                height={34}
                priority
                className="h-8 sm:h-9 w-auto"
              />
            </Link>

            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLang("no")}
                className={`min-h-[36px] px-3 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                  lang === "no"
                    ? "bg-[#243323] text-[#FFFFFF]"
                    : "bg-[#E7ECE0] text-[#1D281C]"
                }`}
              >
                NO
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`min-h-[36px] px-3 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-[#243323] text-[#FFFFFF]"
                    : "bg-[#E7ECE0] text-[#1D281C]"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex md:flex-wrap items-center gap-2.5 w-auto"
          >
            <Link
              href="/"
              className={`min-h-[42px] px-4 py-2 rounded-full text-[15px] font-medium flex items-center justify-center transition-colors ${
                isHome
                  ? "bg-[#E7ECE0] text-[#1D281C] font-semibold"
                  : "text-[#495647] hover:bg-[#E7ECE0]/70 hover:text-[#1D281C]"
              }`}
            >
              {lang === "no" ? "Hjem" : "Home"}
            </Link>

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setToolsOpen((o) => !o)}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                className={`w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-full text-[15px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isTools
                    ? "bg-[#243323] text-[#FFFFFF]"
                    : "bg-[#E7ECE0] text-[#1D281C] hover:bg-[#DCE4D2]"
                }`}
              >
                <span>{lang === "no" ? "Gratis verktøy" : "Free Tools"}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {toolsOpen && (
                <div
                  role="menu"
                  className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 mt-2 sm:w-[620px] bg-[#FFFFFF] border border-[#DCE2D4] rounded-2xl shadow-[0_14px_40px_rgba(29,40,28,0.16)] p-3.5 z-50"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {toolItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        role="menuitem"
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#E7ECE0] transition-colors min-h-[54px]"
                      >
                        <span className="w-9 h-9 rounded-lg bg-[#E7ECE0] text-[#243323] flex items-center justify-center shrink-0">
                          <ToolIcon iconKey={item.iconKey} className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-[14px] font-semibold text-[#1D281C] leading-snug">
                            {lang === "no" ? item.shortTitleNo : item.shortTitleEn}
                          </span>
                          <span className="block text-[12px] text-[#495647] mt-0.5 line-clamp-1">
                            {lang === "no" ? item.sampleMetricNo : item.sampleMetricEn}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2.5 pt-2.5 border-t border-[#DCE2D4]">
                    <Link
                      href="/verktoy"
                      role="menuitem"
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F4F5F0] hover:bg-[#E7ECE0] text-[15px] font-semibold text-[#243323]"
                    >
                      <span>
                        {lang === "no"
                          ? "Se alle 16 gratis verktøy"
                          : "View All 16 Free Tools"}
                      </span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/koble-til-megler?source=nav"
              onClick={() => trackClick("nav")}
              className={`col-span-2 sm:col-span-1 min-h-[42px] inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-[15px] font-semibold transition-all active:scale-[0.985] ${
                isAgency
                  ? "bg-[#243323] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] border border-[#CFD7C6] hover:bg-[#E7ECE0] text-[#1D281C]"
              }`}
            >
              <span>{lang === "no" ? "Koble til megler" : "Connect Agency"}</span>
              <ArrowRightIcon className="w-4 h-4 shrink-0" />
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang("no")}
              className={`min-h-[38px] px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                lang === "no"
                  ? "bg-[#243323] text-[#FFFFFF]"
                  : "bg-[#E7ECE0] hover:bg-[#DCE4D2] text-[#1D281C]"
              }`}
            >
              Norsk (NO)
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`min-h-[38px] px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                lang === "en"
                  ? "bg-[#243323] text-[#FFFFFF]"
                  : "bg-[#E7ECE0] hover:bg-[#DCE4D2] text-[#1D281C]"
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

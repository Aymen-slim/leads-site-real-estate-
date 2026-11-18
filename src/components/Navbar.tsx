"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HouseIcon, ArrowRightIcon } from "@/components/Icons";

export function Navbar() {
  const pathname = usePathname();
  const { lang } = useApp();

  const isHome = pathname === "/";
  const isTools = pathname.startsWith("/tools");
  const isAgency = pathname === "/connect-agency" || pathname === "/sell";

  return (
    <header className="bg-[#EDF0E7] text-[#292823] border-b border-[#DCE2CF] sm:sticky sm:top-0 z-40">
      <div className="kr-container">
        <div className="flex flex-row items-center justify-between py-3 sm:py-4 gap-3 min-h-[68px] md:min-h-[76px]">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-[#000000] group min-h-[44px] w-fit focus-visible:outline-2 focus-visible:outline-[#5D726A]"
          >
            <span className="w-10 h-10 rounded-[2px] bg-[#000000] text-[#EDF0E7] flex items-center justify-center shrink-0">
              <HouseIcon className="w-5 h-5" />
            </span>
            <span className="text-[22px] sm:text-[24px] font-medium tracking-tight text-[#000000] leading-none">
              Krogsveen Stil
            </span>
          </Link>

          {/* Clean 3-Page Site Navigation on tablet/desktop; phone uses MobileBottomNav */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex md:flex-wrap items-center gap-3 w-auto"
          >
            <Link
              href="/"
              className={`min-h-[48px] px-4 py-2.5 rounded-[2px] text-[16px] sm:text-[17px] font-medium flex items-center justify-center transition-colors active:scale-[0.985] ${
                isHome
                  ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                  : "bg-[#FFFFFF]/60 sm:bg-transparent text-[#292823] hover:bg-[#DCE2CF]"
              }`}
            >
              {lang === "no" ? "Hjem" : "Home"}
            </Link>

            <Link
              href="/tools"
              className={`min-h-[48px] px-4 py-2.5 rounded-[2px] text-[16px] sm:text-[17px] font-medium flex items-center justify-center transition-colors active:scale-[0.985] ${
                isTools
                  ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                  : "bg-[#FFFFFF]/60 sm:bg-transparent text-[#292823] hover:bg-[#DCE2CF]"
              }`}
            >
              {lang === "no" ? "Gratis verktøy" : "Free Tools"}
            </Link>

            <Link
              href="/connect-agency"
              className={`col-span-2 sm:col-span-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-[2px] text-[16px] sm:text-[17px] font-medium transition-colors active:scale-[0.985] ${
                isAgency
                  ? "bg-[#5D726A] text-[#FFFFFF]"
                  : "bg-[#B8C49E] hover:bg-[#C5D0AF] text-[#000000]"
              }`}
            >
              <span>
                {lang === "no"
                  ? "Koble til megler — Få beste pris"
                  : "Connect Agency — Get Best Price"}
              </span>
              <ArrowRightIcon className="w-4 h-4 shrink-0" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HouseIcon, ScaleMeasureIcon, ArrowRightIcon } from "@/components/Icons";

export function ModernMobileBottomNav() {
  const pathname = usePathname();
  const { lang, trackClick } = useApp();

  const isHome = pathname === "/";
  const isTools = pathname.startsWith("/tools") || pathname.startsWith("/boligpris");
  const isAgency = pathname === "/connect-agency" || pathname === "/sell";

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#DCE2D4] shadow-[0_-6px_24px_rgba(29,40,28,0.08)] px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-lg mx-auto grid grid-cols-3 gap-2 items-center">
        <Link
          href="/"
          className={`min-h-[52px] px-2 py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[12px] font-semibold transition-colors active:scale-[0.97] ${
            isHome
              ? "bg-[#E7ECE0] text-[#1D281C] border border-[#C4CEBA]"
              : "text-[#495647] hover:bg-[#F4F5F0]"
          }`}
        >
          <HouseIcon className="w-5 h-5" />
          <span>{lang === "no" ? "Hjem" : "Home"}</span>
        </Link>

        <Link
          href="/tools"
          className={`min-h-[52px] px-2 py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[12px] font-semibold transition-colors active:scale-[0.97] ${
            isTools
              ? "bg-[#E7ECE0] text-[#1D281C] border border-[#C4CEBA]"
              : "text-[#495647] hover:bg-[#F4F5F0]"
          }`}
        >
          <ScaleMeasureIcon className="w-5 h-5" />
          <span>{lang === "no" ? "Verktøy" : "Tools"}</span>
        </Link>

        <Link
          href="/connect-agency?source=nav"
          onClick={() => trackClick("nav")}
          className={`min-h-[52px] px-2.5 py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[12px] font-semibold transition-all active:scale-[0.97] shadow-xs ${
            isAgency
              ? "bg-[#172216] text-[#FFFFFF] ring-2 ring-[#243323]/30"
              : "bg-[#243323] text-[#FFFFFF]"
          }`}
        >
          <span className="inline-flex items-center gap-1">
            <span>{lang === "no" ? "Beste pris" : "Get Price"}</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-normal text-[#D4DFD0] leading-none">
            {lang === "no" ? "Megler" : "Agency"}
          </span>
        </Link>
      </div>
    </nav>
  );
}

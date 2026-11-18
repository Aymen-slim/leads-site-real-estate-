"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  HouseIcon,
  ScaleMeasureIcon,
  ArrowRightIcon,
} from "@/components/Icons";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { lang } = useApp();

  const isHome = pathname === "/";
  const isTools = pathname.startsWith("/tools");
  const isAgency = pathname === "/connect-agency" || pathname === "/sell";

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#EDF0E7]/95 backdrop-blur-md border-t border-[#DCE2CF]/70 shadow-[0_-4px_16px_rgba(41,40,35,0.06)] px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-lg mx-auto grid grid-cols-3 gap-2 items-center">
        <Link
          href="/"
          className={`min-h-[52px] px-2 py-1.5 rounded-[2px] flex flex-col items-center justify-center gap-0.5 text-[12px] font-medium transition-colors active:scale-[0.97] ${
            isHome
              ? "bg-[#FFFFFF] text-[#000000]"
              : "text-[#292823] hover:bg-[#DCE2CF]"
          }`}
        >
          <HouseIcon className="w-5 h-5" />
          <span>{lang === "no" ? "Hjem" : "Home"}</span>
        </Link>

        <Link
          href="/tools"
          className={`min-h-[52px] px-2 py-1.5 rounded-[2px] flex flex-col items-center justify-center gap-0.5 text-[12px] font-medium transition-colors active:scale-[0.97] ${
            isTools
              ? "bg-[#FFFFFF] text-[#000000]"
              : "text-[#292823] hover:bg-[#DCE2CF]"
          }`}
        >
          <ScaleMeasureIcon className="w-5 h-5" />
          <span>{lang === "no" ? "Verktøy" : "Tools"}</span>
        </Link>

        <Link
          href="/connect-agency"
          className={`min-h-[52px] px-2.5 py-1.5 rounded-[2px] flex flex-col items-center justify-center gap-0.5 text-[12px] font-medium transition-colors active:scale-[0.97] ${
            isAgency
              ? "bg-[#5D726A] text-[#FFFFFF]"
              : "bg-[#B8C49E] text-[#000000]"
          }`}
        >
          <span className="inline-flex items-center gap-1">
            <span>{lang === "no" ? "Beste pris" : "Get Price"}</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-normal opacity-85 leading-none">
            {lang === "no" ? "Megler" : "Agency"}
          </span>
        </Link>
      </div>
    </nav>
  );
}

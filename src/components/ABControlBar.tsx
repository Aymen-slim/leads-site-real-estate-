"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export function ABControlBar() {
  const {
    lang,
    setLang,
    landingVariant,
    setLandingVariant,
    funnelVariant,
    setFunnelVariant,
    stats,
    t,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      role="region"
      aria-label={t.abBar.label}
      className="bg-[#FFFFFF] text-[#292823] border-b border-[#DFDFDF] py-1.5 md:py-2 text-[14px]"
    >
      <div className="kr-container">
        {/* Compact mobile top row: collapsible A/B pill + always-reachable 44px NO/EN toggle */}
        <div className="flex md:hidden items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            className="min-h-[44px] px-3 py-1.5 rounded-[2px] bg-[#EDF0E7] border border-[#BFBFBD] text-[#000000] text-[14px] font-medium flex items-center gap-2 cursor-pointer active:scale-[0.985]"
          >
            <span>{t.abBar.label}:</span>
            <span className="text-[#5D726A]">
              {landingVariant}/{funnelVariant}
            </span>
          </button>

          <div
            role="group"
            aria-label="Language selector"
            className="inline-flex rounded-[2px] bg-[#EDF0E7] p-0.5 gap-1"
          >
            <button
              type="button"
              onClick={() => setLang("no")}
              aria-pressed={lang === "no"}
              className={`min-h-[44px] px-3 rounded-[2px] text-[14px] font-medium transition-colors cursor-pointer ${
                lang === "no"
                  ? "bg-[#292823] text-[#FFFFFF]"
                  : "text-[#000000] hover:bg-[#DCE2CF]"
              }`}
            >
              NO
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`min-h-[44px] px-3 rounded-[2px] text-[14px] font-medium transition-colors cursor-pointer ${
                lang === "en"
                  ? "bg-[#292823] text-[#FFFFFF]"
                  : "text-[#000000] hover:bg-[#DCE2CF]"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Expanded controls: collapsible on mobile, always visible on md+ */}
        <div
          className={`${
            mobileOpen ? "flex mt-2 pt-2 border-t border-[#EDF0E7]" : "hidden"
          } md:flex flex-wrap items-center justify-between gap-2.5`}
        >
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <span className="hidden md:inline font-medium tracking-tight text-[#000000]">
              {t.abBar.label}
            </span>

            <div className="flex items-center gap-1.5 bg-[#EDF0E7] px-2.5 py-1 rounded-[2px]">
              <span className="text-[#292823] font-normal mr-1">
                {t.abBar.landingLabel}
              </span>
              <button
                type="button"
                onClick={() => setLandingVariant("A")}
                aria-pressed={landingVariant === "A"}
                className={`min-h-[44px] md:min-h-[32px] px-3 py-1 rounded-[2px] font-medium transition-colors cursor-pointer ${
                  landingVariant === "A"
                    ? "bg-[#292823] text-[#FFFFFF]"
                    : "text-[#000000] hover:bg-[#DCE2CF]"
                }`}
              >
                A ({stats.landingA})
              </button>
              <button
                type="button"
                onClick={() => setLandingVariant("B")}
                aria-pressed={landingVariant === "B"}
                className={`min-h-[44px] md:min-h-[32px] px-3 py-1 rounded-[2px] font-medium transition-colors cursor-pointer ${
                  landingVariant === "B"
                    ? "bg-[#292823] text-[#FFFFFF]"
                    : "text-[#000000] hover:bg-[#DCE2CF]"
                }`}
              >
                B ({stats.landingB})
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-[#EDF0E7] px-2.5 py-1 rounded-[2px]">
              <span className="text-[#292823] font-normal mr-1">
                {t.abBar.funnelLabel}
              </span>
              <button
                type="button"
                onClick={() => setFunnelVariant("A")}
                aria-pressed={funnelVariant === "A"}
                className={`min-h-[44px] md:min-h-[32px] px-3 py-1 rounded-[2px] font-medium transition-colors cursor-pointer ${
                  funnelVariant === "A"
                    ? "bg-[#292823] text-[#FFFFFF]"
                    : "text-[#000000] hover:bg-[#DCE2CF]"
                }`}
              >
                A ({stats.funnelA})
              </button>
              <button
                type="button"
                onClick={() => setFunnelVariant("B")}
                aria-pressed={funnelVariant === "B"}
                className={`min-h-[44px] md:min-h-[32px] px-3 py-1 rounded-[2px] font-medium transition-colors cursor-pointer ${
                  funnelVariant === "B"
                    ? "bg-[#292823] text-[#FFFFFF]"
                    : "text-[#000000] hover:bg-[#DCE2CF]"
                }`}
              >
                B ({stats.funnelB})
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div
              role="group"
              aria-label="Language selector"
              className="inline-flex rounded-[2px] bg-[#EDF0E7] p-0.5 gap-1"
            >
              <button
                type="button"
                onClick={() => setLang("no")}
                aria-pressed={lang === "no"}
                className={`px-3 py-1 rounded-[2px] text-[13px] font-medium transition-colors cursor-pointer ${
                  lang === "no"
                    ? "bg-[#292823] text-[#FFFFFF]"
                    : "text-[#000000] hover:bg-[#DCE2CF]"
                }`}
              >
                Norsk (NO)
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`px-3 py-1 rounded-[2px] text-[13px] font-medium transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-[#292823] text-[#FFFFFF]"
                    : "text-[#000000] hover:bg-[#DCE2CF]"
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

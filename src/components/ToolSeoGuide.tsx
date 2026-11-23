"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { getToolBySlug, TOOL_CATALOG } from "@/data/norwayToolsData";
import { ArrowRightIcon, ChevronDownIcon, ShieldCheckIcon } from "@/components/Icons";
import { ToolIcon } from "@/components/ToolIcon";

export function ToolSeoGuide({ slug }: { slug: string }) {
  const { lang, isModern } = useApp();
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const related = tool.relatedSlugs
    .map((s) => TOOL_CATALOG.find((item) => item.slug === s))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (isModern) {
    return (
      <section
        aria-label={lang === "no" ? "Veiledning og vanlige spørsmål" : "Guide & Frequently Asked Questions"}
        className="max-w-5xl mx-auto mt-8 space-y-6"
      >
        {/* Methodology & Data Source Card */}
        <div className="nm-card p-5 sm:p-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F2EC] border border-[#C3DEC9] text-[#0F3D2E] text-[13px] font-semibold">
            <ShieldCheckIcon className="w-4 h-4 text-[#147A53]" />
            <span>{lang === "no" ? tool.dataSourceNo : tool.dataSourceEn}</span>
          </div>

          <h2 className="nm-h2">
            {lang === "no" ? tool.guideHeadingNo : tool.guideHeadingEn}
          </h2>
          <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#3B4D44]">
            {lang === "no" ? tool.guideBodyNo : tool.guideBodyEn}
          </p>
        </div>

        {/* FAQ Accordion */}
        {tool.faqs.length > 0 && (
          <div className="nm-card p-5 sm:p-8 space-y-4">
            <h2 className="nm-h3">
              {lang === "no" ? "Ofte stilte spørsmål" : "Frequently Asked Questions"}
            </h2>
            <div className="divide-y divide-[#DCE5DF]">
              {tool.faqs.map((faq, idx) => (
                <details key={idx} open={idx === 0} className="group py-4 first:pt-1 last:pb-1">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[17px] sm:text-[18px] font-semibold text-[#121C17]">
                    <span>{lang === "no" ? faq.qNo : faq.qEn}</span>
                    <ChevronDownIcon className="w-5 h-5 text-[#147A53] shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2.5 text-[15px] sm:text-[16px] leading-relaxed text-[#3B4D44] pr-6">
                    {lang === "no" ? faq.aNo : faq.aEn}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Related Calculators for Internal SEO Linking */}
        {related.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="nm-h3">
                {lang === "no" ? "Relaterte gratis kalkulatorer" : "Related Free Calculators"}
              </h2>
              <Link
                href="/verktoy"
                className="text-[14px] font-semibold text-[#147A53] hover:text-[#0F3D2E] inline-flex items-center gap-1"
              >
                <span>{lang === "no" ? "Se alle 16" : "View all 16"}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={item.path}
                  className="group bg-[#FFFFFF] border border-[#DCE5DF] hover:border-[#147A53] rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-2xs hover:shadow-sm"
                >
                  <div className="space-y-2.5">
                    <span className="w-10 h-10 rounded-xl bg-[#E6F2EC] text-[#0F3D2E] flex items-center justify-center">
                      <ToolIcon iconKey={item.iconKey} className="w-5 h-5" />
                    </span>
                    <h3 className="text-[17px] font-semibold text-[#121C17] leading-snug">
                      {lang === "no" ? item.shortTitleNo : item.shortTitleEn}
                    </h3>
                    <p className="text-[14px] text-[#495647] leading-relaxed line-clamp-2">
                      {lang === "no" ? item.descNo : item.descEn}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#147A53]">
                    <span>{lang === "no" ? "Åpne verktøy" : "Open tool"}</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  // CLASSIC KROGSVEEN STIL
  return (
    <section
      aria-label={lang === "no" ? "Veiledning og vanlige spørsmål" : "Guide & Frequently Asked Questions"}
      className="max-w-5xl mx-auto mt-8 sm:mt-10 space-y-6"
    >
      {/* Methodology & Source Card */}
      <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-6 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#FFFFFF] border border-[#DCE2CF] text-[#292823] text-[14px] font-medium">
          <ShieldCheckIcon className="w-4 h-4 text-[#5D726A] shrink-0" />
          <span>{lang === "no" ? tool.dataSourceNo : tool.dataSourceEn}</span>
        </div>
        <h2 className="kr-h2-serif">
          {lang === "no" ? tool.guideHeadingNo : tool.guideHeadingEn}
        </h2>
        <p className="text-[17px] leading-relaxed text-[#292823]">
          {lang === "no" ? tool.guideBodyNo : tool.guideBodyEn}
        </p>
      </div>

      {/* FAQs */}
      {tool.faqs.length > 0 && (
        <div className="bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-6 sm:p-10 space-y-4">
          <h2 className="kr-h3">
            {lang === "no" ? "Ofte stilte spørsmål" : "Frequently Asked Questions"}
          </h2>
          <div className="divide-y divide-[#DFDFDF]">
            {tool.faqs.map((faq, idx) => (
              <details key={idx} open={idx === 0} className="group py-4 first:pt-1 last:pb-1">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[18px] font-medium text-[#000000]">
                  <span>{lang === "no" ? faq.qNo : faq.qEn}</span>
                  <ChevronDownIcon className="w-5 h-5 text-[#5D726A] shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2.5 text-[16px] leading-relaxed text-[#292823] pr-6">
                  {lang === "no" ? faq.aNo : faq.aEn}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Related Tools */}
      {related.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="kr-h3">
              {lang === "no" ? "Relaterte gratis kalkulatorer" : "Related Free Calculators"}
            </h2>
            <Link
              href="/verktoy"
              className="text-[15px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4 inline-flex items-center gap-1"
            >
              <span>{lang === "no" ? "Se alle 16 verktøy" : "See all 16 tools"}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={item.path}
                className="bg-[#FFFFFF] border border-[#BFBFBD] hover:border-[#5D726A] hover:bg-[#EDF0E7]/50 rounded-none p-5 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-2.5">
                  <span className="w-11 h-11 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center">
                    <ToolIcon iconKey={item.iconKey} className="w-5 h-5" />
                  </span>
                  <h3 className="text-[18px] font-medium text-[#000000] leading-snug">
                    {lang === "no" ? item.shortTitleNo : item.shortTitleEn}
                  </h3>
                  <p className="text-[15px] text-[#292823] leading-relaxed line-clamp-2">
                    {lang === "no" ? item.descNo : item.descEn}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4">
                  <span>{lang === "no" ? "Åpne kalkulator" : "Open calculator"}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export function AdminPreviewBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isPreview, landingVariant, funnelVariant } = useApp();

  if (!isAdmin || pathname.startsWith("/admin")) return null;

  const setPreview = (value: string) => {
    const url = `${pathname}?preview=${encodeURIComponent(value)}`;
    router.push(url);
    router.refresh();
  };

  return (
    <div
      role="region"
      aria-label="Admin preview bar"
      className="bg-[#292823] text-[#FFFFFF] border-b border-[#5D726A] py-2 text-[13px]"
    >
      <div className="kr-container flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2 py-0.5 bg-[#B8C49E] text-[#000000] font-semibold">
            ADMIN
          </span>
          <span className="text-[#DCE2CF]">
            {isPreview
              ? "Preview mode active (analytics paused)"
              : `Live view (you see Landing ${landingVariant}, Funnel ${funnelVariant})`}
          </span>

          <div className="inline-flex items-center gap-1 bg-[#1B1A17] px-2 py-1 border border-[#43544E]">
            <span className="text-[#DCE2CF] mr-1">Landing:</span>
            {(["A", "B"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setPreview(`landing:${v}`)}
                className={`px-2 py-0.5 font-medium cursor-pointer ${
                  landingVariant === v
                    ? "bg-[#B8C49E] text-[#000000]"
                    : "text-[#FFFFFF] hover:bg-[#43544E]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1 bg-[#1B1A17] px-2 py-1 border border-[#43544E]">
            <span className="text-[#DCE2CF] mr-1">Funnel:</span>
            {(["A", "B"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setPreview(`funnel:${v}`)}
                className={`px-2 py-0.5 font-medium cursor-pointer ${
                  funnelVariant === v
                    ? "bg-[#B8C49E] text-[#000000]"
                    : "text-[#FFFFFF] hover:bg-[#43544E]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {isPreview && (
            <button
              type="button"
              onClick={() => setPreview("clear")}
              className="px-2.5 py-1 bg-[#BA5B3E] text-[#FFFFFF] font-medium cursor-pointer hover:opacity-90"
            >
              Exit preview
            </button>
          )}
        </div>

        <Link
          href="/admin"
          className="px-3 py-1 bg-[#B8C49E] hover:bg-[#C5D0AF] text-[#000000] font-semibold inline-flex items-center gap-1.5"
        >
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}

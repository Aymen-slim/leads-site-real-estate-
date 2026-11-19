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

  const landingLabel =
    landingVariant === "M"
      ? "Modern"
      : landingVariant === "A"
      ? "Classic A"
      : "Classic B";

  return (
    <div
      role="region"
      aria-label="Admin preview bar"
      className="bg-[#0F291E] text-[#F4F7F5] border-b border-[#224737] py-2 text-[13px] font-modern"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#147A53] text-[#FFFFFF] text-[11px] font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CE5B5]" />
            Admin
          </span>
          <span className="text-[#C3D9CD]">
            {isPreview
              ? `Previewing ${landingLabel} · Funnel ${funnelVariant} (analytics paused)`
              : `Live view: ${landingLabel} · Funnel ${funnelVariant}`}
          </span>

          <div className="inline-flex items-center gap-1 bg-[#163628] rounded-full p-0.5 border border-[#28533F]">
            <span className="text-[#A8C6B7] pl-2.5 pr-1 text-[12px]">Site:</span>
            {(
              [
                { id: "A", label: "Classic A" },
                { id: "B", label: "Classic B" },
                { id: "M", label: "Modern" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPreview(`landing:${opt.id}`)}
                className={`px-2.5 py-1 rounded-full text-[12px] font-medium cursor-pointer transition-colors ${
                  landingVariant === opt.id
                    ? "bg-[#FFFFFF] text-[#0F291E] font-semibold"
                    : "text-[#D7E8DF] hover:bg-[#214B38]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1 bg-[#163628] rounded-full p-0.5 border border-[#28533F]">
            <span className="text-[#A8C6B7] pl-2.5 pr-1 text-[12px]">Form:</span>
            {(["A", "B"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setPreview(`funnel:${v}`)}
                className={`px-2.5 py-1 rounded-full text-[12px] font-medium cursor-pointer transition-colors ${
                  funnelVariant === v
                    ? "bg-[#FFFFFF] text-[#0F291E] font-semibold"
                    : "text-[#D7E8DF] hover:bg-[#214B38]"
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
              className="px-3 py-1 rounded-full bg-[#B8422C] hover:bg-[#9C3522] text-[#FFFFFF] text-[12px] font-semibold cursor-pointer transition-colors"
            >
              Exit preview
            </button>
          )}
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-1 rounded-full bg-[#E6F2EC] hover:bg-[#FFFFFF] text-[#0F291E] text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { MicrophoneVoiceIcon } from "@/components/Icons";

interface WhatsAppStickyBarProps {
  contextSummary?: string;
}

export function WhatsAppStickyBar({ contextSummary }: WhatsAppStickyBarProps) {
  const { lang, t, recordConversion } = useApp();

  const messageText = contextSummary
    ? `${t.whatsappBar.prefillDefault} (${contextSummary})`
    : t.whatsappBar.prefillDefault;

  const whatsappUrl = `https://wa.me/4790000000?text=${encodeURIComponent(
    messageText
  )}`;

  return (
    <div
      role="complementary"
      aria-label="WhatsApp Voice Message Alternative"
      className="fixed bottom-0 inset-x-0 z-50 bg-[#292823] text-[#FFFFFF] border-t-2 border-[#5D726A] shadow-[0_-6px_20px_rgba(41,40,35,0.20)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => recordConversion("whatsapp-voice-note")}
          className="w-full min-h-[54px] flex items-center justify-between gap-3 bg-[#373630] hover:bg-[#46453E] active:scale-[0.99] border border-[#5D726A] rounded-[2px] px-3.5 sm:px-5 py-2.5 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#B8C49E] text-[#000000] flex items-center justify-center shrink-0">
              <MicrophoneVoiceIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <span className="text-[15px] sm:text-[18px] font-medium tracking-tight text-[#FFFFFF] leading-snug">
              {t.whatsappBar.text}
            </span>
          </div>
          <span className="inline-flex items-center justify-center min-h-[44px] px-3 sm:px-4 py-1.5 rounded-[2px] bg-[#B8C49E] text-[#000000] font-medium text-[14px] sm:text-[16px] shrink-0 whitespace-nowrap group-hover:bg-[#DCE2CF]">
            {lang === "no" ? "Talemelding" : "Voice Note"}
          </span>
        </a>
      </div>
    </div>
  );
}

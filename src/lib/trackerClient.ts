"use client";

import { getConsent } from "@/lib/consent";
import { sendGaEvent } from "@/lib/ga";
import { ABVariant } from "@/data/translations";

const SID_KEY = "kr_sid";
const SID_AT_KEY = "kr_sid_at";
const LP_KEY = "kr_landing_page";
const REF_KEY = "kr_referrer";
const UTM_KEY = "kr_utm";
const SESSION_TTL_MS = 30 * 60 * 1000;

let fallbackSessionId: string | null = null;
let previewDisabled = false;

export function setTrackingDisabled(disabled: boolean) {
  previewDisabled = disabled;
}

export function isTrackingDisabled(): boolean {
  if (previewDisabled) return true;
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return true;
  }
  return false;
}

function makeUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateSessionId(): { sessionId: string; isNew: boolean } {
  const now = Date.now();
  try {
    const existing = sessionStorage.getItem(SID_KEY);
    const lastAt = Number(sessionStorage.getItem(SID_AT_KEY) ?? "0");
    if (existing && lastAt > 0 && now - lastAt < SESSION_TTL_MS) {
      sessionStorage.setItem(SID_AT_KEY, String(now));
      return { sessionId: existing, isNew: false };
    }
    const fresh = makeUuid();
    sessionStorage.setItem(SID_KEY, fresh);
    sessionStorage.setItem(SID_AT_KEY, String(now));
    return { sessionId: fresh, isNew: true };
  } catch {
    if (!fallbackSessionId) {
      fallbackSessionId = makeUuid();
      return { sessionId: fallbackSessionId, isNew: true };
    }
    return { sessionId: fallbackSessionId, isNew: false };
  }
}

export function getOrCreateVisitorId(): string | null {
  if (!getConsent().analytics) return null;
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith("kr_vid="));
  if (match) return decodeURIComponent(match.slice(7));
  const vid = makeUuid();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `kr_vid=${encodeURIComponent(vid)}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax${secure}`;
  return vid;
}

export interface SessionAttribution {
  landingPage: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

export function captureAttribution(currentPath: string, isNewSession: boolean): SessionAttribution {
  const fallback: SessionAttribution = {
    landingPage: currentPath,
    referrer: typeof document !== "undefined" && document.referrer ? document.referrer : null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
  };

  if (typeof window === "undefined") return fallback;
  const sp = new URLSearchParams(window.location.search);
  const urlUtm = {
    utmSource: sp.get("utm_source")?.slice(0, 80) || null,
    utmMedium: sp.get("utm_medium")?.slice(0, 80) || null,
    utmCampaign: sp.get("utm_campaign")?.slice(0, 120) || null,
  };

  try {
    if (isNewSession || !sessionStorage.getItem(LP_KEY)) {
      sessionStorage.setItem(LP_KEY, currentPath);
      if (fallback.referrer) {
        const refHost = (() => {
          try {
            return new URL(fallback.referrer!).host;
          } catch {
            return "";
          }
        })();
        if (refHost && refHost !== window.location.host) {
          sessionStorage.setItem(REF_KEY, fallback.referrer);
        } else {
          sessionStorage.removeItem(REF_KEY);
        }
      }
      sessionStorage.setItem(UTM_KEY, JSON.stringify(urlUtm));
    } else if (urlUtm.utmSource || urlUtm.utmMedium || urlUtm.utmCampaign) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(urlUtm));
    }

    const savedUtm = JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}") as Partial<SessionAttribution>;
    return {
      landingPage: sessionStorage.getItem(LP_KEY) || currentPath,
      referrer: sessionStorage.getItem(REF_KEY) || null,
      utmSource: savedUtm.utmSource ?? urlUtm.utmSource ?? null,
      utmMedium: savedUtm.utmMedium ?? urlUtm.utmMedium ?? null,
      utmCampaign: savedUtm.utmCampaign ?? urlUtm.utmCampaign ?? null,
    };
  } catch {
    return { ...fallback, ...urlUtm };
  }
}

export interface TrackEventInput {
  type: "page_view" | "page_time" | "cta_click" | "funnel_view" | "funnel_step";
  path: string;
  view_id?: string | null;
  landing_variant?: ABVariant;
  funnel_variant?: ABVariant;
  routed?: boolean;
  source?: string | null;
  step?: string | null;
  duration_ms?: number;
}

export function sendTrackEvent(input: TrackEventInput, useBeacon = false) {
  if (isTrackingDisabled() || typeof window === "undefined") return;
  const { sessionId, isNew } = getOrCreateSessionId();
  const attr = captureAttribution(input.path, isNew);
  const visitorId = getOrCreateVisitorId();

  const payload = {
    ...input,
    session_id: sessionId,
    visitor_id: visitorId,
    referrer: attr.referrer,
    utm_source: attr.utmSource,
    utm_medium: attr.utmMedium,
    utm_campaign: attr.utmCampaign,
  };

  const body = JSON.stringify(payload);
  if (useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const ok = navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    if (ok) return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackCtaAndGa(
  source: string,
  opts: { path?: string; landingVariant?: ABVariant; funnelVariant?: ABVariant } = {}
) {
  if (isTrackingDisabled() || typeof window === "undefined") return;
  const path = opts.path ?? window.location.pathname;
  sendTrackEvent({
    type: "cta_click",
    path,
    source,
    landing_variant: opts.landingVariant,
    funnel_variant: opts.funnelVariant,
  });
  if (getConsent().analytics) {
    sendGaEvent("cta_click", {
      source,
      page_path: path,
      landing_variant: opts.landingVariant,
    });
  }
}

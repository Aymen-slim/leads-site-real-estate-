"use client";

// Google Analytics 4 loader with Consent Mode v2.
// Nothing is sent to Google and gtag.js is NOT loaded unless the visitor opted into analytics.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __krGaLoaded?: string;
  }
}

export function getGaId(): string {
  return process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";
}

function ensureGtagStub() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
}

export function initGaConsentDefault() {
  const gaId = getGaId();
  if (!gaId || typeof window === "undefined") return;
  ensureGtagStub();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

export function enableGoogleAnalytics(props?: {
  landing_variant?: string;
  funnel_variant?: string;
}) {
  const gaId = getGaId();
  if (!gaId || typeof window === "undefined") return;
  ensureGtagStub();

  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });

  if (window.__krGaLoaded !== gaId) {
    window.__krGaLoaded = gaId;
    window.gtag?.("js", new Date());
    window.gtag?.("config", gaId, {
      send_page_view: false,
      anonymize_ip: true,
    });

    if (!document.querySelector(`script[data-kr-ga="${gaId}"]`)) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      s.dataset.krGa = gaId;
      document.head.appendChild(s);
    }
  }

  if (props) {
    window.gtag?.("set", "user_properties", props);
  }
}

export function disableGoogleAnalytics() {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: "denied",
  });
}

export function sendGaEvent(name: string, params: Record<string, unknown> = {}) {
  const gaId = getGaId();
  if (!gaId || typeof window === "undefined" || !window.__krGaLoaded || !window.gtag) return;
  window.gtag("event", name, params);
}

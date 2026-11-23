"use client";

// Google Analytics 4 + Google Tag Manager loader with Consent Mode v2.
// Nothing is sent to Google and tags are NOT loaded unless the visitor opted into analytics.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __krGaLoaded?: string;
    __krGtmLoaded?: string;
    __krGaConsentInit?: boolean;
  }
}

const DEFAULT_GA_ID = "G-WLJRV4ECG6";
const DEFAULT_GTM_ID = "GTM-WMFLTLBQ";

export function getGaId(): string {
  return process.env.NEXT_PUBLIC_GA_ID?.trim() || DEFAULT_GA_ID;
}

export function getGtmId(): string {
  return process.env.NEXT_PUBLIC_GTM_ID?.trim() || DEFAULT_GTM_ID;
}

function ensureGtagStub() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    // Must push `arguments` (not `...args` Array) so gtag.js processes queued items when loaded.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
}

export function initGaConsentDefault() {
  const gaId = getGaId();
  const gtmId = getGtmId();
  if ((!gaId && !gtmId) || typeof window === "undefined") return;
  if (window.__krGaConsentInit) return;
  window.__krGaConsentInit = true;
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
  const gtmId = getGtmId();
  if ((!gaId && !gtmId) || typeof window === "undefined") return;
  ensureGtagStub();

  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });

  if (gtmId && window.__krGtmLoaded !== gtmId) {
    window.__krGtmLoaded = gtmId;
    window.dataLayer?.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    if (!document.querySelector(`script[data-kr-gtm="${gtmId}"]`)) {
      const gtmScript = document.createElement("script");
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      gtmScript.dataset.krGtm = gtmId;
      document.head.appendChild(gtmScript);
    }
  }

  if (gaId && window.__krGaLoaded !== gaId) {
    window.__krGaLoaded = gaId;
    window.gtag?.("js", new Date());
    window.gtag?.("config", gaId, {
      send_page_view: false,
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

// Google Analytics 4 (G-WLJRV4ECG6 / GTM-WMFLTLBQ) + Google Ads Tag (GTM-P3HSLXJH) with Consent Mode v2.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __krGaLoaded?: string;
    __krGtmLoaded?: Record<string, boolean>;
    __krGaConsentInit?: boolean;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-WLJRV4ECG6";
export const GTM_TAG_ID =
  process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-WMFLTLBQ";
export const GOOGLE_ADS_GTM_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_GTM_ID?.trim() || "GTM-P3HSLXJH";
export const GTM_IDS = Array.from(
  new Set([GTM_TAG_ID, GOOGLE_ADS_GTM_ID].filter(Boolean))
);

export function getGaId(): string {
  return GA_MEASUREMENT_ID;
}

export function getGtmId(): string {
  return GTM_TAG_ID;
}

export function getGtmIds(): string[] {
  return GTM_IDS;
}

function ensureGtagStub() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
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
  const gtmIds = getGtmIds();
  if ((!gaId && gtmIds.length === 0) || typeof window === "undefined") return;
  ensureGtagStub();

  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });

  window.__krGtmLoaded = window.__krGtmLoaded || {};
  let pushedGtmStart = false;
  for (const gtmId of gtmIds) {
    if (window.__krGtmLoaded[gtmId]) continue;
    window.__krGtmLoaded[gtmId] = true;
    if (!document.querySelector(`script[src*="gtm.js?id=${encodeURIComponent(gtmId)}"]`)) {
      if (!pushedGtmStart) {
        window.dataLayer?.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        pushedGtmStart = true;
      }
      const gtmScript = document.createElement("script");
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      gtmScript.dataset.krGtm = gtmId;
      document.head.appendChild(gtmScript);
    }
  }

  if (gaId && window.__krGaLoaded !== gaId) {
    window.__krGaLoaded = gaId;
    if (!window.__krGaConsentInit) {
      window.gtag?.("js", new Date());
    }
    window.gtag?.("config", gaId, {
      send_page_view: false,
    });
  }

  if (props) {
    window.gtag?.("set", "user_properties", props);
  }
}

export function disableGoogleAnalytics() {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function sendGaEvent(name: string, params: Record<string, unknown> = {}) {
  const gaId = getGaId();
  if (!gaId || typeof window === "undefined" || !window.__krGaLoaded || !window.gtag) return;
  window.gtag("event", name, params);
}

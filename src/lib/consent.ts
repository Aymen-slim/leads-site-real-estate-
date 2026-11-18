"use client";

// Cookie consent store. "necessary" cookies (language, A/B assignment, consent choice, admin
// session) are always allowed. "analytics" (kr_vid visitor id + Google Analytics) needs opt-in.

export const CONSENT_COOKIE = "kr_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 180 days
const OPEN_EVENT = "kr-consent-open";
const CHANGE_EVENT = "kr-consent-change";

export interface ConsentState {
  decided: boolean;
  analytics: boolean;
}

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function deleteCookie(name: string, domain?: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0${domain ? `; Domain=${domain}` : ""}`;
}

export function getConsent(): ConsentState {
  const raw = readCookie(CONSENT_COOKIE);
  if (raw === "all") return { decided: true, analytics: true };
  if (raw === "necessary") return { decided: true, analytics: false };
  return { decided: false, analytics: false };
}

export function setConsent(analytics: boolean) {
  const before = getConsent();
  writeCookie(CONSENT_COOKIE, analytics ? "all" : "necessary", CONSENT_MAX_AGE);
  if (!analytics) {
    // Withdrawal: remove analytics cookies we or Google set.
    deleteCookie("kr_vid");
    const host = location.hostname;
    const root = host.split(".").slice(-2).join(".");
    for (const c of document.cookie.split("; ")) {
      const name = c.split("=")[0];
      if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
        deleteCookie(name);
        deleteCookie(name, `.${root}`);
        deleteCookie(name, `.${host}`);
      }
    }
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: getConsent() }));
  // GA cannot be fully unloaded once running; reload so it is gone after withdrawal.
  if (before.analytics && !analytics) location.reload();
}

export function onConsentChange(cb: (s: ConsentState) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<ConsentState>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentOpen(cb: () => void): () => void {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}

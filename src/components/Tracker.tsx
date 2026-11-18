"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { getConsent, onConsentChange } from "@/lib/consent";
import {
  disableGoogleAnalytics,
  enableGoogleAnalytics,
  initGaConsentDefault,
  sendGaEvent,
} from "@/lib/ga";
import {
  captureAttribution,
  getOrCreateSessionId,
  isTrackingDisabled,
  sendTrackEvent,
  setTrackingDisabled,
} from "@/lib/trackerClient";

const IDLE_CUTOFF_MS = 30_000;

function makeViewId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function Tracker() {
  const pathname = usePathname();
  const { landingVariant, funnelVariant, isPreview } = useApp();

  const viewIdRef = useRef<string | null>(null);
  const pathRef = useRef<string>(pathname);
  const pendingMsRef = useRef<number>(0);
  const viewStartRef = useRef<number>(Date.now());
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    setTrackingDisabled(isPreview);
  }, [isPreview]);

  // Consent Mode v2 + Google Analytics 4 sync
  useEffect(() => {
    initGaConsentDefault();
    const sync = (analyticsAllowed: boolean) => {
      if (isPreview || pathname.startsWith("/admin")) return;
      if (analyticsAllowed) {
        enableGoogleAnalytics({
          landing_variant: landingVariant,
          funnel_variant: funnelVariant,
        });
      } else {
        disableGoogleAnalytics();
      }
    };
    sync(getConsent().analytics);
    return onConsentChange((state) => {
      sync(state.analytics);
      if (state.analytics && !isTrackingDisabled()) {
        sendGaEvent("page_view", {
          page_path: pathRef.current,
          page_title: document.title,
          landing_variant: landingVariant,
          funnel_variant: funnelVariant,
        });
      }
    });
  }, [landingVariant, funnelVariant, isPreview, pathname]);

  // Page view + active time tracking
  useEffect(() => {
    if (isPreview || pathname.startsWith("/admin")) return;

    const flushTime = (useBeacon: boolean) => {
      const ms = pendingMsRef.current;
      const vid = viewIdRef.current;
      if (ms >= 500 && vid && !isTrackingDisabled()) {
        pendingMsRef.current = 0;
        sendTrackEvent(
          {
            type: "page_time",
            path: pathRef.current,
            view_id: vid,
            duration_ms: ms,
            landing_variant: landingVariant,
            funnel_variant: funnelVariant,
          },
          useBeacon
        );
      }
    };

    const viewId = makeViewId();
    viewIdRef.current = viewId;
    pathRef.current = pathname;
    pendingMsRef.current = 0;
    const now = Date.now();
    viewStartRef.current = now;
    lastActivityRef.current = now;

    const { isNew } = getOrCreateSessionId();
    captureAttribution(pathname, isNew);

    sendTrackEvent({
      type: "page_view",
      path: pathname,
      view_id: viewId,
      landing_variant: landingVariant,
      funnel_variant: funnelVariant,
    });

    if (getConsent().analytics) {
      sendGaEvent("page_view", {
        page_path: pathname,
        page_title: document.title,
        landing_variant: landingVariant,
        funnel_variant: funnelVariant,
      });
    }

    let lastBump = now;
    const bumpActivity = () => {
      const t = Date.now();
      if (t - lastBump > 500) {
        lastBump = t;
        lastActivityRef.current = t;
      }
    };

    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
      "mousemove",
    ];
    for (const ev of events) {
      window.addEventListener(ev, bumpActivity, { passive: true });
    }

    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const t = Date.now();
      const engaged =
        t - lastActivityRef.current < IDLE_CUTOFF_MS || t - viewStartRef.current < 5000;
      if (engaged) {
        pendingMsRef.current = Math.min(1_800_000, pendingMsRef.current + 1000);
      }
    }, 1000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushTime(true);
      else lastActivityRef.current = Date.now();
    };
    const onPageHide = () => flushTime(true);

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.clearInterval(tick);
      for (const ev of events) window.removeEventListener(ev, bumpActivity);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      flushTime(true);
    };
  }, [pathname, landingVariant, funnelVariant, isPreview]);

  return null;
}

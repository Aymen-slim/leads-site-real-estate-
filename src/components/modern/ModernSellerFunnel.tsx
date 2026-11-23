"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ABVariant } from "@/data/translations";
import { NORWAY_CITIES, formatNok } from "@/data/norwayData";
import { getConsent } from "@/lib/consent";
import { sendGaEvent } from "@/lib/ga";
import {
  captureAttribution,
  getOrCreateSessionId,
  getOrCreateVisitorId,
  isTrackingDisabled,
  sendTrackEvent,
} from "@/lib/trackerClient";
import type { SellerFunnelProps } from "@/components/SellerFunnel";
import {
  HouseIcon,
  CabinMountainIcon,
  ApartmentIcon,
  LocationCrosshairIcon,
  CheckMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PhoneKeypadIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

function ModernSellerFunnelInner({
  initialFormVariant,
  initialRouted = false,
  initialSource = "nav",
}: SellerFunnelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang, landingVariant, funnelVariant, isPreview, t } = useApp();

  const activeFormVariant: ABVariant = initialFormVariant ?? funnelVariant;
  const activeSource = searchParams.get("source") || initialSource || "nav";
  const isRouted = initialRouted;

  const [step, setStep] = useState<number>(1);
  const [propertyType, setPropertyType] = useState<string>("");
  const [surfaceArea, setSurfaceArea] = useState<string>("");
  const [cityId, setCityId] = useState<string>(NORWAY_CITIES[0].id);
  const [areaId, setAreaId] = useState<string>(NORWAY_CITIES[0].neighborhoods[0].id);
  const [gpsStatus, setGpsStatus] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneTouched, setPhoneTouched] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const sentStepsRef = useRef<Set<string>>(new Set());
  const funnelViewKeyRef = useRef<string>("");

  // Funnel B (single-page typed 4-question form)
  const [typedProperty, setTypedProperty] = useState<string>("");
  const [typedLocation, setTypedLocation] = useState<string>("");
  const [bErrors, setBErrors] = useState<{
    property?: string;
    location?: string;
    name?: string;
    phone?: string;
  }>({});
  const bPropRef = useRef<HTMLInputElement>(null);
  const bLocRef = useRef<HTMLInputElement>(null);
  const bNameRef = useRef<HTMLInputElement>(null);
  const bPhoneRef = useRef<HTMLInputElement>(null);

  const [prefillBanner, setPrefillBanner] = useState<string>("");

  useEffect(() => {
    const src = searchParams.get("source");
    const paramType = searchParams.get("type");
    const paramSize = searchParams.get("size");
    const paramCity = searchParams.get("city");
    const paramArea = searchParams.get("area");
    const paramPrice = searchParams.get("price");
    const paramNet = searchParams.get("net");
    const paramHeirs = searchParams.get("heirs");
    const paramRepairs = searchParams.get("repairs");
    const paramZone = searchParams.get("zone");

    if (paramCity) {
      const foundCity = NORWAY_CITIES.find((c) => c.id === paramCity);
      if (foundCity) {
        setCityId(foundCity.id);
        const matchedArea = paramArea
          ? foundCity.neighborhoods.find((n) => n.id === paramArea)
          : undefined;
        const resolvedArea = matchedArea || foundCity.neighborhoods[0];
        setAreaId(resolvedArea.id);
        setTypedLocation(`${foundCity.name}, ${resolvedArea.name}`);
      }
    }

    if (
      paramType === "house" ||
      paramType === "land" ||
      paramType === "apartment" ||
      paramType === "cabin"
    ) {
      setPropertyType(paramType);
      const typeLabel =
        paramType === "house"
          ? lang === "no"
            ? "Enebolig"
            : "House"
          : paramType === "cabin"
          ? lang === "no"
            ? "Hytte"
            : "Cabin"
          : paramType === "land"
          ? lang === "no"
            ? "Byggetomt"
            : "Plot of Land"
          : lang === "no"
          ? "Leilighet"
          : "Apartment";
      setTypedProperty(paramSize ? `${typeLabel}, ${paramSize} m²` : typeLabel);
    } else if (paramSize) {
      setTypedProperty(`${paramSize} m²`);
    }

    if (paramSize) {
      setSurfaceArea(paramSize);
    }

    const summaryParts: string[] = [];
    if (src === "price-m2" && paramCity) {
      summaryParts.push(
        lang === "no"
          ? `Nabolag valgt: ${paramCity.toUpperCase()}`
          : `Neighborhood pre-filled: ${paramCity.toUpperCase()}`
      );
    }
    if (paramPrice && paramNet) {
      summaryParts.push(
        lang === "no"
          ? `Forventet pris: ${formatNok(Number(paramPrice))} (Netto: ${formatNok(
              Number(paramNet)
            )})`
          : `Expected price: ${formatNok(Number(paramPrice))} (Net: ${formatNok(
              Number(paramNet)
            )})`
      );
    }
    if (paramZone) {
      summaryParts.push(
        lang === "no"
          ? `Reguleringssone: ${paramZone.toUpperCase()}`
          : `Zone: ${paramZone.toUpperCase()}`
      );
    }
    if (paramHeirs) {
      summaryParts.push(
        lang === "no"
          ? `Familieoppgjør (${paramHeirs} arvinger)`
          : `Family Estate (${paramHeirs} heirs)`
      );
    }
    if (paramRepairs) {
      summaryParts.push(
        lang === "no"
          ? `Selges som den er (${paramRepairs})`
          : `Sell As-Is (${paramRepairs})`
      );
    }
    const paramBuyout = searchParams.get("buyout");
    const paramBrokerCost = searchParams.get("brokerCost");
    const paramBridge = searchParams.get("bridge");
    const paramPropTax = searchParams.get("propTax");
    const paramEnergy = searchParams.get("energyGrade");
    const paramSun = searchParams.get("sunHours");
    if (paramBuyout) {
      summaryParts.push(
        lang === "no"
          ? `Utkjøpssum: ${formatNok(Number(paramBuyout))}`
          : `Buyout sum: ${formatNok(Number(paramBuyout))}`
      );
    }
    if (paramBrokerCost) {
      summaryParts.push(
        lang === "no"
          ? `Meglerkostnad estimat: ${formatNok(Number(paramBrokerCost))}`
          : `Broker fee est.: ${formatNok(Number(paramBrokerCost))}`
      );
    }
    if (paramBridge) {
      summaryParts.push(
        lang === "no"
          ? `Mellomfinansiering: ${formatNok(Number(paramBridge))}`
          : `Bridge cost: ${formatNok(Number(paramBridge))}`
      );
    }
    if (paramPropTax) {
      summaryParts.push(
        lang === "no"
          ? `Eiendomsskatt: ${formatNok(Number(paramPropTax))}/år`
          : `Property tax: ${formatNok(Number(paramPropTax))}/yr`
      );
    }
    if (paramEnergy) {
      summaryParts.push(
        lang === "no" ? `Energimerke ${paramEnergy}` : `Energy grade ${paramEnergy}`
      );
    }
    if (paramSun) {
      summaryParts.push(
        lang === "no" ? `Sommersol: ${paramSun} t` : `Summer sun: ${paramSun}h`
      );
    }

    if (summaryParts.length > 0) {
      setPrefillBanner(summaryParts.join(" · "));
    }

    if (paramType && paramSize) {
      setStep(3);
    } else if (paramType) {
      setStep(2);
    }
  }, [searchParams, lang]);

  const currentCity =
    NORWAY_CITIES.find((c) => c.id === cityId) || NORWAY_CITIES[0];
  const currentArea =
    currentCity.neighborhoods.find((n) => n.id === areaId) ||
    currentCity.neighborhoods[0];

  const selectAndAdvance = (nextStep: number, callback: () => void) => {
    callback();
    window.setTimeout(() => {
      setStep(nextStep);
    }, 160);
  };

  const handleDetectGps = () => {
    setGpsStatus(t.funnel.gpsDetecting);
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          let bestCity = NORWAY_CITIES[0];
          let bestArea = NORWAY_CITIES[0].neighborhoods[0];
          let minDist = Infinity;

          for (const c of NORWAY_CITIES) {
            for (const n of c.neighborhoods) {
              const d =
                Math.pow(latitude - n.lat, 2) + Math.pow(longitude - n.lng, 2);
              if (d < minDist) {
                minDist = d;
                bestCity = c;
                bestArea = n;
              }
            }
          }

          setCityId(bestCity.id);
          setAreaId(bestArea.id);
          setGpsStatus(`${t.funnel.gpsDetected} ${bestCity.name} — ${bestArea.name}`);
          window.setTimeout(() => {
            setStep(4);
          }, 350);
        },
        () => {
          setGpsStatus(
            `${t.funnel.gpsDetected} ${currentCity.name} — ${currentArea.name}`
          );
          window.setTimeout(() => {
            setStep(4);
          }, 350);
        },
        { timeout: 4000 }
      );
    } else {
      setGpsStatus(
        `${t.funnel.gpsDetected} ${currentCity.name} — ${currentArea.name}`
      );
      window.setTimeout(() => {
        setStep(4);
      }, 350);
    }
  };

  const validatePhone = (val: string): boolean => {
    const digits = val.replace(/\D/g, "");
    return digits.length >= 8;
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    if (phone && !validatePhone(phone)) {
      setPhoneError(t.funnel.phoneError);
    } else {
      setPhoneError("");
    }
  };

  const handlePhoneInput = (val: string) => {
    setPhone(val);
    if (phoneError && validatePhone(val)) {
      setPhoneError("");
    }
  };

  const emitFunnelStep = useCallback(
    (stepKey: string) => {
      if (isPreview || isTrackingDisabled()) return;
      const cacheKey = `${activeFormVariant}:${stepKey}`;
      if (sentStepsRef.current.has(cacheKey)) return;
      sentStepsRef.current.add(cacheKey);

      sendTrackEvent({
        type: "funnel_step",
        path: pathname,
        landing_variant: landingVariant,
        funnel_variant: activeFormVariant,
        routed: isRouted,
        source: activeSource,
        step: stepKey,
      });

      if (getConsent().analytics) {
        sendGaEvent("funnel_step", {
          step: stepKey,
          form_variant: activeFormVariant,
          source: activeSource,
          routed: isRouted,
        });
      }
    },
    [activeFormVariant, activeSource, isPreview, isRouted, landingVariant, pathname]
  );

  useEffect(() => {
    if (isPreview || isTrackingDisabled()) return;
    const viewKey = `${pathname}|${activeFormVariant}|${activeSource}|${isRouted}`;
    if (funnelViewKeyRef.current === viewKey) return;
    funnelViewKeyRef.current = viewKey;
    sentStepsRef.current.clear();

    sendTrackEvent({
      type: "funnel_view",
      path: pathname,
      landing_variant: landingVariant,
      funnel_variant: activeFormVariant,
      routed: isRouted,
      source: activeSource,
    });
  }, [activeFormVariant, activeSource, isPreview, isRouted, landingVariant, pathname]);

  useEffect(() => {
    if (activeFormVariant !== "A" || submitted) return;
    emitFunnelStep(`step_${step}`);
  }, [activeFormVariant, emitFunnelStep, step, submitted]);

  const submitLead = async (payload: {
    propertyType?: string;
    size?: string;
    city?: string;
    area?: string;
    timeline?: string;
    propertyText?: string;
    locationText?: string;
  }) => {
    setIsSubmitting(true);
    setSubmitError("");

    const { sessionId, isNew } = getOrCreateSessionId();
    const attr = captureAttribution(pathname, isNew);
    const visitorId = getOrCreateVisitorId();

    const details: Record<string, string> = {};
    for (const key of [
      "price",
      "net",
      "heirs",
      "repairs",
      "zone",
      "years",
      "value",
      "tax",
      "buyout",
      "brokerCost",
      "bridge",
      "rentYield",
      "propTax",
      "docFee",
      "cabinNight",
      "energyGrade",
      "leaseBuyout",
      "sunHours",
      "municipality",
    ]) {
      const val = searchParams.get(key);
      if (val) details[key] = val;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phone.trim(),
          propertyType: payload.propertyType || null,
          size: payload.size || null,
          city: payload.city || null,
          area: payload.area || null,
          timeline: payload.timeline || null,
          propertyText: payload.propertyText || null,
          locationText: payload.locationText || null,
          source: activeSource,
          landingPage: attr.landingPage,
          landingVariant,
          formVariant: activeFormVariant,
          routed: isRouted,
          sessionId,
          visitorId,
          referrer: attr.referrer,
          utmSource: attr.utmSource,
          utmMedium: attr.utmMedium,
          utmCampaign: attr.utmCampaign,
          lang,
          details,
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        setSubmitError(
          errData.error ||
            (lang === "no"
              ? "Kunne ikke sende inn skjemaet. Vennligst prøv igjen."
              : "Could not submit your request. Please try again.")
        );
        return;
      }

      emitFunnelStep("submit");
      if (getConsent().analytics && !isPreview) {
        sendGaEvent("generate_lead", {
          source: activeSource,
          landing_page: attr.landingPage,
          landing_variant: landingVariant,
          form_variant: activeFormVariant,
          routed: isRouted,
          property_type: payload.propertyType || "typed",
          city: payload.city || payload.locationText || "",
        });
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        lang === "no"
          ? "Nettverksfeil. Sjekk tilkoblingen og prøv igjen."
          : "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    let hasError = false;
    if (!fullName.trim()) {
      setNameError(
        lang === "no"
          ? "Vennligst skriv inn ditt fulle navn."
          : "Please enter your full name."
      );
      hasError = true;
    } else {
      setNameError("");
    }
    if (!validatePhone(phone)) {
      setPhoneTouched(true);
      setPhoneError(t.funnel.phoneError);
      hasError = true;
    }
    if (hasError) return;

    await submitLead({
      propertyType: propertyType || searchParams.get("type") || undefined,
      size: surfaceArea || searchParams.get("size") || undefined,
      city: currentCity.name,
      area: currentArea.name,
      timeline: timeline || undefined,
    });
  };

  const handleFunnelBSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const nextErrors: {
      property?: string;
      location?: string;
      name?: string;
      phone?: string;
    } = {};

    if (!typedProperty.trim()) {
      nextErrors.property =
        lang === "no"
          ? "Vennligst skriv inn eiendomstype og størrelse."
          : "Please type your property type and approximate size.";
    }
    if (!typedLocation.trim()) {
      nextErrors.location =
        lang === "no"
          ? "Vennligst skriv inn adresse, bydel eller kommune."
          : "Please type your property address or area.";
    }
    if (!fullName.trim()) {
      nextErrors.name =
        lang === "no"
          ? "Vennligst skriv inn ditt fulle navn."
          : "Please enter your full name.";
    }
    if (!validatePhone(phone)) {
      nextErrors.phone = t.funnel.phoneError;
    }

    setBErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.property) bPropRef.current?.focus();
      else if (nextErrors.location) bLocRef.current?.focus();
      else if (nextErrors.name) bNameRef.current?.focus();
      else if (nextErrors.phone) bPhoneRef.current?.focus();
      return;
    }

    await submitLead({
      propertyType: searchParams.get("type") || undefined,
      size: searchParams.get("size") || undefined,
      propertyText: typedProperty.trim(),
      locationText: typedLocation.trim(),
    });
  };

  // Summary chips of selected answers
  const chips: string[] = [];
  if (propertyType) {
    chips.push(
      propertyType === "house"
        ? t.funnel.typeHouse
        : propertyType === "cabin"
        ? t.funnel.typeCabin
        : propertyType === "land"
        ? t.funnel.typeLand
        : t.funnel.typeApt
    );
  }
  if (surfaceArea) {
    const sizeLabels: Record<string, string> = {
      "under-40": t.funnel.size1,
      "40-80": t.funnel.size2,
      "80-120": t.funnel.size3,
      "over-120": t.funnel.size4,
    };
    chips.push(sizeLabels[surfaceArea] || `${surfaceArea.replace("-", "–")} m²`);
  }
  if (step >= 4) chips.push(`${currentCity.name} · ${currentArea.name}`);

  return (
    <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="nm-h1">
            {lang === "no"
              ? "Finn riktig megler for ditt boligsalg"
              : "Find the right agent for your home sale"}
          </h1>
          <p className="nm-body-lg mt-2 max-w-2xl">
            {lang === "no"
              ? "Svar på fire raske spørsmål, så finner vi meglerne som kjenner nabolaget ditt best – og har aktive boligkjøpere i ditt nabolag."
              : "Answer four quick questions and we will match you with the agents who know your neighborhood best and have active buyers in your area."}
          </p>
        </div>

        {prefillBanner && (
          <div
            role="status"
            className="bg-[#FEF6E2] border border-[#ECD8A4] rounded-xl p-4 flex items-center gap-3"
          >
            <span className="w-8 h-8 rounded-full bg-[#147A53] text-[#FFFFFF] flex items-center justify-center shrink-0">
              <CheckMarkIcon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-[#121C17]">
                {t.funnel.prefillNotice}
              </p>
              <p className="text-[15px] text-[#3B4D44] break-words">{prefillBanner}</p>
            </div>
          </div>
        )}

        {activeFormVariant === "B" && !submitted && (
          <div className="bg-[#0F3D2E] text-[#FFFFFF] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <ShieldCheckIcon className="w-7 h-7 text-[#6CC79B] shrink-0" />
              <div className="min-w-0">
                <p className="text-[16px] sm:text-[17px] font-semibold text-[#FFFFFF]">
                  {t.funnel.variantBBanner}
                </p>
                <p className="text-[14px] text-[#C8E4D6]">
                  {currentCity.name} ({currentArea.name}) ·{" "}
                  {formatNok(
                    propertyType === "land"
                      ? currentArea.landPriceM2
                      : currentArea.housePriceM2
                  )}{" "}
                  / m²
                </p>
              </div>
            </div>
            <div className="bg-[#195340] px-4 py-2 rounded-xl border border-[#2C6B55] text-left sm:text-right shrink-0">
              <span className="block text-[12px] text-[#C8E4D6]">
                {lang === "no" ? "Kjøperinteresse i sonen" : "Zone Buyer Demand"}
              </span>
              <span className="text-xl font-semibold text-[#FFFFFF] tabular-nums whitespace-nowrap">
                {currentArea.buyerDemandScore} / 100
              </span>
            </div>
          </div>
        )}

        <div className="nm-card p-4 sm:p-10">
          {submitted ? (
            <div role="status" aria-live="polite" className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#E6F2EC] text-[#147A53] flex items-center justify-center mx-auto">
                <CheckMarkIcon className="w-9 h-9" />
              </div>
              <h2 className="nm-h2">{t.funnel.successTitle}</h2>
              <p className="nm-body-lg max-w-xl mx-auto">{t.funnel.successSub}</p>

              <div className="max-w-lg mx-auto bg-[#F8FAF9] border border-[#DCE5DF] rounded-xl p-5 text-left space-y-2.5 text-[17px]">
                <div className="flex justify-between gap-4">
                  <span className="text-[#3B4D44]">
                    {lang === "no" ? "Navn:" : "Name:"}
                  </span>
                  <span className="font-semibold text-[#121C17]">{fullName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#3B4D44]">
                    {lang === "no" ? "Telefon:" : "Phone:"}
                  </span>
                  <span className="font-semibold text-[#121C17] tabular-nums whitespace-nowrap">
                    {phone}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#3B4D44]">
                    {lang === "no" ? "Område:" : "Location:"}
                  </span>
                  <span className="font-semibold text-[#0F3D2E] text-right">
                    {activeFormVariant === "B" && typedLocation
                      ? typedLocation
                      : `${currentCity.name} — ${currentArea.name}`}
                  </span>
                </div>
                {activeFormVariant === "B" && typedProperty && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[#3B4D44]">
                      {lang === "no" ? "Eiendom:" : "Property:"}
                    </span>
                    <span className="font-semibold text-[#121C17] text-right">
                      {typedProperty}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                }}
                className="nm-btn-primary"
              >
                {t.funnel.resetBtn}
              </button>
            </div>
          ) : activeFormVariant === "B" ? (
            <section aria-labelledby="funnel-b-heading" className="space-y-6">
              <div>
                <h2 id="funnel-b-heading" className="nm-h2">
                  {lang === "no"
                    ? "4 raske spørsmål om eiendommen din"
                    : "4 quick questions about your property"}
                </h2>
                <p className="nm-body-lg mt-2">
                  {lang === "no"
                    ? "Fyll ut feltene nedenfor."
                    : "Type your answers below."}
                </p>
              </div>

              <form
                onSubmit={handleFunnelBSubmit}
                onFocusCapture={() => emitFunnelStep("started")}
                noValidate
                aria-labelledby="funnel-b-heading"
                className="space-y-5 sm:space-y-6 pt-2"
              >
                <div>
                  <label
                    htmlFor="funnel-b-property"
                    className="block text-[18px] sm:text-xl font-semibold text-[#121C17] mb-2"
                  >
                    {lang === "no"
                      ? "1. Hva slags eiendom og størrelse ønsker du å selge?"
                      : "1. What type of property and size are you selling?"}{" "}
                    <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={bPropRef}
                    id="funnel-b-property"
                    name="propertyDetails"
                    type="text"
                    required
                    enterKeyHint="next"
                    aria-invalid={bErrors.property ? "true" : "false"}
                    aria-describedby={bErrors.property ? "b-prop-error" : undefined}
                    value={typedProperty}
                    onChange={(e) => {
                      setTypedProperty(e.target.value);
                      if (bErrors.property && e.target.value.trim()) {
                        setBErrors((prev) => ({ ...prev, property: undefined }));
                      }
                    }}
                    placeholder={
                      lang === "no"
                        ? "F.eks. Enebolig, ca. 180 m²"
                        : "e.g. Detached house, approx. 180 m²"
                    }
                    className="w-full min-h-[60px] sm:min-h-[64px] px-4 sm:px-5 py-3.5 text-[19px] sm:text-xl font-semibold bg-[#F8FAF9] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17]"
                  />
                  {bErrors.property && (
                    <p
                      id="b-prop-error"
                      role="alert"
                      className="mt-2 text-base font-medium text-[#B8422C]"
                    >
                      {bErrors.property}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="funnel-b-location"
                    className="block text-[18px] sm:text-xl font-semibold text-[#121C17] mb-2"
                  >
                    {lang === "no"
                      ? "2. Adresse, bydel eller kommune"
                      : "2. Property address or city & neighborhood"}{" "}
                    <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={bLocRef}
                    id="funnel-b-location"
                    name="propertyAddress"
                    type="text"
                    required
                    autoComplete="street-address"
                    enterKeyHint="next"
                    aria-invalid={bErrors.location ? "true" : "false"}
                    aria-describedby={bErrors.location ? "b-loc-error" : undefined}
                    value={typedLocation}
                    onChange={(e) => {
                      setTypedLocation(e.target.value);
                      if (bErrors.location && e.target.value.trim()) {
                        setBErrors((prev) => ({ ...prev, location: undefined }));
                      }
                    }}
                    placeholder={
                      lang === "no"
                        ? "F.eks. Frognerveien 12, Oslo"
                        : "e.g. Frognerveien 12, Oslo"
                    }
                    className="w-full min-h-[60px] sm:min-h-[64px] px-4 sm:px-5 py-3.5 text-[19px] sm:text-xl font-semibold bg-[#F8FAF9] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17]"
                  />
                  {bErrors.location && (
                    <p
                      id="b-loc-error"
                      role="alert"
                      className="mt-2 text-base font-medium text-[#B8422C]"
                    >
                      {bErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="funnel-b-name"
                    className="block text-[18px] sm:text-xl font-semibold text-[#121C17] mb-2"
                  >
                    {lang === "no" ? "3. Ditt fulle navn" : "3. Your full name"}{" "}
                    <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={bNameRef}
                    id="funnel-b-name"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    aria-invalid={bErrors.name ? "true" : "false"}
                    aria-describedby={bErrors.name ? "b-name-error" : undefined}
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (bErrors.name && e.target.value.trim()) {
                        setBErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder={t.funnel.namePlaceholder}
                    className="w-full min-h-[60px] sm:min-h-[64px] px-4 sm:px-5 py-3.5 text-[19px] sm:text-xl font-semibold bg-[#F8FAF9] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17]"
                  />
                  {bErrors.name && (
                    <p
                      id="b-name-error"
                      role="alert"
                      className="mt-2 text-base font-medium text-[#B8422C]"
                    >
                      {bErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="funnel-b-phone"
                    className="flex items-center gap-2 text-[18px] sm:text-xl font-semibold text-[#121C17] mb-2"
                  >
                    <PhoneKeypadIcon className="w-5 h-5 text-[#147A53] shrink-0" />
                    <span>
                      {lang === "no" ? "4. Telefonnummer" : "4. Your phone number"}{" "}
                      <span aria-hidden="true">*</span>
                    </span>
                  </label>
                  <input
                    ref={bPhoneRef}
                    id="funnel-b-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    enterKeyHint="done"
                    required
                    aria-invalid={bErrors.phone ? "true" : "false"}
                    aria-describedby={bErrors.phone ? "b-phone-error" : undefined}
                    value={phone}
                    onBlur={() => {
                      if (phone && !validatePhone(phone)) {
                        setBErrors((prev) => ({ ...prev, phone: t.funnel.phoneError }));
                      }
                    }}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (bErrors.phone && validatePhone(e.target.value)) {
                        setBErrors((prev) => ({ ...prev, phone: undefined }));
                      }
                    }}
                    placeholder={t.funnel.phonePlaceholder}
                    className="w-full min-h-[64px] sm:min-h-[68px] px-4 sm:px-5 py-3.5 text-[22px] sm:text-2xl font-semibold tabular-nums bg-[#F8FAF9] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17] tracking-wide"
                  />
                  {bErrors.phone && (
                    <p
                      id="b-phone-error"
                      role="alert"
                      className="mt-2 text-base font-medium text-[#B8422C]"
                    >
                      {bErrors.phone}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="p-4 rounded-xl bg-[#FEF2F0] border border-[#B8422C] text-[#B8422C] text-base font-medium"
                  >
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="nm-btn-primary w-full min-h-[68px] sm:min-h-[74px] px-6 sm:px-8 py-4 text-[19px] sm:text-2xl disabled:opacity-60"
                >
                  <span>
                    {isSubmitting
                      ? lang === "no"
                        ? "Sender inn..."
                        : "Submitting..."
                      : t.funnel.submitBtn}
                  </span>
                  <ArrowRightIcon className="w-6 h-6 shrink-0" />
                </button>
              </form>
            </section>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 pb-5 mb-6 border-b border-[#DCE5DF]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="min-h-[44px] inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl bg-[#F1F5F3] hover:bg-[#E6F2EC] active:scale-[0.985] text-[#0F3D2E] text-[15px] sm:text-[16px] font-semibold cursor-pointer shrink-0"
                  >
                    <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{t.funnel.backBtn}</span>
                  </button>
                ) : (
                  <span className="text-[15px] sm:text-[17px] font-semibold text-[#147A53] shrink-0">
                    {lang === "no" ? "Koble til megler" : "Agency Match"}
                  </span>
                )}

                <nav aria-label="Funnel progress">
                  <ol className="flex items-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <li
                        key={idx}
                        aria-current={step === idx ? "step" : undefined}
                        className={`h-2.5 sm:h-3 rounded-full transition-all ${
                          step === idx
                            ? "w-7 sm:w-10 bg-[#147A53]"
                            : step > idx
                            ? "w-4 sm:w-6 bg-[#0F3D2E]"
                            : "w-4 sm:w-6 bg-[#DCE5DF]"
                        }`}
                      >
                        <span className="sr-only">
                          {t.funnel.stepCounter} {idx}
                        </span>
                      </li>
                    ))}
                  </ol>
                </nav>

                <span className="text-[15px] sm:text-[16px] font-semibold text-[#121C17] tabular-nums whitespace-nowrap shrink-0">
                  {t.funnel.stepCounter} {step} {t.funnel.of} 5
                </span>
              </div>

              {chips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {chips.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full bg-[#E6F2EC] text-[#0F3D2E] text-[13px] font-semibold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {step === 1 && (
                <section aria-labelledby="step1-heading" className="space-y-5 sm:space-y-6">
                  <div>
                    <h2 id="step1-heading" className="nm-h2">
                      {t.funnel.step1Title}
                    </h2>
                    <p className="nm-body-lg mt-2">{t.funnel.step1Sub}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
                    {[
                      {
                        id: "house",
                        label: t.funnel.typeHouse,
                        icon: <HouseIcon className="w-7 h-7 sm:w-8 sm:h-8" />,
                      },
                      {
                        id: "apartment",
                        label: t.funnel.typeApt,
                        icon: <ApartmentIcon className="w-7 h-7 sm:w-8 sm:h-8" />,
                      },
                      {
                        id: "cabin",
                        label: t.funnel.typeCabin,
                        icon: <CabinMountainIcon className="w-7 h-7 sm:w-8 sm:h-8" />,
                      },
                    ].map((item) => {
                      const selected = propertyType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            selectAndAdvance(2, () => setPropertyType(item.id))
                          }
                          className={`nm-tap-card w-full min-h-[78px] sm:min-h-[84px] px-4 sm:px-6 py-4 sm:py-5 border-2 text-left flex items-center justify-between gap-3 sm:gap-4 ${
                            selected
                              ? "bg-[#E6F2EC] border-[#147A53]"
                              : "bg-[#F8FAF9] hover:bg-[#E6F2EC] border-[#DCE5DF] hover:border-[#147A53]"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#0F3D2E] text-[#FFFFFF] flex items-center justify-center shrink-0">
                              {item.icon}
                            </span>
                            <span className="text-[19px] sm:text-2xl font-semibold text-[#121C17]">
                              {item.label}
                            </span>
                          </div>
                          <ArrowRightIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#147A53] shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {step === 2 && (
                <section aria-labelledby="step2-heading" className="space-y-5 sm:space-y-6">
                  <div>
                    <h2 id="step2-heading" className="nm-h2">
                      {t.funnel.step2Title}
                    </h2>
                    {t.funnel.step2Sub && (
                      <p className="nm-body-lg mt-2">{t.funnel.step2Sub}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {[
                      { id: "under-40", label: t.funnel.size1 },
                      { id: "40-80", label: t.funnel.size2 },
                      { id: "80-120", label: t.funnel.size3 },
                      { id: "over-120", label: t.funnel.size4 },
                    ].map((preset) => {
                      const selected = surfaceArea === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() =>
                            selectAndAdvance(3, () => setSurfaceArea(preset.id))
                          }
                          className={`nm-tap-card min-h-[78px] sm:min-h-[88px] px-5 sm:px-6 py-5 sm:py-6 border-2 text-left flex items-center justify-between gap-4 ${
                            selected
                              ? "bg-[#E6F2EC] border-[#147A53]"
                              : "bg-[#F8FAF9] hover:bg-[#E6F2EC] border-[#DCE5DF] hover:border-[#147A53]"
                          }`}
                        >
                          <span className="text-[20px] sm:text-2xl font-semibold text-[#121C17] tabular-nums">
                            {preset.label}
                          </span>
                          <ArrowRightIcon className="w-6 h-6 text-[#147A53] shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {step === 3 && (
                <section aria-labelledby="step3-heading" className="space-y-5 sm:space-y-6">
                  <div>
                    <h2 id="step3-heading" className="nm-h2">
                      {t.funnel.step3Title}
                    </h2>
                    <p className="nm-body-lg mt-2">{t.funnel.step3Sub}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetectGps}
                    className="nm-tap-card w-full min-h-[68px] sm:min-h-[76px] px-4 sm:px-6 py-4 bg-[#E6F2EC] hover:bg-[#D5EBE0] border-2 border-[#147A53] text-[#0F3D2E] flex items-center justify-center gap-3 text-[18px] sm:text-xl font-semibold"
                  >
                    <LocationCrosshairIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#147A53] shrink-0" />
                    <span>{t.funnel.gpsBtn}</span>
                  </button>

                  {gpsStatus && (
                    <p
                      role="status"
                      className="text-base sm:text-lg font-medium text-[#121C17] bg-[#FEF6E2] px-4 py-3 rounded-xl border border-[#ECD8A4]"
                    >
                      {gpsStatus}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                    <div>
                      <label
                        htmlFor="funnel-city"
                        className="block text-[17px] sm:text-lg font-semibold text-[#121C17] mb-2"
                      >
                        {t.landing.variantA.cityLabel}
                      </label>
                      <select
                        id="funnel-city"
                        value={cityId}
                        onChange={(e) => {
                          const nextCity = e.target.value;
                          setCityId(nextCity);
                          const found = NORWAY_CITIES.find((c) => c.id === nextCity);
                          if (found && found.neighborhoods.length > 0) {
                            setAreaId(found.neighborhoods[0].id);
                          }
                        }}
                        className="w-full min-h-[60px] sm:min-h-[66px] px-4 py-3 text-[19px] sm:text-xl font-semibold bg-[#F8FAF9] border-2 border-[#9EB6AA] rounded-xl text-[#121C17] cursor-pointer"
                      >
                        {NORWAY_CITIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="funnel-area"
                        className="block text-[17px] sm:text-lg font-semibold text-[#121C17] mb-2"
                      >
                        {t.landing.variantA.areaLabel}
                      </label>
                      <select
                        id="funnel-area"
                        value={areaId}
                        onChange={(e) => {
                          setAreaId(e.target.value);
                          window.setTimeout(() => {
                            setStep(4);
                          }, 180);
                        }}
                        className="w-full min-h-[60px] sm:min-h-[66px] px-4 py-3 text-[19px] sm:text-xl font-semibold bg-[#F8FAF9] border-2 border-[#9EB6AA] rounded-xl text-[#121C17] cursor-pointer"
                      >
                        {currentCity.neighborhoods.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="nm-btn-primary w-full min-h-[66px] sm:min-h-[72px] text-[19px] sm:text-xl"
                  >
                    <span>{t.funnel.continueLocationBtn}</span>
                    <ArrowRightIcon className="w-6 h-6" />
                  </button>
                </section>
              )}

              {step === 4 && (
                <section aria-labelledby="step4-heading" className="space-y-5 sm:space-y-6">
                  <div>
                    <h2 id="step4-heading" className="nm-h2">
                      {t.funnel.step4Title}
                    </h2>
                    {t.funnel.step4Sub && (
                      <p className="nm-body-lg mt-2">{t.funnel.step4Sub}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
                    {[
                      { id: "now", label: t.funnel.situationNow },
                      { id: "1-3-months", label: t.funnel.situationSoon },
                      { id: "family-valuation", label: t.funnel.situationFamily },
                    ].map((item) => {
                      const selected = timeline === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            selectAndAdvance(5, () => setTimeline(item.id))
                          }
                          className={`nm-tap-card w-full min-h-[78px] sm:min-h-[84px] px-4 sm:px-6 py-4 sm:py-5 border-2 text-left flex items-center justify-between gap-4 ${
                            selected
                              ? "bg-[#E6F2EC] border-[#147A53]"
                              : "bg-[#F8FAF9] hover:bg-[#E6F2EC] border-[#DCE5DF] hover:border-[#147A53]"
                          }`}
                        >
                          <span className="text-[19px] sm:text-2xl font-semibold text-[#121C17]">
                            {item.label}
                          </span>
                          <ArrowRightIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#147A53] shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {step === 5 && (
                <section aria-labelledby="step5-heading" className="space-y-5 sm:space-y-6">
                  <div>
                    <h2 id="step5-heading" className="nm-h2">
                      {t.funnel.step5Title}
                    </h2>
                    <p className="nm-body-lg mt-2">{t.funnel.step5Sub}</p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    aria-labelledby="step5-heading"
                    className="space-y-5 sm:space-y-6 pt-2"
                  >
                    <div>
                      <label
                        htmlFor="seller-full-name"
                        className="block text-[18px] sm:text-xl font-semibold text-[#121C17] mb-2"
                      >
                        {t.funnel.nameLabel} <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="seller-full-name"
                        name="fullName"
                        type="text"
                        required
                        autoComplete="name"
                        enterKeyHint="next"
                        aria-invalid={nameError ? "true" : "false"}
                        aria-describedby={nameError ? "name-error-msg" : undefined}
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (nameError && e.target.value.trim()) setNameError("");
                        }}
                        placeholder={t.funnel.namePlaceholder}
                        className="w-full min-h-[62px] sm:min-h-[68px] px-4 sm:px-5 py-3.5 sm:py-4 text-[20px] sm:text-2xl font-semibold bg-[#F8FAF9] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17]"
                      />
                      {nameError && (
                        <p
                          id="name-error-msg"
                          role="alert"
                          className="mt-2 text-base sm:text-lg font-medium text-[#B8422C]"
                        >
                          {nameError}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="seller-phone-tel"
                        className="flex items-center gap-2 text-[18px] sm:text-xl font-semibold text-[#121C17] mb-2"
                      >
                        <PhoneKeypadIcon className="w-6 h-6 text-[#147A53] shrink-0" />
                        <span>
                          {t.funnel.phoneLabel} <span aria-hidden="true">*</span>
                        </span>
                      </label>
                      <input
                        id="seller-phone-tel"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        enterKeyHint="done"
                        required
                        aria-invalid={phoneError ? "true" : "false"}
                        aria-describedby={phoneError ? "phone-error-msg" : undefined}
                        value={phone}
                        onBlur={handlePhoneBlur}
                        onChange={(e) => handlePhoneInput(e.target.value)}
                        placeholder={t.funnel.phonePlaceholder}
                        className="w-full min-h-[66px] sm:min-h-[72px] px-4 sm:px-5 py-3.5 sm:py-4 text-[24px] sm:text-3xl font-semibold tabular-nums bg-[#F8FAF9] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17] tracking-wide"
                      />
                      {phoneTouched && phoneError && (
                        <p
                          id="phone-error-msg"
                          role="alert"
                          className="mt-2 text-base sm:text-lg font-medium text-[#B8422C]"
                        >
                          {phoneError}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <p
                        role="alert"
                        className="p-4 rounded-xl bg-[#FEF2F0] border border-[#B8422C] text-[#B8422C] text-base sm:text-lg font-medium"
                      >
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="nm-btn-primary w-full min-h-[72px] sm:min-h-[78px] px-6 sm:px-8 py-4 sm:py-5 text-[19px] sm:text-2xl disabled:opacity-60"
                    >
                      <span>
                        {isSubmitting
                          ? lang === "no"
                            ? "Sender inn..."
                            : "Submitting..."
                          : t.funnel.submitBtn}
                      </span>
                      <ArrowRightIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
                    </button>
                  </form>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export function ModernSellerFunnel(props: SellerFunnelProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12 text-xl font-medium text-[#147A53]">
          Loading...
        </div>
      }
    >
      <ModernSellerFunnelInner {...props} />
    </Suspense>
  );
}

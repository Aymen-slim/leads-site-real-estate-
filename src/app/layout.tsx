import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AdminPreviewBar } from "@/components/AdminPreviewBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Tracker } from "@/components/Tracker";
import { CookieBanner } from "@/components/CookieBanner";
import { isFunnelVariant, isLandingVariant } from "@/lib/ab";
import { Language } from "@/data/translations";
import { GA_MEASUREMENT_ID, GTM_IDS } from "@/lib/ga";

const albertSans = localFont({
  src: "../fonts/AlbertSans-latin.woff2",
  weight: "400 800",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = localFont({
  src: "../fonts/SourceSerif4-latin.woff2",
  weight: "500 700",
  style: "normal",
  variable: "--font-serif",
  display: "swap",
});

const bricolage = localFont({
  src: "../fonts/BricolageGrotesque-latin.woff2",
  weight: "500 700",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

const manrope = localFont({
  src: "../fonts/Manrope-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-modern-sans",
  display: "swap",
});

import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VurderBoligen — Gratis boligkalkulatorer og lokal verdivurdering i Norge",
    template: "%s",
  },
  description:
    "16 gratis norske kalkulatorer for boligselgere: pris per m², netto utbetalt, gevinstskatt, meglerkostnad, utkjøp av samboer, eiendomsskatt, solforhold og gratis lokal verdivurdering.",
  keywords: [
    "verdivurdering bolig",
    "boligkalkulator norge",
    "pris per m2",
    "selge bolig kalkulator",
    "meglerkostnad kalkulator",
    "gevinstskatt bolig",
    "eiendomsskatt kalkulator",
  ],
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "VurderBoligen",
    title: "VurderBoligen — Gratis boligkalkulatorer og lokal verdivurdering i Norge",
    description:
      "Gratis norske boligkalkulatorer og direkte kobling til lokale eiendomsmeglere for beste salgspris.",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const cks = await cookies();

  const rawLang = cks.get("kr_lang")?.value;
  // Default to Norwegian Bokmål so Google.no crawlers and first-time Norwegian visitors get native Norwegian SEO content.
  const initialLang: Language = rawLang === "en" ? "en" : "no";

  const hLanding = hdrs.get("x-kr-landing");
  const hFunnel = hdrs.get("x-kr-funnel");
  const initialLandingVariant = isLandingVariant(hLanding) ? hLanding : "A";
  const initialFunnelVariant = isFunnelVariant(hFunnel) ? hFunnel : "A";
  const isAdmin = hdrs.get("x-kr-admin") === "1";
  const isPreview = hdrs.get("x-kr-preview") === "1";
  const isModern = initialLandingVariant === "M";

  const gaBootstrap = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.__krGaConsentInit = true;
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  `;

  return (
    <html
      lang={initialLang}
      data-theme={isModern ? "modern" : "classic"}
      className={`${albertSans.variable} ${sourceSerif.variable} ${bricolage.variable} ${manrope.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: gaBootstrap }} />
        {GTM_IDS.map((gtmId) => (
          <script
            key={gtmId}
            async
            src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`}
          />
        ))}
      </head>
      <body
        className={`min-h-screen flex flex-col antialiased font-normal pb-[84px] md:pb-0 ${
          isModern ? "bg-[#F4F5F0] text-[#1D281C]" : "bg-[#FFFFFF] text-[#292823]"
        }`}
      >
        <AppProvider
          initialLang={initialLang}
          initialLandingVariant={initialLandingVariant}
          initialFunnelVariant={initialFunnelVariant}
          isAdmin={isAdmin}
          isPreview={isPreview}
        >
          <AdminPreviewBar />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <MobileBottomNav />
          <Tracker />
          <CookieBanner />
        </AppProvider>
      </body>
    </html>
  );
}

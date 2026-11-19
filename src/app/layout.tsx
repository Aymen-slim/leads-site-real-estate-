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

export const metadata: Metadata = {
  title: "VurderBoligen — Get the Best Price for Your Home | Norway",
  description:
    "Free Norwegian seller calculators, instant neighborhood m² prices, and direct local agency matching.",
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
  const initialLang: Language = rawLang === "no" ? "no" : "en";

  const hLanding = hdrs.get("x-kr-landing");
  const hFunnel = hdrs.get("x-kr-funnel");
  const initialLandingVariant = isLandingVariant(hLanding) ? hLanding : "A";
  const initialFunnelVariant = isFunnelVariant(hFunnel) ? hFunnel : "A";
  const isAdmin = hdrs.get("x-kr-admin") === "1";
  const isPreview = hdrs.get("x-kr-preview") === "1";
  const isModern = initialLandingVariant === "M";

  return (
    <html
      lang={initialLang}
      data-theme={isModern ? "modern" : "classic"}
      className={`${albertSans.variable} ${sourceSerif.variable} ${bricolage.variable} ${manrope.variable}`}
    >
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

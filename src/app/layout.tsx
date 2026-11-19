import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import {
  Albert_Sans,
  Bricolage_Grotesque,
  Manrope,
  Source_Serif_4,
} from "next/font/google";
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

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-modern-sans",
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

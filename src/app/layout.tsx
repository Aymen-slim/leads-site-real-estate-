import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Albert_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AdminPreviewBar } from "@/components/AdminPreviewBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Tracker } from "@/components/Tracker";
import { CookieBanner } from "@/components/CookieBanner";
import { isVariant } from "@/lib/ab";
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

export const metadata: Metadata = {
  title: "Krogsveen Stil — Get the Best Price for Your Home | Norway",
  description:
    "Home, Free Seller Tools, and Connect Agency to get the best price for your house or land in Norway.",
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
  const initialLandingVariant = isVariant(hLanding) ? hLanding : "A";
  const initialFunnelVariant = isVariant(hFunnel) ? hFunnel : "A";
  const isAdmin = hdrs.get("x-kr-admin") === "1";
  const isPreview = hdrs.get("x-kr-preview") === "1";

  return (
    <html
      lang={initialLang}
      className={`${albertSans.variable} ${sourceSerif.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#292823] antialiased font-normal pb-[84px] md:pb-0">
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

import type { Metadata } from "next";
import { Albert_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ABControlBar } from "@/components/ABControlBar";
import { Navbar } from "@/components/Navbar";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${albertSans.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#292823] antialiased font-normal">
        <AppProvider>
          <ABControlBar />
          <Navbar />
          <div className="flex-1">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}

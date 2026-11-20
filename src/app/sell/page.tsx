import type { Metadata } from "next";
import { headers } from "next/headers";
import { isFunnelVariant, NAV_SOURCE } from "@/lib/ab";
import { SITE_URL } from "@/lib/seo";
import { SellerFunnel } from "@/components/SellerFunnel";

export const metadata: Metadata = {
  title: "Selge bolig eller tomt i Norge — Gratis verdivurdering | VurderBoligen",
  description:
    "Start gratis og uforpliktende verdivurdering av din bolig eller tomt i Norge. Rask 4-trykks matching med lokale meglere.",
  alternates: { canonical: `${SITE_URL}/sell` },
};

export const dynamic = "force-dynamic";

export default async function SellPage() {
  const h = await headers();
  const hForm = h.get("x-kr-form");
  const hFunnel = h.get("x-kr-funnel");
  const initialFormVariant = isFunnelVariant(hForm)
    ? hForm
    : isFunnelVariant(hFunnel)
    ? hFunnel
    : "A";
  const initialRouted = h.get("x-kr-routed") === "1";
  const initialSource = h.get("x-kr-source") || NAV_SOURCE;

  return (
    <SellerFunnel
      initialFormVariant={initialFormVariant}
      initialRouted={initialRouted}
      initialSource={initialSource}
    />
  );
}

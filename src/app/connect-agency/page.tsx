import { headers } from "next/headers";
import { isVariant, NAV_SOURCE } from "@/lib/ab";
import { SellerFunnel } from "@/components/SellerFunnel";

export const dynamic = "force-dynamic";

export default async function ConnectAgencyPage() {
  const h = await headers();
  const hForm = h.get("x-kr-form");
  const hFunnel = h.get("x-kr-funnel");
  const initialFormVariant = isVariant(hForm) ? hForm : isVariant(hFunnel) ? hFunnel : "A";
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

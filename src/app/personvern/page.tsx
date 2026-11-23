import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import { PrivacyPolicyClient } from "@/components/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Personvernerklæring og GDPR | VurderBoligen",
  description:
    "Les hvordan VurderBoligen behandler personopplysninger, informasjonskapsler og verdivurderingsforespørsler i tråd med norsk personvernlovgivning og GDPR.",
  alternates: { canonical: `${SITE_URL}/personvern` },
};

export default function PersonvernPage() {
  return <PrivacyPolicyClient />;
}

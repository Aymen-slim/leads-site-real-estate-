import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPropertyTaxMetadata, buildToolJsonLd } from "@/lib/seo";
import { getMunicipalityTax, getToolBySlug } from "@/data/norwayToolsData";
import { PropertyTaxTool } from "@/components/tools/PropertyTaxTool";

interface PageProps {
  params: Promise<{ municipality: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { municipality } = await params;
  return buildPropertyTaxMetadata(municipality);
}

export default async function MunicipalityPropertyTaxPage({ params }: PageProps) {
  const { municipality } = await params;
  const rule = getMunicipalityTax(municipality);
  if (!rule) notFound();

  const tool = getToolBySlug("property-tax");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PropertyTaxTool initialMunicipalityId={rule.id} />
    </>
  );
}

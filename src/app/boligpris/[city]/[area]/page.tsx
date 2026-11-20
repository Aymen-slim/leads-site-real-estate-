import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NORWAY_CITIES } from "@/data/norwayData";
import { buildLocalPriceMetadata, buildToolJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { PricePerM2Tool } from "@/components/tools/PricePerM2Tool";

interface PageProps {
  params: Promise<{ city: string; area: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, area: areaSlug } = await params;
  const city = NORWAY_CITIES.find((c) => c.id === citySlug);
  const area = city?.neighborhoods.find((n) => n.id === areaSlug);
  if (!city || !area) return {};
  return buildLocalPriceMetadata(city, area);
}

export default async function LocalAreaPricePage({ params }: PageProps) {
  const { city: citySlug, area: areaSlug } = await params;
  const city = NORWAY_CITIES.find((c) => c.id === citySlug);
  const area = city?.neighborhoods.find((n) => n.id === areaSlug);
  if (!city || !area) notFound();

  const tool = getToolBySlug("price-per-m2");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PricePerM2Tool initialCityId={city.id} initialAreaId={area.id} />
    </>
  );
}

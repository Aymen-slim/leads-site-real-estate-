import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { NORWAY_CITIES } from "@/data/norwayData";
import { NORWAY_MUNICIPALITIES_TAX, TOOL_CATALOG } from "@/data/norwayToolsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const corePages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/verktoy`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/koble-til-megler`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/selg`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/personvern`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOL_CATALOG.map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const cityPages: MetadataRoute.Sitemap = NORWAY_CITIES.flatMap((city) => [
    {
      url: `${SITE_URL}/boligpris/${city.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    ...city.neighborhoods.map((area) => ({
      url: `${SITE_URL}/boligpris/${city.id}/${area.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]);

  const municipalityTaxPages: MetadataRoute.Sitemap = NORWAY_MUNICIPALITIES_TAX.map(
    (m) => ({
      url: `${SITE_URL}/verktoy/eiendomsskatt/${m.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [...corePages, ...toolPages, ...cityPages, ...municipalityTaxPages];
}

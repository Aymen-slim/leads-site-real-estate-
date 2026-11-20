import { NextRequest, NextResponse } from "next/server";

interface GeonorgeAddress {
  adressetekst?: string;
  poststed?: string;
  postnummer?: string;
  kommunenavn?: string;
  representasjonspunkt?: {
    lat?: number;
    lon?: number;
  };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (q.length < 3 || q.length > 80) {
    return NextResponse.json({ results: [] });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);

  try {
    const url = `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(
      q
    )}&treffPerSide=5&utkoordsys=4258`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }
    const json = (await res.json()) as { adresser?: GeonorgeAddress[] };
    const results = (json.adresser || [])
      .filter(
        (a) =>
          a.adressetekst &&
          typeof a.representasjonspunkt?.lat === "number" &&
          typeof a.representasjonspunkt?.lon === "number"
      )
      .map((a) => ({
        label: [a.adressetekst, a.postnummer, a.poststed]
          .filter(Boolean)
          .join(", "),
        municipality: a.kommunenavn || a.poststed || "",
        lat: a.representasjonspunkt!.lat!,
        lng: a.representasjonspunkt!.lon!,
      }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  } finally {
    clearTimeout(timer);
  }
}

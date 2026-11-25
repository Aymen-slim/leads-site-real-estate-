// Structured Norwegian real-estate datasets, tool catalog, FAQs & calculation engines.
// Sources referenced for benchmarks: SSB, Skatteetaten, Kartverket, Enova, Eiendom Norge,
// Forbrukerrådet, Lovdata, Finansportalen, Byggstart, Mittanbud & municipal 2026 budgets.

export type ToolCategory = "sale-tax" | "value-land" | "buy-move" | "cabin-energy";

export interface ToolFaqItem {
  qNo: string;
  aNo: string;
  qEn: string;
  aEn: string;
}

export interface ToolSourceRef {
  name: string;
  detailNo: string;
  detailEn: string;
  url: string;
}

export interface ToolCatalogEntry {
  slug: string;
  path: string;
  source: string;
  category: ToolCategory;
  iconKey:
    | "price-m2"
    | "net-cash"
    | "land"
    | "inheritance"
    | "as-is"
    | "tax-calc"
    | "partner-buyout"
    | "broker-fee"
    | "bridge-loan"
    | "rent-or-sell"
    | "property-tax"
    | "document-fee"
    | "cabin-cost"
    | "energy-rating"
    | "ground-lease"
    | "sun-conditions";
  featured?: boolean;
  isNew?: boolean;
  shortTitleNo: string;
  shortTitleEn: string;
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
  controlHintNo: string;
  controlHintEn: string;
  sampleMetricNo: string;
  sampleMetricEn: string;
  seoTitleNo: string;
  seoDescNo: string;
  seoKeywordsNo: string[];
  guideHeadingNo: string;
  guideBodyNo: string;
  guideHeadingEn: string;
  guideBodyEn: string;
  dataSourceNo: string;
  dataSourceEn: string;
  referenceYear?: string;
  methodologyNo?: string;
  methodologyEn?: string;
  disclaimerNo?: string;
  disclaimerEn?: string;
  sources?: ToolSourceRef[];
  faqs: ToolFaqItem[];
  relatedSlugs: string[];
}

export const TOOL_CATEGORIES: { id: "all" | ToolCategory; labelNo: string; labelEn: string }[] = [
  { id: "all", labelNo: "Alle verktøy (16)", labelEn: "All Tools (16)" },
  { id: "sale-tax", labelNo: "Salg, megler & skatt", labelEn: "Selling, Broker & Tax" },
  { id: "value-land", labelNo: "Verdi, tomt & arv", labelEn: "Value, Land & Family" },
  { id: "buy-move", labelNo: "Kjøp, lån & utleie", labelEn: "Buying, Bridge & Rent" },
  { id: "cabin-energy", labelNo: "Hytte, energi & sol", labelEn: "Cabin, Energy & Sun" },
];

export const TOOL_CATALOG: ToolCatalogEntry[] = [
  {
    slug: "price-per-m2",
    path: "/verktoy/pris-per-m2",
    source: "price-m2",
    category: "value-land",
    iconKey: "price-m2",
    featured: true,
    shortTitleNo: "Pris per m²",
    shortTitleEn: "Price per m²",
    titleNo: "Pris per m² i ditt nabolag",
    titleEn: "Instant Neighborhood “Price per m²” Lookup",
    descNo:
      "Sammenlign veiledende kvadratmeterpris (BRA-i) for bolig og tomtepris per m² i ditt nærområde",
    descEn:
      "Compare indicative selling price per m² (BRA-i) for homes and per m² plot area for regulated residential land across Norway.",
    controlHintNo: "Velg by og bydel fra to store menyer",
    controlHintEn: "Select City and Neighborhood from two large menus",
    sampleMetricNo: "108 200 kr / m²",
    sampleMetricEn: "108 200 kr / m²",
    seoTitleNo: "Pris per m² i ditt nabolag (2026) — Bolig- og tomtepriser i Norge | VurderBoligen",
    seoDescNo:
      "Sjekk oppdatert kvadratmeterpris (BRA-i) for bolig og regulert byggetomt i Oslo, Bærum, Bergen, Stavanger, Trondheim, Drammen, Kristiansand og Tromsø.",
    seoKeywordsNo: [
      "pris per m2",
      "kvadratmeterpris bolig",
      "boligpris kalkulator",
      "tomtepris per kvadratmeter",
      "hva er boligen min verdt",
    ],
    guideHeadingNo: "Slik leser du kvadratmeterpris (BRA-i) og tomtepris i ditt område",
    guideBodyNo:
      "Kvadratmeterprisen for bolig måles per m² internt bruksareal (BRA-i), mens tomteprisen måles per m² tomteareal. Bydelssnittet er et veiledende utgangspunkt basert på SSB og Eiendom Norge — enkeltboliger selges ofte 15–25 % over eller under snittet avhengig av boligtype, solforhold, utsikt, standard og tilstandsgrader (TG). Bruk tallene som orientering før du ber om en lokal E-takst.",
    guideHeadingEn: "How to interpret neighborhood price per m² (BRA-i vs. plot area)",
    guideBodyEn:
      "Residential price per m² is measured per m² of internal floor area (BRA-i), while land pricing is measured per m² of total plot area. District averages from SSB and Eiendom Norge are indicative baselines — individual properties routinely sell 15–25% higher or lower depending on property type, sun exposure, condition grades (TG), and street micro-location.",
    dataSourceNo: "Veiledende bydelssnitt basert på SSB (tabell 14310), Eiendom Norge (2025/2026) og tinglyste salg.",
    dataSourceEn: "Indicative district averages based on SSB (Table 14310), Eiendom Norge (2025/2026), and registered sales.",
    referenceYear: "2026",
    methodologyNo:
      "Viser veiledende gjennomsnittlig m²-pris (BRA-i) for boliger og indikativ m²-pris for regulert boligtomt per bydel, samt estimert omsetningstid og 12-måneders prisutvikling forankret i SSB og Eiendom Norge.",
    methodologyEn:
      "Displays indicative district averages per m² internal floor area (BRA-i) for homes and per m² plot area for regulated residential land, alongside typical days-to-sell and 12-month price trends anchored to SSB and Eiendom Norge.",
    disclaimerNo:
      "Bydelssnittene er veiledende og erstatter ikke en konkret verdivurdering. Boligtype (enebolig vs. leilighet), størrelse, beliggenhet i gaten, oppussingsbehov og solforhold kan gi betydelige avvik fra snittet.",
    disclaimerEn:
      "District averages are indicative only and do not replace an on-site valuation. Property type (detached vs. apartment), size, micro-location, technical condition, and sunlight can shift actual sale prices significantly.",
    sources: [
      {
        name: "SSB (Boligprisindeksen)",
        detailNo: "Offisiell kvadratmeterpris- og boligprisstatistikk (tabell 14310)",
        detailEn: "Official Norwegian housing price index and m² statistics (Table 14310)",
        url: "https://www.ssb.no/priser-og-prisindekser/boligpriser-og-boligprisindekser",
      },
      {
        name: "Eiendom Norge",
        detailNo: "Månedlig boligprisstatistikk, prisvekst og omsetningstid i norske byer",
        detailEn: "Monthly housing market statistics, YoY growth, and days-to-sell by city",
        url: "https://eiendomnorge.no/boligprisstatistikk/",
      },
      {
        name: "Kartverket",
        detailNo: "Tinglyste eiendomsoverdragelser og offentlig grunnbok",
        detailEn: "Registered property transactions and Norwegian land registry",
        url: "https://www.kartverket.no/eiendom",
      },
    ],
    faqs: [
      {
        qNo: "Hva er forskjellen på m²-pris for bolig (BRA-i) og tomtepris per m²?",
        aNo: "Boligpris per m² beregnes av boligens interne bruksareal (BRA-i) og inkluderer både tomt, byggekostnad og infrastruktur. Tomtepris per m² gjelder selve grunnarealet (tomtearealet) på en regulert boligtomt — ofte mellom 5 000 og 28 000 kr/m² avhengig av by og regulering.",
        qEn: "What is the difference between house price per m² (BRA-i) and land price per m²?",
        aEn: "House price per m² is measured per m² of indoor floor area (BRA-i) and reflects building plus land. Land price per m² refers to total plot area for regulated residential land — typically 5,000–28,000 kr/m² depending on city and zoning.",
      },
      {
        qNo: "Kan en bolig med god tomt selges høyere enn bydelssnittet?",
        aNo: "Ja. Solrike tomter, utsikt, oppgradert standard og godkjent utleiedel gir ofte 15–25 % høyere kvadratmeterpris enn gjennomsnittet i bydelen.",
        qEn: "Can my property sell above the district average?",
        aEn: "Yes. Sunny plots, views, upgraded finishes, or an approved rental unit frequently achieve 15–25% above the district average.",
      },
      {
        qNo: "Hvordan får jeg en eksakt E-takst på min adresse?",
        aNo: "En lokal eiendomsmegler befarer eiendommen og sammenligner med nylige salg i samme gate. Du kan bestille en gratis og uforpliktende vurdering direkte her.",
        qEn: "How do I get an official E-takst for my address?",
        aEn: "A local licensed agent inspects your property and benchmarks recent street-level sales. You can request a free, non-binding valuation directly from this page.",
      },
    ],
    relatedSlugs: ["net-cash", "broker-fee", "capital-gains-tax"],
  },
  {
    slug: "net-cash",
    path: "/verktoy/netto-utbetalt",
    source: "net-cash",
    category: "sale-tax",
    iconKey: "net-cash",
    shortTitleNo: "Netto utbetalt",
    shortTitleEn: "Net Cash in Pocket",
    titleNo: "Finn ut hva du sitter igjen med etter skatt og gebyrer",
    titleEn: "“Net Cash in Pocket” Calculator (After Taxes & Fees)",
    descNo:
      "Se estimert netto utbetaling på konto etter justerbar meglerkostnad, tilstandsrapport, eventuell gevinstskatt og innfrielse av lån.",
    descEn:
      "Estimate how much cash stays in your bank account after adjustable broker fees, inspection report, optional tax, and mortgage payoff.",
    controlHintNo: "Juster salgspris, lån, provisjon (0,8 %–2,5 %) og skattestatus",
    controlHintEn: "Adjust sale price, mortgage, commission (0.8%–2.5%) & tax status",
    sampleMetricNo: "3 881 950 kr",
    sampleMetricEn: "3 881 950 kr",
    seoTitleNo: "Netto utbetalt ved boligsalg (2026) — Kalkulator etter megler, lån og skatt | VurderBoligen",
    seoDescNo:
      "Regn ut estimert egenkapital på konto etter boligsalg i Norge, inkludert justerbar meglerprovisjon, tilstandsrapport, innfrielse av lån og eventuell gevinstskatt.",
    seoKeywordsNo: [
      "netto utbetalt boligsalg",
      "kalkulator selge bolig",
      "hvor mye sitter jeg igjen med ved boligsalg",
      "egenkapital etter salg",
    ],
    guideHeadingNo: "Hva trekkes fra før pengene kommer på konto?",
    guideBodyNo:
      "Når oppgjørsavdelingen gjennomfører boligoppgjøret i Norge, innfris først eventuelle pantelån i banken. Deretter trekkes avtalt meglerprovisjon (vanligvis 1,0 %–2,25 % eller fastpris), tilrettelegging, annonsering, oppgjør, tilstandsrapport og eventuelt valgfri boligselgerforsikring. Restbeløpet utbetales til din konto — som regel skattefritt dersom du oppfyller kravet til bo- og eiertid (12 av 24 mnd.).",
    guideHeadingEn: "What is deducted before sale proceeds reach your bank?",
    guideBodyEn:
      "During Norwegian property settlement (oppgjør), existing registered mortgages are paid off first, followed by negotiated broker commission (typically 1.0%–2.25% or fixed fee), onboarding, marketing, settlement, technical inspection report, and optional seller insurance. The remaining balance is paid out — normally tax-free if you meet the 12-of-24-month residency rule.",
    dataSourceNo: "Basert på Forbrukerrådet, norske meglerprislister (2025/2026), Propr, Kartverket og Skatteetaten (22 %).",
    dataSourceEn: "Based on Forbrukerrådet, Norwegian brokerage fee schedules (2025/2026), Propr, Kartverket, and Skatteetaten (22%).",
    referenceYear: "2026",
    methodologyNo:
      "Netto utbetalt = forventet salgspris − meglerkostnad (justerbar provisjon/pakke eller selge-selv-nivå) − tilstandsrapport og offentlige gebyrer − eventuell valgfri boligselgerforsikring − beregnet gevinstskatt (kun ved sekundærbolig/tomt) − innfrielse av restlån.",
    methodologyEn:
      "Net proceeds = expected sale price − brokerage/selling costs (adjustable commission and package) − inspection report & public clearance fees − optional seller liability insurance − estimated capital gains tax (non-exempt sales only) − mortgage payoff.",
    disclaimerNo:
      "Meglerprovisjon, markedspakke og eventuell boligselgerforsikring varierer fra meglerkontor til meglerkontor og mellom forsikringsselskaper. For nøyaktig gevinstskatt ved skattepliktig salg, bruk vår egen gevinstskatt-kalkulator.",
    disclaimerEn:
      "Commission rates, marketing packages, and optional seller insurance vary significantly between brokerage offices and insurers. For exact taxable gain calculations, use our dedicated capital gains tax calculator.",
    sources: [
      {
        name: "Forbrukerrådet",
        detailNo: "Råd om boligsalg, meglervalg og sammenligning av tilbud",
        detailEn: "Consumer guidance on selling property and comparing broker quotes",
        url: "https://www.forbrukerradet.no/forside/bolig/selge-bolig/",
      },
      {
        name: "Skatteetaten",
        detailNo: "Regler for skattefritt boligsalg og 22 % gevinstskatt",
        detailEn: "Tax-free residency rules and 22% capital gains tax rules",
        url: "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/salg/",
      },
      {
        name: "Kartverket",
        detailNo: "Tinglysingsgebyr (545 kr) og sletting av pant (0 kr)",
        detailEn: "Deed registration fees (545 kr) and mortgage release (0 kr)",
        url: "https://www.kartverket.no/eiendom/tinglysing/tinglysingsgebyr",
      },
      {
        name: "Propr / Meglerprislister",
        detailNo: "Markedsnivå for selge-selv-pakke og meglerhonorar (2025/2026)",
        detailEn: "2025/2026 Norwegian DIY platform and brokerage price benchmarks",
        url: "https://propr.no/priser",
      },
    ],
    faqs: [
      {
        qNo: "Betaler selger dokumentavgift ved salg i Norge?",
        aNo: "Nei. Dokumentavgiften på 2,5 % betales alltid av kjøper ved kjøp av selveierbolig eller tomt — ikke av selger.",
        qEn: "Does the seller pay the 2.5% stamp duty in Norway?",
        aEn: "No. The 2.5% document fee (dokumentavgift) is always paid by the buyer on freehold properties, never the seller.",
      },
      {
        qNo: "Hvor mye varierer meglerkostnader mellom ulike kontorer?",
        aNo: "Provisjonen ligger vanligvis mellom 1,0 % og 2,25 % (ofte med minsteprovisjon 40 000–55 000 kr), og markedspakker varierer fra ca. 12 000 til 30 000+ kr. Boligselgerforsikring er valgfri og varierer etter boligtype og forsikringsselskap.",
        qEn: "How much do broker fees vary between offices?",
        aEn: "Commission typically ranges from 1.0% to 2.25% (often with a 40,000–55,000 kr minimum), and marketing packages range from ~12,000 to 30,000+ kr. Seller insurance is optional and varies by insurer and property type.",
      },
      {
        qNo: "Når får jeg pengene på konto etter overtakelse?",
        aNo: "Når kjøper og selger har signert overtakelsesprotokollen og skjøtet er tinglyst hos Kartverket, utbetales nettobeløpet normalt innen 5–10 virkedager.",
        qEn: "When do I receive the money after handover?",
        aEn: "Once handover is signed and the deed is registered with Kartverket, net proceeds are typically paid out within 5–10 business days.",
      },
    ],
    relatedSlugs: ["broker-fee", "capital-gains-tax", "bridge-loan"],
  },
  {
    slug: "land-buildability",
    path: "/verktoy/tomtedeling",
    source: "land",
    category: "value-land",
    iconKey: "land",
    shortTitleNo: "Tomtedeling & BYA/BRA",
    shortTitleEn: "Land Buildability & BYA",
    titleNo: "Kalkulator for tomtedeling og utbyggingspotensial",
    titleEn: "Land Buildability & Division Estimator",
    descNo:
      "Finn ut om tomten din kan deles i flere parseller eller bygges ut etter norsk regulering (småhusplan / %-BYA, rekkehus eller lavblokk).",
    descEn:
      "Estimate plot subdivision potential and buildable floor area (BRA) under Norwegian small-house BYA, townhouse, low-rise, or mixed-use zoning.",
    controlHintNo: "Velg tomtestørrelse, reguleringstype (Småhus / Tett / Lavblokk) og kommune",
    controlHintEn: "Select plot size, zoning class (Small-house / Townhouse / Low-rise) & city",
    sampleMetricNo: "+15 % – +50 %",
    sampleMetricEn: "+15% – +50%",
    seoTitleNo: "Tomtedeling og utbyggingspotensial kalkulator (BYA / BRA) | VurderBoligen",
    seoDescNo:
      "Beregn veiledende antall tomteparseller, utbyggbar BRA og tomteverdi etter norske reguleringsregler (småhusplan, %-BYA, rekkehus og lavblokk).",
    seoKeywordsNo: [
      "tomtedeling kalkulator",
      "selge tomt til utbygger",
      "utbyggingspotensial tomt",
      "fradele tomt verdi",
      "bya bra kalkulator",
    ],
    guideHeadingNo: "Hva avgjør utbyggingspotensialet på en norsk boligtomt?",
    guideBodyNo:
      "En eldre enebolig på stor tomt (ofte over 1 000–1 200 m²) kan ha betydelig verdi ved fradeling eller salg til utbygger. I Norge styres utbyggingen av Plan- og bygningsloven og kommunens reguleringsplan — blant annet tillatt bebygd areal (%-BYA), bruksareal (BRA), etasjeantall og krav til uteoppholdsareal. Eksempelvis strammet Oslo inn sin reviderte småhusplan (S-4220) til maks 18 % BYA og krav om 60 % grøntareal, som påvirker hvor tett det kan bygges.",
    guideHeadingEn: "What determines development potential on a Norwegian residential plot?",
    guideBodyEn:
      "An older detached home on a large plot (typically over 1,000–1,200 m²) may hold significant subdivision or developer value. Under Norway's Planning and Building Act, local zoning plans govern permitted footprint (%-BYA), floor area (BRA), height, and outdoor space. For example, Oslo's revised Small-House Plan limits footprint to 18% BYA with 60% green space.",
    dataSourceNo: "Basert på Plan- og bygningsloven, DiBK (TEK17), kommunale småhusplaner (bl.a. Oslo 18 % BYA) og lokale tomtepriser.",
    dataSourceEn: "Based on Norway's Planning and Building Act, DiBK (TEK17), municipal small-house zoning (incl. Oslo 18% BYA), and local land benchmarks.",
    referenceYear: "2026",
    methodologyNo:
      "Beregner veiledende antall parseller ut fra typiske norske minstekrav (600–800 m² per eneboligtomt), estimert utbyggbar BRA (tomteareal × utnyttelsesfaktor) og indikativ råtomtverdi ut fra kommunens lokale m²-pris for boligtomt.",
    methodologyEn:
      "Estimates indicative parcel count from typical Norwegian minimum plot rules (600–800 m² per detached lot), buildable BRA (plot area × density factor), and indicative raw plot value using municipal land m² benchmarks.",
    disclaimerNo:
      "Veiledende estimat. Faktisk rett til fradeling og utnyttelsesgrad avhenger alltid av gjeldende reguleringsplan, kommuneplanens arealdel, avkjørsel, terreng/støy, naturmangfold og vann-/avløpskapasitet. Sjekk alltid med plan- og bygningsetaten i din kommune.",
    disclaimerEn:
      "Indicative estimate only. Actual subdivision and buildable density always depend on binding municipal zoning plans, road access, terrain, and water/sewer capacity. Always verify with your municipality's planning office.",
    sources: [
      {
        name: "Lovdata (Plan- og bygningsloven)",
        detailNo: "Lovverk for reguleringsplan, fradeling og utnyttelsesgrad",
        detailEn: "Statutory rules for zoning plans, subdivision, and building density",
        url: "https://lovdata.no/dokument/NL/lov/2008-06-27-71",
      },
      {
        name: "DiBK (TEK17 / Grad av utnytting)",
        detailNo: "Norske beregningsregler for %-BYA, BRA og etasjeantall",
        detailEn: "Official Norwegian calculation rules for %-BYA and BRA floor area",
        url: "https://www.dibk.no/regelverk/byggteknisk-forskrift-tek17",
      },
      {
        name: "Kartverket",
        detailNo: "Fradeling av grunneiendom, oppmåling og matrikkel",
        detailEn: "Land subdivision, surveying, and Norwegian cadastre rules",
        url: "https://www.kartverket.no/eiendom/dele-eller-endre-eiendom",
      },
    ],
    faqs: [
      {
        qNo: "Hvor stor må en tomt være for å kunne fradeles i Norge?",
        aNo: "Mange norske kommuner opererer med 600–800 m² per eneboligtomt (eller noe mindre for tomannsbolig/rekkehus), men lokale reguleringsplaner som Oslos småhusplan (18 % BYA og 60 % grøntareal) styrer eksakte krav.",
        qEn: "How large must a plot be to subdivide in Norway?",
        aEn: "Many municipalities require 600–800 m² per detached plot (less for duplexes/townhouses), subject to local zoning such as Oslo's small-house plan (18% BYA and 60% green space).",
      },
      {
        qNo: "Er salg av fradelt tomt skattepliktig?",
        aNo: "Ja, salg av ubebygd tomt utløser som hovedregel 22 % gevinstskatt (Skatteloven § 9-3). Sammenlign alltid netto etter skatt mot skattefritt salg av hele boligeiendommen.",
        qEn: "Is selling a subdivided land plot taxed?",
        aEn: "Yes, selling an unbuilt land parcel generally triggers 22% capital gains tax. Always compare net after-tax proceeds against selling the entire primary home tax-free.",
      },
    ],
    relatedSlugs: ["capital-gains-tax", "price-per-m2", "ground-lease"],
  },
  {
    slug: "inherited-property",
    path: "/verktoy/arvet-bolig",
    source: "inheritance",
    category: "value-land",
    iconKey: "inheritance",
    shortTitleNo: "Arv og familieoppgjør",
    shortTitleEn: "Inherited Property",
    titleNo: "Kalkulator for arvet bolig og familieoppgjør",
    titleEn: "Inherited / Family Property Share Calculator",
    descNo:
      "Beregn estimert utbetaling per arving eller søsken etter salgsomkostninger, takst og tinglysing (0 kr arveavgift).",
    descEn:
      "Estimate each sibling or heir's cash payout from an inherited home after realistic selling, appraisal, and registration fees (0% inheritance tax).",
    controlHintNo: "Velg boligverdi og antall arvinger",
    controlHintEn: "Select estimated value and number of heirs",
    sampleMetricNo: "~2 452 000 kr / arving",
    sampleMetricEn: "~2 452 000 kr / heir",
    seoTitleNo: "Arvet bolig kalkulator (2026) — Beregn arveoppgjør og utbetaling per arving | VurderBoligen",
    seoDescNo:
      "Regn ut estimert utbetaling per søsken ved salg av arvet bolig i Norge. Se regler for arveavgift (0 kr), privat skifte (0 kr rettsgebyr), inngangsverdi og gevinstskatt.",
    seoKeywordsNo: [
      "selge arvet bolig kalkulator",
      "arveoppgjør bolig kalkulator",
      "fordeling av arv bolig søsken",
      "skatt ved salg av arvet bolig",
    ],
    guideHeadingNo: "Skatte- og kostnadsregler når søsken selger arvet bolig i Norge",
    guideBodyNo:
      "Norge har 0 kr i arveavgift og 0 kr i tingrettsgebyr ved privat skifte. Tinglysing av hjemmelserklæring hos Kartverket koster 545 kr (2026). Etter Skatteloven § 9-7 gjelder kontinuitetsprinsippet, med det viktige unntaket at dersom avdøde selv kunne solgt boligen skattefritt (bodd der minst 12 av de siste 24 månedene), settes arvingenes inngangsverdi til markedsverdien på dødsfallstidspunktet — slik at et raskt arvesalg normalt blir skattefritt.",
    guideHeadingEn: "Tax and fee rules when heirs sell an inherited home in Norway",
    guideBodyEn:
      "Norway has 0% inheritance tax and 0 kr court fee for private probate (privat skifte); deed transfer via Kartverket costs 545 kr (2026). Under Tax Act § 9-7, if the deceased qualified for a tax-free sale (12 of last 24 months residency), heirs inherit a stepped-up tax basis equal to market value at death — making an immediate sale normally tax-free.",
    dataSourceNo: "I tråd med Arveloven, Skatteloven § 9-7, Kartverket (545 kr tinglysing) og norske meglerprislister (2025/2026).",
    dataSourceEn: "Aligned with Norwegian Inheritance Act, Tax Act § 9-7, Kartverket (545 kr filing), and 2025/2026 brokerage benchmarks.",
    referenceYear: "2026",
    methodologyNo:
      "Trekker estimerte megler-, takst- og oppgjørsomkostninger (~1,25 % provisjon + standard salgspakke og tinglysing 545 kr; varierer per kontor) fra antatt salgsverdi og fordeler nettobeløpet likt på antall arvinger.",
    methodologyEn:
      "Deducts estimated brokerage, appraisal, and transfer costs (~1.25% commission + standard sale package and 545 kr deed filing; varies by agency) from market value and divides net estate equally among heirs.",
    disclaimerNo:
      "Veiledende estimat ved lik fordeling og skattefritt arvesalg. Meglerkostnader varierer mellom kontorer, og eventuell gjeld i dødsboet, skjevdeling, testament eller advokatbistand ved offentlig skifte påvirker netto utbetaling.",
    disclaimerEn:
      "Indicative estimate assuming equal split and tax-free sale. Brokerage fees vary by office, and estate mortgages, wills, unequal shares, or legal probate counsel will affect final payouts.",
    sources: [
      {
        name: "Skatteetaten (Arvet bolig)",
        detailNo: "0 kr arveavgift, kontinuitet og oppregulering til markedsverdi (Skatteloven § 9-7)",
        detailEn: "0% inheritance tax, continuity vs. market-value step-up rules (Tax Act § 9-7)",
        url: "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/salg/salg-av-arvet-bolig/",
      },
      {
        name: "Kartverket (Arv og skifte)",
        detailNo: "Tinglysing av hjemmelserklæring ved arv (545 kr i 2026)",
        detailEn: "Deed transfer registration upon inheritance (545 kr in 2026)",
        url: "https://www.kartverket.no/eiendom/overfore-eiendom/arv-og-skifte",
      },
      {
        name: "Lovdata (Arveloven)",
        detailNo: "Regler om privat skifte (0 kr rettsgebyr) og fordeling mellom arvinger",
        detailEn: "Norwegian Inheritance Act rules on private probate and estate distribution",
        url: "https://lovdata.no/dokument/NL/lov/2019-06-14-21",
      },
    ],
    faqs: [
      {
        qNo: "Må vi betale arveavgift når vi selger foreldrehjemmet?",
        aNo: "Nei, arveavgiften ble fjernet i 2014, og privat skifte har 0 kr i gebyr til tingretten. Det eneste som kan utløse gevinstskatt er verdistigning etter dødsfallet — eller dersom avdøde ikke selv oppfylte bo- og eiertid (kontinuitet etter Skatteloven § 9-7).",
        qEn: "Do we pay inheritance tax when selling our parents' house?",
        aEn: "No, inheritance tax was abolished in 2014 and private probate carries 0 kr court fee. Capital gains tax only applies to appreciation after death, or if the deceased did not meet the tax-free residency rule.",
      },
      {
        qNo: "Hva hvis ett søsken ønsker å overta boligen alene?",
        aNo: "Da innhentes en nøytral verdivurdering (E-takst) som alle søsken godkjenner, og den som overtar løser ut de øvrige arvingene. Ved overføring av ideell arveandel slipper man dokumentavgift på egen arvedel, men betaler 2,5 % på den delen man kjøper ut fra medarvingene.",
        qEn: "What if one sibling wants to buy out the others?",
        aEn: "Obtain a neutral E-takst valuation agreed upon by all heirs. Your own inherited share is exempt from 2.5% stamp duty, while the shares purchased from co-heirs normally attract 2.5% stamp duty.",
      },
    ],
    relatedSlugs: ["sell-as-is", "capital-gains-tax", "partner-buyout"],
  },
  {
    slug: "sell-as-is",
    path: "/verktoy/selge-som-den-er",
    source: "as-is",
    category: "sale-tax",
    iconKey: "as-is",
    shortTitleNo: "Selge som den er",
    shortTitleEn: "Sell As-Is vs. Fix",
    titleNo: "Selge som den er eller pusse opp først?",
    titleEn: "“Sell As-Is vs. Fix It Up” Calculator",
    descNo:
      "Sammenlign realistiske håndverkerkostnader og byggetid mot forventet prisøkning og salg i nåværende tilstand.",
    descEn:
      "Compare realistic Norwegian contractor cost ranges and timelines against expected resale lift and selling in current condition.",
    controlHintNo: "Trykk på det som trenger arbeid (maling, kjøkken, bad, tak, vinduer)",
    controlHintEn: "Tap what needs work (paint, kitchen, bath, roof, windows)",
    sampleMetricNo: "0 kr utlegg",
    sampleMetricEn: "0 kr outlay",
    seoTitleNo: "Pusse opp før salg eller selge som den er? Kalkulator (2026) | VurderBoligen",
    seoDescNo:
      "Lønner det seg å pusse opp bad, kjøkken, maling eller tak før boligsalg i Norge? Regn ut håndverkerkostnad mot forventet prisøkning med 2025/2026-priser.",
    seoKeywordsNo: [
      "pusse opp før salg kalkulator",
      "lønner det seg å pusse opp før salg",
      "selge oppussingsobjekt",
      "selge bolig med tg3 bad",
    ],
    guideHeadingNo: "Når lønner oppussing seg før salg — og når taper du penger?",
    guideBodyNo:
      "Enkel kosmetisk oppfriskning som maling, sparkling og rydding gir ofte positiv netto effekt fordi boligen oppleves innflyttingsklar for et lite beløp. Større fagprosjekter som nytt bad (TG3), nytt kjøkken eller nytt tak koster derimot ofte mer hos håndverkere enn kjøpere er villige til å by ekstra i budrunden — både fordi kjøpere ønsker å velge stil selv, og fordi prosjekter medfører byggetid og risiko for uforutsette funn.",
    guideHeadingEn: "When pre-sale renovations pay off — and when they lose money",
    guideBodyEn:
      "Light cosmetic refreshes like painting and decluttering frequently pay back because buyers reward move-in-ready presentation. Major contractor projects such as full wet-room rebuilds (TG3), new kitchens, or roofs typically cost more than the extra bidding lift because buyers prefer choosing their own finishes.",
    dataSourceNo: "Basert på Byggstart, Mittanbud (2025/2026), Prognosesenteret og norsk meglererfaring.",
    dataSourceEn: "Based on Byggstart, Mittanbud (2025/2026), Prognosesenteret, and Norwegian broker resale benchmarks.",
    referenceYear: "2026",
    methodologyNo:
      "For hvert tiltak viser kalkulatoren typisk kostnadsintervall (lav–høy) og realistisk snittkostnad for en normal norsk bolig, estimert verdistigning i budrunden og forventet byggetid. Netto ved oppussing = nåverdi + forventet verdistigning − håndverkerutlegg.",
    methodologyEn:
      "For each project, the calculator shows a realistic Norwegian low–high cost range and midpoint for an average home, estimated bidding uplift, and contractor duration. Net after renovating = current value + expected uplift − contractor outlay.",
    disclaimerNo:
      "Veiledende estimat for en normal norsk bolig. Håndverkerpriser varierer betydelig med geografi, størrelse, materialvalg, egeninnsats og eventuelle skjulte feil (råte/fukt). Innhent alltid 2–3 skriftlige tilbud før du bestemmer deg.",
    disclaimerEn:
      "Indicative estimate for an average Norwegian home. Contractor pricing varies widely by region, home size, material grade, DIY effort, and hidden defects. Always collect 2–3 written quotes before starting work.",
    sources: [
      {
        name: "Byggstart",
        detailNo: "Norske gjennomsnittspriser for bad, kjøkken, tak, maling og vinduer (2025/2026)",
        detailEn: "Norwegian 2025/2026 average contractor prices for baths, kitchens, roofs & painting",
        url: "https://www.byggstart.no/pris",
      },
      {
        name: "Mittanbud",
        detailNo: "Prisguider basert på gjennomførte håndverkeroppdrag i Norge",
        detailEn: "Price guides based on completed craftsperson jobs in Norway",
        url: "https://mittanbud.no/prisguide",
      },
      {
        name: "Prognosesenteret",
        detailNo: "Analyse av norsk oppussingsmarked og verdieffekt ved boligsalg",
        detailEn: "Norwegian renovation market analysis and resale impact benchmarks",
        url: "https://prognosesenteret.no/",
      },
      {
        name: "Lovdata (Avhendingslova)",
        detailNo: "Regler om tilstandsrapport og trygt salg uten forutgående oppussing",
        detailEn: "Rules on technical reports and selling older homes transparently",
        url: "https://lovdata.no/dokument/NL/lov/1992-07-03-93",
      },
    ],
    faqs: [
      {
        qNo: "Bør jeg pusse opp et bad med TG3 før jeg selger?",
        aNo: "Som regel nei. En totalrenovering av et standard bad (5–7 m²) etter TEK17 koster typisk 220 000–340 000 kr (Byggstart/Mittanbud), mens prisøkningen i budrunden ofte bare er 160 000–240 000 kr — samtidig som du tar 5–6 uker byggetid og risiko for tilleggskostnader.",
        qEn: "Should I renovate a TG3 bathroom before selling?",
        aEn: "Usually no. A full TEK17 rebuild of a standard 5–7 m² bathroom typically costs 220,000–340,000 kr (Byggstart/Mittanbud), while buyers commonly add only 160,000–240,000 kr in bidding — plus 5–6 weeks of work and overrun risk.",
      },
      {
        qNo: "Kan man fortsatt selge «som den er» etter ny avhendingslov?",
        aNo: "Generelle «som den er»-forbehold gjelder ikke lenger mot forbrukere, men du kan helt lovlig selge en eldre bolig i nåværende tilstand uten å pusse opp så lenge alle avvik dokumenteres tydelig i en godkjent tilstandsrapport.",
        qEn: "Can you still sell 'as-is' under Norway's Avhendingsloven?",
        aEn: "Blanket 'as-is' disclaimers no longer protect against undisclosed defects, but you can smoothly sell an older home without renovating as long as all issues are documented in an approved technical report (tilstandsrapport).",
      },
    ],
    relatedSlugs: ["broker-fee", "energy-rating", "net-cash"],
  },

  // ======================== TIER 1 NEW TOOLS (5) ========================
  {
    slug: "capital-gains-tax",
    path: "/verktoy/gevinstskatt",
    source: "tax-calc",
    category: "sale-tax",
    iconKey: "tax-calc",
    isNew: true,
    shortTitleNo: "Bo- og eiertid / Skatt",
    shortTitleEn: "Capital Gains Tax",
    titleNo: "Skattefritt salg eller 22 % gevinstskatt på bolig og hytte?",
    titleEn: "Tax-Free Sale & Capital Gains Tax Calculator",
    descNo:
      "Sjekk om boligen eller hytta kan selges 100 % skattefritt og beregn eksakt 22 % gevinstskatt eller tapsfradrag.",
    descEn:
      "Check Norway's 12-of-24-month home rule or 5-of-8-year cabin rule and compute exact 22% capital gains tax or loss deduction.",
    controlHintNo: "Velg boligtype, botid og dra pris-skyveknappene",
    controlHintEn: "Tap property type, residency rule & adjust price sliders",
    sampleMetricNo: "0 kr skatt",
    sampleMetricEn: "0 kr tax",
    seoTitleNo: "Gevinstskatt bolig kalkulator (2026) — Sjekk bo- og eiertid skattefritt salg | VurderBoligen",
    seoDescNo:
      "Gratis norsk kalkulator for gevinstskatt ved salg av bolig, sekundærbolig, hytte og tomt. Sjekk krav til bo- og eiertid (12 av 24 mnd / 5 av 8 år) og beregn 22 % skatt.",
    seoKeywordsNo: [
      "skatt ved salg av bolig kalkulator",
      "bo- og eiertid kalkulator",
      "gevinstskatt bolig kalkulator",
      "selge sekundærbolig skatt",
      "skatt ved salg av hytte",
    ],
    guideHeadingNo: "Reglene for skattefritt salg av bolig og hytte i Norge",
    guideBodyNo:
      "For å selge en primærbolig helt skattefritt må du ha eid den i over 12 måneder OG brukt den som egen bolig i minst 12 av de siste 24 månedene før avtale om salg (aksept av bud). For hytte/fritidsbolig er kravet eie og bruk i minst 5 av de siste 8 årene. Sekundærbolig og ubebygd tomt beskattes med 22 % på netto gevinst etter fradrag for kjøpsomkostninger, salgsomkostninger og dokumenterte påkostninger.",
    guideHeadingEn: "Rules for tax-free home and cabin sales in Norway",
    guideBodyEn:
      "Primary residences sell 100% tax-free if you owned the home for >12 months AND lived in it for at least 12 of the last 24 months prior to accepting a bid. Cabins require ownership and personal use in 5 of the last 8 years. Secondary homes and plots incur 22% tax on net gain after purchase costs, sale fees, and documented upgrades (påkostninger).",
    dataSourceNo: "Basert på Skatteloven §§ 9-3 og 9-4 og Skatteetatens gjeldende 22 %-sats (2026).",
    dataSourceEn: "Based on Norwegian Tax Act §§ 9-3 & 9-4 and Skatteetaten's 22% rate (2026).",
    referenceYear: "2026",
    methodologyNo:
      "Vurderer skattefritak etter bo-/bruks- og eiertid (12 av 24 mnd. for bolig, 5 av 8 år for fritidsbolig). Ved skattepliktig salg beregnes 22 % skatt på (salgssum − kjøpesum − kjøps-/salgsomkostninger − dokumenterte påkostninger), eller tilsvarende 22 % fradrag ved nettotap (§ 9-4).",
    methodologyEn:
      "Checks statutory residency/use exemptions (12 of 24 months for homes, 5 of 8 years for cabins). On taxable sales, applies 22% tax to (sale price − purchase price − purchase/sale fees − documented capital upgrades), or a 22% deduction on a net loss (§ 9-4).",
    disclaimerNo:
      "Veiledende skatteberegning. Spesialregler for brukshindring (f.eks. arbeid, utdanning, helse), utleiedel over 50 %, arv (Skatteloven § 9-7) og grensen mellom fradragsberettiget påkostning og vedlikehold bør avklares med Skatteetaten.",
    disclaimerEn:
      "Indicative tax calculation. Special rules for residency exemptions (work/study/health), partial rentals over 50%, inherited basis, and distinguishing capital upgrades from maintenance should be verified with Skatteetaten.",
    sources: [
      {
        name: "Skatteetaten",
        detailNo: "Skatt ved salg av bolig, sekundærbolig, fritidsbolig og tomt (22 %, 2026)",
        detailEn: "Official tax rules for selling homes, cabins, and land in Norway (22%, 2026)",
        url: "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/salg/",
      },
      {
        name: "Lovdata (Skatteloven §§ 9-3 & 9-4)",
        detailNo: "Lovbestemte vilkår for skattefritt salg og fradrag for tap",
        detailEn: "Statutory rules on tax-free property sales and capital loss deductions",
        url: "https://lovdata.no/dokument/NL/lov/1999-03-26-14/KAPITTEL_10-1#%C2%A79-3",
      },
    ],
    faqs: [
      {
        qNo: "Hvilke kostnader kan trekkes fra i gevinstberegningen?",
        aNo: "Du kan trekke fra opprinnelig kjøpesum, dokumentavgift og tinglysing fra kjøpet, dokumenterte påkostninger (standardheving, tilbygg), samt alle megler- og salgsomkostninger. Merk at ordinært vedlikehold på egen bolig (f.eks. maling eller utskifting til tilsvarende standard) ikke gir fradrag i inngangsverdien.",
        qEn: "Which expenses are deductible from capital gains?",
        aEn: "You can deduct original purchase price, original stamp duty and deed fees, documented capital improvements (påkostninger), and all brokerage and selling expenses. Note that ordinary maintenance (vedlikehold) on your own home is not deductible.",
      },
      {
        qNo: "Når stopper tellingen av botid ved salg?",
        aNo: "Fristen regnes bakover fra datoen budet aksepteres (realisasjonstidspunktet) — ikke fra overtakelsesdatoen. Vær nøye hvis du har leid ut boligen i nesten 12 måneder.",
        qEn: "When does the 12-of-24-month clock stop?",
        aEn: "It is measured backward from the date the bid is accepted (realization), not the handover date. Be careful if you have rented out the home for nearly 12 months.",
      },
      {
        qNo: "Får jeg skattefradrag dersom jeg selger med tap?",
        aNo: "Ja. Dersom salget er skattepliktig (f.eks. sekundærbolig eller under 12 mnd. botid) og du selger med tap, gir tapet 22 % skattefradrag i alminnelig inntekt.",
        qEn: "Can I deduct a capital loss if I sell below purchase price?",
        aEn: "Yes. If the sale would have been taxable, a net loss gives a corresponding 22% tax deduction against ordinary income.",
      },
    ],
    relatedSlugs: ["rent-or-sell", "net-cash", "cabin-cost"],
  },
  {
    slug: "partner-buyout",
    path: "/verktoy/kjope-ut-samboer",
    source: "partner-buyout",
    category: "value-land",
    iconKey: "partner-buyout",
    isNew: true,
    shortTitleNo: "Kjøpe ut samboer",
    shortTitleEn: "Partner Buyout",
    titleNo: "Samlivsbruddkalkulator",
    titleEn: "Partner Buyout & Separation Split Calculator",
    descNo:
      "Finn ut hva det koster å kjøpe ut partneren. Regn ut utkjøpssum, lånebehov, eventuell dokumentavgift og inntektskrav.",
    descEn:
      "Calculate exact buyout payout, required mortgage, stamp duty exemption, and Norway's 5× income rule when one partner keeps the home.",
    controlHintNo: "Velg eierbrøk og juster boligverdi, lån og egenkapital",
    controlHintEn: "Tap ownership split & slide home value, loan, and equity",
    sampleMetricNo: "1 600 000 kr utkjøp",
    sampleMetricEn: "1 600 000 kr buyout",
    seoTitleNo: "Kjøpe ut samboer kalkulator (2026) — Beregn utkjøpssum og boliglån | VurderBoligen",
    seoDescNo:
      "Skal du kjøpe ut samboer eller ektefelle fra felles bolig? Beregn riktig utkjøpssum, nytt lån, dokumentavgift og inntektskrav (5× inntekt) på sekunder.",
    seoKeywordsNo: [
      "kjøpe ut samboer kalkulator",
      "utkjøp bolig kalkulator",
      "skilsmisse fordeling bolig kalkulator",
      "beregne utkjøp av bolig",
      "dokumentavgift ved utkjøp samboer",
    ],
    guideHeadingNo: "Slik regner du ut rettferdig utkjøp av felles bolig",
    guideBodyNo:
      "Ved samlivsbrudd starter alltid oppgjøret med en nøytral verdivurdering (E-takst) som begge parter er enige om. Nettomassen (markedsverdi minus felles gjeld og eventuell dokumentert særskilt egenkapital) deles etter eierbrøken. Merk at etter Dokumentavgiftsloven § 8 slipper ektefeller samt samboere med minst 2 års felles folkeregistrert adresse (eller felles barn) 2,5 % dokumentavgift ved overføring av felles bolig — ellers påløper 2,5 % kun på den overførte selveierandelen (borettslag er alltid 0 kr).",
    guideHeadingEn: "How to calculate a fair home buyout in Norway",
    guideBodyEn:
      "A fair separation buyout begins with a neutral E-takst market valuation agreed by both parties. Net equity (market value minus shared mortgage and documented separate down-payment) is divided by ownership share. Under Stamp Duty Act § 8, married spouses and cohabitants with 2+ years registered together or shared children are exempt from the 2.5% document fee on a shared home (borettslag is always 0 kr).",
    dataSourceNo: "I tråd med Utlånsforskriften (2025/2026: maks 5× inntekt, 10 % egenkapital / 90 % belåningsgrad), Dokumentavgiftsloven § 8 og Kartverket (545 kr/dok).",
    dataSourceEn: "Aligned with Norwegian Lending Regulations (2025/2026: 5× income, 10% equity / 90% LTV), Stamp Duty Act § 8, and Kartverket (545 kr/doc).",
    referenceYear: "2026",
    methodologyNo:
      "Netto egenkapital = boligverdi − felles gjeld − eventuell særskilt egenkapital, fordelt etter eierbrøk. Nytt lånebehov = felles gjeld + utkjøpssum + eventuell dokumentavgift (2,5 % av overført andel ved manglende fritak) + tinglysing (545 kr × 2 = 1 090 kr). Inntektskrav anslås etter Utlånsforskriftens hovedregel om maks 5× samlet gjeld.",
    methodologyEn:
      "Net equity = home value − shared debt − separate equity, split by ownership ratio. New loan needed = shared debt + buyout payout + stamp duty (2.5% on transferred share if non-exempt) + registration (545 kr × 2 = 1,090 kr). Income requirement follows Norway's 5× gross income debt cap.",
    disclaimerNo:
      "Veiledende beregning. Endelig finansiering avhenger av bankens kredittvurdering, annen gjeld (studielån, billån, kredittkort), forsørgeransvar og skriftlig skifte-/samboeravtale mellom partene.",
    disclaimerEn:
      "Indicative calculation. Final mortgage approval depends on your bank's full affordability check (including student/car loans and dependents) and a signed separation/settlement agreement.",
    sources: [
      {
        name: "Lovdata (Utlånsforskriften)",
        detailNo: "Krav om maks 5× brutto årsinntekt, 10 % egenkapital og rentestresstest",
        detailEn: "5× gross income cap, 10% minimum equity rule, and interest stress test",
        url: "https://lovdata.no/dokument/SF/forskrift/2020-12-09-2648",
      },
      {
        name: "Kartverket (Samlivsbrudd)",
        detailNo: "Fritak for 2,5 % dokumentavgift ved ekteskap / 2+ år samboerskap og 545 kr tinglysing",
        detailEn: "Stamp duty exemption rules for spouses/cohabitants and 545 kr deed filing",
        url: "https://www.kartverket.no/eiendom/overfore-eiendom/samlivsbrudd",
      },
      {
        name: "Finansportalen",
        detailNo: "Uavhengig oversikt over norske boliglånsrenter ved refinansiering",
        detailEn: "Independent overview of Norwegian mortgage refinancing rates",
        url: "https://www.finansportalen.no/",
      },
    ],
    faqs: [
      {
        qNo: "Må man betale dokumentavgift når man kjøper ut samboer?",
        aNo: "Ektefeller ved skilsmisse slipper dokumentavgift. Samboere slipper også dersom dere har hatt felles folkeregistrert adresse i minst 2 år eller har/venter felles barn (Dokumentavgiftsloven § 8). Ellers påløper 2,5 % på den overførte andelen (for selveier; borettslag har alltid 0 kr).",
        qEn: "Do I pay 2.5% stamp duty when buying out my partner?",
        aEn: "Married spouses are exempt. Cohabitants are also exempt if they shared a registered address for at least 2 years or have/expect children together. Otherwise 2.5% applies to the transferred freehold share (co-ops are always 0 kr).",
      },
      {
        qNo: "Trekkes meglerkostnader fra ved utkjøp?",
        aNo: "Det finnes ingen lovregel om dette for samboere, men mange velger å ikke trekke fiktive meglerkostnader fordi boligen ikke faktisk selges i markedet. Dere må bli enige skriftlig.",
        qEn: "Are theoretical broker fees deducted in a buyout?",
        aEn: "There is no automatic deduction in Norwegian law when no market sale occurs, though parties may negotiate mutually.",
      },
      {
        qNo: "Hva hvis ingen av oss har inntekt nok til å sitte alene med lånet?",
        aNo: "Da er felles salg i det åpne markedet den ryddigste løsningen. Dere får begge frigjort full egenkapital til å kjøpe hvert deres nye hjem.",
        qEn: "What if neither partner qualifies for the full loan alone?",
        aEn: "Selling together on the open market releases full equity for both parties cleanly and fairly.",
      },
    ],
    relatedSlugs: ["net-cash", "inherited-property", "broker-fee"],
  },
  {
    slug: "broker-fee",
    path: "/verktoy/meglerkostnad",
    source: "broker-fee",
    category: "sale-tax",
    iconKey: "broker-fee",
    isNew: true,
    shortTitleNo: "Meglerkostnad & Pris",
    shortTitleEn: "Broker Cost vs. DIY",
    titleNo: "Selge selv eller velge en megler?",
    titleEn: "Broker Commission & DIY vs. Agency Calculator",
    descNo:
      "Beregn totalpris på eiendomsmegler med justerbar provisjon, markedspakke og valgfri forsikring — og sammenlign tydelig mot å selge selv.",
    descEn:
      "Estimate Norwegian brokerage costs with adjustable commission, marketing tier, and optional seller insurance — compared transparently against selling DIY.",
    controlHintNo: "Velg boligtype, salgspris, provisjon (0,8 % – 2,5 %), markedspakke & valgfri forsikring",
    controlHintEn: "Pick property type, sale price, commission (0.8%–2.5%), marketing & optional insurance",
    sampleMetricNo: "111 800 kr totalt",
    sampleMetricEn: "111 800 kr total",
    seoTitleNo: "Hva koster eiendomsmegler? Meglerprovisjon & selge selv kalkulator (2026) | VurderBoligen",
    seoDescNo:
      "Regn ut realistisk meglerkostnad, provisjon, valgfri boligselgerforsikring og tilstandsrapport i Norge. Sammenlign tydelig hva det koster å selge selv (Propr) vs. med megler.",
    seoKeywordsNo: [
      "hva koster eiendomsmegler kalkulator",
      "meglerprovisjon kalkulator",
      "selge bolig selv vs megler",
      "boligselgerforsikring pris kalkulator",
      "kostnader ved salg av bolig",
    ],
    guideHeadingNo: "Hva inngår i meglerregningen — og hva varierer fra kontor til kontor?",
    guideBodyNo:
      "Salgskostnader faller i tre tydelige deler: (1) Faste kostnader du normalt har uansett om du selger selv eller med megler (tilstandsrapport fra takstmann ca. 10 000–18 000 kr, kommunale opplysninger og oppgjør), (2) Meglerspesifikke kostnader — provisjon (typisk 1,0 %–2,25 % eller fastpris), tilrettelegging og markedspakke — som varierer betydelig fra meglerkontor til meglerkontor, og (3) Valgfri boligselgerforsikring, der prisen (oppgitt i promille med minste-/makspris) varierer både etter boligtype og hvilket forsikringsselskap megleren samarbeider med.",
    guideHeadingEn: "What makes up a Norwegian broker invoice — and what varies by office?",
    guideBodyEn:
      "Selling costs fall into three clear buckets: (1) Shared baseline costs whether you sell DIY or with an agent (technical inspection report ~10,000–18,000 kr, municipal info, settlement), (2) Broker-specific fees — commission (typically 1.0%–2.25% or fixed fee), onboarding, and marketing package — which vary considerably from office to office, and (3) Optional seller liability insurance (boligselgerforsikring), whose promille rate and min/max cap vary by insurer and property type.",
    dataSourceNo: "Basert på Forbrukerrådet, norske meglerprislister (2025/2026), Propr samt Fremtind/Gjensidige/Anticimex.",
    dataSourceEn: "Based on Forbrukerrådet, 2025/2026 Norwegian brokerage fee schedules, Propr, and Fremtind/Gjensidige/Anticimex rates.",
    referenceYear: "2026",
    methodologyNo:
      "Sammenligner direkte kostnader ved eiendomsmegler mot digital selge-selv-løsning (Propr-nivå) ved å skille felles grunnkostnader fra meglers tilleggshonorar, og beregner eksakt break-even: hvor mange prosent høyere salgspris megleren må hente i budrunden for at mellomlegget skal være tjent inn.",
    methodologyEn:
      "Compares full-service agency costs against a Norwegian DIY platform (Propr benchmark) by separating shared mandatory costs from broker-only fees, then computes exact break-even: the percentage price lift needed for a broker to pay for the fee difference.",
    disclaimerNo:
      "Provisjonssats, minimumsprovisjon, markedsføringspakker og prisen på valgfri boligselgerforsikring varierer fra meglerkontor til meglerkontor og mellom forsikringsselskaper. Tallene er veiledende markedsintervaller — innhent alltid 2–3 skriftlige tilbud og sjekk hva som inngår.",
    disclaimerEn:
      "Commission rates, minimum fees, marketing tiers, and optional seller insurance vary significantly from office to office and across insurers. Figures are indicative benchmarks — always compare 2–3 written offers.",
    sources: [
      {
        name: "Forbrukerrådet",
        detailNo: "Veiledning om valg av megler, provisjon og eierskifteforsikring",
        detailEn: "Consumer guide on choosing a broker, commission, and seller insurance",
        url: "https://www.forbrukerradet.no/forside/bolig/selge-bolig/",
      },
      {
        name: "Norges Eiendomsmeglerforbund (NEF)",
        detailNo: "Bransjestandarder og lovkrav ved eiendomsmegling i Norge",
        detailEn: "Norwegian brokerage industry standards and statutory rules",
        url: "https://www.nef.no/",
      },
      {
        name: "Propr (Selge bolig selv)",
        detailNo: "Gjeldende priser for digital selge-selv-pakke, FINN og oppgjør (2025/2026)",
        detailEn: "Current Norwegian DIY platform pricing for listing, photo, and settlement",
        url: "https://propr.no/priser",
      },
      {
        name: "Forbrukerrådet (Boligselgerforsikring)",
        detailNo: "Oversikt over valgfri boligselgerforsikring (Fremtind, Gjensidige, Anticimex)",
        detailEn: "Overview of optional seller insurance terms across Norwegian insurers",
        url: "https://www.forbrukerradet.no/forside/bolig/selge-bolig/eierskifteforsikring/",
      },
    ],
    faqs: [
      {
        qNo: "Hva er vanlig meglerprovisjon i Norge?",
        aNo: "De fleste meglerkontorer ligger mellom 1,0 % og 2,25 % i provisjon (ofte med minsteprovisjon 40 000–55 000 kr) eller fastpris. Både provisjon og markedsføringspakke varierer fra kontor til kontor, så sammenlign alltid tilbud fra 2–3 lokale meglere.",
        qEn: "What is typical real estate broker commission in Norway?",
        aEn: "Most brokerage offices charge 1.0%–2.25% (often with a 40,000–55,000 kr minimum) or a fixed fee. Both commission and marketing rates vary from office to office, so always compare 2–3 local quotes.",
      },
      {
        qNo: "Hva koster valgfri boligselgerforsikring?",
        aNo: "Boligselgerforsikring er helt frivillig og prisen varierer både med boligtype og forsikringsselskap (f.eks. Fremtind, Gjensidige, Anticimex): typisk 2,0–3,2 promille for borettslagsleilighet, 3,5–5,1 promille for selveierleilighet og 4,5–6,4 promille for enebolig/rekkehus — ofte med egen minste- og makspris.",
        qEn: "How much does optional seller insurance (boligselgerforsikring) cost?",
        aEn: "Seller insurance is optional and varies by insurer (e.g., Fremtind, Gjensidige, Anticimex) and property type: typically 2.0–3.2‰ for co-ops, 3.5–5.1‰ for freehold apartments, and 4.5–6.4‰ for detached/terraced homes, subject to min/max caps.",
      },
      {
        qNo: "Lønner det seg å selge bolig selv eller bruke megler?",
        aNo: "Selger du selv (f.eks. via Propr til ca. 25 000–36 000 kr + tilstandsrapport) sparer du typisk 50 000–70 000 kr i direkte honorar sammenlignet med megler på en 5 mill. kr bolig. Det tilsvarer ca. +1,2 % i salgspris: oppnår en lokal megler mer enn ca. 1,2 % høyere budrunde (over 60 000 kr), har megleren betalt seg selv.",
        qEn: "Is it better to sell DIY or hire a broker?",
        aEn: "Selling DIY (e.g., via Propr at ~25,000–36,000 kr + inspection report) typically saves 50,000–70,000 kr in direct fees on a 5M kr home — roughly a +1.2% break-even. If a local broker achieves more than ~1.2% higher bidding, the agency pays for itself.",
      },
    ],
    relatedSlugs: ["net-cash", "sell-as-is", "price-per-m2"],
  },
  {
    slug: "bridge-loan",
    path: "/verktoy/mellomfinansiering",
    source: "bridge-loan",
    category: "buy-move",
    iconKey: "bridge-loan",
    isNew: true,
    shortTitleNo: "Mellomfinansiering",
    shortTitleEn: "Bridge Loan & Timing",
    titleNo: "Mellomfinansiering & «Kjøpe eller selge først?» Kalkulator",
    titleEn: "Bridge Loan & Buy-vs-Sell-First Calculator",
    descNo:
      "Beregn månedlig rentekostnad (før og etter 22 % skattefradrag) ved kjøp før salg, og sjekk bankens 10–15 % sikkerhetsmargin.",
    descEn:
      "Calculate monthly interest-only bridge financing costs after 22% tax relief, plus Norwegian banks' 10–15% valuation buffer.",
    controlHintNo: "Juster boligverdi, restlån, rente, driftskostnader og overlapp (1–6 mnd.)",
    controlHintEn: "Adjust home value, remaining loan, rate, housing costs & overlap (1–6 mo)",
    sampleMetricNo: "28 369 kr / mnd totalt",
    sampleMetricEn: "28 369 kr / mo total",
    seoTitleNo: "Mellomfinansiering kalkulator (2026) — Kjøpe eller selge først? | VurderBoligen",
    seoDescNo:
      "Regn ut hva mellomfinansiering koster per måned etter 22 % rentefradrag i Norge. Se bankens rentepåslag, sikkerhetsmargin og om du bør kjøpe eller selge først.",
    seoKeywordsNo: [
      "mellomfinansiering kalkulator",
      "hva koster mellomfinansiering",
      "kjøpe eller selge først",
      "kjøpe ny bolig før man har solgt",
    ],
    guideHeadingNo: "Kjøpe først eller selge først — slik regner banken",
    guideBodyNo:
      "Når du kjøper ny bolig før den gamle er solgt, gir banken mellomfinansiering på egenkapitalen som er bundet opp (normalt inntil 6 måneder, avdragsfritt med typisk 6,0–7,8 % rente mot ~5,3 % vanlig boliglånsrente i 2026). I tillegg løper rentene på ditt eksisterende boliglån samt doble bokostnader (felleskostnader, strøm, forsikring) i overlappperioden. Banken trekker vanligvis 10–15 % sikkerhetsmargin fra antatt salgspris, og du får 22 % skattefradrag på betalte gjeldsrenter.",
    guideHeadingEn: "Buy first vs. sell first — how Norwegian banks evaluate risk",
    guideBodyEn:
      "When buying before selling, banks grant an interest-only bridge loan (mellomfinansiering) for up to 6 months covering trapped equity (typically 6.0%–7.8% vs. ~5.3% regular mortgage in 2026), while your existing mortgage interest and extra housing costs also run during overlap. Banks stress-test your unsold home with a 10–15% haircut, and interest qualifies for 22% tax relief.",
    dataSourceNo: "Basert på Norges Bank (styringsrente 4,50 %), SSB (boliglånsrente ~5,3 %, 2026), norske banker (mellomfinansiering ~6,0–7,8 %) og Skatteetaten (22 % rentefradrag).",
    dataSourceEn: "Based on Norges Bank (4.50% policy rate), SSB (~5.3% 2026 mortgage rate), Norwegian banks (~6.0%–7.8% bridge loans), and Skatteetaten (22% interest relief).",
    referenceYear: "2026",
    methodologyNo:
      "Beregner samlet månedlig overlappkostnad etter 22 % rentefradrag: renter på mellomfinansiering (bundet egenkapital) + renter på eksisterende boliglån + doble faste bokostnader, summert over antall overlappmåneder — samt bankens 10–15 % stresstest.",
    methodologyEn:
      "Computes total monthly overlap cost after 22% interest relief: bridge loan interest (locked equity) + existing mortgage interest + extra running housing costs across the overlap period, plus a 10–15% bank stress test.",
    disclaimerNo:
      "Veiledende beregning. Rente på mellomfinansiering, eventuelt etableringsgebyr og krav til sikkerhetsmargin varierer mellom banker. Husk at du også betaler doble løpende bokostnader (felleskostnader, strøm, forsikring) i overlappperioden.",
    disclaimerEn:
      "Indicative calculation. Bridge loan rates, setup fees, and valuation buffers vary by bank. Remember to also budget for double utilities, HOA fees, and insurance during the overlap period.",
    sources: [
      {
        name: "Finansportalen",
        detailNo: "Oppdaterte norske boliglånsrenter og bankvilkår",
        detailEn: "Up-to-date Norwegian mortgage rates and banking terms",
        url: "https://www.finansportalen.no/",
      },
      {
        name: "Norges Bank",
        detailNo: "Styringsrente og pengepolitisk rentenivå i Norge",
        detailEn: "Norwegian central bank policy rate and rate outlook",
        url: "https://www.norges-bank.no/tema/pengepolitikk/Styringsrenten/",
      },
      {
        name: "Skatteetaten",
        detailNo: "22 % skattefradrag for betalte gjeldsrenter",
        detailEn: "22% tax deduction on mortgage and bridge loan interest",
        url: "https://www.skatteetaten.no/satser/alminnelig-inntekt/",
      },
    ],
    faqs: [
      {
        qNo: "Hvor lenge kan man ha mellomfinansiering?",
        aNo: "De fleste norske banker innvilger mellomfinansiering i inntil 6 måneder. Lånet er normalt avdragsfritt, slik at du kun betaler renter i overlappperioden.",
        qEn: "How long does bridge financing last in Norway?",
        aEn: "Most banks grant bridge loans for up to 6 months on an interest-only basis while your current property sells.",
      },
      {
        qNo: "Hva koster det å ha to boliger i 3 måneder?",
        aNo: "I tillegg til rentene på mellomfinansieringen må du betale doble faste utgifter (felleskostnader, strøm, forsikring, kommunale avgifter) i overlappmånedene.",
        qEn: "What extra costs occur during a 3-month overlap?",
        aEn: "Beyond bridge loan interest, factor in double HOA fees, utilities, insurance, and municipal fees until handover.",
      },
    ],
    relatedSlugs: ["document-fee", "net-cash", "price-per-m2"],
  },
  {
    slug: "rent-or-sell",
    path: "/verktoy/leie-ut-eller-selge",
    source: "rent-or-sell",
    category: "buy-move",
    iconKey: "rent-or-sell",
    isNew: true,
    shortTitleNo: "Leie ut eller selge?",
    shortTitleEn: "Rent Out vs. Sell",
    titleNo: "Leie ut eller selge boligen?",
    titleEn: "“Rent Out vs. Sell” Property Calculator",
    descNo:
      "Se hva du faktisk sitter igjen med i måneden ved utleie – etter skatt, vedlikehold og formuesskatt – sammenlignet med å selge skattefritt i dag.",
    descEn:
      "Compare net monthly rental cashflow (after 22% tax, HOA, upkeep & 100% secondary-home wealth tax) against selling tax-free today.",
    controlHintNo: "Juster boligverdi, leieinntekt, lån og botidsstatus",
    controlHintEn: "Adjust value, monthly rent, mortgage & residency tax status",
    sampleMetricNo: "2,4 % netto yield",
    sampleMetricEn: "2.4% net yield",
    seoTitleNo: "Leie ut eller selge bolig? Utleiekalkulator med skatt og botid (2026) | VurderBoligen",
    seoDescNo:
      "Lønner det seg å leie ut boligen eller selge skattefritt nå? Beregn netto kontantstrøm, 22 % utleieskatt, formuesskatt på sekundærbolig og tapt botid.",
    seoKeywordsNo: [
      "leie ut eller selge bolig kalkulator",
      "utleiekalkulator bolig norge",
      "lønner det seg å leie ut bolig",
      "skatt på utleie av sekundærbolig",
    ],
    guideHeadingNo: "Botidsfellen mange norske boligeiere glemmer",
    guideBodyNo:
      "Flytter du ut og leier ut en tidligere primærbolig i mer enn 12 måneder, mister du retten til skattefritt salg — og må betale 22 % skatt på hele den historiske gevinsten siden du opprinnelig kjøpte boligen! I tillegg øker formuesverdien fra 25 % (primærbolig) til 100 % (sekundærbolig, bunnfradrag 1,9 mill. kr for enslige i 2026). Regn alltid på begge alternativene før du bestemmer deg.",
    guideHeadingEn: "The 12-month residency trap many Norwegian owners overlook",
    guideBodyEn:
      "If you move out and rent your former primary residence for more than 12 months, you lose Norway's tax-free sale exemption and owe 22% tax on the ENTIRE historical gain since original purchase — while wealth-tax valuation jumps from 25% to 100% (1.9M kr single threshold in 2026). Always compare both options first.",
    dataSourceNo: "Basert på Skatteetaten 2026 (22 % skatt, 100 % sekundærbolig, 1,9 mill. kr bunnfradrag), Skatteloven §§ 7-2 og 9-3, SSB (~5,3 % boliglånsrente) og Finansportalen (~4,5 % høyrentekonto).",
    dataSourceEn: "Based on Skatteetaten 2026 (22% tax, 100% secondary-home value, 1.9M kr threshold), Tax Act §§ 7-2 & 9-3, SSB (~5.3% mortgage), and Finansportalen (~4.5% savings).",
    referenceYear: "2026",
    methodologyNo:
      "Trekker tomgangsreserve, drifts-/felleskostnader, 22 % skatt på netto utleieoverskudd, boliglånsrenter (~5,3 %) etter 22 % rentefradrag og eventuell ekstra formuesskatt (over 1,9 mill. kr bunnfradrag i 2026) fra brutto leieinntekt — og sammenligner med ~4,5 % høyrentekonto etter 22 % skatt på frigjort egenkapital ved salg.",
    methodologyEn:
      "Deducts vacancy reserve, operating/HOA expenses, 22% tax on net rental profit, mortgage interest (~5.3%) after 22% relief, and incremental secondary-home wealth tax (above 1.9M kr 2026 single threshold) from gross rent — compared against ~4.5% savings return after 22% tax on unlocked equity.",
    disclaimerNo:
      "Veiledende beregning. Fremtidig boligprisutvikling, uforutsett vedlikehold, ledighet mellom leietakere og din samlede nettoformue/skatteposisjon kan endre lønnsomheten vesentlig.",
    disclaimerEn:
      "Indicative estimate. Future home price changes, unexpected maintenance, tenant turnover, and your total household wealth-tax position significantly affect actual returns.",
    sources: [
      {
        name: "Skatteetaten (Utleie)",
        detailNo: "22 % skatt på netto utleieinntekt (Skatteloven § 7-2) og skattefri delutleie av egen bolig",
        detailEn: "22% tax on net rental income (Tax Act § 7-2) and tax-free partial own-home rental rules",
        url: "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/",
      },
      {
        name: "Skatteetaten (Formuesskatt)",
        detailNo: "100 % formuesverdi på sekundærbolig og 1,9 mill. kr bunnfradrag for enslig (2026)",
        detailEn: "100% wealth-tax valuation on secondary homes and 1.9M kr single threshold (2026)",
        url: "https://www.skatteetaten.no/satser/formuesskatt/",
      },
      {
        name: "Lovdata (Skatteloven §§ 7-2 & 9-3)",
        detailNo: "Regler om utleieskatt og 12-av-24-måneders botidsregel for skattefritt salg",
        detailEn: "Rules on rental taxation and 12-of-24-month residency exemption",
        url: "https://lovdata.no/dokument/NL/lov/1999-03-26-14/KAPITTEL_10-1#%C2%A79-3",
      },
      {
        name: "SSB & Finansportalen",
        detailNo: "Referanserenter 2026: boliglån ~5,3 % og høyrentekonto ~4,5 %",
        detailEn: "2026 reference rates: ~5.3% mortgage and ~4.5% high-yield savings",
        url: "https://www.finansportalen.no/",
      },
    ],
    faqs: [
      {
        qNo: "Hvor lenge kan jeg leie ut boligen min og likevel selge skattefritt?",
        aNo: "Hvis du har bodd i boligen i minst 12 måneder i strekk, kan du leie den ut i inntil nesten 12 måneder og fortsatt oppfylle kravet om 12 av de siste 24 månedene når budet aksepteres.",
        qEn: "How long can I rent out my home and still sell tax-free?",
        aEn: "If you lived there 12+ consecutive months, you can rent it out for up to just under 12 months and still satisfy the 12-of-24-month rule when accepting a buyer's bid.",
      },
      {
        qNo: "Hvordan beskattes leieinntekter — og når er utleie skattefritt?",
        aNo: "Når du leier ut hele boligen uten å bo der selv (sekundærbolig), beskattes netto overskudd (brutto leie minus felleskostnader, kommunale avgifter, forsikring og vedlikehold) med 22 %. Bor du derimot selv i minst halvparten av boligen målt etter utleieverdi (50 %-regelen i Skatteloven § 7-2), er langtidsutleie skattefri — og kortvarig utleie under 20 000 kr i året er også skattefri.",
        qEn: "How is rental income taxed — and when is renting tax-free?",
        aEn: "When renting out the entire property without living there, net profit is taxed at 22%. However, if you live in at least 50% of the home measured by rental value (Tax Act § 7-2), long-term rental of the smaller part is tax-free, as is rental income up to 20,000 kr/year.",
      },
    ],
    relatedSlugs: ["capital-gains-tax", "net-cash", "property-tax"],
  },

  // ======================== TIER 2 NEW TOOLS (6) ========================
  {
    slug: "property-tax",
    path: "/verktoy/eiendomsskatt",
    source: "property-tax",
    category: "value-land",
    iconKey: "property-tax",
    isNew: true,
    shortTitleNo: "Eiendomsskatt",
    shortTitleEn: "Property Tax",
    titleNo: "Kalkuler eiendomsskatt i din kommune",
    titleEn: "Municipal Property Tax Calculator (Norway)",
    descNo:
      "Sjekk oppdatert 2026-eiendomsskatt i 20 store norske kommuner med vedtatt bunnfradrag, 30 % reduksjonsfaktor og promillesats.",
    descEn:
      "Compute 2026 annual property tax across 20 major Norwegian municipalities using official local thresholds, 30% statutory reduction, and promille rates.",
    controlHintNo: "Velg kommune, boligtype og dra markedsverdi",
    controlHintEn: "Pick municipality, property type & slide market value",
    sampleMetricNo: "1 785 kr / år",
    sampleMetricEn: "1 785 kr / yr",
    seoTitleNo: "Eiendomsskatt kalkulator (2026) — Beregn eiendomsskatt i Oslo, Bergen, Trondheim m.fl. | VurderBoligen",
    seoDescNo:
      "Gratis norsk eiendomsskatt-kalkulator oppdatert med 2026-satser for Oslo (1,7 ‰), Bergen, Trondheim, Stavanger, Tromsø m.fl. Se bunnfradrag og 30 % reduksjon.",
    seoKeywordsNo: [
      "eiendomsskatt kalkulator",
      "eiendomsskatt oslo kalkulator",
      "eiendomsskatt bergen",
      "eiendomsskatt trondheim",
      "beregn eiendomsskatt bolig",
    ],
    guideHeadingNo: "Slik beregnes eiendomsskatt i norske kommuner i 2026",
    guideBodyNo:
      "Alle norske kommuner som krever inn eiendomsskatt på bolig og fritidsbolig må gi minst 30 % obligatorisk reduksjonsfaktor på markedsverdien/taksten (skattegrunnlaget blir maks 70 %). Deretter trekkes kommunens eventuelle bunnfradrag fra, før den kommunale promillesatsen (maks 4 promille for bolig og fritidsbolig) multipliseres på restbeløpet.",
    guideHeadingEn: "How municipal property tax is calculated in Norway (2026)",
    guideBodyEn:
      "Norwegian municipalities levying residential property tax must apply at least a 30% statutory reduction (tax base max 70% of market value/assessment), deduct any local threshold (bunnfradrag), and multiply by the municipal promille rate (capped at 4‰ for homes and cabins).",
    dataSourceNo: "Basert på Eigedomsskattelova, Skatteetaten og kommunenes vedtatte 2026-budsjetter (promille og bunnfradrag).",
    dataSourceEn: "Based on the Norwegian Property Tax Act, Skatteetaten, and official 2026 municipal tax resolutions.",
    referenceYear: "2026",
    methodologyNo:
      "Årlig eiendomsskatt = max(0, markedsverdi × 0,70 − kommunalt bunnfradrag) × kommunal promillesats / 1 000. Kommuner uten eiendomsskatt på bolig og fritidsbolig gir 0 kr.",
    methodologyEn:
      "Annual property tax = max(0, market value × 0.70 − municipal threshold) × local promille rate / 1,000. Municipalities without residential property tax return 0 kr.",
    disclaimerNo:
      "Veiledende beregning basert på kommunenes vedtatte 2026-satser. Noen kommuner benytter kommunal takst fremfor Skatteetatens beregnede boligverdi, og skatt under minstegrensen (typisk 300 kr) blir ikke utskrevet. Kontroller alltid egen eiendomsskatteseddel.",
    disclaimerEn:
      "Indicative estimate based on official 2026 municipal rates. Some municipalities use local assessments rather than Skatteetaten values, and bills under the statutory minimum (typically 300 kr) are waived. Always check your municipal tax notice.",
    sources: [
      {
        name: "Lovdata (Eigedomsskattelova)",
        detailNo: "Lovbestemt 30 % reduksjonsfaktor og maks 4 promille på bolig/fritid",
        detailEn: "Statutory 30% reduction factor and 4‰ cap on residential property",
        url: "https://lovdata.no/dokument/NL/lov/1975-06-06-29",
      },
      {
        name: "SSB (Eiendomsskatt / KOSTRA)",
        detailNo: "Nasjonal oversikt over kommunale eiendomsskattesatser og bunnfradrag",
        detailEn: "National municipal property tax statistics and rate overview",
        url: "https://www.ssb.no/offentlig-sektor/kommune-stat-rapportering/statistikk/eiendomsskatt",
      },
      {
        name: "Skatteetaten (Formuesverdi)",
        detailNo: "Beregnet markedsverdi brukt som grunnlag i bl.a. Oslo, Bergen og Ålesund",
        detailEn: "Calculated residential market values used as tax base in major cities",
        url: "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/formuesverdi/",
      },
      {
        name: "Oslo kommune / Kommunenes 2026-vedtak",
        detailNo: "Vedtatt 2026-sats i Oslo (1,7 ‰ og 4,9 mill. kr bunnfradrag) og øvrige storbyer",
        detailEn: "Official 2026 resolutions including Oslo (1.7‰, 4.9M kr threshold) and peers",
        url: "https://www.oslo.kommune.no/skatt-og-naring/skatt-og-avgift/eiendomsskatt/",
      },
    ],
    faqs: [
      {
        qNo: "Hvilke store kommuner har 0 kr i eiendomsskatt på bolig i 2026?",
        aNo: "Blant de 20 kommunene i kalkulatoren har Bærum, Asker, Drammen, Sandnes, Sandefjord og Tønsberg 0 kr i eiendomsskatt på vanlig bolig i 2026. I tillegg har Oslo (4,9 mill. kr) og Lillestrøm (4,0 mill. kr) høye bunnfradrag som gjør at boliger under hhv. ca. 7,0 mill. kr og ca. 5,7 mill. kr betaler 0 kr.",
        qEn: "Which major Norwegian municipalities have zero residential property tax in 2026?",
        aEn: "Bærum, Asker, Drammen, Sandnes, Sandefjord, and Tønsberg levy 0‰ on homes in 2026. In addition, Oslo (4.9M kr threshold) and Lillestrøm (4.0M kr) exempt homes valued under ~7.0M kr and ~5.7M kr respectively.",
      },
      {
        qNo: "Kan eiendomsskatt klages på hvis boligverdien er satt for høyt?",
        aNo: "Ja. Hvis kommunens takst eller Skatteetatens boligverdi ligger høyere enn reell markedsverdi, kan du bruke en fersk verdivurdering fra eiendomsmegler som dokumentasjon ved klage.",
        qEn: "Can I appeal if my property tax valuation is too high?",
        aEn: "Yes. If the assessed value exceeds real market value, you can submit an updated E-takst from a licensed broker to request a downward adjustment.",
      },
    ],
    relatedSlugs: ["price-per-m2", "cabin-cost", "rent-or-sell"],
  },
  {
    slug: "document-fee",
    path: "/verktoy/dokumentavgift",
    source: "document-fee",
    category: "buy-move",
    iconKey: "document-fee",
    isNew: true,
    shortTitleNo: "Dokumentavgift (2,5 %)",
    shortTitleEn: "2.5% Stamp Duty",
    titleNo: "Kalkulator: Dokumentavgift & Omkostninger",
    titleEn: "2.5% Stamp Duty & Buying Costs Calculator",
    descNo:
      "Beregn nøyaktig dokumentavgift (2,5 %), Kartverkets 2026-tinglysingsgebyr (545 kr) og totale kjøpsomkostninger for selveier, borettslag og nybygg.",
    descEn:
      "Calculate exact 2.5% Norwegian stamp duty, Kartverket 2026 registration fees (545 kr), and total buying costs for freehold, borettslag, and new-builds.",
    controlHintNo: "Velg eierform (selveier / borettslag / nybygg) og kjøpesum",
    controlHintEn: "Tap ownership type (freehold / co-op / new-build) & slide price",
    sampleMetricNo: "151 350 kr omk.",
    sampleMetricEn: "151 350 kr fees",
    seoTitleNo: "Dokumentavgift kalkulator (2026) — Beregn 2,5 % avgift og 545 kr tinglysing | VurderBoligen",
    seoDescNo:
      "Regn ut eksakt dokumentavgift (2,5 %) og Kartverkets 2026-tinglysingsgebyrer (545 kr + 260 kr pantattest) ved kjøp av selveierbolig, nybygg eller tomt i Norge. Sammenlign mot borettslag (0 kr).",
    seoKeywordsNo: [
      "dokumentavgift kalkulator",
      "omkostninger kjøp av bolig kalkulator",
      "selveier vs borettslag kostnader",
      "tinglysingsgebyr skjøte 2026",
    ],
    guideHeadingNo: "Slik sparer du på dokumentavgift ved boligbytte",
    guideBodyNo:
      "Ved kjøp av brukt selveierbolig betaler kjøper 2,5 % dokumentavgift til staten på hele kjøpesummen. Kjøper du derimot en borettslagsleilighet er dokumentavgiften 0 kr — og ved kjøp av helt ny bolig under oppføring beregnes 2,5 % kun på tomteverdien, ikke bygningsmassen. Tinglysingsgebyret hos Kartverket er 545 kr per dokument i 2026 (lik sats for elektronisk og papir, fast eiendom og borettslag), pluss 260 kr for pantattest.",
    guideHeadingEn: "How stamp duty differs across Norwegian property types",
    guideBodyEn:
      "Resale freehold homes carry a 2.5% state document fee on the full purchase price. Co-op homes (borettslag) carry 0 kr stamp duty, and newly constructed homes only charge 2.5% on the underlying land share. Kartverket's unified 2026 registration fee is 545 kr per document (electronic & paper, freehold & borettslag), plus 260 kr for the mortgage certificate (pantattest).",
    dataSourceNo: "Kartverkets offisielle 2026-satser: 2,5 % dokumentavgift, 545 kr per tinglysing og 260 kr pantattest.",
    dataSourceEn: "Official Kartverket 2026 rates: 2.5% document fee, 545 kr per filing, and 260 kr mortgage certificate (pantattest).",
    referenceYear: "2026",
    methodologyNo:
      "Summerer statlig dokumentavgift (2,5 % av kjøpesum for brukt selveier, 2,5 % av tomteandel for nybygg, 0 kr for borettslag), Kartverkets 2026-gebyrer (545 kr skjøte/andel + 545 kr pantedokument + 260 kr pantattest = 1 350 kr), eventuelt forkjøpsrettsgebyr og valgfri boligkjøperforsikring.",
    methodologyEn:
      "Sums 2.5% state stamp duty (full price on resale freehold, land share on new-builds, 0 kr on co-ops), Kartverket 2026 fees (545 kr deed + 545 kr mortgage + 260 kr pantattest = 1,350 kr), optional preemption fee, and optional buyer legal insurance.",
    disclaimerNo:
      "Dokumentavgift (2,5 %), tinglysingsgebyr (545 kr/dok) og pantattest (260 kr) er faste offentlige 2026-satser. Eierskiftegebyr i borettslag betales av selger (burettslagslova § 4-6), mens ev. forkjøpsrettsgebyr og valgfri boligkjøperforsikring varierer mellom borettslag og forsikringsselskaper.",
    disclaimerEn:
      "The 2.5% stamp duty, 545 kr filing fee, and 260 kr pantattest are fixed 2026 statutory rates. Borettslag transfer fees are paid by the seller (Co-op Act § 4-6), while optional preemption fees and buyer insurance vary by housing manager and insurer.",
    sources: [
      {
        name: "Kartverket (Tinglysingsgebyr)",
        detailNo: "Offisielt gebyr i 2026: 545 kr per tinglysing (likt for elektronisk/papir og selveier/borettslag) + 260 kr pantattest",
        detailEn: "Official 2026 fee: 545 kr per filing (unified digital/paper & freehold/co-op) + 260 kr pantattest",
        url: "https://www.kartverket.no/eiendom/tinglysing/tinglysingsgebyr",
      },
      {
        name: "Lovdata (Dokumentavgiftsloven & Burettslagslova)",
        detailNo: "2,5 % statlig dokumentavgift og § 4-6 om selgers ansvar for eierskiftegebyr i borettslag",
        detailEn: "2.5% statutory stamp duty and Co-op Act § 4-6 on seller-paid transfer fees",
        url: "https://lovdata.no/dokument/NL/lov/1975-12-12-59",
      },
      {
        name: "Skatteetaten (Dokumentavgift)",
        detailNo: "Beregningsgrunnlag og fritaksregler ved overføring av eiendom",
        detailEn: "Assessment base and exemption guidance for property transfers",
        url: "https://www.skatteetaten.no/person/avgifter/dokumentavgift/",
      },
    ],
    faqs: [
      {
        qNo: "Hvor mye er tinglysingsgebyret hos Kartverket i 2026?",
        aNo: "Tinglysing av skjøte/andel og pantedokument koster 545 kr per dokument i 2026, pluss 260 kr for pantattest (totalt 1 350 kr til Kartverket for kjøper med boliglån). Satsen er lik for elektronisk innsending, papir, fast eiendom og borettslag. Merk at eierskiftegebyr i borettslag betales av selger (burettslagslova § 4-6), mens forkjøpsrettsgebyr kun betales av kjøper som benytter forkjøpsrett.",
        qEn: "How much are Kartverket registration fees in 2026?",
        aEn: "Deed/share transfer and mortgage registration cost 545 kr per filing in 2026, plus 260 kr for the pantattest (1,350 kr total with a mortgage). Rates are unified across electronic/paper and freehold/borettslag. Note that borettslag transfer fees (eierskiftegebyr) are paid by the seller under Co-op Act § 4-6, while preemption fees apply only if a buyer exercises preemption.",
      },
      {
        qNo: "Betaler jeg dokumentavgift på fellesgjeld i selveier eller borettslag?",
        aNo: "I borettslag er det ingen dokumentavgift. I eierseksjonssameie (selveier) beregnes dokumentavgift kun på kjøpesummen, ikke på andel fellesgjeld.",
        qEn: "Is stamp duty charged on shared debt (fellesgjeld)?",
        aEn: "No. Co-ops have 0 kr stamp duty, and in freehold condominiums the 2.5% fee applies only to the purchase price, not shared debt.",
      },
    ],
    relatedSlugs: ["bridge-loan", "net-cash", "broker-fee"],
  },
  {
    slug: "cabin-cost",
    path: "/verktoy/hyttekostnad",
    source: "cabin-cost",
    category: "cabin-energy",
    iconKey: "cabin-cost",
    isNew: true,
    shortTitleNo: "Hyttekostnad & Salg",
    shortTitleEn: "Cabin Cost & Sale",
    titleNo: "Hva koster hytta deg egentlig?",
    titleEn: "Cabin Annual Cost & Tax-Free Sale Calculator",
    descNo:
      "Regn ut hva hytta faktisk koster deg per døgn (både direkte utgift og kapitalkostnad) — og sjekk om den kan selges skattefritt.",
    descEn:
      "See your cabin's direct and total cost per night used (loan, power, lease, tax, upkeep) plus Norway's 5-of-8-year tax-free sale check.",
    controlHintNo: "Velg hytteverdi, antall bruksdøgn i året og 5/8-års brukstid",
    controlHintEn: "Slide cabin value, tap nights used per year & 5/8-yr rule",
    sampleMetricNo: "4 126 kr / døgn",
    sampleMetricEn: "4 126 kr / night",
    seoTitleNo: "Hyttekostnad kalkulator (2026) — Hva koster hytta per døgn og skatt ved salg? | VurderBoligen",
    seoDescNo:
      "Regn ut hva det faktisk koster å eie hytte i Norge per år og per overnatting (strøm/Norgespris, rente, vedlikehold). Sjekk 5-av-8-års regelen for skattefritt salg.",
    seoKeywordsNo: [
      "hyttekostnad kalkulator",
      "hva koster det å eie hytte",
      "skatt ved salg av hytte",
      "selge hytte kalkulator",
    ],
    guideHeadingNo: "Hva koster egentlig en norsk hytte per bruksdøgn?",
    guideBodyNo:
      "Mange hytteeiere blir overrasket når rentekostnad (ca. 5,35 % snittrente i 2026 etter 22 % skattefradrag), strøm og nettleie (merk Norgespris for hytter: 50 øre/kWh inkl. mva opptil 1 000 kWh/mnd + nettleie), kommunale avgifter, brøyting, festeavgift, forsikring, eiendomsskatt og nøkternt vedlikehold (ca. 0,5 %/år) summeres og deles på 20–35 overnattinger i året. Har du eid og brukt hytta som egen fritidsbolig i minst 5 av de siste 8 årene (Skatteloven § 9-3 (4)), kan den selges 100 % skattefritt.",
    guideHeadingEn: "What does a Norwegian cabin really cost per night used?",
    guideBodyEn:
      "Dividing mortgage interest (~5.35% 2026 average after 22% tax relief), power & grid fees (including Norway's Norgespris cabin scheme at 50 øre/kWh incl. VAT up to 1,000 kWh/mo + grid fee), municipal charges, snow plowing, ground lease, insurance, and realistic upkeep (~0.5%/yr) by 20–35 nights reveals the true per-night cost. Under Tax Act § 9-3 (4), cabins owned and used 5 of the last 8 years sell 100% tax-free.",
    dataSourceNo: "Basert på Skatteloven § 9-3 (4), SSB boliglånsrente (2026), Norgespris for fritidsbolig og norske driftsestimater.",
    dataSourceEn: "Based on Tax Act § 9-3 (4), SSB 2026 mortgage rates, Norway's cabin Norgespris power scheme, and operating benchmarks.",
    referenceYear: "2026",
    methodologyNo:
      "Skiller tydelig mellom direkte årsutgift (faste utgifter + lånerenter etter 22 % skattefradrag + løpende vedlikehold på ca. 0,5 %/år) og total reell kostnad inkludert valgfri alternativkostnad på bundet egenkapital, delt på antall årlige bruksdøgn.",
    methodologyEn:
      "Separates direct annual cash outlay (fixed expenses + mortgage interest after 22% tax relief + ~0.5%/yr maintenance) from total economic cost including optional equity opportunity cost, divided by annual nights used.",
    disclaimerNo:
      "Veiledende estimat. Faste hyttekostnader varierer stort etter beliggenhet (høyfjell vs. kyst), størrelse, helårsvei/brøyting, festeavgift, kommunal eiendomsskatt og grad av egeninnsats på vedlikehold.",
    disclaimerEn:
      "Indicative estimate. Cabin expenses vary widely by mountain vs. coastal location, size, winter road plowing, ground lease, local property tax, and DIY maintenance.",
    sources: [
      {
        name: "Skatteetaten (Fritidsbolig)",
        detailNo: "Skatteloven § 9-3 (4): 5-av-8-års regelen for skattefritt hyttesalg",
        detailEn: "Tax Act § 9-3 (4): 5-of-8-year rule for tax-free cabin sales",
        url: "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/salg/salg-av-fritidsbolig/",
      },
      {
        name: "SSB (Renter & Strømpriser)",
        detailNo: "Gjennomsnittlig boliglånsrente (~5,35 % i 2026) og husholdningers kraftpris",
        detailEn: "Average Norwegian mortgage rates (~5.35% in 2026) and electricity prices",
        url: "https://www.ssb.no/energi-og-industri/energi/statistikk/elektrisitetspriser",
      },
      {
        name: "Regjeringen (Norgespris)",
        detailNo: "Fastprisordning for strøm på fritidsbolig (50 øre/kWh inkl. mva inntil 1 000 kWh/mnd)",
        detailEn: "Fixed-price cabin electricity scheme (50 øre/kWh incl. VAT up to 1,000 kWh/mo)",
        url: "https://www.regjeringen.no/no/tema/energi/strom/",
      },
    ],
    faqs: [
      {
        qNo: "Når er salg av hytte eller fritidsbolig skattefritt?",
        aNo: "Du må ha eid fritidsboligen i mer enn 5 år og brukt den som egen fritidsbolig i minst 5 av de siste 8 årene før salget avtales (Skatteloven § 9-3 (4)).",
        qEn: "When is selling a cabin tax-free in Norway?",
        aEn: "You must have owned the cabin for more than 5 years and personally used it as your own leisure property in at least 5 of the last 8 years (Tax Act § 9-3 (4)).",
      },
      {
        qNo: "Mister jeg skattefrihet hvis jeg leier ut hytta noen uker i året?",
        aNo: "Nei, så lenge du selv bruker hytta i normalt omfang som fritidsbolig gjennom året, ødelegger ikke kortere utleieperioder skattefriheten ved salg.",
        qEn: "Does occasional short-term cabin rental ruin tax-free sale status?",
        aEn: "No. As long as you regularly use the cabin yourself throughout the year, moderate seasonal rentals do not disqualify the 5-of-8-year exemption.",
      },
    ],
    relatedSlugs: ["capital-gains-tax", "ground-lease", "property-tax"],
  },
  {
    slug: "energy-rating",
    path: "/verktoy/energimerking",
    source: "energy-rating",
    category: "cabin-energy",
    iconKey: "energy-rating",
    isNew: true,
    shortTitleNo: "Energimerking (A–G)",
    shortTitleEn: "Energy Rating (A–G)",
    titleNo: "Estimer boligens energikarakter og strømforbruk",
    titleEn: "Energy Rating Estimator (A–G) & Pre-Sale Value",
    descNo:
      "Estimer boligens samlede energikarakter (A–G etter nye 2026-regler), årlig strømforbruk og aktuelle Enova-støtteordninger.",
    descEn:
      "Estimate your home's unified A–G energy label (2026 NS 3031:2025 rules), yearly power usage, and updated 2025/2026 Enova grant eligibility.",
    controlHintNo: "Trykk på byggeår, oppvarming og utførte oppgraderinger",
    controlHintEn: "Tap build decade, heating system & insulation upgrades",
    sampleMetricNo: "Karakter C · 22 080 kWh",
    sampleMetricEn: "Grade C · 22 080 kWh",
    seoTitleNo: "Energimerking kalkulator (A–G, 2026) — Sjekk energiattest og Enova-støtte | VurderBoligen",
    seoDescNo:
      "Beregn estimert energikarakter (A–G etter ny 2026-ordning uten fargeskala) og strømkostnad i Norge. Se oppdaterte Enova-satser og krav til energiattest ved salg.",
    seoKeywordsNo: [
      "energimerking kalkulator",
      "energiattest bolig salg",
      "energikarakter bolig estimat 2026",
      "enova støtte 2026",
    ],
    guideHeadingNo: "Ny norsk energimerkeordning fra 1. januar 2026 — dette må du vite",
    guideBodyNo:
      "Ved salg av bolig i Norge er det lovpålagt å fremlegge en gyldig energiattest (A–G). Fra 1. januar 2026 innførte Enova en ny beregningsmodell (NS 3031:2025) som fjernet den gamle rød–grønne oppvarmingskarakteren: nå får boligen én samlet bokstavkarakter A–G basert på vektet levert energi (strøm 1,0, fjernvarme/bio 0,45, eksportert solstrøm 0; der karakter B tilsvarer TEK17-nivå og A ligger 15 % under TEK17). Mange banker tilbyr lavere rente på grønt boliglån for karakter A og B.",
    guideHeadingEn: "Norway's updated 2026 energy labeling rules — what changed",
    guideBodyEn:
      "An official energy certificate (energiattest, A–G) is legally required when selling in Norway. From January 1, 2026, Enova replaced the legacy red–green heating color scale with one unified A–G grade under NS 3031:2025 based on weighted delivered energy (electricity 1.0, district heating/bio 0.45, exported solar 0; Grade B aligns with TEK17 and Grade A is 15% below TEK17). Grade A & B homes often unlock green mortgage discounts.",
    dataSourceNo: "Basert på Enovas nye energimerkeordning (1. jan. 2026 / NS 3031:2025), Enova-satser 2025/2026 og TEK17.",
    dataSourceEn: "Based on Enova's unified 2026 energy label (NS 3031:2025), 2025/2026 Enova grant rules, and TEK17 standards.",
    referenceYear: "2026",
    methodologyNo:
      "Estimerer årlig levert og vektet energi (kWh/m²) fra byggeperiode (TEK-nivå), hovedoppvarming og utførte oppgraderinger, plasserer boligen på den samlede A–G-skalaen og viser aktuelle 2025/2026 Enova-tilskudd (maks 25 % per tiltak / 100 000 kr samlet).",
    methodologyEn:
      "Estimates annual delivered and weighted energy (kWh/m²) from build era (TEK code), heating source, and upgrades, maps to the unified A–G label, and displays current 2025/2026 Enova grant caps (max 25% per measure / 100,000 kr total).",
    disclaimerNo:
      "Veiledende estimat som ikke erstatter lovpålagt offisiell energiattest via energimerking.no. Viktig for Enova-støtte i 2025/2026: du MÅ søke og få godkjent støtte FØR du bestiller eller starter arbeidet, og luft-til-luft-varmepumpe gir 0 kr i Enova-støtte.",
    disclaimerEn:
      "Indicative estimate only — does not replace the mandatory official certificate from energimerking.no. Important for 2025/2026 Enova grants: you MUST apply and obtain approval BEFORE ordering/starting work, and air-to-air heat pumps receive 0 kr.",
    sources: [
      {
        name: "Enova (Energimerking.no)",
        detailNo: "Ny samlet A–G energikarakter fra 1. jan. 2026 (NS 3031:2025, uten fargeskala)",
        detailEn: "New unified A–G energy rating effective Jan 1, 2026 (NS 3031:2025)",
        url: "https://www.enova.no/energimerking/",
      },
      {
        name: "Enova (Støttetiltak 2026)",
        detailNo: "Søknad før oppstart: væske-til-vann inntil 40k, luft-til-vann 20k, solceller, vinduer & isolering (før 1997)",
        detailEn: "Pre-approval grants: geothermal up to 40k, air-to-water 20k, solar, windows & insulation (pre-1997)",
        url: "https://www.enova.no/privat/alle-energitiltak/",
      },
      {
        name: "DiBK (TEK17)",
        detailNo: "Energikrav i byggeforskrifter som danner referanse for karakter B og A",
        detailEn: "Building energy requirements anchoring Grade B and Grade A thresholds",
        url: "https://www.dibk.no/regelverk/byggteknisk-forskrift-tek17",
      },
    ],
    faqs: [
      {
        qNo: "Er energiattest påbudt når jeg selger boligen min — og hva er nytt i 2026?",
        aNo: "Ja, alle boliger som selges eller leies ut må ha gyldig energiattest fra energimerking.no (eller via takstmann). Fra 1. januar 2026 er fargeskalaen (rød–grønn oppvarmingskarakter) fjernet, slik at attesten viser én samlet bokstavkarakter fra A til G.",
        qEn: "Is an energy certificate mandatory when selling, and what changed in 2026?",
        aEn: "Yes, every sold or rented home requires a valid certificate from energimerking.no. Since Jan 1, 2026, the old red–green color scale is gone, replaced by one unified A–G letter grade.",
      },
      {
        qNo: "Hva gir Enova støtte til i 2025/2026?",
        aNo: "Viktigst: du må søke og få tilsagn FØR arbeidet bestilles/startes (maks 25 % per tiltak og 100 000 kr totalt). Luft-til-luft-varmepumpe gir ikke Enova-støtte (0 kr), men du kan få inntil 40 000 kr for bergvarme (væske-til-vann), 20 000 kr for luft-til-vann, 2 500 kr/kW (maks 37 500 kr) for solceller, samt støtte til vinduer (400 kr/m², maks 20 000 kr) og etterisolering av tak/vegg (150 kr/m², maks 22 500 / 37 500 kr) på helårsboliger godkjent før 1. juli 1997, pluss inntil 5 000 kr til energirådgivning.",
        qEn: "Which upgrades qualify for Enova grants in 2025/2026?",
        aEn: "You must apply and get approval BEFORE ordering/starting work (max 25% per measure, 100,000 kr cap). Air-to-air heat pumps get 0 kr, while grants cover geothermal (up to 40k kr), air-to-water (20k kr), solar (2,500 kr/kW, max 37.5k kr), plus windows (max 20k kr) and roof/wall insulation (max 22.5k/37.5k kr) for pre-1997 homes, and up to 5,000 kr for energy advisory.",
      },
    ],
    relatedSlugs: ["sell-as-is", "cabin-cost", "price-per-m2"],
  },
  {
    slug: "ground-lease",
    path: "/verktoy/tomtefeste",
    source: "ground-lease",
    category: "value-land",
    iconKey: "ground-lease",
    isNew: true,
    shortTitleNo: "Tomtefeste & Innløsning",
    shortTitleEn: "Ground Lease Buyout",
    titleNo: "Kalkulator for tomtefeste og innløsning (Festeavgift)",
    titleEn: "Ground Lease (Tomtefeste) & Buyout Calculator",
    descNo:
      "Beregn lovfestet innløsningssum for festetomt (25× festeavgift eller 40 % råtomt), høyestebeløp 2026 (16 060 kr/daa) og omkostninger.",
    descEn:
      "Calculate statutory Norwegian leasehold buyout (25× rent or 40% raw plot value), 2026 engangsløft cap (16,060 kr/dekar), and filing costs.",
    controlHintNo: "Juster årlig festeavgift, råtomtverdi og innløsningsregel",
    controlHintEn: "Slide annual ground rent, raw plot value & buyout rule",
    sampleMetricNo: "375 000 kr innløsning",
    sampleMetricEn: "375 000 kr buyout",
    seoTitleNo: "Tomtefeste kalkulator (2026) — Beregn innløsning av festetomt og festeavgift | VurderBoligen",
    seoDescNo:
      "Har du bolig eller hytte på festetomt? Regn ut innløsningssum (25× festeavgift eller 40 % av råtomtverdi), 2026-høyestebeløp (16 060 kr/dekar) og om du bør innløse før salg.",
    seoKeywordsNo: [
      "tomtefeste kalkulator",
      "innløsning av festetomt kalkulator",
      "festeavgift kalkulator 2026",
      "selge bolig på festetomt",
    ],
    guideHeadingNo: "Reglene for innløsning av festetomt før bolig- eller hyttesalg",
    guideBodyNo:
      "Etter Tomtefesteloven § 32 kan fester av bolig- eller fritidstomt kreve innløsning når det har gått 30 år av festetiden — og deretter hvert 2. år for boligtomt og hvert 10. år for fritidstomt (skriftlig varsel minst 1 år i forkant etter § 36). Hovedregelen etter § 37 er 25× oppregulert årlig festeavgift (høyestebeløp ved engangsløft etter § 15 er ca. 16 060 kr per dekar i 2026, gjelder også tomter under 1 dekar). For tidsbegrensede avtaler kan bortfester i stedet velge 40 % av råtomtverdien, mens tidsubegrensede avtaler uten oppsigelsesrett alltid følger 25×-regelen.",
    guideHeadingEn: "Statutory rules for buying out a Norwegian leased plot before selling",
    guideBodyEn:
      "Under Norway's Ground Lease Act § 32, lessees may demand buyout after 30 years — and subsequently every 2 years for homes or every 10 years for cabins (with 1-year written notice under § 36). The default formula (§ 37) is 25× regulated annual rent (subject to the § 15 engangsløft cap of ~16,060 kr/dekar in 2026, applying even under 1 dekar). Landlords on fixed-term leases may instead demand 40% of raw unimproved plot value, while indefinite non-terminable leases are strictly 25×.",
    dataSourceNo: "I tråd med Tomtefesteloven §§ 15, 32, 36 og 37, SSB KPI (maks 16 060 kr/daa i 2026) og Kartverket (545 kr).",
    dataSourceEn: "Aligned with Ground Lease Act §§ 15, 32, 36, 37, SSB CPI (16,060 kr/dekar 2026 cap), and Kartverket (545 kr).",
    referenceYear: "2026",
    methodologyNo:
      "Beregner KPI-regulert festeavgift, sammenligner 25× oppregulert festeavgift (hovedregel) mot 40 % av råtomtverdi (kun tidsbegrenset feste), og legger til 2,5 % dokumentavgift og Kartverkets 2026-tinglysingsgebyr (545 kr per dokument).",
    methodologyEn:
      "Computes CPI-adjusted ground rent, compares 25× regulated rent against 40% raw plot value (fixed-term leases only), and adds 2.5% stamp duty plus Kartverket's 2026 registration fees (545 kr per document).",
    disclaimerNo:
      "Veiledende beregning. Endelig innløsningssum avhenger av festekontraktens ordlyd, om engangsløft er gjennomført tidligere, fradrag for festers egne påkostninger på tomten og eventuelt skjønn. Krav må sendes skriftlig minst 1 år før innløsningstiden (§ 36).",
    disclaimerEn:
      "Indicative calculation. Final buyout price depends on contract terms, prior rent lifts, deductions for lessee-funded site improvements, and potential valuation appraisal. Notice must be sent at least 1 year in advance (§ 36).",
    sources: [
      {
        name: "Lovdata (Tomtefesteloven)",
        detailNo: "§§ 15 (KPI / høyestebeløp), 32 (30 år / 2 år / 10 år), 36 (1 års varsel) og 37 (25× / 40 %)",
        detailEn: "Ground Lease Act §§ 15, 32, 36, and 37 governing rent caps and buyout formulas",
        url: "https://lovdata.no/dokument/NL/lov/1996-12-20-106",
      },
      {
        name: "SSB (Konsumprisindeksen)",
        detailNo: "KPI-grunnlag for regulering av festeavgift og 2026-høyestebeløp (16 060 kr/dekar)",
        detailEn: "CPI benchmark for rent adjustments and 2026 max cap (16,060 kr/dekar)",
        url: "https://www.ssb.no/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen",
      },
      {
        name: "Kartverket",
        detailNo: "2,5 % dokumentavgift og 545 kr tinglysingsgebyr ved innløsning",
        detailEn: "2.5% stamp duty and 545 kr deed registration fee upon buyout",
        url: "https://www.kartverket.no/eiendom/tinglysing/tinglysingsgebyr",
      },
    ],
    faqs: [
      {
        qNo: "Hva er høyestebeløpet for festeavgift i 2026?",
        aNo: "Maksimal årlig festeavgift ved engangsløft etter Tomtefesteloven § 15 er KPI-regulert fra 9 000 kr (2002) til ca. 16 060 kr per dekar (1 000 m²) i 2026 — og beløpet gjelder fullt ut også for tomter under 1 dekar.",
        qEn: "What is the statutory ground rent cap per dekar in 2026?",
        aEn: "The Tomtefesteloven § 15 engangsløft cap is CPI-indexed from 9,000 kr (2002) to ~16,060 kr per dekar (1,000 m²) in 2026, applying in full even to plots smaller than 1 dekar.",
      },
      {
        qNo: "Når kan jeg kreve innløsning — og når må kravet sendes?",
        aNo: "Når festetiden har vart i 30 år kan du kreve innløsning, og deretter hvert 2. år for boligtomt og hvert 10. år for fritidstomt (§ 32). Skriftlig krav må normalt være mottatt av bortfester minst 1 år før innløsningstidspunktet (§ 36).",
        qEn: "When can I buy out a leased plot, and what is the notice deadline?",
        aEn: "You can claim buyout after 30 years, then every 2 years for homes or every 10 years for cabins (§ 32). Written notice must generally be delivered at least 1 year before the milestone (§ 36).",
      },
    ],
    relatedSlugs: ["land-buildability", "cabin-cost", "price-per-m2"],
  },
  {
    slug: "sun-conditions",
    path: "/verktoy/solforhold",
    source: "sun-conditions",
    category: "cabin-energy",
    iconKey: "sun-conditions",
    isNew: true,
    shortTitleNo: "Solforhold Kalkulator",
    shortTitleEn: "Sun Conditions",
    titleNo: "Solforhold Kalkulator for Terrasse, Balkong og Hage",
    titleEn: "Property Sunlight & Terrace Sun Hours Calculator",
    descNo:
      "Se nøyaktig når solen treffer terrassen og når den går ned i din by, samt indikativ markedseffekt av kveldssol.",
    descEn:
      "See accurate terrace sunrise, direct sunlight hours, and sunset times across Norway (March 21, June 21, Sept 21, Dec 21) plus indicative evening-sun appeal.",
    controlHintNo: "Velg by (eller GPS/adresse), himmelretning og horisont",
    controlHintEn: "Pick city (or GPS/address), compass direction & horizon",
    sampleMetricNo: "9,0 t sommersol",
    sampleMetricEn: "9.0h summer sun",
    seoTitleNo: "Solforhold kalkulator (2026) — Sjekk sol på terrasse og hage i Norge | VurderBoligen",
    seoDescNo:
      "Beregn astronomiske soltimer og solnedgang på balkong, terrasse og hage for vår, sommer, høst og vinter i hele Norge. Med gratis adresseoppslag fra Kartverket.",
    seoKeywordsNo: [
      "solforhold kalkulator",
      "når går solen ned på terrassen",
      "sol på hagen kalkulator",
      "solforhold eiendom sjekk",
      "kveldssol boligverdi",
    ],
    guideHeadingNo: "Hvor mye betyr ettermiddags- og kveldssol ved boligsalg?",
    guideBodyNo:
      "I Norge er gode solforhold blant de viktigste egenskapene boligkjøpere ser etter på visning. Terrasser og hager vendt mot sørvest eller vest får ettertraktet ettermiddags- og kveldssol etter arbeidstid. Som et veiledende markedsintervall gir gode kveldssolforhold ofte 5–10 % høyere betalingsvilje sammenlignet med tilsvarende nordvendte enheter (og ca. 5 % i sammenlignbare mangelssaker hos Finansklagenemnda), men utslaget er aldri en garanti og varierer kraftig med boligtype og nabolag.",
    guideHeadingEn: "How much does afternoon and evening sun affect home demand?",
    guideBodyEn:
      "In Norway, sun exposure ranks among buyers' top priorities at viewings. Southwest- and west-facing terraces capture prized after-work sun. As an indicative market range, strong evening sun often supports 5–10% higher buyer willingness compared to north-facing equivalents (~5% in comparable Finansklagenemnda defect cases), though actual price impact is never guaranteed and varies by building and district.",
    dataSourceNo: "Astronomisk solbaneberegning (inkl. tidsjevning & refraksjon) + åpent adresseoppslag via Kartverket.",
    dataSourceEn: "Astronomical solar path math (incl. Equation of Time & refraction) + open address lookup via Kartverket.",
    referenceYear: "2026",
    methodologyNo:
      "Beregner solhøyde og asimut i 10-minutters steg for valgt bredde-/lengdegrad, korrigert for tidsjevning (Equation of Time) og standard soloppgang/-nedgang (−0,833°). Direkte terrassesol registreres når solen står over valgt horisonthøyde (3°, 10° eller 18°) og innenfor ±80° av terrassens himmelretning.",
    methodologyEn:
      "Samples solar elevation and azimuth every 10 minutes for your latitude/longitude with Equation of Time correction and standard −0.833° sunrise/sunset refraction. Direct terrace sun counts when elevation exceeds the selected horizon (3°, 10°, or 18°) within ±80° of terrace orientation.",
    disclaimerNo:
      "Veiledende solberegning. Lokale skyggehindringer som høye trær, nabobygg, overbygget balkong eller bratte åser kan gi færre faktiske soltimer enn horisontvalget viser. Eventuell prispremie for kveldssol er kun et indikativt markedsintervall, ikke en garanti.",
    disclaimerEn:
      "Indicative solar estimate. Local obstructions such as trees, adjacent buildings, covered balconies, or steep hills may reduce actual direct sun hours. Evening-sun value ranges are indicative market observations, never a guarantee.",
    sources: [
      {
        name: "Kartverket (Geonorge Adresse-API)",
        detailNo: "Åpent offisielt oppslag av norske adresser og GPS-koordinater",
        detailEn: "Official open Norwegian address and coordinate lookup API",
        url: "https://ws.geonorge.no/adresser/v1/",
      },
      {
        name: "Kartverket (Norske koordinater)",
        detailNo: "Astronomisk solbaneberegning for norske breddegrader (58°–71° N)",
        detailEn: "Astronomical solar geometry for Norwegian latitudes (58°–71° N)",
        url: "https://www.kartverket.no/",
      },
      {
        name: "Finansklagenemnda / Eiendom Norge",
        detailNo: "Indikative erfaringstall for etterspørsel og prisutslag ved gode solforhold (~5–10 %)",
        detailEn: "Indicative market observations for evening-sun valuation impact (~5–10%)",
        url: "https://www.finkn.no/",
      },
    ],
    faqs: [
      {
        qNo: "Hvilken himmelretning gir mest kveldssol i Norge?",
        aNo: "Sørvest (SV) og vest (V) gir best kombinasjon av ettermiddagssol og sen kveldssol fra april til september. Nordvest gir sen kveldssol midtsommers.",
        qEn: "Which terrace orientation gets the best evening sun in Norway?",
        aEn: "Southwest (SW) and West (W) deliver the strongest afternoon and evening sunlight from April through September.",
      },
      {
        qNo: "Er prisøkningen for kveldssol en garanti?",
        aNo: "Nei. Et indikativt intervall på 5–10 % (ca. 5 % i praksis fra Finansklagenemnda) beskriver typiske forskjeller i kjøpernes betalingsvilje mellom ellers like boliger, men beliggenhet, planløsning og lokal etterspørsel veier alltid tyngst.",
        qEn: "Is the evening-sun price uplift guaranteed?",
        aEn: "No. An indicative 5–10% range (~5% in Finansklagenemnda cases) reflects typical buyer preference between otherwise identical homes, but micro-location, floor plan, and local demand always dominate.",
      },
    ],
    relatedSlugs: ["price-per-m2", "broker-fee", "energy-rating"],
  },
];

export function getToolBySlug(slug: string): ToolCatalogEntry | undefined {
  return TOOL_CATALOG.find((t) => t.slug === slug);
}

// =========================================================================
// 20 Major Norwegian Municipalities — Verified 2026 Property Tax Rates
// Sources: Official 2026 municipal budgets, SSB KOSTRA & Eigedomsskattelova
// =========================================================================
export interface MunicipalityTaxRule {
  id: string;
  name: string;
  countyNo: string;
  countyEn: string;
  cityMatchId?: string; // maps to NORWAY_CITIES id if available
  hasResidentialTax: boolean;
  promilleHome: number; // e.g. 1.7 = 0.17%
  promilleCabin: number;
  bunnfradragHome: number; // NOK deducted from tax base (after 30% reduction)
  bunnfradragCabin: number;
  reductionFactor: number; // statutory minimum 0.30 (tax base = 70% of value)
  noteNo: string;
  noteEn: string;
}

export const NORWAY_MUNICIPALITIES_TAX: MunicipalityTaxRule[] = [
  {
    id: "oslo",
    name: "Oslo",
    countyNo: "Oslo",
    countyEn: "Oslo",
    cityMatchId: "oslo",
    hasResidentialTax: true,
    promilleHome: 1.7,
    promilleCabin: 1.7,
    bunnfradragHome: 4_900_000,
    bunnfradragCabin: 4_900_000,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 1,7 promille og 4,9 mill. kr bunnfradrag etter 30 % reduksjon — boliger under ca. 7,0 mill. kr betaler 0 kr.",
    noteEn: "2026 rate: 1.7‰ and 4.9M kr threshold after 30% reduction — homes under ~7.0M kr pay 0 kr.",
  },
  {
    id: "baerum",
    name: "Bærum",
    countyNo: "Akershus",
    countyEn: "Akershus",
    cityMatchId: "baerum",
    hasResidentialTax: false,
    promilleHome: 0,
    promilleCabin: 0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Bærum har ingen eiendomsskatt på bolig og fritidsbolig i 2026.",
    noteEn: "Bærum levies no residential or cabin property tax in 2026.",
  },
  {
    id: "asker",
    name: "Asker",
    countyNo: "Akershus",
    countyEn: "Akershus",
    hasResidentialTax: false,
    promilleHome: 0,
    promilleCabin: 0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Asker har ingen eiendomsskatt på bolig og fritidsbolig i 2026.",
    noteEn: "Asker levies no residential or cabin property tax in 2026.",
  },
  {
    id: "bergen",
    name: "Bergen",
    countyNo: "Vestland",
    countyEn: "Vestland",
    cityMatchId: "bergen",
    hasResidentialTax: true,
    promilleHome: 2.6,
    promilleCabin: 2.6,
    bunnfradragHome: 750_000,
    bunnfradragCabin: 750_000,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 2,6 promille, 30 % reduksjon (Skatteetatens boligverdi) og 750 000 kr bunnfradrag per godkjente boenhet (bolig og fritidsbolig).",
    noteEn: "2026 rate: 2.6‰, 30% reduction (Skatteetaten base), and 750,000 kr threshold per approved unit (homes and cabins).",
  },
  {
    id: "trondheim",
    name: "Trondheim",
    countyNo: "Trøndelag",
    countyEn: "Trøndelag",
    cityMatchId: "trondheim",
    hasResidentialTax: true,
    promilleHome: 2.65,
    promilleCabin: 2.65,
    bunnfradragHome: 700_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 2,65 promille, 30 % reduksjon (kommunal takst) og 700 000 kr bunnfradrag per selvstendig boenhet.",
    noteEn: "2026 rate: 2.65‰, 30% reduction (municipal assessment), and 700,000 kr home threshold.",
  },
  {
    id: "stavanger",
    name: "Stavanger",
    countyNo: "Rogaland",
    countyEn: "Rogaland",
    cityMatchId: "stavanger",
    hasResidentialTax: true,
    promilleHome: 1.0,
    promilleCabin: 1.0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 1,0 promille på bolig og fritidsbolig, 30 % reduksjonsfaktor og 0 kr i bunnfradrag.",
    noteEn: "2026 rate: 1.0‰ on homes and cabins, 30% statutory reduction, and no threshold.",
  },
  {
    id: "drammen",
    name: "Drammen",
    countyNo: "Buskerud",
    countyEn: "Buskerud",
    cityMatchId: "drammen",
    hasResidentialTax: false,
    promilleHome: 0,
    promilleCabin: 0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Drammen har ingen eiendomsskatt på vanlig bolig og fritidsbolig i 2026.",
    noteEn: "Drammen levies no residential or cabin property tax in 2026.",
  },
  {
    id: "kristiansand",
    name: "Kristiansand",
    countyNo: "Agder",
    countyEn: "Agder",
    cityMatchId: "kristiansand",
    hasResidentialTax: true,
    promilleHome: 1.96,
    promilleCabin: 1.96,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 1,96 promille på bolig og fritidsbolig etter 30 % reduksjon (0 kr bunnfradrag).",
    noteEn: "2026 rate: 1.96‰ on homes and cabins after 30% reduction (no threshold).",
  },
  {
    id: "tromso",
    name: "Tromsø",
    countyNo: "Troms",
    countyEn: "Troms",
    cityMatchId: "tromso",
    hasResidentialTax: true,
    promilleHome: 4.0,
    promilleCabin: 4.0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 4,0 promille på bolig og fritidsbolig etter 30 % reduksjon (kommunal takst, 0 kr bunnfradrag).",
    noteEn: "2026 rate: 4.0‰ on homes and cabins after 30% reduction (municipal assessment, no threshold).",
  },
  {
    id: "fredrikstad",
    name: "Fredrikstad",
    countyNo: "Østfold",
    countyEn: "Østfold",
    hasResidentialTax: true,
    promilleHome: 3.2,
    promilleCabin: 3.2,
    bunnfradragHome: 1_000_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 3,2 promille, 30 % reduksjon og 1 000 000 kr bunnfradrag per godkjente boenhet.",
    noteEn: "2026 rate: 3.2‰, 30% reduction, and 1,000,000 kr threshold per approved residential unit.",
  },
  {
    id: "sandnes",
    name: "Sandnes",
    countyNo: "Rogaland",
    countyEn: "Rogaland",
    hasResidentialTax: false,
    promilleHome: 0,
    promilleCabin: 0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Sandnes har ingen eiendomsskatt på vanlig bolig og fritidsbolig i 2026 (kun verk/kraftanlegg).",
    noteEn: "Sandnes levies no residential or cabin property tax in 2026 (only industrial/power facilities).",
  },
  {
    id: "sarpsborg",
    name: "Sarpsborg",
    countyNo: "Østfold",
    countyEn: "Østfold",
    hasResidentialTax: true,
    promilleHome: 3.6,
    promilleCabin: 3.6,
    bunnfradragHome: 300_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 3,6 promille, 30 % reduksjon og 300 000 kr bunnfradrag per boenhet.",
    noteEn: "2026 rate: 3.6‰, 30% reduction, and 300,000 kr home threshold.",
  },
  {
    id: "skien",
    name: "Skien",
    countyNo: "Telemark",
    countyEn: "Telemark",
    hasResidentialTax: true,
    promilleHome: 3.9,
    promilleCabin: 3.9,
    bunnfradragHome: 650_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 3,9 promille, 30 % reduksjon og 650 000 kr bunnfradrag per godkjent boenhet.",
    noteEn: "2026 rate: 3.9‰, 30% reduction, and 650,000 kr home threshold.",
  },
  {
    id: "alesund",
    name: "Ålesund",
    countyNo: "Møre og Romsdal",
    countyEn: "Møre og Romsdal",
    hasResidentialTax: true,
    promilleHome: 2.0,
    promilleCabin: 2.0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 2,0 promille etter 30 % reduksjon (Skatteetatens boligverdi, 0 kr bunnfradrag).",
    noteEn: "2026 rate: 2.0‰ after 30% reduction (Skatteetaten base, no threshold).",
  },
  {
    id: "sandefjord",
    name: "Sandefjord",
    countyNo: "Vestfold",
    countyEn: "Vestfold",
    hasResidentialTax: false,
    promilleHome: 0,
    promilleCabin: 0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Sandefjord har ingen eiendomsskatt på bolig og fritidsbolig i 2026.",
    noteEn: "Sandefjord levies no residential or cabin property tax in 2026.",
  },
  {
    id: "tonsberg",
    name: "Tønsberg",
    countyNo: "Vestfold",
    countyEn: "Vestfold",
    hasResidentialTax: false,
    promilleHome: 0,
    promilleCabin: 0,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Tønsberg har ingen eiendomsskatt på bolig og fritidsbolig i 2026.",
    noteEn: "Tønsberg levies no residential or cabin property tax in 2026.",
  },
  {
    id: "moss",
    name: "Moss",
    countyNo: "Østfold",
    countyEn: "Østfold",
    hasResidentialTax: true,
    promilleHome: 2.38,
    promilleCabin: 2.38,
    bunnfradragHome: 0,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 2,38 promille på bolig og fritidsbolig etter 30 % reduksjon (0 kr bunnfradrag).",
    noteEn: "2026 rate: 2.38‰ on homes and cabins after 30% reduction (no threshold).",
  },
  {
    id: "bodo",
    name: "Bodø",
    countyNo: "Nordland",
    countyEn: "Nordland",
    hasResidentialTax: true,
    promilleHome: 4.0,
    promilleCabin: 4.0,
    bunnfradragHome: 700_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 4,0 promille, 30 % reduksjonsfaktor og 700 000 kr bunnfradrag per selvstendig boenhet.",
    noteEn: "2026 rate: 4.0‰, 30% reduction, and 700,000 kr threshold per residential unit.",
  },
  {
    id: "hamar",
    name: "Hamar",
    countyNo: "Innlandet",
    countyEn: "Innlandet",
    hasResidentialTax: true,
    promilleHome: 4.0,
    promilleCabin: 4.0,
    bunnfradragHome: 260_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 4,0 promille, 30 % reduksjon og 260 000 kr bunnfradrag per boenhet (30 m²+).",
    noteEn: "2026 rate: 4.0‰, 30% reduction, and 260,000 kr threshold per unit (30 m²+).",
  },
  {
    id: "lillestrom",
    name: "Lillestrøm",
    countyNo: "Akershus",
    countyEn: "Akershus",
    hasResidentialTax: true,
    promilleHome: 1.5,
    promilleCabin: 1.5,
    bunnfradragHome: 4_000_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "2026-sats: 1,5 promille og 4,0 mill. kr bunnfradrag etter 30 % reduksjon — boliger under ca. 5,71 mill. kr betaler 0 kr (planlagt avviklet fra 2027).",
    noteEn: "2026 rate: 1.5‰ and 4.0M kr threshold after 30% reduction — homes under ~5.71M kr pay 0 kr (planned abolition from 2027).",
  },
];

export function getMunicipalityTax(id: string): MunicipalityTaxRule | undefined {
  return NORWAY_MUNICIPALITIES_TAX.find((m) => m.id === id);
}

export function calculatePropertyTax(
  rule: MunicipalityTaxRule,
  marketValue: number,
  kind: "home" | "cabin"
) {
  const reducedValue = Math.round(marketValue * (1 - rule.reductionFactor));
  const bunnfradrag = kind === "home" ? rule.bunnfradragHome : rule.bunnfradragCabin;
  const promille = kind === "home" ? rule.promilleHome : rule.promilleCabin;
  const taxableBase = Math.max(0, reducedValue - bunnfradrag);
  const annualTax = rule.hasResidentialTax ? Math.round((taxableBase * promille) / 1000) : 0;
  return {
    reducedValue,
    bunnfradrag,
    promille,
    taxableBase,
    annualTax,
    monthlyTax: Math.round(annualTax / 12),
    tenYearTax: annualTax * 10,
  };
}

// =========================================================================
// Solar Path Astronomical Math (Accurate for Norwegian Latitudes 58°–71° N)
// Includes Equation of Time & standard -0.833° astronomical refraction
// =========================================================================
export interface SolarDirectionOption {
  id: string;
  azimuth: number; // 0=N, 90=E, 180=S, 270=W
  shortNo: string;
  shortEn: string;
  labelNo: string;
  labelEn: string;
  eveningSunPremiumPct: number;
}

export const SOLAR_DIRECTIONS: SolarDirectionOption[] = [
  { id: "N", azimuth: 0, shortNo: "N", shortEn: "N", labelNo: "Nord", labelEn: "North", eveningSunPremiumPct: 0 },
  { id: "NE", azimuth: 45, shortNo: "NØ", shortEn: "NE", labelNo: "Nordøst (morgensol)", labelEn: "Northeast (morning)", eveningSunPremiumPct: 1 },
  { id: "E", azimuth: 90, shortNo: "Ø", shortEn: "E", labelNo: "Øst (formiddag)", labelEn: "East (morning)", eveningSunPremiumPct: 2 },
  { id: "SE", azimuth: 135, shortNo: "SØ", shortEn: "SE", labelNo: "Sørøst (dagsol)", labelEn: "Southeast (daytime)", eveningSunPremiumPct: 4 },
  { id: "S", azimuth: 180, shortNo: "S", shortEn: "S", labelNo: "Sør (heldagssol)", labelEn: "South (all-day)", eveningSunPremiumPct: 6 },
  { id: "SW", azimuth: 225, shortNo: "SV", shortEn: "SW", labelNo: "Sørvest (ettermiddag + kveld)", labelEn: "Southwest (afternoon + eve)", eveningSunPremiumPct: 8 },
  { id: "W", azimuth: 270, shortNo: "V", shortEn: "W", labelNo: "Vest (kveldssol)", labelEn: "West (evening sun)", eveningSunPremiumPct: 7 },
  { id: "NW", azimuth: 315, shortNo: "NV", shortEn: "NW", labelNo: "Nordvest (sen kveld)", labelEn: "Northwest (late evening)", eveningSunPremiumPct: 4 },
];

export interface HorizonOption {
  id: string;
  minElevationDeg: number;
  labelNo: string;
  labelEn: string;
  descNo: string;
  descEn: string;
}

export const HORIZON_OPTIONS: HorizonOption[] = [
  {
    id: "open",
    minElevationDeg: 3,
    labelNo: "Fri utsikt / Fjord / Høyde",
    labelEn: "Open View / Fjord / Hilltop",
    descNo: "Lite skygge fra naboer eller åser",
    descEn: "Minimal shading from neighbors or hills",
  },
  {
    id: "suburban",
    minElevationDeg: 10,
    labelNo: "Vanlig boligfelt / Villastrøk",
    labelEn: "Standard Residential Area",
    descNo: "Normal nabobebyggelse og trær",
    descEn: "Typical neighboring roofs and trees",
  },
  {
    id: "dense",
    minElevationDeg: 18,
    labelNo: "Tett by / Bakgård / Skråning",
    labelEn: "Dense Urban / Courtyard / Slope",
    descNo: "Høyere nabobygg eller bratt terreng",
    descEn: "Taller surrounding buildings or steep terrain",
  },
];

export interface SeasonSunResult {
  key: "spring" | "summer" | "autumn" | "winter";
  labelNo: string;
  labelEn: string;
  dateNo: string;
  dateEn: string;
  sunriseStr: string;
  sunsetStr: string;
  directStartStr: string;
  directEndStr: string;
  directHours: number;
  daylightHours: number;
  maxAltitudeDeg: number;
  midnightSun: boolean;
  polarNight: boolean;
}

function formatSolarHour(h: number): string {
  const normalized = ((h % 24) + 24) % 24;
  const hrs = Math.floor(normalized);
  const mins = Math.round((normalized - hrs) * 60);
  if (mins === 60) {
    return `${String((hrs + 1) % 24).padStart(2, "0")}:00`;
  }
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function angularDiffDeg(a: number, b: number): number {
  const diff = Math.abs((((a - b) % 360) + 540) % 360 - 180);
  return diff;
}

export function calculateSunProfile(
  lat: number,
  lng: number,
  terraceAzimuthDeg: number,
  minElevationDeg: number
): SeasonSunResult[] {
  const seasons: {
    key: SeasonSunResult["key"];
    labelNo: string;
    labelEn: string;
    dateNo: string;
    dateEn: string;
    declinationDeg: number;
    utcOffset: number;
    eotMin: number; // Equation of Time in minutes
  }[] = [
    { key: "spring", labelNo: "Vårjevndøgn", labelEn: "Spring Equinox", dateNo: "21. mars", dateEn: "March 21", declinationDeg: 0.3, utcOffset: 1, eotMin: -7.5 },
    { key: "summer", labelNo: "Sommersolverv", labelEn: "Summer Solstice", dateNo: "21. juni", dateEn: "June 21", declinationDeg: 23.44, utcOffset: 2, eotMin: -1.5 },
    { key: "autumn", labelNo: "Høstjevndøgn", labelEn: "Autumn Equinox", dateNo: "21. sept.", dateEn: "Sept 21", declinationDeg: 0.6, utcOffset: 2, eotMin: 7.0 },
    { key: "winter", labelNo: "Vintersolverv", labelEn: "Winter Solstice", dateNo: "21. des.", dateEn: "Dec 21", declinationDeg: -23.44, utcOffset: 1, eotMin: 2.0 },
  ];

  const latRad = (lat * Math.PI) / 180;
  // Standard meridian for CET (UTC+1) is 15°E; for CEST (UTC+2) is 30°E
  return seasons.map((s) => {
    const decRad = (s.declinationDeg * Math.PI) / 180;
    const stdMeridian = s.utcOffset * 15;
    const solarNoonLocal = 12 + (stdMeridian - lng) / 15 - s.eotMin / 60;

    let daylightSteps = 0;
    let directSteps = 0;
    let firstDaylight: number | null = null;
    let lastDaylight: number | null = null;
    let firstDirect: number | null = null;
    let lastDirect: number | null = null;
    let maxAlt = -90;

    // Sample every 10 minutes across 24 hours (144 steps)
    const stepMin = 10;
    const steps = (24 * 60) / stepMin;
    for (let i = 0; i < steps; i++) {
      const localHour = (i * stepMin) / 60;
      const hourAngleDeg = (localHour - solarNoonLocal) * 15;
      const haRad = (hourAngleDeg * Math.PI) / 180;

      const sinAlt =
        Math.sin(latRad) * Math.sin(decRad) +
        Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
      const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
      const altDeg = (altRad * 180) / Math.PI;
      if (altDeg > maxAlt) maxAlt = altDeg;

      // Standard astronomical sunrise/sunset threshold (-0.833° for refraction + solar disc radius)
      if (altDeg > -0.833) {
        daylightSteps++;
        if (firstDaylight === null) firstDaylight = localHour;
        lastDaylight = localHour;
      }

      if (altDeg >= minElevationDeg) {
        // Compute solar azimuth (0=N, 90=E, 180=S, 270=W)
        const cosAz =
          (Math.sin(decRad) - Math.sin(latRad) * sinAlt) /
          (Math.cos(latRad) * Math.cos(altRad) + 1e-9);
        let azDeg = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;
        if (Math.sin(haRad) > 0) azDeg = 360 - azDeg;

        // Direct terrace sunlight if sun is within ±80° of terrace facing direction
        if (angularDiffDeg(azDeg, terraceAzimuthDeg) <= 80) {
          directSteps++;
          if (firstDirect === null) firstDirect = localHour;
          lastDirect = localHour;
        }
      }
    }

    const daylightHours = Math.round((daylightSteps * stepMin) / 6) / 10;
    const directHours = Math.round((directSteps * stepMin) / 6) / 10;
    const midnightSun = daylightSteps >= steps - 1;
    const polarNight = daylightSteps === 0;

    return {
      key: s.key,
      labelNo: s.labelNo,
      labelEn: s.labelEn,
      dateNo: s.dateNo,
      dateEn: s.dateEn,
      sunriseStr: midnightSun
        ? "Midnattssol"
        : polarNight
        ? "Mørketid"
        : firstDaylight !== null
        ? formatSolarHour(firstDaylight)
        : "—",
      sunsetStr: midnightSun
        ? "24:00"
        : polarNight
        ? "—"
        : lastDaylight !== null
        ? formatSolarHour(lastDaylight)
        : "—",
      directStartStr: firstDirect !== null ? formatSolarHour(firstDirect) : "—",
      directEndStr: lastDirect !== null ? formatSolarHour(lastDirect) : "—",
      directHours,
      daylightHours,
      maxAltitudeDeg: Math.max(0, Math.round(maxAlt)),
      midnightSun,
      polarNight,
    };
  });
}

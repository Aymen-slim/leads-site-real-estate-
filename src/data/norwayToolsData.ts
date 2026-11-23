// Structured Norwegian real-estate datasets, tool catalog, FAQs & calculation engines.
// Sources referenced for benchmarks: SSB, Skatteetaten, Kartverket, Enova, municipal tax lists (2026).

export type ToolCategory = "sale-tax" | "value-land" | "buy-move" | "cabin-energy";

export interface ToolFaqItem {
  qNo: string;
  aNo: string;
  qEn: string;
  aEn: string;
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
      "Sammenlign gjennomsnittlig salgspris per m² for boligen din med andre boliger i nærområdet",
    descEn:
      "Compare average selling price per m² for detached homes and constructible land across Norwegian neighborhoods.",
    controlHintNo: "Velg by og bydel fra to store menyer",
    controlHintEn: "Select City and Neighborhood from two large menus",
    sampleMetricNo: "108 200 kr / m²",
    sampleMetricEn: "108 200 kr / m²",
    seoTitleNo: "Pris per m² i ditt nabolag (2026) — Bolig- og tomtepriser i Norge | VurderBoligen",
    seoDescNo:
      "Sjekk oppdatert kvadratmeterpris for enebolig og byggetomt i Oslo, Bærum, Bergen, Stavanger, Trondheim, Drammen, Kristiansand og Tromsø.",
    seoKeywordsNo: [
      "pris per m2",
      "kvadratmeterpris bolig",
      "boligpris kalkulator",
      "tomtepris per kvadratmeter",
      "hva er boligen min verdt",
    ],
    guideHeadingNo: "Slik leser du kvadratmeterpris i ditt område",
    guideBodyNo:
      "Kvadratmeterprisen (kr/m²) viser snittet for tinglyste salg i bydelen, men enkeltboliger varierer ofte 15–25 % basert på solforhold, standard, hjørnetomt, utsikt og teknisk tilstand (TG-grader). Bruk tallene som et startpunkt før du ber om lokal E-takst.",
    guideHeadingEn: "How to interpret neighborhood price per m²",
    guideBodyEn:
      "Local price per m² reflects average registered transactions in your district, while individual homes frequently sell 15–25% higher or lower depending on sun exposure, renovations, corner plots, and technical inspection grades (TG). Use this as a baseline before requesting a local valuation.",
    dataSourceNo: "Basert på SSB boligprisstatistikk og tinglyste salg i norske bydeler.",
    dataSourceEn: "Based on SSB housing indices and registered sales across Norwegian districts.",
    faqs: [
      {
        qNo: "Hvorfor er m²-prisen for enebolig høyere enn for råtomt?",
        aNo: "En ferdig enebolig inkluderer både tomteverdi, byggekostnad (ofte 38 000–55 000 kr/m²), opparbeidet infrastruktur og kommunale tilkoblingsavgifter.",
        qEn: "Why is house price per m² higher than raw land?",
        aEn: "A finished detached home includes land value, construction costs (typically 38,000–55,000 kr/m²), site works, and municipal utility hookups.",
      },
      {
        qNo: "Kan en bolig med god tomt selges høyere enn bydelssnittet?",
        aNo: "Ja. Solrike hjørnetomter, fjordutsikt, oppgradert kjøkken/bad og utleiedel gir ofte 15–25 % høyere kvadratmeterpris enn gjennomsnittet.",
        qEn: "Can my property sell above the district average?",
        aEn: "Yes. Sunny corner plots, views, upgraded wet rooms, or a tax-free rental unit frequently achieve 15–25% above the district average.",
      },
      {
        qNo: "Hvordan får jeg en eksakt E-takst på min adresse?",
        aNo: "En lokal eiendomsmegler befaler eiendommen og sammenligner med nylige salg i samme gate. Du kan bestille en gratis og uforpliktende vurdering direkte her.",
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
      "Se nøyaktig hvor mye penger som faktisk blir igjen på konto etter meglergebyr, tinglysing, eventuell skatt og innfrielse av lån.",
    descEn:
      "See exactly how much money stays in your bank account after broker fees, deed clearance, tax, and mortgage payoff.",
    controlHintNo: "Dra én stor skyveknapp til forventet salgspris",
    controlHintEn: "Slide one bar to your expected selling price",
    sampleMetricNo: "5 113 450 kr",
    sampleMetricEn: "5 113 450 kr",
    seoTitleNo: "Netto utbetalt ved boligsalg — Kalkulator etter megler, lån og skatt | VurderBoligen",
    seoDescNo:
      "Regn ut nøyaktig hvor mye egenkapital du sitter igjen med på konto etter boligsalg i Norge, inkludert meglerhonorar, innfrielse av lån og eventuell gevinstskatt.",
    seoKeywordsNo: [
      "netto utbetalt boligsalg",
      "kalkulator selge bolig",
      "hvor mye sitter jeg igjen med ved boligsalg",
      "egenkapital etter salg",
    ],
    guideHeadingNo: "Hva trekkes fra før pengene kommer på konto?",
    guideBodyNo:
      "Når oppgjørsavdelingen gjennomfører boligoppgjøret i Norge, innfris først eventuelle pantelån i banken. Deretter trekkes avtalt meglerhonorar, tilrettelegging, annonsering, tilstandsrapport og tinglysingsgebyrer. Restbeløpet utbetales direkte til din konto — som regel skattefritt dersom du oppfyller bo- og eiertid.",
    guideHeadingEn: "What is deducted before sale proceeds reach your bank?",
    guideBodyEn:
      "During Norwegian property settlement (oppgjør), existing mortgages registered on the deed are paid off first, followed by brokerage fees, technical inspection, marketing, and municipal clearance fees. The net balance is transferred directly to your account.",
    dataSourceNo: "Norske standardkostnader for oppgjør, meglerhonorar og Skatteetatens 22 %-sats.",
    dataSourceEn: "Norwegian settlement fee benchmarks and Skatteetaten 22% capital gains rate.",
    faqs: [
      {
        qNo: "Betaler selger dokumentavgift ved salg i Norge?",
        aNo: "Nei. Dokumentavgiften på 2,5 % betales alltid av kjøper ved kjøp av selveierbolig eller tomt — ikke av selger.",
        qEn: "Does the seller pay the 2.5% stamp duty in Norway?",
        aEn: "No. The 2.5% document fee (dokumentavgift) is always paid by the buyer on freehold properties, never the seller.",
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
    shortTitleNo: "Tomtedeling (R+2/R+3)",
    shortTitleEn: "Land Buildability",
    titleNo: "Kalkulator for tomtedeling og utbyggingspotensial",
    titleEn: "Land Buildability & Division Estimator",
    descNo:
      "Finn ut om tomten din kan deles i flere enheter eller bygges ut for høyere pris",
    descEn:
      "Check if your plot can be subdivided into multiple parcels or developed as R+2, R+3, or mixed-use.",
    controlHintNo: "Velg tomtestørrelse og sone (R+2, R+3, næring)",
    controlHintEn: "Select land size and zone (R+2, R+3, commercial)",
    sampleMetricNo: "+38% – +75%",
    sampleMetricEn: "+38% – +75%",
    seoTitleNo: "Tomtedeling og utbyggingspotensial kalkulator (BYA / BRA) | VurderBoligen",
    seoDescNo:
      "Beregn hvor mange tomter eiendommen din kan deles i, maksimal utbyggbar BRA og forventet tomteverdi ved salg til utbygger i Norge.",
    seoKeywordsNo: [
      "tomtedeling kalkulator",
      "selge tomt til utbygger",
      "utbyggingspotensial tomt",
      "fradele tomt verdi",
    ],
    guideHeadingNo: "Hvorfor betaler utbyggere mer for store tomter?",
    guideBodyNo:
      "En eldre enebolig på stor tomt (over 800–1 000 m²) kan ofte være mer verdt som utbyggingstomt enn som ren bolig. Regulering, utnyttelsesgrad (%-BYA / BRA) og antall tillatte boenheter avgjør hvor mye profesjonelle utbyggere er villige til å by.",
    guideHeadingEn: "Why developers pay a premium for larger plots",
    guideBodyEn:
      "An older house sitting on a large plot (over 800–1,000 m²) is often worth significantly more as development land than as a single residence. Zoning density (BYA/BRA) and permitted unit count determine developer pricing.",
    dataSourceNo: "Basert på norske kommunale småhusplaner og utbyggerpriser per m² tomt.",
    dataSourceEn: "Based on Norwegian municipal zoning benchmarks and developer land valuations.",
    faqs: [
      {
        qNo: "Hvor stor må en tomt være for å kunne fradeles i Norge?",
        aNo: "Mange kommuner opererer med 600–800 m² per eneboligtomt (eller mindre for tomannsbolig/rekkehus), men lokale reguleringsplaner og småhusplanen styrer eksakte krav.",
        qEn: "How large must a plot be to subdivide in Norway?",
        aEn: "Many municipalities require 600–800 m² per detached plot (less for duplexes/townhouses), subject to local zoning plans.",
      },
      {
        qNo: "Er salg av fradelt tomt skattepliktig?",
        aNo: "Ja, salg av ubebygd tomt utløser som hovedregel 22 % gevinstskatt. Ofte kan det lønne seg å sammenligne nettopris ved tomtesalg mot skattefritt salg av hele boligeiendommen.",
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
      "Beregn netto utbetaling per arving eller søsken etter skifteoppgjør, takst og salgsomkostninger.",
    descEn:
      "Calculate each sibling or heir's exact cash payout from an inherited home after settlement fees.",
    controlHintNo: "Velg boligverdi og antall arvinger",
    controlHintEn: "Select estimated value and number of heirs",
    sampleMetricNo: "2 450 000 kr / arving",
    sampleMetricEn: "2 450 000 kr / heir",
    seoTitleNo: "Arvet bolig kalkulator — Beregn arveoppgjør og utbetaling per arving | VurderBoligen",
    seoDescNo:
      "Regn ut eksakt utbetaling per søsken ved salg av arvet bolig i Norge. Se regler for arveavgift (0 kr), inngangsverdi og gevinstskatt ved arvesalg.",
    seoKeywordsNo: [
      "selge arvet bolig kalkulator",
      "arveoppgjør bolig kalkulator",
      "fordeling av arv bolig søsken",
      "skatt ved salg av arvet bolig",
    ],
    guideHeadingNo: "Skatteregler når søsken selger arvet bolig i Norge",
    guideBodyNo:
      "Norge har 0 kr i arveavgift. Dersom avdøde oppfylte bo- og eiertid (bodd i boligen minst 12 av de siste 24 månedene før dødsfallet), settes arvingenes inngangsverdi til markedsverdien på dødsfallstidspunktet — slik at selve arvesalget normalt blir helt skattefritt.",
    guideHeadingEn: "Tax rules when heirs sell an inherited home in Norway",
    guideBodyEn:
      "Norway has 0% inheritance tax. If the deceased met the residency rule (lived in the home 12 of the last 24 months), the heirs' tax basis steps up to market value at death — making an immediate sale normally tax-free.",
    dataSourceNo: "I tråd med norsk arvelov og Skatteetatens regler for kontinuitet og inngangsverdi.",
    dataSourceEn: "Aligned with Norwegian inheritance law and Skatteetaten step-up basis rules.",
    faqs: [
      {
        qNo: "Må vi betale arveavgift når vi selger foreldrehjemmet?",
        aNo: "Nei, arveavgiften ble fjernet i 2014. Det eneste som kan utløse skatt er verdistigning etter dødsfallet (eller hvis avdøde ikke selv kunne solgt skattefritt).",
        qEn: "Do we pay inheritance tax when selling our parents' house?",
        aEn: "No, inheritance tax was abolished in Norway in 2014. Tax only applies if the property rises significantly in value after inheritance or if the deceased did not qualify for tax-free sale.",
      },
      {
        qNo: "Hva hvis ett søsken ønsker å overta boligen alene?",
        aNo: "Da innhentes en nøytral verdivurdering (E-takst) som alle søsken godkjenner, og den som overtar løser ut de øvrige arvingene. Bruk også vår utkjøpskalkulator for samboer/medeiende.",
        qEn: "What if one sibling wants to buy out the others?",
        aEn: "Obtain a neutral E-takst valuation agreed upon by all heirs, then the buying sibling pays out the remaining shares.",
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
      "Sammenlign håndverkerkostnader og byggetid mot å selge boligen i nåværende tilstand uten oppussingsrisiko.",
    descEn:
      "Compare contractor costs and renovation timelines against selling your property in current condition.",
    controlHintNo: "Trykk på det som trenger arbeid (maling, kjøkken, tak)",
    controlHintEn: "Tap what needs work (paint, kitchen, old roof)",
    sampleMetricNo: "0 kr utlegg",
    sampleMetricEn: "0 kr outlay",
    seoTitleNo: "Pusse opp før salg eller selge som den er? Kalkulator | VurderBoligen",
    seoDescNo:
      "Lønner det seg å pusse opp bad, kjøkken eller tak før boligsalg i Norge? Regn ut håndverkerkostnad mot prisøkning og se hva som gir mest netto på konto.",
    seoKeywordsNo: [
      "pusse opp før salg kalkulator",
      "lønner det seg å pusse opp før salg",
      "selge oppussingsobjekt",
      "selge bolig med tg3 bad",
    ],
    guideHeadingNo: "Når lønner oppussing seg før salg — og når taper du penger?",
    guideBodyNo:
      "Enkel kosmetisk oppfriskning som maling, sparkling og rydding gir ofte positiv avkastning. Dyre totalprosjekter som nytt bad (TG3), nytt kjøkken eller nytt tak koster derimot ofte mer hos håndverkere enn kjøpere er villige til å betale ekstra i budrunden — fordi kjøpere vil velge stil selv.",
    guideHeadingEn: "When pre-sale renovations pay off — and when they lose money",
    guideBodyEn:
      "Light cosmetic refreshes like painting and decluttering frequently pay back. Major contractor works such as full wet-room rebuilds (TG3), kitchens, or roofs typically cost more than buyers add in bidding because buyers prefer choosing their own finishes.",
    dataSourceNo: "Norske gjennomsnittspriser fra håndverkere (2026) og meglererfaringer.",
    dataSourceEn: "Norwegian contractor cost benchmarks (2026) and broker resale return estimates.",
    faqs: [
      {
        qNo: "Bør jeg pusse opp et bad med TG3 før jeg selger?",
        aNo: "Som regel nei. Et totalrenovert bad etter TEK17 koster gjerne 380 000–500 000 kr, mens prisøkningen i budrunden ofte bare er 250 000–320 000 kr.",
        qEn: "Should I renovate a TG3 bathroom before selling?",
        aEn: "Usually no. A full TEK17 wet-room rebuild costs 380,000–500,000 kr, while buyers rarely bid up more than 250,000–320,000 kr above as-is value.",
      },
      {
        qNo: "Kan man fortsatt selge «som den er» etter ny avhendingslov?",
        aNo: "Generelle «som den er»-forbehold gjelder ikke lenger mot forbrukere, men du kan helt lovlig selge en eldre bolig i nåværende tilstand så lenge alle avvik dokumenteres tydelig i en godkjent tilstandsrapport.",
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
      "Sjekk om boligen eller hytta kan selges 100 % skattefritt og beregn eksakt gevinstskatt.",
    descEn:
      "Check Norway's 12-of-24-month home rule or 5-of-8-year cabin rule and compute exact 22% capital gains tax after deductions.",
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
    dataSourceNo: "Basert på Skatteloven § 9-3 og Skatteetatens gjeldende 22 %-sats (2026).",
    dataSourceEn: "Based on Norwegian Tax Act § 9-3 and Skatteetaten's 22% rate (2026).",
    faqs: [
      {
        qNo: "Hvilke kostnader kan trekkes fra i gevinstberegningen?",
        aNo: "Du kan trekke fra opprinnelig kjøpesum, dokumentavgift og tinglysing fra kjøpet, dokumenterte påkostninger (standardheving, tilbygg), samt alle megler- og salgsomkostninger.",
        qEn: "Which expenses are deductible from capital gains?",
        aEn: "You can deduct original purchase price, original stamp duty and deed fees, documented capital improvements (påkostninger), and all brokerage and selling expenses.",
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
      "Finn ut hva det koster å kjøpe ut partneren. Regn ut utkjøpssum, lånebehov og inntektskrav.",
    descEn:
      "Calculate exact buyout payout, required mortgage, and Norway's 5× income rule when one partner keeps the home — or compare against selling together.",
    controlHintNo: "Velg eierbrøk og juster boligverdi, lån og egenkapital",
    controlHintEn: "Tap ownership split & slide home value, loan, and equity",
    sampleMetricNo: "1 750 000 kr utkjøp",
    sampleMetricEn: "1 750 000 kr buyout",
    seoTitleNo: "Kjøpe ut samboer kalkulator (2026) — Beregn utkjøpssum og boliglån | VurderBoligen",
    seoDescNo:
      "Skal du kjøpe ut samboer eller ektefelle fra felles bolig? Beregn riktig utkjøpssum, nytt lån, dokumentavgift og inntektskrav på sekunder.",
    seoKeywordsNo: [
      "kjøpe ut samboer kalkulator",
      "utkjøp bolig kalkulator",
      "skilsmisse fordeling bolig kalkulator",
      "beregne utkjøp av bolig",
      "dokumentavgift ved utkjøp samboer",
    ],
    guideHeadingNo: "Slik regner du ut rettferdig utkjøp av felles bolig",
    guideBodyNo:
      "Ved samlivsbrudd starter alltid oppgjøret med en nøytral verdivurdering (E-takst) som begge parter er enige om. Nettomassen (markedsverdi minus felles gjeld og eventuell dokumentert særskilt egenkapital) deles etter eierbrøken. Merk at samboere som har bodd sammen under 2 år (uten felles barn) må betale 2,5 % dokumentavgift på den andelen som overføres — ektefeller og samboere med 2+ år / felles barn slipper.",
    guideHeadingEn: "How to calculate a fair home buyout in Norway",
    guideBodyEn:
      "A fair separation buyout always begins with a neutral E-takst market valuation agreed by both parties. Net equity (market value minus shared mortgage and any documented separate down-payment) is divided by ownership share. Note Norway's 2.5% stamp duty exemption applies to married couples and cohabitants who lived together 2+ years or share children.",
    dataSourceNo: "I tråd med Utlånsforskriften (5× bruttoinntekt) og Kartverkets dokumentavgiftsregler.",
    dataSourceEn: "Aligned with Norwegian Lending Regulations (5× income cap) and Kartverket deed rules.",
    faqs: [
      {
        qNo: "Må man betale dokumentavgift når man kjøper ut samboer?",
        aNo: "Ektefeller ved skilsmisse slipper dokumentavgift. Samboere slipper også dersom dere har hatt felles folkeregistrert adresse i minst 2 år eller har/venter felles barn. Ellers påløper 2,5 % på den overførte andelen.",
        qEn: "Do I pay 2.5% stamp duty when buying out my partner?",
        aEn: "Married spouses are exempt. Cohabitants are also exempt if they shared a registered address for at least 2 years or have/expect children together. Otherwise 2.5% applies to the transferred share.",
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
      "Beregn totalpris på eiendomsmegler (provisjon, tilstandsrapport, boligselgerforsikring, foto, og andre kostnader)",
    descEn:
      "Estimate full Norwegian brokerage costs (commission, technical report, seller insurance, photo/FINN) and compare against selling DIY.",
    controlHintNo: "Velg boligtype, salgspris og provisjon (1 % – 3 %)",
    controlHintEn: "Pick property type, sale price & commission slider (1%–3%)",
    sampleMetricNo: "112 900 kr totalt",
    sampleMetricEn: "112 900 kr total",
    seoTitleNo: "Hva koster eiendomsmegler? Meglerprovisjon & selge selv kalkulator (2026) | VurderBoligen",
    seoDescNo:
      "Regn ut eksakt meglerkostnad, provisjon, boligselgerforsikring og tilstandsrapport i Norge. Sammenlign netto utbetalt med megler mot å selge boligen selv.",
    seoKeywordsNo: [
      "hva koster eiendomsmegler kalkulator",
      "meglerprovisjon kalkulator",
      "selge bolig selv vs megler",
      "boligselgerforsikring pris kalkulator",
      "kostnader ved salg av bolig",
    ],
    guideHeadingNo: "Hva inngår i en komplett norsk meglerpakke?",
    guideBodyNo:
      "Totalprisen ved boligsalg består av selve meglerprovisjonen (typisk 1,2 % – 2,5 % eller fastpris), tilretteleggingsgebyr, markedspakke (FINN-annonse, fotograf, prospekt), tilstandsrapport fra takstmann (10 000–20 000 kr), oppgjørshonorar og valgfri boligselgerforsikring (ca. 3,1–5,6 promille av salgssummen).",
    guideHeadingEn: "What is included in a complete Norwegian brokerage package?",
    guideBodyEn:
      "Total selling costs combine broker commission (typically 1.2%–2.5% or fixed fee), onboarding fee, marketing package (FINN listing, photography, brochure), mandatory technical report (10,000–20,000 kr), settlement fee, and optional seller liability insurance (boligselgerforsikring).",
    dataSourceNo: "Gjennomsnittlige prislister fra norske meglerkjeder og forsikringsselskaper (2026).",
    dataSourceEn: "Average 2026 Norwegian brokerage fee schedules and seller insurance rates.",
    faqs: [
      {
        qNo: "Hva er vanlig meglerprovisjon i Norge?",
        aNo: "De fleste eiendomsmeglere tar mellom 1,25 % og 2,5 % av salgssummen i provisjon, eller en fastpris på 45 000–65 000 kr. På dyrere boliger lønner det seg alltid å sammenligne tilbud fra 2–3 lokale meglere.",
        qEn: "What is typical real estate broker commission in Norway?",
        aEn: "Most brokers charge 1.25%–2.5% of the final sale price or a 45,000–65,000 kr fixed fee. Comparing 2–3 local agencies typically saves 15,000–40,000 kr or improves sale price.",
      },
      {
        qNo: "Hva koster boligselgerforsikring?",
        aNo: "Boligselgerforsikring koster typisk ca. 0,31 % (3,1 promille) for borettslagsleilighet, ca. 0,39 % for selveierleilighet og ca. 0,55 % for enebolig/rekkehus.",
        qEn: "How much does seller insurance (boligselgerforsikring) cost?",
        aEn: "Rates are typically around 0.31% for co-op apartments (borettslag), 0.39% for freehold apartments, and 0.55% for detached/terraced houses.",
      },
      {
        qNo: "Lønner det seg å selge bolig selv eller med megler?",
        aNo: "Å selge selv sparer 50 000–85 000 kr i honorar, men på en bolig til 6 mill. kr trenger en dyktig lokal megler kun å hente 1,5 % mer i budrunden (90 000 kr) for at megleren skal betale seg selv — samtidig som du slipper juridisk stress.",
        qEn: "Is it better to sell DIY or hire a broker?",
        aEn: "DIY saves 50,000–85,000 kr in fees, but on a 6M kr home a strong local broker only needs a 1.5% higher bidding outcome (+90,000 kr) to pay for themselves while handling legal liability and negotiations.",
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
      "Beregn månedlig rentekostnad (før og etter skattefradrag) ved kjøp før salg, og sjekk bankens 10–15 % prisfall-sikring.",
    descEn:
      "Calculate monthly interest-only bridge financing costs after tax relief, plus Norwegian banks' 10–15% valuation buffer.",
    controlHintNo: "Juster nåværende bolig, ny bolig og overlapp (1–6 mnd.)",
    controlHintEn: "Slide current home, new home & overlap months (1–6 mo)",
    sampleMetricNo: "17 400 kr / mnd",
    sampleMetricEn: "17 400 kr / mo",
    seoTitleNo: "Mellomfinansiering kalkulator (2026) — Kjøpe eller selge først? | VurderBoligen",
    seoDescNo:
      "Regn ut hva mellomfinansiering koster per måned etter 22 % rentefradrag i Norge. Se om du bør kjøpe ny bolig først eller selge nåværende bolig først.",
    seoKeywordsNo: [
      "mellomfinansiering kalkulator",
      "hva koster mellomfinansiering",
      "kjøpe eller selge først",
      "kjøpe ny bolig før man har solgt",
    ],
    guideHeadingNo: "Kjøpe først eller selge først — slik regner banken",
    guideBodyNo:
      "Når du kjøper ny bolig før den gamle er solgt, gir banken mellomfinansiering på egenkapitalen som er bundet opp (normalt inntil 6 måneder, avdragsfritt med noe høyere rente enn vanlig boliglån). Banken trekker vanligvis 10–15 % sikkerhetsmargin fra antatt salgspris på boligen du skal selge. Du får 22 % skattefradrag på alle betalte gjeldsrenter.",
    guideHeadingEn: "Buy first vs. sell first — how Norwegian banks evaluate risk",
    guideBodyEn:
      "When buying before selling, banks grant an interest-only bridge loan (mellomfinansiering) for up to 6 months covering trapped equity, while stress-testing your unsold home with a 10–15% price drop buffer. Interest paid qualifies for Norway's 22% tax deduction.",
    dataSourceNo: "Basert på norske bankers mellomfinansieringsvilkår og 22 % rentefradrag (2026).",
    dataSourceEn: "Based on standard Norwegian bridge-loan terms and 22% interest tax relief (2026).",
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
    sampleMetricNo: "3,4 % netto yield",
    sampleMetricEn: "3.4% net yield",
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
      "Flytter du ut og leier ut en tidligere primærbolig i mer enn 12 måneder, mister du retten til skattefritt salg — og må betale 22 % skatt på hele den historiske gevinsten siden du opprinnelig kjøpte boligen! I tillegg øker formuesverdien fra 25 % (primærbolig) til 100 % (sekundærbolig). Regn alltid på begge alternativene før du bestemmer deg.",
    guideHeadingEn: "The 12-month residency trap many Norwegian owners overlook",
    guideBodyEn:
      "If you move out and rent your former primary residence for more than 12 months, you lose Norway's tax-free sale exemption and owe 22% tax on the ENTIRE historical gain since original purchase — while wealth-tax valuation jumps from 25% to 100%. Always compare both options first.",
    dataSourceNo: "Basert på 22 % utleieskatt, 100 % sekundærbolig-formuesverdi og normal utleiedrift.",
    dataSourceEn: "Based on 22% net rental tax, 100% secondary-home wealth valuation, and standard operating reserves.",
    faqs: [
      {
        qNo: "Hvor lenge kan jeg leie ut boligen min og likevel selge skattefritt?",
        aNo: "Hvis du har bodd i boligen i minst 12 måneder i strekk, kan du leie den ut i inntil nesten 12 måneder og fortsatt oppfylle kravet om 12 av de siste 24 månedene når budet aksepteres.",
        qEn: "How long can I rent out my home and still sell tax-free?",
        aEn: "If you lived there 12+ consecutive months, you can rent it out for up to just under 12 months and still satisfy the 12-of-24-month rule when accepting a buyer's bid.",
      },
      {
        qNo: "Hvordan beskattes leieinntekter når jeg ikke bor i boligen selv?",
        aNo: "Netto leieinntekt (brutto leie minus felleskostnader, kommunale avgifter, forsikring og vedlikehold) beskattes med 22 %.",
        qEn: "How is rental income taxed when you don't live in the home?",
        aEn: "Net rental profit (gross rent minus HOA, municipal fees, insurance, and maintenance) is taxed at 22%.",
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
      "Sjekk ut nøyaktig hvor mye eiendomsskatt med kommunens bunnfradrag, reduksjonsfaktor og promillesats.",
    descEn:
      "Select from 20 major Norwegian municipalities to compute annual property tax using local exemption thresholds, statutory reduction, and promille rates.",
    controlHintNo: "Velg kommune, boligtype og dra markedsverdi",
    controlHintEn: "Pick municipality, property type & slide market value",
    sampleMetricNo: "4 230 kr / år",
    sampleMetricEn: "4 230 kr / yr",
    seoTitleNo: "Eiendomsskatt kalkulator (2026) — Beregn eiendomsskatt i Oslo, Bergen, Trondheim m.fl. | VurderBoligen",
    seoDescNo:
      "Gratis nasjonal eiendomsskatt-kalkulator for norske kommuner. Se bunnfradrag, promillesats, 30 % obligatorisk reduksjonsfaktor og eksakt årlig skatt for bolig og hytte.",
    seoKeywordsNo: [
      "eiendomsskatt kalkulator",
      "eiendomsskatt oslo kalkulator",
      "eiendomsskatt bergen",
      "eiendomsskatt trondheim",
      "beregn eiendomsskatt bolig",
    ],
    guideHeadingNo: "Slik beregnes eiendomsskatt i norske kommuner",
    guideBodyNo:
      "Alle norske kommuner som krever inn eiendomsskatt på bolig og fritidsbolig må gi minst 30 % obligatorisk reduksjonsfaktor på markedsverdien (skattegrunnlaget blir maks 70 % av boligverdien). Deretter trekkes kommunens eventuelle bunnfradrag fra, før den kommunale promillesatsen (maks 4 promille for bolig) multipliseres på restbeløpet.",
    guideHeadingEn: "How municipal property tax is calculated in Norway",
    guideBodyEn:
      "Norwegian municipalities levying residential property tax must apply at least a 30% statutory reduction (tax base max 70% of market value), then deduct any municipal threshold (bunnfradrag), before applying the local promille rate (capped at 4‰ for homes).",
    dataSourceNo: "Basert på Eigedomsskattelova og kommunale 2026-satser (promille og bunnfradrag).",
    dataSourceEn: "Based on the Norwegian Property Tax Act and 2026 municipal rates & thresholds.",
    faqs: [
      {
        qNo: "Hvilke kommuner har 0 kr i eiendomsskatt på bolig?",
        aNo: "Blant de største kommunene har blant annet Bærum, Asker, Sandefjord og Tønsberg ikke eiendomsskatt på vanlige boliger, mens Oslo har et høyt bunnfradrag (4,7 mill. kr) som gjør at mange mindre boliger betaler 0 kr.",
        qEn: "Which large Norwegian municipalities have zero residential property tax?",
        aEn: "Bærum, Asker, Sandefjord, and Tønsberg levy 0‰ on residences, while Oslo applies a high 4.7M kr threshold so many homes below ~6.7M kr pay 0 kr.",
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
      "Beregn nøyaktig dokumentavgift, tinglysingsgebyrer og totale omkostninger ved kjøp — sammenlign selveier mot borettslag og nybygg.",
    descEn:
      "Calculate exact 2.5% Norwegian stamp duty, deed registration fees, and total buying costs comparing freehold, co-op (borettslag), and new-builds.",
    controlHintNo: "Velg eierform (selveier / borettslag / nybygg) og kjøpesum",
    controlHintEn: "Tap ownership type (freehold / co-op / new-build) & slide price",
    sampleMetricNo: "151 000 kr avgift",
    sampleMetricEn: "151 000 kr fees",
    seoTitleNo: "Dokumentavgift kalkulator (2026) — Beregn 2,5 % avgift og omkostninger | VurderBoligen",
    seoDescNo:
      "Regn ut eksakt dokumentavgift (2,5 %) og tinglysingsgebyrer ved kjøp av selveierbolig, nybygg eller tomt i Norge. Sammenlign direkte mot borettslag (0 kr).",
    seoKeywordsNo: [
      "dokumentavgift kalkulator",
      "omkostninger kjøp av bolig kalkulator",
      "selveier vs borettslag kostnader",
      "tinglysingsgebyr skjøte",
    ],
    guideHeadingNo: "Slik sparer du på dokumentavgift ved boligbytte",
    guideBodyNo:
      "Ved kjøp av brukt selveierbolig betaler kjøper 2,5 % dokumentavgift til staten på hele kjøpesummen. Kjøper du derimot en borettslagsleilighet er dokumentavgiften 0 kr — og ved kjøp av helt ny bolig under oppføring beregnes 2,5 % kun på tomteverdien, ikke bygningsmassen.",
    guideHeadingEn: "How stamp duty differs across Norwegian property types",
    guideBodyEn:
      "Resale freehold homes carry a 2.5% state document fee on the full purchase price. Co-op homes (borettslag) carry 0 kr stamp duty, and newly constructed homes only charge 2.5% on the underlying land share.",
    dataSourceNo: "Kartverkets 2026-satser: 2,5 % dokumentavgift og 500 kr per tinglysing.",
    dataSourceEn: "Kartverket 2026 statutory rates: 2.5% document fee and 500 kr per deed/mortgage filing.",
    faqs: [
      {
        qNo: "Hvor mye er tinglysingsgebyret hos Kartverket?",
        aNo: "Elektronisk tinglysing av skjøte og pantedokument koster 500 kr per dokument (totalt 1 000 kr for kjøper med boliglån), pluss ev. eierskiftegebyr til forretningsfører.",
        qEn: "How much are Kartverket registration fees?",
        aEn: "Electronic registration of the deed and mortgage costs 500 kr per filing (1,000 kr total for a mortgaged buyer), plus any HOA transfer fee.",
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
      "Regn ut hva hytta faktisk koster deg per døgn — og sjekk om du kan selge fritidsboligen helt skattefritt",
    descEn:
      "See your cabin's true annual cost and exact cost per night used (loan, power, lease, tax, upkeep) plus Norway's 5-of-8-year tax-free sale check.",
    controlHintNo: "Velg hytteverdi, antall bruksdøgn i året og 5/8-års brukstid",
    controlHintEn: "Slide cabin value, tap nights used per year & 5/8-yr rule",
    sampleMetricNo: "4 850 kr / døgn",
    sampleMetricEn: "4 850 kr / night",
    seoTitleNo: "Hyttekostnad kalkulator (2026) — Hva koster hytta per døgn og skatt ved salg? | VurderBoligen",
    seoDescNo:
      "Regn ut hva det faktisk koster å eie hytte i Norge per år og per overnatting. Sjekk også om hyttesalget er skattefritt (5 av 8 år) og hvor mye du frigjør ved salg.",
    seoKeywordsNo: [
      "hyttekostnad kalkulator",
      "hva koster det å eie hytte",
      "skatt ved salg av hytte",
      "selge hytte kalkulator",
    ],
    guideHeadingNo: "Hva koster egentlig en norsk hytte per bruksdøgn?",
    guideBodyNo:
      "Mange hytteeiere blir overrasket når rentekostnad, strøm/nettleie, kommunale avgifter, brøyting, festeavgift, forsikring, eiendomsskatt og vedlikehold summeres og deles på 20–35 faktiske overnattinger i året. Har du brukt hytta som egen fritidsbolig i minst 5 av de siste 8 årene, kan den selges 100 % skattefritt.",
    guideHeadingEn: "What does a Norwegian cabin really cost per night used?",
    guideBodyEn:
      "Many cabin owners are surprised when mortgage interest, electricity, municipal fees, snow plowing, ground lease, insurance, property tax, and maintenance are divided by 20–35 actual nights per year. If personally used 5 of the last 8 years, the cabin sells 100% tax-free.",
    dataSourceNo: "Norske gjennomsnittskostnader for fritidsbolig og Skatteloven § 9-3 (5 av 8 år).",
    dataSourceEn: "Norwegian cabin operating averages and Tax Act § 9-3 (5-of-8-year rule).",
    faqs: [
      {
        qNo: "Når er salg av hytte eller fritidsbolig skattefritt?",
        aNo: "Du må ha eid fritidsboligen i mer enn 5 år og brukt den som egen fritidsbolig i minst 5 av de siste 8 årene før salget avtales.",
        qEn: "When is selling a cabin tax-free in Norway?",
        aEn: "You must have owned the cabin for more than 5 years and personally used it as your own leisure property in at least 5 of the last 8 years.",
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
      "Estimer boligens energikarakter (A–G), årlig strømforbruk og om en rask oppgradering lønner seg",
    descEn:
      "Estimate your home's A–G energy label, yearly electricity bill, and whether pre-sale upgrades pay off before mandatory sale certification.",
    controlHintNo: "Trykk på byggeår, oppvarming og utførte oppgraderinger",
    controlHintEn: "Tap build decade, heating system & insulation upgrades",
    sampleMetricNo: "Karakter D · 19 800 kWh",
    sampleMetricEn: "Grade D · 19 800 kWh",
    seoTitleNo: "Energimerking kalkulator (A–G) — Sjekk energiattest før boligsalg | VurderBoligen",
    seoDescNo:
      "Beregn estimert energikarakter (A–G) og strømkostnad for boligen din i Norge. Se krav til lovpålagt energiattest ved salg og hvilke tiltak som lønner seg.",
    seoKeywordsNo: [
      "energimerking kalkulator",
      "energiattest bolig salg",
      "energikarakter bolig estimat",
      "øker energimerking boligverdi",
    ],
    guideHeadingNo: "Hvorfor energimerking betyr mer for norske boligkjøpere",
    guideBodyNo:
      "Ved salg av bolig i Norge er det lovpålagt å fremlegge en gyldig energiattest (A–G). I tillegg gir mange banker grønt boliglån med lavere rente for boliger med energimerke A eller B — noe som øker betalingsviljen i budrunden.",
    guideHeadingEn: "Why energy grades increasingly influence Norwegian buyers",
    guideBodyEn:
      "An official energy certificate (energiattest, A–G) is legally required when selling in Norway. Many Norwegian banks also offer lower 'green mortgage' rates for A or B rated homes, directly boosting buyer demand.",
    dataSourceNo: "Basert på Enovas energimerkeordning og TEK-standarder etter byggeår.",
    dataSourceEn: "Based on Enova's energy labeling framework and Norwegian TEK building codes.",
    faqs: [
      {
        qNo: "Er energiattest påbudt når jeg selger boligen min?",
        aNo: "Ja. Alle boliger som selges eller leies ut i Norge skal ha en gyldig energiattest. Enkel egenerklæring gjøres gratis på energimerking.no, eller via takstmann/megler.",
        qEn: "Is an energy certificate mandatory when selling?",
        aEn: "Yes. Every property sold or rented in Norway requires a valid energiattest, registered via Enova or compiled by your home inspector.",
      },
      {
        qNo: "Hvilket energitiltak gir raskest effekt før salg?",
        aNo: "En moderne luft-til-luft varmepumpe (25 000–35 000 kr) og god tetting rundt vinduer gir stor reduksjon i strømforbruk og bedre karakter uten måneder med håndverkere.",
        qEn: "Which upgrade improves energy grade fastest before selling?",
        aEn: "A modern air-to-air heat pump (25,000–35,000 kr) and basic draft-proofing immediately lower power costs without months of renovation work.",
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
      "Beregn lovfestet innløsningssum for festetomt, KPI-regulering og effekt på salgsprisen.",
    descEn:
      "Calculate statutory Norwegian leasehold buyout price (25× annual rent or 40% raw plot value), KPI rent indexing, and resale value impact.",
    controlHintNo: "Juster årlig festeavgift, råtomtverdi og innløsningsregel",
    controlHintEn: "Slide annual ground rent, raw plot value & buyout rule",
    sampleMetricNo: "375 000 kr innløsning",
    sampleMetricEn: "375 000 kr buyout",
    seoTitleNo: "Tomtefeste kalkulator (2026) — Beregn innløsning av festetomt og festeavgift | VurderBoligen",
    seoDescNo:
      "Har du bolig eller hytte på festetomt? Regn ut innløsningssum (25× festeavgift eller 40 % av råtomtverdi), KPI-justering og om du bør innløse før salg.",
    seoKeywordsNo: [
      "tomtefeste kalkulator",
      "innløsning av festetomt kalkulator",
      "festeavgift kalkulator",
      "selge bolig på festetomt",
    ],
    guideHeadingNo: "Bør du innløse festetomten før du selger bolig eller hytte?",
    guideBodyNo:
      "Etter Tomtefesteloven har fester av bolig- eller fritidstomt rett til å kreve innløsning når det har gått 30 år av festetiden (eller ved avtalt innløsningstidspunkt). Hovedregelen er 25 ganger oppregulert årlig festeavgift, men for tidsbegrensede avtaler kan bortfester velge 40 % av råtomtverdien. Å eie egen tomt fjerner usikkerhet for kjøpere og gir ofte bedre budrunde.",
    guideHeadingEn: "Should you buy out a leased plot before selling?",
    guideBodyEn:
      "Under Norway's Ground Lease Act (Tomtefesteloven), lessees may buy out residential or cabin plots after 30 years at 25× adjusted annual rent (or 40% of raw land value on fixed-term leases). Converting to freehold eliminates buyer hesitation.",
    dataSourceNo: "I tråd med Tomtefesteloven §§ 15, 32 og 37 samt SSBs konsumprisindeks (KPI).",
    dataSourceEn: "Aligned with the Norwegian Ground Lease Act §§ 15, 32, 37 and SSB CPI indexing.",
    faqs: [
      {
        qNo: "Hva er hovedregelen for innløsningssum på festetomt?",
        aNo: "Standardregelen er 25 ganger den oppregulerte årlige festeavgiften. Ved tidsbegrensede kontrakter kan grunneier likevel kreve 40 % av råtomtverdien (fratrukket festeavkastning og påkostninger du selv har gjort).",
        qEn: "What is the standard buyout formula for a leased plot in Norway?",
        aEn: "The default formula is 25× the CPI-adjusted annual ground rent, though landlords on fixed-term contracts may opt for 40% of raw unimproved plot value.",
      },
      {
        qNo: "Når må krav om innløsning sendes?",
        aNo: "Krav om innløsning av festetomt må som regel fremsettes skriftlig minst 1 år før innløsningstiden er inne.",
        qEn: "When must a buyout notice be sent?",
        aEn: "Written notice to buy out a leased plot generally must be delivered to the landowner at least 1 year before the buyout milestone.",
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
      "Se nøyaktig når solen treffer terrassen og når den går ned i din by og hvordan kveldssol påvirker boligprisen.",
    descEn:
      "See exact terrace sunrise, direct sunlight hours, and sunset times on March 21, June 21, and September 21 across Norway — plus evening-sun value impact.",
    controlHintNo: "Velg by (eller GPS/adresse), himmelretning og horisont",
    controlHintEn: "Pick city (or GPS/address), compass direction & horizon",
    sampleMetricNo: "11,4 t sommersol",
    sampleMetricEn: "11.4h summer sun",
    seoTitleNo: "Solforhold kalkulator (2026) — Sjekk sol på terrasse og hage i Norge | VurderBoligen",
    seoDescNo:
      "Beregn nøyaktige soltimer og solnedgang på balkong, terrasse og hage for vår, sommer og høst i hele Norge. Med gratis adresseoppslag fra Kartverket.",
    seoKeywordsNo: [
      "solforhold kalkulator",
      "når går solen ned på terrassen",
      "sol på hagen kalkulator",
      "solforhold eiendom sjekk",
      "kveldssol boligverdi",
    ],
    guideHeadingNo: "Hvor mye er ettermiddags- og kveldssol verdt ved boligsalg?",
    guideBodyNo:
      "I Norge er solforhold blant de tre viktigste faktorene for boligkjøpere på visning. Terrasser og hager vendt mot sørvest eller vest får ettertraktet ettermiddags- og kveldssol etter arbeidstid, noe som ofte gir 5–12 % høyere salgspris sammenlignet med tilsvarende nordvendte boliger.",
    guideHeadingEn: "How much does afternoon and evening sun add to sale price?",
    guideBodyEn:
      "In Norway, sun exposure ranks among buyers' top three priorities at viewings. Southwest- and west-facing terraces capture prized after-work evening sun, often adding 5–12% to final sale price compared to north-facing equivalents.",
    dataSourceNo: "Astronomisk solbaneberegning etter breddegrad + åpent adresseoppslag via Kartverket.",
    dataSourceEn: "Astronomical solar path calculation by latitude + open address lookup via Kartverket.",
    faqs: [
      {
        qNo: "Hvilken himmelretning gir mest kveldssol i Norge?",
        aNo: "Sørvest (SV) og vest (V) gir best kombinasjon av ettermiddagssol og sen kveldssol fra april til september. Nordvest gir sen kveldssol midtsommers.",
        qEn: "Which terrace orientation gets the best evening sun in Norway?",
        aEn: "Southwest (SW) and West (W) deliver the strongest afternoon and evening sunlight from April through September.",
      },
      {
        qNo: "Hvordan bør jeg bruke solforhold når jeg selger boligen?",
        aNo: "Planlegg visning og boligfotografering på det tidspunktet solen står direkte på uteplassen eller i stuen. Megleren bruker dette aktivt i FINN-annonsen.",
        qEn: "How should I highlight sun exposure when selling?",
        aEn: "Schedule photography and open viewings right when direct sunlight hits your terrace or living room, and feature exact evening-sun hours in your listing.",
      },
    ],
    relatedSlugs: ["price-per-m2", "broker-fee", "energy-rating"],
  },
];

export function getToolBySlug(slug: string): ToolCatalogEntry | undefined {
  return TOOL_CATALOG.find((t) => t.slug === slug);
}

// =========================================================================
// 20 Major Norwegian Municipalities — Property Tax (Eiendomsskatt) 2026
// =========================================================================
export interface MunicipalityTaxRule {
  id: string;
  name: string;
  countyNo: string;
  countyEn: string;
  cityMatchId?: string; // maps to NORWAY_CITIES id if available
  hasResidentialTax: boolean;
  promilleHome: number; // e.g. 2.35 = 0.235%
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
    promilleHome: 2.35,
    promilleCabin: 2.35,
    bunnfradragHome: 4_700_000,
    bunnfradragCabin: 4_700_000,
    reductionFactor: 0.3,
    noteNo: "Høyt bunnfradrag (4,7 mill. kr) etter 30 % reduksjonsfaktor — boliger under ca. 6,71 mill. kr betaler 0 kr.",
    noteEn: "High 4.7M kr threshold after 30% reduction — homes under ~6.71M kr pay 0 kr.",
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
    noteNo: "Bærum har ingen eiendomsskatt på bolig og fritidsbolig.",
    noteEn: "Bærum levies no residential or cabin property tax.",
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
    noteNo: "Asker har ingen eiendomsskatt på bolig og fritidsbolig.",
    noteEn: "Asker levies no residential or cabin property tax.",
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
    bunnfradragHome: 1_000_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Bergen benytter 30 % reduksjon, bunnfradrag 1 mill. kr på bolig og 2,6 promille sats.",
    noteEn: "Bergen applies 30% reduction, 1M kr home threshold, and a 2.6‰ tax rate.",
  },
  {
    id: "trondheim",
    name: "Trondheim",
    countyNo: "Trøndelag",
    countyEn: "Trøndelag",
    cityMatchId: "trondheim",
    hasResidentialTax: true,
    promilleHome: 3.1,
    promilleCabin: 3.1,
    bunnfradragHome: 500_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Trondheim benytter 30 % reduksjonsfaktor, 500 000 kr bunnfradrag på bolig og 3,1 promille.",
    noteEn: "Trondheim applies 30% reduction, 500,000 kr home threshold, and a 3.1‰ rate.",
  },
  {
    id: "stavanger",
    name: "Stavanger",
    countyNo: "Rogaland",
    countyEn: "Rogaland",
    cityMatchId: "stavanger",
    hasResidentialTax: true,
    promilleHome: 2.0,
    promilleCabin: 2.0,
    bunnfradragHome: 1_100_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Stavanger benytter 30 % reduksjonsfaktor, 1,1 mill. kr bunnfradrag på bolig og 2,0 promille.",
    noteEn: "Stavanger applies 30% reduction, 1.1M kr home threshold, and a 2.0‰ rate.",
  },
  {
    id: "drammen",
    name: "Drammen",
    countyNo: "Buskerud",
    countyEn: "Buskerud",
    cityMatchId: "drammen",
    hasResidentialTax: true,
    promilleHome: 2.4,
    promilleCabin: 2.4,
    bunnfradragHome: 800_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Drammen har 30 % reduksjon, 800 000 kr bunnfradrag for boenheter og 2,4 promille.",
    noteEn: "Drammen applies 30% reduction, 800,000 kr home threshold, and a 2.4‰ rate.",
  },
  {
    id: "kristiansand",
    name: "Kristiansand",
    countyNo: "Agder",
    countyEn: "Agder",
    cityMatchId: "kristiansand",
    hasResidentialTax: true,
    promilleHome: 2.9,
    promilleCabin: 2.9,
    bunnfradragHome: 400_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Kristiansand har 30 % reduksjonsfaktor, 400 000 kr bunnfradrag på bolig og 2,9 promille.",
    noteEn: "Kristiansand applies 30% reduction, 400,000 kr home threshold, and a 2.9‰ rate.",
  },
  {
    id: "tromso",
    name: "Tromsø",
    countyNo: "Troms",
    countyEn: "Troms",
    cityMatchId: "tromso",
    hasResidentialTax: true,
    promilleHome: 3.7,
    promilleCabin: 3.7,
    bunnfradragHome: 450_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Tromsø har 30 % reduksjonsfaktor, 450 000 kr bunnfradrag på bolig og 3,7 promille.",
    noteEn: "Tromsø applies 30% reduction, 450,000 kr home threshold, and a 3.7‰ rate.",
  },
  {
    id: "fredrikstad",
    name: "Fredrikstad",
    countyNo: "Østfold",
    countyEn: "Østfold",
    hasResidentialTax: true,
    promilleHome: 3.2,
    promilleCabin: 3.2,
    bunnfradragHome: 600_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Fredrikstad har 30 % reduksjon, 600 000 kr bunnfradrag på bolig og 3,2 promille.",
    noteEn: "Fredrikstad applies 30% reduction, 600,000 kr home threshold, and a 3.2‰ rate.",
  },
  {
    id: "sandnes",
    name: "Sandnes",
    countyNo: "Rogaland",
    countyEn: "Rogaland",
    hasResidentialTax: true,
    promilleHome: 2.0,
    promilleCabin: 2.0,
    bunnfradragHome: 800_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Sandnes benytter 30 % reduksjon, 800 000 kr bunnfradrag på bolig og 2,0 promille.",
    noteEn: "Sandnes applies 30% reduction, 800,000 kr home threshold, and a 2.0‰ rate.",
  },
  {
    id: "sarpsborg",
    name: "Sarpsborg",
    countyNo: "Østfold",
    countyEn: "Østfold",
    hasResidentialTax: true,
    promilleHome: 3.5,
    promilleCabin: 3.5,
    bunnfradragHome: 300_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Sarpsborg benytter 30 % reduksjon, 300 000 kr bunnfradrag på bolig og 3,5 promille.",
    noteEn: "Sarpsborg applies 30% reduction, 300,000 kr home threshold, and a 3.5‰ rate.",
  },
  {
    id: "skien",
    name: "Skien",
    countyNo: "Telemark",
    countyEn: "Telemark",
    hasResidentialTax: true,
    promilleHome: 3.6,
    promilleCabin: 3.6,
    bunnfradragHome: 350_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Skien benytter 30 % reduksjon, 350 000 kr bunnfradrag på bolig og 3,6 promille.",
    noteEn: "Skien applies 30% reduction, 350,000 kr home threshold, and a 3.6‰ rate.",
  },
  {
    id: "alesund",
    name: "Ålesund",
    countyNo: "Møre og Romsdal",
    countyEn: "Møre og Romsdal",
    hasResidentialTax: true,
    promilleHome: 3.0,
    promilleCabin: 3.0,
    bunnfradragHome: 500_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Ålesund har 30 % reduksjon, 500 000 kr bunnfradrag på bolig og 3,0 promille.",
    noteEn: "Ålesund applies 30% reduction, 500,000 kr home threshold, and a 3.0‰ rate.",
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
    noteNo: "Sandefjord har ingen eiendomsskatt på bolig og fritidsbolig.",
    noteEn: "Sandefjord levies no residential or cabin property tax.",
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
    noteNo: "Tønsberg har ingen eiendomsskatt på bolig og fritidsbolig.",
    noteEn: "Tønsberg levies no residential or cabin property tax.",
  },
  {
    id: "moss",
    name: "Moss",
    countyNo: "Østfold",
    countyEn: "Østfold",
    hasResidentialTax: true,
    promilleHome: 2.8,
    promilleCabin: 2.8,
    bunnfradragHome: 600_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Moss benytter 30 % reduksjon, 600 000 kr bunnfradrag på bolig og 2,8 promille.",
    noteEn: "Moss applies 30% reduction, 600,000 kr home threshold, and a 2.8‰ rate.",
  },
  {
    id: "bodo",
    name: "Bodø",
    countyNo: "Nordland",
    countyEn: "Nordland",
    hasResidentialTax: true,
    promilleHome: 3.4,
    promilleCabin: 3.4,
    bunnfradragHome: 400_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Bodø har 30 % reduksjonsfaktor, 400 000 kr bunnfradrag på bolig og 3,4 promille.",
    noteEn: "Bodø applies 30% reduction, 400,000 kr home threshold, and a 3.4‰ rate.",
  },
  {
    id: "hamar",
    name: "Hamar",
    countyNo: "Innlandet",
    countyEn: "Innlandet",
    hasResidentialTax: true,
    promilleHome: 3.3,
    promilleCabin: 3.3,
    bunnfradragHome: 450_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Hamar har 30 % reduksjon, 450 000 kr bunnfradrag på bolig og 3,3 promille.",
    noteEn: "Hamar applies 30% reduction, 450,000 kr home threshold, and a 3.3‰ rate.",
  },
  {
    id: "lillestrom",
    name: "Lillestrøm",
    countyNo: "Akershus",
    countyEn: "Akershus",
    hasResidentialTax: true,
    promilleHome: 2.0,
    promilleCabin: 2.0,
    bunnfradragHome: 1_500_000,
    bunnfradragCabin: 0,
    reductionFactor: 0.3,
    noteNo: "Lillestrøm har 30 % reduksjon, 1,5 mill. kr bunnfradrag på bolig og 2,0 promille.",
    noteEn: "Lillestrøm applies 30% reduction, 1.5M kr home threshold, and a 2.0‰ rate.",
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
// Solar Path Astronomical Math (Accurate for Norwegian Latitudes 58°–70° N)
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
  { id: "NE", azimuth: 45, shortNo: "NØ", shortEn: "NE", labelNo: "Nordøst (morgensol)", labelEn: "Northeast (morning)", eveningSunPremiumPct: 2 },
  { id: "E", azimuth: 90, shortNo: "Ø", shortEn: "E", labelNo: "Øst (formiddag)", labelEn: "East (morning)", eveningSunPremiumPct: 3 },
  { id: "SE", azimuth: 135, shortNo: "SØ", shortEn: "SE", labelNo: "Sørøst (dagsol)", labelEn: "Southeast (daytime)", eveningSunPremiumPct: 5 },
  { id: "S", azimuth: 180, shortNo: "S", shortEn: "S", labelNo: "Sør (heldagssol)", labelEn: "South (all-day)", eveningSunPremiumPct: 8 },
  { id: "SW", azimuth: 225, shortNo: "SV", shortEn: "SW", labelNo: "Sørvest (ettermiddag + kveld)", labelEn: "Southwest (afternoon + eve)", eveningSunPremiumPct: 11 },
  { id: "W", azimuth: 270, shortNo: "V", shortEn: "W", labelNo: "Vest (kveldssol)", labelEn: "West (evening sun)", eveningSunPremiumPct: 10 },
  { id: "NW", azimuth: 315, shortNo: "NV", shortEn: "NW", labelNo: "Nordvest (sen kveld)", labelEn: "Northwest (late evening)", eveningSunPremiumPct: 6 },
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
  }[] = [
    { key: "spring", labelNo: "Vårjevndøgn", labelEn: "Spring Equinox", dateNo: "21. mars", dateEn: "March 21", declinationDeg: 0.3, utcOffset: 1 },
    { key: "summer", labelNo: "Sommersolverv", labelEn: "Summer Solstice", dateNo: "21. juni", dateEn: "June 21", declinationDeg: 23.44, utcOffset: 2 },
    { key: "autumn", labelNo: "Høstjevndøgn", labelEn: "Autumn Equinox", dateNo: "21. sept.", dateEn: "Sept 21", declinationDeg: 0.6, utcOffset: 2 },
    { key: "winter", labelNo: "Vintersolverv", labelEn: "Winter Solstice", dateNo: "21. des.", dateEn: "Dec 21", declinationDeg: -23.44, utcOffset: 1 },
  ];

  const latRad = (lat * Math.PI) / 180;
  // Standard meridian for CET (UTC+1) is 15°E; for CEST (UTC+2) is 30°E
  return seasons.map((s) => {
    const decRad = (s.declinationDeg * Math.PI) / 180;
    const stdMeridian = s.utcOffset * 15;
    const solarNoonLocal = 12 + (stdMeridian - lng) / 15;

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

      if (altDeg > -0.5) {
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

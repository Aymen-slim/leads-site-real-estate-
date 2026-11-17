# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js (App Router)

## Users
Property owners in Norway aged 30–55 (with primary ergonomic focus on 45+ homeowners and landowners) considering selling a residential house/villa, apartment, or constructible plot of land, including owners handling inherited family estates or older properties needing renovation.

## Product Purpose
Convert Norwegian property owners into qualified seller leads by providing instant, zero-typing decision calculators and a frictionless 4-tap mobile-first seller funnel.

## Positioning
Unlike generic listing portals that mix buyer search with complex multi-field forms, this platform is 100% dedicated to property sellers in Norway—combining Krogsveen-inspired Scandinavian institutional trust with zero-typing calculators (dropdowns, sliders, and giant tap cards) that feed directly into a 4-tap phone-only seller funnel.

## Operating Context
Used predominantly on mobile smartphones by 30–55+ property owners evaluating whether to sell now, divide land, split an inherited home among heirs, or renovate before selling. Must support instant bilingual switching between Norwegian (Bokmål) and English, NOK (`kr`) pricing, Norwegian municipalities/neighborhoods, and realistic Norwegian transaction cost structures.

## Capabilities and Constraints
- **Bilingual (Norwegian Bokmål + English):** Instant language toggle across all landing pages, calculators, A/B variants, and form steps.
- **A/B Testing Engine:** Built-in split testing and live variant switcher for both the Landing Page (Variant A vs. Variant B) and the Seller Form Funnel (Variant A vs. Variant B).
- **5 Separate Zero-Typing Calculator Pages:**
  1. `/tools/price-per-m2` — Instant Neighborhood "Price per m²" Lookup (Houses vs. Constructible Land)
  2. `/tools/net-cash` — "Net Cash in Pocket" Calculator (After Taxes & Fees)
  3. `/tools/land-buildability` — Land Buildability & Division Estimator (R+2, R+3, villa, commercial)
  4. `/tools/inherited-property` — Inherited / Family Property Share Calculator
  5. `/tools/sell-as-is` — "Sell As-Is vs. Fix It Up" Calculator
- **4 Zero-Friction Funnel Rules for 45+ Sellers (`/sell`):**
  1. Giant tap cards (`>= 18px` bold text, 1 question per screen, 4 surface-area presets).
  2. Auto-advance on tap (maximum 4 taps before phone number step).
  3. No map dragging (cascading City ➔ Area dropdowns + 1-tap browser GPS location detection).
  4. Phone keypad only (`type="tel"` and `inputMode="numeric"`, asking only for Name and Phone Number—never email).

## Brand Commitments
- Visual aesthetic modeled directly on Krogsveen (`krogsveen.no`): signature botanical sage surfaces (`#EDF0E7`, `#DCE2CF`), Krogsveen olive-sage primary action fill (`#B8C49E` with `#000000` ink), deep pine-slate accents (`#5D726A`), crisp `#FFFFFF` ground, warm charcoal (`#292823`) typography, buttercream (`#FFF7D4`) highlights, and terracotta (`#BA5B3E`) deduction/alert accents.
- **Strict No-Emoji Policy:** Never use emojis or Unicode pictographs anywhere on the site. All icons (House/Villa, Plot of Land, Apartment, GPS Location, Repairs) must be crisp, uniform-stroke custom SVG vector icons.

## Product Principles
1. **Zero Keyboard Friction Until the Final Step:** Every calculator and funnel question operates exclusively through giant tap cards, large dropdowns, or thumb-friendly sliders.
2. **Every Tool Pushes Contextually to the Funnel:** Each calculator concludes with a tailored green CTA that pre-fills the user's selections directly into the seller funnel.
3. **Ergonomic Clarity for 45+ Mobile Users:** Minimum `18px` bold interactive labels, unmistakable borders, tabular numbers, and a numeric-only phone keypad.
4. **Measurable Conversion Optimization:** Native A/B testing across both landing pages and funnel layouts with transparent conversion tracking.

## Accessibility & Inclusion
Designed for 45+ mobile users with high-contrast AAA-oriented text, large touch targets (`>= 64px` height), zero precision map-dragging requirements, and `inputMode="numeric"` phone entry.

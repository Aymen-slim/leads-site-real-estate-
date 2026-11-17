---
name: Krogsveen Stil — Norway House & Land Seller Portal
description: Exact Krogsveen.no botanical sage and editorial serif valuation & zero-typing seller funnel system for 30–55+ Norwegian property owners.
colors:
  krogsveen-sage-action: "#B8C49E"
  krogsveen-sage-action-hover: "#A6B489"
  krogsveen-sage-mid: "#DCE2CF"
  krogsveen-sage-light: "#EDF0E7"
  krogsveen-pine-deep: "#5D726A"
  surface-white: "#FFFFFF"
  neutral-light: "#F7F7F7"
  ink-black: "#000000"
  ink-charcoal: "#292823"
  border-subtle: "#DFDFDF"
  border-strong: "#BFBFBD"
  terracotta-accent: "#BA5B3E"
  butter-highlight: "#FFF7D4"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "64px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Albert Sans, Helvetica, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Albert Sans, Helvetica, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Albert Sans, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.35
rounded:
  sm: "2px"
  md: "2px"
  lg: "2px"
spacing:
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.krogsveen-sage-action}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "20px 28px"
  button-primary-hover:
    backgroundColor: "{colors.krogsveen-sage-action-hover}"
  giant-tap-card:
    backgroundColor: "{colors.krogsveen-sage-light}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "24px"
  giant-tap-card-active:
    backgroundColor: "{colors.krogsveen-sage-mid}"
    textColor: "{colors.ink-black}"
---

# Design System: Krogsveen Stil — Norway House & Land Seller Portal

## Overview

**Creative North Star: "Krogsveen Botanical Sage & Editorial Trust"**

Modeled directly on the live color and typographic system of `https://www.krogsveen.no/`, this design pairs Krogsveen's calm Scandinavian botanical sage palette (`#EDF0E7`, `#DCE2CF`, `#B8C49E`, `#5D726A`) and editorial serif headlines (`Source Serif 4`, echoing Krogsveen's `PublicoText`/`PublicoBanner`) with oversized, zero-typing mobile ergonomics tailored for 30–55+ Norwegian property owners.

Every interactive surface rejects emoji clutter, generic neon greens, and eyebrow kickers. All icons are uniform `1.75px`-stroke architectural SVGs, and all NOK (`kr`) outputs use tabular numerals.

**Key Characteristics:**
- Exact `krogsveen.no` palette: `#FFFFFF` ground, `#EDF0E7` light sage, `#DCE2CF` mid sage, `#B8C49E` signature olive-sage CTA fill with `#000000` ink, `#5D726A` deep pine-slate focus/border accent, `#292823` warm charcoal ink, `#FFF7D4` buttercream callout, and `#BA5B3E` terracotta deduction ink.
- Zero-typing interaction model across all 5 calculators and the 4-tap auto-advance seller funnel.
- Minimum `1.125rem` (`18px`) bold typography on all interactive controls with `tabular-nums`.

## Colors

### Primary
- **Krogsveen Sage Action** (`#B8C49E`, hover `#A6B489`): Primary CTA button background paired with crisp `#000000` text and `#5D726A` border (matching `krogsveen.no` primary buttons).
- **Krogsveen Sage Mid** (`#DCE2CF`): Signature hero surface, selected tap cards, and net-result highlight panels.
- **Krogsveen Sage Light** (`#EDF0E7`): Primary page backdrop for calculator instruments, funnel steps, and unselected giant tap cards.
- **Krogsveen Pine Deep** (`#5D726A`): Active `2px` border strokes, slider progress fills, active navigation pill fill (`#FFFFFF` text), and focus outlines.

### Neutral & Accents
- **Surface White** (`#FFFFFF`) & **Light Input Fill** (`#F7F7F7`): Elevated containers, header bar, and dropdown/tel inputs.
- **Pure Black** (`#000000`) & **Warm Charcoal** (`#292823`): Headlines, high-contrast labels, and the sticky bottom WhatsApp escape bar.
- **Terracotta Accent** (`#BA5B3E`): Negative fee/tax deduction rows and inline validation alerts.
- **Warm Buttercream** (`#FFF7D4`): Calculator pre-fill confirmation banner and control badges.

## Typography

**Display & Headline Font:** Source Serif 4 (echoing `PublicoText` / `PublicoBanner` on `krogsveen.no`)
**Body & UI Font:** Albert Sans (echoing `Unica` grotesque sans on `krogsveen.no`)

### Named Rules
**The Two-Pixel Pine Affordance Rule.** Interactive cards and inputs carry `2px solid` borders (`#BFBFBD` at rest, `#5D726A` when selected or focused).
**The No-Kicker Rule.** Headings stand alone without eyebrow labels above them.

## Components

### Buttons & Giant Tap Cards
- **Primary CTA:** `#B8C49E` fill, `#000000` bold text, `2px solid #5D726A` border, `12px` radius.
- **Giant Tap Card:** `#EDF0E7` at rest (`#DCE2CF` selected), `#000000` `18px+` bold text, `>= 84px` height, auto-advances on tap.

## Do's and Don'ts

### Do:
- **Do** use the exact `krogsveen.no` colors (`#EDF0E7`, `#DCE2CF`, `#B8C49E`, `#5D726A`, `#292823`, `#000000`, `#BA5B3E`, `#FFF7D4`).
- **Do** use custom `1.75px`-stroke SVG icons only (zero emojis).
- **Do** keep `type="tel"` and `inputMode="numeric"` on the phone field and never ask for email.

### Don't:
- **Don't** use emojis or Unicode pictographs anywhere in the UI.
- **Don't** include draggable map pins or keyboard typing inside any calculator.

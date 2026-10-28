# 06 — Build plan v2: "Das Lokal" (Convenium · Gastronomie)

Supersedes v1 "Die Karte" (2026-10-22, cloud). Rustam rejected v1 the same day: it reused Hair & Beauty's
repeating elements (paper pill header, cherry pill CTA, glow + sheen cards, giant footer wordmark, numbered
eyebrows) and had no pictures. His instruction, verbatim intent:

> Make assets with Artlist. Use other design elements. Take tigermilkrestaurants.com/fr/restaurants/lyon-viiie/
> for animations and ballenacabo.com for layout style (buttons, cards, navbar). More unique, different from
> Hair & Beauty. Different footer and a different repeating element. Same brand colours, other grades allowed,
> a different font (trending for restaurants).

## Research basis

### Owner-named references (observed live in the browser, 2026-10-22, 1440×900)

**Tigermilk Lyon** — https://tigermilkrestaurants.com/fr/restaurants/lyon-viiie/ (motion)

| Move | What it does |
|---|---|
| Split hero | Left half full-height photo/video, right half cream with a huge condensed word ("LYON"), small eyebrow, an engraved botanical cut-out |
| Word-fill statement | A big centred caps paragraph whose words fill colour one by one as you scroll (pale → accent → ink), an engraved collage object floating over it |
| Growing arch | A photo masked as a round-top arch, small and centred, grows to full-bleed as you scroll; a second, smaller photo pops in over it |
| Ruled word stack | Giant words stacked between horizontal hairlines, revealed row by row |
| Section colour shift | The ground changes from cream to deep green; the header follows |
| Horizontal word marquee | Giant condensed words travel sideways with scroll, rounded photo cards interleaved |
| Engraved cut-outs | Vintage engraving objects (lime, owl, elephant) float and drift; a speech bubble |
| Sticky CTA | One small black square "Voir la carte" button fixed bottom-centre the whole page |

Type observed: Druk XCondensed / Druk Wide (display), ArcherPro (secondary). Native scroll is replaced by a
virtual scroller.

**Ballena Cabo** — https://ballenacabo.com/ (layout, buttons, cards, navbar)

| Element | What it does |
|---|---|
| Navbar | A compact centred floating bar (~560px), translucent dark with blur: outlined square "Book now" (radius 2.5px, 10px caps) left, tall condensed wordmark centre, two-line menu icon right |
| Headlines | Wide extended caps, light weight, two lines |
| Split blocks | 50/50: full-bleed photo one side, solid colour block (terracotta) the other, with caps label, headline, short body, link |
| Links | Small caps text + a filled circle with an arrow ("View full menu ⊙") — no pills |
| Cards | Tall photo cards in a row (carousel), title centred at the top in caps, two-line centred caption and "Explore more ⊙" at the bottom, over the image |
| Contact | A solid-colour panel floating over a full-bleed landscape photo |
| Footer | Portrait photo + paragraph, vertical hairline, navigation column, newsletter with underline-only inputs; ends in a giant wordmark (not taken: Hair & Beauty already ends that way) |

Type observed: Sweet Sans Pro (wide caps), TT Commons Pro. GSAP + Lenis.

### Type trend (web search, 2026-10-22)

- Slim condensed serifs are back in brand identities; Instrument Serif is named as the example
  (https://letsdatascience.com/news/condensed-serifs-return-as-brand-trend-d6d9bd85, summarising a WSJ
  report; https://madegooddesigns.com/trending-fonts/).
- Hospitality uses soft/dramatic serifs for headlines and keeps them to heroes and price callouts
  (https://www.vistaprint.com/hub/font-trends); elegant faces read as higher quality on menus
  (https://madegooddesigns.com/?p=6601).
- Both reference sites pair a condensed or wide display face with small tracked caps — Tigermilk with Druk,
  Ballena with a tall condensed wordmark and wide caps.

### v1 survey kept for context

Awwwards restaurant listings 2026 (La table de Joakim, Restaurant GEM, Ballena Fine Dining, Son Daven, Crav
Burgers, Gourou): dark grounds, editorial serifs, cream + red restraint, menu as object, hover reveals.

## Direction — "Das Lokal"

A warm Carinthian dining room in photographs, cream walls, cherry banquettes. Tigermilk's way of moving
(split hero, words that fill as you read, an arch that opens into the room, a marquee of what the venue is)
set in Ballena's way of laying out (centred floating bar, square outlined buttons, arrow-circle links, tall
photo cards, split colour blocks, a panel over a photo). Nothing carried over from Hair & Beauty.

### What replaces each Hair & Beauty element

| Hair & Beauty (and v1) | Gastronomie v2 |
|---|---|
| Paper pill lockup header, cherry pill CTA | Centred floating noir bar: outlined square "Platz reservieren", serif wordmark, menu icon; menu opens a full-screen cherry overlay |
| Pill buttons | Square buttons, 2px radius, 12px tracked caps; solid cherry or outlined |
| Text links with → | Caps link + filled circle arrow (the repeating element) |
| Glow + sheen plan cards | Tall photo cards: caps title on top, serif title + Anton price at the bottom, image zooms on hover |
| Numbered eyebrows "01 / …" | Plain tracked caps labels, no numbers |
| Giant footer wordmark | Cherry footer: chef photo + studio line, navigation column, a launch-places column with the ten ticks; small serif signature, no wordmark |
| Archivo / Newsreader / Inter | Instrument Serif / Anton / Instrument Sans |
| Plates on a drawn table | Ten ticks ("Gedecke") in the hero and footer; places stay counted from campaign.json |
| (none) | Engraved cherry-ink cut-outs (cherries, wine glass, coffee cup) floating at section joins — the second repeating element |
| (none) | Sticky bottom-centre square CTA, Tigermilk's "Voir la carte" |

## Page sequence and media map

| # | Section | Ground | Media | Motion |
|---|---|---|---|---|
| 0 | Header | translucent noir bar | — | drops in; never hides |
| 1 | Hero (split) | left photo, right cotton | `hero-room` (4:5) | photo clip-reveal + scale 1.12 → 1; H1 lines rise; cherries cut-out floats |
| 2 | Statement | cotton | `cut-glass` engraving | words fill gray → cherry with scroll (scrub) |
| 3 | Arch | cotton → full-bleed | `arch-bar` (3:2) | arch grows to full-bleed (sticky stage, scrub); label over it |
| 4 | Die Karte | paper | `course-1..3` (3:4) | cards rise 40px staggered; image zoom on hover |
| 5 | Launch (split) | photo + cherry block | `food-4` cocktail (1:1, cover) | countdown ticks; ten ticks |
| 6 | Marquee | maroon | `food-1..3` (1:1) | giant Anton words (Restaurant · Café · Bäckerei · Bar) + photo cards move sideways with scroll |
| 7 | SAVRA | full-bleed SAVRA still, cream panel over it | SAVRA capture + loop | panel rises; loop plays on hover / in view |
| 8 | Ablauf | cotton | `cut-cup` engraving | steps rise |
| 9 | Reservierung + FAQ | paper | — | reveal |
| 10 | Footer | cherry | `chef` (3:4) | — |

## Beat sheet

| Beat | Trigger | What moves | Duration |
|---|---|---|---|
| 1 Arrival | load | bar y −16 → 0; photo clip `inset(100% 0 0 0)` → 0, scale 1.12 → 1 | 0.8s / 1.4s |
| 2 Name on the door | +0.2s | three H1 lines rise 110 % → 0 in masks | 1.1s, 90ms stagger |
| 3 Reading the room | statement in view | each word colour gray → cherry, scrub over 60 % of viewport | scrub 0.6 |
| 4 The door opens | arch stage sticky | arch width 34vw → 100vw, top radius 50 % → 0, height 70vh → 100vh | scrub 1, 160vh stage |
| 5 The card | cards enter | y 40 → 0, opacity 0 → 1 | 0.9s, 120ms stagger |
| 6 What you serve | marquee in view | track x 0 → −(width − viewport) | scrub 1 |
| 7 Cut-outs | always | y ±40px parallax, rotate ±6° | scrub |
| 8 Sticky CTA | after hero, until Reservierung | y 120 % → 0 | 0.4s |

Reduced motion: no GSAP; statement fully cherry; arch shown full width as a still; marquee is a static row;
no video; sticky CTA visible without animation.

## Acceptance criteria (encoded refusals)

- Nothing visible from Hair & Beauty: no pills, no glow/sheen cards, no giant wordmark footer, no Archivo,
  Newsreader or Inter, no numbered eyebrows.
- Brand colours only (noir, cotton, paper, ink, gray, hairline, cherry, maroon, chili, chili-300) plus the
  grades named in DESIGN.md, which are mixes of those tokens. No gradient on any surface, card, control or
  text; photo scrims are solid noir at an alpha.
- Every photo is Artlist-generated for this page (shot list below) or the real SAVRA capture; none
  pretends to be a client. Alt text describes the picture.
- The ten places stay the message: hero ticks, launch module, footer.
- Prices and sources from content/campaign.json, unchanged.
- Nothing hidden from the accessibility tree by motion; everything visible without JavaScript.

## Shot list (Artlist, Nano Banana Pro 2K, 160 credits each, 13 stills = 2,080 credits)

Shared direction: editorial, warm tungsten evening light, 35mm grain, palette near-black brown / cream /
deep cherry red, no text, no logos.

| File | Ratio | Subject |
|---|---|---|
| hero-room | 4:5 | Carinthian bistro at dusk, walnut, cherry velvet banquettes, a waiter's hand setting a plate |
| arch-bar | 3:2 | Bar counter, backlit bottles, rattan stools, arched niche, cherry lamp shades |
| course-1 | 3:4 | Kärntner Kasnudeln, brown butter, cherry napkin ("Gut anrichten") |
| course-2 | 3:4 | Glowing restaurant window at blue hour, passer-by looking in ("Gefunden werden") |
| course-3 | 3:4 | Friends toasting over shared plates ("Im Gespräch bleiben") |
| food-1 | 1:1 | Wiener Schnitzel (restaurant) |
| food-2 | 1:1 | Espresso + Sachertorte (café) |
| food-3 | 1:1 | Sourdough + croissants (bakery) |
| food-4 | 1:1 | Cherry cocktail in a coupe (bar) |
| chef | 3:4 | Chef's hands plating with tweezers |
| cut-cherries | 1:1 | Engraving, cherry ink on cotton |
| cut-glass | 1:1 | Engraving, wine glass |
| cut-cup | 1:1 | Engraving, Viennese coffee cup |

---

## Mobile pass (2026-10-27) — budgets and treatment

Budgets at 390×844: home ≤ 16 screens (it carries the hero scroll film), other routes ≤ 8; 0 targets < 24 px; inputs
≥ 16 px; no overflow from 320 px; tab bar on every route; reduced motion leaves the h1 at opacity ≥ 0.95; desktop 1280
unchanged.

The home is in budget (15.8) and already has the shell (tab bar, card rail, safe areas, phone runways). Treatment:

| Section | Treatment | Why |
|---|---|---|
| Karte · "In jedem Gang" (value list) | **fold**, closed on phones | 315 px of reference text after the price list |
| Karte · market sources | **fold**, closed on phones; a price link to `#marktquellen` opens it | 496 px of source notes |
| Karte · extras (price list) | stays open (first fold rule) | — |
| Statement, arch, hero film | untouched | signature moments |
| Legal pages | tab bar added (links back to the home chapters), `viewport-fit=cover` | shell on every route |
| Small targets, preview textarea | 24 px boxes on phones; 16 px | standards floor |

No content cut.

## Mobile pass 2 (2026-10-28) — CRAP layout, home ≤ 10 screens

Budget tightened by the studio: home ≤ 10 screens at 390×844 even with the film. Layout first:

| Change | Rule |
|---|---|
| Shell (tab bar, header CTA off, folds, phone motion) scoped to the site's own collapse point, 1023 px — was 767, so 768–1023 had neither layout | one narrow layout |
| `--section` 72 (640–1023) / 56 (< 640); heading → copy `--m-head` 16, heading → media `--m-media` 32; sub-blocks 48 | one spacing scale |
| Arch: no pin below 1024 (was a 190vh runway); the frame opens once in view. The hero film stays the one scrubbed stage, runway 200vh (640–1023) / 170vh (< 640) | signature kept, runway shortened |
| Extras price list → rail with the cards' width (`--m-rail`), bleeds right only | rail |
| Launch block padded on the gutter (was 8 px in); launch photo 16:9, hidden < 640 (decorative) | alignment / density |
| Process: cup cut-out beside the heading, numerals beside each step | proximity |
| Footer: chapter links and launch places (both in the tab bar / hero) leave the narrow footer; locale + "top" on one row; the noir base clears the tab bar | repetition |

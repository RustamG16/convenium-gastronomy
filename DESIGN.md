---
name: Convenium · Gastronomie
description: A noir dining room with a paper menu card laid on it; Newsreader speaks, Archivo prices, Inter operates.
northStar: Die Karte (the menu card)
doctrine: convenium-design-atelier, with one Kinetic hero moment (the table being set)

colors:
  noir: "#1B1717"        # hero, launch module, example, footer ground
  cotton: "#EDEBDD"      # page ground; text on noir and on cherry
  paper: "#F5F3E8"       # the menu sheet, header pills, course cards
  ink: "#241F1F"         # text on cotton/paper
  gray: "#6E6963"        # secondary text on cotton/paper
  gray-on-noir: "#A8A29A"
  hairline: "#D6D2C2"    # rules on light fields; on noir: cotton at 18 % alpha
  cherry: "#810100"      # labels, featured course, CTA pill; carries cotton text
  maroon: "#630000"      # pill hover; the hero's atmospheric light
  chili: "#D73B3E"       # focus ring; plate marks; countdown numerals and the sheen (display ≥ 24px on noir)
  chili-300: "#E5595C"   # body-size accent text on noir (eyebrows)

typography:
  hero:    { fontFamily: Newsreader, fontSize: "clamp(2.75rem, 1.2rem + 5.2vw, 7rem)", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.025em" }   # 44 → 94 @1440 → 112
  display: { fontFamily: Newsreader, fontSize: "clamp(2.25rem, 1.4rem + 2.6vw, 4.5rem)", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.025em" } # 36 → 60 → 72
  title:   { fontFamily: Newsreader, fontSize: "clamp(1.5rem, 1.2rem + 0.9vw, 2.25rem)", fontWeight: 400, lineHeight: 1.12 }  # course titles, steps, SAVRA
  lead:    { fontFamily: Newsreader, fontSize: "clamp(1.125rem, 1rem + 0.5vw, 1.5rem)", fontWeight: 400, lineHeight: 1.4 }
  price:   { fontFamily: Archivo, fontSize: "clamp(2.25rem, 1.6rem + 1.8vw, 3.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em" }
  numeral: { fontFamily: Archivo, fontSize: "clamp(3rem, 2.2rem + 2.4vw, 5.5rem)", fontWeight: 900, lineHeight: 0.82 }  # course plates; stays under the sheet's H2
  body:    { fontFamily: Inter, fontSize: "17px", fontWeight: 400, lineHeight: 1.55 }
  small:   { fontFamily: Inter, fontSize: "14px", fontWeight: 400, lineHeight: 1.45 }
  label:   { fontFamily: Inter, fontSize: "12px", fontWeight: 500, lineHeight: 1.3, letterSpacing: "0.08em", transform: uppercase }

spacing:
  scale: 4 / 8 / 16 / 24 / 40 / 64 / 96 / 160
  section: "clamp(72px, 10vw, 160px)  (72 phone · 96 tablet · 128 laptop · 160 wide)"
  gutter: "20 / 32 / 48 / 64 / 72 by breakpoint"
  measure: "hero 11ch · H2 16ch · lead 36–42ch · body 46–60ch · notes 96ch"

motion:
  micro: 150ms
  move: 400ms
  scene: 800–1100ms
  ease-out: cubic-bezier(.16, 1, .3, 1)   # CSS; GSAP uses power3/power4.out
  ease-in-out: cubic-bezier(.65, 0, .35, 1)
  scrub: 1 (the hero drift only)

breakpoints:
  target: "1440×900 laptop (design width), 1920×1080 desktop, 390×844 phone; 640 / 1024 switch points"

components:
  pill-accent: { bg: cherry, text: cotton, ratio: "9.0:1" }
  pill-light: { bg: paper, text: ink, ratio: "14.6:1" }
  course-card: { bg: paper, text: ink, rule: hairline, glow: "cherry box-shadow on ::after" }
  course-card-featured: { bg: cherry, text: cotton, ratio: "9.0:1" }
  course-plate: { bg: noir, numeral: cotton, chip: "cotton on noir / cherry on noir (graphic)" }
  launch-module: { bg: noir, claim: cotton, numerals: chili, ratio-chili-on-noir: "4.2:1 (display ≥ 24px)" }
  focus-ring: { ring: chili, spacer: "the ground behind the control", on-cherry: cotton }
---

# Convenium · Gastronomie — "Die Karte"

## Visual World

A dark dining room at evening and a paper menu card laid on the table. The page opens on noir with a
Newsreader headline set like a restaurant's name on the door and, beside it, a table seen from above with
ten plates: the ten launch places, counted live. Scrolling down lands on the paper sheet (registration
corners, hairlines, dotted leaders between an item and its price) where the three packages are set as
three courses, each with a noir plate carrying its numeral, the launch price in Archivo and the Austrian
market average on a leader line. The one photographic moment is SAVRA, a real capture of our own
restaurant concept site, framed like a door with an inner registration frame; it plays its silent loop on
hover. The reservation at the end is the same paper. Cherry appears where a decision is made: the featured
course, the reserve pill, the labels.

## Type

Newsreader leads (the Hair & Beauty page leads with Archivo and a photo sequence; this one reads like a
menu). Archivo is confined to prices, numerals, the countdown and the wordmark. Inter operates: labels,
body, controls. The hero is 94px at 1440 (clamp 44–112, 5.2vw) — the Atelier doctrine asks for a fixed
step, argued here as a fluid step with a rem term because the page is designed for three widths and must
survive text zoom; it stays the largest type on the page. The course numerals (max 88px) sit below the
sheet's H2 (max 72px)? No: the numeral is a plate ornament and is capped by `--t-num`; it is visually
larger than the H2 at wide widths only because it is a graphic inside a noir plate, not a heading. If that
ever reads as a second headline, cap `--t-num` at 4.5rem.

## Colour

Measured ratios (build.mjs refuses if any pair falls under its minimum):

| Pair | Ratio | Use |
|---|---|---|
| ink on cotton / paper | 14.1 / 15.2 | body |
| gray on cotton / paper | 4.9 / 5.3 | secondary |
| cherry on cotton / paper | 9.2 / 9.9 | labels, links |
| cotton on noir | 15.0 | hero, example, footer |
| gray-on-noir on noir | 7.1 | secondary on noir |
| chili-300 on noir | 4.8 | eyebrows on noir (body size) |
| chili on noir | 4.2 | countdown numerals, plate marks, sheen (≥ 24px display or graphic only) |
| cotton on cherry | 9.0 | featured course, reserve pill |

Banned: cherry text on noir (1.6:1), maroon as text anywhere, chili as body text anywhere.

## Media

One real capture (SAVRA, `assets/savra/`, from the studio's `public/works/savra/`), contained in a 3:4
door frame from laptop up and 16:10 below, never scrimmed; its chip sits in the frame's corner, no text
crosses the picture. No photography elsewhere: the gastro world is drawn with type, hairlines and the
plates. No AI-generated imagery on this page (none was commissioned; see Known Deployment Debt).

## Motion

GSAP 3.15 + ScrollTrigger (vendored). Beat sheet in `.olympus/06-build-plan.md`. Hero: header and
eyebrow (0.6–0.8s), three lines rise from masks (1.1s, 90ms stagger), table top fades up, ten plates land
(0.7s, 60ms stagger). Scroll: `[data-reveal]` rises 18px once; leaders draw from the left; the hero copy
drifts 60px with `scrub: 1`. CSS: the featured course breathes its glow (3.2s), its sheen crosses every
5.5s, hover lifts a course 6px on `translate`. Reduced motion: no GSAP context, static glow, no sheen,
no video; everything is in the DOM at full opacity. No pins.

## Accessibility

Landmarks: header, main, four sections with `aria-labelledby`, footer. One H1. The table is `role="img"`
with a sentence; plates are decorative. Focus ring: chili over a ground-coloured spacer, cotton on cherry.
Live region for the composer status; the countdown has `role="timer"` with a readable label. 44px targets
on every link, including the small source links (hit area via `::before`).

## Known Deployment Debt

- Impressum/Datenschutz fields (`content/launch.json → legal`) are `null` until Rustam supplies them;
  pages show `[fehlt]` and `noindex` stays.
- No gastro photography or film beyond SAVRA; a photo pass (Higgsfield, with Rustam's yes) could replace
  the noir course plates with stills, as the Hair & Beauty cards have.
- The studio's `content/industries.ts` still says `building` / `url: null` for gastronomy; set it on
  Rustam's deploy word.

## Do's and Don'ts

### Do
- Keep Newsreader as the voice of every heading; Archivo only on numbers.
- Keep the leaders dotted and one pixel; they are the menu's signature.
- Keep the sheet's registration corners and the plates' inner ring: thin geometry, structural reading.
- Count the places from `content/campaign.json` only; the plates follow the count.
- Keep the page at four chapters; add nothing above the fold but the headline and the table.

### Don't
- No photos of food from stock or AI without Rustam's yes; no "restaurant mood" gradients beyond the hero's one light.
- No cherry text on noir; no chili body text.
- No pins, no scroll-jacking, no second hero moment.
- Don't bring back the comparison table or the service calculator; the Karte is the comparison.
- Don't set anything larger than the H1.

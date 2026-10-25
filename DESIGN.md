---
name: Convenium · Gastronomie
description: A warm Carinthian dining room in photographs; Tigermilk's motion set in Ballena's layout. Instrument Serif speaks, Anton shouts the numbers, Instrument Sans operates.
northStar: Das Lokal (v2, 2026-10-22; replaces v1 "Die Karte")
doctrine: convenium-design-atelier layout with a Kinetic scroll layer (word fill, growing arch, marquee)
references: tigermilkrestaurants.com/fr/restaurants/lyon-viiie (motion) · ballenacabo.com (layout, buttons, cards, navbar)

colors:
  # brand tokens (005-agency DESIGN.md), unchanged
  noir: "#1B1717"        # header bar, photo scrims (alpha), text on cotton for the wordmark
  cotton: "#EDEBDD"      # page ground; text on cherry, maroon, oxblood, noir
  paper: "#F5F3E8"       # Karte and Reservierung grounds, SAVRA panel
  ink: "#241F1F"         # body text on light grounds
  gray: "#6E6963"        # secondary text on cotton/paper only (not on blush)
  gray-on-noir: "#A8A29A"
  hairline: "#D6D2C2"    # rules on light grounds
  cherry: "#810100"      # buttons, labels, launch block, footer, menu overlay, filled words, engravings
  maroon: "#630000"      # button hover
  chili: "#D73B3E"       # focus ring; countdown digits on noir only
  chili-300: "#E5595C"   # marquee accent words on oxblood
  # grades: mixes of the tokens above, nothing new
  blush: "#E4D8CB"       # cherry 8 % into cotton — card captions, FAQ open state
  oxblood: "#460909"     # maroon 60 % into noir — the marquee room
  rose: "#CFA99F"        # cotton 72 % over cherry — secondary text on cherry

typography:
  display: { fontFamily: "Instrument Serif", fontSize: "clamp(3.25rem, 0.6rem + 8.2vw, 10.5rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }   # H1 52 → 128 @1440 → 168
  h2:      { fontFamily: "Instrument Serif", fontSize: "clamp(2.5rem, 1.2rem + 4vw, 6rem)", lineHeight: 0.95, letterSpacing: "-0.015em" }       # 40 → 77 @1440 → 96
  statement: { fontFamily: "Instrument Serif", fontSize: "clamp(1.9rem, 0.9rem + 3.1vw, 4.4rem)", lineHeight: 1.08 }                        # word-fill paragraph, 30 → 60 → 70
  title:   { fontFamily: "Instrument Serif", fontSize: "clamp(1.75rem, 1.2rem + 1.4vw, 2.75rem)", lineHeight: 1 }                             # card titles, steps
  shout:   { fontFamily: Anton, fontSize: "clamp(5rem, 1rem + 15vw, 17rem)", lineHeight: 0.86, transform: uppercase }                      # marquee words 80 → 232 → 272
  price:   { fontFamily: Anton, fontSize: "clamp(2.5rem, 1.6rem + 2.4vw, 4.25rem)", lineHeight: 0.95 }                                      # € 500 · countdown digits
  body:    { fontFamily: "Instrument Sans", fontSize: "17px", fontWeight: 400, lineHeight: 1.55 }
  small:   { fontFamily: "Instrument Sans", fontSize: "14px", lineHeight: 1.45 }
  label:   { fontFamily: "Instrument Sans", fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em", transform: uppercase }
  button:  { fontFamily: "Instrument Sans", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", transform: uppercase }

spacing:
  scale: 4 / 8 / 12 / 16 / 24 / 40 / 64 / 96 / 160
  section: "clamp(80px, 11vw, 176px)"
  gutter: "20 phone · 32 tablet · 48 laptop · 64 wide"
  measure: "H1 9ch · H2 14ch · statement 26ch · body 52ch"

radius: { button: 2px, card: 4px, photo-card: 18px (marquee only), arch: "50% 50% 0 0 / 34% 34% 0 0" }

motion:
  micro: 160ms
  move: 400–600ms
  scene: 900–1400ms
  ease-out: cubic-bezier(.16, 1, .3, 1)    # GSAP power3/power4.out
  scrub: "0.6 word fill · 1 arch, marquee, cut-outs"

components:
  navbar: { bg: "noir @ 82 % + blur 14px", width: "min(640px, 100% − 2×12px)", radius: 3px, left: "button-outline (cotton)", centre: "wordmark, Instrument Serif 26px, tracked .08em", right: "menu icon button 44×44" }
  button-solid: { bg: cherry, text: cotton, ratio: "9.05:1", hover: maroon, radius: 2px, height: 48px }
  button-outline: { border: "1px currentColor @ 45 %", text: "ink on light / cotton on dark", hover: "fill the opposite ground" }
  arrow-link: { text: "label caps", icon: "20px filled circle (cherry on light, cotton on dark) with a 10px arrow in the ground colour; moves 3px on hover" }
  photo-card: { ratio: "3:4", radius: 4px, title: "caps label centred at top on a noir 55 % band", foot: "noir 62 % panel: serif title, Anton price, market line, arrow-link", hover: "image scale 1.06 over 900ms" }
  launch-split: { photo: left, block: "cherry, cotton text 9.05, rose secondary 5.07, Anton countdown in cotton" }
  marquee: { ground: oxblood, words: "cotton 13.45 / chili-300 4.54 alternating", cards: "1:1 photos, radius 18px, rotate ±4°" }
  savra-panel: { ground: paper, over: "full-bleed SAVRA still", text: ink }
  footer: { ground: cherry, text: cotton, secondary: rose, columns: "chef photo + studio · navigation · ten ticks + reserve" }
  ticks: { count: 10, free: "circle 1.5px currentColor", taken: "filled", source: content/campaign.json }
  sticky-cta: { position: "fixed, bottom 20px, centre", bg: cherry, text: cotton, shows: "after the hero, hides at Reservierung" }
  focus-ring: { ring: chili, spacer: "ground colour"; on cherry/oxblood/maroon: "cotton ring" }
---

# Convenium · Gastronomie — "Das Lokal"

## Visual World

A Carinthian dining room at dusk: walnut, cream lime plaster, cherry velvet banquettes, brass lamps,
plates set down by a hand in a white sleeve. The page opens split like Tigermilk — the room on the left, a
cream wall on the right with the name on it in a slim serif. Reading on, a sentence fills in cherry word by
word, an arched doorway opens into the bar until it fills the screen, and the three courses are tall photo
cards like Ballena's. The launch offer is a cherry block beside a cocktail; then the room turns oxblood and
what the venue is — RESTAURANT · CAFÉ · BÄCKEREI · BAR — slides past in giant Anton between photographs.
SAVRA is a cream panel over its own screenshot. The footer is cherry, not a wordmark.

## Type

Instrument Serif carries every headline and the statement (a slim, condensed serif: the 2026 brand trend
and the closest free relative of Ballena's tall wordmark). Anton is the Tigermilk shout: marquee words,
prices, countdown digits, step numerals. Instrument Sans operates: labels, buttons, body, inputs. The H1
(128px at 1440) is the largest type except the marquee words, which are decoration (`aria-hidden`) and
read as a picture.

## Colour

| Pair | Ratio | Use |
|---|---|---|
| ink on cotton / paper | 13.6 / 14.6 | body |
| gray on cotton / paper | 4.54 / 4.88 | secondary (never on blush) |
| cherry on cotton / paper | 9.05 / 9.74 | labels, filled words, arrow icons |
| ink / cherry on blush | 11.6 / 7.7 | card captions, FAQ |
| cotton on cherry | 9.05 | buttons, launch block, footer, menu overlay |
| rose on cherry | 5.07 | secondary text on cherry |
| cotton on oxblood | 13.45 | marquee words |
| chili-300 on oxblood | 4.54 | marquee accent words |
| cotton on noir | 14.8 | header bar, photo panels |
| chili on noir | 4.2 | focus ring, graphic only |

Banned: gray on blush (3.9), chili text on cherry or maroon, any gradient on surfaces or text.

## Media

All photographs are generated with Artlist (Nano Banana Pro, 2K) for this page from the shot list in
`.olympus/06-build-plan.md`; they show no client and no readable text. The SAVRA capture is real. The three
engravings are cherry ink on cotton and sit on cotton or paper grounds only (`mix-blend-mode: multiply`).
Photos are `object-fit: cover`, served as WebP at 1600px max with JPEG-free fallbacks unnecessary (all
target browsers read WebP).

## Motion

GSAP 3.15 + ScrollTrigger (vendored), native scroll. Beat sheet in `.olympus/06-build-plan.md`. One sticky
stage (the arch, 160vh) is the only place scroll and layout couple; it never traps focus and the content
inside it is static text. Reduced motion: no GSAP context; the statement is fully cherry; the arch is a
full-width still; the marquee is a static wrapped row; no video.

## Accessibility

One H1. Landmarks header, main, sections with `aria-labelledby`, footer. The menu overlay is a dialog-like
panel with focus moved in and Escape to close. Marquee words and engravings are `aria-hidden`; every
photo has a describing alt. Ticks are `role="img"` with the places sentence. 44px targets. Focus: chili
ring on light and noir grounds, cotton ring on cherry, maroon and oxblood.

## Do's and Don'ts

### Do
- Use the arrow-circle link for every secondary action; square buttons for primary.
- Keep photographs full-bleed or in cards with 4px corners; the marquee cards alone are rounded 18px.
- Count places from `content/campaign.json` only.

### Don't
- No pills, no glow, no sheen, no giant wordmark, no numbered eyebrows (Hair & Beauty's language).
- No Archivo, Newsreader or Inter.
- No gradients; scrims are solid noir at an alpha.
- No second sticky stage; no scroll-jacking.

## v2.1 additions (2026-10-25, Rustam's review)

- **Wordmark everywhere.** `CONVENIUM.` in Archivo 900 at -.045em with the dot in the accent is the studio
  lockup shared with Hair & Beauty: centred in the bar (dot chili-300 on noir), on the legal pages, and run
  gutter to gutter on a noir band at the foot of the footer (Archivo 900 at -.05em, 6.8em container fit).
  Archivo is loaded for the wordmark only.
- **Hero film.** A scroll-scrubbed canvas sequence (175 WebP frames, 1600×900, 9.8 MB): 121 frames of an
  Artlist film (Nano Banana Pro start frame in Hair & Beauty's still-life language, Kling v3 Pro 1080p push-in),
  then the 54 CONVENIUM logo frames shared with Hair & Beauty, so both pages close on the same brand moment.
  Desktop: the photo opens from its half to full screen while the copy slides aside; phone: the photo rises
  under the copy. 340vh runway (260vh phone), sticky stage at 100dvh. Reduced motion, no JS and Save-Data
  keep the static split with the first frame as poster.
- **3D room.** Four Artlist 3D renders (cherries, Kasnudeln plate, fork, wine glass), cut to alpha, frame
  the statement: they rise in from depth, drift with the scroll and tilt with the pointer on desktop, float
  on phones. Soft drop-shadow on the objects only.
- **Wide screens.** `--max` 1680px from 1800px; the H1 is also capped at 14.5svh so a 1920×1080 browser
  (≈910px tall viewport) shows the whole hero under the bar.

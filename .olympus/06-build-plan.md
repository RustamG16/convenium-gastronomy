# 06 — Build plan: "Die Karte" (Convenium · Gastronomie)

## Research basis — Awwwards restaurant sites, 2026

Fetched via web search of awwwards.com listings on 2026-10-22 (direct page fetches were refused by the
session's egress policy). What repeats across the recognised restaurant and food sites:

| Trait that repeats | Evidence |
|---|---|
| Big, fullscreen imagery and dark, atmospheric grounds | La table de Joakim (Nominee, Aug 2026; tags Big Background Images, Fullscreen, Parallax, GSAP) https://www.awwwards.com/sites/la-table-de-joakim · Restaurant GEM (Nominee, Oct 2025; fullscreen menu, hover dish preview) https://www.awwwards.com/sites/restaurant-gem |
| Serif, editorial typography for fine dining | Ballena Fine Dining (HM, Jun 2026) https://www.awwwards.com/sites/ballena-fine-dining · Hio Fine Dining (HM) https://www.awwwards.com/sites/hio-fine-dining · Son Daven (SOTD, Jun 2026, 7.62) https://www.awwwards.com/sites/son-daven |
| Restrained two-colour palettes (cream + red) | Crav Burgers (SOTD, Jun 2026; #f5e3cd + #f91814, loader, page transition, GSAP) https://www.awwwards.com/sites/crav-burgers |
| Scroll animation, loaders and transitions as the craft signal | Crav Burgers (above) · La table de Joakim (above) · Units by Big Horror Athens (SOTD, Jul 2026; Lottie) https://www.awwwards.com/bighorror/ |
| The menu as an interactive object | Restaurant GEM (fullscreen menu, on-hover dish preview) · Gourou Indian Food (HM, Feb 2026; menu video, unusual navigation) https://www.awwwards.com/sites/gourou-indian-food |
| Custom type and illustration for casual concepts | Burrito Madre (HM, Jul 2026; Typography, Illustration, Colorful) https://www.awwwards.com/sites/burrito-madre |
| Category listings consulted | https://www.awwwards.com/websites/hotel-restaurant/ · https://www.awwwards.com/websites/food-drink/ · De Groene Afslag (HM, Jul 2026), Lingers (HM, Aug 2026), Délice (HM, Sep 2026) |

**Transferable principles → our gastro design DNA** (no distinctive expression copied):

1. The page is a menu card. Numbered courses, dotted leaders, the price at the right edge, paper with
   registration corners. (From "the menu as an interactive object".)
2. The room is dark, the card is paper. Noir ground for hero, launch module, example and footer; the
   cotton/paper sheet for the Karte and the reservation. (From the dark grounds.) Our palette already is
   the cream-and-red pair the best fast-casual site uses; we use it with cherry as the rare accent.
3. The serif speaks. Newsreader carries every headline; Archivo only prices and numerals. (From the
   fine-dining serifs; the opposite of Hair & Beauty's Archivo-led chapters.)
4. One hero moment: the table for ten is set. Ten plates land one after another; they are the ten places,
   counted live. (From "craft signal through motion", kept to a single moment per the Kinetic rule.)
5. Hover reveals: the course cards light up (glow + sheen, carried over as asked); the SAVRA door plays
   its loop. (From "hover dish preview".)
6. Shorter: four chapters. Hero · Karte · Launch · Küche · Ablauf · Reservierung.

## Art direction, palette, type — see `DESIGN.md` (numbers committed before the CSS was written).

## Page sequence and media map

| # | Section | Ground | Media | Motion |
|---|---|---|---|---|
| 0 | Header | paper pills over noir | — | arrives −12px → 0 (0.8s); hides on scroll-down |
| 1 | Hero | noir + one maroon light | the table (CSS geometry, 10 plates) | lines rise from masks; plates land; drift on scroll (scrub 1) |
| 2 | Die Karte | cotton, paper sheet | noir course plates with numerals | reveal 18px; glow/sheen on hover; featured breathes; leaders draw |
| 3 | Launch module | noir | — | countdown ticks; chili sheen over the claim (CSS) |
| 4 | Aus der Küche | noir | SAVRA capture 3:4 door, loop on hover | reveal; video opacity 0 → 1 |
| 5 | Ablauf | cotton | — | group reveal, 80ms stagger |
| 6 | Reservierung + FAQ | cotton, paper sheet | — | reveal |
| 7 | Footer | noir | edge-to-edge wordmark | — |

## Beat sheet

| Beat | Trigger | What moves | Duration | Hands off to |
|---|---|---|---|---|
| 1 Arrival | load (motion) | header y −12 → 0, eyebrow fades up | 0.6–0.8s | 2 |
| 2 The name on the door | +0.15s | three H1 lines rise 112 % → 0 inside masks | 1.1s, 90ms stagger | 3 |
| 3 The table is set | +0.5s | table top scales .96 → 1; ten plates scale 1.3 → 1, opacity 0 → 1 | 0.9s / 0.7s, 60ms stagger | scroll |
| 4 Leaving the room | scroll 0 → 100vh | hero copy y 0 → −60, table y 0 → −28 | scrub 1 | 5 |
| 5 The card is read | each chapter enters 88 % | block rises 18px, opacity 0 → 1; leaders scaleX 0 → 1 | 0.9s / 1s | — |
| 6 A course lights up | hover / focus / selected | glow opacity 0 → 1, lift 6px, sheen crosses the plate | 0.45s / 0.5s / 0.9s | — |
| 7 The door opens | hover (fine pointer) or 60 % in view (touch) | SAVRA loop fades in over the still | 0.5s | — |

Reduced motion: beats 1–5 do not exist (static layout, full opacity); 6 keeps a static glow; 7 stays a still.

## Acceptance criteria (encoded refusals)

- One direction, no alternatives. No image sequence, no scissor cut, no dust, no portrait pairs.
- Shorter than Hair & Beauty: no comparison table, no service calculator, four chapters.
- The ten places are the message: counted in the hero, in the launch module, and as plates.
- The cards keep the glow + sheen (the asked-for "shiny effect").
- Only studio tokens; no gradient on any surface, card, control, text or rule (the hero light is the one atmospheric field).
- Nothing hidden from the accessibility tree by motion; all content visible without JavaScript.

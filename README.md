<p align="center">
  <img src="favicon.svg" alt="Convenium · Gastronomie" height="72">
</p>

<h1 align="center">Convenium · Gastronomie</h1>

<p align="center">Convenium Studio's landing page for restaurants, cafés, bars and bakeries: ten launch places at a fixed price, set like a menu card.</p>

<p align="center">
  <a href="https://convenium.at/gastronomy/"><img alt="Target" src="https://img.shields.io/badge/target-convenium.at%2Fgastronomy-810100?style=flat-square"></a>
  <img alt="Status" src="https://img.shields.io/badge/status-demo%20(noindex)-555?style=flat-square">
  <img alt="Stack" src="https://img.shields.io/badge/stack-Static%20%C2%B7%20GSAP-555?style=flat-square">
</p>

---

## Screens

<table>
  <tr>
    <td width="74%"><img src="docs/screenshots/desktop.webp" alt="Convenium · Gastronomie: desktop, first screen — the split hero with the dining room"></td>
    <td width="26%"><img src="docs/screenshots/mobile.webp" alt="Convenium · Gastronomie: phone, first screen"></td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="docs/screenshots/section-1.webp" alt="Die Karte: three photo cards with launch prices"></td>
    <td><img src="docs/screenshots/section-2.webp" alt="The launch module: a cocktail beside the cherry block with the countdown"></td>
  </tr>
</table>

## Direction — "Das Lokal" (v2)

A warm Carinthian dining room in photographs, set the way two restaurant sites Rustam named do it:
**Tigermilk Lyon** for motion (split hero, words that fill as you read, an arch that opens into the room, a
sideways marquee of giant words, engraved cut-outs, a sticky CTA) and **Ballena Cabo** for layout (a centred
floating bar, square buttons, the arrow-circle link, tall photo cards, split colour blocks, a panel over a
photo). Nothing is carried over from Hair & Beauty: no pills, no glow cards, no giant footer wordmark.
Phones get an app-grade shell (thumb-zone tab bar, card rail, safe areas) and their own motion, not a
static fallback. Sources and the beat sheet: `.olympus/06-build-plan.md`; numbers: `DESIGN.md`.

| Role | Typeface | Use |
|---|---|---|
| Voice | Instrument Serif | Headlines, the statement, card and step titles |
| Shout | Anton | Marquee words, prices, countdown, step numerals |
| Interface | Instrument Sans | Labels, buttons, body, inputs |

Palette: the studio's noir · cotton · paper · ink · gray · hairline · cherry · maroon · chili, plus three
grades mixed from them (blush, oxblood, rose). Photography: 13 stills generated with Artlist (Nano Banana
Pro) for this page; SAVRA is a real capture.

## Stack

| Layer | Choice |
|---|---|
| Site | Static HTML/CSS/JS, rendered by `node build.mjs` from `content/*.json` (DE at `/`, EN at `/en/`) |
| Motion | GSAP 3.15 + ScrollTrigger, vendored in `assets/kit/vendor/`; one sticky stage (the arch), native scroll |
| Fonts | Instrument Serif, Anton, Instrument Sans (OFL), self-hosted in `assets/kit/fonts/` |
| Security | CSP meta with one hashed inline script; `.htaccess` mirrors it as Report-Only on the host |

## Run locally

```bash
node build.mjs                                  # renders index.html, en/, the four legal pages, .htaccess
python -m http.server 4173 --directory .        # or: npx http-server . -p 4173
```

Open `http://localhost:4173/` and `http://localhost:4173/en/`. Edit `content/*.json`, `src/*.mjs`,
`styles.css`, `script.js`, `campaign.js`; the HTML files are build output.

## Deploy

Every push to `main` deploys to `https://convenium.at/gastronomy/` (`.github/workflows/deploy-godaddy.yml`,
rsync over SSH, never deletes) once the six GoDaddy secrets are set on this repository. GitHub Pages can
serve `main` as a staging mirror. A push is a deploy: Rustam's word only.

## Structure

```
index.html, en/index.html    DE and EN pages (generated)
impressum/, datenschutz/     legal pages, DE (generated); en/imprint/, en/privacy/ (generated)
content/                     de.json, en.json (copy), campaign.json (prices, places, clock), launch.json
src/                         render.mjs (page), legal.mjs (legal pages)
styles.css, script.js        the design and the interactions/motion
campaign.js                  launch prices, countdown, the ten places (ticks)
assets/                      kit (fonts, GSAP), photos (Artlist stills, WebP), savra (real capture)
DESIGN.md, PRODUCT.md        the design system as numbers; what the page is for
.olympus/                    brief, build plan (research basis, beat sheet), QA log
```

## Status

Demo page: `noindex`, no data collection, the inquiry only prepares a text to copy. Legal fields are open
(`content/launch.json`), SAVRA is a concept build, not a client project.

---

<sub>Designed and built by Convenium Studio, Klagenfurt.</sub>

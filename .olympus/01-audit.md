# 01 — Mobile audit, before (2026-10-27, commit 452506d)

Playwright 1.48.2 / Chromium, static server, 390×844 @2x, isMobile, scrolled through once. 320×568 for overflow.
Targets: `a, button, input, select, summary, [role=button]` with a box under 24 px in either axis.

| Route | Screens 390×844 | Screens 320×568 | overflowX (320) | Targets < 24 px | Inputs < 16 px | Tab bar | Body font |
|---|---|---|---|---|---|---|---|
| `/` | 15.78 | 21.85 | no | 4 | 1 | yes | 16 |
| `/en/` | 15.65 | 21.57 | no | 4 | 1 | yes | 16 |
| `/impressum/` | 1.74 | 2.86 | no | 5 | 0 | no | 16 |
| `/datenschutz/` | 2.46 | 4.26 | no | 2 | 0 | no | 16 |
| `/en/imprint/` | 1.74 | 2.77 | no | 5 | 0 | no | 16 |
| `/en/privacy/` | 2.21 | 3.70 | no | 2 | 0 | no | 16 |

Small targets: `.card-market a` ×3 (46×16), `.campaign-source` (258×22); legal: locale link (23×44), mailto/tel/RIS and
back links (×20 high). Input < 16 px: `.preview` textarea (15 px).

Home sections, screens at 390×844: top (scroll-film hero) 2.60 · statement 0.77 · arch 1.90 · karte 2.88 · launch 1.23 ·
marquee 0.32 · beispiel 1.22 · ablauf 1.14 · reservierung 2.17 · fusszeile 1.55.

Karte breakdown (px): sec-head 239 · card rail 494 · extras 363 · value 315 · menu-note 108 · menu-sources 496.

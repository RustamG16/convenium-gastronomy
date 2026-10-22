# PRODUCT.md — Convenium · Gastronomie

**What it is.** The gastronomy pillar's landing page: Convenium Studio's offer of bespoke websites for
restaurants, cafés, bars and bakeries in Klagenfurt, with ten launch places at a fixed launch price.
Sister of the Hair & Beauty pillar (`convenium.at/hair-beauty/`), deployed to `convenium.at/gastronomy/`.

**Who it is for.** Owners of small gastronomy businesses in Carinthia who have no website or a template
one, read German first, decide on their phone, and want to see the price before they talk to anyone.

**The one job.** Make the reader understand in one screen that there are ten places at a launch price, see
the three packages with their prices and the market average next to them, see one real example, and send
a two-sentence inquiry (in demo mode: copy a prepared text).

**What it says, in order.** 1 Hero: your venue, a table of its own online; ten places, counted. 2 Die
Karte: three courses with launch prices, extras on the side, what every course includes, the sources.
3 Launch module: the clock, the places. 4 Aus der Küche: SAVRA, a concept build, live. 5 Ablauf: three
steps. 6 Reservierung: the composer and four questions.

**What it must not do.** Invent clients, metrics or outcomes; promote SAVRA to a client project; change
prices or claim wording (Rustam's, 2026-10-06); send anything (demo mode); track anyone.

**Facts it carries.** Prices from `content/campaign.json` (website €500 · +SEO €700 · +Social €990;
extras €150 / €150 / €39 a month), end date 15.11.2026, ten places, market sources (exponent.at,
Die Marketing Nerds). Contact: convenium@outlook.com, +43 690 10682073.

**Stack.** Static HTML built by `node build.mjs` from `content/*.json`; GSAP + ScrollTrigger vendored;
self-hosted Archivo / Newsreader / Inter; CSP with one hashed inline script; no third parties.

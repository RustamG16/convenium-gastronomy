# Prompt — continue the Gastronomie landing page locally (Claude Code / Claude Desktop)

Copy everything below the line into a fresh Claude Code session opened in the local clone of
`RustamG16/convenium-gastronomy`, with `005-agency` and `Apollo` available as sibling folders.

If the GitHub repository does not exist yet (the cloud session could not create repositories): create an
empty public repo `convenium-gastronomy` under RustamG16 on github.com, unpack `convenium-gastronomy.zip`
(it contains the full working tree and the `.git` history), then
`git remote add origin git@github.com:RustamG16/convenium-gastronomy.git && git push -u origin main`.

---

Continue the Convenium · Gastronomie landing page in this repo (`convenium-gastronomy`). It was built in
a cloud session on 2026-10-22 and pushed to `main`; read these first, in this order:

1. `README.md` — what it is, how to build and run (`node build.mjs`, then serve the folder).
2. `.olympus/00-brief.md` — the resolved brief (Rustam's instruction and what was decided from it).
3. `.olympus/06-build-plan.md` — the design: Awwwards research basis with URLs, the gastro design DNA,
   page sequence, media map, beat sheet, acceptance criteria.
4. `DESIGN.md` — the token block as numbers (type ramp, measured contrast pairs, motion), do's and don'ts.
5. `.olympus/07-qa.md` — what was verified in the cloud (Playwright: console, overflow, reduced motion at
   1920 and 390) and what was NOT (axe, contrast crawl, keyboard path, Safari video, Lighthouse).

Context you need: the sister page is `../convenium-hair-beauty` (built by
`../005-agency/Landing-Template/build.mjs`); this page deliberately does NOT use that template — it has
its own `src/render.mjs`, `styles.css`, `script.js` so the style is unique (direction "Die Karte": noir
room, paper menu card, Newsreader-led, ten plates = ten launch places, course cards with the H&B glow +
sheen). Brand tokens come from `../005-agency/DESIGN.md`; prices and sources from
`../005-agency/content/campaign.json` (Rustam's, 2026-10-06 — never change them). Apollo doctrine is in
`../Apollo/AGENTS.md` (one direction, QA repair bounded to two cycles, no invented facts). Rules from
`../005-agency/CLAUDE.md` apply: colours only from tokens, no gradients on functional content, chili focus
ring, reveals never remove anything from the accessibility tree, decide instead of offering options.

Do, in this order, and log each session at the end of `.olympus/07-qa.md`:

1. `node build.mjs` and open `/` and `/en/` in a real browser at 1440, 1920 and 390. Watch the hero beat
   (lines rise, plates land), the course cards' glow/sheen on hover, the SAVRA door loop on hover, the
   countdown, and the composer (choose a course → `?package=…#reservierung`, copy the text).
2. Run the independent finish review the doctrine requires: score against `DESIGN.md`, not taste; list
   defects; fix at most two cycles. Known candidates: the launch module's claim wraps to five lines at
   1440 (consider a 2-column claim or a shorter wrap width); the course numeral vs H2 size relation is
   discussed in `DESIGN.md § Type`.
3. Accessibility: run axe-core (WCAG 2.1 A/AA) on desktop, phone and with the mobile menu open; crawl
   every visible text node against its effective background; walk the keyboard path header → courses →
   composer → FAQ. Fix what fails.
4. Check `prefers-reduced-motion` and the no-JS page (everything visible, prices static, campaign module hidden).
5. Enable GitHub Pages on `main` (root) as the staging mirror, then verify the live mirror at
   `https://rustamg16.github.io/convenium-gastronomy/` and `/en/`.
6. Do NOT deploy to convenium.at and do NOT edit `005-agency` (`content/industries.ts` gastronomy entry,
   `content/campaign.json`) until Rustam says "deploy"; when he does, follow
   `../005-agency/docs/superpowers/specs/2026-10-18-pillar-subfolders-design.md § Deploy order` with
   `PILLAR_PATH: gastronomy/`.
7. Media is open: there is no gastro photography beyond the SAVRA capture. If Rustam wants stills on the
   course plates like Hair & Beauty's cards, propose a shot list first; any Higgsfield spend needs his
   explicit yes in chat with the price shown.

Commit on `main` with conventional messages; the HTML files are build output and are committed.

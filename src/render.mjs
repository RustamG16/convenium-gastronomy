// Convenium · Gastronomie — page renderer, v2 "Das Lokal". One template, two locales (DE at /, EN at /en/).
// Everything the page says comes from content/<locale>.json and content/campaign.json; nothing is composed
// here that the content does not carry. Markup is static and complete without JavaScript.

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

export const INLINE = "if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('pre')";

export function csp(hash) {
  return `default-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'sha256-${hash}'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`;
}

const money = (loc, n) => new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const fill = (tpl, map) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));

// The arrow-circle link (Ballena): the page's repeating secondary action.
const arrowLink = (href, label, attrs = '', extra = '') => `<a class="arrow-link" href="${href}" ${attrs}><span>${label}</span>${extra}<span class="arrow-dot" aria-hidden="true"></span></a>`;
// The ten places as ticks; campaign.js marks the taken ones through [data-plate].
const ticks = (n, label) => `<span class="ticks" role="img" aria-label="${esc(label)}">${Array.from({ length: n }, (_, i) => `<span class="tick" data-plate="${i + 1}"></span>`).join('')}</span>`;

export function renderPage({ c, camp, base, hash, launch, example }) {
  const de = c.lang === 'de';
  const m = (n) => money(c.numberLocale, n);
  const img = (name) => `${base}assets/photos/${name}.webp`;
  const endDate = new Intl.DateTimeFormat(de ? 'de-AT' : 'en-GB', de ? { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: camp.timezone } : { day: 'numeric', month: 'short', year: 'numeric', timeZone: camp.timezone }).format(new Date(camp.endsAt));
  const cc = camp.copy[c.lang];
  const self = './';
  const other = de ? 'en/' : '../';
  const otherLang = de ? 'en' : 'de';
  const legal = de ? { a: 'impressum/', b: 'datenschutz/' } : { a: 'imprint/', b: 'privacy/' };
  const pkgs = camp.packages.map((p) => ({ ...p, copy: c.menu.items[p.id] }));
  const slotsText = fill(cc.table, { n: camp.slotsLeft, total: camp.slotsTotal });
  const i18n = {
    locale: c.lang, numberLocale: c.numberLocale,
    examples: { savra: c.example.name },
    packages: Object.fromEntries(pkgs.map((p) => [p.id, { name: p.copy.name, price: p.launch, onRequest: false }])),
    none: c.inquiry.none, chosen: c.inquiry.chosen, selected: c.inquiry.selected, packageSelected: c.inquiry.packageSelected,
    success: c.inquiry.success, failure: c.inquiry.failure, menu: c.nav.menuBtn, close: c.nav.close,
    motionPause: c.example.motionPause, motionPlay: c.example.motionPlay, onRequest: cc.onRequest,
    draft: c.inquiry.draft
  };

  const course = (p, i) => {
    const featured = i === 1;
    return `
          <li class="card${featured ? ' card--featured' : ''}" data-package="${p.id}" data-reveal-card>
            <article aria-labelledby="course-${p.id}">
              <div class="card-photo">
                <img loading="lazy" decoding="async" src="${img(`course-${i + 1}`)}" width="1195" height="1600" alt="${esc(p.copy.alt)}">
                <p class="card-band"><span>${esc(c.menu.course)} ${i + 1} · ${esc(p.copy.name)}</span>${featured ? `<span class="card-flag">${esc(c.menu.featured)}</span>` : ''}</p>
                <div class="card-foot">
                  <h3 class="card-title" id="course-${p.id}">${esc(p.copy.title)}</h3>
                  <p class="course-price"><span class="plan-from">${esc(c.menu.from)}</span> <span class="plan-amount" data-camp-pkg="${p.id}">${m(p.launch)}</span> <span class="plan-unit">${esc(c.menu.once)}</span></p>
                  <p class="plan-then" data-camp-then="${p.id}">${esc(fill(cc.until, { date: endDate }))}</p>
                  <p class="card-market">${esc(cc.market)} <a href="#marktquellen">${m(p.market)}</a></p>
                  ${arrowLink(`?package=${p.id}#reservierung`, esc(c.menu.choose), `data-choose-package="${p.id}"`, '<span class="sr-only" data-chosen></span>')}
                </div>
              </div>
              <ul class="card-includes">${p.copy.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </article>
          </li>`;
  };

  const words = c.statement.text.split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(' ');
  const extras = c.menu.extras.map((x) => `<li><span class="menu-item"><strong>${esc(x.name)}</strong><small>${esc(x.why)}</small></span><span class="menu-price">${m(x.price)}<small>${esc(x.unit)}</small></span></li>`).join('');
  const value = c.menu.value.map(([t, s]) => `<li><strong>${esc(t)}</strong><span>${esc(s)}</span></li>`).join('');
  const sources = camp.claim.sources.map((s) => `<li><span class="menu-source-what">${esc(s.what[c.lang])}: ${m(s.low)}–${m(s.high)}</span><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}<span class="sr-only">${esc(c.example.newTab)}</span> <span aria-hidden="true">↗</span></a></li>`).join('');
  const steps = c.process.steps.map(([t, s], i) => `<li><span class="step-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(s)}</p></li>`).join('');
  const faq = c.faq.items.map(([q, a]) => `<details><summary>${esc(q)}<span class="faq-mark" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join('');
  // Marquee: word, photo, word, photo … twice, so the track is long enough to travel; decorative.
  const foods = ['food-1', 'food-2', 'food-3'];
  const run = c.marquee.words.map((w, i) => `<span class="mq-word${i % 2 ? ' mq-word--accent' : ''}">${esc(w)}</span>${i < foods.length ? `<img class="mq-card" src="${img(foods[i])}" width="1100" height="1100" alt="" loading="lazy" decoding="async">` : '<span class="mq-dot"></span>'}`).join('');

  const navLinks = `<a href="#karte">${esc(c.nav.menu)}</a><a href="#beispiel">${esc(c.nav.example)}</a><a href="#ablauf">${esc(c.nav.process)}</a>`;
  const localeLinks = (cls) => `<p class="${cls}"><a href="${de ? self : other}" ${de ? 'aria-current="page"' : 'hreflang="de" lang="de" data-locale-link data-base="../"'}>${esc(c.nav.deLong)}</a><a href="${de ? other : self}" ${de ? 'hreflang="en" lang="en" data-locale-link data-base="en/"' : 'aria-current="page"'}>${esc(c.nav.enLong)}</a></p>`;

  return `<!doctype html>
<html lang="${c.lang}" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="${csp(hash)}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="noindex,nofollow">
  <title>${esc(c.title)}</title>
  <meta name="description" content="${esc(c.description)}">
  <meta name="theme-color" content="#810100">
  <link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
  <script>${INLINE}</script>
  <link rel="alternate" hreflang="de" href="${de ? './' : '../'}">
  <link rel="alternate" hreflang="en" href="${de ? 'en/' : './'}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(c.title)}">
  <meta property="og:description" content="${esc(c.description)}">
  <meta property="og:locale" content="${c.ogLocale}">
  <meta property="og:image" content="${base}og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/kit/fonts/instrument-serif-400.woff2">
  <link rel="preload" as="image" href="${img('hero-room')}">
  <link rel="stylesheet" href="${base}assets/kit/fonts/fonts.css">
  <link rel="stylesheet" href="${base}styles.css">
  <script defer src="${base}assets/kit/vendor/gsap.min.js"></script>
  <script defer src="${base}assets/kit/vendor/ScrollTrigger.min.js"></script>
  <script defer src="${base}campaign.js"></script>
  <script defer src="${base}script.js"></script>
</head>
<body>
  <a class="skip" href="#inhalt">${esc(c.skip)}</a>

  <header class="bar">
    <a class="btn btn--ghost bar-cta" href="#reservierung">${esc(c.nav.cta)}</a>
    <a class="bar-mark" href="#top" aria-label="${esc(c.brandLabel)}">Convenium</a>
    <button class="bar-menu js-only" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle><span class="bar-lines" aria-hidden="true"></span><span class="sr-only" data-menu-label>${esc(c.nav.menuBtn)}</span></button>
    <a class="bar-menu nojs-only" href="#fusszeile"><span class="bar-lines" aria-hidden="true"></span><span class="sr-only">${esc(c.nav.menuBtn)}</span></a>
  </header>

  <div class="menu" id="menu" hidden>
    <nav class="menu-nav" aria-label="${esc(c.nav.main)}">
      ${navLinks}
      <a href="#reservierung">${esc(c.nav.cta)}</a>
    </nav>
    ${localeLinks('menu-locale')}
  </div>

  <main id="inhalt">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <figure class="hero-photo"><img src="${img('hero-room')}" width="1289" height="1600" alt="${esc(c.hero.alt)}" fetchpriority="high"></figure>
      <div class="hero-panel">
        <p class="label">${esc(c.hero.eyebrow)}</p>
        <h1 id="hero-title"><span class="line"><span class="line-inner">${esc(c.hero.line1)}</span></span><span class="line"><em class="line-inner">${esc(c.hero.line2)}</em></span><span class="line"><em class="line-inner">${esc(c.hero.line3)}</em></span></h1>
        <p class="hero-body">${esc(c.hero.body)}</p>
        <div class="actions">
          <a class="btn btn--solid" href="#karte">${esc(c.hero.primary)}</a>
          ${arrowLink('#reservierung', esc(c.hero.secondary))}
        </div>
        <div class="hero-places">
          <p class="label label--quiet">${esc(c.hero.ticksLabel)}</p>
          ${ticks(camp.slotsTotal, c.hero.tableSr)}
          <p class="places-count" data-camp-slots>${esc(slotsText)}</p>
        </div>
        <img class="cut cut--cherries" src="${img('cut-cherries')}" width="451" height="700" alt="" aria-hidden="true" data-cut>
      </div>
    </section>

    <section class="statement" aria-labelledby="statement-label">
      <div class="wrap">
        <p class="label" id="statement-label">${esc(c.statement.label)}</p>
        <p class="statement-text" data-fill>${words}</p>
      </div>
      <img class="cut cut--glass" src="${img('cut-glass')}" width="502" height="700" alt="" aria-hidden="true" data-cut>
    </section>

    <section class="arch" aria-labelledby="arch-line" data-arch>
      <div class="arch-sticky">
        <figure class="arch-frame" data-arch-frame><img loading="lazy" decoding="async" src="${img('arch-bar')}" width="1600" height="1073" alt="${esc(c.arch.alt)}"></figure>
        <p class="arch-line" id="arch-line">${esc(c.arch.line)}</p>
      </div>
    </section>

    <section class="karte" id="karte" aria-labelledby="karte-title">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <p class="label">${esc(c.menu.label)}</p>
            <h2 id="karte-title">${esc(c.menu.title)} <em>${esc(c.menu.titleAccent)}</em></h2>
          </div>
          <p class="sec-intro">${esc(c.menu.intro)}</p>
        </div>
        <ol class="cards" data-rail>${pkgs.map(course).join('')}
        </ol>
        <p class="rail-count" aria-hidden="true" data-rail-count>1 / 3</p>
        <div class="menu-foot">
          <div class="extras">
            <h3 class="label">${esc(c.menu.extrasTitle)}</h3>
            <ul class="menu-list">${extras}</ul>
          </div>
          <div class="value">
            <h3 class="label">${esc(c.menu.valueTitle)}</h3>
            <ul>${value}</ul>
          </div>
        </div>
        <p class="menu-note">${esc(c.menu.note)}</p>
        <div class="menu-sources" id="marktquellen">
          <h3 class="label">${esc(cc.claimSource)}</h3>
          <ul>${sources}</ul>
          <p>${esc(cc.sourcesNote)} ${esc(cc.after)}</p>
        </div>
      </div>
    </section>

    <section class="campaign" id="launch" aria-labelledby="campaign-label" data-campaign>
      <figure class="campaign-photo"><img loading="lazy" decoding="async" src="${img('food-4')}" width="1100" height="1100" alt="${esc(c.launchAlt)}"></figure>
      <div class="campaign-block">
        <p class="label campaign-label" id="campaign-label" data-camp="label"></p>
        <p class="campaign-claim"><span data-camp="claim"></span></p>
        <a class="campaign-source" href="#marktquellen" data-camp="source"></a>
        <p class="campaign-count" role="timer" data-camp="count"><span class="campaign-ends" data-camp="ends"></span> <span class="campaign-units" data-camp="units" aria-hidden="true"></span></p>
        <p class="campaign-slots" data-camp="slots"></p>
        <p class="campaign-regular" data-camp="after"></p>
        <a class="btn btn--light campaign-cta" href="#karte" data-camp="cta"></a>
        <p class="campaign-risk" data-camp="risk"></p>
      </div>
    </section>

    <section class="marquee" aria-label="${esc(c.marquee.sr)}" data-marquee>
      <div class="mq-track" aria-hidden="true" data-mq-track>${run}${run}</div>
    </section>

    <section class="example" id="beispiel" aria-labelledby="example-title" data-door>
      <figure class="example-bg">
        <picture>
          <source media="(max-width: 1023px)" srcset="${base}assets/savra/cover-portrait.jpg">
          <img loading="lazy" decoding="async" src="${base}assets/savra/cover.jpg" width="1440" height="810" alt="${esc(c.example.alt)}">
        </picture>
        <video class="door-video" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-door-video data-src-wide="${base}assets/savra/loop.mp4" data-src-narrow="${base}assets/savra/loop-portrait.mp4"></video>
      </figure>
      <div class="wrap example-wrap">
        <article class="savra-panel" data-concept="savra" aria-labelledby="example-title" data-reveal>
          <p class="label">${esc(c.example.label)}</p>
          <h2 id="example-title">${esc(c.example.title)} <em>${esc(c.example.titleAccent)}</em></h2>
          <p class="example-intro">${esc(c.example.intro)}</p>
          <p class="status">${esc(c.example.name)} · ${esc(c.example.status)}</p>
          <div class="savra-actions">
            ${arrowLink(esc(example.url), esc(c.example.live), 'target="_blank" rel="noopener noreferrer"', `<span class="sr-only">${esc(c.example.newTab)}</span>`)}
            ${arrowLink('?example=savra#reservierung', esc(c.example.choose), 'data-choose="savra"', '<span class="sr-only" data-chosen></span>')}
          </div>
          <p class="caption">${esc(c.example.caption)}</p>
          <button class="text-button motion-toggle js-only" type="button" aria-pressed="false" data-motion-toggle>${esc(c.example.motionPause)}</button>
        </article>
      </div>
    </section>

    <section class="process" id="ablauf" aria-labelledby="process-title">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <p class="label">${esc(c.process.label)}</p>
            <h2 id="process-title">${esc(c.process.title)} <em>${esc(c.process.titleAccent)}</em></h2>
          </div>
          <img class="cut cut--cup" src="${img('cut-cup')}" width="700" height="537" alt="" aria-hidden="true" data-cut>
        </div>
        <ol class="steps" data-reveal-group>${steps}</ol>
      </div>
    </section>

    <section class="inquiry" id="reservierung" aria-labelledby="inquiry-title">
      <div class="wrap">
        <div class="inquiry-grid">
          <div class="inquiry-intro" data-reveal>
            <p class="label">${esc(c.inquiry.label)}</p>
            <h2 id="inquiry-title" tabindex="-1">${esc(c.inquiry.title)} <em>${esc(c.inquiry.titleAccent)}</em></h2>
            <p>${esc(c.inquiry.body)}</p>
            <p class="demo-note">${esc(c.inquiry.demo)}</p>
          </div>
          <div class="composer" role="group" aria-labelledby="inquiry-title" data-reveal>
            <div class="selection js-only" role="group" aria-labelledby="sel-label">
              <span class="field-label" id="sel-label">${esc(c.inquiry.selected)}</span>
              <strong class="selection-value" data-selection-name>${esc(c.inquiry.none)}</strong>
              <button class="text-button" type="button" data-clear aria-disabled="true">${esc(c.inquiry.clear)}</button>
            </div>
            <div class="selection js-only" role="group" aria-labelledby="pkg-label">
              <span class="field-label" id="pkg-label">${esc(c.inquiry.packageSelected)}</span>
              <strong class="selection-value" data-package-name>${esc(c.inquiry.none)}</strong>
              <button class="text-button" type="button" data-clear-package aria-disabled="true">${esc(c.inquiry.packageClear)}</button>
            </div>
            <div class="fields-2 js-only">
              <div><label class="field-label" for="f-business">${esc(c.inquiry.business)}</label><input id="f-business" type="text" autocomplete="organization" maxlength="120"></div>
              <div><label class="field-label" for="f-location">${esc(c.inquiry.location)}</label><input id="f-location" type="text" maxlength="120"></div>
            </div>
            <div class="js-only"><label class="field-label" for="f-message">${esc(c.inquiry.idea)}</label><textarea id="f-message" rows="3" maxlength="1200"></textarea></div>
            <div>
              <label class="field-label" for="inquiry-preview">${esc(c.inquiry.preview)}</label>
              <textarea class="preview" id="inquiry-preview" rows="7" readonly data-preview>${esc(c.inquiry.template)}</textarea>
            </div>
            <p class="fallback nojs-only">${esc(c.inquiry.fallback)}</p>
            <div class="composer-actions js-only">
              <button class="btn btn--solid" type="button" data-copy>${esc(c.inquiry.copy)}</button>
            </div>
            <p class="status-line" role="status" aria-live="polite" data-status></p>
          </div>
        </div>
        <div class="faq" data-reveal>
          <h2>${esc(c.faq.title)} <em>${esc(c.faq.titleAccent)}</em></h2>
          <div class="faq-list">${faq}</div>
        </div>
      </div>
    </section>
  </main>

  <a class="btn btn--solid sticky-cta js-only" href="#karte" data-sticky data-label-later="${esc(c.nav.cta)}">${esc(c.sticky)}</a>

  <nav class="tabbar" aria-label="${esc(c.nav.mobile)}">
    <a href="#karte" data-tab="karte"><span class="tab-icon tab-icon--menu" aria-hidden="true"></span>${esc(c.nav.menu)}</a>
    <a href="#beispiel" data-tab="beispiel"><span class="tab-icon tab-icon--door" aria-hidden="true"></span>${esc(c.nav.example)}</a>
    <a href="#ablauf" data-tab="ablauf"><span class="tab-icon tab-icon--steps" aria-hidden="true"></span>${esc(c.nav.process)}</a>
    <a class="tabbar-cta" href="#reservierung" data-tab="reservierung">${esc(c.nav.cta)}</a>
  </nav>

  <footer class="site-footer" id="fusszeile">
    <div class="wrap footer-grid">
      <div class="footer-studio">
        <img class="footer-photo" loading="lazy" decoding="async" src="${img('chef')}" width="1195" height="1600" alt="${esc(c.footer.photoAlt)}">
        <div>
          <p class="footer-about">${esc(c.footer.about)}</p>
          <p class="label label--rose">${esc(c.footer.contactTitle)}</p>
          <p class="footer-contact"><a href="mailto:${esc(launch.email)}">${esc(launch.email)}</a><a href="tel:${esc(launch.phone.replace(/\s/g, ''))}">${esc(launch.phone)}</a></p>
        </div>
      </div>
      <nav class="footer-nav" aria-label="${esc(c.nav.foot)}">
        <p class="label label--rose">${esc(c.footer.navTitle)}</p>
        ${navLinks}
        <a href="#reservierung">${esc(c.nav.cta)}</a>
        <a href="${other}" hreflang="${otherLang}" lang="${otherLang}" data-locale-link data-base="${other}">${esc(c.footer.otherLocale)}</a>
        <a href="#top">${esc(c.footer.top)}</a>
      </nav>
      <div class="footer-places">
        <p class="label label--rose">${esc(c.footer.placesTitle)}</p>
        ${ticks(camp.slotsTotal, c.hero.tableSr)}
        <p class="places-count" data-camp-slots>${esc(slotsText)}</p>
        <a class="btn btn--light" href="#reservierung">${esc(c.nav.cta)}</a>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <p class="footer-signature"><a href="${esc(launch.studioUrl)}" aria-label="${esc(c.footer.studio)}">${esc(c.footer.signature)}</a></p>
      <p class="footer-legal"><span>${esc(c.footer.legal)}</span><a href="${legal.a}">${esc(c.footer.imprint)}</a><a href="${legal.b}">${esc(c.footer.privacy)}</a></p>
      <p>© 2026 Convenium</p>
    </div>
  </footer>

  <script type="application/json" id="campaign">${JSON.stringify(camp)}</script>
  <script type="application/json" id="i18n">${JSON.stringify(i18n)}</script>
</body>
</html>
`;
}

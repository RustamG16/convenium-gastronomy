// Convenium · Gastronomie — page renderer. One template, two locales (DE at /, EN at /en/).
// Everything the page says comes from content/<locale>.json and content/campaign.json; nothing is
// composed here that the content does not carry. Markup is static and complete without JavaScript.

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

export const INLINE = "if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('pre')";

export function csp(hash) {
  return `default-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'sha256-${hash}'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`;
}

const money = (loc, n) => new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const fill = (tpl, map) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));

export function renderPage({ c, camp, base, hash, launch, example }) {
  const de = c.lang === 'de';
  const m = (n) => money(c.numberLocale, n);
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

  const plates = Array.from({ length: camp.slotsTotal }, (_, i) => `<li class="plate" data-plate="${i + 1}"><span class="plate-num">${String(i + 1).padStart(2, '0')}</span></li>`).join('');

  const course = (p, i) => {
    const featured = i === 1;
    return `
          <li class="course${featured ? ' course--featured' : ''}" data-package="${p.id}" data-reveal>
            <div class="course-plate" aria-hidden="true">
              <span class="course-num">${String(i + 1).padStart(2, '0')}</span>
              <span class="course-chip">${esc(c.menu.chip)}</span>
              ${featured ? `<span class="course-chip course-chip--right">${esc(c.menu.featured)}</span>` : ''}
            </div>
            <div class="course-body">
              <h3><span class="course-name">${esc(c.menu.course)} ${i + 1} · ${esc(p.copy.name)}</span><span class="course-title">${esc(p.copy.title)}</span></h3>
              <p class="course-price"><span class="plan-from">${esc(c.menu.from)}</span> <span class="plan-amount" data-camp-pkg="${p.id}">${m(p.launch)}</span> <span class="plan-unit">${esc(c.menu.once)}</span></p>
              <p class="plan-then" data-camp-then="${p.id}">${esc(fill(cc.until, { date: endDate }))}</p>
              <ul class="course-includes">${p.copy.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
              <p class="course-market"><span class="course-market-label">${esc(cc.market)}</span><span class="leader" aria-hidden="true"></span><a class="course-market-value" href="#marktquellen">${m(p.market)}</a></p>
              <a class="course-choose" href="?package=${p.id}#reservierung" data-choose-package="${p.id}"><span>${esc(c.menu.choose)}</span><span class="sr-only" data-chosen></span><span class="arrow" aria-hidden="true">→</span></a>
            </div>
          </li>`;
  };

  const extras = c.menu.extras.map((x) => `<li><span class="menu-item"><strong>${esc(x.name)}</strong><small>${esc(x.why)}</small></span><span class="leader" aria-hidden="true"></span><span class="menu-price">${m(x.price)}<small>${esc(x.unit)}</small></span></li>`).join('');
  const value = c.menu.value.map(([t, s]) => `<li><strong>${esc(t)}</strong><span>${esc(s)}</span></li>`).join('');
  const sources = camp.claim.sources.map((s) => `<li><span class="menu-source-what">${esc(s.what[c.lang])}: ${m(s.low)}–${m(s.high)}</span><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}<span class="sr-only">${esc(c.example.newTab)}</span> <span aria-hidden="true">↗</span></a></li>`).join('');
  const steps = c.process.steps.map(([t, s], i) => `<li><span class="step-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(s)}</p></li>`).join('');
  const faq = c.faq.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');

  const nav = (cls) => `<a href="#karte">${esc(c.nav.menu)}${cls ? ' <span aria-hidden="true">→</span>' : ''}</a><a href="#beispiel">${esc(c.nav.example)}${cls ? ' <span aria-hidden="true">→</span>' : ''}</a><a href="#ablauf">${esc(c.nav.process)}${cls ? ' <span aria-hidden="true">→</span>' : ''}</a>`;

  return `<!doctype html>
<html lang="${c.lang}" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="${csp(hash)}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="noindex,nofollow">
  <title>${esc(c.title)}</title>
  <meta name="description" content="${esc(c.description)}">
  <meta name="theme-color" content="#1B1717">
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
  <link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/kit/fonts/newsreader-1.woff2">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/kit/fonts/newsreader-0.woff2">
  <link rel="stylesheet" href="${base}assets/kit/fonts/fonts.css">
  <link rel="stylesheet" href="${base}styles.css">
  <script defer src="${base}assets/kit/vendor/gsap.min.js"></script>
  <script defer src="${base}assets/kit/vendor/ScrollTrigger.min.js"></script>
  <script defer src="${base}campaign.js"></script>
  <script defer src="${base}script.js"></script>
</head>
<body>
  <a class="skip" href="#inhalt">${esc(c.skip)}</a>

  <header class="site-header">
    <a class="brand" href="#top" aria-label="${esc(c.brandLabel)}">CONVENIUM<span>.</span></a>
    <nav class="nav-capsule" aria-label="${esc(c.nav.main)}">
      ${nav(false)}
      <span class="locale"><a href="${de ? self : other}" ${de ? 'aria-current="page"' : 'hreflang="de" lang="de" data-locale-link data-base="../"'}>${de ? 'DE' : '<span class="sr-only">Deutsch: </span>DE'}</a><a href="${de ? other : self}" ${de ? 'hreflang="en" lang="en" data-locale-link data-base="en/"' : 'aria-current="page"'}>${de ? '<span class="sr-only">English: </span>EN' : 'EN'}</a></span>
    </nav>
    <a class="pill pill--accent header-cta" href="#reservierung">${esc(c.nav.cta)}</a>
    <button class="pill pill--light menu-toggle js-only" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>${esc(c.nav.menuBtn)}</button>
    <div class="mobile-menu" id="mobile-menu" hidden>
      <nav aria-label="${esc(c.nav.mobile)}">
        ${nav(true)}
        <div class="menu-locale"><a href="${de ? self : other}" ${de ? 'aria-current="page"' : 'hreflang="de" lang="de" data-locale-link data-base="../"'}>${esc(c.nav.deLong)}</a><a href="${de ? other : self}" ${de ? 'hreflang="en" lang="en" data-locale-link data-base="en/"' : 'aria-current="page"'}>${esc(c.nav.enLong)}</a></div>
        <a class="pill pill--accent" href="#reservierung">${esc(c.nav.cta)}</a>
      </nav>
    </div>
  </header>

  <main id="inhalt">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="label">${esc(c.hero.eyebrow)}</p>
          <h1 id="hero-title"><span class="line"><span class="line-inner">${esc(c.hero.line1)}</span></span><span class="line"><em class="line-inner">${esc(c.hero.line2)}</em></span><span class="line"><em class="line-inner">${esc(c.hero.line3)}</em></span></h1>
          <p class="hero-body">${esc(c.hero.body)}</p>
          <div class="actions">
            <a class="pill pill--light" href="#karte">${esc(c.hero.primary)} <span class="arrow" aria-hidden="true">↓</span></a>
            <a class="text-link" href="#reservierung">${esc(c.hero.secondary)} <span class="arrow" aria-hidden="true">→</span></a>
          </div>
        </div>
        <figure class="table">
          <figcaption class="table-caption"><span class="label" id="table-label">${esc(c.hero.tableLabel)}</span><span class="table-count" data-camp-slots>${esc(slotsText)}</span></figcaption>
          <div class="table-top" role="img" aria-label="${esc(c.hero.tableSr)}">
            <ol class="plates" aria-hidden="true">${plates}</ol>
          </div>
          <p class="table-note">${esc(c.hero.tableCaption)}</p>
        </figure>
      </div>
    </section>

    <section class="karte" id="karte" aria-labelledby="karte-title">
      <div class="wrap">
        <div class="sheet">
          <div class="sec-head" data-reveal>
            <div>
              <p class="label">${esc(c.menu.label)}</p>
              <h2 id="karte-title">${esc(c.menu.title)} <em>${esc(c.menu.titleAccent)}</em></h2>
            </div>
            <p class="sec-intro">${esc(c.menu.intro)}</p>
          </div>
          <ol class="courses">${pkgs.map(course).join('')}
          </ol>
          <div class="menu-foot">
            <div class="extras" data-reveal>
              <h3 class="field-label">${esc(c.menu.extrasTitle)}</h3>
              <ul class="menu-list">${extras}</ul>
            </div>
            <div class="value" data-reveal>
              <h3 class="field-label">${esc(c.menu.valueTitle)}</h3>
              <ul>${value}</ul>
            </div>
          </div>
          <p class="menu-note">${esc(c.menu.note)}</p>
          <div class="menu-sources" id="marktquellen">
            <h3 class="field-label">${esc(cc.claimSource)}</h3>
            <ul>${sources}</ul>
            <p>${esc(cc.sourcesNote)} ${esc(cc.after)}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="campaign" id="launch" aria-labelledby="campaign-label" data-campaign>
      <div class="wrap campaign-inner">
        <div class="campaign-head">
          <p class="label campaign-label" id="campaign-label" data-camp="label"></p>
          <p class="campaign-claim"><span class="sheen" data-camp="claim" data-text=""></span> <a class="campaign-source" href="#marktquellen" data-camp="source"></a></p>
        </div>
        <div class="campaign-mid">
          <p class="campaign-count" role="timer" data-camp="count"><span class="campaign-ends" data-camp="ends"></span> <span class="campaign-units" data-camp="units" aria-hidden="true"></span></p>
          <p class="campaign-slots" data-camp="slots"></p>
        </div>
        <div class="campaign-foot">
          <p class="campaign-regular" data-camp="after"></p>
          <a class="campaign-cta" href="#karte" data-camp="cta"></a>
          <p class="campaign-risk" data-camp="risk"></p>
        </div>
      </div>
    </section>

    <section class="example" id="beispiel" aria-labelledby="example-title">
      <div class="wrap example-grid">
        <div class="example-copy" data-reveal>
          <p class="label">${esc(c.example.label)}</p>
          <h2 id="example-title">${esc(c.example.title)} <em>${esc(c.example.titleAccent)}</em></h2>
          <p class="example-intro">${esc(c.example.intro)}</p>
          <button class="text-button motion-toggle js-only" type="button" aria-pressed="false" data-motion-toggle>${esc(c.example.motionPause)}</button>
        </div>
        <article class="concept" data-concept="savra" aria-labelledby="c-savra" data-reveal>
          <figure class="door" data-door>
            <div class="door-frame">
              <picture>
                <source media="(min-width: 1024px)" srcset="${base}assets/savra/cover-portrait.jpg">
                <img loading="lazy" decoding="async" src="${base}assets/savra/cover.jpg" width="1440" height="810" alt="${esc(c.example.alt)}">
              </picture>
              <video class="door-video" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-door-video data-src-wide="${base}assets/savra/loop-portrait.mp4" data-src-narrow="${base}assets/savra/loop.mp4"></video>
              <span class="door-inner" aria-hidden="true"></span>
              <span class="door-tag" aria-hidden="true">${esc(c.example.name)}</span>
            </div>
            <figcaption class="caption door-caption">${esc(c.example.caption)}</figcaption>
          </figure>
          <div class="concept-meta">
            <div class="concept-title"><h3 id="c-savra">${esc(c.example.name)}</h3><p class="status">${esc(c.example.status)}</p></div>
            <div class="concept-actions">
              <a class="live" href="${esc(example.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(c.example.live)}</span><span class="sr-only">${esc(c.example.newTab)}</span><span class="arrow" aria-hidden="true">↗</span></a>
              <a class="choose" href="?example=savra#reservierung" data-choose="savra"><span>${esc(c.example.choose)}</span><span class="sr-only" data-chosen></span><span class="arrow" aria-hidden="true">→</span></a>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="process" id="ablauf" aria-labelledby="process-title">
      <div class="wrap">
        <div class="sec-head" data-reveal>
          <div>
            <p class="label">${esc(c.process.label)}</p>
            <h2 id="process-title">${esc(c.process.title)} <em>${esc(c.process.titleAccent)}</em></h2>
          </div>
        </div>
        <ol class="steps" data-reveal-group>${steps}</ol>
      </div>
    </section>

    <section class="inquiry" id="reservierung" aria-labelledby="inquiry-title">
      <div class="wrap">
        <div class="sheet sheet--inquiry">
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
                <textarea class="preview" id="inquiry-preview" rows="6" readonly data-preview>${esc(c.inquiry.template)}</textarea>
              </div>
              <p class="fallback nojs-only">${esc(c.inquiry.fallback)}</p>
              <div class="composer-actions js-only">
                <button class="pill pill--accent" type="button" data-copy>${esc(c.inquiry.copy)}</button>
              </div>
              <p class="status" role="status" aria-live="polite" data-status></p>
            </div>
          </div>
          <div class="faq" data-reveal>
            <h2>${esc(c.faq.title)} <em>${esc(c.faq.titleAccent)}</em></h2>
            <div class="faq-list">${faq}</div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-id">
          <p class="footer-line">${esc(c.footer.line)}</p>
          <p class="footer-contact"><a href="mailto:${esc(launch.email)}">${esc(launch.email)}</a><a href="tel:${esc(launch.phone.replace(/\s/g, ''))}">${esc(launch.phone)}</a></p>
        </div>
        <nav class="footer-links" aria-label="${esc(c.nav.foot)}">
          ${nav(false)}
          <a href="#reservierung">${esc(c.nav.cta)}</a>
          <a href="${other}" hreflang="${otherLang}" lang="${otherLang}" data-locale-link data-base="${other}">${esc(c.footer.otherLocale)}</a>
          <a href="#top">${esc(c.footer.top)} ↑</a>
        </nav>
      </div>
      <p class="footer-brand"><a href="${esc(launch.studioUrl)}" aria-label="${esc(c.footer.studio)}">CONVENIUM<span>.</span></a></p>
      <div class="footer-bottom">
        <p class="footer-legal"><span>${esc(c.footer.legal)}</span><a href="${legal.a}">${esc(c.footer.imprint)}</a><a href="${legal.b}">${esc(c.footer.privacy)}</a></p>
        <p>© 2026 Convenium</p>
      </div>
    </div>
  </footer>

  <script type="application/json" id="campaign">${JSON.stringify(camp)}</script>
  <script type="application/json" id="i18n">${JSON.stringify(i18n)}</script>
</body>
</html>
`;
}

/* Convenium · Gastronomie — script.js, v2 "Das Lokal"
   Interactions (locale links, the reservation composer, the menu room, the phone tab bar, the card rail,
   the sticky CTA, the SAVRA loop) and the GSAP choreography from .olympus/06-build-plan.md. Phones get the
   same story with phone-sized motion (mobile-app-shell): play-once reveals, a shorter arch runway, a
   self-running marquee, no parallax on coarse pointers. Content is complete in the markup; motion applies
   start states only after GSAP is present and never hides anything from the accessibility tree (opacity,
   colour, clip and transform only). */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var i18n = {};
  try { i18n = JSON.parse(document.getElementById('i18n').textContent); } catch (e) { i18n = {}; }
  var EXAMPLES = i18n.examples || {};
  var PACKAGES = i18n.packages || {};
  var D = i18n.draft || {};
  var currency = null;
  try { currency = new Intl.NumberFormat(i18n.numberLocale || 'de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); } catch (e) { currency = null; }
  function money(n) { return currency ? currency.format(n) : '€ ' + n; }
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
  var wideMQ = window.matchMedia('(min-width: 1024px)');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function has(obj, key) { return key != null && Object.prototype.hasOwnProperty.call(obj, key); }
  function motionOn() { return !!window.gsap && root.getAttribute('data-motion') === 'full'; }

  /* ---------------- Selection state: one direction (SAVRA), one course ---------------- */
  var ANCHORS = ['karte', 'launch', 'beispiel', 'ablauf', 'reservierung'];
  var selected = null, pkg = null;

  function query() {
    var q = [];
    if (selected) q.push('example=' + selected);
    if (pkg) q.push('package=' + pkg);
    return q.length ? '?' + q.join('&') : '';
  }
  function currentAnchor() {
    var line = window.innerHeight * 0.4, found = '';
    ANCHORS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top <= line && r.bottom > 0) found = id;
    });
    return found;
  }
  function updateLocaleLinks(anchor) {
    $$('[data-locale-link]').forEach(function (a) { a.setAttribute('href', a.getAttribute('data-base') + query() + (anchor ? '#' + anchor : '')); });
  }
  $$('[data-locale-link]').forEach(function (a) {
    var refresh = function () { updateLocaleLinks(currentAnchor()); };
    a.addEventListener('pointerdown', refresh);
    a.addEventListener('focus', refresh);
    a.addEventListener('click', refresh);
  });

  /* ---------------- The reservation composer (local only; nothing is sent) ---------------- */
  var nameEl = $('[data-selection-name]'), clearBtn = $('[data-clear]');
  var pkgNameEl = $('[data-package-name]'), pkgClearBtn = $('[data-clear-package]');
  var statusEl = $('[data-status]'), preview = $('[data-preview]'), copyBtn = $('[data-copy]');
  var heading = document.getElementById('inquiry-title');
  var fields = { business: $('#f-business'), location: $('#f-location'), message: $('#f-message') };

  function announce(msg, state) {
    if (!statusEl) return;
    window.clearTimeout(statusEl._announce);
    statusEl.textContent = '';
    statusEl.setAttribute('data-state', state || '');
    statusEl._announce = window.setTimeout(function () { statusEl.textContent = msg; }, 60);
  }
  function composeDraft() {
    var val = function (el) { var t = el ? el.value.trim() : ''; return t || D.empty || '…'; };
    var lines = [D.intro, D.business + ': ' + val(fields.business), D.location + ': ' + val(fields.location), D.direction + ': ' + (selected ? EXAMPLES[selected] : i18n.none)];
    if (pkg && has(PACKAGES, pkg)) {
      var p = PACKAGES[pkg];
      lines.push(D.package + ': ' + p.name);
      lines.push(D.price + ': ' + (p.onRequest ? (i18n.onRequest || '') : (D.from + ' ' + money(p.price) + ' ' + D.once + ' (' + D.net + ')')));
    }
    lines.push(D.idea + ': ' + val(fields.message));
    return lines.join('\n');
  }
  function renderPreview() { if (preview) preview.value = composeDraft(); }
  function writeUrl(hash) {
    var h = hash === undefined ? location.hash : hash;
    try { history.replaceState(null, '', location.pathname + query() + h); } catch (e) { /* file:// */ }
    updateLocaleLinks(currentAnchor());
  }
  function flash(el) {
    if (el && motionOn()) window.gsap.fromTo(el, { opacity: 0.4 }, { opacity: 1, duration: 0.18, ease: 'power1.out', overwrite: true, clearProps: 'opacity' });
  }
  function markChosen(el, on) {
    el.classList.toggle('is-selected', on);
    var c = $('[data-chosen]', el);
    if (c) c.textContent = on ? ' (' + (i18n.chosen || '') + ')' : '';
  }
  function setSelection(id, opts) {
    opts = opts || {};
    selected = has(EXAMPLES, id) ? id : null;
    if (nameEl) nameEl.textContent = selected ? EXAMPLES[selected] : i18n.none;
    if (clearBtn) clearBtn.setAttribute('aria-disabled', selected ? 'false' : 'true');
    $$('[data-concept]').forEach(function (el) { markChosen(el, el.getAttribute('data-concept') === selected); });
    renderPreview();
    writeUrl(opts.hash);
    if (opts.animate) flash(nameEl);
    if (opts.announce) announce((i18n.selected || '') + ': ' + (selected ? EXAMPLES[selected] : i18n.none));
  }
  function setPackage(id, opts) {
    opts = opts || {};
    pkg = has(PACKAGES, id) ? id : null;
    if (pkgNameEl) pkgNameEl.textContent = pkg ? PACKAGES[pkg].name : i18n.none;
    if (pkgClearBtn) pkgClearBtn.setAttribute('aria-disabled', pkg ? 'false' : 'true');
    $$('[data-package]').forEach(function (el) { markChosen(el, el.getAttribute('data-package') === pkg); });
    renderPreview();
    writeUrl(opts.hash);
    if (opts.animate) flash(pkgNameEl);
    if (opts.announce) announce((i18n.packageSelected || '') + ': ' + (pkg ? PACKAGES[pkg].name : i18n.none));
  }
  function goTo(id, focusEl) {
    var target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: reduceMQ.matches ? 'instant' : 'smooth', block: 'start' });
    if (focusEl) focusEl.focus({ preventScroll: true });
  }
  $$('[data-choose]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); setSelection(link.getAttribute('data-choose'), { announce: true, animate: true, hash: '#reservierung' }); goTo('reservierung', heading); });
  });
  $$('[data-choose-package]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); setPackage(link.getAttribute('data-choose-package'), { announce: true, animate: true, hash: '#reservierung' }); goTo('reservierung', heading); });
  });
  if (clearBtn) clearBtn.addEventListener('click', function () { if (selected) setSelection(null, { announce: true, animate: true }); });
  if (pkgClearBtn) pkgClearBtn.addEventListener('click', function () { if (pkg) setPackage(null, { announce: true, animate: true }); });
  Object.keys(fields).forEach(function (k) { if (fields[k]) fields[k].addEventListener('input', renderPreview); });
  if (copyBtn && preview) {
    copyBtn.addEventListener('click', function () {
      var text = preview.value;
      var done = function () { announce(i18n.success, 'ok'); };
      var fail = function () { preview.focus(); preview.select(); announce(i18n.failure, 'error'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    });
  }
  // Choices arrive in the query string (?example=savra&package=website-seo) and survive a locale switch.
  var params = null;
  try { params = new URLSearchParams(location.search); } catch (e) { params = null; }
  var initialEx = params ? params.get('example') : null, initialPkg = params ? params.get('package') : null;
  if (initialEx) setSelection(initialEx, { hash: location.hash });
  if (initialPkg) setPackage(initialPkg, { hash: location.hash });
  if (!initialEx && !initialPkg) { renderPreview(); updateLocaleLinks(''); }


  /* ---------------- The menu: a full-screen cherry room under the bar ---------------- */
  var toggle = $('[data-menu-toggle]'), panel = document.getElementById('menu'), bar = $('.bar');
  var toggleLabel = $('[data-menu-label]');
  var menuOpen = false;
  function onKey(e) { if (e.key === 'Escape') closeMenu(true); }
  function onFocusOut(e) { if (menuOpen && e.relatedTarget && !panel.contains(e.relatedTarget) && !bar.contains(e.relatedTarget)) closeMenu(false); }
  function openMenu() {
    menuOpen = true;
    panel.hidden = false;
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (toggleLabel) toggleLabel.textContent = i18n.close;
    if (motionOn()) {
      window.gsap.fromTo(panel, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.out', clearProps: 'clipPath' });
      window.gsap.fromTo($$('.menu-nav a, .menu-locale', panel), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out', delay: 0.15, clearProps: 'transform,opacity' });
    }
    var first = $('a', panel);
    if (first) first.focus();
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusout', onFocusOut);
  }
  function closeMenu(returnFocus) {
    if (!menuOpen) return;
    menuOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    if (toggleLabel) toggleLabel.textContent = i18n.menu;
    document.body.classList.remove('menu-open');
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('focusout', onFocusOut);
    panel.hidden = true;
    if (returnFocus) toggle.focus();
  }
  if (toggle && panel && bar) {
    toggle.addEventListener('click', function () { if (menuOpen) closeMenu(true); else openMenu(); });
    $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });
  }

  /* ---------------- Where am I: the phone tab bar and the sticky CTA ----------------
     The tab bar marks the chapter in view with aria-current; the desktop sticky CTA shows after the hero and
     leaves once the reservation is on screen. Neither is motion, so both run under reduced motion too. */
  var sticky = $('[data-sticky]'), hero = $('.hero'), inquiry = document.getElementById('reservierung');
  var tabs = $$('[data-tab]');
  var karte = document.getElementById('karte');
  var stickyFirst = sticky ? { text: sticky.textContent, href: sticky.getAttribute('href') } : null;
  var ticking = false;
  function updatePlace() {
    ticking = false;
    var vh = window.innerHeight;
    if (sticky && hero && inquiry) {
      var on = hero.getBoundingClientRect().bottom < vh * 0.25 && inquiry.getBoundingClientRect().top > vh;
      sticky.classList.toggle('is-on', on);
      // Before the menu it leads to the menu; once the menu has been read it leads to the reservation.
      var later = karte && karte.getBoundingClientRect().top < vh * 0.5;
      var text = later ? sticky.getAttribute('data-label-later') : stickyFirst.text;
      if (sticky.textContent !== text) { sticky.textContent = text; sticky.setAttribute('href', later ? '#reservierung' : stickyFirst.href); }
      if (on) sticky.removeAttribute('tabindex'); else sticky.setAttribute('tabindex', '-1');
    }
    if (tabs.length) {
      var here = currentAnchor();
      if (here === 'launch') here = 'karte';
      tabs.forEach(function (t) { if (t.getAttribute('data-tab') === here) t.setAttribute('aria-current', 'location'); else t.removeAttribute('aria-current'); });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(updatePlace); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updatePlace();

  /* ---------------- The card rail on phones: native scroll-snap, a live "1 / 3" ---------------- */
  var rail = $('[data-rail]'), railCount = $('[data-rail-count]');
  if (rail && railCount) {
    var cards = $$('.card', rail);
    var railTick = false;
    rail.addEventListener('scroll', function () {
      if (railTick) return;
      railTick = true;
      window.requestAnimationFrame(function () {
        railTick = false;
        var mid = rail.getBoundingClientRect().left + rail.clientWidth / 2, best = 0, dist = Infinity;
        cards.forEach(function (c, i) { var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < dist) { dist = d; best = i; } });
        railCount.textContent = (best + 1) + ' / ' + cards.length;
        cards.forEach(function (c, i) { c.classList.toggle('is-current', i === best); });
      });
    }, { passive: true });
  }

  /* ---------------- SAVRA: its own loop, on hover (fine pointer) or in view (touch) ----------------
     The capture is real; the video is a silent loop of the live site. Paused under reduced motion and by
     the toggle. Source picked once per layout (landscape from laptop up, portrait below). */
  var door = $('[data-door]'), video = $('[data-door-video]'), motionToggle = $('[data-motion-toggle]');
  var videoPaused = false;
  function loadVideo() {
    if (!video || video.getAttribute('src')) return;
    video.setAttribute('src', video.getAttribute(wideMQ.matches ? 'data-src-wide' : 'data-src-narrow'));
    video.load();
  }
  function playDoor() {
    if (!video || videoPaused || reduceMQ.matches) return;
    loadVideo();
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
    door.classList.add('is-playing');
  }
  function pauseDoor() {
    if (!video) return;
    video.pause();
    door.classList.remove('is-playing');
  }
  function armDoor() {
    if (!door || !video) return;
    if (hoverMQ.matches) {
      door.addEventListener('pointerenter', playDoor);
      door.addEventListener('pointerleave', pauseDoor);
      door.addEventListener('focusin', playDoor);
      door.addEventListener('focusout', function (e) { if (!door.contains(e.relatedTarget)) pauseDoor(); });
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) playDoor(); else pauseDoor(); }); }, { threshold: 0.35 }).observe(door);
    }
  }
  if (motionToggle) {
    motionToggle.addEventListener('click', function () {
      videoPaused = !videoPaused;
      motionToggle.setAttribute('aria-pressed', String(videoPaused));
      motionToggle.textContent = videoPaused ? i18n.motionPlay : i18n.motionPause;
      if (videoPaused) pauseDoor(); else if (!hoverMQ.matches) playDoor();
    });
  }

  /* ---------------- The hero film: numbered frames painted to a canvas, chosen by scroll ----------------
     Frames load in order after the poster; until a frame arrives the nearest loaded one stands in. The film
     frames cover the stage; the brand frames (from cfg.safeFrom) scale so the wordmark's central 80 % always
     fits, and the band left around them takes the frame's own corner colour, so the closing is never cropped
     on a phone. */
  function createSequence(section) {
    var cfg; try { cfg = JSON.parse(section.getAttribute('data-seq')); } catch (e) { return null; }
    var canvas = $('.hero-canvas', section); if (!canvas || !canvas.getContext) return null;
    var c2d = canvas.getContext('2d'), imgs = new Array(cfg.count), ready = new Array(cfg.count), tone = new Array(cfg.count);
    var current = 0, started = false, probe = document.createElement('canvas'); probe.width = probe.height = 2;
    var pc = probe.getContext('2d', { willReadFrequently: true });
    function src(i) { return cfg.dir + String(i + 1).padStart(4, '0') + '.webp'; }
    function nearest(i) { for (var d = 0; d < cfg.count; d++) { if (ready[i - d]) return i - d; if (ready[i + d]) return i + d; } return -1; }
    function draw(i) {
      current = Math.max(0, Math.min(cfg.count - 1, i));
      var k = nearest(current); if (k < 0) return;
      var im = imgs[k], cw = canvas.width, ch = canvas.height, iw = im.naturalWidth, ih = im.naturalHeight;
      var s = Math.max(cw / iw, ch / ih);
      if (cfg.safeFrom && k + 1 >= cfg.safeFrom) s = Math.min(s, cw / (iw * 0.8));
      if (s * ih < ch || s * iw < cw) { c2d.fillStyle = tone[k] || '#EDEBDD'; c2d.fillRect(0, 0, cw, ch); }
      c2d.drawImage(im, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s);
      if (!started) { started = true; root.classList.add('seq-live'); }
    }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
      draw(current);
    }
    function load() {
      var next = 0, active = 0;
      function pump() {
        while (active < 6 && next < cfg.count) {
          (function (i) {
            var im = new Image(); active++;
            im.decoding = 'async';
            im.onload = function () {
              active--; imgs[i] = im; ready[i] = true;
              if (cfg.safeFrom && i + 1 >= cfg.safeFrom) { try { pc.drawImage(im, 0, 0, 2, 2); var p = pc.getImageData(0, 0, 1, 1).data; tone[i] = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')'; } catch (e) { tone[i] = null; } }
              if (i === current || !started) draw(current);
              pump();
            };
            im.onerror = function () { active--; pump(); };
            im.src = src(i);
          })(next++);
        }
      }
      pump();
    }
    return { cfg: cfg, draw: draw, resize: resize, load: load };
  }

  /* ---------------- Motion (GSAP + ScrollTrigger) ----------------
     Beat sheet (06-build-plan.md): 1 the bar drops in and the room is revealed behind a rising clip · 2 the
     three lines rise out of their masks · 3 the statement fills word by word · 4 the arch opens to the full
     screen (the one sticky stage) · 5 the cards rise · 6 the marquee travels sideways · 7 the engraved
     cut-outs drift. Phone (≤ 767 or coarse pointer): 3 plays once, 4 runs a ~2-screen runway, 6 runs on its
     own clock, 7 floats instead of following the scroll. Reduced motion: none of it. */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST) { root.classList.remove('pre'); root.setAttribute('data-motion', 'unavailable'); armDoor(); return; }
    gsap.registerPlugin(ST);
    var css = getComputedStyle(root);
    var GRAY = css.getPropertyValue('--gray').trim(), CHERRY = css.getPropertyValue('--cherry').trim();
    var mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)', phone: '(max-width: 767px), (pointer: coarse)' }, function (ctx) {
      if (!ctx.conditions.motion) { root.classList.remove('pre'); root.setAttribute('data-motion', 'reduced'); return undefined; }
      var phone = ctx.conditions.phone;
      root.setAttribute('data-motion', 'full');

      // 1–2 · arrival
      var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.bar', { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, clearProps: 'transform,opacity' }, 0.1)
        .fromTo('.hero-poster, .hero-canvas', { scale: 1.12 }, { scale: 1, duration: 1.6, clearProps: 'transform' }, phone ? 0.5 : 0)
        .fromTo('.hero .label', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo('.hero .line-inner', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.25)
        .fromTo('.hero-body, .hero .actions, .hero-places', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.7)
        .fromTo('.tick', { scale: 0 }, { scale: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(2)' }, 1);
      root.classList.remove('pre');

      // 2b · the film: the photo opens from its half to the full screen while the copy steps aside, the
      // Artlist film scrubs with the scroll, then the CONVENIUM closing (the logo frames shared with Hair &
      // Beauty) plays on its own share of the runway. Save-Data keeps the poster.
      var hero = $('.hero[data-seq]'), seq = null;
      var saveData = navigator.connection && navigator.connection.saveData;
      if (hero && !saveData) seq = createSequence(hero);
      if (seq) {
        hero.classList.add('is-seq');
        seq.resize();
        seq.load();
        var photo = $('.hero-photo', hero), panelEl = $('.hero-panel', hero);
        var openFrom = function () {
          if (!phone && window.innerWidth >= 1024) return 'inset(0% 50% 0% 0%)';
          var stage = $('.hero-stage', hero), top = Math.min(0.8, panelEl.offsetHeight / Math.max(1, stage.clientHeight));
          return 'inset(' + Math.round(top * 100) + '% 0% 0% 0%)';
        };
        var state = { f: 0 }, last = (seq.cfg.safeFrom || seq.cfg.count) - 2;
        var film = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: phone ? 0.4 : 0.8, invalidateOnRefresh: true } });
        film.fromTo(photo, { clipPath: openFrom }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.22, ease: 'none' }, 0)
          .to(panelEl, (!phone && window.innerWidth >= 1024) ? { xPercent: 100, duration: 0.22, ease: 'power1.in' } : { yPercent: -100, duration: 0.22, ease: 'power1.in' }, 0)
          .to(state, { f: last, duration: 0.7, ease: 'none', onUpdate: function () { seq.draw(Math.round(state.f)); } }, 0)
          .to(state, { f: seq.cfg.count - 1, duration: 0.3, ease: 'none', onUpdate: function () { seq.draw(Math.round(state.f)); } }, 0.7);
        window.addEventListener('resize', seq.resize);
      }

      // 3a · the 3D room: objects rise in from depth, then drift with the scroll and tilt with the pointer
      // (desktop) or float on their own (phones).
      var d3 = $('[data-d3]'), items = $$('.d3-item');
      if (d3 && items.length) {
        items.forEach(function (el, i) {
          var depth = parseFloat(el.getAttribute('data-depth')) || 0.6;
          gsap.fromTo(el, { opacity: 0, scale: 0.55, rotationY: i % 2 ? -55 : 55, z: -260, y: 90 }, {
            opacity: 1, scale: 1, rotationY: 0, z: 0, y: 0, duration: 1.5, delay: i * 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: d3, start: 'top 72%', once: true },
            onComplete: function () { if (phone) gsap.to(el, { y: '+=' + (10 + depth * 8), rotation: (i % 2 ? -1 : 1) * (3 + depth * 3), duration: 2.4 + i * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 }); }
          });
          if (!phone) gsap.fromTo(el, { yPercent: 40 * depth, rotation: -10 * depth }, { yPercent: -40 * depth, rotation: 10 * depth, ease: 'none', scrollTrigger: { trigger: d3, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        });
        if (!phone && hoverMQ.matches) {
          var tilts = items.map(function (el) {
            var depth = parseFloat(el.getAttribute('data-depth')) || 0.6;
            return { depth: depth, rx: gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3' }), ry: gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3' }), x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3' }) };
          });
          d3.addEventListener('pointermove', function (e) {
            var r = d3.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
            tilts.forEach(function (t) { t.ry(px * 36 * t.depth); t.rx(-py * 30 * t.depth); t.x(px * 48 * t.depth); });
          });
          d3.addEventListener('pointerleave', function () { tilts.forEach(function (t) { t.ry(0); t.rx(0); t.x(0); }); });
        }
      }

      // 3 · the statement fills as it is read (scrubbed on desktop, played once on phones)
      var words = $$('.statement .w');
      if (words.length) {
        if (phone) gsap.fromTo(words, { color: GRAY }, { color: CHERRY, duration: 0.5, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.statement-text', start: 'top 75%', once: true } });
        else gsap.fromTo(words, { color: GRAY }, { color: CHERRY, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: '.statement-text', start: 'top 82%', end: 'bottom 48%', scrub: 0.6 } });
      }

      // 4 · the arch opens into the room (the signature: scrubbed on every size, shorter on phones)
      var arch = $('[data-arch]'), frame = $('[data-arch-frame]');
      if (arch && frame) {
        arch.classList.add('is-staged');
        var startW = function () { return Math.min(window.innerWidth * (window.innerWidth < 640 ? 0.7 : 0.34), 520); };
        gsap.fromTo(frame,
          { width: startW, height: function () { return startW() * 1.32; }, borderRadius: function () { return startW() / 2 + 'px ' + startW() / 2 + 'px 0px 0px'; } },
          { width: function () { return window.innerWidth; }, height: function () { return window.innerHeight; }, borderRadius: '0px 0px 0px 0px', ease: 'none',
            scrollTrigger: { trigger: arch, start: 'top top', end: 'bottom bottom', scrub: phone ? 0.5 : 1, invalidateOnRefresh: true } });
        gsap.fromTo('.arch-line', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: arch, start: '20% top', end: '55% top', scrub: true } });
      }

      // 5 · cards and blocks rise, once
      if (phone) {
        // On the rail the cards arrive from the right, the photo settles from a slight zoom.
        gsap.fromTo('[data-reveal-card]', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.cards', start: 'top 85%', once: true } });
        gsap.fromTo('.card-photo img', { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.cards', start: 'top 85%', once: true } });
      } else {
        gsap.fromTo('[data-reveal-card]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.cards', start: 'top 82%', once: true } });
      }
      $$('[data-reveal]').forEach(function (el) {
        gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      $$('[data-reveal-group]').forEach(function (group) {
        gsap.fromTo(group.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
      });
      $$('.campaign-photo img, .footer-photo').forEach(function (el) {
        gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.out', clearProps: 'clipPath', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });

      // 6 · the marquee: tied to the scroll on desktop, on its own clock on phones
      var track = $('[data-mq-track]');
      if (track) {
        if (phone) gsap.fromTo(track, { x: 0 }, { x: function () { return -(track.scrollWidth / 2); }, duration: 22, ease: 'none', repeat: -1 });
        else gsap.fromTo(track, { x: 0 }, { x: function () { return -(track.scrollWidth / 2); }, ease: 'none', scrollTrigger: { trigger: '[data-marquee]', start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true } });
      }

      // 7 · the cut-outs drift with the scroll, or float on phones (no parallax on coarse pointers)
      $$('[data-cut]').forEach(function (el, i) {
        if (phone) gsap.fromTo(el, { y: -8, rotate: -4 }, { y: 8, rotate: 4, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        else gsap.fromTo(el, { y: 40, rotate: -6 }, { y: -40, rotate: 6, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1 } });
      });

      return function () {
        if (arch) arch.classList.remove('is-staged');
        if (seq) { hero.classList.remove('is-seq'); root.classList.remove('seq-live'); window.removeEventListener('resize', seq.resize); }
        root.setAttribute('data-motion', 'reduced');
      };
    });
    armDoor();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion); else initMotion();
})();

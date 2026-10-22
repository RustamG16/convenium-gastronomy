/* Convenium · Gastronomie — script.js
   Interactions (locale links, the reservation composer, mobile menu, the door loop) and the GSAP
   choreography (hero: the table is set; scroll: lines and leaders arrive). Content is complete in the
   markup; motion applies start states only after GSAP is present, and never hides anything from the
   accessibility tree (opacity and transform only). */
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

  /* ---------------- Mobile navigation ---------------- */
  var toggle = $('[data-menu-toggle]'), panel = document.getElementById('mobile-menu'), header = $('.site-header');
  var menuOpen = false;
  function onKey(e) { if (e.key === 'Escape') closeMenu(true); }
  function onOutside(e) { if (header && !header.contains(e.target)) closeMenu(false); }
  function onFocusOut(e) { if (menuOpen && header && e.relatedTarget && !header.contains(e.relatedTarget)) closeMenu(false); }
  function openMenu() {
    menuOpen = true;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = i18n.close;
    if (motionOn()) window.gsap.fromTo(panel, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: true });
    var first = $('a', panel);
    if (first) first.focus();
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    header.addEventListener('focusout', onFocusOut);
  }
  function closeMenu(returnFocus) {
    if (!menuOpen) return;
    menuOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = i18n.menu;
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('pointerdown', onOutside);
    header.removeEventListener('focusout', onFocusOut);
    if (motionOn()) {
      window.gsap.to(panel, { y: -12, opacity: 0, duration: 0.18, ease: 'power2.in', overwrite: true, onComplete: function () { if (!menuOpen) { panel.hidden = true; window.gsap.set(panel, { clearProps: 'transform,opacity' }); } } });
    } else {
      panel.hidden = true;
      if (window.gsap) window.gsap.set(panel, { clearProps: 'transform,opacity' });
    }
    if (returnFocus) toggle.focus();
  }
  if (toggle && panel && header) {
    toggle.addEventListener('click', function () { if (menuOpen) closeMenu(true); else openMenu(); });
    $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });
    var onWide = function () { if (wideMQ.matches) closeMenu(false); };
    if (wideMQ.addEventListener) wideMQ.addEventListener('change', onWide); else wideMQ.addListener(onWide);
  }

  /* ---------------- Header: tuck away on scroll-down, return on scroll-up ---------------- */
  if (header) {
    var lastY = window.scrollY, headerHidden = false;
    var setHeaderHidden = function (h) { if (h === headerHidden) return; headerHidden = h; header.classList.toggle('is-hidden', h); };
    window.addEventListener('scroll', function () {
      var y = window.scrollY, d = y - lastY;
      if (Math.abs(d) < 6 && y > 120) return;
      lastY = y;
      if (y < 120 || menuOpen || header.contains(document.activeElement)) { setHeaderHidden(false); return; }
      setHeaderHidden(d > 0);
    }, { passive: true });
    header.addEventListener('focusin', function () { setHeaderHidden(false); });
  }

  /* ---------------- The door: SAVRA's own loop, on hover (fine pointer) or in view (touch) ----------------
     The capture is real; the video is a silent loop of the live site. Paused under reduced motion and by
     the toggle. Source picked once per layout (portrait from laptop up, landscape below). */
  var door = $('[data-door]'), video = $('[data-door-video]'), motionToggle = $('[data-motion-toggle]');
  var videoPaused = false, doorObserver = null;
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
      door.addEventListener('focusout', pauseDoor);
    } else if ('IntersectionObserver' in window) {
      doorObserver = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) playDoor(); else pauseDoor(); }); }, { threshold: 0.6 });
      doorObserver.observe(door);
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

  /* ---------------- Motion (GSAP + ScrollTrigger) ----------------
     Beat sheet (06-build-plan.md): 1 the header and eyebrow arrive · 2 the three lines rise out of their
     masks · 3 the table top fades up and the ten plates land, one after the other · 4 on scroll, every
     chapter head and card rises 18px into place and the dotted leaders draw from the left · 5 the hero
     copy drifts up a little as the room scrolls away (scrub 1). Reduced motion: none of it; the page is
     the static layout. No pins. */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST) { root.classList.remove('pre'); root.setAttribute('data-motion', 'unavailable'); armDoor(); return; }
    gsap.registerPlugin(ST);
    var mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, function (ctx) {
      if (!ctx.conditions.motion) { root.classList.remove('pre'); root.setAttribute('data-motion', 'reduced'); return undefined; }
      root.setAttribute('data-motion', 'full');

      var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.site-header', { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, clearProps: 'transform,opacity' }, 0)
        .fromTo('.hero .label', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .fromTo('.hero .line-inner', { yPercent: 112 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.15)
        .fromTo('.hero-body, .hero .actions', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.55)
        .fromTo('.table-caption, .table-note', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.6)
        .fromTo('.table-top', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.5)
        .fromTo('.plate', { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, 0.7);
      // fromTo renders its from-states at once, so the pre-paint class can go now.
      root.classList.remove('pre');

      gsap.to('.hero-copy', { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.table', { y: -28, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });

      $$('[data-reveal]').forEach(function (el) {
        gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      $$('[data-reveal-group]').forEach(function (group) {
        gsap.fromTo(group.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
      });
      $$('.leader').forEach(function (el) {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
      });
      return function () { root.setAttribute('data-motion', 'reduced'); };
    });
    armDoor();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion); else initMotion();
})();

/* Launch campaign — Gastronomie page.
 *
 * Reads the inline <script type="application/json" id="campaign"> (content/campaign.json, inlined by
 * build.mjs). getState() mirrors lib/campaign.ts in the studio repo. The static HTML carries the LAUNCH
 * prices, the end date and each course's market average. There is no regular price yet, so once the
 * launch places are gone or the campaign has ended, every launch price becomes "on request" (and the
 * i18n packages the composer reads are marked) BEFORE script.js runs. The ten plates in the hero follow
 * the places: one plate per place, taken ones crossed. No innerHTML anywhere; every value goes in through
 * textContent. Loaded from this origin, so the CSP (script-src 'self' + the one inline hash) is unchanged.
 */
(function () {
  'use strict';

  var SECOND = 1000, MINUTE = 60 * SECOND, HOUR = 60 * MINUTE, DAY = 24 * HOUR;

  function getState(config, now) {
    var end = Date.parse(config.endsAt);
    var msLeft = isFinite(end) ? Math.max(0, end - now) : 0;
    var slotsLeft = Math.max(0, Math.min(config.slotsTotal, Math.floor(config.slotsLeft)));
    var status = !config.active || msLeft === 0 ? 'ended' : slotsLeft === 0 ? 'full' : 'live';
    return { status: status, msLeft: msLeft, days: Math.floor(msLeft / DAY), hours: Math.floor((msLeft % DAY) / HOUR), minutes: Math.floor((msLeft % HOUR) / MINUTE), seconds: Math.floor((msLeft % MINUTE) / SECOND), slotsLeft: slotsLeft, slotsTotal: config.slotsTotal };
  }
  function fill(template, values) { return template.replace(/\{(\w+)\}/g, function (_, key) { return values[key] == null ? '' : String(values[key]); }); }

  var api = { getState: getState, fill: fill };
  if (typeof window !== 'undefined') window.ConveniumCampaign = api;
  if (typeof document === 'undefined' || !document) return;

  var root = document.documentElement;
  function ready() { root.classList.add('camp-ready'); }

  var config, i18nEl, i18n;
  try {
    config = JSON.parse(document.getElementById('campaign').textContent);
    i18nEl = document.getElementById('i18n');
    i18n = JSON.parse(i18nEl.textContent);
  } catch (e) { ready(); return; }

  var locale = root.lang === 'en' ? 'en' : 'de';
  var copy = config.copy[locale];
  var state = getState(config, Date.now());
  var live = state.status === 'live';
  var initialStatus = state.status;

  var currency = null;
  try { currency = new Intl.NumberFormat(i18n.numberLocale || 'de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); } catch (e) { currency = null; }
  function money(n) { return currency ? currency.format(n) : '€ ' + n; }
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function text(el, value) { if (el) el.textContent = value; }

  /* ---- prices: launch while live, otherwise on request ---- */
  function onRequest(el) {
    text(el, copy.onRequest);
    if (el.parentNode) Array.prototype.forEach.call(el.parentNode.querySelectorAll('.plan-from, .plan-unit'), function (q) { q.hidden = true; });
  }
  config.packages.forEach(function (pkg) {
    if (i18n.packages && i18n.packages[pkg.id]) { i18n.packages[pkg.id].price = live ? pkg.launch : 0; i18n.packages[pkg.id].onRequest = !live; }
    $$('[data-camp-pkg="' + pkg.id + '"]').forEach(function (el) { if (live) text(el, money(pkg.launch)); else onRequest(el); });
    $$('[data-camp-then="' + pkg.id + '"]').forEach(function (el) { el.hidden = !live; });
  });
  try { i18nEl.textContent = JSON.stringify(i18n); } catch (e) { /* keep the static values */ }

  /* ---- the table for ten: one plate per place ---- */
  var full = state.status === 'full';
  var taken = state.status === 'ended' ? state.slotsTotal : state.slotsTotal - state.slotsLeft;
  $$('[data-plate]').forEach(function (el) {
    var n = Number(el.getAttribute('data-plate'));
    if (n <= taken) el.setAttribute('data-taken', ''); else el.removeAttribute('data-taken');
  });
  $$('[data-camp-slots]').forEach(function (el) { text(el, state.status === 'live' ? fill(copy.table, { n: state.slotsLeft, total: state.slotsTotal }) : copy.full); });

  /* ---- the launch module ---- */
  var mod = $('[data-campaign]');
  var unitEls = null;
  function renderModule() {
    if (!mod) return;
    if (state.status === 'ended') { mod.hidden = true; return; }
    mod.hidden = false;
    text(mod.querySelector('[data-camp="label"]'), copy.label);
    var claim = mod.querySelector('[data-camp="claim"]');
    text(claim, copy.claim);
    if (claim) claim.setAttribute('data-text', copy.claim);
    text(mod.querySelector('[data-camp="source"]'), copy.claimSource);
    var count = mod.querySelector('[data-camp="count"]');
    if (count) count.hidden = full;
    text(mod.querySelector('[data-camp="ends"]'), copy.ends);
    var unitsHost = mod.querySelector('[data-camp="units"]');
    if (unitsHost && !unitEls && !full) {
      unitEls = {};
      ['d', 'h', 'm', 's'].forEach(function (k) {
        var wrap = document.createElement('span'), num = document.createElement('span'), name = document.createElement('span');
        wrap.className = 'campaign-unit'; num.className = 'campaign-num'; name.className = 'campaign-unitname';
        name.textContent = copy.units[k];
        wrap.appendChild(num); wrap.appendChild(name); unitsHost.appendChild(wrap);
        unitEls[k] = num;
      });
    }
    text(mod.querySelector('[data-camp="slots"]'), full ? copy.full : fill(copy.slots, { n: state.slotsLeft, total: state.slotsTotal }));
    text(mod.querySelector('[data-camp="after"]'), copy.after);
    text(mod.querySelector('[data-camp="cta"]'), copy.cta);
    text(mod.querySelector('[data-camp="risk"]'), copy.risk);
    tickUnits();
  }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tickUnits() {
    if (!unitEls) return;
    text(unitEls.d, String(state.days));
    text(unitEls.h, pad(state.hours));
    text(unitEls.m, pad(state.minutes));
    text(unitEls.s, pad(state.seconds));
    var count = mod && mod.querySelector('[data-camp="count"]');
    if (count) count.setAttribute('aria-label', copy.ends + ' ' + state.days + ' ' + copy.units.d + ', ' + state.hours + ' ' + copy.units.h);
  }

  renderModule();
  ready();

  /* ---- ticker: derives everything from endsAt, so it can never reset ---- */
  if (initialStatus !== 'ended') {
    var timer = window.setInterval(function () {
      state = getState(config, Date.now());
      if (state.status !== initialStatus) { window.clearInterval(timer); window.location.reload(); return; }
      tickUnits();
    }, SECOND);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      state = getState(config, Date.now());
      if (state.status !== initialStatus) window.location.reload(); else tickUnits();
    });
  }
})();

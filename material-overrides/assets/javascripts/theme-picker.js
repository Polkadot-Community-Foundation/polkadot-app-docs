/* theme-picker.js — the header theme picker (Berlin / Tokyo / Malta / Lisbon).
   Fills .dg-theme-pop with role=radio swatches, sets data-dg-theme on <html>,
   persists to localStorage['dg-theme'] (read pre-paint by main.html). Light/dark
   stays with Material's own palette toggle; while printing, the dark scheme is
   swapped for light so paper gets a light page. Dependency-free; safe to run
   more than once (Material instant navigation re-emits document$). */
(function () {
  'use strict';

  var KEY = 'dg-theme';
  var THEMES = [
    ['berlin', 'Berlin'],
    ['tokyo', 'Tokyo'],
    ['malta', 'Malta'],
    ['lisbon', 'Lisbon']
  ];
  var NAMES = THEMES.map(function (t) { return t[0]; });
  var CHECK = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function current() {
    var t = document.documentElement.getAttribute('data-dg-theme') || stored();
    return NAMES.indexOf(t) >= 0 ? t : 'berlin';
  }
  function apply(name, persist) {
    document.documentElement.setAttribute('data-dg-theme', name);
    if (persist) { try { localStorage.setItem(KEY, name); } catch (e) { /* private mode */ } }
    var radios = document.querySelectorAll('.dg-theme-swatch');
    for (var i = 0; i < radios.length; i++) {
      var on = radios[i].getAttribute('data-theme') === name;
      radios[i].setAttribute('aria-checked', on ? 'true' : 'false');
      radios[i].tabIndex = on ? 0 : -1;
    }
  }

  function render(pop) {
    pop.innerHTML = '';
    THEMES.forEach(function (t) {
      var opt = document.createElement('div');
      opt.className = 'dg-theme-option';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dg-theme-swatch';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('aria-label', t[1]);
      btn.setAttribute('data-theme', t[0]);
      btn.style.setProperty('--swatch', 'var(--dg-swatch-' + t[0] + ')');
      btn.innerHTML = CHECK;

      var name = document.createElement('span');
      name.className = 'dg-theme-name';
      name.setAttribute('aria-hidden', 'true');
      name.textContent = t[1];

      opt.appendChild(btn);
      opt.appendChild(name);
      pop.appendChild(opt);
    });
  }

  function init() {
    var btn = document.querySelector('.dg-theme-btn');
    var pop = document.querySelector('.dg-theme-pop');
    if (!btn || !pop) return;
    if (!pop.childElementCount) render(pop);
    apply(current(), false);
    if (btn.dataset.dgBound) return;
    btn.dataset.dgBound = '1';

    function isOpen() { return !pop.hidden; }
    function open() {
      pop.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      var on = pop.querySelector('[aria-checked="true"]') || pop.querySelector('.dg-theme-swatch');
      if (on) on.focus();
    }
    function close(refocus) {
      if (!isOpen()) return;
      pop.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      if (refocus) btn.focus();
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      isOpen() ? close(false) : open();
    });

    // Click on a swatch or its label selects; keep the popover open so the
    // change is visible, like the app.
    pop.addEventListener('click', function (e) {
      e.stopPropagation();
      var opt = e.target.closest('.dg-theme-option');
      if (!opt) return;
      var radio = opt.querySelector('.dg-theme-swatch');
      apply(radio.getAttribute('data-theme'), true);
      radio.focus();
    });

    pop.addEventListener('keydown', function (e) {
      var radios = Array.prototype.slice.call(pop.querySelectorAll('.dg-theme-swatch'));
      var i = radios.indexOf(document.activeElement);
      var next = -1;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': next = (i + 1) % radios.length; break;
        case 'ArrowLeft': case 'ArrowUp': next = (i - 1 + radios.length) % radios.length; break;
        case 'Home': next = 0; break;
        case 'End': next = radios.length - 1; break;
        case 'Escape': e.preventDefault(); close(true); return;
        case 'Tab': close(false); return;
        default: return;
      }
      e.preventDefault();
      apply(radios[next].getAttribute('data-theme'), true);
      radios[next].focus();
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close(true);
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isOpen()) { e.preventDefault(); open(); }
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && !pop.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close(true);
    });

    // Another tab changed the theme.
    window.addEventListener('storage', function (e) {
      if (e.key === KEY && NAMES.indexOf(e.newValue) >= 0) apply(e.newValue, false);
    });
  }

  // Print from the dark scheme on light surfaces (chrome.css @media print
  // cannot flip the role tokens: they hang off body[data-md-color-scheme]).
  // beforeprint/afterprint for Chromium and Firefox, matchMedia for Safari.
  var SCHEME = 'data-md-color-scheme';
  var printSaved = null;
  function printLight() {
    if (printSaved !== null) return;
    var s = document.body.getAttribute(SCHEME);
    if (s !== 'polkadot-dark') return;
    printSaved = s;
    document.body.setAttribute(SCHEME, 'polkadot-light');
  }
  function printRestore() {
    if (printSaved === null) return;
    document.body.setAttribute(SCHEME, printSaved);
    printSaved = null;
  }
  window.addEventListener('beforeprint', printLight);
  window.addEventListener('afterprint', printRestore);
  if (window.matchMedia) {
    var mq = window.matchMedia('print');
    var onPrint = function (e) { e.matches ? printLight() : printRestore(); };
    if (mq.addEventListener) mq.addEventListener('change', onPrint);
    else if (mq.addListener) mq.addListener(onPrint);
  }

  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(init);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

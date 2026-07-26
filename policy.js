/* ============================================================
   Jerusalem Unity Center — POLICY PAGES
   Shared by privacy-policy.html and non-discrimination-policy.html

   Everything here is progressive enhancement: without it the
   documents still read top to bottom, the contents list is a
   plain list of anchors, and nothing is hidden.
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     MOBILE NAV — same behaviour as the main site
     ========================================================== */
  (function () {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    var support = document.querySelector('.header-actions .btn-support');

    if (nav && support) {
      var clone = support.cloneNode(true);
      clone.classList.add('nav-support');
      nav.appendChild(clone);
    }

    if (header && toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });

      nav.addEventListener('click', function (e) {
        if (e.target.closest('a') && header.classList.contains('nav-open')) {
          header.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open menu');
        }
      });
    }
  })();

  /* ==========================================================
     PRINT / SAVE AS PDF
     ========================================================== */
  (function () {
    document.querySelectorAll('.js-print').forEach(function (btn) {
      btn.addEventListener('click', function () { window.print(); });
    });
  })();

  /* ==========================================================
     READING PROGRESS BAR
     ========================================================== */
  (function () {
    var bar = document.querySelector('.pol-progress-bar');
    if (!bar) return;
    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop || document.body.scrollTop) / max : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, pct)) + ')';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ==========================================================
     CONTENTS RAIL
     Desktop: a permanently open sticky rail.
     ≤1024px: policy.css turns the same <details> into a card
     that should start collapsed, so it doesn't push the
     document down a full screen on phones.
     ========================================================== */
  (function () {
    var wrap = document.querySelector('.pol-toc-wrap');
    if (!wrap) return;

    var compact = window.matchMedia('(max-width: 1024px)');

    function sync(mq) {
      wrap.open = !mq.matches;
    }

    sync(compact);
    if (compact.addEventListener) {
      compact.addEventListener('change', sync);
    } else if (compact.addListener) {
      compact.addListener(sync);      /* Safari < 14 */
    }

    /* Tapping a contents link on a phone closes the card behind you */
    wrap.addEventListener('click', function (e) {
      if (compact.matches && e.target.closest('.pol-toc-list a')) {
        wrap.open = false;
      }
    });
  })();

  /* ==========================================================
     SCROLL REVEALS + ACTIVE SECTION IN THE CONTENTS RAIL
     Both degrade gracefully: without IntersectionObserver every
     .reveal is shown immediately and no section is highlighted.
     ========================================================== */
  (function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('.reveal');

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

      items.forEach(function (el) { revealer.observe(el); });
    }

    /* --- Contents rail: highlight the section being read ------ */
    var links = document.querySelectorAll('.pol-toc-list a');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];
    links.forEach(function (link) {
      var sec = document.querySelector(link.getAttribute('href'));
      if (sec) { byId[sec.id] = link; sections.push(sec); }
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-current'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-current');
      });
    }, { rootMargin: '-12% 0px -70% 0px', threshold: 0 });

    sections.forEach(function (sec) { spy.observe(sec); });
  })();

})();

/* ============================================================
   DONATE PAGE — the giving form, the amount buttons, the FAQ
   and the Google conversion hook.

   ┌──────────────────────────────────────────────────────────┐
   │  TO POINT THE PAGE AT A DIFFERENT CAMPAIGN                │
   │                                                           │
   │  Change DONORBOX_URL below — that one line drives the     │
   │  whole section: the form embeds itself, the amount        │
   │  buttons preselect their amount, and the monthly tab      │
   │  opens the form on the recurring option.                  │
   │                                                           │
   │  It looks like:                                           │
   │      https://donorbox.org/your-campaign-slug              │
   │  (Donorbox › your campaign › Embed › the URL in the       │
   │  iframe src, without any ?default_interval= on the end.)  │
   │                                                           │
   │  Set it back to '' and the page still works: it shows     │
   │  the Center's contact route for giving instead of the     │
   │  form, so nothing on the page is ever a dead end.         │
   └──────────────────────────────────────────────────────────┘
   ============================================================ */
(function () {
  'use strict';

  var DONORBOX_URL = 'https://donorbox.org/join-the-seventy-nations-and-support-our-cause';

  /* ==========================================================
     0. MOBILE NAV — the same behaviour as every other page
     ========================================================== */
  (function () {
    var header  = document.querySelector('.site-header');
    var toggle  = document.querySelector('.nav-toggle');
    var nav     = document.getElementById('primary-nav');
    var support = document.querySelector('.header-actions .btn-support');

    if (nav && support) {
      var clone = support.cloneNode(true);
      clone.classList.add('nav-support');
      nav.appendChild(clone);
    }

    if (!header || !toggle || !nav) return;

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
  })();

  /* ==========================================================
     1. THE FORM
     Donorbox is an iframe. We build it ourselves rather than
     pasting their script tag so the page keeps control of when
     it loads (on demand, not on arrival) and so the amount
     buttons can rebuild it with a different amount.
     ========================================================== */

  var mount    = document.getElementById('donorbox-mount');
  var fallback = document.getElementById('give-fallback');
  var amountRow = document.querySelector('.js-amounts');
  var caption  = document.querySelector('.js-give-caption');
  var frame    = null;

  /* Donorbox gives out two shapes of link — the public campaign
     page (donorbox.org/slug) and the embeddable form
     (donorbox.org/embed/slug). Only the second belongs in an
     iframe, so whichever one is pasted above, we use that one. */
  function embedBase() {
    var url = DONORBOX_URL.trim().replace(/\/+$/, '');
    if (url.indexOf('/embed/') === -1) {
      url = url.replace(/(donorbox\.org)\//i, '$1/embed/');
    }
    return url;
  }

  /* Donorbox names its intervals with single letters — o, m, q, a.
     Spelling them out ('monthly') is silently ignored and the form
     opens on One-time, which would contradict the tab the visitor
     just pressed. The page keeps the readable words in its markup
     and translates them here. */
  var INTERVALS = { one_time: 'o', monthly: 'm', quarterly: 'q', annually: 'a' };

  function donorboxSrc(opts) {
    var base = embedBase();
    var url = base + (base.indexOf('?') === -1 ? '?' : '&') + 'hide_donation_meter=true';
    if (opts && opts.amount) url += '&amount=' + encodeURIComponent(opts.amount);
    var code = opts && INTERVALS[opts.interval];
    if (code) url += '&default_interval=' + code;
    return url;
  }

  /* Donorbox's own widget script does one job: it listens for the
     height the form reports and resizes the iframe to match, so
     the form is never cut off on a long step. Loaded only when
     there is a form to resize. */
  function loadDonorboxWidget() {
    if (document.querySelector('script[data-donorbox-widget]')) return;
    var s = document.createElement('script');
    s.src = 'https://donorbox.org/widget.js';
    s.setAttribute('paypalExpress', 'false');
    s.setAttribute('data-donorbox-widget', '');
    document.body.appendChild(s);
  }

  /* Donorbox's widget.js measures the form and writes an exact
     height onto the frame at every step. Until that first
     measurement arrives, a CSS floor (.db-frame min-height) keeps
     the form from being clipped; once it has arrived the floor is
     dropped, so the white card is exactly as tall as the step it is
     showing and never trails a band of empty white beneath it. */
  function followFormHeight(el) {
    if (!window.MutationObserver) return;
    var obs = new MutationObserver(function () {
      if (parseInt(el.style.height, 10) >= 300) mount.classList.add('is-sized');
    });
    obs.observe(el, { attributes: true, attributeFilter: ['style', 'height'] });
  }

  function mountForm(opts) {
    if (!mount || !DONORBOX_URL) return;

    if (!frame) {
      frame = document.createElement('iframe');
      frame.className = 'db-frame donorbox';
      frame.name = 'donorbox';
      frame.title = 'Donation form — Jerusalem Unity Center';
      frame.setAttribute('allow', 'payment');
      frame.setAttribute('allowpaymentrequest', '');
      frame.setAttribute('seamless', 'seamless');
      frame.setAttribute('scrolling', 'no');
      mount.innerHTML = '';
      mount.appendChild(frame);
      followFormHeight(frame);
      loadDonorboxWidget();
    }
    frame.src = donorboxSrc(opts);
  }

  if (DONORBOX_URL) {
    if (fallback) fallback.hidden = true;
    if (mount) mount.hidden = false;
    if (amountRow) amountRow.hidden = false;
    if (caption) caption.hidden = false;
    mountForm({ interval: 'one_time' });
  } else {
    /* No processor wired yet. Hide the empty form well and its
       amount buttons rather than showing controls that cannot
       do anything — an Ad Grants reviewer counts a button that
       goes nowhere as a broken experience. */
    if (mount) mount.hidden = true;
    if (amountRow) amountRow.hidden = true;
    if (caption) caption.hidden = true;
    if (fallback) fallback.hidden = false;
  }

  /* ==========================================================
     2. THE AMOUNT BUTTONS
     Each carries data-amount (and data-interval on the monthly
     ones). They set the form above, they do not submit anything
     themselves.
     ========================================================== */

  if (amountRow) {
    amountRow.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.db-amount');
      if (!btn || !amountRow.contains(btn)) return;

      [].forEach.call(amountRow.querySelectorAll('.db-amount'), function (el) {
        el.classList.toggle('is-on', el === btn);
        el.setAttribute('aria-pressed', el === btn ? 'true' : 'false');
      });

      mountForm({
        amount: btn.getAttribute('data-amount') || '',
        interval: btn.getAttribute('data-interval') || 'one_time'
      });

      if (mount && mount.scrollIntoView) {
        mount.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ==========================================================
     3. ONE-TIME / MONTHLY TABS
     ========================================================== */

  var tabRow = document.querySelector('.js-intervals');

  if (tabRow) {
    tabRow.addEventListener('click', function (e) {
      var tab = e.target.closest && e.target.closest('.db-tab');
      if (!tab || !tabRow.contains(tab)) return;

      var interval = tab.getAttribute('data-interval') || 'one_time';

      [].forEach.call(tabRow.querySelectorAll('.db-tab'), function (el) {
        var on = el === tab;
        el.classList.toggle('is-on', on);
        el.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      /* The amount buttons follow the tab, so a monthly gift of
         the chosen size is one click rather than two. */
      if (amountRow) {
        [].forEach.call(amountRow.querySelectorAll('.db-amount'), function (el) {
          el.setAttribute('data-interval', interval);
        });
      }

      var chosen = amountRow && amountRow.querySelector('.db-amount.is-on');
      mountForm({
        amount: chosen ? chosen.getAttribute('data-amount') : '',
        interval: interval
      });

      var note = document.querySelector('.js-interval-note');
      if (note) {
        note.textContent = interval === 'monthly'
          ? 'A monthly gift can be changed or stopped at any time from the receipt we email you.'
          : 'A single gift, given once. You can always give again later.';
      }
    });
  }

  /* ==========================================================
     4. THE FAQ
     Native <details>, so it is open to search engines and works
     without this file. All we add is "one at a time".
     ========================================================== */

  var faq = document.querySelector('.js-faq');

  if (faq) {
    faq.addEventListener('toggle', function (e) {
      var item = e.target;
      if (!item.open || item.tagName !== 'DETAILS') return;
      [].forEach.call(faq.querySelectorAll('details'), function (other) {
        if (other !== item) other.open = false;
      });
    }, true);
  }

  /* ==========================================================
     5. SMOOTH IN-PAGE LINKS
     The page's own anchors (#give, #ways, #faq) — matching the
     behaviour of the anchors on the home page.
     ========================================================== */

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  });

})();

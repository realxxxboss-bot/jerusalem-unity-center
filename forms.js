/* ============================================================
   FORMS — Web3Forms transport, shared by every page

   Every form on the site posts through here, so the access key
   lives in exactly one place. Web3Forms delivers to the address
   the key was created with:

       Info@marianneparadise.org

   To change the destination, create a new key at web3forms.com
   with the new address and swap ACCESS_KEY below — nothing else
   needs to change.

   Exposes:
     window.JUC_FORMS.send(fields)  -> Promise, rejects with a
                                       human-readable message
     window.JUC_FORMS.hasKey()      -> false while the key is
                                       still the placeholder

   It also wires the footer newsletter form on any page that has
   one (.js-news-form) — no per-page script required.
   ============================================================ */
(function () {
  'use strict';

  /* --- The one setting ---------------------------------------- */
  var ACCESS_KEY = 'PASTE-WEB3FORMS-ACCESS-KEY-HERE';

  var ENDPOINT = 'https://api.web3forms.com/submit';
  var PLACEHOLDER = 'PASTE-WEB3FORMS-ACCESS-KEY-HERE';

  function hasKey() {
    return !!ACCESS_KEY && ACCESS_KEY !== PLACEHOLDER;
  }

  /* Posts `fields` to Web3Forms. Resolves with the parsed
     response, rejects with an Error whose message is safe to
     show a visitor. */
  function send(fields) {
    if (!hasKey()) {
      if (window.console && console.warn) {
        console.warn('[forms] No Web3Forms access key set in forms.js — nothing was sent.', fields);
      }
      return Promise.reject(new Error(
        'This form is not connected yet. Please email Info@marianneparadise.org.'
      ));
    }

    var body = {
      access_key: ACCESS_KEY,
      /* Web3Forms' own honeypot: a non-empty value is dropped
         server-side, on top of our client-side check. */
      botcheck: ''
    };

    Object.keys(fields).forEach(function (k) {
      if (fields[k] !== undefined && fields[k] !== null && fields[k] !== '') {
        body[k] = fields[k];
      }
    });

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok || !data.success) {
          throw new Error(
            'We could not send that just now. Please try again, or email Info@marianneparadise.org.'
          );
        }
        return data;
      });
    }, function () {
      throw new Error(
        'We could not reach the server. Please check your connection and try again.'
      );
    });
  }

  window.JUC_FORMS = { send: send, hasKey: hasKey };

  /* ============================================================
     FOOTER NEWSLETTER

     Same shape as the membership modal: inline validation, a
     sending state, and a message line that reports either way.
     ============================================================ */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('.js-news-form');

    Array.prototype.forEach.call(forms, function (form) {
      var email = form.querySelector('.fnews-input');
      var honeypot = form.querySelector('.fnews-hp input');
      var button = form.querySelector('.fnews-btn');
      var msg = form.querySelector('.fnews-msg');
      var sending = false;

      function say(text, kind) {
        msg.textContent = text;
        msg.hidden = false;
        msg.classList.toggle('is-error', kind === 'error');
        msg.classList.toggle('is-ok', kind === 'ok');
      }

      function setSending(on) {
        sending = on;
        button.disabled = on;
        button.classList.toggle('is-sending', on);
        email.disabled = on;
      }

      /* Clears the error the moment the address starts looking
         right, rather than scolding people mid-word. */
      email.addEventListener('input', function () {
        if (form.classList.contains('is-invalid') && EMAIL_RE.test(email.value.trim())) {
          form.classList.remove('is-invalid');
          msg.hidden = true;
        }
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (sending) return;

        var address = email.value.trim();

        if (!address) {
          form.classList.add('is-invalid');
          say('Please enter your email address.', 'error');
          email.focus();
          return;
        }
        if (!EMAIL_RE.test(address)) {
          form.classList.add('is-invalid');
          say('That email address does not look right.', 'error');
          email.focus();
          return;
        }

        form.classList.remove('is-invalid');
        msg.hidden = true;

        /* Honeypot filled in => a bot. Look successful, send nothing. */
        if (honeypot && honeypot.value.trim()) {
          form.reset();
          say('Thank you — you are on the list.', 'ok');
          return;
        }

        setSending(true);

        window.JUC_FORMS.send({
          subject: 'Newsletter signup — Jerusalem Unity Center',
          from_name: 'Jerusalem Unity Center website',
          form_name: 'Newsletter signup',
          email: address,
          replyto: address,
          page: window.location.pathname,
          submittedAt: new Date().toISOString()
        }).then(function () {
          setSending(false);
          form.reset();
          say('Thank you — you are on the list.', 'ok');
        }).catch(function (err) {
          setSending(false);
          say(err && err.message ? err.message : 'Something went wrong. Please try again.', 'error');
        });
      });
    });
  });
})();

# Donation Page — Status and What Is Still Needed

The donation page is **built, styled, tested, and live**, and as of this
update **giving works end to end**: the Donorbox campaign is connected and
the form is taking gifts on the page itself.

One thing is still open: the Google Analytics and Google Ads IDs, deferred by
agreement. Everything else on the page is finished.

---

## ✅ 1. The Donorbox campaign — CONNECTED

Wired to:

```
https://donorbox.org/join-the-seventy-nations-and-support-our-cause
```

That is `DONORBOX_URL` at the top of `donate.js` — the single line that
drives the whole section. Change it and the page moves to another campaign;
empty it and the page falls back to a contact route rather than a dead end.

**What now works on the page**

- The secure Donorbox form is embedded directly in the "Make Your Gift"
  section. Nobody leaves the site to give.
- **Give Once / Give Monthly** — the tabs set the form's own interval, so the
  form opens on the option the visitor pressed.
- **$36 / $100 / $360 / $1,000 / Another amount** — the amount is carried into
  the form and already filled in when it loads.
- The form card resizes itself to each step, so there is no empty white space
  under it and nothing is ever cut off.
- The card is held to the form's own width and centred, with the site's gold
  hairline and shadow — so a third-party form still reads as part of the page.

### Optional Donorbox dashboard settings

Only the account owner can change these, and the page works as it stands
without any of them. Worth a look when convenient:

| Setting | Value | Why |
|---|---|---|
| **Suggested amounts** | 36 / 100 / 360 | The form currently offers its own $10 / $50 / $100 underneath the page's amounts. Matching them removes the only remaining mismatch between the two |
| **Recurring donations** | Enabled | The "Give Monthly" tab depends on it |
| **Currency** | Whatever you actually charge in | Tell me if it is not USD and I will change the amount buttons to match |
| **Receipt email** | On, from an address you monitor | Donors expect it; the page promises it |

The post-donation redirect to `donate-thank-you.html` was considered and
**closed as not needed**. Donorbox shows its own confirmation after a gift, so
nothing is broken by leaving it. The one consequence: the thank-you page is
reached only by direct link, so when Google Ads is set up later the conversion
will need to be counted some other way. The page itself stays in place.

---

## ✅ 2. Your EIN (US tax number) — ADDED

```
88-3073485
```

It now appears in two places:

- **On the page**, in the tax-deductibility paragraph of the transparency
  section: *"Our EIN is 88-3073485."*
- **In the structured data**, as `taxID`, so Google can match the site against
  the IRS register during nonprofit review.

The placeholder is gone from the page and from the stylesheet.

---

## ⏳ 3. Google Analytics 4 + Google Ads — SCHEDULED

Deferred by agreement; nothing else waits on it.

A Google Ad Grants account is **suspended if it does not report at least one
conversion per month**, so this is not optional housekeeping.

| What | Looks like | Where to find it |
|---|---|---|
| GA4 Measurement ID | `G-XXXXXXXXXX` | Google Analytics → Admin → Data Streams → your web stream |
| Google Ads Conversion ID + Label | `AW-123456789/AbC-D_efGh` | Google Ads → Goals → Conversions → your donation conversion → *Tag setup* → *Install manually* |

The exact spot for both is already marked in the `<head>` of every page. I
paste them in and the whole site reports into one property.

Because the Donorbox redirect is not being used, the completed gift cannot be
counted on the thank-you page. When we do this, the conversion will be counted
from the `donate_intent` signal already firing on every Donate button, or from
Donorbox's own reporting — I will set it up whichever way suits the account.

If the GA4 property does not exist yet, create that first — the Ads
conversion is built on top of it.

---

## 4. The live domain

Everything is written for **`jerusalemunity.org`**. If the site is published
anywhere else, tell me the real domain and I will update:

- the `canonical` and social tags on every page
- the structured data (the nonprofit / donation markup Google reads)
- `robots.txt` and `sitemap.xml`

Google Ad Grants requires the ad's landing page to sit on **the same verified
domain as the rest of the site** — which is exactly why the donation page is
now `jerusalemunity.org/donate.html` instead of a link out to the old site.
Please do not point the Donate buttons back to another domain; it is the
single most common cause of Ad Grants rejection.

---

## 5. Optional, but they make the page better

- **A photo for the Visit Jerusalem band.** It currently uses the campus
  render. A real photograph of Jerusalem or of a gathering would be stronger.
- **Podcast artwork**, if you want the featured-episode card to carry the
  show's cover art rather than the microphone emblem.
- **Bank transfer details and a mailing address** for the "Other Ways to
  Give" section. Right now those routes go to `info@jerusalemunity.org` and a
  person replies — which is fine, but publishing the details saves a round trip.
- **A refund window other than 30 days**, if your policy differs from what
  the page currently states.

---

## What is done and needs nothing from you

- The donation page: hero, why-give, where-your-gift-goes, the **working**
  giving form, six other ways to give, six transparency statements, eight
  FAQs, and a closing call — all on-brand, all responsive, all tested at
  desktop, tablet, and phone widths.
- The thank-you page, in place and ready if the redirect is ever turned on.
- The giving section on the home page, linking to your own page rather than
  to the old site.
- Every "Donate Now" on every page — header, footer, master plan, pop-ups —
  pointing at `donate.html`.
- `robots.txt`, `sitemap.xml`, meta descriptions, canonical tags, and
  nonprofit structured data.
- A `donate_intent` signal on every Donate button, so once analytics is in
  you can see which button on which page actually drives giving.

---

## Why a page *and* a section, rather than one or the other

You asked what Google recommends. Both, and for different reasons:

**The dedicated page (`donate.html`) is what Google Ads needs.**
Ad Grants judges landing-page quality and relevance, requires the landing
page to be on your verified domain, and requires measurable conversions. A
page you own gives all three. A link out to another site gives none of them.

**The home-page section is what visitors need.**
Most people never see an ad. They scroll. The section states the 501(c)(3)
position, shows where a gift goes, and hands off to the full page — so
giving is one click from anywhere without turning the home page into a
fundraising appeal.

Ad Grants also requires the landing page to carry **real content**, not just
a donation widget: a clear description of the nonprofit, what the money does,
and no misleading claims. That is why the page leads with *why*, states where
gifts go in plain words with no invented figures, and publishes its
tax, receipt, refund, and privacy positions openly.

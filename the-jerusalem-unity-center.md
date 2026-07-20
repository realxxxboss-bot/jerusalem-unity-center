# The Jerusalem Unity Center — Landing Page

**Tagline:** *A Center of Consciousness for Humanity*

A single-page, static marketing/landing site for the Jerusalem Unity Center — a global gathering place for learning, dialogue, spiritual development, cultural exchange, and human flourishing. The page was built pixel-faithfully from a design mockup (`assets/full-mockup.png`, 864px render scaled ×5/3 to a 1440px desktop reference), with all colors and spacing sampled/measured directly from that mockup.

---

## Tech Stack

- **Pure static site** — no frameworks, no build step, no dependencies.
- `index.html` — all markup + inline vanilla JavaScript (mobile nav toggle, membership modal).
- `style.css` — one stylesheet (~2,000 lines), desktop-first with mobile overrides at the bottom.
- `assets/` — background images, section photos, and icon PNGs.
- **Fonts:** Google Fonts (loaded via `<link>` with preconnect):
  - **Cormorant Garamond** (500, 600) — serif, used for headings, brand name, and quotes.
  - **Poppins** (300, 400, 500, 600) — sans-serif, used for body text, nav, buttons, and descriptions.

---

## Color Scheme

The overall palette is **deep navy + antique gold** — dark, reverent, and warm. Core tokens live in `:root` at the top of `style.css`; each section adds its own scoped tokens.

### Core palette

| Token | Hex | Use |
|---|---|---|
| `--navy` | `#0A0F23` | Page background, header/nav base |
| `--navy-soft` | `#13162B` | Hero far-left base |
| `--gold` | `#C4923F` | Dominant gold accent (brand sub-line, hero quote) |
| `--gold-hi` | `#CD9C4C` | Gold gradient top (heading gradient, hover states) |
| `--gold-lo` | `#BC8C3E` | Gold gradient bottom |
| `--btn-gold-top` | `#A87836` | Button gradient top |
| `--btn-gold-bottom` | `#724E1D` | Button gradient bottom |
| `--btn-text-cream` | `#F3EDDC` | Cream text on gold buttons (with dark text-shadow) |
| `--btn-bevel` | `rgba(226,185,115,0.6)` | 1px bevel border on gold buttons |
| `--white` | `#FFFFFF` | Headings |
| `--text-body` | `#E9E9EE` | Hero paragraph text |
| `--text-nav` | `#E6E2E6` | Nav links |
| `--ghost-border` | `rgba(201,155,92,0.55)` | "Watch Our Story" ghost button border |

### Section-scoped colors

| Section | Tokens |
|---|---|
| **Pillars strip (S2)** | `--s2-hairline #7E5C3D` (bronze top hairline), `--s2-title #DEDCE3`, `--s2-desc #C8C4CC` |
| **Institutes (S3)** | `--s3-cream #EBDFD4` (light cream background), `--s3-heading #262242`, `--s3-card-navy #0A0E25` (card bodies), `--s3-orn-gold #BFA075` (heading ornaments), `--s3-title #EEEDED`, `--s3-desc #CBC8D2` |
| **Future banner (S4)** | base `#150C31`; "HUMANITY" uses a brighter gold gradient `#F3DF93 → #DDB874`; paragraph `#E5E2EA` |
| **Pathways (S5)** | cream bg (matches S3), `--s5-title #3A3552`, `--s5-desc #5C5566`, `--s5-divider #D6BDA6` (thin vertical gold lines) |
| **Join banner (S6)** | `--s6-navy #150E30`, `--s6-para #DFE1E3` |
| **Footer** | `--footer-heading #C0965C`, `--footer-link #C0BCC8`, `--footer-quote #E7B559`, `--footer-qmark #D9A445`, `--footer-attr #C39C60`, `--footer-muted #ACA9B8`, `--footer-line rgba(255,255,255,0.12)` |

### Rhythm of the page

Dark navy (hero) → dark navy strip (pillars) → **light cream** (institutes) → dark navy photo banner (future) → **light cream** (pathways) → dark navy banner (join) → dark footer. The alternation of dark/cream sections gives the page its visual rhythm; gold is the constant thread through every section.

---

## Typography Conventions

- **Headings & quotes:** Cormorant Garamond, weight 500–600, uppercase, generous letter-spacing (0.02–0.27em). Hero heading is `clamp(40px, 3.6vw, 52px)`.
- **Body & UI:** Poppins, light (300) for paragraphs, 500–600 for nav/buttons, small sizes (10.5–13px) with wide tracking on uppercase labels.
- **Gold gradient text** is done with `background-clip: text` (hero "in Jerusalem", S4 "Humanity").
- **Quotes** use decorative `“ ”` marks (`.qmark`) at reduced opacity.

## Button Language

All CTAs share the same system: 4px border radius, uppercase Poppins 600 with 0.10–0.12em tracking, and:
- **Primary/gold** — vertical gradient `#A87836 → #724E1D`, cream text with dark text-shadow, 1px gold bevel border, `brightness(1.12)` on hover.
- **Ghost** — translucent navy fill with a soft gold border ("Watch Our Story", with a gold play-circle icon).
- Arrow CTAs use an inline SVG long-arrow (`.icon-arrow`).

---

## Page Structure (`index.html`)

1. **Hero** (`#hero`) — full-bleed Jerusalem skyline background (`herobg.png`, positioned `50% 23%` to match the mockup framing) with a left-to-right dark overlay gradient. Contains:
   - Transparent header: circular gold emblem logo (visually scaled ×1.66), brand text stack, 8-link uppercase nav, gold "Support the Center" button, search icon button, and a mobile hamburger.
   - Heading "A Center for Welcoming The Nations **in Jerusalem**" (gold gradient on last words), subline, scripture quote (*"In that Day, his name will be One and he will be One" — Zechariah 14:9*), and two CTAs ("Explore the Vision" / "Watch Our Story").
2. **Pillars strip** (`#explore`) — 7 icon columns on navy: Learn, Library, Community, Events, Institutes, Research, Global Chapters. Bronze hairline on top.
3. **Discover Our Institutes** (`#institutes`) — cream section, serif heading with diamond-tipped gold ornaments, 6 navy cards each with a photo, circular gold emblem, title, and description: Consciousness, Spiritual Intelligence, Human Flourishing, Moral Leadership, Global Dialogue, Science & Consciousness. "View All Institutes" arrow link below.
4. **A Future Gathering Place for Humanity** (`#vision`) — 420px photo banner (campus render on the right), left-aligned heading with bright-gold "Humanity", paragraph, "View the Master Plan" CTA.
5. **Five Pathways of Exploration** (`#pathways`) — cream section, 5 columns with plain gold outline icons separated by thin 1px gold vertical dividers: Consciousness, Spiritual Development, Human Flourishing, Dialogue & Understanding, Culture & Wisdom.
6. **Join a Global Movement** (`#join`) — 213px navy banner with a gold dove icon, heading + paragraph, and a "Become a Member" button (opens the signup modal).
7. **Section 7 ("More Than a Building" photo strip)** — intentionally skipped for now; an HTML comment marks where it should be inserted.
8. **Footer** (`#footer`) — brand block + social links (Facebook, LinkedIn, email), three link columns (The Center / Resources / Get Involved) separated by faint vertical lines, a gold quote column (*"The light within illuminates the path for all."*), then a full-width bottom bar with copyright and Privacy/Terms links.
9. **Membership modal** — "Join the Movement" dialog styled in the site's navy/gold language.

All nav and footer links are **in-page anchors** to section IDs (smooth scroll via `scroll-behavior: smooth`); sub-pages don't exist yet, so placeholder targets are noted in HTML comments.

---

## JavaScript Behavior (inline in `index.html`)

- **Mobile nav:** hamburger toggles `.nav-open` on the header with proper `aria-expanded`/`aria-label` updates; the "Support the Center" button is cloned into the mobile menu; the menu closes when a link is tapped so the smooth scroll is visible.
- **Membership modal:** opened by any `.js-member-open` element ("Become a Member" button, "Join the Community" footer link). Validates the email with a regex, shows an inline error, and on success opens a `mailto:theseventynations@gmail.com` link pre-filled with the signup, then shows a confirmation message. Closes via ✕ button, overlay click, or Escape. Body scroll locks while open.

There is no backend — the signup is delivered via the visitor's own email client.

---

## Responsive Design

Desktop-first; all mobile overrides live in two blocks at the end of `style.css`:

- **`@media (max-width: 768px)`** — tablet/phone: hamburger menu replaces the nav row, sections restack, hero quote centered and constrained to 2 lines, footer columns reflow, `overflow-x: hidden` safety.
- **`@media (max-width: 480px)`** — small-phone refinements.

Desktop rules are intentionally untouched by the mobile work (the desktop design was approved first).

---

## Assets (`assets/`)

- **Backgrounds:** `herobg.png`, `section2-bg.png` … `section6-bg.png`, `footer-bg.png`.
- **Reference:** `full-mockup.png` — the source-of-truth design mockup all values were measured from.
- **Logo:** `the-jerusalme-unity-center.png` (gold circular emblem; used in header and footer).
- **Institute photos:** `institute-*.jpg` (6 card images).
- **Icons:** gold PNG icons for the pillars strip (`section2-*-icon.png`), institute card emblems, pathway icons, and `bird-icon.png` (the join-banner dove).
- Note: a few asset filenames contain typos (e.g. `sipritul-intelligence-icon.png`, `global-dialouge-icon.png`, `science-consciousness -icon.png` with a space) — the HTML references them as-is, so don't rename without updating `index.html`.

---

## Deployment

The site deploys as plain static files (built for **Hostinger**). Zips of the deployable snapshot are kept in the repo root — `jerusalem-unity-center.zip`, `-2.zip`, `-3.zip` (latest). To redeploy: zip `index.html`, `style.css`, and `assets/`, and upload.

## Contact / Links

- Email: theseventynations@gmail.com
- Facebook: https://www.facebook.com/profile.php?id=61590474344492
- LinkedIn: https://www.linkedin.com/in/meirah-marianne-paradise-b34072191/

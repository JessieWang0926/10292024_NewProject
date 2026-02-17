# CLAUDE.md — Mise & Margin Website

## Project Overview

**Mise & Margin** is a static single-page website for a restaurant and hospitality consultancy. It is a zero-dependency, no-build-step project consisting of exactly three source files.

- **Type**: Static SPA (single-page application)
- **Stack**: Plain HTML5, CSS3, vanilla JavaScript (ES6+)
- **No build tools**: No npm, webpack, Vite, or any package manager. Files are served directly.
- **Entry point**: `index.html`

---

## File Structure

```
10292024_NewProject/
├── index.html      # Full page markup — all sections in one file
├── styles.css      # All styles, tokens, and responsive rules
└── script.js       # All interactivity and form handling
```

There are no subdirectories, no assets folder, no configuration files, and no generated output directories. Every change is made directly to one of these three files.

---

## Architecture & Conventions

### HTML (`index.html`)

- One file contains the entire page in document order: Nav → Hero → Marquee → About → Services → Process → Contact → Footer.
- Sections use `id` attributes that match navigation `href` anchors (`#about`, `#services`, `#process`, `#contact`).
- SVG icons are inlined directly in the HTML (no icon library).
- The `<script src="script.js">` tag is placed at the bottom of `<body>` to avoid blocking render.
- The copyright year `<span id="year">` is populated dynamically by `script.js`.
- `aria-hidden="true"` is used on the marquee (decorative). Form success message uses `aria-live="polite"`.

**Section IDs** (used by JS and nav links):
| Section | ID |
|---|---|
| Navigation | `nav` |
| Hero | `hero` |
| About | `about` |
| Services | `services` |
| Process | `process` |
| Contact / Form | `contact` |

### CSS (`styles.css`)

**Design Tokens** — All design values are defined as CSS custom properties on `:root`:

| Token | Value | Purpose |
|---|---|---|
| `--clr-bg` | `#0a0a0a` | Page background |
| `--clr-bg-2` | `#111111` | Alternate section background |
| `--clr-bg-3` | `#181818` | Input focus background |
| `--clr-surface` | `#1c1c1c` | Card / input surface |
| `--clr-gold` | `#c9a84c` | Primary accent / CTA color |
| `--clr-gold-light` | `#e2c27a` | Lighter gold variant |
| `--clr-gold-dim` | `rgba(201,168,76,0.15)` | Translucent gold overlay |
| `--clr-text` | `#f0ede8` | Primary text |
| `--clr-text-muted` | `#8a8480` | Secondary / body text |
| `--clr-text-dim` | `#5a5652` | Tertiary / metadata text |
| `--clr-border` | `rgba(255,255,255,0.08)` | Subtle borders |
| `--clr-border-2` | `rgba(255,255,255,0.14)` | Slightly stronger borders |
| `--ff-serif` | `'Playfair Display', Georgia, serif` | Headlines, numbers, logo |
| `--ff-sans` | `'Space Grotesk', system-ui, sans-serif` | Body, labels, buttons |
| `--nav-h` | `72px` | Fixed nav height (used for offset calculations) |
| `--container` | `1200px` | Max content width |
| `--gutter` | `clamp(1.25rem, 5vw, 3rem)` | Horizontal padding |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary easing for reveals |
| `--ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` | Smooth in-out transitions |

**Class naming** follows a BEM-like convention: `block`, `block__element`, `block--modifier`.

Examples: `.service-card`, `.service-card__title`, `.btn--primary`, `.hero__headline-line--accent`.

**Responsive breakpoints** (mobile-first rules are inside these max-width media queries):
- `@media (max-width: 1024px)` — tablet: process grid goes 2-column
- `@media (max-width: 768px)` — mobile: nav drawer, single-column layouts, form stacking
- `@media (max-width: 480px)` — small mobile: stats and hero actions stack vertically

**Typography scale** uses `clamp()` for fluid sizing throughout — do not replace with fixed `px` values.

### JavaScript (`script.js`)

`'use strict'` is declared at the top. All code runs after `DOMContentLoaded`. Four initialization functions are called in sequence:

| Function | Responsibility |
|---|---|
| `initNav()` | Sticky scroll effect, mobile drawer toggle, active link highlight |
| `initScrollAnimations()` | Adds `.fade-up` class to elements, drives IntersectionObserver |
| `initForm()` | Live validation, async submit flow, success/error states |
| `initYear()` | Injects current year into `#year` |

**Form validation** — Required fields: `firstName`, `lastName`, `email`, `restaurant`. Email uses a basic regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Errors are shown in sibling `#<fieldId>Error` elements.

**Form submission stub** — `simulateSubmit()` fakes a 1500ms async delay. In production, replace the call in `initForm()` with a real `fetch()` POST to your backend or form service (e.g., Formspree, EmailJS, custom API). The comment `// --- Replace this block with your actual API call ---` marks the exact location.

**Scroll animations** use `IntersectionObserver` with `threshold: 0.12` and `rootMargin: '0px 0px -60px 0px'`. Elements receive `.fade-up` at setup and `.visible` when they enter the viewport. The observer unsubscribes after first intersection (fire-once behavior).

---

## Development Workflow

### Serving the site locally

Because there are no build steps, open `index.html` directly in a browser **or** use any static file server:

```bash
# Python (no install needed)
python3 -m http.server 8080

# Node (if available)
npx serve .

# VS Code Live Server extension also works
```

The Google Fonts stylesheet is loaded from CDN (`fonts.googleapis.com`). An internet connection is required for fonts to load during local development.

### Making changes

- **Markup changes**: Edit `index.html` directly. Sections are clearly commented (`<!-- NAV -->`, `<!-- HERO -->`, etc.).
- **Style changes**: Edit `styles.css`. Always use existing CSS custom properties rather than hardcoded values. Add new tokens to `:root` if a new design value is introduced.
- **Behavior changes**: Edit `script.js`. Add new initialization functions and call them inside the `DOMContentLoaded` listener.

### No linting / testing infrastructure

There is no test suite, linter, or formatter configured. Validate HTML at [validator.w3.org](https://validator.w3.org) and check CSS at [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/) if needed.

---

## Key Integration Point: Contact Form

The contact form (`#contactForm`) currently uses a simulated submission. To wire up a real backend:

1. Open `script.js` and locate the comment block starting with `// --- Replace this block with your actual API call ---`.
2. Replace `await simulateSubmit(payload);` with a `fetch()` call to your endpoint.
3. `payload` is already a plain object built from `FormData` with the keys: `firstName`, `lastName`, `email`, `phone`, `restaurant`, `service`, `message`.

Example replacement:

```js
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

---

## Design Aesthetic & Conventions

- **Dark editorial**: Deep black backgrounds, warm off-white text, gold (`#c9a84c`) as the sole accent color. Do not introduce additional accent colors.
- **Typography hierarchy**: Playfair Display for all display/headline text; Space Grotesk for all body, labels, and UI copy.
- **Gold usage**: Gold is used for active states, CTAs, accent labels, icons, and borders on hover. It should remain restrained — not applied to body text or backgrounds en masse.
- **Spacing**: Use `clamp()` for section padding (`clamp(5rem, 10vw, 9rem)`) to maintain fluid spacing across viewports.
- **Borders**: Use `var(--clr-border)` (8% white) for structural dividers; `var(--clr-border-2)` (14% white) for interactive elements like inputs.
- **Border-radius**: `2px` throughout — subtle, not pill-shaped.
- **Hover effects**: Translate elements `translateY(-2px)` on hover for interactive lift; use gold underline slides for nav links.

---

## Sections Reference

| Section | Key classes | Notes |
|---|---|---|
| Nav | `.nav`, `.nav__inner`, `.nav__links`, `.nav__toggle` | Fixed; gains `.scrolled` class after 30px scroll |
| Hero | `.hero`, `.hero__content`, `.hero__bg` | Full viewport height; grain + grid overlay via CSS |
| Marquee | `.marquee`, `.marquee__track` | `aria-hidden`; CSS `@keyframes marquee` animation |
| About | `.about`, `.about__grid`, `.stat` | 2-col grid; left headline is `position: sticky` on desktop |
| Services | `.services__grid`, `.service-card` | 2-col grid separated by `var(--clr-border)` lines |
| Process | `.process__steps`, `.process-step` | 4-col desktop → 2-col tablet → 1-col mobile |
| Contact | `.contact__grid`, `.form` | 2-col grid; form on right |
| Footer | `.footer`, `.footer__grid`, `.footer__bottom` | Static; copyright year injected by JS |

---

## Git Conventions

- Branch naming: feature branches use the `claude/` prefix (e.g., `claude/claude-md-mlr0ihpd4y1i9rbr-QYYoM`).
- Commit messages use the `feat:` prefix for new features (matching the initial commit style).
- The default branch is `master`.

# Implementation Plan: About & Contact Pages

**Branch**: `003-about-contact` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-about-contact/spec.md`

## Summary

Build static About and Contact pages with Portal/Aperture Science terminal aesthetic. The About page features a terminal-styled "whoami" stats block with staggered reveal animations. The Contact page displays clickable contact methods with Nerd Font icons and copy-to-clipboard for email. Both pages include typewriter title effects, shared navigation, and at least two Portal-themed easter eggs for personality.

## Technical Context

**Language/Version**: HTML5, CSS3, ES5+ JavaScript (no transpilation)
**Primary Dependencies**: None new (reuses existing homepage patterns)
**Storage**: N/A — static content only
**Testing**: Manual browser testing (file:// and local server)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Static web pages
**Performance Goals**: < 1 second load on broadband, < 100KB per page (excluding shared assets)
**Constraints**: Zero-build, no frameworks, max 3 nesting levels
**Scale/Scope**: 2 HTML pages, 1 shared CSS file, 1 shared JS file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Requirement | Compliance |
|---------|-------------|------------|
| I | Zero-build portability | Opens directly via `/about/index.html` and `/contact/index.html` |
| II | Minimal dependencies | No new dependencies — vanilla JS for all interactions |
| III | One-file-per-type | 2 HTML (about, contact), 1 CSS, 1 JS maximum |
| IV | Never-nesting | All logic within 3 levels — early returns required |
| V | Content-data separation | N/A — static hardcoded content, rarely changes |
| VI | Pixel art aesthetic | Reuses homepage mascot and dark mode; no new pixel art needed |
| VII | Anti-corporate voice | Casual, first-person, Australian-friendly tone required |
| VIII | Desktop-first, mobile-functional | Responsive breakpoints, 44px touch targets |
| X | Simplicity gate | Static pages with vanilla JS animations |
| XI | Strict version control | Atomic commits on feature branch |
| XII | Dependency attribution | No new dependencies to document |

## Project Structure

### Documentation (this feature)

```text
specs/003-about-contact/
├── plan.md              # This file
├── research.md          # Technical decisions (animations, easter eggs)
├── quickstart.md        # Developer setup guide
└── tasks.md             # Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
/
├── about/
│   └── index.html          # About page (clean URL: /about)
├── contact/
│   └── index.html          # Contact page (clean URL: /contact)
├── css/
│   └── about-contact.css   # Shared styles for both pages
└── js/
    └── about-contact.js    # Shared interactions (typewriter, copy, easter eggs)
```

**Structure Decision**: Clean URL pattern via `directory/index.html` structure (matching existing `/blog/index.html`). Single CSS and JS file shared between both pages per Article III.

## Complexity Tracking

> No constitutional violations — implementation uses vanilla HTML/CSS/JS patterns already established on homepage.

---

## Technical Design

### 1. Terminal Stats Block (About Page)

A "whoami" styled terminal block displaying user info with staggered line reveals:

```
> whoami
pykee

> location
Brisbane, AU

> languages --human
English, Deutsch, 日本語 (少し)

> uptime
Since 1998
```

**Implementation**:
- CSS class `.terminal-block` with monospace styling, amber border
- Each line wrapped in `<div class="terminal-line" data-delay="N">` for staggered animation
- CSS `@keyframes` with `animation-delay` based on line index
- Respects `prefers-reduced-motion` — shows all lines immediately if enabled

### 2. Typewriter Effect (About, Contact, and Blog Pages)

Page titles reveal character-by-character on load:

**About**: `# ./whoami`
**Contact**: `# ./contact`
**Blog**: `# ./blog`

**Note**: Blog page requires integration with existing blog.js — the typewriter effect should be added to the blog index view title.

**IMPORTANT - Blog Title Styling**: The blog page title MUST match the About and Contact page styling exactly:
- Use `.page-title` class (not `.blog-title`)
- Font size: `var(--font-size-hero)` (2.5rem)
- Text shadow: `0 0 20px var(--color-amber-dim)`
- Margin bottom: `var(--space-xl)`
- Import/duplicate the exact CSS from `about-contact.css` into `blog.css`

**Implementation**:
- JavaScript `typewriter()` function
- Operates on `.typewriter-title` elements
- 50ms per character delay
- Final cursor blink using CSS animation (reuses homepage `.cta-cursor` pattern)
- Graceful degradation: full text visible if JS disabled (text in HTML, JS adds animation)

### 3. Contact Methods with Icons

Four contact links styled as terminal output with Nerd Font icons:

| Method | Icon (Nerd Font) | Glyph | URL |
|--------|------------------|-------|-----|
| Email | nf-md-email | 󰇮 | mailto:contact@pyk.ee |
| LinkedIn | nf-fa-linkedin | | linkedin.com/in/pykejacob |
| GitHub | nf-fa-github | | github.com/JPyke3 |
| Mastodon | nf-md-mastodon | 󰫑 | mastodon.social/@pykee |

**Implementation**:
- JetBrains Mono Nerd Font already includes Nerd Font glyphs (verify availability)
- Fallback: Unicode symbols or text labels if glyphs fail to render
- Each link in `<a class="contact-method">` with icon span and text span
- External links: `target="_blank" rel="noopener noreferrer"`

### 4. Copy-to-Clipboard (Email)

Click email address to copy, show brief confirmation:

**Implementation**:
- `navigator.clipboard.writeText()` on email link click (prevent default)
- Show toast: "copied to clipboard" with 2s auto-dismiss
- Toast styled as terminal message: `[ok] contact@pyk.ee copied`
- Fallback: standard mailto behavior if clipboard API unavailable

### 5. Portal Easter Eggs

Two easter eggs to reinforce the Aperture Science aesthetic:

**Easter Egg 1: GLaDOS Quote Footer**
- Random GLaDOS quote displayed in footer on page load
- Quotes:
  - "The cake is a lie."
  - "This was a triumph."
  - "I'm not even angry. I'm being so sincere right now."
  - "Speedy thing goes in, speedy thing comes out."
  - "For science. You monster."
- Styled with italics, dimmed opacity, small font
- **Quote formatting**: Opening and closing quotation marks MUST be on the same line as the quote text, with attribution on a separate line below

**Easter Egg 2: Portal Mode Color Shift**
- Clicking the word "tinkerer" on the About page triggers a dramatic color transformation
- All amber colors (#FF9900) transition to Portal blue (#00A1FF)
- A Portal-inspired animation plays during the transition:
  - Circular "portal opening" effect expands from the clicked element
  - Radial gradient wave sweeps across the page
  - Colors transition smoothly over ~0.5s
- Click again to toggle back to amber mode
- CSS custom properties enable the color swap (change `--color-amber` values)
- Body class `.portal-mode` controls the blue theme state
- Respects `prefers-reduced-motion` - instant color change without animation if enabled

### 6. Page Load Animation

Staggered element reveals for polished entry:

**Sequence**:
1. Header navigation (immediate)
2. Page title with typewriter effect (0ms start)
3. Main content blocks (200ms delay each)
4. Footer with GLaDOS quote (last)

**Implementation**:
- CSS `@keyframes fadeSlideUp` with `transform: translateY(20px)` to `translateY(0)`
- Elements start with `opacity: 0`, animated to `opacity: 1`
- `animation-fill-mode: forwards`
- Stagger via inline `style="animation-delay: Nms"` or CSS variables

### 7. Accessibility

- `prefers-reduced-motion`: Disable all animations, show content immediately
- `aria-current="page"` on active nav link
- All links accessible via keyboard
- Focus indicators matching homepage style
- Copy confirmation announced to screen readers via `aria-live="polite"` region

### 8. Responsive Design

**Breakpoints** (matching homepage):
- Desktop: > 767px (primary design)
- Mobile: ≤ 767px (stacked layout, larger touch targets)
- Extra small: ≤ 320px (reduced spacing)

**Mobile Adjustments**:
- Contact methods stack vertically
- Terminal block font size reduced
- Touch targets minimum 44x44px

---

## Shared Assets Reuse

| Asset | Source | Usage |
|-------|--------|-------|
| CSS variables | `homepage.css :root` | Import or duplicate color/spacing tokens |
| Navigation styles | `homepage.css .main-nav` | Copy or import nav CSS block |
| CRT scanlines | `homepage.css body::before` | Same effect applied |
| Scroll indicator | `homepage.css .scroll-indicator` | Footer "back to top" if needed |
| Font face | `homepage.css @font-face` | JetBrains Mono (already loaded) |

**Decision**: The `about-contact.css` file will duplicate necessary base styles rather than importing `homepage.css` to avoid loading unused homepage-specific styles (particle canvas, hero section).

---

## File Dependencies

```
about/index.html
├── css/about-contact.css
├── js/about-contact.js
└── favicon.svg

contact/index.html
├── css/about-contact.css
├── js/about-contact.js
└── favicon.svg
```

No external dependencies. All vendor assets already in place (JetBrains Mono fonts).

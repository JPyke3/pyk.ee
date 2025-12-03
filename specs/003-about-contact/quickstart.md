# Quickstart: About & Contact Pages

**Feature**: 003-about-contact | **Date**: 2025-12-03

## Prerequisites

- Git (for version control)
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Local HTTP server (e.g., Python's `http.server`, Node's `serve`, or Live Server extension)
- Text editor (VS Code, Neovim, etc.)

## Setup

### 1. Switch to Feature Branch

```bash
cd /home/jacobpyke/Development/Pyk.ee
git checkout -b 003-about-contact
```

### 2. Create Directory Structure

```bash
mkdir -p about contact
```

### 3. Start Local Server

```bash
# Python 3
python -m http.server 8000

# Or Node.js (if serve installed)
npx serve .

# Or PHP
php -S localhost:8000
```

### 4. Verify Existing Pages

Open `http://localhost:8000` and confirm:
- Homepage loads with navigation showing About and Contact links
- Blog loads at `/blog`
- Existing styling (amber on black, JetBrains Mono) renders correctly

## Development Workflow

### File Locations

| File | Purpose |
|------|---------|
| `about/index.html` | About page markup |
| `contact/index.html` | Contact page markup |
| `css/about-contact.css` | Shared styles |
| `js/about-contact.js` | Shared interactions |

### Testing Checklist

After each significant change:

1. **Visual**: Refresh browser, check desktop and mobile (375px) viewports
2. **Interaction**: Test typewriter effect, copy-to-clipboard, easter eggs
3. **Accessibility**: Tab through all links, check with reduced motion enabled
4. **File Protocol**: Open `about/index.html` directly via `file://` to verify no CORS errors

### Atomic Commits

Per Article XI, commit each logical change separately:

```bash
# Example commit sequence
git add about/index.html
git commit -m "feat(about): add page structure and navigation"

git add css/about-contact.css
git commit -m "style(about-contact): add base styles and terminal block"

git add js/about-contact.js
git commit -m "feat(about-contact): add typewriter effect for titles"
```

## Key Implementation Notes

### CSS Variables

Duplicate these from `homepage.css` into `about-contact.css`:

```css
:root {
  --color-amber: #FF9900;
  --color-amber-light: #FFB000;
  --color-amber-dim: rgba(255, 153, 0, 0.6);
  --color-bg: #000000;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}
```

### Navigation Consistency

Copy the navigation HTML from `index.html` (lines 16-26) to both new pages. Update `aria-current="page"` to the correct link:

```html
<!-- about/index.html -->
<li><a href="/about" class="nav-link" aria-current="page">About</a></li>

<!-- contact/index.html -->
<li><a href="/contact" class="nav-link" aria-current="page">Contact</a></li>
```

### Reduced Motion

Wrap all animations in a media query check:

```css
@media (prefers-reduced-motion: reduce) {
  .terminal-line,
  .typewriter-title span {
    animation: none !important;
    opacity: 1 !important;
  }
}
```

### SVG Icons (Contact Methods)

Use inline SVGs with `currentColor` for icons:

```html
<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
  <path fill="currentColor" d="..."/>
</svg>
```

## Validation

Before marking feature complete:

- [ ] Both pages accessible at `/about` and `/contact`
- [ ] Navigation consistent with homepage
- [ ] Terminal stats block renders on About page
- [ ] All 4 contact methods clickable on Contact page
- [ ] Email copy-to-clipboard works (with toast)
- [ ] GLaDOS quote appears in footer
- [ ] Companion cube appears on "tinkerer" hover
- [ ] Mobile layout functional (375px viewport)
- [ ] Reduced motion preference respected
- [ ] All commits follow conventional format

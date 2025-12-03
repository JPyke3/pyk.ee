# Research: About & Contact Pages

**Feature**: 003-about-contact | **Date**: 2025-12-03

## Technical Decisions

### 1. Nerd Font Icons

**Question**: How to display Nerd Font icons for contact methods?

**Options Evaluated**:
1. **Nerd Font-patched JetBrains Mono** — Requires downloading and hosting the full Nerd Font variant (~2MB+)
2. **Separate icon font** — Additional HTTP request, more complexity
3. **Unicode fallback symbols** — Works universally but less distinctive
4. **Inline SVG icons** — Zero dependencies, full control, matches existing mascot approach

**Decision**: **Inline SVG icons**

**Rationale**:
- Consistent with existing mascot SVG approach (index.html lines 32-83)
- No additional font files or HTTP requests
- Full control over color, size, and styling
- Works offline and in file:// protocol
- Simpler than font subsetting or Nerd Font installation

**Implementation**: Create simple 16x16 SVG icons for each contact method, styled with `fill: currentColor` to inherit amber text color.

---

### 2. Typewriter Effect Approach

**Question**: How to implement character-by-character title reveal?

**Options Evaluated**:
1. **CSS animation with clip-path** — Pure CSS, but limited control over timing
2. **JavaScript innerHTML manipulation** — Simple but causes reflow per character
3. **JavaScript with pre-rendered spans** — Text split into `<span>` per character, CSS transitions opacity

**Decision**: **JavaScript with pre-rendered spans**

**Rationale**:
- Smoother animation (opacity transitions vs. innerHTML changes)
- Progressive enhancement: full text in HTML, JS adds animation layer
- Matches the "terminal typing" aesthetic better
- Single reflow on init, then GPU-composited transitions

**Implementation**:
```javascript
// Pseudocode
function typewriter(element) {
  var text = element.textContent;
  element.innerHTML = '';
  text.split('').forEach(function(char, i) {
    var span = document.createElement('span');
    span.textContent = char;
    span.style.opacity = '0';
    span.style.transitionDelay = (i * 50) + 'ms';
    element.appendChild(span);
  });
  // Trigger reflow, then add visible class
  element.offsetHeight;
  element.classList.add('typing-complete');
}
```

---

### 3. Copy-to-Clipboard Strategy

**Question**: How to handle email copy functionality with fallback?

**Options Evaluated**:
1. **navigator.clipboard.writeText()** — Modern API, requires HTTPS or localhost
2. **document.execCommand('copy')** — Deprecated but wider support
3. **No copy, just mailto** — Simplest but less convenient

**Decision**: **navigator.clipboard with mailto fallback**

**Rationale**:
- Modern browsers support clipboard API
- Graceful fallback: if clipboard fails, the mailto link still works
- Toast notification only shown on successful copy
- No deprecated APIs needed

**Implementation**:
```javascript
emailLink.addEventListener('click', function(e) {
  if (!navigator.clipboard) return; // Let mailto work

  e.preventDefault();
  navigator.clipboard.writeText('contact@pyk.ee').then(function() {
    showToast('[ok] contact@pyk.ee copied');
  }).catch(function() {
    // Fallback: trigger mailto
    window.location.href = 'mailto:contact@pyk.ee';
  });
});
```

---

### 4. Portal Easter Egg Selection

**Question**: Which Portal easter eggs provide the best personality without bloat?

**Options Evaluated**:
1. **GLaDOS quote footer** — Low effort, high recognition, text-only
2. **Companion cube hover** — Visual surprise, requires small SVG
3. **Konami code unlock** — Hidden interaction, more complex
4. **"Still Alive" audio snippet** — Requires audio file, accessibility concerns
5. **Turret voice warning** — Audio, same concerns as above

**Decision**: **GLaDOS quote footer + Companion cube hover**

**Rationale**:
- Both are visual/text-only (no audio files to host)
- GLaDOS quotes are immediately recognizable to Portal fans
- Companion cube is iconic and works as small pixel art SVG
- Neither interferes with core functionality
- Both can be disabled by reduced motion preference

**GLaDOS Quotes**:
```javascript
var GLADOS_QUOTES = [
  "The cake is a lie.",
  "This was a triumph.",
  "I'm not angry. I'm being so sincere right now.",
  "Speedy thing goes in, speedy thing comes out.",
  "For science. You monster."
];
```

**Quote Formatting**: The closing quotation mark MUST appear on the same line as the quote text. The attribution ("— GLaDOS") appears on a separate line below. This is standard typographic convention for blockquotes.

**Companion Cube SVG** (32x32 or 48x48):
- Must be recognizable as the Portal Weighted Companion Cube
- Gray cube body with 3D/isometric appearance
- Pink heart on visible face(s)
- Corner decorations matching the game's distinctive design
- Amber tint applied to match site palette
- Appears when hovering "tinkerer" text on About page
- CSS `opacity: 0` → `opacity: 1` transition

**Note**: Initial 8x8 implementation was too abstract and unrecognizable. Redesigned to 32x32+ with proper cube geometry and iconic heart symbol.

---

### 5. CSS Architecture

**Question**: Duplicate styles from homepage.css or import it?

**Options Evaluated**:
1. **@import homepage.css** — Single source of truth, but loads unused styles
2. **Duplicate tokens only** — Copy CSS variables, write fresh component styles
3. **Shared base.css** — Refactor homepage.css into base + homepage-specific

**Decision**: **Duplicate tokens + fresh component styles**

**Rationale**:
- Homepage has page-specific styles (particle canvas, hero section) that don't apply
- Duplicating CSS variables (colors, fonts, spacing) is ~30 lines
- Fresh component styles for about-contact specific elements
- Avoids refactoring homepage.css mid-feature (scope creep)
- Article III allows one CSS file per feature

**CSS Variables to Duplicate**:
```css
:root {
  --color-amber: #FF9900;
  --color-amber-light: #FFB000;
  --color-amber-dim: rgba(255, 153, 0, 0.6);
  --color-bg: #000000;
  --color-bg-elevated: #0a0a0a;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  /* ... spacing, font-sizes ... */
}
```

---

### 6. Animation Timing

**Question**: What animation timing provides polish without feeling slow?

**Decisions**:

| Animation | Duration | Delay | Easing |
|-----------|----------|-------|--------|
| Typewriter | 50ms per char | 0ms start | linear (discrete reveal) |
| Terminal line reveal | 300ms | 100ms stagger | ease-out |
| Page content fade-in | 400ms | 200ms stagger | ease-out |
| Toast appearance | 200ms | 0ms | ease-out |
| Toast dismiss | 200ms | 2000ms | ease-in |
| Companion cube fade | 200ms | 0ms | ease |

**Rationale**: Fast enough to feel snappy, slow enough to be perceived. Stagger creates visual hierarchy without blocking content access.

---

### 7. Screen Reader Accessibility

**Question**: How to announce copy confirmation to screen readers?

**Decision**: **aria-live region**

**Implementation**:
```html
<div id="toast-region" aria-live="polite" aria-atomic="true" class="sr-only"></div>
```

When copy succeeds, inject text into this region. Screen readers will announce it without disrupting page flow.

---

## Unresolved Questions

None — all technical decisions are resolved. Ready for task generation.

---

## References

- [navigator.clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) — MDN
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — MDN
- [aria-live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) — MDN
- Portal franchise quotes — Valve Corporation

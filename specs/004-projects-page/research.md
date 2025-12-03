# Research: Projects Page

**Feature**: 004-projects-page
**Date**: 2025-12-03
**Status**: Complete

## Research Topics

### 1. GitHub REST API - Repository Stats

**Decision**: Use public unauthenticated API endpoint

**Endpoint**: `GET https://api.github.com/repos/{owner}/{repo}`

**Response Fields Needed**:
```json
{
  "stargazers_count": 61,
  "forks_count": 10,
  "language": "Shell",
  "description": "ISO build scripts for Manjaro..."
}
```

**Rate Limits**:
- Unauthenticated: 60 requests/hour per IP
- With 9 projects, full refresh = 9 requests
- Safe margin: can refresh ~6 times per hour

**Rationale**: Personal portfolio with small project count makes authentication unnecessary. 60 req/hour is generous for a single-visitor site.

**Alternatives Considered**:
- GitHub GraphQL API: Requires authentication, overkill for simple stats
- Server-side proxy: Violates Article I (zero-build), adds complexity
- Static-only (no live stats): Loses real-time credibility

---

### 2. localStorage Caching Strategy

**Decision**: Per-project cache with 1-hour TTL

**Cache Key Format**: `pykee_github_{owner}_{repo}`

**Cache Value Structure**:
```json
{
  "stars": 61,
  "forks": 10,
  "language": "Shell",
  "timestamp": 1701590400000
}
```

**Cache Logic**:
```javascript
function getCachedStats(owner, repo) {
  var key = 'pykee_github_' + owner + '_' + repo;
  var cached = localStorage.getItem(key);
  if (!cached) return null;

  var data = JSON.parse(cached);
  var age = Date.now() - data.timestamp;
  if (age > 3600000) return null; // 1 hour TTL

  return data;
}
```

**Rationale**: 1 hour balances freshness with API limits. Per-project keys allow partial cache updates.

**Alternatives Considered**:
- Single cache key for all projects: Harder to invalidate partially
- 24-hour TTL: Stars don't change fast, but feels stale
- No caching: Wastes API quota, slower UX

---

### 3. Expandable Card Interaction Pattern

**Decision**: Desktop in-place expansion, Mobile modal overlay

**Desktop Behavior**:
- Click card → expands inline, pushes content down
- Click again or press Escape → collapses
- Only one card expanded at a time
- CSS: `max-height` transition for smooth animation

**Mobile Behavior** (< 768px):
- Click card → full-screen modal slides up
- Close button (top-right) + tap backdrop + swipe down
- Focus trap inside modal
- `body` scroll lock when modal open

**Rationale**: Desktop has space for in-place expansion. Mobile needs full attention on single card.

**Implementation Pattern**:
```javascript
function expandCard(cardElement) {
  if (state.reducedMotion) {
    // Skip animation
    cardElement.classList.add('expanded');
    return;
  }

  if (isMobile()) {
    showModal(cardElement);
  } else {
    expandInPlace(cardElement);
  }
}
```

**Alternatives Considered**:
- Always modal: Desktop users lose context of grid position
- Always in-place: Mobile cards too small to expand meaningfully
- Hover expand: Not accessible, problematic on touch

---

### 4. Filter Animation with Reduced Motion

**Decision**: CSS-only animation with `prefers-reduced-motion` override

**Standard Animation**:
```css
.project-card {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.project-card.filtered-out {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
}
```

**Reduced Motion Override**:
```css
@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition: none;
  }

  .project-card.filtered-out {
    opacity: 0; /* Instant hide, no animation */
    transform: none;
  }
}
```

**Rationale**: Follows existing pattern in `about-contact.css`. CSS handles the preference, JS just toggles classes.

---

### 5. URL Hash Routing for Filters

**Decision**: Simple hash-based state persistence

**URL Patterns**:
- `/projects` - Default view (all projects)
- `/projects#linux` - Linux filter active
- `/projects#web` - Web filter active
- `/projects#search=kernel` - Search active

**Implementation**:
```javascript
function parseHash() {
  var hash = window.location.hash.slice(1); // Remove #
  if (!hash) return { filter: 'all', search: '' };

  var params = hash.split('&');
  var result = { filter: 'all', search: '' };

  params.forEach(function(param) {
    if (param.startsWith('search=')) {
      result.search = decodeURIComponent(param.slice(7));
    } else if (['linux', 'web', 'tools', 'learning'].indexOf(param) > -1) {
      result.filter = param;
    }
  });

  return result;
}

function updateHash(filter, search) {
  var parts = [];
  if (filter !== 'all') parts.push(filter);
  if (search) parts.push('search=' + encodeURIComponent(search));

  window.location.hash = parts.join('&');
}
```

**Rationale**: Shareable URLs without server-side routing. Hash changes don't trigger page reload.

---

### 6. Nerd Font Icons for Languages

**Decision**: Use CSS fallbacks with Unicode characters

**Implementation**:
```css
/* Nerd Font icons with fallback */
.lang-icon::before {
  font-family: 'JetBrains Mono', monospace;
}

.lang-icon--shell::before { content: ''; }     /* nf-dev-terminal */
.lang-icon--javascript::before { content: ''; } /* nf-dev-javascript */
.lang-icon--html::before { content: ''; }       /* nf-dev-html5 */
.lang-icon--rust::before { content: ''; }       /* nf-dev-rust */
```

**Fallback Strategy**:
JetBrains Mono includes many programming ligatures. If Nerd Font glyphs don't render, show text abbreviation (e.g., "SH" for Shell).

**Rationale**: JetBrains Mono is already loaded. Nerd Font glyphs add visual polish without extra font download.

---

### 7. Konami Code Easter Egg

**Decision**: Vanilla JS key sequence listener

**Implementation**:
```javascript
var KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
var konamiIndex = 0;

document.addEventListener('keydown', function(e) {
  if (e.keyCode === KONAMI[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === KONAMI.length) {
      revealCompanionCube();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function revealCompanionCube() {
  // Add hidden project to state and re-render
  state.projects.push({
    id: 'companion-cube',
    name: 'Weighted Companion Cube',
    tagline: 'A faithful friend',
    description: 'Will never threaten to stab you...',
    category: 'hidden',
    github_url: null,
    featured: false,
    fallback_stars: '∞'
  });
  renderProjects();
  showToast('[secret] The Companion Cube has been revealed');
}
```

**Rationale**: Classic easter egg that rewards curious users. No impact on normal functionality.

---

### 8. Existing Code Patterns Reference

**From `about-contact.js`**:
- IIFE wrapper with `'use strict'`
- CONFIG object for tunables
- state object for runtime data
- `checkReducedMotion()` function
- `typewriter()` function for title animation
- PORTAL_QUOTES array
- `showToast()` function

**To Reuse**:
- Copy PORTAL_QUOTES array
- Copy typewriter function (modified for projects title)
- Copy checkReducedMotion pattern
- Copy toast notification pattern

**From `about-contact.css`**:
- `:root` CSS variables (colors, spacing, typography)
- `.typewriter-title` styles
- `.toast` styles
- Reduced motion media query
- Navigation styles

**To Reuse**:
- Copy entire `:root` block
- Copy navigation styles
- Copy toast styles
- Copy reduced motion patterns

---

## Summary

All research questions resolved. No blockers identified. Implementation can proceed with:
- GitHub public API (no auth)
- localStorage with 1-hour TTL
- Desktop in-place + mobile modal expansion
- CSS-driven animations with reduced motion support
- Hash-based filter state
- Reuse of existing code patterns from about-contact.js/css

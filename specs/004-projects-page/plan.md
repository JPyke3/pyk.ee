# Implementation Plan: Projects Page

**Branch**: `004-projects-page` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-projects-page/spec.md`

## Summary

Build a Projects page that showcases curated open-source work through a terminal-styled interface with expandable project cards, category filtering, and live GitHub stats. The page will follow established patterns from the About/Contact pages while adding data-driven content from `projects.json` and GitHub API enrichment.

**Technical Approach**: Static JSON base + GitHub API enrichment with localStorage caching. Cards expand in-place on desktop, modal overlay on mobile. Filter state persisted in URL hash for shareability.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES5 for broad compatibility)
**Primary Dependencies**: None (follows Article II - minimal dependencies)
**Storage**: localStorage for GitHub stats cache (1-hour TTL)
**Testing**: Manual browser testing + Lighthouse accessibility audit
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), file:// protocol support for homepage
**Project Type**: Static web page (single HTML/CSS/JS feature)
**Performance Goals**:
- Page render < 1s (project cards visible immediately)
- GitHub stats appear < 2s on warm cache
- 60fps animations on filter/expand
**Constraints**:
- 60 requests/hour GitHub API limit (unauthenticated)
- Zero-build deployment
- Works with JavaScript disabled (static content visible)
**Scale/Scope**: ~10 curated projects, single page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Requirement | Status | Notes |
|---------|-------------|--------|-------|
| I | Zero-build portability | ✅ PASS | Opens via `projects/index.html` directly |
| II | Minimal dependency gate | ✅ PASS | No dependencies; vanilla JS only |
| III | One-file-per-type | ✅ PASS | Single `projects.js`, single `projects.css`, single `index.html` |
| IV | Never-nesting principle | ✅ PASS | Will use early returns and function extraction |
| V | Content-data separation | ✅ PASS | Project data in `/content/projects.json` |
| VI | Modern pixel art aesthetic | ✅ PASS | Reuses existing terminal aesthetic |
| VII | Anti-corporate voice | ✅ PASS | Casual tone: "Here's what I build when no one's paying me" |
| VIII | Desktop-first, mobile-functional | ✅ PASS | Desktop expand-in-place, mobile modal overlay |
| IX | WebAssembly showcase | N/A | Not applicable to this feature |
| X | Simplicity gate | ✅ PASS | Simple fetch + cache pattern, graceful fallbacks |
| XI | Strict version control | ✅ PASS | Feature branch workflow |
| XII | Dependency attribution | ✅ PASS | No new dependencies |

**Gate Status**: PASSED - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/004-projects-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (GitHub API contract)
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
# Existing structure (reference)
css/
├── homepage.css
├── blog.css
└── about-contact.css

js/
├── homepage.js
├── blog.js
└── about-contact.js

# New files for this feature
projects/
└── index.html           # Projects page HTML

css/
└── projects.css         # Projects-specific styles

js/
└── projects.js          # Projects page functionality

content/
└── projects.json        # Project data (to be populated)
```

**Structure Decision**: Follow existing pattern - each major page has its own directory with `index.html`, own CSS file in `/css/`, own JS file in `/js/`. Content comes from `/content/projects.json` per Article V.

## Complexity Tracking

> No constitutional violations requiring justification. All gates passed.

## Design Overview

### Page Layout

```
┌─────────────────────────────────────────────────────┐
│  [Home] [Projects*] [Blog] [About] [Contact]        │  ← Navigation
├─────────────────────────────────────────────────────┤
│  > ls ~/projects                                    │  ← Typewriter title
│                                                     │
│  > ./filter --all  --linux  --web  --tools  --learning │  ← Filter buttons
│  > grep -i "______" ~/projects/*                   │  ← Search input
│                                                     │
├─────────────────────────────────────────────────────┤
│  ## Featured                                        │
│  ┌─────────────────┐  ┌─────────────────┐         │
│  │  mbp-manjaro    │  │ arch-mbp-archiso│         │  ← Featured cards
│  │  ★ 61  ⑂ 10    │  │  ★ 11  ⑂ 2     │         │     (amber glow border)
│  │   Shell        │  │   Shell        │         │
│  └─────────────────┘  └─────────────────┘         │
│                                                     │
│  ## More Projects                 [Show more]      │
│  ┌─────────────────┐  ┌─────────────────┐         │
│  │  project-card   │  │  project-card   │         │  ← Regular cards
│  └─────────────────┘  └─────────────────┘         │     (2 columns desktop)
│                                                     │
├─────────────────────────────────────────────────────┤
│  "The cake is a lie." — GLaDOS                     │  ← Footer quote
└─────────────────────────────────────────────────────┘
```

### Expanded Card State

```
┌─────────────────────────────────────────────────────┐
│  mbp-manjaro                           ★ 61  ⑂ 10  │
│  Manjaro Linux for T2 MacBooks           Shell    │
├─────────────────────────────────────────────────────┤
│  ISO build scripts for running Manjaro Linux on    │
│  T2 MacBook hardware. Includes custom kernel       │
│  patches and driver support.                       │
│                                                     │
│  Tags: [linux] [shell] [macbook]                   │
│                                                     │
│  > git clone https://github.com/JPyke3/mbp-manjaro │
└─────────────────────────────────────────────────────┘
```

### Mobile Card Expansion (Modal Overlay)

On screens < 768px, expanded cards become full-screen modal overlays:
- Dimmed background
- Close button (top right)
- Swipe-to-dismiss (down gesture)
- Focus trap for accessibility

### JavaScript Module Structure

```javascript
(function() {
  'use strict';

  var CONFIG = {
    cache: { ttl: 3600000 },           // 1 hour in ms
    api: { timeout: 3000 },            // 3 second timeout
    animation: { duration: 300 },
    initialVisible: 6                   // Show 6 projects initially
  };

  var PORTAL_QUOTES = [...];           // Reuse from about-contact.js

  var state = {
    projects: [],
    activeFilter: 'all',
    searchTerm: '',
    expandedCard: null,
    visibleCount: 6,
    reducedMotion: false
  };

  var dom = {
    grid: null,
    filters: null,
    searchInput: null,
    showMoreBtn: null
  };

  // Functions: init, render, filter, expand, fetchGitHubStats, etc.
})();
```

### CSS Architecture

New CSS file `projects.css` will:
1. Import shared CSS variables from existing pattern (copy `:root` block)
2. Define project-specific components:
   - `.project-grid` - responsive grid layout
   - `.project-card` - card component with expand states
   - `.project-card--featured` - amber glow modifier
   - `.filter-bar` - filter button container
   - `.search-input` - terminal-styled search
   - `.card-expanded` - expanded state styling
   - `.mobile-modal` - mobile overlay component
3. Responsive breakpoints: 768px (mobile), 1024px (tablet)

### Data Flow

```
Page Load
    │
    ├─→ Fetch projects.json ────────────→ Render cards with fallback stats
    │                                           │
    └─→ For each project:                       │
        Check localStorage cache                │
            │                                   │
            ├─→ Cache hit (< 1hr) → Use cached stats
            │
            └─→ Cache miss/stale → Fetch GitHub API
                    │
                    ├─→ Success → Update cache + UI
                    │
                    └─→ Fail/timeout → Use fallback stats (silent)
```

### Filter State in URL

Hash-based routing for shareable filtered views:
- `#linux` - Show only Linux projects
- `#web` - Show only Web projects
- `#search=term` - Show search results
- Combined: `#linux&search=kernel`

### Easter Eggs Implementation

1. **GLaDOS Quotes**: Reuse pattern from about-contact.js, rotate on filter change
2. **Test Chamber Counter**: `localStorage.getItem('pykee_chamber_count')`, increment on card expand, log to console: `"Test subject has examined ${count} specimens"`
3. **Konami Code**: Event listener for ↑↑↓↓←→←→BA sequence, reveals hidden "Companion Cube" project card

### Accessibility Requirements

- Semantic HTML: `<main>`, `<section>`, `<article>` for cards
- Filter buttons: `role="tablist"` with `aria-selected`
- Card expand: Focus moves to expanded content, `aria-expanded` attribute
- Modal: Focus trap, `role="dialog"`, `aria-modal="true"`
- Screen reader: Live region announces filter changes
- Keyboard: Tab navigation, Enter/Space to expand, Escape to close
- Reduced motion: Check `prefers-reduced-motion`, skip animations

## Implementation Phases

### Phase 1: Core Page Structure (P1 - Browse Projects)
1. Create `projects/index.html` with semantic markup
2. Create `css/projects.css` with base styles
3. Create `content/projects.json` with all project data
4. Implement basic card rendering from JSON
5. Add responsive grid layout

### Phase 2: Card Interactions (P1 continued)
1. Implement card expand/collapse (desktop in-place)
2. Implement mobile modal overlay
3. Add keyboard navigation
4. Add focus management

### Phase 3: Filtering System (P2)
1. Add filter buttons with terminal styling
2. Implement category filtering logic
3. Add text search input
4. Implement URL hash routing
5. Add filter animations (with reduced motion support)

### Phase 4: GitHub API Integration (P3)
1. Implement localStorage cache layer
2. Add GitHub API fetch with timeout
3. Implement graceful fallback
4. Add loading skeleton states

### Phase 5: Polish & Easter Eggs (P4)
1. Add typewriter title animation
2. Implement GLaDOS quote rotation
3. Add Test Chamber counter
4. Implement Konami code easter egg
5. Final accessibility audit

## Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `projects/index.html` | Page structure | P1 |
| `css/projects.css` | Styling | P1 |
| `js/projects.js` | Functionality | P1 |
| `content/projects.json` | Project data | P1 |

## Files to Modify

| File | Change | Priority |
|------|--------|----------|
| None | No existing files need modification | - |

## Dependencies

None. This feature uses:
- Vanilla JavaScript (existing pattern)
- Vanilla CSS (existing pattern)
- GitHub REST API (public, no auth required)
- localStorage (browser native)

## Testing Checklist

- [ ] Page loads via `file://` protocol (Article I)
- [ ] Page loads via HTTP server
- [ ] All projects visible with JavaScript disabled
- [ ] Filter buttons work and update URL hash
- [ ] Cards expand/collapse correctly
- [ ] Mobile modal works with touch gestures
- [ ] GitHub stats load and cache correctly
- [ ] Graceful fallback when offline
- [ ] Keyboard navigation complete
- [ ] Screen reader announces filter changes
- [ ] Reduced motion respected
- [ ] Lighthouse accessibility score ≥ 90

## Post-Design Constitution Check

*Re-evaluated after Phase 1 design completion.*

| Article | Requirement | Final Status | Notes |
|---------|-------------|--------------|-------|
| I | Zero-build portability | ✅ PASS | All files static HTML/CSS/JS |
| II | Minimal dependency gate | ✅ PASS | No new dependencies introduced |
| III | One-file-per-type | ✅ PASS | Exactly one of each: HTML, CSS, JS |
| IV | Never-nesting principle | ✅ PASS | Design uses early returns, extracted functions |
| V | Content-data separation | ✅ PASS | projects.json drives all content |
| VI | Modern pixel art aesthetic | ✅ PASS | Terminal aesthetic preserved |
| VII | Anti-corporate voice | ✅ PASS | Tone matches spec |
| VIII | Desktop-first, mobile-functional | ✅ PASS | Responsive design documented |
| X | Simplicity gate | ✅ PASS | Fetch → cache → render pattern is minimal |
| XI | Strict version control | ✅ PASS | Feature branch active |
| XII | Dependency attribution | ✅ PASS | No dependencies to attribute |

**Final Gate Status**: PASSED - Ready for task generation via `/speckit.tasks`

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| research.md | `specs/004-projects-page/research.md` | ✅ Complete |
| data-model.md | `specs/004-projects-page/data-model.md` | ✅ Complete |
| quickstart.md | `specs/004-projects-page/quickstart.md` | ✅ Complete |
| contracts/github-api.md | `specs/004-projects-page/contracts/github-api.md` | ✅ Complete |

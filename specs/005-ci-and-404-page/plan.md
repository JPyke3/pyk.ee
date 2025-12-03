# Implementation Plan: CI Workflow and Custom 404 Page

**Branch**: `005-ci-and-404-page` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-ci-and-404-page/spec.md`

## Summary

Add continuous integration for HTML/CSS validation and a custom 404 error page. The CI workflow uses GitHub Actions with html-validate and stylelint to catch syntax errors on push to main. The 404 page provides a branded error experience with the site's terminal aesthetic and GLaDOS-style messaging.

**Technical Approach**: GitHub Actions workflow triggers on main branch pushes, runs npm-based validators (not committed to repo), and fails on any validation errors. The 404 page uses a dedicated CSS file for isolated styling with glitch animations and random GLaDOS quotes.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES5), HTML5, CSS3
**Primary Dependencies**: None for site; CI uses html-validate and stylelint (npm, not committed)
**Storage**: N/A
**Testing**: Manual browser testing + Lighthouse accessibility audit; CI validation for HTML/CSS
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), GitHub Actions runners
**Project Type**: Static web page (single HTML/CSS feature) + CI configuration
**Performance Goals**: CI validation < 2 minutes; 404 page load < 1 second
**Constraints**: Zero-build deployment; 404 page works with JS disabled; validators only in CI
**Scale/Scope**: Single workflow file, single error page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Requirement | Status | Notes |
|---------|-------------|--------|-------|
| I | Zero-build portability | ✅ PASS | 404.html opens directly; validators run only in CI |
| II | Minimal dependency gate | ✅ PASS | No site dependencies; CI tools not committed |
| III | One-file-per-type | ✅ PASS | Single 404.html, single css/404.css |
| IV | Never-nesting principle | ✅ PASS | Simple inline script for quote selection |
| V | Content-data separation | ✅ PASS | Quotes array in script is static content |
| VI | Modern pixel art aesthetic | ✅ PASS | Matches terminal aesthetic, amber on black |
| VII | Anti-corporate voice | ✅ PASS | GLaDOS quotes are casual and humorous |
| VIII | Desktop-first, mobile-functional | ✅ PASS | 404 page responsive with mobile support |
| IX | WebAssembly showcase | N/A | Not applicable to this feature |
| X | Simplicity gate | ✅ PASS | Minimal config files, simple workflow |
| XI | Strict version control | ✅ PASS | Feature branch workflow |
| XII | Dependency attribution | ✅ PASS | CI tools not part of site, no attribution needed |

**Gate Status**: PASSED - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/005-ci-and-404-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
# New files for this feature
.github/
└── workflows/
    └── validate.yml     # CI workflow

.html-validate.json      # HTML validator config
.stylelintrc.json        # CSS linter config

404.html                 # Custom error page
css/
└── 404.css              # Error page styles
```

**Structure Decision**: Static web project - files at repository root. CI configuration follows GitHub Actions conventions (`.github/workflows/`). Linter configs at root for tool discovery.

## Complexity Tracking

> No constitutional violations requiring justification. All gates passed.

## Design Overview

### CI Workflow Architecture

```
Push to main branch
        │
        ▼
┌─────────────────────────────┐
│  GitHub Actions Trigger     │
│  (on: push, branches: main) │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  Setup Node.js environment  │
│  (actions/setup-node@v4)    │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  Install validators         │
│  npm install html-validate  │
│  stylelint                  │
└─────────────────────────────┘
        │
        ├──────────────┬───────────────┐
        ▼              ▼               ▼
┌──────────────┐ ┌─────────────┐ ┌──────────┐
│ Validate     │ │ Validate    │ │ Report   │
│ HTML files   │ │ CSS files   │ │ Results  │
└──────────────┘ └─────────────┘ └──────────┘
        │              │               │
        └──────────────┴───────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Pass or Fail   │
              └─────────────────┘
```

### 404 Page Layout

```
┌─────────────────────────────────────────────────────┐
│  ░░░░░░ CRT Scanline Overlay ░░░░░░░░░░░░░░░░░░░░░░ │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│              ╔═══════════════════╗                  │
│              ║    4 0 4          ║  ← Large, glitchy
│              ║  ▓▒░ ERROR ░▒▓    ║    animated text
│              ╚═══════════════════╝                  │
│                                                     │
│              FILE NOT FOUND                         │
│                                                     │
│     "The file you requested has been...            │
│      misplaced."                                   │
│                      — GLaDOS                       │
│                                                     │
│              [ Return to Homepage ]                 │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### CSS Animation Structure

```css
/* Glitch animation keyframes */
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-1px, 1px); }
  80% { transform: translate(1px, -1px); }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  75% { opacity: 0.9; }
}

@keyframes colorShift {
  0%, 90%, 100% { color: var(--color-amber); }
  95% { color: #ff3333; }  /* Brief red flash */
}
```

### GLaDOS Quotes Array

```javascript
var GLADOS_QUOTES = [
  "The file you requested has been... misplaced.",
  "The Enrichment Center regrets to inform you that this page does not exist.",
  "Did you know you can donate your missing files to Aperture Science?",
  "This page has been incinerated for the good of all of us.",
  "The cake is a lie. So is this URL.",
  "Subject demonstrated poor URL navigation skills. Terminating test.",
  "The page you are looking for is in another test chamber.",
  "This page has been removed for testing purposes. The test will continue... forever.",
  "I'm not angry. I'm just disappointed you tried to access this page.",
  "This was a triumph. Not finding this page, I mean. For science."
];
```

## Implementation Phases

### Phase 1: CI Configuration (P1 - Code Quality Validation)

1. Create `.html-validate.json` with recommended rules
2. Create `.stylelintrc.json` with standard rules
3. Create `.github/workflows/validate.yml` workflow
4. Test workflow by pushing to main

### Phase 2: 404 Page (P2 - Custom Error Experience)

1. Create `css/404.css` with glitch animations
2. Create `404.html` with GLaDOS quotes
3. Test locally for animation and quote rotation
4. Verify accessibility with Lighthouse

## Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `.html-validate.json` | HTML validator configuration | P1 |
| `.stylelintrc.json` | CSS linter configuration | P1 |
| `.github/workflows/validate.yml` | CI workflow | P1 |
| `css/404.css` | Error page styling | P2 |
| `404.html` | Custom error page | P2 |

## Files to Modify

| File | Change | Priority |
|------|--------|----------|
| None | No existing files need modification | - |

## Dependencies

**CI Only (not committed to repo)**:
- `html-validate` - HTML validation
- `stylelint` - CSS linting
- `stylelint-config-standard` - Standard CSS rules

**Site Dependencies**: None

## Testing Checklist

- [ ] Push invalid HTML to main → CI fails with clear error
- [ ] Push invalid CSS to main → CI fails with clear error
- [ ] Push valid code to main → CI passes
- [ ] Push to non-main branch → No CI triggered
- [ ] Navigate to non-existent URL → 404 page displays
- [ ] 404 page shows GLaDOS quote
- [ ] Refresh 404 page → Different quote appears
- [ ] 404 page works with JS disabled (shows first quote)
- [ ] 404 page glitch animation visible
- [ ] 404 page responsive on mobile
- [ ] 404 page Lighthouse accessibility ≥ 90

## Post-Design Constitution Check

*Re-evaluated after Phase 1 design completion.*

| Article | Requirement | Final Status | Notes |
|---------|-------------|--------------|-------|
| I | Zero-build portability | ✅ PASS | All files static HTML/CSS |
| II | Minimal dependency gate | ✅ PASS | No site dependencies |
| III | One-file-per-type | ✅ PASS | Single 404.html, single 404.css |
| IV | Never-nesting principle | ✅ PASS | Simple quote selection logic |
| V | Content-data separation | ✅ PASS | Quotes in JS array |
| VI | Modern pixel art aesthetic | ✅ PASS | Terminal aesthetic preserved |
| VII | Anti-corporate voice | ✅ PASS | GLaDOS humor throughout |
| VIII | Desktop-first, mobile-functional | ✅ PASS | Responsive design |
| X | Simplicity gate | ✅ PASS | Minimal configuration |
| XI | Strict version control | ✅ PASS | Feature branch active |
| XII | Dependency attribution | ✅ PASS | No site dependencies |

**Final Gate Status**: PASSED - Ready for task generation via `/speckit.tasks`

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| research.md | `specs/005-ci-and-404-page/research.md` | ✅ Complete |
| quickstart.md | `specs/005-ci-and-404-page/quickstart.md` | ✅ Complete |

# Research: CI Workflow and 404 Page

**Feature**: 005-ci-and-404-page
**Date**: 2025-12-03

## HTML Validation Tool Selection

### Decision: html-validate

**Rationale**: html-validate is purpose-built for CI pipelines with strict HTML5 validation, excellent error messages with file/line information, and extensible configuration. It focuses on correctness rather than style.

**Alternatives Considered**:

| Tool | Pros | Cons | Verdict |
|------|------|------|---------|
| htmlhint | Lightweight, fast | Less strict, fewer rules | Too permissive |
| html-validate | Strict, configurable, CI-focused | Slightly slower | **Selected** |
| W3C Validator | Gold standard compliance | Requires network, slow | Not suitable for CI |
| Nu HTML Checker | Very thorough | Heavy, Java-based | Overkill |

**Configuration Approach**:
- Extend `html-validate:recommended` preset
- No custom rules needed for initial implementation
- File: `.html-validate.json`

## CSS Linting Tool Selection

### Decision: stylelint

**Rationale**: Industry standard CSS linter with excellent documentation, active maintenance, and configurable rulesets. The `stylelint-config-standard` preset provides sensible defaults without opinionated style rules.

**Alternatives Considered**:

| Tool | Pros | Cons | Verdict |
|------|------|------|---------|
| stylelint | Industry standard, extensible | Requires config file | **Selected** |
| csslint | Lightweight | Unmaintained since 2017 | Not suitable |
| postcss-reporter | Flexible | Requires PostCSS setup | Too complex |

**Configuration Approach**:
- Extend `stylelint-config-standard` preset
- Ignore vendor directory to avoid false positives
- File: `.stylelintrc.json`

## GitHub Actions Workflow Design

### Decision: Single workflow with sequential steps

**Rationale**: Simple, readable, and sufficient for a personal site. No need for parallel jobs or matrix builds.

**Workflow Structure**:
```yaml
name: Validate
on:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node.js
      - Install validators
      - Run HTML validation
      - Run CSS validation
```

**Alternatives Considered**:

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Single job | Simple, fast setup | Sequential execution | **Selected** |
| Parallel jobs | Faster total time | More complex YAML | Unnecessary |
| Separate workflows | Independent failures | Harder to track | Fragmented |

## 404 Page CSS Approach

### Decision: Dedicated css/404.css file

**Rationale**: Isolates error page styling, follows existing pattern of one CSS file per page type (homepage.css, blog.css, about-contact.css). Makes maintenance straightforward.

**Alternatives Considered**:

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Dedicated file | Isolated, maintainable | Extra HTTP request | **Selected** |
| Inline styles | No extra request | Harder to maintain | Not recommended |
| Shared CSS | Reuse existing | Coupling, bloat | Incomplete solution |

## Glitch Animation Research

### Decision: CSS-only animation with keyframes

**Rationale**: Pure CSS animation requires no JavaScript, works when JS is disabled, and provides smooth performance. The glitch effect uses transform and color properties for GPU acceleration.

**Animation Components**:
1. **Position glitch**: Random small translations (±2px)
2. **Color flash**: Occasional red flash for "error" feel
3. **Flicker**: Subtle opacity variations
4. **Text shadow**: Distorted shadow layers

**Browser Support**: All modern browsers support CSS animations and transforms. No polyfills needed.

## GLaDOS Quote Implementation

### Decision: Inline script with random selection

**Rationale**: Simple inline script allows quote rotation while maintaining functionality when JS is disabled (first quote shown as fallback in HTML). No external dependencies.

**Implementation Pattern**:
```javascript
(function() {
  var quotes = [...];
  var el = document.getElementById('glados-quote');
  if (el) {
    el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }
})();
```

**Accessibility**: Quote element uses proper semantic HTML with attribution. Screen readers will read the quote naturally.

## File Exclusion Patterns

### Decision: Exclude node_modules, vendor, and .specify directories

**Rationale**: These directories contain third-party or generated code that should not be validated. This prevents false positives and speeds up CI runs.

**Exclusion Patterns**:
- `node_modules/**` - npm packages (if any installed locally)
- `css/vendor/**` - Third-party CSS
- `.specify/**` - Speckit tooling
- `*.min.css` - Minified files

## Conclusion

All research questions resolved. No blocking issues identified. Ready for implementation.

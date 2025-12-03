# Quickstart: CI and 404 Page Implementation

**Feature**: 005-ci-and-404-page
**Date**: 2025-12-03

## Overview

Add GitHub Actions CI for HTML/CSS validation and a custom 404 error page with Portal-themed GLaDOS quotes. CI validators run only in GitHub Actions (not committed to repo).

## Prerequisites

- GitHub repository with Actions enabled
- Understanding of GitHub Actions YAML syntax
- Familiarity with existing site CSS patterns (amber `#FF9900` on black `#000000`)

## Files to Create

```
.github/workflows/validate.yml   # CI workflow
.html-validate.json              # HTML validator config
.stylelintrc.json                # CSS linter config
404.html                         # Custom error page
css/404.css                      # Error page styles
```

## Implementation Order

### Step 1: HTML Validator Config (.html-validate.json)

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "no-trailing-whitespace": "off",
    "void-style": "off"
  }
}
```

### Step 2: CSS Linter Config (.stylelintrc.json)

```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "keyframes-name-pattern": null,
    "no-descending-specificity": null
  },
  "ignoreFiles": [
    "css/vendor/**",
    "node_modules/**",
    ".specify/**"
  ]
}
```

### Step 3: GitHub Actions Workflow (.github/workflows/validate.yml)

```yaml
name: Validate HTML/CSS

on:
  push:
    branches: [main]

jobs:
  validate:
    name: Validate Code
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install validators
        run: npm install -g html-validate stylelint stylelint-config-standard

      - name: Validate HTML
        run: html-validate "**/*.html" --config .html-validate.json

      - name: Validate CSS
        run: stylelint "css/**/*.css" --config .stylelintrc.json
```

### Step 4: Error Page Styles (css/404.css)

Copy CSS variables from `css/about-contact.css`, then add:

```css
/* 404 Error Page Styles */

/* Large error code with glitch effect */
.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: var(--color-amber-light);
  text-shadow:
    2px 2px 0 var(--color-amber-dim),
    -2px -2px 0 rgba(255, 0, 0, 0.3);
  animation: glitch 2s infinite, colorShift 3s infinite;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-1px, 1px); }
  80% { transform: translate(1px, -1px); }
}

@keyframes colorShift {
  0%, 90%, 100% { text-shadow: 2px 2px 0 var(--color-amber-dim); }
  95% { text-shadow: 2px 2px 0 #ff3333; }
}

/* GLaDOS quote styling */
.glados-quote {
  font-style: italic;
  color: var(--color-amber-dim);
  max-width: 30rem;
  margin: 0 auto;
}

.glados-attribution {
  display: block;
  margin-top: var(--space-sm);
  font-style: normal;
  opacity: 0.6;
}
```

### Step 5: Error Page HTML (404.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="404 - Page not found on pyk.ee">
  <title>404 - File Not Found | pyk.ee</title>
  <link rel="stylesheet" href="/css/404.css">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
  <main class="error-container">
    <div class="error-code">404</div>
    <h1 class="error-title">FILE NOT FOUND</h1>

    <blockquote class="glados-quote">
      <p id="glados-text">The file you requested has been... misplaced.</p>
      <cite class="glados-attribution">— GLaDOS</cite>
    </blockquote>

    <a href="/" class="home-link">> cd ~/home</a>
  </main>

  <script>
    (function() {
      var quotes = [
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
      var el = document.getElementById('glados-text');
      if (el) {
        el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
      }
    })();
  </script>
</body>
</html>
```

## Testing Checklist

### CI Workflow
- [ ] Push to main branch triggers workflow
- [ ] Valid HTML/CSS passes
- [ ] Invalid HTML fails with clear error
- [ ] Invalid CSS fails with clear error
- [ ] Push to non-main branch does NOT trigger

### 404 Page
- [ ] Page displays with terminal aesthetic
- [ ] Glitch animation plays on "404"
- [ ] Random quote appears on load
- [ ] Refresh shows different quote
- [ ] Works with JavaScript disabled (first quote visible)
- [ ] Homepage link works
- [ ] Responsive on mobile
- [ ] Lighthouse accessibility ≥ 90

## Key Patterns

### From existing CSS files

1. **CSS Variables**: Copy `:root` block from about-contact.css
2. **CRT Scanlines**: Copy `body::before` scanline overlay
3. **Ambient Glow**: Copy `body::after` radial gradient
4. **Typography**: Use existing heading and link styles

### GLaDOS Quote Selection

The inline script uses an IIFE pattern to avoid polluting global scope:

```javascript
(function() {
  // Quotes array and random selection
  // Runs after DOM loads due to script position
})();
```

## Reference Files

- **CSS reference**: `css/about-contact.css` (design system)
- **HTML template**: `about/index.html` (structure pattern)
- **Spec**: `specs/005-ci-and-404-page/spec.md`
- **Plan**: `specs/005-ci-and-404-page/plan.md`

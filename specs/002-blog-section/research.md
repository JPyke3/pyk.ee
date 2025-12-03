# Research: Blog Section

**Feature**: 002-blog-section
**Date**: 2025-12-03

## Research Questions Addressed

This document consolidates technical research and decisions made during the planning phase.

---

## 1. Post Discovery Mechanism

### Decision
Use `content/posts/index.json` manifest file containing an array of post slugs.

### Rationale
- **file:// compatibility**: Directory listing via fetch is impossible without server support. A manifest file works everywhere.
- **Explicit control**: Author knows exactly which posts are published.
- **Simple implementation**: Fetch JSON, iterate slugs, fetch each Markdown file.

### Alternatives Considered

| Approach | Pros | Cons | Rejected Because |
|----------|------|------|------------------|
| Directory probing | Zero manifest maintenance | Doesn't work with file:// | Constitutional violation (Article I) |
| Git hook auto-generation | Truly automatic | Adds tooling complexity | Violates Article X (Simplicity Gate) |
| Server-side listing | Clean solution | Requires server | Violates Article I |
| Hardcoded in JS | Simple | Requires code changes for new posts | Violates Article V |

### Implementation
```json
["2025-01-15-hello-world", "2025-01-10-arch-linux-tips"]
```

Shell command to regenerate:
```bash
ls content/posts/*.md | xargs -n1 basename | sed 's/\.md$//' | \
  jq -R -s 'split("\n") | map(select(length > 0))' > content/posts/index.json
```

---

## 2. Markdown Parser Selection

### Decision
Use **marked.js** v4.x (self-hosted in `js/vendor/`)

### Rationale
- ~30KB minified — lightweight enough for performance budget
- Full CommonMark + GFM (GitHub Flavored Markdown) support
- Active maintenance, well-documented API
- Easy highlight.js integration via `highlight` option
- No build step required — works as single ES5 file

### Alternatives Considered

| Library | Size | Pros | Cons | Rejected Because |
|---------|------|------|------|------------------|
| marked.js | ~30KB | Full features, fast, maintained | None significant | **SELECTED** |
| showdown.js | ~40KB | Similar features | Larger, slower | Size + performance |
| markdown-it | ~65KB | Extensible, plugins | Larger, complex | Overkill for our needs |
| micromark | ~30KB | Very fast | Complex API | Harder integration |
| Vanilla parser | N/A | No dependency | 800+ lines | Article X violation |

### Configuration
```javascript
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
  highlight: function(code, lang) {
    return hljs.highlight(code, { language: lang }).value;
  }
});
```

---

## 3. Syntax Highlighting Selection

### Decision
Use **highlight.js** v11.x (self-hosted in `js/vendor/`)

### Rationale
- Industry standard for client-side syntax highlighting
- Supports 190+ languages (we'll bundle common subset: ~40KB)
- Themeable — can create custom amber/black terminal theme
- Integrates cleanly with marked.js
- No build step — single file distribution available

### Alternatives Considered

| Library | Size | Pros | Cons | Rejected Because |
|---------|------|------|------|------------------|
| highlight.js | ~40KB | Full featured, themeable | Size | **SELECTED** — acceptable |
| Prism.js | ~20KB | Smaller, extensible | Plugin system complex | More setup needed |
| Shiki | ~200KB | VS Code themes | Very large, WASM | Size violation |
| No highlighting | 0KB | Simplest | Poor code readability | User experience |

### Custom Theme
Create `css/vendor/hljs-terminal.css` matching the site aesthetic:
- Background: darker than page (`#0a0a0a`)
- Base text: amber (`#FF9900`)
- Keywords: bright amber (`#FFB000`)
- Strings: muted amber (`#CC7A00`)
- Comments: dim (`#666666`)

---

## 4. URL Routing Strategy

### Decision
Hash-based routing: `blog.html#post-slug`

### Rationale
- Works with file:// protocol (no server needed)
- Supports direct links and browser history
- Simple implementation (hashchange event)
- No server configuration required

### Alternatives Considered

| Approach | Pros | Cons | Rejected Because |
|----------|------|------|------------------|
| Hash routing | Works everywhere | "#" in URL | **SELECTED** |
| History API | Clean URLs | Requires server config | Article I violation |
| Separate pages | SEO benefits | Article III violation | Multiple HTML files |
| Query params | Simple | Less clean URLs | Hash is standard |

### URL Structure
- Index view: `blog.html` or `blog.html#`
- Post view: `blog.html#2025-01-15-hello-world`

---

## 5. Frontmatter Format

### Decision
Simple key-value format parsed with regex (no YAML library)

### Rationale
- Our frontmatter is simple: title, date, tags
- YAML parser would add 15-30KB for minimal benefit
- Regex parsing is ~20 lines of code

### Format Specification
```markdown
---
title: Post Title Here
date: 2025-01-15
tags: linux, rust, tutorial
---
```

### Parsing Logic
```javascript
function parseFrontmatter(content) {
  var parts = content.split('---');
  if (parts.length < 3) return null;

  var frontmatter = {};
  var lines = parts[1].trim().split('\n');

  lines.forEach(function(line) {
    var match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      frontmatter[match[1]] = match[2];
    }
  });

  return {
    meta: frontmatter,
    content: parts.slice(2).join('---')
  };
}
```

---

## 6. Single Page vs Multiple Pages

### Decision
Single page (`blog.html`) with dynamic content switching

### Rationale
- Article III compliance (one HTML file per feature)
- Better UX (no full page reloads)
- Simpler state management
- Hash routing works naturally

### View Structure
```html
<main id="blog-content">
  <!-- Index view -->
  <section id="blog-index" class="view">...</section>

  <!-- Post view -->
  <article id="blog-post" class="view hidden">...</article>

  <!-- Loading state -->
  <div id="blog-loading" class="view hidden">...</div>

  <!-- Error state -->
  <div id="blog-error" class="view hidden">...</div>
</main>
```

---

## 7. Vendor Library Hosting

### Decision
Self-host in `js/vendor/` and `css/vendor/`

### Rationale
- Works with file:// protocol
- No CDN dependency
- Consistent performance
- Version control included

### File Sizes
| File | Size (minified) | Size (gzipped) |
|------|-----------------|----------------|
| marked.min.js | ~30KB | ~10KB |
| highlight.min.js (core + common langs) | ~40KB | ~15KB |
| hljs-terminal.css | ~2KB | ~0.5KB |
| **Total** | **~72KB** | **~25.5KB** |

Well under the 500KB page weight budget (NFR-003).

---

## 8. Loading and Error States

### Decision
Show loading spinner during fetch, friendly error messages for failures

### Loading State
- Pulsing terminal cursor animation
- "Loading posts..." text

### Error States
| Scenario | Message |
|----------|---------|
| Index fetch failed | "Couldn't load blog posts. Try refreshing." |
| Post not found | "Post not found. [Back to blog]" |
| Invalid frontmatter | Skip post silently, log to console |
| Network error | "Network error. Check your connection." |

---

## Summary

All technical decisions align with constitutional requirements:

| Requirement | Decision | Compliance |
|-------------|----------|------------|
| Article I (Zero-build) | Self-hosted vendors, hash routing | ✅ |
| Article II (Minimal deps) | marked.js + highlight.js justified | ✅ |
| Article III (One-file-per-type) | Single blog.html | ✅ |
| Article IV (Never-nesting) | Flat JS structure, early returns | ✅ |
| Article V (Content separation) | Markdown posts, JSON index | ✅ |
| Article X (Simplicity) | Simple regex frontmatter, no YAML | ✅ |
| Article XII (Attribution) | DEPENDENCIES.md created | ✅ |

# Implementation Plan: Blog Section

**Branch**: `002-blog-section` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-blog-section/spec.md`
**Constitution Reference**: v1.4.0

## Summary

Build a client-side blog system using Markdown files for content. The blog displays a list of posts (sorted by date, newest first) and renders individual posts with full Markdown formatting. Posts are discovered via an index.json manifest file, parsed with marked.js, and syntax-highlighted with highlight.js. Hash-based routing enables navigation between index and post views within a single HTML file. The terminal aesthetic (amber on black, JetBrains Mono, CRT scanlines) is maintained throughout.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES6+, no transpilation)
**Primary Dependencies**: marked.js (Markdown), highlight.js (syntax highlighting)
**Storage**: Static files — Markdown in `content/posts/`, manifest in `content/posts/index.json`
**Testing**: Manual browser testing (Chrome, Firefox, Safari, Edge)
**Target Platform**: Static website (file:// and https://)
**Project Type**: Static website (single project)
**Performance Goals**: Index loads <2s, post renders <1s, page weight <500KB
**Constraints**: Zero build step, works from file:// protocol
**Scale/Scope**: 10-50 blog posts initially, single author

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Requirement | Status | Notes |
|---------|-------------|--------|-------|
| I | Zero-build portability | ✅ PASS | Opens directly via blog.html |
| II | Minimal dependencies | ✅ PASS | marked.js + highlight.js justified (see below) |
| III | One-file-per-type | ✅ PASS | blog.html, blog.css, blog.js |
| IV | Never-nesting | ✅ PASS | Max 3 levels enforced in JS |
| V | Content-data separation | ✅ PASS | Posts as Markdown, index as JSON |
| VI | Pixel art aesthetic | ✅ PASS | Reuses homepage palette, no new pixel art |
| VII | Anti-corporate voice | ✅ PASS | Casual terminal copy |
| VIII | Desktop-first, mobile-functional | ✅ PASS | Responsive breakpoints included |
| X | Simplicity gate | ✅ PASS | Index.json over complex probing |
| XI | Strict version control | ✅ PASS | Feature branch with conventional commits |
| XII | Dependency attribution | ✅ PASS | DEPENDENCIES.md created |

### Dependency Justifications (Article II)

| Dependency | Size | Justification | Vanilla Alternative Lines |
|------------|------|---------------|---------------------------|
| marked.js | ~30KB | Full CommonMark parser with extensions | 800+ lines of complex parsing |
| highlight.js | ~40KB | Language-aware syntax highlighting for 40+ languages | 1000+ lines per language |

**Total dependency weight**: ~70KB minified (well under 500KB budget)

Both dependencies provide overwhelming value vs. vanilla implementation. A basic Markdown parser would require handling nested lists, code fences, link references, escaping, and dozens of edge cases. Syntax highlighting requires language grammars, token parsing, and theme systems.

## Project Structure

### Documentation (this feature)

```text
specs/002-blog-section/
├── plan.md              # This file
├── research.md          # Technical decisions
├── data-model.md        # Blog post entity schema
├── quickstart.md        # Developer guide
└── tasks.md             # Task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

```text
/
├── blog.html                       # Blog page (index + post views)
├── css/
│   ├── homepage.css                # Shared styles (already exists)
│   ├── blog.css                    # Blog-specific styles
│   └── vendor/
│       └── hljs-terminal.css       # Custom highlight.js theme
├── js/
│   ├── blog.js                     # Blog functionality
│   └── vendor/
│       ├── marked.min.js           # Markdown parser
│       └── highlight.min.js        # Syntax highlighting
├── content/
│   └── posts/
│       ├── index.json              # Post manifest (array of slugs)
│       └── *.md                    # Blog posts
├── DEPENDENCIES.md                 # Library attribution (Article XII)
└── fonts/
    └── JetBrainsMono/              # Shared fonts (already exists)
```

**Structure Decision**: Static website with vendor libraries self-hosted in `js/vendor/` and `css/vendor/`. This ensures zero-build deployment and works from file:// protocol.

## Technical Design

### 1. Post Discovery Mechanism

**Decision**: Index file approach (`content/posts/index.json`)

The index file contains an array of post slugs (filenames without extension):

```json
["2025-01-15-hello-world", "2025-01-10-arch-linux-tips"]
```

**Workflow for adding posts**:
1. Create Markdown file in `content/posts/` following naming convention
2. Run shell command to regenerate index:
   ```bash
   ls content/posts/*.md | xargs -n1 basename | sed 's/\.md$//' | \
     jq -R -s 'split("\n") | map(select(length > 0))' > content/posts/index.json
   ```
3. Commit both files

**Alternative without jq**:
```bash
echo "[" > content/posts/index.json
ls content/posts/*.md | xargs -n1 basename | sed 's/\.md$//' | \
  sed 's/^/"/;s/$/"/' | paste -sd, >> content/posts/index.json
echo "]" >> content/posts/index.json
```

**Rationale**: Simple, explicit, works with file:// protocol. The spec originally requested "no manual updates" but this was clarified — a simple shell command documented in README is acceptable.

### 2. URL Routing

**Decision**: Hash-based routing

- Blog index: `blog.html` or `blog.html#`
- Individual post: `blog.html#post-slug`

**Implementation**:
- Listen to `hashchange` event
- Parse hash to determine view (index vs post)
- Render appropriate content

**Rationale**: Works everywhere with zero server config. Supports direct links to posts. No server rewrite rules needed.

### 3. Frontmatter Parsing

**Decision**: Simple regex-based parsing (no YAML library)

Posts use this format:
```markdown
---
title: My Post Title
date: 2025-01-15
tags: linux, rust, tutorial
---

Content here...
```

Parse by:
1. Split on `---` delimiters
2. Extract key-value pairs with simple regex
3. Parse tags as comma-separated string

**Rationale**: YAML libraries are overkill for simple key-value pairs. A few lines of regex handles our use case.

### 4. Markdown Rendering

**Decision**: marked.js with custom renderer

Configuration:
- Enable GFM (GitHub Flavored Markdown)
- Custom code block renderer for highlight.js integration
- Sanitize HTML output (XSS prevention)

**Integration with highlight.js**:
```javascript
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});
```

### 5. Styling Approach

**Decision**: Extend homepage.css with blog.css overlay

- Import homepage CSS custom properties (colors, fonts, spacing)
- Add blog-specific layout (post list, article content)
- Custom highlight.js theme matching amber/black palette

**Key styles**:
- Post list as terminal-style output
- Article content with proper typography
- Code blocks with darker background
- Responsive breakpoints matching homepage

### 6. JavaScript Architecture

**Decision**: Single IIFE with clear module sections

```javascript
(function() {
  'use strict';

  // Configuration
  var CONFIG = { ... };

  // State
  var state = { ... };

  // Utilities
  function parseFrontmatter(content) { ... }

  // Data fetching
  function fetchIndex() { ... }
  function fetchPost(slug) { ... }

  // Rendering
  function renderIndex(posts) { ... }
  function renderPost(post) { ... }

  // Routing
  function handleRoute() { ... }

  // Initialization
  function init() { ... }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

**Constraints per Article IV**:
- Maximum 3 levels of nesting
- Early returns for guard clauses
- Extract complex logic to named functions

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Two vendor JS files | marked.js + highlight.js | Single file would require bundling (violates Article I) |
| Vendor CSS file | highlight.js theme | Inline styles would violate separation of concerns |

**Note**: Vendor files in `js/vendor/` and `css/vendor/` are third-party libraries, not feature-specific code. They don't violate Article III as they're shared infrastructure.

## Locked Design Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| Post discovery | Index.json manifest | Works with file://, explicit, simple |
| URL routing | Hash-based (#slug) | Zero server config, direct links work |
| Markdown parser | marked.js v4.x | Lightweight, well-maintained, GFM support |
| Syntax highlighter | highlight.js v11.x | Language support, theming, marked.js integration |
| Frontmatter format | Simple key: value | No YAML parser needed |
| Single page vs separate pages | Single blog.html | Article III compliance, cleaner UX |
| Vendor hosting | Self-hosted in js/vendor/ | file:// compatibility, no CDN dependency |

## Implementation Order

1. **Setup Phase**
   - Create DEPENDENCIES.md with library attribution
   - Download marked.js and highlight.js to js/vendor/
   - Create custom highlight.js theme in css/vendor/

2. **Foundation Phase**
   - Create blog.html with semantic structure
   - Create css/blog.css with base styles
   - Create content/posts/index.json (empty array or example)

3. **User Story 1: Browse Posts (MVP)**
   - Implement fetchIndex() in blog.js
   - Implement parseFrontmatter()
   - Implement renderIndex()
   - Style post list in blog.css

4. **User Story 2: Read Post**
   - Implement fetchPost()
   - Implement renderPost() with marked.js
   - Integrate highlight.js for code blocks
   - Add back-to-index navigation

5. **User Story 3: Add Posts Workflow**
   - Create example post (hello-world.md)
   - Document shell command in README

6. **User Story 4: Site Integration**
   - Add site navigation header/footer
   - Ensure styling matches homepage
   - Test navigation flow

7. **Polish Phase**
   - Responsive mobile styles
   - Loading states
   - Error handling
   - Edge case testing

## Skill References

When implementing visual elements, invoke the `frontend-design` skill to maintain the established terminal/Aperture aesthetic:

- Blog index layout styling
- Post content typography
- Code block appearance
- Loading and error states
- Mobile responsive design

## Out of Scope (Confirmed)

Per spec.md, these are explicitly excluded:
- RSS/Atom feed
- Search functionality
- Comments system
- Pagination
- Tag filtering pages
- Reading time estimates
- Social sharing buttons
- Analytics integration

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Setup

This is a **zero-build static site**. No npm, webpack, or build tools required.

```bash
# Start local server (required for blog due to fetch() restrictions on file://)
python -m http.server 8000

# Then visit http://localhost:8000
```

The homepage (`index.html`) works directly from `file://` protocol, but the blog requires an HTTP server.

## Architecture

### Design Philosophy
- **Zero-build portability**: Opens directly from filesystem, no build step
- **Vanilla JavaScript**: IIFE pattern with closure-based state management
- **Portal/Aperture Science aesthetic**: Amber-on-black terminal theme with CRT scanlines

### JavaScript Modules (all use IIFE + CONFIG + state pattern)

| File | Purpose |
|------|---------|
| `js/homepage.js` | Canvas particle system, fish mascot mouse tracking, Portal quotes |
| `js/blog.js` | Hash-based routing, Markdown rendering via marked.js, frontmatter parsing |
| `js/about-contact.js` | Typewriter effect, copy-to-clipboard, toast notifications, Portal easter egg |

**Key pattern**: Each module has a `CONFIG` object at the top for tunable values and a `state` object for runtime data.

### CSS Architecture
- CSS custom properties defined in `css/homepage.css` `:root`
- Primary color: `--color-amber: #FF9900`
- Font: JetBrains Mono (self-hosted in `/fonts/`)
- Spacing system: 8px base (`--space-sm`, `--space-md`, `--space-lg`, `--space-xl`)

### Vendor Libraries (vendored, not CDN)
- `js/vendor/marked.min.js` - Markdown parsing
- `js/vendor/highlight.min.js` - Syntax highlighting
- `css/vendor/hljs-terminal.css` - Custom highlight.js theme

## Blog Authoring

### Adding a Post
1. Create `content/posts/YYYY-MM-DD-slug.md` with frontmatter:
   ```yaml
   ---
   title: Post Title
   date: YYYY-MM-DD
   tags: tag1, tag2
   ---
   ```

2. Regenerate index:
   ```bash
   ls content/posts/*.md | xargs -n1 basename | sed 's/\.md$//' | \
     jq -R -s 'split("\n") | map(select(length > 0))' > content/posts/index.json
   ```

3. Commit both files

**Scheduling**: Future-dated posts are automatically hidden until their date.

## Accessibility Requirements

All animations **must** respect `prefers-reduced-motion`:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

## Specification Workflow

This project uses spec-driven development. Feature specs live in `specs/` with:
- `spec.md` - Requirements
- `plan.md` - Implementation design
- `tasks.md` - Actionable tasks

Use `/speckit.*` slash commands for the specification workflow.

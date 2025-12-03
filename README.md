# pyk.ee

Personal portfolio and blog for Pykee - a software developer and Linux tinkerer based in Brisbane, Australia.

## Quick Start

### Homepage

Open `index.html` directly in any modern browser. No build step required.

```bash
open index.html  # macOS
xdg-open index.html  # Linux
```

### Blog

The blog requires a local HTTP server due to browser security restrictions on `fetch()` with `file://` protocol.

```bash
# Start a simple HTTP server
python -m http.server 8000

# Then visit
# http://localhost:8000/blog
```

**Alternative servers:**
```bash
# Node.js
npx serve

# PHP
php -S localhost:8000
```

## Project Structure

```
/
├── index.html              # Homepage
├── blog/
│   └── index.html          # Blog (index + post views)
├── css/
│   ├── homepage.css        # Main styles
│   ├── blog.css            # Blog-specific styles
│   └── vendor/
│       └── hljs-terminal.css  # Syntax highlighting theme
├── js/
│   ├── homepage.js         # Homepage interactions
│   ├── blog.js             # Blog functionality
│   └── vendor/
│       ├── marked.min.js   # Markdown parser
│       └── highlight.min.js # Syntax highlighting
├── content/
│   └── posts/
│       ├── index.json      # Post manifest
│       └── *.md            # Blog posts
├── fonts/
│   └── JetBrainsMono/      # Font files
├── images/                 # Site images
├── DEPENDENCIES.md         # Library attribution
└── README.md               # This file
```

## Blog Authoring

### Adding a New Post

1. **Create a Markdown file** in `content/posts/`:

   ```
   content/posts/YYYY-MM-DD-slug.md
   ```

   Example: `content/posts/2025-01-15-my-new-post.md`

2. **Add frontmatter** at the top of the file:

   ```markdown
   ---
   title: My Post Title
   date: 2025-01-15
   tags: linux, tutorial, rust
   ---

   Your content here...
   ```

3. **Regenerate the index** (requires `jq`):

   ```bash
   ls content/posts/*.md | xargs -n1 basename | sed 's/\.md$//' | \
     jq -R -s 'split("\n") | map(select(length > 0))' > content/posts/index.json
   ```

   **Without jq:**
   ```bash
   echo "[" > content/posts/index.json
   ls content/posts/*.md | xargs -n1 basename | sed 's/\.md$//' | \
     sed 's/^/"/;s/$/"/' | paste -sd, >> content/posts/index.json
   echo "]" >> content/posts/index.json
   ```

4. **Commit both files**:

   ```bash
   git add content/posts/2025-01-15-my-new-post.md content/posts/index.json
   git commit -m "feat: add blog post about my new topic"
   ```

### Frontmatter Fields

| Field   | Required | Format         | Example                    |
|---------|----------|----------------|----------------------------|
| `title` | Yes      | String         | `My Post Title`            |
| `date`  | Yes      | YYYY-MM-DD     | `2025-01-15`               |
| `tags`  | No       | Comma-separated | `linux, rust, tutorial`   |

### Scheduling Posts

Set a future date in the frontmatter. Posts with future dates are automatically hidden until their date arrives.

```markdown
---
title: Future Post
date: 2025-12-25
---
```

### Supported Markdown

- Headings (`#`, `##`, `###`)
- **Bold** and *italic* text
- [Links](https://example.com)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Blockquotes
- Tables
- Images

Code blocks support language-specific highlighting:

````markdown
```javascript
function hello() {
  console.log('Hello, World!');
}
```
````

## Design Philosophy

This site follows a **zero-build portability** approach:

- Opens directly from `file://` protocol
- No Node.js, npm, or build tools required
- Vanilla JavaScript with minimal dependencies
- Self-hosted fonts and vendor libraries

## Dependencies

See [DEPENDENCIES.md](DEPENDENCIES.md) for full attribution.

- **marked.js** - Markdown parsing
- **highlight.js** - Syntax highlighting
- **JetBrains Mono** - Monospace font

## License

Content is personal. Code structure is MIT.

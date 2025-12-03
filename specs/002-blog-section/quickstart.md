# Quickstart: Blog Section

**Feature**: 002-blog-section
**Date**: 2025-12-03

## Overview

This guide explains how to work with the pyk.ee blog system.

---

## For Readers

### Viewing the Blog

1. Open `blog.html` in your browser
2. See the list of posts sorted by date (newest first)
3. Click a post title to read the full article
4. Click "← Back to blog" to return to the list

### Direct Post Links

Link directly to a post using the hash URL:
```
blog.html#2025-01-15-hello-world
```

---

## For Authors (Jacob)

### Adding a New Post

1. **Create the Markdown file**

   Create a new file in `content/posts/` with the naming convention:
   ```
   YYYY-MM-DD-slug.md
   ```

   Example: `content/posts/2025-01-20-my-new-post.md`

2. **Add frontmatter**

   Start the file with metadata:
   ```markdown
   ---
   title: My New Post Title
   date: 2025-01-20
   tags: linux, tutorial
   ---

   Your content here...
   ```

3. **Regenerate the index**

   Run this command from the project root:
   ```bash
   ls content/posts/*.md | xargs -n1 basename | sed 's/\.md$//' | \
     jq -R -s 'split("\n") | map(select(length > 0))' > content/posts/index.json
   ```

   **Without jq**:
   ```bash
   (echo "["; ls content/posts/*.md | xargs -n1 basename | \
     sed 's/\.md$//;s/^/"/;s/$/"/' | paste -sd,; echo "]") > content/posts/index.json
   ```

4. **Commit both files**
   ```bash
   git add content/posts/2025-01-20-my-new-post.md content/posts/index.json
   git commit -m "feat: add blog post about my new topic"
   ```

### Editing a Post

1. Edit the Markdown file directly
2. Refresh the browser to see changes
3. Commit when done

### Deleting a Post

1. Delete the Markdown file
2. Regenerate the index (step 3 above)
3. Commit both changes

### Scheduling a Post

Set a future date in the frontmatter. Posts with future dates are automatically hidden until their date arrives.

```markdown
---
title: Future Post
date: 2025-12-25
---
```

---

## Post Writing Guide

### Frontmatter Fields

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| `title` | Yes | String | `My Post Title` |
| `date` | Yes | YYYY-MM-DD | `2025-01-15` |
| `tags` | No | Comma-separated | `linux, rust, tutorial` |

### Supported Markdown

The blog supports GitHub Flavored Markdown (GFM):

#### Headings
```markdown
# H1 - Title (avoid, frontmatter has title)
## H2 - Section
### H3 - Subsection
```

#### Text Formatting
```markdown
**bold text**
*italic text*
~~strikethrough~~
`inline code`
```

#### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](image.jpg)
```

#### Lists
```markdown
- Unordered item
- Another item

1. Ordered item
2. Another item
```

#### Code Blocks
````markdown
```javascript
function hello() {
  console.log('Hello!');
}
```
````

Supported languages include: javascript, typescript, python, rust, bash, json, html, css, and many more.

#### Blockquotes
```markdown
> This is a quote
```

#### Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

---

## Development Setup

### Prerequisites

- A modern browser (Chrome, Firefox, Safari, Edge)
- A local server OR just open files directly

### Running Locally

**Option 1: Direct file access**
```bash
# Just open in browser
open blog.html  # macOS
xdg-open blog.html  # Linux
```

**Option 2: Simple HTTP server**
```bash
# Python
python -m http.server 8000

# Node.js (if npx available)
npx serve
```

Then visit `http://localhost:8000/blog.html`

### Testing Posts

1. Add a test post with today's date
2. Regenerate the index
3. Refresh the blog page
4. Verify the post appears and renders correctly

---

## Troubleshooting

### Post not appearing?

1. **Check the index.json** — is your post slug listed?
2. **Check the frontmatter** — is `title` and `date` present?
3. **Check the date** — future dates are hidden
4. **Check the console** — browser dev tools show errors

### Styling looks wrong?

1. Make sure `css/blog.css` is loading
2. Check that CSS custom properties from `css/homepage.css` are available
3. Clear browser cache and reload

### Code not highlighted?

1. Verify `js/vendor/highlight.min.js` loads without errors
2. Check that your code fence specifies a language: ` ```javascript `
3. Language must be in the highlight.js bundle

---

## File Checklist

After blog feature is complete, these files should exist:

```
/
├── blog.html                         ✓ Blog page
├── css/
│   ├── blog.css                      ✓ Blog styles
│   └── vendor/
│       └── hljs-terminal.css         ✓ Highlight theme
├── js/
│   ├── blog.js                       ✓ Blog logic
│   └── vendor/
│       ├── marked.min.js             ✓ Markdown parser
│       └── highlight.min.js          ✓ Syntax highlighter
├── content/
│   └── posts/
│       ├── index.json                ✓ Post manifest
│       └── *.md                      ✓ Blog posts
└── DEPENDENCIES.md                   ✓ Library attribution
```

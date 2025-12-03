# Data Model: Blog Section

**Feature**: 002-blog-section
**Date**: 2025-12-03

## Overview

The blog section uses a file-based data model with no database. All data lives in static files that are fetched and parsed client-side.

---

## Entities

### 1. Blog Post

A blog post is a Markdown file with YAML-like frontmatter stored in `content/posts/`.

**File Location**: `content/posts/{slug}.md`
**Naming Convention**: `YYYY-MM-DD-title-slug.md`

#### Schema

```typescript
interface BlogPost {
  // Derived from filename
  slug: string;           // e.g., "2025-01-15-hello-world"

  // From frontmatter
  title: string;          // Required — post title
  date: string;           // Required — YYYY-MM-DD format
  tags: string[];         // Optional — array of tag strings

  // Content
  content: string;        // Markdown body (after frontmatter)
  html: string;           // Rendered HTML (after marked.js processing)
}
```

#### Validation Rules

| Field | Rule | Error Handling |
|-------|------|----------------|
| slug | Must match `[a-z0-9-]+` pattern | Skip if invalid |
| title | Required, non-empty string | Skip post if missing |
| date | Required, YYYY-MM-DD format | Skip post if invalid |
| tags | Optional, comma-separated | Default to empty array |
| content | Any valid Markdown | Render as-is |

#### State Transitions

Posts are static files with no server-side state. Client-side states:

```
[Not Loaded] → [Loading] → [Loaded] → [Rendered]
                    ↓
               [Error]
```

#### Example File

**Filename**: `content/posts/2025-01-15-hello-world.md`

```markdown
---
title: Hello, World!
date: 2025-01-15
tags: meta, first-post
---

# Hello, World!

This is my first blog post...
```

**Parsed Result**:
```javascript
{
  slug: "2025-01-15-hello-world",
  title: "Hello, World!",
  date: "2025-01-15",
  tags: ["meta", "first-post"],
  content: "# Hello, World!\n\nThis is my first blog post...",
  html: "<h1>Hello, World!</h1>\n<p>This is my first blog post...</p>"
}
```

---

### 2. Post Index

A JSON array of post slugs for discovery.

**File Location**: `content/posts/index.json`

#### Schema

```typescript
type PostIndex = string[];  // Array of slug strings
```

#### Example

```json
[
  "2025-01-15-hello-world",
  "2025-01-10-arch-linux-tips",
  "2025-01-05-rust-for-beginners"
]
```

#### Validation Rules

| Rule | Error Handling |
|------|----------------|
| Must be valid JSON array | Show error, empty blog |
| Each item must be non-empty string | Skip invalid items |
| Items should match existing .md files | Skip if file not found |

#### Generation Command

```bash
ls content/posts/*.md | xargs -n1 basename | sed 's/\.md$//' | \
  jq -R -s 'split("\n") | map(select(length > 0))' > content/posts/index.json
```

---

### 3. Frontmatter (Embedded)

Frontmatter is not a separate file but an embedded structure at the start of each post.

#### Schema

```typescript
interface Frontmatter {
  title: string;          // Required
  date: string;           // Required, YYYY-MM-DD
  tags?: string;          // Optional, comma-separated
}
```

#### Parsing Rules

1. Frontmatter is delimited by `---` at start and end
2. Each line is `key: value` format
3. Keys are case-insensitive (normalized to lowercase)
4. Values are trimmed of whitespace
5. Tags are split by comma and trimmed

#### Parser Implementation

```javascript
function parseFrontmatter(fileContent) {
  var parts = fileContent.split('---');

  // Need at least 3 parts: before, frontmatter, content
  if (parts.length < 3) {
    return null;
  }

  var meta = {};
  var lines = parts[1].trim().split('\n');

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var colonIndex = line.indexOf(':');

    if (colonIndex === -1) continue;

    var key = line.substring(0, colonIndex).trim().toLowerCase();
    var value = line.substring(colonIndex + 1).trim();

    meta[key] = value;
  }

  // Parse tags from comma-separated string to array
  if (meta.tags) {
    meta.tags = meta.tags.split(',').map(function(tag) {
      return tag.trim();
    });
  } else {
    meta.tags = [];
  }

  return {
    meta: meta,
    content: parts.slice(2).join('---').trim()
  };
}
```

---

## Data Flow

### Loading Blog Index

```
1. Page loads
2. Fetch content/posts/index.json
3. Parse JSON → array of slugs
4. For each slug, fetch content/posts/{slug}.md
5. Parse frontmatter from each file
6. Filter: skip posts with future dates
7. Sort by date (newest first)
8. Render post list
```

### Loading Single Post

```
1. Hash changes to #post-slug
2. Extract slug from hash
3. Fetch content/posts/{slug}.md
4. Parse frontmatter
5. Render content with marked.js
6. Apply syntax highlighting
7. Display post view
```

---

## Relationships

```
┌─────────────────────────┐
│     index.json          │
│   (array of slugs)      │
└───────────┬─────────────┘
            │ references
            ▼
┌─────────────────────────┐
│      {slug}.md          │
│   (individual posts)    │
│                         │
│   ┌─────────────────┐   │
│   │   Frontmatter   │   │
│   │  - title        │   │
│   │  - date         │   │
│   │  - tags         │   │
│   └─────────────────┘   │
│   ┌─────────────────┐   │
│   │    Content      │   │
│   │  (Markdown)     │   │
│   └─────────────────┘   │
└─────────────────────────┘
```

---

## Client-Side State

The blog maintains minimal client-side state:

```javascript
var state = {
  // Loaded post index
  index: [],              // Array of slug strings

  // Cached posts (slug → parsed post)
  posts: {},              // { [slug]: BlogPost }

  // Current view
  currentView: 'index',   // 'index' | 'post' | 'loading' | 'error'
  currentSlug: null,      // Current post slug if viewing post

  // Loading state
  isLoading: false,
  error: null
};
```

---

## File System Layout

```
content/
└── posts/
    ├── index.json                      # Post manifest
    ├── 2025-01-15-hello-world.md       # Post file
    ├── 2025-01-10-arch-linux-tips.md   # Post file
    └── 2025-01-05-rust-for-beginners.md # Post file
```

---

## Constraints

1. **No server-side processing**: All parsing happens client-side
2. **No database**: Files are the source of truth
3. **No real-time updates**: Manual refresh required after adding posts
4. **Max ~50 posts**: No pagination in v1; performance ok for this scale
5. **Single author**: No user/author entity needed

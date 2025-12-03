# Feature Specification: Blog Section

**Feature Branch**: `002-blog-section`
**Created**: 2025-12-03
**Status**: Draft
**Constitution Reference**: v1.3.0

## Overview

The blog section provides a content platform for Pykee to share technical articles, tutorials, and thoughts. Posts are authored in Markdown with frontmatter metadata and rendered client-side without any build step.

**Core Message**: "Pykee writes interesting things about Linux, open source, and web development"
**Tone**: Casual, authentic, technical but accessible. Same voice as homepage.

## User Scenarios & Testing

### User Story 1 - Browse Blog Posts (Priority: P1)

A visitor navigates to the blog section and sees a list of all available posts, ordered by date (newest first). Each post shows its title, date, and optional tags so the visitor can decide what to read.

**Why this priority**: The blog index is the primary entry point. Without it, visitors cannot discover or access any blog content. This is the minimum viable blog.

**Independent Test**: Open blog.html in a browser. Without any JavaScript errors, a list of posts should appear with titles, dates, and tags. Clicking any post title should navigate to that post.

**Acceptance Scenarios**:

1. **Given** the blog index page has loaded, **When** the visitor looks at the page, **Then** they see a list of blog posts with title, date, and tags for each
2. **Given** multiple blog posts exist, **When** the visitor views the list, **Then** posts are ordered by date with newest first
3. **Given** a blog post has no tags, **When** it appears in the list, **Then** it displays without tags but otherwise functions normally
4. **Given** the visitor clicks a post title, **When** the click is processed, **Then** they navigate to the individual post page
5. **Given** JavaScript is disabled, **When** the blog index loads, **Then** a graceful fallback message appears explaining JavaScript is required for blog content

---

### User Story 2 - Read Full Blog Post (Priority: P2)

A visitor clicks through to an individual blog post and reads the full Markdown content, properly rendered with formatting (headings, code blocks, lists, links, etc.).

**Why this priority**: The ability to read posts is the core purpose of a blog, but depends on User Story 1 (post discovery) to be useful.

**Independent Test**: Navigate to a specific post URL. The full post content renders correctly with proper typography, code syntax highlighting (if any), and the same terminal aesthetic as the rest of the site.

**Acceptance Scenarios**:

1. **Given** the visitor is on a post page, **When** the page loads, **Then** they see the full post title, publication date, and content
2. **Given** the post contains Markdown formatting (headings, bold, lists, links), **When** rendered, **Then** all formatting displays correctly
3. **Given** the post contains code blocks, **When** rendered, **Then** code is displayed in a monospace font with appropriate styling
4. **Given** the visitor wants to return to the blog index, **When** they look for navigation, **Then** a clear "back to blog" link is visible
5. **Given** the post has tags, **When** the visitor views the post, **Then** tags are displayed on the post page

---

### User Story 3 - Add New Posts Without Code Changes (Priority: P3)

Jacob (the author) wants to add a new blog post by simply creating a Markdown file in `content/posts/` with proper frontmatter. No code changes, rebuilds, or manual index updates required.

**Why this priority**: This enables sustainable blogging. Without an easy authoring workflow, the blog will become abandoned. This is critical for long-term success but not required for initial visitor-facing functionality.

**Independent Test**: Create a new `.md` file in `content/posts/` with valid frontmatter. Refresh the blog index. The new post appears in the list without any other changes.

**Acceptance Scenarios**:

1. **Given** Jacob creates a new Markdown file in `content/posts/`, **When** the file has valid frontmatter (title, date), **Then** it appears in the blog index on next page load
2. **Given** the new post has a future date, **When** the blog index loads, **Then** the post does NOT appear (scheduled posts are hidden)
3. **Given** Jacob edits an existing post's Markdown content, **When** the post page is refreshed, **Then** the updated content displays immediately
4. **Given** Jacob deletes a post file, **When** the blog index loads, **Then** the post no longer appears

---

### User Story 4 - Navigate Seamlessly with Site (Priority: P4)

A visitor experiences the blog as part of the cohesive pyk.ee site, with consistent navigation, styling, and aesthetic. The blog doesn't feel like a separate site grafted on.

**Why this priority**: Visual and navigational cohesion maintains the brand experience. A disconnected blog undermines the portfolio's professional impression.

**Independent Test**: Navigate from homepage to blog to a post and back. The experience should feel like one unified site with consistent header, footer, and styling.

**Acceptance Scenarios**:

1. **Given** the visitor is on any blog page, **When** they look for navigation, **Then** the same site navigation from the homepage is visible
2. **Given** the visitor views the blog, **When** they observe the styling, **Then** it matches the homepage aesthetic (amber on black, JetBrains Mono, terminal feel)
3. **Given** the visitor is on mobile, **When** viewing the blog, **Then** all content is readable and navigation works properly

---

### Edge Cases

- **No posts exist**: Blog index shows a friendly message ("No posts yet. Check back soon!")
- **Invalid frontmatter**: Post with malformed frontmatter is skipped silently; other posts still load
- **Very long post**: Content renders without breaking layout; scroll works normally
- **Post with special characters in title**: Title renders correctly without breaking HTML
- **Direct link to non-existent post**: Graceful error message ("Post not found")
- **JavaScript disabled**: Informative fallback message explaining posts require JavaScript
- **Slow connection**: Loading state shown while posts are being fetched

## Requirements

### Functional Requirements

#### Core Architecture
- **FR-001**: Blog MUST function by opening blog.html directly (no build step) [Article I]
- **FR-002**: Blog MUST use vanilla JavaScript for Markdown parsing and rendering [Article II]
- **FR-003**: Blog MUST follow content-data separation — posts stored as Markdown files in `content/posts/` [Article V]
- **FR-004**: Blog MUST NOT require manual index updates when posts are added or removed

#### Blog Index Page
- **FR-010**: Blog index MUST display a list of all published posts
- **FR-011**: Posts MUST be sorted by date, newest first
- **FR-012**: Each post listing MUST show: title, publication date, and tags (if any)
- **FR-013**: Each post title MUST link to the individual post page
- **FR-014**: Posts with future dates MUST NOT appear in the listing (scheduled posts)
- **FR-015**: Blog index MUST show a friendly message when no posts exist

#### Individual Post Pages
- **FR-020**: Post pages MUST render full Markdown content
- **FR-021**: Markdown rendering MUST support: headings, bold, italic, links, lists (ordered/unordered), code blocks (inline and fenced), blockquotes, and images
- **FR-022**: Post pages MUST display: title, publication date, tags (if any), and full content
- **FR-023**: Post pages MUST include navigation back to the blog index
- **FR-024**: Post pages MUST handle non-existent posts gracefully with an error message

#### Post Frontmatter Format
- **FR-030**: Posts MUST use YAML frontmatter at the start of the Markdown file
- **FR-031**: Frontmatter MUST require: `title` (string) and `date` (YYYY-MM-DD format)
- **FR-032**: Frontmatter MAY include: `tags` (array of strings)
- **FR-033**: Posts with invalid or missing required frontmatter MUST be skipped

#### Post Discovery Mechanism
- **FR-040**: Blog MUST discover posts via `content/posts/index.json` manifest
- **FR-041**: Posts MUST follow naming convention: `YYYY-MM-DD-slug.md` (e.g., `2025-01-15-getting-started-arch.md`)
- **FR-042**: Manifest is regenerated via shell command (documented in quickstart.md)
- **FR-043**: Discovery mechanism MUST work with both `file://` and `https://` protocols

#### Styling & Aesthetic
- **FR-050**: Blog MUST use the same colour palette as homepage (amber on black) [Article VI]
- **FR-051**: Blog MUST use JetBrains Mono font family [Article VI]
- **FR-052**: Blog MUST display CRT scanlines background effect [Article VI]
- **FR-053**: Blog MUST NOT introduce additional pixel art decorative elements [Article VI - one per page limit]
- **FR-054**: Code blocks MUST be styled distinctly (darker background, monospace)
- **FR-055**: Links within posts MUST be visually distinct and use amber colour

#### Navigation & Integration
- **FR-060**: Blog pages MUST include the site-wide navigation header
- **FR-061**: Blog pages MUST include the site-wide footer
- **FR-062**: Navigation MUST show "Blog" as the current page (aria-current)

#### Responsiveness & Accessibility
- **FR-070**: Blog MUST be fully functional on mobile devices [Article VIII]
- **FR-071**: Blog MUST be keyboard navigable
- **FR-072**: Blog MUST work with screen readers (proper heading hierarchy, alt text)
- **FR-073**: Blog MUST respect `prefers-reduced-motion` for any animations

### Non-Functional Requirements

- **NFR-001**: Blog index MUST load within 2 seconds on broadband
- **NFR-002**: Individual posts MUST render within 1 second after navigation
- **NFR-003**: Total blog page weight SHOULD be under 500KB (excluding post content)
- **NFR-004**: Markdown parser MUST be lightweight (under 50KB minified)

### Key Entities

- **Blog Post**: A Markdown file named `YYYY-MM-DD-slug.md` with YAML frontmatter containing title, date, optional tags, and body content
- **Frontmatter**: YAML block at start of Markdown file containing metadata (title, date, tags)

## Assumptions

- **Markdown parser**: A lightweight vanilla JS Markdown parser will be used (e.g., marked.js or similar micro-library). This is an acceptable exception to Article II as vanilla Markdown parsing would require 500+ lines of complex code.
- **No search functionality**: Blog search is out of scope for this feature; posts are browsed via the index list only.
- **No pagination**: Initial implementation shows all posts; pagination can be added if post count exceeds 20.
- **No comments**: Blog posts do not have comments; this is a one-way publishing platform.
- **No RSS feed**: RSS/Atom feed generation is out of scope for initial implementation.
- **English only**: All posts are in English; no internationalisation required.

## Constitutional Compliance

| Article | Requirement | Compliance |
|---------|-------------|------------|
| I | Zero-build portability | Opens directly via blog.html |
| II | Minimal dependencies | Vanilla JS except Markdown parser (justified) |
| III | One-file-per-type | One HTML, one CSS, one JS file for blog |
| IV | Never-nesting | Max 3 levels in all code |
| V | Content-data separation | Posts as Markdown, manifest as JSON |
| VI | Pixel art aesthetic | Reuses homepage aesthetic, no new pixel art |
| VII | Anti-corporate voice | Casual copy, terminal feel |
| VIII | Desktop-first, mobile-functional | Responsive with mobile support |
| X | Simplicity gate | Manifest approach over complex solutions |
| XI | Strict version control | Feature branch with conventional commits |

**Dependency Justification (Article II)**: A Markdown parser library is required because vanilla Markdown parsing is non-trivial (supporting all CommonMark features including edge cases). A micro-library like marked.js (~30KB) provides overwhelming value vs. writing 500+ lines of parsing code.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Blog pages load and function when opening blog.html directly in Chrome, Firefox, Safari, and Edge
- **SC-002**: All published posts appear in the blog index, sorted by date (newest first)
- **SC-003**: Individual posts render all Markdown formatting correctly (headings, code, lists, links)
- **SC-004**: Adding a new post file (following naming convention) results in the post appearing on next page load — no other file edits required
- **SC-005**: Blog styling matches homepage aesthetic (amber on black, JetBrains Mono)
- **SC-006**: Blog is fully functional on mobile (iPhone SE viewport, 375px width minimum)
- **SC-007**: Blog pages score 90+ on Lighthouse accessibility audit
- **SC-008**: Feature introduces maximum 3 new files (blog.html, blog.css, blog.js) per Article III

## File Structure

Per Article III (One-File-Per-Feature Rule), this feature introduces:

```
/
├── blog.html                   # Blog index/listing page
├── post.html                   # Individual post template page
├── css/
│   └── blog.css                # Blog-specific styles (extends homepage.css)
├── js/
│   └── blog.js                 # Blog functionality (index, rendering)
└── content/
    └── posts/
        └── YYYY-MM-DD-slug.md  # Individual blog posts (naming convention)
```

**Note**: `post.html` and `blog.html` are considered one logical HTML file for the blog feature (index + detail pattern). Alternatively, post rendering can be handled dynamically within `blog.html` using URL parameters.

## Out of Scope

- Blog search functionality
- Pagination (initial implementation)
- Comments or reader interaction
- RSS/Atom feed generation
- Tag filtering pages
- Related posts suggestions
- Reading time estimates
- Social sharing buttons
- Analytics integration

## Clarifications

### Session 2025-12-03

- Q: User Story 3 promises "no manual updates" but FR-042 requires manifest.json updates — which approach? → A: Remove manifest requirement, use fetch-based directory probe instead

## Post Format Example

**Filename**: `content/posts/2025-01-15-getting-started-arch.md`

```markdown
---
title: "Getting Started with Arch Linux"
date: 2025-01-15
tags: [linux, arch, tutorial]
---

# Getting Started with Arch Linux

This is the first paragraph of my blog post...

## Installation

Here's how to install Arch:

```bash
pacman -S base base-devel
```

And so on...
```

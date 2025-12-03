# Tasks: Blog Section

**Input**: Design documents from `/specs/002-blog-section/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: No automated tests requested. Manual browser testing per plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

```text
/
├── blog.html                       # Blog page (index + post views)
├── css/
│   ├── blog.css                    # Blog-specific styles
│   └── vendor/
│       └── hljs-terminal.css       # Highlight.js theme
├── js/
│   ├── blog.js                     # Blog functionality
│   └── vendor/
│       ├── marked.min.js           # Markdown parser
│       └── highlight.min.js        # Syntax highlighting
├── content/
│   └── posts/
│       ├── index.json              # Post manifest
│       └── *.md                    # Blog posts
└── DEPENDENCIES.md                 # Library attribution
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create dependencies documentation and download vendor libraries

- [x] T001 Create `DEPENDENCIES.md` in project root with marked.js and highlight.js attribution per Article XII
- [x] T002 [P] Create `js/vendor/` directory structure
- [x] T003 [P] Create `css/vendor/` directory structure
- [x] T004 Download marked.js v4.x minified to `js/vendor/marked.min.js`
- [x] T005 Download highlight.js v11.x core + common languages to `js/vendor/highlight.min.js`
- [x] T006 Create custom highlight.js theme at `css/vendor/hljs-terminal.css` — invoke `frontend-design` skill

**Checkpoint**: Vendor libraries ready for integration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create core HTML/CSS structure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create `blog.html` with semantic HTML5 structure (header, main, footer)
- [x] T008 Add `<noscript>` fallback message in `blog.html` for JavaScript-disabled users
- [x] T009 Add view containers in `blog.html`: index view, post view, loading state, error state
- [x] T010 Create `css/blog.css` with CSS custom properties (inheriting from homepage)
- [x] T011 Add base typography and layout styles in `css/blog.css`
- [x] T012 Add script tags for vendor libraries and blog.js in `blog.html`
- [x] T013 Create `js/blog.js` with IIFE wrapper and CONFIG/state objects
- [x] T014 Create `content/posts/index.json` with empty array `[]`

**Checkpoint**: Foundation ready — page loads with correct structure and styles

---

## Phase 3: User Story 1 - Browse Blog Posts (Priority: P1) 🎯 MVP

**Goal**: Visitor sees a list of all blog posts, sorted by date (newest first)

**Independent Test**: Open blog.html in browser. Post list appears with titles, dates, and tags. Clicking a post title changes the hash to that post's slug.

### Implementation for User Story 1

- [x] T015 [US1] Implement `fetchIndex()` function in `js/blog.js` — fetch and parse index.json
- [x] T016 [US1] Implement `parseFrontmatter(content)` utility function in `js/blog.js`
- [x] T017 [US1] Implement `fetchAllPosts()` function in `js/blog.js` — fetch each post, parse frontmatter
- [x] T018 [US1] Implement `filterAndSortPosts(posts)` in `js/blog.js` — filter future dates, sort newest first
- [x] T019 [US1] Implement `renderIndex(posts)` function in `js/blog.js` — generate post list HTML
- [x] T020 [US1] Add post list item click handler to navigate via hash in `js/blog.js`
- [x] T021 [US1] Style blog index view (post list) in `css/blog.css` — invoke `frontend-design` skill
- [x] T022 [US1] Add empty state message ("No posts yet") in `renderIndex()` in `js/blog.js`
- [x] T023 [US1] Add loading state during fetch in `js/blog.js`
- [x] T024 [US1] Add error handling for failed index fetch in `js/blog.js`

**Checkpoint**: Post list displays correctly. User Story 1 independently testable.

---

## Phase 4: User Story 2 - Read Full Blog Post (Priority: P2)

**Goal**: Visitor reads full Markdown post with proper formatting and syntax highlighting

**Independent Test**: Navigate to blog.html#post-slug. Full post renders with title, date, tags, and formatted content.

### Implementation for User Story 2

- [x] T025 [US2] Implement `handleRoute()` function in `js/blog.js` — parse hash, determine view
- [x] T026 [US2] Add `hashchange` event listener in `init()` in `js/blog.js`
- [x] T027 [US2] Implement `fetchPost(slug)` function in `js/blog.js` — fetch single post markdown
- [x] T028 [US2] Implement `renderPost(post)` function in `js/blog.js` — render markdown with marked.js
- [x] T029 [US2] Configure marked.js with highlight.js integration in `js/blog.js`
- [x] T030 [US2] Add back-to-index link in post view template in `js/blog.js`
- [x] T031 [US2] Style post content typography in `css/blog.css` — invoke `frontend-design` skill
- [x] T032 [US2] Style code blocks with highlight.js theme in `css/blog.css`
- [x] T033 [US2] Add error handling for non-existent post (404) in `js/blog.js`
- [x] T034 [US2] Add loading state during post fetch in `js/blog.js`

**Checkpoint**: Individual posts render correctly. User Stories 1 AND 2 independently testable.

---

## Phase 5: User Story 3 - Add New Posts Workflow (Priority: P3)

**Goal**: Author can add posts by creating Markdown file + running shell command

**Independent Test**: Create new .md file, run index regeneration command, refresh blog — new post appears.

### Implementation for User Story 3

- [x] T035 [US3] Create example post `content/posts/2025-12-03-hello-world.md` with frontmatter
- [x] T036 [US3] Regenerate `content/posts/index.json` using shell command
- [x] T037 [US3] Verify example post appears in blog index
- [x] T038 [US3] Test future-dated post filtering (create post with tomorrow's date)
- [x] T039 [US3] Document post creation workflow in project README.md

**Checkpoint**: Authoring workflow complete and documented.

---

## Phase 6: User Story 4 - Navigate Seamlessly with Site (Priority: P4)

**Goal**: Blog integrates visually with rest of pyk.ee site

**Independent Test**: Navigate homepage → blog → post → homepage. Experience feels unified.

### Implementation for User Story 4

- [x] T040 [US4] Add site navigation header to `blog.html` (copy from index.html)
- [x] T041 [US4] Add site footer to `blog.html` (copy from index.html)
- [x] T042 [US4] Set `aria-current="page"` on Blog nav link in `blog.html`
- [x] T043 [US4] Add CRT scanlines background effect to `css/blog.css`
- [x] T044 [US4] Ensure CSS custom properties match homepage palette in `css/blog.css`
- [x] T045 [US4] Test navigation from homepage to blog and back

**Checkpoint**: Blog feels like part of unified pyk.ee site.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsiveness, accessibility, edge cases

- [x] T046 Add mobile breakpoint styles (max-width: 767px) in `css/blog.css`
- [x] T047 Adjust post list layout for mobile in `css/blog.css`
- [x] T048 Adjust post content typography for mobile in `css/blog.css`
- [x] T049 Ensure 44x44px minimum touch targets for mobile in `css/blog.css`
- [x] T050 Test horizontal scroll on 320px viewport
- [x] T051 [P] Add proper heading hierarchy for screen readers in `blog.html`
- [x] T052 [P] Add skip-to-content link in `blog.html`
- [x] T053 Add `prefers-reduced-motion` support in `css/blog.css`
- [x] T054 [P] Test in Chrome browser
- [x] T055 [P] Test in Firefox browser
- [x] T056 [P] Test in Safari browser
- [x] T057 [P] Test in Edge browser
- [x] T058 Test page opens correctly from `file://` protocol (shows helpful server instructions)
- [x] T059 Verify page weight under 500KB (excluding post content)
- [x] T060 Final code review for Article IV (nesting depth max 3)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) — BLOCKS all user stories
    ↓
┌───────────────────────────────────────────────────┐
│ User Stories can proceed after Phase 2            │
│                                                   │
│ US1 (Browse Posts) — MVP, do first                │
│   ↓                                               │
│ US2 (Read Post) — depends on US1 for navigation   │
│   ↓                                               │
│ US3 (Add Posts) — can parallel with US2           │
│   ↓                                               │
│ US4 (Site Integration) — depends on US1 existing  │
└───────────────────────────────────────────────────┘
    ↓
Phase 7 (Polish) — after all stories complete
```

### User Story Dependencies

| Story | Can Start After | Dependencies |
|-------|-----------------|--------------|
| US1 (Browse Posts) | Phase 2 | None |
| US2 (Read Post) | US1 | Needs routing from post list |
| US3 (Add Posts) | Phase 2 | None (parallel with US2) |
| US4 (Site Integration) | US1 | Needs blog page structure |

### Parallel Opportunities

Within each phase, tasks marked `[P]` can run in parallel:

- **Phase 1**: T002, T003 can run in parallel
- **Phase 7**: T051, T052 can run in parallel; T054, T055, T056, T057 can run in parallel

---

## Parallel Example: Setup Phase

```bash
# These can run simultaneously:
Task: "Create js/vendor/ directory structure"
Task: "Create css/vendor/ directory structure"
```

## Parallel Example: Browser Testing

```bash
# These can run simultaneously:
Task: "Test in Chrome browser"
Task: "Test in Firefox browser"
Task: "Test in Safari browser"
Task: "Test in Edge browser"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Browse Posts)
4. **STOP and VALIDATE**: Open blog.html — do posts appear?
5. If yes → MVP achieved, continue to US2

### Incremental Delivery

1. Setup + Foundational → Page loads with correct structure
2. Add US1 → Post list appears (MVP!)
3. Add US2 → Can read individual posts
4. Add US3 → Author workflow documented
5. Add US4 → Full site integration
6. Polish → Responsive, accessible, performant

### Suggested Git Commits (per Article XI)

| After Phase | Commit Message |
|-------------|----------------|
| Phase 1 | `chore: add vendor libraries and DEPENDENCIES.md` |
| Phase 2 | `feat: create blog page structure with base styles` |
| US1 | `feat: implement blog post index with date sorting` |
| US2 | `feat: add individual post rendering with syntax highlighting` |
| US3 | `feat: add example post and document authoring workflow` |
| US4 | `feat: integrate blog with site navigation and styling` |
| Phase 7 | `fix: add responsive mobile styles for blog` |
| Phase 7 | `fix: accessibility improvements for blog` |

---

## Notes

- **[P]** tasks = different files, no dependencies
- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Invoke `frontend-design` skill for tasks T006, T021, T031 (styling)
- Commit after each logical task group (per Article XI)
- Stop at any checkpoint to validate story independently
- All tasks assume manual browser testing (no automated test framework)

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 60 |
| **Setup Phase** | 6 tasks |
| **Foundational Phase** | 8 tasks |
| **US1 (Browse Posts)** | 10 tasks |
| **US2 (Read Post)** | 10 tasks |
| **US3 (Add Posts)** | 5 tasks |
| **US4 (Site Integration)** | 6 tasks |
| **Polish Phase** | 15 tasks |
| **Parallel Opportunities** | 11 tasks marked [P] |
| **MVP Scope** | Phase 1 + 2 + US1 (24 tasks) |

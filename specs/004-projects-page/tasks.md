# Tasks: Projects Page

**Input**: Design documents from `/specs/004-projects-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/github-api.md

**Tests**: Manual browser testing only (per spec - no automated tests requested)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Static web project - files at repository root:
- `projects/index.html` - Projects page
- `css/projects.css` - Styling
- `js/projects.js` - Functionality
- `content/projects.json` - Project data

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and file creation

- [ ] T001 [P] Create projects directory at `projects/`
- [ ] T002 [P] Create CSS file at `css/projects.css` with `:root` variables from `css/about-contact.css`
- [ ] T003 [P] Create JS file at `js/projects.js` with IIFE wrapper, CONFIG, state, and dom objects
- [ ] T004 [P] Create JSON data file at `content/projects.json` with all 9 projects from data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core HTML structure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create HTML page at `projects/index.html` with semantic structure: skip link, header nav, main, footer
- [ ] T006 Add navigation markup to `projects/index.html` with aria-current="page" on Projects link
- [ ] T007 Add page title with typewriter class to `projects/index.html`: `<span class="typewriter-title">> ls ~/projects</span>`
- [ ] T008 Add Featured section markup to `projects/index.html` with `id="featured-grid"`
- [ ] T009 Add regular projects section markup to `projects/index.html` with `id="projects-grid"`
- [ ] T010 Add footer with GLaDOS quote placeholder to `projects/index.html`
- [ ] T011 Add screen reader live region to `projects/index.html`: `<div id="sr-announcer" class="sr-only" aria-live="polite"></div>`

**Checkpoint**: HTML structure complete - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse All Projects (Priority: P1) 🎯 MVP

**Goal**: Visitors can browse and understand all projects at a glance

**Independent Test**: Open the Projects page. Within 30 seconds, identify at least 3 different technical domains (Linux, Web, Tools) and see featured projects prominently displayed.

### CSS for User Story 1

- [ ] T012 [P] [US1] Add base styles (reset, body, typography) to `css/projects.css`
- [ ] T013 [P] [US1] Add navigation styles to `css/projects.css` (copy from about-contact.css)
- [ ] T014 [P] [US1] Add CRT scanlines and ambient glow styles to `css/projects.css`
- [ ] T015 [P] [US1] Add `.project-grid` responsive grid styles to `css/projects.css` (1 col mobile, 2 col desktop)
- [ ] T016 [P] [US1] Add `.project-card` base styles to `css/projects.css` (border, background, padding)
- [ ] T017 [P] [US1] Add `.project-card--featured` modifier with amber glow to `css/projects.css`
- [ ] T018 [P] [US1] Add `.card-header`, `.card-name`, `.card-stats` styles to `css/projects.css`
- [ ] T019 [P] [US1] Add `.card-tagline`, `.card-category` styles to `css/projects.css`
- [ ] T020 [P] [US1] Add responsive breakpoint styles (768px) to `css/projects.css`
- [ ] T021 [P] [US1] Add reduced motion media query to `css/projects.css`

### JavaScript for User Story 1

- [ ] T022 [US1] Add `loadProjects()` function to `js/projects.js` to fetch `/content/projects.json`
- [ ] T023 [US1] Add `renderCard(project)` function to `js/projects.js` returning card HTML string
- [ ] T024 [US1] Add `renderProjects()` function to `js/projects.js` to render featured and regular grids
- [ ] T025 [US1] Add `cacheDomElements()` function to `js/projects.js` for dom object population
- [ ] T026 [US1] Add `checkReducedMotion()` function to `js/projects.js` (copy pattern from about-contact.js)
- [ ] T027 [US1] Add `init()` function to `js/projects.js` calling all setup functions
- [ ] T028 [US1] Add DOM ready listener to `js/projects.js` calling init()

**Checkpoint**: User Story 1 complete - page displays all projects in grid with featured section

---

## Phase 4: User Story 2 - Filter Projects by Category (Priority: P2)

**Goal**: Visitors can filter projects by category to find relevant work quickly

**Independent Test**: Click "Linux" filter button. Only Linux projects visible. Click "All" to reset.

### HTML for User Story 2

- [ ] T029 [US2] Add filter bar markup to `projects/index.html` with role="tablist" and filter buttons for All/Linux/Web/Tools/Learning

### CSS for User Story 2

- [ ] T030 [P] [US2] Add `.filter-bar` container styles to `css/projects.css`
- [ ] T031 [P] [US2] Add `.filter-btn` base styles to `css/projects.css` (terminal command look)
- [ ] T032 [P] [US2] Add `.filter-btn.active` styles to `css/projects.css` (highlighted state)
- [ ] T033 [P] [US2] Add `.project-card.filtered-out` styles to `css/projects.css` (opacity, pointer-events)
- [ ] T034 [P] [US2] Add filter transition animations to `css/projects.css` (fade out/in)

### JavaScript for User Story 2

- [ ] T035 [US2] Add `applyFilter(category)` function to `js/projects.js` toggling `.filtered-out` class
- [ ] T036 [US2] Add `updateFilterButtons(activeCategory)` function to `js/projects.js` managing `.active` class
- [ ] T037 [US2] Add filter button click event listeners in `js/projects.js`
- [ ] T038 [US2] Add `parseUrlHash()` function to `js/projects.js` extracting filter from URL hash
- [ ] T039 [US2] Add `updateUrlHash(category)` function to `js/projects.js` setting window.location.hash
- [ ] T040 [US2] Add hashchange event listener to `js/projects.js` for shareable filter URLs
- [ ] T041 [US2] Add keyboard support (Enter/Space) for filter buttons in `js/projects.js`
- [ ] T042 [US2] Add screen reader announcement on filter change in `js/projects.js`

**Checkpoint**: User Story 2 complete - filtering works with URL persistence and accessibility

---

## Phase 5: User Story 3 - View Live GitHub Stats (Priority: P3)

**Goal**: Visitors see live star/fork counts for social proof

**Independent Test**: Load page with network access. GitHub stats appear within 2 seconds. Disable network - fallback stats display without errors.

### CSS for User Story 3

- [ ] T043 [P] [US3] Add `.stat-loading` skeleton animation styles to `css/projects.css`

### JavaScript for User Story 3

- [ ] T044 [US3] Add `getCachedStats(owner, repo)` function to `js/projects.js` checking localStorage with 1hr TTL
- [ ] T045 [US3] Add `setCachedStats(owner, repo, stats)` function to `js/projects.js` writing to localStorage
- [ ] T046 [US3] Add `fetchGitHubStats(owner, repo)` function to `js/projects.js` with fetch and headers
- [ ] T047 [US3] Add `fetchWithTimeout(url, options, timeout)` function to `js/projects.js` using Promise.race
- [ ] T048 [US3] Add `fetchAllStats(projects)` function to `js/projects.js` batching requests with cache check
- [ ] T049 [US3] Add `updateCardStats(projectId, stats)` function to `js/projects.js` updating DOM
- [ ] T050 [US3] Integrate `fetchAllStats()` call in `init()` after `renderProjects()` in `js/projects.js`

**Checkpoint**: User Story 3 complete - live stats with caching and graceful fallback

---

## Phase 6: User Story 4 - Portal Easter Eggs (Priority: P4)

**Goal**: Curious visitors discover Portal-themed personality touches

**Independent Test**: Change filters and observe GLaDOS quote. Expand cards and check console for Test Chamber counter.

### CSS for User Story 4

- [ ] T051 [P] [US4] Add `.typewriter-title` and `.typewriter-cursor` styles to `css/projects.css`
- [ ] T052 [P] [US4] Add `.glados-quote` footer styles to `css/projects.css`

### JavaScript for User Story 4

- [ ] T053 [US4] Add `PORTAL_QUOTES` array to `js/projects.js` (copy from about-contact.js)
- [ ] T054 [US4] Add `typewriter(element)` function to `js/projects.js` (copy pattern from about-contact.js)
- [ ] T055 [US4] Add `displayGladosQuote()` function to `js/projects.js` for footer quote
- [ ] T056 [US4] Add `rotateGladosQuote()` function to `js/projects.js` called on filter change
- [ ] T057 [US4] Add Test Chamber counter logic to `js/projects.js` incrementing on card expand, logging to console
- [ ] T058 [US4] Add `KONAMI_CODE` array and listener to `js/projects.js` for ↑↑↓↓←→←→BA sequence
- [ ] T059 [US4] Add `revealCompanionCube()` function to `js/projects.js` adding hidden project and showing toast
- [ ] T060 [US4] Integrate typewriter call in `init()` in `js/projects.js`

**Checkpoint**: User Story 4 complete - Easter eggs implemented for personality

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final touches affecting multiple user stories

- [ ] T061 Add empty state message to `projects/index.html` for when filter has no results
- [ ] T062 Add `.empty-state` styles to `css/projects.css`
- [ ] T063 Show/hide empty state in filter logic in `js/projects.js`
- [ ] T064 [P] Add ARIA labels to all interactive elements in `projects/index.html`
- [ ] T065 [P] Verify minimum 44x44px touch targets in `css/projects.css`
- [ ] T066 [P] Add skip link focus styles to `css/projects.css`
- [ ] T067 Verify page works with JavaScript disabled (static HTML content visible)
- [ ] T068 Run Lighthouse accessibility audit - target score ≥ 90
- [ ] T069 Manual testing: keyboard navigation through all interactive elements
- [ ] T070 Manual testing: mobile viewport (375px width) layout and functionality

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3 → P4)
  - CSS tasks within each story can run in parallel with each other
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2 - Independent of US1
- **User Story 3 (P3)**: Can start after Phase 2 - Independent of US1/US2
- **User Story 4 (P4)**: Can start after Phase 2 - Independent of US1/US2/US3

### Within Each User Story

- CSS tasks marked [P] can run in parallel
- HTML before CSS/JS that references it
- Core rendering before interactive features
- Story complete before moving to next priority

### Parallel Opportunities

Within each phase, tasks marked [P] can run in parallel:

```
Phase 1: T001, T002, T003, T004 (all parallel - different files)
Phase 3 CSS: T012-T021 (all parallel - same file but independent sections)
Phase 4 CSS: T030-T034 (all parallel)
Phase 5 CSS: T043 (single task)
Phase 6 CSS: T051, T052 (parallel)
Phase 7: T064, T065, T066 (parallel)
```

---

## Parallel Example: User Story 1 CSS

```bash
# Launch all CSS tasks for User Story 1 together:
Task: "Add base styles to css/projects.css"
Task: "Add navigation styles to css/projects.css"
Task: "Add CRT scanlines styles to css/projects.css"
Task: "Add .project-grid responsive grid styles to css/projects.css"
Task: "Add .project-card base styles to css/projects.css"
Task: "Add .project-card--featured modifier to css/projects.css"
Task: "Add card header/name/stats styles to css/projects.css"
Task: "Add card tagline/category styles to css/projects.css"
Task: "Add responsive breakpoint styles to css/projects.css"
Task: "Add reduced motion media query to css/projects.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (4 tasks)
2. Complete Phase 2: Foundational (7 tasks)
3. Complete Phase 3: User Story 1 (17 tasks)
4. **STOP and VALIDATE**: Test that page displays all projects correctly
5. Deploy/demo if ready

**MVP Total**: 28 tasks

### Incremental Delivery

1. **Setup + Foundational → Foundation ready** (11 tasks)
2. **Add User Story 1 → MVP!** (17 tasks) - Basic browsing works
3. **Add User Story 2** (14 tasks) - Filtering works
4. **Add User Story 3** (8 tasks) - Live GitHub stats
5. **Add User Story 4** (10 tasks) - Easter eggs
6. **Polish** (10 tasks) - Final accessibility and testing

### Task Counts by Phase

| Phase | Tasks | Cumulative |
|-------|-------|------------|
| Setup | 4 | 4 |
| Foundational | 7 | 11 |
| US1 - Browse | 17 | 28 |
| US2 - Filter | 14 | 42 |
| US3 - GitHub Stats | 8 | 50 |
| US4 - Easter Eggs | 10 | 60 |
| Polish | 10 | 70 |

**Total: 70 tasks**

---

## Notes

- [P] tasks = different files or independent CSS sections, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All CSS tasks in a phase can typically run in parallel (same file, different sections)
- JS tasks are mostly sequential within a story (function dependencies)

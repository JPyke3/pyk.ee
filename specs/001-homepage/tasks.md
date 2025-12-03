# Tasks: Homepage / Landing Page

**Input**: Design documents from `/specs/001-homepage/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: No automated tests requested. Manual browser testing per plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

```text
/
├── index.html              # Homepage markup
├── css/
│   └── homepage.css        # Homepage styles
├── js/
│   └── homepage.js         # Logo tracking, particles
├── fonts/
│   └── JetBrainsMono/      # Self-hosted font files
└── content/
    ├── projects.json       # Future project data
    └── posts/.gitkeep      # Future blog posts
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure

- [x] T001 Create directory structure: `css/`, `js/`, `fonts/`, `content/posts/` at repository root
- [x] T002 [P] Download JetBrains Mono font files (Regular, Bold) to `fonts/JetBrainsMono/`
- [x] T003 [P] Create placeholder `content/projects.json` with empty array structure
- [x] T004 [P] Create `content/posts/.gitkeep` for future blog content

**Checkpoint**: Directory structure ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core CSS foundation that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `css/homepage.css` with CSS custom properties (colours, fonts, spacing) per plan.md section 3
- [x] T006 Add @font-face declarations for JetBrains Mono in `css/homepage.css`
- [x] T007 Add base reset and typography styles in `css/homepage.css`
- [x] T008 Create `index.html` with HTML5 doctype, meta tags, and CSS/JS links
- [x] T009 Add semantic structure to `index.html`: header, nav, main, footer elements

**Checkpoint**: Foundation ready - page loads with correct fonts and base styles

---

## Phase 3: User Story 1 - First Impression (Priority: P1) 🎯 MVP

**Goal**: Visitor understands who Pykee is within 3 seconds of page load

**Independent Test**: Open `index.html` in browser. Without scrolling, answer "Who is this person and what do they do?"

### Implementation for User Story 1

- [x] T010 [US1] Add hero section markup to `index.html` with name heading and descriptor
- [x] T011 [US1] Add hero copy: "I build things for the web and tinker with Linux." in `index.html`
- [x] T012 [US1] Style hero section (typography hierarchy, spacing) in `css/homepage.css`
- [x] T013 [US1] Add placeholder for pixel art pike mascot in `index.html`
- [x] T014 [US1] Style placeholder mascot (centred, amber tint) in `css/homepage.css`
- [x] T015 [US1] Ensure hero content is visible without scrolling on 1080p viewport

**Checkpoint**: Hero section complete with name, descriptor, and placeholder logo. First impression achieved.

---

## Phase 4: User Story 2 - Memorable Visual Experience (Priority: P2)

**Goal**: Page has a "wow moment" with interactive pixel art pike mascot and atmospheric background

**Independent Test**: Move mouse around page. Pike mascot should noticeably track cursor as easter egg. Background should have CRT scanline effect.

**Depends on**: User Story 1 (hero section exists)

### Implementation for User Story 2

- [x] T016 [US2] Add CRT scanlines effect using `body::before` pseudo-element in `css/homepage.css`
- [x] T017 [US2] Add ambient glow effect using radial gradient in `css/homepage.css`
- [x] T018 [US2] Create `js/homepage.js` with DOMContentLoaded wrapper
- [x] T019 [US2] Design pixel art pike mascot (32x32 or 64x64, cute/approachable) — invoke `frontend-design` skill
- [x] T020 [US2] Replace placeholder with pixel art pike mascot in `index.html`
- [x] T021 [US2] Add `aria-label` to mascot element for accessibility in `index.html`
- [x] T022 [US2] Implement mouse position tracking (mousemove listener) in `js/homepage.js`
- [x] T023 [US2] Implement requestAnimationFrame render loop in `js/homepage.js`
- [x] T024 [US2] Implement mascot transform calculation based on cursor position in `js/homepage.js`
- [x] T025 [US2] Add `prefers-reduced-motion` check to disable animations in `js/homepage.js`
- [x] T026 [P] [US2] Add canvas element for particle background in `index.html`
- [x] T027 [US2] Implement particle system (30-50 amber particles, slow drift) in `js/homepage.js`
- [x] T028 [US2] Add canvas resize handling for responsive viewport in `js/homepage.js`

**Checkpoint**: Pike mascot tracks mouse smoothly as easter egg. Scanlines and particles create atmospheric background. Animations disabled for reduced-motion users.

---

## Phase 5: User Story 3 - Site Navigation (Priority: P3)

**Goal**: Visitor can find links to all key sections within 2 seconds

**Independent Test**: Look for navigation. Find links to Home, Projects, Blog, About, Contact.

### Implementation for User Story 3

- [x] T029 [US3] Add navigation markup with `<nav>` and `<ul>` structure in `index.html`
- [x] T030 [US3] Add nav links: Home (aria-current), Projects, Blog, About, Contact in `index.html`
- [x] T031 [US3] Style navigation bar (horizontal, centred, amber text) in `css/homepage.css`
- [x] T032 [US3] Add hover glow effect to nav links using `text-shadow` in `css/homepage.css`
- [x] T033 [US3] Add focus states for keyboard navigation in `css/homepage.css`
- [x] T034 [US3] Ensure tab order is logical (nav → hero → content → footer) in `index.html`

**Checkpoint**: Navigation is visible, styled, and keyboard accessible. All 5 links present.

---

## Phase 6: User Story 4 - Contact Path (Priority: P4)

**Goal**: Clear, non-pushy CTA for contact visible above the fold

**Independent Test**: Find contact option without scrolling. CTA feels inviting, not salesy.

**Depends on**: User Story 1 (hero section), User Story 3 (navigation)

### Implementation for User Story 4

- [x] T035 [US4] Add primary Contact CTA markup in hero section of `index.html`
- [x] T036 [US4] Structure CTA with prompt (`>`), text, and cursor spans in `index.html`
- [x] T037 [US4] Style command-prompt CTA appearance in `css/homepage.css` — invoke `frontend-design` skill
- [x] T038 [US4] Add blinking cursor CSS animation in `css/homepage.css`
- [x] T039 [US4] Add hover underline effect to CTA in `css/homepage.css`
- [x] T040 [US4] Ensure CTA has minimum 44x44px touch target in `css/homepage.css`
- [x] T041 [US4] Add `aria-hidden="true"` to decorative prompt/cursor spans in `index.html`

**Checkpoint**: Contact CTA visible above fold, styled as terminal command, accessible.

---

## Phase 7: User Story 5 - Blog Discovery (Priority: P5)

**Goal**: Blog is surfaced prominently, visitor notices it exists

**Independent Test**: Scan page. Find Blog CTA or prominent link without searching.

**Depends on**: User Story 4 (CTA styling exists)

### Implementation for User Story 5

- [x] T042 [US5] Add secondary Blog CTA in hero section of `index.html`
- [x] T043 [US5] Style Blog CTA as secondary variant (less prominent than Contact) in `css/homepage.css`
- [x] T044 [US5] Position both CTAs (Contact primary, Blog secondary) in `css/homepage.css`

**Checkpoint**: Blog CTA visible above fold alongside Contact CTA.

---

## Phase 8: User Story 6 - Personality & Technical Identity (Priority: P6)

**Goal**: Visitor gets sense of personality, Linux/open-source identity

**Independent Test**: After viewing page, describe Pykee in 2-3 adjectives. Find GitHub link.

**Depends on**: User Story 1 (hero complete)

### Implementation for User Story 6

- [x] T045 [US6] Add "What I Do" section markup below hero in `index.html`
- [x] T046 [US6] Add brief technical interests copy (Linux, open source) in `index.html`
- [x] T047 [US6] Add GitHub link (https://github.com/JPyke3) in `index.html`
- [x] T048 [US6] Style "What I Do" section (scannable, no walls of text) in `css/homepage.css`
- [x] T049 [US6] Style GitHub link with subtle hover effect in `css/homepage.css`

**Checkpoint**: "What I Do" section conveys personality. GitHub link works.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, accessibility, performance

- [x] T050 Add mobile breakpoint (max-width: 767px) styles in `css/homepage.css`
- [x] T051 Adjust hero typography scale for mobile in `css/homepage.css`
- [x] T052 Adjust navigation for mobile (horizontal or hamburger) in `css/homepage.css`
- [x] T053 Adjust CTA touch targets for mobile in `css/homepage.css`
- [x] T054 Test and fix horizontal scroll on 320px viewport
- [x] T055 [P] Verify colour contrast (amber on black) meets WCAG AA
- [x] T056 [P] Add skip-to-content link for keyboard users in `index.html`
- [x] T057 Reduce particle count on mobile for performance in `js/homepage.js`
- [x] T058 Verify page weight is under 500KB target (~212KB actual)
- [ ] T059 Test in Chrome, Firefox, Safari, Edge browsers
- [ ] T060 Verify page opens correctly from `file://` protocol
- [x] T061 Add scroll affordance indicator (animated chevron) to hint at below-fold content
- [x] T062 Generate favicon from pike mascot (favicon.ico, favicon.svg, apple-touch-icon)
- [x] T063 Add favicon link tags to `index.html`

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
│ US1 (First Impression) — MVP, do first            │
│   ↓                                               │
│ US2 (Visual Experience) — depends on US1 hero    │
│   ↓                                               │
│ US3 (Navigation) — can parallel with US2          │
│   ↓                                               │
│ US4 (Contact CTA) — depends on US1, US3           │
│   ↓                                               │
│ US5 (Blog CTA) — depends on US4 styling           │
│   ↓                                               │
│ US6 (Personality) — depends on US1                │
└───────────────────────────────────────────────────┘
    ↓
Phase 9 (Polish) — after all stories complete
```

### User Story Dependencies

| Story | Can Start After | Dependencies |
|-------|-----------------|--------------|
| US1 (First Impression) | Phase 2 | None |
| US2 (Visual Experience) | US1 | Hero section must exist |
| US3 (Navigation) | Phase 2 | None (parallel with US2) |
| US4 (Contact CTA) | US1, US3 | Hero and nav must exist |
| US5 (Blog CTA) | US4 | CTA styling defined |
| US6 (Personality) | US1 | Hero section exists |

### Parallel Opportunities

Within each phase, tasks marked `[P]` can run in parallel:

- **Phase 1**: T002, T003, T004 can run in parallel
- **Phase 4 (US2)**: T026 can run parallel with T022-T025

---

## Parallel Example: Setup Phase

```bash
# These can run simultaneously:
Task: "Download JetBrains Mono font files to fonts/JetBrainsMono/"
Task: "Create placeholder content/projects.json"
Task: "Create content/posts/.gitkeep"
```

## Parallel Example: User Story 2

```bash
# After T021 (logo in HTML), these can run in parallel:
Task: "Add canvas element for particle background in index.html"
# While working on:
Task: "Implement mouse position tracking in js/homepage.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (First Impression)
4. **STOP and VALIDATE**: Open index.html — can you tell who Pykee is?
5. If yes → MVP achieved, continue to US2

### Incremental Delivery

1. Setup + Foundational → Page loads with correct fonts
2. Add US1 → Hero with name and descriptor (MVP!)
3. Add US2 → Wow moment with interactive logo
4. Add US3 → Navigation links
5. Add US4 + US5 → CTAs for Contact and Blog
6. Add US6 → Personality section
7. Polish → Responsive, accessible, performant

### Suggested Git Commits (per Article XI)

| After Phase | Commit Message |
|-------------|----------------|
| Phase 1 | `chore: create project directory structure` |
| Phase 2 | `feat: add CSS foundation with Portal colour palette` |
| US1 | `feat: add hero section with name and descriptor` |
| US2 (scanlines) | `style: add CRT scanlines background effect` |
| US2 (mascot) | `feat: create pixel art pike mascot with mouse tracking` |
| US2 (particles) | `feat: add ambient particle canvas` |
| US3 | `feat: implement navigation with hover glow` |
| US4 | `feat: add command-prompt Contact CTA` |
| US5 | `feat: add Blog CTA` |
| US6 | `feat: add What I Do section with GitHub link` |
| Phase 9 | `fix: add responsive mobile breakpoint` |
| Phase 9 | `fix: accessibility improvements (ARIA, focus states)` |

---

## Notes

- **[P]** tasks = different files, no dependencies
- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each logical task group (per Article XI)
- Stop at any checkpoint to validate story independently
- Invoke `frontend-design` skill for tasks T019 (pike mascot), T037 (CTA styling)
- All tasks assume manual browser testing (no automated test framework)

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 63 |
| **Setup Phase** | 4 tasks |
| **Foundational Phase** | 5 tasks |
| **US1 (First Impression)** | 6 tasks |
| **US2 (Visual Experience)** | 13 tasks (2 pending: pike mascot design) |
| **US3 (Navigation)** | 6 tasks |
| **US4 (Contact CTA)** | 7 tasks |
| **US5 (Blog CTA)** | 3 tasks |
| **US6 (Personality)** | 5 tasks |
| **Polish Phase** | 14 tasks (includes scroll indicator, favicon) |
| **Parallel Opportunities** | 8 tasks marked [P] |
| **MVP Scope** | Phase 1 + 2 + US1 (15 tasks) |

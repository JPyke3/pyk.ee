# Tasks: About & Contact Pages

**Input**: Design documents from `/specs/003-about-contact/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: No automated tests requested. Manual browser testing per quickstart.md validation checklist.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Static web pages at repository root
- `about/index.html` and `contact/index.html` for clean URLs
- `css/about-contact.css` for shared styles
- `js/about-contact.js` for shared interactions

---

## Phase 1: Setup

**Purpose**: Create directory structure and base files

- [x] T001 Create feature branch `003-about-contact` and push to remote
- [x] T002 [P] Create `about/` directory at repository root
- [x] T003 [P] Create `contact/` directory at repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared CSS and JS files that MUST exist before page implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `css/about-contact.css` with CSS variables duplicated from homepage.css
- [x] T005 Add font-face declarations to `css/about-contact.css` for JetBrains Mono
- [x] T006 Add base reset and typography styles to `css/about-contact.css`
- [x] T007 Add CRT scanlines effect to `css/about-contact.css` (copy from homepage.css body::before)
- [x] T008 Add navigation styles to `css/about-contact.css` (copy from homepage.css .main-nav)
- [x] T009 Add reduced motion media query to `css/about-contact.css`
- [x] T010 Create `js/about-contact.js` with IIFE wrapper and strict mode
- [x] T011 Add reduced motion detection to `js/about-contact.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Learn About Pykee (Priority: P1) 🎯 MVP

**Goal**: Visitor views About page and understands who Pykee is within 30 seconds

**Independent Test**: Open `/about` in browser. Verify: (1) terminal stats block renders, (2) content includes role, expertise, personal details, (3) casual tone throughout

### Implementation for User Story 1

- [x] T012 [US1] Create `about/index.html` with HTML5 doctype and meta tags
- [x] T013 [US1] Add navigation header to `about/index.html` with `aria-current="page"` on About link
- [x] T014 [US1] Add main content section with typewriter title `# whoami` to `about/index.html`
- [x] T015 [US1] Add terminal stats block (whoami, location, languages, uptime) to `about/index.html`
- [x] T016 [US1] Add biographical content sections (current role, tech areas, background) to `about/index.html`
- [x] T017 [US1] Add footer with GLaDOS quote placeholder to `about/index.html`
- [x] T018 [US1] Add `.page-title` and `.typewriter-title` styles to `css/about-contact.css`
- [x] T019 [US1] Add `.terminal-block` and `.terminal-line` styles to `css/about-contact.css`
- [x] T020 [US1] Add staggered animation keyframes for terminal lines to `css/about-contact.css`
- [x] T021 [US1] Add `.content-section` and prose typography styles to `css/about-contact.css`
- [x] T022 [US1] Add page load fade-in animation styles to `css/about-contact.css`
- [x] T023 [US1] Implement `typewriter()` function in `js/about-contact.js`
- [x] T024 [US1] Add GLaDOS quotes array and random selection to `js/about-contact.js`
- [x] T025 [US1] Add companion cube easter egg (hover on "tinkerer") to `js/about-contact.js`
- [x] T026 [US1] Add companion cube SVG and hover styles to `css/about-contact.css`

**Checkpoint**: About page fully functional and testable independently

---

## Phase 4: User Story 2 - Contact Pykee (Priority: P2)

**Goal**: Visitor views Contact page and can reach out via any of 4 contact methods within 5 seconds

**Independent Test**: Open `/contact` in browser. Verify: (1) all 4 contact links visible and clickable, (2) email copy-to-clipboard works, (3) friendly call-to-action displayed

### Implementation for User Story 2

- [x] T027 [US2] Create `contact/index.html` with HTML5 doctype and meta tags
- [x] T028 [US2] Add navigation header to `contact/index.html` with `aria-current="page"` on Contact link
- [x] T029 [US2] Add main content section with typewriter title `# ./contact` to `contact/index.html`
- [x] T030 [US2] Add contact methods list (email, LinkedIn, GitHub, Mastodon) with inline SVG icons to `contact/index.html`
- [x] T031 [US2] Add call-to-action text ("Open to interesting projects...") to `contact/index.html`
- [x] T032 [US2] Add footer with GLaDOS quote placeholder to `contact/index.html`
- [x] T033 [US2] Add aria-live region for copy confirmation to `contact/index.html`
- [x] T034 [US2] Add `.contact-methods` and `.contact-method` styles to `css/about-contact.css`
- [x] T035 [US2] Add inline SVG icon styles (email, LinkedIn, GitHub, Mastodon) to `css/about-contact.css`
- [x] T036 [US2] Add `.toast` notification styles to `css/about-contact.css`
- [x] T037 [US2] Add call-to-action text styles to `css/about-contact.css`
- [x] T038 [US2] Implement `copyToClipboard()` function in `js/about-contact.js`
- [x] T039 [US2] Implement `showToast()` function with auto-dismiss in `js/about-contact.js`
- [x] T040 [US2] Add click handler for email link copy functionality in `js/about-contact.js`

**Checkpoint**: Contact page fully functional and testable independently

---

## Phase 5: User Story 3 - Navigate Between Pages (Priority: P3)

**Goal**: Visitor experiences consistent navigation and styling across all pages

**Independent Test**: Navigate Home → About → Contact → Home. Verify: (1) consistent header/footer, (2) matching aesthetic, (3) correct aria-current marking

### Implementation for User Story 3

- [x] T041 [US3] Add responsive breakpoints (767px, 320px) to `css/about-contact.css`
- [x] T042 [US3] Add mobile navigation styles to `css/about-contact.css`
- [x] T043 [US3] Add mobile layout for contact methods (stacked) to `css/about-contact.css`
- [x] T044 [US3] Add mobile terminal block font size adjustments to `css/about-contact.css`
- [x] T045 [US3] Verify 44px minimum touch targets for all interactive elements
- [x] T046 [US3] Add footer styles matching homepage to `css/about-contact.css`
- [x] T047 [US3] Initialize typewriter, GLaDOS quote, and easter egg on DOMContentLoaded in `js/about-contact.js`

**Checkpoint**: All pages share consistent navigation and styling

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final polish, validation, and commits

- [x] T048 [P] Test both pages via `file://` protocol for zero-build compliance
- [x] T049 [P] Test both pages via local HTTP server
- [x] T050 [P] Test reduced motion preference (disable animations)
- [x] T051 [P] Test mobile viewport (375px width)
- [x] T052 [P] Validate keyboard navigation and focus indicators
- [x] T053 Verify all external links have `target="_blank" rel="noopener noreferrer"`
- [x] T054 Run quickstart.md validation checklist
- [x] T055 Create atomic commits per Article XI guidelines
- [x] T056 Push feature branch to remote

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - About page
- **User Story 2 (Phase 4)**: Depends on Foundational - Contact page (can parallel with US1)
- **User Story 3 (Phase 5)**: Depends on US1 and US2 completion for navigation testing
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Shares CSS/JS with US1, but pages are independent
- **User Story 3 (P3)**: Requires US1 and US2 pages to exist for cross-page navigation testing

### Parallel Opportunities

- T002 and T003 (directory creation) can run in parallel
- T012-T026 (US1) and T027-T040 (US2) can run in parallel after Foundational
- T048-T052 (testing tasks) can all run in parallel

---

## Parallel Example: User Story 1 & 2 Simultaneously

```bash
# After Foundational phase, both stories can proceed in parallel:

# Developer A (User Story 1 - About):
Task: "Create about/index.html with HTML5 doctype and meta tags"
Task: "Add terminal stats block to about/index.html"
Task: "Implement typewriter() function in js/about-contact.js"

# Developer B (User Story 2 - Contact):
Task: "Create contact/index.html with HTML5 doctype and meta tags"
Task: "Add contact methods list with inline SVG icons to contact/index.html"
Task: "Implement copyToClipboard() function in js/about-contact.js"
```

**Note**: CSS and JS files are shared, so coordinate commits to avoid merge conflicts.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CSS variables, base styles, reduced motion)
3. Complete Phase 3: User Story 1 (About page)
4. **STOP and VALIDATE**: Test About page independently
5. Demo if ready - visitor can learn about Pykee

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (About) → Test independently → Demo (MVP!)
3. Add User Story 2 (Contact) → Test independently → Demo
4. Add User Story 3 (Navigation polish) → Test cross-page → Demo
5. Each story adds value without breaking previous stories

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 56 |
| Phase 1 (Setup) | 3 |
| Phase 2 (Foundational) | 8 |
| Phase 3 (US1 - About) | 15 |
| Phase 4 (US2 - Contact) | 14 |
| Phase 5 (US3 - Navigation) | 7 |
| Phase 6 (Polish) | 9 |
| Parallelizable Tasks | 12 |

**MVP Scope**: Phases 1-3 (26 tasks) deliver a functional About page.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each task or logical group per Article XI
- Shared CSS/JS requires coordination if working in parallel
- Easter eggs (GLaDOS quotes, companion cube) are in User Story 1 since About page hosts them

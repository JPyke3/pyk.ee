# Tasks: CI Workflow and Custom 404 Page

**Input**: Design documents from `/specs/005-ci-and-404-page/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Manual browser testing only (per spec - no automated tests requested)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Static web project - files at repository root:
- `.github/workflows/` - CI workflow
- Root level - Config files (`.html-validate.json`, `.stylelintrc.json`)
- `css/` - Stylesheets
- `404.html` - Error page at root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Directory structure for GitHub Actions

- [ ] T001 Create `.github/workflows/` directory for CI workflow

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Linter configuration files that workflow depends on

**⚠️ CRITICAL**: CI workflow cannot run without config files

- [ ] T002 [P] Create HTML validator config at `.html-validate.json` with `html-validate:recommended` preset
- [ ] T003 [P] Create CSS linter config at `.stylelintrc.json` with `stylelint-config-standard` preset and exclusion patterns

**Checkpoint**: Config files ready - CI workflow can now be created

---

## Phase 3: User Story 1 - Code Quality Validation (Priority: P1) 🎯 MVP

**Goal**: Automated HTML/CSS validation on push to main branch

**Independent Test**: Push code with intentional errors to main and verify CI fails with clear messages. Push valid code and verify CI passes.

### Implementation for User Story 1

- [ ] T004 [US1] Create GitHub Actions workflow at `.github/workflows/validate.yml` with main branch trigger
- [ ] T005 [US1] Add checkout and Node.js setup steps to `.github/workflows/validate.yml`
- [ ] T006 [US1] Add npm install step for html-validate and stylelint to `.github/workflows/validate.yml`
- [ ] T007 [US1] Add HTML validation step to `.github/workflows/validate.yml` running html-validate on `**/*.html`
- [ ] T008 [US1] Add CSS validation step to `.github/workflows/validate.yml` running stylelint on `css/**/*.css`

**Checkpoint**: User Story 1 complete - CI workflow validates HTML/CSS on push to main

---

## Phase 4: User Story 2 - Custom 404 Error Experience (Priority: P2)

**Goal**: Terminal-styled error page with GLaDOS quotes

**Independent Test**: Navigate to any non-existent URL, verify custom 404 page displays with styling and quote rotation.

### CSS for User Story 2

- [ ] T009 [P] [US2] Create base styles (font-face, CSS variables, reset) in `css/404.css`
- [ ] T010 [P] [US2] Add CRT scanline overlay effect to `css/404.css`
- [ ] T011 [P] [US2] Add ambient glow effect to `css/404.css`
- [ ] T012 [P] [US2] Add `.error-container` centered layout styles to `css/404.css`
- [ ] T013 [P] [US2] Add `.error-code` large "404" text styles with glitch animation to `css/404.css`
- [ ] T014 [P] [US2] Add `@keyframes glitch` animation for position distortion to `css/404.css`
- [ ] T015 [P] [US2] Add `@keyframes colorShift` animation for red flash to `css/404.css`
- [ ] T016 [P] [US2] Add `@keyframes flicker` animation for subtle opacity to `css/404.css`
- [ ] T017 [P] [US2] Add `.error-title` styles for "FILE NOT FOUND" heading to `css/404.css`
- [ ] T018 [P] [US2] Add `.glados-quote` and `.glados-attribution` styles to `css/404.css`
- [ ] T019 [P] [US2] Add `.home-link` terminal-styled link styles to `css/404.css`
- [ ] T020 [P] [US2] Add reduced motion media query to `css/404.css`
- [ ] T021 [P] [US2] Add responsive styles for mobile viewport to `css/404.css`

### HTML for User Story 2

- [ ] T022 [US2] Create `404.html` with doctype, head, and meta tags (charset, viewport, description)
- [ ] T023 [US2] Add CSS link and favicon link to `404.html` head
- [ ] T024 [US2] Add main content structure with error-container to `404.html`
- [ ] T025 [US2] Add large "404" error code element to `404.html`
- [ ] T026 [US2] Add "FILE NOT FOUND" heading to `404.html`
- [ ] T027 [US2] Add GLaDOS quote blockquote with fallback text to `404.html`
- [ ] T028 [US2] Add homepage link with terminal styling to `404.html`
- [ ] T029 [US2] Add inline script with GLADOS_QUOTES array and random selection to `404.html`

**Checkpoint**: User Story 2 complete - 404 page displays with styling and GLaDOS quotes

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and accessibility

- [ ] T030 [P] Verify 404 page works with JavaScript disabled (fallback quote visible)
- [ ] T031 [P] Test 404 page glitch animation in multiple browsers
- [ ] T032 [P] Test 404 page responsive layout on mobile viewport
- [ ] T033 Run Lighthouse accessibility audit on `404.html` - target score ≥ 90
- [ ] T034 Manual test: Push invalid HTML to main, verify CI fails with file/line info
- [ ] T035 Manual test: Push invalid CSS to main, verify CI fails with clear error
- [ ] T036 Manual test: Push valid code to main, verify CI passes
- [ ] T037 Manual test: Push to non-main branch, verify no CI triggered

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Story 1 (Phase 3)**: Depends on Foundational completion (needs config files)
- **User Story 2 (Phase 4)**: Can start after Setup (no dependency on US1)
- **Polish (Phase 5)**: Depends on both User Stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on config files (Phase 2) - Independent of US2
- **User Story 2 (P2)**: No dependencies on US1 - Can run in parallel

### Within Each User Story

- US1: Sequential workflow file building (T004 → T005 → T006 → T007 → T008)
- US2: CSS tasks [P] can run in parallel, then HTML tasks sequentially

### Parallel Opportunities

Within Phase 2 (Foundational):
```
T002 [P] .html-validate.json
T003 [P] .stylelintrc.json
```

Within Phase 4 (User Story 2) CSS:
```
T009-T021 [P] All CSS tasks (same file but independent sections)
```

Between User Stories (after Phase 2):
```
US1 (CI Workflow) and US2 (404 Page) can run in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (1 task)
2. Complete Phase 2: Foundational (2 tasks)
3. Complete Phase 3: User Story 1 (5 tasks)
4. **STOP and VALIDATE**: Push code and verify CI runs
5. **MVP Total**: 8 tasks

### Incremental Delivery

1. **Setup + Foundational → Config ready** (3 tasks)
2. **Add User Story 1 → MVP!** (5 tasks) - CI validates code
3. **Add User Story 2** (21 tasks) - 404 page complete
4. **Polish** (8 tasks) - Final testing

### Parallel Strategy

With parallel execution:
1. Complete Setup (T001)
2. Run T002 and T003 in parallel
3. Run US1 (T004-T008) and US2 CSS (T009-T021) in parallel
4. Complete US2 HTML (T022-T029) after CSS
5. Run all Polish tasks in parallel

### Task Counts by Phase

| Phase | Tasks | Cumulative |
|-------|-------|------------|
| Setup | 1 | 1 |
| Foundational | 2 | 3 |
| US1 - CI Workflow | 5 | 8 |
| US2 - 404 Page | 21 | 29 |
| Polish | 8 | 37 |

**Total: 37 tasks**

---

## Notes

- [P] tasks = different files or independent CSS sections, no dependencies
- [US1] and [US2] labels map to user stories from spec.md
- Each user story is independently completable and testable
- Commit after each task or logical group
- US1 and US2 can run in parallel after Foundational phase
- CSS tasks in US2 are all parallelizable (same file, different sections)

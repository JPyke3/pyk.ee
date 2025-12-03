# Feature Specification: Projects Page

**Feature Branch**: `004-projects-page`
**Created**: 2025-12-03
**Status**: Draft
**Constitution Reference**: v1.4.0

## Overview

The Projects page showcases Pykee's tinkerer identity through a curated collection of open-source work, personal experiments, and technical projects. It serves as evidence of technical breadth and curiosity for potential employers, collaborators, and fellow developers.

**Core Message**: "Here's what I build when no one's paying me — proof that I genuinely love this stuff."

**Primary Goal**: A visitor should be able to assess technical range within 30 seconds of landing on the page.

**Tone**: Casual and authentic. Let the projects speak for themselves — no overselling or corporate speak. This is a tinkerer's workshop, not a LinkedIn profile.

## User Scenarios & Testing

### User Story 1 - Browse All Projects (Priority: P1)

A visitor lands on the Projects page and quickly scans the project collection to understand Pykee's technical range and interests.

**Why this priority**: The core purpose of the page — if visitors can't quickly browse and understand the project portfolio, the page fails its primary mission.

**Independent Test**: Open the Projects page. Within 30 seconds, the visitor should identify at least 3 different technical domains (Linux, Web, Tools) and understand the depth of work in each area.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the Projects page, **When** they scan the page, **Then** they see featured projects prominently displayed at the top
2. **Given** a visitor views the project grid, **When** they scan project cards, **Then** each card displays project name, brief description, category tag, and GitHub link
3. **Given** a visitor wants more details, **When** they click a project's GitHub link, **Then** they are taken to the project repository in a new tab
4. **Given** a visitor uses a mobile device, **When** they view the page, **Then** projects display in a single column with all content readable

---

### User Story 2 - Filter Projects by Category (Priority: P2)

A visitor interested in a specific domain (e.g., Linux work) wants to filter the project list to see only relevant projects.

**Why this priority**: Filtering helps visitors find relevant work quickly, especially important for employers assessing specific skill areas.

**Independent Test**: Click the "Linux" filter button. Only Linux-related projects should be visible. Click "All" to reset.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Projects page, **When** they view the filter options, **Then** they see buttons for All, Linux, Web, Tools, and Learning categories
2. **Given** a visitor clicks "Linux" filter, **When** the filter activates, **Then** only projects tagged as Linux are visible, other projects are hidden
3. **Given** a visitor has a filter active, **When** they click "All", **Then** all projects become visible again
4. **Given** a visitor clicks a filter, **When** the filter activates, **Then** the active filter button is visually distinguished from inactive filters
5. **Given** a visitor uses keyboard navigation, **When** they tab to filter buttons, **Then** they can activate filters using Enter or Space

---

### User Story 3 - View Live GitHub Stats (Priority: P3)

A visitor sees up-to-date star and fork counts for each project, providing social proof of project impact.

**Why this priority**: Live stats add credibility, but the page should work perfectly without them (graceful degradation).

**Independent Test**: Open the Projects page with network access. Projects with GitHub repos should display current star/fork counts within 2 seconds.

**Acceptance Scenarios**:

1. **Given** a visitor loads the Projects page with network access, **When** GitHub API responds successfully, **Then** projects display live star and fork counts
2. **Given** the GitHub API fails or is rate-limited, **When** the page loads, **Then** projects display placeholder stats (dash or cached values) without errors
3. **Given** a visitor has previously loaded the page within the last hour, **When** they reload, **Then** cached stats are displayed immediately (localStorage cache)
4. **Given** the cache is older than 1 hour, **When** the page loads, **Then** fresh data is fetched from GitHub API

---

### User Story 4 - Experience Portal Easter Eggs (Priority: P4)

A curious visitor discovers Portal-themed touches that add personality and delight to the browsing experience.

**Why this priority**: Easter eggs reinforce site personality but are non-essential — the page must work perfectly without them.

**Independent Test**: Interact with the page (filter changes, etc.) and observe Portal-themed elements appearing naturally.

**Acceptance Scenarios**:

1. **Given** a visitor views the page header, **When** they look for themed elements, **Then** they see a "Test Chamber" designation with an incrementing number
2. **Given** a visitor changes filters, **When** the filter updates, **Then** a random GLaDOS quote briefly appears

---

### Edge Cases

- **JavaScript disabled**: Project cards should still display static content (name, description, category, links) from the base HTML structure
- **GitHub API rate limit exceeded (60/hour unauthenticated)**: Display cached stats or placeholder, no error messages shown to user
- **Network timeout**: After 3 seconds, fall back to placeholder stats
- **Empty category filter**: If a category has no projects, display a friendly message ("No projects in this category yet")
- **localStorage unavailable**: Fetch fresh data on each load, page still functions
- **Long project descriptions**: Truncate with ellipsis, full description visible in card or on GitHub

## Requirements

### Functional Requirements

#### Page Structure

- **FR-001**: Projects page MUST be accessible at `/projects` URL (clean URL pattern via `projects/index.html`)
- **FR-002**: Page MUST include the standard site navigation header with "Projects" marked as current page
- **FR-003**: Page MUST include the standard site footer
- **FR-004**: Page MUST include animated typewriter title matching About/Blog page pattern
- **FR-005**: Page MUST use terminal/Aperture aesthetic (amber on black, JetBrains Mono, CRT scanlines)

#### Featured Projects Section

- **FR-010**: Page MUST display a "Featured" section prominently at the top
- **FR-011**: Featured section MUST highlight mbp-manjaro and arch-mbp-archiso projects
- **FR-012**: Featured projects MUST have enhanced visual treatment (larger cards, more prominent styling)

#### Project Cards

- **FR-020**: Each project MUST be displayed as a card in a responsive grid layout
- **FR-021**: Each project card MUST display: project name, brief tagline/description, category tag, GitHub link
- **FR-022**: Each project card SHOULD display live star and fork counts when available
- **FR-023**: Project cards MUST link to GitHub repository, opening in new tab with `rel="noopener noreferrer"`
- **FR-024**: Grid MUST be responsive: 1 column on mobile (<768px), 2+ columns on desktop

#### Category Filtering

- **FR-030**: Page MUST include filter buttons for: All, Linux, Web, Tools, Learning
- **FR-031**: "All" filter MUST be active by default on page load
- **FR-032**: Clicking a category filter MUST show only projects in that category
- **FR-033**: Clicking "All" MUST show all projects
- **FR-034**: Active filter MUST be visually distinguished (different styling/color)
- **FR-035**: Filter transitions SHOULD be animated (fade in/out, respect reduced-motion preference)

#### GitHub API Integration

- **FR-040**: Page MUST fetch live star/fork counts from GitHub API on load
- **FR-041**: API requests MUST use the public unauthenticated endpoint (`api.github.com/repos/{owner}/{repo}`)
- **FR-042**: Page MUST cache API responses in localStorage with 1-hour TTL
- **FR-043**: If API fails or is rate-limited, page MUST display placeholder stats (dash character or cached values)
- **FR-044**: API fetch MUST timeout after 3 seconds and fall back to placeholders
- **FR-045**: Page MUST NOT require GitHub authentication

#### Data Source

- **FR-050**: Project data MUST be stored in a static JSON file (`/content/projects.json`)
- **FR-051**: JSON file MUST include for each project: id, name, tagline, description, category, github_url, featured (boolean)
- **FR-052**: JSON file MAY include fallback star/fork counts for display when API is unavailable

#### Accessibility

- **FR-060**: Page MUST be fully keyboard navigable
- **FR-061**: Filter buttons MUST be focusable and activatable via keyboard
- **FR-062**: All interactive elements MUST have minimum 44x44px touch targets on mobile
- **FR-063**: Page MUST respect `prefers-reduced-motion` for all animations
- **FR-064**: Page MUST include appropriate ARIA labels for screen readers

#### Easter Eggs (Optional)

- **FR-070**: Page MAY include a "Test Chamber" number in the header that increments (stored in localStorage)
- **FR-071**: Page MAY display a random GLaDOS quote when filters change

### Key Entities

- **Project**: A showcased work item (id, name, tagline, description, category, github_url, featured, fallback_stars, fallback_forks)
- **Category**: Classification for filtering (linux, web, tools, learning)
- **GitHub Stats Cache**: Cached API response (repo_id, stars, forks, timestamp)

## Assumptions

- **Curated list is static**: Projects are manually added to `projects.json`, not auto-discovered from GitHub
- **No auth needed**: Using only public GitHub API endpoints (60 requests/hour limit is acceptable for a personal portfolio)
- **Single visitor assumption**: Cache is per-browser; concurrent visitors each have their own localStorage cache
- **Categories are fixed**: The four categories (Linux, Web, Tools, Learning) are sufficient; no dynamic category generation needed
- **Same JavaScript patterns**: Will follow existing IIFE + CONFIG + state pattern from other JS modules
- **Shared CSS approach**: Can extend `homepage.css` or create `projects.css` following established patterns

## Constitutional Compliance

| Article | Requirement | Compliance |
|---------|-------------|------------|
| I       | Zero-build portability | Opens directly via projects/index.html |
| II      | Minimal dependencies | No new JS dependencies; reuses existing patterns |
| III     | One-file-per-type | Single projects.js, single projects.css (or extend existing) |
| IV      | Never-nesting | Max 3 levels in all code |
| V       | Content-data separation | Project data in /content/projects.json, not hardcoded |
| VI      | Pixel art aesthetic | Reuses homepage aesthetic, no new pixel art |
| VII     | Anti-corporate voice | Casual tone, projects speak for themselves |
| VIII    | Desktop-first, mobile-functional | Responsive grid with mobile breakpoints |
| X       | Simplicity gate | Minimal API integration, graceful fallbacks |
| XI      | Strict version control | Feature branch with atomic commits |
| XII     | Dependency attribution | No new dependencies to document |

## Success Criteria

### Measurable Outcomes

- **SC-001**: Visitors can identify at least 3 different technical domains within 30 seconds of viewing the page
- **SC-002**: Featured projects (mbp-manjaro, arch-mbp-archiso) are immediately visible without scrolling on desktop
- **SC-003**: Category filtering works correctly — clicking "Linux" shows only Linux projects
- **SC-004**: GitHub stats display within 2 seconds on first load with network access
- **SC-005**: Page loads and displays all project cards when GitHub API is unavailable
- **SC-006**: Page is fully functional on mobile (iPhone SE viewport, 375px width minimum)
- **SC-007**: All project cards are keyboard-accessible and navigable
- **SC-008**: Page respects reduced-motion preference for all animations

## File Structure

Per Article III (One-File-Per-Feature Rule) and clean URL pattern:

```
/
├── projects/
│   └── index.html          # Projects page
├── content/
│   └── projects.json       # Project data (already exists, to be populated)
├── css/
│   └── projects.css        # Projects-specific styles (optional, can extend homepage.css)
└── js/
    └── projects.js         # Projects page functionality (filtering, API fetch, caching)
```

## Out of Scope

- Individual project detail pages (each project links directly to GitHub)
- GitHub OAuth authentication
- Contribution graphs or activity heatmaps
- Automatic project discovery from GitHub API
- Project screenshots or media galleries
- Project search functionality (filtering is sufficient for this scale)
- Sorting options (beyond category filtering)
- Pagination (all projects displayed; list is curated and small)

## Data Reference

### Projects to Include

**Featured:**

| Project          | Category | Description                                     |
|------------------|----------|-------------------------------------------------|
| mbp-manjaro      | Linux    | ISO build scripts for Manjaro Linux on T2 MacBooks |
| arch-mbp-archiso | Linux    | Arch Linux ISO for 2018+ MacBook Pro            |

**Additional:**

| Project                         | Category | Description                          |
|---------------------------------|----------|--------------------------------------|
| mbp-manjaro-kernel              | Linux    | Custom Manjaro kernel with T2 patches |
| mbp-arch-install                | Linux    | T2 MacBook Arch setup script         |
| corne-wireless-view-zmk-config  | Tools    | ZMK firmware for Corne split keyboard |
| Jiten                           | Learning | Japanese learning project            |
| pyk.ee                          | Web      | This portfolio site (meta!)          |
| JacobPyke.com                   | Web      | Previous AngularDart portfolio       |
| codecompanion.nvim              | Tools    | Neovim Copilot Chat fork             |

### projects.json Structure

```json
{
  "projects": [
    {
      "id": "mbp-manjaro",
      "name": "mbp-manjaro",
      "tagline": "Manjaro Linux for T2 MacBooks",
      "description": "ISO build scripts for Manjaro Linux on T2 MacBooks",
      "category": "linux",
      "github_url": "https://github.com/JPyke3/mbp-manjaro",
      "featured": true,
      "fallback_stars": 61,
      "fallback_forks": 10
    }
  ]
}
```

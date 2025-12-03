# Feature Specification: CI Workflow and Custom 404 Page

**Feature Branch**: `005-ci-and-404-page`
**Created**: 2025-12-03
**Status**: Draft
**Input**: User description: "Add continuous integration and custom 404 error page to pyk.ee static website"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Code Quality Validation (Priority: P1)

As a developer, I want automated validation of HTML and CSS files when I push code to the main branch, so that I catch syntax errors and standards violations before they affect the live site.

**Why this priority**: Code quality validation provides immediate value by catching errors early. Without this, broken code could be deployed to production. This is the foundation for maintaining site reliability.

**Independent Test**: Can be fully tested by pushing code with intentional HTML/CSS errors and verifying the CI workflow fails with clear error messages. Delivers value by preventing broken code from being merged.

**Acceptance Scenarios**:

1. **Given** a push to `main` containing invalid HTML (e.g., unclosed tags), **When** the CI workflow runs, **Then** the workflow fails and displays specific error messages indicating the file and line number
2. **Given** a push to `main` containing invalid CSS (e.g., syntax errors), **When** the CI workflow runs, **Then** the workflow fails and displays specific error messages indicating the file and issue
3. **Given** a push to `main` containing valid HTML and CSS, **When** the CI workflow runs, **Then** the workflow passes successfully
4. **Given** a push to a non-main branch, **When** the push completes, **Then** no CI workflow is triggered

---

### User Story 2 - Custom 404 Error Experience (Priority: P2)

As a visitor who navigates to a non-existent page, I want to see a branded error page that matches the site's terminal aesthetic, so that I understand I've reached an invalid URL and can easily navigate back to the site.

**Why this priority**: Provides a polished user experience for visitors who encounter broken links. While not critical for site functionality, it maintains brand consistency and prevents user confusion. Depends on having the site working (hence P2).

**Independent Test**: Can be fully tested by navigating to any non-existent URL (e.g., `/nonexistent`) and verifying the custom 404 page displays with proper styling and navigation links.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to a non-existent URL, **When** the server returns a 404 response, **Then** the custom 404 page displays with the terminal aesthetic (amber on black)
2. **Given** the 404 page is displayed, **When** the visitor views the page, **Then** they see a GLaDOS-style error message and clear navigation back to the homepage
3. **Given** the 404 page is displayed on any device, **When** the page renders, **Then** the CRT scanline effect and styling match other pages on the site
4. **Given** the 404 page loads, **When** the visitor clicks the homepage link, **Then** they are navigated to the site homepage

---

### Edge Cases

- What happens when HTML validation tools encounter files with unusual encodings? (Assumption: All files use UTF-8 as per existing codebase)
- How does the system handle validation of minified or third-party files? (Assumption: Exclude vendor/third-party directories from validation)
- What happens if the 404 page itself has errors? (The 404 page should be simple enough to be error-free; it will be validated by the same CI workflow)
- How does the 404 page behave with JavaScript disabled? (Should be fully functional as static HTML with inline critical CSS)

## Requirements *(mandatory)*

### Functional Requirements

**CI Workflow**:

- **FR-001**: Workflow MUST trigger automatically on every push to the `main` branch
- **FR-002**: Workflow MUST NOT trigger on pushes to non-main branches
- **FR-003**: Workflow MUST validate all HTML files in the repository using htmlhint
- **FR-004**: Workflow MUST validate all CSS files in the repository using stylelint
- **FR-005**: Workflow MUST fail if any HTML validation errors are found
- **FR-006**: Workflow MUST fail if any CSS validation errors are found
- **FR-007**: Workflow MUST display clear error messages with file names and line numbers on failure
- **FR-008**: Workflow MUST complete successfully when all files pass validation
- **FR-009**: Workflow MUST NOT include any deployment steps (deployment handled externally)
- **FR-010**: Workflow MUST exclude node_modules and other generated directories from validation

**404 Page**:

- **FR-011**: Page MUST display "404 - File Not Found" in terminal-style formatting
- **FR-012**: Page MUST include a GLaDOS-style humorous error message
- **FR-013**: Page MUST include navigation link(s) back to the homepage
- **FR-014**: Page MUST use the site's design system (amber #FF9900 on black #000000)
- **FR-015**: Page MUST use JetBrains Mono font (from existing /fonts directory)
- **FR-016**: Page MUST include CRT scanline visual effect matching other pages
- **FR-017**: Page MUST be fully functional with JavaScript disabled
- **FR-018**: Page MUST be accessible (proper heading structure, focus states, semantic HTML)
- **FR-019**: Page MUST work standalone (reference existing CSS or inline critical styles)
- **FR-020**: Page MUST include proper meta tags (charset, viewport, description)

### Key Entities

- **CI Workflow**: GitHub Actions configuration that defines validation jobs, triggers, and failure conditions
- **404 Page**: Standalone HTML page served when a requested resource is not found, containing error messaging and navigation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: CI workflow catches 100% of HTML syntax errors (unclosed tags, invalid attributes)
- **SC-002**: CI workflow catches 100% of CSS syntax errors (malformed rules, invalid properties)
- **SC-003**: CI workflow completes validation within 2 minutes for the full codebase
- **SC-004**: 404 page loads and displays correctly within 1 second
- **SC-005**: 404 page achieves Lighthouse accessibility score of 90+
- **SC-006**: 404 page visual design is indistinguishable from other site pages in styling
- **SC-007**: All acceptance scenarios pass manual testing

## Assumptions

- UTF-8 encoding is used for all files (consistent with existing codebase)
- Node.js-based validation tools (htmlhint, stylelint) are acceptable for CI since they only run in GitHub Actions, not in the production site
- The web server is configured to serve 404.html for 404 responses (server configuration is outside scope)
- Existing CSS files in the repository can be referenced by the 404 page (no need to inline all styles)
- The site's existing visual patterns (CRT scanlines, ambient glow) should be replicated

## Out of Scope

- Server configuration for serving the 404 page
- Deployment automation (handled externally)
- JavaScript functionality on the 404 page (static HTML only)
- Custom error pages for other HTTP status codes (500, 403, etc.)
- Integration tests beyond HTML/CSS validation

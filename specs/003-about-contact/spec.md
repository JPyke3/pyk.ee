# Feature Specification: About & Contact Pages

**Feature Branch**: `003-about-contact`
**Created**: 2025-12-03
**Status**: Draft
**Constitution Reference**: v1.4.0

## Overview

The About and Contact pages complete the core portfolio navigation by introducing who Pykee is and providing clear ways to connect. Both pages maintain the established terminal/Aperture Science aesthetic while showcasing personality over corporate formality.

**Core Message**: "I'm a tinkerer who builds things, speaks multiple languages (human and programming), and believes in building in public."

**Tone**: First-person, casual, like explaining yourself at a tech meetup — not a job interview.

## User Scenarios & Testing

### User Story 1 - Learn About Pykee (Priority: P1)

A visitor clicks "About" in the navigation and quickly understands who Pykee is, what they do, and what makes them interesting — without reading a boring CV.

**Why this priority**: The About page is the primary destination for anyone wanting to understand the person behind the portfolio. First impressions matter for potential collaborators, employers, or community members.

**Independent Test**: Open the About page. Within 30 seconds of reading, the visitor should understand: (1) Pykee's current role and side project, (2) their technical background, (3) something memorable/personal about them.

**Acceptance Scenarios**:

1. **Given** a visitor is on the About page, **When** they scan the page, **Then** they see an engaging opening hook (not "I'm a software developer")
2. **Given** a visitor wants to understand technical background, **When** they read the page, **Then** they find current role, key technologies, and areas of expertise without corporate buzzwords
3. **Given** a visitor is curious about the person, **When** they view the page, **Then** they discover personal touches (languages spoken, location, international experience)
4. **Given** a visitor uses a mobile device, **When** they view the About page, **Then** all content is readable and navigation works properly

---

### User Story 2 - Contact Pykee (Priority: P2)

A visitor wants to reach out and can quickly find clear, clickable contact methods without hunting through the site.

**Why this priority**: Contact is the conversion point — visitors who want to collaborate, hire, or connect need frictionless access to contact methods.

**Independent Test**: Open the Contact page. Within 5 seconds, the visitor should see at least 3 clickable contact methods and understand how to reach out.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Contact page, **When** they look for contact methods, **Then** they see email, LinkedIn, GitHub, and Mastodon links prominently displayed
2. **Given** a visitor clicks any contact link, **When** the link is clicked, **Then** it opens the appropriate application/website (mailto for email, external site for social)
3. **Given** a visitor reads the page, **When** they view the call to action, **Then** they understand Pykee is open to interesting projects, collaboration, or casual conversation
4. **Given** a visitor uses a mobile device, **When** they tap contact links, **Then** touch targets are large enough (minimum 44x44px) and links work correctly

---

### User Story 3 - Navigate Between Pages (Priority: P3)

A visitor experiences consistent navigation and styling across About and Contact pages, reinforcing the cohesive site identity.

**Why this priority**: Consistency builds trust and reinforces brand identity. Disjointed pages undermine the professional impression.

**Independent Test**: Navigate from Homepage → About → Contact → Homepage. Each transition should feel like the same site, with consistent header, footer, and styling.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page, **When** they look for navigation, **Then** they see the same navigation bar with Home, Projects, Blog, About, Contact links
2. **Given** a visitor views About or Contact, **When** they observe the styling, **Then** it matches the homepage aesthetic (amber on black, JetBrains Mono, terminal feel)
3. **Given** a visitor navigates to About, **When** they view the navigation bar, **Then** "About" is marked as the current page
4. **Given** a visitor navigates to Contact, **When** they view the navigation bar, **Then** "Contact" is marked as the current page

---

### Edge Cases

- **JavaScript disabled**: Pages should still display all content (no dynamic loading required for static pages)
- **Long content overflow**: If bio text is longer than expected, layout should handle gracefully
- **External link failure**: External links (LinkedIn, GitHub, Mastodon) should open in new tabs with proper security attributes
- **Email client not configured**: mailto links should still be clickable; user's system handles fallback
- **Screen reader access**: All content and links must be accessible with proper semantic markup

## Requirements

### Functional Requirements

#### About Page

- **FR-001**: About page MUST be accessible at `/about` URL (clean URL pattern)
- **FR-002**: About page MUST display an engaging opening that establishes the tinkerer/builder identity
- **FR-003**: About page MUST include current professional role (Software Developer at Suncorp) and side project (Carex.Life)
- **FR-004**: About page MUST display technical expertise areas without exhaustive listing
- **FR-005**: About page MUST include personal details: location (Brisbane), languages (English, German, Japanese), and international experience
- **FR-006**: About page MUST include a terminal-styled "stats" or "whoami" block for playful presentation
- **FR-007**: About page MUST NOT include full work history, irrelevant jobs, or certification details
- **FR-008**: About page MUST use first-person, casual tone throughout

#### Contact Page

- **FR-010**: Contact page MUST be accessible at `/contact` URL (clean URL pattern)
- **FR-011**: Contact page MUST display email address (contact@pyk.ee) as clickable mailto link
- **FR-012**: Contact page MUST display LinkedIn profile link (linkedin.com/in/pykejacob)
- **FR-013**: Contact page MUST display GitHub profile link (github.com/JPyke3)
- **FR-014**: Contact page MUST display Mastodon profile link (mastodon.social/@pykee)
- **FR-015**: Contact page MUST include Nerd Font icons for each contact method where appropriate
- **FR-016**: Contact page MUST include a friendly call-to-action mentioning openness to projects, collaboration, or saying g'day
- **FR-017**: Contact page MUST NOT include a form, phone number, physical address, or scheduling links
- **FR-018**: All external links MUST open in new tabs with `rel="noopener noreferrer"`

#### Shared Requirements

- **FR-020**: Both pages MUST include the standard site navigation header
- **FR-021**: Both pages MUST include the standard site footer
- **FR-022**: Both pages MUST use terminal/Aperture aesthetic (amber on black, JetBrains Mono)
- **FR-023**: Both pages MUST include CRT scanlines background effect
- **FR-024**: Both pages MUST be responsive (desktop-first, functional on mobile)
- **FR-025**: Both pages MUST set `aria-current="page"` on the active navigation link
- **FR-026**: Both pages MUST work without JavaScript (static content, no dynamic loading required)

### Non-Functional Requirements

- **NFR-001**: Both pages MUST load within 1 second on broadband
- **NFR-002**: Page weight SHOULD be under 100KB each (excluding shared assets)
- **NFR-003**: All interactive elements MUST have minimum 44x44px touch targets on mobile

### Key Entities

- **About Page Content**: Static biographical information (role, background, tech stack, personal details)
- **Contact Method**: A way to reach Pykee (type: email/linkedin/github/mastodon, url, display text, icon)

## Assumptions

- **Content is hardcoded**: Both pages contain static content that rarely changes — no external data files or CMS needed
- **Nerd Fonts available**: The site will include Nerd Font glyphs for contact icons (or fallback gracefully)
- **Same CSS file**: Both pages can share a single CSS file (`about-contact.css`) since they share styling needs
- **No form backend**: Contact is link-based only — no server-side form processing required
- **Terminal blocks**: The "stats" or "whoami" styling can reuse existing terminal/CTA component patterns from homepage

## Constitutional Compliance

| Article | Requirement | Compliance |
|---------|-------------|------------|
| I | Zero-build portability | Opens directly via about/index.html and contact/index.html |
| II | Minimal dependencies | No additional JS dependencies |
| III | One-file-per-type | Single CSS file for both pages, or reuse homepage.css |
| IV | Never-nesting | Max 3 levels in all code |
| V | Content-data separation | N/A — content is static, no external data |
| VI | Pixel art aesthetic | Reuses homepage aesthetic, no new pixel art |
| VII | Anti-corporate voice | Casual, authentic copy required |
| VIII | Desktop-first, mobile-functional | Responsive breakpoints included |
| X | Simplicity gate | Static pages, no dynamic complexity |
| XI | Strict version control | Feature branch with atomic commits |
| XII | Dependency attribution | No new dependencies to document |

## Success Criteria

### Measurable Outcomes

- **SC-001**: Visitors can identify Pykee's current role and expertise within 30 seconds of viewing the About page
- **SC-002**: All four contact methods (email, LinkedIn, GitHub, Mastodon) are clickable and functional
- **SC-003**: Both pages load and display correctly when opened via local server
- **SC-004**: Both pages are fully functional on mobile (iPhone SE viewport, 375px width minimum)
- **SC-005**: About page tone passes the "tech meetup test" — reads like casual conversation, not a resume
- **SC-006**: Contact page provides clear next steps — visitor knows they can reach out about projects, collaboration, or casual chat
- **SC-007**: Both pages include standard navigation with correct aria-current marking
- **SC-008**: Feature introduces maximum 2 new HTML files (about/index.html, contact/index.html) per Article III

## File Structure

Per Article III (One-File-Per-Feature Rule) and clean URL pattern:

```
/
├── about/
│   └── index.html          # About page
├── contact/
│   └── index.html          # Contact page
└── css/
    └── about-contact.css   # Shared styles for both pages (optional, can extend homepage.css)
```

**Note**: JavaScript may not be needed for these static pages. If minimal interactivity is required (e.g., scroll indicator), homepage.js patterns can be reused.

## Out of Scope

- Contact form with backend processing
- Full work history or resume/CV content
- Phone number or physical address
- Calendly or scheduling integration
- Social media feeds or embeds
- Analytics or tracking integration
- Multi-language content (English only)

## Content Reference

### About Page Content (to be styled)

**Opening**: Lead with tinkerer/builder identity, not job title

**Stats block concept**:
```
> whoami
pykee

> location
Brisbane, AU

> languages --human
English, Deutsch, 日本語 (少し)

> uptime
Since 1998
```

**Background highlights**:
- Software Developer at Suncorp (Brisbane)
- Building AI solutions at Carex.Life
- 4+ years in Germany, fluent German
- BTech from RMIT University
- Moved from Microsoft/cloud consulting to AI/LLM engineering

**Tech areas**:
- AI/ML: LangChain, LangGraph, Python, LLM agents
- Cloud: AWS (CDK, serverless), Azure
- DevOps: Docker, GitHub Actions
- Languages: Python, TypeScript, Rust (learning)
- Fun stuff: Linux kernel patches, Neovim, NixOS

**Currently exploring**: Rust, Neovim, FOSS AI models, Agentic Coding

### Contact Page Content (to be styled)

**Contact methods**:
- Email: contact@pyk.ee
- LinkedIn: linkedin.com/in/pykejacob
- GitHub: github.com/JPyke3
- Mastodon: mastodon.social/@pykee

**Call to action**: Open to interesting projects, collaboration, or just saying g'day

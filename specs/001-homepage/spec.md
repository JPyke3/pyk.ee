# Feature Specification: Homepage / Landing Page

**Feature Branch**: `001-homepage`
**Created**: 2025-12-03
**Status**: Draft
**Constitution Reference**: v1.0.1

## Overview

The homepage establishes the visual identity and navigation structure for pyk.ee, a personal portfolio for Jacob Pyke ("Pykee")—a software developer and Linux tinkerer based in Brisbane, Australia.

**Core Message**: "This person builds interesting things and is technically very competent"
**Tone**: Casual, authentic, Australian-friendly. Anti-corporate. Less is more.

## User Scenarios & Testing

### User Story 1 - First Impression (Priority: P1)

A visitor lands on pyk.ee and immediately understands who Pykee is and what he does. Within 3 seconds of page load, the visitor grasps that this is a technically skilled developer who builds interesting things.

**Why this priority**: First impressions determine whether visitors stay or bounce. This is the fundamental purpose of a homepage.

**Independent Test**: Open index.html in a browser. Without scrolling or clicking, a new visitor should be able to answer "Who is this person and what do they do?"

**Acceptance Scenarios**:

1. **Given** the page has loaded, **When** a visitor looks at the hero section, **Then** they see a name, a brief descriptor, and visual elements that convey technical competence
2. **Given** the page has loaded, **When** 3 seconds have passed, **Then** the visitor has enough information to decide if they want to explore further
3. **Given** JavaScript is disabled, **When** the page loads, **Then** all essential content (name, descriptor, navigation) remains visible and functional

---

### User Story 2 - Memorable Visual Experience (Priority: P2)

A visitor is visually engaged by something unique—the page has a "wow moment" that differentiates it from generic developer portfolios. The interactive pixel art pike mascot and atmospheric background create a distinctive, memorable experience.

**Why this priority**: Differentiation is critical in a sea of identical portfolio sites. A memorable experience leads to recall and referrals.

**Independent Test**: Show the homepage to someone for 30 seconds, then ask them to describe it an hour later. They should remember specific visual elements.

**Acceptance Scenarios**:

1. **Given** the page has loaded, **When** the visitor moves their mouse, **Then** the pixel art pike mascot visibly tracks/follows the cursor position as an easter egg (noticeable within a few seconds)
2. **Given** the page has loaded, **When** the visitor observes the background, **Then** they see subtle CRT-style terminal scanlines with minimal ambient motion
3. **Given** the page is viewed on mobile, **When** there is no mouse cursor, **Then** the pike mascot displays in a static but visually appealing state
4. **Given** the visitor has seen 10 other developer portfolios, **When** they visit pyk.ee, **Then** they perceive it as distinctly different in aesthetic

---

### User Story 3 - Site Navigation (Priority: P3)

A visitor can quickly find their way to all key sections of the site: Projects, Blog, About, and Contact. Navigation is persistent and consistent.

**Why this priority**: After the first impression, navigation enables all other journeys. Without it, visitors cannot explore.

**Independent Test**: A visitor can identify all navigation options within 2 seconds of looking for them.

**Acceptance Scenarios**:

1. **Given** the page has loaded, **When** the visitor looks for navigation, **Then** they find links to Home, Projects, Blog, About, and Contact
2. **Given** the visitor is on any viewport size, **When** they look for navigation, **Then** all navigation links are accessible (hamburger menu on mobile is acceptable)
3. **Given** the navigation component is built, **When** it is reused on other pages, **Then** it works identically without modification

---

### User Story 4 - Contact Path (Priority: P4)

A visitor interested in professional opportunities can easily find how to contact Pykee. The path to contact is clear but not pushy.

**Why this priority**: Converting interested visitors to contacts is a key goal, but secondary to establishing credibility first.

**Independent Test**: A recruiter or potential client can find contact information within 10 seconds of deciding they want to reach out.

**Acceptance Scenarios**:

1. **Given** the page has loaded, **When** the visitor looks for contact options, **Then** a Contact CTA is visible above the fold
2. **Given** the visitor clicks the Contact CTA, **When** the contact page loads, **Then** they find actionable contact methods (email, form, or social links)
3. **Given** the CTA text and styling, **When** a visitor reads it, **Then** it feels inviting rather than salesy

---

### User Story 5 - Blog Discovery (Priority: P5)

A visitor discovers that Pykee writes blog content and is encouraged to explore it. The blog is surfaced as a key content area.

**Why this priority**: Blog content demonstrates ongoing activity and expertise, but is secondary to the core identity and contact paths.

**Independent Test**: A visitor notices the blog exists without actively searching for it.

**Acceptance Scenarios**:

1. **Given** the page has loaded, **When** the visitor scans the page, **Then** a Blog CTA or link is visible above the fold
2. **Given** the Blog CTA exists, **When** it is clicked, **Then** the visitor navigates to a blog listing or featured post

---

### User Story 6 - Personality & Technical Identity (Priority: P6)

A visitor gets a sense of who Pykee is as a person—not just skills, but interests, values, and personality. The page conveys a love of Linux, open source, and tinkering.

**Why this priority**: Personality creates connection and memorability, but requires the foundation of identity and navigation first.

**Independent Test**: After viewing the homepage, a visitor could describe Pykee's personality in 2-3 adjectives.

**Acceptance Scenarios**:

1. **Given** the page has loaded, **When** the visitor reads the "What I Do" section, **Then** they understand Pykee's technical interests (Linux, open source, etc.)
2. **Given** the copy throughout the page, **When** the visitor reads it, **Then** it feels casual and authentic, not corporate
3. **Given** a link to GitHub exists, **When** clicked, **Then** it opens Pykee's GitHub profile

---

### Edge Cases

- **JavaScript disabled**: Pike mascot displays as static image; navigation works via standard links; background may be static or simplified
- **Slow connection**: Critical content (text, navigation) loads first; decorative elements (animations, background effects) load progressively
- **Screen reader**: All content is accessible; decorative pixel art has appropriate aria labels; navigation is keyboard-accessible
- **Very wide viewport (4K+)**: Content remains centred and readable; background scales appropriately
- **Very narrow viewport (320px)**: All content remains accessible; no horizontal scroll

## Requirements

### Functional Requirements

#### Core Structure
- **FR-001**: Page MUST load and function by opening index.html directly (no build step) [Article I]
- **FR-002**: Page MUST display correctly with JavaScript disabled (graceful degradation)
- **FR-003**: Page MUST include semantic HTML5 structure (header, main, footer, nav)

#### Logo & Branding
- **FR-010**: Site MUST display a pixel art pike fish mascot as the primary logo [Article VI]
- **FR-010a**: Pike mascot MUST be cute and approachable — friendly mascot vibes similar to Claude Code mascot
- **FR-010b**: Pike mascot MUST be sized for 24x16 pixel grid with flat color and clear personality
- **FR-010c**: Pike mascot MUST work as profile picture and favicon
- **FR-011**: Logo MUST float toward user's mouse cursor as an easter egg (whole-element CSS transform, not eye-only)
- **FR-012**: Logo tracking MUST be smooth (no jitter or lag perceptible at 60fps)
- **FR-013**: Logo MUST display static fallback when JavaScript is disabled
- **FR-014**: Logo MUST display static state on touch devices (no cursor to track)
- **FR-014a**: Logo MUST respond to click/tap with a wiggle animation (brief bounce/shake)
- **FR-015**: Primary brand name displayed MUST be "Pykee" (not "Jacob Pyke")

#### Background & Atmosphere
- **FR-020**: Page MUST display CRT-style terminal scanlines as background effect [Article VI]
- **FR-021**: Background MUST include minimal ambient animation (subtle flicker or drift)
- **FR-022**: Background MUST NOT interfere with text readability (sufficient contrast)
- **FR-023**: Background effects MUST be implemented in CSS where possible (performance)

#### Hero Section
- **FR-030**: Hero MUST display "Pykee" as the primary brand name/heading
- **FR-031**: Hero MUST include brief descriptor/tagline: "I build things for the web and tinker with Linux."
- **FR-032**: Hero copy MUST be casual and authentic, not corporate [Article VII]

#### Navigation
- **FR-040**: Navigation MUST include links to: Home, Projects, Blog, About, Contact
- **FR-041**: Navigation MUST be persistent/reusable across all site pages
- **FR-042**: Navigation MUST be accessible via keyboard (tab navigation)
- **FR-043**: Navigation MUST be responsive (mobile-friendly, hamburger acceptable)

#### Calls to Action
- **FR-050**: Primary CTA for Contact MUST be visible above the fold
- **FR-051**: Secondary CTA for Blog MUST be visible above the fold
- **FR-052**: CTAs MUST feel natural, not pushy or salesy [Article VII]

#### What I Do Section
- **FR-060**: Section MUST briefly describe technical interests/skills
- **FR-061**: Section MUST mention Linux tinkering and open source
- **FR-062**: Section MUST include link to GitHub profile (https://github.com/JPyke3)
- **FR-063**: Section MUST be scannable (no walls of text)

#### Styling & Aesthetic
- **FR-070**: Page MUST load in dark mode by default [Article VI]
- **FR-071**: Page MUST NOT use forbidden fonts (Inter, Roboto, Arial, system-ui as primary) [Article VI]
- **FR-072**: Page MUST NOT use clichéd colour schemes (purple gradients, generic blue CTAs) [Article VI]
- **FR-073**: Pixel art decorative elements LIMITED to one per page [Article VI]
- **FR-074**: Colour palette MUST use Portal/Aperture Science terminal aesthetic: amber/orange (#FF9900-#FFB000) text/accents on black (#000000) background
- **FR-075**: Primary font MUST be JetBrains Mono or Fira Code (monospace); fallback to system monospace

#### Scroll Affordance
- **FR-085**: Hero section MUST include a "scroll down" indicator at bottom (text + animated chevron)
- **FR-086**: Footer MUST include a "back to top" indicator (text + chevron)
- **FR-087**: Both scroll indicators MUST be clickable with smooth scroll behavior
- **FR-088**: Scroll indicators MUST respect `prefers-reduced-motion` (instant scroll if reduced motion)

#### Responsiveness
- **FR-080**: Page MUST be fully functional on mobile devices [Article VIII]
- **FR-081**: Page MUST include responsive breakpoints
- **FR-082**: Content MUST be readable without horizontal scrolling on mobile
- **FR-083**: Touch targets MUST be appropriately sized (minimum 44x44px)

### Non-Functional Requirements

- **NFR-001**: Page MUST load critical content within 1 second on broadband
- **NFR-002**: Total page weight SHOULD be under 500KB (excluding future WASM demo)
- **NFR-003**: Page MUST score 90+ on Lighthouse accessibility audit
- **NFR-004**: All animations MUST respect `prefers-reduced-motion` user preference

### Key Entities

- **Navigation**: Set of links (label, URL, optional icon) shared across all pages
- **Hero Content**: Name, descriptor text, CTAs
- **What I Do Content**: Brief text, skill mentions, external links

## Constitutional Compliance

| Article | Requirement | Compliance |
|---------|-------------|------------|
| I | Zero-build portability | Page opens directly via index.html |
| II | Minimal dependencies | Vanilla HTML/CSS/JS only |
| III | One-file-per-type | One HTML, one CSS, one JS file |
| IV | Never-nesting | Max 3 levels in all code |
| V | Content-data separation | Navigation data in JSON (future-proofing) |
| VI | Pixel art aesthetic | Pixel art pike mascot, dark mode, no forbidden fonts |
| VII | Anti-corporate voice | Casual copy, no jargon |
| VIII | Desktop-first, mobile-functional | Responsive with desktop priority |
| X | Simplicity gate | Vanilla implementation first |

**Note**: Article IX (WebAssembly showcase) is out of scope for this feature; the WASM demo will be integrated later.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Page loads and is fully functional when opening index.html directly in Chrome, Firefox, Safari, and Edge
- **SC-002**: Pike mascot mouse tracking is noticeable within 3 seconds of mouse movement
- **SC-003**: All navigation links are present and correctly styled
- **SC-004**: Contact and Blog CTAs are visible without scrolling on 1080p viewport
- **SC-005**: Page is fully functional on mobile (iPhone SE viewport, 375px width minimum)
- **SC-006**: Lighthouse accessibility score is 90+
- **SC-007**: Page contains no forbidden fonts or generic colour schemes
- **SC-008**: Copy passes "would a human say this?" test (no corporate jargon)
- **SC-009**: Feature introduces maximum 3 new files (1 HTML, 1 CSS, 1 JS) per Article III
- **SC-010**: Pike mascot works as profile picture/avatar at small sizes
- **SC-011**: Favicon displays pike mascot correctly

## File Structure

Per Article III (One-File-Per-Feature Rule), this feature introduces:

```
/
├── index.html          # Homepage HTML structure
├── styles.css          # Global stylesheet (homepage + future pages)
└── main.js             # Homepage interactivity (logo tracking, etc.)
```

Future pages will reuse `styles.css` and may extend `main.js` or add their own single JS file per feature.

## Out of Scope

- Blog listing/post functionality (separate feature: 002-blog)
- Project listing/detail pages (separate feature: 003-projects)
- About page content (separate feature: 004-about)
- Contact form functionality (separate feature: 005-contact)
- WebAssembly showcase demo (separate feature: 006-wasm-demo)

## Clarifications

### Session 2025-12-03

- Q: What hero descriptor copy should be used? → A: "I build things for the web and tinker with Linux."
- Q: What is the GitHub profile URL? → A: https://github.com/JPyke3
- Q: What colour palette should be used? → A: Portal/Aperture Science terminal aesthetic — amber/orange (#FF9900-#FFB000) on black, CRT scanlines. Easter egg for Portal fans.
- Q: What primary font should be used? → A: JetBrains Mono / Fira Code (monospace, developer-favourite)
- Q: What should the logo be? → A: Pixel art pike fish mascot (pun on "Pykee"), cute and approachable, 24x16 pixel grid, flat color
- Q: What is the primary brand name? → A: "Pykee" (not "Jacob Pyke")
- Q: What resolution for pixel art mascot? → A: 24x16 (wider aspect ratio, more fish-like shape)
- Q: Should fish have click interaction? → A: Yes, click-to-wiggle (brief bounce/shake animation)
- Q: Should page have scroll indicators? → A: Yes, both hero "scroll down" + footer "back to top"
- Q: What logo tracking style? → A: Whole-element float (entire fish moves toward cursor via CSS transform)

## Design Decisions (Resolved)

| Question | Decision | Rationale |
|----------|----------|-----------|
| Logo style | Pixel art pike fish mascot (flat color) | Pun on "Pykee", memorable, cute personality, works as favicon/avatar |
| Logo size | 24x16 pixel grid | Wider aspect ratio suits fish shape, minimal like Claude Code mascot |
| Logo tracking style | Whole-element float via CSS transform | More noticeable, playful movement; entire fish drifts toward cursor |
| Logo tracking intensity | Noticeable | Visitors should discover the effect within seconds as an easter egg |
| Logo click interaction | Wiggle/bounce animation | Playful feedback reinforces interactive easter egg nature |
| Primary brand name | "Pykee" | Personal brand, memorable, matches domain pyk.ee |
| Background style | Terminal scanlines | CRT aesthetic aligns with retro-tech workshop identity |
| Ambient animation | Minimal motion | Adds life without distraction; respects reduced-motion preference |
| Scroll indicators | Dual: hero "scroll down" + footer "back to top" | Guides users to below-fold content; easy return navigation |
| Hero descriptor | "I build things for the web and tinker with Linux." | Casual tone, covers both web dev and Linux identity |
| Colour palette | Portal/Aperture Science terminal — amber (#FF9900-#FFB000) on black (#000000) | Distinctive, nostalgic, easter egg for Portal fans, avoids all forbidden clichés |
| Font family | JetBrains Mono / Fira Code (monospace) | Reinforces terminal aesthetic, readable, developer-favourite, pairs with Portal look |

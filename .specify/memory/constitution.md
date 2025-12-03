<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: 1.0.1 → 1.1.0 (MINOR - new principle added)

Modified Principles: None

Added Sections:
- Article XI: Strict Version Control
  - Enforces atomic, descriptive, conventional commits
  - Defines commit prefix conventions (feat, fix, refactor, style, docs, chore)
  - Requires meaningful commit history that tells the project story

Removed Sections: None

Templates Requiring Updates:
- .specify/templates/plan-template.md ✅ (no changes needed)
- .specify/templates/spec-template.md ✅ (no changes needed)
- .specify/templates/tasks-template.md ✅ (no changes needed)

Follow-up TODOs: None
================================================================================
-->

# Pyk.ee Portfolio Constitution

A personal portfolio website for a software developer and Linux tinkerer, embodying a "playful workshop" aesthetic with minimalist principles.

## Core Principles

### Article I: Zero-Build Portability

The entire website MUST function by opening `index.html` directly in a browser with no build step, transpilation, or compilation required. WebAssembly showcase features (Article IX) are the sole exception to this rule.

**Requirements:**
- Deployment MUST be achievable via single-folder copy (rsync, drag-and-drop) to any static hosting provider
- No server-side logic permitted—pure static files only
- All HTML, CSS, and JavaScript MUST work without preprocessing
- No bundlers, transpilers, or build tools in the critical path

**Rationale:** Maximum portability ensures the site can be hosted anywhere, debugged easily, and maintained without toolchain rot. If it works in a browser from `file://`, it works everywhere.

### Article II: Minimal Dependency Gate

External libraries and dependencies are strongly discouraged and MUST only be introduced when they provide overwhelming, non-trivial value that cannot be reasonably achieved with vanilla JavaScript, HTML, and CSS.

**Requirements:**
- Dependencies for trivial operations are explicitly FORBIDDEN
- When a dependency is deemed necessary, it MUST be justified in writing within the plan document
- Justification MUST explain why vanilla implementation would be unreasonably complex

**Acceptable Exceptions:**
- WebAssembly toolchains (Rust/wasm-pack) for the flagship interactive demo
- Single-purpose micro-libraries where vanilla implementation would require 500+ lines of complex code

**Rationale:** Dependencies introduce maintenance burden, security risks, and bundle bloat. Vanilla code is debuggable, portable, and permanent.

### Article III: One-File-Per-Feature Rule

No new feature may introduce more than one new file of the same type. A feature MAY introduce one HTML file, one CSS file, and one JS file, but MUST NOT introduce two HTML files or two JS files.

**Requirements:**
- Feature additions MUST NOT create multiple files of the same type
- Shared/global files (e.g., site-wide stylesheet, utility JS file) are PERMITTED and encouraged for code reuse
- Each feature-specific file MUST have a single, clear purpose
- Logic MUST NOT be fragmented across many files of the same type

**Examples:**
- VALID: A feature adds `gallery.html`, `gallery.css`, and `gallery.js`
- VALID: A feature adds `contact.html` and reuses the global `styles.css`
- INVALID: A feature adds `blog-list.js` and `blog-item.js` (two JS files)

**Rationale:** This constraint forces intentional, cohesive feature design while allowing practical code organisation across HTML/CSS/JS boundaries. It prevents sprawling file structures where logic is fragmented across many files of the same type.

### Article IV: Never-Nesting Principle

All code MUST adhere to strict nesting limits. No code block shall be nested more than 3 layers deep.

**Applies To:**
- Conditional statements (if/else chains)
- Loops (for, while, forEach)
- Callback functions and promises
- DOM element hierarchies constructed in JavaScript

**Required Techniques:**
- Early returns and guard clauses MUST be used to flatten logic
- Function extraction MUST be used for complex nested operations
- Promise chains SHOULD use async/await to reduce nesting
- Complex conditionals MUST be extracted to named boolean variables

**Rationale:** Deeply nested code is unreadable, untestable, and error-prone. Code MUST be readable at a glance.

### Article V: Content-Data Separation

All dynamic content MUST be driven by data files. Adding new content MUST NEVER require editing HTML or JavaScript files.

**Requirements:**
- Blog posts MUST be stored as Markdown files
- Project listings and structured data MUST be stored as JSON files
- The site architecture MUST load and render content from data files at runtime
- Content updates MUST require only data file changes

**File Types:**
- `.md` for prose content (blog posts, about text)
- `.json` for structured data (project metadata, navigation, configuration)

**Rationale:** Separating content from presentation enables non-technical content updates, cleaner version control diffs, and a maintainable architecture.

### Article VI: Modern Pixel Art Aesthetic

The site's visual identity MUST blend modern, clean web design with pixel art elements to create a "tinkerer's workshop" feel.

**Mandatory Elements:**
1. **Pixel Art Mascot**: The site logo MUST be a pixel art pike fish mascot ("Pykee" — a pun on the brand name). The mascot MUST be cute and approachable (friendly mascot vibes), sized for 32x32 or 64x64 pixel grid, and usable as both favicon and profile picture
2. **Pixel Art Restraint**: Pixel art decorative elements are permitted but LIMITED to one per page maximum (the mascot counts as this element on the homepage)
3. **Dark Mode Default**: The site MUST load in dark mode by default (light mode toggle is optional)

**Explicitly Forbidden:**
- Overused font families as primary fonts: Inter, Roboto, Arial, system-ui
- Clichéd colour schemes: purple gradients on white, generic blue CTAs
- Cookie-cutter component patterns (Bootstrap/Tailwind defaults)
- Generic "AI-generated" aesthetics

**Rationale:** The visual identity MUST be distinctive and intentional. Every design choice MUST serve the personal, handcrafted workshop identity rather than following trends.

### Article VII: Anti-Corporate Voice

All written content MUST maintain a casual, authentic, Australian-friendly tone.

**Forbidden:**
- Corporate jargon and buzzwords ("leverage", "synergy", "enterprise-grade")
- Marketing-speak and hyperbole ("revolutionary", "cutting-edge", "world-class")
- Formal or stiff language
- Excessive verbosity

**Required:**
- Plain, direct language
- Personality and humour where appropriate
- Brevity over verbosity
- First-person voice reflecting the actual author

**Rationale:** The site represents a real person who loves open source and speaks plainly. Authenticity builds trust; corporate speak destroys it.

### Article VIII: Desktop-First, Mobile-Functional

Design primarily for desktop viewports, but all features MUST remain fully functional on mobile devices.

**Requirements:**
- Desktop experience takes priority in design decisions
- Responsive breakpoints are REQUIRED
- No feature may be desktop-only—all functionality MUST work on mobile
- Touch targets MUST be appropriately sized on mobile
- Content MUST be readable without horizontal scrolling on mobile

**Rationale:** The target audience (developers, tech enthusiasts) primarily browses on desktop, but mobile functionality ensures universal access.

### Article IX: WebAssembly Showcase Provision

The site MUST include one flagship interactive demo built with WebAssembly to demonstrate technical capability.

**Requirements:**
- Exactly ONE WebAssembly demo as a showcase piece
- The demo MUST provide a memorable, interactive experience
- The demo concept MUST be defined during the specification phase

**Exception to Article I:**
- The WASM component MAY have its own build toolchain (Rust/wasm-pack)
- Build artifacts MUST be committed to the repository for zero-build deployment
- The build process MUST be documented and reproducible

**Rationale:** A WASM showcase demonstrates real technical capability and provides a "wow moment" that differentiates from typical portfolio sites.

### Article X: Simplicity Gate

Complexity MUST be justified. The simplest possible solution MUST be attempted first.

**Constitutional Violations:**
- Over-engineering for hypothetical future requirements
- Premature abstraction ("just in case" patterns)
- Adding configurability that isn't immediately needed
- Using frameworks when vanilla code suffices

**Required Process:**
1. Attempt the simplest vanilla HTML/CSS/JS solution first
2. If vanilla is insufficient, document WHY in the plan
3. Only then may a more complex solution be considered

**Rationale:** Complexity is the enemy of maintainability. Every abstraction has a cost. Simple code is debuggable code.

### Article XI: Strict Version Control

All code changes MUST be version controlled with Git. Commits MUST follow strict quality standards.

**Commit Requirements:**

1. **Atomic**: Each commit represents ONE logical change (not a dump of multiple unrelated changes)
2. **Descriptive**: Commit messages MUST clearly explain *what* changed and *why*, not just "fixed bug" or "updated code"
3. **Conventional**: Follow a consistent commit message format using standard prefixes

**Commit Prefixes:**
- `feat:` — new feature or functionality
- `fix:` — bug fix
- `refactor:` — code restructuring without behaviour change
- `style:` — formatting, CSS changes, no logic change
- `docs:` — documentation only
- `chore:` — maintenance tasks, dependencies

**Examples:**
- VALID: `feat: add mouse-tracking to ASCII logo`
- VALID: `fix: resolve mobile nav overflow on small screens`
- VALID: `refactor: extract scanline animation to separate function`
- INVALID: `updated code`
- INVALID: `fixes`
- INVALID: `WIP`

**Large Feature Guidance:**
- Large features SHOULD be broken into multiple meaningful commits
- The git history MUST tell the story of how the project evolved
- Squashing into a single "add homepage" commit is discouraged

**Rationale:** A clean git history is documentation. Future maintainers (including future you) deserve to understand why changes were made, not just what changed.

## Amendment Process

These articles may ONLY be amended when a genuine, documented blocker is encountered that cannot be resolved within constitutional bounds.

**Amendment Requirements:**
1. Document the specific blocker encountered
2. Explain why it cannot be resolved within current constitutional bounds
3. Propose the minimum amendment necessary to unblock progress
4. Record the amendment with rationale in this document
5. Increment the constitution version appropriately

**Version Semantics:**
- MAJOR: Principle removal, fundamental redefinition, or backward-incompatible governance change
- MINOR: New principle added, existing principle materially expanded
- PATCH: Clarifications, wording improvements, non-semantic refinements

## Governance

This constitution supersedes all other development practices for the Pyk.ee portfolio project.

**Compliance Requirements:**
- All feature specifications MUST reference applicable constitutional articles
- All implementation plans MUST include a Constitution Check section
- All code reviews MUST verify constitutional compliance
- Constitutional violations MUST be justified in the Complexity Tracking section of the plan

**Enforcement:**
- Features violating the constitution without documented justification MUST be rejected
- Unjustified complexity MUST be refactored before merge
- Dependencies added without plan-documented justification MUST be removed

**Version**: 1.2.0 | **Ratified**: 2025-12-03 | **Last Amended**: 2025-12-03

# Quickstart: Projects Page Implementation

**Feature**: 004-projects-page
**Date**: 2025-12-03

## Overview

Build a Projects page that showcases curated GitHub projects with live stats, category filtering, and expandable cards. Follows existing site patterns (terminal aesthetic, IIFE modules, vanilla JS).

## Prerequisites

- Local HTTP server for testing (blog pattern)
- Understanding of existing JS patterns in `about-contact.js`
- Familiarity with GitHub REST API (no auth required)

## Files to Create

```
projects/index.html      # Page structure
css/projects.css         # Styling
js/projects.js           # Functionality
content/projects.json    # Project data
```

## Implementation Order

### Step 1: Project Data (content/projects.json)

Create the JSON file with all project data. See [data-model.md](./data-model.md) for complete schema.

```json
{
  "projects": [
    {
      "id": "mbp-manjaro",
      "name": "mbp-manjaro",
      "tagline": "Manjaro Linux for T2 MacBooks",
      "description": "ISO build scripts for...",
      "category": "linux",
      "github_url": "https://github.com/JPyke3/mbp-manjaro",
      "github_owner": "JPyke3",
      "github_repo": "mbp-manjaro",
      "featured": true,
      "language": "Shell",
      "fallback_stars": 61,
      "fallback_forks": 10
    }
  ]
}
```

### Step 2: HTML Structure (projects/index.html)

Copy structure from `about/index.html` and adapt:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Open-source projects by Pykee...">
  <title>Projects - pyk.ee</title>
  <link rel="stylesheet" href="/css/projects.css">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>

  <header class="site-header">
    <nav class="main-nav" role="navigation" aria-label="Main">
      <ul class="nav-list">
        <li><a href="/" class="nav-link">Home</a></li>
        <li><a href="/projects" class="nav-link" aria-current="page">Projects</a></li>
        <li><a href="/blog" class="nav-link">Blog</a></li>
        <li><a href="/about" class="nav-link">About</a></li>
        <li><a href="/contact" class="nav-link">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main id="main" class="main-content">
    <div class="container">
      <h1 class="page-title"><span class="typewriter-title">> ls ~/projects</span></h1>

      <!-- Filter bar -->
      <div class="filter-bar" role="tablist" aria-label="Filter projects">
        <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true">> ./filter --all</button>
        <button class="filter-btn" data-filter="linux" role="tab" aria-selected="false">> ./filter --linux</button>
        <button class="filter-btn" data-filter="web" role="tab" aria-selected="false">> ./filter --web</button>
        <button class="filter-btn" data-filter="tools" role="tab" aria-selected="false">> ./filter --tools</button>
        <button class="filter-btn" data-filter="learning" role="tab" aria-selected="false">> ./filter --learning</button>
      </div>

      <!-- Search input -->
      <div class="search-container">
        <label for="project-search" class="search-label">> grep -i "</label>
        <input type="text" id="project-search" class="search-input" placeholder="search term" aria-label="Search projects">
        <span class="search-suffix">" ~/projects/*</span>
      </div>

      <!-- Featured section -->
      <section class="project-section" aria-labelledby="featured-heading">
        <h2 id="featured-heading" class="section-heading">## Featured</h2>
        <div class="project-grid project-grid--featured" id="featured-grid">
          <!-- JS will populate -->
        </div>
      </section>

      <!-- All projects -->
      <section class="project-section" aria-labelledby="projects-heading">
        <h2 id="projects-heading" class="section-heading">## More Projects</h2>
        <div class="project-grid" id="projects-grid">
          <!-- JS will populate -->
        </div>
        <button class="show-more-btn" id="show-more" hidden>Show more</button>
      </section>

      <!-- Empty state -->
      <div class="empty-state" id="empty-state" hidden>
        <p>> No projects match your filter. Try a different category.</p>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <p class="glados-quote" aria-label="Portal reference"></p>
  </footer>

  <!-- Screen reader announcements -->
  <div id="sr-announcer" class="sr-only" aria-live="polite"></div>

  <script src="/js/projects.js" defer></script>
</body>
</html>
```

### Step 3: CSS (css/projects.css)

Copy `:root` variables and base styles from `about-contact.css`, then add:

```css
/* Project Grid */
.project-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Project Card */
.project-card {
  border: 1px solid var(--color-amber-dim);
  background: rgba(255, 153, 0, 0.03);
  padding: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.project-card:hover {
  border-color: var(--color-amber);
  box-shadow: 0 0 20px rgba(255, 153, 0, 0.1);
}

.project-card--featured {
  box-shadow: 0 0 30px rgba(255, 153, 0, 0.15);
  border-color: var(--color-amber);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-sm);
}

.card-name {
  font-size: var(--font-size-lg);
  color: var(--color-amber-light);
  margin: 0;
}

.card-stats {
  display: flex;
  gap: var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--color-amber-dim);
}

/* Expandable Content */
.card-expanded-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.project-card.expanded .card-expanded-content {
  max-height: 500px;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.filter-btn {
  background: transparent;
  border: 1px solid var(--color-amber-dim);
  color: var(--color-amber);
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn.active {
  background: rgba(255, 153, 0, 0.1);
  border-color: var(--color-amber);
  color: var(--color-amber-light);
}
```

### Step 4: JavaScript (js/projects.js)

Follow IIFE pattern from `about-contact.js`:

```javascript
(function() {
  'use strict';

  var CONFIG = {
    cache: { ttl: 3600000 },      // 1 hour
    api: { timeout: 3000 },        // 3 seconds
    initialVisible: 6
  };

  var state = {
    projects: [],
    activeFilter: 'all',
    searchTerm: '',
    expandedCard: null,
    reducedMotion: false
  };

  var dom = {};

  // --- Initialization ---

  function init() {
    checkReducedMotion();
    cacheDomElements();
    loadProjects();
    setupEventListeners();
    parseUrlHash();
  }

  function cacheDomElements() {
    dom.featuredGrid = document.getElementById('featured-grid');
    dom.projectsGrid = document.getElementById('projects-grid');
    dom.filterBtns = document.querySelectorAll('.filter-btn');
    dom.searchInput = document.getElementById('project-search');
    dom.showMoreBtn = document.getElementById('show-more');
    dom.emptyState = document.getElementById('empty-state');
  }

  // --- Data Loading ---

  function loadProjects() {
    fetch('/content/projects.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        state.projects = data.projects;
        renderProjects();
        fetchAllGitHubStats();
      })
      .catch(function(err) {
        console.error('Failed to load projects:', err);
      });
  }

  // --- Rendering ---

  function renderProjects() {
    var featured = state.projects.filter(function(p) { return p.featured; });
    var regular = state.projects.filter(function(p) { return !p.featured && !p.hidden; });

    dom.featuredGrid.innerHTML = featured.map(renderCard).join('');
    dom.projectsGrid.innerHTML = regular.map(renderCard).join('');

    applyFilter();
  }

  function renderCard(project) {
    var stats = state.stats && state.stats[project.id];
    var stars = stats ? stats.stars : project.fallback_stars || '-';
    var forks = stats ? stats.forks : project.fallback_forks || '-';

    return '<article class="project-card' + (project.featured ? ' project-card--featured' : '') + '" ' +
      'data-id="' + project.id + '" data-category="' + project.category + '" ' +
      'tabindex="0" role="button" aria-expanded="false">' +
      '<div class="card-header">' +
        '<h3 class="card-name">' + project.name + '</h3>' +
        '<div class="card-stats">' +
          '<span class="stat-stars">★ ' + stars + '</span>' +
          '<span class="stat-forks">⑂ ' + forks + '</span>' +
        '</div>' +
      '</div>' +
      '<p class="card-tagline">' + project.tagline + '</p>' +
      '<span class="card-category">[' + project.category + ']</span>' +
      '<div class="card-expanded-content">' +
        '<p class="card-description">' + project.description + '</p>' +
        '<a href="' + project.github_url + '" target="_blank" rel="noopener noreferrer" class="card-link">' +
          '> git clone ' + project.github_url +
        '</a>' +
      '</div>' +
    '</article>';
  }

  // Continue with filter, expand, GitHub fetch functions...

  // --- DOM Ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

## Key Patterns to Follow

### From about-contact.js

1. **Reduced Motion Check**:
```javascript
function checkReducedMotion() {
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  state.reducedMotion = mq.matches;
  mq.addEventListener('change', function(e) {
    state.reducedMotion = e.matches;
  });
}
```

2. **Typewriter Effect**: Copy the `typewriter()` function

3. **Toast Notifications**: Copy the `showToast()` function

4. **GLaDOS Quotes**: Copy the `PORTAL_QUOTES` array and `displayGladosQuote()`

### GitHub API Caching

```javascript
function getCachedStats(owner, repo) {
  var key = 'pykee_github_' + owner + '_' + repo;
  var cached = localStorage.getItem(key);
  if (!cached) return null;

  var data = JSON.parse(cached);
  if (Date.now() - data.timestamp > CONFIG.cache.ttl) return null;

  return data;
}

function setCachedStats(owner, repo, stats) {
  var key = 'pykee_github_' + owner + '_' + repo;
  stats.timestamp = Date.now();
  localStorage.setItem(key, JSON.stringify(stats));
}
```

## Testing Checklist

- [ ] Page loads at `http://localhost:8000/projects`
- [ ] Projects render from JSON
- [ ] Filter buttons work
- [ ] Search filters projects
- [ ] Cards expand/collapse
- [ ] GitHub stats load and cache
- [ ] Works with JS disabled (static HTML visible)
- [ ] Keyboard navigation works
- [ ] Mobile responsive
- [ ] Lighthouse accessibility ≥ 90

## Reference Files

- **Pattern reference**: `js/about-contact.js`, `css/about-contact.css`
- **HTML template**: `about/index.html`
- **API contract**: `specs/004-projects-page/contracts/github-api.md`
- **Data model**: `specs/004-projects-page/data-model.md`

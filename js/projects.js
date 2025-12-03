/* ==========================================================================
   pyk.ee Projects Page JavaScript
   Project cards, filtering, GitHub API stats, easter eggs
   ========================================================================== */

(function() {
  'use strict';

  /* --------------------------------------------------------------------------
     Configuration
     -------------------------------------------------------------------------- */

  var CONFIG = {
    typewriter: {
      charDelay: 50,
      cursorChar: '█'
    },
    toast: {
      duration: 2000
    },
    cache: {
      ttl: 3600000,              // 1 hour in milliseconds
      prefix: 'pykee_github_'
    },
    api: {
      timeout: 3000,             // 3 seconds
      baseUrl: 'https://api.github.com/repos'
    },
    animation: {
      duration: 300
    },
    initialVisible: 6
  };

  /* --------------------------------------------------------------------------
     Portal Quotes
     -------------------------------------------------------------------------- */

  var PORTAL_QUOTES = [
    { text: "The cake is a lie.", attribution: "— GLaDOS" },
    { text: "This was a triumph.", attribution: "— GLaDOS" },
    { text: "I'm not even angry. I'm being so sincere right now.", attribution: "— GLaDOS" },
    { text: "Speedy thing goes in, speedy thing comes out.", attribution: "— GLaDOS" },
    { text: "For science. You monster.", attribution: "— GLaDOS" },
    { text: "Remember before when I was talking about smelly garbage standing around being useless? That was a metaphor. I was actually talking about you.", attribution: "— GLaDOS" },
    { text: "I think that one was about to say 'I love you.'", attribution: "— GLaDOS" },
    { text: " ", attribution: "— Chell" },
    { text: "I am NOT! A MORON!", attribution: "— Wheatley" },
    { text: "A...A...A...A...A... Umm... A.", attribution: "— Wheatley" },
    { text: "Target acquired.", attribution: "— Turret" }
  ];

  /* --------------------------------------------------------------------------
     Konami Code Sequence
     -------------------------------------------------------------------------- */

  var KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  /* --------------------------------------------------------------------------
     State
     -------------------------------------------------------------------------- */

  var state = {
    projects: [],
    activeFilter: 'all',
    searchTerm: '',
    expandedCard: null,
    visibleCount: 6,
    reducedMotion: false,
    toastTimeout: null,
    konamiIndex: 0,
    testChamberCount: 0,
    companionCubeRevealed: false
  };

  /* --------------------------------------------------------------------------
     DOM Cache
     -------------------------------------------------------------------------- */

  var dom = {
    featuredGrid: null,
    projectsGrid: null,
    filterBtns: null,
    searchInput: null,
    showMoreBtn: null,
    emptyState: null,
    gladosQuote: null,
    srAnnouncer: null,
    typewriterTitle: null
  };

  /* --------------------------------------------------------------------------
     Reduced Motion Detection
     -------------------------------------------------------------------------- */

  function checkReducedMotion() {
    var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    state.reducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', function(e) {
      state.reducedMotion = e.matches;
    });
  }

  /* --------------------------------------------------------------------------
     DOM Caching
     -------------------------------------------------------------------------- */

  function cacheDomElements() {
    dom.featuredGrid = document.getElementById('featured-grid');
    dom.projectsGrid = document.getElementById('projects-grid');
    dom.filterBtns = document.querySelectorAll('.filter-btn');
    dom.searchInput = document.getElementById('project-search');
    dom.showMoreBtn = document.getElementById('show-more');
    dom.emptyState = document.getElementById('empty-state');
    dom.gladosQuote = document.querySelector('.glados-quote');
    dom.srAnnouncer = document.getElementById('sr-announcer');
    dom.typewriterTitle = document.querySelector('.typewriter-title');
  }

  /* --------------------------------------------------------------------------
     Typewriter Effect
     -------------------------------------------------------------------------- */

  function typewriter(element) {
    if (!element) {
      return;
    }

    var text = element.textContent;
    element.innerHTML = '';

    // Create spans for each character
    var chars = text.split('');
    for (var i = 0; i < chars.length; i++) {
      var span = document.createElement('span');
      span.textContent = chars[i];
      span.style.transitionDelay = (i * CONFIG.typewriter.charDelay) + 'ms';
      element.appendChild(span);
    }

    // Add cursor
    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = CONFIG.typewriter.cursorChar;
    cursor.setAttribute('aria-hidden', 'true');
    element.appendChild(cursor);

    // Trigger animation (skip if reduced motion)
    if (state.reducedMotion) {
      element.classList.add('typing-complete');
      return;
    }

    // Force reflow then add class to trigger transitions
    element.offsetHeight;
    setTimeout(function() {
      element.classList.add('typing-complete');
    }, 10);
  }

  /* --------------------------------------------------------------------------
     GLaDOS Quote
     -------------------------------------------------------------------------- */

  function displayGladosQuote() {
    if (!dom.gladosQuote) {
      return;
    }

    var randomIndex = Math.floor(Math.random() * PORTAL_QUOTES.length);
    var quote = PORTAL_QUOTES[randomIndex];

    dom.gladosQuote.innerHTML = '<span class="glados-quote-text">' + quote.text + '</span>' +
      '<span class="glados-attribution">' + quote.attribution + '</span>';
  }

  function rotateGladosQuote() {
    displayGladosQuote();
  }

  /* --------------------------------------------------------------------------
     Toast Notification
     -------------------------------------------------------------------------- */

  function showToast(message) {
    if (state.toastTimeout) {
      clearTimeout(state.toastTimeout);
    }

    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = '<span class="toast-prefix">[ok]</span> ' +
      message.replace('[ok] ', '');

    toast.offsetHeight;
    toast.classList.add('visible');

    state.toastTimeout = setTimeout(function() {
      toast.classList.remove('visible');
    }, CONFIG.toast.duration);
  }

  /* --------------------------------------------------------------------------
     Screen Reader Announcements
     -------------------------------------------------------------------------- */

  function announceToScreenReader(message) {
    if (!dom.srAnnouncer) {
      return;
    }

    dom.srAnnouncer.textContent = message;
  }

  /* --------------------------------------------------------------------------
     Data Loading
     -------------------------------------------------------------------------- */

  function loadProjects() {
    fetch('/content/projects.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        state.projects = data.projects;
        renderProjects();
        fetchAllStats(state.projects);
      })
      .catch(function(err) {
        console.error('Failed to load projects:', err);
      });
  }

  /* --------------------------------------------------------------------------
     Rendering
     -------------------------------------------------------------------------- */

  function renderProjects() {
    var featured = state.projects.filter(function(p) {
      return p.featured;
    });
    var regular = state.projects.filter(function(p) {
      return !p.featured && !p.hidden;
    });

    if (dom.featuredGrid) {
      dom.featuredGrid.innerHTML = featured.map(renderCard).join('');
    }
    if (dom.projectsGrid) {
      dom.projectsGrid.innerHTML = regular.map(renderCard).join('');
    }

    setupCardListeners();
    applyFilter(state.activeFilter);
  }

  function renderCard(project) {
    var stars = project.fallback_stars || 0;
    var forks = project.fallback_forks || 0;

    var featuredClass = project.featured ? ' project-card--featured' : '';
    var languageIcon = getLanguageIcon(project.language_icon || project.language);

    return '<article class="project-card' + featuredClass + '" ' +
      'data-id="' + project.id + '" ' +
      'data-category="' + project.category + '" ' +
      'tabindex="0" ' +
      'role="button" ' +
      'aria-expanded="false">' +
      '<div class="card-header">' +
        '<h3 class="card-name">' + escapeHtml(project.name) + '</h3>' +
        '<div class="card-stats">' +
          '<span class="stat-stars" data-stat="stars">★ <span class="stat-value">' + stars + '</span></span>' +
          '<span class="stat-forks" data-stat="forks">⑂ <span class="stat-value">' + forks + '</span></span>' +
        '</div>' +
      '</div>' +
      '<p class="card-tagline">' + escapeHtml(project.tagline) + '</p>' +
      '<div class="card-meta">' +
        '<span class="card-language">' + languageIcon + ' ' + escapeHtml(project.language) + '</span>' +
        '<span class="card-category">[' + escapeHtml(project.category) + ']</span>' +
      '</div>' +
      '<div class="card-expanded-content">' +
        '<p class="card-description">' + escapeHtml(project.description) + '</p>' +
        renderTags(project.tags) +
        '<a href="' + escapeHtml(project.github_url) + '" ' +
          'target="_blank" ' +
          'rel="noopener noreferrer" ' +
          'class="card-link" ' +
          'onclick="event.stopPropagation()">' +
          escapeHtml(project.github_url) +
        '</a>' +
        (project.demo_url ? '<a href="' + escapeHtml(project.demo_url) + '" ' +
          'target="_blank" ' +
          'rel="noopener noreferrer" ' +
          'class="card-link card-link--demo" ' +
          'onclick="event.stopPropagation()">' +
          escapeHtml(project.demo_url) +
        '</a>' : '') +
      '</div>' +
    '</article>';
  }

  function renderTags(tags) {
    if (!tags || !tags.length) {
      return '';
    }

    var tagHtml = tags.map(function(tag) {
      return '<span class="tag">[' + escapeHtml(tag) + ']</span>';
    }).join('');

    return '<div class="card-tags">' + tagHtml + '</div>';
  }

  function getLanguageIcon(language) {
    var icons = {
      'shell': '',
      'javascript': '',
      'lua': '',
      'dart': '',
      'devicetree': '',
      'keyboard': ''
    };

    var key = (language || '').toLowerCase();
    return icons[key] || '';
  }

  function escapeHtml(str) {
    if (!str) {
      return '';
    }
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* --------------------------------------------------------------------------
     Card Interactions
     -------------------------------------------------------------------------- */

  function setupCardListeners() {
    var cards = document.querySelectorAll('.project-card');

    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        toggleCardExpand(card);
      });

      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCardExpand(card);
        }
        if (e.key === 'Escape' && card.classList.contains('expanded')) {
          collapseCard(card);
        }
      });
    });
  }

  function toggleCardExpand(card) {
    var isExpanded = card.classList.contains('expanded');

    // Collapse any previously expanded card
    if (state.expandedCard && state.expandedCard !== card) {
      collapseCard(state.expandedCard);
    }

    if (isExpanded) {
      collapseCard(card);
    } else {
      expandCard(card);
    }
  }

  function expandCard(card) {
    card.classList.add('expanded');
    card.setAttribute('aria-expanded', 'true');
    state.expandedCard = card;

    // Increment test chamber counter
    incrementTestChamber();

    // Focus the expanded content for accessibility
    var expandedContent = card.querySelector('.card-expanded-content');
    if (expandedContent) {
      expandedContent.setAttribute('tabindex', '-1');
    }
  }

  function collapseCard(card) {
    card.classList.remove('expanded');
    card.setAttribute('aria-expanded', 'false');

    if (state.expandedCard === card) {
      state.expandedCard = null;
    }
  }

  /* --------------------------------------------------------------------------
     Filtering
     -------------------------------------------------------------------------- */

  function applyFilter(category) {
    state.activeFilter = category || 'all';
    var cards = document.querySelectorAll('.project-card');
    var visibleCount = 0;

    cards.forEach(function(card) {
      var cardCategory = card.getAttribute('data-category');
      var matchesFilter = state.activeFilter === 'all' || cardCategory === state.activeFilter;

      if (matchesFilter) {
        card.classList.remove('filtered-out');
        visibleCount++;
      } else {
        card.classList.add('filtered-out');
      }
    });

    updateFilterButtons(state.activeFilter);
    updateEmptyState(visibleCount === 0);
    announceToScreenReader('Showing ' + visibleCount + ' project' + (visibleCount !== 1 ? 's' : ''));

    // Rotate GLaDOS quote on filter change
    rotateGladosQuote();
  }

  function updateFilterButtons(activeCategory) {
    dom.filterBtns.forEach(function(btn) {
      var btnCategory = btn.getAttribute('data-filter');
      var isActive = btnCategory === activeCategory;

      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function updateEmptyState(isEmpty) {
    if (dom.emptyState) {
      dom.emptyState.hidden = !isEmpty;
    }
  }

  function setupFilterListeners() {
    dom.filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var category = btn.getAttribute('data-filter');
        applyFilter(category);
        updateUrlHash(category);
      });

      btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var category = btn.getAttribute('data-filter');
          applyFilter(category);
          updateUrlHash(category);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     URL Hash Routing
     -------------------------------------------------------------------------- */

  function parseUrlHash() {
    var hash = window.location.hash.slice(1);
    if (hash && ['all', 'linux', 'web', 'tools', 'learning'].indexOf(hash) !== -1) {
      applyFilter(hash);
    }
  }

  function updateUrlHash(category) {
    if (category === 'all') {
      history.replaceState(null, '', window.location.pathname);
    } else {
      history.replaceState(null, '', '#' + category);
    }
  }

  function setupHashListener() {
    window.addEventListener('hashchange', function() {
      parseUrlHash();
    });
  }

  /* --------------------------------------------------------------------------
     GitHub API Integration
     -------------------------------------------------------------------------- */

  function getCachedStats(owner, repo) {
    var key = CONFIG.cache.prefix + owner + '_' + repo;
    var cached = localStorage.getItem(key);

    if (!cached) {
      return null;
    }

    try {
      var data = JSON.parse(cached);
      if (Date.now() - data.timestamp > CONFIG.cache.ttl) {
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function setCachedStats(owner, repo, stats) {
    var key = CONFIG.cache.prefix + owner + '_' + repo;
    stats.timestamp = Date.now();

    try {
      localStorage.setItem(key, JSON.stringify(stats));
    } catch (e) {
      // localStorage might be full or disabled
    }
  }

  function fetchWithTimeout(url, options, timeout) {
    return Promise.race([
      fetch(url, options),
      new Promise(function(_, reject) {
        setTimeout(function() {
          reject(new Error('Request timeout'));
        }, timeout);
      })
    ]);
  }

  function fetchGitHubStats(owner, repo) {
    var url = CONFIG.api.baseUrl + '/' + owner + '/' + repo;

    return fetchWithTimeout(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    }, CONFIG.api.timeout)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('GitHub API error: ' + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        return {
          stars: data.stargazers_count,
          forks: data.forks_count
        };
      });
  }

  function fetchAllStats(projects) {
    projects.forEach(function(project) {
      if (!project.github_owner || !project.github_repo) {
        return;
      }

      var cached = getCachedStats(project.github_owner, project.github_repo);
      if (cached) {
        updateCardStats(project.id, cached);
        return;
      }

      fetchGitHubStats(project.github_owner, project.github_repo)
        .then(function(stats) {
          setCachedStats(project.github_owner, project.github_repo, stats);
          updateCardStats(project.id, stats);
        })
        .catch(function() {
          // Silently fail - fallback stats are already displayed
        });
    });
  }

  function updateCardStats(projectId, stats) {
    var card = document.querySelector('[data-id="' + projectId + '"]');
    if (!card) {
      return;
    }

    var starsEl = card.querySelector('[data-stat="stars"] .stat-value');
    var forksEl = card.querySelector('[data-stat="forks"] .stat-value');

    if (starsEl && stats.stars !== undefined) {
      starsEl.textContent = stats.stars;
      starsEl.classList.remove('stat-loading');
    }
    if (forksEl && stats.forks !== undefined) {
      forksEl.textContent = stats.forks;
      forksEl.classList.remove('stat-loading');
    }
  }

  /* --------------------------------------------------------------------------
     Easter Eggs
     -------------------------------------------------------------------------- */

  function incrementTestChamber() {
    state.testChamberCount++;

    try {
      localStorage.setItem('pykee_chamber_count', state.testChamberCount);
    } catch (e) {
      // Ignore
    }

    console.log('Test subject has examined ' + state.testChamberCount + ' specimen' + (state.testChamberCount !== 1 ? 's' : ''));
  }

  function loadTestChamberCount() {
    try {
      var count = localStorage.getItem('pykee_chamber_count');
      if (count) {
        state.testChamberCount = parseInt(count, 10) || 0;
      }
    } catch (e) {
      // Ignore
    }
  }

  function setupKonamiCode() {
    document.addEventListener('keydown', function(e) {
      if (state.companionCubeRevealed) {
        return;
      }

      var expected = KONAMI_CODE[state.konamiIndex];

      if (e.code === expected) {
        state.konamiIndex++;

        if (state.konamiIndex === KONAMI_CODE.length) {
          revealCompanionCube();
          state.konamiIndex = 0;
        }
      } else {
        state.konamiIndex = 0;
      }
    });
  }

  function revealCompanionCube() {
    state.companionCubeRevealed = true;

    // Add companion cube project to state
    var companionCube = {
      id: 'companion-cube',
      name: 'Companion Cube',
      tagline: 'The Enrichment Center reminds you that the Weighted Companion Cube will never threaten to stab you.',
      description: 'The Weighted Companion Cube is a recurring element in the Portal series. It\'s a testing element designed to aid test subjects in solving puzzles. Despite its silence and inanimate nature, test subjects tend to form emotional bonds with it.',
      category: 'learning',
      github_url: 'https://theportalwiki.com/wiki/Weighted_Companion_Cube',
      featured: false,
      language: 'Love',
      language_icon: '♥',
      tags: ['aperture', 'companion', 'cube', 'love'],
      fallback_stars: 9999,
      fallback_forks: 0,
      hidden: false
    };

    state.projects.push(companionCube);
    renderProjects();

    showToast('The Companion Cube has been added to your collection');
    announceToScreenReader('Secret unlocked: The Companion Cube project has been revealed');

    console.log('🎮 Achievement Unlocked: The Companion Cube');
    console.log('Thank you for assuming the party escort submission position.');
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */

  function init() {
    checkReducedMotion();
    cacheDomElements();
    loadTestChamberCount();
    loadProjects();
    setupFilterListeners();
    setupHashListener();
    setupKonamiCode();
    parseUrlHash();

    // Typewriter effect on page title
    if (dom.typewriterTitle) {
      typewriter(dom.typewriterTitle);
    }

    // GLaDOS quote
    displayGladosQuote();
  }

  /* --------------------------------------------------------------------------
     DOM Ready
     -------------------------------------------------------------------------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

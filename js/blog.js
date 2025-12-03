/* ==========================================================================
   pyk.ee Blog JavaScript
   Client-side Markdown blog with hash-based routing
   ========================================================================== */

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // Configuration
  // --------------------------------------------------------------------------

  var CONFIG = {
    postsPath: '../content/posts/',
    indexFile: 'index.json',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric' }
  };

  // --------------------------------------------------------------------------
  // File Protocol Detection
  // --------------------------------------------------------------------------

  function isFileProtocol() {
    return window.location.protocol === 'file:';
  }

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  var state = {
    index: [],
    posts: {},
    currentView: 'index',
    currentSlug: null,
    isLoading: false,
    error: null
  };

  // --------------------------------------------------------------------------
  // DOM References
  // --------------------------------------------------------------------------

  var dom = {
    indexView: null,
    postView: null,
    loadingView: null,
    errorView: null,
    postList: null,
    postTitle: null,
    postDate: null,
    postTags: null,
    postContent: null,
    errorMessage: null,
    scrollIndicator: null
  };

  // --------------------------------------------------------------------------
  // Utilities
  // --------------------------------------------------------------------------

  function parseFrontmatter(fileContent) {
    var parts = fileContent.split('---');

    if (parts.length < 3) {
      return null;
    }

    var meta = {};
    var lines = parts[1].trim().split('\n');

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var colonIndex = line.indexOf(':');

      if (colonIndex === -1) continue;

      var key = line.substring(0, colonIndex).trim().toLowerCase();
      var value = line.substring(colonIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      meta[key] = value;
    }

    // Parse tags from comma-separated string to array
    if (meta.tags) {
      meta.tags = meta.tags.split(',').map(function(tag) {
        return tag.trim();
      }).filter(function(tag) {
        return tag.length > 0;
      });
    } else {
      meta.tags = [];
    }

    return {
      meta: meta,
      content: parts.slice(2).join('---').trim()
    };
  }

  function formatDate(dateString) {
    var date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', CONFIG.dateFormat);
  }

  function isValidDate(dateString) {
    var date = new Date(dateString + 'T00:00:00');
    return !isNaN(date.getTime());
  }

  function isFutureDate(dateString) {
    var postDate = new Date(dateString + 'T00:00:00');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return postDate > today;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --------------------------------------------------------------------------
  // Data Fetching
  // --------------------------------------------------------------------------

  function fetchIndex() {
    return fetch(CONFIG.postsPath + CONFIG.indexFile)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to load post index');
        }
        return response.json();
      });
  }

  function fetchPost(slug) {
    // Check cache first
    if (state.posts[slug]) {
      return Promise.resolve(state.posts[slug]);
    }

    return fetch(CONFIG.postsPath + slug + '.md')
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Post not found');
        }
        return response.text();
      })
      .then(function(content) {
        var parsed = parseFrontmatter(content);
        if (!parsed || !parsed.meta.title || !parsed.meta.date) {
          throw new Error('Invalid post format');
        }

        var post = {
          slug: slug,
          title: parsed.meta.title,
          date: parsed.meta.date,
          tags: parsed.meta.tags,
          content: parsed.content,
          html: null
        };

        // Cache the post
        state.posts[slug] = post;
        return post;
      });
  }

  function fetchAllPosts() {
    var promises = state.index.map(function(slug) {
      return fetchPost(slug).catch(function(err) {
        console.warn('Failed to load post:', slug, err);
        return null;
      });
    });

    return Promise.all(promises).then(function(posts) {
      return posts.filter(function(post) {
        return post !== null;
      });
    });
  }

  // --------------------------------------------------------------------------
  // Filtering and Sorting
  // --------------------------------------------------------------------------

  function filterAndSortPosts(posts) {
    return posts
      .filter(function(post) {
        // Skip posts with future dates
        if (isFutureDate(post.date)) {
          return false;
        }
        // Skip posts with invalid dates
        if (!isValidDate(post.date)) {
          return false;
        }
        return true;
      })
      .sort(function(a, b) {
        // Sort by date, newest first
        return new Date(b.date) - new Date(a.date);
      });
  }

  // --------------------------------------------------------------------------
  // Rendering
  // --------------------------------------------------------------------------

  function renderIndex(posts) {
    if (!dom.postList) return;

    if (posts.length === 0) {
      dom.postList.innerHTML =
        '<div class="empty-state">' +
        '<p>No posts yet.</p>' +
        '<p>Check back soon!</p>' +
        '</div>';
      return;
    }

    var html = posts.map(function(post) {
      var tagsHtml = post.tags.length > 0
        ? '<div class="post-item-tags">' +
          post.tags.map(function(tag) {
            return '<span class="tag">' + escapeHtml(tag) + '</span>';
          }).join('') +
          '</div>'
        : '';

      return (
        '<a href="#' + escapeHtml(post.slug) + '" class="post-item">' +
        '<h2 class="post-item-title">' + escapeHtml(post.title) + '</h2>' +
        '<div class="post-item-meta">' +
        '<time class="post-item-date" datetime="' + post.date + '">' +
        formatDate(post.date) + '</time>' +
        tagsHtml +
        '</div>' +
        '</a>'
      );
    }).join('');

    dom.postList.innerHTML = html;
  }

  function renderPost(post) {
    if (!dom.postTitle || !dom.postContent) return;

    // Set metadata
    dom.postTitle.textContent = post.title;
    dom.postDate.textContent = formatDate(post.date);
    dom.postDate.setAttribute('datetime', post.date);

    // Render tags
    if (post.tags.length > 0) {
      dom.postTags.innerHTML = post.tags.map(function(tag) {
        return '<span class="tag">' + escapeHtml(tag) + '</span>';
      }).join('');
    } else {
      dom.postTags.innerHTML = '';
    }

    // Render markdown content
    if (!post.html) {
      post.html = marked.parse(post.content);
    }
    dom.postContent.innerHTML = post.html;

    // Apply syntax highlighting to code blocks
    var codeBlocks = dom.postContent.querySelectorAll('pre code');
    for (var i = 0; i < codeBlocks.length; i++) {
      hljs.highlightElement(codeBlocks[i]);
    }

    // Update document title
    document.title = post.title + ' - pyk.ee';
  }

  // --------------------------------------------------------------------------
  // View Management
  // --------------------------------------------------------------------------

  function showView(viewName) {
    state.currentView = viewName;

    dom.indexView.classList.add('hidden');
    dom.postView.classList.add('hidden');
    dom.loadingView.classList.add('hidden');
    dom.errorView.classList.add('hidden');

    switch (viewName) {
      case 'index':
        dom.indexView.classList.remove('hidden');
        document.title = 'Blog - pyk.ee';
        break;
      case 'post':
        dom.postView.classList.remove('hidden');
        break;
      case 'loading':
        dom.loadingView.classList.remove('hidden');
        break;
      case 'error':
        dom.errorView.classList.remove('hidden');
        break;
    }
  }

  function showError(message, isFileProtocolError) {
    if (dom.errorMessage) {
      if (isFileProtocolError) {
        dom.errorMessage.innerHTML =
          'Browser security blocks local file access.<br><br>' +
          '<strong>To view the blog, start a local server:</strong><br><br>' +
          '<code style="background:rgba(255,153,0,0.1);padding:0.5rem;display:block;margin:1rem 0;">' +
          'python -m http.server 8000</code>' +
          'Then visit: <a href="http://localhost:8000/blog.html">http://localhost:8000/blog.html</a>';
      } else {
        dom.errorMessage.textContent = message;
      }
    }
    showView('error');
    document.title = 'Error - pyk.ee';
  }

  // --------------------------------------------------------------------------
  // Routing
  // --------------------------------------------------------------------------

  function handleRoute() {
    var hash = window.location.hash.slice(1);

    // Empty hash or just '#' means index view
    if (!hash || hash === '') {
      state.currentSlug = null;
      loadIndex();
      return;
    }

    // Otherwise, it's a post slug
    state.currentSlug = hash;
    loadPost(hash);
  }

  function loadIndex() {
    // Check for file:// protocol which blocks fetch()
    if (isFileProtocol()) {
      showError('', true);
      return;
    }

    showView('loading');

    fetchIndex()
      .then(function(slugs) {
        state.index = slugs;
        return fetchAllPosts();
      })
      .then(function(posts) {
        var sortedPosts = filterAndSortPosts(posts);
        renderIndex(sortedPosts);
        showView('index');
      })
      .catch(function(err) {
        console.error('Failed to load blog index:', err);
        showError('Couldn\'t load blog posts. Try refreshing.');
      });
  }

  function loadPost(slug) {
    // Check for file:// protocol which blocks fetch()
    if (isFileProtocol()) {
      showError('', true);
      return;
    }

    showView('loading');

    // Ensure we have the index loaded
    var indexPromise = state.index.length > 0
      ? Promise.resolve()
      : fetchIndex().then(function(slugs) { state.index = slugs; });

    indexPromise
      .then(function() {
        return fetchPost(slug);
      })
      .then(function(post) {
        renderPost(post);
        showView('post');
        // Scroll to top when viewing post
        window.scrollTo(0, 0);
      })
      .catch(function(err) {
        console.error('Failed to load post:', err);
        showError('Post not found. It may have been moved or deleted.');
      });
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------

  function setupScrollIndicator() {
    if (!dom.scrollIndicator) return;

    dom.scrollIndicator.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupBackLinks() {
    // Handle back-link clicks to properly navigate without full page reload
    document.addEventListener('click', function(e) {
      var link = e.target.closest('.back-link');
      if (link && link.getAttribute('href') === '/blog') {
        e.preventDefault();
        window.location.hash = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  function cacheDomReferences() {
    dom.indexView = document.getElementById('blog-index');
    dom.postView = document.getElementById('blog-post');
    dom.loadingView = document.getElementById('blog-loading');
    dom.errorView = document.getElementById('blog-error');
    dom.postList = document.getElementById('post-list');
    dom.postTitle = document.getElementById('post-title');
    dom.postDate = document.getElementById('post-date');
    dom.postTags = document.getElementById('post-tags');
    dom.postContent = document.getElementById('post-content');
    dom.errorMessage = document.getElementById('error-message');
    dom.scrollIndicator = document.querySelector('.scroll-indicator');
  }

  function configureMarked() {
    if (typeof marked === 'undefined') {
      console.error('marked.js not loaded');
      return;
    }

    marked.setOptions({
      gfm: true,
      breaks: false,
      headerIds: true,
      mangle: false
    });
  }

  function init() {
    cacheDomReferences();
    configureMarked();
    setupScrollIndicator();
    setupBackLinks();

    // Handle initial route
    handleRoute();

    // Listen for hash changes
    window.addEventListener('hashchange', handleRoute);
  }

  // --------------------------------------------------------------------------
  // DOM Ready
  // --------------------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

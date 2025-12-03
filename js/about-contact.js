/* ==========================================================================
   pyk.ee About & Contact Pages JavaScript
   Typewriter effect, copy-to-clipboard, GLaDOS quotes, easter eggs
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
    }
  };

  /* --------------------------------------------------------------------------
     GLaDOS Quotes
     -------------------------------------------------------------------------- */

  var GLADOS_QUOTES = [
    { text: "The cake is a lie.", attribution: "— GLaDOS" },
    { text: "This was a triumph.", attribution: "— GLaDOS" },
    { text: "I'm not angry. I'm being so sincere right now.", attribution: "— GLaDOS" },
    { text: "Speedy thing goes in, speedy thing comes out.", attribution: "— GLaDOS" },
    { text: "For science. You monster.", attribution: "— GLaDOS" }
  ];

  /* --------------------------------------------------------------------------
     State
     -------------------------------------------------------------------------- */

  var state = {
    reducedMotion: false,
    toastTimeout: null
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
    element.classList.add('typing-complete');
  }

  /* --------------------------------------------------------------------------
     GLaDOS Quote Selection
     -------------------------------------------------------------------------- */

  function displayGladosQuote() {
    var quoteElement = document.querySelector('.glados-quote');
    if (!quoteElement) {
      return;
    }

    var randomIndex = Math.floor(Math.random() * GLADOS_QUOTES.length);
    var quote = GLADOS_QUOTES[randomIndex];

    // Quote text with quotes on same line, attribution below
    quoteElement.innerHTML = '<span class="glados-quote-text">' + quote.text + '</span>' +
      '<span class="glados-attribution">' + quote.attribution + '</span>';
  }

  /* --------------------------------------------------------------------------
     Copy to Clipboard
     -------------------------------------------------------------------------- */

  function copyToClipboard(text) {
    if (!navigator.clipboard) {
      return Promise.reject(new Error('Clipboard API not available'));
    }

    return navigator.clipboard.writeText(text);
  }

  function setupEmailCopy() {
    var emailLink = document.querySelector('[data-copyable="email"]');
    if (!emailLink) {
      return;
    }

    emailLink.addEventListener('click', function(e) {
      var emailAddress = emailLink.getAttribute('data-email');
      if (!emailAddress) {
        return; // Let the default mailto work
      }

      // Try clipboard API
      if (!navigator.clipboard) {
        return; // Let the default mailto work
      }

      e.preventDefault();

      copyToClipboard(emailAddress)
        .then(function() {
          showToast('[ok] ' + emailAddress + ' copied');
          announceToScreenReader(emailAddress + ' copied to clipboard');
        })
        .catch(function() {
          // Fallback to mailto
          window.location.href = 'mailto:' + emailAddress;
        });
    });
  }

  /* --------------------------------------------------------------------------
     Toast Notification
     -------------------------------------------------------------------------- */

  function showToast(message) {
    // Clear any existing toast timeout
    if (state.toastTimeout) {
      clearTimeout(state.toastTimeout);
    }

    // Find or create toast element
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    // Set message with prefix styling
    toast.innerHTML = '<span class="toast-prefix">[ok]</span> ' +
      message.replace('[ok] ', '');

    // Show toast
    toast.offsetHeight; // Force reflow
    toast.classList.add('visible');

    // Auto-hide
    state.toastTimeout = setTimeout(function() {
      toast.classList.remove('visible');
    }, CONFIG.toast.duration);
  }

  /* --------------------------------------------------------------------------
     Screen Reader Announcements
     -------------------------------------------------------------------------- */

  function announceToScreenReader(message) {
    var liveRegion = document.getElementById('sr-announcer');
    if (!liveRegion) {
      return;
    }

    liveRegion.textContent = message;
  }

  /* --------------------------------------------------------------------------
     Companion Cube Easter Egg
     -------------------------------------------------------------------------- */

  function setupCompanionCube() {
    var trigger = document.querySelector('.easter-egg-trigger');
    if (!trigger) {
      return;
    }

    // Create companion cube SVG - Portal Weighted Companion Cube design
    // Isometric view with pink heart and corner decorations
    var cube = document.createElement('div');
    cube.className = 'companion-cube';
    cube.setAttribute('aria-hidden', 'true');
    cube.innerHTML = '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
      '<!-- Portal Weighted Companion Cube -->' +
      // Main cube body (3D isometric)
      '<polygon fill="#665544" points="24,4 44,14 44,34 24,44 4,34 4,14"/>' +
      // Top face
      '<polygon fill="#887766" points="24,4 44,14 24,24 4,14"/>' +
      // Left face
      '<polygon fill="#554433" points="4,14 24,24 24,44 4,34"/>' +
      // Right face
      '<polygon fill="#776655" points="44,14 44,34 24,44 24,24"/>' +
      // Corner circles (top)
      '<circle fill="#CC9966" cx="14" cy="10" r="2"/>' +
      '<circle fill="#CC9966" cx="34" cy="10" r="2"/>' +
      '<circle fill="#CC9966" cx="8" cy="18" r="2"/>' +
      '<circle fill="#CC9966" cx="40" cy="18" r="2"/>' +
      // Pink heart on front face
      '<path fill="#FF6699" d="M24,20 C22,18 19,18 18,20 C17,22 18,24 24,30 C30,24 31,22 30,20 C29,18 26,18 24,20 Z"/>' +
      // Heart highlight
      '<path fill="#FF99BB" d="M20,20 C19,19 18,19 18,20 C18,21 19,22 20,21 Z"/>' +
      // Edge highlights
      '<line stroke="#FFCC99" stroke-width="0.5" x1="24" y1="4" x2="44" y2="14"/>' +
      '<line stroke="#FFCC99" stroke-width="0.5" x1="24" y1="4" x2="4" y2="14"/>' +
      '</svg>';

    trigger.appendChild(cube);
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */

  function init() {
    checkReducedMotion();

    // Typewriter effect on page title
    var typewriterTitle = document.querySelector('.typewriter-title');
    if (typewriterTitle) {
      typewriter(typewriterTitle);
    }

    // GLaDOS quote
    displayGladosQuote();

    // Email copy functionality
    setupEmailCopy();

    // Companion cube easter egg
    setupCompanionCube();
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

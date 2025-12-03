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

    quoteElement.innerHTML = quote.text +
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

    // Create companion cube SVG
    var cube = document.createElement('div');
    cube.className = 'companion-cube';
    cube.setAttribute('aria-hidden', 'true');
    cube.innerHTML = '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
      '<!-- Companion Cube - 8x8 pixel art scaled 4x -->' +
      '<rect fill="#806600" x="4" y="4" width="24" height="24"/>' +
      '<rect fill="#664400" x="8" y="8" width="16" height="16"/>' +
      '<rect fill="#FF9900" x="12" y="10" width="8" height="6"/>' +
      '<rect fill="#FFB000" x="14" y="12" width="4" height="2"/>' +
      '<rect fill="#FF9900" x="14" y="18" width="4" height="2"/>' +
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

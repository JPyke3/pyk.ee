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
     State
     -------------------------------------------------------------------------- */

  var state = {
    reducedMotion: false,
    toastTimeout: null,
    portalMode: false
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

    var randomIndex = Math.floor(Math.random() * PORTAL_QUOTES.length);
    var quote = PORTAL_QUOTES[randomIndex];

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
     Portal Mode Easter Egg
     -------------------------------------------------------------------------- */

  function setupPortalMode() {
    var trigger = document.querySelector('.easter-egg-trigger');
    if (!trigger) {
      return;
    }

    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      togglePortalMode(trigger);
    });
  }

  function togglePortalMode(triggerElement) {
    var isPortalMode = document.body.classList.contains('portal-mode');

    // If reduced motion, skip animation and just toggle
    if (state.reducedMotion) {
      document.body.classList.toggle('portal-mode');
      state.portalMode = !isPortalMode;
      return;
    }

    // Create portal overlay for animation
    var overlay = document.createElement('div');
    overlay.className = 'portal-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    // Position overlay centered on trigger element
    var rect = triggerElement.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    overlay.style.setProperty('--portal-x', centerX + 'px');
    overlay.style.setProperty('--portal-y', centerY + 'px');

    document.body.appendChild(overlay);

    // Trigger animation
    overlay.offsetHeight; // Force reflow
    overlay.classList.add('expanding');

    // Toggle portal mode after animation starts
    setTimeout(function() {
      document.body.classList.toggle('portal-mode');
      state.portalMode = !isPortalMode;
    }, 250);

    // Remove overlay after animation completes
    setTimeout(function() {
      overlay.remove();
    }, 600);
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

    // Portal mode easter egg
    setupPortalMode();
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

/* ==========================================================================
   pyk.ee Homepage JavaScript
   Logo tracking, particle system, ambient effects
   ========================================================================== */

(function() {
  'use strict';

  /* --------------------------------------------------------------------------
     Configuration
     -------------------------------------------------------------------------- */

  var CONFIG = {
    particles: {
      count: 40,
      minSize: 1,
      maxSize: 3,
      speed: 0.3,
      color: 'rgba(255, 153, 0, 0.4)'
    },
    logo: {
      maxOffset: 8,
      smoothing: 0.1
    }
  };

  /* --------------------------------------------------------------------------
     State
     -------------------------------------------------------------------------- */

  var state = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    reducedMotion: false,
    particles: [],
    canvas: null,
    ctx: null,
    logo: null,
    animationId: null
  };

  /* --------------------------------------------------------------------------
     Utility Functions
     -------------------------------------------------------------------------- */

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  /* --------------------------------------------------------------------------
     Reduced Motion Check
     -------------------------------------------------------------------------- */

  function checkReducedMotion() {
    var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    state.reducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', function(e) {
      state.reducedMotion = e.matches;
      if (state.reducedMotion) {
        resetLogoPosition();
      }
    });
  }

  function resetLogoPosition() {
    if (state.logo) {
      state.logo.style.transform = 'translate(0, 0)';
    }
    state.currentX = 0;
    state.currentY = 0;
  }

  /* --------------------------------------------------------------------------
     Mouse Tracking - US2
     -------------------------------------------------------------------------- */

  function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
  }

  function updateLogoTarget() {
    if (!state.logo || state.reducedMotion) {
      return;
    }

    var rect = state.logo.getBoundingClientRect();
    var logoCenterX = rect.left + rect.width / 2;
    var logoCenterY = rect.top + rect.height / 2;

    var deltaX = state.mouseX - logoCenterX;
    var deltaY = state.mouseY - logoCenterY;

    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    var maxDistance = Math.max(window.innerWidth, window.innerHeight);

    var normalizedDistance = Math.min(distance / maxDistance, 1);
    var offsetMultiplier = normalizedDistance * CONFIG.logo.maxOffset;

    var angle = Math.atan2(deltaY, deltaX);
    state.targetX = Math.cos(angle) * offsetMultiplier;
    state.targetY = Math.sin(angle) * offsetMultiplier;
  }

  function updateLogoPosition() {
    if (state.reducedMotion) {
      return;
    }

    state.currentX = lerp(state.currentX, state.targetX, CONFIG.logo.smoothing);
    state.currentY = lerp(state.currentY, state.targetY, CONFIG.logo.smoothing);

    if (state.logo) {
      state.logo.style.transform = 'translate(' + state.currentX + 'px, ' + state.currentY + 'px)';
    }
  }

  /* --------------------------------------------------------------------------
     Particle System - US2
     -------------------------------------------------------------------------- */

  function createParticle() {
    return {
      x: random(0, state.canvas.width),
      y: random(0, state.canvas.height),
      size: random(CONFIG.particles.minSize, CONFIG.particles.maxSize),
      speedX: random(-CONFIG.particles.speed, CONFIG.particles.speed),
      speedY: random(-CONFIG.particles.speed, CONFIG.particles.speed),
      opacity: random(0.2, 0.6)
    };
  }

  function getParticleCount() {
    if (state.reducedMotion) {
      return 0;
    }
    if (window.innerWidth < 768) {
      return Math.floor(CONFIG.particles.count / 2);
    }
    return CONFIG.particles.count;
  }

  function initParticles() {
    state.particles = [];
    var count = getParticleCount();
    for (var i = 0; i < count; i++) {
      state.particles.push(createParticle());
    }
  }

  function updateParticle(particle) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0) {
      particle.x = state.canvas.width;
    }
    if (particle.x > state.canvas.width) {
      particle.x = 0;
    }
    if (particle.y < 0) {
      particle.y = state.canvas.height;
    }
    if (particle.y > state.canvas.height) {
      particle.y = 0;
    }
  }

  function drawParticle(particle) {
    state.ctx.beginPath();
    state.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    state.ctx.fillStyle = 'rgba(255, 153, 0, ' + particle.opacity + ')';
    state.ctx.fill();
  }

  function updateParticles() {
    if (!state.canvas || !state.ctx || state.reducedMotion) {
      return;
    }

    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    for (var i = 0; i < state.particles.length; i++) {
      updateParticle(state.particles[i]);
      drawParticle(state.particles[i]);
    }
  }

  /* --------------------------------------------------------------------------
     Canvas Setup - US2
     -------------------------------------------------------------------------- */

  function setupCanvas() {
    state.canvas = document.getElementById('particle-canvas');
    if (!state.canvas) {
      return;
    }

    state.ctx = state.canvas.getContext('2d');
    resizeCanvas();
    initParticles();
  }

  function resizeCanvas() {
    if (!state.canvas) {
      return;
    }

    state.canvas.width = window.innerWidth;
    state.canvas.height = window.innerHeight;
  }

  /* --------------------------------------------------------------------------
     Animation Loop - US2
     -------------------------------------------------------------------------- */

  function animate() {
    updateLogoTarget();
    updateLogoPosition();
    updateParticles();

    state.animationId = requestAnimationFrame(animate);
  }

  /* --------------------------------------------------------------------------
     Event Listeners
     -------------------------------------------------------------------------- */

  function setupEventListeners() {
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', function() {
      resizeCanvas();
      initParticles();
    });
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */

  function init() {
    checkReducedMotion();

    state.logo = document.querySelector('.logo');

    setupCanvas();
    setupEventListeners();

    if (!state.reducedMotion) {
      animate();
    }
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

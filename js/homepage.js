/* ==========================================================================
   pyk.ee Homepage JavaScript
   Fish eye tracking, click interaction, particle system
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
    eye: {
      maxOffset: 2,
      smoothing: 0.15
    }
  };

  /* --------------------------------------------------------------------------
     State
     -------------------------------------------------------------------------- */

  var state = {
    mouseX: 0,
    mouseY: 0,
    targetPupilX: 0,
    targetPupilY: 0,
    currentPupilX: 0,
    currentPupilY: 0,
    reducedMotion: false,
    particles: [],
    canvas: null,
    ctx: null,
    pupil: null,
    wink: null,
    mascot: null,
    eyeCenterX: 44,
    eyeCenterY: 14,
    animationId: null,
    isWinking: false
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
        resetPupilPosition();
      }
    });
  }

  function resetPupilPosition() {
    if (state.pupil) {
      state.pupil.setAttribute('cx', state.eyeCenterX);
      state.pupil.setAttribute('cy', state.eyeCenterY);
    }
    state.currentPupilX = 0;
    state.currentPupilY = 0;
  }

  /* --------------------------------------------------------------------------
     Eye Tracking
     -------------------------------------------------------------------------- */

  function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
  }

  function updateEyeTarget() {
    if (!state.mascot || state.reducedMotion || state.isWinking) {
      return;
    }

    var rect = state.mascot.getBoundingClientRect();
    var svgWidth = rect.width;
    var svgHeight = rect.height;

    var eyeScreenX = rect.left + (state.eyeCenterX / 64) * svgWidth;
    var eyeScreenY = rect.top + (state.eyeCenterY / 32) * svgHeight;

    var deltaX = state.mouseX - eyeScreenX;
    var deltaY = state.mouseY - eyeScreenY;

    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 0) {
      var normalizedX = deltaX / distance;
      var normalizedY = deltaY / distance;

      var intensity = Math.min(distance / 200, 1);

      state.targetPupilX = normalizedX * CONFIG.eye.maxOffset * intensity;
      state.targetPupilY = normalizedY * CONFIG.eye.maxOffset * intensity;
    }
  }

  function updatePupilPosition() {
    if (state.reducedMotion || state.isWinking || !state.pupil) {
      return;
    }

    state.currentPupilX = lerp(state.currentPupilX, state.targetPupilX, CONFIG.eye.smoothing);
    state.currentPupilY = lerp(state.currentPupilY, state.targetPupilY, CONFIG.eye.smoothing);

    var newCx = state.eyeCenterX + state.currentPupilX;
    var newCy = state.eyeCenterY + state.currentPupilY;

    state.pupil.setAttribute('cx', newCx);
    state.pupil.setAttribute('cy', newCy);
  }

  /* --------------------------------------------------------------------------
     Fish Click Interaction - Wink Animation
     -------------------------------------------------------------------------- */

  function handleFishClick() {
    if (state.isWinking || state.reducedMotion) {
      return;
    }

    state.isWinking = true;

    if (state.wink) {
      state.wink.style.opacity = '1';
    }
    if (state.pupil) {
      state.pupil.style.opacity = '0';
    }

    setTimeout(function() {
      if (state.wink) {
        state.wink.style.opacity = '0';
      }
      if (state.pupil) {
        state.pupil.style.opacity = '1';
      }
      state.isWinking = false;
    }, 200);
  }

  /* --------------------------------------------------------------------------
     Scroll to Top
     -------------------------------------------------------------------------- */

  function setupScrollToTop() {
    var scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: state.reducedMotion ? 'auto' : 'smooth'
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     Particle System
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
     Canvas Setup
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
     Animation Loop
     -------------------------------------------------------------------------- */

  function animate() {
    updateEyeTarget();
    updatePupilPosition();
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

    if (state.mascot) {
      state.mascot.addEventListener('click', handleFishClick);
    }
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */

  function init() {
    checkReducedMotion();

    state.mascot = document.querySelector('.mascot');
    state.pupil = document.getElementById('fish-pupil');
    state.wink = document.getElementById('fish-wink');

    setupCanvas();
    setupEventListeners();
    setupScrollToTop();

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

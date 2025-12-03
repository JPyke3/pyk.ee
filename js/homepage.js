/* ==========================================================================
   pyk.ee Homepage JavaScript
   Fish whole-element tracking, wiggle interaction, particle system
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
    mascot: {
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
    mascot: null,
    animationId: null,
    isWiggling: false
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
        resetMascotPosition();
      }
    });
  }

  function resetMascotPosition() {
    if (state.mascot) {
      state.mascot.style.transform = 'translate(0px, 0px)';
    }
    state.currentX = 0;
    state.currentY = 0;
  }

  /* --------------------------------------------------------------------------
     Whole-Element Float Tracking
     -------------------------------------------------------------------------- */

  function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
  }

  function updateMascotTarget() {
    if (!state.mascot || state.reducedMotion || state.isWiggling) {
      return;
    }

    var rect = state.mascot.getBoundingClientRect();
    var mascotCenterX = rect.left + rect.width / 2;
    var mascotCenterY = rect.top + rect.height / 2;

    var deltaX = state.mouseX - mascotCenterX;
    var deltaY = state.mouseY - mascotCenterY;

    var angle = Math.atan2(deltaY, deltaX);
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    var intensity = Math.min(distance / 300, 1);

    state.targetX = Math.cos(angle) * CONFIG.mascot.maxOffset * intensity;
    state.targetY = Math.sin(angle) * CONFIG.mascot.maxOffset * intensity;
  }

  function updateMascotPosition() {
    if (state.reducedMotion || state.isWiggling || !state.mascot) {
      return;
    }

    state.currentX = lerp(state.currentX, state.targetX, CONFIG.mascot.smoothing);
    state.currentY = lerp(state.currentY, state.targetY, CONFIG.mascot.smoothing);

    state.mascot.style.transform = 'translate(' + state.currentX + 'px, ' + state.currentY + 'px)';
  }

  /* --------------------------------------------------------------------------
     Fish Click Interaction - Wiggle Animation
     -------------------------------------------------------------------------- */

  function handleFishClick() {
    if (state.isWiggling || state.reducedMotion) {
      return;
    }

    state.isWiggling = true;
    state.mascot.classList.add('wiggle');

    setTimeout(function() {
      state.mascot.classList.remove('wiggle');
      state.isWiggling = false;
    }, 400);
  }

  /* --------------------------------------------------------------------------
     Scroll Indicators
     -------------------------------------------------------------------------- */

  function setupScrollIndicators() {
    var scrollDownIndicator = document.querySelector('.scroll-down-indicator');
    var scrollUpIndicator = document.querySelector('.scroll-indicator');

    if (scrollDownIndicator) {
      scrollDownIndicator.addEventListener('click', function() {
        var whatIDo = document.querySelector('.what-i-do');
        if (whatIDo) {
          whatIDo.scrollIntoView({
            behavior: state.reducedMotion ? 'auto' : 'smooth'
          });
        }
      });
    }

    if (scrollUpIndicator) {
      scrollUpIndicator.addEventListener('click', function() {
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
    updateMascotTarget();
    updateMascotPosition();
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
      state.mascot.style.cursor = 'pointer';
    }
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */

  function init() {
    checkReducedMotion();

    state.mascot = document.querySelector('.mascot');

    setupCanvas();
    setupEventListeners();
    setupScrollIndicators();

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

(function() {
  'use strict';

  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navList.classList.contains('open'));
    });
    navList.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navList.classList.remove('open');
      });
    });
  }

  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  // Hide hero placeholder when portrait image loads
  var heroImg = document.querySelector('.hero__image[data-hero-portrait]');
  var heroPlaceholder = document.querySelector('.hero__image-placeholder');
  if (heroImg && heroPlaceholder) {
    heroImg.addEventListener('load', function() {
      heroPlaceholder.style.display = 'none';
    });
    if (heroImg.src && heroImg.complete) {
      heroPlaceholder.style.display = 'none';
    }
  }

  // Prefer reduced motion
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll-triggered animations (Intersection Observer)
  if (!prefersReducedMotion) {
    var animated = document.querySelectorAll('.animate-on-scroll');
    if (animated.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      animated.forEach(function(el) { observer.observe(el); });
    }

    // Parallax: hero image moves slightly on scroll
    var heroImage = document.querySelector('.hero__image[data-hero-portrait]');
    var heroSection = document.querySelector('.hero--split');
    if (heroImage && heroSection) {
      function updateParallax() {
        var rect = heroSection.getBoundingClientRect();
        var viewportHeight = window.innerHeight;
        if (rect.bottom < 0 || rect.top > viewportHeight) return;
        var scrolled = -rect.top;
        var rate = 0.12;
        var y = Math.max(-40, Math.min(40, scrolled * rate));
        heroImage.style.transform = 'translate3d(0, ' + y + 'px, 0)';
      }
      window.addEventListener('scroll', updateParallax, { passive: true });
      updateParallax();
    }
  }
})();

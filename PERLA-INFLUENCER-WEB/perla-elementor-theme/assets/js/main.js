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

  // Mark active nav link based on current URL.
  // WordPress permalinks often look like `/about/`, while the static HTML uses `about.html`,
  // so we normalize both to their last URL segment.
  function lastSegment(pathOrUrl) {
    if (!pathOrUrl) return 'index.html';
    var clean = pathOrUrl.split('#')[0].split('?')[0];
    clean = clean.replace(/\/+$/, '');
    var parts = clean.split('/');
    var seg = parts[parts.length - 1];
    return seg || 'index.html';
  }

  var path = lastSegment(window.location.pathname);
  document.querySelectorAll('.nav-list a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (lastSegment(href) === path) {
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

// Dynamic reels grid (admin-configured) for Home.
document.addEventListener('DOMContentLoaded', function() {
  try {
    var grid = document.querySelector('.home-reels .featured-work__grid');
    if (!grid) return;

    if (!window.PERLA_REELS || !window.PERLA_REELS.endpoint) return;

    fetch(window.PERLA_REELS.endpoint, { credentials: 'same-origin' })
      .then(function(res) {
        if (!res || !res.ok) return null;
        return res.json();
      })
      .then(function(data) {
        if (!data || !data.hasConfig || !Array.isArray(data.tiles)) return;

        var delays = ['animate-delay-1', 'animate-delay-2', 'animate-delay-3', 'animate-delay-4'];
        var hasInstagram = false;

        function escapeAttr(value) {
          return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        }

        var html = '';
        data.tiles.slice(0, 4).forEach(function(tile, idx) {
          var delayClass = delays[idx] || '';
          var slotClass = 'featured-work__slot animate-on-scroll ' + delayClass;

          if (tile && tile.type === 'instagram' && tile.instagram_url) {
            hasInstagram = true;
            html += '<div class="' + slotClass + '">';
            html += '<blockquote class="instagram-media" data-instgrm-permalink="' + escapeAttr(tile.instagram_url) + '" data-instgrm-version="14"></blockquote>';
            html += '</div>';
            return;
          }

          if (tile && tile.type === 'video' && tile.video_url) {
            var posterAttr = tile.poster_url ? ' poster="' + escapeAttr(tile.poster_url) + '"' : '';
            html += '<div class="' + slotClass + '">';
            html += '<video class="perla-reel-video" controls playsinline preload="metadata"' + posterAttr + ' style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">';
            html += '<source src="' + escapeAttr(tile.video_url) + '" type="video/mp4" />';
            html += '</video>';
            html += '</div>';
            return;
          }

          html += '<div class="' + slotClass + '"></div>';
        });

        grid.innerHTML = html;

        // If we inserted Instagram embeds, ask the embed script to process them.
        if (hasInstagram && window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
          window.instgrm.Embeds.process();
          return;
        }

        if (hasInstagram) {
          var started = Date.now();
          var timer = setInterval(function() {
            if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
              window.instgrm.Embeds.process();
              clearInterval(timer);
              return;
            }
            if (Date.now() - started > 2500) {
              clearInterval(timer);
            }
          }, 250);
        }
      })
      .catch(function() {
        // Fail silently; static markup remains as fallback.
      });
  } catch (e) {
    // Fail silently; static markup remains as fallback.
  }
});

// Dynamic gallery embeds with load more for Gallery page.
document.addEventListener('DOMContentLoaded', function() {
  try {
    if (!window.PERLA_GALLERY || !window.PERLA_GALLERY.endpoint) return;

    var feed = document.querySelector('.instagram-feed#instagram-feed');
    if (!feed) return;

    var cta = document.querySelector('.gallery-cta');
    if (!cta) return;

    var endpoint = window.PERLA_GALLERY.endpoint;
    var perPage = window.PERLA_GALLERY.perPage || 6;
    var offset = 0;
    var hasMore = false;

    function escapeAttr(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function processEmbedsWithRetry() {
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
        window.instgrm.Embeds.process();
        return;
      }
      var started = Date.now();
      var timer = setInterval(function() {
        if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
          window.instgrm.Embeds.process();
          clearInterval(timer);
          return;
        }
        if (Date.now() - started > 2500) {
          clearInterval(timer);
        }
      }, 250);
    }

    function ensureButton() {
      var existing = document.querySelector('.perla-gallery-load-more');
      if (existing) return existing;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--filled perla-gallery-load-more';
      btn.textContent = 'Load more';

      cta.parentNode.insertBefore(btn, cta);
      btn.style.marginTop = 'var(--space-md)';
      btn.style.marginBottom = 'var(--space-md)';

      return btn;
    }

    var btn = ensureButton();
    btn.style.display = 'none';

    function renderBatch(items, append) {
      if (!append) feed.innerHTML = '';
      if (!Array.isArray(items) || items.length === 0) return;

      var html = '';
      items.forEach(function(url) {
        html += '<div class="instagram-embed">';
        html += '<blockquote class="instagram-media" data-instgrm-permalink="' + escapeAttr(url) + '" data-instgrm-version="14"></blockquote>';
        html += '</div>';
      });

      feed.insertAdjacentHTML('beforeend', html);
      processEmbedsWithRetry();
    }

    function loadNext(append) {
      if (!append) {
        offset = 0;
        hasMore = false;
      }

      return fetch(endpoint + '?offset=' + encodeURIComponent(offset) + '&limit=' + encodeURIComponent(perPage), {
        credentials: 'same-origin'
      })
        .then(function(res) {
          if (!res || !res.ok) return null;
          return res.json();
        })
        .then(function(data) {
          if (!data || !data.hasConfig) return;

          hasMore = !!data.hasMore;
          var items = data.items || [];

          renderBatch(items, append);

          offset = offset + items.length;
          btn.style.display = hasMore ? 'inline-block' : 'none';
        })
        .catch(function() {
          // Fail silently
        });
    }

    // Initial load
    loadNext(false).then(function() {
      btn.addEventListener('click', function() {
        if (!hasMore) return;
        loadNext(true);
      });
    });
  } catch (e) {
    // Fail silently; static gallery markup remains.
  }
});

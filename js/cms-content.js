/* global window, document */
(function () {
  'use strict';

  function fetchJson(path) {
    return fetch(path, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('Failed to load ' + path);
      return r.json();
    });
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (!el) return;
    el.textContent = text == null ? '' : String(text);
  }

  function setHtml(selector, html) {
    var el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = html || '';
  }

  function setImage(selector, url) {
    var el = document.querySelector(selector);
    if (!el || !url) return;
    el.setAttribute('src', url);
  }

  function applySeo(key, data) {
    var seo = data.seo && data.seo[key];
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && seo.description) meta.setAttribute('content', seo.description);
  }

  function applyBrandName(data) {
    var name = data.brandName;
    if (!name) return;
    document.querySelectorAll('[data-cms="brand-name"]').forEach(function (el) {
      el.textContent = name;
    });
  }

  function formatAboutIntro(raw) {
    function inlineBold(s) {
      var parts = String(s).split(/\*\*/);
      var out = '';
      for (var i = 0; i < parts.length; i++) {
        if (i % 2 === 0) out += escapeAttr(parts[i]);
        else out += '<strong>' + escapeAttr(parts[i]) + '</strong>';
      }
      return out;
    }
    return String(raw)
      .trim()
      .split(/\n\n+/)
      .map(function (block) {
        var line = block.trim().replace(/\n/g, ' ');
        return line ? '<p>' + inlineBold(line) + '</p>' : '';
      })
      .filter(Boolean)
      .join('');
  }

  function renderReelsCarousel(reels) {
    var carousel = document.getElementById('reel-carousel');
    if (!carousel) return;
    if (!Array.isArray(reels) || reels.length === 0) {
      carousel.innerHTML = '';
      return;
    }

    var html = '';
    var hasInstagram = false;
    reels.forEach(function (reel) {
      if (!reel) return;
      if (reel.instagram) hasInstagram = true;
      html += buildCardHtml(reel);
    });

    carousel.innerHTML = html;
    attachVideoControls(carousel);
    if (hasInstagram) scheduleInstagramEmbeds();
  }

  function scheduleInstagramEmbeds() {
    function run() {
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
        window.instgrm.Embeds.process();
        return true;
      }
      return false;
    }
    if (run()) return;
    var attempts = 0;
    var id = setInterval(function () {
      attempts++;
      if (run() || attempts > 60) {
        clearInterval(id);
      }
    }, 100);
    window.addEventListener('load', function () {
      run();
    });
  }

  var ICON_MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
  var ICON_UNMUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';

  function buildCardHtml(item) {
    var igUrl = item.instagram ? escapeAttr(item.instagram) : '';
    var videoSrc = item.video ? escapeAttr(item.video) : '';
    var brand = item.brand ? escapeAttr(item.brand) : '';
    var caption = item.caption ? escapeAttr(item.caption) : '';
    var html = '';

    if (igUrl) {
      html += '<div class="reel-card reel-card--instagram">';
      html += '<blockquote class="instagram-media"'
        + ' data-instgrm-permalink="' + igUrl + '"'
        + ' data-instgrm-version="14"></blockquote>';
      html += '</div>';
    } else if (videoSrc) {
      html += '<div class="reel-card">';
      // autoplay muted + playsinline = silent preview on load (works on iOS/Android)
      html += '<video autoplay muted playsinline loop preload="auto" tabindex="-1">';
      html += '<source src="' + videoSrc + '" type="video/mp4">';
      html += '</video>';
      // Mute toggle button — top-right corner
      html += '<button class="reel-card__mute-btn" aria-label="Unmute video">' + ICON_MUTED + '</button>';
      html += '<div class="reel-card__overlay">';
      if (brand) html += '<span class="reel-card__brand">' + brand + '</span>';
      if (caption) html += '<span class="reel-card__caption">' + caption + '</span>';
      html += '</div>';
      html += '</div>';
    }
    return html;
  }

  function attachVideoControls(container) {
    container.querySelectorAll('.reel-card:not(.reel-card--instagram)').forEach(function (card) {
      var video = card.querySelector('video');
      var muteBtn = card.querySelector('.reel-card__mute-btn');
      if (!video || !muteBtn) return;

      function updateMuteBtn() {
        muteBtn.innerHTML = video.muted ? ICON_MUTED : ICON_UNMUTED;
        muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
      }

      muteBtn.addEventListener('click', function (e) {
        e.stopPropagation(); // don't bubble to card
        video.muted = !video.muted;
        // Resuming with audio requires a fresh play() call after unmuting
        if (!video.muted && video.paused) video.play().catch(function () {});
        updateMuteBtn();
      });

      // Tapping the card itself also toggles mute (mobile-friendly)
      card.addEventListener('click', function () {
        video.muted = !video.muted;
        if (!video.muted && video.paused) video.play().catch(function () {});
        updateMuteBtn();
      });
    });
  }

  function renderGalleryGrid(items) {
    var grid = document.getElementById('gallery-grid');
    if (!grid || !Array.isArray(items) || items.length === 0) return;

    var html = '';
    var hasInstagram = false;
    items.forEach(function (item) {
      if (!item) return;
      if (item.instagram) hasInstagram = true;
      html += buildCardHtml(item);
    });

    grid.innerHTML = html;
    attachVideoControls(grid);
    if (hasInstagram) scheduleInstagramEmbeds();
  }

  function renderGallery(gallery) {
    var feed = document.querySelector('.instagram-feed#instagram-feed');
    if (!feed) return;

    var items = (gallery && gallery.instagramUrls) || [];
    if (!Array.isArray(items) || items.length === 0) return;

    var urls = items
      .map(function (x) {
        return x && x.url ? String(x.url).trim() : '';
      })
      .filter(Boolean);

    if (urls.length === 0) return;

    var html = '';
    urls.slice(0, 6).forEach(function (u) {
      html += '<div class="instagram-embed">';
      html +=
        '<blockquote class="instagram-media" data-instgrm-permalink="' +
        escapeAttr(u) +
        '" data-instgrm-version="14"></blockquote>';
      html += '</div>';
    });
    feed.innerHTML = html;

    scheduleInstagramEmbeds();
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetchJson('/content/site.json')
      .then(function (data) {
        applyBrandName(data);

        if (document.body && document.body.classList.contains('page-home')) {
          applySeo('home', data);
          var h = data.home || {};
          setText('.hero__kicker', h.kicker);
          setHtml(
            '.hero__title',
            escapeAttr(h.nameLine1 || '') + '<br>' + escapeAttr(h.nameLine2 || '')
          );
          setText('[data-cms="home-hero-role"]', h.role);
          setText('[data-cms="home-hero-tagline"]', h.tagline);
          setText('[data-cms="home-hero-callout"]', h.callout);
          if (h.heroPortrait) {
            setImage('.hero__image', h.heroPortrait);
          }
          if (h.brandsLabel) {
            setText('[data-cms="home-brands-label"]', h.brandsLabel);
          }
          var bl = h.blurb;
          if (bl) {
            setText('[data-cms="home-blurb-label"]', bl.label);
            setText('[data-cms="home-blurb-title"]', bl.title);
            setText('[data-cms="home-blurb-text"]', bl.text);
            setText('[data-cms="home-blurb-callout"]', bl.callout);
          }
          var rs = h.reelsSection;
          if (rs) {
            setText('[data-cms="home-reels-label"]', rs.label);
            setText('[data-cms="home-reels-title"]', rs.title);
            if (rs.description) {
              setHtml('[data-cms="home-reels-desc"]', rs.description);
            }
          }
          // Load reel cards from dedicated reels.json
          fetchJson('/content/reels.json')
            .then(function (reelsData) {
              renderReelsCarousel(reelsData.reels || reelsData);
            })
            .catch(function () {
              // Fall back silently — carousel stays empty
            });
        }

        if (document.body && document.body.classList.contains('page-about')) {
          applySeo('about', data);
          var hero = data.about && data.about.hero;
          if (hero) {
            setText('[data-cms="about-hero-label"]', hero.label);
            setText('[data-cms="about-hero-title"]', hero.title);
            setText('[data-cms="about-hero-subtitle"]', hero.subtitle);
            setText('[data-cms="about-hero-callout"]', hero.callout);
          }
          if (data.about && data.about.intro) {
            setHtml('[data-cms="about-intro"]', formatAboutIntro(String(data.about.intro)));
          }
        }

        if (document.body && document.body.classList.contains('page-services')) {
          applySeo('services', data);
          var sh = data.services && data.services.hero;
          if (sh) {
            setText('[data-cms="services-hero-label"]', sh.label);
            setText('[data-cms="services-hero-title"]', sh.title);
            setText('[data-cms="services-hero-subtitle"]', sh.subtitle);
            setText('[data-cms="services-hero-callout"]', sh.callout);
          }
          var cards = (data.services && data.services.cards) || [];
          if (Array.isArray(cards) && cards.length) {
            var out = '';
            cards.forEach(function (c) {
              out += '<div class="service-card">';
              out += '<h3>' + escapeAttr(c.title || '') + '</h3>';
              out += '<p>' + escapeAttr(c.description || '') + '</p>';
              out += '</div>';
            });
            setHtml('.services-list', out);
          }
        }

        if (document.body && document.body.classList.contains('page-work-with-me')) {
          applySeo('workWithMe', data);
          var w = data.workWithMe || {};
          var emailEl = document.getElementById('contact-email');
          if (emailEl && w.email) emailEl.href = 'mailto:' + w.email;
          var emailVal = emailEl ? emailEl.querySelector('[data-contact-value]') : null;
          if (emailVal && w.email) emailVal.textContent = w.email;

          var igEl = document.getElementById('contact-instagram');
          if (igEl && w.instagramUrl) igEl.href = w.instagramUrl;
          var igVal = igEl ? igEl.querySelector('[data-contact-value]') : null;
          if (igVal && w.instagramHandle) igVal.textContent = w.instagramHandle;

          var locVal = document.querySelector('[data-contact="location"] [data-contact-value]');
          if (locVal && w.location) locVal.textContent = w.location;

          setText('.work-contact-card__name', w.name);
          setText('.work-contact-card__tagline', w.tagline);

          var wh = w.hero;
          if (wh) {
            setText('[data-cms="work-hero-label"]', wh.label);
            setText('[data-cms="work-hero-title"]', wh.title);
            setText('[data-cms="work-hero-intro"]', wh.intro);
            setText('[data-cms="work-hero-callout"]', wh.callout);
            setText('[data-cms="work-hero-badge"]', wh.responseBadge);
          }
          var wf = w.form;
          if (wf) {
            setText('[data-cms="work-form-title"]', wf.title);
            setText('[data-cms="work-form-note"]', wf.note);
            setText('[data-cms="work-form-hint"]', wf.hint);
          }
          if (w.contactIntro) {
            setText('[data-cms="work-contact-intro"]', w.contactIntro);
          }
        }

        if (document.body && document.body.classList.contains('page-gallery')) {
          applySeo('gallery', data);
          var g = data.gallery || {};
          var gh = g.hero;
          if (gh) {
            setText('[data-cms="gallery-hero-label"]', gh.label);
            setText('[data-cms="gallery-hero-title"]', gh.title);
            setText('[data-cms="gallery-hero-subtitle"]', gh.subtitle);
            setText('[data-cms="gallery-hero-callout"]', gh.callout);
          }
          fetchJson('/content/gallery.json')
            .then(function (gData) {
              renderGalleryGrid(gData.items || gData);
            })
            .catch(function () {});
        }
      })
      .catch(function (err) {
        if (typeof console !== 'undefined' && console.error) {
          console.error('[CMS] Could not load /content/site.json — other pages stay static.', err);
        }
      });
  });
})();

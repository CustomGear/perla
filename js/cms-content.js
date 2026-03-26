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

  function renderReels(home) {
    var grid = document.querySelector('.home-reels .featured-work__grid');
    if (!grid) return;

    var tiles = (home && home.reels) || [];
    if (!Array.isArray(tiles) || tiles.length === 0) return;

    var delays = ['animate-delay-1', 'animate-delay-2', 'animate-delay-3', 'animate-delay-4'];
    var hasInstagram = false;
    var html = '';

    tiles.slice(0, 4).forEach(function (tile, idx) {
      var delayClass = delays[idx] || '';
      var slotClass = 'featured-work__slot animate-on-scroll ' + delayClass;

      if (tile && tile.type === 'instagram' && tile.instagramUrl) {
        hasInstagram = true;
        html += '<div class="' + slotClass + '">';
        html +=
          '<blockquote class="instagram-media" data-instgrm-permalink="' +
          escapeAttr(tile.instagramUrl) +
          '" data-instgrm-version="14"></blockquote>';
        html += '</div>';
        return;
      }

      if (tile && tile.type === 'video' && tile.videoUrl) {
        var posterAttr = tile.coverImage ? ' poster="' + escapeAttr(tile.coverImage) + '"' : '';
        html += '<div class="' + slotClass + '">';
        html +=
          '<video class="perla-reel-video" controls playsinline preload="metadata"' +
          posterAttr +
          ' style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">';
        html += '<source src="' + escapeAttr(tile.videoUrl) + '" type="video/mp4" />';
        html += '</video>';
        html += '</div>';
        return;
      }

      html += '<div class="' + slotClass + '"></div>';
    });

    grid.innerHTML = html;

    if (hasInstagram && window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
      window.instgrm.Embeds.process();
    }
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

    if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
      window.instgrm.Embeds.process();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetchJson('/content/site.json')
      .then(function (data) {
        // Home
        if (document.body && document.body.classList.contains('page-home')) {
          setText('.hero__kicker', data.home && data.home.kicker);
          setHtml('.hero__title', escapeAttr((data.home && data.home.nameLine1) || '') + '<br>' + escapeAttr((data.home && data.home.nameLine2) || ''));
          setText('.hero__role', data.home && data.home.role);
          setText('.hero__tagline', data.home && data.home.tagline);
          setText('.hero__callout', (data.home && data.home.callout) ? '✦ ' + data.home.callout : '');
          if (data.home && data.home.heroPortrait) {
            setImage('.hero__image', data.home.heroPortrait);
          }
          renderReels(data.home);
        }

        // About
        if (document.body && document.body.classList.contains('page-about')) {
          if (data.about && data.about.intro) {
            setHtml('[data-cms="about-intro"]', String(data.about.intro).replace(/\n/g, '<br>'));
          }
        }

        // Services
        if (document.body && document.body.classList.contains('page-services')) {
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

        // Work with me
        if (document.body && document.body.classList.contains('page-work-with-me')) {
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
        }

        // Gallery
        if (document.body && document.body.classList.contains('page-gallery')) {
          renderGallery(data.gallery);
        }
      })
      .catch(function () {
        // Fail silently; static content remains.
      });
  });
})();


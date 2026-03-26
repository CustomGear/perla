/**
 * Contact config — edit this file to update contact info across the site.
 * Used by work-with-me.html and can be extended for footer, etc.
 */
(function() {
  'use strict';

  var CONTACT = {
    name: 'Perla Desjardins',
    email: 'collabs@perladesjardins.com',
    instagram: 'https://www.instagram.com/perla.desjardins/',
    instagramHandle: '@perla.desjardins',
    location: 'Ottawa, ON',
    tagline: 'UGC Creator · Beauty · Fashion · Lifestyle',
    portrait: 'images/hero-portrait.png'
  };

  function init() {
    // Email link
    var emailLink = document.getElementById('contact-email');
    if (emailLink) {
      emailLink.href = 'mailto:' + CONTACT.email;
      var emailVal = emailLink.querySelector('[data-contact-value]');
      if (emailVal) emailVal.textContent = CONTACT.email;
    }

    // Instagram link
    var igLink = document.getElementById('contact-instagram');
    if (igLink) {
      igLink.href = CONTACT.instagram;
      var igVal = igLink.querySelector('[data-contact-value]');
      if (igVal) igVal.textContent = CONTACT.instagramHandle;
    }

    // Location (static)
    var locationEl = document.querySelector('[data-contact="location"] [data-contact-value]');
    if (locationEl) locationEl.textContent = CONTACT.location;

    // Profile name & tagline
    var nameEl = document.querySelector('.work-contact-card__name');
    if (nameEl) nameEl.textContent = CONTACT.name;
    var taglineEl = document.querySelector('.work-contact-card__tagline');
    if (taglineEl) taglineEl.textContent = CONTACT.tagline;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Run after https://identity.netlify.com/v1/netlify-identity-widget.js
 * Invite / password-recovery links need the widget on the page or the token is ignored.
 */
(function () {
  if (!window.netlifyIdentity) return;
  window.netlifyIdentity.on('init', function (user) {
    if (!user) {
      window.netlifyIdentity.on('login', function () {
        window.location.href = '/admin/';
      });
    }
  });
})();

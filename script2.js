// Toggles the nav between its two Figma states:
// - default ("1136"): flat bar at the very top of the page
// - .is-scrolled ("1137"): floating glass pill once the page has scrolled
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;

  var THRESHOLD = 24; // px scrolled before switching states

  function updateNavState() {
    var scrolled = window.scrollY > THRESHOLD;
    nav.classList.toggle('is-scrolled', scrolled);
  }

  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });
})();

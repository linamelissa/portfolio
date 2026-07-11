// script2.js — everything for this page: nav scroll-state toggle + hero.
// Kept as a single file on purpose.

// --- Navigation: toggles between its two Figma states -----------------
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

// --- Hero -----------------------------------------------------------------
// The hero itself is intentionally free of JS dependencies:
// - "CV herunterladen" is a real download link (a[download])
// - "Über mich" and the scroll indicator are real anchor links
// - scroll-behavior: smooth in styles2.css handles smooth scrolling with no JS
//
// This space is ready for future interactions (e.g. highlighting the active
// nav item while scrolling) once more page sections are added.

// --- Entrance animation: measure exactly where the nav logo sits, so the
// traveling name-pill can dock pixel-perfectly into that spot regardless
// of viewport width. Sets --pill-dock-x / --pill-dock-y, read by the
// pill-journey keyframes in styles2.css.
(function () {
  var navLogo = document.getElementById('nav-logo');
  if (!navLogo) return;

  function setDockPosition() {
    var rect = navLogo.getBoundingClientRect();
    document.documentElement.style.setProperty('--pill-dock-x', rect.left + 'px');
    document.documentElement.style.setProperty('--pill-dock-y', (rect.top + rect.height / 2) + 'px');
  }

  setDockPosition();
  window.addEventListener('resize', setDockPosition);
})();

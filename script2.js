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

  // Web fonts (Inter) often finish loading a beat after this script runs.
  // If the nav logo's font swaps in afterward, its measured position can
  // shift slightly — re-measure once fonts are actually ready so the pill
  // docks against the FINAL rendered position, not a fallback-font guess.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setDockPosition);
  }
  window.addEventListener('load', setDockPosition);
})();

// --- Entrance animation: click ripple + comet trail ------------------------
// Timed to match the pill-journey keyframes in styles2.css (2s total):
// click happens at 44% (~0.88s), travel runs from 54% to 88% (~1.08s-1.76s).
(function () {
  var pill = document.getElementById('name-pill');
  if (!pill) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var DURATION = 2000;
  var CLICK_AT = DURATION * 0.44;
  var TRAVEL_START = DURATION * 0.54;
  var TRAVEL_END = DURATION * 0.88;

  function spawnRipple(x, y) {
    var ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '90px';
    ripple.style.height = '90px';
    document.body.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 750);
  }

  function spawnTrailDot(x, y) {
    var dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    document.body.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 650);
  }

  // Ripple, once, right at the click moment
  setTimeout(function () {
    var rect = pill.getBoundingClientRect();
    spawnRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, CLICK_AT);

  // Trail dots sampled at intervals while the pill travels (not before)
  var travelInterval;
  setTimeout(function () {
    travelInterval = setInterval(function () {
      var rect = pill.getBoundingClientRect();
      spawnTrailDot(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }, 70);
  }, TRAVEL_START);

  setTimeout(function () {
    if (travelInterval) clearInterval(travelInterval);
  }, TRAVEL_END);
})();

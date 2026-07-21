(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------
     Nav shadow on scroll
  ---------------------------------- */
  var topnav = document.getElementById('topnav');

  function handleNavScroll() {
    if (window.scrollY > 12) {
      topnav.classList.add('is-scrolled');
    } else {
      topnav.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------------------------------
     Reveal on scroll
  ---------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------
     Animated stat bars + counters
     (triggered once, on scroll into view)
  ---------------------------------- */
  function animateCount(el, target, duration) {
    var suffix = el.getAttribute('data-count-suffix') || '%';
    var start = 0;
    var startTime = null;

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      var value = Math.round(start + (target - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  var countEls = document.querySelectorAll('[data-count-to]');
  var barEls = document.querySelectorAll('[data-target]');

  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    countEls.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10);
      animateCount(el, target, 1100);
    });

    barEls.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      requestAnimationFrame(function () {
        el.style.width = target + '%';
      });
    });
  }

  var statsTrigger = document.querySelector('.card--flat');
  if (statsTrigger) {
    if (!('IntersectionObserver' in window)) {
      animateStats();
    } else {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });
      statsObserver.observe(statsTrigger);
    }
  }

  /* ---------------------------------
     TOC scrollspy
     (only sections that actually exist on this page)
  ---------------------------------- */
  var sectionMap = [
    { id: 'problem', key: 'problem' },
    { id: 'ueberblick', key: 'prototyp' }
  ];

  var tocLinks = document.querySelectorAll('.toc__link');

  function setActiveToc(key) {
    tocLinks.forEach(function (link) {
      link.classList.toggle('toc__link--active', link.getAttribute('data-toc') === key);
    });
  }

  if ('IntersectionObserver' in window) {
    var scrollSpyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var match = sectionMap.find(function (s) { return s.id === entry.target.id; });
          if (match) setActiveToc(match.key);
        }
      });
    }, { threshold: 0, rootMargin: '-40% 0px -50% 0px' });

    sectionMap.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el) scrollSpyObserver.observe(el);
    });
  }

  /* Smooth-scroll for TOC links that point to real sections */
  tocLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    }
  });

})();

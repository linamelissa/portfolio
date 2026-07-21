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
    var startTime = null;

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      el.classList.add('is-done');
      return;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.classList.add('is-done');
        setTimeout(function () { el.classList.remove('is-done'); }, 300);
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
     Zitat-Karte: linker Rand "zeichnet" sich,
     sobald die Karte sichtbar wird
  ---------------------------------- */
  var quoteCard = document.querySelector('.card--quote');
  if (quoteCard) {
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      quoteCard.classList.add('is-visible');
    } else {
      var quoteObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            quoteObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      quoteObserver.observe(quoteCard);
    }
  }

  /* ---------------------------------
     Sanfter 3D-Tilt auf Karten
     (folgt der Mausposition, nur bei Geräten mit Maus)
  ---------------------------------- */
  var supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover && !prefersReducedMotion) {
    var tiltCards = document.querySelectorAll('.card--overview, .card--stat');

    tiltCards.forEach(function (card) {
      var rect = null;

      card.addEventListener('mouseenter', function () {
        rect = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateX = (y * -6).toFixed(2);
        var rotateY = (x * 6).toFixed(2);
        card.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        rect = null;
      });
    });
  }

  /* ---------------------------------
     TOC-Scrollspy: der jeweils passende
     Punkt leuchtet dunkelgrün auf, während
     man durch die Seite scrollt
  ---------------------------------- */
  var tocLinks = document.querySelectorAll('.toc__link');

  function setActiveToc(key) {
    tocLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-toc') === key);
    });
  }

  // Standard: "Prototyp & Lösung" ist aktiv (Hero + Überblick gehören zu diesem Kapitel)
  setActiveToc('prototyp');

  var problemSection = document.getElementById('problem');
  if (problemSection && 'IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        setActiveToc(entry.isIntersecting ? 'problem' : 'prototyp');
      });
    }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

    spyObserver.observe(problemSection);
  }

  /* Smooth-scroll für TOC-Links, die auf reale Sections zeigen */
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

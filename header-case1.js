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
     Scroll-Fortschritt (immer sichtbar, ganz oben)
  ---------------------------------- */
  var scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  if (scrollProgress) {
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();
  }

  /* ---------------------------------
     Reveal on scroll
     Bewusst NICHT nur IntersectionObserver: bei sehr schnellem
     Scrollen (z.B. Scrollbar-Ziehen) kann ein einmaliger
     Intersection-Callback verpasst werden, und Elemente blieben
     dann für immer unsichtbar. Diese Prüfung läuft stattdessen
     bei jedem Scroll erneut über die tatsächliche Position —
     dadurch kann nichts dauerhaft übersprungen werden.
  ---------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if (prefersReducedMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    revealEls = [];
  } else {
    var checkReveal = function () {
      for (var i = revealEls.length - 1; i >= 0; i--) {
        var rect = revealEls[i].getBoundingClientRect();
        if (rect.top < window.innerHeight + 80) {
          revealEls[i].classList.add('is-visible');
          revealEls.splice(i, 1);
        }
      }
    };

    checkReveal();
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('resize', checkReveal);
    window.addEventListener('load', checkReveal);
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
  var quoteCard = document.querySelector('.card--quote');
  var extraTriggers = [];
  if (statsTrigger) extraTriggers.push({ el: statsTrigger, fn: animateStats });
  if (quoteCard) extraTriggers.push({ el: quoteCard, fn: function () { quoteCard.classList.add('is-visible'); } });

  if (prefersReducedMotion) {
    extraTriggers.forEach(function (t) { t.fn(); });
  } else {
    var checkExtraTriggers = function () {
      for (var i = extraTriggers.length - 1; i >= 0; i--) {
        var rect = extraTriggers[i].el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 80) {
          extraTriggers[i].fn();
          extraTriggers.splice(i, 1);
        }
      }
    };
    checkExtraTriggers();
    window.addEventListener('scroll', checkExtraTriggers, { passive: true });
    window.addEventListener('resize', checkExtraTriggers);
    window.addEventListener('load', checkExtraTriggers);
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
     man durch die Seite scrollt.
     Scroll-Position-basiert (wie bei den Research-Boxen),
     damit es in BEIDE Scroll-Richtungen zuverlässig funktioniert —
     kein Verlassen auf Enter/Exit-Events, die bei schnellem oder
     rückwärtigem Scrollen Lücken lassen können.
  ---------------------------------- */
  var tocLinks = document.querySelectorAll('.toc__link');

  function setActiveToc(key) {
    tocLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-toc') === key);
    });
  }

  // Alle Sections in Dokument-Reihenfolge, inklusive eines synthetischen
  // "prototyp"-Eintrags ganz am Anfang als Standard-Fallback
  var spySections = [{ key: 'prototyp', el: document.body }];
  tocLinks.forEach(function (link) {
    var key = link.getAttribute('data-toc');
    if (key === 'prototyp') return;
    var href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      var el = document.querySelector(href);
      if (el) spySections.push({ key: key, el: el });
    }
  });

  // Nach tatsächlicher Position auf der Seite sortieren, damit die
  // Reihenfolge im Dokument stimmt, unabhängig von der Sidebar-Reihenfolge
  spySections.sort(function (a, b) { return a.el.offsetTop - b.el.offsetTop; });

  if (spySections.length > 1) {
    var tocRefOffset = 140;

    var updateActiveToc = function () {
      var refLine = window.scrollY + tocRefOffset;
      var current = spySections[0];
      spySections.forEach(function (s) {
        if (s.el.offsetTop <= refLine) current = s;
      });
      setActiveToc(current.key);
    };

    window.addEventListener('scroll', updateActiveToc, { passive: true });
    window.addEventListener('resize', updateActiveToc);
    window.addEventListener('load', updateActiveToc);
    updateActiveToc();
  } else {
    setActiveToc('prototyp');
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

  /* ---------------------------------
     Research: Punkte-Raster "1 von 52"
  ---------------------------------- */
  var dotGrid = document.getElementById('dotGrid');
  if (dotGrid) {
    var totalDots = 52;
    var accentIndex = 38; // rein optische Platzierung des einen farbigen Punkts
    for (var i = 0; i < totalDots; i++) {
      var dot = document.createElement('span');
      dot.className = 'dot-grid__dot' + (i === accentIndex ? ' is-accent' : '');
      dotGrid.appendChild(dot);
    }
  }

  /* ---------------------------------
     Research: Sticky Stat-Boxen — die passende Box
     wird aktiv, während man durch die Blöcke scrollt.
     Scroll-Position-basiert statt IntersectionObserver-Band,
     damit der Wechsel exakt und ohne Flackern passiert.
  ---------------------------------- */
  var statMinis = document.querySelectorAll('.stat-mini');
  var researchBlocks = document.querySelectorAll('.research__block');
  var statsWrap = document.querySelector('.research__stats-wrap');

  var currentActiveStat = null;

  function setActiveStat(key) {
    if (key === currentActiveStat) return;
    currentActiveStat = key;

    statMinis.forEach(function (el) {
      var isMatch = el.getAttribute('data-stat') === key;
      el.classList.toggle('is-active', isMatch);
      el.classList.remove('is-switching');
      if (isMatch) {
        // kurzer Puls, damit der Wechsel klar erkennbar ist
        requestAnimationFrame(function () {
          el.classList.add('is-switching');
        });
      }
    });
  }

  if (researchBlocks.length) {
    var refOffset = statsWrap ? statsWrap.offsetHeight + 80 : 160;

    var updateActiveStat = function () {
      var refLine = window.scrollY + refOffset;
      var current = researchBlocks[0];
      researchBlocks.forEach(function (block) {
        if (block.offsetTop <= refLine) current = block;
      });
      setActiveStat(current.getAttribute('data-stat-trigger'));
    };

    window.addEventListener('scroll', updateActiveStat, { passive: true });
    window.addEventListener('resize', updateActiveStat);
    window.addEventListener('load', updateActiveStat);
    updateActiveStat();

    /* ---------------------------------
       Ein Scroll = ein Block. Innerhalb der Research-Blöcke
       springt jede Wheel-Geste direkt zum nächsten/vorherigen
       Block, statt frei durchzuscrollen. Am ersten/letzten
       Block gibt die Seite den normalen Scroll wieder frei,
       damit man nie "gefangen" ist.
    ---------------------------------- */
    if (!prefersReducedMotion) {
      var isPaging = false;
      var blocksArr = Array.prototype.slice.call(researchBlocks);
      var researchSectionEl = document.getElementById('research');

      var getCurrentBlockIndex = function () {
        var idx = 0;
        blocksArr.forEach(function (block, i) {
          if (block.offsetTop <= window.scrollY + refOffset) idx = i;
        });
        return idx;
      };

      var goToBlock = function (index) {
        if (index < 0 || index >= blocksArr.length) return false;
        isPaging = true;
        blocksArr[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function () { isPaging = false; }, 700);
        return true;
      };

      window.addEventListener('wheel', function (e) {
        if (isPaging || !researchSectionEl) return;

        var rect = researchSectionEl.getBoundingClientRect();
        var withinResearch = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
        if (!withinResearch) return;

        var idx = getCurrentBlockIndex();
        var goingDown = e.deltaY > 0;
        var nextIndex = goingDown ? idx + 1 : idx - 1;

        // Am Rand (erster Block hoch / letzter Block runter) normalen Scroll zulassen
        if (nextIndex < 0 || nextIndex >= blocksArr.length) return;

        e.preventDefault();
        goToBlock(nextIndex);
      }, { passive: false });
    }
  }

  /* ---------------------------------
     Research: Balken + Zähler in den Daten-Karten
     animieren, sobald die jeweilige Karte sichtbar wird
  ---------------------------------- */
  var dataCards = document.querySelectorAll('.data-card');

  function animateDataCard(card) {
    card.querySelectorAll('.data-bar__fill').forEach(function (fill) {
      var target = parseFloat(fill.getAttribute('data-target'));
      requestAnimationFrame(function () {
        fill.style.width = target + '%';
      });
    });

    var bigNum = card.querySelector('[data-count-to]');
    if (bigNum) {
      var target2 = parseInt(bigNum.getAttribute('data-count-to'), 10);
      animateCount(bigNum, target2, 1000);
    }
  }

  if (dataCards.length) {
    if (prefersReducedMotion) {
      dataCards.forEach(animateDataCard);
    } else {
      var pendingDataCards = Array.prototype.slice.call(dataCards);

      var checkDataCards = function () {
        for (var i = pendingDataCards.length - 1; i >= 0; i--) {
          var rect = pendingDataCards[i].getBoundingClientRect();
          if (rect.top < window.innerHeight + 80) {
            animateDataCard(pendingDataCards[i]);
            pendingDataCards.splice(i, 1);
          }
        }
      };

      checkDataCards();
      window.addEventListener('scroll', checkDataCards, { passive: true });
      window.addEventListener('resize', checkDataCards);
      window.addEventListener('load', checkDataCards);
    }
  }

})();

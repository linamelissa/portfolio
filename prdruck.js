document.addEventListener('DOMContentLoaded', () => {

  // ---------- Scroll progress bar ----------
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ---------- Sidebar scrollspy ----------
  const navLinks = Array.from(document.querySelectorAll('.nav a[data-nav]'));
  const chapterEls = Array.from(document.querySelectorAll('.nav .chapter'));
  const linkById = {};
  navLinks.forEach(link => { linkById[link.getAttribute('href').slice(1)] = link; });
  const chapterTargets = {};
  chapterEls.forEach(c => { chapterTargets[c.dataset.chapterFor] = c; });

  const watchIds = Object.keys(linkById).concat(Object.keys(chapterTargets));
  const observedEls = watchIds
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(o => o.el)
    .sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top);

  function clearActive() {
    navLinks.forEach(l => l.classList.remove('active'));
    chapterEls.forEach(c => c.classList.remove('active'));
  }
  function setActive(id) {
    clearActive();
    if (linkById[id]) linkById[id].classList.add('active');
    if (chapterTargets[id]) chapterTargets[id].classList.add('active');
  }

  const ACTIVATION_LINE = 140;
  let currentId = null, ticking = false;

  function updateActiveSection() {
    ticking = false;
    const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 4);
    if (atBottom && observedEls.length) {
      const lastId = observedEls[observedEls.length - 1].id;
      if (lastId !== currentId) { currentId = lastId; setActive(lastId); }
      return;
    }
    let candidate = observedEls[0] ? observedEls[0].id : null;
    for (const { id, el } of observedEls) {
      const top = el.getBoundingClientRect().top;
      if (top <= ACTIVATION_LINE) candidate = id; else break;
    }
    if (candidate && candidate !== currentId) { currentId = candidate; setActive(candidate); }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(updateActiveSection); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateActiveSection();

  // ---------- Scroll-reveal for sections ----------
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // ---------- Chain-step reveal (01 Ausgangslage) ----------
  const chainSteps = document.querySelectorAll('.chain-step');
  if (chainSteps.length) {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .2 });
    chainSteps.forEach((el, i) => { el.style.transitionDelay = (i * .06) + 's'; io.observe(el); });
  }

  // ---------- Custom cursor ----------
  const cursor = document.getElementById('customCursor');
  if (cursor && !window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.classList.add('visible');
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    document.addEventListener('mouseenter', () => cursor.classList.add('visible'));
    const hoverTargets = 'a, button, .fid-shot img, .proof-shot img, .concept-card, .ia-card, .quote-card, .safety-item, .b-shot-wrap img';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ---------- Back to top ----------
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    function toggleBackToTop() { backToTop.classList.toggle('visible', window.scrollY > 700); }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---------- Lightbox for fidelity + proof screenshots ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  function openLightbox(src, alt) {
    if (!lightbox || !src) return;
    lightboxImg.src = src; lightboxImg.alt = alt || '';
    lightbox.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open'); document.body.style.overflow = '';
  }
  document.querySelectorAll('.fid-shot img, .proof-shot img').forEach(img => {
    img.addEventListener('click', () => {
      if (img.closest('.proof-shot, .fid-step')?.classList.contains('is-empty')) return;
      openLightbox(img.src, img.alt);
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // ---------- DE/EN toggle ----------
  let current = 'de';
  function applyLang(lang) {
    const found = document.querySelectorAll('[data-' + lang + ']');
    found.forEach(el => { el.innerHTML = el.getAttribute('data-' + lang); });
    return found.length;
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#lang-toggle');
    if (!btn) return;
    const next = current === 'de' ? 'en' : 'de';
    const count = applyLang(next);
    if (count > 0) { current = next; btn.textContent = current === 'de' ? 'EN' : 'DE'; document.documentElement.setAttribute('lang', current); }
  });

  // ---------- Dark-behind body toggle (for topbar contrast, if a dark chapter sits at top) ----------
  const pill = document.querySelector('.topbar-inner');
  function updateTopbarContrast() {
    // No scroll-linked dark hero on this page, so topbar stays in its light state.
  }
  updateTopbarContrast();
});

// ---------- Alt/Neu Vergleich: synchrones Scrollen (pro Container getrennt) ----------
(function(){
  document.querySelectorAll('.compare-scroll').forEach(function(container){
    var viewports = container.querySelectorAll('.compare-viewport');
    if (viewports.length < 2) return;
    var syncing = false;
    viewports.forEach(function(vp){
      vp.addEventListener('scroll', function(){
        if (syncing) return;
        syncing = true;
        var range = vp.scrollHeight - vp.clientHeight;
        var pct = range > 0 ? vp.scrollTop / range : 0;
        viewports.forEach(function(other){
          if (other === vp) return;
          var otherRange = other.scrollHeight - other.clientHeight;
          other.scrollTop = pct * otherRange;
        });
        syncing = false;
      }, { passive: true });
    });
  });
})();

// ---------- Alt/Neu Vergleich: Klick öffnet groß & scrollbar ----------
(function(){
  var lb = document.getElementById('compareLightbox');
  var closeBtn = document.getElementById('compareLightboxClose');
  if (!lb) return;
  function open(){
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('#compareScroll .compare-viewport').forEach(function(vp){
    vp.addEventListener('click', function(){
      if (vp.classList.contains('is-empty')) return;
      open();
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
})();
(function(){
  var hero = document.getElementById('ueberblick');
  if(!hero) return;
  function update(){
    var rect = hero.getBoundingClientRect();
    var pastHero = rect.bottom < window.innerHeight * 0.5;
    document.body.classList.toggle('side-on', pastHero);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ---------- Sidebar bei "Über mich" ausblenden ----------
(function(){
  var sidebar = document.querySelector('.sidebar');
  var boundary = document.getElementById('ueber-mich-cs');
  if (!sidebar || !boundary) return;
  function toggle(){
    var rect = boundary.getBoundingClientRect();
    sidebar.classList.toggle('is-hidden', rect.top < window.innerHeight * 0.5);
  }
  window.addEventListener('scroll', toggle, { passive: true });
  window.addEventListener('resize', toggle);
  toggle();
})();

// ---------- Hero: Alt→Neu-Wipe läuft automatisch per CSS-Animation (siehe prdruck.css) ----------

// ---------- Zahlen zählen beim Erscheinen hoch (Hero-Stats & Co.) ----------
(function(){
  var targets = document.querySelectorAll('.hero-stats b');
  if (!targets.length) return;

  function animateCount(el){
    var text = el.textContent.trim();
    var match = text.match(/^([^\d]*)(\d+)([^\d]*)$/);
    if (!match) return; // kein reiner Zahlenwert enthalten, nichts animieren
    var prefix = match[1], target = parseInt(match[2], 10), suffix = match[3];
    var duration = 900;
    var startTime = null;
    function step(ts){
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  targets.forEach(function(el){ io.observe(el); });
})();

// ---------- Micro-Animation: sanftes Parallax auf dem Hero-Bild ----------
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var wrap = document.getElementById('heroSplitImage');
  if (!wrap) return;
  var raf = null;
  function update(){
    raf = null;
    var y = Math.min(window.scrollY * 0.08, 40);
    wrap.style.transform = 'translateY(' + y.toFixed(1) + 'px)';
  }
  function onScroll(){ if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();

/* ============================================================
   sameSpot · Mobile-Layer
   Kapitel-Pille unten + Bottom-Sheet mit der kompletten Navigation
   (ersetzt die Sidebar unter 860px). 
   ============================================================ */
(function () {
  var mq = window.matchMedia('(max-width:860px)');
  var srcNav = document.querySelector('.sidebar .nav');
  if (!srcNav) return;

  var lang = function () { return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'de'; };
  var T = {
    de: { title: 'Kapitel', open: 'Kapitelübersicht öffnen', close: 'Schließen', figma: 'Datei in Figma öffnen', start: 'Überblick' },
    en: { title: 'Chapters', open: 'Open chapter overview', close: 'Close', figma: 'Open file in Figma', start: 'Overview' }
  };

  /* ---------- Elemente bauen ---------- */
  var pill = document.createElement('button');
  pill.type = 'button';
  pill.className = 'mnav-pill';
  pill.setAttribute('aria-haspopup', 'dialog');
  pill.setAttribute('aria-expanded', 'false');
  pill.setAttribute('aria-controls', 'mnavSheet');
  pill.innerHTML = '<span class="mnav-num">01</span><span class="mnav-label"></span><span class="mnav-chev" aria-hidden="true"></span>';

  var backdrop = document.createElement('div');
  backdrop.className = 'mnav-backdrop';

  var sheet = document.createElement('div');
  sheet.className = 'mnav-sheet';
  sheet.id = 'mnavSheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('tabindex', '-1');

  var handle = document.createElement('div');
  handle.className = 'mnav-handle';
  var title = document.createElement('span');
  title.className = 'mnav-title';
  var list = document.createElement('nav');
  list.className = 'mnav-list';

  // Links aus der Sidebar übernehmen (inkl. data-de/data-en für den Sprachumschalter)
  Array.prototype.forEach.call(srcNav.querySelectorAll('a[data-nav]'), function (a) {
    var c = a.cloneNode(true);
    c.classList.remove('active');
    list.appendChild(c);
  });

  var figmaSrc = document.querySelector('.nav-figma a');
  var figma = null;
  if (figmaSrc) {
    figma = document.createElement('a');
    figma.className = 'mnav-figma';
    figma.href = figmaSrc.href;
    figma.target = '_blank';
    figma.rel = 'noopener';
    figma.innerHTML = '<span></span><svg viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  sheet.appendChild(handle);
  sheet.appendChild(title);
  sheet.appendChild(list);
  if (figma) sheet.appendChild(figma);
  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);
  document.body.appendChild(pill);

  /* ---------- Kapitel-Erkennung ---------- */
  var chapterLinks = Array.prototype.slice.call(list.querySelectorAll('a.chapter'));
  var allLinks = Array.prototype.slice.call(list.querySelectorAll('a'));
  var targets = allLinks.map(function (a) {
    return { a: a, el: document.getElementById(a.getAttribute('href').slice(1)) };
  }).filter(function (t) { return t.el; });

  var firstChapterLink = list.querySelector('a.chapter');
  var firstChapter = firstChapterLink ? document.getElementById(firstChapterLink.getAttribute('href').slice(1)) : null;
  var aboutEnd = document.getElementById('ueber-mich-cs');
  var currentLink = null;

  function chapterOf(link) {
    // zum aktiven Unterpunkt das übergeordnete Kapitel finden
    var idx = allLinks.indexOf(link), ch = null;
    for (var i = 0; i <= idx; i++) if (allLinks[i].classList.contains('chapter')) ch = allLinks[i];
    return ch;
  }

  function labelText(link) {
    var spans = link.querySelectorAll('span');
    return (spans.length ? spans[spans.length - 1] : link).textContent.trim();
  }

  function update() {
    var line = 120, cur = null;
    targets.forEach(function (t) { if (t.el.getBoundingClientRect().top <= line) cur = t.a; });
    if (cur !== currentLink) {
      currentLink = cur;
      allLinks.forEach(function (a) { a.classList.toggle('is-current', a === cur); });
    }
    var ch = cur ? chapterOf(cur) : null;
    var num = pill.querySelector('.mnav-num');
    var lab = pill.querySelector('.mnav-label');
    if (ch) {
      num.textContent = ch.querySelector('.num').textContent;
      lab.textContent = labelText(ch);
    } else {
      num.textContent = '00';
      lab.textContent = T[lang()].start;
    }

    // sichtbar ab Kapitel 01, bis „Über mich“ ins Bild kommt
    var vh = window.innerHeight;
    var show = mq.matches &&
      (firstChapter ? firstChapter.getBoundingClientRect().top < vh * 0.85 : true) &&
      (!aboutEnd || aboutEnd.getBoundingClientRect().top > vh * 0.6);
    pill.classList.toggle('is-on', show || document.body.classList.contains('mnav-open'));
  }

  function texts() {
    var t = T[lang()];
    title.textContent = t.title;
    pill.setAttribute('aria-label', t.open);
    sheet.setAttribute('aria-label', t.title);
    if (figma) figma.querySelector('span').textContent = t.figma;
    update();
  }

  /* ---------- Öffnen / Schließen ---------- */
  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    document.body.classList.add('mnav-open');
    pill.setAttribute('aria-expanded', 'true');
    var cur = list.querySelector('.is-current');
    if (cur) cur.scrollIntoView({ block: 'center' });
    sheet.focus({ preventScroll: true });
  }
  function close() {
    document.body.classList.remove('mnav-open');
    pill.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  pill.addEventListener('click', function () {
    document.body.classList.contains('mnav-open') ? close() : open();
  });
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('mnav-open')) close();
  });

  list.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    close();
    // erst nach dem Schließen scrollen, sonst blockiert overflow:hidden
    requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Nach unten wischen schließt das Sheet
  var startY = null;
  sheet.addEventListener('touchstart', function (e) {
    startY = sheet.scrollTop <= 0 ? e.touches[0].clientY : null;
  }, { passive: true });
  sheet.addEventListener('touchmove', function (e) {
    if (startY === null) return;
    var dy = e.touches[0].clientY - startY;
    if (dy > 0) sheet.style.transform = 'translateY(' + dy + 'px)';
  }, { passive: true });
  sheet.addEventListener('touchend', function (e) {
    if (startY === null) return;
    var dy = e.changedTouches[0].clientY - startY;
    sheet.style.transform = '';
    startY = null;
    if (dy > 90) close();
  });

  /* ---------- Laufzeit ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  (mq.addEventListener ? mq.addEventListener('change', function () { if (!mq.matches) close(); update(); })
                       : mq.addListener(function () { if (!mq.matches) close(); update(); }));

  // Sprachumschalter: Texte der Pille/des Sheets nachziehen
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#lang-toggle')) setTimeout(texts, 0);
  });

  texts();
})();

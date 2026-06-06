// ===== SCROLL SPY für die fixe Sidebar =====
const csSections = document.querySelectorAll('.cs-section[id]');
const csNavItems = document.querySelectorAll('.cs-nav-item');

function updateActiveNav(){
  let current = '';
  const scrollPos = window.scrollY + 220;
  csSections.forEach(sec => {
    if(scrollPos >= sec.offsetTop) current = sec.id;
  });
  csNavItems.forEach(item => {
    item.classList.toggle('active', item.dataset.target === current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive:true });
updateActiveNav();

// Klick auf Sidebar -> sanft scrollen
csNavItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(item.dataset.target);
    if(target){
      const y = target.offsetTop - 90;
      window.scrollTo({ top:y, behavior:'smooth' });
    }
  });
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if(en.isIntersecting){
      const delay = en.target.dataset.delay || 0;
      setTimeout(() => en.target.classList.add('cs-visible'), delay);
      revealObs.unobserve(en.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function observeStagger(selector, step = 90){
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('cs-reveal');
    el.dataset.delay = i * step;
    revealObs.observe(el);
  });
}
function observeSimple(selector){
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('cs-reveal');
    revealObs.observe(el);
  });
}

observeStagger('.cs-content-card', 90);
observeStagger('.cs-card', 90);
observeStagger('.cs-stat-block', 70);
observeStagger('.cs-hypothesis', 60);
observeStagger('.cs-ba-col', 120);
observeStagger('.cs-othercase-card', 100);
observeStagger('.cs-hero-tag', 40);
observeSimple('.cs-statement');
observeSimple('.cs-section-title');
observeSimple('.cs-section-sub');
observeSimple('.cs-callout');
observeSimple('.cs-image-block');
observeSimple('.cs-subsection-title');

// ===== HERO TITLE — Buchstabe für Buchstabe =====
(function splitHeroTitle(){
  const title = document.querySelector('.cs-hero-title');
  if(!title || title.dataset.split) return;
  title.dataset.split = '1';
  const text = title.textContent;
  title.innerHTML = text.split('').map((ch, i) =>
    `<span class="cs-title-char" style="animation-delay:${i * 28}ms">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');
})();

// ===== HERO META + INTRO slide up =====
const heroMeta = document.querySelector('.cs-meta');
const heroIntro = document.querySelector('.cs-intro-box');
if(heroMeta){ heroMeta.style.animationDelay = '500ms'; heroMeta.classList.add('cs-slide-up'); }
if(heroIntro){ heroIntro.style.animationDelay = '600ms'; heroIntro.classList.add('cs-slide-up'); }

// ===== STAT COUNTER =====
function animateCounter(el, target, suffix){
  const duration = 900;
  const startTime = performance.now();
  function step(now){
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if(en.isIntersecting){
      const raw = en.target.textContent.trim();
      const num = parseInt(raw);
      const suffix = raw.replace(/[0-9]/g, '');
      if(!isNaN(num)) animateCounter(en.target, num, suffix);
      counterObs.unobserve(en.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.cs-stat-num').forEach(el => counterObs.observe(el));

// ===== PROGRESS BAR =====
const progressBar = document.getElementById('progress-bar');
function updateProgress(){
  const dh = document.documentElement.scrollHeight - window.innerHeight;
  if(progressBar) progressBar.style.width = (dh > 0 ? (window.scrollY / dh) * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProgress, { passive:true });
window.addEventListener('scroll', () => {
  document.querySelector('nav')?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('custom-cursor');
if(cursor){
  let mx=0, my=0, cx=0, cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function animCursor(){
    cx += (mx-cx)*0.15; cy += (my-cy)*0.15;
    cursor.style.left = cx+'px'; cursor.style.top = cy+'px';
    requestAnimationFrame(animCursor);
  })();
  document.querySelectorAll('a,button,.cs-content-card,.cs-card,.cs-stat-block,.cs-othercase-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}

// ===== HOVER TILT auf Karten =====
document.querySelectorAll('.cs-content-card, .cs-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== LANG TOGGLE (falls script.js nicht geladen) =====
if(typeof toggleLang === 'undefined'){
  window.toggleLang = function(){
    const btn = document.getElementById('lang-btn');
    const isDE = btn && btn.textContent.trim() === 'EN';
    const lang = isDE ? 'en' : 'de';
    if(btn) btn.textContent = isDE ? 'DE' : 'EN';
    document.querySelectorAll('[data-de]').forEach(el => {
      const text = lang === 'de' ? el.dataset.de : el.dataset.en;
      if(text){ if(text.indexOf('<') !== -1){ el.innerHTML = text; } else { el.textContent = text; } }
    });
  };
}

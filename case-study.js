// ===== SCROLL SPY für die fixe Sidebar =====
(function(){

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

function observeStagger(selector, step){
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

// ===== HERO TITLE =====
const csHeroTitle = document.querySelector('.cs-hero-title');
if(csHeroTitle && !csHeroTitle.dataset.split){
  csHeroTitle.dataset.split = '1';
  const text = csHeroTitle.textContent;
  csHeroTitle.innerHTML = text.split('').map((ch, i) =>
    `<span class="cs-title-char" style="animation-delay:${i * 28}ms">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');
}

// ===== HERO META + INTRO =====
const csHeroMeta = document.querySelector('.cs-meta');
const csHeroIntro = document.querySelector('.cs-intro-box');
if(csHeroMeta){ csHeroMeta.style.animationDelay = '500ms'; csHeroMeta.classList.add('cs-slide-up'); }
if(csHeroIntro){ csHeroIntro.style.animationDelay = '600ms'; csHeroIntro.classList.add('cs-slide-up'); }

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
const csCounterObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if(en.isIntersecting){
      const raw = en.target.textContent.trim();
      const num = parseInt(raw);
      const suffix = raw.replace(/[0-9]/g, '');
      if(!isNaN(num)) animateCounter(en.target, num, suffix);
      csCounterObs.unobserve(en.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.cs-stat-num').forEach(el => csCounterObs.observe(el));

// ===== HOVER TILT =====
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

})(); // Ende IIFE, verhindert Konflikte mit script.js


/* sameSpot Case Study: Timeline & Domino (gekapselt) */
(function(){
  if(!('IntersectionObserver' in window)) {
    document.querySelectorAll('.js-timeline').forEach(function(el){el.classList.add('lit');});
    document.querySelectorAll('.js-domino').forEach(function(el){el.classList.add('fall');});
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add(e.target.classList.contains('js-domino') ? 'fall' : 'lit');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.js-timeline, .js-domino').forEach(function(el){ io.observe(el); });
})();


/* sameSpot Case Study: Count-up, Balken, Toggles (gekapselt) */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el){
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var suf = el.dataset.suffix || '';
    var pre = el.dataset.prefix || '';
    if(reduce){ el.textContent = pre + target.toFixed(dec) + suf; return; }
    var dur = 1100, t0 = performance.now();
    (function step(now){
      var p = Math.min((now - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (e * target).toFixed(dec) + suf;
      if(p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          if(en.target.hasAttribute('data-count')) countUp(en.target);
          else en.target.classList.add('lit');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-count], .js-lit').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('[data-count]').forEach(countUp);
    document.querySelectorAll('.js-lit').forEach(function(el){ el.classList.add('lit'); });
  }

  // Low-Fi Segmented Toggle
  document.querySelectorAll('[data-lowfi-toggle]').forEach(function(wrap){
    wrap.querySelectorAll('.cs-seg-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        wrap.querySelectorAll('.cs-seg-btn').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        wrap.setAttribute('data-mode', btn.dataset.mode);
      });
    });
  });

  // Design System Tabs
  document.querySelectorAll('[data-tabs]').forEach(function(tabs){
    tabs.querySelectorAll('.cs-ds-tab').forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.querySelectorAll('.cs-ds-tab').forEach(function(t){ t.classList.remove('active'); });
        tab.classList.add('active');
      });
    });
  });
})();

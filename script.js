// ===== ICONS (inline SVG) =====
const ICONS = {
  'star':'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  'layout-grid':'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  'zap':'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  'sparkles':'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>',
  'search':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'pen-tool':'<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
  'printer':'<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect width="12" height="8" x="6" y="14" rx="1"/>',
  'layers':'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  'user':'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'briefcase':'<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  'graduation-cap':'<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  'award':'<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  'book-open':'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  'map-pin':'<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'calendar':'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  'pen-line':'<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  'folder-open':'<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
  'footprints':'<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>',
  'download':'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  'mail':'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  'external-link':'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  'globe':'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'smartphone':'<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  'route':'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  'package':'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
  'moon':'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'arrow-right':'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'git-branch':'<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  'tool-figma':'<rect x="7" y="3" width="5" height="6" rx="2.5"/><rect x="7" y="9" width="5" height="6" rx="2.5"/><rect x="12" y="3" width="5" height="6" rx="2.5"/><circle cx="14.5" cy="12" r="2.5"/><rect x="7" y="15" width="5" height="6" rx="2.5"/>',
  'tool-app':'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h8v8H8z"/>',
  'tool-pen':'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
  'tool-image':'<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  'tool-cube':'<path d="m21 16-9 5-9-5V8l9-5 9 5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
  'tool-doc':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  'tool-board':'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/>',
  'tool-frame':'<line x1="22" x2="2" y1="6" y2="6"/><line x1="22" x2="2" y1="18" y2="18"/><line x1="6" x2="6" y1="2" y2="22"/><line x1="18" x2="18" y1="2" y2="22"/>',
  'linkedin':'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  'instagram':'<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  'dribbble':'<circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/>',
  'behance':'<path d="M7.5 7H3v10h4.5a3 3 0 0 0 0-6 2.5 2.5 0 0 0 0-4z"/><path d="M3 12h5"/><path d="M14 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/><path d="M15 7h4"/>'
};

function svgIcon(name, cls){
  const path = ICONS[name] || ICONS['star'];
  return '<svg class="lucide '+(cls||'')+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>';
}

function renderIcons(){
  document.querySelectorAll('[data-icon]').forEach(el => {
    if(el.querySelector('svg')) return;
    el.innerHTML = svgIcon(el.dataset.icon);
  });
}
renderIcons();

// ===== SKILLS BANNER =====
const skillsData = [
  {icon:'smartphone', de:'zu viele TikToks', en:'too many TikToks'},
  {icon:'package', de:'zu viele Umzüge', en:'too many moves'},
  {icon:'layout-grid', de:'zu viele Tabs offen', en:'too many tabs open'},
  {icon:'folder-open', de:'zu viele Screenshots', en:'too many screenshots'},
  {icon:'sparkles', de:'zu viele Ideen', en:'too many ideas'},
  {icon:'star', de:'zu viele Favoriten gespeichert', en:'too many favourites saved'},
  {icon:'map-pin', de:'zu viele Städte auf der Liste', en:'too many cities on the list'},
  {icon:'footprints', de:'zu viele Routen zu Fuß gegangen', en:'too many routes walked'}
];

function buildBanner(lang){
  const marquee = document.getElementById('skills-marquee');
  if(!marquee) return;
  let group = '';
  skillsData.forEach(s => {
    group += '<span class="skill-item">'+svgIcon(s.icon)+(lang==='de'?s.de:s.en)+'</span>';
  });
  marquee.innerHTML = '<div class="skills-group">'+group+'</div><div class="skills-group">'+group+'</div><div class="skills-group">'+group+'</div><div class="skills-group">'+group+'</div>';
}

// ===== LANGUAGE =====
let currentLang = 'de';
function toggleLang(){
  currentLang = currentLang === 'de' ? 'en' : 'de';
  const lbl = currentLang === 'de' ? 'EN' : 'DE';
  const lb = document.getElementById('lang-btn'); if(lb) lb.textContent = lbl;
  const lm = document.getElementById('lang-btn-mobile'); if(lm) lm.textContent = lbl;
  document.querySelectorAll('[data-de]').forEach(el => {
    const text = currentLang === 'de' ? el.dataset.de : el.dataset.en;
    if(text){ if(text.indexOf('<') !== -1){ el.innerHTML = text; } else { el.textContent = text; } }
  });
  buildBanner(currentLang);
  document.body.style.transition = 'opacity .2s';
  document.body.style.opacity = '.85';
  setTimeout(() => { document.body.style.opacity = '1'; }, 200);
}

// ===== MOBILE NAV =====
function toggleMobileNav(){
  const nav = document.getElementById('mobile-nav');
  nav.classList.contains('open') ? closeMobileNav() : openMobileNav();
}
let savedScrollY = 0;
function openMobileNav(){
  document.getElementById('mobile-nav').classList.add('open');
  document.querySelector('.nav-mobile-menu').classList.add('active');
  document.querySelector('nav').classList.add('nav-menu-open');
  savedScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}
function closeMobileNav(){
  document.getElementById('mobile-nav').classList.remove('open');
  document.querySelector('.nav-mobile-menu').classList.remove('active');
  document.querySelector('nav').classList.remove('nav-menu-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, savedScrollY);
}
function handleOverlayClick(e){ if(e.target === e.currentTarget) closeMobileNav(); }

// ===== PROGRESS BAR + NAV SCROLL =====
function onScroll(){
  const st = window.scrollY || document.documentElement.scrollTop;
  const dh = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progress-bar').style.width = (dh > 0 ? (st/dh)*100 : 0) + '%';
  document.querySelector('nav').classList.toggle('scrolled', st > 20);
}
window.addEventListener('scroll', onScroll, { passive:true });

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('custom-cursor');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
function animCursor(){
  cx += (mx-cx)*0.15; cy += (my-cy)*0.15;
  if(cursor){ cursor.style.left = cx+'px'; cursor.style.top = cy+'px'; }
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a,button,.masonry-card,.drives-card,.expertise-card,.tl-card,.now-block,.blog-card,.case-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovering'));
});
document.addEventListener('mousedown', () => cursor && cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor && cursor.classList.remove('clicking'));

// ===== RIPPLE =====
document.querySelectorAll('.btn-primary,.btn-outline,.contact-btn-primary,.contact-btn-outline').forEach(btn => {
  btn.addEventListener('click', function(e){
    const r = document.createElement('span');
    r.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size+'px';
    r.style.left = (e.clientX-rect.left-size/2)+'px';
    r.style.top = (e.clientY-rect.top-size/2)+'px';
    this.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

// ===== COUNTER =====
function animateCounter(el, target){
  let start = 0; const step = target/75;
  const t = setInterval(() => {
    start += step;
    if(start >= target){ el.textContent = target; clearInterval(t); return; }
    el.textContent = Math.floor(start);
  }, 16);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if(en.isIntersecting){ animateCounter(en.target, parseInt(en.target.dataset.target)); counterObs.unobserve(en.target); }
  });
}, { threshold:0.5 });
document.querySelectorAll('.hero-stat-num').forEach(el => {
  const n = parseInt(el.textContent.trim());
  if(!isNaN(n)){ el.dataset.target = n; el.textContent = '0'; counterObs.observe(el); }
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => { if(en.isIntersecting) en.target.classList.add('visible'); });
}, { threshold:0.08, rootMargin:'0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== COPY EMAIL =====
function copyEmail(e) {
  e.preventDefault();
  const email = 'lina-melissa@web.de';
  navigator.clipboard.writeText(email).then(() => {
    const btn = document.getElementById('mail-btn');
    const hint = document.getElementById('contact-email-hint');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px"><polyline points="20 6 9 17 4 12"/></svg>Kopiert!';
    btn.style.borderRadius = '100px';
    hint.classList.add('visible');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.borderRadius = '';
      hint.classList.remove('visible');
      renderIcons();
    }, 2000);
  });
}

// ===== INIT =====
buildBanner('de');

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e){
    const id = this.getAttribute('href');
    if(id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top:y, behavior:'smooth' });
  });
});

// ===== INSTAGRAM SWIPE =====
document.querySelectorAll('.insta-swipe').forEach(card => {
  const track = card.querySelector('.insta-swipe-track');
  const slides = card.querySelectorAll('.insta-slide');
  const dots = card.querySelectorAll('.insta-dot');
  let current = 0;
  let interval = null;
  let paused = false;

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  card.addEventListener('mouseenter', () => {
    if (!paused) interval = setInterval(() => goTo(current + 1), 1200);
  });
  card.addEventListener('mouseleave', () => {
    clearInterval(interval);
    if (!paused) goTo(0);
  });
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    paused = true;
    clearInterval(interval);
    goTo(current + 1);
  });
});

// ===== LIGHTBOX =====
let lbCarouselCurrent = 0;
let lbCarouselSlides = [];

function openLightbox(type, src, slides) {
  const overlay = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');
  const carousel = document.getElementById('lightbox-carousel');
  const scrollWrap = document.getElementById('lightbox-scroll');
  const scrollImg = document.getElementById('lightbox-scroll-img');
  const track = document.getElementById('lightbox-carousel-track');
  const dots = document.getElementById('lightbox-carousel-dots');

  img.style.display = 'none';
  video.style.display = 'none';
  carousel.style.display = 'none';
  scrollWrap.style.display = 'none';

  if (type === 'image') {
    img.src = src;
    img.style.display = 'block';
  } else if (type === 'video') {
    video.src = src;
    video.style.display = 'block';
    video.play();
  } else if (type === 'scroll') {
    scrollImg.src = src;
    scrollWrap.scrollTop = 0;
    scrollWrap.style.display = 'block';
  } else if (type === 'carousel') {
    lbCarouselSlides = slides;
    lbCarouselCurrent = 0;
    track.innerHTML = slides.map(s => `<img src="${s}" alt="">`).join('');
    dots.innerHTML = slides.map((_, i) => `<span class="${i===0?'active':''}" onclick="lightboxCarouselGoTo(${i})"></span>`).join('');
    carousel.style.display = 'block';
    track.style.transform = 'translateX(0)';
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox') && !e.target.closest('.lightbox-close')) return;
  const overlay = document.getElementById('lightbox');
  const video = document.getElementById('lightbox-video');
  overlay.classList.remove('open');
  video.pause();
  video.src = '';
  document.body.style.overflow = '';
  // Reset insta-swipe pause state
  document.querySelectorAll('.insta-swipe').forEach(c => c._paused = false);
}

function lightboxCarouselGoTo(i) {
  lbCarouselCurrent = (i + lbCarouselSlides.length) % lbCarouselSlides.length;
  document.getElementById('lightbox-carousel-track').style.transform = `translateX(-${lbCarouselCurrent * 100}%)`;
  document.querySelectorAll('#lightbox-carousel-dots span').forEach((d, idx) => d.classList.toggle('active', idx === lbCarouselCurrent));
}

function lightboxCarouselGo(dir) {
  lightboxCarouselGoTo(lbCarouselCurrent + dir);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  if (e.key === 'ArrowRight') lightboxCarouselGo(1);
  if (e.key === 'ArrowLeft') lightboxCarouselGo(-1);
});

// Wire up masonry cards
document.querySelectorAll('.masonry-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // External card — let the link handle it, no lightbox
    if (card.classList.contains('masonry-card-external')) {
      const href = card.dataset.href;
      if (href && !e.target.closest('.masonry-ext-link')) {
        window.open(href, '_blank', 'noopener');
      }
      return;
    }
    // Scroll card (tm, prdruck)
    if (card.classList.contains('card-scroll')) {
      const si = card.querySelector('.scroll-img');
      if (si) { openLightbox('scroll', si.src); return; }
    }
    // Instagram carousel — open lightbox
    if (card.classList.contains('insta-swipe')) {
      const slides = [...card.querySelectorAll('.insta-slide')].map(s => s.src);
      openLightbox('carousel', null, slides);
      return;
    }
    // Video card
    const vid = card.querySelector('.masonry-video');
    if (vid) { openLightbox('video', vid.src); return; }
    // Regular image
    const mi = card.querySelector('.masonry-img');
    if (mi) { openLightbox('image', mi.src); return; }
  });
});

// ===== MOBILE: autoplay videos via IntersectionObserver =====
if (window.innerWidth <= 900) {
  const videos = document.querySelectorAll('.masonry-video');
  const videoObs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.play(); else en.target.pause(); });
  }, { threshold: 0.3 });
  videos.forEach(v => { v.muted = true; v.loop = true; v.playsInline = true; videoObs.observe(v); });
}

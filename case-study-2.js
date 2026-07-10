// ===== SCROLL REVEAL (Sections) =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== REVEAL-CHILD TRIGGER (Before/After, Idea-Karten, Sitemap) =====
// Fügt 'in-view' hinzu, sobald das Element in den Viewport scrollt, einmalig.
const childObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in-view');
      childObs.unobserve(en.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.ba-decision, .before-after, .sitemap').forEach(el => childObs.observe(el));

const ideaRow = document.querySelector('.idea-row');
if (ideaRow) childObs.observe(ideaRow);

// ===== COUNTER ANIMATION (Stats & KPIs) =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const isDecimal = el.dataset.target.includes('.');
  let start = 0;
  const duration = 1200;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      animateCounter(en.target);
      counterObs.unobserve(en.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num, .kpi-num').forEach(el => counterObs.observe(el));

// ===== PHASE TRACKER (Sidebar-Timeline synchron zum Scroll) =====
const phaseItems = document.querySelectorAll('.phase-item');
const phaseSections = Array.from(phaseItems).map(item =>
  document.getElementById(item.dataset.target)
).filter(Boolean);

function updatePhaseTracker() {
  let activeIndex = 0;
  const scrollPos = window.scrollY + window.innerHeight * 0.35;

  phaseSections.forEach((sec, i) => {
    if (sec.offsetTop <= scrollPos) activeIndex = i;
  });

  phaseItems.forEach((item, i) => {
    item.classList.toggle('is-active', i === activeIndex);
    item.classList.toggle('is-done', i < activeIndex);
  });
}
window.addEventListener('scroll', updatePhaseTracker, { passive: true });
updatePhaseTracker();

// ===== KLICK AUF PHASE-TRACKER SCROLLT ZUR SEKTION =====
phaseItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = document.getElementById(item.dataset.target);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

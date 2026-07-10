// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== SIDEBAR ACTIVE STATE =====
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      const id = en.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(sec => sectionObs.observe(sec));

// ===== SMOOTH SCROLL OFFSET (falls Topbar überlappt) =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// ===== SPRACHE (Platzhalter, aktuell nur DE inhaltlich gepflegt) =====
let currentLang = 'de';
function toggleLang() {
  currentLang = currentLang === 'de' ? 'en' : 'de';
  document.getElementById('lang-btn').textContent = currentLang === 'de' ? 'EN' : 'DE';
  // Hinweis: Übersetzungen folgen, sobald der Text final steht.
}

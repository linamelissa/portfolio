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

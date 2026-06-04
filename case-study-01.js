// ===== SCROLL SPY for sticky sidebar =====
const csSections = document.querySelectorAll('.cs-section[id]');
const csNavItems = document.querySelectorAll('.cs-nav-item');

function updateActiveNav(){
  let current = '';
  const scrollPos = window.scrollY + 200;
  csSections.forEach(sec => {
    if(scrollPos >= sec.offsetTop){
      current = sec.id;
    }
  });
  csNavItems.forEach(item => {
    item.classList.toggle('active', item.dataset.target === current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive:true });
updateActiveNav();

// Smooth scroll on sidebar click
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

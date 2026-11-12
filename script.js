// ============================================================
// CONFIGURE AQUI: seu WhatsApp com código do país e DDD, só números.
// Exemplo: "5562999999999". Todos os botões do site usam esse número.
// ============================================================
const WHATSAPP_NUMBER = '5562992117409';

document.documentElement.classList.remove('js-off');

// Links de WhatsApp (data-wa = mensagem inicial)
for (const link of document.querySelectorAll('[data-wa]')) {
  const text = encodeURIComponent(link.dataset.wa);
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  link.target = '_blank';
  link.rel = 'noopener';
}

// Menu mobile
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu-mobile');
const toggleMenu = (open) => {
  menu.classList.toggle('hidden', !open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
menuBtn.addEventListener('click', () => toggleMenu(menu.classList.contains('hidden')));
for (const a of menu.querySelectorAll('a')) a.addEventListener('click', () => toggleMenu(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });

// Aparecer ao rolar
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });
} else {
  revealItems.forEach((el) => el.classList.add('is-visible'));
}

// Ano do rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

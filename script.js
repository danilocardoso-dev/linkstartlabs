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

// ============================================================
// Fundo animado: rede de pontos conectados (estilo circuito/HUD)
// ============================================================
(function () {
  const canvas = document.getElementById('bg-fx');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr, points, raf;
  const COLORS = ['#00f0ff', '#9d4edd'];
  const LINK_DIST = 150;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.round((w * h) / 18000));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      c: COLORS[Math.random() < 0.5 ? 0 : 1],
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of points) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          ctx.globalAlpha = (1 - dist / LINK_DIST) * 0.16;
          ctx.strokeStyle = a.c;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const p of points) {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  }

  function start() { if (!raf) { resize(); raf = requestAnimationFrame(step); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  if (reduceMotion) {
    // Desenha um único quadro estático, sem animação contínua.
    resize();
    step();
    cancelAnimationFrame(raf);
    raf = null;
  } else {
    start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
  }
})();

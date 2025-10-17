document.addEventListener('DOMContentLoaded', () => {
  /* ===========================
     Header shrink + logo
     =========================== */
  const header = document.querySelector('header');
  const logo = document.getElementById('logoTopMenuId');

  let ticking = false;
  function onScroll() {
    const shrink = window.scrollY > 1;
    header.classList.toggle('shrink', shrink);
    logo && logo.classList.toggle('shrink', shrink);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  // estado inicial
  onScroll();

  /* ===========================
     Burbujas: animar al entrar en viewport
     =========================== */
  const bubbleContainer = document.querySelector('.bubbles-left');
  const bubbles = document.querySelectorAll('.bubble');

  if ('IntersectionObserver' in window && bubbleContainer && bubbles.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bubbles.forEach((bubble, i) => {
            setTimeout(() => bubble.classList.add('visible'), i * 400);
          });
          obs.unobserve(entry.target); // solo una vez
        }
      });
    }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    io.observe(bubbleContainer);
  } else {
    // Fallback simple con scroll
    window.addEventListener('scroll', () => {
      if (!bubbleContainer) return;
      const r = bubbleContainer.getBoundingClientRect();
      if (r.top < window.innerHeight - 80) {
        bubbles.forEach((bubble, i) => {
          setTimeout(() => bubble.classList.add('visible'), i * 400);
        });
      }
    }, { passive: true });
  }

  /* ===========================
     Menú hamburguesa (accesible)
     =========================== */
  const hamburger = document.querySelector('.hamburger');
  const menu = document.getElementById('main-menu');
  const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let outsideClickHandler = null;
  let escHandler = null;
  let resizeHandler = null;

  function lockScroll() {
    // bloquear scroll del body en móvil
    document.body.dataset.prevOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.body.style.overflow = document.body.dataset.prevOverflow || '';
    delete document.body.dataset.prevOverflow;
  }

  function closeMenu() {
    if (!menu) return;
    hamburger?.setAttribute('aria-expanded', 'false');
    menu.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
    unlockScroll();

    // quitar listeners
    document.removeEventListener('click', outsideClickHandler, true);
    document.removeEventListener('keydown', escHandler, true);
    window.removeEventListener('resize', resizeHandler, true);
  }

  function openMenu() {
    if (!menu) return;
    hamburger?.setAttribute('aria-expanded', 'true');
    menu.classList.add('active');
    menu.setAttribute('aria-hidden', 'false');
    lockScroll();

    // cerrar al click fuera
    outsideClickHandler = (e) => {
      const clickInsideMenu = menu.contains(e.target);
      const clickHamburger = hamburger && hamburger.contains(e.target);
      if (!clickInsideMenu && !clickHamburger) closeMenu();
    };
    document.addEventListener('click', outsideClickHandler, true);

    // cerrar con Esc
    escHandler = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', escHandler, true);

    // cerrar si pasan a desktop ( >768px )
    resizeHandler = () => {
      if (window.innerWidth > 768 && menu.classList.contains('active')) {
        closeMenu();
      }
    };
    window.addEventListener('resize', resizeHandler, true);

    // focus inicial dentro del menú
    const firstFocusable = menu.querySelector(focusableSelectors);
    firstFocusable && firstFocusable.focus({ preventScroll: true });
  }

  if (hamburger && menu) {
    // atributos ARIA base
    hamburger.setAttribute('aria-controls', 'main-menu');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // cerrar al clickear un link del menú
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });
  }

  /* ===========================
     Anclas suaves (opcional extra)
     Ya tenés scroll-margin-top en CSS; esto solo asegura smooth en navegadores viejos.
     =========================== */
  const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  internalLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      // dejar que funcione el scroll nativo (CSS smooth); si querés forzar:
      // e.preventDefault();
      // target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

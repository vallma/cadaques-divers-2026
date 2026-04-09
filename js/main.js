/* ═══════════════════════════════════════════════════
   CADAQUÉS DIVERS — JavaScript
═══════════════════════════════════════════════════ */

'use strict';

// ── Navbar: scroll behavior + active link ────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled style
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Mobile nav toggle ────────────────────────────
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    }
  });
})();

// ── Scroll reveal animations ─────────────────────
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger siblings for natural feel
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          siblings.forEach((sibling, i) => {
            if (sibling === entry.target) {
              setTimeout(() => {
                entry.target.classList.add('visible');
              }, i * 80);
            }
          });
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── Immersion Tabs ───────────────────────────────
(function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(`tab-${target}`);
      if (content) {
        content.classList.add('active');
        // Re-trigger reveal for newly shown content
        content.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), 50);
        });
      }
    });
  });
})();

// ── Contact form ─────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    // Build WhatsApp message from form data
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const servicioEl = document.getElementById('servicio');
    const servicio = servicioEl.options[servicioEl.selectedIndex].text;
    const mensaje = document.getElementById('mensaje').value;

    const waText = [
      `Hola! Me llamo ${nombre}.`,
      servicio !== 'Selecciona un servicio...' ? `Estoy interesado/a en: ${servicio}.` : '',
      mensaje ? `Mensaje: ${mensaje}` : '',
      `Email: ${email}`,
    ].filter(Boolean).join('\n');

    // Simulate short delay then redirect to WhatsApp
    setTimeout(() => {
      form.style.display = 'none';
      successMsg.classList.add('visible');

      // Open WhatsApp after showing success
      setTimeout(() => {
        const waUrl = `https://wa.me/34605336158?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank', 'noopener');
      }, 800);
    }, 1200);
  });
})();

// ── Smooth scroll for anchor links ──────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ── Hero parallax (subtle) ───────────────────────
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  // Only on non-touch devices
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }
})();

// ── Pricing card hover depth ─────────────────────
(function initCardDepth() {
  document.querySelectorAll('.pricing-card, .quick-card, .course-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

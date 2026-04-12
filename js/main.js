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

// ── Mapa de Puntos de Buceo ───────────────────────
(function initDivingMap() {
  const mapEl = document.getElementById('diving-map');
  if (!mapEl) return;

  const DIFFICULTY_LABEL = {
    beginner:     '🟢 Principiante',
    intermediate: '🟡 Intermedio',
    advanced:     '🔴 Avanzado',
  };

  const map = L.map('diving-map', {
    center: [42.288, 3.278],
    zoom: 13,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  const markerIcon = L.divIcon({
    className: '',
    html: '<div class="spot-marker"><i class="fas fa-circle-dot"></i></div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  const markerIconActive = L.divIcon({
    className: '',
    html: '<div class="spot-marker spot-marker-active"><i class="fas fa-circle-dot"></i></div>',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });

  let markers = [];
  let activeMarker = null;

  function showSpotDetail(spot) {
    const detail   = document.getElementById('spot-detail');
    const listEl   = document.getElementById('spots-list');
    const loading  = document.getElementById('spots-loading');

    loading.classList.add('hidden');
    listEl.classList.remove('hidden');
    detail.classList.remove('hidden');

    document.getElementById('spot-name').textContent = spot.name;
    document.getElementById('spot-description').textContent = spot.description;
    document.getElementById('spot-difficulty').textContent = DIFFICULTY_LABEL[spot.difficulty] ?? spot.difficulty;
    document.getElementById('spot-depth').textContent = `⬇️ ${spot.depth}m`;

    const gallery = document.getElementById('spot-gallery');
    gallery.innerHTML = '';
    if (spot.photos && spot.photos.length > 0) {
      spot.photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.caption ?? spot.name;
        img.className = 'spot-photo';
        img.loading = 'lazy';
        gallery.appendChild(img);
      });
    } else {
      gallery.innerHTML = '<p class="spot-no-photos">Sin fotos todavía</p>';
    }

    // Update spot list active state
    document.querySelectorAll('.spot-list-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === spot.id);
    });
  }

  function renderSpotList(spots) {
    const listEl  = document.getElementById('spots-list');
    const loading = document.getElementById('spots-loading');
    loading.classList.add('hidden');
    listEl.classList.remove('hidden');

    listEl.innerHTML = '';
    spots.forEach(spot => {
      const item = document.createElement('div');
      item.className = 'spot-list-item';
      item.dataset.id = spot.id;
      item.innerHTML = `
        <span class="spot-list-name">${spot.name}</span>
        <span class="spot-list-meta">${DIFFICULTY_LABEL[spot.difficulty] ?? ''} · ${spot.depth}m</span>
      `;
      item.addEventListener('click', () => {
        map.setView([spot.latitude, spot.longitude], 15, { animate: true });
        selectMarker(spot);
      });
      listEl.appendChild(item);
    });
  }

  function selectMarker(spot) {
    if (activeMarker) {
      activeMarker.setIcon(markerIcon);
    }
    const found = markers.find(m => m.spotId === spot.id);
    if (found) {
      found.marker.setIcon(markerIconActive);
      activeMarker = found.marker;
    }
    showSpotDetail(spot);
  }

  fetch(`${window.BACKEND_URL}/api/diving-spots`)
    .then(r => r.json())
    .then(({ spots }) => {
      if (!spots || spots.length === 0) {
        document.getElementById('spots-loading').innerHTML =
          '<div class="spots-empty-icon">📍</div><p>Próximamente</p>';
        return;
      }

      spots.forEach(spot => {
        const marker = L.marker([spot.latitude, spot.longitude], { icon: markerIcon }).addTo(map);
        marker.bindTooltip(spot.name, { permanent: false, direction: 'top' });
        marker.on('click', () => {
          map.setView([spot.latitude, spot.longitude], 15, { animate: true });
          selectMarker(spot);
        });
        markers.push({ spotId: spot.id, marker });
      });

      renderSpotList(spots);

      // Auto-select the first spot
      selectMarker(spots[0]);
    })
    .catch(() => {
      document.getElementById('spots-loading').innerHTML =
        '<div class="spots-empty-icon">⚠️</div><p>No se pudo cargar el mapa</p>';
    });
})();

// ── Scroll Diver progress indicator ─────────────
(function initScrollDiver() {
  const diver = document.getElementById('scrollDiver');
  if (!diver) return;

  const TOP_MIN = 100;
  const BOTTOM_PAD = 80;
  let lastScrollY = window.scrollY;
  let isDragging = false;

  function getRange() {
    return Math.max(0, window.innerHeight - TOP_MIN - BOTTOM_PAD - diver.offsetHeight);
  }

  function updateDiver() {
    if (isDragging) return;
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? scrollTop / docH : 0;
    diver.style.top = (TOP_MIN + pct * getRange()) + 'px';

    const goingUp = scrollTop < lastScrollY;
    const flip = goingUp ? 'scaleY(-1)' : 'scaleY(1)';
    diver.style.transform = flip;
    diver.style.webkitTransform = flip;
    lastScrollY = scrollTop;
  }

  function getClientY(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientY = getClientY(e);
    const range = getRange();
    const newTop = Math.max(TOP_MIN, Math.min(TOP_MIN + range, clientY - diver.offsetHeight / 2));
    const pct = (newTop - TOP_MIN) / range;
    diver.style.top = newTop + 'px';
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: pct * docH, behavior: 'instant' });
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    lastScrollY = window.scrollY;
  }

  diver.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  diver.addEventListener('touchstart', (e) => {
    isDragging = true;
  }, { passive: true });

  function swimTo(pct) {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    const range = getRange();
    const targetTop = TOP_MIN + Math.max(0, Math.min(1, pct)) * range;
    diver.style.transition = 'top 0.7s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.3s ease';
    diver.style.top = targetTop + 'px';
    setTimeout(() => {
      diver.style.transition = 'top 0.12s linear, transform 0.3s ease';
    }, 750);
  }

  function onButtonClick(e) {
    const btn = e.currentTarget;
    const href = btn.getAttribute('href');

    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        swimTo(target.offsetTop / docH);
        return;
      }
    }

    // Botón sin sección: pequeño rebote
    diver.style.transition = 'transform 0.15s ease';
    diver.style.transform = 'scale(1.3)';
    setTimeout(() => {
      diver.style.transition = 'top 0.12s linear, transform 0.3s ease';
      diver.style.transform = 'scaleY(1)';
    }, 180);
  }

  document.querySelectorAll('a[href^="#"], .tab-btn').forEach(btn => {
    btn.addEventListener('click', onButtonClick);
  });

  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchend', onDragEnd);
  window.addEventListener('scroll', updateDiver, { passive: true });
  updateDiver();
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

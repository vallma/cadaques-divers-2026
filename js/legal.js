/* ═══════════════════════════════════════════════════
   CADAQUÉS DIVERS — Página legal
   ───────────────────────────────────────────────────
   Externalizado desde legal.html para que la CSP pueda
   prohibir 'unsafe-inline' en script-src.
═══════════════════════════════════════════════════ */

'use strict';

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.classList.toggle('active', isOpen);
});

// Highlight active legal nav link on scroll
const sections = document.querySelectorAll('.legal-section');
const legalLinks = document.querySelectorAll('.legal-nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) current = s.id;
  });
  legalLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

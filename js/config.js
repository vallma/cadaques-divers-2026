/* ═══════════════════════════════════════════════════
   CADAQUÉS DIVERS — Configuración y consentimiento
   ───────────────────────────────────────────────────
   Debe cargarse ANTES que cualquier otro script.
   Va en un archivo externo (y no inline) para que la CSP
   pueda prohibir 'unsafe-inline' en script-src.
═══════════════════════════════════════════════════ */

// ── Configuración API ─────────────────────────────
// Cambia esta URL por la URL de tu backend en producción
window.BACKEND_URL = 'https://cadaquesdivers-reservas.vercel.app';

// ── Consentimiento por defecto (Google Consent Mode v2) ──
// Declara que todo está denegado hasta que el usuario acepte.
// El script de Google Analytics NO se descarga aquí: lo carga
// enableAnalytics() en js/main.js tras el consentimiento explícito.
window.GA_MEASUREMENT_ID = 'G-41KN09H1M3';
window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
});

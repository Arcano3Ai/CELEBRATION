/**
 * CELEBRATION — Configuración de Rutas Directas de Pago (Mercado Pago Orders API)
 *
 * Redirige directamente a la pasarela integrada en checkout.html (sin fricción ni splash de mpago.la).
 */
window.CELEBRATION_PAYMENTS = {
  // Signature — Pago completo $500 (Landing Google Ads)
  signature: 'checkout.html?pkg=signature&method=mp',

  // Essential — Anticipo del 50% $495
  essential: 'checkout.html?pkg=essential&method=mp',

  // Premiere Edition — Anticipo del 50% $895 [Recomendado]
  premiere: 'checkout.html?pkg=premiere&method=mp',

  // Haute Couture — Anticipo del 50% $1,495
  couture: 'checkout.html?pkg=couture&method=mp',

  // Fallbacks de compatibilidad
  mini: 'checkout.html?pkg=signature&method=mp',
  'haute-couture': 'checkout.html?pkg=couture&method=mp'
};

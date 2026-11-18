/**
 * CELEBRATION — Configuración de Rutas Directas de Pago (Mercado Pago Orders API)
 *
 * Redirige directamente a la pasarela integrada en checkout.html (sin fricción ni splash de mpago.la).
 */
window.CELEBRATION_PAYMENTS = {
  // Mini Celebration — Pago completo $990
  mini: 'checkout.html?pkg=mini&method=mp',

  // Essential — Anticipo del 50% $745
  essential: 'checkout.html?pkg=essential&method=mp',

  // Premiere Edition — Anticipo del 50% $1,245 [Recomendado]
  premiere: 'checkout.html?pkg=premiere&method=mp',

  // Signature — Anticipo del 50% $1,995
  signature: 'checkout.html?pkg=signature&method=mp'
};

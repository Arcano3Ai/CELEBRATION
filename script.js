/**
 * CELEBRATION — Editorial Luxury Wedding Websites
 * Core Interactive Logic: Carousels, Scroll Reveal, Sticky Header, Accordion & Counters
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initTimelineCarousel();
  initReviewsCarousel();
  initFaqAccordion();
  initShareExperience();
  initPwa();
  initCheckoutGateway();
});

/* --------------------------------------------------------------------------
   1. Sticky Header
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Hamburger Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobNav = document.getElementById('mobNav');
  if (!burgerBtn || !mobNav) return;

  const toggleMenu = () => {
    const isOpen = mobNav.classList.contains('open');
    if (isOpen) {
      mobNav.classList.remove('open');
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      mobNav.classList.add('open');
      burgerBtn.classList.add('active');
      burgerBtn.setAttribute('aria-expanded', 'true');
      mobNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  burgerBtn.addEventListener('click', toggleMenu);

  // Close on link click
  const mobLinks = mobNav.querySelectorAll('.mob-link');
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobNav.classList.remove('open');
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Reveal Animation (.rv -> .on)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.rv');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('on'));
  }
}

/* --------------------------------------------------------------------------
   4. Animated Metric Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;

  let started = false;
  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.dataset.target || 0;
      const prefix = counter.dataset.prefix || '';
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuad
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(ease * target);

        counter.textContent = `${prefix}${currentVal}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${prefix}${target}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if ('IntersectionObserver' in window) {
    const trustBar = document.getElementById('trust-bar');
    if (!trustBar) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        runCounters();
      }
    }, { threshold: 0.2 });

    observer.observe(trustBar);
  } else {
    runCounters();
  }
}

/* --------------------------------------------------------------------------
   5. Timeline Carousel (Mobile)
   -------------------------------------------------------------------------- */
function initTimelineCarousel() {
  const track = document.getElementById('tlTrack');
  const prevBtn = document.getElementById('tlPrev');
  const nextBtn = document.getElementById('tlNext');
  const dotsContainer = document.getElementById('tlDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = track.querySelectorAll('.tl-card');
  const dots = dotsContainer.querySelectorAll('.tl-dot');
  let currentIndex = 0;

  const updateTimeline = (index) => {
    // Only apply in mobile view (< 860px)
    if (window.innerWidth >= 860) {
      track.style.transform = 'none';
      return;
    }

    currentIndex = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('on', idx === currentIndex);
    });
  };

  prevBtn.addEventListener('click', () => updateTimeline(currentIndex - 1));
  nextBtn.addEventListener('click', () => updateTimeline(currentIndex + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = +e.target.dataset.i;
      updateTimeline(idx);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860) {
      track.style.transform = 'none';
    } else {
      updateTimeline(currentIndex);
    }
  });
}

/* --------------------------------------------------------------------------
   6. Reviews Carousel
   -------------------------------------------------------------------------- */
function initReviewsCarousel() {
  const track = document.getElementById('revTrack');
  const prevBtn = document.getElementById('revPrev');
  const nextBtn = document.getElementById('revNext');
  const dotsContainer = document.getElementById('revDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll('.c-slide');
  const dots = dotsContainer.querySelectorAll('.tl-dot');
  let currentIndex = 0;
  let autoplayTimer = null;

  const updateSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('on', idx === currentIndex);
    });
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, 6500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  prevBtn.addEventListener('click', () => {
    updateSlide(currentIndex - 1);
    startAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    updateSlide(currentIndex + 1);
    startAutoplay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = +e.target.dataset.i;
      updateSlide(idx);
      startAutoplay();
    });
  });

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* --------------------------------------------------------------------------
   7. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-btn');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Epic Social Share Card Experience
   -------------------------------------------------------------------------- */
function initShareExperience() {
  const btnShareWA = document.getElementById('btnShareWhatsApp');
  const btnCopy = document.getElementById('btnCopyShareCard');
  const shareCard = document.getElementById('epicShareCard');

  const shareUrl = 'https://arcano3ai.github.io/CELEBRATION/';
  const shareMessage = `✦ CELEBRATION — Haute Couture Wedding Suites & Smart RSVP\n\nSu boda, a su manera. Espacios digitales y piezas de alta costura interactiva concebidos exclusivamente para su enlace matrimonial.\n\n✧ Página Web Editorial con Dominio Propio\n✧ Smart RSVP con Asignación de Mesas\n✧ Tarjetas NFC & Galería Live Event en Pantallas\n\nConoce nuestras colecciones exclusivas:\n${shareUrl}`;

  if (btnShareWA) {
    btnShareWA.addEventListener('click', () => {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareMessage).then(() => {
          showToastFeedback('✓ Mensaje con tarjeta épica copiado al portapapeles');
        }).catch(() => {
          fallbackCopyText(shareMessage);
        });
      } else {
        fallbackCopyText(shareMessage);
      }
    });
  }

  if (shareCard) {
    shareCard.addEventListener('click', (e) => {
      // Smooth scroll to services
      const target = document.getElementById('pw');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    showToastFeedback('✓ Mensaje con tarjeta épica copiado');
  } catch (err) {
    prompt('Copie el enlace de su invitación:', text);
  }
  document.body.removeChild(textarea);
}

function showToastFeedback(msg) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* --------------------------------------------------------------------------
   9. PWA Installation & Service Worker Integration (Android & iOS)
   -------------------------------------------------------------------------- */
function initPwa() {
  // 1. Registro de Service Worker para caché offline y rendimiento ultrarrápido
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          console.log('[CELEBRATION PWA] Service Worker activo:', registration.scope);
        })
        .catch((error) => {
          console.warn('[CELEBRATION PWA] Error al registrar SW:', error);
        });
    });
  }

  const pwaBanner = document.getElementById('pwaBanner');
  const pwaInstallBtn = document.getElementById('pwaInstallBtn');
  const pwaCloseBtn = document.getElementById('pwaCloseBtn');
  const pwaIosModal = document.getElementById('pwaIosModal');
  const pwaIosClose = document.getElementById('pwaIosClose');

  if (!pwaBanner || !pwaInstallBtn) return;

  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  const isDismissed = localStorage.getItem('celebration_pwa_dismissed');

  // Si ya está ejecutándose como PWA standalone o fue cerrada recientemente, no insistir
  if (isStandalone) return;
  if (isDismissed && Date.now() - parseInt(isDismissed, 10) < 7 * 24 * 60 * 60 * 1000) return;

  let deferredPrompt = null;

  // Android, Chrome y Edge: Evento nativo beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Mostrar el banner discretamente tras 3.5 segundos de navegación fluida
    setTimeout(() => {
      pwaBanner.classList.add('show');
      pwaBanner.setAttribute('aria-hidden', 'false');
    }, 3500);
  });

  // iOS Safari: Mostrar tras 4.5 segundos si no está instalada
  if (isIos && !isStandalone) {
    setTimeout(() => {
      pwaBanner.classList.add('show');
      pwaBanner.setAttribute('aria-hidden', 'false');
    }, 4500);
  }

  // Clic en botón "Instalar App"
  pwaInstallBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Disparador nativo de Android
      pwaBanner.classList.remove('show');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[CELEBRATION PWA] Elección del usuario:', outcome);
      deferredPrompt = null;
    } else if (isIos) {
      // Desplegar guía de iOS Safari
      pwaBanner.classList.remove('show');
      if (pwaIosModal) {
        pwaIosModal.classList.add('open');
        pwaIosModal.setAttribute('aria-hidden', 'false');
      }
    } else {
      showToastFeedback('✦ Para instalar, selecciona "Instalar aplicación" en el menú de tu navegador');
      pwaBanner.classList.remove('show');
    }
  });

  // Cerrar banner
  if (pwaCloseBtn) {
    pwaCloseBtn.addEventListener('click', () => {
      pwaBanner.classList.remove('show');
      pwaBanner.setAttribute('aria-hidden', 'true');
      localStorage.setItem('celebration_pwa_dismissed', Date.now().toString());
    });
  }

  // Cerrar guía de iOS
  if (pwaIosClose && pwaIosModal) {
    pwaIosClose.addEventListener('click', () => {
      pwaIosModal.classList.remove('open');
      pwaIosModal.setAttribute('aria-hidden', 'true');
      localStorage.setItem('celebration_pwa_dismissed', Date.now().toString());
    });

    pwaIosModal.addEventListener('click', (e) => {
      if (e.target === pwaIosModal) {
        pwaIosModal.classList.remove('open');
        pwaIosModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Notificación tras instalación exitosa
  window.addEventListener('appinstalled', () => {
    console.log('[CELEBRATION PWA] Aplicación instalada exitosamente');
    pwaBanner.classList.remove('show');
    showToastFeedback('✓ ¡CELEBRATION agregada a tu pantalla de inicio!');
  });
}

/* --------------------------------------------------------------------------
   10. Pasarela de Pagos Luxury v2.0 — SPEI / Mercado Pago / Stripe
   --------------------------------------------------------------------------

   ╔══════════════════════════════════════════════════════════════════════╗
   ║  PAYMENT CONFIG — Actualiza estos URLs cuando tengas los links reales ║
   ╚══════════════════════════════════════════════════════════════════════╝
*/
const PAYMENT_CONFIG = {
  whatsapp: '528121912778',

  spei: {
    beneficiary:  'CELEBRATION Atelier (Arcano Solutions)',
    bank:         'BBVA / STP',
    clabe:        '646180123456789012',  // ← REEMPLAZAR: CLABE real (18 dígitos)
  },

  mercadopago: {
    signature:    'https://mpago.la/XXXXXXXXX',   // ← REEMPLAZAR: link MP Signature $11,900
    destination:  'https://mpago.la/XXXXXXXXX',   // ← REEMPLAZAR: link MP Destination $14,900
    grandluxe:    'https://mpago.la/XXXXXXXXX',   // ← REEMPLAZAR: link MP Grand Luxe $19,900
  },

  stripe: {
    signature:    'https://buy.stripe.com/XXXXXXXXX',   // ← REEMPLAZAR: link Stripe Signature
    destination:  'https://buy.stripe.com/XXXXXXXXX',   // ← REEMPLAZAR: link Stripe Destination
    grandluxe:    'https://buy.stripe.com/XXXXXXXXX',   // ← REEMPLAZAR: link Stripe Grand Luxe
  },
};

function initCheckoutGateway() {
  const overlay    = document.getElementById('checkoutOverlay');
  const closeBtn   = document.getElementById('checkoutCloseBtn');
  const openBtns   = document.querySelectorAll('.btn-open-checkout');

  if (!overlay) return;

  // ── Elementos del LEFT PANEL ──
  const pkgNameEl       = document.getElementById('checkoutPkgName');
  const pkgTotalEl      = document.getElementById('checkoutPkgTotal');
  const depositBtn      = document.getElementById('schemeDepositBtn');
  const fullBtn         = document.getElementById('schemeFullBtn');
  const depositAmountEl = document.getElementById('checkoutDepositAmount');
  const fullAmountEl    = document.getElementById('checkoutFullAmount');
  const coupleNamesInput = document.getElementById('checkoutCoupleNames');

  // ── Elementos del RIGHT PANEL ──
  const payAmountHero   = document.getElementById('coPayAmountHero');
  const speiAmountEl    = document.getElementById('speiPayAmountDisplay');
  const speiConceptEl   = document.getElementById('speiConceptDisplay');
  const speiClabeEl     = document.getElementById('speiClabeNum');
  const btnCopyClabe    = document.getElementById('btnCopyClabe');
  const btnSpeiWa       = document.getElementById('btnSpeiWaConfirm');

  const mpAmountEl      = document.getElementById('mpPayAmountDisplay');
  const btnMpCheckout   = document.getElementById('btnMpCheckout');

  const stripeAmountEl  = document.getElementById('stripePayAmountDisplay');
  const btnStripeCheckout = document.getElementById('btnStripeCheckout');

  // ── Accordions de métodos ──
  const toggleSpei   = document.getElementById('toggleSpei');
  const toggleMp     = document.getElementById('toggleMp');
  const toggleStripe = document.getElementById('toggleStripe');

  const collapseSpei   = document.getElementById('collapseSpei');
  const collapseMp     = document.getElementById('collapseMp');
  const collapseStripe = document.getElementById('collapseStripe');

  // ── Estado ──
  let currentPackage = { id: 'destination', name: 'Destination & Heritage', price: 14900 };
  let currentScheme  = 'deposit';

  // Poblar CLABE estática una vez
  if (speiClabeEl) speiClabeEl.textContent = PAYMENT_CONFIG.spei.clabe;

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────
  const fmxn = (v) => '$' + Number(v).toLocaleString('es-MX') + ' MXN';

  function payAmount() {
    const total = currentPackage.price;
    return currentScheme === 'deposit' ? Math.round(total * 0.5) : total;
  }

  function buildConcept() {
    const names  = coupleNamesInput?.value?.trim() || 'Novios';
    const clean  = names.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '').substring(0, 12).toUpperCase() || 'BODA';
    const id     = currentPackage.id.substring(0, 4).toUpperCase();
    return `CEL-${id}-${clean}`;
  }

  // ──────────────────────────────────────────────
  // updateCheckoutView — sincroniza toda la UI
  // ──────────────────────────────────────────────
  function updateCheckoutView() {
    const total   = currentPackage.price;
    const deposit = Math.round(total * 0.5);
    const pay     = payAmount();
    const concept = buildConcept();
    const names   = coupleNamesInput?.value?.trim() || 'Novios';
    const scheme  = currentScheme === 'deposit' ? 'Anticipo 50%' : 'Pago Total 100%';

    // LEFT PANEL
    if (pkgNameEl)       pkgNameEl.textContent  = currentPackage.name;
    if (pkgTotalEl)      pkgTotalEl.textContent  = fmxn(total);
    if (depositAmountEl) depositAmountEl.textContent = fmxn(deposit);
    if (fullAmountEl)    fullAmountEl.textContent    = fmxn(total);

    // RIGHT PANEL — hero amount
    if (payAmountHero)  payAmountHero.textContent  = fmxn(pay);

    // SPEI
    if (speiAmountEl)   speiAmountEl.textContent   = fmxn(pay);
    if (speiConceptEl)  speiConceptEl.textContent  = concept;

    // WA SPEI confirmation
    if (btnSpeiWa) {
      const waMsg = encodeURIComponent(
        `Hola CELEBRATION ✨, realicé la transferencia SPEI para apartar la ${currentPackage.name} (${scheme}: ${fmxn(pay)}).\n` +
        `✦ Pareja: ${names}\n` +
        `✦ Concepto / Ref: ${concept}\n` +
        `Adjunto mi comprobante para apartar fecha en el calendario.`
      );
      btnSpeiWa.href = `https://wa.me/${PAYMENT_CONFIG.whatsapp}?text=${waMsg}`;
    }

    // MP
    if (mpAmountEl)  mpAmountEl.textContent    = fmxn(pay);
    if (btnMpCheckout) {
      const mpUrl = PAYMENT_CONFIG.mercadopago[currentPackage.id] || '#';
      btnMpCheckout.href = mpUrl;
      btnMpCheckout.onclick = (e) => {
        if (mpUrl === '#' || mpUrl.includes('XXXX')) {
          e.preventDefault();
          showToastFeedback('⏳ Link de Mercado Pago en configuración — escríbenos por WhatsApp.');
          return;
        }
        showToastFeedback(`✦ Redirigiendo a Mercado Pago (${fmxn(pay)})...`);
      };
    }

    // Stripe
    if (stripeAmountEl) stripeAmountEl.textContent = fmxn(pay);
    if (btnStripeCheckout) {
      const stripeUrl = PAYMENT_CONFIG.stripe[currentPackage.id] || '#';
      btnStripeCheckout.href = stripeUrl;
      btnStripeCheckout.onclick = (e) => {
        if (stripeUrl === '#' || stripeUrl.includes('XXXX')) {
          e.preventDefault();
          showToastFeedback('⏳ Link de Stripe en configuración — escríbenos por WhatsApp.');
          return;
        }
        showToastFeedback(`✦ Conectando con Stripe Checkout SSL (${fmxn(pay)})...`);
      };
    }
  }

  // ──────────────────────────────────────────────
  // Accordion de métodos de pago
  // ──────────────────────────────────────────────
  function setupAccordion(toggleBtn, collapseEl) {
    if (!toggleBtn || !collapseEl) return;

    // Envuelve el contenido en un inner div para grid-template-rows trick
    const inner = document.createElement('div');
    inner.className = 'co-method-body-inner';
    while (collapseEl.firstChild) {
      inner.appendChild(collapseEl.firstChild);
    }
    collapseEl.appendChild(inner);

    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';

      // Cerrar todos
      [toggleSpei, toggleMp, toggleStripe].forEach((t) => {
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      [collapseSpei, collapseMp, collapseStripe].forEach((c) => {
        if (c) c.classList.remove('open');
      });

      // Abrir el clickeado (si estaba cerrado)
      if (!isOpen) {
        toggleBtn.setAttribute('aria-expanded', 'true');
        collapseEl.classList.add('open');
      }
    });
  }

  setupAccordion(toggleSpei,   collapseSpei);
  setupAccordion(toggleMp,     collapseMp);
  setupAccordion(toggleStripe, collapseStripe);

  // ──────────────────────────────────────────────
  // Abrir modal desde botones de paquetes
  // ──────────────────────────────────────────────
  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentPackage = {
        id:    btn.getAttribute('data-pkg-id')    || 'destination',
        name:  btn.getAttribute('data-pkg-name')  || 'Destination & Heritage',
        price: parseInt(btn.getAttribute('data-pkg-price'), 10) || 14900,
      };
      currentScheme = 'deposit';

      if (depositBtn) depositBtn.classList.add('active');
      if (fullBtn)    fullBtn.classList.remove('active');

      // Abrir SPEI por defecto al primer click
      if (toggleSpei && collapseSpei && toggleSpei.getAttribute('aria-expanded') !== 'true') {
        toggleSpei.setAttribute('aria-expanded', 'true');
        collapseSpei.classList.add('open');
      }

      updateCheckoutView();
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // ──────────────────────────────────────────────
  // Cerrar modal
  // ──────────────────────────────────────────────
  const closeModal = () => {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  // ──────────────────────────────────────────────
  // Esquema 50% / 100%
  // ──────────────────────────────────────────────
  if (depositBtn && fullBtn) {
    depositBtn.addEventListener('click', () => {
      currentScheme = 'deposit';
      depositBtn.classList.add('active');
      fullBtn.classList.remove('active');
      updateCheckoutView();
    });

    fullBtn.addEventListener('click', () => {
      currentScheme = 'full';
      fullBtn.classList.add('active');
      depositBtn.classList.remove('active');
      updateCheckoutView();
    });
  }

  // Actualizar concepto en tiempo real al escribir nombres
  if (coupleNamesInput) {
    coupleNamesInput.addEventListener('input', updateCheckoutView);
  }

  // ──────────────────────────────────────────────
  // Copiar CLABE al portapapeles
  // ──────────────────────────────────────────────
  function copyFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-999px;left:-999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    showToastFeedback('✦ CLABE SPEI copiada al portapapeles');
  }

  if (btnCopyClabe && speiClabeEl) {
    btnCopyClabe.addEventListener('click', () => {
      const clabe = speiClabeEl.textContent.trim();
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(clabe)
          .then(() => {
            showToastFeedback('✦ CLABE SPEI copiada al portapapeles');
            btnCopyClabe.textContent = '✓ Copiada';
            setTimeout(() => {
              btnCopyClabe.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copiar`;
            }, 3000);
          })
          .catch(() => copyFallback(clabe));
      } else {
        copyFallback(clabe);
      }
    });
  }
}

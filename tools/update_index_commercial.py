"""
Actualiza index.html aplicando:
1. Simplificación radical de textos y contenido comercial directo para Bodas 2027.
2. Cuatro paquetes compactos con precio visible, términos claros y doble botón (CONTRATAR AHORA + CONSULTAR POR WHATSAPP).
3. Premiere Edition destacado como paquete recomendado.
4. Proceso de contratación claro en 4 pasos.
5. Inclusión de payment-config.js.
6. Limpieza total del footer: remoción de todos los enlaces a archivos .md (contrato, catálogo descargable, brief novios, privacidad).
"""
import re
from pathlib import Path

INDEX_PATH = Path(r"c:\Users\sergi\CELBEATION\index.html")
WA_BASE = "https://wa.me/528121912778?text="

LOCK_SVG = (
    '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" '
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
)

def render_card(key, tag, title, price, terms, feats, wa_text, extra_cls="", delay="d1", featured=False):
    lis = "\n".join(f"            <li>{f}</li>" for f in feats)
    featured_btn = " plan-btn--featured" if featured else ""
    tag_featured = " plan-tag--featured" if featured else ""
    return f"""        <article class="plan-card{extra_cls} rv {delay}" id="plan-{key}">
          <span class="plan-tag{tag_featured}">{tag}</span>
          <h3 class="plan-title">{title}</h3>
          <div class="plan-price">
            <span class="plan-amount">{price}</span>
            <span class="plan-cur">MXN</span>
          </div>
          <p class="plan-terms">{terms}</p>
          <ul class="plan-list">
{lis}
          </ul>
          <div class="plan-actions">
            <a class="plan-btn plan-btn--main{featured_btn} is-disabled" href="#" data-contract="{key}" aria-disabled="true">Contratar ahora</a>
            <a class="plan-btn plan-btn--ghost" href="{WA_BASE}{wa_text}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
            <p class="plan-pay-note" data-pay-note="{key}">{LOCK_SVG}<span>Pago próximamente disponible</span></p>
          </div>
        </article>"""

CARDS_HTML = "\n\n".join([
    render_card(
        "mini", "Esencial", "Mini Celebration", "$990", "Pago completo",
        [
            "Invitación digital personalizada",
            "Fecha, ubicación y Google Maps",
            "Cuenta regresiva en tiempo real",
            "Confirmación directa por WhatsApp"
        ],
        "Hola%2C%20quiero%20informaci%C3%B3n%20de%20Mini%20Celebration%20de%20%24990.",
        delay="d1"
    ),
    render_card(
        "essential", "Personalizado", "Essential", "$1,490", "Anticipo: $745 MXN",
        [
            "Todo lo incluido en Mini",
            "Diseño visual personalizado",
            "Galería fotográfica de pareja",
            "Información ampliada del evento",
            "URL personalizada en Celebration"
        ],
        "Hola%2C%20quiero%20reservar%20Essential%20de%20%241%2C490.",
        delay="d2"
    ),
    render_card(
        "premiere", "★ Recomendado", "Premiere Edition", "$2,490", "Anticipo: $1,245 MXN",
        [
            "Todo lo incluido en Essential",
            "Smart RSVP por invitado",
            "Save the Date cinematográfico (MP4)",
            "Composición musical instrumental original",
            "Secciones adicionales para la celebración"
        ],
        "Hola%2C%20quiero%20reservar%20Premiere%20Edition%20de%20%242%2C490.",
        extra_cls=" plan-card--featured",
        delay="d3",
        featured=True
    ),
    render_card(
        "signature", "Alta Costura", "Signature", "$3,990", "Anticipo: $1,995 MXN",
        [
            "Todo lo incluido en Premiere",
            "Monograma exclusivo personalizado",
            "Historia de los novios y galería extendida",
            "Mesa de regalos con enlaces externos",
            "Dirección visual y tipográfica extendida"
        ],
        "Hola%2C%20quiero%20informaci%C3%B3n%20de%20Signature%20de%20%243%2C990.",
        delay="d4"
    ),
])

def render_faq(q, a):
    return f"""        <div class="faq-item">
          <button class="faq-btn" aria-expanded="false">
            <span class="faq-q">{q}</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>{a}</p>
          </div>
        </div>"""

FAQS_HTML = "\n\n".join([
    render_faq(
        "¿En cuánto tiempo entregan la invitación?",
        "De 3 a 5 días hábiles a partir de recibir los datos y fotos de su boda. También contamos con entrega express en 48 horas con costo adicional."
    ),
    render_faq(
        "¿Cómo la reciben mis invitados?",
        "Mediante un enlace privado y elegante que se comparte directamente por WhatsApp. Se abre de inmediato en cualquier smartphone sin descargar aplicaciones."
    ),
    render_faq(
        "¿Cuáles son las formas de pago?",
        "Mini Celebration se cubre en pago completo. Los paquetes Essential, Premiere y Signature se apartan con un anticipo del 50% y el saldo al aprobar su invitación. Aceptamos transferencia SPEI inmediata y próximamente pago con tarjeta vía Mercado Pago."
    ),
    render_faq(
        "¿Puedo realizar cambios a mi invitación?",
        "Sí. Incluimos ronda de revisión conjunta para validar textos, horarios, mapas y fotografías antes del lanzamiento formal."
    ),
    render_faq(
        "¿Puedo usar un dominio personalizado (.com, .love, .wedding)?",
        "Por defecto su invitación vive en una URL rápida de Celebration. Si desean un dominio propio personalizado, se configura como adicional ($850 MXN más registro de dominio)."
    ),
    render_faq(
        "¿Cuánto tiempo permanece activa la invitación en línea?",
        "Permanece activa durante 12 meses completos a partir de su publicación, cubriendo todo el proceso de planeación, el día del evento y las semanas posteriores."
    ),
])

MAIN_HTML = f"""  <main>
    <!-- HERO COMERCIAL CONVERTIDOR -->
    <section class="hero-wrap" id="hero">
      <div class="hero-img-box">
        <img
          class="hero-img"
          src="assets/images/hero_editorial_couple.jpg"
          alt="Invitaciones digitales de boda 2027 — CELEBRATION"
          loading="eager"
          fetchpriority="high"
        >
      </div>
      <div class="hero-text-box">
        <div class="hero-inner">
          <span class="hero-launch-pill">Founding Brides 2027 · Edición de Lanzamiento</span>
          <h1 class="hero-title">
            <span class="hero-brand-headline">CELEBRATION</span>
          </h1>
          <p class="hero-desc">Invitaciones digitales extraordinarias para momentos inolvidables.</p>
          <div class="hero-price-badge">
            <span class="hero-price-label">Invitaciones desde</span>
            <span class="hero-price-val"><strong>$990 MXN</strong></span>
          </div>
          <div class="hero-ctas">
            <a href="#servicios" class="btn">Ver colecciones</a>
            <a href="{WA_BASE}Hola%20CELEBRATION%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20invitaciones%20digitales%20%E2%9C%A8" class="btn-outline" target="_blank" rel="noopener">Consultar por WhatsApp</a>
          </div>
        </div>
      </div>
    </section>

    <!-- QUÉ ES CELEBRATION (BENEFICIOS ESENCIALES) -->
    <section class="sec sec--tight" id="pw">
      <div class="tl-header rv">
        <h2 class="sc">Invitaciones que tus invitados recordarán</h2>
        <p class="tl-subtitle">Una experiencia digital refinada que reúne todo el evento en un solo enlace.</p>
      </div>
      <div class="benefit-grid rv d1">
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
            </svg>
          </div>
          <h3 class="benefit-title">Se comparte en WhatsApp</h3>
          <p class="benefit-text">Un solo toque para enviar la tarjeta a tus seres queridos, sin descargas ni fricciones.</p>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>
            </svg>
          </div>
          <h3 class="benefit-title">Confirmaciones en orden</h3>
          <p class="benefit-text">Conoce quién asiste, sus pases asignados y requerimientos sin llamadas ni listas en papel.</p>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h3 class="benefit-title">Todo en un solo lugar</h3>
          <p class="benefit-text">Fecha, mapa interactivo con Google Maps, cuenta regresiva, código de vestimenta y galería.</p>
        </div>
      </div>
    </section>

    <!-- COLECCIONES & PRECIOS (CONTRATACIÓN DIRECTA) -->
    <section class="sec sec--tight" id="servicios">
      <span id="paquetes" style="display:block; position:relative; top:-90px; visibility:hidden;"></span>
      <div class="tl-header rv">
        <h2 class="sc">Colecciones 2027</h2>
        <p class="tl-subtitle">Elige tu paquete y contrata o reserva con anticipo del 50%.</p>
      </div>

      <div class="plan-grid">
{CARDS_HTML}
      </div>
    </section>

    <!-- CÓMO FUNCIONA EL PROCESO -->
    <section class="sec sec--tight sec--alt" id="proceso">
      <div class="tl-header rv">
        <h2 class="sc">Cómo funciona</h2>
        <p class="tl-subtitle">Tu invitación lista en 4 sencillos pasos.</p>
      </div>
      <ol class="steps-grid rv d1">
        <li class="step-item">
          <span class="step-num">1</span>
          <span class="step-title">Elige tu colección</span>
          <p class="step-desc">Selecciona el paquete que mejor refleje el estilo de su boda.</p>
        </li>
        <li class="step-item">
          <span class="step-num">2</span>
          <span class="step-title">Contrata tu paquete</span>
          <p class="step-desc">Aparta tu fecha con anticipo del 50% o pago completo en Mini.</p>
        </li>
        <li class="step-item">
          <span class="step-num">3</span>
          <span class="step-title">Comparte los datos</span>
          <p class="step-desc">Envíanos horarios, locación, fotografías y detalles del evento.</p>
        </li>
        <li class="step-item">
          <span class="step-num">4</span>
          <span class="step-title">Recibe tu invitación</span>
          <p class="step-desc">Revisamos juntos la propuesta y queda lista para compartir por WhatsApp.</p>
        </li>
      </ol>
      <p class="pay-methods rv d2">Medios de pago: Transferencia SPEI inmediata · Tarjeta bancaria con Mercado Pago (próximamente) · Atención directa por WhatsApp</p>
    </section>

    <!-- DEMOS VISUALES -->
    <section class="sec sec--tight" id="estilos">
      <div class="tl-header rv">
        <h2 class="sc">Demostraciones en vivo</h2>
        <p class="tl-subtitle">Explora cómo lucirá la invitación de tus sueños en el celular de tus invitados.</p>
      </div>

      <div class="estilos-grid">
        <div class="estilo-card rv d1">
          <div class="estilo-img-wrap">
            <img src="assets/images/estilo_romantico.jpg" alt="Demo de invitación Romántico y Botánico — CELEBRATION" class="estilo-img" loading="lazy">
          </div>
          <h3 class="estilo-name">Romántico &amp; Botánico</h3>
          <a href="demo-romantico.html" target="_blank" class="srv-link" rel="noopener">Ver demo en vivo →</a>
        </div>

        <div class="estilo-card rv d2">
          <div class="estilo-img-wrap">
            <img src="assets/images/estilo_clasico.jpg" alt="Demo de invitación Clásico Atemporal — CELEBRATION" class="estilo-img" loading="lazy">
          </div>
          <h3 class="estilo-name">Clásico Atemporal</h3>
          <a href="demo-clasico.html" target="_blank" class="srv-link" rel="noopener">Ver demo en vivo →</a>
        </div>

        <div class="estilo-card rv d3">
          <div class="estilo-img-wrap">
            <img src="assets/images/estilo_editorial.jpg" alt="Demo de invitación Editorial Vanguardia — CELEBRATION" class="estilo-img" loading="lazy">
          </div>
          <h3 class="estilo-name">Editorial Vanguardia</h3>
          <a href="demo-editorial.html" target="_blank" class="srv-link" rel="noopener">Ver demo en vivo →</a>
        </div>
      </div>
    </section>

    <!-- PREGUNTAS FRECUENTES -->
    <section class="faq-section" id="faq">
      <div class="tl-header rv">
        <h2 class="sc">Preguntas frecuentes</h2>
        <p class="tl-subtitle">Resolvemos tus dudas sobre tiempos, personalización y entrega.</p>
      </div>

      <div class="faq-container rv d1">
{FAQS_HTML}
      </div>

      <div class="hero-ctas faq-cta rv d2">
        <a href="#servicios" class="btn">Ver colecciones</a>
        <a href="{WA_BASE}Hola%20CELEBRATION%2C%20tengo%20una%20pregunta%20sobre%20las%20invitaciones%20digitales" class="btn-outline" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      </div>
    </section>
  </main>"""

# FOOTER LIMPIO Y COMERCIAL (SIN ENLACES .MD, SIN BRIEF OPERATIVO, SIN CATÁLOGO NI CONTRATO SIN APROBAR)
FOOTER_HTML = f"""  <footer class="site-footer">
    <div class="ft-logo">CELEBRATION</div>
    <nav class="ft-nav" aria-label="Navegación del sitio">
      <a href="#servicios">Colecciones</a>
      <a href="#proceso">Cómo funciona</a>
      <a href="#estilos">Demos</a>
      <a href="#faq">FAQ</a>
      <a href="planner.html">Portal de novios</a>
    </nav>
    <a href="{WA_BASE}Hola%20CELEBRATION%2C%20quisiera%20asesor%C3%ADa%20personalizada" class="btn" target="_blank" rel="noopener">Atención por WhatsApp</a>
    <p class="ft-copy">© 2026 CELEBRATION · Invitaciones digitales para bodas extraordinarias</p>
  </footer>"""

NAV_LINKS = [("#servicios", "Colecciones"), ("#proceso", "Cómo funciona"), ("#estilos", "Demos"), ("#faq", "FAQ")]

def update_index():
    raw = INDEX_PATH.read_text(encoding="utf-8").replace("\r\n", "\n")

    # 1. Reemplazar <main>...</main>
    raw, n_main = re.subn(r"  <main>.*?</main>", lambda m: MAIN_HTML, raw, count=1, flags=re.S)
    if n_main != 1:
        raise RuntimeError("No se pudo localizar el bloque <main> en index.html")

    # 2. Reemplazar footer
    raw, n_foot = re.subn(r"  <footer class=\"site-footer\">.*?</footer>", lambda m: FOOTER_HTML, raw, count=1, flags=re.S)
    if n_foot != 1:
        raise RuntimeError("No se pudo localizar el bloque <footer> en index.html")

    # 3. Ajustar desktop nav links
    desk_str = "\n".join(f'      <a href="{h}">{t}</a>' for h, t in NAV_LINKS)
    raw, n_desk = re.subn(r'(<nav class="desk-nav"[^>]*>\n)(?:\s*<a href="#[^"]+">[^<]+</a>\n)+',
                         lambda m: m.group(1) + desk_str + "\n", raw, count=1)
    if n_desk != 1:
        print("Aviso: desk-nav no requirió sustitución por regex estricto")

    # 4. Ajustar mobile nav links
    mob_str = "\n".join(f'    <a href="{h}" class="mob-link">{t}</a>' for h, t in NAV_LINKS)
    raw, n_mob = re.subn(r'(<div class="mob-nav-overlay"[^>]*>\n)(?:\s*<a href="#[^"]+" class="mob-link">[^<]+</a>\n)+',
                        lambda m: m.group(1) + mob_str + "\n", raw, count=1)
    if n_mob != 1:
        print("Aviso: mob-nav no requirió sustitución por regex estricto")

    # 5. Asegurar inclusión de payment-config.js antes de script.js
    if "payment-config.js" not in raw:
        raw = raw.replace('<script src="script.js"></script>',
                          '<script src="payment-config.js"></script>\n  <script src="script.js"></script>', 1)

    INDEX_PATH.write_text(raw.replace("\n", "\r\n"), encoding="utf-8", newline="")
    print("index.html actualizado exitosamente.")

if __name__ == "__main__":
    update_index()

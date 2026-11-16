import re
from pathlib import Path

INDEX = Path(r"c:\Users\sergi\CELBEATION\index.html")

# 1. Quitar la sección intermedia #pw ("¿Qué es CELEBRATION?") para que las Colecciones queden inmediatamente abajo del Hero.
# 2. En #servicios: poner primero el selector "¿Qué vas a celebrar?" y el encabezado de Colecciones.
# 3. En #proceso ("Cómo funciona / ¿Cómo pedir?"): restaurar el elegante formato original de 4 pasos numerados 01, 02, 03, 04 con proc-grid, proc-item, proc-num, proc-title, proc-desc y llamadas de acción estéticas.

text = INDEX.read_text(encoding="utf-8").replace("\r\n", "\n")

# Quitar la sección #pw intermedia
text = re.sub(r'\s*<!-- QUÉ ES CELEBRATION.*?-->\s*<section class="sec sec--tight" id="pw">.*?</section>', '', text, flags=re.S)

# Reorganizar el encabezado y selector en #servicios
old_servicios_header = r"""    <!-- COLECCIONES & PRECIOS (CONTRATACIÓN DIRECTA) -->
    <section class="sec sec--tight" id="servicios">
      <span id="paquetes" style="display:block; position:relative; top:-90px; visibility:hidden;"></span>
      <div class="tl-header rv">
        <h2 class="sc">Colecciones 2027</h2>
        <p class="tl-subtitle">Elige tu paquete y contrata o reserva con anticipo del 50%.</p>
      </div>

      <!-- SELECTOR ¿QUÉ VAS A CELEBRAR? -->
      <div class="event-picker-wrap rv d1">
        <label for="eventSelect" class="event-picker-label">
          <span class="event-picker-title">¿Qué vas a celebrar?</span>
          <span class="event-picker-hint">Selecciona tu tipo de evento para personalizar tu atención</span>
        </label>
        <div class="event-select-box">
          <select id="eventSelect" class="event-select" aria-label="¿Qué vas a celebrar?">
            <option value="Boda" selected>✦ Boda</option>
            <option value="XV años">✦ XV años</option>
            <option value="Cumpleaños">✦ Cumpleaños</option>
            <option value="Bautizo">✦ Bautizo</option>
            <option value="Baby Shower">✦ Baby Shower</option>
            <option value="Gender Reveal">✦ Gender Reveal (revelación de género)</option>
            <option value="Compromiso">✦ Compromiso</option>
            <option value="Aniversario">✦ Aniversario</option>
            <option value="Graduación">✦ Graduación</option>
            <option value="Primera Comunión">✦ Primera Comunión</option>
            <option value="Otro evento especial">✦ Otro evento especial</option>
          </select>
          <div class="event-select-chevron" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>"""

new_servicios_header = """    <!-- COLECCIONES & PRECIOS (DIRECTAMENTE ABAJO DEL HERO) -->
    <section class="sec" id="servicios" style="padding-top: 3.5rem;">
      <span id="paquetes" style="display:block; position:relative; top:-90px; visibility:hidden;"></span>

      <!-- SELECTOR ¿QUÉ VAS A CELEBRAR? ELEGANTE Y CENTRADO -->
      <div class="event-picker-wrap rv" style="margin-bottom: 2.2rem;">
        <label for="eventSelect" class="event-picker-label">
          <span class="event-picker-title" style="font-family: var(--font-serif); font-size: clamp(1.8rem, 3.5vw, 2.4rem); letter-spacing: 0.04em;">¿Qué vas a celebrar?</span>
          <span class="event-picker-hint" style="font-family: var(--font-sans); font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold);">Elige tu tipo de evento para personalizar tu experiencia</span>
        </label>
        <div class="event-select-box" style="margin-top: 0.8rem;">
          <select id="eventSelect" class="event-select" aria-label="¿Qué vas a celebrar?">
            <option value="Boda" selected>✦ Boda</option>
            <option value="XV años">✦ XV años</option>
            <option value="Cumpleaños">✦ Cumpleaños</option>
            <option value="Bautizo">✦ Bautizo</option>
            <option value="Baby Shower">✦ Baby Shower</option>
            <option value="Gender Reveal">✦ Gender Reveal (revelación de género)</option>
            <option value="Compromiso">✦ Compromiso</option>
            <option value="Aniversario">✦ Aniversario</option>
            <option value="Graduación">✦ Graduación</option>
            <option value="Primera Comunión">✦ Primera Comunión</option>
            <option value="Otro evento especial">✦ Otro evento especial</option>
          </select>
          <div class="event-select-chevron" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="tl-header rv">
        <span style="font-family:var(--font-sans); font-size:0.68rem; letter-spacing:0.32em; text-transform:uppercase; color:var(--gold); font-weight:600; display:block; margin-bottom:0.8rem;">
          ✦ Colecciones Digitales 2027 • Desde $990 MXN
        </span>
        <h2 class="sc" style="margin-bottom:1rem;">Colecciones &amp; Precios</h2>
        <p class="tl-subtitle" style="max-width: 620px; margin: 0 auto;">Invitaciones web personalizadas de alta costura para compartir en WhatsApp. Diseñadas para reflejar la esencia de su celebración.</p>
      </div>"""

text = text.replace(old_servicios_header, new_servicios_header)

# Restaurar la sección #proceso con el formato elegante original (proc-grid de alta gama)
old_proceso = r"""    <!-- CÓMO FUNCIONA EL PROCESO -->
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
    </section>"""

new_proceso = """    <!-- CÓMO FUNCIONA / PROCESO EDITORIAL DE ALTA GAMA -->
    <section class="sec sec--alt" id="proceso">
      <div style="max-width:var(--max-narrow); margin:0 auto; display:flex; flex-direction:column; gap:2.8rem;">
        <div class="tl-header rv" style="margin-bottom: 0;">
          <span style="font-family:var(--font-sans); font-size:0.68rem; letter-spacing:0.32em; text-transform:uppercase; color:var(--gold); font-weight:600; display:block; margin-bottom:0.8rem;">
            ✦ Experiencia Simple y Refinada
          </span>
          <h2 class="sc" style="margin-bottom:0.8rem;">¿Cómo funciona?</h2>
          <p class="tl-subtitle">Tu invitación digital personalizada lista en 4 sencillos pasos.</p>
        </div>

        <div class="proc-grid rv d1">
          <div class="proc-item">
            <span class="proc-num">01</span>
            <div class="proc-title">Elige tu colección</div>
            <p class="proc-desc">Selecciona el paquete que mejor refleje el estilo y la escala de tu celebración (Mini, Essential, Premiere o Signature).</p>
          </div>
          <div class="proc-item">
            <span class="proc-num">02</span>
            <div class="proc-title">Contrata o aparta con anticipo</div>
            <p class="proc-desc">Aparta tu fecha con un anticipo del 50% con tarjeta vía Mercado Pago o transferencia SPEI (o pago completo en Mini Celebration).</p>
          </div>
          <div class="proc-item">
            <span class="proc-num">03</span>
            <div class="proc-title">Comparte los detalles de tu evento</div>
            <p class="proc-desc">Envíanos la fecha, lugar, horarios, fotografías y código de vestimenta. Diseñamos una primera propuesta viva e interactiva en 3 a 5 días hábiles.</p>
          </div>
          <div class="proc-item">
            <span class="proc-num">04</span>
            <div class="proc-title">Ajustes y entrega para WhatsApp</div>
            <p class="proc-desc">Validamos juntos cada detalle hasta que quede perfecta y lista para compartir con todos tus invitados en un solo toque.</p>
          </div>
        </div>

        <div class="proc-ctas rv d2" style="display:flex; justify-content:center; gap:1.2rem; flex-wrap:wrap;">
          <a href="#servicios" class="btn">Ver colecciones →</a>
          <a href="https://wa.me/528121912778?text=Hola%20CELEBRATION%2C%20quiero%20informaci%C3%B3n%20para%20mi%20evento%20%E2%9C%A8" class="btn-outline" target="_blank" rel="noopener">Consultar por WhatsApp →</a>
        </div>
      </div>
    </section>"""

text = text.replace(old_proceso, new_proceso)

INDEX.write_text(text.replace("\n", "\r\n"), encoding="utf-8", newline="")
print("index.html reestructurado con éxito: paquetes abajo del hero, selector arriba, y proceso original elegante!")

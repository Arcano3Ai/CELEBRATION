import re
from pathlib import Path

INDEX = Path(r"c:\Users\sergi\CELBEATION\index.html")
WA_NUM = "528121912778"

# 4 Cards con estética editorial elevada:
# Imagen de cabecera con zoom sutil, badge flotante de alta costura, título en Pinyon Script, precio Serif editorial,
# lista de beneficios pulida y grupo de doble botón elegante (CONTRATAR AHORA + CONSULTAR POR WHATSAPP) con nota de pago seguro.

CARDS_HTML = """        <!-- TIER 1: MINI CELEBRATION -->
        <article class="srv-card plan-card rv d1" id="plan-mini">
          <div class="srv-badge-tag">Básico Digital</div>
          <div class="srv-img-box">
            <img src="assets/images/mobile_couple_story.jpg" alt="Mini Celebration — Invitación Digital" class="srv-img" loading="lazy">
          </div>
          <div class="srv-body">
            <h3 class="srv-title">Mini Celebration</h3>
            <div class="srv-price-box">
              <span class="srv-price-curr">$990</span>
              <span class="srv-price-unit">MXN</span>
            </div>
            <div class="srv-anticipo-meta">✦ Pago completo</div>
            <p class="srv-lead">La opción esencial y rápida para compartir los datos clave de su evento con máxima distinción.</p>
            <ul class="srv-features-list">
              <li><strong>Invitación digital personalizada</strong> con tipografía y paleta de su evento</li>
              <li><strong>Fecha, horario y cuenta regresiva</strong> interactiva en tiempo real</li>
              <li><strong>Ubicación con botón directo</strong> a Google Maps y Waze</li>
              <li><strong>Confirmación de asistencia</strong> directa e inmediata por WhatsApp</li>
            </ul>
            <div class="srv-actions-group">
              <a class="srv-btn-primary is-disabled" href="#" data-contract="mini" aria-disabled="true">Contratar ahora</a>
              <a class="srv-btn-ghost" href="https://wa.me/528121912778?text=Hola%2C%20quiero%20informaci%C3%B3n%20de%20Mini%20Celebration%20de%20%24990." data-plan-wa="mini" target="_blank" rel="noopener">Consultar por WhatsApp</a>
              <div class="srv-trust-badge" data-pay-note="mini">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Pago próximamente disponible</span>
              </div>
            </div>
          </div>
        </article>

        <!-- TIER 2: ESSENTIAL -->
        <article class="srv-card plan-card rv d2" id="plan-essential">
          <div class="srv-badge-tag">Personalizado</div>
          <div class="srv-img-box">
            <img src="assets/images/estilo_romantico.jpg" alt="Colección Essential — CELEBRATION" class="srv-img" loading="lazy">
          </div>
          <div class="srv-body">
            <h3 class="srv-title">Essential</h3>
            <div class="srv-price-box">
              <span class="srv-price-curr">$1,490</span>
              <span class="srv-price-unit">MXN</span>
            </div>
            <div class="srv-anticipo-meta">✦ Anticipo: $745 MXN (50%)</div>
            <p class="srv-lead">Diseño visual a la medida con galería fotográfica e información extendida para sus invitados.</p>
            <ul class="srv-features-list">
              <li><strong>Todo lo incluido en Mini</strong> más:</li>
              <li><strong>Diseño visual personalizado</strong> con dirección de arte a la medida</li>
              <li><strong>Galería fotográfica</strong> de alta resolución</li>
              <li><strong>Información ampliada del evento:</strong> Itinerario, dress code y notas</li>
              <li><strong>URL personalizada</strong> dentro de celebration.com.mx</li>
            </ul>
            <div class="srv-actions-group">
              <a class="srv-btn-primary is-disabled" href="#" data-contract="essential" aria-disabled="true">Contratar ahora</a>
              <a class="srv-btn-ghost" href="https://wa.me/528121912778?text=Hola%2C%20quiero%20reservar%20Essential%20de%20%241%2C490." data-plan-wa="essential" target="_blank" rel="noopener">Consultar por WhatsApp</a>
              <div class="srv-trust-badge" data-pay-note="essential">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Pago próximamente disponible</span>
              </div>
            </div>
          </div>
        </article>

        <!-- TIER 3: PREMIERE EDITION (DESTACADO RECOMENDADO) -->
        <article class="srv-card srv-featured plan-card plan-card--featured rv d3" id="plan-premiere">
          <div class="srv-badge-tag featured">★ Más Solicitado • Recomendado</div>
          <div class="srv-img-box">
            <img src="assets/images/hero_wedding_couple.jpg" alt="Premiere Edition — CELEBRATION" class="srv-img" loading="lazy">
          </div>
          <div class="srv-body">
            <h3 class="srv-title">Premiere Edition</h3>
            <div class="srv-price-box">
              <span class="srv-price-curr">$2,490</span>
              <span class="srv-price-unit">MXN</span>
            </div>
            <div class="srv-anticipo-meta">✦ Anticipo: $1,245 MXN (50%)</div>
            <p class="srv-lead">Nuestra edición más aclamada: Smart RSVP inteligente, Save the Date en video y música personalizada.</p>
            <ul class="srv-features-list">
              <li><strong>Todo lo incluido en Essential</strong> más:</li>
              <li><strong>Smart RSVP interactivo:</strong> Buscador por invitado/familia y control de pases</li>
              <li><strong>Save the Date cinematográfico</strong> en formato vertical MP4</li>
              <li><strong>Composición musical instrumental original</strong> como banda sonora</li>
              <li><strong>Secciones adicionales:</strong> Hoteles sugeridos, guía de viaje y dress code</li>
            </ul>
            <div class="srv-actions-group">
              <a class="srv-btn-primary srv-btn-featured is-disabled" href="#" data-contract="premiere" aria-disabled="true">Contratar ahora</a>
              <a class="srv-btn-ghost" href="https://wa.me/528121912778?text=Hola%2C%20quiero%20reservar%20Premiere%20Edition%20de%20%242%2C490." data-plan-wa="premiere" target="_blank" rel="noopener">Consultar por WhatsApp</a>
              <div class="srv-trust-badge" data-pay-note="premiere">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Pago próximamente disponible</span>
              </div>
            </div>
          </div>
        </article>

        <!-- TIER 4: SIGNATURE -->
        <article class="srv-card plan-card rv d4" id="plan-signature">
          <div class="srv-badge-tag">Suite de Ultra Lujo</div>
          <div class="srv-img-box">
            <img src="assets/images/estilo_editorial.jpg" alt="Colección Signature — CELEBRATION" class="srv-img" loading="lazy">
          </div>
          <div class="srv-body">
            <h3 class="srv-title">Signature</h3>
            <div class="srv-price-box">
              <span class="srv-price-curr">$3,990</span>
              <span class="srv-price-unit">MXN</span>
            </div>
            <div class="srv-anticipo-meta">✦ Anticipo: $1,995 MXN (50%)</div>
            <p class="srv-lead">La máxima expresión de alta costura digital: Monograma de autor, narrativa editorial y mesa de regalos.</p>
            <ul class="srv-features-list">
              <li><strong>Todo lo incluido en Premiere</strong> más:</li>
              <li><strong>Monograma personalizado de autor</strong> e identidad tipográfica exclusiva</li>
              <li><strong>Historia de la pareja</strong> con narrativa editorial y timeline conmemorativo</li>
              <li><strong>Galería fotográfica ampliada</strong> con visualizador de pantalla completa</li>
              <li><strong>Mesa de regalos</strong> con enlaces externos (Liverpool, Amazon, etc.) y CLABE</li>
              <li><strong>Dirección visual extendida</strong> y acompañamiento concierge prioritario</li>
            </ul>
            <div class="srv-actions-group">
              <a class="srv-btn-primary is-disabled" href="#" data-contract="signature" aria-disabled="true">Contratar ahora</a>
              <a class="srv-btn-ghost" href="https://wa.me/528121912778?text=Hola%2C%20quiero%20informaci%C3%B3n%20de%20Signature%20de%20%243%2C990." data-plan-wa="signature" target="_blank" rel="noopener">Consultar por WhatsApp</a>
              <div class="srv-trust-badge" data-pay-note="signature">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Pago próximamente disponible</span>
              </div>
            </div>
          </div>
        </article>"""

def update():
    text = INDEX.read_text(encoding="utf-8").replace("\r\n", "\n")

    # Reemplazar el contenedor dentro de #servicios
    pattern = r'<div class="plan-grid">.*?</div>\s*</section>'
    replacement = f'<div class="servicios-grid-4 plan-grid">\n{CARDS_HTML}\n      </div>\n    </section>'

    new_text, n = re.subn(pattern, replacement, text, flags=re.S)
    if n != 1:
        raise RuntimeError("No se pudo reemplazar el bloque de colecciones")

    INDEX.write_text(new_text.replace("\n", "\r\n"), encoding="utf-8", newline="")
    print("index.html actualizado con la estructura de alta costura editorial!")

if __name__ == '__main__':
    update()

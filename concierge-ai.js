/**
 * CELEBRATION Concierge AI — Engine & Interactive Modal Logic
 * Motor de Inteligencia Artificial para atención a novios e invitados
 */

import { CONCIERGE_EVENTS_DB, CELEBRATION_FAQ_DB } from './concierge-db.js';

class CelebrationConciergeAI {
  constructor() {
    this.currentContext = null; // Evento activo o folio seleccionado
    this.currentGuest = null;
    this.messages = [];
    this.isOpen = false;
    this.init();
  }

  init() {
    this.renderUI();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  renderUI() {
    // Inject HTML for the floating concierge widget
    const widgetHTML = `
      <!-- Trigger Button -->
      <button class="concierge-trigger" id="conciergeTrigger" aria-label="Abrir Concierge AI">
        <span class="trigger-spark">✦</span>
        <span class="trigger-label">Concierge AI</span>
      </button>

      <!-- Concierge Drawer / Modal -->
      <div class="concierge-modal" id="conciergeModal" aria-hidden="true">
        <div class="concierge-backdrop" id="conciergeBackdrop"></div>
        <div class="concierge-panel">
          <!-- Header -->
          <div class="concierge-header">
            <div class="concierge-title-box">
              <div class="concierge-badge">
                <span class="pulse-dot"></span>
                <span>Atelier AI • En Línea</span>
              </div>
              <h3 class="concierge-name">CELEBRATION Concierge</h3>
              <p class="concierge-sub" id="conciergeContextSub">Asistente Privado de Bodas &amp; Eventos</p>
            </div>
            <button class="concierge-close" id="conciergeClose" aria-label="Cerrar Concierge">✕</button>
          </div>

          <!-- Context Selector (Folio o Nombre) -->
          <div class="concierge-context-bar">
            <input type="text" id="conciergeFolioInput" placeholder="Ingresa tu Folio (ej. #VAL-2026) o tu Nombre..." autocomplete="off">
            <button id="btnSetContext">Cargar Evento</button>
          </div>

          <!-- Active Context Banner -->
          <div class="concierge-active-event" id="conciergeActiveBanner" style="display:none;">
            <span class="active-dot">✦</span>
            <span id="activeEventText">Evento: Valentina &amp; Mateo (#VAL-2026)</span>
            <button id="btnClearContext" title="Cambiar evento">✕</button>
          </div>

          <!-- Chat Body -->
          <div class="concierge-body" id="conciergeChatBody">
            <!-- Messages rendered here -->
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="concierge-chips" id="conciergeChips">
            <button class="chip" data-q="¿Cuáles son los paquetes de CELEBRATION?">💎 Paquetes y precios</button>
            <button class="chip" data-q="¿Cómo funciona el Smart RSVP?">📩 Smart RSVP</button>
            <button class="chip" data-q="¿Cuál es el código de vestimenta?">👗 Dress Code</button>
            <button class="chip" data-q="¿A qué hora empieza la ceremonia?">⏰ Horarios y sede</button>
            <button class="chip" data-q="¿Dónde está la mesa de regalos?">🎁 Mesa de regalos</button>
          </div>

          <!-- Input Area -->
          <form class="concierge-form" id="conciergeForm">
            <input type="text" id="conciergeUserInput" placeholder="Pregunta sobre horarios, sedes, RSVP o paquetes..." autocomplete="off">
            <button type="submit" id="btnSendMessage" aria-label="Enviar pregunta">
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </form>

          <div class="concierge-footer-note">
            <span>¿Deseas hablar con una persona? </span>
            <a href="https://wa.me/5215500000000?text=Hola%20CELEBRATION%2C%20solicito%20atenci%C3%B3n%20con%20un%20concierge%20humano" target="_blank" rel="noopener">WhatsApp Directo ↗</a>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
  }

  attachEventListeners() {
    const trigger = document.getElementById('conciergeTrigger');
    const closeBtn = document.getElementById('conciergeClose');
    const backdrop = document.getElementById('conciergeBackdrop');
    const form = document.getElementById('conciergeForm');
    const input = document.getElementById('conciergeUserInput');
    const folioInput = document.getElementById('conciergeFolioInput');
    const setContextBtn = document.getElementById('btnSetContext');
    const clearBtn = document.getElementById('btnClearContext');
    const chipsContainer = document.getElementById('conciergeChips');

    trigger.addEventListener('click', () => this.open());
    closeBtn.addEventListener('click', () => this.close());
    backdrop.addEventListener('click', () => this.close());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      this.handleUserMessage(text);
    });

    setContextBtn.addEventListener('click', () => {
      this.resolveContext(folioInput.value.trim());
      folioInput.value = '';
    });

    folioInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.resolveContext(folioInput.value.trim());
        folioInput.value = '';
      }
    });

    clearBtn.addEventListener('click', () => this.clearContext());

    chipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip) {
        const query = chip.dataset.q;
        this.handleUserMessage(query);
      }
    });
  }

  open() {
    const modal = document.getElementById('conciergeModal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;

    // Focus input
    setTimeout(() => {
      const input = document.getElementById('conciergeUserInput');
      if (input) input.focus();
    }, 250);
  }

  close() {
    const modal = document.getElementById('conciergeModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.isOpen = false;
  }

  addWelcomeMessage() {
    const welcome = `¡Hola! Soy tu **Concierge de CELEBRATION** ✦\n\nPuedo responder cualquier duda sobre nuestros paquetes de invitaciones, Smart RSVP y Live Event, o bien informarte los detalles de tu evento si ingresas tu **Folio** (ej. *#VAL-2026*) o tu nombre.\n\n¿En qué puedo ayudarte hoy?`;
    this.renderBotMessage(welcome);
  }

  resolveContext(query) {
    if (!query) return;
    const clean = query.replace('#', '').trim().toUpperCase();

    // 1. Check direct folio in DB
    if (CONCIERGE_EVENTS_DB[clean]) {
      this.setContext(CONCIERGE_EVENTS_DB[clean]);
      return;
    }

    // 2. Check couple name match
    const qLower = query.toLowerCase();
    for (const key in CONCIERGE_EVENTS_DB) {
      const ev = CONCIERGE_EVENTS_DB[key];
      if (ev.couple.toLowerCase().includes(qLower) || ev.city.toLowerCase().includes(qLower)) {
        this.setContext(ev);
        return;
      }
      // Check guests
      const guest = ev.guests.find(g => g.name.toLowerCase().includes(qLower) || g.family.toLowerCase().includes(qLower));
      if (guest) {
        this.setContext(ev, guest);
        return;
      }
    }

    // Not found
    this.renderBotMessage(`No encontré ningún evento registrado con el folio o nombre **"${query}"**. Los folios de demostración disponibles son:\n- **#VAL-2026** (Boda Valentina & Mateo)\n- **#ISA-2026** (Boda Isabella & Santiago)\n- **#CAM-2026** (Boda Camila & Sebastián)\n\nO puedes preguntarme directamente sobre los paquetes y servicios de CELEBRATION.`);
  }

  setContext(eventData, guest = null) {
    this.currentContext = eventData;
    this.currentGuest = guest;

    const banner = document.getElementById('conciergeActiveBanner');
    const bannerText = document.getElementById('activeEventText');
    const sub = document.getElementById('conciergeContextSub');

    banner.style.display = 'flex';
    bannerText.textContent = `Boda: ${eventData.couple} (#${eventData.folio})`;
    sub.textContent = `Atendiendo evento: ${eventData.couple}`;

    let msg = `✦ Se ha cargado la información oficial para la boda de **${eventData.couple}** (${eventData.date} en ${eventData.city}).`;
    if (guest) {
      msg += `\n\n¡Bienvenido/a **${guest.name}**! Tu invitación para **${guest.family}** cuenta con **${guest.passes} pases asignados** (${guest.confirmed ? 'Confirmado' : 'Pendiente de confirmación'}).`;
    }
    msg += `\n\nPuedes preguntarme por horarios de misa, recepción, cómo llegar, mesa de regalos, dress code u hoteles con descuento.`;

    this.renderBotMessage(msg);
  }

  clearContext() {
    this.currentContext = null;
    this.currentGuest = null;
    const banner = document.getElementById('conciergeActiveBanner');
    const sub = document.getElementById('conciergeContextSub');

    banner.style.display = 'none';
    sub.textContent = 'Asistente Privado de Bodas & Eventos';
    this.renderBotMessage('Se ha desvinculado el evento. Puedes volver a consultar dudas generales de CELEBRATION o cargar un nuevo folio.');
  }

  handleUserMessage(text) {
    this.renderUserMessage(text);
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(text);
      this.renderBotMessage(response);
    }, 600);
  }

  generateResponse(query) {
    const q = query.toLowerCase();

    // 1. Check if user typed a folio or name to switch context
    if (q.includes('#val') || q.includes('valentina') || q.includes('mateo')) {
      if (!this.currentContext || this.currentContext.folio !== 'VAL-2026') {
        this.setContext(CONCIERGE_EVENTS_DB['VAL-2026']);
        return `He cargado la boda de **Valentina & Mateo** (#VAL-2026). ¿Qué deseas consultar sobre el evento?`;
      }
    }
    if (q.includes('#isa') || q.includes('isabella') || q.includes('santiago')) {
      if (!this.currentContext || this.currentContext.folio !== 'ISA-2026') {
        this.setContext(CONCIERGE_EVENTS_DB['ISA-2026']);
        return `He cargado la boda de **Isabella & Santiago** (#ISA-2026). ¿Qué información necesitas?`;
      }
    }
    if (q.includes('#cam') || q.includes('camila') || q.includes('sebastián') || q.includes('sebastian')) {
      if (!this.currentContext || this.currentContext.folio !== 'CAM-2026') {
        this.setContext(CONCIERGE_EVENTS_DB['CAM-2026']);
        return `He cargado la boda de **Camila & Sebastián** (#CAM-2026) en Los Cabos. ¿En qué te ayudo?`;
      }
    }

    // 2. If Event Context is Active: resolve specific event inquiries
    if (this.currentContext) {
      const ev = this.currentContext;

      // Horarios / Ceremonia / Recepción
      if (q.includes('horario') || q.includes('hora') || q.includes('ceremonia') || q.includes('misa') || q.includes('recepcion') || q.includes('lugar') || q.includes('donde')) {
        return `**Itinerario para la boda de ${ev.couple}:**\n\n• **Ceremonia Religiosa:** ${ev.ceremony.time} en **${ev.ceremony.place}** (${ev.ceremony.address}). [Ver mapa](${ev.ceremony.mapsUrl})\n\n• **Recepción & Banquete:** ${ev.reception.time} en **${ev.reception.place}** (${ev.reception.address}). [Ver mapa](${ev.reception.mapsUrl})`;
      }

      // Dress code
      if (q.includes('vestir') || q.includes('dress') || q.includes('ropa') || q.includes('codigo') || q.includes('etiqueta') || q.includes('color')) {
        return `**Código de Vestimenta — ${ev.couple}:**\n\n**${ev.dressCode.title}**\n\n${ev.dressCode.notes}\n\n*Paleta de inspiración:* ${ev.dressCode.colors.join(', ')}.`;
      }

      // Mesa de regalos
      if (q.includes('regalo') || q.includes('mesa') || q.includes('liverpool') || q.includes('amazon') || q.includes('cuenta') || q.includes('clabe') || q.includes('banco')) {
        let text = `**Mesa de Regalos — ${ev.couple}:**\n`;
        ev.gifts.forEach(g => {
          if (g.clabe) {
            text += `\n• **${g.store}:** Banco ${g.bank} — CLABE: \`${g.clabe}\``;
          } else {
            text += `\n• **${g.store}:** Evento: *${g.eventNumber}*`;
          }
        });
        return text;
      }

      // Hospedaje / Hoteles
      if (q.includes('hotel') || q.includes('hospedaje') || q.includes('quedar') || q.includes('dormir') || q.includes('vuelo') || q.includes('descuento')) {
        let text = `**Hoteles con Tarifa Preferencial — ${ev.couple}:**\n`;
        ev.hotels.forEach(h => {
          text += `\n• **${h.name}:** ${h.rate} (Código: \`${h.discountCode}\`)`;
        });
        return text;
      }

      // Pases / Invitados específicos
      if (q.includes('pase') || q.includes('cuantos') || q.includes('mesa') || q.includes('acompañante') || q.includes('nombres')) {
        if (this.currentGuest) {
          return `Para **${this.currentGuest.name}** (${this.currentGuest.family}), tienen asignados **${this.currentGuest.passes} pases**, asignados a la **${this.currentGuest.table}**. Estado: **${this.currentGuest.confirmed ? 'Confirmado' : 'Pendiente'}**.`;
        } else {
          return `Para consultar tus pases específicos y asignación de mesa, por favor escribe tu nombre y apellido en el buscador superior.`;
        }
      }
    }

    // 3. Check General CELEBRATION FAQ & Services
    for (const item of CELEBRATION_FAQ_DB) {
      if (item.keywords.some(k => q.includes(k))) {
        return item.response;
      }
    }

    // 4. Default intelligent fallback
    return `Comprendo tu pregunta. Para darte una respuesta precisa:\n\n1. Si deseas información sobre un enlace particular, escribe tu **Folio de evento** (ej. *#VAL-2026*, *#ISA-2026*, *#CAM-2026*) o tu nombre.\n2. Si deseas información sobre nuestros servicios de invitaciones web, puedes preguntarme sobre **paquetes**, **precios**, **tiempos de entrega**, **Smart RSVP** o **tecnología NFC**.\n\nTambién puedes contactar a nuestro equipo por [WhatsApp](https://wa.me/5215500000000) para atención inmediata.`;
  }

  renderUserMessage(text) {
    const body = document.getElementById('conciergeChatBody');
    const msgEl = document.createElement('div');
    msgEl.className = 'c-msg user';
    msgEl.textContent = text;
    body.appendChild(msgEl);
    this.scrollToBottom();
  }

  renderBotMessage(markdownText) {
    const body = document.getElementById('conciergeChatBody');
    const msgEl = document.createElement('div');
    msgEl.className = 'c-msg bot';
    msgEl.innerHTML = this.parseMarkdown(markdownText);
    body.appendChild(msgEl);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const body = document.getElementById('conciergeChatBody');
    const typing = document.createElement('div');
    typing.className = 'c-typing';
    typing.id = 'conciergeTyping';
    typing.innerHTML = `<span></span><span></span><span></span>`;
    body.appendChild(typing);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typing = document.getElementById('conciergeTyping');
    if (typing) typing.remove();
  }

  scrollToBottom() {
    const body = document.getElementById('conciergeChatBody');
    body.scrollTop = body.scrollHeight;
  }

  parseMarkdown(str) {
    let parsed = str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\`(.*?)\`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    return parsed;
  }
}

// Auto-initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.celebrationConcierge = new CelebrationConciergeAI();
});

/**
 * CELEBRATION — Digital Guestbook (Libro de Firmas Digital) Engine
 * Permite a los invitados dejar dedicatorias y leer mensajes en vivo con persistencia local
 */

const DEFAULT_WISHES_BY_FOLIO = {
  'VAL-2026': [
    {
      author: 'Familia Garza Morales',
      relation: 'Familia de la Novia',
      message: 'Que el amor y complicidad que los une hoy crezca con cada aventura juntos en San Miguel. ¡Los queremos muchísimo!',
      date: '12 de Octubre, 2026'
    },
    {
      author: 'Alejandro Morales',
      relation: 'Hermano / Padrino',
      message: 'Queridos Vale y Mateo, verlos tan plenos es una bendición enorme. ¡Listos para celebrar en grande en Las Trancas!',
      date: '15 de Octubre, 2026'
    },
    {
      author: 'Carlos Villarreal & Mariana',
      relation: 'Amigos de la Pareja',
      message: '¡La boda más esperada del año! Se merecen toda la dicha y magia del mundo en esta nueva etapa.',
      date: '18 de Octubre, 2026'
    },
    {
      author: 'Luciana Zambrano',
      relation: 'Dama de Honor',
      message: 'Vale, eres la novia más hermosa. Mateo, te llevas el tesoro más grande. ¡Que vivan los novios por siempre!',
      date: '20 de Octubre, 2026'
    }
  ],
  'ISA-2026': [
    {
      author: 'Fernando Treviño',
      relation: 'Familia del Novio',
      message: 'Isabella y Santiago, que este nuevo capítulo de sus vidas esté colmado de bendiciones y elegancia eterna. Un abrazo entrañable desde San Pedro.',
      date: '1 de Septiembre, 2026'
    },
    {
      author: 'Lucía Domínguez',
      relation: 'Amiga de Isabella',
      message: '¡Qué noche tan espectacular nos espera en el Palacio Metropolitano! Los mejores deseos hoy, mañana y siempre.',
      date: '14 de Septiembre, 2026'
    },
    {
      author: 'Santiago Creel Jr.',
      relation: 'Padrino de Velación',
      message: 'Honor inmenso acompañarlos en este compromiso sagrado en la Catedral Metropolitana. Brindemos por su felicidad eterna.',
      date: '20 de Septiembre, 2026'
    }
  ],
  'CAM-2026': [
    {
      author: 'Patricio Sada',
      relation: 'Amigo de Sebastián',
      message: 'Cami y Sebas, ver el atardecer en Los Cabos junto a ustedes celebrando su amor será inolvidable. ¡A brindar hasta el amanecer!',
      date: '5 de Octubre, 2026'
    },
    {
      author: 'Renata Lozano',
      relation: 'Dama de Honor',
      message: '¡Muchas felicidades a los dos! Que su amor sea tan inmenso y libre como el mar de Cortés en Cabo.',
      date: '8 de Octubre, 2026'
    },
    {
      author: 'Mauricio Fernández',
      relation: 'Familia de la Pareja',
      message: 'Enhorabuena por esta unión extraordinaria. Su vibra y cariño inspiran a todos los que los rodeamos.',
      date: '12 de Octubre, 2026'
    }
  ]
};

export class DigitalGuestbook {
  constructor(config) {
    this.folio = config.folio;
    this.containerId = config.containerId;
    this.theme = config.theme || 'light';
    this.wishes = [];
    this.init();
  }

  init() {
    this.loadWishes();
    this.render();
  }

  getStorageKey() {
    return `celebration_guestbook_${this.folio}`;
  }

  loadWishes() {
    const saved = localStorage.getItem(this.getStorageKey());
    if (saved) {
      try {
        this.wishes = JSON.parse(saved);
      } catch (e) {
        this.wishes = DEFAULT_WISHES_BY_FOLIO[this.folio] || [];
      }
    } else {
      this.wishes = DEFAULT_WISHES_BY_FOLIO[this.folio] || [];
    }
  }

  saveWishes() {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.wishes));
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (this.theme === 'dark') {
      container.classList.add('dark-theme');
    }

    container.innerHTML = `
      <section class="guestbook-section">
        <div class="guestbook-container">
          <div class="guestbook-header">
            <span class="guestbook-eyebrow">✦ Libro Conmemorativo</span>
            <h2 class="guestbook-title">Dedicatorias &amp; Buenos Deseos</h2>
            <p class="guestbook-subtitle">
              Los mensajes de quienes más amamos son el recuerdo más preciado de nuestro enlace. Deja tus palabras para nuestro libro conmemorativo.
            </p>
            <div class="guestbook-actions">
              <button type="button" class="guestbook-btn-sign" id="btnOpenGuestbookModal">
                <span>✍️ Firmar Libro de Deseos</span>
              </button>
            </div>
          </div>

          <div class="guestbook-grid" id="guestbookGrid">
            <!-- Cards rendered here -->
          </div>
        </div>
      </section>

      <!-- Modal to add wish -->
      <div class="guestbook-modal-backdrop" id="guestbookModal">
        <div class="guestbook-modal-card">
          <div class="guestbook-modal-header">
            <h3 class="guestbook-modal-title">Escribir Dedicatoria</h3>
            <button type="button" class="guestbook-modal-close" id="btnCloseGuestbookModal">✕</button>
          </div>
          <form id="guestbookForm">
            <div class="guestbook-form-group">
              <label for="gbAuthor">Tu Nombre o Familia *</label>
              <input type="text" id="gbAuthor" class="guestbook-input" placeholder="Ej. Familia Garza Morales o Sofía B." required>
            </div>
            <div class="guestbook-form-group">
              <label for="gbRelation">Relación con los Novios</label>
              <select id="gbRelation" class="guestbook-select">
                <option value="Familia de la Novia">Familia de la Novia</option>
                <option value="Familia del Novio">Familia del Novio</option>
                <option value="Amigos de la Pareja" selected>Amigos de la Pareja</option>
                <option value="Damas / Padrinos">Cortejo / Padrinos</option>
                <option value="Colega / Invitado Especial">Invitado Especial</option>
              </select>
            </div>
            <div class="guestbook-form-group">
              <label for="gbMessage">Tu Mensaje o Deseo *</label>
              <textarea id="gbMessage" class="guestbook-textarea" placeholder="Escribe tus palabras de bendición y cariño para la pareja..." required></textarea>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.6rem; margin-top:1rem;">
              <button type="button" class="guestbook-btn-sign" style="background:transparent; border-color:currentColor; color:inherit; box-shadow:none;" id="btnCancelGuestbook">
                Cancelar
              </button>
              <button type="submit" class="guestbook-btn-sign">
                Publicar en el Libro ✦
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.renderCards();
    this.bindModalEvents();
  }

  renderCards() {
    const grid = document.getElementById('guestbookGrid');
    if (!grid) return;

    if (this.wishes.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; opacity: 0.7;">
          Sé el primero en plasmar una dedicatoria para los novios.
        </div>
      `;
      return;
    }

    grid.innerHTML = this.wishes.map(w => `
      <div class="guestbook-card">
        <div>
          <div class="guestbook-quote-icon">“</div>
          <p class="guestbook-message">${this.escapeHtml(w.message)}</p>
        </div>
        <div class="guestbook-author-meta">
          <span class="guestbook-author-name">${this.escapeHtml(w.author)}</span>
          <span class="guestbook-relation-tag">${this.escapeHtml(w.relation || 'Invitado')}</span>
          <span class="guestbook-date">${this.escapeHtml(w.date || 'Reciente')}</span>
        </div>
      </div>
    `).join('');
  }

  bindModalEvents() {
    const modal = document.getElementById('guestbookModal');
    const btnOpen = document.getElementById('btnOpenGuestbookModal');
    const btnClose = document.getElementById('btnCloseGuestbookModal');
    const btnCancel = document.getElementById('btnCancelGuestbook');
    const form = document.getElementById('guestbookForm');

    const openModal = () => {
      form.reset();
      modal.classList.add('show');
    };

    const closeModal = () => {
      modal.classList.remove('show');
    };

    btnOpen.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('gbAuthor').value.trim();
      const relation = document.getElementById('gbRelation').value;
      const message = document.getElementById('gbMessage').value.trim();

      if (!author || !message) return;

      const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      const todayStr = new Date().toLocaleDateString('es-MX', dateOptions);

      const newWish = { author, relation, message, date: todayStr };
      this.wishes.unshift(newWish);
      this.saveWishes();
      this.renderCards();
      closeModal();

      // Show toast if available
      const toast = document.querySelector('.toast-msg') || document.querySelector('.toast');
      if (toast) {
        toast.textContent = '✦ Tu dedicatoria ha sido inmortalizada en el libro de firmas.';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
      }
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

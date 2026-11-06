/**
 * CELEBRATION — Smart RSVP Predictive Autocomplete & Dual Sync Engine
 * Conecta las invitaciones demo con el portal de novios (planner.html) y concierge-db.js
 */

import { CONCIERGE_EVENTS_DB } from './concierge-db.js';

export class SmartRSVPEngine {
  constructor(config) {
    this.folio = config.folio; // 'VAL-2026', 'ISA-2026', 'CAM-2026'
    this.inputId = config.inputId;
    this.dropdownId = config.dropdownId;
    this.resultBoxId = config.resultBoxId;
    this.theme = config.theme || 'light'; // 'light' or 'dark'
    this.currentGuest = null;
    this.guestList = [];
    this.init();
  }

  init() {
    this.loadGuests();
    this.setupUI();
    this.bindEvents();
  }

  getStorageKey() {
    return `celebration_planner_${this.folio}`;
  }

  loadGuests() {
    const saved = localStorage.getItem(this.getStorageKey());
    if (saved) {
      try {
        this.guestList = JSON.parse(saved);
      } catch (e) {
        this.fallbackGuests();
      }
    } else {
      this.fallbackGuests();
    }
  }

  fallbackGuests() {
    const ev = CONCIERGE_EVENTS_DB[this.folio];
    if (ev && ev.guests) {
      this.guestList = JSON.parse(JSON.stringify(ev.guests));
    } else {
      this.guestList = [];
    }
  }

  saveGuests() {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.guestList));
    // Dispatch global event for planner.html or other components
    window.dispatchEvent(new CustomEvent('celebration_rsvp_saved', { detail: { folio: this.folio } }));
  }

  setupUI() {
    this.input = document.getElementById(this.inputId);
    if (!this.input) return;

    // Wrap input and insert dropdown container
    const parent = this.input.parentElement;
    parent.classList.add('smart-rsvp-wrap');
    if (this.theme === 'dark') {
      parent.classList.add('dark-theme');
    }

    this.dropdown = document.getElementById(this.dropdownId);
    if (!this.dropdown) {
      this.dropdown = document.createElement('div');
      this.dropdown.id = this.dropdownId;
      this.dropdown.className = 'smart-rsvp-dropdown';
      parent.appendChild(this.dropdown);
    }

    this.resultBox = document.getElementById(this.resultBoxId);
  }

  bindEvents() {
    if (!this.input) return;

    // Live search as user types
    this.input.addEventListener('input', (e) => {
      this.onSearchInput(e.target.value);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });
  }

  onSearchInput(query) {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 1) {
      this.closeDropdown();
      return;
    }

    // Refresh guest list from storage in case planner.html updated it
    this.loadGuests();

    const matches = this.guestList.filter(g => {
      const name = (g.name || '').toLowerCase();
      const family = (g.family || '').toLowerCase();
      return name.includes(q) || family.includes(q);
    });

    if (matches.length === 0) {
      this.dropdown.innerHTML = `
        <div style="padding:1rem; text-align:center; font-size:0.8rem; color:#888;">
          No se encontró invitación para "<strong>${this.escapeHtml(query)}</strong>".<br>
          <span style="font-size:0.7rem; color:#aaa;">Revisa la ortografía o contáctanos por WhatsApp.</span>
        </div>
      `;
      this.dropdown.classList.add('show');
      return;
    }

    let html = '';
    matches.forEach(g => {
      const realIndex = this.guestList.indexOf(g);
      html += `
        <div class="smart-rsvp-dropdown-item" data-guest-index="${realIndex}">
          <div class="smart-rsvp-item-info">
            <span class="smart-rsvp-item-name">${g.name}</span>
            <span class="smart-rsvp-item-sub">${g.family || 'Invitación Personal'}</span>
          </div>
          <div class="smart-rsvp-item-badges">
            <span class="smart-rsvp-badge-passes">${g.passes || 1} ${g.passes > 1 ? 'Pases' : 'Pase'}</span>
            <span class="smart-rsvp-badge-table">${g.table || 'Mesa asignada'}</span>
          </div>
        </div>
      `;
    });

    this.dropdown.innerHTML = html;
    this.dropdown.classList.add('show');

    // Attach click events on dropdown items
    this.dropdown.querySelectorAll('.smart-rsvp-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = Number(item.dataset.guestIndex);
        this.selectGuest(this.guestList[idx]);
      });
    });
  }

  selectGuest(guest) {
    this.currentGuest = guest;
    this.input.value = guest.name;
    this.closeDropdown();
    this.renderResultCard(guest);
  }

  closeDropdown() {
    if (this.dropdown) {
      this.dropdown.classList.remove('show');
    }
  }

  renderResultCard(guest) {
    if (!this.resultBox) return;

    const passes = guest.passes || 1;
    const isConfirmed = guest.confirmed === true;
    const isDeclined = guest.confirmed === false;

    // Build form inside result box
    this.resultBox.innerHTML = `
      <div style="text-align:left;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; flex-wrap:wrap; gap:0.5rem;">
          <span style="font-size:0.68rem; letter-spacing:0.2em; text-transform:uppercase; color:#C5A059; font-weight:700;">
            ✦ Invitación Verificada • Folio #${this.folio}
          </span>
          <span style="font-size:0.68rem; padding:0.2rem 0.5rem; border-radius:4px; background:rgba(197,160,89,0.15); color:#C5A059; font-weight:600;">
            ${guest.table || 'Mesa por asignar'}
          </span>
        </div>

        <h3 style="font-size:1.6rem; margin-bottom:0.2rem; font-family:inherit;">${guest.name}</h3>
        <p style="font-size:0.85rem; opacity:0.75; margin-bottom:1.4rem;">
          ${guest.family ? guest.family + ' · ' : ''}<strong>${passes} ${passes > 1 ? 'Pases Reservados' : 'Pase Reservado'}</strong>
        </p>

        <form id="smartRsvpForm" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.68rem; letter-spacing:0.16em; text-transform:uppercase; font-weight:600; margin-bottom:0.4rem; opacity:0.8;">
              ¿Asistirás a nuestro enlace?
            </label>
            <select id="rsvpAttendanceSelect" style="width:100%; padding:0.85rem; font-family:inherit; font-size:0.95rem; border-radius:6px; border:1px solid rgba(197,160,89,0.3); background:inherit; color:inherit;">
              <option value="all" ${isConfirmed ? 'selected' : ''}>¡Sí, asistiremos con alegría! (${passes} ${passes > 1 ? 'personas' : 'persona'})</option>
              ${passes > 1 ? `<option value="1">Solo asistirá 1 persona</option>` : ''}
              <option value="none" ${isDeclined ? 'selected' : ''}>Lamentablemente no podremos asistir</option>
            </select>
          </div>

          <div>
            <label style="display:block; font-size:0.68rem; letter-spacing:0.16em; text-transform:uppercase; font-weight:600; margin-bottom:0.4rem; opacity:0.8;">
              Restricciones de Banquete o Alergias:
            </label>
            <select id="rsvpDietarySelect" style="width:100%; padding:0.85rem; font-family:inherit; font-size:0.95rem; border-radius:6px; border:1px solid rgba(197,160,89,0.3); background:inherit; color:inherit;">
              <option value="Ninguna" ${guest.dietary === 'Ninguna' ? 'selected' : ''}>Ninguna (Menú tradicional)</option>
              <option value="Vegetariano" ${guest.dietary === 'Vegetariano' ? 'selected' : ''}>Vegetariano</option>
              <option value="Vegano" ${guest.dietary === 'Vegano' ? 'selected' : ''}>Vegano</option>
              <option value="Sin Gluten / Celíaco" ${guest.dietary && guest.dietary.includes('Gluten') ? 'selected' : ''}>Sin Gluten / Celíaco</option>
              <option value="Alergia a Mariscos" ${guest.dietary && guest.dietary.includes('Mariscos') ? 'selected' : ''}>Alergia a Mariscos</option>
              <option value="Alergia a Frutos Secos" ${guest.dietary && guest.dietary.includes('Frutos') ? 'selected' : ''}>Alergia a Frutos Secos</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:0.6rem; margin-top:0.2rem;">
            <input type="checkbox" id="rsvpShuttleCheck" ${guest.shuttle ? 'checked' : ''} style="accent-color:#C5A059; width:16px; height:16px; cursor:pointer;">
            <label for="rsvpShuttleCheck" style="font-size:0.78rem; opacity:0.9; cursor:pointer; margin:0;">
              Requerimos transporte oficial a la sede (Shuttle)
            </label>
          </div>

          <button type="submit" id="btnSubmitRsvp" style="width:100%; padding:1rem; border-radius:6px; border:none; background:#C5A059; color:#1a1714; font-size:0.75rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; margin-top:0.6rem; transition:filter 0.2s;">
            Confirmar Asistencia Definitiva →
          </button>
        </form>
      </div>
    `;

    this.resultBox.style.display = 'block';
    this.resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Submit handler
    const form = document.getElementById('smartRsvpForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processConfirmation();
    });
  }

  processConfirmation() {
    const attendance = document.getElementById('rsvpAttendanceSelect').value;
    const dietary = document.getElementById('rsvpDietarySelect').value;
    const shuttle = document.getElementById('rsvpShuttleCheck').checked;

    const realIndex = this.guestList.findIndex(g => g.name === this.currentGuest.name);
    if (realIndex >= 0) {
      if (attendance === 'all') {
        this.guestList[realIndex].confirmed = true;
      } else if (attendance === '1') {
        this.guestList[realIndex].confirmed = true;
        this.guestList[realIndex].passes = 1;
      } else {
        this.guestList[realIndex].confirmed = false;
      }

      this.guestList[realIndex].dietary = dietary;
      this.guestList[realIndex].shuttle = shuttle;

      this.saveGuests();
      this.renderSuccess(this.guestList[realIndex]);
    }
  }

  renderSuccess(guest) {
    const isAttending = guest.confirmed === true;
    const ev = CONCIERGE_EVENTS_DB[this.folio];
    const coupleName = ev ? ev.couple : 'los novios';

    this.resultBox.innerHTML = `
      <div class="smart-rsvp-success">
        <div class="smart-rsvp-success-seal">✦</div>
        <h3 class="smart-rsvp-success-title">
          ${isAttending ? '¡Asistencia Confirmada!' : 'Respuesta Registrada'}
        </h3>
        <p class="smart-rsvp-success-body">
          ${isAttending 
            ? `Gracias por acompañar a <strong>${coupleName}</strong> en este día tan especial. Hemos reservado con amor <strong>${guest.passes} ${guest.passes > 1 ? 'lugares' : 'lugar'}</strong> para <strong>${guest.name}</strong>.`
            : `Lamentamos mucho que no puedas acompañar a <strong>${coupleName}</strong>, pero agradecemos profundamente avisarnos con tiempo.`
          }
        </p>

        <div class="smart-rsvp-success-meta">
          <span style="font-size:0.72rem; padding:0.25rem 0.6rem; border-radius:4px; background:rgba(197,160,89,0.15); color:#C5A059;">
            Mesa: ${guest.table || 'Principal'}
          </span>
          <span style="font-size:0.72rem; padding:0.25rem 0.6rem; border-radius:4px; background:rgba(0,0,0,0.06); opacity:0.8;">
            Menú: ${guest.dietary || 'Estándar'}
          </span>
          ${guest.shuttle ? `<span style="font-size:0.72rem; padding:0.25rem 0.6rem; border-radius:4px; background:rgba(52,152,219,0.15); color:#2980b9;">🚐 Shuttle Asignado</span>` : ''}
        </div>

        <button type="button" class="smart-rsvp-btn-modify" id="btnModifyRsvp">
          Modificar mi respuesta
        </button>
      </div>
    `;

    document.getElementById('btnModifyRsvp').addEventListener('click', () => {
      this.renderResultCard(guest);
    });
  }

  escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

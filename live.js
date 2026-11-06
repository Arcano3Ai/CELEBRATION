/**
 * CELEBRATION — Live Event Stream & Projection Engine
 * Maneja la proyección de fotos en tiempo real, carga desde móviles y modo presentación
 */

import { CONCIERGE_EVENTS_DB } from './concierge-db.js';

const INITIAL_STREAM_PHOTOS = {
  'CAM-2026': [
    {
      id: 'cam-1',
      url: 'assets/images/reception_party_couple.jpg',
      caption: '¡El mejor vals que he presenciado! Qué amor tan grande se tienen.',
      author: 'Patricio Sada • Mesa VIP',
      time: 'Hace 5 minutos'
    },
    {
      id: 'cam-2',
      url: 'assets/images/hero_editorial_couple.jpg',
      caption: 'El atardecer frente al arco de Los Cabos estuvo de película ✨',
      author: 'Renata Lozano • Dama de Honor',
      time: 'Hace 12 minutos'
    },
    {
      id: 'cam-3',
      url: 'assets/images/mobile_couple_story.jpg',
      caption: 'Brindando con champán por esta historia que apenas comienza 🥂',
      author: 'Mauricio Fernández • Mesa VIP',
      time: 'Hace 24 minutos'
    },
    {
      id: 'cam-4',
      url: 'assets/images/hero_wedding_couple.jpg',
      caption: 'La novia más espectacular del mundo. ¡Te queremos Cami!',
      author: 'Regina Garza Lagüera • Mesa 2',
      time: 'Hace 38 minutos'
    }
  ],
  'VAL-2026': [
    {
      id: 'val-1',
      url: 'assets/images/estilo_romantico.jpg',
      caption: '¡La entrada a la Hacienda Las Trancas fue de ensueño total!',
      author: 'Mariana Garza • Mesa 4',
      time: 'Hace 8 minutos'
    },
    {
      id: 'val-2',
      url: 'assets/images/reception_party_couple.jpg',
      caption: '¡A romper la pista con los recién casados! 💃🕺',
      author: 'Alejandro Morales • Padrino',
      time: 'Hace 19 minutos'
    },
    {
      id: 'val-3',
      url: 'assets/images/hero_wedding_couple.jpg',
      caption: 'Muchas felicidades Vale y Mateo, los amamos con el corazón.',
      author: 'Carlos Villarreal • Mesa 2',
      time: 'Hace 30 minutos'
    }
  ],
  'ISA-2026': [
    {
      id: 'isa-1',
      url: 'assets/images/estilo_clasico.jpg',
      caption: 'Misa solemne e imponente en la Catedral. Qué belleza y porte.',
      author: 'Fernando Treviño • Mesa 1',
      time: 'Hace 10 minutos'
    },
    {
      id: 'isa-2',
      url: 'assets/images/hero_editorial_couple.jpg',
      caption: 'Gala insuperable en el Palacio Metropolitano. ¡Salud por los novios!',
      author: 'Lucía Domínguez • Mesa 6',
      time: 'Hace 22 minutos'
    }
  ]
};

class LiveStreamApp {
  constructor() {
    this.currentFolio = 'CAM-2026';
    this.photos = [];
    this.viewMode = 'gallery'; // 'gallery' | 'slideshow'
    this.slideshowIndex = 0;
    this.slideshowTimer = null;
    this.selectedImageData = null;

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadEvent(this.currentFolio);
  }

  cacheElements() {
    this.folioSelect = document.getElementById('streamFolioSelect');
    this.coupleTitle = document.getElementById('coupleStreamTitle');
    this.streamVenue = document.getElementById('streamVenue');
    this.liveGrid = document.getElementById('liveGrid');
    this.galleryView = document.getElementById('galleryView');
    this.slideshowView = document.getElementById('slideshowView');
    this.btnToggleMode = document.getElementById('btnToggleMode');
    this.modeIcon = document.getElementById('modeIcon');
    this.modeLabel = document.getElementById('modeLabel');
    this.btnFullscreen = document.getElementById('btnFullscreen');
    this.qrContainer = document.getElementById('qrContainer');

    // Slide elements
    this.heroSlideImg = document.getElementById('heroSlideImg');
    this.heroSlideQuote = document.getElementById('heroSlideQuote');
    this.heroSlideAuthor = document.getElementById('heroSlideAuthor');

    // Modal elements
    this.uploadModal = document.getElementById('uploadModal');
    this.btnOpenUpload = document.getElementById('btnOpenUpload');
    this.btnCloseUpload = document.getElementById('btnCloseUpload');
    this.btnCancelUpload = document.getElementById('btnCancelUpload');
    this.uploadForm = document.getElementById('uploadForm');
    this.fileInput = document.getElementById('fileInput');
    this.dropzone = document.getElementById('dropzone');
    this.previewBox = document.getElementById('previewBox');
    this.previewImg = document.getElementById('previewImg');
    this.authorInput = document.getElementById('authorInput');
    this.captionInput = document.getElementById('captionInput');

    // Toast
    this.toast = document.getElementById('liveToast');
    this.toastText = document.getElementById('toastText');
  }

  getStorageKey() {
    return `celebration_live_photos_${this.currentFolio}`;
  }

  loadEvent(folio) {
    this.currentFolio = folio;
    const ev = CONCIERGE_EVENTS_DB[folio];
    if (ev) {
      const parts = ev.couple.split('&');
      this.coupleTitle.innerHTML = parts.length === 2 
        ? `${parts[0].trim()} &amp; <em>${parts[1].trim()}</em>`
        : ev.couple;
      this.streamVenue.textContent = `${ev.reception.place} • ${ev.city}`;
    }

    // Load photos from storage or defaults
    const saved = localStorage.getItem(this.getStorageKey());
    if (saved) {
      try {
        this.photos = JSON.parse(saved);
      } catch (e) {
        this.photos = INITIAL_STREAM_PHOTOS[folio] || [];
      }
    } else {
      this.photos = INITIAL_STREAM_PHOTOS[folio] || [];
      this.savePhotos();
    }

    this.renderQrCode();
    this.renderGallery();
    if (this.viewMode === 'slideshow') {
      this.startSlideshow();
    }
  }

  savePhotos() {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.photos));
  }

  renderGallery() {
    if (!this.liveGrid) return;
    this.liveGrid.innerHTML = '';

    if (this.photos.length === 0) {
      this.liveGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: rgba(250,247,242,0.6);">
          ✦ Sé el primero en proyectar un momento usando el botón 'Subir Foto' o el código QR.
        </div>
      `;
      return;
    }

    this.photos.forEach(item => {
      const card = document.createElement('div');
      card.className = 'live-card';
      card.innerHTML = `
        <div class="live-card-img-wrap">
          <img src="${item.url}" alt="${this.escapeHtml(item.caption)}" class="live-card-img" loading="lazy">
        </div>
        <div class="live-card-body">
          <p class="live-card-caption">“${this.escapeHtml(item.caption)}”</p>
          <div class="live-card-meta">
            <span class="live-card-author">${this.escapeHtml(item.author)}</span>
            <span class="live-card-time">${this.escapeHtml(item.time || 'En vivo')}</span>
          </div>
        </div>
      `;
      this.liveGrid.appendChild(card);
    });
  }

  toggleViewMode() {
    if (this.viewMode === 'gallery') {
      this.viewMode = 'slideshow';
      this.galleryView.style.display = 'none';
      this.slideshowView.style.display = 'flex';
      this.modeIcon.textContent = '🖼️';
      this.modeLabel.textContent = 'Mosaico';
      this.startSlideshow();
    } else {
      this.viewMode = 'gallery';
      this.galleryView.style.display = 'block';
      this.slideshowView.style.display = 'none';
      this.modeIcon.textContent = '📽️';
      this.modeLabel.textContent = 'Slideshow';
      this.stopSlideshow();
      this.renderGallery();
    }
  }

  startSlideshow() {
    this.stopSlideshow();
    if (this.photos.length === 0) return;

    this.showSlide(this.slideshowIndex);
    this.slideshowTimer = setInterval(() => {
      this.slideshowIndex = (this.slideshowIndex + 1) % this.photos.length;
      this.showSlide(this.slideshowIndex);
    }, 6000);
  }

  stopSlideshow() {
    if (this.slideshowTimer) {
      clearInterval(this.slideshowTimer);
      this.slideshowTimer = null;
    }
  }

  showSlide(index) {
    const item = this.photos[index];
    if (!item) return;

    this.heroSlideImg.src = item.url;
    this.heroSlideQuote.textContent = `“${item.caption}”`;
    this.heroSlideAuthor.textContent = `Por ${item.author}`;

    // Re-trigger CSS animation
    const stageCard = document.getElementById('slideStageCard');
    if (stageCard) {
      stageCard.style.animation = 'none';
      stageCard.offsetHeight; // force reflow
      stageCard.style.animation = 'slideHeroIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        this.showToast('No se pudo activar pantalla completa: ' + err.message);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  renderQrCode() {
    if (!this.qrContainer) return;
    // Native SVG QR with luxury styling
    this.qrContainer.innerHTML = `
      <svg viewBox="0 0 100 100" fill="#1a1714" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="26" height="26" rx="4" fill="#C5A059"/>
        <rect x="9" y="9" width="18" height="18" rx="2" fill="#fff"/>
        <rect x="13" y="13" width="10" height="10" rx="1" fill="#C5A059"/>
        
        <rect x="69" y="5" width="26" height="26" rx="4" fill="#C5A059"/>
        <rect x="73" y="9" width="18" height="18" rx="2" fill="#fff"/>
        <rect x="77" y="13" width="10" height="10" rx="1" fill="#C5A059"/>
        
        <rect x="5" y="69" width="26" height="26" rx="4" fill="#C5A059"/>
        <rect x="9" y="73" width="18" height="18" rx="2" fill="#fff"/>
        <rect x="13" y="77" width="10" height="10" rx="1" fill="#C5A059"/>
        
        <rect x="36" y="8" width="5" height="5" rx="1"/>
        <rect x="46" y="8" width="5" height="5" rx="1"/>
        <rect x="56" y="8" width="5" height="5" rx="1"/>
        <rect x="36" y="18" width="5" height="5" rx="1"/>
        <rect x="46" y="18" width="5" height="5" rx="1"/>
        <rect x="56" y="18" width="5" height="5" rx="1"/>
        
        <rect x="8" y="36" width="5" height="5" rx="1"/>
        <rect x="18" y="36" width="5" height="5" rx="1"/>
        <rect x="8" y="46" width="5" height="5" rx="1"/>
        <rect x="18" y="46" width="5" height="5" rx="1"/>

        <rect x="36" y="36" width="8" height="8" rx="1.5" fill="#C5A059"/>
        <rect x="48" y="36" width="6" height="6" rx="1"/>
        <rect x="58" y="36" width="6" height="6" rx="1"/>
        <rect x="68" y="36" width="6" height="6" rx="1"/>
        <rect x="78" y="36" width="6" height="6" rx="1"/>
        <rect x="88" y="36" width="6" height="6" rx="1"/>

        <rect x="36" y="50" width="6" height="6" rx="1"/>
        <rect x="46" y="50" width="8" height="8" rx="1.5" fill="#1a1714"/>
        <rect x="58" y="50" width="6" height="6" rx="1"/>
        <rect x="68" y="50" width="6" height="6" rx="1"/>

        <rect x="36" y="65" width="6" height="6" rx="1"/>
        <rect x="46" y="65" width="6" height="6" rx="1"/>
        <rect x="56" y="65" width="8" height="8" rx="1.5" fill="#C5A059"/>
        <rect x="68" y="65" width="6" height="6" rx="1"/>

        <rect x="36" y="80" width="6" height="6" rx="1"/>
        <rect x="46" y="80" width="6" height="6" rx="1"/>
        <rect x="56" y="80" width="6" height="6" rx="1"/>
        <rect x="68" y="80" width="8" height="8" rx="1.5" fill="#C5A059"/>
        <rect x="80" y="80" width="6" height="6" rx="1"/>
      </svg>
    `;
  }

  // Handle Image Upload & Client Compression
  processFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      this.showToast('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Client-side canvas resize for high performance and fast storage
        const canvas = document.createElement('canvas');
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Quality 0.82 JPEG
        this.selectedImageData = canvas.toDataURL('image/jpeg', 0.82);
        this.previewImg.src = this.selectedImageData;
        this.previewBox.style.display = 'block';
        this.dropzone.style.display = 'none';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  showToast(text) {
    this.toastText.textContent = text;
    this.toast.classList.add('show');
    setTimeout(() => this.toast.classList.remove('show'), 3800);
  }

  bindEvents() {
    this.folioSelect.addEventListener('change', (e) => {
      this.loadEvent(e.target.value);
      this.showToast(`✦ Boda cargada: #${e.target.value}`);
    });

    this.btnToggleMode.addEventListener('click', () => this.toggleViewMode());
    this.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());

    // Upload Modal events
    const openModal = () => {
      this.uploadForm.reset();
      this.selectedImageData = null;
      this.previewBox.style.display = 'none';
      this.dropzone.style.display = 'block';
      this.uploadModal.classList.add('show');
    };
    const closeModal = () => this.uploadModal.classList.remove('show');

    this.btnOpenUpload.addEventListener('click', openModal);
    this.btnCloseUpload.addEventListener('click', closeModal);
    this.btnCancelUpload.addEventListener('click', closeModal);

    this.dropzone.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.processFile(e.target.files[0]);
      }
    });

    // Drag and drop support
    this.dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropzone.style.borderColor = 'var(--gold)';
    });
    this.dropzone.addEventListener('dragleave', () => {
      this.dropzone.style.borderColor = 'var(--line)';
    });
    this.dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropzone.style.borderColor = 'var(--line)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.processFile(e.dataTransfer.files[0]);
      }
    });

    // Form submit
    this.uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.selectedImageData) {
        this.showToast('Por favor captura o selecciona una foto primero.');
        return;
      }

      const author = this.authorInput.value.trim() || 'Invitado';
      const caption = this.captionInput.value.trim() || '¡Muchas felicidades a los novios!';

      const newPhoto = {
        id: 'photo-' + Date.now(),
        url: this.selectedImageData,
        caption: caption,
        author: author,
        time: 'En este instante'
      };

      this.photos.unshift(newPhoto);
      this.savePhotos();

      closeModal();
      this.showToast(`📸 ¡Foto de ${author} proyectada en pantalla!`);

      if (this.viewMode === 'gallery') {
        this.renderGallery();
      } else {
        this.slideshowIndex = 0;
        this.showSlide(0);
      }
    });

    // Cross-tab reactive synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === this.getStorageKey()) {
        try {
          this.photos = JSON.parse(e.newValue || '[]');
          if (this.viewMode === 'gallery') {
            this.renderGallery();
          }
          this.showToast('✦ Nuevo momento proyectado en vivo');
        } catch (err) {}
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

// Launch
new LiveStreamApp();


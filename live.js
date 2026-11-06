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

const INITIAL_DJ_SONGS = {
  'CAM-2026': [
    { id: 'cam-s1', title: 'September — Earth, Wind & Fire', guest: 'Patricio Sada • Mesa VIP', dedication: '¡Para encender la pista con toda la actitud!', votes: 29 },
    { id: 'cam-s2', title: 'Dancing Queen — ABBA', guest: 'Renata Lozano • Mesa 3', dedication: 'Para que Camila y sus amigas rompan la pista.', votes: 25 },
    { id: 'cam-s3', title: 'Tití Me Preguntó — Bad Bunny', guest: 'Mauricio Fernández • Mesa VIP', dedication: '¡Arriba San Pedro y Los Cabos!', votes: 22 },
    { id: 'cam-s4', title: 'La Incondicional — Luis Miguel', guest: 'Regina Garza Lagüera • Mesa 2', dedication: 'Cantar a todo pulmón con los novios.', votes: 19 },
    { id: 'cam-s5', title: 'Don\'t Stop Believin\' — Journey', guest: 'Emilio Azcárraga • Mesa VIP', dedication: 'Himno para el final de la noche.', votes: 16 }
  ],
  'VAL-2026': [
    { id: 'val-s1', title: 'Como la Flor — Selena', guest: 'Mariana Garza • Mesa 4', dedication: '¡Para bailar y cantar en la hacienda!', votes: 28 },
    { id: 'val-s2', title: 'Can\'t Take My Eyes Off You — Frankie Valli', guest: 'Alejandro Morales • Padrino', dedication: 'Dedicada con amor a Valentina y Mateo.', votes: 24 },
    { id: 'val-s3', title: 'Vivir Mi Vida — Marc Anthony', guest: 'Carlos Villarreal • Mesa 2', dedication: '¡Pura fiesta en San Miguel!', votes: 21 },
    { id: 'val-s4', title: 'I Wanna Dance with Somebody — Whitney Houston', guest: 'Paulina Sada • Mesa 1', dedication: 'Para las damas de honor.', votes: 18 }
  ],
  'ISA-2026': [
    { id: 'isa-s1', title: 'Fly Me to the Moon — Frank Sinatra', guest: 'Fernando Treviño • Mesa 1', dedication: 'Clásico de gala para la recepción.', votes: 26 },
    { id: 'isa-s2', title: 'Suave — Luis Miguel', guest: 'Lucía Domínguez • Mesa 6', dedication: '¡El Sol de México no puede faltar!', votes: 23 },
    { id: 'isa-s3', title: 'Bailando — Enrique Iglesias', guest: 'Santiago Creel • Mesa 2', dedication: 'Todos a la pista.', votes: 19 }
  ]
};

class LiveStreamApp {
  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    const folioParam = urlParams.get('folio');
    this.currentFolio = (folioParam && (CONCIERGE_EVENTS_DB[folioParam] || INITIAL_STREAM_PHOTOS[folioParam])) ? folioParam : 'CAM-2026';
    this.photos = [];
    this.djSongs = [];
    this.viewMode = 'gallery'; // 'gallery' | 'slideshow' | 'dj'
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

    // DJ Elements
    this.djView = document.getElementById('djView');
    this.btnToggleDj = document.getElementById('btnToggleDj');
    this.djIcon = document.getElementById('djIcon');
    this.djLabel = document.getElementById('djLabel');
    this.djSongsGrid = document.getElementById('djSongsGrid');
    this.djModal = document.getElementById('djModal');
    this.btnOpenRequestSong = document.getElementById('btnOpenRequestSong');
    this.btnCloseDj = document.getElementById('btnCloseDj');
    this.btnCancelDj = document.getElementById('btnCancelDj');
    this.djRequestForm = document.getElementById('djRequestForm');
    this.inputSongTitle = document.getElementById('inputSongTitle');
    this.inputSongGuest = document.getElementById('inputSongGuest');
    this.inputSongDedication = document.getElementById('inputSongDedication');

    // Toast
    this.toast = document.getElementById('liveToast');
    this.toastText = document.getElementById('toastText');
  }

  getStorageKey() {
    return `celebration_live_photos_${this.currentFolio}`;
  }

  getDjStorageKey() {
    return `celebration_live_dj_${this.currentFolio}`;
  }

  loadEvent(folio) {
    this.currentFolio = folio;
    if (this.folioSelect && this.folioSelect.value !== folio) {
      this.folioSelect.value = folio;
    }
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

    // Load DJ songs from storage or defaults
    const savedDj = localStorage.getItem(this.getDjStorageKey());
    if (savedDj) {
      try {
        this.djSongs = JSON.parse(savedDj);
      } catch (e) {
        this.djSongs = JSON.parse(JSON.stringify(INITIAL_DJ_SONGS[folio] || INITIAL_DJ_SONGS['CAM-2026']));
      }
    } else {
      this.djSongs = JSON.parse(JSON.stringify(INITIAL_DJ_SONGS[folio] || INITIAL_DJ_SONGS['CAM-2026']));
      this.saveDjSongs();
    }

    this.renderQrCode();
    this.renderGallery();
    this.renderDjSongs();

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

  saveDjSongs() {
    localStorage.setItem(this.getDjStorageKey(), JSON.stringify(this.djSongs));
    this.renderDjSongs();
  }

  renderDjSongs() {
    if (!this.djSongsGrid) return;
    this.djSongsGrid.innerHTML = '';

    // Sort descending by votes
    this.djSongs.sort((a, b) => (Number(b.votes) || 0) - (Number(a.votes) || 0));

    if (this.djSongs.length === 0) {
      this.djSongsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: rgba(250,247,242,0.6);">
          <p style="font-size: 1.1rem; font-family: var(--font-serif); margin-bottom: 0.8rem;">Aún no hay canciones solicitadas en la pista.</p>
          <button type="button" class="ctrl-btn btn-upload-direct" id="btnEmptyAddSong">¡Sé el primero en pedir una canción!</button>
        </div>
      `;
      document.getElementById('btnEmptyAddSong')?.addEventListener('click', () => {
        this.djModal?.classList.add('show');
      });
      return;
    }

    const rankEmojis = ['🏆', '🥈', '🥉'];

    this.djSongs.forEach((song, idx) => {
      const card = document.createElement('div');
      card.className = `dj-song-card ${idx === 0 ? 'rank-1' : ''}`;

      const rankBadge = idx < 3 ? `#${idx + 1} ${rankEmojis[idx]}` : `#${idx + 1}`;

      card.innerHTML = `
        <div class="dj-rank-badge">${rankBadge}</div>
        <div class="dj-song-info">
          <h4 class="dj-song-title">${this.escapeHtml(song.title)}</h4>
          <span class="dj-song-author">Pedida por: ${this.escapeHtml(song.guest || 'Invitado')}</span>
          ${song.dedication ? `<p class="dj-song-dedication">"${this.escapeHtml(song.dedication)}"</p>` : ''}
        </div>
        <button type="button" class="dj-vote-btn" data-vote-id="${song.id}" title="Votar para que el DJ la ponga ya">
          ❤️ ${song.votes || 0}
        </button>
      `;
      this.djSongsGrid.appendChild(card);
    });

    // Bind vote clicks
    this.djSongsGrid.querySelectorAll('[data-vote-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.voteId;
        const target = this.djSongs.find(s => s.id === id);
        if (target) {
          target.votes = (Number(target.votes) || 0) + 1;
          this.saveDjSongs();
          this.showToast(`🎵 +1 Voto registrado para "${target.title}"`);
        }
      });
    });
  }

  toggleDjMode() {
    if (this.viewMode === 'dj') {
      this.viewMode = 'gallery';
      if (this.djView) this.djView.style.display = 'none';
      if (this.galleryView) this.galleryView.style.display = 'block';
      if (this.slideshowView) this.slideshowView.style.display = 'none';
      if (this.djLabel) this.djLabel.textContent = 'Pista DJ';
      if (this.djIcon) this.djIcon.textContent = '🎵';
      this.renderGallery();
    } else {
      this.stopSlideshow();
      this.viewMode = 'dj';
      if (this.galleryView) this.galleryView.style.display = 'none';
      if (this.slideshowView) this.slideshowView.style.display = 'none';
      if (this.djView) this.djView.style.display = 'block';
      if (this.djLabel) this.djLabel.textContent = 'Ver Fotos';
      if (this.djIcon) this.djIcon.textContent = '📸';
      this.renderDjSongs();
    }
  }

  toggleViewMode() {
    if (this.djView) this.djView.style.display = 'none';
    if (this.djLabel) this.djLabel.textContent = 'Pista DJ';
    if (this.djIcon) this.djIcon.textContent = '🎵';

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
      try {
        const url = new URL(window.location);
        url.searchParams.set('folio', e.target.value);
        window.history.replaceState({}, '', url);
      } catch (err) {}
      this.showToast(`✦ Boda cargada: #${e.target.value}`);
    });

    this.btnToggleMode.addEventListener('click', () => this.toggleViewMode());
    if (this.btnToggleDj) this.btnToggleDj.addEventListener('click', () => this.toggleDjMode());
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

    // DJ Song Request Form
    const openDjModal = () => {
      if (this.djRequestForm) this.djRequestForm.reset();
      this.djModal?.classList.add('show');
    };
    const closeDjModal = () => this.djModal?.classList.remove('show');

    if (this.btnOpenRequestSong) this.btnOpenRequestSong.addEventListener('click', openDjModal);
    if (this.btnCloseDj) this.btnCloseDj.addEventListener('click', closeDjModal);
    if (this.btnCancelDj) this.btnCancelDj.addEventListener('click', closeDjModal);

    if (this.djRequestForm) {
      this.djRequestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = this.inputSongTitle?.value.trim();
        const guest = this.inputSongGuest?.value.trim();
        const dedication = this.inputSongDedication?.value.trim();

        if (!title || !guest) {
          alert('Por favor indica la canción y tu nombre/mesa.');
          return;
        }

        const newSong = {
          id: 'song-' + Date.now(),
          title: title,
          guest: guest,
          dedication: dedication,
          votes: 1
        };

        this.djSongs.unshift(newSong);
        this.saveDjSongs();
        closeDjModal();
        this.showToast(`🎶 ¡"${title}" enviada a la pista de baile!`);
      });
    }

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
      } else if (e.key === this.getDjStorageKey()) {
        try {
          this.djSongs = JSON.parse(e.newValue || '[]');
          if (this.viewMode === 'dj') {
            this.renderDjSongs();
          }
          this.showToast('🎵 ¡Lista de canciones DJ actualizada en tiempo real!');
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


# CELEBRATION — Invitaciones Digitales Inteligentes & Live Event

Sitio web oficial y landing page editorial de lujo para **CELEBRATION**, el servicio premium de invitaciones digitales inteligentes con tecnología de proximidad NFC y galerías fotográficas en tiempo real (*Live Event*) para bodas y galas de alta gama.

---

## 💎 Características Principales

- **Diseño Editorial de Lujo**: Paleta cromática exclusiva inspirada en alta costura (*Dorado Champán #D4AF37*, *Oro Suave #F4E8C1*, *Marfil #FAF9F6* y *Carbón Grafito #1E1E1E*).
- **Tipografías Google Fonts**: 'Playfair Display' para titulares de alta gama y 'Plus Jakarta Sans' para una lectura contemporánea ultra limpia.
- **8 Módulos de Funcionalidad Esenciales**:
  1. Cuenta regresiva funcional en tiempo real.
  2. Confirmación RSVP (WhatsApp y Formulario).
  3. Itinerario detallado del evento.
  4. Ubicación GPS integrada (Google Maps & Waze 1-click).
  5. Mesa de regalos y copia de cuenta bancaria/CLABE.
  6. Hoteles recomendados con convenios y tarifas preferenciales.
  7. Dress Code interactivo con moodboard visual.
  8. Sugerencia de Playlist de Spotify y Libro de firmas digital.
- **Sección Live Event & Tarjetas NFC**: Muestra de cómo los invitados escanean un QR físico en mesas o aproximan tarjetas NFC sin instalar ninguna aplicación externa.
- **Arquitectura 100% Estática**: Cero dependencias complejas, cero Node/Docker/Cloud Run. Funciona abriendo directamente el archivo `index.html` o vía GitHub Pages.

---

## 📁 Estructura del Proyecto

```text
├── index.html        # Marcado HTML5 semántico y accesible
├── styles.css        # Sistema de diseño, variables CSS, microanimaciones y media queries
├── script.js         # Interactividad: reloj regresivo, acordeón FAQ, menú mobile y modales
└── README.md         # Documentación y guía de despliegue en GitHub Pages
```

---

## 🚀 Despliegue en GitHub Pages (Paso a Paso)

Este proyecto está optimizado para alojarse de forma totalmente gratuita y con certificado SSL automático en **GitHub Pages**.

### Paso 1: Subir los archivos al repositorio
Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "feat: Initial commit CELEBRATION luxury landing page"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

*(Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con los datos de tu cuenta en GitHub).*

### Paso 2: Activar GitHub Pages en Settings
1. Ve a tu repositorio en GitHub desde tu navegador.
2. Haz clic en la pestaña **Settings** (Configuración) ubicada en el menú superior derecho del repositorio.
3. En la barra lateral izquierda, localiza la sección **Code and automation** y haz clic en **Pages**.
4. En el apartado **Build and deployment**:
   - **Source**: Asegúrate de que esté seleccionado `Deploy from a branch`.
   - **Branch**: Selecciona la rama `main` (o `master`) y en la carpeta deja `/ (root)`.
   - Haz clic en el botón **Save**.

### Paso 3: Acceder al sitio en vivo
1. Espera entre 30 y 90 segundos a que GitHub procese el despliegue automático.
2. Refresca la página de **Settings > Pages** y verás un mensaje verde:
   > *"Your site is live at `https://TU_USUARIO.github.io/TU_REPOSITORIO/`"*
3. ¡Listo! Tu landing page de **CELEBRATION** estará en línea 24/7 con soporte HTTPS seguro.

---

## 🛠️ Personalización Rápida

- **Número de WhatsApp**: Abre `index.html` y reemplaza el número de teléfono `5215500000000` en los enlaces `https://wa.me/...` con el número oficial de tu concierge.
- **Fecha de la Cuenta Regresiva de Muestra**: En `index.html`, ubica el elemento `#weddingCountdown` y edita el atributo `data-target="2026-11-28T18:30:00"` con la fecha deseada en formato ISO (`YYYY-MM-DDTHH:MM:SS`).

---

## 📜 Licencia & Derechos
Derechos reservados © 2026 CELEBRATION.
Diseñado para eventos de alta gama y bodas de destino.

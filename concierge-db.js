/**
 * CELEBRATION Concierge AI — Knowledge Base & Event Database
 * Contexto estructurado para resolver dudas de invitados y parejas por Folio o Nombre
 */

export const CONCIERGE_EVENTS_DB = {
  // Evento 1: Valentina & Mateo (San Miguel de Allende)
  "VAL-2026": {
    folio: "VAL-2026",
    couple: "Valentina & Mateo",
    date: "Sábado 14 de Noviembre de 2026",
    city: "San Miguel de Allende, Guanajuato",
    ceremony: {
      place: "Parroquia de San Miguel Arcángel",
      time: "16:30 hrs",
      address: "Plaza Principal S/N, Centro Histórico",
      mapsUrl: "https://maps.google.com/?q=Parroquia+de+San+Miguel+Arcangel"
    },
    reception: {
      place: "Hacienda Las Trancas",
      time: "18:30 hrs",
      address: "Carretera San Miguel a Dolores Hidalgo Km 12",
      mapsUrl: "https://maps.google.com/?q=Hacienda+Las+Trancas"
    },
    dressCode: {
      title: "Formal Elegante / Cocktail de Hacienda",
      notes: "Sugerimos calzado cómodo para empedrado y jardín. Agradecemos a las damas reservar los tonos blanco y marfil para la novia.",
      colors: ["Verde salvia", "Champán", "Terracota suave", "Rosa empolvado"]
    },
    gifts: [
      { store: "Liverpool", eventNumber: "51209384", url: "https://www.liverpool.com.mx" },
      { store: "Amazon", eventNumber: "Mesa Valentina & Mateo", url: "https://www.amazon.com.mx" },
      { store: "Transferencia Bancaria", clabe: "012180015948372615", bank: "BBVA" }
    ],
    hotels: [
      { name: "Rosewood San Miguel de Allende", discountCode: "VALMATEO26", rate: "Tarifa preferencial con código" },
      { name: "Hotel Matilda", discountCode: "CELEBRATION", rate: "15% de descuento en estancias de 2+ noches" },
      { name: "Casa de Sierra Nevada (Belmond)", discountCode: "VALMATEO", rate: "Tarifa especial para invitados" }
    ],
    guests: [
      { name: "Mariana Garza", passes: 2, family: "Familia Garza Morales", confirmed: true, table: "Mesa 4" },
      { name: "Alejandro Morales", passes: 2, family: "Familia Morales", confirmed: true, table: "Mesa 4" },
      { name: "Sofia Benavides", passes: 1, family: "Sofia Benavides", confirmed: false, table: "Mesa 8" },
      { name: "Carlos Villarreal", passes: 2, family: "Familia Villarreal", confirmed: true, table: "Mesa 2" }
    ]
  },

  // Evento 2: Isabella & Santiago (CDMX)
  "ISA-2026": {
    folio: "ISA-2026",
    couple: "Isabella & Santiago",
    date: "Sábado 10 de Octubre de 2026",
    city: "Ciudad de México",
    ceremony: {
      place: "Catedral Metropolitana de la Ciudad de México",
      time: "17:00 hrs",
      address: "Plaza de la Constitución S/N, Centro Histórico",
      mapsUrl: "https://maps.google.com/?q=Catedral+Metropolitana+CDMX"
    },
    reception: {
      place: "Palacio Metropolitano",
      time: "19:30 hrs",
      address: "Calle de Tacuba 15, Centro Histórico",
      mapsUrl: "https://maps.google.com/?q=Palacio+Metropolitano+Tacuba"
    },
    dressCode: {
      title: "Rigurosa Etiqueta / Black Tie",
      notes: "Caballeros: Esmoquin negro riguroso con corbatín. Damas: Vestido largo de noche.",
      colors: ["Negro", "Midnight Blue", "Dorado", "Metálicos"]
    },
    gifts: [
      { store: "El Palacio de Hierro", eventNumber: "ISA-SANT-26", url: "https://www.elpalaciodehierro.com" },
      { store: "Liverpool", eventNumber: "38928471", url: "https://www.liverpool.com.mx" },
      { store: "Transferencia Interbancaria", clabe: "072180002938471625", bank: "Banorte" }
    ],
    hotels: [
      { name: "Gran Hotel de la Ciudad de México", discountCode: "ISASANT", rate: "Tarifa preferencial bloque de bodas" },
      { name: "Downtown México", discountCode: "CELEBRATION-ISA", rate: "Convenio especial Centro Histórico" }
    ],
    guests: [
      { name: "Fernando Treviño", passes: 2, family: "Familia Treviño", confirmed: true, table: "Mesa 1" },
      { name: "Lucía Domínguez", passes: 2, family: "Familia Domínguez", confirmed: false, table: "Mesa 6" }
    ]
  },

  // Evento 3: Camila & Sebastián (Los Cabos)
  "CAM-2026": {
    folio: "CAM-2026",
    couple: "Camila & Sebastián",
    date: "Sábado 24 de Octubre de 2026",
    city: "Los Cabos, Baja California Sur",
    ceremony: {
      place: "The Cape Terrace",
      time: "16:00 hrs",
      address: "Cabo San Lucas, BCS (Vista al Arco)",
      mapsUrl: "https://maps.google.com/?q=The+Cape+a+Thompson+Hotel"
    },
    reception: {
      place: "Sunset Monalisa",
      time: "18:30 hrs",
      address: "Carretera Transpeninsular Km 6",
      mapsUrl: "https://maps.google.com/?q=Sunset+Monalisa+Cabo"
    },
    dressCode: {
      title: "Coastal Chic / Black Tie Sunset",
      notes: "Tonos neutros, arena, marfil o champagne. Telas fluidas como lino y seda.",
      colors: ["Arena", "Champán", "Blush", "Sage"]
    },
    gifts: [
      { store: "Fondo Luna de Miel (Transferencia)", clabe: "014180293847561928", bank: "Santander" },
      { store: "Amazon", eventNumber: "Camila & Sebastián Cabo", url: "https://www.amazon.com.mx" }
    ],
    hotels: [
      { name: "The Cape, a Thompson Hotel", discountCode: "CAMSEB26", rate: "20% de descuento en habitaciones con vista" },
      { name: "Esperanza, Auberge Resorts", discountCode: "DESTINATION-WED", rate: "Tarifa grupal convenio" }
    ],
    guests: [
      { name: "Patricio Sada", passes: 2, family: "Familia Sada", confirmed: true, table: "Mesa VIP" },
      { name: "Renata Lozano", passes: 1, family: "Renata Lozano", confirmed: true, table: "Mesa 3" }
    ]
  }
};

export const CELEBRATION_FAQ_DB = [
  {
    topic: "paquetes",
    keywords: ["paquete", "precio", "cuanto cuesta", "costo", "tarifa", "precios", "coleccion", "planes"],
    response: "CELEBRATION ofrece tres colecciones de alta costura concebidas para el mercado sampetrino y enlaces de destino:\n\n1. **Colección Signature Atelier ($11,900 MXN):** Sitio web editorial a medida, dominio propio (.com / .wedding) con SSL por 1 año, Smart RSVP predictivo por familia con control estricto de pases y alergias (cero colados), itinerario con GPS Waze/Maps, mesa de regalos de alta gama (Palacio de Hierro, Liverpool, Tiffany, CLABE) y pases digitales VIP para WhatsApp.\n\n2. **Colección Destination & Heritage ($14,900 MXN - Más Solicitada):** Todo lo de Signature más arquitectura Multi-Evento con RSVP segmentado (rompehielos, ceremonia, tornaboda/brunch), bilingüe nativo (Español/Inglés), módulo concierge de convenios hoteleros, transporte y recomendaciones locales curadas, y libro de firmas digital conmemorativo.\n\n3. **Colección Grand Luxe NFC & Live Event ($19,900 MXN - Experiencia Suprema):** Todo lo de Destination más hardware físico de tarjetas inteligentes NFC (1 Maestra para los novios + 20 tarjetas grabadas en hot-stamping para centros de mesa), pantalla interactiva Live Event para proyectar fotos de los invitados en directo durante la fiesta sin apps, entrega de archivo RAW y guardia técnica VIP durante el enlace.\n\n*Para enlaces monumentales en Club Campestre o recintos privados contamos con **Atelier Bespoke** (desde $28,000 MXN).* "
  },
  {
    topic: "tiempos",
    keywords: ["tiempo", "tarda", "dias", "plazo", "entrega", "urgente", "express"],
    response: "Nuestro tiempo de entrega estándar es de **3 a 5 días hábiles** a partir de la recepción de su Brief de Diseño y anticipo. También contamos con servicio Express en 48 horas ($650 MXN adicionales) para enlaces con premura."
  },
  {
    topic: "smart rsvp",
    keywords: ["rsvp", "confirmacion", "confirmar", "asistencia", "invitados", "pases"],
    response: "El **Smart RSVP** permite a sus invitados escribir su nombre en un buscador predictivo y ver sus pases asignados de inmediato con un solo clic. Responden sobre menús especiales, alergias y transporte, y ustedes reciben las estadísticas consolidadas en tiempo real en su panel privado sin perseguir a nadie por WhatsApp."
  },
  {
    topic: "nfc live event",
    keywords: ["nfc", "tarjeta", "tarjetas", "live event", "fotos en vivo", "pantalla", "proyectar"],
    response: "La tecnología **NFC & Live Event** permite colocar elegantes tarjetas físicas en las mesas de la recepción. Cualquier invitado con smartphone (iPhone o Android) aproxima su teléfono sin instalar apps y accede al sitio web o a la pantalla colectiva donde suben fotos y videos en tiempo real para proyectarse en la fiesta."
  },
  {
    topic: "pagos",
    keywords: ["pago", "pagar", "metodo", "anticipo", "spei", "tarjeta"],
    response: "El esquema de pago es **50% de anticipo** para reservar la fecha y registrar su dominio web propio, y el **50% restante** al aprobar la propuesta final previa a la publicación. Aceptamos transferencia SPEI, tarjetas de crédito/débito y enlace seguro Stripe."
  },
  {
    topic: "dominio",
    keywords: ["dominio", "link", "liga", "url", "nombre de la pagina", "ssl"],
    response: "El dominio personalizado (ejemplo: *mariaymateo.com* o *bodaaleysantiago.com*) con certificado de seguridad SSL HTTPS está **100% incluido durante 12 meses** en todos nuestros paquetes."
  }
];

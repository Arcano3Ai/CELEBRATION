import re
import os

print("--- Step 1: Cleaning demo-editorial.html ---")
with open('demo-editorial.html', 'r', encoding='utf-8') as f:
    de = f.read()

# Meta descriptions
de = de.replace("Colección Vanguardia Editorial & Live Event por CELEBRATION.", "Colección Vanguardia Editorial por CELEBRATION.")
de = de.replace("Ceremonia en The Cape Terrace, cena en Sunset Monalisa y tecnología Live Event Streaming.", "Ceremonia y cena de gala en The Cape Terrace frente al Mar de Cortés.")

# Nav link
de = re.sub(r'\s*<a href="#live-event">Live Event Streaming</a>', '', de)

# Itinerary card
de = de.replace('<h3 class="itinerary-name">Sunset Monalisa</h3>', '<h3 class="itinerary-name">The Cape Ocean Terrace</h3>')
de = de.replace('Recepción sobre terrazas escalonadas de acantilado. Coctelería de autor, cena maridaje de cocina mediterránea contemporánea y After Party con DJ set internacional.', 'Recepción sobre terrazas escalonadas frente al Mar de Cortés. Coctelería de autor, cena maridaje de alta cocina y After Party con DJ set internacional.')
de = de.replace('https://maps.google.com/?q=Sunset+Monalisa+Cabo', 'https://maps.google.com/?q=The+Cape+a+Thompson+Hotel')

# Section #live-event
de = re.sub(r'<!-- Live Event Streaming & Tarjetas NFC -->\s*<section class="section" id="live-event">.*?</section>', '', de, flags=re.DOTALL)

# CSS for live-event
de = re.sub(r'/\* Live Event Banner Interactive \*/.*?@keyframes pulse \{[^}]*\}', '', de, flags=re.DOTALL)

# Footer
de = de.replace("Colección Vanguardia Editorial &amp; Live Event • Demo #CAM-2026", "Colección Vanguardia Editorial • Demo #CAM-2026")

# Script simulateLiveUpload
de = re.sub(r'function simulateLiveUpload\(\)\s*\{.*?\}', '', de, flags=re.DOTALL)

with open('demo-editorial.html', 'w', encoding='utf-8') as f:
    f.write(de)
print("demo-editorial.html cleaned!")


print("\n--- Step 2: Cleaning planner.html ---")
with open('planner.html', 'r', encoding='utf-8') as f:
    pl = f.read()

# Hero button
pl = re.sub(r'\s*<a href="live\.html" class="btn btn-outline" id="btnHeroLive"[^>]*>.*?</a>', '', pl, flags=re.DOTALL)

# Tab QR
pl = pl.replace('🏷️ Tarjetas de Mesa QR / NFC (Print)', '🏷️ Tarjetas de Mesa QR (Print)')
pl = pl.replace('VIEW 3: QR & NFC PRINT-READY CARDS', 'VIEW 3: QR PRINT-READY CARDS')

# NFC table card description
pl = pl.replace(
    'Aproxima tu cámara o dispositivo NFC para ver el menú de la noche, itinerario y compartir tus fotos en tiempo real.',
    'Escanea con tu cámara para consultar el menú de la noche, itinerario y detalles exclusivos del evento.'
)

# Timeline events
pl = pl.replace(
    "{ time: '22:45', title: 'Apertura de Pista & Activación Live Event', desc: 'Comienza set de fiesta. Pantalla gigante activa para proyectar fotos de invitados.', resp: 'DJ en Vivo / Pantalla Live', status: 'pending' },",
    "{ time: '22:45', title: 'Apertura de Pista & Fiesta de Gala', desc: 'Comienza set estelar de fiesta y barra libre internacional.', resp: 'DJ en Vivo / Audio', status: 'pending' },"
)
pl = pl.replace(
    "{ time: '17:00', title: 'Ceremonia al Atardecer frente al Arco', desc: 'Sunset Monalisa. Votos nupciales con vista al mar de Cortés.', resp: 'Officiant / Violinista', status: 'completed' },",
    "{ time: '17:00', title: 'Ceremonia al Atardecer frente al Arco', desc: 'The Cape Ocean Terrace. Votos nupciales con vista al mar de Cortés.', resp: 'Officiant / Violinista', status: 'completed' },"
)
pl = pl.replace(
    "{ time: '19:30', title: 'Cena Mediterránea Bajo las Estrellas', desc: 'Banquete de mariscos y cortes finos.', resp: 'Sunset Monalisa Chef', status: 'pending' },",
    "{ time: '19:30', title: 'Cena de Gala Bajo las Estrellas', desc: 'Banquete de alta cocina costera y maridaje de autor.', resp: 'Chef Ejecutivo The Cape', status: 'pending' },"
)
pl = pl.replace(
    "{ time: '21:00', title: 'Fiesta & Pantallas Live Event Proyectando', desc: 'Carga de fotos por NFC y set de DJ en vivo.', resp: 'DJ / Screen Operator', status: 'pending' },",
    "{ time: '21:00', title: 'Gran Fiesta & Brindis de Medianoche', desc: 'Celebración principal con iluminación arquitectónica y barra de coctelería.', resp: 'DJ / Wedding Planner', status: 'pending' },"
)

# JS btnLive ref
pl = re.sub(r'const btnLive = document\.getElementById\(\'btnHeroLive\'\);\s*if \(btnLive\) btnLive\.href = `live\.html\?folio=\$\{encodeURIComponent\(folio\)\}`;\s*', '', pl)

with open('planner.html', 'w', encoding='utf-8') as f:
    f.write(pl)
print("planner.html cleaned!")


print("\n--- Step 3: Cleaning concierge-db.js ---")
with open('concierge-db.js', 'r', encoding='utf-8') as f:
    cdb = f.read()

cdb = cdb.replace('place: "Sunset Monalisa",', 'place: "The Cape Residences & Terrace",')
cdb = cdb.replace('mapsUrl: "https://maps.google.com/?q=Sunset+Monalisa+Cabo"', 'mapsUrl: "https://maps.google.com/?q=The+Cape+Residences+Cabo"')

with open('concierge-db.js', 'w', encoding='utf-8') as f:
    f.write(cdb)
print("concierge-db.js cleaned!")


print("\n--- Step 4: Cleaning concierge-ai.js ---")
with open('concierge-ai.js', 'r', encoding='utf-8') as f:
    cai = f.read()

cai = cai.replace('Smart RSVP y Live Event,', 'y Smart RSVP,')
cai = cai.replace('o **tecnología NFC**.', 'o **mesa de regalos**.')

with open('concierge-ai.js', 'w', encoding='utf-8') as f:
    f.write(cai)
print("concierge-ai.js cleaned!")


print("\n--- Step 5: Cleaning script.js ---")
with open('script.js', 'r', encoding='utf-8') as f:
    sc = f.read()

sc = sc.replace('✧ Tarjetas NFC & Galería Live Event en Pantallas\n\n', '✧ Itinerario Detallado & Mesa de Regalos\n\n')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(sc)
print("script.js cleaned!")


print("\n--- Step 6: Cleaning sw.js ---")
with open('sw.js', 'r', encoding='utf-8') as f:
    sw = f.read()

sw = re.sub(r"\s*'\./live\.html',", '', sw)
sw = re.sub(r"\s*'\./live\.js',", '', sw)

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw)
print("sw.js cleaned!")


print("\n--- Step 7: Replacing live.html with direct redirect to index.html ---")
live_redirect = '''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=index.html">
  <title>CELEBRATION</title>
  <script>location.replace('index.html');</script>
</head>
<body>
</body>
</html>
'''
with open('live.html', 'w', encoding='utf-8') as f:
    f.write(live_redirect)

# Empty live.js
with open('live.js', 'w', encoding='utf-8') as f:
    f.write('// Modulo Live Event retirado.\n')
print("live.html redirect created and live.js emptied!")


print("\n--- Step 8: Cleaning README.md & docs ---")
if os.path.exists('README.md'):
    with open('README.md', 'r', encoding='utf-8') as f:
        rm = f.read()
    rm = rm.replace(" & Live Event", "")
    rm = rm.replace(" con tecnología de proximidad NFC y galerías fotográficas en tiempo real (*Live Event*)", "")
    rm = re.sub(r'- \*\*Sección Live Event & Tarjetas NFC\*\*:[^\n]*\n', '', rm)
    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(rm)

doc_contrato = 'docs/CONTRATO_PRESTACION_SERVICIOS.md'
if os.path.exists(doc_contrato):
    with open(doc_contrato, 'r', encoding='utf-8') as f:
        dc = f.read()
    dc = re.sub(r', 1 Tarjeta Maestra NFC personalizada para los novios, Tecnología Live Event Streaming para proyección en pantallas de salón en tiempo real y descarga de fotos compartidas,', '', dc)
    dc = re.sub(r'- \[\s*\] Set Adicional de 5 Tarjetas NFC para mesas[^\n]*\n', '', dc)
    dc = dc.replace(' (incluye tiempos de programación y calibración de hardware NFC)', '')
    dc = dc.replace(' o entrega física de tarjetas NFC', '')
    with open(doc_contrato, 'w', encoding='utf-8') as f:
        f.write(dc)
print("README and docs cleaned!")

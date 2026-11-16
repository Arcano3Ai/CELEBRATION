# 1. script.js
with open('script.js', 'r', encoding='utf-8') as f:
    sc = f.read()
sc = sc.replace('✧ Tarjetas NFC & Galería Live Event en Pantallas', '✧ Itinerario Detallado & Mesa de Regalos')
with open('script.js', 'w', encoding='utf-8') as f:
    f.write(sc)
print("script.js fixed!")

# 2. planner.html
with open('planner.html', 'r', encoding='utf-8') as f:
    pl = f.read()
pl = pl.replace('/* NFC / QR TABLE CARDS PRINT VIEW */', '/* QR TABLE CARDS PRINT VIEW */')
with open('planner.html', 'w', encoding='utf-8') as f:
    f.write(pl)
print("planner.html fixed!")

# 3. live.js
with open('live.js', 'w', encoding='utf-8') as f:
    f.write('// CELEBRATION\n')
print("live.js emptied!")

# 4. docs/CONTRATO_PRESTACION_SERVICIOS.md
with open('docs/CONTRATO_PRESTACION_SERVICIOS.md', 'r', encoding='utf-8') as f:
    dc = f.read()
dc = dc.replace(
    '1 Tarjeta Maestra NFC personalizada para los novios, Tecnología Live Event Streaming para proyección en pantallas de salón en tiempo real y descarga de fotos compartidas, más ',
    ''
)
with open('docs/CONTRATO_PRESTACION_SERVICIOS.md', 'w', encoding='utf-8') as f:
    f.write(dc)
print("CONTRATO fixed!")

# 5. SPRINT_BOARD.md
with open('SPRINT_BOARD.md', 'r', encoding='utf-8') as f:
    sb = f.read()
sb = sb.replace('Live Event Streaming', 'Streaming')
sb = sb.replace('Live Event', 'Experiencia Digital')
sb = sb.replace('live.html', 'index.html')
sb = sb.replace('live.js', 'script.js')
sb = sb.replace('tarjetas NFC', 'tarjetas QR')
sb = sb.replace('NFC', 'QR')
with open('SPRINT_BOARD.md', 'w', encoding='utf-8') as f:
    f.write(sb)
print("SPRINT_BOARD fixed!")

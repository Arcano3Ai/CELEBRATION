import re

def insert_og_after_description(filepath, og_snippet):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'og:image' in content:
        print(f"[{filepath}] Already has og:image, skipping.")
        return
        
    pattern = r'(<meta name="description" content="[^"]+">)'
    if re.search(pattern, content):
        new_content = re.sub(pattern, r'\1\n' + og_snippet, content, count=1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"[{filepath}] Successfully added Open Graph tags!")
    else:
        print(f"[{filepath}] Meta description tag not found.")

# Planner
insert_og_after_description('planner.html', """  <!-- Open Graph / WhatsApp Preview -->
  <meta property="og:site_name" content="CELEBRATION">
  <meta property="og:title" content="Portal Wedding Planner & Smart RSVP — CELEBRATION">
  <meta property="og:description" content="Panel privado de gestión de confirmaciones, asignación de mesas, restricciones de banquete y exportación a Excel.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://thecelebration.com.mx/planner.html">
  <meta property="og:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:secure_url" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">""")

# Live
insert_og_after_description('live.html', """  <!-- Open Graph / WhatsApp Preview -->
  <meta property="og:site_name" content="CELEBRATION">
  <meta property="og:title" content="Live Event Stream & Pista DJ — CELEBRATION">
  <meta property="og:description" content="Pantalla interactiva en vivo para proyectores de boda: muro de fotos y votación de canciones en tiempo real.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://thecelebration.com.mx/live.html">
  <meta property="og:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:secure_url" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">""")

# Passes
insert_og_after_description('passes.html', """  <!-- Open Graph / WhatsApp Preview -->
  <meta property="og:site_name" content="CELEBRATION">
  <meta property="og:title" content="Generador de Pases VIP Digitales — CELEBRATION">
  <meta property="og:description" content="Diseña, genera y comparte pases de honor y accesos VIP personalizados por WhatsApp para los invitados de tu boda.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://thecelebration.com.mx/passes.html">
  <meta property="og:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:secure_url" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">""")

# Checkout
insert_og_after_description('checkout.html', """  <!-- Open Graph / WhatsApp Preview -->
  <meta property="og:site_name" content="CELEBRATION">
  <meta property="og:title" content="Reserva tu Fecha de Boda — CELEBRATION">
  <meta property="og:description" content="Aparta tu fecha con el 50% de anticipo. Diseños 100% personalizados para tu boda en San Pedro Garza García.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://thecelebration.com.mx/checkout.html">
  <meta property="og:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:secure_url" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">""")

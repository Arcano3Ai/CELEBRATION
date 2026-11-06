import re

def update_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    for pattern, repl in replacements:
        content, count = re.subn(pattern, repl, content, flags=re.DOTALL)
        print(f"[{filepath}] Replaced pattern ({count} matches)")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Update index.html
og_main = """  <meta property="og:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:secure_url" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="CELEBRATION — Atelier de Sitios Web de Alta Costura e Invitaciones Digitales">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="CELEBRATION — Sitios Web de Lujo e Invitaciones de Boda">
  <meta name="twitter:description" content="Diseños 100% personalizados para su boda. Sitios web de alta costura, Smart RSVP y confirmación por WhatsApp.">
  <meta name="twitter:image" content="https://thecelebration.com.mx/assets/images/og_share_banner.jpg">"""

update_file('index.html', [
    (r'  <meta property="og:image".*?<meta name="twitter:image" content="[^"]+">', og_main),
    (r'"logo": "https://thecelebration.com.mx/assets/images/og_share_cover.jpg"', r'"logo": "https://thecelebration.com.mx/assets/images/og_share_banner.jpg"')
])

# 2. Update demo-romantico.html
og_romantico = """  <meta property="og:image" content="https://thecelebration.com.mx/assets/images/og_demo_romantico.jpg">
  <meta property="og:image:secure_url" content="https://thecelebration.com.mx/assets/images/og_demo_romantico.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Valentina & Mateo — Boda en San Miguel de Allende">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Valentina & Mateo — Invitación de Boda">
  <meta name="twitter:description" content="Acompáñanos a celebrar nuestra boda en San Miguel de Allende. Confirma tu asistencia en línea.">
  <meta name="twitter:image" content="https://thecelebration.com.mx/assets/images/og_demo_romantico.jpg">"""

update_file('demo-romantico.html', [
    (r'  <meta property="og:image".*?<meta property="og:image:height" content="\d+">', og_romantico)
])

# 3. Update demo-clasico.html
og_clasico = """  <meta property="og:image" content="https://thecelebration.com.mx/assets/images/og_demo_clasico.jpg">
  <meta property="og:image:secure_url" content="https://thecelebration.com.mx/assets/images/og_demo_clasico.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Isabella & Santiago — Gala & Black Tie">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Isabella & Santiago — Gala & Black Tie">
  <meta name="twitter:description" content="Invitación privada de gala en San Pedro Garza García. Confirma tu asistencia.">
  <meta name="twitter:image" content="https://thecelebration.com.mx/assets/images/og_demo_clasico.jpg">"""

update_file('demo-clasico.html', [
    (r'  <meta property="og:image".*?<meta property="og:image:height" content="\d+">', og_clasico)
])

# 4. Update demo-editorial.html
og_editorial = """  <meta property="og:image" content="https://thecelebration.com.mx/assets/images/og_demo_editorial.jpg">
  <meta property="og:image:secure_url" content="https://thecelebration.com.mx/assets/images/og_demo_editorial.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Camila & Sebastián — Vogue Weddings Edition en Los Cabos">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Camila & Sebastián — Vogue Weddings Edition">
  <meta name="twitter:description" content="Celebración de destino en Los Cabos. Pases VIP, código de vestimenta y confirmación digital.">
  <meta name="twitter:image" content="https://thecelebration.com.mx/assets/images/og_demo_editorial.jpg">"""

update_file('demo-editorial.html', [
    (r'  <meta property="og:image".*?<meta property="og:image:height" content="\d+">', og_editorial)
])

print("All Open Graph tags successfully calibrated for WhatsApp & Social Sharing!")


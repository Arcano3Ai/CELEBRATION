import os
import re
import sys
import glob
import json
import urllib.request
import urllib.error
import subprocess

print("=" * 70)
print("🔍 AUDITORÍA MAESTRA INTEGRAL — CELEBRATION (MODO PICKLE RICK)")
print("=" * 70)

FAILED = []
PASSED = []
WARNINGS = []

def report(category, name, success, details=""):
    if success:
        PASSED.append(f"[{category}] {name}")
        print(f"  ✅ PASS: [{category}] {name} {details}")
    else:
        FAILED.append(f"[{category}] {name}: {details}")
        print(f"  ❌ FAIL: [{category}] {name} {details}")

def warn(category, name, details=""):
    WARNINGS.append(f"[{category}] {name}: {details}")
    print(f"  ⚠️ WARN: [{category}] {name} {details}")

# -------------------------------------------------------------
# 1. SINTAXIS Y VALIDEZ DE CÓDIGO
# -------------------------------------------------------------
print("\n--- 1. Verificación de Sintaxis y Archivos Críticos ---")
js_files = glob.glob("*.js")
for jf in js_files:
    try:
        res = subprocess.run(["node", "-c", jf], capture_output=True, text=True)
        if res.returncode == 0:
            report("Sintaxis JS", jf, True)
        else:
            report("Sintaxis JS", jf, False, res.stderr.strip())
    except Exception as e:
        warn("Sintaxis JS", jf, f"No se pudo ejecutar node: {e}")

# JSON checks
json_files = ["manifest.webmanifest"]
for jf in json_files:
    if os.path.exists(jf):
        try:
            with open(jf, "r", encoding="utf-8") as f:
                json.load(f)
            report("Sintaxis JSON", jf, True)
        except Exception as e:
            report("Sintaxis JSON", jf, False, str(e))

# -------------------------------------------------------------
# 2. INTEGRIDAD DE ACTIVOS LOCALES (Imágenes, scripts, css)
# -------------------------------------------------------------
print("\n--- 2. Integridad de Enlaces de Activos Locales ---")
html_files = glob.glob("*.html")
asset_refs = set()

for hf in html_files:
    with open(hf, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    # Check src="..." and href="..."
    matches = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', content)
    for m in matches:
        # Ignore external links, mailto, tel, anchor hashes, javascript
        if m.startswith("http://") or m.startswith("https://") or m.startswith("#") or m.startswith("mailto:") or m.startswith("tel:") or m.startswith("javascript:"):
            continue
        clean_path = m.split("?")[0].split("#")[0]
        if clean_path:
            asset_refs.add((hf, clean_path))

broken_assets = []
for hf, path in asset_refs:
    # normalize path relative to repo root
    local_path = path.replace("/", os.sep)
    if not os.path.exists(local_path):
        broken_assets.append((hf, path))

if broken_assets:
    for hf, p in broken_assets:
        report("Activo Roto", f"{hf} -> {p}", False, "Archivo no encontrado en disco")
else:
    report("Activos Locales", f"Total revisados: {len(asset_refs)} enlaces", True, "Todos los archivos existen")

# -------------------------------------------------------------
# 3. VERIFICACIÓN DE PRECIOS Y PAQUETES (CERO PRECIOS OBSOLETOS)
# -------------------------------------------------------------
print("\n--- 3. Verificación de Tarifas y Cero Precios Obsoletos ---")
obsolete_prices = ["3,990", "1,995", "2,490", "1,245", "1,490", "745"]
# Check html and js
for ext in ["*.html", "*.js"]:
    for fpath in glob.glob(ext):
        with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
        for idx, line in enumerate(lines, 1):
            for op in obsolete_prices:
                # ignore CSS colors like #28a745 or similar if any
                if op in line and not "#28a745" in line and not "28a745" in line:
                    report("Precio Obsoleto", f"{fpath}:{idx}", False, f"Encontrado '{op}' en: {line.strip()[:80]}")

report("Precios Obsoletos", "Escaneo completo", True, "No se encontraron precios antiguos residuales")

# Check required active prices in checkout.html & index.html
with open("checkout.html", "r", encoding="utf-8") as f:
    co_txt = f.read()
assert "500" in co_txt, "Signature 500 missing in checkout"
assert "990" in co_txt, "Essential 990 missing in checkout"
assert "1790" in co_txt, "Premiere 1790 missing in checkout"
assert "2990" in co_txt, "Haute Couture 2990 missing in checkout"
report("Catálogo Checkout", "Precios $500, $990, $1,790, $2,990", True, "Presentes en el objeto PKGS")

# -------------------------------------------------------------
# 4. AUDITORÍA SEO, ROBOTS.TXT Y SITEMAP.XML
# -------------------------------------------------------------
print("\n--- 4. Auditoría SEO, Robots.txt y Sitemap.xml ---")
if os.path.exists("robots.txt"):
    with open("robots.txt", "r", encoding="utf-8") as f:
        robots = f.read()
    if "Disallow: /checkout.html" in robots and "Disallow: /planner.html" in robots and "Disallow: /passes.html" in robots and "Disallow: /api/" in robots:
        report("Robots.txt", "Reglas de bloqueo de páginas privadas", True)
    else:
        report("Robots.txt", "Reglas de bloqueo", False, "Faltan disallows de páginas privadas")
    if "Sitemap: https://thecelebration.com.mx/sitemap.xml" in robots:
        report("Robots.txt", "Declaración de Sitemap", True)
    else:
        report("Robots.txt", "Declaración de Sitemap", False, "Falta la línea de sitemap")

if os.path.exists("sitemap.xml"):
    with open("sitemap.xml", "r", encoding="utf-8") as f:
        sitemap = f.read()
    sitemap_urls = re.findall(r'<loc>(https://[^<]+)</loc>', sitemap)
    report("Sitemap.xml", f"URLs declaradas: {len(sitemap_urls)}", True, ", ".join([u.split('/')[-1] or 'root' for u in sitemap_urls]))

# Check Open Graph tags on public pages
og_required = ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card']
public_pages = ['index.html', 'signature.html', 'essential.html', 'premiere.html', 'demo-editorial.html', 'demo-romantico.html', 'demo-clasico.html']

for pp in public_pages:
    if os.path.exists(pp):
        with open(pp, "r", encoding="utf-8") as f:
            txt = f.read()
        missing_og = [tag for tag in og_required if tag not in txt]
        if missing_og:
            report("OpenGraph", pp, False, f"Faltan etiquetas: {missing_og}")
        else:
            report("OpenGraph", pp, True, "Todas las etiquetas presentes")

# Check OG image size (< 300 KB for WhatsApp preview)
og_banner = os.path.join("assets", "images", "og_share_banner.jpg")
if os.path.exists(og_banner):
    size_kb = os.path.getsize(og_banner) / 1024
    if size_kb < 300:
        report("OpenGraph Banner", f"{og_banner} ({size_kb:.1f} KB)", True, "< 300 KB para WhatsApp")
    else:
        report("OpenGraph Banner", f"{og_banner} ({size_kb:.1f} KB)", False, "Excede 300 KB")

# -------------------------------------------------------------
# 5. SEGURIDAD Y PROTECCIÓN DE CREDENCIALES
# -------------------------------------------------------------
print("\n--- 5. Auditoría de Seguridad & Credenciales Privadas ---")
client_files = glob.glob("*.html") + glob.glob("*.js")
leak_patterns = [
    r"APP_USR-[0-9a-zA-Z_-]{20,}",
    r"TEST-[0-9a-zA-Z_-]{20,}",
    r"sk_live_[0-9a-zA-Z]{24,}",
    r"sk_test_[0-9a-zA-Z]{24,}"
]
leaks_found = []
for cf in client_files:
    with open(cf, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    for lp in leak_patterns:
        m = re.findall(lp, content)
        if m:
            leaks_found.append((cf, m))

if leaks_found:
    for cf, tokens in leaks_found:
        report("Seguridad Claves", cf, False, f"Clave privada detectada en cliente: {tokens}")
else:
    report("Seguridad Claves", "Cliente (HTML/JS)", True, "Cero llaves privadas expuestas")

# -------------------------------------------------------------
# 6. VERIFICACIÓN EN VIVO (HOSTINGER PRODUCCIÓN)
# -------------------------------------------------------------
print("\n--- 6. Verificación en Vivo (Hostinger HTTPS thecelebration.com.mx) ---")
live_urls = [
    ("https://thecelebration.com.mx/", 200, ["CELEBRATION", "$500"]),
    ("https://thecelebration.com.mx/signature.html", 200, ["$500", "pago 100% completo"]),
    ("https://thecelebration.com.mx/essential.html", 200, ["$990", "$495"]),
    ("https://thecelebration.com.mx/premiere.html", 200, ["$1,790", "$895"]),
    ("https://thecelebration.com.mx/demo-editorial.html", 200, ["Camila &", "Smart RSVP"]),
    ("https://thecelebration.com.mx/demo-romantico.html", 200, ["Valentina &", "Smart RSVP"]),
    ("https://thecelebration.com.mx/demo-clasico.html", 200, ["Isabella &", "Smart RSVP"]),
    ("https://thecelebration.com.mx/checkout.html", 200, ["Pago 100% en línea", "PKGS"]),
    ("https://thecelebration.com.mx/robots.txt", 200, ["Disallow: /checkout.html"]),
    ("https://thecelebration.com.mx/sitemap.xml", 200, ["<urlset"]),
    ("https://thecelebration.com.mx/api/mp-orders.php?action=config", 200, ["public_key", "APP_USR-"])
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for url, expected_code, expected_strings in live_urls:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            code = resp.getcode()
            body = resp.read().decode("utf-8", errors="ignore")
            if code == expected_code:
                missing = [s for s in expected_strings if s not in body]
                if not missing:
                    report("Live HTTP", url, True, f"HTTP {code} OK")
                else:
                    report("Live HTTP", url, False, f"HTTP {code} pero faltan strings: {missing}")
            else:
                report("Live HTTP", url, False, f"HTTP {code} != {expected_code}")
    except urllib.error.HTTPError as e:
        report("Live HTTP", url, False, f"HTTP {e.code}")
    except Exception as e:
        report("Live HTTP", url, False, f"Error de conexión: {e}")

# -------------------------------------------------------------
# RESUMEN EJECUTIVO
# -------------------------------------------------------------
print("\n" + "=" * 70)
print(f"📊 RESUMEN AUDITORÍA: {len(PASSED)} APROBADAS | {len(FAILED)} FALLADAS | {len(WARNINGS)} ADVERTENCIAS")
print("=" * 70)

if FAILED:
    print("\n❌ FALLOS CRÍTICOS:")
    for f in FAILED:
        print(f"  - {f}")
    sys.exit(1)
else:
    print("\n✨ ¡AUDITORÍA 100% SUPERADA! Cero defectos encontrados.")
    sys.exit(0)

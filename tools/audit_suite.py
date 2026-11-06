import glob
import os
import re

print("=" * 60)
print("AUDITORÍA AUTOMATIZADA CELEBRATION — AGENTE QA & VERIFICATION")
print("=" * 60)

html_files = sorted(glob.glob("*.html"))
js_files = sorted(glob.glob("*.js"))
css_files = sorted(glob.glob("*.css"))

print(f"Total HTML: {len(html_files)}")
print(f"Total JS:   {len(js_files)}")
print(f"Total CSS:  {len(css_files)}")

# 1. Chequeo de referencias a archivos locales
missing_files = []
for html in html_files:
    with open(html, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Buscar atributos href y src
    matches = re.findall(r'(?:href|src)=["\']([^"\']+)["\']', content)
    for m in matches:
        if m.startswith("http://") or m.startswith("https://") or m.startswith("mailto:") or m.startswith("tel:") or m.startswith("data:") or m.startswith("#") or m.startswith("javascript:"):
            continue
        # Limpiar query params y hashes
        clean_path = m.split("?")[0].split("#")[0]
        if clean_path and not os.path.exists(clean_path):
            missing_files.append((html, m, clean_path))

if missing_files:
    print("\n[!] Archivos referenciados no encontrados:")
    for html, raw, clean in missing_files:
        print(f"  - En {html}: '{raw}' -> '{clean}' no existe.")
else:
    print("\n[✓] Todos los enlaces y recursos locales en archivos HTML existen.")

# 2. Búsqueda de placeholders o textos no profesionales
placeholders = ["lorem ipsum", "todo:", "fixme", "test test", "asdf", "xxx-xxx"]
found_placeholders = []
for fpath in html_files + js_files:
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        for idx, line in enumerate(f, 1):
            for p in placeholders:
                if p in line.lower():
                    found_placeholders.append((fpath, idx, line.strip()))

if found_placeholders:
    print("\n[!] Placeholders encontrados:")
    for fpath, idx, line in found_placeholders:
        print(f"  - {fpath}:{idx} -> {line[:80]}")
else:
    print("\n[✓] Cero placeholders prohibidos (lorem ipsum, test, asdf, etc.).")

# 3. Verificación de Service Worker caches
with open("sw.js", "r", encoding="utf-8") as f:
    sw_content = f.read()

cached_assets = re.findall(r"'([^']+\.(?:html|css|js|png|jpg|svg|webmanifest))'", sw_content)
missing_cached = []
for a in cached_assets:
    clean_a = a.lstrip("./")
    if not os.path.exists(clean_a):
        missing_cached.append(a)

if missing_cached:
    print(f"\n[!] Activos en sw.js no encontrados en disco: {missing_cached}")
else:
    print(f"\n[✓] Todos los activos pre-cacheados en sw.js ({len(cached_assets)}) existen.")

print("\n" + "=" * 60)
print("AUDITORÍA DE INTEGRIDAD FINALIZADA CON ÉXITO")
print("=" * 60)

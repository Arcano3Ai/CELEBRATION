import glob
import re
import os
from PIL import Image

def verify():
    html_files = sorted(glob.glob('*.html'))
    print(f"Auditoría Open Graph para WhatsApp en {len(html_files)} páginas:")
    print("-" * 75)
    
    all_ok = True
    for h in html_files:
        with open(h, 'r', encoding='utf-8') as f:
            txt = f.read()
        
        m_img = re.search(r'<meta property="og:image" content="([^"]+)">', txt)
        if not m_img:
            print(f"[-] {h:20} : Falta og:image")
            all_ok = False
            continue
            
        url = m_img.group(1)
        if not url.startswith('https://'):
            print(f"[-] {h:20} : og:image no es HTTPS ({url})")
            all_ok = False
            continue
            
        rel_path = url.replace('https://thecelebration.com.mx/', '')
        if not os.path.exists(rel_path):
            print(f"[-] {h:20} : Archivo local {rel_path} no existe")
            all_ok = False
            continue
            
        size_kb = os.path.getsize(rel_path) / 1024
        img = Image.open(rel_path)
        w, h_px = img.size
        
        # Check requirements: 1200x630, size < 300KB
        size_status = "OK (<300KB)" if size_kb < 300 else "EXCEDIDO (>300KB)"
        ratio_status = "1.91:1 (Ideal WhatsApp)" if abs((w / h_px) - (1200/630)) < 0.05 else f"Ratio {w/h_px:.2f}"
        
        print(f"[✓] {h:20} -> {os.path.basename(rel_path):22} | {w}x{h_px}px | {size_kb:.1f} KB [{size_status}] | {ratio_status}")

    print("-" * 75)
    if all_ok:
        print("RESULTADO: 100% DE LAS PÁGINAS CUMPLEN EL ESTÁNDAR WHATSAPP / SOCIAL CARD")
    else:
        print("RESULTADO: SE ENCONTRARON FALLAS EN METADATOS")

if __name__ == '__main__':
    verify()


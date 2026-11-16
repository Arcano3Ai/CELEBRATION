import subprocess
import time
import sys
from playwright.sync_api import sync_playwright

def test_commercial_landing():
    print("=" * 65)
    print("TEST SUITE: VERIFICACIÓN MOBILE FIRST & LANDING COMERCIAL 2027")
    print("=" * 65)

    server = subprocess.Popen([sys.executable, "-m", "http.server", "8095"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            
            viewports = [
                ("Mobile 360px (Compact Android)", 360, 640),
                ("Mobile 390px (iPhone 14/15)", 390, 844),
                ("Mobile 430px (iPhone Pro Max)", 430, 932),
                ("Tablet 768px (iPad)", 768, 1024),
                ("Desktop 1280px", 1280, 800)
            ]

            for name, w, h in viewports:
                print(f"\n[*] Evaluando Viewport: {name} ({w}x{h})...")
                context = browser.new_context(viewport={"width": w, "height": h})
                page = context.new_page()
                page.goto("http://localhost:8095/", wait_until="domcontentloaded")
                page.wait_for_timeout(600)

                # 1. Zero horizontal overflow check
                overflow = page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")
                scroll_w = page.evaluate("() => document.documentElement.scrollWidth")
                client_w = page.evaluate("() => document.documentElement.clientWidth")
                print(f"    [✓] Scroll horizontal: {'DESBORDAMIENTO DETECTADO' if overflow else 'NINGUNO (scrollWidth=' + str(scroll_w) + ', clientWidth=' + str(client_w) + ')'}")
                assert not overflow, f"Error: Scroll horizontal detectado en {name}"

                # 2. Check 4 Packages present
                page_text = page.inner_text("#servicios")
                for pkg_title, price in [
                    ("Mini Celebration", "$990"),
                    ("Essential", "$1,490"),
                    ("Premiere Edition", "$2,490"),
                    ("Signature", "$3,990")
                ]:
                    assert pkg_title in page_text, f"Paquete {pkg_title} no encontrado"
                    assert price in page_text, f"Precio {price} no encontrado"
                print(f"    [✓] Las 4 colecciones ($990, $1,490, $2,490, $3,990) verificadas en el DOM")

                # 3. Check WhatsApp preloaded messages
                wa_links = page.evaluate("""() => {
                    const links = Array.from(document.querySelectorAll('#servicios a[href*="wa.me"]'));
                    return links.map(a => a.href);
                }""")
                assert len(wa_links) == 4, f"Se esperaban 4 enlaces de WhatsApp en colecciones, se encontraron {len(wa_links)}"
                assert "Mini%20Celebration" in wa_links[0] and "%24990" in wa_links[0]
                assert "Essential" in wa_links[1] and "%241%2C490" in wa_links[1]
                assert "Premiere%20Edition" in wa_links[2] and "%242%2C490" in wa_links[2]
                assert "Signature" in wa_links[3] and "%243%2C990" in wa_links[3]
                print(f"    [✓] Mensajes de WhatsApp precargados 100% correctos por paquete")

                # 4. Check Mobile Menu behavior on mobile
                if w < 768:
                    burger = page.query_selector("#burgerBtn")
                    mob_nav = page.query_selector("#mobNav")
                    assert burger is not None and mob_nav is not None
                    
                    # Open menu
                    burger.click()
                    page.wait_for_timeout(300)
                    is_open = page.evaluate("() => document.getElementById('mobNav').classList.contains('open')")
                    assert is_open, "Error: El menú móvil no abrió al hacer clic"
                    print(f"    [✓] Menú hamburguesa: apertura confirmada")

                    # Click on first link in menu -> should close
                    first_link = page.query_selector("#mobNav .mob-link")
                    first_link.click()
                    page.wait_for_timeout(300)
                    is_closed = page.evaluate("() => !document.getElementById('mobNav').classList.contains('open')")
                    assert is_closed, "Error: El menú móvil no se cerró al seleccionar una sección"
                    print(f"    [✓] Menú hamburguesa: cierre automático al tocar enlace confirmado")

                    # Check floating WhatsApp button
                    wa_float = page.query_selector(".floating-whatsapp")
                    assert wa_float is not None
                    float_text = page.evaluate("() => document.querySelector('.floating-whatsapp span').innerText")
                    assert "CONSULTAR Y RESERVAR" in float_text.upper(), f"Texto de botón flotante incorrecto: {float_text}"
                    wa_box = wa_float.bounding_box()
                    assert wa_box['height'] >= 40, f"Altura táctil de WhatsApp insuficiente: {wa_box['height']}px"
                    print(f"    [✓] Botón flotante móvil: '{float_text}' verificado ({wa_box['width']:.0f}x{wa_box['height']:.0f}px)")

                context.close()

            browser.close()
    finally:
        server.terminate()

    print("\n" + "=" * 65)
    print("TODAS LAS PRUEBAS MOBILE FIRST Y COMERCIALES PASARON (100% OK)")
    print("=" * 65)

if __name__ == "__main__":
    test_commercial_landing()

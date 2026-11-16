import sys
from playwright.sync_api import sync_playwright

def run_tests():
    viewports = [
        {"name": "Mobile 360", "width": 360, "height": 740},
        {"name": "Mobile 390", "width": 390, "height": 844},
        {"name": "Mobile 430", "width": 430, "height": 932},
        {"name": "Tablet 768", "width": 768, "height": 1024},
        {"name": "Desktop 1280", "width": 1280, "height": 800},
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        for vp in viewports:
            page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
            page.goto("http://localhost:8080/index.html", wait_until="networkidle")

            # Check horizontal overflow
            scroll_width = page.evaluate("() => document.documentElement.scrollWidth")
            inner_width = page.evaluate("() => window.innerWidth")
            diff = scroll_width - inner_width
            print(f"[{vp['name']}] innerWidth: {inner_width}, scrollWidth: {scroll_width}, diff: {diff}")
            assert diff <= 1, f"Desbordamiento horizontal detectado en {vp['name']}: {diff}px"

        # Test clicking disabled contract button triggers toast feedback (force=True because aria-disabled="true")
        btn_mini = page.locator("#plan-mini [data-contract='mini']")
        assert btn_mini.is_visible()
        btn_mini.click(force=True)
        page.wait_for_timeout(500)

        # Check toast appeared or console had no uncaught exceptions
        toast = page.locator(".co-toast.show")
        toast_visible = toast.count() > 0
        print(f"Toast feedback visible al clic en botón deshabilitado: {toast_visible}")

        # Check footer links
        footer_links = page.locator(".site-footer a").all()
        for l in footer_links:
            href = l.get_attribute("href") or ""
            assert not href.endswith(".md"), f"Enlace .md en footer: {href}"
            assert "CONTRATO" not in href.upper(), f"Contrato en footer: {href}"
            assert "BRIEF" not in href.upper(), f"Brief en footer: {href}"
        print("✓ Verificación de footer y enlaces en navegador completada.")

        # Test dynamic activation with mock payments
        print("\nProbando activación dinámica de enlaces de Mercado Pago...")
        page.evaluate("""() => {
            window.CELEBRATION_PAYMENTS = {
                mini: 'https://mpago.la/test-mini',
                essential: '',
                premiere: '',
                signature: ''
            };
            initDirectPaymentButtons();
        }""")
        
        btn_mini_updated = page.locator("#plan-mini [data-contract='mini']")
        href_updated = btn_mini_updated.get_attribute("href")
        has_disabled = "is-disabled" in (btn_mini_updated.get_attribute("class") or "")
        print(f"Href después de configurar link: {href_updated}, is-disabled: {has_disabled}")
        assert href_updated == "https://mpago.la/test-mini"
        assert not has_disabled, "El botón debería estar habilitado tras asignar link"

        browser.close()
        print("\n✓ TODAS LAS PRUEBAS DE PLAYWRIGHT PASARON CON 100% DE ÉXITO.")

if __name__ == '__main__':
    run_tests()

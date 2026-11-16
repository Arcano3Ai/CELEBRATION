from playwright.sync_api import sync_playwright

def test_mp_links():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:8080/index.html", wait_until="networkidle")

        expected_links = {
            "mini": "https://mpago.la/1aCxnoc",
            "essential": "https://mpago.la/1Kr6QvJ",
            "premiere": "https://mpago.la/2nSE4Lm",
            "signature": "https://mpago.la/1wsG4uy"
        }

        for plan_key, expected_url in expected_links.items():
            btn = page.locator(f"#plan-{plan_key} [data-contract='{plan_key}']")
            assert btn.is_visible(), f"Botón {plan_key} no visible"
            
            href = btn.get_attribute("href")
            classes = btn.get_attribute("class") or ""
            aria_disabled = btn.get_attribute("aria-disabled")
            
            print(f"[{plan_key}] Href: {href}")
            assert href == expected_url, f"URL incorrecta en {plan_key}: esperado {expected_url}, obtenido {href}"
            assert "is-disabled" not in classes, f"El botón {plan_key} sigue teniendo clase is-disabled"
            assert aria_disabled != "true", f"El botón {plan_key} sigue teniendo aria-disabled=true"

            # Check target and rel
            assert btn.get_attribute("target") == "_blank"
            assert "noopener" in (btn.get_attribute("rel") or "")

            # Check pay note text
            note = page.locator(f"#plan-{plan_key} [data-pay-note='{plan_key}']")
            assert "Pago seguro con Mercado Pago" in note.inner_text()
            print(f"✓ [{plan_key}] Habilitado y configurado correctamente: {href}")

        browser.close()
        print("\n✓ TODOS LOS BOTONES DE MERCADO PAGO QUEDARON ACTIVADOS Y VERIFICADOS CON ÉXITO.")

if __name__ == '__main__':
    test_mp_links()

from playwright.sync_api import sync_playwright

def test_event_picker():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        viewports = [
            {"name": "Mobile 360", "width": 360, "height": 740},
            {"name": "Mobile 390", "width": 390, "height": 844},
            {"name": "Mobile 430", "width": 430, "height": 932},
            {"name": "Desktop 1280", "width": 1280, "height": 800},
        ]

        for vp in viewports:
            page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
            page.goto("http://localhost:8080/index.html", wait_until="networkidle")

            # Check overflow
            scroll_width = page.evaluate("() => document.documentElement.scrollWidth")
            inner_width = page.evaluate("() => window.innerWidth")
            assert scroll_width <= inner_width + 1, f"Overflow in {vp['name']}: {scroll_width} vs {inner_width}"
            print(f"✓ [{vp['name']}] Sin overflow horizontal")

        # Check select element
        select = page.locator("#eventSelect")
        assert select.is_visible()
        options = select.locator("option").all_inner_texts()
        print(f"Opciones encontradas ({len(options)}):", options)
        assert len(options) == 11

        expected_values = [
            "Boda", "XV años", "Cumpleaños", "Bautizo", "Baby Shower",
            "Gender Reveal", "Compromiso", "Aniversario", "Graduación",
            "Primera Comunión", "Otro evento especial"
        ]
        for ev in expected_values:
            assert any(ev in opt for opt in options), f"Falta opción: {ev}"

        # Default is Boda -> check WA link
        btn_mini_wa = page.locator("#plan-mini [data-plan-wa='mini']")
        href_boda = btn_mini_wa.get_attribute("href")
        print("Href con Boda por defecto:", href_boda)
        assert "Hola%2C%20quiero%20informaci%C3%B3n%20de%20Mini%20Celebration%20de%20%24990." in href_boda

        # Change select to "XV años"
        select.select_option("XV años")
        page.wait_for_timeout(200)

        href_xv = btn_mini_wa.get_attribute("href")
        print("Href con XV años:", href_xv)
        assert "para%20mi%20evento%20(XV%20a%C3%B1os)" in href_xv or "XV" in href_xv

        # Change select to "Baby Shower"
        select.select_option("Baby Shower")
        page.wait_for_timeout(200)

        btn_premiere_wa = page.locator("#plan-premiere [data-plan-wa='premiere']")
        href_prem_bs = btn_premiere_wa.get_attribute("href")
        print("Href Premiere con Baby Shower:", href_prem_bs)
        assert "Baby%20Shower" in href_prem_bs

        # Change select to "Graduación"
        select.select_option("Graduación")
        page.wait_for_timeout(200)

        btn_sig_wa = page.locator("#plan-signature [data-plan-wa='signature']")
        href_sig_grad = btn_sig_wa.get_attribute("href")
        print("Href Signature con Graduación:", href_sig_grad)
        assert "Graduaci%C3%B3n" in href_sig_grad

        browser.close()
        print("\n✓ TODAS LAS PRUEBAS DEL EVENT PICKER PASARON CON ÉXITO.")

if __name__ == '__main__':
    test_event_picker()

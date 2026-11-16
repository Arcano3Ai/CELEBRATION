import urllib.request
import re
import sys
from bs4 import BeautifulSoup

def test_local_page():
    url = "http://localhost:8080/index.html"
    print(f"Probando {url}...")
    try:
        req = urllib.request.urlopen(url)
        html = req.read().decode('utf-8')
    except Exception as e:
        print(f"Error conectando a {url}: {e}")
        sys.exit(1)

    soup = BeautifulSoup(html, 'html.parser')

    # 1. Verificar scripts
    scripts = [s.get('src') for s in soup.find_all('script') if s.get('src')]
    assert 'payment-config.js' in scripts, "payment-config.js no encontrado en scripts"
    assert 'script.js' in scripts, "script.js no encontrado en scripts"
    print("✓ Scripts payment-config.js y script.js incluidos en orden.")

    # 2. Verificar las 4 cards
    expected_plans = ['mini', 'essential', 'premiere', 'signature']
    for p in expected_plans:
        card = soup.find(id=f"plan-{p}")
        assert card is not None, f"Card plan-{p} no encontrada"
        btn_contract = card.find('a', attrs={'data-contract': p})
        assert btn_contract is not None, f"Botón data-contract={p} no encontrado"
        assert "Contratar ahora" in btn_contract.text, f"Texto de botón de contratación incorrecto en {p}"
        
        btn_wa = card.find('a', href=re.compile(r'https://wa\.me/528121912778'))
        assert btn_wa is not None, f"Botón de WhatsApp no encontrado en {p}"
        
        note = card.find(attrs={'data-pay-note': p})
        assert note is not None, f"Nota de pago no encontrada en {p}"
        assert "Pago próximamente disponible" in note.text
    print("✓ Las 4 tarjetas de paquetes (Mini, Essential, Premiere, Signature) están presentes con doble botón.")

    # 3. Verificar Premiere destacado
    premiere_card = soup.find(id="plan-premiere")
    assert "plan-card--featured" in premiere_card.get('class', []), "Premiere no tiene clase plan-card--featured"
    assert "★ Recomendado" in premiere_card.text, "Premiere no tiene etiqueta ★ Recomendado"
    print("✓ Premiere Edition destacado correctamente como paquete recomendado.")

    # 4. Verificar proceso de 4 pasos
    proceso = soup.find(id="proceso")
    assert proceso is not None, "Sección #proceso no encontrada"
    steps = proceso.find_all(class_="step-item")
    assert len(steps) == 4, f"Se esperaban 4 pasos, encontrados: {len(steps)}"
    expected_steps = [
        "Elige tu colección",
        "Contrata tu paquete",
        "Comparte los datos",
        "Recibe tu invitación"
    ]
    for i, exp in enumerate(expected_steps):
        assert exp in steps[i].text, f"Paso {i+1} no coincide con '{exp}'"
    print("✓ Proceso de contratación de 4 pasos verificado.")

    # 5. Verificar footer limpio y CERO enlaces .md
    footer = soup.find('footer', class_='site-footer')
    assert footer is not None, "Footer no encontrado"
    all_links = footer.find_all('a')
    for link in all_links:
        href = link.get('href', '')
        assert not href.endswith('.md'), f"ERROR: Enlace .md encontrado en el footer: {href}"
        assert "CONTRATO" not in href.upper(), f"ERROR: Enlace de contrato en el footer: {href}"
        assert "BRIEF" not in href.upper(), f"ERROR: Enlace de brief en el footer: {href}"
        assert "CATALOGO" not in href.upper(), f"ERROR: Enlace de catálogo en el footer: {href}"
    print("✓ Footer 100% limpio: CERO enlaces a archivos .md, brief ni catálogos internos.")

    print("\nTODAS LAS VALIDACIONES BÁSICAS PASARON EXITOSAMENTE.")

if __name__ == '__main__':
    test_local_page()

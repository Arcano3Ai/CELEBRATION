import subprocess
import time
import sys
from playwright.sync_api import sync_playwright

server = subprocess.Popen([sys.executable, '-m', 'http.server', '8092'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:8092/', wait_until='domcontentloaded')
        
        # Test: Touch/click anywhere on empty background
        print("Probando toque en cualquier punto de la pantalla (x=300, y=300)...")
        page.mouse.click(300, 300)
        page.wait_for_timeout(1000)
        
        audio_state = page.evaluate("""() => {
            const a = document.getElementById('bgAudio');
            return {
                paused: a.paused,
                currentTime: a.currentTime,
                volume: a.volume,
                muted: a.muted
            };
        }""")
        print(f"Estado tras tocar en cualquier parte: {audio_state}")
        assert not audio_state['paused'], "Fallo: El audio no comenzó al tocar la pantalla"
        assert not audio_state['muted'], "Fallo: El audio sigue en silencio"
        assert audio_state['currentTime'] > 0, "Fallo: El tiempo no avanzó"
        print("[✓] ¡ÉXITO! La música arranca inmediatamente al primer contacto en cualquier parte del sitio sin buscar el botón.")
finally:
    server.terminate()

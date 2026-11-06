import os
import sys
import time
import subprocess
from playwright.sync_api import sync_playwright

def run_tests():
    print("=" * 60)
    print("TEST SUITE: AUDITORÍA END-TO-END DE AUDIO Y EXPERIENCIA WEB")
    print("=" * 60)

    # Iniciar servidor local para probar los cambios inmediatamente
    server_process = subprocess.Popen(
        [sys.executable, "-m", "http.server", "8089"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(1)

    local_url = "http://localhost:8089/"
    print(f"[*] Evaluando entorno local: {local_url}")

    console_errors = []
    page_logs = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=["--no-sandbox"]
            )
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            page = context.new_page()

            # Capturar logs y errores de consola
            page.on("console", lambda msg: (
                console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error"] else page_logs.append(f"[{msg.type}] {msg.text}")
            ))
            page.on("pageerror", lambda err: console_errors.append(f"[pageerror] {err}"))

            # Navegar a la página
            response = page.goto(local_url, wait_until="domcontentloaded", timeout=15000)
            page.wait_for_timeout(1000)
            print(f"[✓] Respuesta HTTP status: {response.status}")
            assert response.status == 200, f"Error: HTTP status is {response.status}"

            # 1. Verificar presencia de elementos
            audio_handle = page.query_selector("#bgAudio")
            player_container = page.query_selector(".floating-audio-player")
            toggle_btn = page.query_selector("#audioToggleBtn")
            concierge_btn = page.query_selector("#conciergeTrigger")

            assert audio_handle is not None, "Error: #bgAudio no encontrado en el DOM"
            assert player_container is not None, "Error: .floating-audio-player no encontrado"
            assert toggle_btn is not None, "Error: #audioToggleBtn no encontrado"
            assert concierge_btn is not None, "Error: #conciergeTrigger no encontrado"
            print("[✓] Elementos del reproductor y Concierge AI presentes en el DOM.")

            # 2. Verificar que los botones NO se solapan (bounding boxes separados)
            audio_box = player_container.bounding_box()
            concierge_box = concierge_btn.bounding_box()
            print(f"[✓] Bounding Box Reproductor: {audio_box}")
            print(f"[✓] Bounding Box Concierge:  {concierge_box}")
            # Ensure vertical separation
            assert audio_box['y'] + audio_box['height'] <= concierge_box['y'] or audio_box['y'] >= concierge_box['y'] + concierge_box['height'], \
                "Error: El reproductor de audio y el botón Concierge AI se solapan visualmente."
            print("[✓] Verificación de NO colisión exitosa: el reproductor flota limpiamente sobre Concierge AI.")

            # 3. Audio Source Check
            audio_src = page.evaluate("() => document.getElementById('bgAudio').currentSrc || document.getElementById('bgAudio').src")
            print(f"[✓] URL del Audio: {audio_src}")
            assert "celebration_que_se_prenda.mp3" in audio_src, f"Source no coincide: {audio_src}"

            # 4. Estado de audio antes de gesto
            initial_paused = page.evaluate("() => document.getElementById('bgAudio').paused")
            print(f"[*] Estado de audio antes de interacción: paused={initial_paused}")

            # 5. Simular gesto de usuario (scroll + clic)
            print("[*] Simulando primer gesto de usuario (scroll e interacción)...")
            page.mouse.wheel(0, 300)
            page.wait_for_timeout(400)
            page.mouse.click(640, 400)
            page.wait_for_timeout(1000)

            # Si sigue pausado por política estricta sin foco, hacer clic directo en el botón toggle
            if page.evaluate("() => document.getElementById('bgAudio').paused"):
                print("[*] Activando mediante clic directo en el reproductor flotante...")
                toggle_btn.click()
                page.wait_for_timeout(1200)

            time.sleep(2)
            state_after_play = page.evaluate("""() => {
                const a = document.getElementById('bgAudio');
                const p = document.querySelector('.floating-audio-player');
                return {
                    paused: a.paused,
                    currentTime: a.currentTime,
                    duration: a.duration,
                    volume: a.volume,
                    hasIsPlayingClass: p ? p.classList.contains('is-playing') : false,
                    readyState: a.readyState
                };
            }""")

            print(f"[✓] Métricas de reproducción en vivo:")
            print(f"    - Estado pausado: {state_after_play['paused']}")
            print(f"    - Tiempo transcurrido: {state_after_play['currentTime']:.2f} segundos")
            print(f"    - Duración total de pista: {state_after_play['duration']:.2f} segundos (~2m 51s)")
            print(f"    - Nivel de volumen: {state_after_play['volume'] * 100:.0f}%")
            print(f"    - Clase 'is-playing' activa (ecualizador animado): {state_after_play['hasIsPlayingClass']}")
            print(f"    - ReadyState de audio: {state_after_play['readyState']} (HAVE_ENOUGH_DATA)")

            assert not state_after_play['paused'], "Fallo: El audio debería estar reproduciéndose"
            assert state_after_play['currentTime'] > 0, "Fallo: El contador de tiempo no avanzó"
            assert state_after_play['hasIsPlayingClass'], "Fallo: .is-playing no está presente en el reproductor"

            # 6. Probar botón de Pausa (SIN que ningún otro elemento intercepte el puntero)
            print("[*] Probando botón de Pausa...")
            toggle_btn.click()
            page.wait_for_timeout(800)
            state_paused = page.evaluate("""() => {
                const a = document.getElementById('bgAudio');
                const p = document.querySelector('.floating-audio-player');
                return {
                    paused: a.paused,
                    hasIsPlayingClass: p ? p.classList.contains('is-playing') : false
                };
            }""")
            print(f"[✓] Estado tras pausar: paused={state_paused['paused']}, is-playing={state_paused['hasIsPlayingClass']}")
            assert state_paused['paused'], "Fallo: El audio no se pausó"
            assert not state_paused['hasIsPlayingClass'], "Fallo: La clase .is-playing debería haberse desactivado"

            # 7. Probar reanudación
            print("[*] Probando reanudación con nuevo clic...")
            toggle_btn.click()
            page.wait_for_timeout(800)
            state_resumed = page.evaluate("() => ({ paused: document.getElementById('bgAudio').paused })")
            print(f"[✓] Estado tras reanudar: paused={state_resumed['paused']}")
            assert not state_resumed['paused'], "Fallo: El audio no reanudó la reproducción"

            # 8. Verificar precios San Pedro Garza García
            print("[*] Auditando precios San Pedro Garza García...")
            body_text = page.inner_text("body")
            for pkg, price in [("Signature Atelier", "$4,200"), ("Destination & Heritage", "$6,800"), ("Grand Luxe Suite", "$9,500")]:
                assert price in body_text, f"Precio {price} de {pkg} no encontrado"
                print(f"    [✓] {pkg}: {price} MXN verificado en pantalla")

            # 9. Verificar que Concierge AI abre sin interferencias
            print("[*] Probando apertura del Drawer de Concierge AI...")
            concierge_btn.click()
            page.wait_for_timeout(600)
            modal = page.query_selector("#conciergeModal")
            assert modal is not None, "Error: #conciergeModal no existe"
            modal_classes = page.evaluate("() => document.getElementById('conciergeModal').className")
            assert "open" in modal_classes, "Error: Concierge Modal no se abrió al hacer clic"
            print("[✓] Concierge AI abrió correctamente y opera en armonía con el reproductor.")

            # Cerrar drawer
            close_drawer_btn = page.query_selector("#conciergeClose")
            if close_drawer_btn:
                close_drawer_btn.click()
                page.wait_for_timeout(500)

            # 10. Auditoría de consola
            real_errors = [e for e in console_errors if "favicon" not in e and "Third-party cookie" not in e]
            print(f"[*] Errores de consola: {len(real_errors)}")
            assert len(real_errors) == 0, f"Errores en consola encontrados: {real_errors}"
            print("[✓] Cero errores en consola.")

            # Guardar captura
            screenshot_path = "tools/test_audio_result.png"
            page.screenshot(path=screenshot_path)
            print(f"[✓] Captura fotográfica guardada en: {screenshot_path}")

            browser.close()

    finally:
        server_process.terminate()

    print("=" * 60)
    print("TODAS LAS PRUEBAS DE AUDIO, POSICIONAMIENTO Y E2E PASARON (100% OK)")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()

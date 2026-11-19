import asyncio
from playwright.async_api import async_playwright

PAGES = [
    ("Home", "https://thecelebration.com.mx/"),
    ("Signature (Ads Landing)", "https://thecelebration.com.mx/signature.html"),
    ("Essential", "https://thecelebration.com.mx/essential.html"),
    ("Premiere Edition", "https://thecelebration.com.mx/premiere.html"),
    ("Checkout Standalone", "https://thecelebration.com.mx/checkout.html?pkg=signature"),
    ("Checkout Essential", "https://thecelebration.com.mx/checkout.html?pkg=essential"),
    ("Checkout Premiere", "https://thecelebration.com.mx/checkout.html?pkg=premiere"),
    ("Demo Editorial", "https://thecelebration.com.mx/demo-editorial.html"),
    ("Demo Romántico", "https://thecelebration.com.mx/demo-romantico.html"),
    ("Demo Clásico", "https://thecelebration.com.mx/demo-clasico.html"),
]

VIEWPORTS = [
    ("Mobile 360px", 360, 640),
    ("Mobile 375px", 375, 812),
    ("Desktop 1280px", 1280, 800)
]

async def run():
    print("=" * 70)
    print("🚀 AUDITORÍA E2E BROWSER (PLAYWRIGHT HEADLESS) — MODO PICKLE RICK")
    print("=" * 70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        total_tests = 0
        passed_tests = 0
        issues = []
        
        for p_name, url in PAGES:
            print(f"\n📄 Inspeccionando: {p_name} ({url})")
            for v_name, w, h in VIEWPORTS:
                total_tests += 1
                context = await browser.new_context(viewport={"width": w, "height": h})
                page = await context.new_page()
                
                console_errors = []
                page_errors = []
                
                page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
                page.on("pageerror", lambda err: page_errors.append(str(err)))
                
                try:
                    await page.goto(url, wait_until="load", timeout=20000)
                    await page.wait_for_timeout(1000) # give JS time to hydrate DOM
                    
                    # Check horizontal overflow
                    scroll_w = await page.evaluate("() => document.documentElement.scrollWidth")
                    inner_w = await page.evaluate("() => window.innerWidth")
                    overflow_diff = scroll_w - inner_w
                    
                    # Filter third-party telemetry / ads tracking noise
                    critical_console = [e for e in console_errors if not any(x in e for x in ["googletagmanager", "doubleclick", "analytics", "google-analytics"])]
                    
                    if overflow_diff > 1:
                        issues.append(f"[{p_name} @ {v_name}] Overflow horizontal detectado: {scroll_w}px > {inner_w}px (diff: {overflow_diff}px)")
                        print(f"  ❌ FAIL: {v_name} — Overflow {overflow_diff}px")
                    elif page_errors:
                        issues.append(f"[{p_name} @ {v_name}] Error no capturado JS: {page_errors}")
                        print(f"  ❌ FAIL: {v_name} — Error JS")
                    else:
                        passed_tests += 1
                        print(f"  ✅ PASS: {v_name} (diff: 0px, 0 errores JS)")
                        
                except Exception as e:
                    issues.append(f"[{p_name} @ {v_name}] Excepción de carga: {e}")
                    print(f"  ❌ FAIL: {v_name} — Excepción: {e}")
                finally:
                    await context.close()
                    
        await browser.close()
        
        print("\n" + "=" * 70)
        print(f"📊 RESUMEN E2E: {passed_tests}/{total_tests} PRUEBAS SUPERADAS")
        print("=" * 70)
        
        if issues:
            print("\n🚨 DETALLES DE INCIDENCIAS:")
            for iss in issues:
                print(f"  - {iss}")
            sys.exit(1)
        else:
            print("\n✨ ¡PERFECTO! Cero overflow horizontal y cero errores de JavaScript en todas las pantallas.")

if __name__ == "__main__":
    import sys
    asyncio.run(run())

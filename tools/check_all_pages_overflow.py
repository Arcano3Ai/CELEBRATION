import asyncio
from playwright.async_api import async_playwright

PAGES = [
    "index.html",
    "demo-editorial.html",
    "demo-romantico.html",
    "demo-clasico.html",
    "planner.html",
    "passes.html",
    "checkout.html",
    "live.html"
]

VIEWPORTS = [
    {"name": "iPhone SE (375px)", "width": 375, "height": 667},
    {"name": "iPhone 14/15 (390px)", "width": 390, "height": 844},
    {"name": "Desktop (1280px)", "width": 1280, "height": 800}
]

async def check():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for vp in VIEWPORTS:
            print(f"\n=== VIEWPORT: {vp['name']} ===", flush=True)
            page = await browser.new_page(viewport={"width": vp["width"], "height": vp["height"]})
            for p_name in PAGES:
                url = f"http://localhost:8080/{p_name}"
                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=5000)
                    await asyncio.sleep(0.3)
                except Exception as e:
                    print(f"Error loading {p_name}: {e}", flush=True)
                    continue
                
                info = await page.evaluate('''() => {
                    const docW = document.documentElement.scrollWidth;
                    const winW = window.innerWidth;
                    const diff = docW - winW;
                    let offenders = [];
                    if (diff > 0) {
                        const all = document.querySelectorAll('*');
                        for (const el of all) {
                            const rect = el.getBoundingClientRect();
                            if (rect.right > winW + 1) {
                                offenders.push({
                                    tag: el.tagName,
                                    cls: (el.className || '').toString().slice(0, 40),
                                    id: el.id,
                                    right: Math.round(rect.right),
                                    width: Math.round(rect.width)
                                });
                                if (offenders.length > 5) break;
                            }
                        }
                    }
                    return { docW, winW, diff, offenders };
                }''')
                
                status = "PASS" if info["diff"] <= 0 else f"FAIL (+{info['diff']}px)"
                print(f"[{status}] {p_name.ljust(22)} (docW={info['docW']}, winW={info['winW']})", flush=True)
                if info["offenders"]:
                    for off in info["offenders"][:3]:
                        print(f"    -> <{off['tag']} class='{off['cls']}'> right={off['right']} width={off['width']}", flush=True)
            await page.close()
        await browser.close()

asyncio.run(check())

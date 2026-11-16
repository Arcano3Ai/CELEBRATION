import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        
        # Desktop
        page_d = await b.new_page(viewport={'width': 1280, 'height': 850})
        await page_d.goto('http://localhost:8080/index.html', wait_until='domcontentloaded')
        await asyncio.sleep(0.3)
        await page_d.screenshot(path='tools/new_hero_desktop.png')
        
        # Mobile 375px
        page_m = await b.new_page(viewport={'width': 375, 'height': 812})
        await page_m.goto('http://localhost:8080/index.html', wait_until='domcontentloaded')
        await asyncio.sleep(0.3)
        await page_m.screenshot(path='tools/new_hero_mobile.png')
        
        diff = await page_m.evaluate('document.documentElement.scrollWidth - window.innerWidth')
        print(f"Mobile 375px overflow diff: {diff}px")
        
        await b.close()

asyncio.run(verify())

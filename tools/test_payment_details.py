import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        
        # 1. Desktop checkout.html
        page = await b.new_page(viewport={'width': 1200, 'height': 900})
        await page.goto('http://localhost:8080/checkout.html?pkg=signature', wait_until='domcontentloaded')
        await asyncio.sleep(0.3)
        
        # Verify details
        desc = await page.inner_text('#pkgDetailsDesc')
        print(f"Signature desc: {desc}")
        assert "Signature" in desc, "Signature missing from desc"
        assert "Anticipo del 50%" in desc, "Anticipo del 50% missing"
        
        bullets = await page.query_selector_all('#pkgDetailsList li')
        print(f"Signature bullets count: {len(bullets)}")
        assert len(bullets) >= 5, "Expected at least 5 bullets for signature"
        
        for i, bullet in enumerate(bullets):
            txt = await bullet.inner_text()
            print(f"  Bullet {i+1}: {txt}")
            
        await page.screenshot(path='tools/checkout_signature_desktop.png')
        
        # Click on Premiere tab
        await page.click('button[data-pkg="premiere"]')
        await asyncio.sleep(0.2)
        desc_prem = await page.inner_text('#pkgDetailsDesc')
        print(f"Premiere desc: {desc_prem}")
        assert "Premiere Edition" in desc_prem
        
        # Click on Mini tab
        await page.click('button[data-pkg="mini"]')
        await asyncio.sleep(0.2)
        desc_mini = await page.inner_text('#pkgDetailsDesc')
        print(f"Mini desc: {desc_mini}")
        assert "Mini Celebration" in desc_mini
        
        # Mobile view
        page_m = await b.new_page(viewport={'width': 390, 'height': 844})
        await page_m.goto('http://localhost:8080/checkout.html?pkg=signature', wait_until='domcontentloaded')
        await asyncio.sleep(0.3)
        await page_m.screenshot(path='tools/checkout_signature_mobile.png')
        
        diff = await page_m.evaluate('document.documentElement.scrollWidth - window.innerWidth')
        print(f"Mobile overflow: {diff}px")
        assert diff == 0, f"Mobile overflow detected: {diff}px"
        
        print("ALL CHECKOUT TESTS PASSED!")
        await b.close()

asyncio.run(verify())

import asyncio
from playwright.async_api import async_playwright

EXPECTED = {
    'mini': 'https://mpago.la/1aCxnoc',
    'essential': 'https://mpago.la/1Kr6QvJ',
    'premiere': 'https://mpago.la/2nSE4Lm',
    'signature': 'https://mpago.la/1wsG4uy',
}

async def check():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # 1. Check index.html
        await page.goto('http://localhost:8080/index.html', wait_until='networkidle')
        
        buttons = await page.query_selector_all('[data-contract]')
        print(f"Found {len(buttons)} contract buttons in index.html")
        
        for btn in buttons:
            pkg = await btn.get_attribute('data-contract')
            href = await btn.get_attribute('href')
            target = await btn.get_attribute('target')
            print(f"Package '{pkg}': href={href}, target={target}")
            assert href == EXPECTED[pkg], f"Mismatch for {pkg}: {href} != {EXPECTED[pkg]}"
            assert target == '_blank', f"Target not _blank for {pkg}"
            
        # 2. Check FAQ text
        faq_text = await page.inner_text('body')
        assert "próximamente" not in faq_text.lower(), "Found 'próximamente' in index.html!"
        print("FAQ text verified: zero 'próximamente'")

        # 3. Check checkout.html
        for pkg, exp_url in EXPECTED.items():
            await page.goto(f'http://localhost:8080/checkout.html?pkg={pkg}', wait_until='networkidle')
            mp_btn = await page.query_selector('#btnMp')
            href = await mp_btn.get_attribute('href')
            print(f"checkout.html?pkg={pkg} -> MP button href={href}")
            assert href == exp_url, f"Mismatch in checkout.html for {pkg}: {href} != {exp_url}"

        print("ALL VERIFICATIONS PASSED SUCCESSFULLY!")
        await browser.close()

asyncio.run(check())

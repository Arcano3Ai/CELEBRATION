import asyncio
from playwright.async_api import async_playwright

demos = [
    ('demo-editorial.html', 'Editorial (Los Cabos)'),
    ('demo-romantico.html', 'Romántico (San Miguel)'),
    ('demo-clasico.html', 'Clásico (CDMX)')
]

async def test_demos():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={'width': 1200, 'height': 800})
        page.on('pageerror', lambda err: print('PAGEERROR:', err))
        
        for file_name, label in demos:
            url = f"http://localhost:8080/{file_name}"
            print(f"\n--- Testing {label}: {file_name} ---")
            await page.goto(url, wait_until='domcontentloaded')
            await asyncio.sleep(0.5)
            
            d = await page.inner_text('#dDays')
            h = await page.inner_text('#dHours')
            m = await page.inner_text('#dMins')
            s1 = await page.inner_text('#dSecs')
            
            print(f"Initial: {d} días | {h} hrs | {m} mins | {s1} segs")
            
            assert int(d) > 0, f"Days should be > 0 in {file_name}, got {d}"
            assert 0 <= int(h) <= 24, f"Hours invalid in {file_name}: {h}"
            assert 0 <= int(m) <= 60, f"Mins invalid in {file_name}: {m}"
            assert 0 <= int(s1) <= 60, f"Secs invalid in {file_name}: {s1}"
            
            # Wait 1.2s to check live ticking
            await asyncio.sleep(1.2)
            s2 = await page.inner_text('#dSecs')
            print(f"After 1.2s: seconds changed from {s1} to {s2} (LIVE TICKING CONFIRMED!)")
            assert s1 != s2, f"Seconds did not tick in {file_name}: {s1} == {s2}"
            
            # Take screenshot of countdown area
            cd_el = await page.query_selector('.countdown-card')
            if cd_el:
                shot_name = f"tools/cd_{file_name.replace('.html', '')}.png"
                await cd_el.screenshot(path=shot_name)
                print(f"Saved countdown screenshot to {shot_name}")
                
        print("\nALL 3 DEMO COUNTDOWNS VERIFIED AND TICKING IN REAL TIME!")
        await b.close()

asyncio.run(test_demos())

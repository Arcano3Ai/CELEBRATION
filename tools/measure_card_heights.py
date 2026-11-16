from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://localhost:8080/index.html', wait_until='networkidle')

    cards = ['mini', 'essential', 'premiere', 'signature']
    for c in cards:
        card = page.locator(f'#plan-{c}')
        box = card.bounding_box()
        title = card.locator('.srv-title')
        title_box = title.bounding_box()
        price = card.locator('.srv-price-box')
        price_box = price.bounding_box()
        meta = card.locator('.srv-anticipo-meta')
        meta_box = meta.bounding_box()
        lead = card.locator('.srv-lead')
        lead_box = lead.bounding_box()
        ul = card.locator('.srv-features-list')
        ul_box = ul.bounding_box()
        print(f"[{c}] Card H={box['height']:.1f} | Title H={title_box['height']:.1f} Y={title_box['y']:.1f} | Price Y={price_box['y']:.1f} | Meta Y={meta_box['y']:.1f} | Lead H={lead_box['height']:.1f} | UL H={ul_box['height']:.1f}")
    browser.close()

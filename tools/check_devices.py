from playwright.sync_api import sync_playwright

devices = [
    {'name': 'iPhone SE (375x667)', 'width': 375, 'height': 667, 'ua': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'},
    {'name': 'iPhone 14 / 15 Pro (393x852)', 'width': 393, 'height': 852, 'ua': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'},
    {'name': 'iPhone 15 Pro Max (430x932)', 'width': 430, 'height': 932, 'ua': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'},
    {'name': 'Android Galaxy S8/S9 (360x740)', 'width': 360, 'height': 740, 'ua': 'Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'},
    {'name': 'Android Pixel 7 (412x915)', 'width': 412, 'height': 915, 'ua': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'}
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for d in devices:
        page = browser.new_page(viewport={'width': d['width'], 'height': d['height']}, user_agent=d['ua'])
        page.goto('http://localhost:8080/index.html', wait_until='networkidle')
        scroll_w = page.evaluate('() => document.documentElement.scrollWidth')
        inner_w = page.evaluate('() => window.innerWidth')
        diff = scroll_w - inner_w
        print(f"{d['name']}: inner={inner_w}, scroll={scroll_w}, diff={diff}")
    browser.close()

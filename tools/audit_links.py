import glob
import os
from bs4 import BeautifulSoup

html_files = glob.glob('*.html')
print(f"Auditing links across {len(html_files)} files: {html_files}")

for filepath in sorted(html_files):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    all_ids = set([el['id'] for el in soup.find_all(id=True)])
    
    links = soup.find_all('a', href=True)
    empty_links = []
    broken_anchors = []
    broken_files = []
    
    for a in links:
        raw_href = a['href'].strip()
        text = a.get_text(strip=True)[:30]
        
        if raw_href == '#' or raw_href == '':
            # check if element has dynamic JS handler
            if not (a.has_attr('id') or a.has_attr('data-contract') or a.has_attr('onclick')):
                empty_links.append((text, raw_href))
        elif raw_href.startswith('#'):
            target_id = raw_href[1:]
            if target_id not in all_ids:
                broken_anchors.append((text, raw_href))
        elif not (raw_href.startswith('http') or raw_href.startswith('mailto:') or raw_href.startswith('tel:') or raw_href.startswith('javascript:')):
            # Split query params and anchors
            clean_url = raw_href.split('?')[0]
            parts = clean_url.split('#')
            filename = parts[0]
            if filename and not os.path.exists(filename):
                broken_files.append((text, raw_href))
            elif filename and len(parts) > 1:
                target_anchor = parts[1]
                if os.path.exists(filename):
                    with open(filename, 'r', encoding='utf-8') as tf:
                        t_soup = BeautifulSoup(tf.read(), 'html.parser')
                    t_ids = set([el['id'] for el in t_soup.find_all(id=True)])
                    if target_anchor not in t_ids:
                        broken_anchors.append((text, raw_href))
    
    print(f"\n[{filepath}] (Total <a> tags: {len(links)})")
    if empty_links:
        print(f"  EMPTY/PLACEHOLDER links ({len(empty_links)}):")
        for t, h in empty_links[:5]:
            print(f"    - '{t}' -> '{h}'")
    if broken_anchors:
        print(f"  BROKEN ANCHORS ({len(broken_anchors)}):")
        for t, h in broken_anchors:
            print(f"    - '{t}' -> '{h}'")
    if broken_files:
        print(f"  BROKEN FILE LINKS ({len(broken_files)}):")
        for t, h in broken_files:
            print(f"    - '{t}' -> '{h}'")
    if not empty_links and not broken_anchors and not broken_files:
        print("  -> ALL LINKS VALID & ACTIVE! (PASS)")

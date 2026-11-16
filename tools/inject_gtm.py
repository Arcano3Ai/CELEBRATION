import re
import glob

GTM_HEAD = '''  <!-- Google Tag Manager -->
  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-KD9P55XB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  </script>
  <!-- End Google Tag Manager -->
'''

GTM_BODY = '''  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KD9P55XB"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
'''

TARGET_FILES = [
    'index.html',
    'checkout.html',
    'demo-editorial.html',
    'demo-romantico.html',
    'demo-clasico.html',
    'planner.html',
    'passes.html'
]

for fname in TARGET_FILES:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'GTM-KD9P55XB' in content:
        print(f"{fname}: Already has GTM, skipping.")
        continue
    
    # 1. Inject into <head> right after <meta charset=...> or <head>
    if '<meta charset=' in content:
        content = re.sub(r'(<meta charset=[^>]+>\s*)', r'\1' + GTM_HEAD, content, count=1, flags=re.IGNORECASE)
    else:
        content = re.sub(r'(<head[^>]*>\s*)', r'\1' + GTM_HEAD, content, count=1, flags=re.IGNORECASE)
    
    # 2. Inject into <body> right after <body...>
    content = re.sub(r'(<body[^>]*>\s*)', r'\1' + GTM_BODY, content, count=1, flags=re.IGNORECASE)
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"{fname}: GTM injected successfully!")

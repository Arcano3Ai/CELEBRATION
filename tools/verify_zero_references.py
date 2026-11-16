import os

FORBIDDEN = [
    "live event",
    "galería colectiva",
    "galeria colectiva",
    "sunset monalisa",
    "nfc",
    "pantallas monumentales",
    "carga de fotografías",
    "carga de fotografias"
]

EXCLUDE_DIRS = {".git", "node_modules", ".system_generated", "tools"}
EXCLUDE_EXTS = {".jpg", ".png", ".mp4", ".log", ".webp", ".ico"}

results = []

for root, dirs, files in os.walk('.'):
    # Skip excluded directories
    dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
    
    for fname in files:
        # Don't check SPRINT_BOARD.md past sprint history unless desired, but let's check it too
        ext = os.path.splitext(fname)[1].lower()
        if ext in EXCLUDE_EXTS:
            continue
        
        path = os.path.join(root, fname)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
        except:
            continue
            
        content_lower = content.lower()
        for term in FORBIDDEN:
            if term in content_lower:
                # count occurrences and print line numbers
                lines = content.splitlines()
                matching_lines = [f"L{i+1}: {l.strip()[:80]}" for i, l in enumerate(lines) if term in l.lower()]
                results.append((path, term, matching_lines))

if not results:
    print("SUCCESS: EXACTLY ZERO REFERENCES FOUND IN THE CODEBASE!")
else:
    print(f"FOUND {len(results)} REFERENCES:")
    for path, term, lines in results:
        print(f"\n[{path}] term: '{term}'")
        for l in lines[:5]:
            print(f"  {l}")

#!/usr/bin/env python3
"""Builds the web app (index.html, app.js, style.css) from the design file.

    python3 tools/build.py

design/Main.dc.html is the design source (the same file as in the Claude artifact). This script turns its
template, styles and component code into plain files, adds the small runtime from tools/ and writes
the result next to the sources. Run it whenever design/Main.dc.html changes, then commit.
"""
import re, os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def read(p): return open(os.path.join(root, p), encoding='utf-8').read()
def write(p, s): open(os.path.join(root, p), 'w', encoding='utf-8').write(s)

src = read('design/Main.dc.html')
helmet = re.search(r'<helmet>(.*?)</helmet>', src, re.S).group(1)
css = re.search(r'<style>(.*?)</style>', helmet, re.S).group(1).strip()
tpl = src[src.index('</helmet>') + len('</helmet>'):src.index('</x-dc>')].strip()
# the app fills the whole screen instead of the fixed 390x844 design frame
tpl = tpl.replace('<div style="width:390px;height:844px;box-sizing:border-box;', '<div style="width:100%;height:100%;box-sizing:border-box;', 1)
script = re.search(r'<script type="text/x-dc"[^>]*>(.*?)\n</script>', src, re.S).group(1)

old = "open = true; /* TEMP: all unlocked for preview */"
if old not in script:
    raise SystemExit("The unlock line in design/Main.dc.html changed; update tools/build.py")
script = script.replace(old, "open = UNLOCK_ALL || k === 0 || !!s.learned[arr[k - 1]];")

write('style.css', read('tools/base-head.css') + css + read('tools/base-tail.css'))
write('index.html', read('tools/page-head.html') + tpl + read('tools/page-tail.html'))
write('app.js', read('tools/runtime.js') + script.lstrip("\n") + "\n\n" + read('tools/boot.js'))
print('built index.html, app.js, style.css')

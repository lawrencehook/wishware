"""Retire sandbox music pages: move their note data to music/pieces/, delete the pages, and
fix the sandbox listings and neighbour links.
Usage (from the repo root): python migrate.py <composer id> <folder>[=movement for the notable link] ..."""
import glob, os, re, subprocess, sys
cid = sys.argv[1]
notable = {a.split('=')[0]: int(a.split('=')[1]) if '=' in a else 0 for a in sys.argv[2:]}
removed = list(notable)
pages = {d: open('sandbox/%s/index.html' % d, encoding='utf-8').read() for d in removed}
link = re.compile(r'<a href="\.\./([^/"]+)/index\.html">((← Previous|Next →) · [^<]*)</a>')
def resolve(target, direction):
    seen = set(); text = None
    while target in pages and target not in seen:
        seen.add(target)
        nav = re.search(r'<nav aria-label="Music collection">(.*?)</nav>', pages[target], re.S)
        nxt = [m for m in link.finditer(nav.group(1)) if m.group(3) == direction] if nav else []
        if not nxt: return None
        target, text = nxt[0].group(1), nxt[0].group(2)
    return (target, text) if target not in pages else None
# gallery
p = 'sandbox/index.html'; s = open(p, encoding='utf-8').read()
lines = s.split('\n')
keep = [l for l in lines if not any('<a href="%s/index.html"' % d in l and l.lstrip().startswith('<li ') for d in removed)]
dropped = len(lines) - len(keep)
s = '\n'.join(keep)
count = int(re.search(r'(\d+) experiments</output>', s).group(1))
s = s.replace('%d experiments</output>' % count, '%d experiments</output>' % (count - dropped))
open(p, 'w', encoding='utf-8').write(s)
order = re.findall(r'<li [^>]*><a href="([^/"]+)/index\.html">([^<]*)</a>', s)
idx = {d: i for i, (d, _) in enumerate(order)}
for f in glob.glob('sandbox/*/index.html'):
    d = os.path.basename(os.path.dirname(f))
    if d in pages: continue
    s = open(f, encoding='utf-8').read(); out = s
    if any('../%s/index.html' % r in s for r in removed):
        nav = re.search(r'<nav aria-label="Music collection">(.*?)</nav>', s, re.S)
        if nav:
            for m in link.finditer(nav.group(1)):
                if m.group(1) in pages:
                    r = resolve(m.group(1), m.group(3))
                    out = out.replace(m.group(0), '<a href="../%s/index.html">%s</a>' % r if r else '')
        if re.search(r'<nav aria-label="Experiment sequence">', out) and d in idx:
            i = idx[d]; parts = []
            if i: parts.append('<a href="../%s/index.html">← Previous · %s</a>' % order[i - 1])
            if i + 1 < len(order): parts.append('<a href="../%s/index.html">Next · %s →</a>' % order[i + 1])
            out = re.sub(r'(<nav aria-label="Experiment sequence">).*?(</nav>)', lambda m: m.group(1) + ' '.join(parts) + m.group(2), out, flags=re.S)
        if out != s: open(f, 'w', encoding='utf-8').write(out)
# music index
p = 'sandbox/music-pieces.html'; s = open(p, encoding='utf-8').read()
listed = 0
for d, m in notable.items():
    s, n = re.subn(r'\n        <li>\s*<a href="%s/index\.html">.*?</li>' % re.escape(d), '', s, flags=re.S); listed += n
    s = s.replace('href="%s/index.html"' % d, 'href="../music/piece.html?c=%s&amp;p=%s&amp;m=%d"' % (cid, d, m))
open(p, 'w', encoding='utf-8').write(s)
for d in removed:
    os.makedirs('music/pieces/' + d, exist_ok=True)
    for name in ('notes.js', 'measures.js'):
        if os.path.exists('sandbox/%s/%s' % (d, name)):
            subprocess.run(['git', 'mv', 'sandbox/%s/%s' % (d, name), 'music/pieces/%s/%s' % (d, name)], check=True)
    subprocess.run(['git', 'rm', '-rqf', 'sandbox/' + d], check=True)
left = subprocess.run('grep -rlE "(%s)/index.html" sandbox' % '|'.join(map(re.escape, removed)), shell=True, capture_output=True, text=True).stdout.split()
print('gallery -%d, music list -%d, stale links left in: %s' % (dropped, listed, left))

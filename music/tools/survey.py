"""Compact summary of sandbox music folders: movements, recordings, sources."""
import re, sys, html, json, subprocess, os
def clean(t): return ' '.join(html.unescape(re.sub('<[^>]+>', '', t)).split())
def info(d):
    s = open('sandbox/%s/index.html' % d, encoding='utf-8').read()
    js = ('const fs=require("fs");const d=process.argv[1]+"/";const m=fs.existsSync(d+"measures.js")?fs.readFileSync(d+"measures.js","utf8"):"";'
          'const score=new Function(fs.readFileSync(d+"notes.js","utf8")+";"+m+";return score")();'
          'console.log(JSON.stringify(score.movements.map(p=>[p.name,Math.round(Math.max(...p.notes.map(n=>n[0]+n[2]))),!!p.notation,[...new Set(p.notes.map(n=>n[3]))].length])))')
    mv = json.loads(subprocess.run(['node', '-e', js, 'sandbox/' + d], capture_output=True, text=True, check=True).stdout) if os.path.exists('sandbox/%s/notes.js' % d) else []
    videos = [(m.group(1), clean(m.group(3))) for m in re.finditer(r'data-video="([^"]+)"\s+data-title="([^"]+)"\s*>\s*<p>(.*?)</p>', s, re.S)]
    pdfs = [(clean(l).removesuffix(' · PDF'), u) for u, l in re.findall(r'<a\s+href="([^"]+\.pdf)"\s*>(.*?)</a>', s, re.S)]
    i = s.find('<summary>Sources and editions')
    foot = s[i:s.index('</details>', i)] if i >= 0 else ''
    src = [(clean(m.group(1)), re.findall(r'href="([^"]+)"', m.group(1))) for m in re.finditer(r'<p>(.*?)</p>', foot, re.S)]
    inst = re.search(r'data-instrument="([^"]+)"', s)
    h1 = clean(re.search(r'<h1>(.*?)</h1>', s, re.S).group(1))
    return dict(folder=d, h1=h1, instrument=inst.group(1) if inst else None, movements=mv, videos=videos, pdfs=pdfs, sources=src)
if __name__ == '__main__':
    for d in sys.argv[1:]:
        x = info(d)
        print('==', d, '|', x['h1'], '|', x['instrument'], '| pdfs', len(x['pdfs']))
        print('  M', '; '.join('%d %s %d:%02d%s' % (i, n, t // 60, t % 60, '' if has else ' (no measures)') for i, (n, t, has, hands) in enumerate(x['movements'])))
        for v in x['videos']: print('  V', v[0], v[1][:90])
        for t, links in x['sources']:
            if t.startswith('Instrument samples'): continue
            print('  S', t[:110], '|', len(links), 'links', links[0][-60:] if links else '')

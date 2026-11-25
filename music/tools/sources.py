"""Write music/catalog/sources/<id>.json from the credits and recordings on sandbox pages.
Usage (from the repo root): python sources.py <composer id> <folder> [<folder> ...]"""
import json, re, sys
from survey import info
SKIP = ('Instrument samples', 'Complete source recording')
def credit(text):
    text = re.sub(r'( · \d+( , \d+)*)?\s*$', '', text)
    text = re.sub(r' · Edition$', '', text)
    for drop in (' Adapted score data retain the same license.', ' (adapted data under the same terms).', 'Score events adapted from the ', 'Score adapted from ', 'Adapted from the '):
        text = text.replace(drop, '')
    return re.sub(r' https?://\S+', '', text).strip(' ·.')
out, cid = {}, sys.argv[1]
for d in sys.argv[2:]:
    x = info(d); n = len(x['movements']); src = x['sources']
    lines = [(t, l) for t, l in src[1:] if not t.startswith(SKIP) and 'MAESTRO' not in t and 'Piano-e-Competition' not in t] or src[:1]
    home = src[0][1][0] if src and src[0][1] else None
    pdfs = dict(x['pdfs'])
    if n == 1 and len(pdfs) == 1: pdfs = {x['movements'][0][0]: next(iter(pdfs.values()))}
    scores, warn = [], []
    for i, (name, *_) in enumerate(x['movements']):
        pdf = pdfs.get(name)
        line = None
        if pdf:
            stem = pdf.rsplit('/', 2)[-2]
            line = next(((t, l) for t, l in lines if any('/' + stem + '/' in u for u in l)), None)
        if not line:
            line = lines[i] if len(lines) == n and n > 1 else lines[0]
            if len(lines) > 1 and len(lines) != n: warn.append('movement %d: guessed credit line' % i)
        link = home
        if pdf and 'mutopiaproject.org/ftp/' in pdf:
            link = 'https://github.com/MutopiaProject/MutopiaProject/tree/master/ftp/' + pdf.split('/ftp/')[1].rsplit('/', 1)[0]
        scores.append([credit(line[0]), '', link or line[1][0]] + ([pdf] if pdf else []))
    recs = []
    for vid, text in x['videos']:
        parts = text.split(' · ')
        recs.append([vid, parts[-2] if len(parts) >= 3 else parts[-1], ' · '.join(parts[:-2])])
    if len(recs) == n: recording = [r[:2] for r in recs]
    elif recs: recording = [recs[0][:2] + ([recs[0][2]] if n > 1 else [])] * n; 
    else: recording = None; warn.append('NO RECORDING')
    if recs and len(recs) not in (1, n): warn.append('%d videos for %d movements: used the first' % (len(recs), n))
    same = lambda rows: all(r == rows[0] for r in rows)
    out[d] = {'score': scores[0] if same(scores) else scores}
    if recording: out[d]['recording'] = recording[0] if same(recording) else recording
    print(d, '| credit:', '; '.join(sorted({s[0] for s in scores}))[:150], '| pdfs', sum(len(s) > 3 for s in scores), '/', n, '|', '; '.join(warn))
path = 'music/catalog/sources/%s.json' % cid
json.dump(out, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

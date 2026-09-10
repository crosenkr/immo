# Erzeugt referenzband_koeln_2026.js (REF_IRW, REF_GMB) aus dem Belegschrank.
# Quellen: quellen/referenz/stadtteil_zonen.yaml, irw_koeln_2026_zonen.json, gmb2026_etw_stadtteile.json, gmb2026_haus_stadtteile.json.
import json, yaml, pathlib, statistics
r = pathlib.Path(__file__).parent.parent / 'quellen' / 'referenz'
def rows(name):
    d = json.load(open(r / name, encoding='utf-8'))
    return [dict(zip(d['spalten'], z)) for z in d['zeilen']]
sz = yaml.safe_load(open(r / 'stadtteil_zonen.yaml', encoding='utf-8'))['stadtteile']
zonen = {z['NAME_IRW']: z for z in json.load(open(r / 'irw_koeln_2026_zonen.json', encoding='utf-8'))['zonen']}
ref = {}
for st, e in sz.items():
    x = {}
    for k in ('etw', 'haus'):
        if k in e:
            x[k] = {'z': [[z['imrw'], z['name'], int(zonen[z['name']]['WHNFL'] or 0), int(zonen[z['name']]['FLAE'] or 0)] for z in e[k]['zonen']]}
    ref[st] = x
# IS24 schreibt die Innenstadt-Stadtteile mit Bindestrich, der Marktbericht mit Schraegstrich
NAME = {'Altstadt/Nord':'Altstadt-Nord','Altstadt/Süd':'Altstadt-Süd','Neustadt/Nord':'Neustadt-Nord','Neustadt/Süd':'Neustadt-Süd'}
gmb = {}
for row in rows('gmb2026_etw_stadtteile.json'):
    if row['verkaufsart'] == 'Weiterverkauf' and row['baujahrklasse'] is None and row.get('eur_je_qm_mittel'):
        gmb.setdefault(NAME.get(row['stadtteil'], row['stadtteil']), {})['etw'] = [row['eur_je_qm_mittel'], row['eur_je_qm_min'], row['eur_je_qm_max'], row['anzahl']]
for row in rows('gmb2026_haus_stadtteile.json'):
    if row.get('eur_je_qm_mittel'):
        gmb.setdefault(NAME.get(row['stadtteil'], row['stadtteil']), {}).setdefault('haus', {})[row['gebaeudeart']] = [row['eur_je_qm_mittel'], row['eur_je_qm_min'], row['eur_je_qm_max'], row['anzahl']]
js = "// GENERIERT aus quellen/referenz/ (stadtteil_zonen.yaml, irw_koeln_2026_zonen.json, gmb2026_*_stadtteile.json) am 2026-09-10. Nicht von Hand aendern.\n"
js += "const REF_IRW = " + json.dumps(ref, ensure_ascii=False, separators=(',', ':')) + ";\n"
js += "const REF_GMB = " + json.dumps(gmb, ensure_ascii=False, separators=(',', ':')) + ";\n"
(pathlib.Path(__file__).parent / 'referenzband_koeln_2026.js').write_text(js, encoding='utf-8')
print('ok', len(js))

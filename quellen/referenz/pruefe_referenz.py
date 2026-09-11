# Plausibilitaetspruefung des Referenzbands: Immobilienrichtwert je Stadtteil gegen die Kaufpreise des Marktberichts.
# Erwartung Eigentumswohnungen: Verhaeltnis um 0,95 (der Richtwert gilt fuer ein Normobjekt im Weiterverkauf,
# der Mittelwert des Marktberichts enthaelt auch bessere Objekte). Erwartung Haeuser: um 1,0, mit groesserer Streuung,
# weil das Normgrundstueck der Zone von der Groesse der tatsaechlich verkauften Grundstuecke abweicht.
# Ein Ausreisser zeigt meist eine falsche Zuordnung von Zone zu Stadtteil.
import json, statistics, yaml, pathlib
p = pathlib.Path(__file__).parent
GRENZE = {'etw': (0.72, 1.15), 'haus': (0.70, 1.30)}
MIN_N = 5
sz = yaml.safe_load(open(p / 'stadtteil_zonen.yaml', encoding='utf-8'))['stadtteile']
def rows(n):
    d = json.load(open(p / n, encoding='utf-8')); return [dict(zip(d['spalten'], z)) for z in d['zeilen']]
NAME = {'Altstadt/Nord': 'Altstadt-Nord', 'Altstadt/Süd': 'Altstadt-Süd', 'Neustadt/Nord': 'Neustadt-Nord', 'Neustadt/Süd': 'Neustadt-Süd'}
gmb = {'etw': {}, 'haus': {}}
for x in rows('gmb2026_etw_stadtteile.json'):
    if x['verkaufsart'] == 'Weiterverkauf' and x['baujahrklasse'] is None and x['eur_je_qm_mittel']:
        gmb['etw'][NAME.get(x['stadtteil'], x['stadtteil'])] = (x['eur_je_qm_mittel'], x['anzahl'])
h = {}
for x in rows('gmb2026_haus_stadtteile.json'):
    if x['eur_je_qm_mittel']: h.setdefault(x['stadtteil'], []).append((x['eur_je_qm_mittel'], x['anzahl']))
for st, v in h.items():
    n = sum(a for _, a in v); gmb['haus'][st] = (sum(w * a for w, a in v) / n, n)
befunde = []
for k in ('etw', 'haus'):
    paare = []
    for st, e in sz.items():
        if k not in e or st not in gmb[k]: continue
        irw = e[k]['median']; g, n = gmb[k][st]
        paare.append((irw / g, st, irw, g, n))
        lo, hi = GRENZE[k]
        if n >= MIN_N and not (lo <= irw / g <= hi):
            befunde.append(f"{k} {st}: Richtwert {irw:.0f}, Marktbericht {g:.0f} aus {n} Kauffaellen, Verhaeltnis {irw/g:.2f}")
    q = sorted(x[0] for x in paare)
    print(f"{k}: {len(paare)} Stadtteile, Median {statistics.median(q):.2f}, Spanne {q[0]:.2f} bis {q[-1]:.2f}")
print('Befunde:', len(befunde))
for b in befunde: print(' -', b)

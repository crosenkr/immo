# Erzeugt stadtteil_zonen.yaml: Zuordnung Koelner Stadtteil -> Immobilienrichtwertzonen.
# Quelle: irw_koeln_2026_zonen.json (Beleg irw_nrw_2026). Die Zuordnung laeuft ueber den Zonennamen.
# Zonennamen tragen oft einen Zusatz (Nord, Sued, Ost, West, Alt, Neu, I bis IIII) oder nennen mehrere Stadtteile.
# MANUELL enthaelt jede Zone, deren Name nicht direkt auf den Stadtteil fuehrt.
# Geprueft am 11.09.2026 gegen die Kaufpreise des Marktberichts (pruefe_referenz.py).
import json, re, statistics, yaml, pathlib
p = pathlib.Path(__file__).parent
QUAL = r"\b(Nord|Süd|Ost|West|I{1,4}|Alt|Neu|Vorgebirgspark|Justiz Viertel|Kanalstraße|Lukasstraße|Niederländer Viertel|Rennbahn-Viertel)\b"
MANUELL = {
 'Agnes-Viertel Ost': ['Neustadt-Nord'], 'Belgisches Viertel': ['Neustadt-Nord'], 'Gerichtsviertel': ['Neustadt-Nord'],
 'Südstadt': ['Neustadt-Süd'], 'Rathenau-Viertel': ['Neustadt-Süd'], 'Volksgarten-Viertel': ['Neustadt-Süd'],
 'Severins-Viertel': ['Altstadt-Süd'], 'Rheinauhafen': ['Altstadt-Süd'], 'Altstadt Süd': ['Altstadt-Süd'],
 'Eigelstein': ['Altstadt-Nord'], 'Altstadt Nord': ['Altstadt-Nord'],
 'Humboldt/Gremberg': ['Humboldt/Gremberg'], 'Höhenberg/Vingst': ['Höhenberg', 'Vingst'],
 'Mauenheim/Rennbahn-Viertel': ['Mauenheim', 'Weidenpesch'],
 'Eil/Porz Ost/Urbach': ['Eil', 'Porz', 'Urbach'], 'Porz/Zündorf Nord': ['Porz', 'Zündorf'],
 'Wahn/Wahnheide/Grengel': ['Wahn', 'Wahnheide', 'Grengel'], 'Sürth/Weiß': ['Sürth', 'Weiß'],
 'Westhoven/Ensen': ['Westhoven', 'Ensen'], 'Stüttgerhofsweg': ['Junkersdorf'], 'Nordpark': ['Niehl'],
 'Eil / Finkenberg / Porz / Urbach / Elsdorf': ['Eil', 'Finkenberg', 'Porz', 'Urbach', 'Elsdorf'],
 'Grengel / Wahnheide / Wahn / Lind': ['Grengel', 'Wahnheide', 'Wahn', 'Lind'],
 'Bocklemünd / Mengenich': ['Bocklemünd/Mengenich', 'Bocklemünd', 'Mengenich'],
 'Dellbrück / Holweide': ['Dellbrück', 'Holweide'], 'Höhenhaus / Dünnwald': ['Höhenhaus', 'Dünnwald'],
 'Lindenthal / Braunsfeld Süd': ['Lindenthal', 'Braunsfeld'],
 # Die Zone "Marienburg / Bayenthal Sued" deckt nur den Sueden von Bayenthal ab (Villenlage).
 # Sie galt fuer ganz Bayenthal und lag dann um den Faktor 2,35 ueber den Kaufpreisen des Marktberichts.
 # Seit 11.09.2026 zaehlt sie nur zu Marienburg; Bayenthal nutzt den Rueckfall auf den Marktbericht.
 'Marienburg / Bayenthal Süd': ['Marienburg'],
 'Rath / Heumar': ['Rath/Heumar', 'Rath', 'Heumar'], 'Roggendorf / Thenhoven': ['Roggendorf/Thenhoven'],
 'Volkhoven / Weiler': ['Volkhoven/Weiler'], 'Esch': ['Esch/Auweiler'], 'Auweiler': ['Esch/Auweiler'],
}
zonen = json.load(open(p / 'irw_koeln_2026_zonen.json', encoding='utf-8'))['zonen']
m = {}
for z in zonen:
    n = z['NAME_IRW']
    sts = MANUELL[n] if n in MANUELL else [re.sub(QUAL, '', t).strip() for t in (x.strip() for x in n.split('/'))]
    for st in sts:
        m.setdefault(st, {'1': [], '2': []})[z['TEILMA']].append({'wnum': z['WNUM'], 'name': n, 'imrw': int(z['IMRW'])})
out = {'hinweis': 'Zuordnung Stadtteil -> Immobilienrichtwertzonen ueber den Zonennamen (build_stadtteil_zonen.py, Stand 11.09.2026; '
                  'Plausibilitaet gegen den Marktbericht geprueft mit pruefe_referenz.py). Teilmarkt 1 = Eigentumswohnungen, '
                  '2 = Ein-/Zweifamilienhaeuser. Band = min..max der Zonen, Median = Referenzwert.', 'stadtteile': {}}
for st in sorted(m):
    e = {}
    for t, k in (('1', 'etw'), ('2', 'haus')):
        zs = sorted(m[st][t], key=lambda x: x['imrw'])
        if zs: e[k] = {'zonen': zs, 'band': [zs[0]['imrw'], zs[-1]['imrw']], 'median': statistics.median([x['imrw'] for x in zs])}
    out['stadtteile'][st] = e
yaml.safe_dump(out, open(p / 'stadtteil_zonen.yaml', 'w'), allow_unicode=True, sort_keys=False, width=120)
print('Stadtteile:', len(out['stadtteile']))

# Fuegt referenzband_koeln_2026.js und s3_buchhalter_kern.js zu s3_buchhalter.js zusammen (Inhalt des n8n Code-Knotens).
import json, pathlib
p = pathlib.Path(__file__).parent
code = (p / 'referenzband_koeln_2026.js').read_text(encoding='utf-8') + '\n' + (p / 's3_buchhalter_kern.js').read_text(encoding='utf-8')
(p / 's3_buchhalter.js').write_text(code, encoding='utf-8')
wf = json.load(open(p / 's3-vorstufe.json', encoding='utf-8'))
for n in wf['nodes']:
    if n['name'] == 'Vorbewertung rechnen': n['parameters']['jsCode'] = code; n['name'] = 'Bewertung rechnen'
wf['connections']['Bewertung rechnen'] = wf['connections'].pop('Vorbewertung rechnen')
for k, v in wf['connections'].items():
    for outs in v['main']:
        for c in outs:
            if c['node'] == 'Vorbewertung rechnen': c['node'] = 'Bewertung rechnen'
for n in wf['nodes']:
    if n['type'] == 'n8n-nodes-base.dataTable' and n['name'] == 'Ereignis VORBEWERTET':
        v = n['parameters']['columns']['value']
        v['nutzlast'] = v['nutzlast'].replace("$('Vorbewertung rechnen')", "$('Bewertung rechnen')")
        v['objekt_schluessel'] = '={{ $json.objekt_schluessel }}'      # Eingabe ist die aktualisierte Zeile aus "objekt aktualisieren"
    if n['name'] == 'objekt aktualisieren':
        cols = n['parameters']['columns']
        for k, t in [('referenzpreis_eur','number'),('referenz_qm','number'),('referenz_band','string'),('referenz_quelle','string'),('preisabstand_pct','number'),('zielgebot_eur','number')]:
            if k not in cols['value']:
                cols['value'][k] = '={{ $json.%s }}' % k
                cols['schema'].append({"id":k,"displayName":k,"required":False,"defaultMatch":False,"display":True,"type":t,"readOnly":False,"removed":False})
    if n['name'] == 'Sticky: S3':
        n['parameters']['content'] = ("### S3 Buchhalter v2 (Phase 1b)\n\nLiest objekt mit zustand = neu. Referenzpreis = Wohnflaeche x Immobilienrichtwert\n"
          "(Median der Zonen des Stadtteils, Stichtag 01.01.2026, angepasst um Wohnflaeche und bei Haus\nGrundstueck). Deckel (R4) am Referenzpreis: ausgeschlossen_referenzpreis, verhandlungsfall\n"
          "(mit Zielgebot), unter_deckel. Ohne Zone: Kaufpreisspanne aus dem Marktbericht (Spur 2),\nohne beides: Notbehelf am Angebotspreis. Preisabstand liefert 26 bzw. 20 Punkte Gewicht.\n\n"
          "Neue Spalten in objekt: referenzpreis_eur, referenz_qm, preisabstand_pct, zielgebot_eur (number);\nreferenz_band, referenz_quelle (string).\nBelege: irw_nrw_2026, gmb_koeln_2026 (quellen/manifest.yaml).")
        n['parameters']['height'] = 340
wf['name'] = 'Immo S3 Buchhalter (Phase 1b, v2 Referenzpreis)'
json.dump(wf, open(p / 's3-buchhalter.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok', len(code))

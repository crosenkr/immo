# n8n-Bausteine

## S1 Sammler: IS24-Mails einsammeln und parsen (Phase 1a)

Knotenkette, wie beim Paket-Workflow v4:

1. **Schedule Trigger** alle 15 Minuten (`*/15 * * * *`, Zeitzone Europe/Berlin).
2. **IMAP** (`n8n-nodes-imap`, imapflow): Postfach immo@rosenkranz.cologne, Ordner INBOX, Filter ungelesen, Absender `@immobilienscout24.de`. Text Content und HTML Content als Bestandteile anhaken, sonst kommt kein Mailtext an.
3. **Felder angleichen** (Set): uid, envelope.subject -> subject, envelope.from -> from, envelope.to -> to, envelope.date -> date, textContent, htmlContent.
4. **IS24-Mail parsen** (Code, Run Once for Each Item): Inhalt von `s1_parser_is24.js`. Ein Item je Anzeige. Erkennt Quelle am Plus-Tag der Empfaengeradresse, Suchauftrag am Text, Mailart (bestaetigung, benachrichtigung).
5. **Crypto** (SHA-256 ueber titel+kaufpreis+wohnflaeche+adresse) -> `roh_block_sha256`, fuer den Aenderungsvergleich (PREIS_RUNTER, PREIS_RAUF).
6. **Data Table `objekt`** Upsert mit Schluessel `objekt_schluessel`; neu -> Ereignis `NEU`, bekannt mit anderem Hash -> Ereignis je Feldaenderung; unveraendert -> nichts. Ereignisse in Data Table `ereignis` (R14).
7. **IMAP**: Mail als gelesen markieren und nach `Immo/Archiv` verschieben, erst nach erfolgreichem Schreiben (Posteingang als Warteschlange). Bei `stoerung` im Item: Mail nach `Immo/DLQ`, Meldung an S5.

Test ohne n8n: `node n8n/test_s1_parser.js` (synthetischer Testfall, kein echter Portaltext im Repository).

Geprueft am 10.09.2026 gegen die Bestaetigungsmail des Suchauftrags "A Anlage" (30 Anzeigen): 30 von 30 erkannt, alle Felder Kaufpreis, Wohnflaeche, Zimmer, Stadtteil gefuellt; 2 Anzeigen ohne Hausnummer, 1 ohne Strasse (korrekt als "fehlt in der Anzeige"). Das Format der Echtzeit-Benachrichtigung ist noch nicht geprueft; der Parser haengt an den Feldzeilen, nicht am Rahmen.

## Import von `s1-sammler-is24.json` (Phase 1a, Stand 10.09.2026)

Der Export ist aus dem Muster des E-Mail-Sammlers (`sammler-privat.json` in ki-umgebung) gebaut: Schedule, IMAP (`n8n-nodes-imap`), Remove Duplicates, Code, Data Table. Vor dem Import zwei Data Tables anlegen, danach im Workflow zwei Dinge auswaehlen (Zugangsdaten und Tabellen). Der Workflow ist inaktiv exportiert.

Data Table `objekt` (Spalten): objekt_schluessel, quelle, expose_id, suchauftrag, saved_search_id, titel, strasse, hausnummer, stadtteil, ort (string); kaufpreis_eur, wohnflaeche_qm, zimmer, grundstueck_qm, preis_je_qm, provision_kaeufer_pct (number); merkmale, belege, belegklasse, link, mailart, mail_uid, mail_datum, roh_block_hash, parser_version, erfasst_am, zustand (string).

Data Table `ereignis` (Spalten): objekt_schluessel, typ, zeit, lauf_id, quelle, nutzlast (alle string).

Was in Phase 1a bewusst fehlt: Archiv-Verschiebung der Mail (Posteingang bleibt Warteschlange, Dedup ueber messageId und objekt_schluessel), Aenderungserkennung PREIS_RUNTER/PREIS_RAUF (Phase 2, ueber roh_block_hash), Schwaerzung S2 (naechster Baustein, vor dem ersten Modellaufruf).

Abnahme A1.1-Teil: Nach dem ersten Lauf stehen in `objekt` so viele Zeilen wie Anzeigen in den Mails der letzten zwei Tage (Bestaetigungsmail: 30), in `ereignis` je Zeile ein NEU; der zweite Lauf fuegt nichts hinzu (Idempotenz).

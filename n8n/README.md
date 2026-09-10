# n8n-Bausteine

## S1 Sammler: IS24-Mails einsammeln und parsen (Phase 1a)

Knotenkette, wie beim Paket-Workflow v4:

1. **Schedule Trigger** alle 15 Minuten (`*/15 * * * *`, Zeitzone Europe/Berlin).
2. **IMAP** (`n8n-nodes-imap`, imapflow): Postfach immo@rosenkranz.cologne, Ordner INBOX, Filter ungelesen, Absender `@immobilienscout24.de`. Text Content und HTML Content als Bestandteile anhaken, sonst kommt kein Mailtext an.
3. **Felder angleichen** (Set): uid, envelope.subject -> subject, envelope.from -> from, envelope.to -> to, envelope.date -> date, textContent, htmlContent.
4. **IS24-Mail parsen** (Code, Run Once for All Items): Inhalt von `s1_parser_is24.js`. Ein Item je Anzeige. Erkennt Quelle am Plus-Tag der Empfaengeradresse, Suchauftrag am Text, Mailart (bestaetigung, benachrichtigung).
5. **Crypto** (SHA-256 ueber titel+kaufpreis+wohnflaeche+adresse) -> `roh_block_sha256`, fuer den Aenderungsvergleich (PREIS_RUNTER, PREIS_RAUF).
6. **Data Table `objekt`** Upsert mit Schluessel `objekt_schluessel`; neu -> Ereignis `NEU`, bekannt mit anderem Hash -> Ereignis je Feldaenderung; unveraendert -> nichts. Ereignisse in Data Table `ereignis` (R14).
7. **IMAP**: Mail als gelesen markieren und nach `Immo/Archiv` verschieben, erst nach erfolgreichem Schreiben (Posteingang als Warteschlange). Bei `stoerung` im Item: Mail nach `Immo/DLQ`, Meldung an S5.

Test ohne n8n: `node n8n/test_s1_parser.js` (synthetischer Testfall, kein echter Portaltext im Repository).

Geprueft am 10.09.2026 gegen die Bestaetigungsmail des Suchauftrags "A Anlage" (30 Anzeigen): 30 von 30 erkannt, alle Felder Kaufpreis, Wohnflaeche, Zimmer, Stadtteil gefuellt; 2 Anzeigen ohne Hausnummer, 1 ohne Strasse (korrekt als "fehlt in der Anzeige"). Das Format der Echtzeit-Benachrichtigung ist noch nicht geprueft; der Parser haengt an den Feldzeilen, nicht am Rahmen.

## Import von `s1-sammler-is24.json` (Phase 1a, Stand 10.09.2026)

Der Export ist aus dem Muster des E-Mail-Sammlers (`sammler-privat.json` in ki-umgebung) gebaut: Schedule, IMAP (`n8n-nodes-imap`), Remove Duplicates, Code, Data Table. Vor dem Import zwei Data Tables anlegen, danach im Workflow zwei Dinge auswaehlen (Zugangsdaten und Tabellen). Der Workflow ist inaktiv exportiert.

Data Table `objekt` (Spalten): objekt_schluessel, quelle, expose_id, suchauftrag, saved_search_id, titel, strasse, hausnummer, stadtteil, ort (string); kaufpreis_eur, wohnflaeche_qm, zimmer, grundstueck_qm, preis_je_qm, provision_kaeufer_pct (number); merkmale, belege, belegklasse, link, mailart, mail_uid, mail_datum, roh_block_hash, parser_version, erfasst_am, zustand (string).

Data Table `ereignis` (Spalten): objekt_schluessel, typ, zeit, lauf_id, quelle, nutzlast (alle string).

v2 (10.09.2026): Mailabschluss nach dem Muster der Paketverfolgung v4. IMAP holt nur ungelesene Mails; nach dem Schreiben werden die UIDs aus "Felder angleichen" als gelesen markiert und nach Immo/Archiv verschoben, Stoerungsmails nach Immo/DLQ. Der Knoten "Nur neue Mails" entfaellt, die Ungelesen-Markierung ist die Warteschlange; "Nur neue Objekte" bleibt als zweiter Schutz. Zielordner im Knoten aus der Liste waehlen, falls der Server sie anders schreibt.

Was in Phase 1a bewusst fehlt: Aenderungserkennung PREIS_RUNTER/PREIS_RAUF (Phase 2, ueber roh_block_hash), Schwaerzung S2 (naechster Baustein, vor dem ersten Modellaufruf).

Abnahme A1.1-Teil: Nach dem ersten Lauf stehen in `objekt` so viele Zeilen wie Anzeigen in den Mails der letzten zwei Tage (Bestaetigungsmail: 30), in `ereignis` je Zeile ein NEU; der zweite Lauf fuegt nichts hinzu (Idempotenz).

## Stand 10.09.2026

s1-sammler-is24.json ist v3.1. Dedupe geschieht in zwei Stufen: "Dublette im Lauf" (Remove Duplicates auf objekt_schluessel im aktuellen Input) und "Nur neue Objekte" (Data Table, If Row Does Not Exist auf objekt_schluessel). Grund: die Tabellenpruefung sieht alle Items eines Laufs vor dem ersten Insert. Test: 10 Mails, 96 Anzeigen, 90 eindeutige Objekte, 90 Zeilen in objekt und ereignis.

s4-digest-telegram.json ist der minimale Zusteller: taeglich 7:00 Europe/Berlin, neue Objekte der letzten 24 h je Suchauftrag, HTML-Nachricht an Chat-ID 884133793, geteilt unter 4096 Zeichen, Ereignis DIGEST je Lauf. Credential "Telegram Immo Digest" am Knoten "Telegram senden" waehlen.

werkzeug-tabellen-leeren.json loescht alle Zeilen in objekt und ereignis. Nur von Hand starten, nie aktivieren.

## S3 Vorstufe und S4 v2 (10.09.2026, abgenommen)

s3-vorstufe.json ist der Buchhalter in der Vorstufe. Er liest objekt mit zustand = neu und rechnet aus den Anzeigenfeldern: Gesamtaufwand (Kaufpreis plus 8,5 Prozent Nebenkosten plus Courtage, Rueckfall 3,57 Prozent), Deckelstatus am Angebotspreis als Notbehelf nach R4 (unter_deckel, ueber_deckel_angebotspreis, kein_preis), Lagestufe (kernlage, im_radius), Punkte fuer Zimmer, bei Profil B auch Wohnflaeche und Grundstueck. Der Vorscore ist das gewichtete Mittel nur ueber belegte Kriterien. Die Belegdichte ist der Anteil der belegten Gewichte (A 0,14; B 0,30 bis 0,40). Der Code liegt in s3_vorstufe.js. Neue Spalten in objekt: profil, deckel_status, lage_stufe, bewertung_json, bewertet_am (string); gesamtaufwand_eur, vorscore, belegdichte (number). Test: 90 Zeilen gelesen, 90 aktualisiert, 90 Ereignisse VORBEWERTET.

s4-digest-telegram.json v2 sortiert je Profil nach Vorscore und zeigt Belegdichte, Lagestufe, Deckelstatus und Gesamtaufwand. Kopfzeile nennt die Anzahl ohne Vorbewertung.

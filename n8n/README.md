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

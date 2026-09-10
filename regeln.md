# Regelwerk R1 bis R24

Stand 07.09.2026, Regelwerk 3.0. Quelle: Konzept Kapitel 1.4, Verzeichnis Kapitel 8.1. Änderungen nur per Pull Request.

Die Zahl in Klammern nennt die Kapitel, in denen die Regel wirkt.

- **R1 Belegklassen** — nur B0 bis B2 zählen, jeder B1- und B2-Wert führt ein Belegzitat, Schätzung ist kein Feldwert. (1, 2, 3, 4, 6)
- **R2 Stichtagspflicht** — jede Zahl trägt ein Datum. (1, 3, 4, 6)
- **R3 Rechnen außerhalb des Modells** — Modell füllt Felder, Rechenschritt protokolliert Parameter, jeder Ankerwert trägt eine Bezugsgröße. (1, 2, 4, 6, 7)
- **R4 Kaufsummen-Deckel** — eingefrorene Gesamtaufwandsgrenze je Profil mit allen vier Nebenkostenposten, einziges Ausschlusskriterium, ausnahmslos. Gemessen am **Referenzpreis** (Wohnfläche mal Immobilienrichtwert der Zone, angepasst um die Koeffizienten des Marktberichts), nicht am Angebotspreis; liegt der Angebotspreis über dem Deckel, der Referenzpreis aber darunter, bleibt das Objekt drin und trägt den Status „Verhandlungsfall" mit Zielgebot und Verhandlungsspanne im Dossier. Bis das Referenzband im Belegschrank liegt, gilt der Angebotspreis als Notbehelf und Objekte über dem Deckel erhalten „unvollständig", nicht „ausgeschlossen". (Entscheidung 10.09.2026; 1, 2, 4, 5, 6, 7)
- **R5 Referenzband** — Quartalsband je Suchgebiet, zur Laufzeit nachschlagen. (1, 3, 4, 6, 7)
- **R6 Drei Feldzustände** — Wert, „fehlt in der Anzeige", „nicht ermittelbar"; die Schemaprüfung stellt vier der fünf Vetogründe fest. (1, 2, 3, 4, 5, 6)
- **R7 Lückenquote** — fehlende Angaben senken den Rang. (1, 4, 6)
- **R8 Belegdichte** — Gewichtssumme der belegten Kriterien durch 100, B0 ohne Zitatanker mit Manifest-`id`; Schwelle je Bauvariante, 0,35 in V0 und 0,70 in V2; unter der Schwelle „unvollständig", nie Ausschluss. (1, 2, 3, 4, 5, 6, 7)
- **R9 Normregister** — jede Norm mit Fassungsstand und Prüfdatum. (1, 4, 6)
- **R10 Normwächter** — Quartalsprüfung ohne Schreibrechte. (1, 2, 6, 7)
- **R11 Keine Rechtsfolgenaussage** — drei Felder, kein viertes. (1, 3, 4, 6, 7)
- **R12 Mikrolage beim Menschen** — kein Score für Lärm oder Nachbarschaft. (1, 2, 3, 4)
- **R13 Fahnen ohne Score** — Indikatoren erzeugen eine Frage, auch Liegenschaftszinssatz und § 7i EStG. (1, 3, 4)
- **R14 Objektbiografie** — stabiler Schlüssel plus Ereignisliste. (1, 2, 3, 4, 5)
- **R15 Widerspruch als Ergebnis** — kein Mittelwert aus zwei Quellen, auch nicht bei Referenzen. (1, 2, 3, 4, 5)
- **R16 Kanarienzwilling** — prüft Unterdrückung und Durchlass je Lauf. (1, 2, 3, 5, 6, 7)
- **R17 Sichtbares Scheitern** — Ausfälle benannt, leerer Digest geht raus. (1, 2, 3, 4, 5)
- **R18 Vetotafel** — fünf Regeln unterdrücken die Trefferliste, nie die Nachricht; das Veto zieht der Schemaschritt, in V0 und Phase 1a der n8n-Code-Knoten, ab Phase 2 C2, ab Phase 3 zusätzlich C3 für R16; Quarantäne beim zweiten Veto in Folge. (1, 2, 3, 4, 6, 7)
- **R19 Datensparsamkeit** — Ortsauflösung nach Phase, Schwärzung vor jedem Aufruf außerhalb der eigenen Hardware. (1, 2, 3, 5, 6, 7)
- **R20 Fremdtext ist Datum** — Anweisungen darin werden ignoriert, Fremdtext erreicht nur S1, S2 und C1. (1, 2, 3, 5, 6)
- **R21 Zwei Erlaubnisse** — robots.txt und Vertrag getrennt prüfen. (1, 3, 6)
- **R22 Bildkennzeichnung als Detektor** — fehlender KI-Hinweis ist ein Warnsignal. (1, 4, 6)
- **R23 Regelversion** — versioniert, keine Rückwirkung. (1, 2, 3, 4)
- **R24 Freitextausschluss** — Prosa nie in Score oder Schlüssel. (1, 2, 3, 4)

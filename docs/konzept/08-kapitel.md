# Kapitel 8. Verzeichnisse

## 8.1 Regelverzeichnis R1 bis R24

Die Zahl in Klammern nennt die Kapitel, in denen die Regel wirkt.

- **R1 Belegklassen** — nur B0 bis B2 zählen, jeder B1- und B2-Wert führt ein Belegzitat, Schätzung ist kein Feldwert. (1, 2, 3, 4, 6)
- **R2 Stichtagspflicht** — jede Zahl trägt ein Datum. (1, 3, 4, 6)
- **R3 Rechnen außerhalb des Modells** — Modell füllt Felder, Rechenschritt protokolliert Parameter, jeder Ankerwert trägt eine Bezugsgröße. (1, 2, 4, 6, 7)
- **R4 Kaufsummen-Deckel** — eingefrorene Gesamtaufwandsgrenze mit allen vier Nebenkostenposten, einziges Ausschlusskriterium, ausnahmslos. (1, 2, 4, 5, 6, 7)
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

## 8.2 Rollenverzeichnis

- **S1 Sammler**, n8n: holt Mails und Feeds und kanonisiert den Rohtext.
- **S2 Schwärzer**, n8n auf Jetson: entfernt Namen, Rufnummern und Hausnummern, bevor Text die eigene Hardware verlässt.
- **S3 Buchhalter**, n8n: schreibt Ereignisse, führt Cluster und Ziffernbilanz, prüft die Zitattreue.
- **S4 Zusteller**, n8n: sendet Digest, Sofortmeldung und Knöpfe und nimmt die Antworten entgegen.
- **S5 Wächter**, n8n: meldet stumme Kanäle, Rückstand und Eskalationen.
- **C1 Leser**, Cowork: füllt Felder mit Zitat und Belegklasse und stellt die Lückenliste auf.
- **C2 Rechner**, Cowork als Skript: rechnet Score, Belegdichte und Zitatanker, prüft das Schema und zieht darüber das Veto, ohne Modell. In Phase 1a übernimmt derselbe Schritt der n8n-Code-Knoten.
- **C3 Blindprüfer**, Cowork: prüft ohne Erstergebnis und ohne Quelltext gegen und zieht das Veto für den Kanarienzwilling.
- **C4 Aufbereiter**, Cowork: schreibt Digest, Dossiers und Vorratstexte.
- **C5 Pflegelauf**, Cowork, betreut: pflegt Band, Normstand, Kalibrierung, Goldmenge und Archiv.

## 8.3 Testverzeichnis T1 bis T22

Die Zahl in Klammern nennt die Phase, in der der Test abgenommen wird.

T1 falscher Zitatanker entwertet das Feld (1a). T2 Zahl nur im Fließtext bleibt unerklärt (1a). T3 Ausweis da, Effizienzklasse fehlt, also Verstoß (1a). T4 Neubau ohne Ausweis, kein Verstoß (1a). T5 Dublette 87,0 zu 87,4 m² ergibt ein Kurzdossier (1a). T6 Dublette 87 zu 91 m² ergibt zwei Objekte (1a). T7 tote Quelle wird Störung, nicht Nullmeldung (2). T8 versteckte Zeichen entfernt und gezählt (1a). T9 Adresse und Fremdlink blockieren den Versand (1a). T10 Widerspruch im Kaufpreis bleibt „strittig" (3). T11 400 Objekte, 40 verarbeitet (2). T12 nur Feldtabelle übrig, Zahlen auf 0,5 Prozent genau (3). T13 Doppellauf ergibt eine Meldung (1a). T14 Durchlass, sechs saubere Anzeigen auf der Karte (1a). T15 Phantom über dem Deckel erscheint nicht (1a, erneut 2). T16 bekannter Maklername getilgt (1a). T17 unbekannter Name ohne Musterentsprechung getilgt (1a). T18 C3 fängt die Bandabweichung ohne tragende Fundstelle (3). T19 C3 fängt das falsche Hausgeld mit gültiger Fundstelle nicht (3). T20 Dublette an der Fachgrenze, 87,4 zu 87,6 m² und Baujahr 1909 zu 1911, ergibt ein Kurzdossier (1a). T21 Provisionsphantom, Kaufpreis 722.222 Euro fällt bei Deckel 780.000 Euro auf `AB1` (1a, erneut 2). T22 Anzeige ohne Erbbaurechtserwähnung erzeugt keine Erbbaurechtsfrage (1a).

## 8.4 Abnahmeverzeichnis

**Phase 0:** A0.1 Profil-Pull-Request mit grünem Lint, einschließlich `belegdichte_min` je Variante. A0.2 Sortierprobe. A0.3 versiegelte Rangliste. A0.4 Goldkorpus angelegt. A0.5 Taktprobe. A0.6 Schreibprobe. A0.7 Ausfallprobe Postfach. A0.8 Rückbauprobe. A0.9 Variantenentscheid E0 protokolliert und `laufende_variante` gesetzt.

**Phase 1a:** A1.1 Tests T1 bis T6, T13, T14, T20, T22 gegen den Goldkorpus. A1.2 Schwärzungsriegel T8, T9, T16, T17. A1.3 Kanalausfall. A1.4 Belegtests mit dem Veto des n8n-Schemaschritts. A1.5 Erste nutzbare Karte über sieben Tage gegen `belegdichte_min: 0.35`, T15 und T21 grün.

**Phase 1b:** A1.6 Kettenwächter und Filterzwilling. A1.7 Handzählung. A1.8 Ausfallprobe Synology. A1.9 Messphase abgeschlossen. A1.10 Rückbauprobe.

**Phase 2:** A2.1 Rechenbeispiel reproduziert. A2.2 Schubladentest. A2.3 Tests T7, T11, T15, T21. A2.4 Statuscodes im Digest. A2.5 Schattenwoche. A2.6 Aufmerksamkeitsprobe mit `AB5`. A2.7 Ausfallproben Warteschlange und Herzschlag. A2.8 Kostenabnahme gegen 1,24 USD. A2.9 Rückbauprobe. A2.10 Phase-1-Abnahmen bleiben grün.

**Phase 3:** A3.1 Urlaubsprobe über zehn Tage. A3.2 Rückbauprobe mit Löschung des Vorgangsordners.

## 8.5 Alle [ungeprüft]-Stellen

| Kapitel | Was ungeprüft ist |
|---|---|
| 1 | Wiedergabevorbehalt des Kölner Mietspiegels auf den beiden geprüften Seiten nicht gefunden |
| 1 | Stand des Gesetzgebungsverfahrens „Miete II" nach der ersten Lesung am 09.07.2026 |
| 1 | ob die Leitlinien zu Art. 50 KI-VO Immobilienbilder als Beispiel führen |
| 1 | Preise und Schnittstellen von Sprengnetter, Pricehubble und On-geo |
| 1 | Verfügbarkeit amtlicher Richtwerte außerhalb Nordrhein-Westfalens |
| 2 | ob Sub-Agenten-Kontexte in Cowork hart trennen |
| 2 | ob ein monatlicher Takt für geplante Aufgaben einstellbar ist |
| 2 | ob die Synology Webhooks anbietet |
| 2 | ob n8n einen Cowork-Lauf auslösen kann |
| 2 | ob Cowork von außen einen erreichbaren Endpunkt der Synology nutzen kann |
| 2 | wie viel Speicher die bestehenden n8n-Workflows belegen |
| 2 | ob Cowork je Lauf abrechnet |
| 3 | Crawler-Klausel in den Nutzungsbedingungen von Immowelt |
| 3 | ob Kleinanzeigen Suchaufträge anbietet, keine Hilfeseite geprüft |
| 3 | ob Portale eine Unteradresse mit Pluszeichen annehmen |
| 3 | ob die großen Portale Angebots-Feeds anbieten |
| 3 | Bot-Sperre der OParl-Schnittstelle der Stadt Köln |
| 3 | ob die Lärmklasse ohne Kalibrierung einen Pegel abbildet |
| 4 | ob § 38 GrundWertVO NRW den Immobilienrichtwert als Landesnorm definiert |
| 5 | ob Cowork freie Cron-Ausdrücke annimmt und auf welcher Zeitbasis |
| 5 | ob Portalmails Bilder anhängen |
| 5 | ob Cowork nach Listenpreisen oder gegen das Abonnement abrechnet |
| 3 | welche der sieben Parserfelder eine Portalvorlage tatsächlich als eigenes Feld führt, gemessen erst durch A1.7 |
| 5 | Stromverbrauch je Vorschlag in der Variante V0 |
| 6 | Annahme, dass 5 von 40 Objekten eine Digestzeile bekommen |
| 6 | ob das Verhalten unter `promptfoo` dem in Cowork gleicht |
| 6 | Übertragung von BGH I ZR 224/12 auf Immobilienportale, Rechtsauffassung |
| 6 | Anwendbarkeit von § 87b Abs. 1 UrhG auf Portalseiten, Rechtsauffassung |
| 6 | Reichweite der DSGVO-Haushaltsausnahme bei einer Kapitalanlage, Rechtsauffassung |
| 7 | ob der Mailanbieter Plus-Adressierung unterstützt |
| 7 | ob parallele `getUpdates`-Abfragen desselben Telegram-Tokens kollidieren |

Die Zeichengrenze einer Telegram-Nachricht steht nicht mehr in dieser Liste: Sie ist mit „1-4096 characters after entities parsing" belegt (Kapitel 5.5). Ebenso entfällt die Zeile zur Preisbasis für Häuser: Das Feld `TEILMA` führt Ein- und Zweifamilienhäuser (Kapitel 4.3).

## 8.6 Offene Entscheidungen für Christoph

Jede Entscheidung nennt Optionen und Folge. Die Angabe hinter dem Kapitel sagt, wo sie fällt.

- **E0** (Kapitel 2.10, 7, **Sitzung 1, erster Tagesordnungspunkt**) **Bauvariante.** V0 minimal in n8n, V1 minimal in Cowork, V2 voll über drei Laufzeiten. V0 kostet mit Phase 0 zusammen 15,5 bis 25,0 Stunden Aufbau und 1,5 bis 2,5 Stunden im Monat und trägt geschätzt vier Fünftel des Nutzens; es fehlen die Blindprüfung durch ein zweites Modell und der zweite Portalzulauf. V1 kostet ähnlich wenig, verliert aber die Datensparsamkeit nach R19 und hat keinen Prozess zwischen den Sitzungen; es wird nur der Vollständigkeit halber geführt. V2 kostet 26,5 bis 45,0 Stunden und 3,6 bis 5,7 Stunden im Monat und verletzt die Leitplanke gegen Eigenbau. In V0 gilt die Belegdichte-Schwelle 0,35 statt 0,70, weil dort höchstens 0,53 in Profil A und 0,78 in Profil B erreichbar sind (Kapitel 4.4). **Empfehlung:** V0 bauen, nach acht Wochen Betrieb an zwei Messwerten neu entscheiden, nämlich am Anteil der Objekte mit Belegdichte unter 0,53 und an der Zahl der Objekte, deren Bruttorendite mangels Jahreskaltmiete offen bleibt. Die Widerrufsbedingung wird mit der Entscheidung protokolliert (A0.9).
- **E1** (Kapitel 4, 7, Sitzung 1) **Objektarten.** Zwei nahe Arten teilen Band und Parser, zwei ferne verdoppeln beides. Folge: Profil B startet früher oder später.
- **E2** (Kapitel 4, 7, Sitzung 1) **Region und Geofence.** Stadtteilliste oder Umkreis. Umkreise schneiden quer durch Lagen; ab Phase 2 Polygon aus den Zellen des Marktberichts.
- **E3** (Kapitel 4, 7, Sitzung 1) **Kaufsummen-Deckel je Profil, und mit welcher Provisionsannahme.** Der Deckel gilt für den Gesamtaufwand, nicht für den Kaufpreis. Zu entscheiden ist der Rückfallwert für die Käuferprovision: 3,57 Prozent nach der belegten Quelle, 0 Prozent für einen ausdrücklich provisionsfreien Suchauftrag oder ein eigener Wert. Bei 3,57 Prozent sinkt die Kaufpreisgrenze für Profil A von 722.222 auf 695.994 Euro.
- **E4** (Kapitel 4, Sitzung 1) **Schwellen 55 und 35, Belegdichte 0,35 in V0 und 0,70 in V2.** Alle vier Werte stehen in Kapitel 4 und sind gesetzt. Niedriger heißt mehr `NF` statt `UV`, höher heißt mehr Fragen und weniger Vorschläge. Die beiden Belegdichte-Werte hängen an E0, weil sie an der Menge der belegbaren Felder hängen; zu entscheiden ist nur, ob 0,35 gegen das schwächere Profil A oder gegen den Mittelwert beider Profile gesetzt wird. Die Sortierprobe A0.2 liefert den ersten Anhaltspunkt.
- **E5** (Kapitel 5, 7, Sitzung 1) **Kanäle und Frequenz.** Telegram als Hauptkanal, Home Assistant als Kachel, Digest morgens. Stündlich erhöht die Mailmenge, nicht die Trefferzahl.
- **E6** (Kapitel 7, Sitzung 1) **Portal für Phase 1.** Vorschlag ImmoScout24, dessen Menge die Handzählung trägt. Ein kleineres Portal verlängert die Messphase.
- **E7** (Kapitel 3, vor Phase 0) **Postfach.** Eigenes Postfach oder Unterordner im bestehenden. Empfehlung eigenes Postfach, damit Kanalalarme den Alltag nicht stören.
- **E8** (Kapitel 3, 7, vor Phase 0) **Welche Portalkonten mit welcher Adresse.** Hängt an E7 und daran, ob Plus-Adressierung trägt; Rückfall sind Postfächer je Quelle.
- **E9** (Kapitel 2.4, 5, vor Phase 2, entfällt bei V0) **Briefkasten und Ablage.** n8n-Datentabelle, eigenes Betriebsrepository oder der Zweig `betrieb` im Ort der Wahrheit. Vorschlag ist ein eigenes Repository mit 5-Minuten-Abfrage als Rückweg, weil es ohne ungeprüfte Synology-Eigenschaft auskommt und das Commit-Rauschen vom Ort der Wahrheit fernhält.
- **E10** (Kapitel 1, vor Phase 0) **Meldeweg des Normwächters und der Störungsmeldung.** Pull Request, Zeile in `OFFEN.md` oder Telegram. Telegram ist schnell und flüchtig, das Repository langsam und dauerhaft.
- **E11** (Kapitel 3, vor Phase 1b) **Wer klärt Immowelts Vertragslage.** Ohne Klärung bleibt der Kanal gesperrt und Phase 2 hat ein Portal weniger.
- **E12** (Kapitel 3, vor Phase 2) **OParl.** Erst nach Auswertung der robots.txt in Phase 2 einrichten oder ganz lassen. Der Kanal liefert Off-Market-Signale, sein Rechtsstand ist offen.
- **E13** (Kapitel 3, vor Phase 1b) **Welche acht Genossenschaften und Bauträger.** Mehr Verteiler heißt mehr Mail und mehr Parser-Pflege.
- **E14** (Kapitel 5.4, vor Phase 2) **Rückkanal.** Telegram-Knöpfe allein oder zusätzlich eine Artefaktseite für Widerspruch, Dublettenfrage und Objektbiografie. Die Seite ist kein zweiter Zustandsspeicher, sondern eine Anzeigefläche über demselben Rückkanal; Knöpfe sind schneller, die Seite trägt mehr Kontext.
- **E15** (Kapitel 2, vor Phase 2) **Umfang der Sofortmeldung.** Alle Treffer im Band oder nur die über der Meldeschwelle. Mehr Meldungen heißt schnellere Termine und mehr Unterbrechungen.
- **E16** (Kapitel 2, 5, vor Phase 2, entfällt bei V0) **Deckel 40 neue Objekte im Nachtlauf und 15 im Deltalauf.** Höher heißt vollständiger und teurer, niedriger heißt schnellerer Rückstand.
- **E17** (Kapitel 5, vor Phase 1b) **Zeitbasis von Cowork.** Testlauf über sieben Tage (A0.5) oder sofortiger Rückfall auf „daily".
- **E18** (Kapitel 5, vor Phase 2) **Zustellauslöser.** Präsenz aus Home Assistant oder feste Uhrzeit. Präsenz trifft den Moment, die Uhrzeit ist vorhersehbar.
- **E19** (Kapitel 5, vor Phase 2, entfällt bei V0) **Deltalauf werktags.** Halbiert die Fundzeit, kostet 10,78 USD im Monat in Phase 2 und 12,54 USD ab Phase 3 und hebt den Tagesdeckel von 90 auf 125 Aufrufe.
- **E20** (Kapitel 5, vor Phase 2) **Eilkanal.** Zunächst aus und vier Wochen Reaktionszeit messen, oder sofort an. Nur der Eilkanal darf die Nachtruhe durchbrechen.
- **E21** (Kapitel 2, 3, vor Phase 1a) **Rohtext-Haltefrist.** 90 Tage oder kürzer. Kürzer senkt das Risiko, erschwert die Parser-Fehlersuche; die Rechtsgrundlage steht unabhängig davon in `immo/recht.md`.
- **E22** (Kapitel 3, 4, 6, vor Phase 2) **Veraltungsfristen.** Es gelten heute 24 Monate für Immobilien- und Bodenrichtwert, 15 Monate für den Marktbericht, 30 Monate für den Mietspiegel und die Bandalterung 400 und 800 Tage. Zu entscheiden ist, ob diese vier Fristen so bleiben oder auf einen einheitlichen Wert gezogen werden. Einheitlich ist einfacher zu merken, trifft aber den Zweijahresturnus des Mietspiegels nicht.
- **E23** (Kapitel 4, vor Phase 2) **Umrechnungskoeffizienten auf Spur 2 anwenden.** Der Faktor 0,94 für vermietete Objekte dreht Beispiel A von `NF` auf `AB3`. Anwenden heißt strenger und modellhaft, nicht anwenden heißt milder und näher am Bericht.
- **E24** (Kapitel 4, 7, vor Phase 2) **Preisbasis für Profil B.** Die Immobilienrichtwerte für `TEILMA` 2 und 3 stehen bereit; zu entscheiden ist nur, ob zusätzlich die Marktberichtszeile des Rhein-Erft-Kreises übertragen wird. Ohne sie trägt Spur 1 allein, mit ihr entsteht ein zweiter Beleg für den Widerspruchsfall nach R15.
- **E25** (Kapitel 4, vor Phase 2) **F5-Ausnahme bei fehlender Energieangabe.** Obergrenze 55 nach der CBRE-Verteilung oder 40 als nächstniedrigere Stufe. Höher heißt mehr Objekte über der Decke.
- **E26** (Kapitel 6, vor Phase 3) **Fangquoten.** C3 unter 0,8 stilllegen oder nur warnen, Empfehlung stilllegen; ebenso die Schwärzungsquote unter 0,95.
- **E27** (Kapitel 6, vor Phase 2) **Monatsblindprobe.** Zehn Minuten im Monat, ja oder nein. Ohne sie bleibt der übersehene Treffer unmessbar.
- **E28** (Kapitel 6, vor Phase 2) **Belegverfall.** Blockiert eine überfällige Rechtsprüfung den Digest oder erzeugt sie nur eine Kopfzeile. Empfehlung Kopfzeile.
- **E29** (Kapitel 6, vor Phase 3) **Presidio oder Muster.** Presidio kostet ein deutsches NER-Modell und fängt unbekannte Namen; Muster sind billiger und blinder.
- **E30** (Kapitel 7, Sitzung 1) **Sitzung 1 in einem Termin oder zwei.** Getrennt gerät die Sortierprobe besser, kostet einen zweiten Termin. Der Variantenentscheid E0 bleibt in jedem Fall der erste Punkt.
- **E31** (Kapitel 7, vor Phase 2) **Schattenwoche fünf oder zehn Tage.** Zehn geben vierzig Paare, verzögern Phase 2 um eine Woche.
- **E32** (Kapitel 7, vor Phase 2) **Aufmerksamkeitsprobe A2.6.** Tragbar oder störend. Ohne sie fällt unbemerkte Gewöhnung nicht auf.
- **E33** (Kapitel 7, vor Phase 0) **Wer quittiert die Proben.** Vorschlag Christoph, per Datum in `immo/runbook.md`.

## 8.7 Redaktionsentscheidungen

Wo zwei fachliche Sichten auf dasselbe zu verschiedenen Ergebnissen führten, gilt die folgende Festlegung.

1. **Vetoträger:** Das Veto zieht der Schemaschritt, gleich in welcher Laufzeit er liegt, also der n8n-Code-Knoten in V0 und Phase 1a, der Schemaschritt in C2 ab Phase 2 und zusätzlich C3 für den Kanarienzwilling ab Phase 3. Die Bindung an den Schritt statt an eine Rolle war nötig, weil der erste bewertende Lauf in Phase 1a stattfindet und C2 dort nicht existiert; zugleich behält ESK2 in Phase 2 seinen Auslöser.
2. **Eingabe von C3:** Die Einbahnstraße wiegt schwerer als eine unabhängige Zweitextraktion, deshalb sieht C3 nur Feldtabelle, Belegzitate und Fundstellen, und T19 hält die daraus folgende Blindstelle als Test fest.
3. **Renditebasis:** Die Bruttorendite rechnet gegen den Gesamtaufwand, nicht gegen den Kaufpreis; deshalb lauten die eingefrorenen Sollwerte des Beispiels A 37,18 und 56,03 statt der zuvor gerechneten Werte.
4. **Aufmerksamkeitsprobe:** Sie arbeitet mit einem verletzten harten Kriterium und dem Code `AB5`, damit R4 ausnahmslos bleibt und T15, T21 und A2.6 in einem Lauf zugleich bestehen können.
5. **Nebenkostensumme:** Es gelten die vier Einzelposten mit zusammen 12,07 Prozent mit und 8,50 Prozent ohne Käuferprovision, statt einer gerundeten Gesamtangabe.
6. **Normzitat zum Immobilienrichtwert:** § 20 ImmoWertV wird als „Vergleichsfaktoren" zitiert und um § 193 Abs. 5 Satz 2 BauGB sowie §§ 24 ff. ImmoWertV ergänzt; eine Landesnorm als Definition bleibt gekennzeichnet ungeprüft.
7. **Kostenalarm:** Er bezieht sich auf das Anderthalbfache des in A2.8 gemessenen Werts, nicht auf einen festen Eurobetrag, weil die Trefferspanne der Profile jede feste Schwelle sofort reißt.
8. **Artefaktseite:** Sie bleibt als Anzeige- und Antwortfläche in E14 möglich und bleibt als Zustandsspeicher verworfen; beides widerspricht sich nicht.
9. **Briefkasten:** Der Betriebsverkehr geht in ein eigenes Repository mit Abfrage statt in den Ort der Wahrheit mit Webhook, weil das ohne ungeprüfte Geräteeigenschaft auskommt.
10. **Digestumfang:** Zu viele Objekte erzeugen eine zweite Nachricht statt einer stillen Kürzung; die Zeichengrenze von 4096 ist belegt und teilt zusätzlich.
11. **Ertragsseite:** Der Liegenschaftszinssatz kommt als belegte Einordnung ohne Punktwert hinzu, weil er sich auf den Reinertrag bezieht und die Rendite hier auf die Kaltmiete. Die vier Ertragskorrekturen, also nicht umlagefähige Kosten, Erbbauzins, Sonderumlage und Restnutzungsdauer, entstehen erst in Phase 3 aus Unterlagen und werden bis dahin nicht geschätzt, sondern durch die Marke `ertrag_stufe: brutto` und vier Fahnen ohne Eurobetrag gekennzeichnet (Kapitel 4.11).
12. **Gewichtslernen:** Es beginnt erst ab 200 etikettierten Entscheidungen; bis dahin ändern sich nur Schwellen, Profilfelder und die Beschaffung von Belegen.
13. **Regelordnung:** Die Regeln bleiben nach Sachgruppen geordnet, die Gruppen und ihre Nummernbereiche stehen im ersten Absatz von Abschnitt 1.4, und Kapitel 8.1 nennt je Regel ihre Wirkungskapitel.
14. **Belegdichte-Schwelle je Variante:** `belegdichte_min` steht mit 0,35 für V0 und 0,70 für V2 in `basis.yaml`, statt einer einzigen Zahl. Grund ist die Positivliste aus Kapitel 5.7: In V0 sind nur die sieben Parserfelder und der amtliche Wohnlagenwert belegbar, also höchstens 0,53 in Profil A und 0,78 in Profil B. Eine gemeinsame Schwelle hätte in V0 jedes Objekt des Profils A auf `UV` gesetzt und das Abbruchkriterium der Phase 2 am ersten Tag ausgelöst.
15. **Erbbaurecht:** Das Vorfeld steht nicht in `ko`, sondern wirkt allein als Vorbedingung der Restlaufzeitzeile, und Schweigen der Anzeige gilt als `nein`. Die Ausnahme von R6 und F5 bleibt auf einen Schalter ohne Gewicht beschränkt und ist in Kapitel 4.4 mit drei Gründen belegt; die fehlende Angabe bleibt über Liste B der Lückenprüfung sichtbar.
16. **Digestzeile gegen Vorschlag:** Die Annahme aus Kapitel 6.1 zählt Digestzeilen, die Spanne aus Kapitel 5.9 zählt Vorschläge mit dem Code `VS`. Beide Zahlen bleiben stehen, weil jeder Vorschlag eine Digestzeile ist und nicht umgekehrt; die Wochenrückschau prüft die Ordnung der beiden Zählungen als eigene Kennzahl.
17. **Dublettentests in Phase 1a:** Sie bleiben dort, weil der Cluster-Schlüssel keine Portalkennung führt und die Blockbildung deshalb portalunabhängig rechnet. Phase 2 bringt den zweiten Zulauf, nicht das Verfahren.
18. **B0 ohne Zitatanker:** R8 verlangt den Zitatanker nur dort, wo R1 ihn verlangt, also bei B1 und B2. Ein B0-Wert aus einem lizenzierten Datensatz trägt stattdessen die Manifest-`id`; sonst wäre der amtliche Wohnlagenwert unbelegt und die Belegdichte des Beispiels A fiele von 0,72 auf 0,64.

---

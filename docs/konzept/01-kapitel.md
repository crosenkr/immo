# Kapitel 1. Artikelanalyse und Ableitung

Dieses Kapitel leitet aus dem F.A.Z.-Artikel vom 02.09.2026 die verbindlichen Designregeln R1 bis R24 ab. Alle übrigen Kapitel verweisen auf diese Nummern und definieren sie nicht neu.

`immo/regeln.md` führt R1 bis R24 samt Version, geändert nur von Christoph (siehe R23). `immo/normen.md` führt je Norm eine Zeile mit Fassungsstand, geändert nur von Christoph, vorgeschlagen vom Normwächter (siehe R10). `immo/prompts/` führt die Extraktionsvorlagen; sie nennen keine Gesetzesnamen.

## 1.1 Was der Artikel ist und was er nicht ist

Der Artikel prüft ein Objekt, dessen Unterlagen auf dem Tisch liegen. Beim Fund gibt es nur Anzeigentext, Bilder, Preis und ungefähre Lage. Übertragbar ist nicht das Verfahren, sondern die Beweisdisziplin.

Ein Satz trägt die Architektur: „Im Zweifel nennen Modelle eine Zahl, statt eine Lücke einzuräumen." Das ist eine Systemeigenschaft, kein Bedienfehler. Einen erfundenen Wert bemerkt ein Mensch im Gespräch, im Digest um sieben Uhr morgens nicht. Die eingestandene Lücke muss also günstiger sein als die geratene Zahl (R1, R7), und jeder Lauf muss beweisen, dass das gilt (R16). Der zweite tragende Satz, „Zahlen im Fließtext erzeugen Sprachmodelle unzuverlässig", führt zu R3.

Der Zeitdruck des Marktes trifft die Entscheidung, nicht das Finden. Der Verband deutscher Pfandbriefbanken meldete am 10.08.2026 für das zweite Quartal 2026 Eigentumswohnungen mit **plus 2,6 Prozent** zum Vorjahresquartal, Eigenheime mit **plus 2,0 Prozent** und Neuvertragsmieten in Mehrfamilienhäusern mit **plus 3,2 Prozent** ([pfandbrief.de](https://www.pfandbrief.de/uneinheitliche-entwicklung-der-immobilienpreise/)).

## 1.2 Der Normstand als Beweis, dass Regeln altern

Der Artikel nennt „Paragraph 87 des Gebäudeenergiegesetzes". Bundestag und Bundesrat beschlossen am 10.07.2026 das Gebäudemodernisierungsgesetz: Umbenennung desselben Gesetzes, keine Ablösung, in Kraft ab 29.07.2026 ([Chronologie](https://www.gmodg.bund.de/GEGPortal/DE/Home/startseite/GModG_News/GModG_Chronologie.html)). Das amtliche Portal führt die Anzeigenpflicht weiter als **§ 87 GEG** ([Portal](https://www.gmodg.bund.de/GEGPortal/DE/Energieausweise/Immobilienanzeigen/Immobilienanzeigen.html)).

Ein Prompt mit fest verdrahtetem Gesetzesnamen veraltet still. Er wirft keinen Fehler, er prüft weiter gegen die falsche Norm. Daraus folgen R9 und R10.

Unverändert sind die fünf Pflichtangaben bei Wohngebäuden: Ausweisart, Endenergiebedarf oder Endenergieverbrauch, wesentlicher Energieträger der Heizung, Baujahr, Energieeffizienzklasse. Entscheidend ist die vom Artikel verschwiegene Vorbedingung. Das amtliche Portal formuliert sie wörtlich: Die Angaben sind zu machen, „wenn dieser zum Zeitpunkt der Aufgabe der Anzeige vorliegt", gemeint ist der Energieausweis; für Gebäude vor der Fertigstellung greift die Pflicht deshalb nicht ([Portal](https://www.gmodg.bund.de/GEGPortal/DE/Energieausweise/Immobilienanzeigen/Immobilienanzeigen.html)). Sonst meldet die Lückenprüfung jeden Neubau als Verstoß (R7).

## 1.3 Die zehn Prompts, den vier Suchphasen zugeordnet

Phasen: **Finden** (Zulauf, Entdopplung), **Vorprüfen** (ohne Unterlagen), **Vertiefen** (mit Unterlagen), **Kaufen** (Bank, Notar).

| # | Prompt | Phase, Übergang |
|---|---|---|
| 2 | Pflichtangaben, Auslassungen | Vorprüfen. Lückenliste als Rangsignal (R7). |
| 3 | Beschlossene Sanierungen | Indikator im Vorprüfen, voll im Vertiefen (R13). |
| 10 | Inserat, KI-Bilder | Vorprüfen, invers. Detektor statt Schreibhilfe (R22). |
| 1 | Preis gegen Referenzwert | Vorprüfen, gerechnet im Referenzband (R5). |
| 9 | Mieterhöhung, Kappung | Vorprüfen, invers. Ertragssignal als Fahne (R13). |
| 5 | Finanzierung als Tabelle | Einmal je Profil. Kaufsumme statt Rate (R4). |
| 7 | Sanierung, Förderung | Vertiefen, auf Auslöser. Vorlage. |
| 4 | Vertrag gegen Grundbuch | Kaufen. Nie automatisch (R11). |
| 6, 8 | Bankangebote, Betriebskosten | Kaufen und danach. Vorlagen. |

**Zwei Modellaufrufe je Treffer, hergeleitet.** Im Dauerbetrieb wirken vier Prompts. Der **erste Aufruf** ist die gemeinsame Extraktion für die Prompts 2, 3 und 10, denn alle drei lesen dieselbe Anzeige. Er liefert die Felder des Profilschemas aus Kapitel 4: Preis, Käuferprovision, Wohnfläche, Zimmer, Baujahr, Etage, Stadtteil, Heizungsbaujahr, Energiekennwert und Ausweisart, Hausgeld, Erhaltungsrücklage, Erbbaurecht, Denkmalschutz, benannte Beschlüsse und Sanierungen, je Feld mit Zitat und Belegklasse. Prompt 10 hat darin Platz als einziges boolesches Feld `ki_bildhinweis_vorhanden`, gefüllt aus dem Anzeigentext, nicht aus Bildern; Bilder gehen nie in ein Modell. Der **zweite Aufruf** formuliert aus der Lückenliste die Besichtigungsfragen nach Hebel. Die Prompts 1 und 9 rufen kein Modell, sie rechnen nach R3 gegen das Band. Also **zwei Modellaufrufe je Treffer**.

**Neu hinzu kommt die Zeitachse.** Wer einmal kauft, sieht ein Objekt einmal. Wer sucht, sieht es zwanzigmal: Preissenkung nach 60 Tagen, Wiedereinstellung unter neuer Nummer, abweichende Fläche zwischen zwei Portalen. Beobachtete Signale schlagen jede Schätzung und kosten nur Speicher (R14, R15).

**Prompt 5 wird rückwärts gelesen, und zwar vollständig.** Der Artikel verlangt für die Finanzierung eine Tabelle mit allen Nebenkosten. Für die Suche zählt daraus nur eine Zahl, der Kaufsummen-Deckel (R4), und die trägt nur, wenn jeder Posten darin steht. Die Käuferprovision ist der größte einzelne Posten neben der Grunderwerbsteuer und gehört deshalb in den Deckel, nicht in eine spätere Phase.

## 1.4 Verbindliche Designregeln

Die Regeln stehen in fünf Sachgruppen, nicht in einer einzigen Zahlenreihe. **Gruppe A führt R1 bis R5, Gruppe B R6 bis R8 und R24, Gruppe C R9 bis R13, Gruppe D R14 bis R18 und R23, Gruppe E R19 bis R22.** Innerhalb jeder Gruppe stehen die Nummern aufsteigend. Kapitel 8.1 führt jede Regel einzeilig mit den Kapiteln, in denen sie wirkt.

### A. Zahlen und Belege

**R1 Belegklassen.** B0 lizenzierter Datensatz, B1 öffentliches Dokument mit Stichtag, B2 Anbieter- oder Nutzerdatei mit Fundstelle, B3 Modellschätzung. Nur B0 bis B2 gehen in Score und Filter. B3 gelangt nie in ein Feld mit Einheit, sondern nur unter „Hinweise ohne Beleg". Ein Feld ohne Klasse ist Formfehler nach R6. **Jeder Wert der Klasse B1 oder B2 führt zusätzlich das Pflichtfeld `belegzitat` mit der wörtlichen Fundstelle aus dem Quelltext und deren Zeichenposition.** Ein deterministischer Schritt prüft, ob das Zitat im Quelltext vorkommt und ob die Zahl im Zitat steht; schlägt eines von beidem fehl, wird das Feld auf „nicht ermittelbar" gesetzt. Damit trennt R1 die Fehlextraktion von der Erfindung.
*Prüfung:* ein Feld mit erfundenem Zitat und ein Feld mit echtem Zitat, aber abweichendem Wert, fallen beide auf „nicht ermittelbar".

**R2 Stichtagspflicht.** Kein Zahlenfeld ohne Datum. Werte älter als die Profilfrist gelten als „veraltet" und verlieren Gewicht, statt zu verschwinden.
*Prüfung:* ein Wert ohne `stichtag` erzeugt einen Schemaverstoß nach R6, kein stilles Durchreichen.

**R3 Rechnen außerhalb des Modells.** Das Modell füllt Felder, ein deterministischer Schritt rechnet. Jede Zahl steht typisiert im Zustand: Feld, Wert, Einheit, Stichtag, Quelle, Belegklasse. Der Schritt protokolliert seine **Parameter samt Herkunft**, nicht gesetzte Annahmen. **Jeder Ankerwert und jede Schwelle tragen eine benannte Bezugsgröße**, also Zähler und Nenner im Klartext; ein Verhältnis ohne benannten Nenner ist ein Lint-Fehler nach Kapitel 4.
*Prüfung:* nach Löschen aller Texte muss der Rechenschritt jede abgeleitete Zahl aus der Feldtabelle allein wieder erzeugen (Kapitel 6, T12).

**R4 Kaufsummen-Deckel.** Prompt 5 rückwärts: aus tragbarer Rate, Eigenkapital, Sollzins und **allen** Kaufnebenkosten die maximale Gesamtaufwandssumme je Profil, eingefroren, Steuersatz und Nebenkostenposten aus `immo/normen.md` und `basis.yaml`. Zu den Posten gehört die Käuferprovision. R4 ist das einzige Ausschlusskriterium: Kein Treffer darüber steht im Digest, ohne Ausnahme und ohne Probeobjekt.
*Prüfung:* ein Objekt einen Euro über dem Deckel erscheint in keiner Rubrik (Kapitel 6, T15), auch dann, wenn der Deckel erst durch die Käuferprovision überschritten wird (T21).

**R5 Referenzband.** Je Suchgebiet quartalsweise ein Band aus Immobilienrichtwert, Bodenrichtwert, Marktbericht und Mietspiegel; zur Laufzeit wird nachgeschlagen, nicht recherchiert. Ohne Band heißt das Ergebnis „nicht ermittelbar", nicht „marktgerecht". Abgelegt werden nur Kennzahlen mit Fundstelle. Zum Kölner Mietspiegel 2025 bestehen zwei einander widersprechende Preisangaben: Das PDF trägt „Schutzgebühr 4,00 Euro" und den Stand April 2025 ([PDF](https://www.rheinische-immobilienboerse.de/upload/Koeln_2025_1621.pdf)), die Seite der Herausgeberin nennt „Einzelpreis: 0,00 Euro" ([RIB](https://www.rheinische-immobilienboerse.de/Mietspiegel_Koeln_2025.AxCMS)). Nach R15 wird der Widerspruch gemeldet und nicht aufgelöst; er berührt nur die Beschaffung, nicht den Inhalt. Ein ausdrücklicher Wiedergabevorbehalt steht auf keiner der beiden geprüften Seiten **[ungeprüft]**, deshalb werden nur abgeleitete Kennzahlen abgelegt.
*Prüfung:* 30 Treffer erzeugen null Referenzabrufe zur Laufzeit.

### B. Lücken, Form, Unsicherheit

**R6 Drei Feldzustände.** Wert mit Quelle, „fehlt in der Anzeige", „nicht ermittelbar" mit Grund. Ein vierter existiert nicht. Jedes Dossier durchläuft die Schemaprüfung. Die Schemaprüfung ist zugleich der Ort, an dem fünf der Vetogründe aus R18 maschinell festgestellt werden.
*Prüfung:* ein Dossier mit einem vierten Zustand fällt in der Schemaprüfung durch und löst ein Veto nach R18 aus.

**R7 Lückenquote.** Das Verschwiegene sagt mehr als das Behauptete. Liste A sind die Pflichtangaben nach § 87 GEG, warnend nur bei vorliegendem Ausweis. Liste B (Heizungsbaujahr, Erhaltungsrücklage, Hausgeld, Erbbaurecht, Denkmalschutz, Beschlüsse, Käuferprovision) geht in den Score. Ein Dossier voller „nicht ermittelbar" rangiert über einem mit quellenlosen Zahlen.
*Prüfung:* gleich teure Anzeigen bekommen ungleiche Scores, wenn nur eine die Erhaltungsrücklage nennt.

**R8 Belegdichte.** Die Belegdichte ist die **Gewichtssumme der belegten Kriterien geteilt durch 100**. Belegt heißt: Feldwert mit Belegklasse B0 bis B2; bei B1 und B2 zusätzlich mit bestandenem Zitatanker. Ein B0-Wert stammt aus dem lizenzierten Datensatz und trägt statt des Zitats die Manifest-`id` seiner Quelle, denn ein Zitat aus dem Anzeigentext kann es für ihn nicht geben. Eine zweite Formel existiert nicht. **Die Schwelle steht je Bauvariante in `basis.yaml`**, weil die Menge der belegbaren Felder von der Variante abhängt (Kapitel 4.4). Unterschreitung bringt die Kennzeichnung „unvollständig" und einen eigenen Digest-Abschnitt, nie den Ausschluss.
*Prüfung:* ein Objekt unter der Schwelle seiner Variante erscheint im Digest, aber nie unter „Vorschlag".

**R24 Freitextausschluss.** Freitext steht nur in ausgewiesenen Textfeldern und geht nie in Score, Filter oder Dedup-Schlüssel ein. Prosa wie „Rücklage im üblichen Rahmen" zählt nicht als Angabe.
*Prüfung:* gleiche Feldwerte mit anderer Prosa ergeben denselben Score und denselben Cluster-Schlüssel.

### C. Recht, Normstand, Grenzen

**R9 Normregister.** Jede Norm steht als Zeile in `immo/normen.md`: Bezeichnung, Paragraph, Fassungsstand, Fundstelle, Prüfdatum. Jede Normnennung trifft genau eine Zeile. Musterzeile im vollen Schema:

```
bezeichnung: Gebäudeenergiegesetz
paragraph: § 87 Abs. 1 GEG
fassungsstand: geändert durch GModG, in Kraft 29.07.2026
fundstelle: https://www.gmodg.bund.de/GEGPortal/DE/Energieausweise/Immobilienanzeigen/Immobilienanzeigen.html
pruefdatum: 2026-09-07
```

Weitere Startzeilen: § 558 BGB; § 558d BGB; **§ 19 Abs. 2 Nr. 4 WEG**; § 24 Abs. 7 WEG; § 16 Abs. 2 WEG; § 12 WEG; § 17 Abs. 2a Satz 2 Nr. 2 BeurkG; § 13 Abs. 1 ImmoWertV; § 20 ImmoWertV; §§ 24 ff. ImmoWertV; § 21 Abs. 2 ImmoWertV; § 193 Abs. 5 Satz 2 BauGB; § 196 BauGB; § 7i EStG; Anlage 10 GEG; Art. 50 KI-VO; § 87b Abs. 1 UrhG; Grunderwerbsteuer NRW 6,5 Prozent für ab 01.01.2015 beurkundete Verträge ([finanzamt.nrw.de](https://www.finanzamt.nrw.de/steuerinfos/privatpersonen/haus-und-grund/grunderwerbsteuer-wissenswertes-beim-grundstuecks-oder)).
*Prüfung:* eine Normnennung ohne Registerzeile löst ein Veto nach R18 aus.

**R10 Normwächter.** Eine quartalsweise Aufgabe prüft je Registerzeile Erreichbarkeit, Titel und Fassungsstand und legt Christoph eine Aufgabe an, ohne Schreibzugriff. Entwürfe sind kein Recht: „Miete II" lag am 09.07.2026 in erster Lesung **[ungeprüft]**, kein Score beruht darauf.
*Prüfung:* eine absichtlich veraltete Registerzeile erzeugt binnen eines Quartalslaufs genau eine Aufgabe und keine Dateiänderung.

**R11 Keine Rechtsfolgenaussage.** Das System nennt Fundstelle und Frage, nie die Rechtsfolge. Beispiel: die Zwei-Wochen-Frist des § 17 Abs. 2a BeurkG. Ob sie greift, entscheidet ein Mensch. Jede Aussage zu einer Norm besteht aus genau drei Feldern: Registerzeile nach R9, beobachteter Sachverhalt, offene Frage an den Menschen. Ein viertes Feld existiert nicht.
*Prüfung:* über die Schemaprüfung aus R6, nicht über Textsuche. Ein Normblock mit einem vierten Feld fällt durch.

**R12 Mikrolage beim Menschen.** Lärm, Geruch, Nachbarschaft und Blick beurteilt das System nicht. Es sortiert und begründet, kontaktiert niemanden, unterschreibt nichts.
*Prüfung:* kein Score-Bestandteil trägt einen dieser Namen, und keine Cowork-Rolle hat ein Werkzeug mit Außenwirkung.

**R13 Fahnen ohne Score.** Baujahr, Hausgeld je m² und Wörter wie „modernisierungsbedürftig" setzen „Erhaltungsrücklage" auf „nicht ermittelbar" und stellen eine Frage. Verglichen wird gegen die eigenen Treffer desselben Profils, weil § 19 Abs. 2 Nr. 4 WEG nur eine „angemessene" Rücklage verlangt ([dejure.org](https://dejure.org/gesetze/WEG/19.html)). Ebenso das Ertragssignal aus Prompt 9 und die erhöhte Absetzung nach § 7i EStG bei Denkmalschutz: Sie ist häufig der Kaufgrund und darf gerade deshalb keinen Punkt vergeben, denn ihre Höhe hängt an einer Bescheinigung, die beim Fund nicht vorliegt.
*Prüfung:* keine Fahne trägt einen Eurobetrag, und keine ändert den Punktwert.

### D. Zeit, Zustand, Selbstprüfung

**R14 Objektbiografie.** Stabiler Schlüssel aus normalisierten Merkmalen, dazu die Ereignisliste: gesehen, Preis geändert, Feld geändert, verschwunden, wieder aufgetaucht. Änderungen zeigen sich nur an Feldwerten, nie am Text, denn das Modell formuliert neu.
*Prüfung:* ein zweiter Lauf am selben Tag mit gleicher Eingabe erzeugt keine Meldung.

**R15 Widerspruch als Ergebnis.** Abweichende Fläche, Baujahr oder Preis für dasselbe Objekt werden gemeldet. Kein Mittelwert, keine stille Zusammenführung. Das gilt auch für Widersprüche in Referenzquellen.
*Prüfung:* zwei Flächenangaben erzeugen nie eine dritte Zahl.

**R16 Kanarienzwilling.** Ein festes Testobjekt durchläuft jeden Lauf über denselben Eingangskanal wie echte Treffer. Sein Exposé lässt die Erhaltungsrücklage weg, enthält eine quellenlose Zahl im Gewand eines Referenzwerts, trägt ein Hausgeld mit Fundstelle und Stichtag und nennt viertens eine Wohnfläche, die im Anzeigentext anders steht als im erwarteten Feldwert.
*Prüfung:* bestanden nur, wenn die Lückenliste „Erhaltungsrücklage" nennt, der Referenzwert „nicht ermittelbar" bleibt, das Hausgeld als B2-Wert ankommt **und** die Wohnfläche nach R1 auf „nicht ermittelbar" fällt. Ein Lauf, der alles auf „nicht ermittelbar" setzt, muss scheitern.

**R17 Sichtbares Scheitern.** Fällt eine Quelle aus, nennt der Digest sie namentlich und die Zahl der Treffer ohne Preisurteil. Ein leerer Digest ist ein Ergebnis und geht raus.
*Prüfung:* ein Lauf ohne jeden Treffer erzeugt eine zugestellte Nachricht, keine Stille.

**R18 Vetotafel.** Genau fünf Regeln dürfen die Trefferliste unterdrücken: R6 (Schemaverstoß, einschließlich R24 und einschließlich einer Zahl ohne Manifest-`id` nach Kapitel 3), R9 (Normnennung ohne Registerzeile), R11 (Rechtsfolgenaussage), R16 (Zwilling gescheitert), R19 (Personendaten im Ausgang). Alle übrigen kennzeichnen oder werten ab.

**Das Veto zieht der Schemaschritt, gleich in welcher Laufzeit er liegt.** Alle fünf Gründe sind maschinell prüfbar, vier davon über die Schemaprüfung. Der Träger ist deshalb an den Schritt gebunden, nicht an eine Rolle, und er wechselt mit der Bauvariante.

| Wann | Wer zieht das Veto |
|---|---|
| V0 und damit Phase 1a, ab dem ersten bewertenden Lauf | der **Schemaschritt im Code-Knoten von n8n**; C2 existiert dort nicht |
| ab Phase 2, also in V2 | der **Schemaschritt in C2** |
| ab Phase 3 zusätzlich | **C3** für den Kanarienzwilling nach R16 und für Beleglücken, die erst der blinde Vergleich sichtbar macht |

Kein anderer Schritt und keine andere Rolle darf ein Veto ziehen. **Für jede Phase, in der bewertet wird, ist damit ein vorhandener Träger benannt.** Der Wechsel kostet keine Umschreibung der Regel, denn die Schemaprüfung ist in beiden Varianten dasselbe Skript an einem anderen Ort (Abschnitt 2.10).

**Ein Veto unterdrückt die Trefferliste, nie die Nachricht.** Jedes Veto erzeugt eine Meldung mit Regelnummer, Laufzeitpunkt und der Zahl der zurückgehaltenen Treffer, zugestellt über den Kanal aus R17. **Eskalation:** Zieht dieselbe Regel in zwei aufeinanderfolgenden Läufen das Veto, geht der Lauf in Quarantäne und erzeugt eine Aufgabe im Repository; weitere Läufe des betroffenen Profils ruhen bis zur Freigabe.
*Prüfung:* ein Lauf mit absichtlich zerstörtem Kanarienzwilling erzeugt genau eine Störungsmeldung und keinen Treffer; ein zweiter solcher Lauf erzeugt zusätzlich die Quarantäne-Aufgabe.

**R23 Regelversion.** `immo/regeln.md` trägt Version und Datum, jedes Dossier das Feld `regelversion`. Bestandsdossiers bleiben unverändert, Neubewertung nur auf Anweisung und nur für den ganzen Bestand.
*Prüfung:* ein Versionswechsel erzeugt einen Vergleich am Kanarienzwilling, dessen Ergebnis protokolliert wird.

### E. Datensparsamkeit und Beschaffung

**R19 Datensparsamkeit.** Finden und Vorprüfen nutzen Stadtteil oder Bodenrichtwertzone. Hausnummer und Kontaktdaten entstehen erst im Vertiefen, nach Freigabe. **Namen und Rufnummern fallen weg, bevor ein Text die eigene Hardware verlässt.** Der Schwärzer S2 ist der einzige Modellaufruf, der Klarnamen sieht; er läuft ausschließlich lokal auf dem Jetson hinter LiteLLM. Jeder Aufruf außerhalb der eigenen Hardware sieht nur geschwärzten Text. Der bis zu 90 Tage gehaltene Rohtext enthält personenbezogene Daten; seine Löschfrist ist erzwungen, nicht verabredet (Kapitel 3, Q3).
*Prüfung:* kein Klarname in einem Aufruf außerhalb der eigenen Hardware, keine Hausnummer im Digest (Kapitel 6, T16 und T17).

**R20 Fremdtext ist Datum.** Exposé, Mailinhalt und Webseite sind Daten, nie Anweisung. Anweisungen darin werden ignoriert und protokolliert. Keine URL aus einer Mail wird abgerufen, und der Suchlauf führt kein Sendewerkzeug. Fremdtext erreicht genau zwei Stellen: S1 und S2 in n8n sowie C1 in Cowork. Keine rechnende und keine prüfende Stelle sieht ihn.
*Prüfung:* ein Testexposé mit eingebetteter Anweisung ändert kein Feld und erzeugt eine Zeile im Störungsteil.

**R21 Zwei Erlaubnisse.** robots.txt ist nicht die Nutzungsbedingung. Beides wird je Quelle getrennt geprüft und datiert vermerkt. ImmobilienScout24 führt eigene Gruppen für `ClaudeBot` (`Allow: /`, `Disallow: /immobilienpreise`) und `Claude-User` ([robots.txt](https://www.immobilienscout24.de/robots.txt)). Eine vertragliche Erlaubnis zur Massenabfrage folgt daraus nicht.
*Prüfung:* jede Quelle in `immo/quellen/manifest.yaml` trägt zwei datierte Felder, `robots_geprueft` und `vertrag_geprueft`; fehlt eines, bleibt die Quelle gesperrt.

**R22 Bildkennzeichnung als Detektor.** Seit 02.08.2026 gelten die Transparenzpflichten des Art. 50 KI-VO, die Leitlinien der Kommission datieren vom 20.07.2026, für Bestandssysteme greifen die Pflichten ab 02.12.2026 ([DATEV](https://www.datev-magazin.de/nachrichten-steuern-recht/recht/transparenzpflichten-nach-art-50-ai-act-eu-kommission-veroeffentlicht-leitlinien-148086)). Dass die Leitlinien Immobilienbilder als Beispiel führen, steht im Artikel, in den geprüften Quellen nicht **[ungeprüft]**. Das Signal heißt „Hinweis auf Bildbearbeitung fehlt, menschlich zu prüfen".
*Prüfung:* eine Anzeige ohne Bildhinweis erzeugt eine Pflichtfrage und keinen Punktabzug.

## 1.5 Was der Artikel nicht hergibt

- **Keine Fundstrategie, keine Dubletten, keine Kosten.** 40 Treffer mal zwei Modellaufrufe ergeben 80 Aufrufe je Nachtlauf. Eine Einzelrecherche je Treffer nach Prompt 1 käme auf 1.200 Referenzabrufe im Monat; R5 senkt das auf vier im Jahr je Suchgebiet. Der Eurobetrag steht in Kapitel 5.
- **Keine Zugangswege zu Bewertungsmodellen.** Sprengnetter, Pricehubble und On-geo bleiben ohne geprüfte Preise und Schnittstellen **[ungeprüft]**.
- **Amtliche Richtwerte sind teilweise doch abrufbar.** In NRW als B0, Datenlizenz Zero 2.0, über den WMS-Dienst `wms_nw_brw`, über einen Atom-Feed und als Shapefile; nur das Shapefile braucht Aufbereitung ([open.nrw](https://open.nrw/dataset/ce127d47-27d1-4f49-a4dc-65cc1dac339e), [opengeodata.nrw.de](https://www.opengeodata.nrw.de/produkte/infrastruktur_bauen_wohnen/boris/BRW/)). Dasselbe gilt für die Immobilienrichtwerte, und zwar für sieben Teilmärkte einschließlich Ein- und Zweifamilienhäusern (Kapitel 4.3). Andere Länder **[ungeprüft]**.
- **Keine Ertragsmaßstäbe.** Der Artikel nennt die Rendite nicht. Der Gutachterausschuss veröffentlicht Liegenschaftszinssätze; sie sind der fehlende Vergleichsmaßstab für jede Renditezahl (Kapitel 4.3).

## 1.6 Anschluss

Kapitel 2 wählt den Ort für Rechenschritt (R3) und Zustand (R14, R23) außerhalb der Sitzung und stellt in Abschnitt 2.10 die Bauvarianten gegenüber. Kapitel 3 setzt R1, R2 und R21 je Quelle um, R20 je Kanal, R17 je Ausfall. Kapitel 4 setzt R4, R5, R7, R8, R13 und R24 um. Kapitel 5 macht R14 bis R19 zum operativen Kern. Kapitel 6 macht jede Prüfzeile hier zu einem Abnahmetest. Kapitel 7 legt die vier Dateien vor dem ersten Lauf an.

---

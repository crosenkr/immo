# Kapitel 6. Qualität, Sicherheit, Datenschutz

Belege vom 07.09.2026, Fundstellen am Ende. Rollen nach Kapitel 2. Drei Fehler kennt jeder Bauplan: die erfundene Zahl, die gekaperte Anweisung, die ausgeplauderte Person. Der vierte ist der übersehene Treffer, und ihn misst die Blindprobe.

## 6.1 Halluzinationsschutz

**Zitatanker.** C1 liefert je Zahlenfeld Wert, Einheit, Textausschnitt und Zeichenposition (R1). C2 normalisiert Ausschnitt und Feld gleich (NFKC, Leerraum, Tausenderpunkt, „qm" gegen „m²") und vergleicht geparste Dezimalzahlen, nie Ziffernfolgen; sonst wären „2400" und „2.400,00" verschiedene Werte. Steht die Zahl nicht innerhalb von 20 Zeichen um die angegebene Stelle, wird das Feld „nicht ermittelbar" und scoreunfähig. Kein Modell entscheidet das, und es kostet null Token.

**Zitattreue.** Die zweite Hälfte liegt bei S3, weil nur dort der gespeicherte Rohtext liegt: S3 prüft, ob der Ausschnitt wörtlich im Rohtext vorkommt. Fällt das, wird das Feld ebenfalls „nicht ermittelbar". Beide Hälften zusammen trennen Fehlextraktion von Erfindung (R1).

**Ziffernbilanz.** Rückwärts vergleicht S3 alle Zahlen des Quelltexts mit der Feldtabelle. Zahlen ohne Feld heißen „unerklärt"; das fängt ein im Feld fehlendes Hausgeld. Steigt ihr gleitender Median über sieben Tage um mehr als drei, hat sich ein Portalformat geändert, nicht der Markt. Ein zweiter Median misst die Textlänge je Absender: Ein Rückgang unter 20 Prozent zeigt die Umstellung auf Bildmails als Störung, nicht als Nullmeldung (T7).

**Kein Rechnen im Fließtext.** Euro je Quadratmeter, Gesamtaufwand, Rendite, Bandabstand und Punktwert entstehen im Skript aus geankerten Feldern. Der Anker prüft Herkunft, nicht Bedeutung; dass eine Zahl die Kaltmiete ist, erkennt erst der Vergleich. Rechenbeweis (T12): Alles außer der Feldtabelle wird gelöscht, C2 rechnet neu, jede Zahl muss auf 0,5 Prozent genau wieder entstehen.

**Gegenprüfung ohne Quelltext.** C3 bekommt ein anderes Modell und einen anderen Auftrag: **die Feldtabelle mit Belegzitaten, Stichtagen und Fundstellen sowie ein leeres Zweitschema, nie den Quelltext und nie das Erstergebnis.** Das folgt der Einbahnstraße aus Kapitel 2.2 ohne Ausnahme. Seine Frage lautet nicht „stimmt der Wert", sondern „trägt die genannte Fundstelle diesen Wert, und passt er zum Band". Bei Abweichung gehen **beide Werte ins Dossier, nie ein Mittelwert**. „Strittig" wirkt zweifach: Bei einem K.o.-Feld bedeutet es Rückstellung ohne Score, bei einem gewichteten Feld eine Rechnung mit dem **ungünstigeren** Wert und eine Marke.

**Was diese Wahl kostet.** Ein Zweitextraktor mit Quelltext fände auch ein falsches Hausgeld mit gültiger Fundstelle. Er sähe dafür Fremdtext in der Rolle, die als letzte Bremse gedacht ist, und höbe R20 genau dort auf, wo er am teuersten aufzuheben ist. T18 und T19 halten diese Reichweite als Test fest, statt sie zu verschweigen.

**Wie viele Gegenprüfungen.** Geprüft werden alle Objekte mit einer Digestzeile plus zehn Prozent der verworfenen. **Eine Digestzeile bekommt jedes Objekt der Zeilen 6 bis 9 der Statustabelle**, also `UV`, `PV`, `VS` und `NF`; verworfen sind `AB1` bis `AB5`. Erreichen 5 von 40 Objekten eine Digestzeile **[ungeprüft, Annahme]**, kommen zehn Prozent von 35 dazu, aufgerundet 4, zusammen **9 im Nachtlauf als Erwartungswert**; der Deckel liegt bei 10. Im Deltalauf mit 15 Objekten sind es 2 mit Digestzeile plus aufgerundet 2 von 13, zusammen **4 als Erwartungswert**, Deckel 5. Beide Zahlen gelten auch in Abschnitt 6.7.

**Digestzeile ist nicht Vorschlag, und beide Zahlen müssen zueinander passen.** Nur Zeile 8 der Statustabelle, also der Code `VS`, ist ein Vorschlag; `UV`, `PV` und `NF` stehen in eigenen Rubriken. Die Annahme oben ergibt **150 Digestzeilen im Monat**, die Spanne aus `treffer_pro_woche` in Abschnitt 5.9 ergibt **13 bis 78 Vorschläge im Monat**. Beide Größen sind verträglich, weil jeder Vorschlag eine Digestzeile ist und nicht umgekehrt: Nach diesen Zahlen wäre zwischen einem Zwölftel und gut der Hälfte der Digestzeilen ein Vorschlag (13 von 150 gleich 8,7 Prozent bis 78 von 150 gleich 52,0 Prozent), der Rest eine Frage oder ein Nachfassen. **Die Wochenrückschau prüft die Ordnung als Kennzahl:** Übersteigt die gemessene Zahl der Vorschläge die gemessene Zahl der Digestzeilen, ist eine der beiden Zählungen falsch, und C5 meldet es, statt die kleinere Zahl anzupassen. Nach der Messphase ersetzen die Messwerte die Annahme; das Datum steht in `immo/runbook.md`.

**Gesäte Fehler.** In jeder fünften Gegenprüfung ist die Feldtabelle präpariert, etwa mit verschobener Fläche oder einem Zitat, das die Zahl nicht trägt. Die Fangquote über 40 Saaten steht in der Wochenrückschau. Gerechnet wird aus dem **Erwartungswert**, nicht aus dem Deckel. Ohne Deltalauf sind das 9 Gegenprüfungen am Tag und bei Saatrate 1 zu 5 also 1,8 Saaten; das Fenster von 40 Saaten füllt sich in **23 Tagen**. Mit Deltalauf sind es 13 Gegenprüfungen, 2,6 Saaten und **16 Tage**. Vorab laufen 40 Saaten aus dem Goldkorpus in einem Stapel; bis dahin greift die Stilllegungsregel nicht. Danach wird C3 unter einer Fangquote von 0,8 stillgelegt, nicht nachgebessert: Ein Prüfer, der nichts findet, ist schlimmer als keiner.

## 6.2 Belegverfall, je Quelle gestaffelt

Jede externe Tatsache trägt Abrufdatum und eigene Frist in `immo/recht.md`. Nach Ablauf gilt sie als **nicht bestanden, weil ungeprüft**.

| Beleg | Haltbarkeit | Wer prüft nach, in welcher Frist | Nach Ablauf, im Dossier |
|---|---|---|---|
| Immobilienrichtwert NRW | Stichtag, höchstens 24 Monate | C5, jährlicher Import, quartalsweise Prüfung | Spur 1 fällt aus, Preisurteil nur noch aus Spur 2 |
| BORIS NRW, Bodenrichtwert | Stichtag, höchstens 24 Monate | C5, quartalsweiser Abruf je Zone | Feld `bodenrichtwert` auf „nicht ermittelbar", Bodenwertklammer entfällt |
| Grundstücksmarktbericht Köln | 15 Monate (Kapitel 3) | Christoph, jährlich nach Erscheinen im Januar | Spur 2 und Liegenschaftszinssatz fallen aus, Preisurteil nur noch aus Spur 1, sonst „nicht ermittelbar" |
| Mietspiegel Köln | 30 Monate (Kapitel 3) | Christoph, alle zwei Jahre nach Erscheinen | Vergleichsmiete entfällt, Bruttorendite bleibt, weil sie aus der Istmiete rechnet |
| Grunderwerbsteuer und übrige Nebenkostensätze NRW | 12 Monate | C5, quartalsweise gegen die Seiten der Finanzämter und die Nebenkostenquelle | Kaufnebenkosten und damit der Deckel nach R4 gelten als überfällig, der Digest trägt eine Kopfzeile |
| Portal-AGB | 3 Monate, Hash-Vergleich | C5, quartalsweise | Quelle still bis zur Neuprüfung |
| robots.txt | 30 Tage, Abruf in n8n | S1, monatlich | Abweichung pausiert die Quelle |
| Gesetzeszitat | 12 Monate | C5 als Normwächter nach R10, quartalsweise | Digest: „Rechtsstand überfällig" |

**Zweite Stufe beim Rechtsstand.** Bleibt ein Gesetzeszitat weitere 30 Tage ohne Nachprüfung, wird die betroffene Registerzeile gesperrt. Jede Aussage, die sie zitieren würde, entfällt aus dem Dossier, und das Feld steht auf „nicht ermittelbar" mit dem Grund „Registerzeile gesperrt". Der Digest nennt die Zeile namentlich. So legt sich ein vernachlässigtes System still, statt still zu veralten.

## 6.3 Testset und Abnahmetests

**Goldkorpus**, 28 eingefrorene Objekte im Repository, je Rohtext plus Feldtabelle. Alle Fälle sind **synthetisch**, denn Git vergisst nichts und Art. 17 DSGVO ist in der Historie kaum durchsetzbar.

| Kategorie | Stück | Wofür |
|---|---|---|
| saubere Anzeigen, vollständig | 6 | Durchlass (T14), Rechenbeweis (T12), Doppellauf (T13) |
| Lückenfälle | 6 | § 87 GEG mit und ohne Ausweis (T3, T4), Rücklage nur im Fließtext (T2), Zitatanker (T1), Anzeige ohne Erbbaurechtserwähnung (T22) |
| Dubletten | 6 | drei Paare für T5, T6 und T20, je eines portalintern, übergreifend und an der Fachgrenze; alle drei laufen als Datei und prüfen den Schlüssel, nicht den Zulauf (Kapitel 3.4) |
| Angriffsexposés | 4 | versteckte Zeichen (T8), Fremdlink und Adresse (T9), Anweisung im Text, Bildmail ohne Text (T7) |
| Durchfaller | 4 | Phantom über dem Deckel (T15), Phantom erst durch Provision (T21), Massenlauf (T11), Widerspruch im Kaufpreis (T10) |
| Schwärzungsfälle | 2 | bekannter Name im Muster (T16), unbekannter Name ohne Musterentsprechung (T17) |
| **Summe** | **28** | |

Eine leere Kategorie fällt damit sofort auf, und der Korpus ist ohne Rückfrage nachbaubar.

**Regressionsarchiv.** Jeder gemeldete Fehler wird ein Testfall. Kennzahl ist die **Rückfallquote**, der Anteil der Archivfälle, die die Suite fängt; die Abnahme vor jeder Profil- oder Promptänderung verlangt 100 Prozent.

Werkzeuge: `promptfoo` (24,9 k Sterne, MIT, lokal) mit deterministischen Assertions [1], Angriffsfälle aus `deepset/prompt-injections` (662 Beispiele, überwiegend deutsch, Apache-2.0) [2]. Ob das Verhalten dort dem in Cowork gleicht, ist **[ungeprüft]**, also läuft der Korpus vor jeder Änderung einmal in Cowork.

| Nr | Testfall | Erwartung |
|---|---|---|
| T1 | Text „1904", Feld „1940" | Zitatanker fällt durch, Feld entwertet |
| T2 | Erhaltungsrücklage nur im Fließtext | unerklärte Zahl in der Ziffernbilanz |
| T3 | Ausweis vorhanden, Effizienzklasse fehlt | Verstoß gegen § 87 Abs. 1 GEG [3] |
| T4 | Neubau, kein Ausweis | **kein** Verstoß, nur Frage |
| T5 | Dublette 87,0 zu 87,4 m², gleiches Fach | ein Dossier, beide Quellen |
| T6 | Dublette 87 zu 91 m² | zwei Objekte, Marke „Flächenkonflikt" |
| T7 | Quelle tot, Mail ohne Text | Störung statt Nullmeldung |
| T8 | weiße Schrift, U+2028 | entfernt, gezählt |
| T9 | Adresse und Fremdlink im Text | Versand blockiert |
| T10 | C3 weicht im Kaufpreis ab | „strittig", beide Werte |
| T11 | 400 Objekte | 40 verarbeitet, Rest bleibt `neu` |
| T12 | nur Feldtabelle übrig | Zahlen auf 0,5 Prozent genau |
| T13 | Lauf zweimal am Tag | gleicher Score, eine Meldung |
| T14 | **Durchlass:** sechs saubere Anzeigen | alle im Digest |
| T15 | **Phantom:** Kaufpreis über dem Deckel nach R4 | erscheint nicht, T14 bleibt grün |
| T16 | Maklername im Zitatausschnitt | Name fehlt im Digest |
| T17 | **unbekannter Name ohne Musterentsprechung** | Name fehlt im Digest, Fangquote zählt mit |
| T18 | Preis je m² 30 Prozent außerhalb des Bandes, Fundstelle trägt die Zahl nicht | C3 fängt es, Feld auf „nicht ermittelbar" |
| T19 | falsches Hausgeld mit gültiger Fundstelle | C3 fängt es nachweislich **nicht**; der Test hält diese Grenze fest |
| T20 | **Fachgrenze:** Dublette 87,4 zu 87,6 m², Baujahr 1909 zu 1911 | ein Dossier, weil die Blockbildung die Nachbarfächer prüft |
| T21 | **Provisionsphantom:** Kaufpreis 722.222 Euro unter dem alten, mit Käuferprovision über dem Deckel von 780.000 Euro | Status `AB1`, erscheint nicht |
| T22 | Anzeige ohne jede Erbbaurechtserwähnung | keine Erbbaurechtsfrage, `erbbaurecht: nein` |

T3 und T4: § 87 Abs. 1 GEG verlangt die Pflichtangaben nur, wenn bei Aufgabe der Anzeige **ein Energieausweis vorliegt**; das amtliche Portal formuliert die Bedingung wörtlich als „wenn dieser zum Zeitpunkt der Aufgabe der Anzeige vorliegt" [3]. Ein Neubau ohne Ausweis ist eine Lücke, kein Verstoß. T14 und T15 laufen als Kanarienpaar: Ein Filter, der alles verwirft, bestünde jeden übrigen Test. T18 und T19 sind das Paar aus Kapitel 2, das die Reichweite von C3 festhält.

**Mutationstest.** `mutationen.yaml` verfälscht eine **Kopie** der Regeldateien: M1 Ziffernbilanz-Schwelle auf 99, M2 Kanonisierung aus, M3 Linkweißliste leer, M4 Belegverfall übersprungen, M5 Fläche plus eins im Nenner, M6 Operator im Preisfilter gedreht, M7 Käuferprovision aus dem Gesamtaufwand entfernt. **Abnahme: mindestens sechs der sieben Mutationen fallen durch**, jeder Überlebende erzeugt einen neuen Testfall. *Ausführender:* C5 als betreuter Lauf, quittiert von Christoph. *Termin:* halbjährlich im **Januar und Juli**, rund 30 Minuten. *Ablageort:* `immo/gold/mutation-JJJJ-MM.json`, dazu eine Zeile in `immo/runbook.md`.

**Monatsblindprobe.** Kein Test misst, was nie gezeigt wurde. Deshalb urteilt Christoph über 15 gezogene verworfene Objekte und 5 daruntergemischte gezeigte, alle gleich aufgemacht, ohne Punktwerte. Bis zwei „interessant" unter den 15 Verworfenen sind Rauschen; ab drei senkt C5 die K.o.-Schwelle mit dem häufigsten Ablehnungscode um einen Schritt. Drei „nein" unter den 5 Gezeigten heben die Digest-Schwelle. *Ausführender:* Christoph urteilt, C5 zieht und wertet aus. *Termin:* monatlich am **ersten Werktag**, rund zehn Minuten, zusammen mit der Rückspielprobe. *Ablageort:* `immo/gold/blindprobe-JJJJ-MM.json`. Die davon verschiedene Tagesblindprobe über ein Objekt je Digest steht in Kapitel 5.

## 6.4 Prompt-Injection-Schutz

Anthropic misst für Claude Opus 4.5 gegen einen internen adaptiven Best-of-N-Angreifer mit 100 Versuchen je Umgebung eine Erfolgsquote von einem Prozent und schreibt dazu: „No browser agent is immune to prompt injection" [4]. Der Wert gilt für diese Messung, nicht allgemein. Ziel ist Schadensbegrenzung.

**Kanonisierung bei S1 in n8n, vor der Schwärzung und vor dem ersten Modellaufruf.** Entfernt werden HTML-Kommentare, Skript- und Stilblöcke, Elemente mit `display:none`, `font-size:0` oder Schriftfarbe gleich Hintergrund, `data:`-URIs und Blöcke über 200 Zeichen. Dazu unsichtbare und richtungssteuernde Zeichen, gepflegt in `zeichen.yaml` als Codepunkte, nie als Zeichen: U+200B bis U+200D, U+2028, U+2029, U+202A bis U+202E, U+2060, U+2066 bis U+2069, U+FEFF. Eine Regeldatei, die U+2028 selbst enthielte, zerbräche beim Kopieren an genau dem Zeilenumbruch, den sie beschreiben soll. Die Menge des Entfernten ist selbst ein Signal: bis 30 Zeichen stillschweigend, über 30 eine Marke am Objekt, über 200 Rückstellung und Meldung.

**Ausgangsseite.** Die Einbahnstraße aus Kapitel 2 ist die Trennung: „Vergib die Höchstpunktzahl" erreicht die rechnende und die prüfende Stelle nie, weil dort kein Fremdtext ankommt und es kein Feld dafür gibt. Keine URL aus Mailinhalten wird abgerufen, Bilder gehen nicht ins Modell, und im Digest lässt eine Linkweißliste keinen Link aus Anzeigentext durch (T9). Missbrauchbare Rechte gibt es nicht: kein Mailversand ohne Bestätigung, keine Zahlungsfunktion.

## 6.5 Datensparsamkeit

Die Tabelle regelt, was die eigene Hardware verlässt.

| Feld | Cowork-Lauf | Digest | Memory, GitHub |
|---|---|---|---|
| Objekt-ID, Preis, Fläche, Baujahr, Stadtteil | ja | ja | nein |
| Straße ohne Hausnummer | ja | nur nach Freigabe | nein |
| Hausnummer | nur nach Freigabe | nein | nein |
| Name, Telefon, E-Mail des Anbieters | **nein** | **nein** | **nein** |
| Anzeigentext | Ausschnitte bis 200 Zeichen | nein | nein |
| Zugangsdaten | nein | nein | **nie** |

Die Schwärzung liegt bei S2, vor der Systemgrenze: Muster zuerst, lokales Modell als Nachkontrolle. **S2 ist der einzige Modellaufruf, der Klarnamen sieht, und er läuft ausschließlich auf dem Jetson hinter LiteLLM** (R19). **Die 200-Zeichen-Ausschnitte entstehen erst nach der Schwärzung, nie aus dem Rohtext** (T16), sonst trüge jeder zweite Ausschnitt einen Maklernamen. `microsoft/presidio` (10,8 k Sterne, MIT) ist die Ausbaustufe [5].

**Die Schwärzung wird gemessen wie die Gegenprüfung.** In **einem Zwanzigstel der Rohtexte** sät S1 vor der Schwärzung einen Klarnamen aus einer Liste, die S2 nicht kennt; die Hälfte davon ohne Musterentsprechung, also ohne vorangestelltes „Herr", „Frau" oder „Ihr Ansprechpartner" (T17). Gemessen wird die **Fangquote** über die letzten 40 Saaten. **Unter 0,95 wird der Kanal stillgelegt**, nicht nachgebessert: Ein Klarname in einem Aufruf außerhalb der eigenen Hardware ist nicht zurückzuholen. Die Quote steht in der Wochenrückschau neben der Fangquote von C3.

Die Straße bleibt stehen, sonst gibt es keine Bodenrichtwertzone; in kleinen Straßen bleibt die Wohnung dadurch bestimmbar. Cowork-Memory ist die riskanteste Ablage, denn sie überlebt Sitzungen und kennt kein Rollback; dort liegen nur Pfade und Profilnamen. Rohtexte mit Klarnamen werden nach 90 Tagen gelöscht; ihre Rechtsgrundlage steht in `immo/recht.md` und stützt sich nicht auf die Haushaltsausnahme.

## 6.6 Rechtsrahmen

Keine Rechtsberatung; Grenzfälle stehen in `OFFEN.md`.

| Punkt | Befund | Folge |
|---|---|---|
| Portal-AGB | 8.2 untersagt „eine automatisierte Abfrage durch Skripte, Bots, Crawler, o.ä.", 8.3 den „Aufbau einer eigenen Datenbank" [6] | kein Crawler, kein eigener Bestand; das Risiko ist die Kontosperrung |
| robots.txt | `Claude-User: Allow: /`; `ClaudeBot: Allow: /` mit `Disallow: /immobilienpreise` [9] | Preisbereich gesperrt; eine erlaubende robots.txt hebt 8.2 nicht auf |
| Art. 50 KI-VO | Pflichten seit 02.08.2026, Leitlinien vom 20.07.2026, Bestandssysteme ab 02.12.2026 [10]; Abs. 4 verlangt Offenlegung bei „deep fake" [11], erfasst virtuelles Möblieren, Hinweis am Bild wahrnehmbar (F.A.Z., 02.09.2026) | außen ein Warnsignal, kein Vorwurf; innen eine Pflichtzeile beim eigenen Inserat |
| Mietspiegel Köln | Herausgeberin ist ein Verein, kein qualifizierter Mietspiegel nach § 558d BGB | keine Vermutungswirkung; die Vergleichsmiete bleibt eine Einordnung (R11) |

**Zum AGB-Verbot gibt es Rechtsprechung, aber zu einem anderen Sachverhalt.** Der Bundesgerichtshof entschied am 30.04.2014 in der Sache **I ZR 224/12 (Flugvermittlung im Internet)**, dass das bloße vertragliche Verbot einer automatisierten Abfrage für sich genommen keine unlautere Behinderung begründet; der Volltext steht bei [openJur](https://openjur.de/u/691648.html) [7]. Das Urteil erging zu einer Flugbuchungsseite, nicht zu Immobilienportalen. **Die Übertragung ist eine Rechtsauffassung [ungeprüft, Rechtsauffassung]** und trägt hier ohnehin keine Entscheidung, denn der Betrieb fragt nicht ab, sondern empfängt.

**§ 87b Abs. 1 UrhG.** Satz 2 stellt die „wiederholte und systematische" Entnahme unwesentlicher Teile der wesentlichen gleich, aber nur, „sofern diese Handlungen einer normalen Auswertung der Datenbank zuwiderlaufen" oder Herstellerinteressen unzumutbar beeinträchtigen [8]. Die Norm trägt hier keine Entscheidung: Ob eine Portalseite eine geschützte Datenbank nach § 87a ist und ob der Vorbehalt greift, ist **[ungeprüft, Rechtsauffassung]**. Der Crawler-Verzicht ruht auf den AGB und darauf, dass der Mail-Kanal nichts entnimmt: Das Portal sendet. § 5 UWG greift erst beim eigenen Inserat. Die DSGVO-Haushaltsausnahme gilt nur für „ausschließlich persönliche oder familiäre Tätigkeiten" [12] und ist bei einer Kapitalanlage zweifelhaft **[ungeprüft, Rechtsauffassung]**; deshalb gilt Abschnitt 6.5 unabhängig davon, und `immo/recht.md` benennt für den 90 Tage gehaltenen Rohtext eine eigene Rechtsgrundlage.

## 6.7 Kostenkontrolle und Rückstand

Gefährlich ist die Rückkopplung: Ein Fehler erzeugt Wiederholungen, und Kosten fallen erst auf der Rechnung auf. **Die Tabelle trennt, was erzwungen wird, von dem, was nur beobachtet wird.**

| Bremse | Wert | Wirkung | Erzwungen? |
|---|---|---|---|
| Neue Objekte je Nachtlauf | 40 | Rest bleibt `neu` (T11) | **ja**, n8n schneidet das Bündel vor der Übergabe zu (I4) |
| Neue Objekte je Deltalauf | 15 | Rest bleibt `neu` | **ja**, ebenso über I4 |
| Gegenprüfungen je Lauf | Nachtlauf Erwartung 9, Deckel 10; Deltalauf Erwartung 4, Deckel 5 | Rest bleibt ungeprüft | **nein**, die Auswahl trifft der Lauf in der Sitzung; beobachtet über die Wochenrückschau |
| Aufrufe je Tag, ohne Deltalauf | Erwartungswert **89**, Deckel **90**, harte Grenze **100** | Abbruch mit Meldung an der harten Grenze | teilweise: 80 der 89 sind über I4 gebunden |
| Aufrufe je Tag, mit Deltalauf | Erwartungswert **123**, Deckel **125**, harte Grenze **150** | wie oben | teilweise: 110 der 123 sind über I4 gebunden |
| Aufrufe des lokalen Modells (S2) | `max_budget`, `rpm_limit`, `tpm_limit`, Modell-Weißliste je LiteLLM-Schlüssel [13] | Abweisung durch den Türsteher | **ja** |

**Herleitung.** Die zwei Modellaufrufe je Objekt sind in Kapitel 1 hergeleitet: ein gemeinsamer Extraktionsaufruf für die Prompts 2, 3 und 10, ein zweiter für die Besichtigungsfragen. Die Nachprüfungen rufen kein Modell (Kapitel 2). Also im Nachtlauf 40 mal 2 gleich 80 plus 9 Gegenprüfungen gleich **89**, im Deltalauf 15 mal 2 gleich 30 plus 4 gleich **34**, zusammen **123 als Erwartungswert** und 125 als Deckel.

**Wo die Durchsetzung endet, und was an ihre Stelle tritt.** LiteLLM steht vor dem Jetson und deckelt deshalb nur S2. Die Aufrufe von C1, C3 und C4 laufen in Cowork und berühren LiteLLM nie; eine Abrechnung je Lauf ist dort nicht bekannt **[ungeprüft]**. Erzwungen wird deshalb nicht die Aufrufzahl, sondern die **Eingangsmenge**: n8n übergibt niemals mehr als 40 beziehungsweise 15 Objekte, und damit sind 80 beziehungsweise 30 Extraktionsaufrufe eine strukturelle Obergrenze, kein Vorsatz. Alles, was darüber hinaus in der Sitzung geschieht, also Wiederholungen nach Fehlern und die Zahl der Gegenprüfungen, ist **beobachtet und nicht durchgesetzt**. Der einzige wirksame Hebel bleibt I4.

**Verhalten am Anschlag.** Bei Erreichen der harten Grenze bricht der Lauf ab. Er sendet eine Störungsmeldung mit der Zahl der unbearbeiteten Objekte, und die verbleibenden Objekte bleiben im Zustand `neu` und altern nach den Regeln aus Kapitel 2 weiter. **Eine automatische Anhebung der Grenze findet nicht statt.** Eine Anhebung ist eine Entscheidung mit Eintrag in `OFFEN.md`.

**Rückstandsliste.** Objekte, die durch keinen Zweig laufen, landen mit Grundcode in `rueckstand.jsonl`. Der Digest-Fuß nennt Anzahl und ältesten Eintrag, Einträge verfallen nach 30 Tagen. Erscheint ein Grundcode mehr als zehnmal in sieben Tagen, wird er ein Testfall.

## 6.8 Grenzen der Automatisierung

- **Mikrolage bleibt beim Menschen** (R12), und das Preisurteil bleibt ein Band ohne Verkehrswert (R5).
- **Rechtslage bewegt sich.** „Miete II" lag am 09.07.2026 in erster Lesung (F.A.Z., 02.09.2026), der Stand heute ist **[ungeprüft]**.
- **Der Aufrufdeckel endet an der Sitzungsgrenze.** Innerhalb einer Cowork-Sitzung zählt niemand mit.
- **Schwellen sind gesetzt, nicht gemessen.** Die Fangquote 0,8, die Saatrate 1 zu 5, die Regel „3 von 15" aus der Monatsblindprobe, der Hausgeldfaktor 0,70 und die Ziffernbilanz-Schwelle von drei sind Startwerte. **Termin ihrer Überprüfung:** nach **200 bewerteten Läufen oder spätestens am 31.03.2027**, was zuerst eintritt. C5 stellt dann jede Schwelle gegen die dann vorliegenden Messwerte, legt das Ergebnis in `immo/gold/schwellen-JJJJ-MM.json` ab und schlägt Änderungen über den Rückspiegel vor. Und was nie inseriert wird, taucht nie auf.

Nie sagen darf das System, ein Objekt sei „geprüft" oder ein Preis „fair". Es sagt: Das steht in der Anzeige, das fehlt, das widerspricht sich, hier lohnt eine Frage.

## 6.9 Anschluss

Zitatanker und Ziffernbilanz machen R1 und R3 maschinell prüfbar. Aus Kapitel 2 braucht der **Schemaschritt** das Vetorecht, also der n8n-Code-Knoten in Phase 1a und **C2** ab Phase 2, dazu **C3** das Vetorecht für den Kanarienzwilling nach R16 ab Phase 3; S1 braucht die Kanonisierung vor der Schwärzung durch S2. Jede Quelle aus Kapitel 3 trägt Abrufdatum und Frist aus Abschnitt 6.2. Aus Kapitel 4 dürfen nur geankerte Felder in Score und Filter; jedes K.o.-Kriterium braucht ein Phantomobjekt (T15, T21). In Kapitel 5 trägt der Digest-Kopf die fünf Zahlen aus 5.7 und keine weitere, der Fuß die Rückstandsliste; Ziffernbilanz, Kanarienzwilling und Rechtsstand stehen in der Wochenrückschau. Kapitel 7 verschiebt vier Tests bewusst nach vorn.

**Belege.** [1] github.com/promptfoo/promptfoo. [2] huggingface.co/datasets/deepset/prompt-injections. [3] gmodg.bund.de, GEG-Portal, Immobilienanzeigen. [4] anthropic.com/research/prompt-injection-defenses. [5] github.com/microsoft/presidio. [6] immobilienscout24.de/agb/nutzungsagb.html. [7] openjur.de/u/691648.html, BGH 30.04.2014, I ZR 224/12. [8] dejure.org/gesetze/UrhG/87b.html. [9] immobilienscout24.de/robots.txt. [10] datev-magazin.de/148086. [11] artificialintelligenceact.eu/article/50. [12] dsgvo-gesetz.de/art-2-dsgvo. [13] docs.litellm.ai/docs/proxy/virtual_keys.

---

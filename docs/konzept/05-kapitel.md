# Kapitel 5. Betrieb

Geschrieben gegen Kapitel 1 bis 4. Belege abgerufen 07.09.2026. Zwei Sätze tragen das Kapitel: Der Moment schlägt die Uhrzeit, der Lauf hängt also an der Uhr und die Zustellung nicht. Und der gefährlichste Ausfall ist der halbe, denn eine geänderte Mailvorlage meldet sich nicht.

## 5.1 Zeitplan

Jeder n8n-Workflow bekommt die Zeitzone **ausdrücklich** auf `Europe/Berlin`, sonst gilt „The default is `America/New York` for self-hosted instances" ([n8n](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/)): sechs Stunden daneben.

**Bei Cowork ist nicht nur die Zeitbasis offen, sondern die freie Cron-Ausdrucksform selbst.** Die Hilfeseite nennt ausschließlich „hourly, daily, weekly, on weekdays, or manually" ([Anthropic](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)); Kapitel 2 beobachtete am 06.09.2026 einen in UTC angenommenen Cron-Ausdruck. Beides bleibt **[ungeprüft]**. Deshalb trägt jede Cowork-Zeile ihren Rückfall, und der Zeitplan bleibt lauffähig, auch wenn kein Cron-Ausdruck angenommen wird.

| Was | Ort, Ausdruck | Ortszeit | Rückfall ohne Cron |
|---|---|---|---|
| S1 bis S3 Zulauf | n8n `*/15 * * * *` | laufend | entfällt, n8n kann Cron |
| Nachtlauf C1 bis C4, 40 neue Objekte | Cowork `0 2 * * *` | 03:00, 04:00 | „daily" |
| S4 Ausgangsfenster | n8n `*/5 7-20 * * *` | 07:00 bis 20:55 | entfällt |
| S5 Wächter | n8n `10 7 * * *` | 07:10 | entfällt |
| Deltalauf werktags, 15 neue Objekte | Cowork `0 14 * * 1-5` | 15:00, 16:00 | „on weekdays" |
| C5 Pflegelauf | Cowork `0 6 1 * *` | vormittags | „daily", der Workflow prüft als ersten Schritt das Datum und bricht ab, wenn nicht der Erste ist |

15 Minuten statt 5, weil Portale höchstens stündlich schieben (Kapitel 3) und der bestehende Paket-Workflow unberührt bleibt. **Keine Zeitumstellung:** Der Nachtlauf trägt bewusst keine Ortszeit und darf über die Sommerzeit wandern, weil nicht er zustellt, sondern S4.

**Eine Uhrzeit, eine Bedeutung:** 07:00 ist Ende der Nachtruhe und Beginn des Ausgangsfensters, 21:00 ihr Beginn und sein Ende. Der Zustand ist die Warteschlange.

## 5.2 Idempotenz und Wiederanlauf

**I1 Drei Schlüssel.** `portal + objekt-id` entdoppelt den Zulauf, die **Cluster-ID** aus Kapitel 3 bindet Portale zusammen, der **Meldeschlüssel** entscheidet über das Senden: `cluster-id + ereignisart + signatur` (Kapitel 4, F4). Bleiben Feldtabelle und Versionen gleich, geht nichts raus (R14).

**I2 Transaktionale Ausgangstabelle.** C4 schreibt alle Zeilen auf `offen`, bevor die erste rausgeht. S4 quittiert je Zeile: Bricht der Versand nach der dritten von acht ab, folgen die fünf übrigen.

**I3 Grabstein mit Übernahmefrist.** Jeder Lauf schreibt zuerst `lauf_id, start, status=laufend`. Findet er eine fremde `laufend`-Zeile älter als **90 Minuten**, erklärt er sie für tot und übernimmt. Die Frist ist absichtlich dieselbe wie die Bündelpacht aus Kapitel 2: Ein Lauf darf nicht früher für tot erklärt werden als sein eigenes Bündel, sonst arbeiten zwei Läufe am selben Bündel. **Der übernehmende Lauf schreibt nie in eine `ausgang`-Zeile, die schon `offen` oder quittiert ist**, sondern erzeugt neue Zeilen nur für unbeschriebene Meldeschlüssel; deshalb erzeugen zwei parallel gestartete Läufe einen Digest und nicht zwei. healthchecks.io meldet nach außen, der Grabstein löst nach innen auf, denn Cowork stellt keinen Wächterdienst.

**I4 Obergrenze vorne, und sie ist der einzige erzwungene Deckel.** n8n sortiert vor dem ersten Modellaufruf nach `portalfilter` und Kaufsummen-Deckel (R4) und schneidet das Bündel auf die Werte aus Kapitel 2 zu: **40 neue Objekte im Nachtlauf, 15 im Deltalauf**, dazu die fälligen Nachprüfungen ohne Modellaufruf; der Rest bleibt `neu`. Weil der Schnitt vor der Übergabe an Cowork geschieht, ist die Zahl der Extraktionsaufrufe strukturell gebunden und nicht nur beobachtet. Diese Zahlen sind die Bezugsmenge in Abschnitt 5.9 und der einzige wirksame Kostenhebel. Davor schützt *Remove Duplicates*, „by default 10,000 items" ([n8n](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.removeduplicates/)). Abnahme: zweimal gleiche Eingabe, eine Meldung.

## 5.3 Dedup über Portale hinweg

Die Blockbildung leistet Kapitel 3 mit dem Cluster aus Postleitzahl, Fläche, Zimmerzahl und Baujahrzehnt, einschließlich der beiden Nachbarfächer. Dieses Kapitel entscheidet den Zweifelsfall gleicher Block, andere Portal-ID.

| Merkmal | übergreifend | portalintern |
|---|---|---|
| dHash Anhangbilder, Hamming höchstens 6 | 30 | 30 |
| Wohnfläche plus minus 1,5 m² | 25 | 25 |
| Textsilhouette, MinHash 5-Wort-Schindeln ab 0,55 | 20 | 20 |
| Baujahr plus minus 2 Jahre | 10 | 10 |
| Etage, Zimmerzahl | 8, 7 | 8, 7 |
| Bild-URL-Pfadsignatur | **0** | 30 |
| **Summe** | **100** | **130** |

**Ab 70 Punkten** gilt `MEHRFACHLISTUNG`, **45 bis 69** erzeugt eine Dublettenfrage, **unter 45** gelten die Einträge als verschieden. Die Toleranzen von 3,0 m² und 4 Jahren wirken nur, weil die Blockbildung die Nachbarfächer mitprüft; ohne diese Erweiterung fänden sich die Vergleichspartner an jeder Fachgrenze nicht. Der Preis zählt null, denn er steht mal mit, mal ohne Provision; die Adresse fehlt, weil die Hausnummer oft fehlt und S2 sie ohnehin entfernt (R19).

**Die Bild-URL ist eine Zeichenkette, kein Bild.** Portalintern erkennt sie die Wiedereinstellung unter neuer ID, übergreifend sagt sie nichts. Gerechnet wird nur über **Anhangbilder**, denn R20 verbietet URL-Abrufe aus Mailinhalten; Werkzeug ist `imagehash`, BSD-2-Clause, 3,9 k Sterne ([GitHub](https://github.com/JohannesBuchner/imagehash)). Ob Portalmails Bilder anhängen, bleibt **[ungeprüft]**.

**Ausfallpfad, nachgerechnet.** Ohne dHash bleiben 70 Punkte; die Schwelle ist dann nur erreicht, wenn alle fünf übrigen Merkmale passen. Schreiben zwei Makler zwei Texte, fällt zusätzlich die Textsilhouette weg: 50 Punkte, also eine Frage im Digest. Fehlt statt des Textes das Baujahr, sind es 60. Der Mechanismus fällt nicht aus, er wird langsamer. Verknüpft wird, nie verschmolzen (R15).

**Die Schwelle wird gemessen.** Jede beantwortete Dublettenfrage liefert ein beschriftetes Paar. Ab **40 Paaren** rechnet C5 monatlich für jeden Punktwert von 40 bis 90 beide Fehlerarten aus und minimiert `2 × Fehlverschmelzungen + Fehltrennungen`: Eine falsche Verschmelzung macht ein Objekt unsichtbar, eine falsche Trennung zeigt es doppelt. Der Vorschlag läuft über den Rückspiegel.

## 5.4 Zustand: Fristen und Rückspielprobe

Kapitel 2 wählt die Ablage, dieses Kapitel die Fristen. Ein zweites Archiv des Rohtexts entsteht nicht: Das IMAP-Postfach ist selbst idempotent und durchsuchbar. Dropbox trägt geschwärzte Großanhänge und Referenz-PDFs, **keine Dossiers**: Die gehören trotz fehlender Hausnummer (R19) in den Zweig `betrieb`.

**Die Artefakt-Datenbank ist kein zweiter Zustandsspeicher, aber ein möglicher Rückkanal.** Als Zustandsspeicher ist sie verworfen, weil n8n sie nicht bedient und daraus eine zweite Wahrheit entstünde. Als **Anzeige- und Antwortfläche** für den Block „Widerspruch der Prüfung", die Dublettenfrage und die Objektbiografie ist sie dagegen die natürliche Darstellung, denn diese drei Dinge brauchen mehr Kontext, als eine Telegram-Karte trägt. Der Zustand bliebe dabei allein in n8n; die Seite liest und schreibt über denselben Rückkanal wie Telegram. Diese Option steht als E14 zur Entscheidung und widerspricht der Verwerfung als Zustandsspeicher nicht.

**Eine Datenklasse ist unersetzlich.** Objektdaten holt man aus dem Postfach neu, Bewertungen rechnet C2 neu, Christophs Urteile nicht. Der Nachtlauf führt deshalb täglich alle `knopf`-Ereignisse nach `immo/journal/JJJJ-MM.jsonl` aus: Cluster-Hash, Ereignis, Zeit, Antwort, Ablehnungscode, Versionsstände, keine Adresse. Bei 640 Byte je Zeile (Kapitel 2) und zehn Urteilen täglich sind das **2,3 MB im Jahr**.

**Rückspielprobe, monatlich.** Eine Sicherung, die nie zurückgespielt wurde, ist eine Behauptung. Am Ersten baut C5 aus dem Journal eine Schattentabelle und vergleicht sie mit dem Betrieb; jede Abweichung ist ESK2. **Dauerhaft null Abweichungen bei null Zeilen ist ebenfalls ein Befund:** Dann schreibt niemand.

## 5.5 Benachrichtigung

**Telegram** trägt Digest, Sofortmeldung und Knöpfe, **E-Mail** die Wochenrückschau, **Home Assistant** eine stille Statuskachel mit fester `notification_id`, die „overwrites the notification if one with that ID already exists" ([HA](https://www.home-assistant.io/integrations/persistent_notification/)). **Die Nachtruhe von 21:00 bis 07:00 ist hart**, auch für Störungen; S4 setzt die Kachel und holt um 07:00 nach. Die einzige Ausnahme ist der Eilpfad bei Fristen unter sieben Tagen (Kapitel 2.6); jede Durchbrechung steht am Morgen namentlich im Digestkopf.

**Zustellauslöser statt Uhrzeit:** S4 sendet, sobald die Person-Entität in Home Assistant `home` meldet, frühestens 07:00, spätestens 11:00; ein `rest_command` ruft den Webhook ([HA](https://www.home-assistant.io/integrations/rest_command/)).

```
IMMO 07.09.2026 07:34 MESZ | Lauf 341
Quellen 19/21 gruen | Felder is24 11,4/12 | Fundzeit 4 h 10 | Antworten 62 % | 0,88 USD/Vorschlag
ESK1 Rueckspielprobe 43 Tage alt

VORSCHLAG (1 von 19, 0 gekuerzt)
1 VS Nippes 96 qm 3,5 Zi Bj 1911, 615.000 EUR Kaufpreis = 6.406 EUR/qm
  Gesamtaufwand 689.230 EUR (Provision 3,57 % Rueckfall)
  Boden 71, Decke 79, Belegdichte 0,78 | IRW 5.900-7.300, Stichtag 01.01.2026 [R5]
  Es fehlt: Erhaltungsruecklage, Heizungsbaujahr, Provision [R7]
  -> [passt] [zu teuer AB3] [Zustand] [Bauchgefuehl] [gesehen]
NACHFASSEN 2 NF Suedstadt 104 qm | PREIS_RUNTER 2 Klettenberg 699.000
```

```
IMMO 07.09.2026 07:34 MESZ | Lauf 341, Nachricht 2 von 2
DUBLETTE? 1 und Fund vom 05.09., 58 Punkte -> [gleich] [verschieden]
BLINDPROBE 4 Kalk 84 qm -> [passt] [nicht]
```

Die Zahlen im Muster sind erfunden. Der Kopf ist Pflicht (R17) und trägt genau die fünf Zahlen aus Abschnitt 5.7, die dritte Zeile nur bei Eskalation; Kanarienzwilling, Ziffernbilanz, DLQ, Rechtsstand und Reaktionszeit stehen in der Wochenrückschau und nie im Kopf.

**Zwei Grenzen, eine belegt und eine gesetzt.** Belegt ist die Zeichengrenze: Der Parameter `text` der Methode `sendMessage` nimmt „Text of the message to be sent, 1-4096 characters after entities parsing" ([Referenz](https://gramio.dev/telegram/methods/sendmessage)). Gesetzt ist die Objektzahl: **höchstens fünf ausführlich dargestellte Objekte je Nachricht**, also Vorschläge und Nachfassobjekte mit eigenem Block. Einzeilige Nennungen wie `PREIS_RUNTER` zählen nicht mit, und Dublettenfrage sowie Blindprobe stehen in einer zweiten Nachricht, damit sie nicht hinter dem Rang verschwinden. Qualifizieren sich mehr, hebt der Lauf die Tagesschwelle an und schreibt das hin, denn ein stillschweigend gekürzter Digest wäre Datenverlust. Reißt eine Nachricht dennoch die 4096 Zeichen, teilt S4 sie und nummeriert beide Teile.

**Jede Rubrik im Muster hat genau einen erklärenden Absatz.** `VORSCHLAG` führt die Objekte mit Status `VS`, sortiert nach Boden. `NACHFASSEN` führt `NF` und `UV`; jedes dieser Objekte trägt einen **Vorgangszustand** `offen`, `gefragt` oder `beantwortet` und eine **Frist von sieben Tagen** ab Zustellung. Verstreicht sie ohne Knopfdruck, wandert das Objekt in die Ablage mit dem Grund „Nachfassfrist verstrichen", und der Digestfuß nennt die Anzahl. `PREIS_RUNTER` führt die Ereignisart aus Kapitel 3 mit altem und neuem Preis. `DUBLETTE?` führt Paare im Band 45 bis 69 aus Abschnitt 5.3 und liefert mit jeder Antwort ein beschriftetes Paar für die Schwellenmessung.

**Die Tagesblindprobe.** *Herkunft:* Gezogen wird ein von C2 knapp verworfenes Objekt, also eines mit Decke zwischen 45 und 55, gleichverteilt aus der Ablage des Vortages. *Darstellung:* wie ein Vorschlag, aber ohne Begründung, ohne Punktwerte und ohne Ablehnungscode. *Häufigkeit:* genau eines je Digest. *Auswertung:* Zwei Antworten „nicht" sind Rauschen. **Zwei Antworten „passt" in vier Wochen sind ein Profilfehler**; C5 erhält eine Meldung, nennt das treibende Kriterium und schlägt über den Rückspiegel eine Änderung vor. Die davon verschiedene Monatsblindprobe über zwanzig Objekte steht in Kapitel 6.

**Sofortmeldung:** Auslöser nach Kapitel 2, höchstens zwei am Tag. **Reaktionszeit** ist der Median zwischen Zustellung einer Sofortmeldung und dem ersten Knopfdruck darauf; liegt sie zwei Wochen lang über 72 Stunden, schaltet der Eilkanal ab.

## 5.6 Human-in-the-loop

Die Knöpfe sind eine Telegram-Inline-Tastatur, der Rückkanal ein **Telegram Trigger**, Ereignis „Callback Query" ([n8n](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.telegramtrigger/)). *Send and Wait* scheidet aus, aber nicht aus Mangel an Antwortarten: Der Knoten bietet Approval, Free Text und Custom Form ([n8n](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/message-operations/)). Approval trägt nur eine Ja-Nein-Entscheidung und liefert damit keinen Grundcode, Free Text und Custom Form verlangen Tippen; ein Formular füllt am Bahnsteig niemand aus. Gebraucht wird eine Auswahl aus objektbezogenen Knöpfen in einer Berührung, und die liefert nur die Inline-Tastatur. Jeder Klick liefert Entscheidung **und** Grundcode (Kapitel 2).

**Knöpfe aus dem Objekt, nicht aus fester Liste.** Neben `passt` und `gesehen` zeigt die Karte die **zwei schwächsten Kriterien dieses Objekts** mit dem Ablehnungscode aus Kapitel 4. Ein generisches „passt nicht" ist wertlos, ein Freitextfeld füllt niemand am Bahnsteig aus. `Bauchgefuehl` bleibt das Ventil.

**Schweigen ist ein eigener Zustand**, nämlich `beobachten`, nie `passt nicht`. Wer Schweigen als Ablehnung liest, lernt die Kalenderlage seines Nutzers und nennt das Geschmack.

| Antwortquote über 14 Tage | Folge |
|---|---|
| unter 0,40 | C5 meldet die dünne Stichprobe, keine Kalibrierung |
| 0,50 bis 0,60 | zwei Nachjustierungen, danach Neumessung über 14 Tage |
| unter 0,50 nach der zweiten Nachjustierung | Phase 2 gilt als nicht abgenommen (Kapitel 7) |

**Der Rückspiegel ist das Freigabetor.** Jeder Vorschlag von C5 kommt als Pull Request mit Gegenrechnung an 90 Tagen Log: elf Objekte mehr gesehen, vier nicht mehr; null Modellaufrufe (R3).

## 5.7 Beobachtbarkeit

**Genau fünf Zahlen stehen im Digest-Kopf, und diese Liste steht nur hier.** Andere Kapitel zitieren sie und ergänzen sie nicht.

1. **Quellenbilanz**, grüne Kanäle gegen alle (Kapitel 3). Ein Digest darf „keine Treffer" nur melden, wenn alle Kanäle grün sind. Der Erwartungswert je Quelle ist der **Median desselben Wochentags aus den letzten acht Wochen**, nicht der Median aller Tage; sonst löst jeder Sonntag einen Alarm aus. Gemeldet wird erst, wenn **zwei Fenster in Folge unter der Hälfte** dieses Erwartungswerts liegen.
2. **Feldfüllquote** je Portalvorlage: Anteil der zwölf Kernfelder gegen den gleitenden Median der letzten 20 Mails derselben Vorlage; minus 15 Punkte heißt geänderte Vorlage, bevor ein Feld ganz fehlt. Sie ist der Wächter gegen den halben Ausfall.
3. **Fundzeit** nach Kapitel 2.
4. **Antwortquote** über 14 Tage.
5. **Kosten je Vorschlag** nach Abschnitt 5.9. Nenner ist die Zahl der Objekte mit dem Code `VS`, nicht die Zahl der Digestzeilen; beide Zählungen stehen in der Wochenrückschau nebeneinander (Abschnitt 6.1).

Alles Übrige, also Ziffernbilanz, Kanarienzwilling, Rechtsstand, DLQ und Reaktionszeit, steht in der Wochenrückschau. Die dritte Kopfzeile trägt Eskalationen und ist keine sechste Zahl.

**Beim Umschalten auf das lokale Modell auf dem Jetson gilt eine Positivliste.** Das lokale Modell füllt nur Zimmerzahl, Etage, Baujahr, Stadtteil und Ausstattung. Es füllt **nie** Preis, Wohnfläche, Hausgeld, Erhaltungsrücklage oder Energiekennwert; diese Felder bleiben auf **„nicht ermittelbar", Grund: Vorlagenwechsel** (R6). Gefüllte Felder tragen die Marke `modell` und zählen nicht in die Belegdichte nach R8. Damit erscheint kein modellgefülltes Zahlenfeld in der Preisplausibilität. Dieselbe Positivliste gilt in der Variante V0 aus Abschnitt 2.10 dauerhaft, denn dort ist das lokale Modell der einzige Extraktor.

**Die Positivliste sperrt das Modell, nicht den Parser.** Die sieben ausgezeichneten Felder der Portalvorlage aus Kapitel 3.3, also Objekt-ID, Kaufpreis, Wohnfläche, Grundstücksfläche, Zimmerzahl, Ort und Energieeffizienzklasse, entstehen in einem deterministischen Schritt mit Zitatanker. Sie tragen deshalb nie die Marke `modell` und zählen in die Belegdichte, auch dann, wenn dasselbe Feld auf der Sperrliste des Modells steht: Verboten ist die Herkunft aus dem Modell, nicht der Feldname. Die Zimmerzahl kann folglich aus zwei Wegen kommen; **gewinnt immer der Parserwert**, und weicht der Modellwert ab, wird er nach R15 gemeldet und nicht gemittelt.

**Was daraus für V0 folgt, in Zahlen.** Erreichbar sind dort höchstens **0,53** in Profil A und **0,78** in Profil B; die Herleitung und die Schwelle 0,35 stehen in Abschnitt 4.4. Beispiel A aus Abschnitt 4.6 käme in V0 also auf 0,53 statt auf 0,72, und die Differenz ist genau das Gewicht der Bruttorendite, deren Jahreskaltmiete keine Parserzeile führt.

## 5.8 Runbook

Zu jeder Störung steht die verlockende falsche Handlung; die Datei ist `immo/runbook.md`.

| Störung | Erste Handlung | Nicht tun |
|---|---|---|
| Quelle still (Kapitel 3) | fehlt die Mail, oder wirft der Parser sie weg? | kein Ersatzabruf über die Portalseite (Q2, Q5), Quelle nicht löschen |
| Feldfüllquote minus 15 | Parser anpassen, Schemaversion hochzählen | Quarantäne nicht leeren, sie ist Beweis |
| Lauf bricht ab | `ausgang` gefüllt und unquittiert heißt Zustellfehler: S4 starten | nicht blind neu starten, sonst kommt der Digest doppelt |
| Journal weicht ab oder ist leer | Zeilenzahl gegen Ereigniszahl halten | Betriebstabelle nicht überschreiben |
| Kanarienzwilling gescheitert (ESK2) | Lückenliste gegen das Zwillingsexposé halten, Feld für Feld | nicht mit Warnbanner freigeben |
| Bündel dreimal in `dlq` (ESK2) | eine Zeile von Hand durch C1 schicken und den Fehler lesen | Bündel nicht löschen, es ist der einzige Beweis |
| Data Table über 80 Prozent | Ausfuhr vorziehen, Frist von 400 auf 200 Tage senken | `N8N_DATA_TABLES_MAX_SIZE_BYTES` nicht erhöhen |
| Rückspielprobe älter als 40 Tage (ESK1) | Probe von Hand auslösen, Ergebnis in `runbook.md` | Frist nicht verlängern |
| Kosten je Vorschlag über der Alarmschwelle | Profil kürzen, `treffer_pro_woche` gegen die Messung halten | Deckel 40 und 15 nicht anheben |

Zum Monatslauf: Cron verknüpft beide Tagesfelder mit ODER, „If both fields are restricted (i.e., aren't \*), the command will be run when either field matches the current time" ([crontab(5)](https://manpages.debian.org/testing/cron/crontab.5.en.html)), der Wochentag bleibt deshalb `*`. Die Data Table ist „limited to 200 MiB", warnt ab 80 Prozent und lehnt darüber Schreibvorgänge ab ([n8n](https://docs.n8n.io/build/work-with-data/data-tables/)). Totmann ist healthchecks.io, gratis bei „Monitor 20 jobs" ([Preise](https://healthchecks.io/pricing/)). Jede in den Abschnitten 5.1 bis 5.7 eingeführte Eskalation ESK1 bis ESK3 hat damit eine Runbookzeile.

## 5.9 Kosten je Lauf

Bezugsmenge ist das Laufmodell aus Kapitel 2: **ein Nachtlauf mit 40 neuen Objekten je Tag und, sofern eingeschaltet, ein Deltalauf mit 15 neuen Objekten an Werktagen.** Preise je Million Token belegt ([Preisseite](https://claude.com/pricing)): Sonnet 5 zwei ein, zehn aus; Opus 5 fünf ein, 25 aus. **Die Tokenmengen sind eine Schätzung**, jede Zeile ist nachrechenbar.

| Posten | Modell | Ein | Aus | USD |
|---|---|---|---|---|
| C1 Leser, 40 Objekte | Sonnet 5 | 160k | 32k | 0,64 |
| C2 Rechner | keins | – | – | 0,00 |
| C4 Aufbereiter | Opus 5 | 50k | 14k | 0,60 |
| **Nachtlauf Phase 2, ohne C3** | | | | **1,24** |
| C3 Blindprüfer | Sonnet 5 | 45k | 9k | 0,18 |
| **Nachtlauf ab Phase 3, mit C3** | | | | **1,42** |
| **Deltalauf Phase 2**, 15 Objekte | C1 60k/12k, C4 20k/6k | | | **0,49** |
| **Deltalauf ab Phase 3**, 15 Objekte | zusätzlich C3 20k/4k | | | **0,57** |

**Zwei Spalten, weil C3 erst in Phase 3 läuft.** Die Kostenabnahme A2.8 fällt in Phase 2 und misst gegen die Zeile **1,24 USD**; eine Messung gegen 1,42 USD träfe garantiert die Abweichungsschwelle, weil die geprüfte Rolle noch nicht existiert.

| Betriebsbild | USD je Monat |
|---|---|
| Phase 2, nur Nachtlauf, 30 Läufe | **37,20** |
| Phase 2, mit Deltalauf, 30 plus 22 Läufe | 47,98 |
| Ab Phase 3, nur Nachtlauf | **42,60** |
| Ab Phase 3, mit Deltalauf | **55,14**, davon 12,54 für den Deltalauf |

**Die Kosten je Vorschlag sind eine Spanne, weil die Trefferzahl eine ist.** Die Profile nennen `treffer_pro_woche` mit `[2,12]` für A und `[1,6]` für B, zusammen 3 bis 18 je Woche und damit **13,0 bis 78,0 Vorschläge im Monat**. Ein Vorschlag ist ein Objekt mit dem Code `VS`; die höhere Zahl der Digestzeilen aus Abschnitt 6.1 ist eine andere Größe und schließt diese ein. Daraus folgt:

| Betriebsbild | USD je Vorschlag |
|---|---|
| Phase 2, nur Nachtlauf | 0,48 bis 2,86 |
| Ab Phase 3, nur Nachtlauf | 0,55 bis 3,28 |
| Ab Phase 3, mit Deltalauf | 0,71 bis 4,24 |

**Die Steuerregel bezieht sich auf die Messung, nicht auf einen festen Eurobetrag.** Eine Schwelle von 1 USD wäre am ersten Betriebstag gerissen, allein wegen der Spanne der Profile. Die Regel lautet deshalb: **Alarm, wenn die Kosten je Vorschlag den in A2.8 gemessenen Wert um mehr als die Hälfte übersteigen**, gemessen über vier Wochen. Dann ist nicht das Modell zu teuer, sondern das Profil zu weit; der Hebel ist I4. **[ungeprüft]:** ob Cowork nach diesen Listenpreisen oder gegen das Abonnement abrechnet.

**In V0 hat die Kennzahl denselben Nenner und einen anderen Zähler.** `treffer_pro_woche` steht im Profil und nicht in der Laufzeit; die Spanne 13,0 bis 78,0 Vorschläge im Monat gilt deshalb in beiden Varianten. Erreichbar ist der Code `VS` dort, weil Zeile 6 der Statustabelle in V0 gegen 0,35 misst (Kapitel 4.4). Der Zähler ist ein anderer: In V0 rechnet nur das lokale Modell auf eigener Hardware, es fällt kein Preis je Token an, und die Tabelle oben gilt erst ab Phase 2. Gemessen wird in V0 deshalb der **Stromverbrauch je Vorschlag als Schätzwert [ungeprüft]** und die Zahl der betreuten Cowork-Sitzungen im Monat; die Alarmregel bleibt dieselbe, sie bezieht sich auf den in der ersten Betriebswoche gemessenen Wert.

**Kostenabnahme nach Woche 1 von Phase 2.** Am siebten Tag nach dem ersten bewertenden Lauf werden die gemessenen Ein- und Ausgabemengen aus sieben Läufen gegen die Zeile „Nachtlauf Phase 2" gestellt. Weicht eine Zeile um über 50 Prozent ab, wird die Schätzung durch den Messwert ersetzt und die Alarmschwelle neu gesetzt. Das Datum und die Messwerte stehen in `immo/runbook.md`; ab diesem Datum trägt die Tabelle keine Schätzung mehr.

## 5.10 Grenzen

Die Zeitbasis und die Ausdrucksform von Cowork sind unbelegt; fallen sie anders aus, verschiebt sich der Zeitplan, nicht das Verfahren. Die Feldfüllquote braucht 20 Mails je Vorlage und sieht einen Formatwechsel in Woche 1 nicht. Die Entdopplung ohne Bildbytes verliert Dubletten mit neuem Text. Die Werte 70, 45, minus 15 und 40 bleiben Vorschläge, und das Journal sichert Urteile, keine Objekte. Die Trefferspanne aus `treffer_pro_woche` ist selbst eine Annahme; erst die Messung in Phase 2 macht die Kosten je Vorschlag zu einer Zahl.

## 5.11 Anschluss

Aus Kapitel 1 tragen R14 bis R20 Meldeschlüssel, Entdopplung, Digestkopf, Veto und Adressauflösung. Aus Kapitel 2 kommen Zeitplan, Ausgangstabelle, Laufmodell, Fundzeit und Speicherwahl; dieses Kapitel ergänzt Grabstein, Fristen, Rückspielprobe und Digestformat. Aus Kapitel 3 speisen die Kanalzustände Quellenbilanz und Runbook. Aus Kapitel 4 werden die Statuscodes zu Digest-Rubriken. Für Kapitel 6 und 7 gilt: Journal und Digest tragen nur Cluster-Hashes und Straßenabschnitte; Phase 1 braucht Zeitplan, Ausgangstabelle, Journal und healthchecks.io.

---

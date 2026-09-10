# Kapitel 7. Umsetzungsplan

Geschrieben gegen Kapitel 1 bis 6. Rollen nach Kapitel 2, Kanalwächter nach Kapitel 3.

## 7.1 Sechs Bauregeln

- **U1 Der Kanal vor dem Urteil.** Zuerst entsteht der Weg vom Portal zur Ablage; der Zulauf sammelt die Objektbiografie (R14), die nach Kapitel 2 nicht wiederherstellbar ist. Ein gescheiterter Lauf verzögert das Urteil, verliert kein Angebot.
- **U2 Abgenommen wird ein Ausfall, kein Erfolg.** Eine Phase gilt erst, wenn ein erzeugter Ausfall fristgerecht auffällt.
- **U3 Drei Tore je Phase.** Abnahmetests, Erlebniskennzahl, Abbruchkriterium, jedes mit Folge.
- **U4 Der Maßstab entsteht vor dem System.** Christophs Urteil steht fest, bevor ein Score sichtbar wird.
- **U5 Rückbau wird geübt.** Jede Phase endet mit einer Rückbauprobe: Ein Schalter legt sie in unter zehn Minuten still, mit Stoppuhr gemessen, Ergebnis und Datum in `immo/runbook.md`.
- **U6 Nutzbar schlägt vollständig.** Keine Phase endet ohne ein Ergebnis, das den Alltag besser macht als der Zustand davor. Die erste Phase mit Zulauf liefert deshalb bereits eine bewertete Nachricht, nicht nur eine Sammlung.

**U6 ordnet den Plan neu.** Ein Zulauf, der nur sammelt, ist für Christoph weniger wert als die Portalmails, die er ohnehin bekommt. Deshalb entsteht zuerst die **minimale Variante V0 aus Abschnitt 2.10** als Phase 1a: eine Laufzeit, ein Workflow, eine bewertete Telegram-Karte. Erst danach folgen Wächter und Messphase (Phase 1b) und, falls E0 so entschieden wird, der Vollbetrieb mit den Cowork-Rollen (Phase 2).

## 7.2 Die Phasen

Phase 0 (1 Woche): Profile, Normregister, Postfach, Variantenentscheid. Phase 1a (1 Woche): nutzbare Karte aus einer Laufzeit. Phase 1b (14 bis 21 Tage): Wächter, Messphase, Handzählung. Phase 2 (3 Wochen, nur bei Variante V2): C1, C2, C4, Referenzband, Digest, Dossier. Phase 3 startet beim ersten ernsthaften Objekt, nach Abnahme von Phase 2.

**Was Phase 1a schon liefert und was noch fehlt.** Das Ergebnis von Phase 1a ist das **Kurzdossier**: der Dossierkopf aus Kapitel 4.9 und die Abschnitte Urteil, Zahlen mit Beleg, Lücken A und B, „Was ich nicht weiß" und Herkunft. Es fehlen die beiden Abschnitte, die C4 in Phase 2 ergänzt: die Fragenliste nach Hebel mit Punktgewinn als Spanne und die Preiszeile beider Spuren. Alle Abnahmen der Phase 1 beziehen sich deshalb auf Karte und Kurzdossier, nicht auf das volle Dossier; keine Abnahme nennt einen Baustein, der erst später entsteht.

### Phase 0 Definition

**Die Sortierprobe ersetzt die Befragung.** Christoph sortiert zwanzig Inserate in „hinsehen" und „nicht hinsehen", ohne Zahlen, mit laufender Uhr; danach rechnet `profil-a.yaml` nach. Weil der teure Fehler der nicht gezeigte Treffer ist (Kapitel 2, B2), gilt eine unsymmetrische Regel: **kein „hinsehen"-Objekt unter der Meldeschwelle, höchstens 30 Prozent der verworfenen darüber.** Als Anteil trägt die Regel bei jedem Sortierverhältnis.

- **A0.1** Pull Request mit `basis.yaml` und `profil-a.yaml`, Lint aus Kapitel 4 grün, einschließlich der Invariante über die Bezugsgrößen; Normregister, Regelliste und Belegschrank liegen vor.
- **A0.2** Die Sortierprobe hält beide Teile.
- **A0.3 Versiegelte Rangliste (U4).** Zwölf von Christoph gerankte Inserate, je Platz ein Satz, in `immo/gold/rangliste.json`, Zeitstempel vor dem ersten Scoring-Lauf, versiegelt bis A2.2.
- **A0.4 Goldkorpus angelegt.** Die 28 synthetischen Fälle aus Kapitel 6 liegen mit ihrer Kategorieverteilung in `immo/gold/`; `promptfoo` läuft lokal und findet alle 28.
- **A0.5 Taktprobe.** Sieben Tage Zeitstempel aus einer geplanten Aufgabe. Belegt sind nur die Stufen hourly bis manually und eine eigene Sitzung je Lauf ([Anthropic](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)); freie Cron-Ausdrücke und Zeitbasis bleiben **[ungeprüft]**. Folge vorab: *pünktlich* Zeitplan aus Kapitel 5, *verspätet* n8n taktet, *sonst* Handauslösung.
- **A0.6 Schreibprobe.** Dieselbe Datei ohne und mit veralteter Prüfsumme schreiben; erwartet werden zwei Fehler und kein Verlust. Entfällt, wenn E0 auf V0 fällt und kein Briefkasten entsteht.
- **A0.7 Ausfallprobe.** Eine Testmail an die Plus-Adresse kommt über IMAP an; dann falsches Kennwort, der Fehler-Workflow meldet binnen 15 Minuten mit Knotennamen.
- **A0.8 Rückbauprobe.** Ein Schalter legt Phase 0 in unter zehn Minuten still, mit Stoppuhr gemessen, ohne Datenverlust; Datum in `immo/runbook.md`.
- **A0.9 Variantenentscheid.** E0 ist gefallen und mit Datum in `OFFEN.md` protokolliert, samt der Bedingung, unter der die Entscheidung neu geprüft wird. Das Feld `laufende_variante` in `basis.yaml` trägt den Beschluss, und damit steht fest, welcher Wert aus `belegdichte_min` gilt.

**Tore:** Christoph erklärt in einem Satz, was ein Treffer ist, und die Sortierprobe widerspricht nicht; scheitert sie zweimal, fallen E1, E2 und E4 neu.

### Phase 1a Nutzbares Ergebnis aus einer Laufzeit

Ein Portal, drei Suchaufträge, ein n8n-Workflow. Der Workflow holt das Postfach ab, kanonisiert, schwärzt auf dem Jetson, ruft über LiteLLM das lokale Modell mit dem Extraktionsschema aus Kapitel 4, rechnet Score, Zitatanker und Belegdichte in einem Code-Knoten, schreibt in die Data Table und sendet eine Telegram-Karte mit Inline-Tastatur. Das Referenzband ist eine von Hand übertragene CSV je Stadtteil im Belegschrank. **Derselbe Code-Knoten führt die Schemaprüfung und zieht damit das Veto nach R18**, solange C2 nicht existiert. **Die Belegdichte misst gegen 0,35**, den Wert der Variante V0 aus Kapitel 4.4.

**Der Schwärzungsriegel steht vor allem anderen.** Bevor der erste Fremdtext an ein Modell geht, sind **T8, T9, T16 und T17 grün**. Ein versteckter Steuerbefehl und ein Klarname wirken beim ersten Modellaufruf, nicht beim ersten Digest, und ein einmal übertragener Klarname ist nicht zurückzuholen. Ein Test, der eine unumkehrbare Wirkung absichert, gehört vor die Wirkung, nicht hinter sie.

- **A1.1 Tests aus Kapitel 6 grün, gegen den eingefrorenen Goldkorpus.** T1 falscher Zitatanker entwertet das Feld, T2 Zahl nur im Fließtext bleibt unerklärt, T3 fehlende Effizienzklasse ist ein Verstoß, T4 Neubau nur Frage, T5 Dublette 87,0 zu 87,4 m² ergibt ein Kurzdossier, T6 87 zu 91 m² ergibt zwei Objekte, T20 Fachgrenze 87,4 zu 87,6 m² ergibt ein Kurzdossier, T13 Doppellauf eine Meldung, T14 Durchlass sechs sauberer Anzeigen auf die Karte, T22 keine Erbbaurechtsfrage ohne Erbbaurecht.
- **A1.2 Schwärzungsriegel.** T8, T9, T16 und T17 grün, Fangquote der gesäten Klarnamen über 0,95.
- **A1.3 Kanalausfall.** Ein Suchauftrag wird deaktiviert; erwartet werden binnen 24 Stunden eine Meldung „Kanal ohne Zulauf" und der Kanalzustand `defekt`.
- **A1.4 Belegtests, mit dem Vetoträger dieser Phase.** Eine Zahl ohne `id` im Belegschrank lässt das Kurzdossier durchfallen (Schemaverstoß nach R6, Veto nach R18). **Das Veto zieht in Phase 1a der Schemaschritt im n8n-Code-Knoten**, denn C2 entsteht erst in Phase 2; die Meldung nennt Regelnummer, Laufzeitpunkt und die Zahl der zurückgehaltenen Treffer wie in jeder späteren Phase. Ein Beleg über `gueltig_bis` erzeugt die Warnzeile und fällt auf „nicht ermittelbar", der Treffer bleibt stehen.
- **A1.5 Erste nutzbare Karte, gegen die Schwelle von V0.** An sieben Tagen in Folge erreicht Christoph mindestens eine bewertete Karte mit Boden, Decke, Belegdichte, Lückenliste und Knöpfen; T15 und T21 sind grün, also erscheint kein Objekt über dem Deckel. **Die Karte misst gegen `belegdichte_min: 0.35`**, die Schwelle der Variante V0. Erreichbar sind dort höchstens **0,53** in Profil A und **0,78** in Profil B (Kapitel 4.4); die Abnahme verlangt, dass an mindestens fünf der sieben Tage eine Karte den Code `VS` oder `NF` trägt und nicht durchgängig `UV`. Bleibt es sieben Tage lang bei `UV`, ist nicht das Profil zu eng, sondern die Parserliste zu kurz, und A1.7 misst nach, welche Felder die Portalvorlage führt.

**Tore:** Christoph öffnet die Karten an 5 von 7 Tagen und beantwortet mindestens die Hälfte. Bleibt der Zulauf unter drei verwertbaren Objekten je Woche, sind Region oder Preisband falsch, und E1 bis E3 fallen neu, bevor Phase 1b beginnt.

### Phase 1b Wächter und Messphase

Kettenwächter und Filterzwilling melden toten Kanal und zu engen Filter ohne Portalabfrage; die ersten 14 Tage sind Messphase.

- **A1.6 Kettenwächter und Filterzwilling.** Ein deaktivierter Kettenwächter-Suchauftrag erzeugt binnen 24 Stunden `defekt` und das Profil `blind`; ein künstlich zu enges Profil erzeugt `verengt` und die Meldung „Filter zu eng, nicht Markt leer".
- **A1.7 Handzählung.** Sieben Tage Portalmails gegen die Zulaufliste, Abweichung null; danach übernehmen die Wächter.
- **A1.8 Ausfallprobe Synology.** Die Synology geht zwei Stunden vom Netz, healthchecks.io meldet; „Hobbyist" kostet null bei „Monitor 20 jobs" ([Preise](https://healthchecks.io/pricing/)).
- **A1.9 Messphase abgeschlossen.** 14 Tage Median je Kanal liegen vor, Feldfüllquote und Fundzeit sind gemessen, nicht geschätzt.
- **A1.10 Rückbauprobe.** Wie A0.8, gemessen und quittiert.

**Tore:** Christoph öffnet die Liste an 10 von 14 Tagen; bleiben es über drei Wochen unter drei verwertbaren Objekten je Woche, wird abgebrochen. **Nach A1.10 ist der Betrieb dauerhaft lauffähig.** Fällt E0 auf V0, endet der Aufbau hier, und alles Weitere ist Ausbau bei Bedarf.

### Phase 2 Vollbetrieb

Nur bei Variante V2. Zweiter und dritter Portalzulauf, an dem die Cluster erstmals im Betrieb über Portale hinweg tragen, Referenzband nach R5, C1, C2 und C4 im Lauf, volles Dossier, Digest mit Knöpfen, Rückfluss in die Akte. **Mit C1 fallen die Zahlenfelder unter die Positivliste heraus, deshalb steigt die Belegdichte-Schwelle von 0,35 auf 0,70** (Kapitel 4.4). In der **Schattenwoche** zeigt die Karte fünf Tage lang Objektdaten und die Hebelfrage, nicht Status und Rang.

**Bandpflege und Veto in Phase 2, namentlich.** C5 pflegt das Referenzband erst ab Phase 3. In Phase 2 ist der Bandabruf deshalb **betreute Handarbeit** und steht als Punkt 11 in der Checkliste 7.6: Christoph überträgt Immobilienrichtwert, Marktbericht und Liegenschaftszinssatz einmal in den Belegschrank, C5-Aufgaben laufen noch nicht. Das Veto wandert in Phase 2 vom n8n-Code-Knoten der Phase 1a auf den **Schemaschritt in C2** (R18); alle fünf Vetogründe sind dort maschinell prüfbar, einschließlich des gescheiterten Kanarienzwillings, dessen Sollwerte im Goldkorpus stehen. **ESK2 hat damit in Phase 2 einen Auslöser.** Ab Phase 3 zieht C3 zusätzlich das Veto für R16, weil erst dann ein Prüfer den Zwilling nicht erkennen kann.

- **A2.1** Der Lauf reproduziert das Rechenbeispiel aus Kapitel 4 auf zwei Nachkommastellen; die Sollwerte 37,18 und 56,03 stehen in `immo/gold/rechenbeispiel.json`, dazu die Antwortstufen 41,68, 46,93, 51,43, 46,28, 50,18, 59,93 und 64,43, für die Koeffizientenvariante 32,00 und 50,85, für Profil B 34,10, 76,30, 44,00 und 58,30 sowie die Gesamtaufwandswerte 650.006,00 und 627.592,00 Euro.
- **A2.2 Schubladentest.** Jetzt wird `immo/gold/rangliste.json` geöffnet, das System rangiert dieselben zwölf Inserate. Bestanden ab einer Spearman-Korrelation von 0,60 und wenn keines der drei obersten im unteren Drittel landet. **Bei Verfehlung wird der Score nicht nachgezogen:** Christoph benennt das fehlende Merkmal, es kommt ins Profil, der Test läuft mit einer neuen blinden Rangliste. Zwei Fehlversuche stoppen die Phase.
- **A2.3 Tests aus Kapitel 6 grün.** T7 tote Quelle wird Störung statt Nullmeldung, T11 40 von 400 verarbeitet, T15 und T21 Phantome unterdrückt bei grünem T14.
- **A2.4 Statuscodes.** `WV` unter „unbewertet", `UV` mit einer Frage, `NF` mit Nachfasstext und Sieben-Tage-Frist, `AB1` bei Deckelüberschreitung durch die Käuferprovision.
- **A2.5 Schattenwoche.** Ein Paar stimmt überein, wenn Christophs Ja-Nein-Urteil und die **Schwellenentscheidung** gleich ausfallen; der Rang zählt nicht. Bestanden ab 15 von 20; darunter wird das Profil geändert, nicht das Gewicht, denn Gewichte bleiben nach Kapitel 4.10 bis 200 etikettierten Entscheidungen unangetastet.
- **A2.6 Aufmerksamkeitsprobe.** Etwa monatlich steht ein Objekt im Digest, das ein **hartes Kriterium** verletzt und deshalb den Code `AB5` trägt, etwa eine Wohnfläche unter dem Mindestwert. Christoph kennt die Methode, nicht den Zeitpunkt. Bestanden, wenn er es als „passt nicht" markiert. **Der Kaufsummen-Deckel wird dafür nie benutzt:** R4 ist ausnahmslos, und T15 wie T21 prüfen genau das. Ein Lauf besteht damit T15, T21 und A2.6 gleichzeitig.
- **A2.7 Ausfallproben.** Der Lauf bricht nach der dritten von acht Meldungen ab; erwartet: Der Folgelauf sendet fünf, keine doppelt, die Warteschlange steht auf drei. Danach eine still deaktivierte Aufgabe; erwartet: healthchecks.io meldet den fehlenden Herzschlag, der Grabstein löst die tote Zeile nach 90 Minuten.
- **A2.8 Kostenabnahme.** Nach sieben bewertenden Läufen stehen die gemessenen Token-Mengen gegen die Zeile **„Nachtlauf Phase 2, ohne C3", also 1,24 USD**, aus Kapitel 5.9; C3 läuft in dieser Phase nicht und wird nicht gemessen. Der gemessene Wert je Vorschlag setzt die Alarmschwelle aus Kapitel 5.9. Datum in `immo/runbook.md`.
- **A2.9 Rückbauprobe.** Wie A0.8, gemessen und quittiert.
- **A2.10** A1.1 bis A1.10 bleiben grün.

**Tore.** Über 14 Tage werden 60 Prozent der Karten beantwortet, Median unter 24 Stunden. Es gilt die dreistufige Regel aus Kapitel 5: unter 0,40 meldet C5 die dünne Stichprobe; zwischen 0,50 und 0,60 folgen zwei Nachjustierungen (erst Kartenzahl senken, dann Frequenz halbieren) und danach eine Neumessung über 14 Tage; bleibt die Quote nach der zweiten Nachjustierung unter 0,50, **gilt Phase 2 als nicht abgenommen**. Das bedeutet konkret: Der Betrieb fällt auf die Variante V0 aus Phase 1b zurück, C3, C5 und Phase 3 bleiben ungebaut, und E0 wird neu entschieden.

**Abbruch bei dünner Beleglage, gemessen gegen die laufende Variante.** Liegt der **Median der Belegdichte über alle bewerteten Objekte** zwei Wochen unter `belegdichte_min` der laufenden Variante, wird das Profil gekürzt. Das sind **0,35 in V0 und damit in Phase 1a und 1b** und **0,70 ab Phase 2 in V2**. Ohne diese Unterscheidung träfe das Kriterium in V0 schon am ersten Tag zu, ohne dass das Profil daran schuld wäre, denn dort ist 0,70 an keinem Objekt des Profils A erreichbar. Es ist jeweils dieselbe Zahl wie die objektbezogene Schwelle aus Kapitel 4, aber eine andere Aussage: Dort entscheidet sie über ein Objekt, hier über den Zulauf als Ganzes. Sie trägt in dieser Rolle, weil ein Median unter der Objektschwelle bedeutet, dass die Mehrheit der Objekte den Status `UV` bekäme; ein Profil, das mehrheitlich „zu wenig Daten" liefert, misst nicht den Markt, sondern die Portalvorlage.

### Phase 3 Vertiefung

**Dauerprüfung.** C3 und C5 gehen in Betrieb, dazu Kalibrierung, Bodenwertklammer für Wohnungseigentum aus Fläche mal Miteigentumsanteil, T10, T12, T18 und T19. Vorab laufen 40 Saaten aus dem Goldkorpus; ein Blindprüfer unter der Fangquote 0,8 wird stillgelegt.

**Vorgangsprüfung nach den Prompts 3 bis 6.** Die Unterlagen tragen Klarnamen, der Tagesbetrieb arbeitet nach R19 pseudonymisiert: eigener Vorgangsordner, eigene Sitzung, **Einwegrichtung**, nichts in Cowork-Memory.

**Der Unterlagenkanon steht vor dem Prompt.** Der Artikel nennt Protokolle, Jahresabrechnung und Wirtschaftsplan. Für Wohnungseigentum genügt das nicht.

| Unterlage | Warum sie zuerst kommt |
|---|---|
| **Beschluss-Sammlung nach § 24 Abs. 7 WEG** | das rechtlich geführte Register aller verkündeten Beschlüsse, fortlaufend eingetragen und nummeriert, mit Einsichtsrecht ([dejure.org](https://dejure.org/gesetze/WEG/24.html)). Protokolle sind Erzählung, die Sammlung ist Bestand |
| **Teilungserklärung mit Gemeinschaftsordnung** | Kostenverteilungsschlüssel nach § 16 Abs. 2 WEG, Sondernutzungsrechte, Miteigentumsanteil für die Bodenwertklammer |
| **Veräußerungszustimmung nach § 12 WEG** | ohne sie kein Eigentumsübergang; ein Terminrisiko, kein Preisrisiko |
| Protokolle, Jahresabrechnung, Wirtschaftsplan | ergänzend zur Sammlung, für Beträge und Sonderumlagen |
| Genehmigung bei sozialer Erhaltungssatzung | Genehmigungsvorbehalt und gemeindliches Vorkaufsrecht als Terminrisiko |

- **3 Sanierungen:** Maßnahme, Datum, Betrag, Sonderumlage, Rücklage, je Zeile Dokument und Seite, **zuerst aus der Beschluss-Sammlung, dann ergänzend aus den Protokollen**. Die eingebaute Sonderumlage muss gefunden werden, Zeilen ohne Fundstelle fallen, die Prognose bleibt ohne Score. Erst hier wird `ruecklage_deckung` aus belegten Zahlen rechenbar (Kapitel 4.4), und erst hier entstehen die nicht umlagefähigen Kosten, die Sonderumlage und die Restnutzungsdauer, die den Dossierkopf von `ertrag_stufe: brutto` auf `netto` wechseln lassen (Kapitel 4.11). Der Erbbauzins kommt aus Prompt 4.
- **4 Vertrag gegen Grundbuch:** Abteilung II und III, Löschungen, fünf Notarklauseln, Fristzeile zuerst. Zwei Defekte in beide Richtungen: ein verschwiegenes Wegerecht, eine Löschung ohne Eintragung; bestanden, wenn beide mit Fundstelle erscheinen und **keine dritte erfunden** wird (R11). Der Erbbauzins steht in Abteilung II und schließt die letzte der vier Ertragslücken aus Kapitel 4.11.
- **5 Finanzierung:** Rate, Restschuld, Anschlussrate bei 3, 5 und 7 Prozent, im Skript gerechnet (R3), drei Zeilen von Hand geprüft; Nebenkosten aus `basis.yaml` mit allen vier Posten, Grunderwerbsteuer 6,5 Prozent ([NRW](https://www.finanzamt.nrw.de/steuerinfos/privatpersonen/haus-und-grund/grunderwerbsteuer-wissenswertes-beim-grundstuecks-oder)).
- **6 Bankangebote:** normierte Tabelle, je Angebot drei teure Klauseln wörtlich mit Fundstelle; fehlt etwas, steht dort „nicht genannt", nie ein Schätzwert.

**Die Fristzeile braucht eine Eingabe.** Der Entwurf soll dem Verbraucher zwei Wochen vor der Beurkundung vorliegen (§ 17 Abs. 2a Satz 2 Nr. 2 BeurkG), nur zwischen Unternehmer und Verbraucher ([Notar Dols](https://www.notar-dols-berlin.de/notar/immobilienrecht/2-wochen-frist-gemaess-%C2%A7-17-absatz-2-a-beurkg/)) und nicht disponibel ([DNotI](https://www.dnoti.de/entscheidungen/details/?tx_dnotionlineplusapi_decisions%5Bnodeid%5D=0ac9a684-e71f-47d7-b510-551a6efaa17b&cHash=5d5e20012da26762de5763062c5cd553)). Jeder Vorgang trägt deshalb `verkaeufer_unternehmer: ja | nein | unbekannt`: bei `nein` entfällt die Zeile, bei `unbekannt` wird sie zur Frage, bei `ja` und kurzer Frist ist sie der erste Punkt.

**Bei einer Mieterhöhung nach Prompt 9 gilt eine zusätzliche Pflichtzeile.** Der Kölner Mietspiegel ist von einem Verein herausgegeben und deshalb kein qualifizierter Mietspiegel nach § 558d BGB; das Dossier nennt diesen Umstand mit Fundstelle und stellt die Frage, es nennt keine Rechtsfolge (R11).

**A3.1 Urlaubsprobe:** zehn Tage ohne Eingriff, kein Datenverlust, jede Störung meldete sich. **A3.2 Rückbauprobe** mit Löschung des Vorgangsordners, Stoppuhr unter zehn Minuten, Datum in `immo/runbook.md`.

## 7.3 Sitzung 1 und Entscheidungsvorlagen

150 Minuten. **Tagesordnungspunkt 1 ist E0, die Bauvariante.** Grundlage ist die Tabelle in Abschnitt 2.10; entschieden wird zwischen V0, V1 und V2, und die Entscheidung wird mit ihrer Widerrufsbedingung protokolliert. Sie steht zuerst, weil jede folgende Entscheidung ihren Umfang von ihr bezieht: Fällt E0 auf V0, entfallen E9, E14, E16 und E19 vorerst ganz.

Danach: Beispieldigest aus Kapitel 5 lesen, die übrigen sieben Entscheidungen für Sitzung 1 aus Kapitel 8 fällen, also E1 bis E6 und E30, Sortierprobe, Live-Beweis mit angelegten Suchaufträgen und Testmail. **Typ 1** ist teuer rückgängig zu machen, **Typ 2** billig. Jede längere Frage kommt auf den Parkplatz, mit Datum und der Zahl, die sie widerlegt.

## 7.4 Aufwand

Stunden für Christoph, Läufe für Claude; ein Lauf ist eine Cowork-Sitzung. **Alle Werte sind Spannen, keine Punktschätzungen**, und sie sind nach Phase 1a am Messwert nachzuziehen. Die Untergrenze setzt voraus, dass jeder Baustein beim ersten Versuch trägt; die Obergrenze rechnet mit je einem Fehlversuch je Baustein. Vergleichsanker ist der bestehende Paket-Workflow in n8n, der zeigt, dass IMAP-Abruf, LLM-Extraktion und Anzeige zusammen etwa einen Arbeitstag kosten, wenn nichts Neues dazukommt.

| Phase | Christoph | Wofür | Claude |
|---|---|---|---|
| 0 | **6,5 bis 10,0 h** | Sitzung 2,0 bis 3,0; Konten 2,0 bis 3,0; Sortierprobe 1,0 bis 1,5; Rangliste 0,5 bis 1,0; Proben 1,0 bis 1,5 | 4 bis 6 Sitzungen |
| 1a | **4,0 bis 7,0 h** | Postfach und Suchaufträge 1,5 bis 2,5; n8n-Workflow prüfen und auslösen 1,0 bis 2,0; Schwärzungsriegel 1,0 bis 1,5; erste Karten 0,5 bis 1,0 | 3 bis 5 Sitzungen |
| 1b | **5,0 bis 8,0 h** | Kettenwächter und Filterzwillinge 1,0 bis 1,5; Handzählung 1,5 bis 2,5; Ausfallproben 1,0 bis 1,5; healthchecks.io und Fehler-Workflow 1,0 bis 1,5; Rückbauprobe 0,5 bis 1,0 | 4 bis 6 Sitzungen plus 14 Tagesläufe |
| **Summe bis zum nutzbaren Betrieb** | **15,5 bis 25,0 h** | Summe der drei Zeilen darüber | 11 bis 17 Sitzungen plus 14 Tagesläufe |
| 2 | **11,0 bis 20,0 h** | Schattenwoche 2,5 bis 4,0; Digestkarten über 14 Tage 3,0 bis 5,0; Schubladentest 1,0 bis 2,0; Referenzband und Belegschrank von Hand 1,5 bis 3,0; Statuscodes und Digestabnahme 1,0 bis 2,0; Ausfallproben 1,0 bis 2,0; Rechenbeispiel 0,5 bis 1,0; Rückbauprobe 0,5 bis 1,0 | 20 bis 30 Sitzungen plus 21 Tagesläufe |
| **Summe Phase 0 bis 2** | **26,5 bis 45,0 h** | | 31 bis 47 Sitzungen plus 35 Tagesläufe |
| 3 | 4,0 bis 8,0 h Aufbau, je Vorgang 6,0 bis 10,0 h | Vorgangsordner, Unterlagenkanon, Prompts 3 bis 6, Dauerprüfung | 12 Sitzungen, dann 15 und 3 bis 6 je Vorgang |

**Der Monatssockel wird aus benannten Arbeiten gerechnet, nicht geschätzt.**

| Wiederkehrende Arbeit | Minuten je Monat, Variante V2 | Variante V0 |
|---|---|---|
| DLQ und Quarantäne sichten, viermal je 10 Minuten | 40 | 20 |
| Pflegelauf C5 lesen und quittieren | 30 | entfällt |
| Rückspielprobe | 15 | entfällt |
| Monatsblindprobe | 10 | entfällt |
| Terminliste Amtsgericht, viermal je 5 Minuten | 20 | entfällt |
| Digestkarten über den Alltag hinaus | 30 | 30 |
| Norm- und Belegaufgaben aus R10 und 6.2 | 20 | 5, nur die Referenz-CSV |
| Störungen, Median aus der Messphase | 45 | 30 |
| Mutationstest, halbjährlich 30 Minuten | 5 | entfällt |
| **Summe** | **215 Minuten, also 3,6 h** | **85 Minuten, also 1,4 h** |

Die Summe ist die Untergrenze. **Als Planwert gilt 3,6 bis 5,7 Stunden im Monat für V2 und 1,5 bis 2,5 Stunden für V0**; der Zuschlag von rund 60 Prozent deckt den Monat, in dem etwas kaputt ist. Pflege, die niemand einplant, findet nicht statt; deshalb steht jede Arbeit mit einer eigenen Minutenzahl in der Tabelle.

**Phase 3 ist in der Summenzeile nicht enthalten**, weil sie nicht an einem Datum beginnt, sondern am ersten ernsthaften Objekt. **Abbruchschwelle:** Ist Phase 1b nach drei Wochen nicht abgenommen oder überschreitet der Aufwand die Obergrenze ihrer Spanne um mehr als die Hälfte, wird gestoppt. Rückfall ist Phase 1a, also die bewertete Karte aus einer Laufzeit, und nicht der Zustand ohne System.

## 7.5 Risiken

Je Zeile Risiko, Erkennung, Gegenmaßnahme, **Restrisiko**.

- **Aufmerksamkeitsverfall** — Antwortquote, A2.6 — Kartenzahl senken, Frequenz halbieren — **die Quote misst auch den Kalender**.
- **Stiller Teilverlust** — Filterzwilling, Feldfüllquote minus 15 — Zustand `verengt`, Auftrag neu anlegen — **ein Verlust, der auch den Filterzwilling trifft, bleibt unsichtbar**.
- **Totalausfall** — Kettenwächter 24 Stunden stumm — Zustand `defekt`, Probe A1.6 — **ein Portal kann Aufträge stumm archivieren**.
- **Portal ändert die Nutzungsbedingungen** — Quartalsprüfung mit Hash-Vergleich, Haltbarkeit drei Monate nach Kapitel 6 — Zulassung sofort nach unten, Erweiterung nur nach Freigabe — **eine Änderung wirkt vor der Prüfung**.
- **Kosten laufen weg** — 37,20 bis 55,14 USD im Monat, 0,48 bis 4,24 USD je Vorschlag — Alarm bei anderthalbfachem Messwert aus A2.8, dann Profil kürzen — **ob Cowork nach Listenpreisen abrechnet, ist [ungeprüft]**.
- **Zu weiter Deckel** — T15 und T21, Kostenabnahme — alle vier Nebenkostenposten in `basis.yaml`, Provision je Objekt mit Beleg — **ein Anbieter kann die Provision falsch angeben**.
- **Klarnamen aus Phase 3** — T9, T16, T17 — Einwegübergabe — **ein kopierter Absatz umgeht jede Schranke**.
- **Aufbau zu groß für den Alltag** — Aufwandsspanne in 7.4, Abbruchschwelle — E0 mit Widerrufsbedingung, Phase 1a als eigenständig nutzbares Ergebnis — **eine einmal gebaute Verteilung über drei Laufzeiten baut niemand freiwillig zurück**.
- **Ein-Personen-Betrieb, Nachnutzung** — A3.1, Kaufabschluss — Runbook, Stilllegung mit Löschfristen — **bei langem Ausfall läuft nur die Aufnahme**.

## 7.6 Checkliste: Was Christoph selbst einrichtet

Claude hat keinen SSH-Zugang und bedient n8n nicht.

**Vor Phase 0.** (1) Postfach auf eigener Domain, IMAP aktiv, Plus-Adressierung mit Testmail geprüft; die Anbieterunterstützung ist **[ungeprüft]**, Rückfall sind Postfächer je Quelle. Blockiert alles Weitere. (2) App-Kennwort im Store, Ordner `Immo/DLQ` und `Immo/Quarantaene`. (3) Repository für Profile und Regeln mit `immo/profile/`, `immo/gold/`, `immo/normen.md`, `immo/quellen/manifest.yaml`, `immo/runbook.md`, `immo/recht.md`, Branch-Schutz; das Betriebsrepository nach E9 nur bei Variante V2. (4) Konnektoren nur Dropbox und GitHub; **Google bleibt unverbunden.**

**Vor Phase 1a.** (5) Portalkonten, je Portal ein Profilauftrag an eine eigene Plus-Adresse. (6) Zwei Telegram-Bots über @BotFather, je einer für n8n und Home Assistant, weil parallele `getUpdates`-Abfragen desselben Tokens kollidieren; die Bot-API-Dokumentation sagt dazu nichts, das bleibt **[ungeprüft]**. (7) n8n: Zeitzone `Europe/Berlin`, Fehler-Workflow, `n8n-nodes-imap`, Data Tables, Messung des bereits belegten Speichers. (8) LiteLLM-Schlüssel für Schwärzung und Extraktion mit `max_budget` und Ratengrenze.

**Vor Phase 1b.** (9) Je Portal Filterzwilling und Kettenwächter an eigene Plus-Adressen. (10) healthchecks.io als Totmann, Uptime Kuma für Dienste.

**Vor Phase 2 und 3.** (11) Referenzband von Hand in den Belegschrank: Immobilienrichtwerte für `TEILMA` 1, 2 und 3, Grundstücksmarktbericht Köln, Liegenschaftszinssatz und Mietspiegel; der Kölner Mietspiegel kommt von der Rheinischen Immobilienbörse, nicht von der Stadt ([Stadt Köln](https://www.stadt-koeln.de/artikel/06421/index.html)). Diese Übertragung ersetzt in Phase 2 den Pflegelauf C5. (12) Goldkorpus bestätigen, 28 synthetische Fälle nach der Verteilung aus Kapitel 6; Memory gegen die Negativliste prüfen. (13) Vorgangsordner mit eigener Freigabe, Terminliste des Amtsgerichts wöchentlich mit Monitor, Unterlagenkanon aus Phase 3 als Anforderungsliste an den Verwalter.

## 7.7 Anschluss

Kapitel 1 verlangt das Normregister in Phase 0, das Referenzband vor dem ersten bewertenden Lauf und den Vorgangsordner in Phase 3. Kapitel 2 baut Phase 1a den n8n-Weg mit S1, S2, S3 und S4 in minimaler Fassung, Phase 1b S5 samt Wächtern, Phase 2 C1, C2 und C4, Phase 3 C3 und C5; A0.6 ist der Briefkastentest und entfällt bei Variante V0. **Den Vetoträger stellt in Phase 1a der Schemaschritt im n8n-Code-Knoten, ab Phase 2 C2, ab Phase 3 zusätzlich C3** (R18); dieselbe Verschiebung gilt für die Belegdichte-Schwelle, 0,35 bis Phase 1b und 0,70 ab Phase 2. Kettenwächter und Filterzwilling aus Kapitel 3 nehmen **A1.6** ab, der Belegschrank **A1.4**, der Kanalausfall **A1.3**. Aus Kapitel 4 stehen Lint in A0.1, Rechenbeispiel in A2.1, Statuscodes in A2.4. Aus Kapitel 5 kommen Zeitplan, Ausgangstabelle, Journal und healthchecks.io in Phase 1, die Kalibrierung in Phase 3.

---

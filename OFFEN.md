# OFFEN

Die einzige gültige Liste offener Punkte. Zu Beginn jeder Sitzung lesen, am Ende fortschreiben, mit Datum.

## Stand 10.09.2026

- 10.09.2026 ERLEDIGT: Postfach immo@rosenkranz.cologne bei ALL-INKL angelegt; Plus-Adressierung geprüft (immo+test@ kommt an, Delivered-To trägt den Tag)
- 10.09.2026 ERLEDIGT: Repository crosenkr/immo angelegt
- OFFEN: Ordner Immo/DLQ und Immo/Quarantaene im Postfach anlegen
- OFFEN: Sitzung 1 (Konzept 7.3): E0 Bauvariante zuerst, dann E1 bis E6 und E30, Sortierprobe, Live-Beweis mit erstem Suchauftrag

## Checkliste: Was Christoph selbst einrichtet (Konzept 7.6)

Claude hat keinen SSH-Zugang und bedient n8n nicht.

**Vor Phase 0.** (1) Postfach auf eigener Domain, IMAP aktiv, Plus-Adressierung mit Testmail geprüft; die Anbieterunterstützung ist **[ungeprüft]**, Rückfall sind Postfächer je Quelle. Blockiert alles Weitere. (2) App-Kennwort im Store, Ordner `Immo/DLQ` und `Immo/Quarantaene`. (3) Repository für Profile und Regeln mit `immo/profile/`, `immo/gold/`, `immo/normen.md`, `immo/quellen/manifest.yaml`, `immo/runbook.md`, `immo/recht.md`, Branch-Schutz; das Betriebsrepository nach E9 nur bei Variante V2. (4) Konnektoren nur Dropbox und GitHub; **Google bleibt unverbunden.**

**Vor Phase 1a.** (5) Portalkonten, je Portal ein Profilauftrag an eine eigene Plus-Adresse. (6) Zwei Telegram-Bots über @BotFather, je einer für n8n und Home Assistant, weil parallele `getUpdates`-Abfragen desselben Tokens kollidieren; die Bot-API-Dokumentation sagt dazu nichts, das bleibt **[ungeprüft]**. (7) n8n: Zeitzone `Europe/Berlin`, Fehler-Workflow, `n8n-nodes-imap`, Data Tables, Messung des bereits belegten Speichers. (8) LiteLLM-Schlüssel für Schwärzung und Extraktion mit `max_budget` und Ratengrenze.

**Vor Phase 1b.** (9) Je Portal Filterzwilling und Kettenwächter an eigene Plus-Adressen. (10) healthchecks.io als Totmann, Uptime Kuma für Dienste.

**Vor Phase 2 und 3.** (11) Referenzband von Hand in den Belegschrank: Immobilienrichtwerte für `TEILMA` 1, 2 und 3, Grundstücksmarktbericht Köln, Liegenschaftszinssatz und Mietspiegel; der Kölner Mietspiegel kommt von der Rheinischen Immobilienbörse, nicht von der Stadt ([Stadt Köln](https://www.stadt-koeln.de/artikel/06421/index.html)). Diese Übertragung ersetzt in Phase 2 den Pflegelauf C5. (12) Goldkorpus bestätigen, 28 synthetische Fälle nach der Verteilung aus Kapitel 6; Memory gegen die Negativliste prüfen. (13) Vorgangsordner mit eigener Freigabe, Terminliste des Amtsgerichts wöchentlich mit Monitor, Unterlagenkanon aus Phase 3 als Anforderungsliste an den Verwalter.

## Offene Entscheidungen E0 bis E33 (Konzept 8.6)

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

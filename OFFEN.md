# OFFEN

Die einzige gültige Liste offener Punkte. Zu Beginn jeder Sitzung lesen, am Ende fortschreiben, mit Datum.

## Stand 10.09.2026

### Sitzung 1 (10.09.2026), gefallene Entscheidungen
- E0 Bauvariante: **V2 voll** (n8n, Cowork als geplante Aufgaben, lokales Modell, GitHub-Briefkasten). Widerrufsbedingung (A0.9): Monatssockel nach acht Wochen über 6 h oder Phase 2 nach 45 h nicht abgenommen, dann Rückfall auf Phase 1a.
- E1 Objektarten: Profil A vermietete Eigentumswohnung als Kapitalanlage; Profil B Haus zur Eigennutzung.
- E2 Region: Profil A Ehrenfeld, Neustadt-Nord (Belgisches Viertel, Agnesviertel), Neustadt-Süd (Südstadt), Lindenthal, Sülz, Rodenkirchen, Marienburg. Profil B Ehrenfeld, Lindenthal, Sülz, Rodenkirchen, Marienburg, Junkersdorf. Geofence über Stadtteile-Shapefile Köln. E24 entfällt (nur Köln).
- E3 Kaufsummen-Deckel (Gesamtaufwand): Profil A 500.000 Euro, Profil B 900.000 Euro; Provisionsannahme 3,57 %; Zinsannahme 3,89 % (Dr. Klein, Stand 09.09.2026, Richtwert). R4 gilt am Referenzpreis, nicht am Angebotspreis (siehe regeln.md).
- E4 Schwellen: 55 / 35, Belegdichte 0,70 (V2), unverändert bis zur Sortierprobe.
- E5 Kanäle: Telegram täglich morgens, Home-Assistant-Kachel, E-Mail-Wochenrückschau.
- E6 Startportal: ImmoScout24. Suchaufträge „A Anlage“ (Eigentumswohnungen, gezeichnetes Gebiet, bis 800.000) und „B Haus“ (bis 1.200.000), Echtzeit per E-Mail, angelegt 10.09.2026. Preisfilter bewusst weit, weil der Deckel am Referenzpreis greift.
- E7 Postfach: immo@rosenkranz.cologne (ALL-INKL), Plus-Adressierung bestätigt.
- E30: Sitzung 1 in einem Termin.

### Offen nach Sitzung 1
- 10.09.2026 ERLEDIGT: Sortierprobe A0.2 versiegelt (gold/sortierprobe-a.json, SHA-256 daneben): 10 von 12 hinsehen, verworfen nur Erbbaurecht (5) und Vermietung an Verwandte (7)
- 10.09.2026 ERLEDIGT: Live-Beweis. Bestaetigungsmail des Suchauftrags A Anlage kam an immo+is24@ an; Parser S1 (n8n/s1_parser_is24.js) gegen 30 Anzeigen geprueft; profile/basis.yaml, anker.yaml, profil-a.yaml, profil-b.yaml angelegt
- OFFEN: Parser gegen die erste Echtzeit-Benachrichtigung pruefen (anderes Mailformat moeglich)
- OFFEN: Sitzung 2: Zielbaender wohnflaeche_fit und grundstueck_fit in profil-b.yaml sind gesetzt, nicht entschieden
- 10.09.2026 ERLEDIGT: E8, ImmoScout nimmt immo+is24@ an (To-Header der Bestaetigungsmail)
- OFFEN: Punkt 11 der Checkliste (Referenzband: Immobilienrichtwerte TEILMA 1 bis 3, Marktbericht Köln) rückt nach Phase 1b vor, weil R4 am Referenzpreis misst
- OFFEN: docs/KONZEPT.md von Christoph hochladen (Konnektor überträgt keine 220-KB-Datei)

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

## Stand Sitzung 1, Nachtrag 10.09.2026: S1 Sammler in Betrieb

S1 Sammler IS24 läuft in n8n als Workflow "Immo S1 Sammler IS24 (Phase 1a, v2 mit Mailabschluss)" (Workflow-ID YtvJLErRSAHPAl5P, aktiv, alle 15 Minuten). Der alte Workflow (XapBbytXdoN4EpCR) ist gelöscht. Der Export liegt unter n8n/s1-sammler-is24.json und enthält die Credential-ID und die Data-Table-IDs (objekt RhcS6X5MWKzfAL22, ereignis d6rJmS98tcnUCPiw), keine Geheimnisse.

Mailabschluss: Der Posteingang von immo@ ist die Warteschlange. Der Sammler holt nur ungelesene Mails von immobilienscout24.de. Nach dem Schreiben in objekt und ereignis markiert er die Mails als gelesen und verschiebt sie nach INBOX/Archiv. Störungsmails gehen nach INBOX/DLQ. Ein Ordner INBOX/Quarantaene ist angelegt und noch ungenutzt. Der Knoten "Nur neue Mails" ist entfernt. "Nur neue Objekte" (Dedupe über objekt_schluessel) bleibt.

Test am 10.09.2026: 7 Mails aus dem Erstlauf ergaben 93 Objekte. Zwei Echtzeitmails ergaben 2 weitere Objekte. Die zwei Mails wurden nach Archiv verschoben. Die 7 alten Mails wurden von Hand nach Archiv verschoben. 0 Störungen.

Suchauftragsname: Benachrichtigungen tragen die Zeile "Ihre Suche: <Name>". Bestätigungsmails tragen den Namen nicht. Hier ordnet der Parser über savedSearchId zu (Tabelle SAVED_SEARCH im Parser, is24-2026-09-10.3). Neue Suchaufträge sind dort nachzutragen. Die 3 Zeilen mit suchauftrag "löschen" aus dem Erstlauf können von Hand auf "A Anlage" gesetzt werden.

Nächster Baustein: S3/C2 (Bewertung gegen profil-a und profil-b, Referenzpreis nach R4) und S4 Telegram-Karte. Danach S2 Schwärzer und Referenzband (Phase 1b).

## Nachtrag 10.09.2026, Abend: Referenzband und S3 v2

Belegschrank gefuellt (quellen/manifest.yaml). Beleg irw_nrw_2026: Immobilienrichtwerte NRW, Stichtag 01.01.2026, offene Daten dl-de/zero-2-0, SHA-256 im Manifest. Der Auszug Koeln hat 128 Zonen, davon 59 fuer Eigentumswohnungen und 69 fuer Ein- und Zweifamilienhaeuser. Beleg gmb_koeln_2026: Grundstuecksmarktbericht Koeln 2026. Die PDF bleibt bei Christoph, die Auszuege liegen als JSON unter quellen/referenz/. Die Zuordnung Stadtteil zu Zonen laeuft ueber die Zonennamen (stadtteil_zonen.yaml). Die Pruefung gegen die Stadtteilgrenzen ist offen. Hahnwald hat keine Richtwertzone. Dort greift die Kaufpreisspanne des Marktberichts.

S3 Buchhalter v2 liegt als n8n/s3-buchhalter.json bereit. Der Code entsteht aus build_s3.py und build_referenzband.py. Der Referenzpreis ist die Wohnflaeche mal dem Median der angepassten Immobilienrichtwerte des Stadtteils. Angepasst wird nur mit Wohnflaeche und Grundstueck. Alle anderen Merkmale bleiben Normobjekt. Der Deckel nach R4 gilt am Referenzpreis. Die Zustaende sind ausgeschlossen_referenzpreis, verhandlungsfall mit Zielgebot und unter_deckel. Neubau und Erstbezug bleiben beim Notbehelf am Angebotspreis, weil die Richtwerte nur fuer Weiterverkaeufe gelten. Der Preisabstand liefert jetzt Punkte. Die Belegdichte steigt auf 0,40 bei Profil A und auf 0,50 bis 0,60 bei Profil B. S4 v3.1 zeigt Referenz, Band, Abstand und Zielgebot.

Entscheidungen: E34 Der Digest sortiert je Profil erst nach Deckelstatus, dann nach Vorscore. E35 Zwangsversteigerungen sind eine Ausbaustufe (Vorschlag Christoph, noch nicht im Konzept). Quellen sind das ZVG-Portal und die Terminliste des Amtsgerichts Koeln. Der Termin liegt nach Phase 2.

Offen: In objekt sechs Spalten anlegen (referenzpreis_eur, referenz_qm, preisabstand_pct, zielgebot_eur als number; referenz_band, referenz_quelle als string). Danach S3 v2 importieren und die 90 Objekte einmal neu bewerten lassen (zustand auf neu setzen). Die Geometrie-Pruefung der Stadtteilzuordnung bleibt offen.

## Stand 15.09.2026: Phase 1a abgeschlossen, Phase 1b in Betrieb

### Was seit dem 10.09.2026 dazugekommen ist

**S3 Buchhalter v2** ist seit 11.09.2026 in Betrieb. Die sechs Spalten sind angelegt, der alte S3 ist geloescht, 93 Objekte wurden neu bewertet und gemeldet. Korrektur im Ereignis-Knoten: objekt_schluessel kommt aus $json, nicht aus dem alten Knotennamen (Commit 7ae7443).

**S5 Waechter** laeuft taeglich 7:20. Er meldet nur bei Befund: ungelesene Mails aelter als zwei Stunden, DLQ, Objekte, die in neu oder vorbewertet haengen, kein neues Objekt seit drei Tagen, leere ereignis-Tabelle. Sonntags kommt eine Wochenrueckschau dazu.

**Referenzband geprueft.** Der Vergleich gegen die Kaufpreisspannen des Marktberichts ergab bei Wohnungen einen Median von 0,95 ueber 45 Stadtteile und bei Haeusern 1,00 ueber 53. Ein echter Fehler wurde gefunden und behoben: die Zone "Marienburg / Bayenthal Sued" galt faelschlich fuer ganz Bayenthal (Faktor 2,35). Rest: Weiss liegt bei 1,17, weil Suerth und Weiss sich eine Zone teilen. Die Geometrie-Pruefung gegen die Stadtteilgrenzen bleibt offen; opengeodata.nrw.de war aus der Cowork-Sitzung nicht erreichbar.

**S6 Kachel** schreibt alle 30 Minuten sensor.immo_objekte. immo.yaml liegt in packages/, die Dashboard-Karte unter homeassistant/. Stand der ersten Messung: 64 von 93 Objekten unter dem Deckel, 16 Verhandlungsfaelle.

**S7 Expose-Anfrage** ist der Telegram-Rueckkanal (E36). Alle zwei Minuten fragt n8n getUpdates ab. Der Befehl /e<Exposenummer> liefert Link und fertigen Anfragetext; gesendet wird in der IS24-App von Hand, weil Ziffer 8.2 der Verbraucher-AGB automatisierte Nutzung verbietet und jede Anfrage einen Maklernachweis begruendet. Neue Spalten in objekt: anfrage_status, angefragt_am. S4 v4 zeigt die antippbare Zeile "Expose anfragen: /e..." ab Vorscore 55.

**LiteLLM hat eine Datenbank.** Ohne DATABASE_URL gibt es keine Oberflaeche und keine virtuellen Schluessel ("Not connected to DB!"). Die Datenbank laeuft als eigener Portainer-Stack litellm-db (postgres:17) auf dem Synology NAS, Port 5433, erreichbar ueber 192.168.178.163. Die Zugangsdaten stehen in /home/crosenkr/data/litellm/.env (chmod 600). Erster virtueller Schluessel: immo, nur gpt-oss-120b.

**C1 Leser Expose** laeuft alle 15 Minuten (E37, E38). Kette: ungelesene Mail lesen, die nicht von myscout@immobilienscout24.de kommt, PDF-Anhang laden und Text ziehen, S2 schwaerzen (Rufnummern, Mailadressen, Verweise, Hausnummern; Strasse und Stadtteil bleiben), lokales Modell ueber LiteLLM fragen, Antwort pruefen, Spalten expose_status, expose_am und expose_felder schreiben. S1 hat dafuer den Absenderfilter "From Contains myscout@immobilienscout24.de" bekommen.

Die Positivliste aus Konzept 5.7 haelt: im Test standen Kaufpreis 925.000 Euro, Wohnflaeche 220 m2 und Energieeffizienzklasse F deutlich im Expose, und keines dieser Felder kam durch.

**Zitatanker (R1, R7).** Jeder Beleg muss woertlich im geschwaerzten Text stehen. Steht er nicht dort, traegt das Feld beleg_geprueft = false; der Wert bleibt, gilt aber als unbelegt. Der Prompt verlangt seit dem 15.09. eine zusammenhaengende Stelle, Zeichen fuer Zeichen, kein Zusammensetzen. Davor setzte das Modell Belege aus zwei Stellen zusammen; danach waren alle Belege im Test woertlich.

**C2 Rechner** laeuft alle 30 Minuten. Er leitet aus baujahr und ausstattung den Bauzustand ab: Sockel aus dem Baujahr (ab 2015: 90, ab 2000: 80, ab 1980: 65, ab 1950: 50, davor: 45), Stichworte heben oder senken ihn (kernsaniert +20, saniert +15, modernisiert +12, neuwertig +10, energetisch +8; sanierungsbeduerftig -30, Modernisierungsstau -25, Altbestand -20, unsaniert -15). Der Zustand geht in den Vorscore, nicht in die Belegdichte (Konzept 5.7, R8). Herleitung steht in bewertung_json unter zustand_modell und im Ereignis C2. Test: Vorscore 91 auf 83 bei Zustand 62, Belegdichte unveraendert 0,40.

### Merkposten aus der Umsetzung

- Der Home-Assistant-Knoten erwartet Attribute im Parameter stateAttributes. Unter "attributes" werden sie still ignoriert: der Zustand kommt an, die Attribute fehlen.
- "Always Output Data" an einem Code-Knoten erzeugt ohne Treffer ein leeres Element, das die Folgeknoten mit leeren Feldern durchlaufen.
- Die Abrufmarke aus $getWorkflowStaticData ueberlebt den Lauf nicht. S7 bestaetigt die Updates deshalb mit einem eigenen Knoten direkt bei Telegram.
- Bei n8n-nodes-imap stehen Betreff und Absender unter envelope, nicht direkt im Item. Der Lesebefehl liefert nur Anhangsinfos; die Datei holt die eigene Aktion "Download Attachment". "Extract From PDF" legt den Text unter text ab.
- Eine leere UID-Liste laesst IMAP mit "Unable to set flags" scheitern. Die Sammelknoten geben deshalb ein leeres Ergebnis zurueck, das den Zweig anhaelt.
- docker restart liest eine geaenderte --env-file nicht neu; der Container muss neu erzeugt werden. Auf dem Jetson Thor fehlt das Compose-Plugin.
- gpt-oss-120b verbraucht das ganze Tokenfenster mit reasoning_content und antwortet dann leer. max_tokens 3000 und reasoning_effort low loesen das.

### Entscheidungen

- **E36** (11.09.2026) Exposes kommen ueber eine Anfrage beim Makler in den Posteingang, ausgeloest per Telegram-Knopf je Objekt, nur ab Vorscore 55. Vollautomatisches Absenden des Kontaktformulars ist verworfen (IS24-AGB Ziffer 8.2, Maklernachweis).
- **E37** (11.09.2026) C1 liest mit dem lokalen Modell ueber LiteLLM, Schluessel immo.
- **E38** (11.09.2026) S2 schwaerzt Hausnummer und Kontaktdaten. Strasse und Stadtteil bleiben (R19).
- **E39** (15.09.2026) Ein Beleg, der nicht woertlich im Text steht, verwirft das Feld nicht, sondern kennzeichnet es mit beleg_geprueft = false.
- **E40** (15.09.2026) Eine Mail ohne Exposenummer geht gar nicht erst ans Modell, sondern nach Immo/DLQ.

### Offen

- OFFEN: Objektcluster gegen Dubletten. Der Digest vom 15.09. zeigt dieselbe Wohnung zweimal und dasselbe Bauvorhaben dreimal, jeweils mit verschiedenen Exposenummern. Ein Cluster ueber Titel, Preis und Flaeche gehoert nach S3.
- OFFEN: Goldmenge aus fuenf bis zehn Exposes von Hand auswerten und gegen Prompt und Zustandsregeln messen. Lohnt erst, wenn genug echte Exposes eingegangen sind.
- OFFEN: Die Sockelwerte je Baujahrklasse in C2 sind gesetzte Annahmen, nicht amtlich belegt. Gehoert nach ungeprueft.md.
- OFFEN: Geometrie-Pruefung der Stadtteilzuordnung im Referenzband.
- OFFEN: Parser gegen die erste Echtzeit-Benachrichtigung pruefen; die drei Zeilen mit suchauftrag "loeschen" aus dem Erstlauf von Hand auf "A Anlage" setzen.
- OFFEN: docs/KONZEPT.md von Christoph hochladen.
- OFFEN: E35 Zwangsversteigerungen. Quellen ZVG-Portal und Terminliste des Amtsgerichts Koeln. Termin nach Phase 2.
- OFFEN: C3 Blindpruefer und C4 Aufbereiter (Phase 1b, Rest).

# Kapitel 3. Quellenstrategie

Geschrieben gegen die Regeln aus Kapitel 1 und die Rollen aus Kapitel 2. Alle Abrufe erfolgten am 07.09.2026.

## 3.1 Drei Wege, drei Rollen

**Zulauf** liefert neue Objekte und fällt leise aus. **Referenz** liefert amtliche Vergleichszahlen und fällt laut aus. **Signal** meldet Veränderung an Bekanntem.

| Weg | Quelle | Rolle, Ort | Takt |
|---|---|---|---|
| A Postfach | Portal-Suchagenten | Zulauf, Signal; S1 | Abruf alle 15 Min |
| A Postfach | Genossenschaften, Bauträger, Makler | Zulauf; S1 | Abruf alle 15 Min |
| B Feed | RSS, Terminliste Amtsgericht Köln | Zulauf, Signal; S1 | RSS stündlich, Terminliste wöchentlich |
| B Feed | OParl Stadt Köln, gesperrt bis Prüfung | Signal; S1 | ruht |
| C Referenz, automatisch | Immobilienrichtwert, Bodenrichtwert, Umgebungslärm, Quartalsbericht, Grunderwerbsteuer | Referenz; C5 | quartalsweise |
| C Referenz, Handarbeit | Grundstücksmarktbericht, Bodenrichtwertdokument, Mietspiegel | Referenz; Christoph | jährlich, `zugriffsweg: handarbeit` |

Kein Kanal ohne Rolle. Rohtext bleibt in n8n, Belege und Zustand liegen im Repository.

## 3.2 Rechtsrahmen

| Portal | robots.txt | Vertrag, und was folgt |
|---|---|---|
| ImmoScout24 | `Claude-User`, `Claude-SearchBot`, `ClaudeBot`: `Allow: /`, `Disallow: /immobilienpreise` ([robots.txt](https://www.immobilienscout24.de/robots.txt)) | AGB 8.2: „automatisierte Abfrage durch Skripte, Bots, Crawler, o.ä. … nicht gestattet"; 8.3: kein „Aufbau einer eigenen Datenbank" ([AGB](https://www.immobilienscout24.de/agb/nutzungsagb.html)). Kein Suchlauf, kein Archiv |
| Immowelt | Claude-Bots namentlich, Sperren wie `*`; gesperrt sind `/expose/*/karte` und `/suchauftrag/`, **nicht** die Exposéseite ([robots.txt](https://www.immowelt.de/robots.txt)) | Crawler-Klausel nicht auffindbar **[ungeprüft]**. Ungeklärt, kein Abruf |
| Kleinanzeigen | — | § 5 Nr. 1 verbietet ohne „ausdrückliche schriftliche Zustimmung" „Crawler, Spider, Scraper" ([Bedingungen](https://themen.kleinanzeigen.de/nutzungsbedingungen/)). Kein Abruf |
| IS24-API | — | 6.2: Speicherung „beschränkt auf einen Tag (24 Stunden)"; 6.1 untersagt „eigene Datenbanken oder Auswertungen" ([API](https://api.immobilienscout24.de/terms-of-use/01012019/de/)). Geprüft, verworfen |

- **Q1 Vertrag schlägt robots.txt** (R21). Immowelt zeigt den Fall: Die robots.txt erlaubt die Exposéseite, der Vertrag ist ungeklärt, also wird nicht abgerufen.
- **Q2 Kein Suchlauf gegen eine Portalsuche.** Verarbeitet wird nur, was das Portal zustellt.
- **Q3 Kein Bestandsaufbau** (AGB 8.3, R19). Rohtext lebt 90 Tage. Dauerhaft bleiben Kennung, URL, Zeitstempel, Feldwerte, Score und Entscheidung.

  **Warum 90 Tage kein Bestandsaufbau sind.** *Zweck:* Die Haltung dient allein der Fehlersuche am Parser. Ändert ein Portal seine Mailvorlage, lässt sich der Fehler nur am ursprünglichen Text nachvollziehen; die Feldfüllquote aus Kapitel 5 zeigt den Bruch, der Rohtext erklärt ihn. *Frist:* 90 Tage decken einen Quartalszyklus der Vorlagenänderungen ab. *Löschmechanik:* Ein n8n-Workflow löscht täglich alles Ältere; die Löschung ist erzwungen, nicht verabredet. *Abgrenzung:* Der Rohtext liegt außerhalb des Repositories auf der Synology, ist nicht durchsuchbar indexiert, wird von keiner Auswertung gelesen und von keiner Suche erreicht. Was dauerhaft bleibt, sind Feldwerte und Entscheidungen, also Christophs eigene Arbeitsergebnisse, nicht die Anzeigen des Portals. *Personenbezug:* Der Rohtext enthält bis zur Löschung Klarnamen und Rufnummern von Anbietern. Die Rechtsgrundlage dafür steht in `immo/recht.md` und ist nicht die Haushaltsausnahme, deren Reichweite bei einer Kapitalanlage zweifelhaft ist (Kapitel 6.6).
- **Q4 Keine URL aus einem Mailinhalt** (R20). S1 liest die Objekt-ID, S3 baut die URL aus einer Vorlage je Portal. Das ist Injektionsschutz und Dedup-Schlüssel in einem.
- **Q5 Kein Ersatzweg für einen gesperrten Weg.** Kein anderer User-Agent, kein Browser, kein Dritter. Ein gesperrter Pfad wird Handarbeit oder bleibt Lücke.

Q5 erledigt die naheliegende Fertiglösung. `flathunters/flathunter`, 1,1 k Sterne, AGPL-3.0, sagt selbst: „At this time, ImmoScout24 can not be crawled by Flathunter without using Capmonster" ([Repo](https://github.com/flathunters/flathunter)). Ein CAPTCHA-Löser umgeht eine Schutzmaßnahme; verworfen wegen des Vertrags, nicht wegen der Technik.

## 3.3 Zulauf

**A. Portal-Suchagenten in ein IMAP-Postfach (Primärkanal).** Die Portale liefern den Push selbst. ImmoScout24 nennt auf seiner Suchseite, dass die Hälfte der Nutzerinnen und Nutzer sich im Stundentakt neue Inserate schicken lässt ([Suche](https://www.immobilienscout24.de/suchen-finden-einziehen/suche.html)); eine Zusage über den Versandtakt ist das nicht. Immowelt bietet den Suchassistenten von sofort bis wöchentlich ([Immowelt](https://www.immowelt.de/suchassistent)). Kleinanzeigen bietet Suchaufträge **[ungeprüft, keine Hilfeseite geprüft]**. Die Kette steht: `umanamente/n8n-nodes-imap`, 161 Sterne, MIT, letzter Push 02.07.2026 ([Repo](https://github.com/umanamente/n8n-nodes-imap)).

Routing-Schlüssel ist **nicht** die Empfängeradresse: Portale versenden an die Kontoadresse, und ob sie eine Unteradresse mit Pluszeichen annehmen, ist je Portal zu prüfen **[ungeprüft]**. Primärschlüssel ist der **Name des Suchauftrags** (`P1-IS24-KAP`), Ersatzschlüssel das Tripel aus Absenderdomain, Betreffmuster und Alias in `immo/quellen/kanaletikett.yaml`. S1 verschiebt jede Mail nach `verarbeitet` oder nach `dlq`. Ein versionierter Parser je Portal zieht die ausgezeichneten Felder der Portalvorlage heraus: **Objekt-ID, Kaufpreis, Wohnfläche, Grundstücksfläche, Zimmerzahl, Ort und Energieeffizienzklasse.** Diese sieben Felder entstehen ohne Modell. Sie tragen deshalb nie die Marke `modell` und zählen nach R8 in die Belegdichte, auch in der Variante V0 (Kapitel 5.7). Welche davon eine Portalvorlage tatsächlich als eigenes Feld führt, misst die Handzählung A1.7 je Vorlage; bis dahin ist die Liste eine Annahme **[ungeprüft]**. Danach schwärzt S2 Namen, Rufnummern und Hausnummern (R19).

**B. RSS, stündlich.** Der Core-Node „RSS Feed Trigger" liest die Feeds ([Doku](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.rssfeedreadtrigger)). Die großen Portale bieten keine Angebots-Feeds **[ungeprüft]**, Bauträger und Behörden schon. Aufgenommen wird ein Feed nur mit `guid`, `pubDate` und stabiler URL; Pflegeort ist `immo/quellen/feeds.yaml`.

**C. Zwangsversteigerung.** Die robots.txt des ZVG-Portals sperrt unter `User-agent: *` den Pfad `/gerichte/`, drei Dateien nach dem Muster `template.internet.show*.php` und je zwei Schreibweisen von `showZvg*` und `showAnhang*` ([robots.txt](https://www.zvg-portal.de/robots.txt)). Der Kanal entfällt nach Q5. Offene Zweitquelle ist das [Amtsgericht Köln](https://www.ag-koeln.nrw.de/behoerde/zvg_termine/index.php), das eine Übersicht der nächsten zehn Versteigerungstermine mit den Spalten Objekt (mit Verkehrswert) und Termin führt, HTTP 200, keine robots.txt (404). Die Liste rolliert, einzelne Zeilen werden deshalb nicht zitiert. Der Verkehrswert stammt aus einem Gutachten, nicht vom Verkäufer.

**Ein Lauf je Woche, und wohin er schreibt.** Der Wochenlauf schreibt in die n8n-Datentabelle `objekt` mit `quelle: ag-koeln-zvg` und dem Cluster-Schlüssel aus Abschnitt 3.4. Über denselben Schlüssel laufen seine Objekte im Außenmaß in Abschnitt 3.8 gegen die Cluster der Portale.

**D. Off-Market über OParl.** Die Stadt Köln stellt ihr Ratsinformationssystem über OParl bereit (`buergerinfo.stadt-koeln.de/oparl/bodies`), Lizenz „Datenlizenz Deutschland – Zero – Version 2.0" ([Datensatz](https://ckan.open.nrw.de/dataset/oparl-api-koeln-k)). Dort stehen Konzeptvergaben, Grundstücksverkäufe, Erbbaurechte und Bebauungspläne, oft Monate vor dem Portal. Ein Bebauungsplan im Nachbarblock gehört zur Mikrolage (R12) und wird deshalb zur Fahne ohne Score (R13). Der Kanal wird **nicht eingerichtet, solange sein Rechtsstand offen ist**: Seine robots.txt war zweimal nicht abrufbar, eine Bot-Sperre bleibt **[ungeprüft]**. Phase 0 entscheidet nach Q5.

**E. Genossenschaften, Bauträger, Makler.** Dieser Kanal ist organisatorisch, nicht technisch. Listen führen die [Stadt Köln](https://www.stadt-koeln.de/artikel/06282/index.html) und der [VdW Rheinland Westfalen](https://vdw-rw.de/der-verband/mitgliederliste/). Christoph trägt sich in höchstens acht Verteiler ein, mit der Adresse aus Weg A. `immo/quellen/anbieter.yaml` führt `name`, `art`, `eintrag_am`, `kanal`, `letzte_mail`. Wer 180 Tage nichts schickt, gilt als `still`. Genossenschaften vergeben nach Warteliste, nicht nach Markt.

**Abrufgrenzen und tatsächliche Frequenz.** Wo keine Grenze veröffentlicht ist, steht eine selbst gesetzte Obergrenze.

| Quelle | Veröffentlichte Grenze | Tatsächliche Frequenz |
|---|---|---|
| IMAP-Postfach | keine | alle 15 Minuten, selbst gesetzt |
| RSS je Feed | keine | stündlich, selbst gesetzt |
| Terminliste Amtsgericht Köln | keine | einmal je Woche, selbst gesetzt |
| OParl Stadt Köln | keine | ruht, sonst einmal je Tag, selbst gesetzt |
| BORIS-WMS `wms_nw_brw` | keine | eine Abfrage je Bodenrichtwertzone und Quartal |
| Umgebungslärm-WMS `laerm_stufe4` | keine | eine Abfrage je Zone und Quartal |
| gars.nrw Quartalsbericht | keine | einmal je Quartal, selbst gesetzt |
| Nominatim, öffentlich | eine Anfrage je Sekunde ([Richtlinie](https://operations.osmfoundation.org/policies/nominatim/)) | eine Anfrage je Sekunde, mit Zwischenspeicher |

## 3.4 Cluster und Ereignisarten

Wer nur dedupliziert, wirft die wertvollste Information weg. Der Schlüssel setzt R14 um und entsteht aus Feldwerten, nie aus Prosa (R24):

```
schluessel = PLZ | floor(flaeche_m2 * 2) / 2 | zimmer | floor(baujahr / 10) * 10
```

**Der Schlüssel bildet Blöcke, keine Wahrheit.** Ein harter Schnitt bei jedem halben Quadratmeter und bei jedem Jahrzehnt trennt identische Objekte an jeder Fachgrenze: 87,4 und 87,6 m² fallen in verschiedene Fächer, ebenso Baujahr 1909 und 1911. Genau dort erreicht das mit 25 Punkten gewichtete Merkmal „Wohnfläche plus minus 1,5 m²" aus Kapitel 5.3 seinen Vergleichspartner nie. **Deshalb prüft die Blockbildung immer das eigene Fach und die beiden Nachbarfächer**, in Fläche wie in Baujahrzehnt. Aus einem Vergleich werden neun; bei 40 Objekten je Lauf ist das ohne Kosten machbar, weil der Vergleich deterministisch und lokal läuft.

Bei gleichem oder benachbartem Schlüssel entscheidet die Jaccard-Ähnlichkeit über 3-Gramme der ersten 300 normierten Zeichen, Schwelle 0,6. **Rückfall bei fehlenden Feldern.** Fehlt `baujahr`, wird das Feld mit `0` besetzt und die Schwelle auf 0,75 angehoben. Ohne diese Anhebung zerfiele ein Cluster, sobald ein Portal das Baujahr mitliefert und ein anderes nicht. Fehlt `flaeche_m2`, bleibt der Eintrag `nicht geclustert` und erscheint so im Digest (R6). *Abnahme:* T5, T6 und T20 in Kapitel 6.

**Die Portalkennung steht ebenfalls nicht im Schlüssel**, und das ist der Grund, warum die Blockbildung portalintern und portalübergreifend dasselbe rechnet. Ein zweiter Zulauf ändert die Datenmenge, nicht das Verfahren; deshalb wird das übergreifende Goldkorpus-Paar schon in Phase 1a abgenommen, obwohl dort nur ein Portal liefert.

Der Preis steht nicht im Schlüssel. Sonst wanderte ein Objekt bei jeder Senkung in ein neues Cluster und hieße `NEU` statt `PREIS_RUNTER`. Abweichende Felder werden gemeldet, nie gemittelt (R15).

| Ereignisart | Auslöser und Wirkung | Erzeugter Ereignistyp |
|---|---|---|
| `NEU` | erster Eingang im Cluster | `gesehen` |
| `PREIS_RUNTER` | Preis sinkt um mindestens 2 Prozent, bevorzugt gemeldet | `preis_geändert` |
| `PREIS_RAUF` | Preis steigt um mindestens 2 Prozent, Zeichen für Anbieterwechsel oder Testballon, kein Alarm | `preis_geändert` |
| `MEHRFACHLISTUNG` | gleicher oder benachbarter Cluster, andere Portal-ID, ein Dossier mit mehreren Quellen | `feld_geändert` |
| `WIEDERVORLAGE` | Cluster kehrt nach über 21 Tagen zurück | `wieder_aufgetaucht` |
| `VERSCHWUNDEN` | 14 Tage ohne Erwähnung, Vermarktungsdauer geschlossen | `verschwunden` |

Ereignisarten in Großbuchstaben beschreiben den Cluster und gehen in den Meldeschlüssel aus Kapitel 5. Ereignistypen in Kleinbuchstaben beschreiben eine Zeile im Log aus Kapitel 2. `PREIS_RUNTER` und Vermarktungsdauer sind die einzigen Verhandlungshebel aus Beobachtung.

## 3.5 Referenzdaten

Sie speisen das Referenzband nach R5. Abgerufen wird **quartalsweise durch C5 je Bodenrichtwertzone**, nie je Treffer: Die BORIS-Antwort trägt mit `BRWZNR` eine stabile Zonennummer, 40 Treffer im selben Stadtteil kosten eine Abfrage. C3 ruft nichts ab.

| Datum | Zugang | Lizenz |
|---|---|---|
| **Immobilienrichtwerte NRW** | Shapefile und Atom-Feed über [opengeodata.nrw.de](https://www.opengeodata.nrw.de/produkte/infrastruktur_bauen_wohnen/boris/IRW/), Datensatz auf [open.nrw](https://open.nrw/dataset/bcffbad3-4186-4b2f-b5e6-83bb154e3401); Teilmarkt im Feld `TEILMA` | dl-de/zero-2-0 |
| **Bodenrichtwert NRW** | GetFeatureInfo auf `https://www.wms.nrw.de/boris/wms_nw_brw`, Layer `17 brw_mehrgeschossige_bauweise`, `INFO_FORMAT=application/geo+json`, `CRS=EPSG:25832`; Rückfall Atom-Feed oder Shapefile ([opengeodata.nrw.de](https://www.opengeodata.nrw.de/produkte/infrastruktur_bauen_wohnen/boris/BRW/)) | `Fees: none/keine`, dl-de/zero-2-0 |
| Grundstücksmarktbericht Köln | `boris.nrw.de/borisfachdaten/gmb/`, für Bots gesperrt, deshalb Handarbeit; liefert Mittelwertzeilen, **Liegenschaftszinssätze** und Umrechnungskoeffizienten | frei lesbar |
| Quartalsbericht Gutachterausschuss | [gars.nrw](https://www.gars.nrw/koeln/service-koeln/quartalsbericht-koeln), vierteljährlich seit 2023, zuletzt Q1 2026 | frei |
| **Mietspiegel Köln 2025** | Herausgeber ist die Rheinische Immobilienbörse e.V., nicht die Stadt ([Stadt Köln](https://www.stadt-koeln.de/artikel/06421/index.html)); „Aktueller Stand: April 2025", „Aktualisierung: ca. alle zwei Jahre", „Einzelpreis: 0,00 Euro" ([RIB](https://www.rheinische-immobilienboerse.de/Mietspiegel_Koeln_2025.AxCMS)), im PDF dagegen „Schutzgebühr 4,00 Euro" | Widerspruch gemeldet (R15), nur abgeleitete Kennzahlen (R5) |
| **Umgebungslärm NRW** | GetFeatureInfo auf `https://www.wms.nrw.de/umwelt/laerm_stufe4`, 11 abfragbare Layer (`STR_DEN`, `STR_NGT`) | `Fees: keine`, dl-de/by-2-0 |
| Grunderwerbsteuer NRW | 6,5 Prozent für ab 01.01.2015 beurkundete Verträge ([Finanzämter NRW](https://www.finanzamt.nrw.de/steuerinfos/privatpersonen/haus-und-grund/grunderwerbsteuer-wissenswertes-beim-grundstuecks-oder)) | frei, Zeile in `immo/normen.md` (R9) |
| Kaufnebenkosten NRW, übrige Posten | Notar rund 1,5 Prozent, Grundbuch rund 0,5 Prozent, Käuferanteil der Maklerprovision 3,57 Prozent einschließlich Umsatzsteuer, zusammen „ca. 11 bis 12 Prozent" mit und „ca. 8,5 Prozent" ohne Makler ([immobilie.nrw](https://www.immobilie.nrw/kaufnebenkosten-nrw/)) | frei, Zeilen in `basis.yaml` |

Ein Testabruf in Köln-Altstadt/Süd lieferte `BRW: 1940`, `STAG: 2026-01-01`, `ORTST: Altstadt/Süd`. Der Artikel hält Bodenrichtwerte für Sprachmodelle nicht für abrufbar; für NRW gilt das nicht, sobald der Abruf im Workflow liegt (R3). Der `STAG` macht die Alterung messbar, der Quartalsbericht schließt die Alterungslücke des Jahresberichts.

**Der Kölner Mietspiegel ist kein qualifizierter Mietspiegel.** Herausgeberin ist ein Verein, nicht die Gemeinde und keine Interessenvertretung im Zusammenwirken nach § 558d BGB. Eine Vermutungswirkung trägt er deshalb nicht. Für die Suche ist das ohne Folge, denn der Mietspiegel liefert hier nur eine Vergleichsgröße und nie eine Rechtsfolge (R11). Für Phase 3 ist es eine Pflichtzeile im Dossier.

Runbook-Hinweis: `boris.nrw.de/robots.txt` sperrt `/borisfachdaten/` ([robots.txt](https://www.boris.nrw.de/robots.txt)). Die WMS-Antwort verweist im Feld `UDOK_URL` genau dorthin; nach Q5 wird ihm nicht gefolgt. Marktbericht und Bodenrichtwertdokument legt Christoph jährlich in Dropbox unter `referenz/` ab.

## 3.6 Belegschrank

Jede Referenzdatei wird einmal geholt, eingefroren und in `immo/quellen/manifest.yaml` verzeichnet.

```yaml
- id: BORIS-BRW-KOELN-2026-Z103070
  quelle_url: https://www.wms.nrw.de/boris/wms_nw_brw
  abruf: 2026-09-07
  stichtag: 2026-01-01
  sha256: <Hash der GeoJSON-Antwort>
  lizenz: dl-de/zero-2-0
  belegklasse: B0
  zugriffsweg: automatisch   # oder handarbeit
  gueltig_bis: 2027-03-31
  robots_geprueft: 2026-09-07
  vertrag_geprueft: 2026-09-07
```

`zugriffsweg` zeigt, welche Belege an Christophs Hand hängen.

1. **Belegzwang** (R1). Jede Zahl trägt eine `id`. Fehlt sie, gilt die Zahl als nicht vorhanden. **Der Weg dorthin führt über die Schemaprüfung nach R6**, nicht über eine sechste Vetoregel: Ein Zahlenfeld ohne Manifest-`id` ist ein Schemaverstoß und löst darüber das Veto nach R18 aus. Die Vetotafel bleibt bei fünf Regeln.
2. **Stichtagsdrift** (R2). Ist `gueltig_bis` überschritten, erscheint „Beleg veraltet", und der Wert fällt aus dem Score. Marktbericht 15 Monate. Mietspiegel 30 Monate, nicht 24: Bei zweijährigem Turnus schlüge eine 24-Monats-Frist nie an.
3. **Wiederholbarkeit** (R23). Der SHA-256 zeigt, welche Fassung einer Bewertung zugrunde lag. C5 holt monatlich einen Beleg neu; eine Abweichung heißt, dass die Quelle sich geändert hat, nicht dass das Modell irrt. `robots_geprueft` und `vertrag_geprueft` werden mit erneuert.

**Zwei Abnahmetests.** Eine Zahl ohne Manifest-`id` muss das Dossier durchfallen lassen (Schemaverstoß nach R6, Veto nach R18). Ein Beleg über `gueltig_bis` muss die Warnzeile erzeugen und den Wert aus dem Score nehmen, Feldzustand „nicht ermittelbar", der Treffer bleibt stehen. Beide stehen als **A1.4** in Kapitel 7.

## 3.7 Kanalwächter und Ausfallverhalten

Zwei Kanarienvögel arbeiten bei S5. Sie prüfen den **Kanal**. Den **Inhalt** prüft der Kanarienzwilling nach R16.

- **Kettenwächter.** Je Portal läuft ein bewusst zu weiter Suchauftrag ohne Profilbezug. Er prüft Portal, Versand, IMAP und Parser in einem. Bleibt seine Mail aus, ist nicht der Markt leer, sondern der Kanal tot.
- **Filterzwilling.** Je aktivem Profil läuft ein zweiter Suchauftrag mit gelockerter Preisgrenze und größerem Radius. Liefert das Profil null Treffer und der Filterzwilling liefert Treffer, lautet die Meldung „Filter zu eng, nicht Markt leer". Diesen stillen Fehler sieht der Kettenwächter nicht.

Grundlage sind 14 Tage Messphase, danach ein gleitender 28-Tage-Median je Kanal.

| Symptom | Erkennung, Zustand | Text im Digest |
|---|---|---|
| Suchagent stumm | drei Tage in Folge unter halbem Median → `stumm` | „Kanal IS24 3. Tag unter Erwartung" |
| Suchagent tot | Kettenwächter 24 h stumm → `defekt`, Profil `blind` | „Kanal IS24 ohne Zulauf, prüfen" |
| Filter zu eng | Profil null, Filterzwilling liefert → `verengt` | „Profil 1 ohne Treffer, Zwilling mit 6" |
| Parser scheitert | drei Fehlschläge in Folge oder über 20 Prozent bei mindestens 10 Mails → `defekt` | „2 Mails in dlq, Parser IS24 v3" |
| **Postfach gestört** | drei IMAP-Fehlversuche in Folge → `gestört` | „Postfach nicht erreichbar, alle Kanäle betroffen" |
| Referenz veraltet | Stichtagsdrift, Wert fällt aus dem Score | „Marktbericht, Stichtag über 15 Monate" |
| Mail mit Anweisungen | vor dem Modellaufruf erkannt (R20) | Zeile im Störungsteil |

**Postfachfehler und totes Portal werden verschieden gemeldet.** Ein Postfachfehler betrifft alle Kanäle gleichzeitig; die Meldung nennt deshalb das Postfach und keinen Kanal, und die Kanalzustände bleiben unverändert, bis das Postfach wieder antwortet. Ein totes Portal betrifft genau einen Kanal; die Meldung nennt ihn namentlich. Ohne diese Trennung erzeugt ein einziger IMAP-Ausfall sieben Kanalalarme.

Die Beharrlichkeit ist Absicht. Ein Kanal mit drei Mails am Tag unterschreitet den halben Median zufällig, und ein Wächter, der zu oft schreit, wird abgeschaltet. Daraus folgt nach R17 die Regel: **Ein Digest darf „keine Treffer" nur melden, wenn alle Kanäle grün sind.**

## 3.8 Abdeckung und Grenzen

**Es gibt keine Grundgesamtheit aller Angebote. Eine Trefferquote lässt sich deshalb nicht berechnen.** Quartalsweise laufen zwei Maße, keines misst Abdeckung.

1. **Kanalanteil.** Ein Sub-Agent prüft an 30 Clustern, welcher Kanal zuerst lieferte und mit welchem Abstand. Das misst Verteilung und Latenz, nichts sonst. Ein Kanal ohne exklusiven Zulauf über zwei Quartale kommt auf die **Streichliste** in `OFFEN.md`, abgeschaltet wird er erst nach Freigabe.
2. **Außenmaß an geschlossener Liste.** Die Terminliste des Amtsgerichts ist amtlich und geschlossen. Ihre Objekte im Profil werden über den Cluster-Schlüssel aus Abschnitt 3.4 gegen die Cluster in der Tabelle `objekt` geprüft. Die Zahl ist eine Untergrenze und kein Rückruf, weil Zwangsversteigerungen selten auf Portalen erscheinen.

Zulauf kommt im Takt des Suchagenten; die ersten Minuten gehören der App. Preissenkungen meldet kein Suchagent, und ein Einzelabruf berührt Klausel 8.2. Kleinanzeigen führt die Pflichtangaben nach § 87 GEG oft nicht, R7 schlägt dort an. Bilder fehlen in der Mail. Die Lärmklasse ist ohne Kalibrierung kein Pegel **[ungeprüft]**. Blind bleibt das System bei privaten Netzwerken und hinter jedem Portallogin.

## 3.9 Anschluss

Kapitel 2 erhält je Satz einen Eingangsvertrag für S3: Portal, Objekt-ID, URL, Cluster-ID, Ereignisart, Kanalstatus, `portal_zeit`. Kapitel 4 nutzt Immobilienrichtwert und Marktbericht für die Preisplausibilität, den Liegenschaftszinssatz als Ertragsmaßstab, den Mietspiegel für die Vergleichsmiete, Lärm und Bebauungsplan als Fahnen (R13), `PREIS_RUNTER` und Vermarktungsdauer als Eingaben. Kapitel 5 nutzt Cluster und Ereignisarten für die Entdopplung und Abschnitt 3.7 für das Runbook. Kapitel 6 nutzt Q1 bis Q5 und den Belegschrank. Kapitel 7 richtet Postfach, Suchaufträge und Wächter ein.

---

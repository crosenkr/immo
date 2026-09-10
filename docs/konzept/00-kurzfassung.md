# Agententeam für die kontinuierliche Immobiliensuche. Konzept für die Umsetzung in Cowork

Stand 07.09.2026. Regelwerk 3.0. Ort der Wahrheit ist das private Repository `crosenkr/ki-umgebung`.

## Kurzfassung

Beschrieben wird ein Team aus zehn Rollen, das zwei konfigurierbare Suchprofile kontinuierlich bedient. Fünf Rollen laufen als n8n-Workflows auf der Synology und dürfen nicht ausfallen, denn ein verpasstes Angebot ist unwiederbringlich. Fünf Rollen laufen in Cowork als geplante Aufgaben und fällen Urteile. Der Zustand liegt außerhalb jeder Sitzung: das Ereignis-Log in n8n-Datentabellen, Profile und Regeln im Repository.

**Vor dem Bau steht eine Entscheidung über den Bau selbst.** Abschnitt 2.10 stellt der vollen Verteilung über drei Laufzeiten zwei minimale Varianten gegenüber, die mit einer Laufzeit auskommen. Kapitel 7 ist so geordnet, dass die minimale Variante zuerst entsteht und täglich nützt, bevor die volle Variante überhaupt beginnt. Die Wahl fällt als E0 im ersten Tagesordnungspunkt von Sitzung 1.

Ein Tag der vollen Variante verläuft so. Alle 15 Minuten holt S1 Sammler die Mails der Portal-Suchagenten aus einem IMAP-Postfach, stündlich die freigegebenen RSS-Feeds. S2 Schwärzer entfernt Namen, Rufnummern und Hausnummern auf dem Jetson, bevor ein Text die eigene Hardware verlässt. S3 Buchhalter schreibt Ereignisse und bildet Objektcluster über Portale hinweg. Nachts startet eine Cowork-Sitzung: C1 Leser füllt Felder mit Zitat und Belegklasse, C2 Rechner rechnet als Skript und prüft das Schema, C3 Blindprüfer prüft ohne Kenntnis des Erstergebnisses, C4 Aufbereiter schreibt Digest und Dossiers. Ab 07:00 stellt S4 Zusteller über Telegram zu, mit Knöpfen für Entscheidung und Grund. S5 Wächter meldet stumme Kanäle. Monatlich pflegt C5 Pflegelauf Referenzband, Normstand, Gewichte und Archiv.

Drei Sätze tragen den Entwurf. Erstens: Die eingestandene Lücke muss günstiger sein als die geratene Zahl. Zweitens: Der teure Fehler ist der nicht gezeigte Treffer, deshalb prüft die Gegenprüfung die Verworfenen. Drittens: Ein leerer Digest ist ein Ergebnis und geht raus.

Christoph entscheidet über 34 Punkte, gesammelt als E0 bis E33 in Kapitel 8. Acht davon fallen in Sitzung 1: die Bauvariante, Objektarten, Region, Kaufsummen-Deckel je Profil, Schwellen, Kanäle und Frequenz, Portal für Phase 1 und der Zuschnitt der Sitzung selbst. Der Rest fällt vor Phase 0 bis 3, jeweils dort vermerkt. Er richtet Postfach, Portalkonten, Telegram-Bots und Repository selbst ein; Claude hat keinen SSH-Zugang und bedient n8n nicht.

Der Aufwand bis zum ersten nutzbaren Ergebnis (Phase 0 bis 1b) beträgt **15,5 bis 25,0 Stunden**, bis zum Vollbetrieb einschließlich Phase 2 **26,5 bis 45,0 Stunden**. Der Monatssockel liegt danach bei **1,5 bis 2,5 Stunden** für die minimale und bei **3,6 bis 5,7 Stunden** für die volle Variante. Die Modellkosten liegen bei 37,20 USD im Monat in Phase 2, bei 42,60 USD ab Phase 3 und bei 55,14 USD mit werktäglichem Deltalauf.

## Leseanleitung

- **Kapitel 1** legt die 24 Regeln fest, auf die alle übrigen Kapitel verweisen. Wer eine Regelnummer sucht, findet sie dort und im Verzeichnis in Kapitel 8.
- **Kapitel 2** beschreibt die zehn Rollen, die Verteilung auf n8n, Cowork und Jetson, den Zustandsspeicher und in Abschnitt 2.10 die Entscheidung zwischen minimaler und voller Variante. Wer wissen will, wer was tut, liest hier.
- **Kapitel 3** beschreibt, woher Angebote kommen und was rechtlich erlaubt ist. Wer Konten und Suchaufträge anlegt, liest hier.
- **Kapitel 4** beschreibt Profilschema und Bewertung mit zwei durchgerechneten Beispielen. Wer Gewichte oder Schwellen ändern will, liest hier.
- **Kapitel 5** beschreibt Zeitplan, Dedup, Digest und Runbook. Wer den Betrieb führt, liest hier.
- **Kapitel 6** beschreibt Halluzinationsschutz, Tests, Injektionsschutz, Datensparsamkeit und Recht. Wer prüft, ob es trägt, liest hier.
- **Kapitel 7** beschreibt die Phasen mit Abnahmekriterien, die Agenda für Sitzung 1 und die Checkliste. Wer anfangen will, liest hier zuerst.
- **Kapitel 8** sammelt Regeln, Rollen, Tests, Abnahmen, Redaktionsentscheidungen, alle `[ungeprüft]`-Stellen und alle offenen Entscheidungen.
- **Kapitel 9** listet alle Quellen mit Abrufdatum.

Ablage im Repository: `immo/regeln.md`, `immo/normen.md`, `immo/quellen/manifest.yaml`, `immo/profile/`, `immo/prompts/`, `immo/gold/`, `immo/journal/`, `immo/archiv/`, `immo/runbook.md`, `immo/recht.md`. Offene Punkte stehen in `OFFEN.md` im Wurzelverzeichnis.

---

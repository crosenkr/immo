# Rollen S1 bis S5, C1 bis C5

Quelle: Konzept Kapitel 2, Verzeichnis 8.2.

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

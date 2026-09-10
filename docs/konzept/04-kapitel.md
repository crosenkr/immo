# Kapitel 4. Suchprofile und Bewertungsmodell

Geschrieben gegen die Regeln aus Kapitel 1, die Rollen aus Kapitel 2 und den Belegschrank aus Kapitel 3. Abruf 07.09.2026.

## 4.1 Fünf Festlegungen

**F1 Der Score ist Code.** C1 füllt Felder, C2 rechnet als Skript (R3); kein Modell vergibt Punkte oder setzt einen Status. **F2:** Punktzahl und Belegdichte (R8) bleiben getrennt. **F3:** Profile und Referenzwerte sind versionierte Dateien mit Lint im Pull Request (R5). **F4 Signatur:** `sha256(Feldtabelle, Profil-, Band-, Skriptversion, regelversion)`; Kapitel 5 meldet nur bei geänderter Signatur erneut (R14, R23).

**F5 Werbeasymmetrie, mit belegten Ausnahmen.** Schweigt ein Exposé über ein Verkaufsargument, gilt als Obergrenze nicht der Bestwert, sondern die nächstniedrigere Stufe. Zwei Ausnahmen bestehen. Erstens eine belegte Bestandsverteilung: [CBRE](https://www.cbre.de/press-releases/cbre-analyse-aktueller-wohnungsbestand-deutschland-durchschnittlich-energieeffizienzklasse-d) misst an 2,1 Millionen Angeboten im Mittel die Klasse D, daher `[0,55]` für die Energieklasse. Zweitens gilt für `wohnlage_amtlich`: Der Wert stammt aus dem Feld `L_WOHNLAGE` des amtlichen Datensatzes und nicht aus dem Exposé, ein Anbieter kann ihn also nicht verschweigen. Fehlt er dennoch, liegt kein Werbeschweigen vor, sondern eine Lücke im Datensatz. Die Obergrenze bleibt trotzdem eine Stufe unter dem Bestwert, weil eine Lücke im Datensatz häufiger Randlagen trifft: `[30,90]` statt `[30,100]`.

**Rundungsregel.** Alle Zwischenwerte werden exakt gerechnet; gerundet wird erst in der Ausgabe, auf zwei Nachkommastellen. Deshalb kann eine gerundete Produktspalte um bis zu einen Cent von der gerundeten Summe abweichen; maßgeblich ist die exakte Summe.

## 4.2 Prompt 1 vergleicht zwei verschiedene Größen

Der Artikel vergleicht den Angebotspreis je m² mit dem Bodenrichtwert. Das geht nicht: Der Bodenrichtwert ist „bezogen auf einen Quadratmeter Grundstücksfläche" (§ 13 Abs. 1 ImmoWertV, [lxgesetze](https://lxgesetze.de/immowertv-2022/13)), ein Wohnungspreis bezieht sich auf Wohnfläche.

**Passend ist der Immobilienrichtwert, und die Fundstelle dafür lautet genau so.** § 20 ImmoWertV trägt die Überschrift „Vergleichsfaktoren" und definiert Vergleichsfaktoren als „durchschnittliche, auf eine geeignete Bezugseinheit bezogene Werte" für bebaute Grundstücke ([lxgesetze](https://lxgesetze.de/immowertv-2022/20)); er nennt weder den Immobilienrichtwert noch Eigentumswohnungen. Der Immobilienrichtwert ist die nordrhein-westfälische Ausprägung dieses Vergleichsfaktors: Die Gutachterausschüsse führen ihn als „durchschnittliche Lagewerte für Immobilien bezogen auf ein für diese Lage typisches Normobjekt" und nennen als Grundlagen § 20 ImmoWertV, §§ 24 ff. ImmoWertV und § 195 BauGB ([gars.nrw](https://www.gars.nrw/dortmund/produkte-do/immobilienrichtwert-do)). Die Ermächtigung, solche Daten überhaupt abzuleiten, steht in § 193 Abs. 5 Satz 2 BauGB; dort sind unter Nummer 1 die Liegenschaftszinssätze und unter Nummer 4 die Vergleichsfaktoren für bebaute Grundstücke ausdrücklich genannt ([dejure.org](https://dejure.org/gesetze/BauGB/193.html)). Ob daneben § 38 GrundWertVO NRW als Landesnorm einschlägig ist, bleibt **[ungeprüft]**. Alle genannten Paragraphen stehen als eigene Zeilen in `immo/normen.md` (R9).

**Die Bodenwertklammer gilt für Häuser sofort, für Wohnungen erst später.** Bei einem Haus ist sie Bodenrichtwert mal Grundstücksfläche und damit aus zwei belegten Zahlen in einem Schritt rechenbar; sie liefert eine harte Untergrenze des Gesamtwerts und geht in Profil B als Fahne ohne Score ein (R13). Bei Wohnungseigentum bräuchte sie Fläche mal Miteigentumsanteil aus der Teilungserklärung, die beim Fund nicht vorliegt; für Profil A gehört sie deshalb in Phase 3.

## 4.3 Die Preisbasis

**Spur 1, Immobilienrichtwerte (B0),** dl-de/zero-2.0, jährlich ([open.nrw](https://open.nrw/dataset/bcffbad3-4186-4b2f-b5e6-83bb154e3401)). Felder `IRW_WERT` (Euro je m² Wohnfläche), `IRW_STICHTAG`, `TEILMA`, `BAUJAHR_HG`, `L_ORTSTEIL`, `L_WOHNLAGE`, `DENKMALSCHUTZ` ([Datenmodell v3.3](https://www.opengeodata.nrw.de/produkte/infrastruktur_bauen_wohnen/boris/IRW/IRW_Datenmodell.pdf)). n8n lädt das Shapefile jährlich, pinnt die Feldnamen und **bricht bei Abweichung ab**, mit Aufgabe im Repository.

**Spur 1 trägt beide Profile.** Das Datenmodell führt das Pflichtfeld `TEILMA` mit sieben Ausprägungen: 1 Eigentumswohnungen, 2 Ein- und Zweifamilienhäuser freistehend, 3 Reihen- und Doppelhäuser, 4 Mehrfamilienhäuser, 5 gemischt genutzte Gebäude, 6 Büro- und Geschäftsgebäude, 7 Gewerbe und Industrie ([Datenmodell v3.3](https://www.opengeodata.nrw.de/produkte/infrastruktur_bauen_wohnen/boris/IRW/IRW_Datenmodell.pdf)). Profil A liest `TEILMA = 1`, Profil B liest `TEILMA = 2` und `3`. Ein Preisurteil für Häuser braucht also keine Kreisliste und keinen Aufschub.

**Der Normobjekt-Vorbehalt, im Wortlaut.** Der Grundstücksmarktbericht Köln 2026 schreibt zu diesen Werten, dass sich die Auswertung „ausschließlich auf Weiterverkäufe" bezieht und „auf Grundstücke ohne besondere Merkmale (z. B. Baulasten, Altlasten, Denkmalschutz, Erbbaurecht, Wohnungsrecht)" (Kapitel 6.1.2, S. 145). Christophs Vorbild-Fall, die denkmalgeschützte Altbauwohnung, fällt damit heraus: Die bessere Spur gilt für sein Leitobjekt nicht.

**Spur 2, Marktbericht (B1),** Kapitel 6.1.1, je Stadtteil, Verkaufsfall und Baujahresklasse. C5 überträgt die Tabelle nach `immo/referenz/gmb-koeln-<jahr>.csv`, vergleicht die Struktur mit dem Vorjahr und bricht bei Abweichung ab; ein blinder Sub-Agent prüft fünf Zeilen nach. Erst dann entsteht die Bandversion `sha256(csv)`, die ein Score zitiert. Die Zeile Neustadt/Süd, Weiterverkauf, Baujahr vor 1941 nennt auf S. 127 **71 Kauffälle, 91 m² mittlere Wohnfläche, 6.055 Euro je m² im Mittel und eine Spanne von 1.783 bis 10.667 Euro je m²**, Stichtag 01.01.2026.

**Spur 3, Liegenschaftszinssatz (B1), als Maßstab der Rendite.** § 21 Abs. 2 ImmoWertV definiert Liegenschaftszinssätze als „Kapitalisierungszinssätze, mit denen Verkehrswerte von Grundstücken je nach Grundstücksart im Durchschnitt marktüblich verzinst werden" ([lxgesetze](https://lxgesetze.de/immowertv-2022/21)); der Gutachterausschuss veröffentlicht sie im Grundstücksmarktbericht. Eine Bruttorendite ohne diesen Maßstab ist eine Zahl ohne Bezug. Deshalb trägt jedes Dossier von Profil A neben der Rendite den örtlichen Liegenschaftszinssatz mit Fundstelle und Stichtag. **Er vergibt keine Punkte**, denn er bezieht sich auf den Reinertrag, die Rendite hier auf die Kaltmiete; der Vergleich ist eine Einordnung, keine Rechnung (R13). Fehlt die Zeile, steht „nicht ermittelbar", und die Renditepunkte bleiben, weil sie aus der Istmiete stammen.

**Belegabstufung.** Nur eine stadtteil- und baujahrsscharfe Zeile trägt ein Preisurteil; ein Stadt- oder Kreismittel gilt als unbelegt und **trägt nie einen Vorschlag**. Unter drei auswertbaren Kauffällen gilt „nicht ermittelbar" (R6), nach `gueltig_bis` fällt der Wert aus dem Score. Weichen die Spuren um über 20 Prozent voneinander ab, gelten beide, gemittelt wird nie (R15).

**Bandalterung.** `basis.yaml` trägt `band_veraltung_tage: {warnen: 400, sperren: 800}`. Ab `warnen` halbiert sich das Gewicht des Preiskriteriums; nach R2 verliert ein veralteter Wert Gewicht, statt zu verschwinden. Ab `sperren` entfällt jedes Preisurteil, das Feld steht auf „nicht ermittelbar". Der Wert 400 ist mit der Eskalation ESK1 aus Kapitel 2 abgestimmt; beide Werte sind **gesetzte Annahmen**, keine Messwerte.

## 4.4 Profilschema

`basis.yaml` trägt die Leitplanken: `scorefaehige_belegklassen:[B0,B1,B2]` (R1), `belegdichte_min` je Variante (R8, unten), `band_veraltung_tage:{warnen:400,sperren:800}`, `adressaufloesung_digest:strassenabschnitt` (R19), `geo_crs:EPSG:25832`. Das Feld `ko` wird nie vererbt.

**Die Belegdichte-Schwelle hängt an der Bauvariante, nicht am Profil.** In V0 füllt allein das lokale Modell, und für dieses gilt die Positivliste aus Kapitel 5.7: Modellgefüllte Felder zählen nicht. Belegt bleiben nur die sieben Parserfelder aus Kapitel 3.3 und der amtliche Wohnlagenwert. Eine Schwelle von 0,70 wäre in V0 an keinem einzigen Objekt erreichbar.

```yaml
# basis.yaml, Auszug: Schwelle je Variante
belegdichte_min:
  V0: 0.35    # erreichbar sind hoechstens 0.53 (Profil A) und 0.78 (Profil B)
  V2: 0.70    # erreichbar sind 1.00 in beiden Profilen
laufende_variante: V0        # gesetzt in Phase 0 nach E0, protokolliert in A0.9
```

**Woher die beiden Höchstwerte kommen.** In V0 sind für **Profil A** belegbar: `preisabstand_pct` (26, aus Kaufpreis und Wohnfläche des Parsers gegen die Referenz-CSV), `energieklasse` (13, ausgezeichnetes Feld der Portalvorlage), `wohnlage_amtlich` (8, B0 aus dem amtlichen Datensatz) und `grundriss_zimmer` (6). Zusammen 53 von 100, also **0,53**. Nicht belegbar bleiben `bruttorendite_pct` (19, die Jahreskaltmiete steht in keiner Parserzeile), `zustand` (15, er folgt nach Abschnitt 4.5 aus dem Heizungsbaujahr) und `ruecklage_deckung` (13). Für **Profil B** kommen zu `preisabstand_pct` (20), `energieklasse` (18), `wohnlage_amtlich` (10) und `grundriss_zimmer` (8) die beiden Zielbänder `wohnflaeche_fit` (12) und `grundstueck_fit` (10) hinzu, zusammen 78 von 100, also **0,78**; offen bleibt allein `zustand` (22).

**Warum 0,35 und nicht ein niedrigerer Wert.** Die Schwelle ist gegen das schwächere der beiden Profile gesetzt. In Profil A trägt der Preisabstand allein 26 Punkte; 0,35 verlangt deshalb neben ihm mindestens die Energieklasse (26 + 13 = 39) oder zwei kleinere Kriterien (26 + 8 + 6 = 40). Ein Objekt, von dem nur der Preis und die Lage bekannt sind (26 + 8 = 34), bleibt `UV`. Damit trennt die Schwelle in V0 dasselbe, was 0,70 in V2 trennt: ein Objekt mit tragender Beleglage von einem, das nur eine Frage wert ist. **Der Abstand zur Höchstmarke ist in V0 kleiner**, nämlich 0,18 statt 0,30 in Profil A, und genau das ist der in Abschnitt 2.10 benannte Preis der Minimalvariante.

**Die Kaufnebenkosten stehen als Einzelposten, nicht als Pauschale.**

```yaml
# basis.yaml, Auszug: Nebenkosten NRW, Stand 2026, Quelle immobilie.nrw
nebenkosten_pct:
  grunderwerbsteuer: 6.50    # Zeile in immo/normen.md, Finanzaemter NRW
  notar:             1.50
  grundbuch:         0.50
  courtage_kaeufer:  3.57    # Rueckfall, wenn die Anzeige nichts nennt
gesamtaufwand = kaufpreis * (1 + summe(nebenkosten_pct) / 100)
```

Je Objekt füllt C1 zusätzlich das Feld `provision_kaeufer_pct` mit Belegzitat aus der Anzeige. Steht dort ein Wert, gilt er; steht dort nichts, gilt der Rückfall 3,57 Prozent, und das Feld erscheint in Liste B der Lückenprüfung (R7). Ohne Makler und mit belegter Provisionsfreiheit sind es 8,50 Prozent, mit Rückfall 12,07 Prozent. **Das ist keine Feinheit, sondern der Unterschied zwischen einem tragenden und einem zu weiten Deckel:** Bei einem Deckel von 780.000 Euro lässt eine Pauschale von 8,0 Prozent Kaufpreise bis 722.222,22 Euro durch; deren Gesamtaufwand beträgt mit Rückfallprovision 809.394,20 Euro. Richtig gerechnet liegt die Kaufpreisgrenze bei **695.993,58 Euro**.

```yaml
# anker.yaml  Kriteriumsvorlagen in JSON-Schreibweise; das Profil setzt nur g (Gewicht)
preis: &PRE {"anker":{"-15":100,"0":60,"10":30,"20":0},"ohne_angabe":[0,60]}  # geklemmt
zustand: &ZUS {"anker":{"kernsanierung":5,"renovierungsbeduerftig":35,"gepflegt":70,"saniert":100},"ohne_angabe":[5,70]}
energie: &ENE {"anker":{"A+":100,"A":95,"B":85,"C":70,"D":55,"E":40,"F":25,"G":12,"H":0},"ohne_angabe":[0,55]}
lage: &LAG {"anker":{"einfach":30,"mittel":65,"gut":90,"sehr_gut":100},"ohne_angabe":[30,90]}

# profil-a.yaml
meta: {"id":"A","name":"Kapitalanlage_Altbau_Koeln","version":5,"treffer_pro_woche":[2,12]}
geofence: {"ein":"geo/a_stadtteile.geojson","aus":"geo/a_bahn_200m.geojson","layer":["geo/erhaltungssatzungen.geojson"],"nur_plz":"offen"}
portalfilter: ["kaufpreis_eur","wohnflaeche_qm","zimmer"]   # nur das darf Kapitel 3 vorfiltern
vorfeld: [{"feld":"erbbaurecht","werte":["ja","nein","unbekannt"],"bei_fehlend":"nein"}]  # kein ko, siehe unten
ko: [{"feld":"gesamtaufwand_eur","op":"<=","wert":780000,"bei_fehlend":"ko"},
     {"feld":"wohnflaeche_qm","op":">=","wert":70,"bei_fehlend":"offen"},
     {"feld":"erbbaurecht_restlaufzeit_jahre","op":">=","wert":55,"gilt_nur_wenn":"erbbaurecht == ja","bei_fehlend":"frage"}]
gewichte: {"preisabstand_pct":26,"bruttorendite_pct":19,"zustand":15,"energieklasse":13,"ruecklage_deckung":13,"wohnlage_amtlich":8,"grundriss_zimmer":6}
punkte: {"preisabstand_pct":*PRE,"zustand":*ZUS,"energieklasse":*ENE,"wohnlage_amtlich":*LAG,
  "bruttorendite_pct":{"bezug":"jahreskaltmiete / gesamtaufwand_eur","anker":{"2.0":0,"3.0":50,"4.5":100},"ohne_angabe":[0,50]},
  "ruecklage_deckung":{"bezug":"ruecklage_bestand_eur / ruecklage_soll_eur","anker":{"0.3":0,"1.0":70,"1.5":100},"ohne_angabe":[0,70]},
  "grundriss_zimmer":{"anker":{"1":20,"2":55,"3":80,"4":95},"ohne_angabe":[20,80]}}
referenz: {"spur1":"irw_nrw_2026_teilma1","spur2":"gmb_koeln_2026_k611","zins":"gmb_koeln_2026_liz","koeff":"gmb_k612"}
schwellen: {"vorschlag_ab":55,"endgueltig_unter":35}

# profil-b.yaml
meta: {"id":"B","name":"Eigennutzung_Haus_Rhein_Erft","version":2,"treffer_pro_woche":[1,6]}
geofence: {"ein":"geo/b_fahrzeit30_huerth.geojson","aus":"geo/b_gewerbe_300m.geojson","layer":["geo/hq100.geojson"],"nur_plz":"offen"}
portalfilter: ["kaufpreis_eur","wohnflaeche_qm","grundstueck_qm"]
ko: [{"feld":"gesamtaufwand_eur","op":"<=","wert":650000,"bei_fehlend":"ko"},
     {"feld":"wohnflaeche_qm","op":">=","wert":110,"bei_fehlend":"offen"},
     {"feld":"grundstueck_qm","op":">=","wert":300,"bei_fehlend":"frage"},
     {"feld":"vermietet","op":"==","wert":false,"bei_fehlend":"frage"}]
gewichte: {"zustand":22,"preisabstand_pct":20,"energieklasse":18,"wohnflaeche_fit":12,"grundstueck_fit":10,"wohnlage_amtlich":10,"grundriss_zimmer":8}
punkte: {"zustand":*ZUS,"preisabstand_pct":*PRE,"energieklasse":*ENE,"wohnlage_amtlich":*LAG,
  "wohnflaeche_fit":{"typ":"zielband","anker":{"90":0,"120":100,"170":100,"210":0},"ohne_angabe":[0,85]},
  "grundstueck_fit":{"typ":"zielband","anker":{"200":0,"350":100,"700":100,"1200":0},"ohne_angabe":[0,85]},
  "grundriss_zimmer":{"anker":{"2":20,"3":55,"4":85,"5":100,"6":85},"ohne_angabe":[20,85]}}
referenz: {"spur1":"irw_nrw_2026_teilma23","spur2":"gmb_rhein_erft_2026_k611","klammer":"brw_x_grundstueck"}
schwellen: {"vorschlag_ab":55,"endgueltig_unter":35}
```

Die Obergrenzen in `ohne_angabe` folgen F5: Sie liegen je eine Stufe unter dem Bestwert. Bei den beiden Zielbändern gibt es keine Stufe unter dem Plateau, deshalb gilt dort 85, der Wert der jeweils zweithöchsten Stützstelle im Ordinalkriterium desselben Profils; auch das ist eine gesetzte Annahme.

**Erbbaurecht braucht zwei Felder, nicht eines, und nur eines davon ist ein K.o.-Kriterium.** Ein einzelnes Feld `erbbaurecht_restlaufzeit_jahre` mit `bei_fehlend: frage` erzeugte bei jedem Volleigentum eine Erbbaurechtsfrage, denn dort ist das Feld nicht leer, sondern gegenstandslos. Vorgelagert steht deshalb `erbbaurecht: ja | nein | unbekannt`. Nur bei `ja` wird die Restlaufzeit geprüft, bei `unbekannt` entsteht eine Frage, bei `nein` gar nichts.

**Das Vorfeld steht nicht in `ko`.** Ein K.o.-Kriterium, dessen Werteliste alle zulässigen Werte enthält, kann nie auslösen; es wäre tote Konfiguration und fiele über die Lint-Invariante „jeder Parameter in einer Skriptregel benutzt". `erbbaurecht` steht deshalb im eigenen Block `vorfeld` und wirkt allein über `gilt_nur_wenn` auf die Restlaufzeitzeile.

**Schweigen der Anzeige gilt als `nein`, und das ist begründungspflichtig.** Der Eintrag `bei_fehlend: nein` leitet aus dem Schweigen einen Wert ab. Das steht scheinbar gegen R6, der „fehlt in der Anzeige" als eigenen Zustand führt, und gegen F5, der Schweigen zum Ungünstigen auslegt. Drei Gründe tragen die Ausnahme, und sie gilt nur hier.

1. **Das Vorfeld ist kein Wertfeld, sondern ein Schalter.** Es trägt kein Gewicht, keine Einheit und keinen Punktwert, es entscheidet allein, ob die Restlaufzeitzeile überhaupt geprüft wird. R6 gilt unverändert für das Wertfeld dahinter: Fehlt bei `erbbaurecht == ja` die Restlaufzeit, entsteht die Frage.
2. **F5 deckelt Punkte, und hier fallen keine an.** Die ungünstige Auslegung hieße `unbekannt` und erzeugte bei nahezu jedem Objekt eine Pflichtfrage, weil Volleigentum der Regelfall ist. Eine Frage, die immer gestellt wird, zerstört die Ordnung der Fragenliste nach Hebel aus Abschnitt 4.6, ohne je etwas zu unterscheiden.
3. **Das Schweigen verschwindet trotzdem nicht.** Erbbaurecht steht in Liste B der Lückenprüfung (R7), und Liste B geht in den Score. Die fehlende Angabe senkt also weiter den Rang und erscheint im Dossierabschnitt „Was ich nicht weiß"; sie erzeugt nur keine Pflichtfrage mehr.

*Abnahme:* T22, und zwar gegen die hier abgedruckte Konfiguration.

**Was `ruecklage_deckung` misst, und woran es scheitert.** Zähler ist der belegte Bestand der Erhaltungsrücklage je Einheit in Euro, üblicherweise aus der Jahresabrechnung oder dem Wirtschaftsplan (B2). Nenner ist der Sollbestand nach der [Peters'schen Formel](https://vdiv.de/publikationen/magazine/detail/wer-bietet-weniger-die-instandhaltungsruecklage-im-wohnungseigentum-notwendigkeit-kalkulation-grundlagen-und-alternativen): jährlicher Bedarf gleich 1,5 mal Normalherstellungskosten je m² Wohnfläche geteilt durch 80, multipliziert mit der Wohnfläche und mit dem Gebäudealter in Jahren, gedeckelt auf 80. Die Formel liefert einen **jährlichen** Bedarf; der Bestandssoll entsteht erst durch die Multiplikation mit dem Alter, und genau dieser Schritt ist eine gesetzte Modellannahme. Fehlt eine der vier Eingaben, also Bestand, Wohnfläche, Baujahr oder Normalherstellungskosten, steht das Kriterium auf „nicht ermittelbar" (R6) und geht mit `ohne_angabe [0,70]` in die Klammer. **In der Vorprüfung ist das der Regelfall**, denn keine Anzeige nennt den Rücklagenbestand. Das Kriterium ist deshalb vor allem eine Frage mit Hebel, kein Punktelieferant.

**Acht Lint-Invarianten**, jede ein Abbruch: Gewichtssumme 100; Stützstellen monoton in x; Ordinale vollständig; `bei_fehlend` und `ohne_angabe` gesetzt; Geofence-Dateien projizierbar; jeder Parameter in einer Skriptregel benutzt; **kein Platzhaltermuster** (`zu_klaeren`, `tbd`); **jeder Ankerwert eines Verhältniskriteriums trägt ein Feld `bezug` mit Zähler und Nenner im Klartext** (R3). Die letzte Invariante ist neu und fängt genau den Fall eines Kriteriums mit 13 Prozent Gewicht, dessen Nenner nirgends steht.

**Ein einziges Ausschlusskriterium** (R4): Nur `gesamtaufwand_eur` trägt `bei_fehlend:ko`, alle anderen harten Kriterien setzen `AB5`. Der Deckel folgt aus Prompt 5 rückwärts, mit den vier Nebenkostenposten oben.

**Der Geofence ist mechanisch:** Punkt-in-Polygon gegen die [Stadtteile Köln](https://ckan.open.nrw.de/en/dataset/stadtteile-koln-k), in EPSG:25832 wie die Zonen der Immobilienrichtwerte; bei reiner Postleitzahl greift `AB2` nur bei ganz außen liegendem Polygon. Beim öffentlichen [Nominatim](https://operations.osmfoundation.org/policies/nominatim/) gelten eine Anfrage je Sekunde, eigener User-Agent, Attribution und Zwischenspeicherpflicht. Mietpotenzial, Lärm und Nachbarschaft erzeugen nur Fahnen ohne Eurobetrag (R12, R13).

## 4.5 Zustand und Energieklasse

Der Zustand folgt nur aus datierten Angaben (R24): `n` sind Gewerke nach 2015, `h` ist das Heizungsbaujahr; die erste zutreffende Zeile gilt.

| # | Bedingung | Stufe |
|---|---|---|
| 1 | „unsaniert" oder Leerstand, Baujahr vor 1950 | kernsanierung |
| 2 | Sanierungsbedarf benannt | renovierungsbeduerftig |
| 3 | n ≥ 3 | saniert |
| 4 | n = 2, oder n ≤ 1 und h > 2010 | gepflegt |
| 5 | n ≤ 1 und h ≤ 2010 | renovierungsbeduerftig |
| 6 | sonst (h fehlt) | ohne_angabe `[5,70]` |

Die Energieklasse ist Pflichtangabe nach § 87 GEG, sobald bei Anzeigenaufgabe ein Ausweis vorliegt (Kapitel 1). **Sie gehört in den Score, nicht nur in die Warnliste:** Ihre Vollständigkeit ist ein Warnsignal ohne Punkte, der Klassenwert ist ein Merkmal. Steht nur der Endenergiewert, rechnet das Skript nach [Anlage 10 GEG](https://www.gesetze-im-internet.de/geg/anlage_10.html): A+ bis 30, dann A bis H bei 50, 75, 100, 130, 160, 200, 250.

## 4.6 Score und Status

Fehlende Felder werden **beidseitig eingeklammert**. Der **Boden** setzt jedes offene Kriterium ans untere Ende seiner Spanne, die **Decke** ans obere; Normieren belohnte Schweigen. Nur B0 bis B2 rechnen mit (R1), die Belegdichte ist die Gewichtssumme der belegten Kriterien geteilt durch 100 (R8).

| # | Bedingung (erste zutreffende gilt) | Code | Wirkung |
|---|---|---|---|
| 1 | Band, Import oder Lint defekt | `WV` | „unbewertet", keine Ablage |
| 2 | über Deckel (R4) **oder** Decke unter 35 | `AB1` | endgültig |
| 3 | außerhalb Geofence | `AB2` | endgültig |
| 4 | hartes Kriterium verletzt | `AB5` | Digestzeile |
| 5 | Decke unter 55 | `AB3` | Ablage, neu bei Preissenkung |
| 6 | Belegdichte unter `belegdichte_min` der laufenden Variante | `UV` | „zu wenig Daten", eine Frage |
| 7 | zwei Signale aus zwei Familien | `PV` | Prüfen mit Vorbehalt |
| 8 | Boden ab 55, feine Preiszeile | `VS` | Vorschlag, Dossier |
| 9 | sonst | `NF` | Nachfassen nach Hebel |

Zeile 2 verknüpft zwei Sachverhalte ausdrücklich mit **oder**: Beide führen endgültig zur Ablage, aus verschiedenen Gründen. `AB4` ist nicht vergeben; die Lücke bleibt, damit bereits im Journal gespeicherte Codes ihre Bedeutung behalten. `UV` ist keine Ablage (R8); Zeile 6 vor Zeile 8 löst den Fall Boden ab 55 bei dünner Beleglage.

**Zeile 6 misst gegen die laufende Variante**, also gegen **0,70 in V2** und gegen **0,35 in V0** (Abschnitt 4.4). In V0 sind höchstens 0,53 in Profil A und 0,78 in Profil B erreichbar; mit 0,70 bekäme dort jedes Objekt des Profils A den Code `UV`, und Zeile 8 wäre unerreichbar. **Die beiden folgenden Beispiele rechnen gegen V2.** Die Bewertungslogik selbst ist in beiden Varianten dieselbe, nur der Vergleichswert der Zeile 6 wechselt.

**Beispiel A.** Vermietete, denkmalgeschützte 4-Zimmer-Altbauwohnung, Köln-Neustadt/Süd, Baujahr 1909, 92 m², Kaufpreis 580.000 Euro, also 6.304,35 Euro je m². Die Anzeige nennt keine Provision, es gilt der Rückfall; der Gesamtaufwand beträgt 580.000 mal 1,1207 gleich **650.006,00 Euro** und liegt unter dem Deckel von 780.000 Euro. Der Denkmalschutz schließt Spur 1 aus; Spur 2 gibt 6.055 Euro je m², der Abstand beträgt plus 4,12 Prozent. Jahreskaltmiete 18.400 Euro, Ausweis F, Wohnlage `gut`.

**Die Rendite rechnet gegen den Gesamtaufwand, nicht gegen den Kaufpreis.** Wer 12,07 Prozent Nebenkosten bezahlt und sie aus dem Nenner lässt, überschätzt seine Rendite um denselben Anteil. Hier sind es 18.400 durch 650.006, also **2,83 Prozent** statt 3,17 Prozent.

**Der Zähler bleibt bis Phase 3 eine Bruttogröße, und das Dossier sagt es.** Aus der Jahreskaltmiete sind drei Abzüge nicht herausgerechnet, weil sie in der Vorprüfung nicht belegbar sind: die **nicht umlagefähigen Kosten** (Verwaltervergütung, Instandhaltungsanteil, Mietausfallwagnis), der **Erbbauzins** bei `erbbaurecht == ja` und die **Restnutzungsdauer**, die aus der Rendite erst einen Ertragswert machte. Alle drei entstehen erst aus Unterlagen: Verwaltervergütung und Instandhaltungsanteil aus Wirtschaftsplan und Jahresabrechnung, der Erbbauzins aus dem Erbbaurechtsvertrag, die Restnutzungsdauer aus dem Zustand nach Besichtigung. Abschnitt 4.11 nennt die Zuordnung zu den Prompts 3 bis 6.

**Bis dahin trägt das Feld eine Stufenmarke statt eines Näherungswerts.** Der Dossierkopf führt `ertrag_stufe: brutto`, die Renditezeile heißt „Bruttorendite, vor nicht umlagefähigen Kosten und vor Erbbauzins", und darunter steht eine Fahne ohne Eurobetrag nach R13: „Drei Abzüge fehlen, alle drei senken die Rendite; belegbar ab Phase 3." **Ein Schätzwert erscheint nie**, auch kein Prozentsatz aus der Literatur, denn ein geschätzter Abzug im Nenner einer gewichteten Kennzahl ist genau der Fall, den R1 mit B3 ausschließt. Ab Phase 3 wechselt die Marke auf `ertrag_stufe: netto`, sobald alle drei Größen mit Fundstelle vorliegen; die Rendite bleibt bis dahin vergleichbar, weil sie für jedes Objekt gleich brutto gerechnet ist.

| Kriterium | g | Wert | Punkte | Produkt |
|---|---|---|---|---|
| Preisabstand B1 | 26 | +4,12 % | 47,65 | 1.238,79 |
| Bruttorendite B2 | 19 | 2,83 % | 41,54 | 789,21 |
| Zustand | 15 | fehlt | 5 bis 70 | – |
| Energieklasse B2 | 13 | F | 25,00 | 325,00 |
| Rücklagendeckung | 13 | fehlt | 0 bis 70 | – |
| Wohnlage B0 | 8 | gut | 90,00 | 720,00 |
| Grundriss B2 | 6 | 4 Zimmer | 95,00 | 570,00 |
| **Summe** | | | | **3.643,00** |

Beitrag **3.643,00**, Boden = (3.643,00 + 15 × 5) / 100 = **37,18**, Decke = (3.643,00 + 15 × 70 + 13 × 70) / 100 = **56,03**, Belegdichte **0,72**, Zeile 9, Status **`NF`**. Ohne die Deckelung nach F5 läge die Decke bei 64,43, allein aus Schweigen. Als Einordnung, nicht als Punkt, steht im Dossier der örtliche Liegenschaftszinssatz aus dem Grundstücksmarktbericht mit Fundstelle und Stichtag. Der Abnahmetest in Kapitel 7 gilt als bestanden, wenn Boden und Decke auf zwei Nachkommastellen genau getroffen werden.

**Welche Frage lohnt sich?** Der Informationswert ist Gewicht mal Spannweite durch 100, der **Hebel** teilt ihn durch die Aufwandsklasse (1 Portalangabe, 2 Maklerrückfrage, 5 Verwalterunterlagen, 8 Ortstermin): Zustand **4,88**, Rücklage **1,82**.

**Der Punktgewinn ist eine Spanne, keine Zahl.** Die Antwort auf die Zustandsfrage hebt den Boden je nach Stufe auf 37,18 (kernsanierung), 41,68 (renovierungsbedürftig), 46,93 (gepflegt) oder 51,43 (saniert), also zwischen keinem Gewinn und plus 14,25. Die Rücklagenfrage hebt ihn auf 37,18, 46,28 oder 50,18. **Die Dossierzeile nennt beide Enden.**

**Beide Antworten zusammen treffen genau die Decke.** Zustand `gepflegt` bringt 70 Punkte, Deckungsgrad 1,0 bringt 70 Punkte, und 70 ist bei beiden Kriterien zugleich die F5-Obergrenze. Der Boden steigt deshalb auf **56,03** und damit exakt auf die Decke des Grundfalls. Das ist kein Zufall, sondern die Definition: Sind alle offenen Kriterien beantwortet, fallen Boden und Decke zusammen. Die Schwelle 55 ist damit überschritten, der Status wechselt von `NF` nach `VS`.

**Eine Antwort darf den Boden über die F5-Obergrenze heben.** F5 deckelt das Schweigen, nicht den Beleg. Antwortet der Verwalter mit einem Deckungsgrad von 1,5, gilt der belegte Wert 100 statt der Obergrenze 70; Boden und Decke steigen dann gemeinsam auf **59,93**. Antwortet der Makler „kernsaniert 2023", gilt 100 statt 70, und mit beiden Antworten stehen Boden und Decke bei **64,43**, also auf der Höhe der ungedeckelten Decke.

**Warum Koeffizienten versioniert sein müssen.** Der Grundstücksmarktbericht Köln 2026 nennt in Kapitel 6.1.2 auf S. 146 für die Mietsituation „vermietet" den Umrechnungskoeffizienten 0,94. Angewandt sinkt die Referenz auf 5.691,70 Euro je m², der Abstand steigt auf plus 10,76 Prozent, die Punkte fallen auf 27,71, der Beitrag auf 3.124,62, Boden und Decke auf **32,00** und **50,85**: aus `NF` wird `AB3`. **Die Einschränkung liegt nicht am Beleg, sondern an der Übertragung.** Die Koeffizienten aus 6.1.2 sind für die Immobilienrichtwerte der Spur 1 abgeleitet. Sie auf eine Mittelwertzeile aus 6.1.1 anzuwenden, ist eine gesetzte Modellannahme und keine Vorgabe des Berichts.

## 4.7 Beispiel B: zu wenig Daten

Haus in Rhein-Erft, 148 m², Grundstück 420 m², 5 Zimmer, Kaufpreis 560.000 Euro; mit den vier Nebenkostenposten und Rückfallprovision **627.592,00 Euro**, unter dem Deckel von 650.000 Euro. Ohne Provision wären es 607.600,00 Euro. Die Kaufpreisgrenze für dieses Profil liegt bei **579.994,65 Euro** mit und bei 599.078,34 Euro ohne Provision.

Es fehlen Energieklasse, Zustand und Wohnlage. Spur 1 liefert für `TEILMA = 2` eine Zeile, doch für dieses Suchgebiet ist sie noch nicht in den Belegschrank übertragen; bis dahin bleibt `preisabstand_pct` unbelegt. Der Fall zeigt damit nicht mehr eine Lücke in den Daten, sondern eine Lücke in der Beschaffung, und die schließt Phase 2.

Belegt sind Wohnfläche (Zielband, 100), Grundstück (Zielband, 100) und Grundriss (100), Beitrag 3.000. Boden = (3.000 + 22 × 5 + 20 × 0 + 18 × 0 + 10 × 30) / 100 = **34,10**, Decke = (3.000 + 22 × 70 + 20 × 60 + 18 × 55 + 10 × 90) / 100 = **76,30**, Belegdichte **0,30**, also Zeile 6: **`UV`**.

**Warum genau eine Frage.** Bei `UV` zählt nicht die Schwelle, sondern die Beleglage; darunter trägt kein Fragenpaket einen Vorschlag. Gestellt wird die Frage mit dem höchsten Hebel: Energieklasse **9,90** vor Zustand 7,15 und Preisreferenz 2,40.

Antwort: Verbrauchsausweis, 118 kWh je m² und Jahr, nach Anlage 10 Klasse **D**. Boden **44,00**, Belegdichte **0,48**, weiter `UV`. Zweite Frage, Zustand: Heizung 2019, Dach 2021, also n = 2 und nach Zeile 4 `gepflegt`. Boden **58,30**, Decke 76,30, Belegdichte **0,70**.

**In V0 sähe derselbe Weg kürzer aus.** Dort gilt die Schwelle 0,35, und schon die erste Antwort mit 0,48 verließe `UV`; der Status wäre dann `NF` aus Zeile 9, weil der Boden mit 44,00 unter 55 liegt. Die zweite Frage bliebe trotzdem die richtige, denn sie hebt den Boden, nicht die Beleglage.

`UV` ist verlassen, Zeile 8 aber nicht: Sie verlangt eine feine Preiszeile. Status **`NF`**, offene Position „Immobilienrichtwertzeile Rhein-Erft in den Belegschrank übertragen", Adressat C5. Zwei Antworten heben den Boden um 24,20 Punkte; zuletzt entscheidet eine Lücke im Belegschrank. Als Fahne ohne Score trägt das Dossier die Bodenwertklammer aus Bodenrichtwert mal 420 m² mit Fundstelle.

## 4.8 Lückenprüfung und Warnsignale

**Liste A nach § 87 GEG:** Ausweisart, Endenergiewert, Energieträger, Baujahr, Effizienzklasse, nur bei vorliegendem Ausweis. **Liste B, teure Auslassungen** (R7): Erhaltungsrücklage als Deckungsgrad nach Abschnitt 4.4, Pflicht aus § 19 Abs. 2 Nr. 4 WEG; Heizungsbaujahr; Hausgeld; Denkmalschutz; Käuferprovision; [soziale Erhaltungssatzung](https://www.stadt-koeln.de/politik-und-verwaltung/stadtentwicklung/soziale-erhaltungssatzungen/soziale-erhaltungssatzungen-antworten-auf-haeufig-gestellte-fragen). Genannt wird die Fundstelle, nie die Rechtsfolge (R11).

**Warnsignale senken nie den Score**, denn ein Modell, das Wortwahl bewertet, ist steuerbar; jedes Signal hat genau eine Wirkung.

| Familie | Erkennung | Genau eine Wirkung |
|---|---|---|
| Preis | über 25 % unter Referenz | Deckel, nie `VS` |
| Historie | zwei `PREIS_RUNTER` in 60 Tagen | Zeile 7 |
| Fläche | Text ungleich Feld, `MEHRFACHLISTUNG` | Zeile 7 |
| Kosten | Hausgeld je m² unter Schwelle | Zeile 7 |
| Form | Pflichtangabe fehlt trotz Ausweis | Pflichtfrage |
| Text | KI-Bildhinweis fehlt (R22) | Pflichtfrage |

**Die Hausgeldschwelle vergleicht gegen die eigenen Treffer, nicht gegen einen Erfahrungswert.** Sie lautet: Hausgeld je m² unter **0,70 mal dem Median** des Hausgelds je m² über alle Treffer desselben Profils der letzten 180 Tage, mindestens 20 Treffer. Unter 20 Treffern gibt es keine Schwelle und kein Signal. Damit trägt die Regel dieselbe Begründung wie R13: § 19 Abs. 2 Nr. 4 WEG verlangt nur eine „angemessene" Rücklage, und angemessen ist ortsabhängig. Der Faktor 0,70 ist eine gesetzte Annahme und steht in `basis.yaml`.

**Zwei Signale aus verschiedenen Familien setzen `PV`**; ein einzelnes ist meist ein Datenfehler derselben Quelle. **Die Familie Text zählt nicht mit**, denn sie ist modellerkannt und ein Statusdeckel wirkt wie ein Punktabzug (F1). **Die Zwei ist gesetzt**; der Quartalsbericht prüft, ob `PV` trennt.

## 4.9 Dossier und Fehlerpfad

Kopf: Objekt-ID, Cluster-ID, Profil, Boden, Decke, Belegdichte mit der Schwelle der laufenden Variante, `ertrag_stufe`, Code, Signatur. Sieben Abschnitte: Urteil; Fragen nach Hebel mit Punktgewinn als Spanne; Zahlen mit Stichtag, Quelle, Belegklasse, Manifest-`id`; Preis beider Spuren und, bei Profil A, der Liegenschaftszinssatz als Einordnung; Lücken A und B; „Was ich nicht weiß"; Herkunft. Ein leerer siebter Abschnitt ist ein Schemaverstoß nach R6 und wird darüber zum Vetogrund; eine sechste Vetoregel entsteht nicht.

**Der Fehlerpfad.** Kommt eine Bewertung nicht zustande, etwa durch Importabbruch, fehlende Bandversion oder roten Lint, gilt `WV` und **keine Ablage**: Das Objekt bleibt auf `neu`, steht namentlich unter „unbewertet" mit Grund (R17) und wird wiedervorgelegt; nach drei Läufen meldet S5 die Eskalation ESK1.

## 4.10 Feedback ohne Blackbox

Gespeichert wird der Merkmalsvektor zum Entscheidungszeitpunkt, dazu Code, Grund und alle Versionen nach F4; die Codes sind zugleich die Ablehnungscodes für C3 und den Rückspiegel aus Kapitel 2.

**Gewichte ändern sich nie im Lauf, und lange Zeit gar nicht.** Bei zwanzig Urteilen im Monat ist Gewichtslernen statistisch aussichtslos. Deshalb gilt eine harte Vorbedingung: **Vor 200 etikettierten Entscheidungen wird kein Gewicht geändert.** Bis dahin verbessert sich das System allein über Schwellen, Profilfelder und die Beschaffung von Belegen, und C5 sammelt nur. Danach sucht der Quartalslauf Paare aus `passt` und `passt nicht`, die der Score falsch herum ordnet, und nennt je Paar das treibende Kriterium. C5 stellt daraus einen Pull Request, höchstens 20 Prozent je Kriterium und Quartal, danach Normierung. Drei weitere Sperren: Unter zehn Ablehnungen bleibt ein Kriterium unangetastet; der Vorschlag rechnet sechs Monate nach und fällt, sobald ein „passt" unter die Schwelle rutscht; K.o.-Kriterien werden nie gelernt.

**Die Tagesblindprobe.** Kalibrierung über gezeigte Objekte ist blind für falsch Aussortierte. Deshalb enthält jeder Digest ein **gleichverteilt** gezogenes Objekt aus der Ablage, gekennzeichnet. Markiert Christoph es mit „passt", ist eine Schwelle oder ein Gewicht falsch. Nur so werden Fehler zweiter Art fern der Schwelle messbar. Die davon verschiedene **Monatsblindprobe** über zwanzig Objekte steht in Kapitel 6.

## 4.11 Grenzen

Der Score ist eine Rangordnung, kein Wert. Der Grundstücksmarktbericht Köln 2026 schreibt auf S. 116, dass die dargestellten Kenndaten „der Markttransparenz" dienen und „keine sachverständige Wertermittlung im Einzelfall" ersetzen. Er hält auf derselben Seite fest, dass „Wohnflächenangaben nicht vollständig vorliegen"; eine Mittelwertzeile beruht also nicht auf jedem Kauffall gleich gut. Er veröffentlicht eine Zeile erst ab drei auswertbaren Kaufverträgen, weshalb dünn besetzte Stadtteile ganz fehlen statt ungenau zu sein. Wie weit ein Mittelwert trägt, zeigt die Streuung: Hinter den 6.055 Euro je m² aus Beispiel A stehen 71 Kauffälle mit einer Spanne von 1.783 bis 10.667 Euro je m². Ein Preisurteil aus diesem Band ist deshalb eine Größenordnung und kein Verkehrswert. Auch der Liegenschaftszinssatz ändert daran nichts: Er ordnet eine Rendite ein und ersetzt keine Ertragswertrechnung, die Reinertrag, nicht umlagefähige Kosten und Restnutzungsdauer bräuchte.

**Welche Ertragskorrekturen erst in Phase 3 entstehen, und woher.** Die Tabelle nennt je Größe die Unterlage, den Prompt aus Kapitel 7.2 und die Wirkungsrichtung. Alle vier senken den Ertrag; keine wird vorher geschätzt.

| Größe | Quelle in Phase 3 | Prompt |
|---|---|---|
| Verwaltervergütung und Instandhaltungsanteil, also die nicht umlagefähigen Kosten | Wirtschaftsplan und Jahresabrechnung | 3 |
| Erbbauzins, nur bei `erbbaurecht == ja` | Erbbaurechtsvertrag, Abteilung II des Grundbuchs | 4 |
| Beschlossene Sonderumlage als Einmalabzug | Beschluss-Sammlung nach § 24 Abs. 7 WEG | 3 |
| Restnutzungsdauer als Grundlage einer Ertragswertrechnung | Zustand nach Besichtigung, Sanierungsstand aus der Sammlung | 3 und 7 |

**Wie das Dossier die Lücke bis dahin kennzeichnet.** Drei Stellen, keine mehr. Der Kopf trägt `ertrag_stufe: brutto`. Die Renditezeile heißt „Bruttorendite, vor nicht umlagefähigen Kosten und vor Erbbauzins" und nennt Zähler und Nenner im Klartext (R3). Der Abschnitt „Was ich nicht weiß" führt die vier Zeilen der Tabelle als Fahnen ohne Eurobetrag (R13), jede mit der Unterlage, die sie schließen würde. **Der Score ändert sich dadurch nicht**, denn eine Fahne vergibt keinen Punkt; die Kennzeichnung verhindert allein, dass eine Bruttozahl als Nettozahl gelesen wird. Erst wenn alle vier Größen mit Fundstelle vorliegen, wechselt die Marke auf `netto`, und erst dann darf ein Dossier von Reinertrag sprechen.

## 4.12 Anschluss

Aus Kapitel 1 kommen R4, R5, R7, R8, R13 und R24. In Kapitel 2 füllt C1 die Felder, C2 rechnet und prüft das Schema, C3 erhält Codes ohne Punktwerte, C4 baut das Dossier, C5 pflegt Band und Kalibrierung; das Profil ist Eingabe für C2, nie für C1. Aus Kapitel 3 gehen nur `portalfilter`-Felder in einen Suchauftrag, `PREIS_RUNTER` und `WIEDERVORLAGE` sind Eingaben. In Kapitel 5 sind `NF`, `UV` und `WV` Digest-Rubriken. Kapitel 6 und 7 nehmen Lint, Importabbruch und das Rechenbeispiel ab; Sollwerte sind 37,18 und 56,03, die Antwortstufen 41,68, 46,93, 51,43, 46,28, 50,18, 59,93 und 64,43, die Koeffizientenvariante 32,00 und 50,85, für Profil B 34,10, 76,30, 44,00 und 58,30 sowie die Gesamtaufwandswerte 650.006,00 und 627.592,00 Euro.

---

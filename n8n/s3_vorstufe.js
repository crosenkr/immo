// S3 Buchhalter, Vorstufe (Phase 1a). n8n Code-Knoten, Modus "Run Once for All Items".
// Eingabe: Zeilen aus objekt mit zustand = 'neu'. Ausgabe: dieselben Zeilen mit Vorbewertung.
// Nur deterministische Rechnung aus den Anzeigenfeldern, kein Modellaufruf, kein Abruf (R20).
// Deckel (R4) am Angebotspreis als Notbehelf, bis das Referenzband im Belegschrank liegt:
// ueber Deckel -> 'unvollstaendig', nicht 'ausgeschlossen'. Belegdichte (R8) wird ehrlich ausgewiesen.
// Werte aus profile/basis.yaml, profil-a.yaml, profil-b.yaml, anker.yaml (Stand 10.09.2026). Aenderung dort zuerst.

const VERSION = 's3-vorstufe-2026-09-10.1';
const NEBENKOSTEN = 0.065 + 0.015 + 0.005;          // Grunderwerbsteuer, Notar, Grundbuch (basis.yaml)
const COURTAGE_RUECKFALL = 0.0357;                    // wenn die Anzeige nichts nennt (E3)

const PROFILE = {
  A: { deckel: 500000,
       kernlage: ['Ehrenfeld', 'Neustadt-Nord', 'Neustadt-Süd', 'Lindenthal', 'Sülz', 'Rodenkirchen', 'Marienburg'],
       gewichte: { preisabstand_pct: 26, bruttorendite_pct: 19, zustand: 15, energieklasse: 13, ruecklage_deckung: 13, wohnlage_amtlich: 8, grundriss_zimmer: 6 },
       zimmer: { 1: 20, 2: 55, 3: 80, 4: 95 } },
  B: { deckel: 900000,
       kernlage: ['Ehrenfeld', 'Lindenthal', 'Sülz', 'Rodenkirchen', 'Marienburg', 'Junkersdorf'],
       gewichte: { zustand: 22, preisabstand_pct: 20, energieklasse: 18, wohnflaeche_fit: 12, grundstueck_fit: 10, wohnlage_amtlich: 10, grundriss_zimmer: 8 },
       zimmer: { 2: 20, 3: 55, 4: 85, 5: 100, 6: 85 },
       wohnflaeche: { 90: 0, 120: 100, 170: 100, 210: 0 },
       grundstueck: { 200: 0, 350: 100, 700: 100, 1200: 0 } },
};

function interp(anker, x) {
  // lineare Interpolation zwischen Ankern; ausserhalb: Randwert (geklemmt)
  const pts = Object.keys(anker).map(Number).sort((a, b) => a - b);
  if (x <= pts[0]) return anker[pts[0]];
  if (x >= pts[pts.length - 1]) return anker[pts[pts.length - 1]];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (x >= a && x <= b) return anker[a] + (anker[b] - anker[a]) * (x - a) / (b - a);
  }
  return null;
}

function profilVon(suchauftrag) {
  const s = String(suchauftrag || '').trim();
  if (/^A\b/i.test(s)) return 'A';
  if (/^B\b/i.test(s)) return 'B';
  return null;
}

function normStadtteil(s) {
  return String(s || '').replace(/ue/g, 'ü').replace(/Sue/g, 'Sü').replace(/Neustadt-Sued/i, 'Neustadt-Süd').trim();
}

const out = [];
for (const it of $input.all()) {
  const j = { ...it.json };
  const p = profilVon(j.suchauftrag);
  const prof = p ? PROFILE[p] : null;
  const punkte = {};           // kriterium -> 0..100, nur wenn belegt
  const fahnen = [];

  // Gesamtaufwand und Deckel (Notbehelf am Angebotspreis, R4)
  const kp = (typeof j.kaufpreis_eur === 'number') ? j.kaufpreis_eur : null;
  const prov = (typeof j.provision_kaeufer_pct === 'number') ? j.provision_kaeufer_pct / 100 : COURTAGE_RUECKFALL;
  const gesamtaufwand = kp ? Math.round(kp * (1 + NEBENKOSTEN + prov)) : null;
  let deckel_status;
  if (!prof) deckel_status = 'kein_profil';
  else if (gesamtaufwand == null) { deckel_status = 'kein_preis'; fahnen.push('preis_fehlt_in_der_anzeige'); }
  else deckel_status = gesamtaufwand <= prof.deckel ? 'unter_deckel' : 'ueber_deckel_angebotspreis';   // R4: unvollstaendig, nicht ausgeschlossen

  // Lage (E2): Kernlage 100, im gezeichneten Radius 50
  let lage_stufe = 'im_radius';
  if (prof) {
    const st = normStadtteil(j.stadtteil);
    if (st && st !== 'fehlt in der Anzeige' && prof.kernlage.includes(st)) lage_stufe = 'kernlage';
    punkte.wohnlage_amtlich = lage_stufe === 'kernlage' ? 100 : 50;
  }

  // Grundriss
  if (prof && typeof j.zimmer === 'number') punkte.grundriss_zimmer = interp(prof.zimmer, j.zimmer);

  // Profil B: Zielbaender
  if (p === 'B') {
    if (typeof j.wohnflaeche_qm === 'number') punkte.wohnflaeche_fit = interp(prof.wohnflaeche, j.wohnflaeche_qm);
    if (typeof j.grundstueck_qm === 'number') punkte.grundstueck_fit = interp(prof.grundstueck, j.grundstueck_qm);
  }

  // Vorscore: gewichtetes Mittel nur ueber belegte Kriterien; Belegdichte = Anteil der belegten Gewichte (R8)
  let vorscore = null, belegdichte = 0;
  if (prof) {
    let gsum = 0, wsum = 0;
    for (const [k, g] of Object.entries(prof.gewichte)) {
      if (typeof punkte[k] === 'number') { gsum += g; wsum += g * punkte[k]; }
    }
    belegdichte = Math.round(gsum) / 100;
    vorscore = gsum ? Math.round(wsum / gsum) : null;
  }

  Object.assign(j, {
    profil: p || 'unbekannt',
    gesamtaufwand_eur: gesamtaufwand,
    deckel_status,
    lage_stufe: prof ? lage_stufe : null,
    vorscore,
    belegdichte,
    bewertung_json: JSON.stringify({ punkte, fahnen, version: VERSION, hinweis: 'Vorstufe aus Anzeigenfeldern; Preisabstand, Zustand, Energie, Rendite, Ruecklage fehlen bis C1/C2' }),
    zustand: 'vorbewertet',
    bewertet_am: new Date().toISOString(),
  });
  out.push({ json: j });
}
return out;

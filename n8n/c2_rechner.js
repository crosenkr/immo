// C2 Rechner (Phase 1b): rechnet aus den Exposefeldern den Bauzustand und daraus den Vorscore neu.
// Deterministisch, ohne Modell (R3). Der Bauzustand traegt die Marke modell und zaehlt nicht in die
// Belegdichte (Konzept 5.7, R8). Die Spalte zustand (neu/vorbewertet/gemeldet) wird nicht angefasst.
const GEWICHTE = {
  A: { preisabstand_pct: 26, bruttorendite_pct: 19, zustand: 15, energieklasse: 13, ruecklage_deckung: 13, wohnlage_amtlich: 8, grundriss_zimmer: 6 },
  B: { zustand: 22, preisabstand_pct: 20, energieklasse: 18, wohnflaeche_fit: 12, grundstueck_fit: 10, wohnlage_amtlich: 10, grundriss_zimmer: 8 },
};
const VERSION = 'c2-2026-09-15.1';

// Sockel nach Baujahr. Quelle: gesetzte Annahme, keine amtliche Zahl (ungeprueft.md).
function sockel(bj) {
  if (typeof bj !== 'number' || !isFinite(bj)) return null;
  if (bj >= 2015) return 90;
  if (bj >= 2000) return 80;
  if (bj >= 1980) return 65;
  if (bj >= 1950) return 50;
  return 45;
}
const HEBT = [
  [/kernsaniert|kernsanierung/i, 20, 'kernsaniert'],
  [/\bsaniert\b|\bsanierung\b/i, 15, 'saniert'],
  [/modernisiert|modernisierung/i, 12, 'modernisiert'],
  [/erstbezug|neuwertig|neubau/i, 10, 'neuwertig'],
  [/energetisch/i, 8, 'energetisch verbessert'],
];
const SENKT = [
  [/sanierungsbed(ue|ü)rftig|renovierungsbed(ue|ü)rftig/i, 30, 'sanierungsbeduerftig'],
  [/modernisierungsstau|instandsetzungsstau/i, 25, 'Modernisierungsstau'],
  [/unsaniert|unrenoviert/i, 15, 'unsaniert'],
  [/abrissobjekt|altbestand/i, 20, 'Altbestand'],
];

const raus = [];
for (const it of $input.all()) {
  const j = it.json || {};
  const p = (j.profil === 'A' || j.profil === 'B') ? j.profil : null;
  if (!p) continue;

  let felder = {};
  try { felder = JSON.parse(j.expose_felder || '{}'); } catch (e) { continue; }
  if (!felder || !Object.keys(felder).length) continue;

  const bj = felder.baujahr ? felder.baujahr.wert : null;
  const liste = (felder.ausstattung && Array.isArray(felder.ausstattung.wert)) ? felder.ausstattung.wert : [];
  const suchraum = [liste.join(' '), String(j.titel || '')].join(' ');

  let wert = sockel(bj);
  const gruende = [];
  if (wert != null) gruende.push('Baujahr ' + bj + ' ergibt ' + wert);
  for (const [re, plus, name] of HEBT) if (re.test(suchraum)) { wert = (wert == null ? 60 : wert) + plus; gruende.push('+' + plus + ' ' + name); }
  for (const [re, minus, name] of SENKT) if (re.test(suchraum)) { wert = (wert == null ? 60 : wert) - minus; gruende.push('-' + minus + ' ' + name); }
  if (wert == null) continue;                       // weder Baujahr noch Stichwort: nichts zu rechnen
  wert = Math.max(0, Math.min(100, Math.round(wert)));

  let bew = {};
  try { bew = JSON.parse(j.bewertung_json || '{}'); } catch (e) { bew = {}; }
  const punkte = Object.assign({}, bew.punkte || {});
  punkte.zustand = wert;

  const g = GEWICHTE[p];
  let gsum = 0, wsum = 0, bsum = 0;
  for (const [k, gew] of Object.entries(g)) {
    if (typeof punkte[k] !== 'number') continue;
    gsum += gew; wsum += gew * punkte[k];
    if (k !== 'zustand') bsum += gew;               // Modellfeld zaehlt nicht in die Belegdichte
  }
  const vorscore = gsum ? Math.round(wsum / gsum) : null;
  const belegdichte = Math.round(bsum) / 100;

  bew.punkte = punkte;
  bew.zustand_modell = { wert: wert, marke: 'modell', herleitung: gruende.join(', '), version: VERSION };
  bew.hinweis = 'Zustand aus Baujahr und Ausstattung des Exposes (C2); Energie, Rendite und Ruecklage fehlen weiter';

  raus.push({ json: {
    objekt_schluessel: j.objekt_schluessel,
    expose_id: j.expose_id,
    vorscore_alt: (typeof j.vorscore === 'number') ? j.vorscore : null,
    vorscore: vorscore,
    belegdichte: belegdichte,
    bewertung_json: JSON.stringify(bew),
    zustand_punkte: wert,
    herleitung: gruende.join(', '),
  }});
}
return raus;

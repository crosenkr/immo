// S3 Buchhalter v2 (Phase 1b). n8n Code-Knoten, Modus "Run Once for All Items".
// Voran steht der generierte Block aus referenzband_koeln_2026.js (REF_IRW, REF_GMB); build_s3.py fuegt beides zusammen.
// Eingabe: Zeilen aus objekt mit zustand = 'neu'. Ausgabe: dieselben Zeilen mit Bewertung.
// Deterministisch, kein Modellaufruf, kein Abruf (R20). Jede Zahl hat eine Beleg-id (R18): irw_nrw_2026, gmb_koeln_2026.
// R4: Deckel am Referenzpreis. Angebot ueber Deckel, Referenz darunter -> Verhandlungsfall mit Zielgebot.
// Referenzpreis = Wohnflaeche x angepasster Immobilienrichtwert (Median der Zonen des Stadtteils).
// Anpassung nur mit den Merkmalen aus der Anzeige (Wohnflaeche, bei Haus Grundstueck); Baujahr, Ausstattung, Miete bleiben Normobjekt.
// Spur 2 (GMB Kaufpreisspannen je Stadtteil) nur als Rueckfall ohne Zone; Belegdichte weist die Luecke aus (R8).

const VERSION = 's3-2026-09-10.2';
const NEBENKOSTEN = 0.065 + 0.015 + 0.005;          // basis.yaml
const COURTAGE_RUECKFALL = 0.0357;

const PROFILE = {
  A: { deckel: 500000, teilmarkt: 'etw',
       kernlage: ['Ehrenfeld', 'Neustadt-Nord', 'Neustadt-Süd', 'Lindenthal', 'Sülz', 'Rodenkirchen', 'Marienburg'],
       gewichte: { preisabstand_pct: 26, bruttorendite_pct: 19, zustand: 15, energieklasse: 13, ruecklage_deckung: 13, wohnlage_amtlich: 8, grundriss_zimmer: 6 },
       zimmer: { 1: 20, 2: 55, 3: 80, 4: 95 } },
  B: { deckel: 900000, teilmarkt: 'haus',
       kernlage: ['Ehrenfeld', 'Lindenthal', 'Sülz', 'Rodenkirchen', 'Marienburg', 'Junkersdorf'],
       gewichte: { zustand: 22, preisabstand_pct: 20, energieklasse: 18, wohnflaeche_fit: 12, grundstueck_fit: 10, wohnlage_amtlich: 10, grundriss_zimmer: 8 },
       zimmer: { 2: 20, 3: 55, 4: 85, 5: 100, 6: 85 },
       wohnflaeche: { 90: 0, 120: 100, 170: 100, 210: 0 },
       grundstueck: { 200: 0, 350: 100, 700: 100, 1200: 0 } },
};
const PREIS_ANKER = { '-15': 100, '0': 60, '10': 30, '20': 0 };            // anker.yaml preis (preisabstand_pct, geklemmt)

// Umrechnungskoeffizienten (irw_koeln_2026_koeffizienten.yaml), nur die aus der Anzeige belegbaren Merkmale
const UK_WF_ETW = [[25, 40, 1.02], [41, 80, 1.00], [81, 120, 1.02], [121, 150, 1.07]];
const UK_WF_HAUS = [[70, 90, 1.18], [91, 110, 1.08], [111, 130, 1.00], [131, 150, 0.95], [151, 170, 0.88], [171, 190, 0.85], [191, 400, 0.80]];
const UK_GS_HAUS = [[100, 200, 0.96], [201, 300, 1.00], [301, 400, 1.04], [401, 500, 1.08], [501, 700, 1.17], [701, 900, 1.28], [901, 2500, 1.52]];
function uk(tab, x) {
  if (typeof x !== 'number') return null;
  if (x < tab[0][0] || x > tab[tab.length - 1][1]) return null;       // ausserhalb des Modells: keine Anpassung, Fahne
  for (const [a, b, k] of tab) if (x >= a && x <= b) return k;
  return null;
}

function interp(anker, x) {
  const pts = Object.keys(anker).map(Number).sort((a, b) => a - b);
  if (x <= pts[0]) return anker[pts[0]];
  if (x >= pts[pts.length - 1]) return anker[pts[pts.length - 1]];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (x >= a && x <= b) return anker[a] + (anker[b] - anker[a]) * (x - a) / (b - a);
  }
  return null;
}
const median = xs => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

function profilVon(suchauftrag) {
  const s = String(suchauftrag || '').trim();
  if (/^A\b/i.test(s)) return 'A';
  if (/^B\b/i.test(s)) return 'B';
  return null;
}
function normStadtteil(s) {
  s = String(s || '').trim();
  if (!s || s === 'fehlt in der Anzeige') return null;
  return s.replace(/Sued/g, 'Süd').replace(/Suelz/g, 'Sülz').replace(/ue/g, 'ü');
}

// Referenzpreis je m² fuer Stadtteil und Teilmarkt; liefert { qm, band, quelle, fahnen }
function referenz(stadtteil, teilmarkt, wf, gs) {
  const fahnen = [];
  const st = normStadtteil(stadtteil);
  if (!st) return { qm: null, band: null, quelle: null, fahnen: ['stadtteil_fehlt'] };
  const tab = teilmarkt === 'etw' ? UK_WF_ETW : UK_WF_HAUS;
  const r = REF_IRW[st] && REF_IRW[st][teilmarkt];
  if (r && r.z.length) {
    const werte = [];
    for (const [imrw, name, normWf, normFl] of r.z) {
      let f = 1;
      const kObj = uk(tab, wf), kNorm = uk(tab, normWf);
      if (kObj != null && kNorm != null) f *= kObj / kNorm; else if (typeof wf === 'number') fahnen.push('wohnflaeche_ausserhalb_modell');
      if (teilmarkt === 'haus') {
        const gObj = uk(UK_GS_HAUS, gs), gNorm = uk(UK_GS_HAUS, normFl);
        if (gObj != null && gNorm != null) f *= gObj / gNorm; else fahnen.push('grundstueck_fehlt_oder_ausserhalb');
      }
      werte.push(Math.round(imrw * f));
    }
    return { qm: Math.round(median(werte)), band: [Math.min(...werte), Math.max(...werte)], quelle: 'irw_nrw_2026',
             zonen: r.z.map(z => z[1]), fahnen: [...new Set(fahnen)] };
  }
  const g = REF_GMB[st];
  if (g) {
    if (teilmarkt === 'etw' && g.etw) return { qm: g.etw[0], band: [g.etw[1], g.etw[2]], quelle: 'gmb_koeln_2026', kauffaelle: g.etw[3], fahnen: ['referenz_spur2_kaufpreisspanne'] };
    if (teilmarkt === 'haus' && g.haus) {
      const arten = Object.values(g.haus);
      return { qm: Math.round(median(arten.map(a => a[0]))), band: [Math.min(...arten.map(a => a[1])), Math.max(...arten.map(a => a[2]))], quelle: 'gmb_koeln_2026', fahnen: ['referenz_spur2_kaufpreisspanne'] };
    }
  }
  return { qm: null, band: null, quelle: null, fahnen: ['keine_referenz_fuer_stadtteil'] };
}

const out = [];
for (const it of $input.all()) {
  const j = { ...it.json };
  const p = profilVon(j.suchauftrag);
  const prof = p ? PROFILE[p] : null;
  const punkte = {};
  const fahnen = [];

  const kp = (typeof j.kaufpreis_eur === 'number') ? j.kaufpreis_eur : null;
  const wf = (typeof j.wohnflaeche_qm === 'number') ? j.wohnflaeche_qm : null;
  const gs = (typeof j.grundstueck_qm === 'number') ? j.grundstueck_qm : null;
  const prov = (typeof j.provision_kaeufer_pct === 'number') ? j.provision_kaeufer_pct / 100 : COURTAGE_RUECKFALL;
  const faktor = 1 + NEBENKOSTEN + prov;
  const gesamtaufwand = kp ? Math.round(kp * faktor) : null;

  // Referenzpreis (R4)
  let ref = { qm: null, band: null, quelle: null, fahnen: [] };
  let referenzpreis = null, gesamtaufwand_ref = null, preisabstand = null, zielgebot = null;
  const neubau = /neubau|erstbezug/i.test(String(j.titel || ''));                          // IRW gilt nur fuer Weiterverkauf (Fachinformation)
  if (prof && !neubau) {
    ref = referenz(j.stadtteil, prof.teilmarkt, wf, gs);
    fahnen.push(...ref.fahnen);
    if (ref.qm && wf) {
      referenzpreis = Math.round(ref.qm * wf);
      gesamtaufwand_ref = Math.round(referenzpreis * faktor);
      if (kp) preisabstand = Math.round((kp - referenzpreis) / referenzpreis * 1000) / 10;
    }
  }

  // Deckelstatus
  let deckel_status;
  if (!prof) deckel_status = 'kein_profil';
  else if (gesamtaufwand_ref != null) {
    if (gesamtaufwand_ref > prof.deckel) deckel_status = 'ausgeschlossen_referenzpreis';               // R4: einziges Ausschlusskriterium
    else if (gesamtaufwand != null && gesamtaufwand > prof.deckel) {
      deckel_status = 'verhandlungsfall';                                                              // Angebot drueber, Referenz drunter
      zielgebot = Math.round(prof.deckel / faktor / 1000) * 1000;                                       // hoechstes Gebot innerhalb des Deckels
    } else if (gesamtaufwand == null) { deckel_status = 'unter_deckel_preis_fehlt'; fahnen.push('preis_fehlt_in_der_anzeige'); }
    else deckel_status = 'unter_deckel';
  } else if (gesamtaufwand == null) { deckel_status = 'kein_preis'; fahnen.push('preis_fehlt_in_der_anzeige'); }
  else deckel_status = gesamtaufwand <= prof.deckel ? 'unter_deckel_notbehelf' : 'ueber_deckel_angebotspreis';   // ohne Referenz: Notbehelf
  if (prof && neubau) fahnen.push('neubau_irw_gilt_nur_weiterverkauf');

  // Punkte
  let lage_stufe = null;
  if (prof) {
    const st = normStadtteil(j.stadtteil);
    lage_stufe = (st && prof.kernlage.includes(st)) ? 'kernlage' : 'im_radius';
    punkte.wohnlage_amtlich = lage_stufe === 'kernlage' ? 100 : 50;
    if (typeof j.zimmer === 'number') punkte.grundriss_zimmer = interp(prof.zimmer, j.zimmer);
    if (preisabstand != null) punkte.preisabstand_pct = Math.round(interp(PREIS_ANKER, Math.max(-15, Math.min(20, preisabstand))));
    if (p === 'B') {
      if (wf != null) punkte.wohnflaeche_fit = interp(prof.wohnflaeche, wf);
      if (gs != null) punkte.grundstueck_fit = interp(prof.grundstueck, gs);
    }
  }

  let vorscore = null, belegdichte = 0;
  if (prof) {
    let gsum = 0, wsum = 0;
    for (const [k, g] of Object.entries(prof.gewichte)) if (typeof punkte[k] === 'number') { gsum += g; wsum += g * punkte[k]; }
    belegdichte = Math.round(gsum) / 100;
    vorscore = gsum ? Math.round(wsum / gsum) : null;
  }

  Object.assign(j, {
    profil: p || 'unbekannt',
    gesamtaufwand_eur: gesamtaufwand,
    referenzpreis_eur: referenzpreis,
    referenz_qm: ref.qm,
    referenz_band: ref.band ? ref.band.join('-') : null,
    referenz_quelle: ref.quelle,
    preisabstand_pct: preisabstand,
    zielgebot_eur: zielgebot,
    deckel_status,
    lage_stufe,
    vorscore,
    belegdichte,
    bewertung_json: JSON.stringify({ punkte, fahnen: [...new Set(fahnen)], referenz: ref, gesamtaufwand_ref, version: VERSION,
      belege: ['irw_nrw_2026', 'gmb_koeln_2026'], hinweis: 'Referenz ohne Baujahr, Ausstattung, Miete (Normobjekt); Zustand, Energie, Rendite, Ruecklage fehlen bis C1/C2' }),
    zustand: 'vorbewertet',
    bewertet_am: new Date().toISOString(),
  });
  out.push({ json: j });
}
return out;

// S6 Kachel (Phase 1b). n8n Code-Knoten, Modus "Run Once for All Items".
// Baut aus der Tabelle objekt den Inhalt fuer die Home-Assistant-Entitaet sensor.immo_objekte.
// Nur Felder aus der Tabelle, kein Modellaufruf, kein Abruf. Adresse ohne Hausnummer (R19).
// Der Zustand der Entitaet ist die Anzahl der Treffer. Die Liste steht als JSON-Text im Attribut objekte_json,
// weil der Home-Assistant-Knoten von n8n nur einfache Attributwerte kennt. In Home Assistant liest sie from_json.
const VERSION = 's6-2026-09-11.1';
const MAX_LISTE = 12;
const KAUFBAR = ['unter_deckel', 'verhandlungsfall', 'unter_deckel_notbehelf', 'unter_deckel_preis_fehlt'];
const DECKEL_KURZ = { unter_deckel: 'unter Deckel', verhandlungsfall: 'Verhandlungsfall', unter_deckel_notbehelf: 'nur Angebotspreis', unter_deckel_preis_fehlt: 'Preis fehlt' };

const alle = $input.all().map(i => i.json).filter(j => j && String(j.objekt_schluessel || '').startsWith('is24:'));
const treffer = alle.filter(j => KAUFBAR.includes(j.deckel_status) && typeof j.vorscore === 'number');
treffer.sort((a, b) => (b.vorscore - a.vorscore) || ((a.preis_je_qm || 0) - (b.preis_je_qm || 0)));

const liste = treffer.slice(0, MAX_LISTE).map(j => ({
  schluessel: j.objekt_schluessel,
  profil: j.profil || 'unbekannt',
  titel: String(j.titel || '').slice(0, 80),
  lage: [j.stadtteil, j.strasse].filter(x => x && x !== 'fehlt in der Anzeige').join(', ') || 'Lage k. A.',
  kaufpreis: (typeof j.kaufpreis_eur === 'number') ? j.kaufpreis_eur : null,
  flaeche: (typeof j.wohnflaeche_qm === 'number') ? j.wohnflaeche_qm : null,
  zimmer: (typeof j.zimmer === 'number') ? j.zimmer : null,
  je_qm: (typeof j.preis_je_qm === 'number') ? Math.round(j.preis_je_qm) : null,
  referenz_qm: (typeof j.referenz_qm === 'number') ? j.referenz_qm : null,
  abstand: (typeof j.preisabstand_pct === 'number') ? j.preisabstand_pct : null,
  vorscore: j.vorscore,
  belegdichte: j.belegdichte ?? null,
  deckel: DECKEL_KURZ[j.deckel_status] || j.deckel_status,
  zielgebot: (typeof j.zielgebot_eur === 'number') ? j.zielgebot_eur : null,
  kernlage: j.lage_stufe === 'kernlage',
  link: j.link || null,
}));

const bestes = liste[0] || null;
const kurz = bestes
  ? `${treffer.length} Treffer, bestes ${bestes.vorscore} in ${bestes.lage.split(',')[0]}`
  : 'keine Treffer';

return [{ json: {
  entity_id: 'sensor.immo_objekte',
  state: String(treffer.length),
  kurz,
  anzahl_gesamt: String(alle.length),
  anzahl_a: String(treffer.filter(j => j.profil === 'A').length),
  anzahl_b: String(treffer.filter(j => j.profil === 'B').length),
  anzahl_verhandlungsfall: String(treffer.filter(j => j.deckel_status === 'verhandlungsfall').length),
  bestes_vorscore: String(bestes ? bestes.vorscore : 0),
  stand: new Date().toISOString(),
  version: VERSION,
  objekte_json: JSON.stringify(liste),
} }];

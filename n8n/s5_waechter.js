// S5 Waechter (Phase 1b). n8n Code-Knoten, Modus "Run Once for All Items".
// Prueft einmal taeglich, ob die Kette laeuft. Meldet nur bei einem Befund, sonntags zusaetzlich die Wochenrueckschau.
// Kein Modellaufruf, kein Abruf. Quellen: die Leseknoten dieses Workflows.
// Schwellen (gesetzt, Sitzung 2 pruefen): Mail im Posteingang > 2 h, Objekt in 'neu' > 2 h,
// Objekt in 'vorbewertet' > 26 h, kein Objektzugang seit 3 Tagen.
const VERSION = 's5-2026-09-11.1';
const STD = 3600 * 1000;
const jetzt = Date.now();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const alt = (t, stunden) => { const x = Date.parse(t || ''); return Number.isFinite(x) && (jetzt - x) > stunden * STD; };
const hole = name => { try { return $(name).all().map(i => i.json).filter(j => j && Object.keys(j).length); } catch (e) { return []; } };

const mails = hole('Posteingang pruefen');
const dlq = hole('DLQ pruefen');
const objekte = hole('Offene Objekte lesen').filter(j => j.objekt_schluessel);
const ereignisse = hole('Ereignisse lesen').filter(j => j.typ);

const befunde = [];
const alteMails = mails.filter(m => alt(m.date || (m.envelope && m.envelope.date), 2));
if (alteMails.length) befunde.push(`${alteMails.length} ungelesene Mail(s) liegen laenger als 2 h im Posteingang. Der Sammler kommt nicht durch.`);
if (dlq.length) befunde.push(`${dlq.length} Mail(s) in Immo/DLQ. Der Parser hat sie nicht verstanden.`);

const stecktNeu = objekte.filter(j => j.zustand === 'neu' && alt(j.erfasst_am, 2));
if (stecktNeu.length) befunde.push(`${stecktNeu.length} Objekt(e) stehen laenger als 2 h auf neu. Der Buchhalter laeuft nicht.`);

const stecktVor = objekte.filter(j => j.zustand === 'vorbewertet' && alt(j.bewertet_am, 26));
if (stecktVor.length) befunde.push(`${stecktVor.length} Objekt(e) stehen laenger als 26 h auf vorbewertet. Der Digest hat sie nicht gemeldet.`);

const letzteNeu = ereignisse.filter(e => e.typ === 'NEU').map(e => Date.parse(e.zeit || '')).filter(Number.isFinite);
const juengste = letzteNeu.length ? Math.max(...letzteNeu) : null;
if (juengste && (jetzt - juengste) > 3 * 24 * STD) {
  const tage = Math.floor((jetzt - juengste) / (24 * STD));
  befunde.push(`Seit ${tage} Tagen kein neues Objekt. Pruefe die Suchauftraege bei ImmoScout24.`);
}
if (!ereignisse.length) befunde.push('Die Tabelle ereignis ist leer. Das darf im Betrieb nicht vorkommen.');

// Wochenrueckschau, sonntags
const heute = new Date().toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'short' });
const sonntag = /^So/.test(heute);
let rueckschau = '';
if (sonntag) {
  const grenze = jetzt - 7 * 24 * STD;
  const woche = ereignisse.filter(e => { const t = Date.parse(e.zeit || ''); return Number.isFinite(t) && t >= grenze; });
  const zaehl = t => woche.filter(e => e.typ === t).length;
  rueckschau = `\n\n<b>Wochenrueckschau</b>\nNeue Objekte: ${zaehl('NEU')}\nBewertungen: ${zaehl('VORBEWERTET')}\nDigests: ${zaehl('DIGEST')}\nStoerungen: ${zaehl('STOERUNG')}\nBestand in objekt: ${objekte.length} offen`;
}

const datum = new Date().toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' });
let text = '';
if (befunde.length) {
  text = `<b>Immo-Waechter ${esc(datum)}</b>\n` + befunde.map(b => `• ${esc(b)}`).join('\n') + rueckschau;
} else if (sonntag) {
  text = `<b>Immo-Waechter ${esc(datum)}</b>\nAlles in Ordnung. Sammler, Buchhalter und Zusteller laufen.` + rueckschau;
}

return [{ json: {
  melden: text.length > 0, text,
  anzahl_befunde: befunde.length, befunde,
  mails_offen: mails.length, mails_alt: alteMails.length, dlq: dlq.length,
  objekte_neu: stecktNeu.length, objekte_vorbewertet: stecktVor.length,
  version: VERSION,
} }];

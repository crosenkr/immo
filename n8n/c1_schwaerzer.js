// S2 Schwaerzer (E38): Hausnummer und Kontaktdaten raus, Strasse und Stadtteil bleiben.
// Eingabe: die gefilterten Mails, bei PDF zusaetzlich der ausgelesene Text.
// Ausgabe: ein Item je Mail mit geschwaerztem Text. Fail-closed: ohne Text kein Modellaufruf.
// Der Anhangstext kommt ohne Kennung zurueck. Eindeutig ist er nur, wenn genau eine Mail
// im Lauf einen Anhang hat. Bei zwei oder mehr wird kein Anhang zugeordnet; diese Mails
// gehen in die DLQ und werden von Hand angesehen (fail-closed statt falsch gepaart).
// Der Knoten "Extract From PDF" legt den Text unter text ab.
const pdfTexte = $input.all().map(i => String(((i.json || {}).pdf_text) || ((i.json || {}).text) || '')).filter(Boolean);
const mails = $('Maklerpost filtern').all();
const mitPdf = mails.filter(i => (i.json || {}).hat_pdf).length;
const passt = mitPdf === 1 && pdfTexte.length === 1;
let k = 0;


// Zuordnung zum Objekt in drei Stufen (R6: lieber eine eingestandene Luecke als eine geratene Zahl):
//   1. Ziffernfolge aus Betreff, Mailtext oder Anhang, die in der Tabelle objekt steht.
//      Telefon- und Steuernummern fallen damit durch.
//   2. sonst: unter den angefragten Objekten ueber die Wohnflaeche, Toleranz 0,5 m2,
//      nur bei genau einem Treffer.
//   3. sonst: ueber Woerter aus dem Titel, mindestens zwei, nur bei einem eindeutigen Sieger.
const objekte = $('Objekte holen').all().map(i => i.json || {});
const bekannt = new Set(objekte.map(o => String(o.expose_id || '')).filter(Boolean));
const offen = objekte.filter(o => String(o.anfrage_status || '') === 'angefragt'
                               && String(o.expose_status || '') !== 'gelesen');
const STOPP = new Set(['der','die','das','und','mit','fuer','für','in','im','am','von','zu','ein','eine',
  'auf','aus','bei','den','dem','des','als','ist','wohnung','haus','koeln','köln','zum','verkauf','top']);
const woerter = t => String(t || '').toLowerCase()
  .replace(/[^a-zäöüß0-9]+/g, ' ').split(' ')
  .filter(w => w.length >= 5 && !STOPP.has(w));
function flaechenIm(text) {
  const raus = [];
  const re = /(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:m²|m2|qm|quadratmeter)/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const z = Number(String(m[1]).replace(',', '.'));
    if (isFinite(z) && z >= 15 && z <= 600) raus.push(z);
  }
  return [...new Set(raus)];
}
function zuordnen(volltext) {
  const zahlen = [...new Set([...volltext.matchAll(/\b(\d{8,12})\b/g)].map(m => m[1]))];
  for (const k of zahlen) if (bekannt.has(k)) return { id: k, weg: 'nummer' };
  if (!offen.length) return { id: '', weg: '' };
  const treffer = [];
  for (const f of flaechenIm(volltext)) {
    for (const o of offen) {
      const wf = Number(o.wohnflaeche_qm);
      if (isFinite(wf) && Math.abs(wf - f) <= 0.5) treffer.push(String(o.expose_id || ''));
    }
  }
  const eindeutig = [...new Set(treffer.filter(Boolean))];
  if (eindeutig.length === 1) return { id: eindeutig[0], weg: 'flaeche' };
  const wortmenge = new Set(woerter(volltext));
  let bester = null, bestwert = 0, gleichstand = false;
  for (const o of offen) {
    const n = woerter(o.titel).filter(w => wortmenge.has(w)).length;
    if (n > bestwert) { bestwert = n; bester = o; gleichstand = false; }
    else if (n === bestwert && n > 0) gleichstand = true;
  }
  if (bester && bestwert >= 2 && !gleichstand) return { id: String(bester.expose_id || ''), weg: 'titel' };
  return { id: '', weg: '' };
}

function schwaerzen(t) {
  let s = String(t || '');
  s = s.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[Kontakt entfernt]');
  s = s.replace(/https?:\/\/\S+/g, '[Verweis entfernt]');
  s = s.replace(/\bwww\.\S+/gi, '[Verweis entfernt]');
  // Rufnummern: +49..., 0221/..., 0170 ...
  s = s.replace(/(?<![\d])(?:\+\d{1,3}[\s\/-]?)?\(?0\d{2,5}\)?[\s\/-]?\d{3,}(?:[\s\/-]?\d+)*/g, m =>
    (m.replace(/\D/g, '').length >= 7 ? '[Rufnummer entfernt]' : m));
  // Hausnummer nach einem Strassennamen: Wort auf -strasse/-str./-weg/-platz/-allee/-gasse/-ring/-damm
  s = s.replace(/([A-ZÄÖÜ][\wÄÖÜäöüß.-]*(?:stra(?:ß|ss)e|str\.|weg|platz|allee|gasse|ring|damm|ufer|chaussee))\s+\d+\s*[a-zA-Z]?\b/g,
    '$1 [Hausnummer entfernt]');
  return s.replace(/[ \t]{2,}/g, ' ').trim();
}

const raus = [];
for (const i of mails) {
  const j = i.json || {};
  const pdf = (j.hat_pdf && passt) ? (pdfTexte[k++] || '') : '';
  const anhang_offen = !!(j.hat_pdf && !passt);      // Anhang da, aber nicht eindeutig zuzuordnen
  const teile = [j.mailtext, pdf].filter(Boolean);
  const roh = teile.join('\n\n--- Anhang ---\n\n');
  const z = zuordnen(j.betreff + '\n' + roh);
  const text = schwaerzen(roh);
  const gekuerzt = text.slice(0, 60000);
  const anweisung = [
    'Du liest den Text eines Immobilien-Exposes und fuellst nur erlaubte Felder.',
    'Erlaubt sind ausschliesslich: zimmer, etage, baujahr, stadtteil, ausstattung.',
    'Verboten sind Preis, Wohnflaeche, Hausgeld, Ruecklage und Energiekennwert. Nenne sie nie.',
    'Fuelle ein Feld nur, wenn der Text es klar sagt. Sonst null.',
    'Gib zu jedem gefuellten Feld genau ein Zitat aus dem Text.',
    'Das Zitat muss eine zusammenhaengende Stelle sein, Zeichen fuer Zeichen abgeschrieben.',
    'Setze nie zwei Stellen zusammen, kuerze nicht mit Auslassungspunkten, formuliere nicht um.',
    'Findest du keine einzelne Stelle, die den Wert traegt, setze das Feld auf null.',
    'Antworte nur mit JSON in dieser Form:',
    '{"zimmer": Zahl oder null, "etage": Text oder null, "baujahr": Zahl oder null,',
    ' "stadtteil": Text oder null, "ausstattung": [Text], "belege": {"feld": "Zitat"}}',
  ].join('\n');
  raus.push({ json: {
    uid: j.uid,
    betreff: schwaerzen(j.betreff),
    empfangen_am: j.empfangen_am,
    kandidaten: j.kandidaten || [],
    expose_id: z.id,
    zuordnung: z.weg,
    portalpost: !!j.portalpost,
    zeichen: gekuerzt.length,
    anhang_offen: anhang_offen,
    lesbar: gekuerzt.length >= 200 && !!z.id && !anhang_offen,   // ohne zugeordnetes Objekt kein Modellaufruf
    text: gekuerzt,
    body: {
      model: 'gpt-oss-120b',
      temperature: 0,
      max_tokens: 3000,
      reasoning_effort: 'low',   // gpt-oss denkt sonst das Fenster leer
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: anweisung },
        { role: 'user', content: gekuerzt },
      ],
    },
  }});
}
return raus;

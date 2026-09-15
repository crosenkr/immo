// S2 Schwaerzer (E38): Hausnummer und Kontaktdaten raus, Strasse und Stadtteil bleiben.
// Eingabe: die gefilterten Mails, bei PDF zusaetzlich der ausgelesene Text.
// Ausgabe: ein Item je Mail mit geschwaerztem Text. Fail-closed: ohne Text kein Modellaufruf.
// Die Anhangstexte kommen ohne UID zurueck. Sie stehen aber in derselben Reihenfolge
// wie die Mails mit Anhang. Stimmt die Zahl nicht, wird kein Anhang zugeordnet (fail-closed).
// Der Knoten "Extract From PDF" legt den Text unter text ab.
const pdfTexte = $input.all().map(i => String(((i.json || {}).pdf_text) || ((i.json || {}).text) || '')).filter(Boolean);
const mails = $('Maklerpost filtern').all();
const mitPdf = mails.filter(i => (i.json || {}).hat_pdf).length;
const passt = pdfTexte.length === mitPdf;
let k = 0;

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
  const teile = [j.mailtext, pdf].filter(Boolean);
  const roh = teile.join('\n\n--- Anhang ---\n\n');
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
    expose_id: (j.kandidaten || [])[0] || '',
    zeichen: gekuerzt.length,
    lesbar: gekuerzt.length >= 200 && !!((j.kandidaten || [])[0]),   // ohne Exposenummer kein Modellaufruf
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

// C1 Leser, Schritt 3: Antwort des lokalen Modells pruefen.
// Positivliste nach Konzept 5.7: nur zimmer, etage, baujahr, stadtteil, ausstattung.
// Preis, Wohnflaeche, Hausgeld, Ruecklage und Energiekennwert bleiben gesperrt (R6).
// Gefuellte Felder tragen die Marke "modell" und zaehlen nicht in die Belegdichte (R8).
const ERLAUBT = ['zimmer', 'etage', 'baujahr', 'stadtteil', 'ausstattung'];

// Zitatanker (R1, R7): ein Beleg zaehlt nur, wenn er woertlich im geschwaerzten Text steht.
// Verglichen wird ohne Mehrfachleerzeichen und ohne Gross- und Kleinschreibung.
const norm = t => String(t || '').replace(/\s+/g, ' ').toLowerCase();
const belegtIm = (zitat, text) => {
  const z = norm(zitat);
  return z.length >= 8 && norm(text).includes(z);
};

const quelle = $('S2 Schwaerzer').all();
const raus = [];
const antworten = $input.all();

for (let i = 0; i < antworten.length; i++) {
  const a = (antworten[i] || {}).json || {};
  const q = ((quelle[i] || {}).json) || {};
  let felder = {}, grund = '';
  const ungeprueft = [];

  const inhalt = a.choices && a.choices[0] && a.choices[0].message
    ? (a.choices[0].message.content || '') : '';
  if (!inhalt) grund = 'keine Antwort vom Modell';

  if (inhalt) {
    const start = inhalt.indexOf('{'), ende = inhalt.lastIndexOf('}');
    try {
      const roh = JSON.parse(start >= 0 ? inhalt.slice(start, ende + 1) : inhalt);
      const belege = (roh && typeof roh.belege === 'object' && roh.belege) || {};
      for (const k of ERLAUBT) {
        let w = roh ? roh[k] : null;
        if (w === undefined || w === null || w === '') continue;
        if (k === 'ausstattung') {
          w = Array.isArray(w) ? w.map(x => String(x)).filter(Boolean).slice(0, 12) : [String(w)];
          if (!w.length) continue;
        }
        if (k === 'zimmer' || k === 'baujahr') {
          const z = Number(String(w).replace(',', '.'));
          if (!isFinite(z)) continue;
          w = z;
        }
        const zitat = String(belege[k] || '').slice(0, 300);
        const geprueft = belegtIm(zitat, q.text);
        if (!geprueft) ungeprueft.push(k);      // Wert bleibt, der Beleg gilt als nicht belegt (R1, R7)
        felder[k] = { wert: w, marke: 'modell', beleg: zitat, beleg_geprueft: geprueft };
      }
    } catch (e) { grund = 'Antwort war kein JSON'; }
  }

  const anzahl = Object.keys(felder).length;
  raus.push({ json: {
    uid: q.uid,
    expose_id: String(q.expose_id || ''),
    objekt_schluessel: q.expose_id ? ('is24:' + q.expose_id) : '',
    expose_status: anzahl ? 'gelesen' : 'ohne_felder',
    expose_grund: grund || (ungeprueft.length ? ('Beleg nicht woertlich: ' + ungeprueft.join(', ')) : ''),
    ungepruefte_felder: ungeprueft,
    expose_am: new Date().toISOString(),
    expose_felder: JSON.stringify(felder),
    anzahl_felder: anzahl,
    betreff: q.betreff || '',
  }});
}
return raus;

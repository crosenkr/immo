// S1 Sammler, Schritt "IS24-Mail parsen" (n8n Code-Knoten, Modus "Run Once for Each Item")
// Eingabe: ein Item je Mail mit den Feldern textContent (bevorzugt), htmlContent, subject, from, to, date, uid
// Ausgabe: ein Item je Anzeige mit typisierten Feldern nach R6 (Wert oder "fehlt in der Anzeige"), Belegzitat je Feld (R1)
// Quelle und Suchauftrag kommen aus Empfaengeradresse (Plus-Tag) und Betreff/Text, nie aus dem Anzeigentext (R20).
// Keine URL aus der Mail wird abgerufen. Der Link wird nur als Schluessel (Expose-ID) und als Verweis gespeichert.

const FEHLT = 'fehlt in der Anzeige';

function plainFromHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n');
}

function toNumber(s) {
  // "598.000 €" -> 598000 ; "94 m²" -> 94 ; "3,5" -> 3.5
  if (s == null) return null;
  const m = String(s).replace(/ /g, ' ').match(/-?\d{1,3}(?:\.\d{3})*(?:,\d+)?|-?\d+(?:,\d+)?/);
  if (!m) return null;
  return Number(m[0].replace(/\./g, '').replace(',', '.'));
}

function field(block, label) {
  // Zeile "Label: Wert" -> { wert, zitat } ; fehlt -> { wert: null, zitat: null }
  const re = new RegExp('^' + label + ':\\s*(.+)$', 'mi');
  const m = block.match(re);
  return m ? { wert: m[1].trim(), zitat: m[0].trim() } : { wert: null, zitat: null };
}

const STADTTEIL_NORM = { 'neustadt/nord': 'Neustadt-Nord', 'neustadt/süd': 'Neustadt-Süd', 'neustadt/sued': 'Neustadt-Süd', 'altstadt/nord': 'Altstadt-Nord', 'altstadt/süd': 'Altstadt-Süd' };
function normStadtteil(s) { if (!s) return s; const k = s.toLowerCase().trim(); return STADTTEIL_NORM[k] || s.trim(); }

function parseAddress(a) {
  // "Vorgebirgstraße 334, Zollstock, Köln" | "Leyendeckerstraße, Ehrenfeld (Ortsteil), Köln" | "Ehrenfeld, Köln"
  const out = { strasse: null, hausnummer: null, stadtteil: null, ort: null };
  if (!a) return out;
  const parts = a.split(',').map(x => x.trim()).filter(Boolean);
  out.ort = parts.length ? parts[parts.length - 1] : null;
  if (parts.length >= 3) {
    out.stadtteil = normStadtteil(parts[parts.length - 2].replace(/\s*\(Ortsteil\)\s*/i, ''));
    const sm = parts[0].match(/^(.*?)(?:\s+(\d+[a-zA-Z]?(?:\s*-\s*\d+[a-zA-Z]?)?))?$/);
    out.strasse = sm ? sm[1].trim() || null : parts[0];
    out.hausnummer = sm && sm[2] ? sm[2].trim() : null;
  } else if (parts.length === 2) {
    out.stadtteil = normStadtteil(parts[0].replace(/\s*\(Ortsteil\)\s*/i, ''));
  }
  return out;
}

const item = $input.item.json;
const text = (item.textContent && item.textContent.trim().length > 200) ? item.textContent : plainFromHtml(item.htmlContent || '');
const to = String(item.to || item['to'] || '');
const tagMatch = to.match(/\+([a-z0-9-]+)@/i);
const quelle_tag = tagMatch ? tagMatch[1].toLowerCase() : null;               // "is24"
const fromDomain = (String(item.from || '').match(/@([a-z0-9.-]+)/i) || [])[1] || null;
const quelle = quelle_tag === 'is24' || /immobilienscout24\.de$/i.test(fromDomain || '') ? 'is24' : (quelle_tag || 'unbekannt');

// Suchauftrag: Name im Text ("Deine suche ... wurde erfolgreich gespeichert") oder im Betreff; sonst savedSearchId aus dem ersten Link
const subject = String(item.subject || '');
const ssid = (text.match(/savedSearchId=(\d+)/) || [])[1] || null;
let suchauftrag = (subject.match(/„(.+?)“|"(.+?)"/) || []).slice(1).find(Boolean) || null;
if (!suchauftrag) {
  const m = text.match(/Deine suche (.+?) wurde erfolgreich gespeichert/i) || text.match(/Suchauftrag[:\s]+(.+)$/mi);
  suchauftrag = m ? m[1].trim() : null;
}

const mailart = /wurde erfolgreich gespeichert|Neuer Suchauftrag wurde angelegt/i.test(text + subject)
  ? 'bestaetigung' : (/fulfillment|Neue Angebote|neue Immobilien|passend/i.test(text + subject) ? 'benachrichtigung' : 'unbekannt');

// Anzeigenbloecke: beginnen mit "Titel:" und enden vor dem naechsten "Titel:" oder dem Fusszeilenbeginn
const cut = text.search(/\n\s*(Datenschutz|Impressum|© 1999|ImmoScout24 informiert)/i);
const body = cut > 0 ? text.slice(0, cut) : text;
const blocks = body.split(/\n(?=Titel:\s)/).filter(b => /^Titel:/m.test(b));

const out = [];
for (const b of blocks) {
  const titel = field(b, 'Titel');
  const link = field(b, 'Link');
  const adresse = field(b, 'Adresse');
  const kaufpreis = field(b, 'Kaufpreis');
  const wohnflaeche = field(b, 'Wohnfläche');
  const zimmer = field(b, 'Zimmer');
  const grundstueck = field(b, 'Grundstück');
  const exposeId = (link.wert && (link.wert.match(/\/expose\/(\d+)/) || [])[1]) || null;

  // Ausstattungszeile: die erste Zeile ohne "Label:" nach den Feldzeilen
  const lines = b.split('\n').map(x => x.trim()).filter(Boolean);
  const merkmalZeile = lines.find(l => !/^(Titel|Link|Adresse|Kaufpreis|Wohnfläche|Zimmer|Grundstück):/i.test(l)) || null;
  const merkmale = merkmalZeile ? merkmalZeile.split(',').map(x => x.trim()).filter(Boolean) : [];
  const provisionsfrei = merkmale.some(m => /provisionsfrei/i.test(m));

  const adr = parseAddress(adresse.wert);
  const kp = toNumber(kaufpreis.wert);
  const wf = toNumber(wohnflaeche.wert);

  out.push({
    json: {
      quelle, quelle_tag, mailart, suchauftrag, saved_search_id: ssid,
      mail_uid: item.uid || null, mail_datum: item.date || null,
      objekt_schluessel: exposeId ? `is24:${exposeId}` : null,          // R14, stabiler Schluessel
      expose_id: exposeId,
      link: link.wert || null,                                            // nur Verweis, kein Abruf
      titel: titel.wert || FEHLT,
      strasse: adr.strasse || FEHLT,
      hausnummer: adr.hausnummer || FEHLT,                                // S2 schwaerzt vor dem Modellaufruf (R19)
      stadtteil: adr.stadtteil || FEHLT,
      ort: adr.ort || FEHLT,
      kaufpreis_eur: kp ?? FEHLT,
      wohnflaeche_qm: wf ?? FEHLT,
      zimmer: toNumber(zimmer.wert) ?? FEHLT,
      grundstueck_qm: toNumber(grundstueck.wert) ?? FEHLT,
      preis_je_qm: (kp && wf) ? Math.round((kp / wf) * 100) / 100 : FEHLT,
      provision_kaeufer_pct: provisionsfrei ? 0 : FEHLT,                  // Rueckfall 3.57 setzt C2, nicht der Parser
      merkmale,
      belege: {                                                           // R1: Zitat je Feld, Belegklasse B1 (Anzeige)
        kaufpreis_eur: kaufpreis.zitat, wohnflaeche_qm: wohnflaeche.zitat, zimmer: zimmer.zitat,
        adresse: adresse.zitat, provision_kaeufer_pct: provisionsfrei ? merkmalZeile : null, titel: titel.zitat,
      },
      belegklasse: 'B1',
      parser_version: 'is24-2026-09-10.1',
      roh_block_sha256: null,                                             // setzt der Folgeknoten (Crypto), fuer den Aenderungsvergleich
    },
  });
}

if (out.length === 0) {
  // Sichtbares Scheitern (R17): kein Anzeigenblock erkannt -> ein Item mit Stoerungsmarke, kein stilles Leerlaufen
  out.push({ json: { quelle, mailart, suchauftrag, mail_uid: item.uid || null, stoerung: 'parser_keine_anzeigen', parser_version: 'is24-2026-09-10.1', textlaenge: text.length } });
}
return out;

// C1 Leser, Schritt 1: Maklerpost filtern.
// Betreff und Absender stehen bei n8n-nodes-imap unter envelope, nicht direkt im Item.
// Suchauftragsmails von myscout@immobilienscout24.de holt S1. Systempost des Portals
// (Anfragebestaetigung) wiederholt die Anzeige in Kurzform: sie wird gelesen, aber nur als
// anfrage verbucht, damit das echte Expose spaeter nicht blockiert ist.
// Die Zuordnung zum Objekt macht S2 Schwaerzer, weil sie den Text der Anhaenge braucht:
// in der Lieferung des Maklers stehen Nummer und Flaeche oft erst im Expose-PDF.
const ohneTags = h => String(h || '')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/p>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/[ \t]+/g, ' ');

const raus = [];
for (const item of $input.all()) {
  const j = item.json || {};
  const e = j.envelope || {};
  const betreff = String(e.subject || j.subject || '');
  const absender = []
    .concat(e.from || [])
    .map(a => String((a && a.address) || '')).join(', ') || String(j.from || '');
  const von = absender.toLowerCase();
  if (von.includes('myscout@immobilienscout24.de')) continue;              // Suchauftragsmail, gehoert S1
  const portalpost = /@(?:[a-z0-9.-]+\.)?immobilienscout24\.de/.test(von);
  const text = String(j.textContent || '').trim() || ohneTags(j.htmlContent);
  const info = Array.isArray(j.attachmentsInfo) ? j.attachmentsInfo : [];
  const anhaenge = info.filter(a => /pdf/i.test(String(a.contentType || a.filename || '')));
  raus.push({ json: {
    uid: j.uid,
    betreff: betreff,
    absender: absender,
    empfangen_am: e.date || j.date || null,
    mailtext: text,
    hat_pdf: anhaenge.length > 0,
    anzahl_anhaenge: anhaenge.length,
    portalpost: portalpost,
  }});
}
return raus;

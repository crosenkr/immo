// C1 Leser, Schritt 1: Maklerpost filtern.
// Betreff und Absender stehen bei n8n-nodes-imap unter envelope, nicht direkt im Item.
// Suchauftragsmails von myscout@immobilienscout24.de holt S1 und werden hier verworfen.
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
  if (absender.toLowerCase().includes('myscout@immobilienscout24.de')) continue;
  const text = String(j.textContent || '').trim() || ohneTags(j.htmlContent);
  const suchraum = betreff + '\n' + text;
  const treffer = [...suchraum.matchAll(/\b(\d{8,12})\b/g)].map(m => m[1]);
  const info = Array.isArray(j.attachmentsInfo) ? j.attachmentsInfo : [];
  const anhaenge = info.filter(a => /pdf/i.test(String(a.contentType || a.filename || '')));
  raus.push({ json: {
    uid: j.uid,
    betreff: betreff,
    absender: absender,
    empfangen_am: e.date || j.date || null,
    mailtext: text,
    kandidaten: [...new Set(treffer)],
    hat_pdf: anhaenge.length > 0,
  }});
}
return raus;

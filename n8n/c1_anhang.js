// C1 Leser, Schritt 2a: Anhang waehlen.
// Eine Lieferung enthaelt oft ein Dutzend PDFs (Wirtschaftsplan, Teilungserklaerung, Grundbuch).
// Gelesen wird das Expose. Findet sich keines, gilt der erste Anhang.
const raus = [];
for (const it of $input.all()) {
  const liste = Array.isArray((it.json || {}).attachments) ? it.json.attachments : [];
  const pdfs = liste.filter(a => /pdf/i.test(String(a.contentType || a.filename || '')));
  const wahl = pdfs.find(a => /expos/i.test(String(a.filename || '')))
    || pdfs.find(a => /grundriss/i.test(String(a.filename || '')))
    || pdfs[0];
  if (!wahl) continue;
  raus.push({
    json: Object.assign({}, it.json, {
      anhang_feld: wahl.binaryFieldName,
      anhang_name: wahl.filename || '',
      anhang_anzahl: pdfs.length,
    }),
    binary: it.binary,
  });
}
return raus;

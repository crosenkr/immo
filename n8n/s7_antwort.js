// S7 Anfrage, Schritt 3: Antwort bauen.
// Die Liste der Anfragen kommt aus "Anfragen erkennen", die Tabellenzeilen aus "Objekt suchen".
// Kein Versand an den Makler (R20 und AGB des Portals, Ziffer 8.2). Christoph sendet selbst in der App.
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const eur = n => (typeof n === 'number') ? n.toLocaleString('de-DE') + ' EUR' : 'k. A.';
const zeilen = {};
for (const i of $input.all()) {
  const j = i.json || {};
  const k = String(j.expose_id || '');
  if (k && j.titel) zeilen[k] = j;
}
const raus = [];
for (const i of $('Anfragen erkennen').all()) {
  const id = String((i.json || {}).expose_id || '');
  const j = zeilen[id];
  const url = 'https://www.immobilienscout24.de/expose/' + id;
  if (!j) {
    raus.push({ json: { objekt_schluessel: 'is24:' + id, expose_id: id, gefunden: false,
      text: '<b>Objekt ' + esc(id) + ' nicht gefunden</b>\nKeine Zeile in der Tabelle objekt.\n' + esc(url) } });
    continue;
  }
  const miete = /^A/i.test(String(j.suchauftrag || '')) ? '- Mietvertrag und aktuelle Nettokaltmiete\n' : '';
  const anfrage = 'Guten Tag,\n\nich interessiere mich fuer Ihr Angebot und bitte um das vollstaendige Exposé.\n\n'
    + 'Bitte senden Sie mir dazu:\n- Energieausweis\n- Grundriss\n'
    + '- aktuelle Hoehe von Hausgeld und Instandhaltungsruecklage\n'
    + '- die letzten beiden Protokolle der Eigentuemerversammlung\n' + miete
    + '\nVielen Dank im Voraus.\n\nMit freundlichen Gruessen\nChristoph Rosenkranz';
  const lage = [j.stadtteil, j.strasse].filter(x => x && x !== 'fehlt in der Anzeige').join(', ') || 'Lage k. A.';
  const text = '<b>' + esc(j.titel) + '</b>\n' + esc(lage) + ' | ' + eur(j.kaufpreis_eur)
    + (typeof j.vorscore === 'number' ? ' | Vorscore ' + j.vorscore : '')
    + '\n\n1. Anzeige oeffnen: ' + esc(url)
    + '\n2. Auf Nachricht schreiben tippen.'
    + '\n3. Text unten antippen, einfuegen, senden.\n\n<pre>' + esc(anfrage) + '</pre>';
  raus.push({ json: { objekt_schluessel: j.objekt_schluessel || ('is24:' + id), expose_id: id,
    gefunden: true, text: text, anfrage_status: 'angefragt', angefragt_am: new Date().toISOString() } });
}
return raus;

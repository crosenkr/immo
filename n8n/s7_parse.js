// S7 Anfrage, Schritt 2: Anfragen erkennen.
// Eingabe: Antwort von getUpdates. Ausgabe: ein Item je gewuenschtem Exposé, jedes mit der hoechsten Update-Nummer.
// Nur Nachrichten aus dem eigenen Chat zaehlen (R19: keine fremden Absender).
// Die Marke steht nicht mehr im Arbeitsspeicher: der Knoten "Marke bestaetigen" meldet sie am Ende an Telegram zurueck.
const CHAT_ID = 884133793;
const raus = [];
let hoechste = 0;
for (const i of $input.all()) {
  const a = i.json || {};
  const updates = Array.isArray(a.result) ? a.result : [];
  for (const u of updates) {
    if (typeof u.update_id === 'number' && u.update_id >= hoechste) hoechste = u.update_id + 1;
    const m = u.message || u.edited_message;
    if (!m || !m.text) continue;
    if (Number(m.chat && m.chat.id) !== CHAT_ID) continue;          // fremder Chat: uebergehen
    const t = String(m.text).trim();
    const tr = t.match(/^\/e(\d{4,12})\b/);
    if (!tr) continue;
    raus.push({ json: { expose_id: tr[1], objekt_schluessel: 'is24:' + tr[1], befehl: t, message_id: m.message_id } });
  }
}
for (const r of raus) r.json.hoechste = hoechste;
return raus;

// Testlauf: node n8n/test_s1_parser.js  (prueft den Parser gegen gold/is24_bestaetigung_synthetisch.txt)
const fs = require('fs');
const text = fs.readFileSync(__dirname + '/../gold/is24_bestaetigung_synthetisch.txt', 'utf8');
const erwartet = JSON.parse(fs.readFileSync(__dirname + '/../gold/is24_bestaetigung_synthetisch.erwartet.json', 'utf8'));
const src = fs.readFileSync(__dirname + '/s1_parser_is24.js', 'utf8');
const $input = { all: () => [{ json: { textContent: text, subject: 'Neuer Suchauftrag wurde angelegt', from: 'ImmoScout24 <myscout@immobilienscout24.de>', to: 'immo+is24@rosenkranz.cologne', uid: 1 } }] };
const out = new Function('$input', src)($input).map(o => o.json);
let fehler = 0;
erwartet.forEach((e, i) => { for (const k of Object.keys(e)) { if (JSON.stringify(out[i][k]) !== JSON.stringify(e[k])) { fehler++; console.log(`Abweichung Anzeige ${i + 1} Feld ${k}: erwartet ${JSON.stringify(e[k])}, erhalten ${JSON.stringify(out[i][k])}`); } } });
if (out.length !== erwartet.length) { fehler++; console.log(`Anzahl: erwartet ${erwartet.length}, erhalten ${out.length}`); }
console.log(fehler === 0 ? `OK: ${out.length} Anzeigen, alle Felder wie erwartet, quelle=${out[0].quelle}, mailart=${out[0].mailart}` : `${fehler} Abweichungen`);
process.exit(fehler ? 1 : 0);

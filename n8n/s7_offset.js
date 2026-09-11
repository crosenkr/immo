// S7 Anfrage, Schritt 1: Abrufmarke lesen.
// Telegram liefert bei getUpdates nur Nachrichten ab der Marke (offset). Die Marke steht im
// dauerhaften Speicher des Workflows, damit jede Nachricht genau einmal verarbeitet wird.
const sd = $getWorkflowStaticData('global');
if (typeof sd.offset !== 'number') sd.offset = 0;
return [{ json: { offset: sd.offset } }];

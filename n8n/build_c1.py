import json, uuid

def rid(): return str(uuid.uuid4())
IMAP = {"imapApi": {"id": "cKgIjBArVwkGZYu9", "name": "IMAP immo (immo@rosenkranz.cologne)"}}
OBJ = {"__rl": True, "value": "RhcS6X5MWKzfAL22", "mode": "list", "cachedResultName": "objekt",
       "cachedResultUrl": "/projects/Sbks7yJf8isk0OTm/datatables/RhcS6X5MWKzfAL22"}
ERE = {"__rl": True, "value": "d6rJmS98tcnUCPiw", "mode": "list", "cachedResultName": "ereignis",
       "cachedResultUrl": "/projects/Sbks7yJf8isk0OTm/datatables/d6rJmS98tcnUCPiw"}

def schema(keys):
    return [{"id": k, "displayName": k, "required": False, "defaultMatch": False,
             "display": True, "type": "string", "readOnly": False, "removed": False} for k in keys]

def code(name, pos, js, once=False):
    n = {"parameters": {"mode": "runOnceForAllItems", "jsCode": js},
         "type": "n8n-nodes-base.code", "typeVersion": 2, "position": pos, "id": rid(), "name": name}
    if once: n["executeOnce"] = True
    return n

def wenn(name, pos, left, op="true"):
    cond = {"id": rid(), "leftValue": left, "rightValue": "",
            "operator": {"type": "boolean", "operation": "true", "singleValue": True}}
    return {"parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "",
            "typeValidation": "loose", "version": 2}, "conditions": [cond], "combinator": "and"},
            "looseTypeValidation": True, "options": {}},
            "type": "n8n-nodes-base.if", "typeVersion": 2.2, "position": pos, "id": rid(), "name": name}

filtern = open('c1_filter.js', encoding='utf-8').read()
schwaerzer = open('c1_schwaerzer.js', encoding='utf-8').read()
antwort = open('c1_antwort.js', encoding='utf-8').read()

uids = """// UIDs der verarbeiteten Mails einsammeln. Ohne UID endet der Zweig hier.
const liste = $('Antwort pruefen').all()
  .map(i => (i.json || {}).uid)
  .filter(u => u !== undefined && u !== null);
if (!liste.length) return [];
return [{ json: { uid_list: liste.join(',') } }];
"""
uids_dlq = """// UIDs der unlesbaren Mails einsammeln. Ohne UID endet der Zweig hier.
const liste = $('S2 Schwaerzer').all()
  .filter(i => !(i.json || {}).lesbar)
  .map(i => (i.json || {}).uid)
  .filter(u => u !== undefined && u !== null);
if (!liste.length) return [];
return [{ json: { uid_list: liste.join(',') } }];
"""

nodes = [
 {"parameters": {"rule": {"interval": [{"field": "minutes", "minutesInterval": 15}]}},
  "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.3, "position": [-600, 0], "id": rid(),
  "name": "Alle 15 Minuten"},
 {"parameters": {"resource": "email",
   "mailboxPath": {"__rl": True, "mode": "list", "value": "INBOX", "cachedResultName": "INBOX", "cachedResultUrl": ""},
   "emailDateRange": {}, "emailFlags": {"seen": False}, "emailSearchFilters": {},
   "includeParts": ["textContent", "htmlContent", "attachmentsInfo"]},
  "type": "n8n-nodes-imap.imap", "typeVersion": 1, "position": [-380, 0], "id": rid(),
  "name": "IMAP Maklerpost lesen", "credentials": IMAP, "alwaysOutputData": True,
  "notes": "Holt alle ungelesenen Mails. Suchauftragsmails von myscout@ holt S1 und werden hier verworfen."},
 code("Maklerpost filtern", [-160, 0], filtern),
 wenn("Hat PDF?", [60, 0], "={{ $json.hat_pdf }}"),
 {"parameters": {"resource": "email", "operation": "downloadAttachment",
   "mailboxPath": {"__rl": True, "value": "INBOX", "mode": "path"},
   "emailUid": "={{ $json.uid }}", "allAttachments": True, "includeInlineAttachments": False},
  "type": "n8n-nodes-imap.imap", "typeVersion": 1, "position": [280, -220], "id": rid(),
  "name": "IMAP: Anhang laden", "credentials": IMAP, "onError": "continueRegularOutput"},
 {"parameters": {"operation": "pdf", "binaryPropertyName": "attachment_0",
   "options": {"joinPages": True}, "destinationKey": "pdf_text"},
  "type": "n8n-nodes-base.extractFromFile", "typeVersion": 1, "position": [280, -120], "id": rid(),
  "name": "PDF-Text holen", "onError": "continueRegularOutput"},
 code("S2 Schwaerzer", [500, 0], schwaerzer),
 wenn("Lesbar?", [720, 0], "={{ $json.lesbar }}"),
 {"parameters": {"method": "POST", "url": "http://jetson-thor.fritz.box:4000/v1/chat/completions",
   "authentication": "predefinedCredentialType", "nodeCredentialType": "openAiApi",
   "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.body) }}",
   "options": {"timeout": 300000, "response": {"response": {"neverError": True}}}},
  "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [940, -120], "id": rid(),
  "name": "C1 Leser (lokales Modell)", "credentials": {"openAiApi": {"name": "LiteLLM immo"}},
  "notes": "LiteLLM auf dem Thor, Schluessel immo, nur gpt-oss-120b."},
 code("Antwort pruefen", [1160, -120], antwort),
 {"parameters": {"operation": "update", "dataTableId": OBJ, "matchType": "allConditions",
   "filters": {"conditions": [{"keyName": "expose_id", "condition": "eq",
                               "keyValue": "={{ $json.expose_id }}"}]},
   "columns": {"mappingMode": "defineBelow", "value": {
       "expose_status": "={{ $json.expose_status }}",
       "expose_am": "={{ $json.expose_am }}",
       "expose_felder": "={{ $json.expose_felder }}"},
     "matchingColumns": [], "schema": schema(["expose_status", "expose_am", "expose_felder"]),
     "attemptToConvertTypes": False, "convertFieldsToString": False}, "options": {}},
  "type": "n8n-nodes-base.dataTable", "typeVersion": 1.1, "position": [1380, -120], "id": rid(),
  "name": "objekt: Exposefelder schreiben", "onError": "continueRegularOutput"},
 {"parameters": {"dataTableId": ERE, "columns": {"mappingMode": "defineBelow", "value": {
       "objekt_schluessel": "={{ $('Antwort pruefen').item.json.objekt_schluessel }}",
       "typ": "EXPOSE", "zeit": "={{ $now.toISO() }}", "lauf_id": "={{ $execution.id }}",
       "quelle": "mail",
       "nutzlast": "={{ JSON.stringify({expose_id: $('Antwort pruefen').item.json.expose_id, status: $('Antwort pruefen').item.json.expose_status, felder: $('Antwort pruefen').item.json.anzahl_felder}) }}"},
     "matchingColumns": [], "schema": schema(["objekt_schluessel", "typ", "zeit", "lauf_id", "quelle", "nutzlast"]),
     "attemptToConvertTypes": False, "convertFieldsToString": False}, "options": {}},
  "type": "n8n-nodes-base.dataTable", "typeVersion": 1.1, "position": [1600, -120], "id": rid(),
  "name": "Ereignis EXPOSE"},
 code("UIDs einsammeln", [1820, -120], uids, once=True),
 {"parameters": {"resource": "email", "operation": "setEmailFlags",
   "mailboxPath": {"__rl": True, "value": "INBOX", "mode": "path"},
   "emailUid": "={{ $json.uid_list }}", "flags": {"\\Seen": True}},
  "type": "n8n-nodes-imap.imap", "typeVersion": 1, "position": [2040, -120], "id": rid(),
  "name": "IMAP: als gelesen markieren", "credentials": IMAP},
 {"parameters": {"resource": "email", "operation": "moveEmail",
   "sourceMailbox": {"__rl": True, "value": "INBOX", "mode": "path"},
   "emailUid": "={{ $('UIDs einsammeln').first().json.uid_list }}",
   "destinationMailbox": {"__rl": True, "value": "INBOX/Archiv", "mode": "list", "cachedResultName": "INBOX/Archiv"}},
  "type": "n8n-nodes-imap.imap", "typeVersion": 1, "position": [2260, -120], "id": rid(),
  "name": "IMAP: nach Immo/Archiv", "credentials": IMAP},
 code("UIDs unlesbar einsammeln", [940, 140], uids_dlq, once=True),
 {"parameters": {"resource": "email", "operation": "setEmailFlags",
   "mailboxPath": {"__rl": True, "value": "INBOX", "mode": "path"},
   "emailUid": "={{ $json.uid_list }}", "flags": {"\\Seen": True}},
  "type": "n8n-nodes-imap.imap", "typeVersion": 1, "position": [1160, 140], "id": rid(),
  "name": "IMAP: unlesbar als gelesen", "credentials": IMAP},
 {"parameters": {"resource": "email", "operation": "moveEmail",
   "sourceMailbox": {"__rl": True, "value": "INBOX", "mode": "path"},
   "emailUid": "={{ $('UIDs unlesbar einsammeln').first().json.uid_list }}",
   "destinationMailbox": {"__rl": True, "value": "INBOX/DLQ", "mode": "list", "cachedResultName": "INBOX/DLQ"}},
  "type": "n8n-nodes-imap.imap", "typeVersion": 1, "position": [1380, 140], "id": rid(),
  "name": "IMAP: unlesbar nach Immo/DLQ", "credentials": IMAP},
 {"parameters": {"content": """### C1 Leser mit S2 Schwaerzer (Phase 1b)

Alle 15 Minuten holt dieser Ablauf die ungelesenen Mails, die NICHT von
myscout@immobilienscout24.de kommen. Das sind die Antworten der Makler.

S2 Schwaerzer entfernt Rufnummern, Mailadressen, Verweise und Hausnummern,
bevor Text den Thor erreicht (E38, R19). Strasse und Stadtteil bleiben.

C1 fragt das lokale Modell ueber LiteLLM (Schluessel immo). Es fuellt nur die
Positivliste aus Konzept 5.7: zimmer, etage, baujahr, stadtteil, ausstattung.
Preis, Wohnflaeche, Hausgeld, Ruecklage und Energiekennwert bleiben gesperrt.
Gefuellte Felder tragen die Marke modell und zaehlen nicht in die Belegdichte.

EINRICHTUNG:
1. Tabelle objekt braucht die Spalten expose_status, expose_am, expose_felder (alle String).
2. Im Knoten "C1 Leser (lokales Modell)" die Zugangsdaten "LiteLLM immo" auswaehlen.
3. Im Knoten "IMAP Maklerpost lesen" pruefen, dass "Attachments" unter
   Include Message Parts steht.
""", "height": 480, "width": 560},
  "type": "n8n-nodes-base.stickyNote", "typeVersion": 1, "position": [-620, 260], "id": rid(), "name": "Sticky: C1"},
]

conn = {
 "Alle 15 Minuten": {"main": [[{"node": "IMAP Maklerpost lesen", "type": "main", "index": 0}]]},
 "IMAP Maklerpost lesen": {"main": [[{"node": "Maklerpost filtern", "type": "main", "index": 0}]]},
 "Maklerpost filtern": {"main": [[{"node": "Hat PDF?", "type": "main", "index": 0}]]},
 "Hat PDF?": {"main": [[{"node": "IMAP: Anhang laden", "type": "main", "index": 0}],
                        [{"node": "S2 Schwaerzer", "type": "main", "index": 0}]]},
 "IMAP: Anhang laden": {"main": [[{"node": "PDF-Text holen", "type": "main", "index": 0}]]},
 "PDF-Text holen": {"main": [[{"node": "S2 Schwaerzer", "type": "main", "index": 0}]]},
 "S2 Schwaerzer": {"main": [[{"node": "Lesbar?", "type": "main", "index": 0}]]},
 "Lesbar?": {"main": [[{"node": "C1 Leser (lokales Modell)", "type": "main", "index": 0}],
                       [{"node": "UIDs unlesbar einsammeln", "type": "main", "index": 0}]]},
 "C1 Leser (lokales Modell)": {"main": [[{"node": "Antwort pruefen", "type": "main", "index": 0}]]},
 "Antwort pruefen": {"main": [[{"node": "objekt: Exposefelder schreiben", "type": "main", "index": 0}]]},
 "objekt: Exposefelder schreiben": {"main": [[{"node": "Ereignis EXPOSE", "type": "main", "index": 0}]]},
 "Ereignis EXPOSE": {"main": [[{"node": "UIDs einsammeln", "type": "main", "index": 0}]]},
 "UIDs einsammeln": {"main": [[{"node": "IMAP: als gelesen markieren", "type": "main", "index": 0}]]},
 "IMAP: als gelesen markieren": {"main": [[{"node": "IMAP: nach Immo/Archiv", "type": "main", "index": 0}]]},
 "UIDs unlesbar einsammeln": {"main": [[{"node": "IMAP: unlesbar als gelesen", "type": "main", "index": 0}]]},
 "IMAP: unlesbar als gelesen": {"main": [[{"node": "IMAP: unlesbar nach Immo/DLQ", "type": "main", "index": 0}]]},
}

wf = {"name": "Immo C1 Leser Expose (Phase 1b, v5)", "nodes": nodes, "connections": conn,
      "settings": {"executionOrder": "v1", "binaryMode": "separate", "timeSavedMode": "fixed",
                   "errorWorkflow": "HLOJsWSboUnvLnFf", "callerPolicy": "workflowsFromSameOwner",
                   "executionTimeout": -1, "availableInMCP": False},
      "pinData": {}, "meta": {"instanceId": "immo"}}
json.dump(wf, open('c1-leser-expose.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print("Knoten:", len(nodes))

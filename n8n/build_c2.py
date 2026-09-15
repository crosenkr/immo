import json, uuid
def rid(): return str(uuid.uuid4())
OBJ = {"__rl": True, "value": "RhcS6X5MWKzfAL22", "mode": "list", "cachedResultName": "objekt",
       "cachedResultUrl": "/projects/Sbks7yJf8isk0OTm/datatables/RhcS6X5MWKzfAL22"}
ERE = {"__rl": True, "value": "d6rJmS98tcnUCPiw", "mode": "list", "cachedResultName": "ereignis",
       "cachedResultUrl": "/projects/Sbks7yJf8isk0OTm/datatables/d6rJmS98tcnUCPiw"}
def schema(keys):
    return [{"id": k, "displayName": k, "required": False, "defaultMatch": False,
             "display": True, "type": "string", "readOnly": False, "removed": False} for k in keys]

rechner = open('c2_rechner.js', encoding='utf-8').read()

nodes = [
 {"parameters": {"rule": {"interval": [{"field": "minutes", "minutesInterval": 30}]}},
  "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.3, "position": [-400, 0], "id": rid(),
  "name": "Alle 30 Minuten"},
 {"parameters": {"operation": "get", "dataTableId": OBJ, "returnAll": True, "matchType": "allConditions",
   "filters": {"conditions": [{"keyName": "expose_status", "condition": "eq", "keyValue": "gelesen"}]},
   "options": {}},
  "type": "n8n-nodes-base.dataTable", "typeVersion": 1.1, "position": [-180, 0], "id": rid(),
  "name": "Gelesene Objekte holen", "alwaysOutputData": True},
 {"parameters": {"mode": "runOnceForAllItems", "jsCode": rechner},
  "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [40, 0], "id": rid(),
  "name": "Zustand und Vorscore rechnen"},
 {"parameters": {"operation": "update", "dataTableId": OBJ, "matchType": "allConditions",
   "filters": {"conditions": [{"keyName": "objekt_schluessel", "condition": "eq",
                               "keyValue": "={{ $json.objekt_schluessel }}"}]},
   "columns": {"mappingMode": "defineBelow", "value": {
       "vorscore": "={{ $json.vorscore }}",
       "belegdichte": "={{ $json.belegdichte }}",
       "bewertung_json": "={{ $json.bewertung_json }}"},
     "matchingColumns": [], "schema": schema(["vorscore", "belegdichte", "bewertung_json"]),
     "attemptToConvertTypes": True, "convertFieldsToString": False}, "options": {}},
  "type": "n8n-nodes-base.dataTable", "typeVersion": 1.1, "position": [260, 0], "id": rid(),
  "name": "objekt: Vorscore aktualisieren"},
 {"parameters": {"dataTableId": ERE, "columns": {"mappingMode": "defineBelow", "value": {
       "objekt_schluessel": "={{ $('Zustand und Vorscore rechnen').item.json.objekt_schluessel }}",
       "typ": "C2", "zeit": "={{ $now.toISO() }}", "lauf_id": "={{ $execution.id }}",
       "quelle": "rechnung",
       "nutzlast": "={{ JSON.stringify({vorher: $('Zustand und Vorscore rechnen').item.json.vorscore_alt, nachher: $('Zustand und Vorscore rechnen').item.json.vorscore, zustand: $('Zustand und Vorscore rechnen').item.json.zustand_punkte, herleitung: $('Zustand und Vorscore rechnen').item.json.herleitung}) }}"},
     "matchingColumns": [], "schema": schema(["objekt_schluessel", "typ", "zeit", "lauf_id", "quelle", "nutzlast"]),
     "attemptToConvertTypes": False, "convertFieldsToString": False}, "options": {}},
  "type": "n8n-nodes-base.dataTable", "typeVersion": 1.1, "position": [480, 0], "id": rid(),
  "name": "Ereignis C2"},
 {"parameters": {"content": """### C2 Rechner (Phase 1b)

Alle 30 Minuten holt dieser Ablauf die Objekte mit expose_status = gelesen
und rechnet aus den Exposefeldern den Bauzustand.

Sockel aus dem Baujahr, Stichworte heben oder senken ihn (kernsaniert,
modernisiert, sanierungsbeduerftig, Modernisierungsstau). Kein Modell (R3).

Der Bauzustand traegt die Marke modell. Er geht in den Vorscore ein, aber
NICHT in die Belegdichte (Konzept 5.7, R8). Die Herleitung steht in
bewertung_json unter zustand_modell und im Ereignis C2.

Die Spalte zustand (neu / vorbewertet / gemeldet) wird nicht angefasst.
Der Lauf ist wiederholbar: er rechnet jedes Mal aus denselben Feldern.

ANNAHME, nicht amtlich belegt: die Sockelwerte je Baujahrklasse
(ab 2015: 90, ab 2000: 80, ab 1980: 65, ab 1950: 50, davor: 45).
Gehoert nach ungeprueft.md.
""", "height": 420, "width": 520},
  "type": "n8n-nodes-base.stickyNote", "typeVersion": 1, "position": [-420, 200], "id": rid(), "name": "Sticky: C2"},
]
conn = {
 "Alle 30 Minuten": {"main": [[{"node": "Gelesene Objekte holen", "type": "main", "index": 0}]]},
 "Gelesene Objekte holen": {"main": [[{"node": "Zustand und Vorscore rechnen", "type": "main", "index": 0}]]},
 "Zustand und Vorscore rechnen": {"main": [[{"node": "objekt: Vorscore aktualisieren", "type": "main", "index": 0}]]},
 "objekt: Vorscore aktualisieren": {"main": [[{"node": "Ereignis C2", "type": "main", "index": 0}]]},
}
wf = {"name": "Immo C2 Rechner (Phase 1b, v1)", "nodes": nodes, "connections": conn,
      "settings": {"executionOrder": "v1", "binaryMode": "separate", "timeSavedMode": "fixed",
                   "errorWorkflow": "HLOJsWSboUnvLnFf", "callerPolicy": "workflowsFromSameOwner",
                   "executionTimeout": -1, "availableInMCP": False},
      "pinData": {}, "meta": {"instanceId": "immo"}}
json.dump(wf, open('c2-rechner.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print("Knoten:", len(nodes))

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "6r35igcqhka8gxf",
    "created": "2024-06-07 14:36:50.149Z",
    "updated": "2024-06-07 14:36:50.149Z",
    "name": "appointments",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6gwy6rn3",
        "name": "patient",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "mt6zn57p163l3ut",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "zxqtx5pd",
        "name": "doctor",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "21v58r1grxoix8g",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "jmifib6k",
        "name": "date",
        "type": "date",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "xqckfdas",
        "name": "reason",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id = patient.id || @request.auth.id = doctor.id",
    "viewRule": "@request.auth.id = patient.id || @request.auth.id = doctor.id",
    "createRule": "@request.auth.id = doctor.id",
    "updateRule": "@request.auth.id = doctor.id",
    "deleteRule": "@request.auth.id = doctor.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("6r35igcqhka8gxf");

  return dao.deleteCollection(collection);
})

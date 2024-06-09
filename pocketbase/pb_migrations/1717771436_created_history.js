/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "lcc30umoakucq1w",
    "created": "2024-06-07 14:43:56.513Z",
    "updated": "2024-06-07 14:43:56.513Z",
    "name": "history",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jf5de9fz",
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
        "id": "sy2jphio",
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
        "id": "gfrgbphv",
        "name": "diagnosis",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "qgb3vml2",
        "name": "treatment",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "h8g1qay6",
        "name": "notes",
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
    "listRule": "@request.auth.id = doctor.id || @request.auth.id = patient.id",
    "viewRule": "@request.auth.id = doctor.id || @request.auth.id = patient.id",
    "createRule": "@request.auth.id = doctor.id",
    "updateRule": "@request.auth.id = doctor.id",
    "deleteRule": "@request.auth.id = doctor.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("lcc30umoakucq1w");

  return dao.deleteCollection(collection);
})

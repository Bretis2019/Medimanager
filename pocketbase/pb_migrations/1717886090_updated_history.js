/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lcc30umoakucq1w")

  // remove
  collection.schema.removeField("gfrgbphv")

  // remove
  collection.schema.removeField("qgb3vml2")

  // remove
  collection.schema.removeField("h8g1qay6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "a14fvdzp",
    "name": "diagnosis",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tfhlin2m",
    "name": "treatment",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ei4aufqj",
    "name": "notes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lcc30umoakucq1w")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("a14fvdzp")

  // remove
  collection.schema.removeField("tfhlin2m")

  // remove
  collection.schema.removeField("ei4aufqj")

  return dao.saveCollection(collection)
})

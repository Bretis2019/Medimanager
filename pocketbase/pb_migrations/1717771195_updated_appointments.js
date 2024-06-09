/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6r35igcqhka8gxf")

  collection.listRule = "@request.auth.id = patient.id || @request.auth.id = doctor.id || @request.auth.collectionName = 'staff'"
  collection.viewRule = "@request.auth.id = patient.id || @request.auth.id = doctor.id || @request.auth.collectionName = 'staff'"
  collection.createRule = "@request.auth.id = doctor.id || @request.auth.collectionName = 'staff'"
  collection.updateRule = "@request.auth.id = doctor.id || @request.auth.collectionName = 'staff'"
  collection.deleteRule = "@request.auth.id = doctor.id || @request.auth.collectionName = 'staff'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6r35igcqhka8gxf")

  collection.listRule = "@request.auth.id = patient.id || @request.auth.id = doctor.id"
  collection.viewRule = "@request.auth.id = patient.id || @request.auth.id = doctor.id"
  collection.createRule = "@request.auth.id = doctor.id"
  collection.updateRule = "@request.auth.id = doctor.id"
  collection.deleteRule = "@request.auth.id = doctor.id"

  return dao.saveCollection(collection)
})

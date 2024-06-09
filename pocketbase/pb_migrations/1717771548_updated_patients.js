/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mt6zn57p163l3ut")

  collection.listRule = "@request.auth.id = id || @request.auth.collectionName = 'doctors'|| @request.auth.collectionName = 'staff'"
  collection.viewRule = "@request.auth.id = id || @request.auth.collectionName = 'doctors'|| @request.auth.collectionName = 'staff'"
  collection.updateRule = "@request.auth.id = id || @request.auth.collectionName = 'staff'"
  collection.deleteRule = "@request.auth.id = id || @request.auth.collectionName = 'staff'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mt6zn57p163l3ut")

  collection.listRule = ""
  collection.viewRule = ""
  collection.updateRule = "@request.auth.id = id"
  collection.deleteRule = "@request.auth.id = id"

  return dao.saveCollection(collection)
})

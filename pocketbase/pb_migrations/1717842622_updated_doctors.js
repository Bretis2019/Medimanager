/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("21v58r1grxoix8g")

  collection.listRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("21v58r1grxoix8g")

  collection.listRule = "@request.auth.id = id || @request.auth.collectionName = 'staff'"

  return dao.saveCollection(collection)
})

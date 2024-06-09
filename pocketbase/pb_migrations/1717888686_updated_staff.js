/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1gifybjvn1zyp5u")

  collection.createRule = ""
  collection.updateRule = "@request.auth.id = id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1gifybjvn1zyp5u")

  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})

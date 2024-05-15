/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ooayrislo83yfqg")

  collection.viewRule = "verified=true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ooayrislo83yfqg")

  collection.viewRule = ""

  return dao.saveCollection(collection)
})

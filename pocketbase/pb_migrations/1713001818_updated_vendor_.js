/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ooayrislo83yfqg")

  collection.name = "vendor"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ooayrislo83yfqg")

  collection.name = "vendor_"

  return dao.saveCollection(collection)
})

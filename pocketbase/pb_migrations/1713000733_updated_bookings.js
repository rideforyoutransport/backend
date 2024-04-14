/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  collection.createRule = "user.verified=true"
  collection.updateRule = "user.verified=true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  collection.createRule = "    vendor.active=true"
  collection.updateRule = null

  return dao.saveCollection(collection)
})

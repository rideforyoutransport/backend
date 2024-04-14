/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  collection.listRule = "user.verified=true"
  collection.viewRule = "user.verified=true"
  collection.deleteRule = "user.verified=true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  collection.listRule = null
  collection.viewRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("agqjhzqx4sh0rnl")

  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("agqjhzqx4sh0rnl")

  collection.updateRule = null

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cw4nihxal5cqzjz")

  collection.createRule = "driver.verified=true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cw4nihxal5cqzjz")

  collection.createRule = null

  return dao.saveCollection(collection)
})

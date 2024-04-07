/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vf7f6fb848z8qq3")

  collection.name = "driver"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vf7f6fb848z8qq3")

  collection.name = "driver_d"

  return dao.saveCollection(collection)
})

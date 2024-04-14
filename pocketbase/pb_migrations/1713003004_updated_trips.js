/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  collection.listRule = "vendor.verified=true"
  collection.viewRule = "vendor.verified=true"
  collection.createRule = "vendor.verified=true"
  collection.updateRule = "vendor.verified=true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = "  vendor.verified=true"
  collection.updateRule = null

  return dao.saveCollection(collection)
})

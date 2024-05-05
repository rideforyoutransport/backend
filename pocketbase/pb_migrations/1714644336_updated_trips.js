/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kgyrkwlf",
    "name": "requestedTrip",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // remove
  collection.schema.removeField("kgyrkwlf")

  return dao.saveCollection(collection)
})

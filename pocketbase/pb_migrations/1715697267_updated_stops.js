/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ggvvnvihemoffkt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2exyp6fi",
    "name": "deleted",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ggvvnvihemoffkt")

  // remove
  collection.schema.removeField("2exyp6fi")

  return dao.saveCollection(collection)
})

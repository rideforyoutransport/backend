/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("agqjhzqx4sh0rnl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "utz8itso",
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
  const collection = dao.findCollectionByNameOrId("agqjhzqx4sh0rnl")

  // remove
  collection.schema.removeField("utz8itso")

  return dao.saveCollection(collection)
})

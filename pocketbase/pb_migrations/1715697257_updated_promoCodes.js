/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fh38yfhozfbdygz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pnllqqdl",
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
  const collection = dao.findCollectionByNameOrId("fh38yfhozfbdygz")

  // remove
  collection.schema.removeField("pnllqqdl")

  return dao.saveCollection(collection)
})

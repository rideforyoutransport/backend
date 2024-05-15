/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ut9n0fci",
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
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // remove
  collection.schema.removeField("ut9n0fci")

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2tv4xp70hrqne8n")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b91xz4ut",
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
  const collection = dao.findCollectionByNameOrId("2tv4xp70hrqne8n")

  // remove
  collection.schema.removeField("b91xz4ut")

  return dao.saveCollection(collection)
})

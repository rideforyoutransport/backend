/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ooayrislo83yfqg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "so9z1nbq",
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
  const collection = dao.findCollectionByNameOrId("ooayrislo83yfqg")

  // remove
  collection.schema.removeField("so9z1nbq")

  return dao.saveCollection(collection)
})

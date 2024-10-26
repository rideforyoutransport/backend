/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("we9tsydgq158avl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c6ly0chx",
    "name": "avatar",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("we9tsydgq158avl")

  // remove
  collection.schema.removeField("c6ly0chx")

  return dao.saveCollection(collection)
})

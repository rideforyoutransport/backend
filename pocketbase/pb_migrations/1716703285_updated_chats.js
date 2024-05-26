/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cw4nihxal5cqzjz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d7c9wxxe",
    "name": "messages",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cw4nihxal5cqzjz")

  // remove
  collection.schema.removeField("d7c9wxxe")

  return dao.saveCollection(collection)
})

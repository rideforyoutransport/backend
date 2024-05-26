/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cw4nihxal5cqzjz")

  // remove
  collection.schema.removeField("ah1efmbs")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cw4nihxal5cqzjz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ah1efmbs",
    "name": "message",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
})

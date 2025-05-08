/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2tv4xp70hrqne8n")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pozijt40",
    "name": "mobile",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2tv4xp70hrqne8n")

  // remove
  collection.schema.removeField("pozijt40")

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ggvvnvihemoffkt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cmeqngvy",
    "name": "place_id",
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
  const collection = dao.findCollectionByNameOrId("ggvvnvihemoffkt")

  // remove
  collection.schema.removeField("cmeqngvy")

  return dao.saveCollection(collection)
})

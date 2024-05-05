/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vf7f6fb848z8qq3")

  // remove
  collection.schema.removeField("ukm5e9xw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bm8m1mhb",
    "name": "number",
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
  const collection = dao.findCollectionByNameOrId("vf7f6fb848z8qq3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ukm5e9xw",
    "name": "number",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("bm8m1mhb")

  return dao.saveCollection(collection)
})

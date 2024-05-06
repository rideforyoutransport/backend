/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9pmfznkz",
    "name": "from",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ggvvnvihemoffkt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "paqqfov3",
    "name": "to",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ggvvnvihemoffkt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // remove
  collection.schema.removeField("9pmfznkz")

  // remove
  collection.schema.removeField("paqqfov3")

  return dao.saveCollection(collection)
})

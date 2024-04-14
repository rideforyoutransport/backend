/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // remove
  collection.schema.removeField("y0epuz1m")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l98gmjzm",
    "name": "vendor",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ooayrislo83yfqg",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "y0epuz1m",
    "name": "vendor",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "6b9tdr9qqfgh28c",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("l98gmjzm")

  return dao.saveCollection(collection)
})

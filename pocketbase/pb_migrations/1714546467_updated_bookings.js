/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uajvdtj3",
    "name": "bookingDate",
    "type": "date",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uajvdtj3",
    "name": "bookingDate",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cw4nihxal5cqzjz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "shma5tdb",
    "name": "driver",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "vf7f6fb848z8qq3",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cw4nihxal5cqzjz")

  // remove
  collection.schema.removeField("shma5tdb")

  return dao.saveCollection(collection)
})

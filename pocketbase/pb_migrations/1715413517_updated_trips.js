/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "au6sbm0u",
    "name": "returnTripId",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "0kctov44kvyeqny",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "exfyjss4",
    "name": "isReturnTrip",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // remove
  collection.schema.removeField("au6sbm0u")

  // remove
  collection.schema.removeField("exfyjss4")

  return dao.saveCollection(collection)
})

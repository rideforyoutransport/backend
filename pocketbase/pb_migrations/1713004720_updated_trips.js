/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // remove
  collection.schema.removeField("emrfms6i")

  // remove
  collection.schema.removeField("t9jbtg3v")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "aziqbhn3",
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
    "id": "pxkgvmva",
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
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "emrfms6i",
    "name": "from",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t9jbtg3v",
    "name": "to",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // remove
  collection.schema.removeField("aziqbhn3")

  // remove
  collection.schema.removeField("pxkgvmva")

  return dao.saveCollection(collection)
})

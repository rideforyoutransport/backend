/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("we9tsydgq158avl")

  // remove
  collection.schema.removeField("mgcowktr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dhkmqygo",
    "name": "fvendor",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ooayrislo83yfqg",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "btphlne3",
    "name": "image",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("we9tsydgq158avl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mgcowktr",
    "name": "vendorId",
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
  collection.schema.removeField("dhkmqygo")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "btphlne3",
    "name": "field",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  return dao.saveCollection(collection)
})

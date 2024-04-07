/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6bh7v26bzt9crcz")

  // remove
  collection.schema.removeField("srriuo93")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k70ahlhi",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6bh7v26bzt9crcz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "srriuo93",
    "name": "vendorId",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("k70ahlhi")

  return dao.saveCollection(collection)
})

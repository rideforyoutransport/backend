/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vf7f6fb848z8qq3")

  // remove
  collection.schema.removeField("pe0lbahk")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uaf1uktu",
    "name": "vendorId",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vf7f6fb848z8qq3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pe0lbahk",
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
  collection.schema.removeField("uaf1uktu")

  return dao.saveCollection(collection)
})

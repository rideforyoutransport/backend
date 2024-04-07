/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vf7f6fb848z8qq3")

  // remove
  collection.schema.removeField("yzmmunjp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fyqobosk",
    "name": "pictures",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 99,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vf7f6fb848z8qq3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yzmmunjp",
    "name": "field",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  // remove
  collection.schema.removeField("fyqobosk")

  return dao.saveCollection(collection)
})

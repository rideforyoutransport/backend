/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vjyawtbz",
    "name": "actualStartTime",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xbiou6qa",
    "name": "actualEndTime",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // remove
  collection.schema.removeField("vjyawtbz")

  // remove
  collection.schema.removeField("xbiou6qa")

  return dao.saveCollection(collection)
})

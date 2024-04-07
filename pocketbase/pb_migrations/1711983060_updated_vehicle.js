/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("we9tsydgq158avl")

  // add
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("we9tsydgq158avl")

  // remove
  collection.schema.removeField("btphlne3")

  return dao.saveCollection(collection)
})

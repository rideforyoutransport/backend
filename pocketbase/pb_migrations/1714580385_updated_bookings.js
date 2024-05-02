/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // remove
  collection.schema.removeField("wrbie0e2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jwe7dlct",
    "name": "tipAmount",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nctrasip",
    "name": "tipPaid",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nap7gkwb",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "0",
        "1",
        "2"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f7m9k4jqqz4q3i")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wrbie0e2",
    "name": "cancelled",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("jwe7dlct")

  // remove
  collection.schema.removeField("nctrasip")

  // remove
  collection.schema.removeField("nap7gkwb")

  return dao.saveCollection(collection)
})

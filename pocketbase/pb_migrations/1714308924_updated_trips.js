/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // remove
  collection.schema.removeField("tl4uqano")

  // remove
  collection.schema.removeField("spg0jxyw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r418e9jp",
    "name": "bookingMinimumAmount",
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
    "id": "o6fwuypk",
    "name": "totalTripAmount",
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
    "id": "tj2jblht",
    "name": "tripDescription",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0kctov44kvyeqny")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tl4uqano",
    "name": "bookingMinimumAmount",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "spg0jxyw",
    "name": "totalTripAmount",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("r418e9jp")

  // remove
  collection.schema.removeField("o6fwuypk")

  // remove
  collection.schema.removeField("tj2jblht")

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ggvvnvihemoffkt",
    "created": "2024-04-07 08:33:36.164Z",
    "updated": "2024-04-07 08:33:36.164Z",
    "name": "stops",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wocflru8",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "bzhewhej",
        "name": "geoLocation",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ggvvnvihemoffkt");

  return dao.deleteCollection(collection);
})

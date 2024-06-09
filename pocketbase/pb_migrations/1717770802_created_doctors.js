/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "21v58r1grxoix8g",
    "created": "2024-06-07 14:33:22.229Z",
    "updated": "2024-06-07 14:33:22.229Z",
    "name": "doctors",
    "type": "auth",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dh1l8ev2",
        "name": "name",
        "type": "text",
        "required": true,
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
        "id": "1qi96l8o",
        "name": "specialization",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 3,
          "values": [
            "Cardiologist",
            "Dermatologist",
            "Neurologist",
            "Orthopedic Surgeon",
            "Pediatrician",
            "Psychiatrist",
            "Radiologist",
            "Oncologist",
            "Endocrinologist",
            "Gastroenterologist",
            "Ophthalmologist",
            "Obstetrician",
            "Gynecologist",
            "Urologist",
            "Nephrologist",
            "Pulmonologist",
            "Rheumatologist",
            "Anesthesiologist",
            "Otolaryngologist",
            "Plastic Surgeon",
            "Infectious Disease Specialist",
            "Hematologist",
            "Allergist",
            "Immunologist",
            "General Surgeon",
            "Thoracic Surgeon",
            "Vascular Surgeon",
            "Pathologist",
            "Podiatrist",
            "Geriatrician",
            "Pain Management Specialist",
            "Emergency Medicine Physician",
            "Family Medicine Physician",
            "Sports Medicine Specialist",
            "Occupational Medicine Specialist",
            "Preventive Medicine Specialist",
            "Internal Medicine Physician",
            "Critical Care Medicine Specialist",
            "Nuclear Medicine Specialist",
            "Geneticist",
            "Pediatric Surgeon",
            "Neonatologist",
            "Bariatric Surgeon",
            "Transplant Surgeon",
            "Hand Surgeon",
            "Colorectal Surgeon",
            "Sleep Medicine Specialist",
            "Hospitalist",
            "Medical Oncologist",
            "Surgical Oncologist",
            "Radiation Oncologist"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "@request.auth.id = id",
    "deleteRule": "@request.auth.id = id",
    "options": {
      "allowEmailAuth": true,
      "allowOAuth2Auth": true,
      "allowUsernameAuth": true,
      "exceptEmailDomains": null,
      "manageRule": null,
      "minPasswordLength": 8,
      "onlyEmailDomains": null,
      "onlyVerified": false,
      "requireEmail": true
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("21v58r1grxoix8g");

  return dao.deleteCollection(collection);
})

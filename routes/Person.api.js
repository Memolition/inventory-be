const router = require("express").Router();
const people = require("../controllers/Person.controller.js");

module.exports = app => {
    // Create a new Person
    router.post("/", people.create);
    // Retrieve all people
    router.get("/", people.findAllActive);
    // Retrieve people by common fields
    router.get("/suggest/:fieldVal", people.suggest);
    // Retrieve people by common fields
    router.get("/tax/:taxId", people.taxId);
    // Retrieve all published people
    router.get("/deleted", people.findAll);
    // Retrieve a single Person with id
    router.get("/:id", people.findOne);
    // Update a Person with id
    router.put("/:id", people.update);
    // Delete a Person with id
    router.delete("/:id", people.delete);
    // Delete all people
    router.delete("/", people.deleteAll);
    
    app.use('/api/people', router);
};
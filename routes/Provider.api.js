const router = require("express").Router();
const provider = require("../controllers/Provider.controller.js");

module.exports = app => {
    // Create a new Person
    router.post("/", provider.create);
    // Retrieve all people
    router.get("/", provider.findAllActive);
    // Retrieve all published people
    router.get("/deleted", provider.findAll);
    // Retrieve a single Person with id
    router.get("/:id", provider.findOne);
    // Update a Person with id
    router.put("/:id", provider.update);
    // Delete a Person with id
    router.delete("/:id", provider.delete);
    // Delete all people
    router.delete("/", provider.deleteAll);
    
    app.use('/api/providers', router);
};
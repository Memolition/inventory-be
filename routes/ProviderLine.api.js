const router = require("express").Router();
const providerLines = require("../controllers/ProviderLine.controller.js");

module.exports = app => {
    // Create a new Person
    router.post("/", providerLines.create);
    // Retrieve all people
    router.get("/", providerLines.findAllActive);
    // Retrieve people by common fields
    router.get("/suggest/:fieldVal", providerLines.suggest);
    // Retrieve all published people
    router.get("/deleted", providerLines.findAll);
    // Retrieve a single Person with id
    router.get("/:id", providerLines.findOne);
    // Update a Person with id
    router.put("/:id", providerLines.update);
    // Delete a Person with id
    router.delete("/:id", providerLines.delete);
    // Delete all people
    router.delete("/", providerLines.deleteAll);
    
    app.use('/api/providerLines', router);
};
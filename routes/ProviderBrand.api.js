const router = require("express").Router();
const providerBrands = require("../controllers/ProviderBrand.controller.js");

module.exports = app => {
    // Create a new Person
    router.post("/", providerBrands.create);
    // Retrieve all people
    router.get("/", providerBrands.findAllActive);
    // Retrieve people by common fields
    router.get("/suggest/:fieldVal", providerBrands.suggest);
    // Retrieve all published people
    router.get("/deleted", providerBrands.findAll);
    // Retrieve a single Person with id
    router.get("/:id", providerBrands.findOne);
    // Update a Person with id
    router.put("/:id", providerBrands.update);
    // Delete a Person with id
    router.delete("/:id", providerBrands.delete);
    // Delete all people
    router.delete("/", providerBrands.deleteAll);
    
    app.use('/api/providerBrands', router);
};
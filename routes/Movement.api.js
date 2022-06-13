const router = require("express").Router();
const products = require("../controllers/Movement.controller.js");

module.exports = app => {
    // Create a new Product
    router.post("/", products.create);
    // Retrieve all products
    router.get("/", products.findAllActive);
    // Retrieve all published products
    router.get("/deleted", products.findAll);
    // Retrieve a single Product with id
    router.get("/:id", products.findOne);
    // Update a Product with id
    router.put("/:id", products.update);
    // Delete a Product with id
    router.delete("/:id", products.delete);
    // Delete all products
    router.delete("/", products.deleteAll);
    
    app.use('/api/movements', router);
};
const router = require("express").Router();
const purchases = require("../controllers/Purchase.controller.js");

module.exports = app => {
    // Create a new order
    router.post("/", purchases.create);
    // Retrieve all purchases
    router.get("/", purchases.findAllActive);
    // Retrieve all published purchases
    router.get("/deleted", purchases.findAll);
    // Retrieve a single order with id
    router.get("/:id", purchases.findOne);
    // Update a order with id
    router.put("/:id", purchases.update);
    // Delete a order with id
    router.delete("/:id", purchases.delete);
    // Delete all purchases
    router.delete("/", purchases.deleteAll);
    
    app.use('/api/purchases', router);
};
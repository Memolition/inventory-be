const router = require("express").Router();
const userRoles = require("../controllers/UserRole.controller.js");

module.exports = app => {
    // Create a new order
    router.post("/", userRoles.create);
    // Retrieve all orders
    router.get("/", userRoles.findAllActive);
    // Retrieve all published orders
    router.get("/deleted", userRoles.findAll);
    // Retrieve a single order with id
    router.get("/:id", userRoles.findOne);
    // Update a order with id
    router.put("/:id", userRoles.update);
    // Delete a order with id
    router.delete("/:id", userRoles.delete);
    // Delete all orders
    router.delete("/", userRoles.deleteAll);
    
    app.use('/api/roles', router);
};
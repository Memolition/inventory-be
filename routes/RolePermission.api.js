const router = require("express").Router();
const rolePermissions = require("../controllers/RolePermissions.controller.js");

module.exports = app => {
    // Create a new order
    router.post("/", rolePermissions.create);
    // Retrieve all orders
    router.get("/", rolePermissions.findAllActive);
    // Retrieve all published orders
    router.get("/deleted", rolePermissions.findAll);
    // Retrieve a single order with id
    router.get("/:id", rolePermissions.findOne);
    // Update a order with id
    router.put("/:id", rolePermissions.update);
    // Delete a order with id
    router.delete("/:id", rolePermissions.delete);
    // Delete all orders
    router.delete("/", rolePermissions.deleteAll);
    
    app.use('/api/permissions', router);
};
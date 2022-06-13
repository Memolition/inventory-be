const router = require("express").Router();
const users = require("../controllers/User.controller.js");

module.exports = app => {
    // Create a new order
    router.post("/", users.create);
    // Retrieve all orders
    router.get("/", users.findAllActive);
    // Retrieve all published orders
    router.get("/deleted", users.findAll);
    // Login user
    router.post("/login", users.login);
    // Retrieve a single order with id
    router.get("/:id", users.findOne);
    // Update a order with id
    router.put("/:id", users.update);
    // Delete a order with id
    router.delete("/:id", users.delete);
    // Delete all orders
    router.delete("/", users.deleteAll);
    
    app.use('/api/users', router);
};
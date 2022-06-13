const router = require("express").Router();
const orders = require("../controllers/Order.controller.js");

module.exports = app => {
    // Create a new order
    router.post("/", orders.create);
    // Retrieve all orders
    router.get("/", orders.findAllActive);
    // Retrieve all orders
    router.get("/invoice/:invoice", orders.findByInvoice);
    // Retrieve all orders
    router.get("/series/:series", orders.findBySeries);
    // Retrieve all published orders
    router.get("/deleted", orders.findAll);
    // Retrieve a single order with id
    router.get("/:id", orders.findOne);
    // Update a order with id
    router.put("/:id", orders.update);
    // Delete a order with id
    router.delete("/:id", orders.delete);
    // Delete all orders
    router.delete("/", orders.deleteAll);
    
    app.use('/api/orders', router);
};
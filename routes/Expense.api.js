const router = require("express").Router();
const expenses = require("../controllers/Expense.controller.js");

module.exports = app => {
    // Create a new Product
    router.post("/", expenses.create);
    // Retrieve all products
    router.get("/", expenses.findAllActive);
    // Retrieve all published products
    router.get("/deleted", expenses.findAll);
    // Retrieve a single Product with id
    router.get("/:id", expenses.findOne);
    // Update a Product with id
    router.put("/:id", expenses.update);
    // Delete a Product with id
    router.delete("/:id", expenses.delete);
    // Delete all products
    router.delete("/", expenses.deleteAll);
    
    app.use('/api/expenses', router);
};
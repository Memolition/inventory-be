const router = require("express").Router();
const importProducts = require("../controllers/ImportProduct.controller.js");

module.exports = app => {
    // Create a new Product
    router.get("/", importProducts.list);
    router.post("/", importProducts.import);
    router.delete("/", importProducts.delete);
    
    app.use('/api/imports', router);
};
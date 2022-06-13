module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("Product", {
        name: {
            type: Sequelize.STRING
        },
        barcode: {
            type: Sequelize.STRING
        },
        partNumber: {
            type: Sequelize.STRING
        },
        buyingPrice: {
            type: Sequelize.DECIMAL(10,2)
        },
        sellingPrice: {
            type: Sequelize.DECIMAL(10,2)
        },
        minimumQuantity: {
            type: Sequelize.INTEGER
        },
        stock: {
            type: Sequelize.INTEGER
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return Product;
};
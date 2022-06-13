module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("Inventory", {
        stock: {
            type: Sequelize.INTEGER,
            defaultValue: false,
        },
    });
    return Product;
};
module.exports = (sequelize, Sequelize) => {
    const ProductStock = sequelize.define("ProductStock", {
        stock: {
            type: Sequelize.INTEGER
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return ProductStock;
};
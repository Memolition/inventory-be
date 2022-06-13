module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("Movement", {
        quantity: {
            type: Sequelize.STRING
        },
        note: {
            type: Sequelize.STRING
        },
        load: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        price: {
            type: Sequelize.DECIMAL(10,2),
            defaultValue: 0.00,
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
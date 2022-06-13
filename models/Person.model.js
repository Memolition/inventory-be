module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("Person", {
        name: {
            type: Sequelize.STRING
        },
        tax_id: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return Product;
};
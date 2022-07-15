module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("ImportProduct", {
        name: {
            type: Sequelize.STRING
        },
        barcode: {
            type: Sequelize.STRING
        },
        partNumber: {
            type: Sequelize.STRING
        },
        providerName: {
            type: Sequelize.STRING
        },
        providerPhone: {
            type: Sequelize.STRING
        },
        providerAccount: {
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
        importedAt: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return Product;
};
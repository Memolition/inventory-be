module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("Order", {
        invoice: {
            type: Sequelize.STRING,
        },
        series: {
            type: Sequelize.STRING,
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return Order;
};
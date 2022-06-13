module.exports = (sequelize, Sequelize) => {
    const Invoice = sequelize.define("Invoice", {
        series: {
            type: Sequelize.INTEGER
        },
        number: {
            type: Sequelize.INTEGER
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return Invoice;
};
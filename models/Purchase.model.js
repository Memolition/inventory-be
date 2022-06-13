module.exports = (sequelize, Sequelize) => {
    const Purchase = sequelize.define("Purchase", {
        authorized: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return Purchase;
};
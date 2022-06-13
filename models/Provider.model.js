module.exports = (sequelize, Sequelize) => {
    const Provider = sequelize.define("Provider", {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        account: {
            type: Sequelize.STRING
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return Provider;
};